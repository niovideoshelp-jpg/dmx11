import React from 'react';
import {Composition} from 'remotion';
import {loadFonts} from './fonts';
import {FPS, H, W} from './theme';
import {INTRO_FRAMES, Intro} from './Intro';

loadFonts();

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Intro"
    component={Intro}
    durationInFrames={INTRO_FRAMES}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{sfx: true}}
  />
);
