import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {font, sec, theme} from '../theme';
import {Cue, Film, FilmProps} from '../components/Film';
import {DrawPath} from '../components/DrawPath';
import {Highlight} from '../components/Highlight';
import {PhotoPlate} from '../components/Photo';
import {Label, Tape} from '../components/Tape';
import {At, beat, Beats} from '../kit/Beats';
import {Arrow, Balance, Bar, BigNumber, DocCard, Headline, IconTile, Pictos, Strike, balanceAngle, balancePans} from '../kit/Blocks';
import {Glyph} from '../kit/Glyph';
import {pop} from '../lib/anim';

// Final — inversión, cifras, balance y lo que falta saber (130,8 s, then a 1.5 s hold).
export const FINAL_FRAMES = sec(130.85) + 45;

const Disc: React.FC<{x: number; y: number; r: number; at: number}> = ({x, y, r, at}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', backgroundColor: theme.yellow, transform: `scale(${pop(frame, at)})`, mixBlendMode: 'multiply'}} />
  );
};

/** Future model with no public photo: a drafting card with the outline of a vehicle. */
const ModelCard: React.FC<{x: number; y: number; name: string; at: number; sub?: string; strong?: boolean}> = ({x, y, name, at, sub, strong}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 330, transform: `scale(${s})`, transformOrigin: '50% 50%'}}>
      <div style={{height: 220, border: `4px dashed ${theme.ink}`, backgroundColor: strong ? theme.g6 : 'transparent', position: 'relative'}}>
        <svg width={330} height={220} viewBox="0 0 100 70" style={{position: 'absolute', inset: 0}}>
          <path d="M14,52 V30 Q14,24 20,24 H58 L66,34 H82 L86,40 V52 Z" fill="none" stroke={theme.inkSoft} strokeWidth={1.6} strokeDasharray="4 3" />
          <circle cx={32} cy={53} r={7} fill="none" stroke={theme.inkSoft} strokeWidth={1.6} strokeDasharray="4 3" />
          <circle cx={70} cy={53} r={7} fill="none" stroke={theme.inkSoft} strokeWidth={1.6} strokeDasharray="4 3" />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 20, top: -30}}>
        <Tape text={name} x={0} y={0} start={at + 4} size={46} rotate={-3} />
      </div>
      {sub ? (
        <div style={{fontFamily: font.display, fontStyle: 'italic', fontSize: 28, color: theme.inkSoft, marginTop: 12, textAlign: 'center'}}>{sub}</div>
      ) : null}
    </div>
  );
};

const MeritsLimits: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const a1 = balanceAngle(frame, at(79.6), -11);
  const angle = balanceAngle(frame, at(86.0), 0, a1);
  const {left, right} = balancePans(960, 250, angle, 300);
  return (
    <>
      <Balance x={960} y={250} start={at(64.6)} angle={angle} arm={300} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="star" x={left[0]} y={left[1] + 20} size={110} start={at(65.3)} />
        <Glyph name="question" x={right[0]} y={right[1] + 20} size={110} start={at(81.4)} accent={false} />
      </svg>
      <Tape text="MÉRITOS" x={110} y={110} start={at(65.3)} size={58} rotate={-3} />
      <IconTile x={240} y={360} icon="wrench" label="Adaptar y mantener en el país" start={at(70.9)} size={150} labelWidth={300} />
      <IconTile x={240} y={600} icon="person" label="Escucha a los militares" start={at(74.3)} size={150} labelWidth={300} />
      <IconTile x={240} y={840} icon="pencil" label="Puede modificar el diseño" start={at(77.8)} size={150} labelWidth={300} />
      <Tape text="LÍMITES" x={1520} y={110} start={at(81.3)} size={58} rotate={3} />
      <IconTile x={1680} y={380} icon="vehicle" label="Plataforma extranjera" start={at(82.2)} size={150} labelWidth={300} />
      <IconTile x={1680} y={650} icon="doc" label="Faltan datos públicos" start={at(85.0)} size={150} labelWidth={300} mark={{kind: 'question', at: at(85.8)}} />
      <Label text="Independencia total" x={760} y={890} start={at(89.1)} size={30} align="center" />
      <Strike x0={590} y0={892} x1={930} y1={886} start={at(89.9)} />
      <Label text="Supera a sus competidores" x={1180} y={960} start={at(91.7)} size={30} align="center" />
      <Strike x0={960} y0={962} x1={1400} y1={956} start={at(92.5)} />
    </>
  );
};

