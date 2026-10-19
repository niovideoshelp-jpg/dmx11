import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

/**
 * Animated film grain from 8 pre-baked noise plates, reseeding every other frame —
 * static grain reads as a dirty lens, moving grain reads as film. The one legitimate
 * opacity effect in the style.
 */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.75}) => {
  const frame = useCurrentFrame();
  const plate = Math.floor(frame / 2) % 8;
  const flip = Math.floor(frame / 16) % 2 === 0 ? 1 : -1;
  // Plates are light/dark specks with alpha, so they composite without blend modes.
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <Img
        src={staticFile(`tex/grain_${plate}.png`)}
        style={{width: '100%', height: '100%', transform: `scaleX(${flip})`}}
      />
    </AbsoluteFill>
  );
};
