"""Caprae Tech website assistant: POST /api/chat. (Same design as the Caprae Capital site assistant.)

Request flow (every step can stop the request with a safe, fixed reply):
  origin + rate limits -> clean input -> pattern filter -> daily message and cost limits
  -> Gemini classifier -> Gemini answer (site content only, JSON) -> output checks -> reply
Every reply is also written as one row of chat-logs/chats.csv (chatlog.py).

Run:  uvicorn app:app --host 127.0.0.1 --port 8096 --workers 1 --proxy-headers --forwarded-allow-ips=127.0.0.1
(one worker: sessions and rate limits are kept in memory)
"""
import asyncio
import contextvars
import hashlib
import json
import logging
import os
import re
import secrets
import time
import uuid
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from logging.handlers import RotatingFileHandler
from pathlib import Path

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import chatlog
import guard
import prompts
import llm
import usage
from gemini_client import GeminiBlocked, GeminiError

HERE = Path(__file__).resolve().parent


def _load_env(path):
    """Read KEY=VALUE lines from .env without overriding real environment variables."""
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


_load_env(HERE / ".env")


def _int(name, default):
    try:
        return int(os.environ.get(name, default))
    except ValueError:
        return default


def _float(name, default):
    try:
        return float(os.environ.get(name, default))
    except ValueError:
        return default


API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite")
GUARD_MODEL = os.environ.get("GEMINI_GUARD_MODEL", MODEL)
DEEPSEEK_KEY = os.environ.get("DEEPSEEK_API_KEY", "")          # backup provider if Gemini fails
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-flash")
ALLOWED_ORIGINS = [o.strip() for o in os.environ.get(
    "ALLOWED_ORIGINS", "https://capraetech.io,https://www.capraetech.io").split(",") if o.strip()]
TURNSTILE_SECRET = os.environ.get("TURNSTILE_SECRET", "")
MAX_CHARS = _int("MAX_MESSAGE_CHARS", 600)
MAX_TURNS = _int("MAX_TURNS_PER_CHAT", 12)
PER_MINUTE = _int("PER_IP_PER_MINUTE", 8)
PER_DAY = _int("PER_IP_PER_DAY", 60)
DAILY_LIMIT = _int("DAILY_REQUEST_LIMIT", 2000)      # whole site; protects the API bill
COST_LIMIT = _float("DAILY_COST_LIMIT_USD", 1)        # whole site, UTC day; past it the bot stops answering
HISTORY_TURNS = 4                                    # exchanges sent back to Gemini as context
SESSION_TTL = 30 * 60
MAX_ANSWER_CHARS = 1200

KNOWLEDGE = (HERE / "knowledge.md").read_text(encoding="utf-8")
CANARY = "CT-" + secrets.token_hex(6)                # if this ever appears in a reply, the rules leaked
SYSTEM_ANSWER = prompts.ANSWER.replace("{canary}", CANARY).replace("{knowledge}", KNOWLEDGE)
IP_SALT = secrets.token_hex(16)                      # rotates on restart; logs never store raw IPs

log = logging.getLogger("chatbot")
log.setLevel(logging.INFO)
_handler = RotatingFileHandler(os.environ.get("LOG_FILE", HERE / "chatbot.log"), maxBytes=5_000_000, backupCount=5,
                               encoding="utf-8")
_handler.setFormatter(logging.Formatter("%(asctime)s %(message)s"))
log.addHandler(_handler)

@asynccontextmanager
async def _lifespan(_app):
    yield
    await gemini.close()


app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None, lifespan=_lifespan)
app.add_middleware(CORSMiddleware, allow_origins=ALLOWED_ORIGINS, allow_methods=["POST"],
                   allow_headers=["Content-Type"], max_age=600)
gemini = llm.make(API_KEY, MODEL, GUARD_MODEL, DEEPSEEK_KEY, DEEPSEEK_MODEL)   # Gemini, then DeepSeek

# ------------------------------------------------------------------ in-memory state
sessions = {}                                         # id -> {"history": [(role, text)], "turns": int, "seen": t}
ip_minute = defaultdict(deque)
ip_day = defaultdict(deque)
daily = {"day": None, "count": 0}                    # filled from today's usage file on first use (UTC)
_turn = contextvars.ContextVar("turn", default=None)   # this request's message and reason, for the CSV row


def _client_ip(request):
    return request.client.host if request.client else "unknown"


def _ip_hash(ip):
    return hashlib.sha256((IP_SALT + ip).encode()).hexdigest()[:12]


