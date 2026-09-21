import json
import re
import sys
from pathlib import Path

import eng_to_ipa as ipa

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[1]
VOCAB_PATH = ROOT / "src" / "data" / "vocabulary.en.ts"

OVERRIDES = {
    "Aftercare": "[ˈæftərˌkɛr]",
    "Bigamy": "[ˈbɪgəmi]",
    "Coup": "[kuː]",
    "Disorderliness": "[dɪsˈɔrdərlɪnəs]",
    "Incorrigibility": "[ɪnˌkɔrɪʤəˈbɪləti]",
    "law-abiding": "[ˈlɔəˌbaɪdɪŋ]",
}


def to_transcription(term: str) -> str:
    for key, value in OVERRIDES.items():
        if term.lower() == key.lower():
            return value

    cleaned = re.sub(r"[’']", "'", term.strip())
    result = ipa.convert(cleaned)
    result = result.replace("*", "").strip()
    if not result:
        return ""
    return f"[{result}]"


def main() -> None:
    text = VOCAB_PATH.read_text(encoding="utf-8")
    marker = "TopicGroup[] = "
    start = text.index(marker) + len(marker)
    end = text.rindex("];") + 1
    groups = json.loads(text[start:end])

    missing = 0
    for group in groups:
        for word in group["words"]:
            transcriptions: list[str] = []
            for term in word["terms"]:
                value = to_transcription(term)
                if not value:
                    missing += 1
                    value = ""
                transcriptions.append(value)
            word["transcriptions"] = transcriptions

    payload = json.dumps(groups, ensure_ascii=False, indent=2)
    VOCAB_PATH.write_text(
        "import type { TopicGroup } from '../types/vocabulary';\n\n"
        f"export const VOCABULARY_EN: TopicGroup[] = {payload};\n",
        encoding="utf-8",
    )

    sample = groups[0]["words"][:5]
    print("words", sum(len(g["words"]) for g in groups))
    print("missing", missing)
    print(json.dumps(sample, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
