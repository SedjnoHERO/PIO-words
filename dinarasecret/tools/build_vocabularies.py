import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "tools" / "crime-raw.txt"
DE_RAW = ROOT / "tools" / "vocabulary.de.raw.ts"
OUT_EN = ROOT / "src" / "data" / "vocabulary.en.ts"
OUT_DE = ROOT / "src" / "data" / "vocabulary.de.ts"


def parse_en_terms(en_raw: str) -> list[str]:
    terms: list[str] = []
    chunks = [c.strip() for c in re.split(r"\s*/\s*", en_raw) if c.strip()]
    for chunk in chunks:
        match = re.match(r"^(.+?)\s*\(([^)]+)\)\s*$", chunk)
        if match:
            main = match.group(1).strip()
            if main and main not in terms:
                terms.append(main)
            for alt in re.split(r",\s*", match.group(2)):
                alt = alt.strip()
                if alt and alt not in terms:
                    terms.append(alt)
        elif chunk not in terms:
            terms.append(chunk)
    return terms


def write_ts(path: Path, export_name: str, data: list) -> None:
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    path.write_text(
        "import type { TopicGroup } from '../types/vocabulary';\n\n"
        f"export const {export_name}: TopicGroup[] = {payload};\n",
        encoding="utf-8",
    )


def load_de() -> list:
    raw = DE_RAW.read_bytes()
    text = None
    for encoding in ("utf-8-sig", "utf-16", "utf-16-le", "cp1251"):
        try:
            text = raw.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    if text is None:
        raise ValueError("Cannot decode DE vocabulary raw file")
    marker = "TopicGroup[] = "
    start = text.index(marker) + len(marker)
    end = text.rindex("];") + 1
    return json.loads(text[start:end].replace('"de"', '"terms"'))


def main() -> None:
    pairs: list[dict] = []
    for line in RAW.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line in {"CRIME and Justice", "Active vocabulary"}:
            continue
        if line.startswith("TOPICS"):
            break
        if " - " not in line:
            continue
        en_raw, ru_raw = line.split(" - ", 1)
        terms = parse_en_terms(en_raw.strip())
        ru_parts = [part.strip() for part in ru_raw.split(",") if part.strip()]
        word: dict = {
            "id": f"crime-and-justice-{len(pairs) + 1}",
            "ru": ru_parts[0],
            "terms": terms,
            "topic": "crime-and-justice",
        }
        if len(ru_parts) > 1:
            word["ruVariants"] = ru_parts
        pairs.append(word)

    en_groups = [
        {
            "id": "crime-and-justice",
            "title": "Crime and Justice",
            "words": pairs,
        }
    ]
    de_groups = load_de()

    write_ts(OUT_EN, "VOCABULARY_EN", en_groups)
    write_ts(OUT_DE, "VOCABULARY_DE", de_groups)
    print(f"EN {len(pairs)}")
    print(f"DE {sum(len(group['words']) for group in de_groups)}")
    print(json.dumps(pairs[:2], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
