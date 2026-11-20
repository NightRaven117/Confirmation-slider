import { Easing } from 'react-native-reanimated';

export type EaseFamily =
  | 'linear'
  | 'sine'
  | 'quad'
  | 'cubic'
  | 'quart'
  | 'quint'
  | 'expo';

export type EaseDir = 'in' | 'out' | 'inOut';

export type Ease = { family: EaseFamily; dir: EaseDir };

export type AnimConfig = {
  // Released before the completion threshold → return to start.
  returnDuration: number;
  returnEase: Ease;
  // Slid past threshold → snap to the end.
  completeDuration: number;
  completeEase: Ease;
  // Tap → thumb jumps forward, then springs back to rest.
  hintNudge: number;
  hintForwardDuration: number;
  hintForwardEase: Ease;
  springStiffness: number;
  springDamping: number;
  springMass: number;
};

export const DEFAULT_CONFIG: AnimConfig = {
  returnDuration: 340,
  returnEase: { family: 'cubic', dir: 'out' },
  completeDuration: 160,
  completeEase: { family: 'quad', dir: 'out' },
  hintNudge: 28,
  hintForwardDuration: 140,
  hintForwardEase: { family: 'quad', dir: 'out' },
  springStiffness: 260,
  springDamping: 10,
  springMass: 1,
};

export const FAMILIES: EaseFamily[] = ['linear', 'sine', 'quad', 'cubic', 'quart', 'quint', 'expo'];
export const DIRS: EaseDir[] = ['in', 'out', 'inOut'];

/**
 * Builds a reanimated easing function from a preset. Tagged 'worklet' so it can
 * be called inside gesture callbacks; it is also callable on the JS thread for
 * plotting the curve preview.
 */
export function makeEasing(family: EaseFamily, dir: EaseDir) {
  'worklet';
  if (family === 'linear') return Easing.linear;
  let base = Easing.cubic;
  if (family === 'sine') base = Easing.sin;
  else if (family === 'quad') base = Easing.quad;
  else if (family === 'cubic') base = Easing.cubic;
  else if (family === 'quart') base = Easing.poly(4);
  else if (family === 'quint') base = Easing.poly(5);
  else if (family === 'expo') base = Easing.exp;
  if (dir === 'in') return Easing.in(base);
  if (dir === 'out') return Easing.out(base);
  return Easing.inOut(base);
}
