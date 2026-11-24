# Erae Lab setup

## Latch indicator dots
Button Control Change, Type Control Change, **Channel 4, Latched on**, ON: CC n value 127, Enable Off: same CC n value 0, MIDI Output: USB Device. Send the layout to the Erae after any edit.

- Layout 1 dots: CC70–75
- Layout 2 dots: CC76–81

Common mistake: leaving Channel 1 / Latched off, which makes the dot never light.

## Layout switching
The Erae sends CC102 + layout index on Ch 16 (127 on entering, 0 on leaving) over the main USB port.
