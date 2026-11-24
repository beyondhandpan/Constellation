/*
BEYOND HANDPAN — MainStage Scripter
Pigments 1 — Latch Diagnostic v1.4

TARGET:
MainStage > Layout 1 > Pigments 1
MIDI FX > Scripter

PURPOSE:
- Preserve CC28 musical latching (toggle).
- Track notes by MIDI channel and pitch.
- Prevent overlapping latched notes of the
  same pitch on the same MIDI channel.
- Release all tracked notes on LATCH OFF.
- Preserve MPE channel information.
- Provide concise diagnostic logging.

NEW IN v1.4:
CC29 (Channel 1, value >= 64) = FORCE LATCH OFF.
Unlike CC28 it is NOT a toggle: it is safe to send
at any time. If this patch is latched it releases
every tracked note and turns latch off; if it is
not latched it does nothing. Used by the
CLEAR ALL resync (nothing else sends CC29).

KEPT FROM v1.3:
If a Note On arrives for a note already latched,
send a matching Note Off before retriggering.

TO USE IN ANOTHER PATCH:
Change ONLY the TAG line below.

SAFETY:
- No MIDI sent to TouchOSC or IAC.
- No changes to other MainStage patches.
- No changes to Erae or Mac Bridge.
*/

var TAG = "PIGMENTS 1";

var latchEnabled = false;
var latchedNotes = {};

Trace(TAG + " SCRIPT LOADED v1.4");

// Unique key: MIDI channel + pitch
function noteKey(event) {
    return event.channel + ":" + event.pitch;
}

// Count tracked notes
function countLatched() {

    var count = 0;

    for (var key in latchedNotes) {

        if (latchedNotes.hasOwnProperty(key)) {
            count++;
        }

    }

    return count;
}

// Send Note Off for a stored note
function sendStoredNoteOff(note) {

    var off = new NoteOff();

    off.pitch = note.pitch;
    off.channel = note.channel;
    off.velocity = 0;

    off.send();
}

// Release all latched notes
function stopAllLatchedNotes() {

    Trace(
        TAG + " RELEASE START tracked=" +
        countLatched()
    );

    for (var key in latchedNotes) {

        if (latchedNotes.hasOwnProperty(key)) {

            var note = latchedNotes[key];

            Trace(
                TAG + " RELEASE " +
                note.channel + ":" + note.pitch
            );

            sendStoredNoteOff(note);

        }

    }

    latchedNotes = {};

    Trace(TAG + " RELEASE COMPLETE");

}

// Diagnostic only
function Reset() {

    Trace(
        TAG + " RESET latch=" +
        latchEnabled +
        " tracked=" + countLatched()
    );

}

// Main MIDI handler
function HandleMIDI(event) {

    if (event === null ||
        event === undefined) {
        return;
    }

    // CC28: Musical latch toggle
    if (event instanceof ControlChange &&
        event.number === 28 &&
        event.channel === 1) {

        // Respond only to button press
        if (event.value >= 64) {

            latchEnabled = !latchEnabled;

            Trace(
                TAG + " LATCH " +
                (latchEnabled ? "ON" : "OFF") +
                " tracked=" + countLatched()
            );

            if (!latchEnabled) {
                stopAllLatchedNotes();
            }

        }

        return;
    }

    // CC29: FORCE LATCH OFF (idempotent, not a toggle)
    if (event instanceof ControlChange &&
        event.number === 29 &&
        event.channel === 1) {

        if (event.value >= 64) {

            Trace(
                TAG + " FORCE OFF latch=" +
                latchEnabled +
                " tracked=" + countLatched()
            );

            latchEnabled = false;

            if (countLatched() > 0) {
                stopAllLatchedNotes();
            }

        }

        return;
    }

    // NOTE ON
    if (event instanceof NoteOn) {

        if (latchEnabled) {

            var key = noteKey(event);

            // Release previous latched
            // instance before retriggering.
            if (latchedNotes[key]) {

                Trace(
                    TAG + " RETRIGGER " + key +
                    " - releasing previous note"
                );

                sendStoredNoteOff(
                    latchedNotes[key]
                );

            }

            // Track the new note
            latchedNotes[key] = {
                pitch: event.pitch,
                channel: event.channel
            };

            Trace(
                TAG + " NOTE LATCHED " + key +
                " tracked=" + countLatched()
            );

        }

        event.send();
        return;
    }

    // NOTE OFF
    if (event instanceof NoteOff) {

        var key = noteKey(event);

        if (latchEnabled &&
            latchedNotes[key]) {

            // Sustain this note
            return;

        }

        event.send();
        return;
    }

    // Pass other MIDI messages through
    event.send();
}
