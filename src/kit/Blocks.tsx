import React from 'react';
import {useCurrentFrame} from 'remotion';
import {font, theme} from '../theme';
import {DrawPath} from '../components/DrawPath';
import {Highlight} from '../components/Highlight';
import {MaskedLines} from '../components/MaskedLines';
import {E, jitter, popInOut, tw} from '../lib/anim';
import {Glyph, GlyphName} from './Glyph';

const grunge = (
  <filter id="kit-grunge">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={5} result="n" />
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 0 0 0 2.05" result="holes" />
    <feComposite in="SourceGraphic" in2="holes" operator="in" />
  </filter>
);

/**
 * A source, pasted onto the page: the publication or document named in the narration,
 * its date, abstract grey text lines and one highlighted summary of what it says.
 * Never a reproduction of the real article — a labelled stand-in.
 */
export const DocCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  rot?: number;
  source: string;
  date?: string;
  summary?: React.ReactNode;
  start: number;
  hlAt?: number;
  exitAt?: number;
  lines?: number;
}> = ({x, y, w = 560, rot = -2, source, date, summary, start, hlAt, exitAt, lines = 5}) => {
  const frame = useCurrentFrame();
  const inP = tw(frame, start, start + 14, 0, 1, E.out);
  const outP = exitAt === undefined ? 0 : tw(frame, exitAt, exitAt + 10, 0, 1, E.in);
  const p = Math.max(0, inP - outP);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        transform: `rotate(${rot}deg) translateY(${(1 - p) * 40}px)`,
        clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`,
      }}
    >
      <div
        style={{
          backgroundColor: theme.g6,
          border: `2px solid ${theme.inkSoft}`,
          boxShadow: '0 12px 20px rgba(17,17,16,0.18)',
          padding: '26px 30px 30px',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `3px solid ${theme.ink}`, paddingBottom: 10}}>
          <div style={{fontFamily: font.label, fontWeight: 900, fontSize: 21, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.ink}}>{source}</div>
          {date ? <div style={{fontFamily: font.display, fontStyle: 'italic', fontSize: 24, color: theme.inkSoft, marginLeft: 16, whiteSpace: 'nowrap'}}>{date}</div> : null}
        </div>
        <div style={{marginTop: 18}}>
          {Array.from({length: lines}).map((_, i) => (
            <div
              key={i}
              style={{
                height: 9,
                width: `${92 - ((i * 37) % 30)}%`,
                backgroundColor: theme.g4,
                marginBottom: 12,
                transform: `scaleX(${tw(frame, start + 6 + i * 2, start + 16 + i * 2)})`,
                transformOrigin: '0 50%',
              }}
            />
          ))}
        </div>
        {summary ? (
          <div style={{fontFamily: font.display, fontWeight: 700, fontSize: 36, lineHeight: 1.18, color: theme.ink, marginTop: 8}}>
            <Highlight start={hlAt ?? start + 18} duration={10}>
              {summary}
            </Highlight>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Lower-third for a named person: ink silhouette, name, role, where and when they spoke. */
export const PersonCard: React.FC<{
  x: number;
  y: number;
  name: string;
  role: string;
  source?: string;
  start: number;
  exitAt?: number;
}> = ({x, y, name, role, source, start, exitAt}) => {
  const frame = useCurrentFrame();
  const disc = popInOut(frame, start, exitAt);
  const rule = Math.max(0, tw(frame, start + 4, start + 18) - (exitAt === undefined ? 0 : tw(frame, exitAt, exitAt + 8, 0, 1, E.in)));
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 28}}>
      <div style={{width: 150, height: 150, borderRadius: '50%', backgroundColor: theme.yellow, transform: `scale(${disc})`, position: 'relative', overflow: 'hidden'}}>
        <svg width={150} height={150} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}>
          <circle cx={50} cy={38} r={17} fill={theme.ink} />
          <path d="M16,104 C16,66 84,66 84,104 Z" fill={theme.ink} />
        </svg>
      </div>
      <div>
        <MaskedLines
          start={start + 6}
          exitAt={exitAt}
          lines={[
            <div key="n" style={{fontFamily: font.display, fontWeight: 900, fontSize: 58, lineHeight: 1.05, color: theme.ink, whiteSpace: 'nowrap'}}>
              {name}
            </div>,
            <div key="r" style={{fontFamily: font.label, fontWeight: 900, fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.inkSoft, marginTop: 10, whiteSpace: 'nowrap'}}>
              {role}
            </div>,
            ...(source
              ? [
                  <div key="s" style={{fontFamily: font.display, fontStyle: 'italic', fontSize: 28, color: theme.inkSoft, marginTop: 8, whiteSpace: 'nowrap'}}>
                    {source}
                  </div>,
                ]
              : []),
          ]}
        />
        <div style={{height: 4, width: 420, backgroundColor: theme.ink, marginTop: 14, transform: `scaleX(${rule})`, transformOrigin: '0 50%'}} />
      </div>
    </div>
  );
};

/** A figure that counts up to its value, in the display serif, with a unit and a caption. */
export const BigNumber: React.FC<{
  x: number;
  y: number;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  caption?: string;
  size?: number;
  start: number;
  countFor?: number;
  exitAt?: number;
  align?: 'left' | 'center';
  highlight?: boolean;
}> = ({x, y, value, decimals = 0, prefix = '', suffix = '', caption, size = 200, start, countFor = 24, exitAt, align = 'left', highlight = true}) => {
  const frame = useCurrentFrame();
  const v = tw(frame, start, start + countFor, 0, value, E.out);
  const txt = v.toLocaleString('es-MX', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  const lines = [
    <div key="v" style={{fontFamily: font.display, fontWeight: 900, fontSize: size, lineHeight: 0.95, color: theme.ink, whiteSpace: 'nowrap', letterSpacing: '-0.02em'}}>
      {highlight ? (
        <Highlight start={start + countFor - 6} duration={10} exitAt={exitAt}>
          {prefix}
          {txt}
          {suffix}
        </Highlight>
      ) : (
        <>
          {prefix}
          {txt}
          {suffix}
        </>
      )}
    </div>,
    ...(caption
      ? [
          <div key="c" style={{fontFamily: font.label, fontWeight: 900, fontSize: Math.max(22, size * 0.14), letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.ink, marginTop: size * 0.12, whiteSpace: 'nowrap'}}>
            {caption}
          </div>,
        ]
      : []),
  ];
  return (
    <MaskedLines
      start={start}
      stagger={8}
      exitAt={exitAt}
      style={{position: 'absolute', left: x, top: y, transform: align === 'center' ? 'translateX(-50%)' : undefined, textAlign: align}}
      lines={lines}
    />
  );
};

/** Headline set in the display serif, line by line behind a moving edge; one phrase highlighted. */
export const Headline: React.FC<{
  x: number;
  y: number;
  lines: React.ReactNode[];
  start: number;
  stagger?: number;
  size?: number;
  exitAt?: number;
  align?: 'left' | 'center';
  kicker?: string;
}> = ({x, y, lines, start, stagger = 10, size = 104, exitAt, align = 'left', kicker}) => (
  <MaskedLines
    start={start}
    stagger={stagger}
    exitAt={exitAt}
    style={{position: 'absolute', left: x, top: y, transform: align === 'center' ? 'translateX(-50%)' : undefined, textAlign: align}}
    lines={[
      ...(kicker
        ? [
            <div key="k" style={{fontFamily: font.display, fontStyle: 'italic', fontSize: size * 0.36, color: theme.inkSoft, marginBottom: size * 0.12}}>
              {kicker}
            </div>,
          ]
        : []),
      ...lines.map((l, i) => (
        <div key={i} style={{fontFamily: font.display, fontWeight: 900, fontSize: size, lineHeight: 1.06, letterSpacing: '-0.015em', color: theme.ink, whiteSpace: 'nowrap'}}>
          {l}
        </div>
      )),
    ]}
  />
);

/** Horizontal timeline: axis draws, ticks pop, a cursor travels from year to year. */
export const Timeline: React.FC<{
  x0: number;
  x1: number;
  y: number;
  from: number;
  to: number;
  start: number;
  stops: {year: number; at: number}[];
  exitAt?: number;
}> = ({x0, x1, y, from, to, start, stops, exitAt}) => {
  const frame = useCurrentFrame();
  const xAt = (yr: number) => x0 + ((yr - from) / (to - from)) * (x1 - x0);
  let cx = xAt(stops[0]?.year ?? from);
  for (let i = 1; i < stops.length; i++) {
    cx = cx + (xAt(stops[i].year) - xAt(stops[i - 1].year)) * tw(frame, stops[i].at - 10, stops[i].at + 4, 0, 1, E.inOut);
  }
  const cursor = popInOut(frame, stops[0]?.at ?? start, exitAt);
  const years = Array.from({length: to - from + 1}, (_, i) => from + i);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <DrawPath d={`M${x0},${y} L${x1},${y - 2}`} start={start} duration={20} out={exitAt} width={4} />
      {years.map((yr, i) => {
        const big = stops.some((s) => s.year === yr);
        const s = popInOut(frame, start + 4 + i * 1.5, exitAt);
        return (
          <g key={yr} transform={`translate(${xAt(yr)} ${y})`}>
            <path d={`M0,${-12 * s} V${12 * s}`} stroke={theme.ink} strokeWidth={big ? 4 : 2.5} />
            {s > 0.01 ? (
              <text y={52} textAnchor="middle" fontFamily={font.display} fontWeight={700} fontSize={big ? 34 : 24} fill={big ? theme.ink : theme.inkSoft} opacity={1} transform={`scale(${s})`}>
                {yr}
              </text>
            ) : null}
          </g>
        );
      })}
      <g transform={`translate(${cx} ${y}) scale(${cursor})`}>
        <circle r={22} fill={theme.yellow} stroke={theme.ink} strokeWidth={4} />
        <circle r={7} fill={theme.ink} />
      </g>
    </svg>
  );
};

/** A grid of small vehicle (or helmet) pictograms that stamp in one after another. */
export const Pictos: React.FC<{
  x: number;
  y: number;
  n: number;
  cols: number;
  size?: number;
  gap?: number;
  start: number;
  over?: number;
  exitAt?: number;
  glyph?: 'vehicle' | 'person';
  highlight?: number;
}> = ({x, y, n, cols, size = 54, gap = 12, start, over = 24, exitAt, glyph = 'vehicle', highlight = 0}) => {
  const frame = useCurrentFrame();
  const d =
    glyph === 'vehicle'
      ? 'M6,66 V36 Q6,28 14,28 H60 L70,42 H88 L94,50 V66 Z M18,68 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 Z M64,68 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 Z'
      : 'M36,28 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0 Z M22,90 C22,58 78,58 78,90 Z';
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {Array.from({length: n}).map((_, i) => {
        const s = popInOut(frame, start + (i / Math.max(1, n - 1)) * over, exitAt);
        if (s <= 0.01) return null;
        const cx = x + (i % cols) * (size + gap);
        const cy = y + Math.floor(i / cols) * (size * 0.8 + gap);
        return (
          <g key={i} transform={`translate(${cx} ${cy}) scale(${(size / 100) * s})`}>
            <path d={d} fill={i < highlight ? theme.yellow : theme.ink} stroke={theme.ink} strokeWidth={i < highlight ? 4 : 0} />
          </g>
        );
      })}
    </svg>
  );
};

/** Rubber stamp: slams in from oversize, inked with holes. */
export const Stamp: React.FC<{
  x: number;
  y: number;
  text: string;
  start: number;
  rot?: number;
  size?: number;
  color?: string;
  exitAt?: number;
}> = ({x, y, text, start, rot = -8, size = 40, color = theme.dataRed, exitAt}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const slam = tw(frame, start, start + 6, 2.1, 1, E.in);
  const out = exitAt === undefined ? 1 : 1 - tw(frame, exitAt, exitAt + 8, 0, 1, E.in);
  if (out <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${slam * out})`}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <defs>{grunge}</defs>
      </svg>
      <div
        style={{
          border: `${Math.max(4, size * 0.14)}px solid ${color}`,
          padding: `${size * 0.22}px ${size * 0.5}px`,
          fontFamily: font.label,
          fontWeight: 900,
          fontSize: size,
          letterSpacing: '0.12em',
          color,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          filter: 'url(#kit-grunge)',
          mixBlendMode: 'multiply',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** A coral line struck through something: a claim the narration rules out. */
export const Strike: React.FC<{x0: number; y0: number; x1: number; y1: number; start: number; out?: number}> = ({x0, y0, x1, y1, start, out}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
    <DrawPath d={`M${x0},${y0} Q${(x0 + x1) / 2},${(y0 + y1) / 2 - 10} ${x1},${y1}`} start={start} duration={9} out={out} width={9} color={theme.dataRed} />
  </svg>
);

/** A glyph inside a paper disc with a caption: the unit of every list, row and diagram. */
export const IconTile: React.FC<{
  x: number;
  y: number;
  icon: GlyphName;
  label?: string;
  sub?: string;
  start: number;
  exitAt?: number;
  size?: number;
  mark?: {kind: 'check' | 'cross' | 'question'; at: number};
  labelWidth?: number;
}> = ({x, y, icon, label, sub, start, exitAt, size = 150, mark, labelWidth = 260}) => {
  const frame = useCurrentFrame();
  const disc = popInOut(frame, start, exitAt);
  const m = mark ? popInOut(frame, mark.at, exitAt) : 0;
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <g transform={`translate(${x} ${y}) scale(${disc})`}>
          <circle r={size / 2} fill={theme.paper} stroke={theme.ink} strokeWidth={4} />
        </g>
        <Glyph name={icon} x={x} y={y} size={size * 0.62} start={start + 3} exitAt={exitAt} />
        {mark && m > 0.01 ? (
          <g transform={`translate(${x + size * 0.36} ${y - size * 0.36}) scale(${m}) rotate(${jitter(`${icon}${x}`, 8)})`}>
            <circle r={size * 0.2} fill={mark.kind === 'check' ? theme.yellow : mark.kind === 'cross' ? theme.dataRed : theme.ink} />
            {mark.kind === 'check' ? (
              <path d={`M${-size * 0.09},0 l${size * 0.06},${size * 0.06} l${size * 0.12},${-size * 0.12}`} fill="none" stroke={theme.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            ) : mark.kind === 'cross' ? (
              <path d={`M${-size * 0.08},${-size * 0.08} L${size * 0.08},${size * 0.08} M${size * 0.08},${-size * 0.08} L${-size * 0.08},${size * 0.08}`} stroke={theme.paper} strokeWidth={6} strokeLinecap="round" />
            ) : (
              <text y={size * 0.08} textAnchor="middle" fontFamily={font.display} fontWeight={900} fontSize={size * 0.26} fill={theme.yellow}>
                ?
              </text>
            )}
          </g>
        ) : null}
      </svg>
      {label ? (
        <MaskedLines
          start={start + 8}
          exitAt={exitAt}
          style={{position: 'absolute', left: x - labelWidth / 2, top: y + size / 2 + 18, width: labelWidth, textAlign: 'center'}}
          lines={[
            <div key="l" style={{fontFamily: font.label, fontWeight: 900, fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.ink, lineHeight: 1.25}}>
              {label}
            </div>,
            ...(sub
              ? [
                  <div key="s" style={{fontFamily: font.display, fontStyle: 'italic', fontSize: 26, color: theme.inkSoft, marginTop: 6}}>
                    {sub}
                  </div>,
                ]
              : []),
          ]}
        />
      ) : null}
    </>
  );
};

/** Hand-drawn arrow between two points: curve first, head 3 frames after it lands. */
export const Arrow: React.FC<{from: [number, number]; to: [number, number]; bow?: number; start: number; out?: number; color?: string; width?: number; dash?: boolean}> = ({
  from,
  to,
  bow = 0.18,
  start,
  out,
  color = theme.ink,
  width = 4,
  dash,
}) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bow;
  const my = (y1 + y2) / 2 + (x2 - x1) * bow;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const h = 22;
  const hp = (a: number) => `${x2 - h * Math.cos(ang + a)},${y2 - h * Math.sin(ang + a)}`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <DrawPath d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} start={start} duration={14} out={out} width={width} color={color} dash={dash ? [12, 9] : undefined} />
      <DrawPath d={`M${hp(0.45)} L${x2},${y2} L${hp(-0.45)}`} start={start + 15} duration={5} out={out} width={width} color={color} />
    </svg>
  );
};

