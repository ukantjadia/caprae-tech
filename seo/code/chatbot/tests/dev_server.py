"""Local preview: the built Caprae Tech site (seo/code/dist) + the real API on one port.

    cd chatbot && python tests/dev_server.py          ->  http://localhost:8091/  (fake Gemini, no key needed)
    cd chatbot && python tests/dev_server.py --real   ->  http://localhost:8091/  (real Gemini, key from .env)

Never deploy this file.
"""
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:8091")

import uvicorn  # noqa: E402
from fastapi.staticfiles import StaticFiles  # noqa: E402

import app as chatapp  # noqa: E402

ANSWERS = {
    "build": ("We build five things, start to finish:\n- MVPs\n- Business dashboards\n- Deal & financial tools\n"
              "- AI assistants and automation\n- Internal tools and team portals\nDetails: https://capraetech.io/what-we-build/",
              ["https://capraetech.io/what-we-build/"]),
    "pricing": ("We price in hours. After the call we list the features, estimate the hours for each, and show your "
                "domain's hourly rate upfront. You choose what's in.", ["https://capraetech.io/pricing/"]),
}


class FakeGemini:
    async def classify(self, system, message, previous=""):
        m = message.lower()
        if any(w in m for w in ("weather", "recipe", "bitcoin")):
            return "OFF_TOPIC"
        if "should i buy" in m or "invest" in m:
            return "ADVICE"
        if m.strip(" !.") in ("hi", "hello", "hey", "thanks"):
            return "GREETING"
        return "ON_TOPIC"

    async def answer(self, system, history, message):
        m = message.lower()
        for key, (text, src) in ANSWERS.items():
            if key in m or (key == "pricing" and ("price" in m or "much" in m or "cost" in m)):
                return {"in_scope": True, "answer": text, "source_urls": src}
        if "invented" in m:  # demo: an answer with a made-up price gets replaced
            return {"in_scope": True, "answer": "It costs $777 a month.", "source_urls": []}
        return {"in_scope": True, "answer": "Hi! I can answer questions about Caprae Tech: what we build, who we build "
                                            "for, pricing, process and team. You can also book a call at https://capraetech.io/book-a-call/.",
                "source_urls": ["https://capraetech.io/book-a-call/"]}

    async def close(self):
        pass


if "--real" not in sys.argv:
    os.environ["GEMINI_API_KEY"] = "fake"
    chatapp.gemini = FakeGemini()
chatapp.app.mount("/", StaticFiles(directory=HERE.parent.parent / "dist", html=True), name="site")   # seo/code/dist: run `bun run build` first

if __name__ == "__main__":
    uvicorn.run(chatapp.app, host="127.0.0.1", port=8091)
