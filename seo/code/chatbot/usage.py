"""Record token usage of every AI call, one JSON line per call, in a daily file.

    chatbot/usage/2026-10-13.jsonl   (UTC date)

After each AI call, cost-alert/cost-alert.js is started in the background: it adds up the day's spend
and emails an alert once if it passes the limit. spent_today() gives app.py the same total (same
prices.json), so the chatbot stops answering at the moment the alert goes out.
Only token counts are stored, never visitor text. Recording can never break a chat.
"""
import json
import os
import subprocess
import time
from pathlib import Path

USAGE_DIR = Path(os.environ.get("USAGE_DIR") or Path(__file__).resolve().parent / "usage")


COST_ALERT = Path(__file__).resolve().parent / "cost-alert" / "cost-alert.js"
PRICES_FILE = COST_ALERT.parent / "prices.json"   # USD per 1M tokens, shared with cost-alert.js
_check = None   # the running `node cost-alert.js`, if any
_limit_mail = None   # the running `node cost-alert.js --message-limit`, if any
_prices = None
_spend = {"key": None, "usd": 0.0}               # today's running total, keyed by (day, USAGE_DIR)


def _day():
    return time.strftime("%Y-%m-%d", time.gmtime())


def cost_of(rec):
    """USD for one usage line, priced exactly like costOf() in cost-alert.js."""
    global _prices
    if _prices is None:
        _prices = json.loads(PRICES_FILE.read_text(encoding="utf-8"))
    p = _prices.get(rec.get("model")) or _prices["_default"]
    cached = min(rec.get("cached") or 0, rec.get("input") or 0)
    fresh = (rec.get("input") or 0) - cached
    return (fresh * p["input"] + cached * p["cached"] + (rec.get("output") or 0) * p["output"]) / 1e6


def spent_today():
    """Estimated AI spend so far today (UTC). Read from today's file once, then kept up to date by
    record(), so a restart doesn't reset it. Returns 0 if anything goes wrong."""
    key = (_day(), str(USAGE_DIR))
    if _spend["key"] != key:
        total = 0.0
        try:
            for line in (USAGE_DIR / f"{key[0]}.jsonl").read_text(encoding="utf-8").splitlines():
                try:
                    total += cost_of(json.loads(line))
                except (ValueError, TypeError, KeyError):
                    continue
        except FileNotFoundError:
            pass
        except Exception:
            return 0.0
        _spend.update(key=key, usd=total)
    return _spend["usd"]


def messages_today():
    """Visitor messages that reached the AI today (UTC): one "classify" line each in today's file. Lets
    app.py's daily message counter survive a restart. Returns 0 if anything goes wrong."""
    try:
        lines = (USAGE_DIR / f"{_day()}.jsonl").read_text(encoding="utf-8").splitlines()
        return sum(1 for line in lines if '"step": "classify"' in line)
    except Exception:
        return 0


def record(provider, model, step, input_tokens=0, cached_tokens=0, output_tokens=0):
    try:
        USAGE_DIR.mkdir(parents=True, exist_ok=True)
        line = {"ts": int(time.time()), "provider": provider, "model": model, "step": step,
                "input": int(input_tokens or 0), "cached": int(cached_tokens or 0), "output": int(output_tokens or 0)}
        day = _day()
        spent_today()                                  # load today's total before this line is added
        with open(USAGE_DIR / f"{day}.jsonl", "a", encoding="utf-8") as f:
            f.write(json.dumps(line) + "\n")
        _spend["usd"] += cost_of(line)
        _start_cost_check(day)
    except Exception:
        pass


def _start_cost_check(day):
    """Run the JS cost check in the background after each AI call. It adds up today's spend and emails
    once if it is over the limit. Nothing runs between requests; nothing waits for it. Skipped when a
    check is already running or today's alert has already been sent."""
    global _check
    if os.environ.get("COST_ALERT", "on").lower() == "off" or not COST_ALERT.exists():
        return
    if (USAGE_DIR / f".cost-alert-sent-{day}").exists():
        return
    if _check is not None and _check.poll() is None:
        return
    env = {**os.environ, "USAGE_DIR": str(USAGE_DIR)}
    _check = subprocess.Popen([os.environ.get("NODE_BIN", "node"), str(COST_ALERT)], cwd=str(COST_ALERT.parent),
                              env=env, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def start_message_limit_alert(limit):
    """The daily message limit just stopped the bot: email once today (cost-alert.js --message-limit).
    Skipped when today's email has gone or one is being sent. Can never break a chat."""
    global _limit_mail
    try:
        if os.environ.get("COST_ALERT", "on").lower() == "off" or not COST_ALERT.exists():
            return
        if (USAGE_DIR / f".message-limit-sent-{_day()}").exists():
            return
        if _limit_mail is not None and _limit_mail.poll() is None:
            return
        env = {**os.environ, "USAGE_DIR": str(USAGE_DIR)}
        _limit_mail = subprocess.Popen([os.environ.get("NODE_BIN", "node"), str(COST_ALERT), "--message-limit", str(limit)],
                                       cwd=str(COST_ALERT.parent), env=env, stdin=subprocess.DEVNULL,
                                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass


def from_gemini(model, step, meta):
    """Gemini usageMetadata: thinking tokens are billed as output."""
    meta = meta or {}
    record("gemini", model, step, meta.get("promptTokenCount"), meta.get("cachedContentTokenCount"),
           (meta.get("candidatesTokenCount") or 0) + (meta.get("thoughtsTokenCount") or 0))


def from_deepseek(model, step, usage):
    """DeepSeek usage: completion_tokens already include reasoning tokens."""
    usage = usage or {}
    record("deepseek", model, step, usage.get("prompt_tokens"), usage.get("prompt_cache_hit_tokens"),
           usage.get("completion_tokens"))
