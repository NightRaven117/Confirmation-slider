# Confirmation Slider

A usability prototype for the slide-to-confirm control on the mutual fund redeem flow.

- **Figma:** Rishabh's Playground, file `Or0YGPDYDvuKkQOBY6iPak`, node `3228-51727`
- **Repo:** https://github.com/NightRaven117/Confirmation-slider (public; the Mint DS docs stay local and are git-ignored)
- **Built on:** the earlier `Haptics` playground (moved to Trash 2026-11-18)

**Problem.** The slider just sits there. A user who doesn't know to drag it, or who taps it, gets no response.

**Fix.**
- Tapping the slider makes the thumb jump forward a little and spring back. This shows that it moves sideways and has to be dragged.
- While dragging, the arrow turns into a tick.

This file is the full spec: dimensions, colours, motion, timings and easing.
The numbers come from the code: `src/components/SlideToConfirm.tsx`, `src/animConfig.ts` and `src/theme.ts`.
To change one, edit `DEFAULT_CONFIG` in `animConfig.ts` or the constants at the top of `SlideToConfirm.tsx`, then update this file.

---

## 1. Anatomy

```
 ┌──────────────────────────────── track 328 × 48, radius 8 ────────────────────────────────┐
 │┌──────┐                                                                                  │
 ││  →   │                           Slide to redeem                                        │
 │└──────┘                                                                                  │
 └──────────────────────────────────────────────────────────────────────────────────────────┘
  thumb 48 × 48                       label, centred, fixed
  icon 28 × 28, centred
```

Layers, bottom to top:

1. **Track:** grey background. It clips everything inside it (`overflow: hidden`).
2. **Label:** centred in the track. It never moves; it only fades.
3. **Fill:** green, anchored left. Its right edge stays tucked under the thumb, and it covers the label as it grows.
4. **Gesture surface:** spans the whole track, so a tap or drag anywhere on the track counts.
5. **Thumb:** green square that moves with `translateX`.
6. **Icons:** an arrow and a tick, stacked in the thumb. They cross-fade and rotate.

## 2. Dimensions

| Part | Value | Notes |
|---|---|---|
| Device frame | 360 × 800 | Fixed size, not responsive |
| Slide area padding | 16 on all sides | Around the track, inside the sheet |
| Track | 328 × 48 | Same height and corners as the Proceed and Done CTAs |
| Track corner radius | 8 | `radius.sm` |
| Thumb | 48 × 48, radius 8 | `THUMB` |
| Icon | 28 × 28 | 10px inset from the thumb's edges |
| Fill width | thumb position + 48 | Always at least the thumb's width |
| Thumb travel (`maxX`) | 280px | Track width minus thumb width |
| Complete threshold | 82% of travel, about 230px | `COMPLETE_RATIO = 0.82` |
| Tap nudge | 28px | 10% of travel |

The track width comes from layout at runtime, so the travel and threshold follow it if the frame changes.

## 3. Colour and type

| Part | Token | Value |
|---|---|---|
| Track | `backgroundSlideTrack` | `#F0F0F2` |
| Fill and thumb | `backgroundAccent` | `#04B488` |
| Icons | `contentOnColour` | `#FFFFFF` |
| Label | `contentPrimary`, `bodyBaseHeavy` | `#353839`, 14 / 20, weight 500 |
| Label text | | "Slide to redeem" |
| Arrow icon | Groww Visual Library | `arrow-right-02` (hugeicons) |
| Tick icon | Groww Visual Library | `tick-02` (hugeicons) |

The fonts are system sans as a stand-in for GrowwSans; the brand fonts aren't bundled.

---

## 4. Motion

All motion runs off one value: **`x`**, the thumb's offset from the start, in px.
`p = |x| / 280` is the progress from 0 to 1, and every visual follows `p`.

### 4.1 Drag

