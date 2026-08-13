import base64, json, os, sys, urllib.request

KEY = os.environ["GEMINI_API_KEY"]
MODEL = os.environ.get("GEMINI_TEXT_MODEL", "gemini-3.1-pro-preview")
url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}"

PROMPT = (
    "Transcribe this Thai voice message verbatim. Output only the transcript, in Thai, "
    "with no summary, no translation and no commentary. Keep filler words and false "
    "starts. If a passage is unclear, mark it [ไม่ชัด] rather than guessing. If English "
    "or brand names are spoken, write them in Latin script."
)

for path in sys.argv[1:]:
    data = base64.b64encode(open(path, "rb").read()).decode()
    body = json.dumps({
        "contents": [{"parts": [
            {"text": PROMPT},
            {"inlineData": {"mimeType": "audio/ogg", "data": data}},
        ]}],
        "generationConfig": {"temperature": 0},
    }).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            d = json.load(r)
        text = "".join(
            p.get("text", "") for p in d["candidates"][0]["content"]["parts"]
        ).strip()
    except Exception as e:
        text = f"[ถอดไม่สำเร็จ] {type(e).__name__}: {str(e)[:200]}"
    print("=" * 100)
    print(os.path.basename(path))
    print("=" * 100)
    print(text)
    print()
