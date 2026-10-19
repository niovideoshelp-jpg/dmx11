import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {theme} from '../theme';

/**
 * The single ground for the whole film: warm paper, fibre texture, a drafting grid
 * (the graph paper of the references), fold shadows and a vignette. It drifts
 * constantly so no frame is ever truly still. It never cuts.
 */
export const Ground: React.FC = () => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 90) * 7;
  const dy = Math.cos(frame / 130) * 5;
  const pitch = 54;

  return (
    <AbsoluteFill style={{backgroundColor: theme.paper}}>
      <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) scale(1.03)`}}>
        <Img src={staticFile('tex/paper_color.jpg')} style={{width: '100%', height: '100%'}} />
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
          <defs>
            <pattern id="grid-minor" width={pitch} height={pitch} patternUnits="userSpaceOnUse">
              <path d={`M${pitch} 0 H0 V${pitch}`} fill="none" stroke={theme.inkFaint} strokeWidth={1} />
            </pattern>
            <pattern id="grid-major" width={pitch * 5} height={pitch * 5} patternUnits="userSpaceOnUse">
              <path d={`M${pitch * 5} 0 H0 V${pitch * 5}`} fill="none" stroke={theme.inkFaint} strokeWidth={1.6} />
            </pattern>
            <linearGradient id="fold-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000" stopOpacity={0} />
              <stop offset="47%" stopColor="#000" stopOpacity={0.035} />
              <stop offset="50%" stopColor="#fff" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#000" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fold-b" x1="1" y1="0" x2="0.2" y2="1">
              <stop offset="0%" stopColor="#000" stopOpacity={0} />
              <stop offset="62%" stopColor="#000" stopOpacity={0.025} />
              <stop offset="64%" stopColor="#fff" stopOpacity={0.035} />
              <stop offset="100%" stopColor="#000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-minor)" opacity={0.6} />
          <rect width="100%" height="100%" fill="url(#grid-major)" opacity={0.42} />
          <rect width="100%" height="100%" fill="url(#fold-a)" />
          <rect width="100%" height="100%" fill="url(#fold-b)" />
        </svg>
      </AbsoluteFill>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor={theme.paperDeep} stopOpacity={0} />
            <stop offset="100%" stopColor={theme.inkFaint} stopOpacity={0.55} />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#vignette)" style={{mixBlendMode: 'multiply'}} />
      </svg>
    </AbsoluteFill>
  );
};
