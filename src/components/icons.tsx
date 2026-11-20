import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';
import { colors } from '../theme';
import { hugeIcons, HugeIconName } from '../icons/huge';

type IconProps = { size?: number; color?: string };

/** Renders an icon from the Groww Visual Library (hugeicons). */
export function HugeIcon({
  name,
  size = 24,
  color = colors.contentPrimary,
}: IconProps & { name: HugeIconName }) {
  return <SvgXml xml={hugeIcons[name]} width={size} height={size} color={color} />;
}

/**
 * Keypad backspace. The Groww Visual Library has no true backspace glyph, so
 * this stays a local icon (flagged to the user).
 */
export function Backspace({ size = 28, color = colors.contentPrimary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7 6-7Z"
        stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M11 10l5 4M16 10l-5 4" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}
