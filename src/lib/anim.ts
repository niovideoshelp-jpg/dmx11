import {gsap} from 'gsap';
import {interpolate, random, spring} from 'remotion';

/** GSAP's ease library as plain (t) => t functions, usable as Remotion easings. */
const ge = (name: string) => gsap.parseEase(name) as (t: number) => number;
export const E = {
  out: ge('power3.out'),
  in: ge('power3.in'),
  inOut: ge('power2.inOut'),
  quad: ge('power1.out'),
  back: ge('back.out(1.7)'),
  expo: ge('expo.out'),
  elastic: ge('elastic.out(1, 0.55)'),
  linear: ge('none'),
};

/** Clamped interpolate between two frames. */
export const tw = (
  frame: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = E.out,
) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** The style's mark pop: 8–10 frames, slight overshoot. */
export const pop = (frame: number, start: number, fps = 30) =>
  spring({frame: frame - start, fps, config: {damping: 12, mass: 0.6}});

/** Pop in at `start`, shrink out at `exitAt`. */
export const popInOut = (frame: number, start: number, exitAt?: number) =>
  Math.max(0, pop(frame, start) - (exitAt === undefined ? 0 : tw(frame, exitAt, exitAt + 8, 0, 1, E.in)));

/** Seeded jitter so hand-made shapes are stable across renders. */
export const jitter = (seed: string | number, amount: number) => (random(seed) - 0.5) * 2 * amount;

/** Closed Catmull-Rom spline through points → smooth SVG path. */
export const smoothClosed = (pts: [number, number][]) => {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + ' Z';
};

/** Circle as a path string (so it can be trim-drawn). Starts at 9 o'clock, clockwise. */
export const circlePath = (cx: number, cy: number, r: number) =>
  `M${cx - r},${cy} a${r},${r} 0 1,1 ${2 * r},0 a${r},${r} 0 1,1 ${-2 * r},0`;

/** Torn paper edge: a strip whose top edge is ragged. */
export const tornStrip = (x0: number, x1: number, y: number, h: number, seed: string, step = 14, amp = 7) => {
  let d = `M${x0},${y + h}`;
  for (let x = x0; x <= x1; x += step) {
    d += ` L${x},${(y + jitter(`${seed}-${x}`, amp)).toFixed(1)}`;
  }
  return `${d} L${x1},${y + h} Z`;
};
