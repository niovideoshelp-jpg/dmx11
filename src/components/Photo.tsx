import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {E, tw} from '../lib/anim';

/** The film's real photographs, cut out locally and baked to B&W paper stickers. */
export const IMG = {
  dnxi: {src: 'img/dnxi.png', w: 810, h: 510},
  chassis: {src: 'img/chassis.png', w: 869, h: 429},
  soldier: {src: 'img/soldier.png', w: 366, h: 470},
} as const;
export type ImgKey = keyof typeof IMG;

/** Landmarks measured on img/dnxi.png (image pixels). */
export const DNXI = {
  frontWheel: [303, 421],
  rearWheel: [691, 386],
  ground: 492,
  gun: [300, 92],
  gunner: [483, 40],
  turret: [470, 112],
  antenna: [609, 92],
  headlight: [196, 312],
  grille: [100, 300],
  hull: [575, 265],
  roofRear: [700, 150],
} as const;

/** Where the commercial chassis sits under the DN-XI body (wheel-aligned, image px of dnxi). */
export const CHASSIS_ON_DNXI = {x: -5.6, y: 144.3, s: 0.841};

/**
 * A photo pasted on the page: mask wipe in the direction of `dir`, 1.04→1 settle,
 * soft contact shadow. Children are an SVG overlay in the image's own pixel space,
 * so annotations stay registered to the photo through every camera move.
 */
export const PhotoPlate: React.FC<{
  img: ImgKey;
  x: number;
  y: number;
  k: number;
  start?: number;
  dir?: 'up' | 'right' | 'none';
  shadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  under?: React.ReactNode;
}> = ({img, x, y, k, start = 0, dir = 'up', shadow = true, className, style, children, under}) => {
  const frame = useCurrentFrame();
  const {src, w, h} = IMG[img];
  const p = dir === 'none' ? 1 : tw(frame, start, start + 14, 0, 1, E.out);
  const settle = 1.04 - 0.04 * p;
  const clip =
    dir === 'up'
      ? `inset(${(1 - p) * 100}% -40% -40% -40%)`
      : dir === 'right'
        ? `inset(-40% ${(1 - p) * 100}% -40% -40%)`
        : undefined;

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `scale(${k})`,
        transformOrigin: '0 0',
        ...style,
      }}
    >
      {under ? (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {under}
        </svg>
      ) : null}
      <div style={{position: 'absolute', inset: 0, clipPath: clip}}>
        <Img
          src={staticFile(src)}
          style={{
            width: w,
            height: h,
            transform: `scale(${settle})`,
            transformOrigin: '50% 100%',
            filter: shadow ? 'drop-shadow(0px 7px 9px rgba(17,17,16,0.22))' : undefined,
          }}
        />
      </div>
      {children ? (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {children}
        </svg>
      ) : null}
    </div>
  );
};

/** Image-pixel point → screen point for a plate placed at (x, y) with scale k. */
export const toScreen = (pt: readonly number[], x: number, y: number, k: number): [number, number] => [
  x + pt[0] * k,
  y + pt[1] * k,
];
