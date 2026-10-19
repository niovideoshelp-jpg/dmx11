"""Turn a transparent cut-out into the film's paper sticker: B&W, a little contrast,
a scissor-cut paper border. Baked here so the renderer does not run CSS filters per frame.

Usage: python -I scripts/finish_cutout.py IN.png OUT.png [border_px]
"""
import sys

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

PAPER_EDGE = (246, 244, 238, 255)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    border = int(sys.argv[3]) if len(sys.argv) > 3 else 7

    im = Image.open(src).convert('RGBA')
    pad = border + 4
    canvas = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    canvas.alpha_composite(im, (pad, pad))

    alpha = canvas.getchannel('A')
    grey = ImageOps.grayscale(canvas.convert('RGB'))
    grey = ImageOps.autocontrast(grey, cutoff=0.5)
    grey = ImageEnhance.Contrast(grey).enhance(1.12)
    photo = Image.merge('RGBA', (grey, grey, grey, alpha))

    # Paper border: the dilated silhouette, slightly rounded, under the photo.
    hard = alpha.point(lambda v: 255 if v > 90 else 0)
    edge = hard.filter(ImageFilter.MaxFilter(border * 2 + 1)).filter(ImageFilter.GaussianBlur(1.2))
    edge = edge.point(lambda v: 255 if v > 110 else 0).filter(ImageFilter.GaussianBlur(0.7))
    sticker = Image.new('RGBA', canvas.size, PAPER_EDGE)
    sticker.putalpha(edge)
    sticker.alpha_composite(photo)
    sticker.save(dst)
    print(f'{dst}: {sticker.width}x{sticker.height} (pad {pad})')


if __name__ == '__main__':
    main()
