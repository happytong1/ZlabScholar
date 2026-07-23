from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).parent
src = root / "pdf_ch5_200dpi"
out = root / "contact_sheets"
out.mkdir(exist_ok=True)
files = sorted(src.glob("page-*.png"), key=lambda p: int(p.stem.split("-")[-1]))
font = ImageFont.load_default()

for batch_index in range(0, len(files), 4):
    batch = files[batch_index:batch_index + 4]
    thumbs = []
    for path in batch:
        image = Image.open(path).convert("RGB")
        image.thumbnail((600, 850))
        canvas = Image.new("RGB", (620, 900), "white")
        canvas.paste(image, ((620 - image.width) // 2, 35))
        draw = ImageDraw.Draw(canvas)
        draw.text((10, 10), path.stem, fill="black", font=font)
        thumbs.append(canvas)
    sheet = Image.new("RGB", (620 * len(thumbs), 900), "#dddddd")
    for index, thumb in enumerate(thumbs):
        sheet.paste(thumb, (620 * index, 0))
    first = batch[0].stem.split("-")[-1]
    last = batch[-1].stem.split("-")[-1]
    sheet.save(out / f"pages-{first}-{last}.jpg", quality=90)
