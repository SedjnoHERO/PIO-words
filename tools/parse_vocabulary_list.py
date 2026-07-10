"""Parse vocabulary lines: english [pronunciation] translation."""
from __future__ import annotations

import json
import re
from pathlib import Path

SOURCE_DEFAULT = Path(__file__).resolve().parent / "vocabulary_source.txt"
OUT_JSON = Path(__file__).resolve().parent / "en-vocabulary.json"
OUT_TS = Path(__file__).resolve().parent.parent / "src" / "data" / "vocabulary.ts"

LINE_PATTERN = re.compile(r"^(.+?)\s+\[([^\]]+)\]\s+(.+)$")
PRONOUNS_COUNT = 30


def split_variants(value: str) -> list[str]:
    return [part.strip() for part in value.split("/") if part.strip()]


def parse_line(line: str) -> dict | None:
    match = LINE_PATTERN.match(line.strip())
    if not match:
        return None

    en_raw, pronunciation, ru_raw = match.groups()
    en_variants = split_variants(en_raw)
    ru_variants = split_variants(ru_raw)

    entry: dict = {
        "en": en_variants,
        "pronunciation": pronunciation.strip(),
        "ru": ru_variants[0] if len(ru_variants) == 1 else ru_raw.strip(),
    }

    if len(ru_variants) > 1:
        entry["ruVariants"] = ru_variants

    return entry


def build_vocabulary_ts(groups: list[dict]) -> str:
    body = json.dumps(groups, ensure_ascii=False, indent=2)
    return (
        "import type { TopicGroup } from '../types/vocabulary';\n\n"
        f"export const VOCABULARY: TopicGroup[] = {body};\n\n"
        "export const TOTAL_WORDS = VOCABULARY.reduce(\n"
        "  (sum, group) => sum + group.words.length,\n"
        "  0,\n"
        ");\n"
    )


def build_groups(words: list[dict]) -> list[dict]:
    pronouns = words[:PRONOUNS_COUNT]
    computer = words[PRONOUNS_COUNT:]

    def to_word(entry: dict, topic_id: str, index: int) -> dict:
        word: dict = {
            "id": f"{topic_id}-{index}",
            "ru": entry["ru"],
            "en": entry["en"],
            "pronunciation": entry["pronunciation"],
            "topic": topic_id,
        }
        if "ruVariants" in entry:
            word["ruVariants"] = entry["ruVariants"]
        return word

    return [
        {
            "id": "pronouns",
            "title": "Pronouns & basics",
            "words": [to_word(w, "pronouns", i) for i, w in enumerate(pronouns, 1)],
        },
        {
            "id": "computer",
            "title": "Computer English",
            "words": [to_word(w, "computer", i) for i, w in enumerate(computer, 1)],
        },
    ]


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=SOURCE_DEFAULT)
    parser.add_argument("--out-json", type=Path, default=OUT_JSON)
    parser.add_argument("--out-ts", type=Path, default=OUT_TS)
    args = parser.parse_args()

    words: list[dict] = []
    for line in args.source.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        parsed = parse_line(stripped)
        if parsed:
            words.append(parsed)

    if not words:
        raise ValueError("No word pairs found in source file")

    groups = build_groups(words)
    args.out_json.write_text(
        json.dumps({"total": len(words), "groups": groups}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    args.out_ts.write_text(build_vocabulary_ts(groups), encoding="utf-8")

    print(f"Parsed {len(words)} words")
    print(f"Wrote {args.out_json}")
    print(f"Wrote {args.out_ts}")


if __name__ == "__main__":
    main()
