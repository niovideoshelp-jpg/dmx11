"""Local background removal with the IS-Net (isnet-general-use) ONNX model.

Usage:
  python -I scripts/cutout.py MODEL.onnx IN.jpg OUT.png [x0 y0 x1 y1 [lo hi]]

The optional box crops the photo before segmentation (pixels of the source image);
lo/hi remap the matte (raise lo to drop smoky low-confidence background).
Writes an RGBA PNG trimmed to the subject with a small margin. Nothing leaves the machine.
"""
import sys

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

SIZE = 1024


def predict(session, img):
    im = img.convert('RGB').resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    a = a / max(a.max(), 1e-6)
    a = (a - 0.5) / 1.0
    x = a.transpose(2, 0, 1)[None].astype(np.float32)
    out = session.run(None, {session.get_inputs()[0].name: x})[0][0, 0]
    out = (out - out.min()) / max(out.max() - out.min(), 1e-6)
    mask = Image.fromarray((out * 255).astype(np.uint8), mode='L')
    return mask.resize(img.size, Image.Resampling.LANCZOS)


def main():
    model, src, dst = sys.argv[1:4]
    box = tuple(int(v) for v in sys.argv[4:8]) if len(sys.argv) >= 8 else None
    lo, hi = (float(sys.argv[8]), float(sys.argv[9])) if len(sys.argv) >= 10 else (0.18, 0.82)

    img = Image.open(src).convert('RGB')
    if box:
        img = img.crop(box)

    session = ort.InferenceSession(model, providers=['CPUExecutionProvider'])
    mask = predict(session, img)

    # Harden the matte a little: soft edge of ~2px, no grey halo.
    m = np.asarray(mask).astype(np.float32) / 255.0
    m = np.clip((m - lo) / (hi - lo), 0, 1)
    mask = Image.fromarray((m * 255).astype(np.uint8), mode='L').filter(ImageFilter.GaussianBlur(0.6))

    rgba = img.copy()
    rgba.putalpha(mask)

    bbox = mask.point(lambda v: 255 if v > 24 else 0).getbbox()
    if bbox:
        pad = 6
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(img.width, bbox[2] + pad),
            min(img.height, bbox[3] + pad),
        )
        rgba = rgba.crop(bbox)

    rgba.save(dst)
    print(f'{dst}: {rgba.width}x{rgba.height}, subject bbox {bbox}')


if __name__ == '__main__':
    main()
