// Bundle once, render many review stills: node scripts/stills.mjs 60 200 470 [--scale=0.5]
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const scale = Number((args.find((a) => a.startsWith('--scale=')) ?? '--scale=0.5').split('=')[1]);
const frames = args.filter((a) => !a.startsWith('--')).map(Number);

const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Intro', inputProps: {sfx: false}});
for (const frame of frames) {
  const output = path.join(root, 'out', 'stills', `f${String(frame).padStart(4, '0')}.jpg`);
  await renderStill({composition, serveUrl, output, frame, scale, imageFormat: 'jpeg', jpegQuality: 85, inputProps: {sfx: false}});
  console.log('still', frame, '->', output);
}
