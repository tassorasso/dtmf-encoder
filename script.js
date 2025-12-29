const { createFFmpeg } = FFmpeg;
const f = createFFmpeg({ log: false });
const m = {
 '1':[697,1209],'2':[697,1336],'3':[697,1477],'A':[697,1633],
 '4':[770,1209],'5':[770,1336],'6':[770,1477],'B':[770,1633],
 '7':[852,1209],'8':[852,1336],'9':[852,1477],'C':[852,1633],
 '*':[941,1209],'0':[941,1336],'#':[941,1477],'D':[941,1633]
};
const i = document.getElementById('i');
i.addEventListener('input', () => {
    i.value = i.value.toUpperCase().replace(/[^0-9A-D*#]/g, '');
});
const w = (b) => {
 const l = b.length * 2;
 const v = new DataView(new ArrayBuffer(44 + l));
 const w = (o, s) => { for (let k = 0; k < s.length; k++) v.setUint8(o + k, s.charCodeAt(k)); };
 w(0, 'RIFF'); v.setUint32(4, 36 + l, true); w(8, 'WAVE'); w(12, 'fmt ');
 v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
 v.setUint32(24, 44100, true); v.setUint32(28, 44100 * 2, true); v.setUint16(32, 2, true);
 v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, l, true);
 const d = b.getChannelData(0);
 for (let k = 0; k < d.length; k++) {
  const s = Math.max(-1, Math.min(1, d[k]));
  v.setInt16(44 + k * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
 }
 return v.buffer;
};
const x = async () => {
 const t = i.value;
 const s = document.getElementById('s');
 const d = document.getElementById('d');
 const b = document.getElementById('b');
 const g = document.getElementById('g');
 if (!t) return;
 b.disabled = true;
 g.style.display = 'none';
 s.innerText = 'generating tones...';
 const c = new OfflineAudioContext(1, 44100 * t.length * 0.4, 44100);
 let n = 0;
 for (let x of t) {
  if (m[x]) {
   const o1 = c.createOscillator();
   const o2 = c.createOscillator();
   const ga = c.createGain();
   o1.frequency.value = m[x][0];
   o2.frequency.value = m[x][1];
   o1.connect(ga); o2.connect(ga); ga.connect(c.destination);
   ga.gain.value = 0.25;
   o1.start(n); o2.start(n);
   o1.stop(n + 0.2); o2.stop(n + 0.2);
   n += 0.3;
  }
 }
 const bf = await c.startRendering();
 const wb = w(bf);
 s.innerText = 'converting...';
 if (!f.isLoaded()) await f.load();
 f.FS('writeFile', 'i.wav', new Uint8Array(wb));
 await f.run('-i', 'i.wav', 'o.ogg');
 const o = f.FS('readFile', 'o.ogg');
 const u = URL.createObjectURL(new Blob([o.buffer], { type: 'audio/ogg' }));
 d.href = u;
 d.download = 'dtmf.ogg';
 g.style.display = 'grid';
 s.innerText = 'done';
 b.disabled = false;
};