#!/usr/bin/env python3
"""Quick sanity check on a rendered still or a source tree.

Usage:
  python3 check_style.py image out/title.png     # palette check on a frame
  python3 check_style.py src   ../my-doc/src     # grep for style violations
"""
import sys, os, re, collections

PALETTE = {
    'paper': (239, 237, 232), 'paperDeep': (228, 225, 218), 'ink': (17, 17, 16),
    'inkSoft': (74, 72, 68), 'inkFaint': (185, 181, 172), 'yellow': (242, 229, 29),
    'dataRed': (232, 87, 75), 'dataBlue': (46, 134, 193),
}

def near(c, t, tol=26):
    return all(abs(a - b) <= tol for a, b in zip(c, t))

def check_image(path):
    from PIL import Image
    im = Image.open(path).convert('RGB').resize((320, 180))
    counts = im.getcolors(320 * 180) or []
    stray = 0
    for n, color in counts:
        r, g, b = color
        sat = max(color) - min(color)
        if sat < 18:            # neutral, fine
            continue
        if any(near(color, t, 40) for t in PALETTE.values()):
            continue
        stray += n
    total = sum(n for n, _ in counts) or 1
    pct = 100 * stray / total
    print(f"off-palette saturated pixels: {pct:.1f}%")
    print("OK" if pct < 2.0 else "WARNING: a colour outside the system is present")

def check_src(root):
    problems = []
    for dirpath, _, files in os.walk(root):
        if 'node_modules' in dirpath:
            continue
        for f in files:
            if not f.endswith(('.tsx', '.ts')):
                continue
            p = os.path.join(dirpath, f)
            src = open(p, encoding='utf-8').read()
            for m in re.finditer(r'#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b', src):
                hexv = m.group(0).lower()
                if hexv in ('#000', '#fff', '#000000', '#ffffff'):
                    continue
                if 'theme.ts' in p:
                    continue
                problems.append(f"{p}: hard-coded colour {hexv} (use theme tokens)")
            if 'stroke' in src and 'opacity' in src and 'DrawPath' not in src and 'pattern' not in src:
                problems.append(f"{p}: stroke + opacity — strokes should draw, not fade")
            if re.search(r'transition:', src):
                problems.append(f"{p}: CSS transition found — animate from useCurrentFrame")
    print('\n'.join(problems) if problems else 'OK: no style violations found')

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(__doc__); sys.exit(1)
    (check_image if sys.argv[1] == 'image' else check_src)(sys.argv[2])
