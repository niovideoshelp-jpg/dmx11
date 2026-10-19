import React from 'react';
import {useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {Occupant} from '../components/Icons';
import {DNXI_HULL_SIDE, DNXI_SEATS} from '../components/Photo';
import {E, pop, tw} from '../lib/anim';

/**
 * Child of a dnxi PhotoPlate: the troop compartment turns to x-ray from the front door
 * backwards and the occupants appear seat by seat.
 */
export const DnxiXray: React.FC<{at: number; id: string}> = ({at, id}) => {
  const frame = useCurrentFrame();
  const p = tw(frame, at, at + 14, 0, 1, E.out);
  if (p <= 0) return null;
  return (
    <>
      <defs>
        <clipPath id={`xr-${id}`}>
          <rect x={380} y={100} width={400 * p} height={320} />
        </clipPath>
        <pattern id={`xg-${id}`} width={14} height={14} patternUnits="userSpaceOnUse">
          <path d="M14 0 H0 V14" fill="none" stroke={theme.paper} strokeWidth={0.6} opacity={0.35} />
        </pattern>
      </defs>
      <g clipPath={`url(#xr-${id})`}>
        <path d={DNXI_HULL_SIDE} fill={theme.ink} opacity={0.82} />
        <path d={DNXI_HULL_SIDE} fill={`url(#xg-${id})`} />
        {DNXI_SEATS.map(([x, y, s], i) => (
          <Occupant key={i} x={x} y={y} s={s * 0.9 * pop(frame, at + 5 + i * 4)} />
        ))}
      </g>
      <path d={DNXI_HULL_SIDE} fill="none" stroke={theme.yellow} strokeWidth={3} strokeDasharray="1200 1200" strokeDashoffset={1200 * (1 - p)} />
    </>
  );
};
