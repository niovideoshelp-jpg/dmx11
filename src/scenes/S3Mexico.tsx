import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {font, theme} from '../theme';
import {DrawPath} from '../components/DrawPath';
import {Highlight} from '../components/Highlight';
import {MaskedLines} from '../components/MaskedLines';
import {Label, Tape} from '../components/Tape';
import {CDMX, MEXICO_RINGS} from '../data/mexico';
import {E, circlePath, pop, tw} from '../lib/anim';

// "Para ese tipo de misión, México desarrolló el DN-11, un blindado táctico"
// Scene starts at abs 248. Local: México 50 · DN-XI 79 · blindado táctico 119.

export const S3Mexico: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = tw(frame, 0, 157, 1, 1.05, E.linear);
  const mapDrift = tw(frame, 0, 157, 0, -18, E.linear);
  const paste = tw(frame, 46, 62, 0, 1, E.out);
  const pin = pop(frame, 54);

  return (
    <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <pattern id="mx-dots" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <circle cx={4.5} cy={4.5} r={1.6} fill={theme.ink} opacity={0.38} />
          </pattern>
          <clipPath id="mx-paste">
            <rect x={900} y={960 - 860 * paste} width={1000} height={900} />
          </clipPath>
          <filter id="mx-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx={0} dy={8} stdDeviation={9} floodColor={theme.ink} floodOpacity={0.2} />
          </filter>
        </defs>

        <g transform={`translate(${mapDrift} 0)`}>
          {/* the country, pasted as a cut-out once its coast has been drawn */}
          <g clipPath="url(#mx-paste)" filter="url(#mx-shadow)">
            {MEXICO_RINGS.map((d, i) => (
              <path key={i} d={d} fill={theme.g4} />
            ))}
            {MEXICO_RINGS.map((d, i) => (
              <path key={`h${i}`} d={d} fill="url(#mx-dots)" />
            ))}
          </g>
          {MEXICO_RINGS.map((d, i) => (
            <DrawPath key={i} d={d} start={5 + i * 6} duration={i === 0 ? 44 : 12} width={3} color={theme.ink} easing={E.inOut} />
          ))}

          {/* Mexico City pin */}
          <DrawPath d={circlePath(CDMX[0], CDMX[1], 34)} start={56} duration={14} width={2.5} color={theme.ink} />
          <g transform={`translate(${CDMX[0]} ${CDMX[1]}) scale(${pin})`}>
            <path d="M0,0 C-8,-16 -22,-30 -22,-46 A22,22 0 1,1 22,-46 C22,-30 8,-16 0,0 Z" fill={theme.dataRed} stroke={theme.ink} strokeWidth={3} />
            <circle cx={0} cy={-46} r={8} fill={theme.paper} />
          </g>
        </g>

        {/* rule over the subtitle */}
        <DrawPath d="M112,742 L742,738" start={115} duration={14} width={3} />
      </svg>

      <Tape text="MÉXICO" x={1230 + mapDrift} y={420} start={50} size={58} rotate={-4} />

      <MaskedLines
        start={79}
        duration={14}
        style={{position: 'absolute', left: 104, top: 420}}
        lines={[
          <div
            key="t"
            style={{
              fontFamily: font.display,
              fontWeight: 900,
              fontSize: 236,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: theme.ink,
            }}
          >
            <Highlight start={86} duration={10}>
              DN-XI
            </Highlight>
          </div>,
        ]}
      />
      <Label text="Blindado táctico" x={114} y={784} start={119} size={30} />
    </AbsoluteFill>
  );
};
