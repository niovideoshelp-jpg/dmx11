import React from 'react';
import {useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {LottieIcon} from '../components/LottieIcon';
import {Operator} from '../components/Icons';
import {E, pop, tw} from '../lib/anim';

/**
 * The operator's console from the inside of the cabin, taped to the page: seated figure,
 * joystick that moves from `moveAt`, and the weapon camera feed with a sight on it.
 * Drawn at 540x380 and scaled by `k`.
 */
export const ConsoleCard: React.FC<{x: number; y: number; k?: number; start: number; moveAt?: number; exitAt?: number; rot?: number}> = ({
  x,
  y,
  k = 1,
  start,
  moveAt,
  exitAt,
  rot = 2,
}) => {
  const frame = useCurrentFrame();
  const inP = tw(frame, start, start + 14, 0, 1, E.out);
  const outP = exitAt === undefined ? 0 : tw(frame, exitAt, exitAt + 10, 0, 1, E.in);
  const card = Math.max(0, inP - outP);
  if (card <= 0) return null;
  const m = moveAt === undefined ? -1 : frame - moveAt;
  const tilt = m > 0 ? Math.sin(m / 7) * 16 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 540, height: 380, transform: `scale(${k}) rotate(${rot - card * 0.8}deg)`, transformOrigin: '0 0'}}>
      <div style={{position: 'absolute', inset: -24, clipPath: `inset(0 0 ${(1 - card) * 100}% 0)`}}>
        <div style={{position: 'absolute', inset: 24}}>
          <div style={{position: 'absolute', inset: 0, backgroundColor: theme.g6, border: `3px solid ${theme.ink}`, boxShadow: '0 10px 18px rgba(17,17,16,0.22)'}} />
          <svg width={540} height={380} viewBox="0 0 540 380" style={{position: 'absolute', inset: 0}}>
            <path d="M0,330 H540" stroke={theme.g4} strokeWidth={2} />
            <g transform="translate(-10 -6) scale(0.95)">
              <Operator tilt={tilt} />
            </g>
            <rect x={300} y={70} width={210} height={150} rx={8} fill={theme.g1} stroke={theme.ink} strokeWidth={4} />
            <path d="M330,190 L370,160 L410,175 L470,140 L490,150" fill="none" stroke={theme.g3} strokeWidth={2} />
          </svg>
          <LottieIcon name="crosshairScreen" x={405 + tilt * 1.6} y={145 - tilt * 0.4} size={120} start={start + 8} loop noPop />
        </div>
      </div>
      {[
        [-28, -14, -8],
        [470, -16, 7],
      ].map(([tx, ty, r], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: tx,
            top: ty,
            width: 100,
            height: 34,
            backgroundColor: theme.yellow,
            opacity: 0.85,
            transform: `rotate(${r}deg) scaleX(${Math.max(0, pop(frame, start + 10 + i * 3) - outP)})`,
            mixBlendMode: 'multiply',
          }}
        />
      ))}
    </div>
  );
};
