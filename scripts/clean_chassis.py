import sys
from PIL import Image, ImageDraw, ImageOps
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')
a = im.getchannel('A')
d = ImageDraw.Draw(a)
d.rectangle([0, 0, 80, im.height], fill=0)          # smoky leftovers behind the rear wheel
d.rectangle([0, 0, 333, 246], fill=0)               # dump body
d.rectangle([0, 0, 615, 63], fill=0)                # dump body's cab shield over the roof
im.putalpha(a)
im = im.crop(im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox())
im = ImageOps.mirror(im)                            # face left, like the DN-XI photo
im.save(dst)
print(im.size)
# Mirroring reverses the badges; flip those patches back so the lettering reads correctly.
im = Image.open(dst)
for box in [(36, 160, 90, 202), (426, 124, 450, 188)]:
    patch = ImageOps.mirror(im.crop(box))
    im.paste(patch, box[:2])
im.save(dst)
# The hood lettering cannot be flipped cleanly (it sits on the silhouette edge): soften it instead.
from PIL import ImageFilter
im = Image.open(dst)
box = (24, 112, 128, 132)
im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(2.2)), box[:2])
im.save(dst)
