# Erae 2 looper with Constellation

The looper records **gestures**, not MIDI, and plays them into whichever patch is active. Replayed notes arrive on Ch 1.

## Controls
- **Loop** button opens the looper. **Record once**: pulsing red means armed; it starts on the host clock.
- Mute a layer: hold its layer button and press **Stop**. Unmute: **Play**.
- **Undo** erases the last gesture. Hold **Layout + Undo** to delete loops.
- Firmware 2.1.x also added a **sequencer**. A stored sequencer pattern can replay when the looper starts (clear it with the "clear seq" prompt).

## Test results (Constellation)
| Test | Result |
|---|---|
| Plain loop | Works |
| Melody over a loop of one patch | Works |
| Loop follows the active patch when you switch | Yes, it plays into whichever patch is active |
| Latch-pad touches | Replayed; the latch toggles on each repeat. Undo does not release it; CLEAR ALL does |
| Slider | Recorded and replayed |
| Four latched patches plus a loop | No dropouts (MainStage FX/sends off) |
| CLEAR ALL with 5 latches | Did not complete cleanly (open item) |

## Count-in and tempo
The Erae has no count-in. With the master clock (see `MASTER_CLOCK.md`), arm Record and press Play in MainStage (or the XL3 Play/Stop button) so recording starts on the clock.
