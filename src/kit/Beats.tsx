import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {sec} from '../theme';
import {Scene} from '../components/Scene';
import {E, tw} from '../lib/anim';

/** Narration second → frame inside the beat that starts at narration second `a`. */
export type At = (s: number) => number;

export type BeatDef = {
  a: number;
  b: number;
  name: string;
  push?: number;
  origin?: string;
  render: (at: At) => React.ReactNode;
};

/** One beat of a part: from narration second `a` to `b`. */
export const beat = (
  a: number,
  b: number,
  name: string,
  render: (at: At) => React.ReactNode,
  opts: {push?: number; origin?: string} = {},
): BeatDef => ({a, b, name, render, ...opts});

const EXIT = 12;

const Push: React.FC<{dur: number; to: number; origin: string; children: React.ReactNode}> = ({dur, to, origin, children}) => {
  const frame = useCurrentFrame();
  const s = tw(frame, 0, dur, 1, to, E.linear);
  return <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: origin}}>{children}</AbsoluteFill>;
};

/**
 * Lay beats on the timeline. Each one wipes out over the 12 frames after its end while the
 * next — rendered underneath — is already assembling, so the paper never shows a gap.
 */
export const Beats: React.FC<{beats: BeatDef[]; endFrame: number}> = ({beats, endFrame}) => (
  <>
    {beats
      .map((bt, i) => {
        const from = sec(bt.a);
        const last = i === beats.length - 1;
        const end = last ? endFrame : sec(bt.b);
        const dur = end - from + (last ? 0 : EXIT);
        return (
          <Scene key={bt.name} from={from} dur={dur} exitLen={last ? 0 : EXIT} name={bt.name}>
            <Push dur={dur} to={bt.push ?? 1.04} origin={bt.origin ?? '960px 540px'}>
              {bt.render((s) => sec(s) - from)}
            </Push>
          </Scene>
        );
      })
      .reverse()}
  </>
);
