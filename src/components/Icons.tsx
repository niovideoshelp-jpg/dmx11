import React from 'react';
import {theme} from '../theme';

/** Front-view seated occupant: helmet, face, shoulders. ~70 units tall, centred on the face. */
export const Occupant: React.FC<{x: number; y: number; s: number; helmet?: string; body?: string}> = ({
  x,
  y,
  s,
  helmet = theme.yellow,
  body = theme.paper,
}) => {
  if (s <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-34,34 C-34,15 -20,10 0,10 C20,10 34,15 34,34 Z" fill={body} />
      <ellipse cx={0} cy={-4} rx={13} ry={15} fill={body} />
      <path d="M-22,-16 C-22,-46 22,-46 22,-16 L27,-12 L-27,-12 Z" fill={helmet} stroke={theme.ink} strokeWidth={2} />
    </g>
  );
};

/** Side-view operator at a console: screen in front, hand on a joystick that tilts. */
export const Operator: React.FC<{tilt: number}> = ({tilt}) => {
  const a = (tilt * Math.PI) / 180;
  const stickTop: [number, number] = [262 + Math.sin(a) * 46, 248 - Math.cos(a) * 46];
  return (
    <g>
      {/* seat */}
      <path d="M70,170 L82,300 L170,300" fill="none" stroke={theme.g2} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      {/* body */}
      <path d="M96,160 C92,200 100,250 112,288 L170,290 L172,262 L136,250 C130,215 128,190 126,160 Z" fill={theme.g3} stroke={theme.ink} strokeWidth={3} />
      <path d="M150,288 L232,282 L240,352 L216,354 L210,312 L150,316 Z" fill={theme.g3} stroke={theme.ink} strokeWidth={3} />
      {/* arm to the stick */}
      <path d={`M122,190 L170,232 L${stickTop[0] - 6},${stickTop[1] + 4}`} fill="none" stroke={theme.g2} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
      {/* head + helmet */}
      <circle cx={124} cy={128} r={22} fill={theme.g5} stroke={theme.ink} strokeWidth={3} />
      <path d="M96,124 C94,84 152,80 154,116 L160,122 L92,128 Z" fill={theme.yellow} stroke={theme.ink} strokeWidth={3} />
      {/* joystick */}
      <rect x={244} y={248} width={36} height={14} rx={3} fill={theme.g1} />
      <path d={`M262,250 L${stickTop[0]},${stickTop[1]}`} stroke={theme.ink} strokeWidth={7} strokeLinecap="round" />
      <circle cx={stickTop[0]} cy={stickTop[1]} r={9} fill={theme.dataRed} stroke={theme.ink} strokeWidth={2} />
      {/* console + screen arm */}
      <path d="M232,262 L330,262 L330,360" fill="none" stroke={theme.g2} strokeWidth={10} />
      <path d="M300,200 L300,262" stroke={theme.g2} strokeWidth={8} />
    </g>
  );
};
