import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {sec, theme} from '../theme';
import {Cue, Film, FilmProps} from '../components/Film';
import {DrawPath} from '../components/DrawPath';
import {Highlight} from '../components/Highlight';
import {LottieIcon} from '../components/LottieIcon';
import {DNXI, PhotoPlate, toScreen} from '../components/Photo';
import {Label, Tape} from '../components/Tape';
import {At, beat, Beats} from '../kit/Beats';
import {Balance, BigNumber, Dial, DocCard, Headline, IconTile, balanceAngle, balancePans} from '../kit/Blocks';
import {Glyph} from '../kit/Glyph';
import {MapCard, mapPoint} from '../kit/MapCard';
import {PLACES} from '../data/mexico';
import {E, circlePath, pop, tw} from '../lib/anim';

// Parte 3 — peso, ficha técnica y mantenimiento (76,7 s).
export const PART3_FRAMES = sec(76.7) + 24;

/** "El peso cuenta": a weight lands on the roof and the vehicle sinks on its springs. */
const WeightDrop: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const X = 230;
  const Y = 300;
  const K = 1.12;
  const land = at(9.1);
  const drop = tw(frame, land - 8, land, -700, 0, E.in);
  const sink = interpolate(frame, [land, land + 4, land + 22], [0, 14, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.out});
  const [fx, fy] = toScreen(DNXI.frontWheel, X, Y, K);
  const [rx, ry] = toScreen(DNXI.rearWheel, X, Y, K);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${sink}px)`}}>
        <PhotoPlate img="dnxi" x={X} y={Y} k={K} start={at(8.1)} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(0 ${drop})`}>
          <Glyph name="weight" x={700} y={150} size={200} start={at(8.4)} />
        </g>
        {[560, 700, 840].map((x, i) => (
          <DrawPath key={x} d={`M${x},${280 + sink} V${380 + sink} M${x - 16},${360 + sink} L${x},${384 + sink} L${x + 16},${360 + sink}`} start={at(10.6) + i * 3} duration={10} width={5} color={theme.dataRed} />
        ))}
        <g transform={`translate(${fx} ${fy - 150 + sink}) scale(1 ${1 - sink / 60}) translate(${-fx} ${-(fy - 150)})`}>
          <Glyph name="spring" x={fx} y={fy - 150} size={110} start={at(11.9)} />
        </g>
        <g transform={`translate(${rx} ${ry - 150 + sink}) scale(1 ${1 - sink / 60}) translate(${-rx} ${-(ry - 150)})`}>
          <Glyph name="spring" x={rx} y={ry - 150} size={110} start={at(12.1)} />
        </g>
      </svg>
      <Label text="+ kilos" x={830} y={150} start={at(10.7)} size={40} color={theme.dataRed} />
      <IconTile x={1660} y={250} icon="spring" label="Suspensión" start={at(11.9)} size={160} />
      <IconTile x={1660} y={540} icon="disc" label="Frenos" start={at(12.7)} size={160} />
      <IconTile x={1660} y={830} icon="wheel" label="Quien conduce" start={at(14.3)} size={160} />
    </>
  );
};

