from pathlib import Path
from zipfile import ZipFile
import hashlib

root = Path(__file__).parent
before = root / "template.docx"
after = root / "AI+MBSE_Chapter5_English.docx"

allowed_changed = {
    "word/document.xml",
    "word/_rels/document.xml.rels",
    "[Content_Types].xml",
    "docProps/core.xml",
    "word/settings.xml",
}

def inventory(path: Path):
    with ZipFile(path) as z:
        return {name: hashlib.sha256(z.read(name)).hexdigest() for name in z.namelist()}

a = inventory(before)
b = inventory(after)
removed = sorted(set(a) - set(b))
changed = sorted(name for name in set(a) & set(b) if a[name] != b[name])
added = sorted(set(b) - set(a))

print("REMOVED", removed)
print("CHANGED", changed)
print("UNEXPECTED_CHANGED", [name for name in changed if name not in allowed_changed])
print("ADDED_COUNT", len(added))
print("ADDED", added)
