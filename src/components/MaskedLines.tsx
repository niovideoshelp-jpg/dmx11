import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

/**
 * Body copy and headlines reveal line by line behind a moving edge — never per character,
 * never by opacity. Pass one array entry per visual line.
 */
export const MaskedLines: React.FC<{
  lines: React.ReactNode[];
  start?: number;
  stagger?: number;
  duration?: number;
  exitAt?: number;
  style?: React.CSSProperties;
}> = ({lines, start = 0, stagger = 4, duration = 12, exitAt, style}) => {
  const frame = useCurrentFrame();

  return (
    <div style={style}>
      {lines.map((line, i) => {
        const s = start + i * stagger;
        const inP = interpolate(frame, [s, s + duration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const outP =
          exitAt === undefined
            ? 0
            : interpolate(frame, [exitAt + i * 2, exitAt + i * 2 + 8], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.in(Easing.cubic),
              });
        const reveal = Math.max(0, inP - outP);
        return (
          <div
            key={i}
            style={{
              clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
              willChange: 'clip-path',
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