def _rate_ok(ip, now):
    for q, window, limit in ((ip_minute[ip], 60, PER_MINUTE), (ip_day[ip], 86400, PER_DAY)):
        while q and now - q[0] > window:
            q.popleft()
        if len(q) >= limit:
            return False
    ip_minute[ip].append(now)
    ip_day[ip].append(now)
    return True


def _daily_ok():
    today = time.strftime("%Y-%m-%d", time.gmtime())
    if daily["day"] != today:
        daily.update(day=today, count=usage.messages_today())   # a restart doesn't reset the count
    if daily["count"] >= DAILY_LIMIT:
        return False
    daily["count"] += 1
    return True


def _session(sid, now):
    for k in [k for k, s in sessions.items() if now - s["seen"] > SESSION_TTL]:
        del sessions[k]
    if not isinstance(sid, str) or sid not in sessions:
        sid = uuid.uuid4().hex
        sessions[sid] = {"history": [], "turns": 0, "seen": now}
    sessions[sid]["seen"] = now
    return sid, sessions[sid]


async def _turnstile_ok(token, ip):
    if not TURNSTILE_SECRET:
        return True
    if not isinstance(token, str) or not token:
        return False
    try:
        async with httpx.AsyncClient(timeout=8) as c:
            r = await c.post("https://challenges.cloudflare.com/turnstile/v0/siteverify",
                             data={"secret": TURNSTILE_SECRET, "response": token, "remoteip": ip})
        return bool(r.json().get("success"))
    except Exception:
        return False


def _reply(sid, kind, text, sources=None, status=200):
    return JSONResponse({"session_id": sid, "kind": kind, "reply": text, "sources": sources or []}, status_code=status)


def _log(ip, sid, kind, detail, message=""):
    turn = _turn.get()
    if turn is not None:
        turn["reason"] = detail
    log.info("ip=%s sid=%s kind=%s detail=%s msg=%r", _ip_hash(ip), (sid or "-")[:8], kind, detail,
             guard.mask_pii(message)[:300])


@app.get("/api/chat/health")
async def health():
    return {"ok": True, "model": MODEL, "key_set": bool(API_KEY), "fallback_set": bool(DEEPSEEK_KEY)}


def _page(request):
    """The page the visitor chatted from, as a path (from the Referer header)."""
    ref = request.headers.get("referer") or ""
    m = re.match(r"https?://[^/]+(/[^?#]*)", ref)
    return m.group(1)[:200] if m else ""


def _save_row(request, turn, resp):
    """One chats.csv row per reply the visitor saw. Requests rejected before a reply (wrong origin,
    bad JSON) have no reply and no row."""
    try:
        data = json.loads(resp.body)
    except Exception:
        return
    if "reply" not in data:
        return
    sess = sessions.get(data.get("session_id"))
    chatlog.record({
        "user_id": data.get("session_id", ""),
        "message_no": sess["turns"] if sess else "",
        "ip": turn["ip"],
        "page": _page(request),
        "visitor_message": turn["message"],
        "bot_reply": data["reply"],
        "outcome": data.get("kind", ""),
        "reason": "" if data.get("kind") == "answer" else turn["reason"],
        "open_page_link": (data.get("sources") or [{}])[0].get("url", ""),
    })


@app.post("/api/chat")
async def chat(request: Request):
    turn = {"ip": _client_ip(request), "message": "", "reason": ""}
    token = _turn.set(turn)
    try:
        resp = await _chat(request, turn)
    finally:
        _turn.reset(token)
    _save_row(request, turn, resp)
    return resp


