"""Parse exam.docx Telegram export into vocabulary JSON and TypeScript."""
from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
DOCX_DEFAULT = Path(__file__).resolve().parent.parent / "exam.docx"
OUT_JSON = Path(__file__).resolve().parent / "exam-vocabulary.json"
OUT_TS = Path(__file__).resolve().parent.parent / "src" / "data" / "vocabulary.ts"

LATIN_RE = re.compile(r"[A-Za-zÄÖÜäöüß]")
CYRILLIC_RE = re.compile(r"[А-Яа-яЁё]")
SKIP_RU = {"немецкий", "русский", "german", "russian"}
ORAL_BLOCKS = {1, 3, 5, 7, 8, 9, 11, 12}

BLOCK_TITLES: dict[int, str] = {
    1: "Блок 1 · темы 1 и 2/8",
    2: "Блок 2",
    3: "Блок 3 · устное 3/8",
    4: "Блок 4",
    5: "Блок 5 · устное 4/8",
    6: "Блок 6",
    7: "Блок 7 · устное",
    8: "Блок 8 · устное 5/8",
    9: "Блок 9 · устное 6/8",
    10: "Блок 10",
    11: "Блок 11 · устное 7/8",
    12: "Блок 12 · устное 8/8",
}

SUPPLEMENT_DEFAULT = Path(__file__).resolve().parent / "exam-blocks-9-12.md"


def extract_docx_text(docx_path: Path) -> str:
    with zipfile.ZipFile(docx_path) as zf:
        xml = zf.read("word/document.xml")
    root = ET.fromstring(xml)
    body = root.find(f"{W}body")
    if body is None:
        return ""

    parts: list[str] = []
    for child in body:
        tag = child.tag.split("}")[-1]
        if tag == "p":
            texts: list[str] = []
            for node in child.iter(f"{W}t"):
                if node.text:
                    texts.append(node.text)
                if node.tail:
                    texts.append(node.tail)
            parts.append("".join(texts))
    return "\n".join(parts)


def load_sources(docx_path: Path, supplements: list[Path]) -> str:
    parts: list[str] = []
    if docx_path.exists():
        parts.append(extract_docx_text(docx_path))
    for path in supplements:
        if path.exists():
            parts.append(path.read_text(encoding="utf-8"))
    if not parts:
        raise FileNotFoundError("No vocabulary sources found")
    return "\n\n".join(parts)


def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(
        r"\[?\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}\]?\s*[^:\n]*:\s*",
        "",
        text,
    )
    return text


def is_valid_pair(de: str, ru: str) -> bool:
    if len(de) < 2 or len(ru) < 2:
        return False
    if ru.lower().strip() in SKIP_RU:
        return False
    if de.lower().strip() in SKIP_RU:
        return False
    if not LATIN_RE.search(de) and not de.startswith("("):
        return False
    if not CYRILLIC_RE.search(ru):
        return False
    if "устное высказывание" in de.lower():
        return False
    if "seite" in de.lower() and "###" in de:
        return False
    return True


def split_blocks(text: str) -> list[tuple[int, str]]:
    chunks = re.split(r"(?=Блок\s*\d+)", text, flags=re.IGNORECASE)
    blocks: list[tuple[int, str]] = []
    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk:
            continue
        match = re.match(r"Блок\s*(\d+)\s*[-,]?\s*(.*)$", chunk, flags=re.IGNORECASE | re.DOTALL)
        if not match:
            continue
        number = int(match.group(1))
        rest = match.group(2).strip()
        blocks.append((number, rest))
    return blocks


def parse_markdown_table(segment: str) -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []

    for line in segment.splitlines():
        line = line.strip().strip("|").strip()
        if not line or re.search(r"-{3,}", line):
            continue
        if "|" not in line:
            continue
        cells = [cell.strip() for cell in line.split("|") if cell.strip()]
        if len(cells) < 2:
            continue
        de, ru = cells[0], cells[1]
        if not is_valid_pair(de, ru):
            continue
        pairs.append((de, ru))

    if pairs:
        return pairs

    rows = re.split(r"\|\|+", segment)
    for row in rows:
        row = row.strip().strip("|").strip()
        if not row or re.search(r"-{3,}", row):
            continue
        if "|" not in row:
            continue
        cells = [cell.strip() for cell in row.split("|") if cell.strip()]
        if len(cells) < 2:
            continue
        de, ru = cells[0], cells[1]
        if not is_valid_pair(de, ru):
            continue
        pairs.append((de, ru))
    return pairs


