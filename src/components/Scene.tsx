import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {E, tw} from '../lib/anim';

/**
 * One scene on the shared paper. Content leaves behind a hard vertical edge (an ink
 * hairline rides the edge); the paper underneath never cuts.
 */
const Exit: React.FC<{dur: number; exitLen: number; children: React.ReactNode}> = ({dur, exitLen, children}) => {
  const frame = useCurrentFrame();
  const p = exitLen > 0 ? tw(frame, dur - exitLen, dur, 0, 1, E.in) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: p > 0 ? `inset(0 0 0 ${p * 100}%)` : undefined}}>{children}</AbsoluteFill>
      {p > 0 && p < 1 ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${p * 100}%`,
            width: 3,
            backgroundColor: theme.ink,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const Scene: React.FC<{
  from: number;
  dur: number;
  name: string;
  exitLen?: number;
  children: React.ReactNode;
}> = ({from, dur, name, exitLen = 10, children}) => (
  <Sequence from={from} durationInFrames={dur} name={name}>
    <Exit dur={dur} exitLen={exitLen}>
      {children}
    </Exit>
  </Sequence>
);
