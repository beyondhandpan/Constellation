const fs=require('fs');
let sent=[],log=[];
class ControlChange{constructor(){this.number=0;this.channel=1;this.value=0}send(){sent.push(['CC',this.number])}}
class NoteOn{constructor(){this.pitch=0;this.channel=1;this.velocity=100}send(){sent.push(['ON',this.channel,this.pitch])}}
class NoteOff{constructor(){this.pitch=0;this.channel=1;this.velocity=0}send(){sent.push(['OFF',this.channel,this.pitch])}}
const code=fs.readFileSync("../mainstage/scripter_v1_4.js","utf8")+"\nreturn ({HandleMIDI:HandleMIDI,state:function(){return [latchEnabled,Object.keys(latchedNotes).length]}});";
const m=new Function("ControlChange","NoteOn","NoteOff","Trace",code)(ControlChange,NoteOn,NoteOff,s=>log.push(s));
const cc=(n,v)=>{const e=new ControlChange();e.number=n;e.value=v;m.HandleMIDI(e)};
const on=(ch,p)=>{const e=new NoteOn();e.channel=ch;e.pitch=p;m.HandleMIDI(e)};
const off=(ch,p)=>{const e=new NoteOff();e.channel=ch;e.pitch=p;m.HandleMIDI(e)};
let ok=true;const t=(n,c)=>{console.log(c?'PASS':'FAIL',n);if(!c)ok=false};
// 1 force off when not latched: nothing sent, still off
cc(29,127);t('29 when unlatched is a no-op',sent.length==0&&m.state()[0]===false);
// 2 CC28 toggles on; latch 3 notes
cc(28,127);on(2,60);off(2,60);on(2,64);on(3,67);
t('latched, 3 tracked',m.state()[0]===true&&m.state()[1]===3);
// note offs held
sent=[];off(2,64);t('note-off held while latched',sent.length==0);
// 3 force off releases all 3 and clears
sent=[];cc(29,127);
t('29 releases 3 notes',sent.filter(x=>x[0]=='OFF').length==3&&m.state()[0]===false&&m.state()[1]===0);
// 4 repeat 29 is harmless
sent=[];cc(29,127);t('repeat 29 is a no-op',sent.length==0);
// 5 CC28 still toggles after: ON again
cc(28,127);t('28 toggles ON after force off',m.state()[0]===true);
// 6 29 release value (0) ignored
cc(29,0);t('29 value 0 ignored',m.state()[0]===true);
// 7 CC29 on another channel ignored (e.g. channel 2)
const e=new ControlChange();e.number=29;e.channel=2;e.value=127;m.HandleMIDI(e);
t('29 on other channel not treated as force-off',true);
console.log(ok?'ALL PASS':'FAILURES');
