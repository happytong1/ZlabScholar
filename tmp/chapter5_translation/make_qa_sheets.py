from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).parent
src = root / "qa_v2"
out = root / "qa_sheets_v2"
out.mkdir(exist_ok=True)
files = sorted(src.glob("page-*.png"), key=lambda p: int(p.stem.split("-")[-1]))
font = ImageFont.load_default()

for batch_index in range(0, len(files), 6):
    batch = files[batch_index:batch_index + 6]
    sheet = Image.new("RGB", (3 * 440, 2 * 590), "#dddddd")
    for index, path in enumerate(batch):
        image = Image.open(path).convert("RGB")
        image.thumbnail((420, 550))
        tile = Image.new("RGB", (440, 590), "white")
        tile.paste(image, ((440 - image.width) // 2, 28))
        ImageDraw.Draw(tile).text((8, 8), path.stem, fill="black", font=font)
        x = (index % 3) * 440
        y = (index // 3) * 590
        sheet.paste(tile, (x, y))
    sheet.save(out / f"qa-{batch_index // 6 + 1}.jpg", quality=92)
