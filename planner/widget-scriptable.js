// Виджет «Планер» для приложения Scriptable (iOS).
// Показывает на рабочем столе iPhone задачи и занятия на сегодня.
//
// Готовый текст с уже вписанными настройками даёт само приложение:
// «Ещё» → «Виджет на iPhone» → «Скопировать скрипт». Этот файл — шаблон,
// в нём настройки пустые.
//
// Как поставить:
//   1. Установить Scriptable из App Store (бесплатно).
//   2. В Scriptable нажать + и вставить текст, назвать скрипт «Планер».
//   3. На рабочем столе: долгое нажатие → + → Scriptable → выбрать размер →
//      добавить виджет → нажать на него → Script: «Планер».

// ⬇⬇⬇ настройки: их подставляет приложение при копировании ⬇⬇⬇
const CFG = {
  code:    "",   // код синхронизации из планера
  project: "",   // идентификатор проекта Firebase
  key:     "",   // публичный веб-ключ Firebase
  app:     "https://maksimovtema501.github.io/Liteinvest74/planner/"
};
// ⬆⬆⬆ ⬆⬆⬆

const BG      = new Color("#020617");
const TEXT    = new Color("#e2e8f0");
const MUTED   = new Color("#94a3b8");
const DIM     = new Color("#64748b");
const VIOLET  = new Color("#8b5cf6");
const CYAN    = new Color("#22d3ee");
const EMERALD = new Color("#10b981");
const RED     = new Color("#ef4444");

const MON = ["января","февраля","марта","апреля","мая","июня","июля",
             "августа","сентября","октября","ноября","декабря"];
const WD  = ["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"];

const size  = config.runsInWidget ? config.widgetFamily : (args.widgetParameter || "medium");
const LIMIT = { small: 3, medium: 4, large: 10, extraLarge: 10 }[size] || 4;

const plan   = await loadPlan();
const widget = build(plan);
widget.url = CFG.app;
widget.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);

if (config.runsInWidget) Script.setWidget(widget);
else await widget.presentMedium();
Script.complete();

/* ---------- данные ---------- */

// Последний удачный ответ лежит в кэше: без сети виджет показывает его,
// а не пустоту.
function cacheFile(){
  const fm = FileManager.local();
  return fm.joinPath(fm.cacheDirectory(), "planer-widget-" + (CFG.code || "none") + ".json");
}

async function loadPlan(){
  if (!CFG.code || !CFG.key || !CFG.project){
    return { error: "Скопируйте скрипт из планера: «Ещё» → «Виджет на iPhone»" };
  }
  const url = "https://firestore.googleapis.com/v1/projects/" + CFG.project +
              "/databases/(default)/documents/planner/" + encodeURIComponent(CFG.code) +
              "?key=" + CFG.key;
  try{
    const req = new Request(url);
    req.timeoutInterval = 15;
    const res = await req.loadJSON();
    if (res && res.error) throw new Error(res.error.message || "нет доступа");
    const raw = res && res.fields && res.fields.data && res.fields.data.stringValue;
    if (!raw) throw new Error("пустой ответ");
    const plan = JSON.parse(raw);
    try{ FileManager.local().writeString(cacheFile(), raw); }catch(e){}
    return plan;
  }catch(e){
    try{
      const fm = FileManager.local(), f = cacheFile();
      if (fm.fileExists(f)){
        const plan = JSON.parse(fm.readString(f));
        plan.stale = true;
        return plan;
      }
    }catch(e2){}
    return { error: String((e && e.message) || e) };
  }
}

/* ---------- отрисовка ---------- */

