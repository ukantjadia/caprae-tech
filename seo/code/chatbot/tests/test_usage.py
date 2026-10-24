"""usage.py: recording token counts and starting the JS cost check in the background."""
import json
import time

import pytest

import usage


class FakeProc:
    def __init__(self, running):
        self.running = running

    def poll(self):
        return None if self.running else 0


@pytest.fixture
def started(tmp_path, monkeypatch):
    calls = []
    monkeypatch.setattr(usage, "USAGE_DIR", tmp_path)
    monkeypatch.setattr(usage, "_check", None)
    monkeypatch.setenv("COST_ALERT", "on")
    monkeypatch.setattr(usage.subprocess, "Popen", lambda args, **kw: calls.append((args, kw)) or FakeProc(True))
    return calls


def today():
    return time.strftime("%Y-%m-%d", time.gmtime())


def test_record_writes_line_and_starts_check(started, tmp_path):
    usage.record("gemini", "gemini-3.5-flash-lite", "answer", 6492, 0, 153)
    rec = json.loads((tmp_path / f"{today()}.jsonl").read_text().splitlines()[0])
    assert (rec["input"], rec["output"]) == (6492, 153)
    assert len(started) == 1
    args, kw = started[0]
    assert args[1].endswith("cost-alert.js") and kw["env"]["USAGE_DIR"] == str(tmp_path)
    assert kw["stdout"] is usage.subprocess.DEVNULL          # runs in the background, nobody waits on it


def test_no_second_check_while_one_is_running(started):
    usage.record("gemini", "m", "classify", 365, 0, 14)
    usage.record("gemini", "m", "answer", 6492, 0, 153)       # first check still running
    assert len(started) == 1
    usage._check = FakeProc(False)                            # finished
    usage.record("gemini", "m", "classify", 365, 0, 14)
    assert len(started) == 2


def test_no_check_after_todays_email(started, tmp_path):
    (tmp_path / f".cost-alert-sent-{today()}").write_text("sent")
    usage.record("gemini", "m", "answer", 6492, 0, 153)
    assert started == []


def test_can_be_switched_off(started, monkeypatch):
    monkeypatch.setenv("COST_ALERT", "off")
    usage.record("gemini", "m", "answer", 6492, 0, 153)
    assert started == []


def test_node_missing_never_breaks_a_chat(tmp_path, monkeypatch):
    monkeypatch.setattr(usage, "USAGE_DIR", tmp_path)
    monkeypatch.setattr(usage, "_check", None)
    monkeypatch.setenv("COST_ALERT", "on")
    monkeypatch.setenv("NODE_BIN", "definitely-not-node-xyz")
    usage.record("gemini", "m", "answer", 1, 0, 1)            # must not raise
    assert (tmp_path / f"{today()}.jsonl").exists()


def test_spent_today_matches_prices_and_survives_restart(started, tmp_path, monkeypatch):
    monkeypatch.setattr(usage, "_spend", {"key": None, "usd": 0.0})
    usage.record("gemini", "gemini-3.5-flash-lite", "answer", 1_000_000, 0, 1_000_000)   # $0.30 + $2.50
    assert abs(usage.spent_today() - 2.80) < 1e-9
    monkeypatch.setattr(usage, "_spend", {"key": None, "usd": 0.0})                     # a restart
    assert abs(usage.spent_today() - 2.80) < 1e-9                                       # re-read from today's file
    usage.record("gemini", "gemini-3.5-flash-lite", "classify", 1_000_000, 1_000_000, 0)  # all cached: $0.03
    assert abs(usage.spent_today() - 2.83) < 1e-9


def test_message_limit_alert_once(started, tmp_path):
    usage._limit_mail = None
    usage.start_message_limit_alert(2000)
    usage.start_message_limit_alert(2000)                     # first one still sending
    assert len(started) == 1 and started[0][0][2:] == ["--message-limit", "2000"]
    usage._limit_mail = FakeProc(False)
    (tmp_path / f".message-limit-sent-{today()}").write_text("sent")
    usage.start_message_limit_alert(2000)                     # today's email has gone
    assert len(started) == 1


def test_messages_today_counts_classify_lines(started):
    usage.record("gemini", "m", "classify", 1, 0, 1)
    usage.record("gemini", "m", "answer", 1, 0, 1)
    usage.record("deepseek", "m", "classify", 1, 0, 1)
    assert usage.messages_today() == 2
