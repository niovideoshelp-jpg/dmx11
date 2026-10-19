import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, VolumeProp, staticFile} from 'remotion';
import {Ground} from './Ground';
import {Grain} from './Grain';

/** [absolute frame, sfx file name in public/sfx, volume] */
export type Cue = [number, string, number];

export type FilmProps = {sfx: boolean; music?: boolean};

/**
 * The shell every part of the film shares: one sheet of paper underneath, grain on top,
 * the narration, a music bed and foley cues. Scenes go in as children; list later scenes
 * first so each outgoing scene wipes away to reveal the next one underneath it.
 */
export const Film: React.FC<
  FilmProps & {
    voice: string;
    bed?: {src: string; volume: VolumeProp; startFrom?: number};
    cues: Cue[];
    children: React.ReactNode;
  }
> = ({sfx, music = true, voice, bed, cues, children}) => (
  <AbsoluteFill>
    <Ground />
    {children}
    <Grain />

    <Audio src={staticFile(voice)} />
    {music && bed ? (
      <Audio src={staticFile(bed.src)} volume={bed.volume} trimBefore={bed.startFrom} />
    ) : null}
    {sfx
      ? cues.map(([f, name, volume], i) => (
          <Sequence key={i} from={f} durationInFrames={45} layout="none" name={`sfx ${name}`}>
            <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
          </Sequence>
        ))
      : null}
  </AbsoluteFill>
);
