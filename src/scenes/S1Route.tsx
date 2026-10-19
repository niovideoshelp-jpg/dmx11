import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {theme} from '../theme';
import {DrawPath} from '../components/DrawPath';
import {LottieIcon} from '../components/LottieIcon';
import {PhotoPlate} from '../components/Photo';
import {E, circlePath, jitter, pop, smoothClosed, tw} from '../lib/anim';

// "Transportar soldados por una zona donde los disparos pueden comenzar en cualquier momento"
// Absolute frames: soldados 17 · zona 44 · disparos 65 · cualquier momento 109.

const ROAD = 'M-80,700 C200,690 380,560 620,600 S980,820 1220,700 S1560,380 2000,420';
const ZONE = {x: 1150, y: 610, r: 300};
const HILLS: {x: number; y: number; rings: number; seed: string}[] = [
  {x: 930, y: 250, rings: 4, seed: 'a'},
  {x: 1650, y: 250, rings: 3, seed: 'b'},
  {x: 1590, y: 905, rings: 4, seed: 'c'},
  {x: 780, y: 990, rings: 3, seed: 'd'},
  {x: 260, y: 200, rings: 3, seed: 'e'},
];
const ORIGINS: [number, number][] = [
  [905, 300],
  [1575, 880],
  [1655, 300],
];
// [origin index, fire frame, road progress, offset x, offset y]
const SHOTS: [number, number, number, number, number][] = [
  [0, 65, 0.47, -30, -48],
  [1, 74, 0.55, 40, 40],
  [2, 84, 0.62, -35, -45],
  [1, 118, 0.68, 30, 46],
  [2, 128, 0.73, -22, -50],
];

const ringPath = (cx: number, cy: number, r: number, seed: string) => {
  const pts: [number, number][] = [];
  const n = 28;
  const ph = jitter(`${seed}-ph`, 3);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + 0.13 * Math.sin(3 * a + ph) + 0.06 * Math.sin(5 * a + ph * 2) + jitter(`${seed}-${r}-${i}`, 0.025));
    pts.push([cx + Math.cos(a) * rr * 1.35, cy + Math.sin(a) * rr * 0.8]);
  }
  return smoothClosed(pts);
};

const vehicleProgress = (f: number) => tw(f, 8, 146, 0.24, 0.8, E.linear);

const TopDownVehicle: React.FC<{x: number; y: number; angle: number}> = ({x, y, angle}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <ellipse cx={4} cy={6} rx={52} ry={26} fill={theme.ink} opacity={0.16} />
    {[-28, 26].map((wx) =>
      [-25, 19].map((wy) => <rect key={`${wx}${wy}`} x={wx - 9} y={wy} width={18} height={7} rx={2} fill={theme.g1} />),
    )}
    <rect x={-46} y={-21} width={92} height={42} rx={8} fill={theme.g4} stroke={theme.ink} strokeWidth={3} />
    <rect x={14} y={-19} width={30} height={38} rx={6} fill={theme.g3} />
    <rect x={18} y={-15} width={7} height={30} rx={2} fill={theme.g1} />
    <circle cx={-8} cy={0} r={11} fill={theme.g2} stroke={theme.ink} strokeWidth={2} />
    <path d="M-8,0 H22" stroke={theme.ink} strokeWidth={4} strokeLinecap="round" />
  </g>
);

export const S1Route: React.FC = () => {
  const frame = useCurrentFrame();
  const roadLen = useMemo(() => getLength(ROAD), []);
  const at = (p: number) => getPointAtLength(ROAD, roadLen * p) ?? {x: 0, y: 0};

  const vp = vehicleProgress(frame);
  const vpt = at(vp);
  const tan = getTangentAtLength(ROAD, roadLen * vp) ?? {x: 1, y: 0};
  const angle = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;

  const cam = tw(frame, 0, 146, 1, 1.07, E.linear);
  const zonePop = pop(frame, 44);
  const disc = pop(frame, 12);

  return (
    <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '1100px 600px'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="zone-hatch" width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0 V16" stroke={theme.dataRed} strokeWidth={3} />
          </pattern>
        </defs>

        {/* terrain: contour lines draw outward from each summit */}
        {HILLS.map((h, hi) =>
          Array.from({length: h.rings}).map((_, k) => (
            <DrawPath
              key={`${hi}-${k}`}
              d={ringPath(h.x, h.y, 34 + k * 38, h.seed)}
              start={hi * 3 + k * 4}
              duration={26}
              color={k === 0 ? theme.g3 : theme.g4}
              width={k === 0 ? 2.6 : 1.8}
            />
          )),
        )}

        {/* the danger zone */}
        <circle
          cx={ZONE.x}
          cy={ZONE.y}
          r={ZONE.r * zonePop}
          fill="url(#zone-hatch)"
          opacity={0.22}
        />
        <DrawPath d={circlePath(ZONE.x, ZONE.y, ZONE.r)} start={44} duration={20} color={theme.dataRed} width={3.5} dash={[16, 12]} />

        {/* the road: ink edges, paper bed, centre dashes */}
        <DrawPath d={ROAD} start={2} duration={34} width={50} color={theme.ink} cap="butt" />
        <DrawPath d={ROAD} start={2} duration={34} width={42} color={theme.g6} cap="butt" />
        <DrawPath d={ROAD} start={6} duration={34} width={3} color={theme.g3} dash={[18, 16]} />

        {/* where fire comes from */}
        {ORIGINS.map(([ox, oy], i) => (
          <g key={i}>
            <DrawPath d={`M${ox - 14},${oy - 14} L${ox + 14},${oy + 14}`} start={58 + i * 3} duration={5} color={theme.dataRed} width={5} />
            <DrawPath d={`M${ox + 14},${oy - 14} L${ox - 14},${oy + 14}`} start={61 + i * 3} duration={5} color={theme.dataRed} width={5} />
          </g>
        ))}

        {/* shots: dashed tracer from the hills to the road */}
        {SHOTS.map(([oi, t, p, dx, dy], i) => {
          const tgt = at(p);
          const [ox, oy] = ORIGINS[oi];
          return (
            <DrawPath
              key={i}
              d={`M${ox},${oy} L${tgt.x + dx},${tgt.y + dy}`}
              start={t}
              duration={6}
              out={t + 14}
              outDuration={8}
              color={theme.dataRed}
              width={3}
              dash={[12, 9]}
              easing={E.linear}
            />
          );
        })}

        <TopDownVehicle x={vpt.x} y={vpt.y} angle={angle} />
      </svg>

      {SHOTS.map(([, t, p, dx, dy], i) => {
        const tgt = at(p);
        return <LottieIcon key={i} name="impact" x={tgt.x + dx} y={tgt.y + dy} size={150} start={t + 6} noPop exitAt={t + 46} />;
      })}

      {/* the sight finds the vehicle and stays on it */}
      <LottieIcon name="crosshair" x={vpt.x} y={vpt.y} size={190} start={109} loop noPop />

      {/* the people being carried */}
      <div
        style={{
          position: 'absolute',
          left: 400 - 200,
          top: 650 - 200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          backgroundColor: theme.yellow,
          transform: `scale(${disc})`,
          mixBlendMode: 'multiply',
        }}
      />
      <PhotoPlate img="soldier" x={70} y={520} k={1.28} start={16} />
    </AbsoluteFill>
  );
};
