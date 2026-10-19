import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {font, sec, theme} from '../theme';
import {Cue, Film, FilmProps} from '../components/Film';
import {Highlight} from '../components/Highlight';
import {LottieIcon} from '../components/LottieIcon';
import {PhotoPlate} from '../components/Photo';
import {Label, Tape} from '../components/Tape';
import {DrawPath} from '../components/DrawPath';
import {At, beat, Beats} from '../kit/Beats';
import {Arrow, Balance, BigNumber, DocCard, Headline, IconTile, Pictos, Timeline, balanceAngle, balancePans} from '../kit/Blocks';
import {Glyph} from '../kit/Glyph';
import {MapCard, mapPoint} from '../kit/MapCard';
import {DnxiXray} from '../kit/Xray';
import {pop} from '../lib/anim';

// Parte 1 — origen del programa (73,2 s). Times are narration seconds (Whisper word starts).
export const PART1_FRAMES = sec(73.2) + 24;

const Year: React.FC<{year: string; at: number; x?: number; y?: number; size?: number; caption?: string}> = ({year, at, x = 110, y = 150, size = 250, caption}) => (
  <>
    <Headline x={x} y={y} start={at} size={size} lines={[<Highlight key="y" start={at + 8}>{year}</Highlight>]} />
    {caption ? <Label text={caption} x={x + 6} y={y + size * 1.18} start={at + 12} size={24} /> : null}
  </>
);

const Disc: React.FC<{x: number; y: number; r: number; at: number}> = ({x, y, r, at}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        backgroundColor: theme.yellow,
        transform: `scale(${pop(frame, at)})`,
        mixBlendMode: 'multiply',
      }}
    />
  );
};

const OrgBox: React.FC<{x: number; y: number; title: React.ReactNode; sub: string; at: number}> = ({x, y, title, sub, at}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, textAlign: 'center'}}>
      <div style={{backgroundColor: theme.g6, border: `4px solid ${theme.ink}`, padding: '26px 54px', boxShadow: '0 12px 20px rgba(17,17,16,0.18)'}}>
        <div style={{fontFamily: font.display, fontWeight: 900, fontSize: 104, lineHeight: 1, color: theme.ink}}>{title}</div>
        <div style={{fontFamily: font.label, fontWeight: 900, fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.inkSoft, marginTop: 14, whiteSpace: 'nowrap'}}>{sub}</div>
      </div>
    </div>
  );
};

// Map spots for "operaciones" (approximate, no labels): north-west, north-east, centre-west, gulf.
const OPS: [number, number][] = [
  [1246, 503],
  [1420, 430],
  [1430, 690],
  [1535, 560],
];

const ComparisonBalance: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const angle = balanceAngle(frame, at(70.4), 9);
  const {left, right} = balancePans(960, 330, angle, 430);
  return (
    <>
      <Balance x={960} y={330} start={0} angle={angle} arm={430} />
      <PhotoPlate img="soldier" x={left[0] - 95} y={left[1] - 230} k={0.55} start={2} />
      <PhotoPlate img="dnxi" x={right[0] - 200} y={right[1] - 236} k={0.5} start={6} />
      <Label text="Patrulla expuesta" x={left[0]} y={left[1] + 110} start={10} size={22} align="center" />
      <Label text="Dentro del blindado" x={right[0]} y={right[1] + 110} start={14} size={22} align="center" />
    </>
  );
};

