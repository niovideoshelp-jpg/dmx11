// Builds the film's Lottie icons as hand-authored bodymovin JSON (200x200, 30fps).
// Every stroke is drawn with Trim Paths, every fill scales from an anchored edge —
// the same rules as the rest of the film. Output: src/lottie/*.json
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'src/lottie');
fs.mkdirSync(outDir, {recursive: true});

// ---------- palette (mirrors src/theme.ts) ----------
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1 + i, 3 + i), 16) / 255);
const INK = hex('#111110');
const RED = hex('#E8574B');
const YEL = hex('#F2E51D');
const BLUE = hex('#6F93D6');
const GREY = hex('#A9A59E');
const PAPER = hex('#EFEDE8');

// ---------- easing (cubic-bezier handles) ----------
const EASE = {
  out: [0.33, 1, 0.68, 1],
  in: [0.32, 0, 0.67, 0],
  inOut: [0.65, 0, 0.35, 1],
  back: [0.34, 1.56, 0.64, 1],
  linear: [0, 0, 1, 1],
};

// ---------- property helpers ----------
const K = (k) => ({a: 0, k});
const A = (keys) => ({
  a: 1,
  k: keys.map(([t, s, ease = 'out'], i) => {
    const kf = {t, s: Array.isArray(s) ? s : [s]};
    if (i < keys.length - 1) {
      const [x1, y1, x2, y2] = EASE[ease];
      kf.o = {x: [x1], y: [y1]};
      kf.i = {x: [x2], y: [y2]};
    }
    return kf;
  }),
});
const prop = (v) => (v && typeof v === 'object' && 'a' in v ? v : K(v));

// ---------- path builders ----------
const C = 0.5523;
const poly = (pts, closed = false) => ({
  v: pts,
  i: pts.map(() => [0, 0]),
  o: pts.map(() => [0, 0]),
  c: closed,
});
const circle = (cx, cy, r) => ({
  v: [
    [cx, cy - r],
    [cx + r, cy],
    [cx, cy + r],
    [cx - r, cy],
  ],
  i: [
    [-r * C, 0],
    [0, -r * C],
    [r * C, 0],
    [0, r * C],
  ],
  o: [
    [r * C, 0],
    [0, r * C],
    [-r * C, 0],
    [0, -r * C],
  ],
  c: true,
});
const rad = (d) => (d * Math.PI) / 180;
const arc = (cx, cy, r, a0, a1) => {
  const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / 90));
  const step = (a1 - a0) / n;
  const h = (4 / 3) * Math.tan(rad(step) / 4) * r;
  const v = [];
  const i = [];
  const o = [];
  for (let k = 0; k <= n; k++) {
    const a = rad(a0 + step * k);
    const tx = -Math.sin(a);
    const ty = Math.cos(a);
    v.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    i.push(k === 0 ? [0, 0] : [-h * tx, -h * ty]);
    o.push(k === n ? [0, 0] : [h * tx, h * ty]);
  }
  return {v, i, o, c: false};
};
/** Cubic path from [x, y, inX, inY, outX, outY] vertices (tangents relative). */
const cubic = (verts, closed = true) => ({
  v: verts.map((p) => [p[0], p[1]]),
  i: verts.map((p) => [p[2] ?? 0, p[3] ?? 0]),
  o: verts.map((p) => [p[4] ?? 0, p[5] ?? 0]),
  c: closed,
});

// ---------- shape items ----------
const sh = (p) => ({ty: 'sh', ks: K(p)});
const st = (c, w, extra = {}) => ({ty: 'st', c: K([...c, 1]), o: K(100), w: prop(w), lc: 2, lj: 2, ml: 4, ...extra});
const fl = (c) => ({ty: 'fl', c: K([...c, 1]), o: K(100), r: 1});
const tm = (s, e, o = 0) => ({ty: 'tm', s: prop(s), e: prop(e), o: prop(o), m: 1});
const dash = (d, g, off = 0) => ({
  d: [
    {n: 'd', nm: 'dash', v: K(d)},
    {n: 'g', nm: 'gap', v: K(g)},
    {n: 'o', nm: 'offset', v: prop(off)},
  ],
});
const tr = ({p = [0, 0], a = [0, 0], s = [100, 100], r = 0, o = 100} = {}) => ({
  ty: 'tr',
  p: prop(p),
  a: prop(a),
  s: prop(s),
  r: prop(r),
  o: prop(o),
  sk: K(0),
  sa: K(0),
});
/** Group: shapes first, then modifiers/styles, transform last (bodymovin order). */
const gr = (nm, items, t) => ({ty: 'gr', nm, it: [...items, tr(t)]});