/** Beam angle of a Balance at this frame: settles from `from` to `to` degrees with a wobble. */
export const balanceAngle = (frame: number, at: number, to: number, from = 0) => from + (to - from) * tw(frame, at, at + 26, 0, 1, E.elastic);

/** Balance scale; `angle` in degrees (positive = right pan lower). Ride content with balancePans. */
export const Balance: React.FC<{x: number; y: number; start: number; angle: number; exitAt?: number; arm?: number}> = ({
  x,
  y,
  start,
  angle,
  exitAt,
  arm = 420,
}) => {
  const frame = useCurrentFrame();
  const r = (angle * Math.PI) / 180;
  const lx = x - Math.cos(r) * arm;
  const ly = y - Math.sin(r) * arm;
  const rx = x + Math.cos(r) * arm;
  const ry = y + Math.sin(r) * arm;
  const pan = (px: number, py: number) => `M${px - 110},${py + 150} Q${px},${py + 210} ${px + 110},${py + 150} Z`;
  const show = popInOut(frame, start, exitAt);
  if (show <= 0.01) return null;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={`M${x},${y} V${y + 420} M${x - 120},${y + 420} H${x + 120}`} stroke={theme.ink} strokeWidth={8} strokeLinecap="round" />
      <path d={`M${lx},${ly} L${rx},${ry}`} stroke={theme.ink} strokeWidth={9} strokeLinecap="round" />
      <circle cx={x} cy={y} r={16} fill={theme.yellow} stroke={theme.ink} strokeWidth={5} />
      {[
        [lx, ly],
        [rx, ry],
      ].map(([px, py], i) => (
        <g key={i}>
          <path d={`M${px},${py} L${px - 110},${py + 150} M${px},${py} L${px + 110},${py + 150}`} stroke={theme.inkSoft} strokeWidth={3} />
          <path d={pan(px, py)} fill={theme.g5} stroke={theme.ink} strokeWidth={4} />
        </g>
      ))}
    </svg>
  );
};

