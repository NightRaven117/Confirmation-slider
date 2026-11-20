import React, { useState } from 'react';
import { StyleSheet, Text, View, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, type } from '../theme';
import { HugeIcon } from './icons';
import { AnimConfig, DEFAULT_CONFIG, makeEasing } from '../animConfig';

const TRACK_HEIGHT = 48; // matches the 48px primary CTA (Proceed / Done)
const THUMB = 48;
const COMPLETE_RATIO = 0.82; // fraction of travel that locks it in

type Props = {
  label?: string;
  onComplete: () => void;
  config?: AnimConfig;
};

export default function SlideToConfirm({
  label = 'Slide to redeem',
  onComplete,
  config = DEFAULT_CONFIG,
}: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useSharedValue(0);
  const done = useSharedValue(0); // 0 → idle, 1 → completed

  const maxX = Math.max(trackWidth - THUMB, 0);
  const range = maxX > 0 ? maxX : 1;

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const finish = () => onComplete();

  const pan = Gesture.Pan()
    .onChange((e) => {
      if (done.value === 1) return;
      x.value = Math.min(Math.max(x.value + e.changeX, 0), maxX);
    })
    .onEnd(() => {
      if (done.value === 1) return;
      if (maxX > 0 && x.value >= maxX * COMPLETE_RATIO) {
        done.value = 1;
        x.value = withTiming(
          maxX,
          {
            duration: config.completeDuration,
            easing: makeEasing(config.completeEase.family, config.completeEase.dir),
          },
          (isDone) => {
            if (isDone) runOnJS(finish)();
          },
        );
      } else {
        // Organic return: quick at first, decelerating into rest. No spring.
        x.value = withTiming(0, {
          duration: config.returnDuration,
          easing: makeEasing(config.returnEase.family, config.returnEase.dir),
        });
      }
    });

  // Tap (no drag) → thumb jumps forward, then springs back to rest, showing
  // the user it moves sideways and has to be dragged. The spring overshoots
  // past 0; `pos` below mirrors that so the thumb rebounds off the start edge
  // instead of leaving the track.
  const tap = Gesture.Tap().maxDuration(250).onEnd(() => {
    if (done.value === 1) return;
    const nudge = Math.min(config.hintNudge, maxX);
    x.value = withSequence(
      withTiming(nudge, {
        duration: config.hintForwardDuration,
        easing: makeEasing(config.hintForwardEase.family, config.hintForwardEase.dir),
      }),
      withSpring(0, {
        stiffness: config.springStiffness,
        damping: config.springDamping,
        mass: config.springMass,
      }),
    );
  });

  const gesture = Gesture.Race(pan, tap);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: Math.abs(x.value) }],
  }));

  // Green fill grows from the left, its right edge tucked under the thumb.
  const fillStyle = useAnimatedStyle(() => ({
    width: Math.abs(x.value) + THUMB,
  }));

  // Label stays centered and fixed; only its opacity tracks slide position.
  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(x.value) / range, [0, 0.3], [1, 0], Extrapolation.CLAMP),
  }));

  // Arrow spins clockwise as it fades, then the tick rotates in to settle —
  // a continuous clockwise hand-off from arrow to tick.
  const arrowStyle = useAnimatedStyle(() => {
    const p = Math.abs(x.value) / range;
    return {
      opacity: interpolate(p, [0, 0.6], [1, 0], Extrapolation.CLAMP),
      transform: [{ rotate: `${interpolate(p, [0, 0.6], [0, 90], Extrapolation.CLAMP)}deg` }],
    };
  });
  const tickStyle = useAnimatedStyle(() => {
    const p = Math.abs(x.value) / range;
    // Starts fading in before the arrow is gone, so the two overlap mid-slide.
    return {
      opacity: interpolate(p, [0.35, 0.85], [0, 1], Extrapolation.CLAMP),
      transform: [{ rotate: `${interpolate(p, [0.35, 1], [-45, 0], Extrapolation.CLAMP)}deg` }],
    };
  });

  return (
    <View style={styles.track} onLayout={onLayout}>
      {/* Centered label — fades with slide position, never moves */}
      <Animated.View style={[styles.labelWrap, labelStyle]} pointerEvents="none">
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>

      {/* Green fill */}
      <Animated.View style={[styles.fill, fillStyle]} pointerEvents="none" />

      {/* Gesture surface spans the whole track; thumb is the visual handle */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <Animated.View style={[styles.iconLayer, arrowStyle]}>
              <HugeIcon name="arrowRight" size={28} color={colors.contentOnColour} />
            </Animated.View>
            <Animated.View style={[styles.iconLayer, tickStyle]}>
              <HugeIcon name="tick" size={28} color={colors.contentOnColour} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: TRACK_HEIGHT,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundSlideTrack,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.backgroundAccent,
    borderRadius: radius.sm,
  },
  labelWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...type.bodyBaseHeavy,
    color: colors.contentPrimary,
    textAlign: 'center',
  },
  thumb: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: THUMB,
    height: THUMB,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundAccent,
  },
  iconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
