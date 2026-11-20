/**
 * Mint Design System tokens — Groww Invest theme.
 * Values sourced from rules-groww-invest-v0.33.md and the Figma redeem flow.
 */

export const colors = {
  backgroundPrimary: '#FFFFFF',
  backgroundSurfaceZ1: '#FFFFFF',
  backgroundSurfaceZ2: '#FFFFFF',
  backgroundTertiary: '#EFF0F1',
  backgroundSlideTrack: '#F0F0F2',
  backgroundOverlay: 'rgba(0,0,0,0.7)',

  contentPrimary: '#353839',
  contentSecondary: '#7F8283',
  contentAccent: '#04B488',
  contentPositive: '#04B488',
  contentNegative: '#ED5533',
  contentOnColour: '#FFFFFF',
  contentAlwaysLight: '#FFFFFF',

  backgroundAccent: '#04B488',
  backgroundNegative: '#ED5533',

  borderPrimary: '#E7E8E9',
} as const;

/**
 * Typography tokens. GrowwSans → system sans for body; Sohne → system for
 * display/headings (approximated with weight 600/700 since the brand fonts
 * are not bundled). Sizes/line-heights match the Mint scale exactly.
 */
export const type = {
  displayXlarge: { fontSize: 40, lineHeight: 48, fontWeight: '600' as const },
  displayBase: { fontSize: 28, lineHeight: 36, fontWeight: '600' as const },
  displaySmall: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const },

  headingSmall: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },

  bodyLargeHeavy: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  bodyBase: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodyBaseHeavy: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  bodySmall: { fontSize: 12, lineHeight: 18, fontWeight: '400' as const },
  bodySmallHeavy: { fontSize: 12, lineHeight: 18, fontWeight: '500' as const },
} as const;

/** Fixed device frame — the prototype is locked to this size, not responsive. */
export const FRAME_WIDTH = 360;
export const FRAME_HEIGHT = 800;

export const radius = {
  sm: 8,
  md: 16,
  sheet: 20,
} as const;