/** Pan positions for content riding on a Balance. */
export const balancePans = (x: number, y: number, tiltDeg: number, arm = 420) => {
  const r = (tiltDeg * Math.PI) / 180;
  return {
    left: [x - Math.cos(r) * arm, y - Math.sin(r) * arm + 150] as [number, number],
    right: [x + Math.cos(r) * arm, y + Math.sin(r) * arm + 150] as [number, number],
  };
};

/** Dial gauge: arc and ticks draw, needle swings to `value` (0..max) and breathes. */
export const Dial: React.FC<{
  x: number;
  y: number;
  r?: number;
  max: number;
  value: number;
  start: number;
  needleAt: number;
  label?: string;
  unit?: string;
  ticks?: number[];
  exitAt?: number;
  wobble?: number;
}> = ({x, y, r = 250, max, value, start, needleAt, label, unit, ticks = [], exitAt, wobble = 0}) => {
  const frame = useCurrentFrame();
  const ang = (v: number) => 180 + (v / max) * 180;
  const pt = (a: number, rr: number) => [x + Math.cos((a * Math.PI) / 180) * rr, y + Math.sin((a * Math.PI) / 180) * rr];
  const v = tw(frame, needleAt, needleAt + 26, 0, value, E.back) + (frame > needleAt + 26 ? Math.sin((frame - needleAt) / 5) * wobble : 0);
  const [nx, ny] = pt(ang(v), r * 0.84);
  const show = popInOut(frame, start, exitAt);
  const [ax, ay] = pt(180, r);
  const [bx, by] = pt(360, r);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <DrawPath d={`M${ax},${ay} A${r},${r} 0 0 1 ${bx},${by}`} start={start} duration={18} out={exitAt} width={9} />
      {ticks.map((t, i) => {
        const [x0, y0] = pt(ang(t), r - 40);
        const [x1, y1] = pt(ang(t), r - 8);
        const [tx, ty] = pt(ang(t), r - 76);
        return (
          <g key={t}>
            <DrawPath d={`M${x0},${y0} L${x1},${y1}`} start={start + 6 + i * 2} duration={6} out={exitAt} width={4} />
            {show > 0.01 ? (
              <text x={tx} y={ty + 10} textAnchor="middle" fontFamily={font.display} fontWeight={700} fontSize={30} fill={theme.inkSoft}>
                {t}
              </text>
            ) : null}
          </g>
        );
      })}
      {frame >= needleAt && show > 0.01 ? (
        <g>
          <path d={`M${x},${y} L${nx},${ny}`} stroke={theme.ink} strokeWidth={10} strokeLinecap="round" />
          <circle cx={x} cy={y} r={22} fill={theme.ink} />
          <circle cx={x} cy={y} r={9} fill={theme.yellow} />
        </g>
      ) : null}
      {label && show > 0.01 ? (
        <text x={x} y={y + 90} textAnchor="middle" fontFamily={font.label} fontWeight={900} fontSize={24} letterSpacing={3} fill={theme.ink}>
          {label}
        </text>
      ) : null}
      {unit && show > 0.01 ? (
        <text x={x} y={y - r * 0.32} textAnchor="middle" fontFamily={font.display} fontStyle="italic" fontSize={34} fill={theme.inkSoft}>
          {unit}
        </text>
      ) : null}
    </svg>
  );
};