const BEATS = [
  beat(0, 8.3, '1 · 2011', (at) => (
    <>
      <Year year="2011" at={at(1.3)} caption="Inicio del desarrollo" />
      <Timeline x0={140} x1={1780} y={930} from={2010} to={2014} start={at(0.2)} stops={[{year: 2011, at: at(1.4)}]} />
      <MapCard x={980} y={150} k={0.62} start={at(2.6)} drawFor={26} />
      {OPS.map((p, i) => {
        const [x, y] = mapPoint(p, 980, 150, 0.62);
        return <LottieIcon key={i} name="impact" x={x} y={y} size={120} start={at(4.6) + i * 6} noPop exitAt={at(4.6) + i * 6 + 40} />;
      })}
    </>
  )),
  beat(8.3, 14.3, '2 · Proteger mejor a los soldados', (at) => (
    <>
      <Disc x={380} y={640} r={240} at={at(8.4)} />
      <PhotoPlate img="soldier" x={150} y={500} k={1.32} start={at(8.6)} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Glyph name="shield" x={690} y={430} size={170} start={at(9.7)} />
        <DrawPath d="M940,300 H1800 V860 H940 Z" start={at(11.9)} duration={20} width={2.5} color={theme.inkSoft} dash={[14, 10]} />
        <DrawPath d="M940,890 H1800 M940,875 V905 M1800,875 V905" start={at(12.2)} duration={14} width={2} color={theme.inkSoft} />
      </svg>
      <PhotoPlate img="dnxi" x={970} y={320} k={1.02} start={at(12.4)} />
    </>
  )),
  beat(14.3, 21.7, '3 · 2012: primer lote', (at) => (
    <>
      <Year year="2012" at={at(14.5)} y={110} size={210} />
      <Timeline x0={140} x1={1780} y={960} from={2010} to={2014} start={0} stops={[{year: 2011, at: 0}, {year: 2012, at: at(14.6)}]} />
      <DocCard x={1110} y={110} w={640} rot={2} source="Documentos del gobierno" date="2012" summary="Infraestructura y primer lote" start={at(15.6)} hlAt={at(18.4)} />
      <BigNumber x={110} y={470} value={12} size={230} caption="unidades · primer lote" start={at(20.4)} countFor={14} />
      <Pictos x={520} y={560} n={12} cols={6} size={74} gap={16} start={at(20.6)} over={12} />
    </>
  )),
  beat(21.7, 28.7, '4 · 2013: 50 ensamblados', (at) => (
    <>
      <Year year="2013" at={at(21.8)} y={110} size={210} />
      <Timeline x0={140} x1={1780} y={960} from={2010} to={2014} start={0} stops={[{year: 2012, at: 0}, {year: 2013, at: at(21.9)}]} />
      <DocCard
        x={1110}
        y={110}
        w={640}
        rot={2}
        source="Informe de ejecución · PND"
        date="2013"
        summary="50 DN-XI ensamblados"
        start={at(23.0)}
        hlAt={at(26.3)}
      />
      <BigNumber x={110} y={470} value={50} size={230} caption="DN-XI ensamblados" start={at(26.2)} countFor={20} />
      <Pictos x={520} y={520} n={50} cols={10} size={52} gap={10} start={at(26.4)} over={28} />
    </>
  )),
  beat(28.7, 36.3, '5 · DGIM · SEDENA', (at) => (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <DrawPath d="M960,330 V560" start={at(33.6)} duration={12} width={5} />
        <DrawPath d="M1330,660 C1430,660 1440,700 1490,720" start={at(29.4)} duration={12} width={3} dash={[12, 9]} />
      </svg>
      <OrgBox x={960} y={250} at={at(33.3)} title={<Highlight start={at(35.5)}>SEDENA</Highlight>} sub="Secretaría de la Defensa Nacional" />
      <OrgBox x={960} y={660} at={at(30.2)} title="DGIM" sub="Dirección General de Industria Militar" />
      <PhotoPlate img="dnxi" x={1480} y={620} k={0.48} start={at(29.0)} />
    </>
  )),
  beat(36.3, 43.1, '6 · Referencia: Sandcat', (at) => (
    <>
      <DocCard x={110} y={130} w={560} rot={-2} source="Prensa especializada" summary="Referencia: el Sandcat" start={at(36.5)} hlAt={at(40.2)} lines={4} />
      <PhotoPlate img="sandcat" x={190} y={520} k={0.76} start={at(39.7)} />
      <Tape text="SANDCAT" x={300} y={500} start={at(40.2)} size={52} rotate={-4} />
      <Arrow from={[880, 760]} to={[1180, 660]} start={at(41.1)} bow={-0.15} width={5} />
      <PhotoPlate img="dnxi" x={1200} y={420} k={0.78} start={at(41.6)} />
      <Tape text="DN-XI" x={1360} y={400} start={at(42.0)} size={52} rotate={3} />
    </>
  )),
  beat(43.1, 55.0, '7 · Lo que se esperaba de él', (at) => (
    <>
      <Headline x={110} y={100} start={at(43.8)} size={86} lines={[<span key="h">¿Por qué este <Highlight start={at(46.0)}>diseño</Highlight>?</span>]} />
      <PhotoPlate img="dnxi" x={110} y={330} k={1.0} start={at(44.9)} />
      <IconTile x={1190} y={520} icon="shield" label="Militares protegidos" start={at(49.3)} size={170} />
      <IconTile x={1460} y={520} icon="target" label="Operaciones de alto riesgo" start={at(51.1)} size={170} />
      <IconTile x={1730} y={520} icon="city" label="Zonas urbanas" start={at(53.9)} size={170} />
    </>
  )),
  beat(55.0, 59.2, '8 · Patrulla expuesta', (at) => (
    <>
      <Disc x={760} y={640} r={300} at={at(55.1)} />
      <PhotoPlate img="soldier" x={520} y={420} k={1.5} start={at(55.3)} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {[
          [1900, 300, 1010, 520],
          [1900, 620, 1080, 700],
          [1900, 840, 1000, 830],
        ].map(([x0, y0, x1, y1], i) => (
          <DrawPath key={i} d={`M${x0},${y0} L${x1},${y1}`} start={at(56.9) + i * 5} duration={6} out={at(56.9) + i * 5 + 14} width={3} color={theme.dataRed} dash={[12, 9]} />
        ))}
      </svg>
      {[
        [1010, 520],
        [1080, 700],
        [1000, 830],
      ].map(([x, y], i) => (
        <LottieIcon key={i} name="impact" x={x} y={y} size={150} start={at(57.1) + i * 5} noPop />
      ))}
    </>
  )),
  beat(59.2, 66.8, '9 · Dentro del blindado', (at) => (
    <>
      <PhotoPlate img="dnxi" x={110} y={250} k={1.25}>
        <DnxiXray at={at(60.1)} id="p1" />
      </PhotoPlate>
      <IconTile x={1560} y={330} icon="shield" label="¿Cuánto los protege?" start={at(62.3)} size={180} mark={{kind: 'question', at: at(63.0)}} />
      <IconTile x={1560} y={720} icon="speed" label="¿Moverse y responder?" start={at(64.6)} size={180} mark={{kind: 'question', at: at(66.0)}} />
    </>
  )),
  beat(66.8, 80, '10 · ¿Qué aporta realmente?', (at) => (
    <>
      <ComparisonBalance at={at} />
      <Headline
        x={960}
        y={860}
        align="center"
        start={at(69.6)}
        size={84}
        lines={[<span key="q">¿Qué aporta realmente el <Highlight start={at(72.2)}>DN-XI</Highlight>?</span>]}
      />
    </>
  )),
];

