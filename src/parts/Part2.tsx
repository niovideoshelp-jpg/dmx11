import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {sec, theme} from '../theme';
import {Cue, Film, FilmProps} from '../components/Film';
import {DrawPath} from '../components/DrawPath';
import {Highlight} from '../components/Highlight';
import {LottieIcon} from '../components/LottieIcon';
import {CHASSIS_ON_DNXI, PhotoPlate} from '../components/Photo';
import {Label, Tape} from '../components/Tape';
import {At, beat, Beats} from '../kit/Beats';
import {Arrow, DocCard, Headline, IconTile, PersonCard, Pictos} from '../kit/Blocks';
import {Glyph} from '../kit/Glyph';
import {MapCard, mapPoint} from '../kit/MapCard';
import {PLACES} from '../data/mexico';
import {E, pop, tw} from '../lib/anim';

// Parte 2 — qué se hace en México (79,3 s).
export const PART2_FRAMES = sec(79.3) + 24;

/** The DN-XI body scans away left to right and the commercial chassis is left standing. */
const ChassisReveal: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const X = 230;
  const Y = 210;
  const K = 1.3;
  const w = 810 * K;
  const p = tw(frame, at(1.3), at(3.4), 0, 1, E.inOut);
  const edge = X + w * p;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${edge}px)`}}>
        <PhotoPlate img="dnxi" x={X} y={Y} k={K} start={at(0.2)} />
      </div>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${1920 - edge}px 0 0)`}}>
        <PhotoPlate img="chassis" x={X + CHASSIS_ON_DNXI.x * K} y={Y + CHASSIS_ON_DNXI.y * K} k={K * CHASSIS_ON_DNXI.s} dir="none" />
      </div>
      {p > 0 && p < 1 ? <div style={{position: 'absolute', left: edge - 4, top: Y - 40, width: 8, height: 760, backgroundColor: theme.yellow, mixBlendMode: 'multiply'}} /> : null}
    </>
  );
};

const LoopDiagram: React.FC<{at: At}> = ({at}) => {
  const cx = 960;
  const cy = 560;
  const r = 330;
  const N: [number, number][] = [
    [cx, cy - r],
    [cx + r * 1.25, cy],
    [cx, cy + r],
    [cx - r * 1.25, cy],
  ];
  return (
    <>
      <IconTile x={N[0][0]} y={N[0][1]} icon="vehicle" label="Prototipo" start={at(60.5)} size={160} />
      <IconTile x={N[1][0]} y={N[1][1]} icon="person" label="Evaluación de quienes lo usan" start={at(61.8)} size={160} />
      <IconTile x={N[2][0]} y={N[2][1] - 30} icon="clipboard" label="Observaciones de los soldados" start={at(64.3)} size={160} />
      <IconTile x={N[3][0]} y={N[3][1]} icon="wrench" label="Modificación" start={at(66.4)} size={160} />
      <Arrow from={[N[0][0] + 100, N[0][1] + 10]} to={[N[1][0] - 40, N[1][1] - 100]} bow={-0.22} start={at(61.4)} />
      <Arrow from={[N[1][0] - 40, N[1][1] + 100]} to={[N[2][0] + 110, N[2][1] - 40]} bow={-0.22} start={at(63.8)} />
      <Arrow from={[N[2][0] - 110, N[2][1] - 40]} to={[N[3][0] + 40, N[3][1] + 100]} bow={-0.22} start={at(65.8)} />
      <Arrow from={[N[3][0] + 40, N[3][1] - 100]} to={[N[0][0] - 100, N[0][1] + 10]} bow={-0.22} start={at(67.2)} />
      <IconTile x={cx} y={cy - 20} icon="factory" label="Vuelve a la fábrica" start={at(70.3)} size={200} />
    </>
  );
};

