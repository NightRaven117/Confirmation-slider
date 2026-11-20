import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import {
  AnimConfig,
  DEFAULT_CONFIG,
  DIRS,
  Ease,
  EaseDir,
  EaseFamily,
  FAMILIES,
  makeEasing,
} from '../animConfig';
import { FRAME_HEIGHT } from '../theme';

const ACCENT = '#04B488';
const PANEL = '#1C1C1E';
const CARD = '#2C2C2E';
const BORDER = '#3A3A3C';
const TEXT = '#F2F2F2';
const MUTED = '#9A9A9E';

type Props = {
  config: AnimConfig;
  onChange: (next: AnimConfig) => void;
};

export default function Controls({ config, onChange }: Props) {
  const set = (patch: Partial<AnimConfig>) => onChange({ ...config, ...patch });

  return (
    <ScrollView style={styles.panel} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Slider animation</Text>

      <Section title="Return (released early)">
        <Stepper
          label="Duration"
          value={config.returnDuration}
          unit="ms"
          step={20}
          min={60}
          max={1500}
          onChange={(v) => set({ returnDuration: v })}
        />
        <EaseRow ease={config.returnEase} onChange={(returnEase) => set({ returnEase })} />
      </Section>

      <Section title="Complete (snap to end)">
        <Stepper
          label="Duration"
          value={config.completeDuration}
          unit="ms"
          step={20}
          min={60}
          max={1500}
          onChange={(v) => set({ completeDuration: v })}
        />
        <EaseRow ease={config.completeEase} onChange={(completeEase) => set({ completeEase })} />
      </Section>

      <Section title="Tap hint (spring back)">
        <Stepper
          label="Nudge"
          value={config.hintNudge}
          unit="px"
          step={2}
          min={8}
          max={120}
          onChange={(v) => set({ hintNudge: v })}
        />
        <Stepper
          label="Forward"
          value={config.hintForwardDuration}
          unit="ms"
          step={10}
          min={40}
          max={800}
          onChange={(v) => set({ hintForwardDuration: v })}
        />
        <EaseRow
          ease={config.hintForwardEase}
          onChange={(hintForwardEase) => set({ hintForwardEase })}
        />
        <Stepper
          label="Stiffness"
          value={config.springStiffness}
          unit=""
          step={20}
          min={40}
          max={1200}
          onChange={(v) => set({ springStiffness: v })}
        />
        <Stepper
          label="Damping"
          value={config.springDamping}
          unit=""
          step={1}
          min={2}
          max={60}
          onChange={(v) => set({ springDamping: v })}
        />
        <Stepper
          label="Mass"
          value={config.springMass}
          unit=""
          step={0.5}
          min={0.5}
          max={5}
          onChange={(v) => set({ springMass: v })}
        />
      </Section>

      <Pressable style={styles.reset} onPress={() => onChange(DEFAULT_CONFIG)}>
        <Text style={styles.resetText}>Reset to defaults</Text>
      </Pressable>

      <Text style={styles.jsonLabel}>Current config</Text>
      <Text selectable style={styles.json}>
        {JSON.stringify(config, null, 2)}
      </Text>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Stepper({
  label,
  value,
  unit,
  step,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  step: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <View style={styles.stepRow}>
      <Text style={styles.stepLabel}>{label}</Text>
      <View style={styles.stepControls}>
        <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value - step))}>
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>
          {value}
          {unit}
        </Text>
        <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value + step))}>
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function EaseRow({ ease, onChange }: { ease: Ease; onChange: (e: Ease) => void }) {
  return (
    <View style={styles.easeRow}>
      <View style={styles.easeChips}>
        <View style={styles.chipWrap}>
          {FAMILIES.map((f) => (
            <Chip
              key={f}
              label={f}
              active={ease.family === f}
              onPress={() => onChange({ ...ease, family: f as EaseFamily })}
            />
          ))}
        </View>
        <View style={styles.chipWrap}>
          {DIRS.map((d) => (
            <Chip
              key={d}
              label={d}
              active={ease.dir === d}
              onPress={() => onChange({ ...ease, dir: d as EaseDir })}
            />
          ))}
        </View>
      </View>
      <CurvePreview ease={ease} />
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const PREVIEW = 56;
const PAD = 6;

function CurvePreview({ ease }: { ease: Ease }) {
  const fn = makeEasing(ease.family, ease.dir);
  const inner = PREVIEW - PAD * 2;
  const N = 28;
  let d = '';
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const v = fn(t);
    const x = PAD + t * inner;
    const y = PAD + (1 - v) * inner;
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return (
    <View style={styles.preview}>
      <Svg width={PREVIEW} height={PREVIEW}>
        <Line x1={PAD} y1={PREVIEW - PAD} x2={PREVIEW - PAD} y2={PREVIEW - PAD} stroke={BORDER} strokeWidth={1} />
        <Line x1={PAD} y1={PAD} x2={PAD} y2={PREVIEW - PAD} stroke={BORDER} strokeWidth={1} />
        <Path d={d.trim()} stroke={ACCENT} strokeWidth={1.8} fill="none" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { width: 300, height: FRAME_HEIGHT, backgroundColor: PANEL, borderRadius: 12 },
  content: { padding: 16, gap: 16 },
  title: { color: TEXT, fontSize: 16, fontWeight: '700' },

  section: { backgroundColor: CARD, borderRadius: 10, padding: 12, gap: 10 },
  sectionTitle: { color: TEXT, fontSize: 13, fontWeight: '600' },

  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepLabel: { color: MUTED, fontSize: 13 },
  stepControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { color: TEXT, fontSize: 18, lineHeight: 20 },
  stepValue: { color: TEXT, fontSize: 13, minWidth: 56, textAlign: 'center', fontVariant: ['tabular-nums'] },

  easeRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  easeChips: { flex: 1, gap: 6 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  chip: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  chipText: { color: MUTED, fontSize: 11 },
  chipTextActive: { color: '#04231B', fontWeight: '700' },

  preview: { backgroundColor: '#111113', borderRadius: 6 },

  reset: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: { color: TEXT, fontSize: 13 },

  jsonLabel: { color: MUTED, fontSize: 11, marginTop: 4 },
  json: {
    color: '#9FE7D3',
    fontSize: 10,
    fontFamily: 'monospace',
    backgroundColor: '#111113',
    borderRadius: 8,
    padding: 10,
  },
});