const BEATS = [
  beat(0, 4.8, '1 · Invertir en instalaciones', (at) => (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="factory" x={520} y={560} size={460} start={at(0.4)} />
        <Glyph name="coin" x={880} y={760} size={110} start={at(3.0)} />
        <Glyph name="coin" x={950} y={700} size={110} start={at(3.2)} />
      </svg>
      <Headline x={1060} y={360} start={at(1.6)} size={96} lines={['Invertir en', <span key="i">sus <Highlight start={at(3.7)}>instalaciones</Highlight></span>]} />
    </>
  )),
  beat(4.8, 12.4, '2 · 2013: 143 millones', (at) => (
    <>
      <Headline x={110} y={110} start={at(5.0)} size={190} lines={[<Highlight key="y" start={at(5.3)}>2013</Highlight>]} />
      <DocCard x={1160} y={120} w={620} rot={2} source="Primer informe de actividades · SEDENA" date="2013" start={at(6.0)} lines={5} />
      <BigNumber x={110} y={500} value={143} prefix="$" suffix=" M" caption="millones de pesos mexicanos" size={220} start={at(8.6)} countFor={26} />
    </>
  )),
  beat(12.4, 20.2, '3 · 81 + 62 millones', (at) => (
    <>
      <Bar x={360} y={150} w={1000} label="Total del programa" value={143} max={143} valueText="$143 M" start={at(12.5)} color={theme.g3} />
      <Bar x={360} y={400} w={1000} label="Ampliar la línea de ensamblaje" value={81} max={143} valueText="$81 M" start={at(13.3)} />
      <Bar x={360} y={650} w={1000} label="Lote piloto de 20 vehículos" value={62} max={143} valueText="$62 M" start={at(16.4)} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="factory" x={200} y={470} size={130} start={at(14.8)} />
        <Glyph name="vehicle" x={200} y={720} size={130} start={at(18.0)} />
      </svg>
      <Pictos x={360} y={860} n={20} cols={20} size={52} gap={6} start={at(18.8)} over={14} />
    </>
  )),
  beat(20.2, 32.9, '4 · Cuidado con las cuentas', (at) => (
    <>
      <Headline x={110} y={100} start={at(20.6)} size={96} lines={[<span key="c">Cuidado con las <Highlight start={at(21.7)}>cuentas</Highlight></span>]} />
      <Tape text="CIFRAS DE 2013" x={120} y={250} start={at(23.0)} size={44} rotate={-2} />
      <IconTile x={1600} y={420} icon="factory" label="Una parte fue a infraestructura" start={at(27.6)} size={190} labelWidth={320} />
      <Headline x={140} y={480} start={at(28.6)} size={170} lines={['$143 M ÷ 20']} />
      <Strike x0={130} y0={580} x1={1170} y1={570} start={at(30.8)} />
      <Label text="≠ precio de cada vehículo" x={150} y={760} start={at(31.4)} size={34} color={theme.dataRed} />
    </>
  )),
  beat(32.9, 45.6, '5 · Capacidad: 200 al año', (at) => (
    <>
      <BigNumber x={110} y={180} value={200} caption="vehículos al año · capacidad instalada" size={240} start={at(35.6)} countFor={22} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="factory" x={1560} y={600} size={300} start={at(34.4)} />
      </svg>
      <IconTile x={1060} y={420} icon="doc" label="Pedidos" start={at(39.9)} size={160} />
      <IconTile x={1060} y={760} icon="coin" label="Presupuesto" start={at(40.7)} size={160} />
      <Arrow from={[1150, 420]} to={[1400, 540]} start={at(40.3)} />
      <Arrow from={[1150, 760]} to={[1400, 660]} start={at(41.1)} />
      <Label text="La capacidad no dice cuánto se produce" x={110} y={620} start={at(43.8)} size={28} />
    </>
  )),
  beat(45.6, 56.9, '6 · Memoria documental: 55 DN-XI', (at) => (
    <>
      <DocCard x={110} y={160} w={640} rot={-2} source="Memoria documental · Defensa" date="2018 – 2024" summary="55 DN-XI" start={at(46.2)} hlAt={at(51.8)} lines={5} />
      <BigNumber x={1000} y={130} value={55} caption="DN-XI" size={240} start={at(51.7)} countFor={20} />
      <Pictos x={1000} y={520} n={55} cols={11} size={60} gap={10} start={at(52.0)} over={28} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <DrawPath d="M80,130 H790 V640 H80 Z" start={at(55.0)} duration={16} width={3} dash={[14, 10]} />
      </svg>
      <Label text="Leer en el contexto del documento" x={110} y={690} start={at(55.4)} size={26} />
    </>
  )),
  beat(56.9, 64.2, '7 · Lo que la cifra no dice', (at) => (
    <>
      <IconTile x={420} y={420} icon="vehicle" label="¿Operativos en octubre de 2026?" start={at(57.6)} size={240} labelWidth={420} mark={{kind: 'question', at: at(60.0)}} />
      <Headline x={1000} y={360} start={at(62.4)} size={230} lines={['miles']} />
      <Strike x0={980} y0={480} x1={1600} y1={470} start={at(63.1)} />
    </>
  )),
  beat(64.2, 93.6, '8 · Méritos y límites', (at) => <MeritsLimits at={at} />, {push: 1.03}),
  beat(93.6, 107.9, '9 · DN-XIII', (at) => (
    <>
      <Headline x={110} y={70} start={at(93.8)} size={90} lines={[<span key="d">El desarrollo <Highlight start={at(94.7)}>continúa</Highlight></span>]} />
      <PhotoPlate img="sandcat" x={70} y={330} k={0.42} start={at(104.6)} />
      <PhotoPlate img="dnxi" x={470} y={340} k={0.44} start={at(102.6)} />
      <ModelCard x={880} y={330} name="DN-XII" at={at(103.6)} />
      <ModelCard x={1360} y={300} name="DN-XIII" at={at(97.6)} sub="Proyecto desde nov. 2022" strong />
      <Arrow from={[300, 600]} to={[1340, 480]} start={at(105.0)} bow={0.14} dash />
      <Arrow from={[680, 600]} to={[1345, 440]} start={at(103.0)} bow={0.1} dash />
      <Arrow from={[1215, 420]} to={[1350, 400]} start={at(104.0)} bow={0.06} dash />
      <IconTile x={1430} y={860} icon="shield" label="Protección" start={at(105.9)} size={150} />
      <IconTile x={1690} y={860} icon="speed" label="Movilidad" start={at(106.8)} size={150} />
    </>
  )),
  beat(107.9, 112.2, '10 · Aprendizaje industrial', (at) => (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <DrawPath d="M200,900 H520 V760 H840 V620 H1160 V480 H1480 V340 H1760" start={at(108.0)} duration={22} width={6} />
      </svg>
      <Disc x={1000} y={530} r={150} at={at(108.4)} />
      <PhotoPlate img="dnxi" x={860} y={410} k={0.36} start={at(108.6)} />
      <Headline x={110} y={110} start={at(109.2)} size={96} lines={[<span key="a">Aprendizaje <Highlight start={at(110.7)}>industrial</Highlight></span>]} />
    </>
  )),
  beat(112.2, 121.6, '11 · Falta información', (at) => (
    <>
      <Headline x={110} y={100} start={at(112.3)} size={92} lines={[<span key="f">Todavía falta <Highlight start={at(115.8)}>información</Highlight></span>]} />
      <IconTile x={420} y={580} icon="vehicle" label="Disponibilidad" start={at(117.5)} size={220} mark={{kind: 'question', at: at(118.0)}} />
      <IconTile x={960} y={580} icon="wrench" label="Mantenimiento" start={at(118.6)} size={220} mark={{kind: 'question', at: at(119.1)}} />
      <IconTile x={1500} y={580} icon="shield" label="Protección en servicio" start={at(119.7)} size={220} mark={{kind: 'question', at: at(120.6)}} />
    </>
  )),
  beat(121.6, 128.6, '12 · ¿Cuántos están listos?', (at) => (
    <>
      <Headline x={110} y={100} start={at(123.0)} size={92} lines={[<span key="c">¿Cuántos están <Highlight start={at(123.8)}>listos</Highlight>?</span>]} />
      <Pictos x={140} y={330} n={24} cols={12} size={110} gap={22} start={at(123.4)} over={18} highlight={7} />
      <PhotoPlate img="soldier" x={1440} y={560} k={1.08} start={at(126.6)} />
      <Label text="En el trabajo diario de las tropas" x={110} y={700} start={at(126.7)} size={30} />
    </>
  )),
  beat(128.6, 140, '13 · Más allá del desfile', (at) => (
    <>
      <Disc x={960} y={520} r={380} at={at(128.6)} />
      <PhotoPlate img="dnxi" x={380} y={180} k={1.42} start={at(128.7)} />
      <Headline x={960} y={890} align="center" start={at(129.2)} size={96} lines={[<span key="d">Más allá del <Highlight start={at(130.1)}>desfile</Highlight></span>]} />
    </>
  )),
];