- The thumb follows the finger 1:1. It is clamped to 0–280px, with no rubber-banding at either end.
- Release is decided by **position only**; flick speed is ignored.
- The pan uses `react-native-gesture-handler` defaults, with no custom activation offset.

### 4.2 What changes as `p` goes from 0 to 1

| Element | Property | `p` range | Thumb px | Value | Curve |
|---|---|---|---|---|---|
| Label | opacity | 0 → 0.30 | 0 → 84 | 1 → 0 | linear |
| Arrow | opacity | 0 → 0.60 | 0 → 168 | 1 → 0 | linear |
| Arrow | rotation | 0 → 0.60 | 0 → 168 | 0° → 90° clockwise | linear |
| Tick | opacity | 0.35 → 0.85 | 98 → 238 | 0 → 1 | linear |
| Tick | rotation | 0.35 → 1.00 | 98 → 280 | −45° → 0° (clockwise into place) | linear |
| Fill | width | 0 → 1 | 0 → 280 | 48 → 328 | linear |

All of these are clamped outside their range.
Between 98 and 168px the arrow and tick overlap. The arrow keeps turning clockwise as it leaves and the tick turns in after it, so the swap reads as one continuous clockwise turn.

### 4.3 Release before the threshold (under about 230px)

The thumb returns to 0.

| | |
|---|---|
| Duration | **340ms** |
| Easing | **cubic ease-out**: fast at first, then slows into rest |
| Spring | none |

The arrow, label and fill play backwards with the thumb, because they all follow `p`.

### 4.4 Release past the threshold (about 230px or more)

1. The slider locks. Further taps and drags are ignored.
2. The thumb snaps to the end (280px) over **160ms** with **quad ease-out**.
3. When the snap finishes, `onComplete` fires:
   - the sheet slides down over **220ms**;
   - the success screen is already mounted underneath, so it's revealed as the sheet leaves.

### 4.5 Tap: jump forward, then spring back

This is the usability fix. A tap anywhere on the track counts.

**How it works**

- **Tap detection:** the finger lifts within **250ms** (`maxDuration`).
- **Tap vs drag:** the tap and pan gestures race (`Gesture.Race`). If the finger moves, the pan wins and it's a drag.
- **Tapping again mid-animation:** the animation restarts from wherever the thumb is.

**Sequence**

1. **Jump forward:** 0 → 28px over **140ms** with **quad ease-out**.
2. **Spring back:** 28 → 0px with `withSpring`, using:
   - stiffness **260**
   - damping **10**
   - mass **1**

**Why the spring doesn't leave the track.** A spring overshoots past its rest point, which would push the thumb off the left edge. The thumb is drawn at `|x|`, so instead it bounces off the start edge, like a ball hitting a wall. The fill, label and icons also use `|x|`.

**Spring physics**

| | |
|---|---|
| Natural frequency ω | √(260/1) ≈ 16.1 rad/s |
| Damping ratio ζ | 10 / (2√260) ≈ **0.31**: clearly bouncy, settles fast |
| Bounce period | about 410ms |

**Timeline from the tap** (calculated from the spring formula; not measured on a device)

| Time | Thumb at | Event |
|---|---|---|
| 0ms | 0 | Tap ends |
| 140ms | 28px | Peak of the jump; spring starts |
| 264ms | 0 | Touches the start edge, 1st rebound |
| 345ms | 10.0px | Rebound peak |
| 468ms | 0 | 2nd touch |
| 550ms | 3.6px | Rebound peak |
| 673ms | 0 | 3rd touch |
| 755ms | 1.3px | Rebound peak |
| about 840ms | under 0.5px | Visually at rest |

**At the 28px peak** (`p = 0.10`), the jump gives a preview of the drag:
- the label fades to about 67%;
- the arrow fades to about 83% and turns about 15° clockwise;
- the fill shows 28px of green beside the thumb;
- the tick is still hidden (it starts at `p = 0.35`).