const BEATS = [
  beat(0, 9.8, '1 · Debajo: Ford F-550', (at) => (
    <>
      <ChassisReveal at={at} />
      <Tape text="FORD F-550" x={330} y={330} start={at(4.3)} size={64} rotate={-4} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="doc" x={1640} y={250} size={170} start={at(7.4)} />
        <Glyph name="wrench" x={1700} y={330} size={110} start={at(8.6)} accent={false} />
      </svg>
      <Label text="Registros de mantenimiento" x={1640} y={380} start={at(8.0)} size={22} align="center" />
    </>
  )),
  beat(9.8, 17.4, '2 · Licitación enero 2026', (at) => (
    <>
      <DocCard x={110} y={170} w={700} rot={-2} source="Licitación" date="Enero 2026" summary="Chasis de los Sandcat y los DN-XI" start={at(9.9)} hlAt={at(14.4)} lines={6} />
      <PhotoPlate img="sandcat" x={960} y={150} k={0.5} start={at(15.4)} />
      <PhotoPlate img="dnxi" x={1400} y={170} k={0.56} start={at(16.2)} />
      <PhotoPlate img="chassis" x={1140} y={650} k={0.62} start={at(14.3)} />
      <Arrow from={[1180, 450]} to={[1300, 640]} start={at(15.8)} bow={0.1} />
      <Arrow from={[1620, 470]} to={[1500, 640]} start={at(16.5)} bow={-0.1} />
    </>
  )),
  beat(17.4, 29.4, '3 · ¿Qué se hace en México?', (at) => (
    <>
      <Headline x={110} y={70} start={at(18.4)} size={90} lines={[<span key="q">¿Qué se hace en <Highlight start={at(20.0)}>México</Highlight>?</span>]} />
      <Tape text="INDUSTRIA MILITAR MEXICANA" x={130} y={300} start={at(20.9)} size={40} rotate={-2} />
      <IconTile x={250} y={540} icon="plate" label="Desarrolla y produce el blindaje" start={at(22.1)} size={170} mark={{kind: 'check', at: at(23.4)}} />
      <IconTile x={540} y={540} icon="radar" label="Integra los equipos" start={at(24.2)} size={170} mark={{kind: 'check', at: at(24.9)}} />
      <IconTile x={830} y={540} icon="wrench" label="Adapta la base" start={at(25.6)} size={170} mark={{kind: 'check', at: at(26.3)}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <DrawPath d="M1030,260 L1034,960" start={at(26.0)} duration={14} width={3} color={theme.inkSoft} dash={[12, 10]} />
      </svg>
      <Tape text="ORIGEN EXTRANJERO" x={1130} y={300} start={at(26.6)} size={40} rotate={2} />
      <PhotoPlate img="chassis" x={1090} y={420} k={0.84} start={at(26.9)} />
    </>
  )),
  beat(29.4, 35.6, '4 · No cada componente', (at) => (
    <>
      <Headline x={110} y={110} start={at(29.6)} size={104} lines={[<span key="h">Fabricación <Highlight start={at(30.7)}>mexicana</Highlight></span>]} />
      <Label text="no significa que cada componente se creó en el país" x={116} y={290} start={at(32.2)} size={26} />
      <Components at={at} />
    </>
  )),
  beat(35.6, 44.0, '5 · Plataforma existente + ingeniería', (at) => (
    <>
      <Pictos x={150} y={250} n={3} cols={3} size={110} gap={30} start={at(36.0)} over={10} />
      <Label text="Plataforma existente: práctica común" x={150} y={380} start={at(37.4)} size={22} />
      <PhotoPlate img="chassis" x={110} y={470} k={0.78} start={at(36.4)} />
      <Arrow from={[800, 620]} to={[1040, 560]} start={at(39.9)} bow={-0.2} width={5} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <DrawPath d="M1060,300 H1830 V810 H1060 Z" start={at(40.2)} duration={18} width={2.5} color={theme.inkSoft} dash={[14, 10]} />
        <DrawPath d="M1060,850 H1830 M1060,835 V865 M1830,835 V865" start={at(40.6)} duration={12} width={2} color={theme.inkSoft} />
        <Glyph name="pencil" x={1000} y={330} size={130} start={at(42.6)} />
      </svg>
      <PhotoPlate img="dnxi" x={1080} y={320} k={0.92} start={at(40.6)} />
      <LottieIcon name="gear" x={1780} y={260} size={150} start={at(42.8)} loop badge />
      <Tape text="INGENIERÍA" x={1160} y={250} start={at(43.3)} size={54} rotate={-3} />
    </>
  )),
  beat(44.0, 52.6, '6 · La Crónica en Oriental, Puebla', (at) => {
    const [px, py] = mapPoint(PLACES.oriental, 880, 120, 0.9);
    return (
      <>
        <DocCard x={110} y={200} w={600} rot={-3} source="La Crónica" summary="Visita a la fábrica" start={at(44.8)} hlAt={at(46.9)} lines={4} />
        <MapCard x={880} y={120} k={0.9} start={at(45.0)} drawFor={26} pins={[{pt: PLACES.oriental, at: at(47.4)}]} />
        <Tape text="ORIENTAL, PUEBLA" x={px - 470} y={py - 150} start={at(47.9)} size={46} rotate={-3} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <Glyph name="factory" x={px - 120} y={py + 150} size={150} start={at(49.0)} />
        </svg>
      </>
    );
  }),
  beat(52.6, 56.2, '7 · Diseño, corte, soldadura, pruebas', (at) => (
    <>
      <IconTile x={330} y={470} icon="pencil" label="Diseño" start={at(53.0)} size={210} />
      <IconTile x={730} y={470} icon="saw" label="Corte" start={at(53.8)} size={210} />
      <IconTile x={1130} y={470} icon="spark" label="Soldadura" start={at(54.4)} size={210} />
      <IconTile x={1530} y={470} icon="clipboard" label="Pruebas" start={at(55.2)} size={210} />
      <Arrow from={[450, 470]} to={[610, 470]} start={at(53.5)} bow={0.08} />
      <Arrow from={[850, 470]} to={[1010, 470]} start={at(54.1)} bow={0.08} />
      <Arrow from={[1250, 470]} to={[1410, 470]} start={at(54.9)} bow={0.08} />
    </>
  )),
  beat(56.2, 60.3, '8 · El jefe de la ensambladora', (at) => (
    <>
      <PhotoPlate img="dnxi" x={980} y={200} k={1.0} start={at(56.3)} />
      <PersonCard x={110} y={700} name="Jefe de la ensambladora" role="Fábrica de Oriental, Puebla" source="Según La Crónica" start={at(56.4)} />
    </>
  )),
  beat(60.3, 71.5, '9 · La experiencia vuelve a la fábrica', (at) => <LoopDiagram at={at} />, {push: 1.03}),
  beat(71.5, 85, '10 · ¿Mantenimiento o cambio de diseño?', (at) => (
    <>
      <IconTile x={260} y={520} icon="target" label="Problema en servicio" start={at(72.1)} size={200} mark={{kind: 'question', at: at(73.0)}} />
      <Arrow from={[390, 520]} to={[640, 520]} start={at(73.4)} bow={0.06} />
      <IconTile x={800} y={520} icon="clipboard" label="Ingeniería evalúa" start={at(73.8)} size={200} />
      <Arrow from={[930, 470]} to={[1250, 320]} start={at(76.4)} bow={-0.1} />
      <Arrow from={[930, 570]} to={[1250, 720]} start={at(77.8)} bow={0.1} />
      <IconTile x={1400} y={300} icon="wrench" label="Mantenimiento" start={at(76.8)} size={190} />
      <IconTile x={1400} y={740} icon="pencil" label="Cambio de diseño" start={at(78.1)} size={190} />
    </>
  )),
];

/** "Not every component": a tray of parts; only the armour-related ones are marked Mexican. */
const Components: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const cols = 10;
  const items = Array.from({length: 30});
  const mexican = new Set([0, 3, 4, 11, 12, 14, 21, 22, 25, 27]);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {items.map((_, i) => {
        const x = 200 + (i % cols) * 160;
        const y = 480 + Math.floor(i / cols) * 170;
        const s = pop(frame, at(30.1) + i * 0.8);
        const mark = pop(frame, at(33.6) + (i % 7));
        const isMx = mexican.has(i);
        const kind = i % 3;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            {kind === 0 ? (
              <path d="M0,-40 L35,-20 V20 L0,40 L-35,20 V-20 Z" fill={isMx && mark > 0.5 ? theme.yellow : theme.g5} stroke={theme.ink} strokeWidth={4} />
            ) : kind === 1 ? (
              <circle r={38} fill={isMx && mark > 0.5 ? theme.yellow : theme.g5} stroke={theme.ink} strokeWidth={4} />
            ) : (
              <rect x={-38} y={-30} width={76} height={60} rx={8} fill={isMx && mark > 0.5 ? theme.yellow : theme.g5} stroke={theme.ink} strokeWidth={4} />
            )}
            <circle r={12} fill={theme.paper} stroke={theme.ink} strokeWidth={3} />
          </g>
        );
      })}
    </svg>
  );
};

