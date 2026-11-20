import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { colors, FRAME_WIDTH, FRAME_HEIGHT } from './src/theme';
import AmountEntryScreen from './src/components/AmountEntryScreen';
import ConfirmSheet from './src/components/ConfirmSheet';
import SuccessScreen from './src/components/SuccessScreen';
import Controls from './src/components/Controls';
import { AnimConfig, DEFAULT_CONFIG } from './src/animConfig';

type Stage = 'entry' | 'success';

const CONTROLS_WIDTH = 300;

export default function App() {
  const [stage, setStage] = React.useState<Stage>('entry');
  const [sheetVisible, setSheetVisible] = React.useState(false);
  const [config, setConfig] = React.useState<AnimConfig>(DEFAULT_CONFIG);

  const { width } = useWindowDimensions();
  // Only show the tuning panel when there's horizontal room beside the frame.
  const showControls = width >= FRAME_WIDTH + CONTROLS_WIDTH + 24;

  const handleComplete = () => {
    setSheetVisible(false);
    setStage('success');
  };

  const reset = () => {
    setStage('entry');
    setSheetVisible(false);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.backdrop}>
        <View style={styles.frame}>
          <StatusBar style="dark" />
          {stage === 'entry' ? (
            <AmountEntryScreen onProceed={() => setSheetVisible(true)} />
          ) : (
            <SuccessScreen onDone={reset} />
          )}
          <ConfirmSheet
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            onComplete={handleComplete}
            config={config}
          />
        </View>
        {showControls ? <Controls config={config} onChange={setConfig} /> : null}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  frame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    backgroundColor: colors.backgroundPrimary,
    overflow: 'hidden',
  },
});
