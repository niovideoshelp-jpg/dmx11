import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {font, sec, theme} from '../theme';
import {Cue, Film, FilmProps} from '../components/Film';
import {DrawPath} from '../components/DrawPath';
import {Highlight} from '../components/Highlight';
import {PhotoPlate} from '../components/Photo';
import {Label, Tape} from '../components/Tape';
import {beat, Beats} from '../kit/Beats';
import {Arrow, Dial, DocCard, Headline, IconTile, PersonCard, Pictos, Stamp, Timeline} from '../kit/Blocks';
import {ConsoleCard} from '../kit/Console';
import {Glyph} from '../kit/Glyph';
import {E, tw} from '../lib/anim';

// Parte 4 — blindaje declarado y armamento (153 s).
export const PART4_FRAMES = sec(153.0) + 24;

const TURRET_RING = 'M226,96 C226,30 560,24 586,92 C606,150 250,170 226,96 Z';

const Big: React.FC<{x: number; y: number; at: number; size?: number; children: React.ReactNode; hl?: number}> = ({x, y, at, size = 200, children, hl}) => (
  <Headline x={x} y={y} start={at} size={size} lines={[hl === undefined ? <span key="b">{children}</span> : <Highlight key="b" start={hl}>{children}</Highlight>]} />
);

/** Exposure bar that shrinks: the operator stays inside. */
const ExposureBar: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const frame = useCurrentFrame();
  const show = tw(frame, at - 20, at - 6, 0, 1, E.out);
  const level = interpolate(frame, [at, at + 24], [1, 0.22], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.inOut});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 560, clipPath: `inset(0 ${(1 - show) * 100}% 0 0)`}}>
      <div style={{fontFamily: font.label, fontWeight: 900, fontSize: 22, letterSpacing: '0.12em', color: theme.ink}}>EXPOSICIÓN DEL OPERADOR</div>
      <div style={{height: 46, marginTop: 10, border: `3px solid ${theme.ink}`, position: 'relative'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${level * 100}%`, backgroundColor: theme.dataRed}} />
      </div>
    </div>
  );
};

const BEATS = [
  beat(0, 3.8, '1 · Sobre el blindaje', (at) => (
    <>
      <Headline x={110} y={300} start={at(0.0)} size={130} kicker="Una declaración" lines={[<span key="b">Sobre el <Highlight start={at(0.5)}>blindaje</Highlight></span>]} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="plate" x={1500} y={480} size={420} start={at(0.6)} />
      </svg>
    </>
  )),
  beat(3.8, 11.2, '2 · Coronel Freddy Ramírez Ruiz · Milenio', (at) => (
    <>
      <Big x={110} y={110} at={at(4.0)} size={150} hl={at(4.6)}>
        Diciembre 2025
      </Big>
      <PersonCard x={110} y={520} name="Freddy Ramírez Ruiz" role="Coronel · jefe de la ensambladora militar" source="A Milenio" start={at(5.9)} />
      <DocCard x={1260} y={560} w={520} rot={3} source="Milenio" date="Dic. 2025" start={at(10.0)} lines={4} />
    </>
  )),
  beat(11.2, 17.7, '3 · Acero, cristales, calibre .50', (at) => (
    <>
      <IconTile x={330} y={360} icon="plate" label="Acero balístico" start={at(11.3)} size={200} />
      <IconTile x={640} y={360} icon="glass" label="Cristales" start={at(12.5)} size={200} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="bullet" x={1340} y={360} size={460} start={at(14.4)} />
        <DrawPath d="M1080,360 C960,360 860,370 780,372" start={at(14.8)} duration={14} width={4} color={theme.dataRed} dash={[14, 10]} />
      </svg>
      <Label text="Proyectiles perforantes" x={1340} y={560} start={at(15.0)} size={28} align="center" />
      <Big x={1110} y={640} at={at(15.9)} size={240} hl={at(16.3)}>
        .50
      </Big>
      <Label text="Calibre" x={1120} y={930} start={at(16.0)} size={28} />
    </>
  )),
  beat(17.7, 35.1, '4 · Más que el calibre', (at) => (
    <>
      <Headline x={110} y={100} start={at(18.4)} size={96} lines={[<span key="h">¿Hasta dónde <Highlight start={at(19.6)}>llega</Highlight>?</span>]} />
      <Label text="Hace falta saber más que el calibre" x={116} y={250} start={at(21.4)} size={26} />
      <IconTile x={330} y={590} icon="bullet" label="Tipo exacto de munición" start={at(24.2)} size={200} mark={{kind: 'question', at: at(32.8)}} />
      <IconTile x={750} y={590} icon="speed" label="Velocidad del proyectil" start={at(26.0)} size={200} mark={{kind: 'question', at: at(33.2)}} />
      <IconTile x={1170} y={590} icon="target" label="Impactos recibidos" start={at(27.4)} size={200} mark={{kind: 'question', at: at(33.6)}} />
      <IconTile x={1590} y={590} icon="clipboard" label="Condiciones de la prueba" start={at(29.9)} size={200} mark={{kind: 'question', at: at(34.0)}} />
      <Label text="La entrevista no ofrece esos resultados" x={960} y={930} start={at(32.4)} size={26} align="center" />
    </>
  )),
  beat(35.1, 44.9, '5 · Capacidad declarada ≠ cualquier ataque', (at) => (
    <>
      <DocCard x={110} y={180} w={620} rot={-2} source="Milenio" date="Dic. 2025" summary="Protección contra calibre .50" start={at(35.2)} hlAt={at(36.0)} lines={4} />
      <Stamp x={430} y={560} text="Declarado por el fabricante" start={at(36.9)} size={34} rot={-7} />
      <IconTile x={1060} y={420} icon="shield" label="Una munición, ciertas condiciones" start={at(39.0)} size={200} mark={{kind: 'check', at: at(40.8)}} />
      <Headline x={1340} y={330} start={at(41.8)} size={150} lines={['≠']} />
      <IconTile x={1640} y={420} icon="blast" label="Cualquier ataque" start={at(43.4)} size={200} mark={{kind: 'cross', at: at(44.1)}} />
    </>
  )),
  beat(44.9, 48.5, '6 · Minas y explosiones: aparte', (at) => (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <DrawPath d="M520,250 H1400 V830 H520 Z" start={at(45.0)} duration={16} width={4} dash={[16, 12]} />
      </svg>
      <IconTile x={760} y={520} icon="mine" label="Minas" start={at(45.2)} size={230} />
      <IconTile x={1160} y={520} icon="blast" label="Explosiones" start={at(45.8)} size={230} />
      <Tape text="EVALUACIÓN APARTE" x={700} y={200} start={at(47.2)} size={48} rotate={-2} />
    </>
  )),
  beat(48.5, 58.8, '7 · Sin clasificación pública detallada', (at) => (
    <>
      <DocCard x={110} y={200} w={600} rot={-2} source="Clasificación pública" start={at(48.7)} lines={7} />
      <Stamp x={410} y={470} text="Sin detalle suficiente" start={at(51.9)} size={34} rot={-8} color={theme.ink} />
      <PhotoPlate img="dnxi" x={860} y={330} k={0.62} start={at(53.4)} />
      <Headline x={1430} y={320} start={at(54.6)} size={170} lines={['?']} />
      <IconTile x={1690} y={470} icon="shield" label="Vehículos certificados contra minas y explosiones" start={at(55.3)} size={200} labelWidth={320} />
    </>
  )),
  beat(58.8, 69.4, '8 · Objetivo documentado, resultados pendientes', (at) => (
    <>
      <IconTile x={360} y={320} icon="doc" label="Objetivo: proteger a las tropas" start={at(59.1)} size={200} mark={{kind: 'check', at: at(61.0)}} labelWidth={320} />
      <IconTile x={360} y={740} icon="clipboard" label="Resultados detallados de las pruebas" start={at(64.6)} size={200} mark={{kind: 'question', at: at(65.6)}} labelWidth={320} />
      <Dial x={1250} y={720} r={330} max={100} value={68} start={at(62.2)} needleAt={at(63.0)} label="¿HASTA DÓNDE LLEGA LA PROTECCIÓN?" wobble={14} />
      <Headline x={1560} y={250} start={at(66.5)} size={170} lines={['?']} />
    </>
  )),
  beat(69.4, 84.6, '9 · Armamento: .50 y 40 mm', (at) => (
    <>
      <Headline x={110} y={80} start={at(69.5)} size={96} lines={[<Highlight key="a" start={at(70.0)}>Armamento</Highlight>]} />
      <PhotoPlate img="dnxi" x={90} y={330} k={1.02} start={at(70.8)}>
        <DrawPath d={TURRET_RING} start={at(72.4)} duration={14} width={7} color={theme.yellow} style={{mixBlendMode: 'multiply'}} />
        <DrawPath d={TURRET_RING} start={at(72.6)} duration={14} width={1.8} />
      </PhotoPlate>
      <Label text="Torreta en el techo" x={420} y={300} start={at(72.8)} size={24} />
      <PhotoPlate img="m2" x={1130} y={150} k={0.66} start={at(76.2)} />
      <Label text="Ametralladora calibre .50" x={1420} y={490} start={at(77.4)} size={24} align="center" />
      <PhotoPlate img="mk19" x={1250} y={560} k={0.5} start={at(78.6)} />
      <Label text="Lanzagranadas de 40 mm" x={1480} y={1000} start={at(79.8)} size={24} align="center" />
      <Arrow from={[640, 380]} to={[1120, 300]} start={at(82.0)} dash bow={-0.12} />
      <Arrow from={[660, 410]} to={[1230, 720]} start={at(82.5)} dash bow={0.12} />
      <Tape text="SEGÚN LA CONFIGURACIÓN" x={420} y={940} start={at(82.6)} size={42} rotate={-2} />
    </>
  )),
  beat(84.6, 90.7, '10 · SARAF Balam', (at) => (
    <>
      <Tape text="SARAF BALAM" x={120} y={110} start={at(85.4)} size={86} rotate={-3} />
      <Label text="Sistema mexicano" x={130} y={250} start={at(86.7)} size={30} />
      <PhotoPlate img="dnxi" x={90} y={380} k={1.0} start={at(84.8)}>
        <DrawPath d={TURRET_RING} start={at(88.0)} duration={12} width={6} color={theme.dataBlue} />
      </PhotoPlate>
      <ConsoleCard x={1240} y={300} k={1.08} start={at(88.1)} moveAt={at(89.2)} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <DrawPath d="M1250,480 C1080,420 900,430 700,470" start={at(88.9)} duration={14} width={5} color={theme.dataBlue} dash={[14, 10]} />
      </svg>
      <Label text="Manejo del arma desde el interior protegido" x={1530} y={760} start={at(89.3)} size={22} align="center" />
    </>
  )),
  beat(90.7, 99.1, '11 · Cámaras, control, menos exposición', (at) => (
    <>
      <ConsoleCard x={110} y={200} k={1.6} start={at(90.8)} moveAt={at(93.2)} rot={-1} />
      <IconTile x={1500} y={300} icon="camera" label="Imágenes de las cámaras" start={at(91.7)} size={190} />
      <ExposureBar x={1220} y={640} at={at(95.6)} />
    </>
  )),
  beat(99.1, 102.2, '12 · La decisión es del operador', (at) => (
    <>
      <Headline
        x={110}
        y={330}
        start={at(99.2)}
        size={104}
        lines={['La decisión de disparar', <span key="o">sigue siendo del <Highlight start={at(101.2)}>operador</Highlight></span>]}
      />
      <IconTile x={1600} y={480} icon="person" start={at(100.4)} size={260} mark={{kind: 'check', at: at(101.4)}} />
    </>
  )),
  beat(102.2, 108.0, '13 · Noé Gómez Gutiérrez · InfoDefensa', (at) => (
    <>
      <Big x={110} y={110} at={at(102.3)} size={150} hl={at(103.0)}>
        Septiembre 2026
      </Big>
      <PersonCard x={110} y={520} name="Noé Gómez Gutiérrez" role="Teniente coronel" source="A InfoDefensa" start={at(104.2)} />
      <DocCard x={1260} y={560} w={520} rot={3} source="InfoDefensa" date="Sept. 2026" start={at(106.8)} lines={4} />
    </>
  )),
  beat(108.0, 123.3, '14 · Balam-1', (at) => (
    <>
      <Tape text="BALAM-1" x={110} y={100} start={at(108.0)} size={80} rotate={-3} />
      <IconTile x={300} y={430} icon="bullet" label="5,56 mm" start={at(110.0)} size={180} />
      <IconTile x={580} y={430} icon="bullet" label="7,62 mm" start={at(111.9)} size={180} />
      <IconTile x={940} y={430} icon="sun" label="Visión diurna" start={at(114.8)} size={180} />
      <IconTile x={1220} y={430} icon="moon" label="Visión nocturna" start={at(115.7)} size={180} />
      <Label text="Ya distribuido a" x={130} y={720} start={at(117.7)} size={26} />
      <IconTile x={520} y={820} icon="boot" label="Infantería" start={at(119.3)} size={150} />
      <IconTile x={800} y={820} icon="knight" label="Caballería" start={at(119.9)} size={150} />
      <IconTile x={1080} y={820} icon="parachute" label="Fuerzas especiales" start={at(121.7)} size={150} />
      <ConsoleCard x={1440} y={150} k={0.78} start={at(108.4)} moveAt={at(108.4)} />
    </>
  )),
  beat(123.3, 138.2, '15 · Balam-2', (at) => (
    <>
      <Tape text="BALAM-2" x={110} y={100} start={at(123.4)} size={80} rotate={-3} />
      <IconTile x={330} y={460} icon="bullet" label="12,7 mm" sub="= calibre .50" start={at(125.1)} size={200} />
      <PhotoPlate img="mk19" x={560} y={300} k={0.42} start={at(129.1)} />
      <Label text="Lanzagranadas de 40 mm" x={760} y={620} start={at(130.0)} size={24} align="center" />
      <IconTile x={1160} y={460} icon="thermo" label="Visión térmica" start={at(132.5)} size={200} />
      <Stamp x={1560} y={300} text="Listo para serie" start={at(135.6)} size={40} rot={-9} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="factory" x={1560} y={560} size={200} start={at(136.6)} />
      </svg>
      <Pictos x={1330} y={760} n={8} cols={8} size={52} gap={8} start={at(137.0)} over={10} />
      <Label text="Balam-1: 5,56 · 7,62 mm · día y noche" x={120} y={900} start={at(123.6)} size={22} color={theme.inkSoft} />
    </>
  )),
  beat(138.2, 160, '16 · 2016 → 2026', (at) => (
    <>
      <Headline x={110} y={90} start={at(138.4)} size={90} lines={[<span key="h">Viene de <Highlight start={at(140.9)}>tiempo atrás</Highlight></span>]} />
      <Timeline x0={180} x1={1740} y={860} from={2014} to={2027} start={at(138.6)} stops={[{year: 2016, at: at(142.1)}, {year: 2026, at: at(148.0)}]} />
      <PhotoPlate img="dnxi" x={190} y={420} k={0.56} start={at(143.4)} />
      <Tape text="BALAM-1 EN EL DN-XI" x={200} y={360} start={at(145.1)} size={36} rotate={-3} />
      <Label text="Sedena, 2016" x={420} y={770} start={at(143.6)} size={22} align="center" />
      <ConsoleCard x={1310} y={360} k={0.66} start={at(147.6)} moveAt={at(147.6)} />
      <Tape text="BALAM-2" x={1380} y={300} start={at(148.2)} size={40} rotate={2} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <DrawPath d="M410,940 C800,1010 1100,1010 1580,940" start={at(150.4)} duration={20} width={4} dash={[14, 10]} />
      </svg>
      <Label text="Varios años de desarrollo" x={995} y={1030} start={at(151.0)} size={24} align="center" />
    </>
  )),
];

const CUES: Cue[] = [
  [sec(0.6), 'paper', 0.12],
  [sec(5.9), 'pop', 0.1],
  [sec(10.0), 'paper', 0.12],
  [sec(11.3), 'pop', 0.09],
  [sec(12.5), 'pop', 0.09],
  [sec(14.4), 'armor', 0.14],
  [sec(24.2), 'pop', 0.08],
  [sec(26.0), 'pop', 0.08],
  [sec(27.4), 'pop', 0.08],
  [sec(29.9), 'pop', 0.08],
  [sec(32.8), 'pop', 0.07],
  [sec(35.2), 'paper', 0.12],
  [sec(36.9), 'stamp', 0.26],
  [sec(40.8), 'pop', 0.08],
  [sec(44.1), 'pop', 0.08],
  [sec(45.2), 'pop', 0.09],
  [sec(45.8), 'impact', 0.12],
  [sec(48.7), 'paper', 0.12],
  [sec(51.9), 'stamp', 0.24],
  [sec(53.4), 'paper', 0.1],
  [sec(61.0), 'pop', 0.08],
  [sec(65.6), 'pop', 0.08],
  [sec(70.8), 'paper', 0.12],
  [sec(76.2), 'thud', 0.16],
  [sec(78.6), 'thud', 0.14],
  [sec(85.4), 'paper', 0.12],
  [sec(88.1), 'paper', 0.1],
  [sec(91.7), 'pop', 0.09],
  [sec(101.4), 'pop', 0.09],
  [sec(104.2), 'pop', 0.1],
  [sec(106.8), 'paper', 0.12],
  [sec(108.0), 'paper', 0.12],
  [sec(110.0), 'pop', 0.08],
  [sec(111.9), 'pop', 0.08],
  [sec(114.8), 'pop', 0.08],
  [sec(115.7), 'pop', 0.08],
  [sec(119.3), 'pop', 0.08],
  [sec(119.9), 'pop', 0.08],
  [sec(121.7), 'pop', 0.08],
  [sec(123.4), 'paper', 0.12],
  [sec(125.1), 'pop', 0.08],
  [sec(129.1), 'paper', 0.1],
  [sec(132.5), 'pop', 0.08],
  [sec(135.6), 'stamp', 0.26],
  [sec(142.1), 'pop', 0.1],
  [sec(148.0), 'pop', 0.1],
];

const bedVolume = (f: number) => interpolate(f, [sec(152.4), sec(153.0) + 10], [0.085, 0.16], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Part4: React.FC<FilmProps> = (props) => (
  <Film {...props} voice="audio/parte4.mp3" bed={{src: 'music/p4.mp3', volume: bedVolume}} cues={CUES}>
    <Beats beats={BEATS} endFrame={PART4_FRAMES} />
  </Film>
);

