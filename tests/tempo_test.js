let sent=[];
class ControlChange{constructor(){this.number=0;this.channel=1;this.value=0}send(){sent.push([this.channel,this.number,this.value])}}
let info={tempo:90.5,playing:false,blockStartBeat:0};
const code=require('fs').readFileSync("../mainstage/tempo_sender.js","utf8")+"\nreturn {P:ProcessMIDI};";
const m=new Function("ControlChange","GetTimingInfo",code)(ControlChange,()=>info);
let ok=true;const t=(n,c)=>{console.log(c?'PASS':'FAIL',n);if(!c)ok=false};
m.P(); t('first call sends 4 CCs on Ch14: 90, 0, 5', JSON.stringify(sent)===JSON.stringify([[14,23,0],[14,20,90],[14,21,0],[14,22,5]]));
sent=[]; m.P(); t('no change, not playing: nothing sent', sent.length===0);
info.tempo=135.2; m.P(); t('135.2 -> 7, 1, 2', JSON.stringify(sent)===JSON.stringify([[14,23,0],[14,20,7],[14,21,1],[14,22,2]]));
sent=[]; info.playing=true; info.blockStartBeat=0; m.P(); t('playing: sends once (state change), 127', sent.length===4&&sent[0][2]===127);
sent=[]; info.blockStartBeat=5; m.P(); t('same block: no resend', sent.length===0);
info.blockStartBeat=16; m.P(); t('next block: resend', sent.length===4);
sent=[]; info.tempo=0; m.P(); t('tempo 0 ignored', sent.length===0);
sent=[]; info=null; m.P(); t('no timing info ignored', sent.length===0);
sent=[];info={tempo:135.2,playing:true,blockStartBeat:17};m.P();info.playing=false;m.P();t('stop sends CC23=0',sent.length===4&&sent[0][1]===23&&sent[0][2]===0);
console.log(ok?'ALL PASS':'FAILED');
