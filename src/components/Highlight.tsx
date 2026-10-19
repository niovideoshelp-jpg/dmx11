import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {S, theme} from '../theme';

/**
 * Highlighter swipe behind a word. Grows from the left edge, overshoots the glyph box,
 * sits at a fraction of a degree off-axis, and — on exit — separates from the word by a
 * few frames. That mis-registration is a signature of the style, not a bug.
 */
export const Highlight: React.FC<{
  children: React.ReactNode;
  start?: number;
  duration?: number;
  exitAt?: number;
  color?: string;
  tilt?: number;
}> = ({children, start = 0, duration = 10, exitAt, color = theme.yellow, tilt = 0.4}) => {
  const frame = useCurrentFrame();

  const inScale = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // The rectangle leaves 3 frames before the word does.
  const outScale =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt - 3, exitAt + 7], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.quad),
        });

  const scaleX = Math.max(0, inScale - outScale);

  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span
        style={{
          position: 'absolute',
          left: -2 * S,
          right: -8 * S,
          top: '0.08em',
          bottom: '0.06em',
          backgroundColor: color,
          transform: `scaleX(${scaleX}) rotate(${tilt}deg)`,
          transformOrigin: 'left center',
          mixBlendMode: 'multiply',
        }}
      />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};