function build(plan){
  const w = new ListWidget();
  w.backgroundColor = BG;
  w.setPadding(14, 14, 12, 14);

  if (plan.error){
    head(w, "Планер", "");
    w.addSpacer(6);
    const t = w.addText(plan.error);
    t.font = Font.systemFont(11);
    t.textColor = RED;
    t.lineLimit = 4;
    return w;
  }

  const now = new Date();
  const dateLine = now.getDate() + " " + MON[now.getMonth()] + ", " + WD[now.getDay()];
  const total = plan.total || 0, done = plan.done || 0;
  head(w, dateLine, total ? done + "/" + total : "");
  if (total) progressBar(w, done / total, size === "small" ? 120 : 280);
  w.addSpacer(size === "small" ? 6 : 8);

  // занятия и задачи одним списком по времени; сделанное уезжает вниз,
  // на маленьком виджете важнее то, что ещё осталось
  const items = [];
  (plan.lessons || []).forEach(l => items.push({
    kind: "lesson", time: l.tm || "", text: l.t || "", st: l.st
  }));
  (plan.tasks || []).forEach(t => items.push({
    kind: "task", time: t.tm || "", text: t.t || "", done: !!t.d, prio: t.p || 0
  }));
  items.sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  items.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0));

  if (!items.length){
    const t = w.addText("На сегодня ничего не запланировано");
    t.font = Font.systemFont(12);
    t.textColor = DIM;
    t.lineLimit = 2;
  }
  items.slice(0, LIMIT).forEach(it => row(w, it));

  const hidden = items.length - LIMIT;
  if (hidden > 0){
    w.addSpacer(3);
    const t = w.addText("ещё " + hidden);
    t.font = Font.systemFont(10);
    t.textColor = DIM;
  }

  w.addSpacer();
  const foot = w.addStack();
  const upd = plan.updated ? plan.updated.slice(11, 16) : "";
  const f = foot.addText(plan.stale ? "нет сети · " + upd : (upd ? "обновлено " + upd : ""));
  f.font = Font.systemFont(9);
  f.textColor = DIM;
  if (plan.tomorrow && plan.tomorrow.total){
    foot.addSpacer();
    const t = foot.addText("завтра " + plan.tomorrow.total);
    t.font = Font.systemFont(9);
    t.textColor = DIM;
  }
  return w;
}

function head(w, left, right){
  const st = w.addStack();
  st.centerAlignContent();
  const a = st.addText(left);
  a.font = Font.semiboldSystemFont(size === "small" ? 12 : 13);
  a.textColor = TEXT;
  a.lineLimit = 1;
  if (right){
    st.addSpacer();
    const b = st.addText(right);
    b.font = Font.mediumSystemFont(size === "small" ? 12 : 13);
    b.textColor = MUTED;
  }
}

function progressBar(w, ratio, width){
  const h = 5;
  const ctx = new DrawContext();
  ctx.size = new Size(width, h);
  ctx.opaque = false;
  ctx.respectScreenScale = true;
  ctx.setFillColor(new Color("#1e293b"));
  ctx.fillRect(new Rect(0, 0, width, h));
  ctx.setFillColor(ratio >= 1 ? EMERALD : VIOLET);
  ctx.fillRect(new Rect(0, 0, Math.max(0, Math.min(1, ratio)) * width, h));
  w.addSpacer(6);
  const img = w.addImage(ctx.getImage());
  img.imageSize = new Size(width, h);
}

function row(w, it){
  w.addSpacer(size === "small" ? 3 : 5);
  const st = w.addStack();
  st.centerAlignContent();
  st.spacing = 5;

  const mark = st.addText(it.kind === "lesson" ? "●" : (it.done ? "✓" : "○"));
  mark.font = Font.systemFont(11);
  mark.textColor = it.kind === "lesson"
    ? (it.st === "cancelled" ? DIM : CYAN)
    : (it.done ? EMERALD : (it.prio === 2 ? RED : MUTED));

  if (it.time){
    const tm = st.addText(it.time);
    tm.font = Font.mediumSystemFont(11);
    tm.textColor = it.kind === "lesson" ? CYAN : MUTED;
  }

  const txt = st.addText(it.text);
  txt.font = Font.systemFont(12);
  txt.textColor = (it.done || it.st === "cancelled") ? DIM : TEXT;
  txt.lineLimit = 1;
}