const comp = (nm, op, groups) => ({
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op,
  w: 200,
  h: 200,
  nm,
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm,
      sr: 1,
      ks: {o: K(100), r: K(0), p: K([0, 0, 0]), a: K([0, 0, 0]), s: K([100, 100, 100])},
      ao: 0,
      shapes: groups,
      ip: 0,
      op,
      st: 0,
      bm: 0,
    },
  ],
});

const save = (name, data) => {
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(data));
  console.log('lottie:', name);
};

// ---------- 1. impact: a shot lands ----------
{
  const rays = [];
  for (let k = 0; k < 8; k++) {
    const a = rad(k * 45 + 12);
    const p0 = [100 + Math.cos(a) * 26, 100 + Math.sin(a) * 26];
    const p1 = [100 + Math.cos(a) * 86, 100 + Math.sin(a) * 86];
    rays.push(sh(poly([p0, p1])));
  }
  const star = [];
  for (let k = 0; k < 16; k++) {
    const a = rad(k * 22.5);
    const r = k % 2 === 0 ? 34 : 13;
    star.push([100 + Math.cos(a) * r, 100 + Math.sin(a) * r]);
  }
  save(
    'impact',
    comp('impact', 40, [
      gr('flash', [sh(poly(star, true)), fl(RED)], {
        p: [100, 100],
        a: [100, 100],
        s: A([
          [0, [0, 0], 'back'],
          [5, [100, 100], 'in'],
          [14, [0, 0]],
        ]),
      }),
      gr('rays', [...rays, tm(A([[3, 0, 'out'], [17, 100]]), A([[0, 0, 'out'], [10, 100]])), st(INK, 6)], {}),
      gr(
        'ring',
        [
          sh(circle(100, 100, 44)),
          st(RED, A([
            [0, 12, 'out'],
            [18, 0],
          ])),
        ],
        {
          p: [100, 100],
          a: [100, 100],
          s: A([
            [0, [20, 20], 'out'],
            [18, [135, 135]],
          ]),
        },
      ),
    ]),
  );
}

// ---------- 2. crosshair: a sight locks on ----------
const crosshair = (name, line, centre) => {
  const ticks = [0, 90, 180, 270].map((d) => {
    const a = rad(d);
    return sh(
      poly([
        [100 + Math.cos(a) * 54, 100 + Math.sin(a) * 54],
        [100 + Math.cos(a) * 92, 100 + Math.sin(a) * 92],
      ]),
    );
  });
  save(
    name,
    comp(name, 90, [
      gr('dot', [sh(circle(100, 100, 7)), fl(centre)], {
        p: [100, 100],
        a: [100, 100],
        s: A([
          [14, [0, 0], 'back'],
          [22, [100, 100]],
        ]),
      }),
      gr('ticks', [...ticks, tm(0, A([[8, 0], [18, 100]])), st(line, 6)], {}),
      gr('inner', [sh(circle(100, 100, 40)), tm(0, A([[4, 0], [20, 100]])), st(line, 3, dash(10, 9))], {
        p: [100, 100],
        a: [100, 100],
        r: A([
          [0, 0, 'linear'],
          [90, 120],
        ]),
      }),
      gr('outer', [sh(circle(100, 100, 70)), tm(0, A([[0, 0], [16, 100]])), st(line, 6)], {
        p: [100, 100],
        a: [100, 100],
        s: A([
          [0, [150, 150], 'out'],
          [18, [100, 100], 'inOut'],
          [30, [94, 94], 'inOut'],
          [42, [100, 100]],
        ]),
      }),
    ]),
  );
};
crosshair('crosshair', INK, RED);
crosshair('crosshair-screen', YEL, RED);