/** Armour plates held by bolts: damaged plate unbolts and swaps for a new one in the workshop. */
const BoltPlates: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const cx = 1020;
  const cy = 560;
  const w = 720;
  const h = 440;
  const off = tw(frame, at(53.6), at(54.4), 0, 1, E.in);
  const inn = tw(frame, at(54.3), at(55.1), 0, 1, E.out);
  const unscrew = tw(frame, at(53.0), at(53.6), 0, 1, E.inOut);
  const rescrew = tw(frame, at(55.1), at(55.8), 0, 1, E.inOut);
  const boltOut = unscrew * (1 - rescrew);
  const paste = tw(frame, at(49.2), at(49.9), 0, 1, E.out);
  const bolts: [number, number][] = [
    [-w / 2 + 50, -h / 2 + 50],
    [0, -h / 2 + 50],
    [w / 2 - 50, -h / 2 + 50],
    [-w / 2 + 50, h / 2 - 50],
    [0, h / 2 - 50],
    [w / 2 - 50, h / 2 - 50],
  ];
  const plate = (dx: number, dy: number, rot: number, damaged: boolean, key: string) => (
    <g key={key} transform={`translate(${cx + dx} ${cy + dy}) rotate(${rot})`}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} fill={theme.ink} opacity={0.15} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={theme.g3} stroke={theme.ink} strokeWidth={5} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="url(#p3-dots)" />
      {damaged ? (
        <>
          <DrawPath d="M-60,-20 L-30,-36 L-12,-6 L20,-30 L44,4 M-30,-36 L-40,-80 M20,-30 L30,-70 M-12,-6 L-6,40" start={at(52.2)} duration={9} width={3} />
          <circle cx={-12} cy={-6} r={10} fill={theme.g1} />
        </>
      ) : null}
    </g>
  );
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="p3-dots" width={8} height={8} patternUnits="userSpaceOnUse">
            <circle cx={4} cy={4} r={1.5} fill={theme.ink} opacity={0.35} />
          </pattern>
          <clipPath id="p3-paste">
            <rect x={0} y={1080 - 1080 * paste} width={1920} height={1080} />
          </clipPath>
        </defs>
        <g clipPath="url(#p3-paste)">
          {off < 1 ? plate(-off * 220, off * 900, -off * 18, true, 'old') : null}
          {inn > 0 ? plate((1 - inn) * 1100, 0, (1 - inn) * 10, false, 'new') : null}
          {bolts.map(([bx, by], i) => {
            const s = pop(frame, at(50.9) + i * 2);
            const spin = (unscrew - rescrew) * 540 + tw(frame, at(50.9) + i * 2, at(51.6) + i * 2, -180, 0, E.out);
            const lift = boltOut * 70;
            return (
              <g key={i} transform={`translate(${cx + bx - lift * 0.4} ${cy + by - lift}) rotate(${spin}) scale(${s})`}>
                <path d="M0,-26 L22,-13 V13 L0,26 L-22,13 V-13 Z" fill={theme.g5} stroke={theme.ink} strokeWidth={4} />
                <path d="M-11,0 H11" stroke={theme.ink} strokeWidth={4} strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      </svg>
      <LottieIcon name="impact" x={cx - 12} y={cy - 6} size={200} start={at(52.1)} noPop exitAt={at(53.4)} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="wrench" x={1560} y={250} size={180} start={at(53.4)} accent={false} />
      </svg>
      <Tape text="TALLER" x={1500} y={360} start={at(54.0)} size={54} rotate={3} />
      <IconTile x={1600} y={760} icon="clipboard" label="Mantenimiento más fácil" start={at(55.2)} size={170} mark={{kind: 'check', at: at(55.9)}} />
      <Label text="Placas sujetas con tornillos" x={330} y={270} start={at(49.3)} size={26} />
    </>
  );
};

/** Run-flat: the tyre keeps rolling while its pressure drops, riding on the insert. */
const RunFlat: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const cx = 720;
  const cy = 500;
  const R = 280;
  const spin = frame * 6;
  const loss = tw(frame, at(64.4), at(65.6), 0, 1, E.inOut);
  const squash = 1 - loss * 0.12;
  const insert = pop(frame, at(58.4));
  const roadShift = (frame * 14) % 90;
  const pressure = 100 - loss * 82;
  const pa = ((180 + (pressure / 100) * 180) * Math.PI) / 180;
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={`M120,${cy + R * squash + 6} H1320`} stroke={theme.ink} strokeWidth={6} />
        {Array.from({length: 16}).map((_, i) => (
          <path key={i} d={`M${120 + i * 90 - roadShift},${cy + R * squash + 34} h44`} stroke={theme.g3} strokeWidth={5} />
        ))}
        <g transform={`translate(${cx} ${cy + R * (1 - squash)}) scale(1 ${squash})`}>
          <circle r={R} fill={theme.g1} />
          <g transform={`rotate(${spin})`}>
            {Array.from({length: 24}).map((_, i) => (
              <rect key={i} x={-14} y={-R} width={28} height={36} rx={4} fill={theme.g2} transform={`rotate(${i * 15})`} />
            ))}
            <circle r={R * 0.55} fill={theme.g4} stroke={theme.ink} strokeWidth={4} />
            {Array.from({length: 6}).map((_, i) => (
              <circle key={i} cx={Math.cos((i * Math.PI) / 3) * R * 0.32} cy={Math.sin((i * Math.PI) / 3) * R * 0.32} r={14} fill={theme.g2} />
            ))}
            <circle r={R * 0.12} fill={theme.g2} stroke={theme.ink} strokeWidth={3} />
          </g>
          <circle r={R * 0.72} fill="none" stroke={theme.yellow} strokeWidth={34 * insert} />
        </g>
        {/* pressure gauge */}
        <g transform="translate(1560 420)">
          <circle r={150} fill={theme.paper} stroke={theme.ink} strokeWidth={6} />
          <path d="M-120,0 A120,120 0 0 1 120,0" fill="none" stroke={theme.g4} strokeWidth={14} />
          <path d="M-120,0 A120,120 0 0 1 -84,-85" fill="none" stroke={theme.dataRed} strokeWidth={14} />
          <path d={`M0,0 L${Math.cos(pa) * 110},${Math.sin(pa) * 110}`} stroke={theme.ink} strokeWidth={8} strokeLinecap="round" />
          <circle r={14} fill={theme.ink} />
        </g>
        <DrawPath d={circlePath(cx, cy, R + 70)} start={at(67.0)} duration={18} width={3} color={theme.inkSoft} dash={[14, 10]} />
      </svg>
      <Tape text="RUN FLAT" x={300} y={120} start={at(58.2)} size={70} rotate={-4} />
      <Label text="Presión" x={1560} y={620} start={at(62.4)} size={24} align="center" />
      <Label text="Confirmado por el jefe de la ensambladora" x={300} y={250} start={at(60.6)} size={22} />
      <Label text="Dentro de los límites del sistema" x={720} y={1000} start={at(67.2)} size={24} align="center" />
    </>
  );
};

