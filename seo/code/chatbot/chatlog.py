"""Every visitor message and the reply it got, one row each, in an easy-to-read CSV.

    chatbot/chat-logs/chats.csv   (dir 0700, file 0600; ignored by git)

Columns: time_utc, user_id, message_no, ip, page, visitor_message, bot_reply, outcome, reason,
open_page_link. user_id is the chat's session id: a visitor's later messages in the same chat are new
rows with the same user_id and the next message_no. chatbot.log stays as it is, next to this file.
Opens in Excel or Google Sheets (UTF-8 with BOM). Writing can never break a chat.
"""
import csv
import logging
import os
import re
import time
from pathlib import Path

CHAT_CSV = Path(os.environ.get("CHAT_CSV") or Path(__file__).resolve().parent / "chat-logs" / "chats.csv")
COLUMNS = ["time_utc", "user_id", "message_no", "ip", "page", "visitor_message", "bot_reply", "outcome",
           "reason", "open_page_link"]

log = logging.getLogger("chatbot")


def _cell(value):
    """Formula guard, same rule as the contact form CSV: prefix an apostrophe only when a spreadsheet
    could execute the cell."""
    s = "" if value is None else str(value)
    if re.match(r"[\t\r=]", s) or (re.match(r"[+\-@]", s) and re.search(r"[(|]", s)):
        s = "'" + s
    return s


def record(row):
    """Append one row (a dict keyed by COLUMNS). Fills in time_utc."""
    try:
        row = {**row, "time_utc": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())}
        CHAT_CSV.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        new = not CHAT_CSV.exists() or CHAT_CSV.stat().st_size == 0
        fd = os.open(CHAT_CSV, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o600)
        with open(fd, "a", encoding="utf-8-sig" if new else "utf-8", newline="") as f:
            w = csv.writer(f)
            if new:
                w.writerow(COLUMNS)
            w.writerow([_cell(row.get(c)) for c in COLUMNS])
    except Exception as e:
        log.info("chat csv write failed: %s", e)
