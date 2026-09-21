import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DE = ROOT / "src" / "data" / "vocabulary.de.ts"

data = subprocess.check_output(
    ["git", "show", "HEAD:dinarasecret/src/data/vocabulary.ts"],
    cwd=ROOT.parent,
)
text = data.decode("utf-8")
marker = "TopicGroup[] = "
start = text.index(marker) + len(marker)
end = text.rindex("];") + 1
groups = json.loads(text[start:end].replace('"de"', '"terms"'))
payload = json.dumps(groups, ensure_ascii=False, indent=2)
OUT_DE.write_text(
    "import type { TopicGroup } from '../types/vocabulary';\n\n"
    f"export const VOCABULARY_DE: TopicGroup[] = {payload};\n",
    encoding="utf-8",
)
print("DE words", sum(len(group["words"]) for group in groups))
print("has territory", "территория" in payload)
