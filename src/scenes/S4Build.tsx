import React from 'react';
import {useGsapTimeline} from '@remotion/gsap';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getLength, getPointAtLength} from '@remotion/paths';
import {font, theme} from '../theme';
import {DrawPath} from '../components/DrawPath';
import {LottieIcon} from '../components/LottieIcon';
import {Operator} from '../components/Icons';
import {CHASSIS_ON_DNXI, DNXI, PhotoPlate, toScreen} from '../components/Photo';
import {Label} from '../components/Tape';
import {E, pop, tornStrip, tw} from '../lib/anim';

// "...que combina una base automotriz comercial con el blindaje y la integración de sistemas
//  realizados por la industria militar mexicana. Puede incluso incorporar armamento
//  controlado desde el interior de la cabina."
// Scene starts at abs 395. Local: base comercial 15 · blindaje 72 · integración 95 ·
// industria militar 156 · Puede 203 · armamento 241 · controlado 252 · desde el interior 272.

const PX = 385;
const PY = 230;
const K = 1.42;
const GROUND = PY + DNXI.ground * K; // ~929
const CH = {x: PX + CHASSIS_ON_DNXI.x * K, y: PY + CHASSIS_ON_DNXI.y * K, k: K * CHASSIS_ON_DNXI.s};
const S = (pt: readonly number[]) => toScreen(pt, PX, PY, K);

const FRONT = S(DNXI.frontWheel);
const REAR = S(DNXI.rearWheel);
const HUB = S(DNXI.hull);
const ANT = S(DNXI.antenna);
const TUR = S(DNXI.turret);
const LAMP = S(DNXI.headlight);

const MARKOUT = 186;
const f2s = (f: number) => f / 30;

// Zoom framing: turret region to the left half, room for the inset card on the right.
const Z = {scale: 2, x: 700 - 2 * (PX + 430 * K), y: 520 - 2 * (PY + 120 * K)};
const zoomed = (pt: [number, number]): [number, number] => [Z.x + pt[0] * Z.scale, Z.y + pt[1] * Z.scale];

// Circuit traces: orthogonal runs from one hub on the hull to each system.
const TRACES = [
  `M${HUB[0]},${HUB[1]} V${ANT[1] + 70} H${ANT[0]} V${ANT[1]}`,
  `M${HUB[0]},${HUB[1]} V${TUR[1] + 90} H${TUR[0]} V${TUR[1]}`,
  `M${HUB[0]},${HUB[1]} H${LAMP[0] + 120} V${LAMP[1]} H${LAMP[0]}`,
  `M${HUB[0]},${HUB[1]} V${FRONT[1] - 40} H${FRONT[0]} V${FRONT[1]}`,
];
const BADGES: {name: 'radio' | 'eye' | 'bolt' | 'gear'; at: [number, number]; to: [number, number]; f: number}[] = [
  {name: 'eye', at: [985, 182], to: TUR, f: 114},
  {name: 'radio', at: [1430, 292], to: ANT, f: 118},
  {name: 'bolt', at: [520, 560], to: LAMP, f: 122},
  {name: 'gear', at: [560, 868], to: FRONT, f: 126},
];

const SIGNAL = 'M1296,322 C1140,282 980,380 838,478';