/** Ruled bar of the newspaper-chart reference: label, track, fill that grows, value. */
export const Bar: React.FC<{
  x: number;
  y: number;
  w: number;
  label: string;
  value: number;
  max: number;
  start: number;
  valueText?: string;
  color?: string;
  exitAt?: number;
  dashed?: boolean;
}> = ({x, y, w, label, value, max, start, valueText, color = theme.dataBlue, exitAt, dashed}) => {
  const frame = useCurrentFrame();
  const out = exitAt === undefined ? 0 : tw(frame, exitAt, exitAt + 9, 0, 1, E.in);
  const g = Math.max(0, tw(frame, start + 6, start + 30, 0, 1, E.out) - out);
  const lbl = Math.max(0, tw(frame, start, start + 12) - out);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w + 200}}>
      <div style={{fontFamily: font.label, fontWeight: 900, fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.ink, clipPath: `inset(0 ${(1 - lbl) * 100}% 0 0)`, whiteSpace: 'nowrap'}}>
        {label}
      </div>
      <div style={{position: 'relative', height: 46, marginTop: 10}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 46,
            width: (value / max) * w,
            backgroundColor: dashed ? 'transparent' : color,
            border: dashed ? `4px dashed ${theme.ink}` : undefined,
            transform: `scaleX(${g})`,
            transformOrigin: '0 50%',
          }}
        />
        <div style={{position: 'absolute', left: (value / max) * w * g + 18, top: 4, fontFamily: font.display, fontWeight: 900, fontSize: 36, color: theme.ink, whiteSpace: 'nowrap', opacity: g > 0.05 ? 1 : 0}}>
          {valueText}
        </div>
      </div>
    </div>
  );
};