**Tuning the feel**
- **Damping:** higher means fewer, smaller bounces. Around 32 (ζ about 1) removes the bounce.
- **Stiffness:** higher means faster and snappier.
- **Mass:** higher means heavier and slower, with more travel.

---

## 5. Context: the screens around the slider

### Amount entry
- **Proceed CTA:** 328 × 48, radius 8, `#04B488`, label 16 / 24 weight 500 in white.
- **Tapping Proceed** opens the confirm sheet.

### Confirm sheet

| | |
|---|---|
| Open | **280ms**; sheet `translateY` 800 → 0 |
| Close | **220ms**; sheet `translateY` 0 → 800 |
| Easing (both) | Reanimated default, quad ease-in-out |
| Overlay | `rgba(0,0,0,0.7)`; opacity follows the sheet's progress, 0 → 1 |
| Tapping the overlay | Closes the sheet |
| Top corner radius | 20 |
| Content top padding | 24 |
| Slider | Bottom of the sheet, 16 padding on all sides |
| Home indicator | 108 × 4, radius 12, `#7F8283`, 8px bottom padding |

### Success screen
Entrance animations, staggered:

| Element | Animation | Delay | Duration |
|---|---|---|---|
| Tick circle (96 × 96, radius 48, `#04B488`; 56px white tick) | `FadeIn` | 0ms | 400ms |
| Title "Redeem order placed" | `FadeInDown` | 120ms | 400ms |
| Order details box | `FadeInDown` | 220ms | 400ms |

**Done** returns to amount entry and resets the slider.

---

## 6. Default config

```json
{
  "returnDuration": 340,
  "returnEase": { "family": "cubic", "dir": "out" },
  "completeDuration": 160,
  "completeEase": { "family": "quad", "dir": "out" },
  "hintNudge": 28,
  "hintForwardDuration": 140,
  "hintForwardEase": { "family": "quad", "dir": "out" },
  "springStiffness": 260,
  "springDamping": 10,
  "springMass": 1
}
```

Hard-coded in `SlideToConfirm.tsx`, outside the tuning panel:
- `TRACK_HEIGHT = 48`, `THUMB = 48`, `COMPLETE_RATIO = 0.82`
- tap `maxDuration` 250ms
- all the `p` ranges in section 4.2

## 7. Tuning panel

A dev panel sits beside the phone frame when the window is at least **684px** wide. Changes apply live.

| Group | Control | Range | Step |
|---|---|---|---|
| Return (released early) | Duration | 60–1500ms | 20 |
| | Easing | linear / sine / quad / cubic / quart / quint / expo, each in / out / inOut | |
| Complete (snap to end) | Duration | 60–1500ms | 20 |
| | Easing | same presets | |
| Tap hint (spring back) | Nudge | 8–120px | 2 |
| | Forward duration | 40–800ms | 10 |
| | Forward easing | same presets | |
| | Stiffness | 40–1200 | 20 |
| | Damping | 2–60 | 1 |
| | Mass | 0.5–5 | 0.5 |

**Reset to defaults** restores section 6.
The JSON readout at the bottom of the panel can be pasted straight into `DEFAULT_CONFIG`.

## 8. Known gaps

- **Haptics:** `expo-haptics` is installed but not wired up. Good candidates are the tap jump, crossing the threshold, and completion.
- **Accessibility:** there's no screen-reader action or button fallback yet. A VoiceOver or TalkBack user can't drag, so the slider needs an accessibility action that confirms.
- **Label vs Figma:** the label fades out as you drag. Figma's end frame shows the label in white on the green fill instead.
- **Web testing:** simulated browser clicks don't drive these gestures. Test with a real mouse or touch, or on a device.

---

## Run

```bash
npm install
npx expo start --web --port 8086
```

Or run `npx expo start` and scan the QR code in Expo Go.

**Stack:** Expo 56, React Native 0.85, Reanimated 4 with react-native-worklets, react-native-gesture-handler, react-native-svg.