const LevelBalance: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const angle = balanceAngle(frame, at(72.9), 0, -10);
  const {left, right} = balancePans(960, 300, angle, 430);
  return (
    <>
      <Balance x={960} y={300} start={0} angle={angle} arm={430} />
      <IconTile x={left[0]} y={left[1] + 40} icon="tire" label="Seguir avanzando" start={at(70.6)} size={190} />
      <IconTile x={right[0]} y={right[1] + 40} icon="gauge" label="Velocidad máxima" start={at(74.3)} size={190} />
    </>
  );
};

const BEATS = [
  beat(0, 8.0, '1 · Proteger y moverse', (at) => (
    <>
      <PhotoPlate img="dnxi" x={160} y={280} k={1.15} start={at(0.1)} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="shield" x={240} y={180} size={150} start={at(1.3)} />
      </svg>
      <IconTile x={1640} y={300} icon="road" label="Carretera" start={at(5.5)} size={190} />
      <IconTile x={1640} y={700} icon="city" label="Calles de la ciudad" start={at(6.7)} size={190} />
    </>
  )),
  beat(8.0, 16.5, '2 · El peso cuenta', (at) => <WeightDrop at={at} />, {push: 1.02}),
  beat(16.5, 22.9, '3 · Culiacán 2023 · El Debate', (at) => {
    const [px, py] = mapPoint(PLACES.culiacan, 880, 140, 0.92);
    return (
      <>
        <Headline x={110} y={110} start={at(18.8)} size={200} lines={[<Highlight key="y" start={at(19.2)}>2023</Highlight>]} />
        <MapCard x={880} y={140} k={0.92} start={at(16.7)} drawFor={24} pins={[{pt: PLACES.culiacan, at: at(18.4)}]} />
        <Tape text="CULIACÁN" x={px + 60} y={py - 130} start={at(18.5)} size={50} rotate={-3} />
        <DocCard x={110} y={470} w={620} rot={-2} source="El Debate" date="2023" summary="Exposición militar: el ejemplar presentado" start={at(20.1)} hlAt={at(21.6)} lines={4} />
      </>
    );
  }),
  beat(22.9, 29.5, '4 · 8,5 t, diésel, automática', (at) => (
    <>
      <PhotoPlate img="dnxi" x={80} y={330} k={1.0} start={at(22.9)} />
      <BigNumber x={1040} y={120} value={8.5} decimals={1} suffix=" t" caption="toneladas" size={190} start={at(22.9)} countFor={16} />
      <IconTile x={1140} y={700} icon="engine" label="Motor diésel" start={at(24.4)} size={180} />
      <IconTile x={1520} y={700} icon="gearshift" label="Automática" sub="con cambio manual" start={at(25.3)} size={180} mark={{kind: 'check', at: at(27.6)}} />
    </>
  )),
  beat(29.5, 37.1, '5 · 120 km/h · 500 km', (at) => (
    <>
      <Dial x={640} y={660} r={330} max={160} value={120} ticks={[0, 40, 80, 120, 160]} start={at(29.6)} needleAt={at(31.4)} unit="km/h" label="VELOCIDAD MÁXIMA" />
      <BigNumber x={560} y={180} value={120} size={150} start={at(32.3)} countFor={14} highlight={false} />
      <IconTile x={1360} y={360} icon="fuel" label="Autonomía" start={at(34.8)} size={180} />
      <BigNumber x={1180} y={580} value={500} suffix=" km" size={170} start={at(35.5)} countFor={16} />
    </>
  )),
  beat(37.1, 46.5, '6 · Cifras de referencia', (at) => (
    <>
      <Dial x={600} y={680} r={300} max={160} value={120} ticks={[0, 40, 80, 120, 160]} start={0} needleAt={0} unit="km/h" wobble={16} />
      <Headline x={1060} y={150} start={at(37.6)} size={92} lines={[<span key="r">Una <Highlight start={at(38.7)}>referencia</Highlight></span>]} />
      <IconTile x={1130} y={600} icon="box" label="Carga" start={at(41.7)} size={170} />
      <IconTile x={1420} y={600} icon="mountain" label="Terreno" start={at(42.9)} size={170} />
      <IconTile x={1710} y={600} icon="road" label="Fuera del asfalto" start={at(45.2)} size={170} mark={{kind: 'cross', at: at(45.8)}} />
    </>
  )),
  beat(46.5, 56.9, '7 · Placas con tornillos', (at) => (
    <>
      <PhotoPlate img="dnxi" x={60} y={60} k={0.42} start={at(46.6)} />
      <BoltPlates at={at} />
    </>
  )),
  beat(56.9, 68.4, '8 · Run flat', (at) => <RunFlat at={at} />, {push: 1.02}),
  beat(68.4, 80, '9 · Seguir avanzando ≈ velocidad', (at) => (
    <>
      <LevelBalance at={at} />
      <Headline x={960} y={860} align="center" start={at(72.4)} size={70} lines={[<span key="h">Tan <Highlight start={at(73.3)}>importante</Highlight> como la velocidad</span>]} />
    </>
  )),
];

