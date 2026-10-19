import React from 'react';
import {Composition, Folder, Series} from 'remotion';
import {loadFonts} from './fonts';
import {FPS, H, W} from './theme';
import {FilmProps} from './components/Film';
import {INTRO_FRAMES, Intro} from './Intro';
import {PART1_FRAMES, Part1} from './parts/Part1';
import {PART2_FRAMES, Part2} from './parts/Part2';
import {PART3_FRAMES, Part3} from './parts/Part3';
import {PART4_FRAMES, Part4} from './parts/Part4';
import {FINAL_FRAMES, Final} from './parts/Final';

loadFonts();

const PARTS: {id: string; component: React.FC<FilmProps>; frames: number}[] = [
  {id: 'Intro', component: Intro, frames: INTRO_FRAMES},
  {id: 'Parte1', component: Part1, frames: PART1_FRAMES},
  {id: 'Parte2', component: Part2, frames: PART2_FRAMES},
  {id: 'Parte3', component: Part3, frames: PART3_FRAMES},
  {id: 'Parte4', component: Part4, frames: PART4_FRAMES},
  {id: 'Final', component: Final, frames: FINAL_FRAMES},
];

/** The whole film: every part back to back on the same sheet of paper. */
const Completo: React.FC<FilmProps> = (props) => (
  <Series>
    {PARTS.map(({id, component: C, frames}) => (
      <Series.Sequence key={id} durationInFrames={frames} name={id}>
        <C {...props} />
      </Series.Sequence>
    ))}
  </Series>
);

const common = {fps: FPS, width: W, height: H, defaultProps: {sfx: true, music: true}};

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Partes">
      {PARTS.map(({id, component, frames}) => (
        <Composition key={id} id={id} component={component} durationInFrames={frames} {...common} />
      ))}
    </Folder>
    <Composition id="Completo" component={Completo} durationInFrames={PARTS.reduce((a, p) => a + p.frames, 0)} {...common} />
  </>
);
