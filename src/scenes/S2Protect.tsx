import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {DrawPath} from '../components/DrawPath';
import {LottieIcon} from '../components/LottieIcon';
import {Occupant} from '../components/Icons';
import {PhotoPlate} from '../components/Photo';
import {E, pop, tornStrip, tw} from '../lib/anim';

// "exige un vehículo diseñado para proteger a quienes van dentro."
// Scene starts at abs 136. Local: vehículo 9 · diseñado 37 · proteger 61 · quienes van dentro 81.

const PX = 385;
const PY = 201;
const K = 1.42;

// Side hull of the troop compartment on img/dnxi.png (image px).
const HULL_SIDE = 'M399,163 L753,149 L759,329 L636,341 L611,371 L406,383 Z';
const SEATS: [number, number, number][] = [
  [452, 268, 1.0],
  [527, 264, 0.96],
  [600, 260, 0.92],
  [670, 256, 0.88],
  [732, 252, 0.84],
];

export const S2Protect: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = tw(frame, 0, 122, 1, 1.05, E.linear);
  const disc = pop(frame, 5);
  const strip = tw(frame, 14, 30, 0, 1, E.out);
  const xray = tw(frame, 81, 95, 0, 1, E.out);

  return (
    <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '960px 560px'}}>
      <div
        style={{
          position: 'absolute',
          left: 960 - 390,
          top: 520 - 390,
          width: 780,
          height: 780,
          borderRadius: '50%',
          backgroundColor: theme.yellow,
          transform: `scale(${disc})`,
          mixBlendMode: 'multiply',
        }}
      />

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {/* torn paper ground, pulled out from the left */}
        <g transform={`translate(300 0) scale(${strip} 1) translate(-300 0)`}>
          <path d={tornStrip(300, 1640, 880, 90, 'g1')} fill={theme.g5} />
          <path d={tornStrip(300, 1640, 912, 60, 'g2', 18, 5)} fill={theme.g4} />
        </g>

        {/* "diseñado": drafting cote lines measure the machine */}
        <DrawPath d="M398,1000 L1522,996" start={34} duration={16} width={2} color={theme.inkSoft} />
        <DrawPath d="M398,984 V1016 M1522,980 V1012" start={44} duration={6} width={2} color={theme.inkSoft} />
        <DrawPath d="M1590,262 L1594,900" start={38} duration={16} width={2} color={theme.inkSoft} />
        <DrawPath d="M1574,262 H1608 M1578,900 H1612" start={48} duration={6} width={2} color={theme.inkSoft} />

        {/* "proteger": a protective dome closes over it */}
        <DrawPath d="M330,905 C330,-110 1590,-110 1590,905" start={61} duration={18} width={16} color={theme.yellow} style={{mixBlendMode: 'multiply'}} />
        <DrawPath d="M330,905 C330,-110 1590,-110 1590,905" start={63} duration={18} width={3} color={theme.ink} dash={[14, 10]} />
      </svg>

      <PhotoPlate img="dnxi" x={PX} y={PY} k={K} start={10}>
        {/* "quienes van dentro": x-ray the compartment, the occupants appear */}
        <defs>
          <clipPath id="xray-wipe">
            <rect x={380} y={100} width={400 * xray} height={320} />
          </clipPath>
          <pattern id="xray-grid" width={14} height={14} patternUnits="userSpaceOnUse">
            <path d="M14 0 H0 V14" fill="none" stroke={theme.paper} strokeWidth={0.6} opacity={0.35} />
          </pattern>
        </defs>
        <g clipPath="url(#xray-wipe)">
          <path d={HULL_SIDE} fill={theme.ink} opacity={0.82} />
          <path d={HULL_SIDE} fill="url(#xray-grid)" />
          {SEATS.map(([x, y, s], i) => (
            <Occupant key={i} x={x} y={y} s={s * 0.9 * pop(frame, 86 + i * 4)} />
          ))}
        </g>
        <path
          d={HULL_SIDE}
          fill="none"
          stroke={theme.yellow}
          strokeWidth={3}
          strokeDasharray="1200 1200"
          strokeDashoffset={1200 * (1 - xray)}
        />
      </PhotoPlate>

      <LottieIcon name="shield" x={960} y={150} size={190} start={64} badge />
    </AbsoluteFill>
  );
};