const Stamp: React.FC = () => (
  <svg width={340} height={340} viewBox="-170 -170 340 340" style={{overflow: 'visible'}}>
    <defs>
      <filter id="stamp-grunge">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={11} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.1" result="holes" />
        <feComposite in="SourceGraphic" in2="holes" operator="in" />
      </filter>
      <path id="stamp-ring" d="M-128,0 A128,128 0 1,1 128,0 A128,128 0 1,1 -128,0" />
    </defs>
    <g filter="url(#stamp-grunge)" style={{mixBlendMode: 'multiply'}}>
      <circle r={156} fill="none" stroke={theme.ink} strokeWidth={9} />
      <circle r={104} fill="none" stroke={theme.ink} strokeWidth={3} />
      <text fontFamily={font.label} fontWeight={900} fontSize={27} fill={theme.ink}>
        <textPath href="#stamp-ring" startOffset="0%" textLength={786} lengthAdjust="spacing">
          INDUSTRIA MILITAR · MEXICANA ·
        </textPath>
      </text>
      <path
        d="M0,-62 L15,-20 L59,-19 L24,8 L37,50 L0,25 L-37,50 L-24,8 L-59,-19 L-15,-20 Z"
        fill={theme.yellow}
        stroke={theme.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const Dust: React.FC<{x: number; y: number; dir: number; start: number}> = ({x, y, dir, start}) => (
  <g>
    {[0, 1, 2].map((i) => (
      <DrawPath
        key={i}
        d={`M${x + dir * 20},${y - 6 - i * 14} q${dir * 46},${-18 - i * 8} ${dir * (90 + i * 26)},${-4 - i * 10}`}
        start={start + i}
        duration={9}
        out={start + 12 + i}
        width={3}
        color={theme.inkSoft}
      />
    ))}
  </g>
);

export const S4Build: React.FC = () => {
  const frame = useCurrentFrame();

  const scope = useGsapTimeline<HTMLDivElement>(({timeline: tl, selector: q}) => {
    const shake = (at: number, amp: number) =>
      tl.to(
        q('.shake'),
        {
          keyframes: {
            x: [0, -12 * amp, 9 * amp, -6 * amp, 3 * amp, 0],
            y: [0, 8 * amp, -6 * amp, 4 * amp, -2 * amp, 0],
          },
          duration: f2s(9),
          ease: 'none',
        },
        at,
      );

    // the armoured body comes down onto the commercial chassis
    tl.fromTo(q('.drop'), {y: -1200}, {y: 0, duration: f2s(10), ease: 'power3.in'}, f2s(62));
    tl.to(q('.squash'), {scaleY: 0.955, scaleX: 1.015, duration: f2s(2), ease: 'power1.out'}, f2s(72));
    tl.to(q('.squash'), {scaleY: 1, scaleX: 1, duration: f2s(18), ease: 'elastic.out(1, 0.35)'}, f2s(74));
    shake(f2s(72), 1);

    // the stamp: industria militar mexicana
    tl.set(q('.stamp'), {autoAlpha: 0, scale: 2.2, rotation: -32}, 0);
    tl.set(q('.stamp'), {autoAlpha: 1}, f2s(150));
    tl.to(q('.stamp'), {scale: 1, rotation: -12, duration: f2s(6), ease: 'power4.in'}, f2s(150));
    shake(f2s(156), 0.55);
    tl.to(q('.stamp'), {scale: 0, rotation: 8, duration: f2s(9), ease: 'back.in(1.6)'}, f2s(MARKOUT));

    // push into the weapon station
    tl.to(q('.cam'), {x: Z.x, y: Z.y, scale: Z.scale, duration: f2s(32), ease: 'power2.inOut'}, f2s(200));
  });

  const strip = tw(frame, 6, 22, 0, 1, E.out);
  const card = tw(frame, 252, 266, 0, 1, E.out);
  const tilt = frame > 278 ? Math.sin((frame - 278) / 7) * 16 : 0;
  const sigLen = getLength(SIGNAL);

  return (
    <AbsoluteFill ref={scope}>
      <AbsoluteFill className="cam" style={{transformOrigin: '0 0'}}>
        <AbsoluteFill className="shake">
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <g transform={`translate(260 0) scale(${strip} 1) translate(-260 0)`}>
              <path d={tornStrip(260, 1680, GROUND - 24, 96, 's4a')} fill={theme.g5} />
              <path d={tornStrip(260, 1680, GROUND + 8, 64, 's4b', 18, 5)} fill={theme.g4} />
            </g>
          </svg>

          {/* the commercial base, until the armour lands on it */}
          {frame < 73 ? <PhotoPlate img="chassis" x={CH.x} y={CH.y} k={CH.k} start={15} /> : null}

          <AbsoluteFill className="squash" style={{transformOrigin: `960px ${GROUND}px`}}>
            <AbsoluteFill className="drop">
              <PhotoPlate img="dnxi" x={PX} y={PY} k={K} dir="none">
                {/* "armamento": ring the weapon station */}
                <DrawPath
                  d="M226,96 C226,30 560,24 586,92 C606,150 250,170 226,96 Z"
                  start={241}
                  duration={14}
                  width={7}
                  color={theme.yellow}
                  style={{mixBlendMode: 'multiply'}}
                />
                <DrawPath d="M226,96 C226,30 560,24 586,92 C606,150 250,170 226,96 Z" start={243} duration={14} width={1.6} />
              </PhotoPlate>
            </AbsoluteFill>
          </AbsoluteFill>

          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <Dust x={FRONT[0] - 80} y={GROUND} dir={-1} start={72} />
            <Dust x={REAR[0] + 70} y={GROUND - 30} dir={1} start={73} />

            {/* tags */}
            <DrawPath d={`M${CH.x + 500 * CH.k},${CH.y + 250 * CH.k} L700,1006 H536`} start={26} duration={12} out={70} width={2.5} />
            <DrawPath d={`M${HUB[0] + 40},${HUB[1] + 30} L1450,1006 H1604`} start={78} duration={12} out={MARKOUT} width={2.5} />

            {/* systems: circuit traces, nodes */}
            {TRACES.map((d, i) => (
              <DrawPath key={i} d={d} start={95 + i * 3} duration={18} out={MARKOUT - 4} width={4} color={theme.dataBlue} easing={E.inOut} />
            ))}
            {[HUB, ANT, TUR, LAMP, FRONT].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={9 * Math.max(0, pop(frame, i === 0 ? 95 : 108 + i * 3) - tw(frame, MARKOUT - 4, MARKOUT + 4))} fill={theme.dataBlue} stroke={theme.ink} strokeWidth={2.5} />
            ))}
            {BADGES.map((b, i) => (
              <DrawPath key={i} d={`M${b.to[0]},${b.to[1]} L${b.at[0]},${b.at[1]}`} start={b.f - 4} duration={8} out={MARKOUT - 6} width={2} color={theme.ink} />
            ))}
          </svg>

          {BADGES.map((b) => (
            <LottieIcon key={b.name} name={b.name} x={b.at[0]} y={b.at[1]} size={104} start={b.f} exitAt={MARKOUT} loop badge />
          ))}

          <Label text="Chasis comercial" x={140} y={1006} start={28} exitAt={68} size={26} />
          <Label text="Blindaje" x={1620} y={1006} start={80} exitAt={MARKOUT} size={26} />
          <Label text="Sistemas" x={1060} y={182} start={114} exitAt={MARKOUT} size={26} />

          <div className="stamp" style={{position: 'absolute', left: 130, top: 80, width: 340, height: 340}}>
            <Stamp />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* "controlado desde el interior de la cabina": the operator's console, taped to the page */}
      {card > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 1296,
            top: 104,
            width: 540,
            height: 380,
            transform: `rotate(${2.5 - card * 0.8}deg)`,
          }}
        >
          <div style={{position: 'absolute', inset: -24, clipPath: `inset(0 0 ${(1 - card) * 100}% 0)`}}>
            <div style={{position: 'absolute', inset: 24}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: theme.g6,
                  border: `3px solid ${theme.ink}`,
                  boxShadow: '0 10px 18px rgba(17,17,16,0.22)',
                }}
              />
              <svg width={540} height={380} viewBox="0 0 540 380" style={{position: 'absolute', inset: 0}}>
                <path d="M0,330 H540" stroke={theme.g4} strokeWidth={2} />
                <g transform="translate(-10 -6) scale(0.95)">
                  <Operator tilt={tilt} />
                </g>
                <rect x={300} y={70} width={210} height={150} rx={8} fill={theme.g1} stroke={theme.ink} strokeWidth={4} />
                <path d="M330,190 L370,160 L410,175 L470,140 L490,150" fill="none" stroke={theme.g3} strokeWidth={2} />
              </svg>
              <LottieIcon name="crosshairScreen" x={405 + tilt * 1.6} y={145 - tilt * 0.4} size={120} start={262} loop noPop />
            </div>
          </div>
          {[
            [-28, -14, -8],
            [470, -16, 7],
          ].map(([x, y, r], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 100,
                height: 34,
                backgroundColor: theme.yellow,
                opacity: 0.85,
                transform: `rotate(${r}deg) scaleX(${pop(frame, 262 + i * 3)})`,
                mixBlendMode: 'multiply',
              }}
            />
          ))}
        </div>
      ) : null}

      {/* the control signal runs from the cabin console to the weapon */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <DrawPath d={SIGNAL} start={272} duration={14} width={5} color={theme.dataBlue} dash={[14, 10]} />
        {frame > 284
          ? [0, 1, 2].map((i) => {
              const t = ((frame - 284 + i * 8) % 24) / 24;
              const p = getPointAtLength(SIGNAL, sigLen * t) ?? {x: 0, y: 0};
              return <circle key={i} cx={p.x} cy={p.y} r={9} fill={theme.dataBlue} stroke={theme.ink} strokeWidth={2.5} />;
            })
          : null}
        {frame > 284 ? (
          <circle
            cx={zoomed(TUR)[0] - 18}
            cy={zoomed(TUR)[1] - 14}
            r={22 + ((frame - 284) % 24) * 1.6}
            fill="none"
            stroke={theme.dataBlue}
            strokeWidth={5 * (1 - ((frame - 284) % 24) / 24)}
          />
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
