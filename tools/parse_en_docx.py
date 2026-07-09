"""Parse English–Russian list docx (word [ipa] — translation)."""
from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
DASH_SEP = " — "
DOCX_DEFAULT = Path(__file__).resolve().parent.parent / "exam.docx"
OUT_JSON = Path(__file__).resolve().parent / "en-vocabulary.json"
OUT_TS = Path(__file__).resolve().parent.parent / "src" / "data" / "vocabulary.ts"


def extract_lines(docx_path: Path) -> list[str]:
    with zipfile.ZipFile(docx_path) as zf:
        root = ET.fromstring(zf.read("word/document.xml"))
    body = root.find(f"{W}body")
    if body is None:
        return []

    lines: list[str] = []
    for child in body:
        if child.tag.split("}")[-1] != "p":
            continue
        parts: list[str] = []
        for node in child.iter(f"{W}t"):
            if node.text:
                parts.append(node.text)
            if node.tail:
                parts.append(node.tail)
        line = "".join(parts).strip()
        if line:
            lines.append(line)
    return lines


def strip_phonetics(value: str) -> str:
    return re.sub(r"\s*\[[^\]]*\]", "", value).strip()


def split_en_variants(value: str) -> list[str]:
    return [part.strip() for part in value.split("/") if part.strip()]


def parse_line(line: str) -> dict | None:
    if DASH_SEP not in line:
        return None

    left, right = line.split(DASH_SEP, 1)
    en_variants = split_en_variants(strip_phonetics(left))
    ru = right.strip()

    if not en_variants or not ru:
        return None

    return {"en": en_variants, "ru": ru}


def build_vocabulary_ts(words: list[dict], title: str, topic_id: str) -> str:
    payload = [
        {
            "id": topic_id,
            "title": title,
            "words": [
                {
                    "id": f"{topic_id}-{index}",
                    "ru": word["ru"],
                    "en": word["en"],
                    "topic": topic_id,
                }
                for index, word in enumerate(words, start=1)
            ],
        }
    ]

    body = json.dumps(payload, ensure_ascii=False, indent=2)
    return (
        "import type { TopicGroup } from '../types/vocabulary';\n\n"
        f"export const VOCABULARY: TopicGroup[] = {body};\n\n"
        "export const TOTAL_WORDS = VOCABULARY.reduce(\n"
        "  (sum, group) => sum + group.words.length,\n"
        "  0,\n"
        ");\n"
    )


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--docx", type=Path, default=DOCX_DEFAULT)
    parser.add_argument("--title", default="Computer English")
    parser.add_argument("--topic-id", default="computer")
    parser.add_argument("--out-json", type=Path, default=OUT_JSON)
    parser.add_argument("--out-ts", type=Path, default=OUT_TS)
    args = parser.parse_args()

    words: list[dict] = []
    for line in extract_lines(args.docx):
        parsed = parse_line(line)
        if parsed:
            words.append(parsed)

    if not words:
        raise ValueError("No word pairs found in document")

    args.out_json.write_text(
        json.dumps({"total": len(words), "words": words}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    args.out_ts.write_text(
        build_vocabulary_ts(words, args.title, args.topic_id),
        encoding="utf-8",
    )

    print(f"Parsed {len(words)} words")
    print(f"Wrote {args.out_json}")
    print(f"Wrote {args.out_ts}")


if __name__ == "__main__":
    main()
