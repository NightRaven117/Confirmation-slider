# Confirmation Slider

Usability playground for the slide-to-confirm control on the MF redeem flow
(Figma: Rishabh's Playground, file `Or0YGPDYDvuKkQOBY6iPak`, node `3228-51727`).
Repo: https://github.com/NightRaven117/Confirmation-slider (public; the Mint DS docs stay local and are git-ignored).
Replaces the earlier `Haptics` playground (moved to Trash 2026-11-18), whose base it reuses.

**Problem:** the slider just sits there. A user who doesn't know to drag it, or who taps it, gets no response.

**What the slider does now** (`src/components/SlideToConfirm.tsx`)
- **Tap** anywhere on the track → the thumb jumps forward a little (28px, 140ms ease-out) and springs back
  (stiffness 260, damping 10, mass 1). The spring's overshoot is mirrored, so the thumb rebounds off the
  start edge (~10px, ~4px) instead of leaving the track. This tells the user it moves sideways and has to be dragged.
- **Drag** → the arrow rotates clockwise and fades, and the tick rotates in to replace it. The label fades and the green fill follows the thumb.
- Release past 82% of the track completes; any earlier release eases back to the start.

All timings are tunable live in the dev panel beside the frame (`src/animConfig.ts`, `src/components/Controls.tsx`).
Copy the JSON readout back into `DEFAULT_CONFIG`.

## Run

    npx expo start --web --port 8086

Or scan the QR from `npx expo start` in Expo Go. The drag and tap gestures need real input. Simulated browser clicks don't drive them.
