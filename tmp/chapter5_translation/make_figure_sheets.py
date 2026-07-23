from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).parent
src = root / "figures"
out = root / "figure_sheets"
out.mkdir(exist_ok=True)
files = sorted(src.glob("*.png"))
font = ImageFont.load_default()

for batch_index in range(0, len(files), 4):
    batch = files[batch_index:batch_index + 4]
    tiles = []
    for path in batch:
        image = Image.open(path).convert("RGB")
        image.thumbnail((560, 720))
        tile = Image.new("RGB", (580, 770), "white")
        tile.paste(image, ((580 - image.width) // 2, 35))
        ImageDraw.Draw(tile).text((10, 10), path.stem, fill="black", font=font)
        tiles.append(tile)
    sheet = Image.new("RGB", (580 * len(tiles), 770), "#dddddd")
    for index, tile in enumerate(tiles):
        sheet.paste(tile, (580 * index, 0))
    sheet.save(out / f"figures-{batch_index // 4 + 1}.jpg", quality=92)