async def _chat(request, turn):
    now = time.time()
    ip = turn["ip"]

    origin = request.headers.get("origin")
    if origin and origin not in ALLOWED_ORIGINS:
        return JSONResponse({"error": "forbidden"}, status_code=403)
    if int(request.headers.get("content-length") or 0) > 8000:
        return JSONResponse({"error": "too large"}, status_code=413)
    try:
        body = await request.json()
        assert isinstance(body, dict)
    except Exception:
        return JSONResponse({"error": "bad request"}, status_code=400)

    sid, sess = _session(body.get("session_id"), now)
    if isinstance(body.get("message"), str):
        turn["message"] = body["message"][:MAX_CHARS * 2]

    if not _rate_ok(ip, now):
        _log(ip, sid, "rate", "ip limit")
        return _reply(sid, "limit", guard.REPLY_RATE, status=429)
    if sess["turns"] == 0 and not await _turnstile_ok(body.get("turnstile_token"), ip):
        _log(ip, sid, "blocked", "turnstile")
        return _reply(sid, "blocked", "Please confirm you're human and try again.", status=403)

    message, err = guard.clean_message(body.get("message"), MAX_CHARS)
    if err == "empty":
        return _reply(sid, "error", "Please type a question.", status=400)
    if err == "too_long":
        return _reply(sid, "error", f"Please keep your question under {MAX_CHARS} characters.", status=400)
    turn["message"] = message

    if sess["turns"] >= MAX_TURNS:
        _log(ip, sid, "limit", "turns")
        return _reply(sid, "limit", guard.REPLY_LIMIT)
    sess["turns"] += 1

    # 1) Deterministic filter: obvious attempts never reach the AI.
    flagged = guard.prefilter(message)
    if flagged:
        _log(ip, sid, "refusal", f"pattern={flagged}", message)
        return _reply(sid, "refusal", guard.REPLY_ADVICE if flagged == "ADVICE" else guard.REPLY_INJECTION)

    if usage.spent_today() > COST_LIMIT:
        _log(ip, sid, "limit", f"daily cost over ${COST_LIMIT:g}")
        return _reply(sid, "limit", guard.REPLY_ERROR)
    if not _daily_ok():
        _log(ip, sid, "limit", "daily budget")
        usage.start_message_limit_alert(DAILY_LIMIT)    # one email a day: the bot has stopped
        return _reply(sid, "limit", guard.REPLY_ERROR)

    previous = next((t for r, t in reversed(sess["history"]) if r == "model"), "")
    # 2) AI classifier and 3) the answer run at the same time to save the classifier's wait. They are
    # still separate calls, so one prompt can't fool both, and the answer is discarded unless the
    # classifier passes the message.
    answering = asyncio.ensure_future(gemini.answer(SYSTEM_ANSWER, sess["history"][-HISTORY_TURNS * 2:], message))
    answering.add_done_callback(lambda t: t.cancelled() or t.exception())   # a discarded answer's error is not logged as unhandled
    try:
        try:
            category = await gemini.classify(prompts.CLASSIFIER, message, previous)
        except BaseException:
            answering.cancel()
            raise
        if category not in ("ON_TOPIC", "GREETING"):
            answering.cancel()
            text = {"ADVICE": guard.REPLY_ADVICE, "INJECTION": guard.REPLY_INJECTION,
                    "ABUSE": guard.REPLY_INJECTION}.get(category, guard.REPLY_OFF_TOPIC)
            _log(ip, sid, "refusal", f"class={category}", message)
            return _reply(sid, "refusal", text)
        out = await answering
    except GeminiBlocked as e:
        _log(ip, sid, "refusal", f"gemini-blocked={e}", message)
        return _reply(sid, "refusal", guard.REPLY_INJECTION)
    except GeminiError as e:
        _log(ip, sid, "error", f"gemini={e}", message)
        sess["turns"] -= 1
        return _reply(sid, "error", guard.REPLY_ERROR, status=503)

    # 4) Output checks: nothing leaves unless it passes all of them.
    answer = out.get("answer") if isinstance(out, dict) else None
    if not isinstance(answer, str) or not answer.strip():
        _log(ip, sid, "fallback", "empty answer", message)
        return _reply(sid, "refusal", guard.REPLY_UNSURE)
    if out.get("in_scope") is not True:
        _log(ip, sid, "refusal", "out of scope", message)
        return _reply(sid, "refusal", guard.REPLY_OFF_TOPIC)
    if CANARY in answer or "site_content" in answer or "visitor_message" in answer:
        _log(ip, sid, "refusal", "LEAK", message)
        return _reply(sid, "refusal", guard.REPLY_INJECTION)
    if guard.looks_like_code(answer):
        _log(ip, sid, "refusal", "code in answer", message)
        return _reply(sid, "refusal", guard.REPLY_INJECTION)
    bad = guard.unverified_numbers(answer, KNOWLEDGE)
    if bad:
        _log(ip, sid, "fallback", f"unverified numbers {bad}", message)
        return _reply(sid, "refusal", guard.REPLY_UNSURE)

    answer = guard.trim(guard.strip_all_links(guard.strip_unknown_links(answer)), MAX_ANSWER_CHARS)
    if not answer:                                      # the reply was nothing but a link
        answer = guard.BOOK
    sources = guard.clean_sources(out.get("source_urls"))[:1]   # one "Open page" link under the answer
    sess["history"] += [("user", message), ("model", answer)]
    _log(ip, sid, "answer", f"sources={len(sources)}", message)
    return _reply(sid, "answer", answer, sources)


