import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts ship inside public/fonts so renders work offline and in CI without Google Fonts.
const faces: {family: string; file: string; weight: string; style?: string}[] = [
  {family: 'Playfair Display', file: 'playfair-display-latin-700-normal.woff2', weight: '700'},
  {family: 'Playfair Display', file: 'playfair-display-latin-900-normal.woff2', weight: '900'},
  {family: 'Playfair Display', file: 'playfair-display-latin-400-italic.woff2', weight: '400', style: 'italic'},
  {family: 'Playfair Display', file: 'playfair-display-latin-700-italic.woff2', weight: '700', style: 'italic'},
  {family: 'Permanent Marker', file: 'permanent-marker-latin-400-normal.woff2', weight: '400'},
  {family: 'Lato', file: 'lato-latin-700-normal.woff2', weight: '700'},
  {family: 'Lato', file: 'lato-latin-900-normal.woff2', weight: '900'},
];

export const loadFonts = () =>
  Promise.all(
    faces.map((f) =>
      loadFont({
        family: f.family,
        url: staticFile(`fonts/${f.file}`),
        weight: f.weight,
        style: f.style ?? 'normal',
        format: 'woff2',
      }),
    ),
  );
