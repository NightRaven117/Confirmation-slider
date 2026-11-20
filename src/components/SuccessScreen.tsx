import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors, radius, type } from '../theme';
import { redeem } from '../data';
import { HugeIcon } from './icons';

function SuccessRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function SuccessScreen({ onDone }: { onDone: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.checkCircle}>
          <HugeIcon name="tick" size={56} color={colors.contentOnColour} />
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(120).duration(400)} style={styles.title}>
          Redeem order placed
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(220).duration(400)}
          style={styles.dataBox}
        >
          <View style={styles.dataBoxTitle}>
            <Text style={styles.fundName}>{redeem.fundName}</Text>
          </View>
          <View style={styles.rows}>
            <SuccessRow label="Amount (Approx)" value={redeem.successAmount} />
            <SuccessRow label="Units redeemed" value={redeem.unitsRedeemed} />
            <SuccessRow label="NAV date" value={redeem.successNavDate} />
            <SuccessRow label="Expected completion by" value={redeem.completionBy} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.dock}>
        <Pressable style={styles.primaryBtn} onPress={onDone}>
          <Text style={styles.primaryBtnText}>Done</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={onDone}>
          <Text style={styles.secondaryBtnText}>Order details</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, gap: 24 },

  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...type.displaySmall, color: colors.contentPrimary, textAlign: 'center' },

  dataBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  dataBoxTitle: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
  },
  fundName: { ...type.bodyLargeHeavy, color: colors.contentPrimary, textAlign: 'center' },
  rows: { padding: 16, gap: 16 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { ...type.bodyBase, color: colors.contentSecondary },
  rowValue: { ...type.bodyBase, color: colors.contentPrimary, textAlign: 'right' },

  dock: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  primaryBtn: {
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { ...type.bodyLargeHeavy, color: colors.contentOnColour },
  secondaryBtn: { height: 48, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { ...type.bodyLargeHeavy, color: colors.contentAccent },
});