def parse_plain_pairs(segment: str) -> list[tuple[str, str]]:
    cleaned = segment
    cleaned = re.sub(r"###?\s*Seite\s+\d+\s*[-–]\s*\d+", " ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"Seite\s+\d+\s*[-–]\s*\d+", " ", cleaned, flags=re.IGNORECASE)
    cleaned = cleaned.replace("Немецкий Русский", " ")
    cleaned = cleaned.replace("Немецкий", " ").replace("Русский", " ")
    cleaned = re.sub(r"---+", " ", cleaned)

    pairs: list[tuple[str, str]] = []
    pattern = re.compile(
        r"(?P<de>(?:\([^)]*\)\s*)?"
        r"(?:(?:der|die|das|sich|Man|Ich|Sie|Er|Es|Du|Weder|Nicht|Das|Die|Der)\s+)?"
        r"[A-Za-zÄÖÜäöüß][^А-Яа-яЁё]*?)"
        r"\s+(?P<ru>[А-Яа-яЁё«][^A-Za-zÄÖÜäöüß]*)",
        re.UNICODE,
    )

    for match in pattern.finditer(cleaned):
        de = re.sub(r"\s+", " ", match.group("de")).strip(" ,;")
        ru = re.sub(r"\s+", " ", match.group("ru")).strip(" ,;")
        if not is_valid_pair(de, ru):
            continue
        pairs.append((de, ru))

    return pairs


def parse_block_segment(segment: str) -> list[tuple[str, str]]:
    if "|" in segment:
        table_pairs = parse_markdown_table(segment)
        if table_pairs:
            return table_pairs
    return parse_plain_pairs(segment)


def split_ru_variants(ru: str) -> tuple[str, list[str] | None]:
    if " / " in ru:
        parts = [part.strip() for part in ru.split(" / ") if part.strip()]
        if len(parts) > 1:
            return parts[0], parts
    return ru, None


def slugify(text: str) -> str:
    value = text.lower()
    value = re.sub(r"[^a-z0-9а-яё]+", "-", value, flags=re.IGNORECASE)
    return value.strip("-") or "topic"


def parse_blocks(text: str) -> list[dict]:
    text = normalize_text(text)
    entries: list[dict] = []
    blocks = split_blocks(text)
    if not blocks:
        raise ValueError("No vocabulary blocks found")

    for block_num, segment in blocks:
        oral = block_num in ORAL_BLOCKS
        pairs = parse_block_segment(segment)
        seen: set[tuple[str, str]] = set()
        for de, ru in pairs:
            key = (de, ru)
            if key in seen:
                continue
            seen.add(key)
            item: dict = {"de": de, "ru": ru, "block": block_num}
            if oral:
                item["oral"] = True
            entries.append(item)
    return entries


def build_vocabulary_ts(entries: list[dict]) -> str:
    by_block: dict[int, list[dict]] = {}
    for entry in entries:
        by_block.setdefault(entry["block"], []).append(entry)

    groups: list[dict] = []
    for block_num in sorted(by_block):
        topic_id = f"block-{block_num}"
        title = BLOCK_TITLES.get(block_num, f"Блок {block_num}")
        oral = block_num in ORAL_BLOCKS
        words: list[dict] = []

        for index, entry in enumerate(by_block[block_num], start=1):
            ru, ru_variants = split_ru_variants(entry["ru"])
            word: dict = {
                "id": f"{topic_id}-{index}",
                "ru": ru,
                "de": [entry["de"]],
                "topic": topic_id,
            }
            if ru_variants:
                word["ruVariants"] = ru_variants
            if entry.get("oral"):
                word["oral"] = True
            words.append(word)

        group: dict = {
            "id": topic_id,
            "title": title,
            "words": words,
        }
        if oral:
            group["oral"] = True
        groups.append(group)

    payload = json.dumps(groups, ensure_ascii=False, indent=2)
    return (
        "import type { TopicGroup } from '../types/vocabulary';\n\n"
        f"export const VOCABULARY: TopicGroup[] = {payload};\n\n"
        "export const TOTAL_WORDS = VOCABULARY.reduce(\n"
        "  (sum, group) => sum + group.words.length,\n"
        "  0,\n"
        ");\n"
    )


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Parse exam.docx vocabulary")
    parser.add_argument("--docx", type=Path, default=DOCX_DEFAULT)
    parser.add_argument(
        "--supplement",
        type=Path,
        action="append",
        default=None,
        help="Additional markdown source (repeatable)",
    )
    parser.add_argument("--out-json", type=Path, default=OUT_JSON)
    parser.add_argument("--out-ts", type=Path, default=OUT_TS)
    args = parser.parse_args()

    raw = load_sources(args.docx, args.supplement or [])
    entries = parse_blocks(raw)

    by_block: dict[int, int] = {}
    for entry in entries:
        by_block[entry["block"]] = by_block.get(entry["block"], 0) + 1

    payload = {
        "source": [str(args.docx), *[str(path) for path in (args.supplement or []) if path.exists()]],
        "total": len(entries),
        "countByBlock": {str(k): by_block[k] for k in sorted(by_block)},
        "entries": entries,
    }

    args.out_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    args.out_ts.write_text(build_vocabulary_ts(entries), encoding="utf-8")

    print(f"Parsed {len(entries)} words")
    for block_num in sorted(by_block):
        oral = "oral" if block_num in ORAL_BLOCKS else "extra"
        print(f"  Block {block_num}: {by_block[block_num]} ({oral})")
    print(f"Wrote {args.out_json}")
    print(f"Wrote {args.out_ts}")


if __name__ == "__main__":
    main()
