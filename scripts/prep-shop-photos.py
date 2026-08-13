"""Prepare Kru Nok's shop photos for the website.

She shot them in the evening on a phone and asked whether the lighting could be
lifted. The correction here is deliberately mild — lift the shadows, take the worst
of the colour cast off, sharpen slightly for the downscale. It has to still look like
the room she photographed; the whole point of using these is that the site stops
showing a place that does not exist.
"""
import os, sys
from PIL import Image, ImageEnhance, ImageFilter

SRC = "/Users/komphet.me/Downloads/Taitam-D Shop"
DST = "public/images/shop"

# (source file, output name, longest edge)
JOBS = [
    ("772204702_1683002030499267_5555894506722594563_n.jpg", "treatment-room-couples", 1400),
    ("773867203_1683002250499245_5747687828630854017_n.jpg", "reception-tropical", 1600),
    ("773218417_1683002007165936_4014689525456133629_n.jpg", "reception-wide", 1600),
    ("772466111_1683002220499248_2318545624532336068_n.jpg", "salon-lavender", 1400),
    ("772466122_1683001963832607_2420434563345033907_n.jpg", "team-board", 1400),
]


def grey_world(im):
    """Pull the per-room colour cast toward neutral without flattening the mood.

    Each room has a different mural — beach blue, lavender purple, warm reception —
    so a global correction would fight the decor. This nudges each channel a third of
    the way to neutral, which takes the phone's auto-white-balance error off without
    turning the lavender room grey.
    """
    r, g, b = [c.convert("L") for c in im.split()[:3]]
    means = [sum(c.getdata()) / (c.width * c.height) for c in (r, g, b)]
    target = sum(means) / 3
    out = []
    for ch, m in zip(im.split()[:3], means):
        factor = 1 + ((target / m) - 1) * 0.33 if m else 1
        out.append(ch.point(lambda v, f=factor: min(255, int(v * f))))
    return Image.merge("RGB", out)


os.makedirs(DST, exist_ok=True)
for src, name, edge in JOBS:
    p = os.path.join(SRC, src)
    if not os.path.exists(p):
        print(f"MISSING {src}")
        continue
    im = Image.open(p).convert("RGB")
    im = grey_world(im)
    im = ImageEnhance.Brightness(im).enhance(1.06)   # evening shot, lift a little
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.04)
    w, h = im.size
    scale = edge / max(w, h)
    if scale < 1:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=3))
    out = os.path.join(DST, f"{name}.jpg")
    im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    print(f"{os.path.getsize(out)//1024:5d} KB  {im.size[0]}x{im.size[1]}  {name}.jpg")
