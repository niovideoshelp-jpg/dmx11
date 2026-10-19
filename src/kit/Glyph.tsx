import React from 'react';
import {useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {DrawLines} from '../components/DrawPath';
import {E, pop, tw} from '../lib/anim';

/**
 * Hand-drawn line icons on a 100x100 grid. `lines` draw with the pen; `fill` is an
 * optional accent shape that pops in (yellow by default) once the outline lands.
 */
type GlyphDef = {lines: string[]; fill?: string};

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r},${cy} a${r},${r} 0 1,1 ${2 * r},0 a${r},${r} 0 1,1 ${-2 * r},0`;
const star = (cx: number, cy: number, r1: number, r2: number, n: number, rot = -90) => {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    const r = i % 2 === 0 ? r1 : r2;
    d += `${i === 0 ? 'M' : 'L'}${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)} `;
  }
  return d + 'Z';
};

export const GLYPHS: Record<string, GlyphDef> = {
  factory: {
    lines: ['M8,88 H92', 'M14,88 V48 L34,60 V48 L54,60 V48 L74,60 V30 H86 V88', 'M74,30 V14 H82 V30', 'M22,74 h9 M40,74 h9 M58,74 h9'],
    fill: 'M14,88 V48 L34,60 V48 L54,60 V48 L74,60 V30 H86 V88 Z',
  },
  city: {
    lines: ['M6,90 H94', 'M12,90 V54 H28 V90', 'M28,90 V30 H46 V90', 'M46,90 V62 H58 V90', 'M58,90 V40 H76 V90', 'M76,90 V58 H88 V90', 'M34,42 h6 M34,54 h6 M34,66 h6 M64,52 h6 M64,64 h6'],
  },
  road: {lines: ['M30,92 L44,10', 'M70,92 L56,10', 'M50,88 V76 M50,64 V54 M50,44 V36 M50,28 V22']},
  doc: {
    lines: ['M24,10 H64 L78,24 V90 H24 Z', 'M64,10 V24 H78', 'M34,40 H68 M34,52 H68 M34,64 H60 M34,76 H50'],
    fill: 'M24,10 H64 L78,24 V90 H24 Z',
  },
  wrench: {
    lines: ['M20,84 L56,48', 'M56,48 C48,34 56,16 74,16 L64,28 L68,38 L78,40 L88,30 C90,48 74,58 56,48', 'M20,84 a7,7 0 1,1 -1,-1'],
  },
  bolt: {lines: ['M50,12 L82,30 V66 L50,84 L18,66 V30 Z', circle(50, 48, 14), 'M40,48 H60'], fill: 'M50,12 L82,30 V66 L50,84 L18,66 V30 Z'},
  tire: {
    lines: [circle(50, 50, 40), circle(50, 50, 24), circle(50, 50, 7), 'M50,10 V18 M50,82 V90 M10,50 H18 M82,50 H90 M22,22 L28,28 M72,72 L78,78 M78,22 L72,28 M22,78 L28,72'],
    fill: circle(50, 50, 24),
  },
  gauge: {
    lines: ['M12,72 A40,40 0 1,1 88,72', 'M50,64 L74,36', 'M20,58 l6,2 M28,36 l5,4 M50,26 v6 M72,36 l-5,4 M80,58 l-6,2'],
    fill: circle(50, 64, 7),
  },
  weight: {lines: ['M34,38 C32,12 68,12 66,38', circle(50, 62, 28)], fill: circle(50, 62, 28)},
  engine: {lines: ['M18,40 H70 V78 H18 Z', 'M70,50 H86 V68 H70', 'M30,40 V28 H58 V40', 'M8,52 H18 M8,66 H18', 'M30,54 H58 M30,64 H58']},
  gearshift: {lines: ['M28,24 V60 M50,24 V60 M72,24 V60 M28,42 H72', 'M50,60 V90', circle(72, 24, 9)], fill: circle(72, 24, 9)},
  fuel: {
    lines: ['M20,90 V20 H60 V90', 'M12,90 H68', 'M28,30 H52 V48 H28 Z', 'M60,40 H72 L82,50 V76 a6,6 0 0 1 -12,0 V62 H60'],
    fill: 'M28,30 H52 V48 H28 Z',
  },
  mountain: {lines: ['M6,86 L36,34 L52,58 L66,40 L94,86 Z', 'M28,48 L36,34 L44,48'], fill: 'M6,86 L36,34 L52,58 L66,40 L94,86 Z'},
  box: {lines: ['M18,36 L50,22 L82,36 L50,50 Z', 'M18,36 V72 L50,86 V50', 'M82,36 V72 L50,86'], fill: 'M18,36 L50,22 L82,36 L50,50 Z'},
  camera: {lines: ['M12,34 H88 V80 H12 Z', circle(50, 57, 15), 'M34,34 L40,22 H60 L66,34'], fill: circle(50, 57, 15)},
  sun: {
    lines: [circle(50, 50, 16), 'M50,10 V22 M50,78 V90 M10,50 H22 M78,50 H90 M22,22 L30,30 M70,70 L78,78 M78,22 L70,30 M22,78 L30,70'],
    fill: circle(50, 50, 16),
  },
  moon: {lines: ['M60,14 A36,36 0 1,0 86,62 A28,28 0 1,1 60,14 Z'], fill: 'M60,14 A36,36 0 1,0 86,62 A28,28 0 1,1 60,14 Z'},
  thermo: {
    lines: ['M42,66 V20 a8,8 0 0 1 16,0 V66', circle(50, 76, 13), 'M62,28 h8 M62,40 h8 M62,52 h8'],
    fill: circle(50, 76, 13),
  },
  mine: {lines: ['M18,70 C18,38 82,38 82,70 Z', 'M10,70 H90', 'M50,44 V30', 'M38,30 H62'], fill: 'M18,70 C18,38 82,38 82,70 Z'},
  blast: {lines: [star(50, 52, 42, 22, 10)], fill: star(50, 52, 42, 22, 10)},
  coin: {
    lines: [circle(50, 50, 38), 'M50,22 V78', 'M63,34 C59,25 37,25 37,38 C37,50 63,48 63,62 C63,75 39,75 35,66'],
    fill: circle(50, 50, 38),
  },
  pencil: {lines: ['M18,84 L24,62 L68,18 L84,34 L40,78 Z', 'M24,62 L40,78', 'M60,26 L76,42'], fill: 'M68,18 L84,34 L76,42 L60,26 Z'},
  saw: {lines: [star(50, 50, 42, 32, 14), circle(50, 50, 8)], fill: circle(50, 50, 20)},
  spark: {
    lines: ['M58,44 L88,14', 'M30,72 L52,50', 'M30,72 L10,62 M30,72 L16,86 M30,72 L34,94 M30,72 L8,78 M30,72 L22,50'],
    fill: circle(30, 72, 6),
  },
  clipboard: {
    lines: ['M24,18 H76 V92 H24 Z', 'M40,10 H60 V24 H40 Z', 'M32,44 l6,6 l12,-12 M56,46 H68', 'M32,68 l6,6 l12,-12 M56,70 H68'],
    fill: 'M40,10 H60 V24 H40 Z',
  },
  bullet: {
    lines: ['M14,60 H60 C76,60 86,55 94,50 C86,45 76,40 60,40 H14 Z', 'M14,40 V60', 'M30,40 V60'],
    fill: 'M60,60 C76,60 86,55 94,50 C86,45 76,40 60,40 Z',
  },
  glass: {lines: ['M20,12 H80 V88 H20 Z', 'M32,34 L54,18 M32,52 L66,24 M50,80 L72,62']},
  plate: {
    lines: ['M14,18 H86 V82 H14 Z', circle(24, 28, 4), circle(76, 28, 4), circle(24, 72, 4), circle(76, 72, 4)],
    fill: 'M14,18 H86 V82 H14 Z',
  },
  target: {lines: [circle(50, 50, 38), circle(50, 50, 22), 'M40,40 l20,20 M60,40 l-20,20'], fill: circle(50, 50, 8)},
  speed: {lines: ['M8,36 H50 M18,50 H66 M8,64 H50', 'M62,42 H76 C84,42 90,46 94,50 C90,54 84,58 76,58 H62 Z']},
  person: {lines: [circle(50, 30, 15), 'M20,88 C20,58 80,58 80,88 Z'], fill: 'M20,88 C20,58 80,58 80,88 Z'},
  star: {lines: [star(50, 52, 40, 17, 5)], fill: star(50, 52, 40, 17, 5)},
  boot: {lines: ['M32,10 V60 L22,80 H82 C82,70 72,64 60,62 V10 Z', 'M22,80 V88 H82 V80'], fill: 'M32,10 V60 L22,80 H82 C82,70 72,64 60,62 V10 Z'},
  knight: {
    lines: ['M28,90 H78 C78,72 72,64 64,58 C72,52 76,42 72,32 C66,18 52,12 38,16 L30,24 L32,32 L22,44 L28,50 L40,46 C40,58 28,68 28,90 Z', circle(48, 28, 3)],
    fill: 'M28,90 H78 C78,72 72,64 64,58 C72,52 76,42 72,32 C66,18 52,12 38,16 L30,24 L32,32 L22,44 L28,50 L40,46 C40,58 28,68 28,90 Z',
  },
  parachute: {
    lines: ['M12,44 C12,6 88,6 88,44 Z', 'M12,44 L50,76 M88,44 L50,76 M36,44 L50,76 M64,44 L50,76', 'M44,76 H56 V90 H44 Z'],
    fill: 'M12,44 C12,6 88,6 88,44 Z',
  },
  shield: {
    lines: ['M50,8 C64,16 78,18 86,18 V48 C86,72 68,86 50,94 C32,86 14,72 14,48 V18 C22,18 36,16 50,8 Z', 'M34,50 L46,62 L68,38'],
    fill: 'M50,8 C64,16 78,18 86,18 V48 C86,72 68,86 50,94 C32,86 14,72 14,48 V18 C22,18 36,16 50,8 Z',
  },
  spring: {lines: ['M50,6 V16 L24,24 L76,34 L24,44 L76,54 L24,64 L76,74 L50,82 V94']},
  disc: {lines: [circle(50, 50, 38), circle(50, 50, 12), 'M50,18 v8 M50,74 v8 M18,50 h8 M74,50 h8'], fill: 'M82,50 A32,32 0 0 1 66,78 L58,64 A16,16 0 0 0 66,50 Z'},
  wheel: {lines: [circle(50, 50, 38), circle(50, 50, 8), 'M50,12 V42 M17,64 L43,54 M83,64 L57,54']},
  vehicle: {
    lines: ['M6,66 V36 Q6,28 14,28 H60 L70,42 H88 L94,50 V66 Z', circle(28, 68, 10), circle(74, 68, 10), 'M48,32 H58 L65,42 H48 Z'],
    fill: 'M6,66 V36 Q6,28 14,28 H60 L70,42 H88 L94,50 V66 Z',
  },
  radar: {lines: [circle(50, 54, 36), circle(50, 54, 20), 'M50,54 L78,30'], fill: circle(50, 54, 5)},
  question: {lines: ['M34,32 C34,14 66,14 66,32 C66,46 50,46 50,60 V64', 'M50,80 V82']},
};

export type GlyphName = keyof typeof GLYPHS;

export const Glyph: React.FC<{
  name: GlyphName;
  x: number;
  y: number;
  size: number;
  start: number;
  dur?: number;
  exitAt?: number;
  accent?: string | false;
  color?: string;
  width?: number;
}> = ({name, x, y, size, start, dur = 16, exitAt, accent = theme.yellow, color = theme.ink, width = 4.5}) => {
  const frame = useCurrentFrame();
  const g = GLYPHS[name];
  const out = exitAt === undefined ? 0 : tw(frame, exitAt, exitAt + 9, 0, 1, E.in);
  const p = Math.max(0, tw(frame, start, start + dur, 0, 1, E.out) - out);
  const f = Math.max(0, pop(frame, start + dur * 0.6) - out);
  if (p <= 0) return null;
  const k = size / 100;
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${k})`}>
      {g.fill && accent ? (
        <g transform={`translate(50 50) scale(${f}) translate(-50 -50)`}>
          <path d={g.fill} fill={accent} style={{mixBlendMode: 'multiply'}} />
        </g>
      ) : null}
      <DrawLines paths={g.lines} progress={p} color={color} width={width / Math.max(k, 0.35)} stagger={0.08} />
    </g>
  );
};
