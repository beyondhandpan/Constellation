/*
CONSTELLATION: Tempo Sender (MainStage Scripter)

PURPOSE
Reads the MainStage concert tempo and sends it to the iPad panel
so it can show the BPM. Sends nothing else.

WHERE TO USE
A SEPARATE concert-level External Instrument strip whose MIDI
destination is "TouchOSC Bridge" (NOT the Erae). Add this script
in that strip's MIDI FX slot.

MESSAGES (Channel 14)
CC20 = whole BPM, low 7 bits
CC21 = whole BPM, high part (whole BPM divided by 128)
CC22 = tenths of a BPM (0-9). Sent LAST, so the iPad updates
       its display when CC22 arrives.
BPM = CC21 * 128 + CC20 + CC22 / 10

CC23 = transport state: 127 = playing, 0 = stopped. Sent first, with
       every tempo message and whenever play/stop changes, so the iPad
       can grey out the BPM when the clock is stopped.

Sent when the tempo or play/stop state changes, and again about every
16 beats while the clock is running, so an iPad that starts late
catches up.
*/

var NeedsTimingInfo = true;

var CHANNEL = 14;
var CC_LOW = 20;
var CC_HIGH = 21;
var CC_TENTHS = 22;
var CC_PLAYING = 23;
var RESEND_BEATS = 16;

var lastSentTenths = -1;
var lastResendBlock = -1;
var lastPlaying = -1;

function sendCC(number, value) {
    var cc = new ControlChange();
    cc.channel = CHANNEL;
    cc.number = number;
    cc.value = value;
    cc.send();
}

function sendTempo(tenthsTotal, playing) {
    sendCC(CC_PLAYING, playing ? 127 : 0);
    var whole = Math.floor(tenthsTotal / 10);
    var tenths = tenthsTotal % 10;
    sendCC(CC_LOW, whole % 128);
    sendCC(CC_HIGH, Math.min(127, Math.floor(whole / 128)));
    sendCC(CC_TENTHS, tenths);
    lastSentTenths = tenthsTotal;
}

function ProcessMIDI() {
    var info = GetTimingInfo();
    if (!info || !(info.tempo > 0)) {
        return;
    }

    var tenthsTotal = Math.round(info.tempo * 10);
    var playingNow = info.playing ? 1 : 0;
    var changed = (tenthsTotal !== lastSentTenths) || (playingNow !== lastPlaying);
    lastPlaying = playingNow;

    var due = false;
    if (info.playing) {
        var block = Math.floor(info.blockStartBeat / RESEND_BEATS);
        if (block !== lastResendBlock) {
            lastResendBlock = block;
            due = true;
        }
    }

    if (changed || due) {
        sendTempo(tenthsTotal, info.playing);
    }
}

// Not used: this script only sends tempo.
function HandleMIDI(event) {
    // swallow nothing: pass nothing through
}