const CUES: Cue[] = [
  [sec(0.1), 'paper', 0.13],
  [sec(5.5), 'pop', 0.09],
  [sec(6.7), 'pop', 0.09],
  [sec(9.1), 'thud', 0.32],
  [sec(11.9), 'pop', 0.08],
  [sec(12.7), 'pop', 0.08],
  [sec(14.3), 'pop', 0.08],
  [sec(18.4), 'pop', 0.11],
  [sec(20.1), 'paper', 0.13],
  [sec(22.9), 'paper', 0.12],
  [sec(24.4), 'pop', 0.09],
  [sec(25.3), 'pop', 0.09],
  [sec(34.8), 'pop', 0.09],
  [sec(41.7), 'pop', 0.08],
  [sec(42.9), 'pop', 0.08],
  [sec(45.2), 'pop', 0.08],
  [sec(49.2), 'paper', 0.12],
  [sec(52.1), 'armor', 0.2],
  [sec(55.1), 'stamp', 0.16],
  [sec(55.9), 'pop', 0.09],
  [sec(58.2), 'paper', 0.12],
  [sec(70.6), 'pop', 0.09],
  [sec(72.9), 'thud', 0.14],
  [sec(74.3), 'pop', 0.09],
];

const bedVolume = (f: number) => interpolate(f, [sec(76.0), sec(76.7) + 10], [0.1, 0.17], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Part3: React.FC<FilmProps> = (props) => (
  <Film {...props} voice="audio/parte3.mp3" bed={{src: 'music/p3.mp3', volume: bedVolume}} cues={CUES}>
    <Beats beats={BEATS} endFrame={PART3_FRAMES} />
  </Film>
);

