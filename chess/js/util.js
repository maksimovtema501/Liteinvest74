/* Общие помощники: DOM, форматирование, окна, тосты. */

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* короткий устойчивый идентификатор строки (FNV-1a) */
export function hashId(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}

/* детерминированный генератор случайных чисел — для «задачи дня» */
export function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e9) / 1e9; };
}

export function today(d = new Date()) {
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function daysBetween(a, b) {
  return Math.round((new Date(b + "T12:00") - new Date(a + "T12:00")) / 864e5);
}
export function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function plural(n, one, few, many) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}

export function fmtClock(ms) {
  if (ms == null) return "";
  ms = Math.max(0, ms);
  if (ms < 10000) {
    const s = Math.floor(ms / 1000), t = Math.floor((ms % 1000) / 100);
    return `0:0${s}.${t}`;
  }
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
  return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0");
}

/* --- шахматные мелочи --- */
export const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
export const PIECE_RU = { p: "пешка", n: "конь", b: "слон", r: "ладья", q: "ферзь", k: "король" };
export const PIECE_ACC = { p: "пешку", n: "коня", b: "слона", r: "ладью", q: "ферзя", k: "короля" };
export const FILES = "abcdefgh";

export const MATE = 100000;
/* оценка строки движка одним числом с точки зрения стороны на ходу */
export function scoreOf(line) {
  if (!line) return 0;
  if (line.mate != null) return line.mate > 0 ? MATE - line.mate : line.mate < 0 ? -MATE - line.mate : -MATE;
  return line.cp ?? 0;
}
/* вероятность выигрыша по формуле lichess */
export function winPct(cp) {
  if (cp >= MATE / 2) return 100;
  if (cp <= -MATE / 2) return 0;
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}
/* «+1.4», «M3», «−M2» — оценка с точки зрения белых */
export function fmtEval(score) {
  if (Math.abs(score) >= MATE / 2) {
    const n = MATE - Math.abs(score);
    return (score > 0 ? "M" : "−M") + Math.max(1, n);
  }
  const v = score / 100;
  return (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(Math.abs(v) >= 10 ? 0 : 1);
}

/* --- окна --- */
let overlayClose = null;
export function modal(html, { wide = false, onClose = null, dismiss = true } = {}) {
  closeModal();
  const ov = document.createElement("div");
  ov.id = "overlay";
  ov.innerHTML = `<div class="modal ${wide ? "wide" : ""}">${html}</div>`;
  document.body.appendChild(ov);
  const close = () => {
    if (!ov.isConnected) return;
    ov.remove();
    if (overlayClose === close) overlayClose = null;
    onClose && onClose();
  };
  if (dismiss) ov.addEventListener("pointerdown", e => { if (e.target === ov) close(); });
  overlayClose = close;
  const box = ov.firstElementChild;
  box.close = close;
  $$("[data-close]", box).forEach(b => b.addEventListener("click", close));
  return box;
}
export function closeModal() { overlayClose && overlayClose(); }

export function confirmBox(text, yes = "Да", no = "Отмена") {
  return new Promise(res => {
    const m = modal(`<div class="prose"><p style="font-size:16px">${text}</p></div>
      <div class="row" style="justify-content:flex-end;margin-top:12px">
        <button class="btn ghost" id="cfNo">${no}</button><button class="btn primary" id="cfYes">${yes}</button></div>`,
      { onClose: () => res(false) });
    $("#cfYes", m).onclick = () => { res(true); m.close(); };
    $("#cfNo", m).onclick = () => m.close();
  });
}

let toastTimer = 0;
export function toast(msg, ms = 2200) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.display = "";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.display = "none"; }, ms);
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast("Скопировано"); }
  catch { modal(`<h2>Скопируйте вручную</h2><textarea readonly style="min-height:160px">${esc(text)}</textarea>
    <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn" data-close>Закрыть</button></div>`); }
}

export function downloadText(name, text, type = "text/plain") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
