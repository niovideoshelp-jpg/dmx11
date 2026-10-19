import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {Ground} from './components/Ground';
import {Grain} from './components/Grain';
import {Scene} from './components/Scene';
import {S1Route} from './scenes/S1Route';
import {S2Protect} from './scenes/S2Protect';
import {S3Mexico} from './scenes/S3Mexico';
import {S4Build} from './scenes/S4Build';
import {S6Question} from './scenes/S6Question';
import {S7Protection} from './scenes/S7Protection';

export const INTRO_FRAMES = 930;

export type IntroProps = {sfx: boolean};

// Foley cues on the absolute clock: [frame, file, volume]. Kept low under the voice.
const CUES: [number, string, number][] = [
  [14, 'paper', 0.3],
  [71, 'impact', 0.32],
  [80, 'impact', 0.28],
  [90, 'impact', 0.3],
  [109, 'pop', 0.35],
  [124, 'impact', 0.26],
  [134, 'whoosh', 0.22],
  [200, 'pop', 0.3],
  [222, 'pop', 0.18],
  [244, 'whoosh', 0.22],
  [302, 'pop', 0.3],
  [327, 'paper', 0.28],
  [393, 'whoosh', 0.2],
  [410, 'paper', 0.25],
  [467, 'thud', 0.75],
  [509, 'pop', 0.22],
  [513, 'pop', 0.2],
  [517, 'pop', 0.22],
  [521, 'pop', 0.2],
  [551, 'stamp', 0.75],
  [595, 'whoosh', 0.26],
  [647, 'paper', 0.26],
  [667, 'pop', 0.25],
  [716, 'whoosh', 0.22],
  [768, 'pop', 0.25],
  [794, 'pop', 0.18],
  [800, 'pop', 0.18],
  [806, 'pop', 0.18],
  [814, 'whoosh', 0.2],
  [838, 'impact', 0.4],
  [846, 'impact', 0.36],
  [854, 'impact', 0.4],
  [865, 'pop', 0.3],
  [883, 'pop', 0.3],
];

export const Intro: React.FC<IntroProps> = ({sfx}) => (
  <AbsoluteFill>
    <Ground />

    {/* Later scenes sit underneath: the outgoing scene wipes away to reveal the next. */}
    <Scene from={816} dur={114} exitLen={0} name="6 · ¿Hasta dónde protege?">
      <S7Protection />
    </Scene>
    <Scene from={718} dur={108} name="5 · ¿Qué tanto es mexicano?">
      <S6Question />
    </Scene>
    <Scene from={395} dur={333} name="4 · Base, blindaje, sistemas, armas">
      <S4Build />
    </Scene>
    <Scene from={248} dur={157} name="3 · México · DN-XI">
      <S3Mexico />
    </Scene>
    <Scene from={136} dur={122} name="2 · Proteger a quienes van dentro">
      <S2Protect />
    </Scene>
    <Scene from={0} dur={146} name="1 · Zona de disparos">
      <S1Route />
    </Scene>

    <Grain />

    <Audio src={staticFile('audio/intro.mp3')} />
    {sfx
      ? CUES.map(([f, name, volume], i) => (
          <Sequence key={i} from={f} durationInFrames={30} layout="none" name={`sfx ${name}`}>
            <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
          </Sequence>
        ))
      : null}
  </AbsoluteFill>
);
