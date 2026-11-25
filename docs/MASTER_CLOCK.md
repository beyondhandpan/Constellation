# Master clock, tempo knob, Play/Stop and the iPad tempo display

Goal: MainStage's concert tempo drives everything, including the Erae looper, and the iPad panel shows it.

## 1. MainStage clock to the Erae

1. Concert-level channel strip: **External Instrument**, MIDI Output = the Erae (MIDI Erae 2), Channel 15.
2. On that strip's **MIDI Output** tab ("On Patch Change"): tick **only** "Start Sending MIDI Clock". Leave Expression, Program Change, Bank Select, Start, Continue, Stop and MIDI File unticked.
3. Strip MIDI Input keyboard = None.
4. Erae Lab: Parameter > Clock Source > **USB Device**.
5. Press **Play** in MainStage once before the set. Starting the clock briefly interrupts audio, so do it before playing.

The Erae follows the tempo. Known quirk: the BPM number on the Erae screen does not update with an external clock (reported to Embodme).

MainStage's concert tempo lives in Concert Settings Inspector > Timing > Tempo.

## 2. Tempo knob (Launch Control XL 3)

Bottom-right knob, CC36, Ch 1. In Edit mode, at **concert** level, add a Knob screen control in Layout mode, learn it with **Assign & Map**, then in the Screen Control Inspector choose Map Parameter > Actions > **Tempo / Tap Tempo**. Range Min 60, Max 120 (adjust to taste). Works on every patch.

## 3. Play/Stop button (Launch Control XL 3)

Button above the tempo knob, CC44, Ch 1 (Press / Release). Same method: add a Button screen control in Layout mode, learn it with **Assign & Map**, then Map Parameter > Actions > **Play/Stop**.

MainStage may show "Unmapped" in the table for this control and keep jumping back to the first patch; test it in Perform mode instead. It starts and stops the transport.

## 4. Tempo on the iPad

`mainstage/tempo_sender.js` in a **separate** concert-level External Instrument strip:

- MIDI Output: **TouchOSC Bridge**, Channel 14.
- MIDI Output tab: every box **unticked** (Start/Stop/Continue/clock must be off).
- MIDI FX: Scripter with `tempo_sender.js`. Click Run Script.

It sends on Ch 14:

| CC | Meaning |
|---|---|
| 20 | whole BPM, low 7 bits |
| 21 | whole BPM, high part (whole BPM / 128) |
| 22 | tenths of a BPM (sent last; the iPad redraws on this) |
| 23 | transport: 127 = playing, 0 = stopped |

BPM = CC21 x 128 + CC20 + CC22 / 10. Sent on any change and about every 16 beats while playing.

iPad panel `iPad_v1.13.tosc` shows "xxx.x BPM" to the left of the patch name: white while playing, grey while stopped.

MainStage delivers these straight to the iPad over the "TouchOSC Bridge" port, so the Mac Bridge is not involved. Use **Bridge v2.7**; older bridges (v2.6 and earlier) do not send the latch lights.

Offline test: `cd tests && node tempo_test.js`.

## Pre-show routine

1. XL3: press Mode, choose Constellation (it reverts to Mode 16 after a power cycle).
2. Bridge v2.7 and iPad v1.13 loaded.
3. Press the XL3 Play/Stop button once so the clock is running; the Erae follows the tempo.
4. Turn the tempo knob and watch the iPad.
