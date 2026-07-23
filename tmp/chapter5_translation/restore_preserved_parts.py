from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).parent
reference = root / "template.docx"
working = root / "AI+MBSE_Chapter5_English.docx"
output = root / "AI+MBSE_Chapter5_English.preserved.docx"

preserve = {
    "_rels/.rels",
    "customXml/_rels/item1.xml.rels",
    "word/footer1.xml",
    "word/header1.xml",
    "word/numbering.xml",
    "word/styles.xml",
}

with ZipFile(reference) as zref, ZipFile(working) as zwork, ZipFile(output, "w", ZIP_DEFLATED) as zout:
    for info in zwork.infolist():
        data = zref.read(info.filename) if info.filename in preserve else zwork.read(info.filename)
        zout.writestr(info, data)

output.replace(working)
print(working)
