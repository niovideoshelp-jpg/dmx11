import React from 'react';
import {Lottie, LottieAnimationData} from '@remotion/lottie';
import {Sequence, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {popInOut} from '../lib/anim';

import impact from '../lottie/impact.json';
import crosshair from '../lottie/crosshair.json';
import crosshairScreen from '../lottie/crosshair-screen.json';
import shield from '../lottie/shield.json';
import radio from '../lottie/radio.json';
import gear from '../lottie/gear.json';
import eye from '../lottie/eye.json';
import bolt from '../lottie/bolt.json';

export const LOTTIE = {
  impact,
  crosshair,
  crosshairScreen,
  shield,
  radio,
  gear,
  eye,
  bolt,
} as unknown as Record<string, LottieAnimationData>;
export type LottieKey = 'impact' | 'crosshair' | 'crosshairScreen' | 'shield' | 'radio' | 'gear' | 'eye' | 'bolt';

/**
 * A Lottie icon placed by its centre. The Lottie clock starts at `start`; the wrapper
 * adds the style's mark pop (and shrink-out at `exitAt`). `badge` sits it on a paper disc.
 */
export const LottieIcon: React.FC<{
  name: LottieKey;
  x: number;
  y: number;
  size: number;
  start: number;
  exitAt?: number;
  loop?: boolean;
  badge?: boolean;
  noPop?: boolean;
  playbackRate?: number;
}> = ({name, x, y, size, start, exitAt, loop = false, badge = false, noPop = false, playbackRate = 1}) => {
  const frame = useCurrentFrame();
  const s = noPop ? (frame >= start && (exitAt === undefined || frame < exitAt) ? 1 : 0) : popInOut(frame, start, exitAt);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        transform: `scale(${s})`,
      }}
    >
      {badge ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: theme.paper,
            border: `4px solid ${theme.ink}`,
            boxShadow: '0 6px 10px rgba(17,17,16,0.18)',
          }}
        />
      ) : null}
      <Sequence from={start} layout="none">
        <div style={{position: 'absolute', inset: badge ? size * 0.14 : 0}}>
          <Lottie animationData={LOTTIE[name]} loop={loop} playbackRate={playbackRate} style={{width: '100%', height: '100%'}} />
        </div>
      </Sequence>
    </div>
  );
};
