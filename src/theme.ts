export const theme = {
  paper: '#EFEDE8',
  paperDeep: '#E4E1DA',
  ink: '#111110',
  inkSoft: '#4A4844',
  inkFaint: '#B9B5AC',
  yellow: '#F2E51D',
  dataRed: '#E8574B',
  dataBlue: '#6F93D6',
  // Paper cut-out greys, dark to light (the Geneva reference): values of ink, not new colours.
  g1: '#2A2927',
  g2: '#55534F',
  g3: '#85827C',
  g4: '#A9A59E',
  g5: '#CFCBC3',
  g6: '#E0DCD4',
} as const;

export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** Design at 1920x1080 and multiply every size by S. */
export const S = W / 1920;

export const font = {
  display: '"Playfair Display", Georgia, serif',
  marker: '"Permanent Marker", "Comic Sans MS", cursive',
  label: '"Lato", "Helvetica Neue", Arial, sans-serif',
};

/** Seconds on the narration clock → absolute frame. */
export const sec = (s: number) => Math.round(s * FPS);
