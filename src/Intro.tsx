import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, interpolate, staticFile} from 'remotion';
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

export type IntroProps = {sfx: boolean; music?: boolean};

// Foley cues on the absolute clock: [frame, file, volume]. Effects come from Magnific
// (ElevenLabs SFX), peak-normalised to -1 dBFS, so these volumes are the mix.
// Transition whooshes sit well under everything else.
const WHOOSH = 0.06;
const CUES: [number, string, number][] = [
  [14, 'paper', 0.14],
  [71, 'impact', 0.18],
  [80, 'impact', 0.15],
  [90, 'impact', 0.17],
  [109, 'pop', 0.12],
  [124, 'impact', 0.14],
  [134, 'whoosh', WHOOSH],
  [200, 'pop', 0.12],
  [222, 'pop', 0.08],
  [244, 'whoosh', WHOOSH],
  [302, 'pop', 0.12],
  [327, 'paper', 0.14],
  [393, 'whoosh', WHOOSH],
  [410, 'paper', 0.12],
  [467, 'thud', 0.36],
  [509, 'pop', 0.09],
  [513, 'pop', 0.08],
  [517, 'pop', 0.09],
  [521, 'pop', 0.08],
  [551, 'stamp', 0.34],
  [595, 'whoosh', 0.08],
  [647, 'paper', 0.12],
  [667, 'pop', 0.1],
  [716, 'whoosh', WHOOSH],
  [768, 'pop', 0.1],
  [794, 'pop', 0.08],
  [800, 'pop', 0.08],
  [806, 'pop', 0.08],
  [814, 'whoosh', WHOOSH],
  [838, 'armor', 0.22],
  [846, 'armor', 0.19],
  [854, 'armor', 0.22],
  [865, 'pop', 0.12],
  [883, 'pop', 0.12],
];

// Music bed (Magnific, Google Lyria 3 Pro), cut so its pulse enters with the DN-XI at 4.7 s
// and its hits land on "realmente mexicano" at 26 s. ~14 dB under the voice, lifted once
// the narration ends at 29.8 s; fades are baked into the file.
const VOICE_END = 893;
const musicVolume = (f: number) => interpolate(f, [VOICE_END, VOICE_END + 12], [0.11, 0.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Intro: React.FC<IntroProps> = ({sfx, music = true}) => (
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
    {music ? <Audio src={staticFile('music/bed.mp3')} volume={musicVolume} /> : null}
    {sfx
      ? CUES.map(([f, name, volume], i) => (
          <Sequence key={i} from={f} durationInFrames={30} layout="none" name={`sfx ${name}`}>
            <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
          </Sequence>
        ))
      : null}
  </AbsoluteFill>
);