const CUES: Cue[] = [
  [sec(4.6), 'impact', 0.14],
  [sec(4.8), 'impact', 0.12],
  [sec(5.0), 'impact', 0.13],
  [sec(8.6), 'paper', 0.14],
  [sec(12.4), 'paper', 0.12],
  [sec(15.6), 'paper', 0.14],
  [sec(20.5), 'pop', 0.1],
  [sec(23.0), 'paper', 0.14],
  [sec(26.3), 'pop', 0.1],
  [sec(30.2), 'pop', 0.1],
  [sec(33.3), 'pop', 0.1],
  [sec(39.7), 'paper', 0.13],
  [sec(41.6), 'paper', 0.12],
  [sec(49.3), 'pop', 0.09],
  [sec(51.1), 'pop', 0.09],
  [sec(53.9), 'pop', 0.09],
  [sec(57.1), 'impact', 0.17],
  [sec(57.3), 'impact', 0.14],
  [sec(57.4), 'impact', 0.16],
  [sec(62.3), 'pop', 0.1],
  [sec(64.6), 'pop', 0.1],
  [sec(70.4), 'thud', 0.18],
];

const bedVolume = (f: number) => interpolate(f, [sec(72.6), sec(73.2) + 10], [0.095, 0.17], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Part1: React.FC<FilmProps> = (props) => (
  <Film {...props} voice="audio/parte1.mp3" bed={{src: 'music/p1.mp3', volume: bedVolume}} cues={CUES}>
    <Beats beats={BEATS} endFrame={PART1_FRAMES} />
  </Film>
);

