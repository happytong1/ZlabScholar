from pathlib import Path
from PIL import Image, ImageChops, ImageEnhance, ImageOps

root = Path(__file__).parent
src = root / "pdf_ch5_200dpi"
out = root / "figures"
out.mkdir(exist_ok=True)

# Coordinates are in the 1220 x 1737 page rasters. Captions are recreated in English.
boxes = {
    "fig-5-1": (135, (155, 965, 1060, 1350)),
    "table-5-1": (136, (155, 945, 1080, 1490)),
    "fig-5-2": (137, (175, 870, 1085, 1460)),
    "fig-5-3": (138, (185, 1040, 1060, 1480)),
    "fig-5-4": (139, (175, 1135, 1065, 1490)),
    "fig-5-5": (140, (250, 930, 980, 1145)),
    "fig-5-6": (143, (215, 405, 1015, 900)),
    "fig-5-7": (145, (155, 170, 1080, 850)),
    "fig-5-8": (146, (155, 175, 1080, 1330)),
    "fig-5-9": (148, (345, 1120, 1050, 1460)),
    "fig-5-10": (149, (175, 620, 1070, 1400)),
    "fig-5-11": (150, (175, 750, 1065, 1260)),
    "fig-5-12": (151, (175, 520, 1025, 800)),
    "fig-5-13": (153, (170, 560, 1065, 860)),
    "fig-5-14": (154, (225, 980, 1045, 1580)),
    "fig-5-15": (155, (260, 760, 1065, 1050)),
}

def trim_white(image: Image.Image, pad: int = 18) -> Image.Image:
    rgb = image.convert("RGB")
    gray = ImageOps.grayscale(rgb)
    # Treat only very light pixels as background so faint diagram lines survive.
    ink = gray.point(lambda px: 0 if px > 248 else 255)
    bbox = ink.getbbox()
    if not bbox:
        return rgb
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(rgb.width, right + pad)
    bottom = min(rgb.height, bottom + pad)
    return rgb.crop((left, top, right, bottom))

for name, (page, box) in boxes.items():
    image = Image.open(src / f"page-{page}.png").convert("RGB")
    crop = trim_white(image.crop(box))
    crop = ImageEnhance.Contrast(crop).enhance(1.08)
    crop.save(out / f"{name}.png", optimize=True)
    print(name, crop.size)
