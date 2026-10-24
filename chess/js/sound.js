/* Звуки синтезируются WebAudio — файлов нет, работают офлайн. */
import { S } from "./store.js";

let ctx = null;
function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
// iOS разрешает звук только после касания
addEventListener("pointerdown", () => { if (S.settings.sound) ac(); }, { once: true });

/* «стук» фигуры о доску: короткий шумовой импульс через полосовой фильтр */
function knock(c, t, { freq = 1800, q = 1.2, gain = 0.6, dur = 0.07 } = {}) {
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(c.destination);
  src.start(t);
  // низкий «тук» корпуса
  const o = c.createOscillator(), og = c.createGain();
  o.frequency.setValueAtTime(freq / 9, t);
  o.frequency.exponentialRampToValueAtTime(freq / 18, t + dur);
  og.gain.setValueAtTime(gain * 0.5, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(og).connect(c.destination);
  o.start(t); o.stop(t + dur);
}
function tone(c, t, freq, dur, gain = 0.18, type = "sine") {
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

export function play(kind) {
  if (!S.settings.sound) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime + 0.005;
  switch (kind) {
    case "move": knock(c, t, { freq: 1500, gain: 0.55 }); break;
    case "capture": knock(c, t, { freq: 2300, gain: 0.8, q: 0.8 }); knock(c, t + 0.045, { freq: 1300, gain: 0.45 }); break;
    case "castle": knock(c, t, { freq: 1500, gain: 0.5 }); knock(c, t + 0.11, { freq: 1700, gain: 0.5 }); break;
    case "check": knock(c, t, { freq: 1700, gain: 0.55 }); tone(c, t + 0.02, 880, 0.18, 0.09, "triangle"); break;
    case "promote": knock(c, t, { freq: 1500, gain: 0.5 }); tone(c, t + 0.03, 660, 0.12, 0.1); tone(c, t + 0.1, 990, 0.18, 0.1); break;
    case "start": tone(c, t, 523, 0.18, 0.12); tone(c, t + 0.12, 784, 0.3, 0.12); break;
    case "end": tone(c, t, 784, 0.2, 0.12); tone(c, t + 0.15, 523, 0.4, 0.12); break;
    case "win": tone(c, t, 523, 0.15, 0.12); tone(c, t + 0.12, 659, 0.15, 0.12); tone(c, t + 0.24, 784, 0.4, 0.13); break;
    case "right": tone(c, t, 880, 0.12, 0.12); tone(c, t + 0.09, 1320, 0.22, 0.1); break;
    case "wrong": tone(c, t, 311, 0.16, 0.14, "square"); tone(c, t + 0.12, 233, 0.26, 0.12, "square"); break;
    case "illegal": tone(c, t, 180, 0.12, 0.1, "square"); break;
    case "tick": knock(c, t, { freq: 3500, gain: 0.25, dur: 0.03 }); break;
    case "notify": tone(c, t, 1046, 0.12, 0.1); tone(c, t + 0.1, 1318, 0.18, 0.1); break;
  }
}

/* звук хода по объекту хода chess.js */
export function moveSound(m, chess) {
  if (!m) return;
  if (chess && chess.isCheck()) return play("check");
  if (m.promotion) return play("promote");
  if (m.flags && (m.flags.includes("k") || m.flags.includes("q"))) return play("castle");
  if (m.captured) return play("capture");
  play("move");
}
