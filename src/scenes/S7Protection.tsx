import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {font, theme} from '../theme';
import {DrawPath} from '../components/DrawPath';
import {LottieIcon} from '../components/LottieIcon';
import {Occupant} from '../components/Icons';
import {E, jitter, pop, tw} from '../lib/anim';

// "¿Y hasta dónde llega la protección que ofrece?"
// Scene starts at abs 816. Local: hasta dónde 6 · llega 34 · protección 49 · ofrece 67.
// Rounds strike an armour section; the gauge of how far it holds settles on a question.

const SLAB = {x: 650, y: 250, w: 140, h: 640};
const HITS: {y: number; t: number; depth: number}[] = [
  {y: 390, t: 22, depth: 34},
  {y: 575, t: 30, depth: 52},
  {y: 735, t: 38, depth: 40},
];
const G = {x: 1430, y: 650, r: 250};
const deg = (d: number) => (d * Math.PI) / 180;
const onArc = (a: number, r: number): [number, number] => [G.x + Math.cos(deg(a)) * r, G.y + Math.sin(deg(a)) * r];
const arc = (a0: number, a1: number, r: number) => {
  const [x0, y0] = onArc(a0, r);
  const [x1, y1] = onArc(a1, r);
  return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}`;
};

const crack = (y: number, depth: number, seed: string) => {
  let d = `M${SLAB.x},${y}`;
  const steps = 5;
  for (let i = 1; i <= steps; i++) {
    d += ` L${SLAB.x + (depth * i) / steps},${y + jitter(`${seed}${i}`, 9)}`;
  }
  const b = SLAB.x + depth * 0.45;
  d += ` M${b},${y} l${10 + jitter(`${seed}b`, 4)},-22 l8,-12 M${b},${y} l14,20 l4,14`;
  return d;
};

const Bullet: React.FC<{y: number; t: number}> = ({y, t}) => {
  const frame = useCurrentFrame();
  if (frame < t - 8 || frame >= t) return null;
  const x = tw(frame, t - 8, t, -120, SLAB.x - 58, E.linear);
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-70,-4 H-20 M-90,6 H-30" stroke={theme.inkSoft} strokeWidth={3} strokeLinecap="round" />
      <path d="M0,-10 H34 C47,-10 55,-4 58,0 C55,4 47,10 34,10 H0 Z" fill={theme.g1} stroke={theme.ink} strokeWidth={2} />
    </g>
  );
};

export const S7Protection: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = tw(frame, 0, 114, 1, 1.06, E.linear);
  const paste = tw(frame, 4, 18, 0, 1, E.out);
  const band = tw(frame, 40, 52, 0, 1, E.quad);
  const rise = tw(frame, 34, 62, 180, 316, E.back);
  const needle = frame > 62 ? rise + Math.sin((frame - 62) / 4.5) * 11 * tw(frame, 62, 70) : rise;
  const tip = onArc(needle, 212);
  const q = pop(frame, 67);

  return (
    <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '1000px 560px'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="slab-hatch" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0 V12" stroke={theme.ink} strokeWidth={1.4} opacity={0.4} />
          </pattern>
          <pattern id="slab-dots" width={7} height={7} patternUnits="userSpaceOnUse">
            <circle cx={3.5} cy={3.5} r={1.3} fill={theme.paper} opacity={0.35} />
          </pattern>
          <clipPath id="slab-paste">
            <rect x={SLAB.x - 20} y={SLAB.y} width={SLAB.w + 40} height={SLAB.h * paste} />
          </clipPath>
        </defs>

        {/* armour section: steel face, composite core, liner */}
        <g clipPath="url(#slab-paste)">
          <rect x={SLAB.x + 6} y={SLAB.y + 10} width={SLAB.w} height={SLAB.h} fill={theme.ink} opacity={0.15} />
          <rect x={SLAB.x} y={SLAB.y} width={44} height={SLAB.h} fill={theme.g2} />
          <rect x={SLAB.x} y={SLAB.y} width={44} height={SLAB.h} fill="url(#slab-dots)" />
          <rect x={SLAB.x + 44} y={SLAB.y} width={66} height={SLAB.h} fill={theme.g4} />
          <rect x={SLAB.x + 44} y={SLAB.y} width={66} height={SLAB.h} fill="url(#slab-hatch)" />
          <rect x={SLAB.x + 110} y={SLAB.y} width={30} height={SLAB.h} fill={theme.g5} />
          <rect x={SLAB.x} y={SLAB.y} width={SLAB.w} height={SLAB.h} fill="none" stroke={theme.ink} strokeWidth={4} />
          <path d={`M${SLAB.x + 44},${SLAB.y} V${SLAB.y + SLAB.h} M${SLAB.x + 110},${SLAB.y} V${SLAB.y + SLAB.h}`} stroke={theme.ink} strokeWidth={2} />
        </g>

        {HITS.map((h, i) => (
          <g key={i}>
            <Bullet y={h.y} t={h.t} />
            <DrawPath d={crack(h.y, h.depth, `c${i}`)} start={h.t} duration={8} width={2.6} />
          </g>
        ))}

        {/* how far it got: a cote line at the deepest penetration */}
        <DrawPath d={`M${SLAB.x + 52},${SLAB.y - 30} V${SLAB.y + SLAB.h + 30}`} start={42} duration={14} width={2} color={theme.dataRed} dash={[10, 8]} />
        <DrawPath d={`M${SLAB.x},${SLAB.y + SLAB.h + 46} H${SLAB.x + 52}`} start={48} duration={8} width={2.4} />
        <DrawPath d={`M${SLAB.x},${SLAB.y + SLAB.h + 34} v24 M${SLAB.x + 52},${SLAB.y + SLAB.h + 34} v24`} start={52} duration={5} width={2.4} />

        <Occupant x={960} y={580} s={2.3 * pop(frame, 14)} helmet={theme.yellow} body={theme.g3} />

        {/* the gauge */}
        <path
          d={`${arc(288, 342, G.r - 26)}`}
          fill="none"
          stroke={theme.yellow}
          strokeWidth={40 * band}
          style={{mixBlendMode: 'multiply'}}
        />
        <DrawPath d={arc(180, 360, G.r)} start={18} duration={18} width={9} />
        {Array.from({length: 11}).map((_, i) => {
          const a = 180 + i * 18;
          const [x0, y0] = onArc(a, i % 5 === 0 ? G.r - 52 : G.r - 30);
          const [x1, y1] = onArc(a, G.r - 8);
          return <DrawPath key={i} d={`M${x0},${y0} L${x1},${y1}`} start={24 + i} duration={6} width={i % 5 === 0 ? 5 : 3} />;
        })}
        {frame >= 34 ? (
          <g>
            <path d={`M${G.x},${G.y} L${tip[0]},${tip[1]}`} stroke={theme.ink} strokeWidth={9} strokeLinecap="round" />
            <circle cx={G.x} cy={G.y} r={20} fill={theme.ink} />
            <circle cx={G.x} cy={G.y} r={8} fill={theme.yellow} />
          </g>
        ) : null}
        <DrawPath d={`M${G.x - G.r - 40},${G.y} H${G.x + G.r + 40}`} start={20} duration={14} width={3} />
      </svg>

      <LottieIcon name="shield" x={G.x} y={G.y + 150} size={180} start={49} badge />
      {HITS.map((h, i) => (
        <LottieIcon key={i} name="impact" x={SLAB.x} y={h.y} size={170} start={h.t} noPop exitAt={h.t + 40} />
      ))}

      {q > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: onArc(316, 345)[0] - 80,
            top: onArc(316, 345)[1] - 110,
            width: 160,
            height: 200,
            transform: `scale(${q}) rotate(8deg)`,
            fontFamily: font.display,
            fontWeight: 900,
            fontSize: 190,
            lineHeight: 1,
            color: theme.ink,
            textAlign: 'center',
          }}
        >
          ?
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