const CUES: Cue[] = [
  [sec(0.2), 'paper', 0.13],
  [sec(1.4), 'paper', 0.1],
  [sec(4.3), 'paper', 0.12],
  [sec(9.9), 'paper', 0.14],
  [sec(14.3), 'paper', 0.11],
  [sec(15.8), 'pop', 0.08],
  [sec(16.5), 'pop', 0.08],
  [sec(23.4), 'pop', 0.1],
  [sec(24.9), 'pop', 0.1],
  [sec(26.3), 'pop', 0.1],
  [sec(26.9), 'paper', 0.12],
  [sec(33.6), 'pop', 0.08],
  [sec(40.6), 'paper', 0.12],
  [sec(43.3), 'pop', 0.1],
  [sec(44.8), 'paper', 0.13],
  [sec(47.4), 'pop', 0.12],
  [sec(53.0), 'pop', 0.09],
  [sec(53.8), 'pop', 0.09],
  [sec(54.4), 'pop', 0.09],
  [sec(55.2), 'pop', 0.09],
  [sec(56.4), 'paper', 0.12],
  [sec(60.5), 'pop', 0.09],
  [sec(61.8), 'pop', 0.09],
  [sec(64.3), 'pop', 0.09],
  [sec(66.4), 'pop', 0.09],
  [sec(70.3), 'stamp', 0.16],
  [sec(73.0), 'pop', 0.09],
  [sec(76.8), 'pop', 0.09],
  [sec(78.1), 'pop', 0.09],
];

const bedVolume = (f: number) => interpolate(f, [sec(78.8), sec(79.3) + 10], [0.095, 0.17], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Part2: React.FC<FilmProps> = (props) => (
  <Film {...props} voice="audio/parte2.mp3" bed={{src: 'music/p2.mp3', volume: bedVolume}} cues={CUES}>
    <Beats beats={BEATS} endFrame={PART2_FRAMES} />
  </Film>
);
