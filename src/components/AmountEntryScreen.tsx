import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, type } from '../theme';
import { redeem } from '../data';
import { Backspace, HugeIcon } from './icons';
import { Checkbox } from './ui';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

export default function AmountEntryScreen({ onProceed }: { onProceed: () => void }) {
  const [redeemAll, setRedeemAll] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Pressable hitSlop={8} style={styles.iconBtn}>
          <HugeIcon name="arrowLeft" size={24} color={colors.contentPrimary} />
        </Pressable>
        <View style={styles.appBarCenter}>
          <Text numberOfLines={1} style={styles.appBarTitle}>
            {redeem.fundTitleLong}
          </Text>
          <View style={styles.appBarSubRow}>
            <Text numberOfLines={1} style={styles.appBarSub}>
              {redeem.available}
            </Text>
            <HugeIcon name="info" size={16} color={colors.contentSecondary} />
          </View>
        </View>
        <Pressable hitSlop={8} style={styles.iconBtn}>
          <HugeIcon name="moreVertical" size={24} color={colors.contentPrimary} />
        </Pressable>
      </View>

      {/* Amount */}
      <View style={styles.amountArea}>
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>{redeem.amount}</Text>
          <View style={styles.cursor} />
        </View>
        <Pressable
          style={styles.redeemAll}
          onPress={() => setRedeemAll((v) => !v)}
          hitSlop={8}
        >
          <Checkbox checked={redeemAll} />
          <Text style={styles.redeemAllText}>Redeem all</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }} />

      {/* Message box */}
      <View style={styles.messageBoxOuter}>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Exit load of approx{' '}
            <Text style={styles.messageHeavy}>{redeem.exitLoadCharge}</Text> will be charged
            by fund house
          </Text>
          <HugeIcon name="info" size={20} color={colors.contentSecondary} />
        </View>
      </View>

      {/* Bank list item */}
      <Pressable style={styles.bankRow}>
        <View style={styles.bankLogo}>
          <Text style={styles.bankLogoText}>A</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bankLabel}>{redeem.bankLabel}</Text>
          <Text style={styles.bankSub}>{redeem.bankSubtext}</Text>
        </View>
        <HugeIcon name="chevronDown" size={20} color={colors.contentSecondary} />
      </Pressable>

      {/* Keypad */}
      <View style={styles.keypad}>
        {KEYS.map((k) => (
          <Pressable key={k} style={styles.key} android_ripple={{ borderless: true }}>
            {k === 'del' ? (
              <Backspace size={28} />
            ) : (
              <Text style={styles.keyText}>{k}</Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* Proceed */}
      <View style={styles.dock}>
        <Pressable style={styles.primaryBtn} onPress={onProceed}>
          <Text style={styles.primaryBtnText}>Proceed</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },

  appBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  appBarCenter: { flex: 1, paddingVertical: 8 },
  appBarTitle: { ...type.headingSmall, color: colors.contentPrimary },
  appBarSubRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  appBarSub: { ...type.bodySmall, color: colors.contentSecondary },

  amountArea: { alignItems: 'center', paddingTop: 56, gap: 12 },
  amountRow: { flexDirection: 'row', alignItems: 'center', height: 48 },
  amountText: { ...type.displayXlarge, color: colors.contentPrimary },
  cursor: { width: 2, height: 40, backgroundColor: colors.contentAccent, marginLeft: 2 },
  redeemAll: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  redeemAllText: { ...type.bodyBase, color: colors.contentSecondary },

  messageBoxOuter: { paddingHorizontal: 16, paddingVertical: 8 },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: radius.sm,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 12,
  },
  messageText: { ...type.bodySmall, color: colors.contentPrimary, flex: 1 },
  messageHeavy: { fontWeight: '500' },

  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderPrimary,
  },
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#97144D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankLogoText: { color: '#fff', ...type.bodyLargeHeavy },
  bankLabel: { ...type.bodyBaseHeavy, color: colors.contentPrimary },
  bankSub: { ...type.bodySmall, color: colors.contentSecondary, marginTop: 2 },

  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderColor: colors.borderPrimary,
    paddingVertical: 8,
  },
  key: { width: '33.3333%', height: 64, alignItems: 'center', justifyContent: 'center' },
  keyText: { ...type.displayBase, color: colors.contentPrimary },

  dock: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },
  primaryBtn: {
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { ...type.bodyLargeHeavy, color: colors.contentOnColour },
});
