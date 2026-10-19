import React from 'react';
import {useCurrentFrame} from 'remotion';
import {font, theme} from '../theme';
import {E, tw} from '../lib/anim';

const torn = 'polygon(0% 8%, 2% 0%, 98% 4%, 100% 0%, 99% 30%, 100% 62%, 98% 100%, 3% 96%, 0% 100%, 1% 66%, 0% 34%)';

/**
 * A strip of yellow tape with a marker label (the epigenetics reference).
 * The strip is pulled out from its left edge, the words follow 4 frames later.
 */
export const Tape: React.FC<{
  text: string;
  x: number;
  y: number;
  start: number;
  exitAt?: number;
  size?: number;
  rotate?: number;
  color?: string;
  ink?: string;
}> = ({text, x, y, start, exitAt, size = 44, rotate = -3, color = theme.yellow, ink = theme.ink}) => {
  const frame = useCurrentFrame();
  const out = exitAt === undefined ? 0 : tw(frame, exitAt, exitAt + 9, 0, 1, E.in);
  const strip = Math.max(0, tw(frame, start, start + 10, 0, 1, E.quad) - out);
  const words = Math.max(0, tw(frame, start + 4, start + 16, 0, 1, E.out) - tw(frame, (exitAt ?? 1e9) - 3, (exitAt ?? 1e9) + 6, 0, 1, E.in));
  if (strip <= 0 && words <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: '0 50%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: `-${size * 0.16}px -${size * 0.38}px`,
          backgroundColor: color,
          clipPath: torn,
          transform: `scaleX(${strip})`,
          transformOrigin: '0 50%',
          mixBlendMode: 'multiply',
          boxShadow: '0 2px 0 rgba(0,0,0,0.04)',
        }}
      />
      <div
        style={{
          position: 'relative',
          fontFamily: font.marker,
          fontSize: size,
          lineHeight: 1.1,
          color: ink,
          whiteSpace: 'nowrap',
          clipPath: `inset(0 ${(1 - words) * 100}% 0 0)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Small technical caption (the chart labels of the references), revealed behind a moving edge. */
export const Label: React.FC<{
  text: string;
  x: number;
  y: number;
  start: number;
  exitAt?: number;
  size?: number;
  align?: 'left' | 'right' | 'center';
  color?: string;
}> = ({text, x, y, start, exitAt, size = 20, align = 'left', color = theme.ink}) => {
  const frame = useCurrentFrame();
  const inP = tw(frame, start, start + 12, 0, 1, E.out);
  const outP = exitAt === undefined ? 0 : tw(frame, exitAt, exitAt + 8, 0, 1, E.in);
  const p = Math.max(0, inP - outP);
  if (p <= 0) return null;
  const shift = align === 'right' ? '-100%' : align === 'center' ? '-50%' : '0';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${shift}, -50%)`,
        fontFamily: font.label,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color,
        whiteSpace: 'nowrap',
        clipPath: align === 'right' ? `inset(0 0 0 ${(1 - p) * 100}%)` : `inset(0 ${(1 - p) * 100}% 0 0)`,
      }}
    >
      {text}
    </div>
  );
};
