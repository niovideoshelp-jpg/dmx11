import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {DrawPath} from '../components/DrawPath';
import {MEXICO_RINGS} from '../data/mexico';
import {E, circlePath, pop, tw} from '../lib/anim';

// The projected map occupies this box in its own coordinates (see scripts/build-map.mjs).
const BOX = {x: 930, y: 130};

/** Place the generated map anywhere: its top-left at (x, y), scaled by k. */
export const mapPoint = (pt: readonly number[], x: number, y: number, k: number): [number, number] => [
  x + (pt[0] - BOX.x) * k,
  y + (pt[1] - BOX.y) * k,
];

/**
 * Mexico as a pasted cut-out: the coast draws, the halftone paper fills behind it,
 * pins drop on places. Positions in `pins` are map coordinates (PLACES / CDMX).
 */
export const MapCard: React.FC<{
  x: number;
  y: number;
  k: number;
  start: number;
  pins?: {pt: readonly number[]; at: number}[];
  exitAt?: number;
  drawFor?: number;
}> = ({x, y, k, start, pins = [], exitAt, drawFor = 30}) => {
  const frame = useCurrentFrame();
  const paste = tw(frame, start + drawFor - 6, start + drawFor + 10, 0, 1, E.out);
  const out = exitAt === undefined ? 0 : tw(frame, exitAt, exitAt + 10, 0, 1, E.in);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  if (frame < start) return null;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <defs>
        <clipPath id={`mcp${id}`}>
          <rect x={900} y={960 - 860 * paste} width={1000} height={900} />
        </clipPath>
        <clipPath id={`mco${id}`}>
          <rect x={900 + 1000 * out} y={100} width={1000} height={900} />
        </clipPath>
        <pattern id="mc-dots" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx={4.5} cy={4.5} r={1.6} fill={theme.ink} opacity={0.38} />
        </pattern>
      </defs>
      <g transform={`translate(${x - BOX.x * k} ${y - BOX.y * k}) scale(${k})`} clipPath={`url(#mco${id})`}>
        <g clipPath={`url(#mcp${id})`}>
          {MEXICO_RINGS.map((d, i) => (
            <path key={i} d={d} fill={theme.g4} />
          ))}
          {MEXICO_RINGS.map((d, i) => (
            <path key={`h${i}`} d={d} fill="url(#mc-dots)" />
          ))}
        </g>
        {MEXICO_RINGS.map((d, i) => (
          <DrawPath key={i} d={d} start={start + i * 4} duration={i === 0 ? drawFor : 10} width={3 / k} easing={E.inOut} />
        ))}
        {pins.map((p, i) => {
          const s = Math.max(0, pop(frame, p.at) - out);
          return (
            <g key={i}>
              <DrawPath d={circlePath(p.pt[0], p.pt[1], 30 / k)} start={p.at + 2} duration={12} width={2.5 / k} out={exitAt} />
              <g transform={`translate(${p.pt[0]} ${p.pt[1]}) scale(${s / k})`}>
                <path d="M0,0 C-8,-16 -22,-30 -22,-46 A22,22 0 1,1 22,-46 C22,-30 8,-16 0,0 Z" fill={theme.dataRed} stroke={theme.ink} strokeWidth={3} />
                <circle cx={0} cy={-46} r={8} fill={theme.paper} />
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