const CUES: Cue[] = [
  [sec(0.4), 'paper', 0.12],
  [sec(3.0), 'pop', 0.08],
  [sec(6.0), 'paper', 0.13],
  [sec(8.6), 'pop', 0.1],
  [sec(13.3), 'pop', 0.08],
  [sec(16.4), 'pop', 0.08],
  [sec(18.8), 'pop', 0.08],
  [sec(23.0), 'paper', 0.12],
  [sec(30.8), 'pop', 0.1],
  [sec(35.6), 'pop', 0.1],
  [sec(39.9), 'pop', 0.08],
  [sec(40.7), 'pop', 0.08],
  [sec(46.2), 'paper', 0.13],
  [sec(51.8), 'pop', 0.1],
  [sec(60.0), 'pop', 0.09],
  [sec(63.1), 'pop', 0.1],
  [sec(65.3), 'paper', 0.12],
  [sec(70.9), 'pop', 0.08],
  [sec(74.3), 'pop', 0.08],
  [sec(77.8), 'pop', 0.08],
  [sec(79.6), 'thud', 0.14],
  [sec(81.3), 'paper', 0.12],
  [sec(82.2), 'pop', 0.08],
  [sec(85.0), 'pop', 0.08],
  [sec(86.0), 'thud', 0.12],
  [sec(89.9), 'pop', 0.09],
  [sec(92.5), 'pop', 0.09],
  [sec(97.6), 'paper', 0.12],
  [sec(102.6), 'paper', 0.1],
  [sec(104.6), 'paper', 0.1],
  [sec(108.6), 'paper', 0.1],
  [sec(117.5), 'pop', 0.08],
  [sec(118.6), 'pop', 0.08],
  [sec(119.7), 'pop', 0.08],
  [sec(126.6), 'paper', 0.12],
  [sec(128.7), 'paper', 0.13],
  [sec(130.1), 'stamp', 0.18],
];

// Lift the score after the last line, then let it ride out with the baked fade.
const bedVolume = (f: number) => interpolate(f, [sec(130.2), sec(130.9)], [0.085, 0.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Final: React.FC<FilmProps> = (props) => (
  <Film {...props} voice="audio/final.mp3" bed={{src: 'music/final.mp3', volume: bedVolume}} cues={CUES}>
    <Beats beats={BEATS} endFrame={FINAL_FRAMES} />
  </Film>
);
