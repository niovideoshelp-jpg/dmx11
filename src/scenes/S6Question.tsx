import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {font, theme} from '../theme';
import {DrawPath} from '../components/DrawPath';
import {Highlight} from '../components/Highlight';
import {MaskedLines} from '../components/MaskedLines';
import {CHASSIS_ON_DNXI, DNXI, PhotoPlate, toScreen} from '../components/Photo';
import {Tape} from '../components/Tape';
import {E, pop, tornStrip, tw} from '../lib/anim';

// "Pero, ¿qué tanto de esta máquina es realmente mexicano?"
// Scene starts at abs 718. Local: qué tanto 26 · esta máquina 47 · realmente 70 · mexicano 84.
// A magnifier slides over the DN-XI and shows the commercial chassis underneath.

const K = 1.12;
const PX = 953;
const PY = 1000 - DNXI.ground * K;
const CH = {x: PX + CHASSIS_ON_DNXI.x * K, y: PY + CHASSIS_ON_DNXI.y * K, k: K * CHASSIS_ON_DNXI.s};
const R = 158;

const headline: React.CSSProperties = {
  fontFamily: font.display,
  fontWeight: 900,
  fontSize: 118,
  lineHeight: 1.06,
  letterSpacing: '-0.015em',
  color: theme.ink,
  whiteSpace: 'nowrap',
};

export const S6Question: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = tw(frame, 0, 108, 1, 1.045, E.linear);
  const lensIn = pop(frame, 50);
  const lx = tw(frame, 50, 104, 1090, 1690, E.inOut);
  const ly = 770 + Math.sin(frame / 9) * 10;
  const strip = tw(frame, 44, 60, 0, 1, E.out);

  const marks: [readonly number[], number, number][] = [
    [DNXI.grille, 76, -6],
    [DNXI.turret, 82, 4],
    [DNXI.hull, 88, -3],
  ];

  return (
    <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '700px 400px'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(900 0) scale(${strip} 1) translate(-900 0)`}>
          <path d={tornStrip(900, 1920, 976, 104, 's6')} fill={theme.g5} />
        </g>
        <DrawPath d="M112,470 L700,466" start={10} duration={16} width={3} />
      </svg>

      <PhotoPlate img="dnxi" x={PX} y={PY} k={K} start={44} />

      {/* the magnifier: inside it, the machine is a commercial chassis */}
      {lensIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: lx - R,
            top: ly - R,
            width: R * 2,
            height: R * 2,
            transform: `scale(${lensIn})`,
          }}
        >
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', backgroundColor: theme.g6}}>
            <div style={{position: 'absolute', left: -(lx - R), top: -(ly - R), width: 1920, height: 1080}}>
              <PhotoPlate img="chassis" x={CH.x} y={CH.y} k={CH.k} dir="none" shadow={false} />
            </div>
          </div>
          <svg width={R * 2} height={R * 2} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <circle cx={R} cy={R} r={R - 4} fill="none" stroke={theme.ink} strokeWidth={9} />
            <circle cx={R} cy={R} r={R - 13} fill="none" stroke={theme.yellow} strokeWidth={5} />
            <path d={`M${R + R * 0.72},${R + R * 0.72} L${R + R * 1.2},${R + R * 1.2}`} stroke={theme.ink} strokeWidth={22} strokeLinecap="round" />
          </svg>
        </div>
      ) : null}

      {marks.map(([pt, f, rot], i) => {
        const [x, y] = toScreen(pt, PX, PY, K);
        return <Tape key={i} text="?" x={x - 18} y={y - 30} start={f} size={54} rotate={rot} />;
      })}

      <MaskedLines
        start={26}
        stagger={44}
        duration={14}
        style={{position: 'absolute', left: 104, top: 128}}
        lines={[
          <div key="a" style={headline}>
            ¿Qué tanto es
          </div>,
          <div key="b" style={headline}>
            realmente{' '}
            <Highlight start={84} duration={10}>
              mexicano
            </Highlight>
            ?
          </div>,
        ]}
      />
    </AbsoluteFill>
  );
};
