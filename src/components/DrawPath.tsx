import React, {useId, useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {getLength} from '@remotion/paths';
import {S, theme} from '../theme';
import {E, tw} from '../lib/anim';

/**
 * The trim-path idiom: a stroke that draws itself instead of fading in.
 * Either frame-driven (start/duration) or driven by an explicit `progress` (0..1).
 * Path length is computed synchronously with @remotion/paths so the first frame is right.
 */
export const DrawPath: React.FC<{
  d: string;
  start?: number;
  duration?: number;
  progress?: number;
  out?: number;
  outDuration?: number;
  color?: string;
  width?: number;
  dash?: [number, number];
  dashOffset?: number;
  easing?: (t: number) => number;
  cap?: 'round' | 'butt';
  style?: React.CSSProperties;
}> = ({
  d,
  start = 0,
  duration = 15,
  progress,
  out,
  outDuration = 10,
  color = theme.ink,
  width = 3,
  dash,
  dashOffset = 0,
  easing = E.out,
  cap = 'round',
  style,
}) => {
  const frame = useCurrentFrame();
  const len = useMemo(() => Math.max(1, getLength(d)), [d]);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');

  const inP = progress ?? tw(frame, start, start + duration, 0, 1, easing);
  const outP = out === undefined ? 0 : tw(frame, out, out + outDuration, 0, 1, E.in);
  const visible = Math.max(0, inP - outP);
  if (visible <= 0) return null;

  const common = {
    d,
    fill: 'none',
    strokeWidth: width * S,
    strokeLinecap: cap,
    strokeLinejoin: 'round' as const,
  };

  if (!dash) {
    return (
      <path
        {...common}
        stroke={color}
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={len * (1 - visible)}
        style={style}
      />
    );
  }

  // Dashed strokes draw through a trimmed mask, so the dash pattern itself never slides.
  return (
    <g style={style}>
      <defs>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse">
          <path
            {...common}
            stroke="#fff"
            strokeWidth={(width + 4) * S}
            strokeDasharray={`${len} ${len}`}
            strokeDashoffset={len * (1 - visible)}
          />
        </mask>
      </defs>
      <path
        {...common}
        stroke={color}
        strokeDasharray={`${dash[0] * S} ${dash[1] * S}`}
        strokeDashoffset={dashOffset}
        mask={`url(#m${id})`}
      />
    </g>
  );
};

/** Several paths drawn as one gesture, each starting a little after the previous. */
export const DrawLines: React.FC<{
  paths: string[];
  progress: number;
  color?: string;
  width?: number;
  stagger?: number;
}> = ({paths, progress, color = theme.ink, width = 2.6, stagger}) => {
  const n = paths.length;
  const k = stagger ?? Math.min(0.05, 0.5 / Math.max(1, n));
  const span = Math.max(0.2, 1 - (n - 1) * k);
  return (
    <g>
      {paths.map((p, i) => (
        <DrawPath
          key={i}
          d={p}
          progress={Math.min(1, Math.max(0, (progress - i * k) / span))}
          color={color}
          width={width}
        />
      ))}
    </g>
  );
};
