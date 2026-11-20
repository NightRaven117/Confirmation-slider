import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, type } from '../theme';
import { HugeIcon } from './icons';

/** A key/value row used inside the confirmation sheet data boxes. */
export function DataRow({
  label,
  value,
  info,
  valueColor = colors.contentPrimary,
  valueHeavy = false,
}: {
  label: string;
  value: string;
  info?: boolean;
  valueColor?: string;
  valueHeavy?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowKey}>
        <Text style={styles.keyLabel}>{label}</Text>
        {info ? <HugeIcon name="info" size={16} color={colors.contentSecondary} /> : null}
      </View>
      <Text
        style={[
          styles.valueLabel,
          valueHeavy && { fontWeight: '500' },
          { color: valueColor },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export function Tag({ text }: { text: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkbox, checked && styles.checkboxOn]}>
      {checked ? <HugeIcon name="tick" size={16} color={colors.contentOnColour} /> : null}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  rowKey: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 },
  keyLabel: { ...type.bodyBase, color: colors.contentPrimary },
  valueLabel: { ...type.bodyBase, color: colors.contentPrimary, textAlign: 'right' },

  tag: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tagText: { ...type.bodySmallHeavy, color: colors.contentSecondary },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.6,
    borderColor: colors.contentSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.backgroundAccent,
    borderColor: colors.backgroundAccent,
  },

  card: {
    backgroundColor: colors.backgroundSurfaceZ2,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    borderRadius: radius.md,
  },
});
