const m = {
 '1':[697,1209],'2':[697,1336],'3':[697,1477],'A':[697,1633],
 '4':[770,1209],'5':[770,1336],'6':[770,1477],'B':[770,1633],
 '7':[852,1209],'8':[852,1336],'9':[852,1477],'C':[852,1633],
 '*':[941,1209],'0':[941,1336],'#':[941,1477],'D':[941,1633]
};
const n = document.getElementById('i');
n.addEventListener('input', () => {
    n.value = n.value.toUpperCase().replace(/[^0-9A-D*#]/g, '');
});
window.x = async () => {
    const t = n.value;
    const s = document.getElementById('s');
    const d = document.getElementById('d');
    const b = document.getElementById('b');
    const g = document.getElementById('g');
    if (!t) return;
    b.disabled = true;
    g.style.display = 'none';
    s.innerText = 'generating...';
    const c = new OfflineAudioContext(1, 44100 * t.length * 0.4, 44100);
    let o = 0;
    for (let k of t) {
        if (m[k]) {
            const o1 = c.createOscillator();
            const o2 = c.createOscillator();
            const gn = c.createGain();
            o1.frequency.value = m[k][0];
            o2.frequency.value = m[k][1];
            o1.connect(gn); o2.connect(gn); gn.connect(c.destination);
            gn.gain.value = 0.25;
            o1.start(o); o2.start(o);
            o1.stop(o + 0.2); o2.stop(o + 0.2);
            o += 0.3;
        }
    }
    const ab = await c.startRendering();
    const l = ab.length * 2;
    const v = new DataView(new ArrayBuffer(44 + l));
    const w = (p, q) => { for (let k = 0; k < q.length; k++) v.setUint8(p + k, q.charCodeAt(k)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + l, true); w(8, 'WAVE'); w(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 44100, true); v.setUint32(28, 44100 * 2, true); v.setUint16(32, 2, true);
    v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, l, true);
    const da = ab.getChannelData(0);
    for (let k = 0; k < da.length; k++) {
        const z = Math.max(-1, Math.min(1, da[k]));
        v.setInt16(44 + k * 2, z < 0 ? z * 0x8000 : z * 0x7FFF, true);
    }
    const u = URL.createObjectURL(new Blob([v.buffer], { type: 'audio/wav' }));
    d.href = u;
    d.download = 'dtmf.wav';
    d.innerText = 'download dtmf.wav';
    g.style.display = 'grid';
    s.innerText = 'done';
    b.disabled = false;
};