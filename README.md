# Constellation — Hold space for every sound

Play 12 MainStage instruments from an Embodme Erae 2 with MPE, per-patch note latching, and synced latch-indicator lights on the Erae surface.

**Demo video:** https://youtu.be/xQWb0LF4U4I

**Status:** working prototype, shared for feedback from Embodme and other Erae 2 / MainStage users.

## How it fits together

```
Erae 2 (MPE, 2 layouts) ──► MainStage 4.3.1 (12 patches, Scripter latch on each)
        ▲                           │
        │ indicator CCs             │ patch changes / latch state
Mac TouchOSC "Bridge" ◄──► iPad TouchOSC panel
```

- **Layout 1** pages: Pigments 1, 2, 3 / Omnisphere 1, 2, 3 (patches P0, P1, P4 / P2, P3, P5).
- **Layout 2**: patches P6–P11, in order.
- **Latch:** Ch 1 CC28 = 127 toggles latch on the active patch. CC29 >= 64 forces latch off (safe any time; used by CLEAR ALL).
- **Indicators:** the Bridge sends Ch 4, CC 70 + patch number (127 = on, 0 = off) to the Erae only. It resends all 12 about 300 ms after a layout change (CC102–109 on Ch 16) and after CLEAR ALL.

## Contents

| Path | What |
|---|---|
| `mainstage/scripter_v1_4.js` | Scripter latch script. Paste into each patch's Scripter; change only the `TAG` line. |
| `touchosc/Bridge_v2.7.tosc` | Mac TouchOSC bridge (connections: 1 Erae, 2 iPad, 3 IAC Bus 1, 4 IAC Bus 2). |
| `touchosc/iPad_v1.11.tosc` | iPad control panel. |
| `erae/` | Erae Lab layout exports (Layout 1 and 2). |
| `docs/` | Erae Lab setup, MainStage setup, Launch Control XL 3 notes. |
| `tests/scripter_test.js` | Offline test of the latch logic: `node tests/scripter_test.js` |

## Requirements

Embodme Erae 2 (firmware 2.1.3 recommended), Erae Lab, macOS, MainStage 4.3.1, Arturia Pigments, Spectrasonics Omnisphere, TouchOSC (Mac and iPad), IAC Driver enabled. Instrument patches are not included.

## Known issues

- Latching more than about three patches' notes at once can cause audio cutouts with heavy reverbs. Keep three or fewer latched instruments.
- Erae Lab cannot copy/paste elements or reuse presets between layouts, so each indicator dot is built by hand.
- Looper control from the Erae is untested.

## License

MIT. See `LICENSE`.
