import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { colors, radius, type, FRAME_HEIGHT } from '../theme';
import { redeem } from '../data';
import { HugeIcon } from './icons';
import { Card, DataRow, Tag } from './ui';
import SlideToConfirm from './SlideToConfirm';
import { AnimConfig } from '../animConfig';

const SCREEN_H = FRAME_HEIGHT;

type Props = {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
  config?: AnimConfig;
};

export default function ConfirmSheet({ visible, onClose, onComplete, config }: Props) {
  const progress = useSharedValue(0); // 0 hidden → 1 shown
  const [mounted, setMounted] = React.useState(visible);

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, { duration: 280 });
    } else if (mounted) {
      progress.value = withTiming(0, { duration: 220 }, (done) => {
        if (done) runOnJS(setMounted)(false);
      });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * SCREEN_H }],
  }));

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.content}>
          {/* Heading */}
          <View style={styles.headingBlock}>
            <Text style={styles.youAreRedeeming}>You are redeeming</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amount}>{redeem.amount}</Text>
              <Tag text="Approx" />
            </View>
            <Text style={styles.subtext}>
              The actual amount you get will be determined after the fund house declares
              the NAV of {redeem.navDate}. <Text style={styles.why}>Why?</Text>
            </Text>
          </View>

          {/* Data box */}
          <View style={styles.cardWrap}>
            <Card style={{ paddingVertical: 8 }}>
              <DataRow label="Redeem bank" value={redeem.redeemBank} />
              <DataRow label="Applicable NAV date" value={redeem.navDate} info valueHeavy />
              <DataRow label="No. of units" value={redeem.units} />
              <DataRow label="Exit load (Approx)" value={redeem.exitLoadApprox} info valueHeavy />
            </Card>
          </View>

          {/* Capital gains box */}
          <View style={styles.cardWrap}>
            <Card>
              <View style={styles.cgHeader}>
                <Text style={styles.cgHeaderText}>Capital gains</Text>
                <HugeIcon name="info" size={16} color={colors.contentSecondary} />
              </View>
              <View style={{ paddingVertical: 8 }}>
                <DataRow label="LTCG" value={redeem.ltcg} valueColor={colors.contentPositive} valueHeavy />
                <DataRow label="STCG" value={redeem.stcg} valueColor={colors.contentNegative} valueHeavy />
              </View>
              <View style={styles.tipDivider} />
              <View style={styles.tipRow}>
                <View style={styles.tipLeft}>
                  <HugeIcon name="bulb" size={16} color={colors.contentPrimary} />
                  <Text style={styles.tipText}>
                    Redeem <Text style={styles.tipHeavy}>{redeem.avoidStcgAmount}</Text> to avoid STCG
                  </Text>
                </View>
                <Pressable hitSlop={8}>
                  <Text style={styles.updateAmount}>Update amount</Text>
                </Pressable>
              </View>
            </Card>
          </View>
        </View>

        {/* Slide button */}
        <View style={styles.slideArea}>
          <SlideToConfirm onComplete={onComplete} config={config} />
        </View>

        {/* Home indicator */}
        <View style={styles.footer}>
          <View style={styles.homeIndicator} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: colors.backgroundOverlay },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.backgroundSurfaceZ1,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    overflow: 'hidden',
  },
  content: { paddingTop: 24 },

  headingBlock: { paddingHorizontal: 16, gap: 12, paddingBottom: 8 },
  youAreRedeeming: { ...type.bodyBaseHeavy, color: colors.contentSecondary },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { ...type.displayBase, color: colors.contentPrimary },
  subtext: { ...type.bodySmall, color: colors.contentSecondary },
  why: { ...type.bodySmallHeavy, color: colors.contentAccent },

  cardWrap: { paddingHorizontal: 16, paddingTop: 8 },

  cgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 16,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderPrimary,
  },
  cgHeaderText: { ...type.bodyBaseHeavy, color: colors.contentPrimary, flex: 1 },

  tipDivider: { height: 1, backgroundColor: colors.borderPrimary, marginHorizontal: 16 },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tipLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  tipText: { ...type.bodySmall, color: colors.contentPrimary, flex: 1 },
  tipHeavy: { fontWeight: '500' },
  updateAmount: {
    ...type.bodySmallHeavy,
    color: colors.contentPrimary,
    textDecorationLine: 'underline',
  },

  slideArea: { backgroundColor: colors.backgroundPrimary, padding: 16 },
  footer: { backgroundColor: colors.backgroundPrimary, alignItems: 'center', paddingBottom: 8 },
  homeIndicator: { width: 108, height: 4, borderRadius: 12, backgroundColor: colors.contentSecondary },
});
