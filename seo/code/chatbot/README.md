# Site assistant (Gemini)

The chat icon on every page of capraetech.io. It answers questions **only** from `knowledge.md`.
A copy of the Caprae Capital site assistant (capraecapital-site/chatbot): same code, same safety layers,
same limits, same $1-a-day cost alert. Only the brand, the knowledge, the page list and the widget's look differ.

## How it works

```
chat icon (src/chat.js, loaded after the page) → nginx /api/chat → app.py (127.0.0.1:8096) → Gemini API
                                                                                    (DeepSeek if Gemini fails)
```

| File | What it does |
|---|---|
| `knowledge.md` | Everything the bot knows: the site's content, condensed. Edit it when the site changes. |
| `app.py` | The API: limits, checks, the two AI calls, and output checks. |
| `guard.py` | Fixed rules that don't use AI: injection patterns, link and email allow-lists, the number check, canned replies. |
| `prompts.py` | The classifier and answer instructions. |
| `gemini_client.py` | Calls the Gemini REST API. No tools, so it can't use the web; safety filters are on. |
| `llm.py` | Gemini first, DeepSeek as the backup. If Gemini fails, the same request goes to DeepSeek, and Gemini is skipped for 5 minutes. Safety blocks are never retried. |
| `pages.py` | The only pages and links the bot may show (the site's 39 pages). |
| `usage.py` | Writes every AI call's token counts to `usage/YYYY-MM-DD.jsonl` (no visitor text). |
| `cost-alert/` | Node.js script: emails once a day when AI spend passes $1. It never stops the bot. |
| `../src/chat.js`, `../src/chat.css` | The widget: a round chat icon bottom right; plain-text replies; "Know more"; one "Open … page" link; the chat is kept across pages; full screen on phones. |

**Security layers, in order** (any one can stop a message):
1. Only our domains can call the API (Origin check: `ALLOWED_ORIGINS`).
2. Limits: 600 characters a message; 8 a minute and 60 a day per IP; 12 messages per chat; 2,000 a day site-wide.
3. Optional Cloudflare Turnstile on the first message (off, as on Caprae Capital).
4. Pattern filter: injection, "write code", role-play and abuse are refused before any AI call.
5. An AI classifier: only on-topic questions and greetings pass; off-topic, advice, injection and abuse get fixed replies.
6. The answer call: site content only, strict rules, safety filters on, a fixed JSON reply.
7. Output checks: out-of-scope answers replaced; a leaked instruction marker or code gets a refusal; any price or
   percentage not in `knowledge.md` gets the "can't confirm" reply; unknown links, emails and every phone number
   removed (the site publishes none); sources must be our own pages.
8. The widget shows replies as plain text. Only our own links become clickable.

If both Gemini and DeepSeek are down, visitors get "temporarily unavailable", never an unchecked answer.

## Costs and the $1 alert

Same as Caprae Capital (see their CHATBOT_COSTS.md): about $0.0025 per answered message on Gemini 3.5 Flash-Lite,
so **$1 a day is about 400 messages**; the 2,000-a-day limit caps the worst case at about $5 a day.
After each AI call the bot starts `cost-alert/cost-alert.js` in the background; once the day's spend (UTC) passes
`DAILY_COST_LIMIT_USD` it emails `ALERT_TO` once that day. It never switches the bot off.
`ALERT_CC` (comma-separated) copies others on it. `node cost-alert/cost-alert.js --dry-run` prints the email instead of sending it.

## Run locally

```bash
cd seo/code && bun run build                     # the widget is part of the site build
cd chatbot
uv run --with fastapi --with uvicorn --with httpx --with pytest python -m pytest -q tests   # no API key needed
uv run --with fastapi --with uvicorn --with httpx python tests/dev_server.py              # fake AI → http://localhost:8091/
uv run --with fastapi --with uvicorn --with httpx python tests/dev_server.py --real       # real Gemini (key from .env)
python redteam.py http://127.0.0.1:8091 http://localhost:8091                            # every line should say PASS
```
(For the red-team run, start the server with `PER_IP_PER_MINUTE=500 PER_IP_PER_DAY=5000 MAX_TURNS_PER_CHAT=500`.)

## Deploy (the capraetech.io server)

```bash
cd /home/ubuntu/caprae-tech && git pull                          # adjust to where the repo lives
cd seo/code/chatbot && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
nano .env                       # copy from .env.example: GEMINI_API_KEY, DEEPSEEK_API_KEY, SMTP_PASS (contact form's
                                # partners@ Gmail app password); ALLOWED_ORIGINS=https://capraetech.io,https://www.capraetech.io
cd cost-alert && bun install --production && cd ..
sudo cp ../deploy/caprae-tech-chatbot.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now caprae-tech-chatbot
# nginx: add the two parts of ../deploy/nginx-chatbot.conf, then
sudo nginx -t && sudo systemctl reload nginx
curl https://capraetech.io/api/chat/health      # {"ok":true,...,"key_set":true,"fallback_set":true}
```

**After deploying:**
- Logs: `chatbot.log` (hashed IPs; emails and phone numbers masked). Review flagged chats weekly.
- **Keep `knowledge.md` in sync with the site**: when page content changes, update it, then
  `sudo systemctl restart caprae-tech-chatbot`.
- `.env` holds the keys. It is in `.gitignore`; never commit it (the repo is public).