// ---------- 3. shield: protection ----------
{
  const shield = cubic([
    [100, 28, -26, 0, 26, 0],
    [162, 44, 0, 0, 0, 0],
    [162, 98, 0, 0, 0, 40],
    [100, 176, 34, -6, -34, -6],
    [38, 98, 0, 40, 0, 0],
    [38, 44, 0, 0, 0, 0],
  ]);
  save(
    'shield',
    comp('shield', 60, [
      gr('check', [sh(poly([[70, 102], [93, 125], [134, 78]])), tm(0, A([[18, 0], [30, 100]])), st(INK, 10)], {}),
      gr('outline', [sh(shield), tm(0, A([[0, 0], [22, 100]])), st(INK, 7)], {}),
      gr('fill', [sh(shield), fl(YEL)], {
        p: [100, 176],
        a: [100, 176],
        s: A([
          [6, [100, 0], 'out'],
          [20, [100, 100]],
        ]),
      }),
    ]),
  );
}

// ---------- 4. radio: comms emitting (loops) ----------
{
  const waves = [];
  [26, 46, 66].forEach((r, i) => {
    const t0 = i * 8;
    const trim = tm(
      A([
        [t0 + 18, 0, 'in'],
        [t0 + 30, 100],
      ]),
      A([
        [t0, 0, 'out'],
        [t0 + 12, 100],
      ]),
    );
    waves.push(gr(`wave${i}`, [sh(arc(100, 84, r, -42, 42)), sh(arc(100, 84, r, 222, 138)), trim, st(BLUE, 6)], {}));
  });
  save(
    'radio',
    comp('radio', 48, [
      ...waves,
      gr('tip', [sh(circle(100, 84, 9)), fl(INK)], {}),
      gr('mast', [sh(poly([[100, 92], [100, 168]])), sh(poly([[78, 168], [122, 168]])), st(INK, 7)], {}),
    ]),
  );
}

// ---------- 5. gear: mechanics turning (loops) ----------
{
  const teeth = 10;
  const pts = [];
  for (let k = 0; k < teeth; k++) {
    const base = (360 / teeth) * k;
    const w = 360 / teeth;
    [
      [base, 50],
      [base + w * 0.12, 66],
      [base + w * 0.38, 66],
      [base + w * 0.5, 50],
    ].forEach(([d, r]) => pts.push([100 + Math.cos(rad(d)) * r, 100 + Math.sin(rad(d)) * r]));
  }
  save(
    'gear',
    comp('gear', 90, [
      gr('hub', [sh(circle(100, 100, 18)), st(INK, 6), fl(PAPER)], {}),
      gr('body', [sh(poly(pts, true)), st(INK, 6), fl(GREY)], {
        p: [100, 100],
        a: [100, 100],
        r: A([
          [0, 0, 'linear'],
          [90, 36],
        ]),
      }),
    ]),
  );
}

// ---------- 6. sensor eye: optics scanning (loops) ----------
{
  const lid = cubic(
    [
      [30, 100, 0, 0, 30, -44],
      [170, 100, -30, -44, -30, 44],
      [30, 100, 30, 44, 0, 0],
    ],
    true,
  );
  const look = A([
    [0, [-14, 0], 'inOut'],
    [40, [14, 0], 'inOut'],
    [90, [-14, 0]],
  ]);
  save(
    'eye',
    comp('eye', 90, [
      gr(
        'blink',
        [
          gr('glint', [sh(circle(109, 91, 6)), fl(PAPER)], {p: look}),
          gr('iris', [sh(circle(100, 100, 24)), fl(INK)], {p: look}),
          gr('lid', [sh(lid), st(INK, 7), fl(YEL)], {}),
        ],
        {
          p: [100, 100],
          a: [100, 100],
          s: A([
            [58, [100, 100], 'in'],
            [62, [100, 8], 'out'],
            [67, [100, 100]],
          ]),
        },
      ),
    ]),
  );
}

// ---------- 7. power bolt: electrical systems (loops) ----------
{
  const bolt = poly(
    [
      [112, 26],
      [56, 112],
      [96, 112],
      [84, 176],
      [146, 84],
      [104, 84],
    ],
    true,
  );
  save(
    'bolt',
    comp('bolt', 60, [
      gr('bolt', [sh(bolt), st(INK, 7), fl(YEL)], {
        p: [100, 100],
        a: [100, 100],
        s: A([
          [0, [100, 100], 'inOut'],
          [8, [112, 112], 'inOut'],
          [16, [100, 100], 'linear'],
          [60, [100, 100]],
        ]),
      }),
    ]),
  );
}
