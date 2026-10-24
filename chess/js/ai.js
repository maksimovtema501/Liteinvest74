/* ИИ-тренер — Claude через официальный SDK (vendor/anthropic-sdk.mjs).
   Сервера у приложения нет, поэтому ключ API вводит сам человек: он хранится
   только в localStorage этого устройства и уходит только в api.anthropic.com.
   Оценки позиций всегда считает Stockfish — ИИ получает их готовыми и только
   объясняет, поэтому не выдумывает варианты. */
import { $, modal, toast } from "./util.js";

const AI_KEY = "chess-ai-key", AI_MODEL = "claude-opus-5-5";
export const aiKey = () => { try { return localStorage.getItem(AI_KEY) || ""; } catch { return ""; } };
export function setAiKey(v) {
  try { v ? localStorage.setItem(AI_KEY, v) : localStorage.removeItem(AI_KEY); } catch {}
}

let SDK = null;
async function client() {
  if (!SDK) SDK = (await import("../vendor/anthropic-sdk.mjs")).default;
  return new SDK({ apiKey: aiKey(), dangerouslyAllowBrowser: true });
}

export function aiKeyHelp(onSaved) {
  const m = modal(`<h2>🤖 ИИ-тренер</h2>
    <div class="prose small">
      <p>Тренер на Claude от Anthropic объясняет ходы человеческим языком, разбирает партии и отвечает на любые вопросы о шахматах. Оценки считает движок Stockfish, ИИ их только объясняет.</p>
      <p>У приложения нет своего сервера, поэтому нужен <b>свой ключ API</b>. Это платно, но недорого: один ответ тренера — примерно 1–4 рубля.</p>
      <ol>
        <li>Откройте <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a> и зарегистрируйтесь.</li>
        <li>Пополните баланс в разделе Billing ($5 хватит надолго).</li>
        <li>API Keys → Create Key → скопируйте ключ (начинается с <span class="kbd">sk-ant-</span>).</li>
        <li>Вставьте его сюда.</li>
      </ol>
    </div>
    <input type="password" id="kIn" placeholder="sk-ant-…" autocomplete="off" autocapitalize="off" spellcheck="false" value="${aiKey()}">
    <p class="tiny dim" style="margin:8px 0 12px">Ключ хранится только на этом устройстве и отправляется только в Anthropic. Никому его не показывайте.</p>
    <div class="row" style="justify-content:flex-end"><button class="btn ghost" data-close>Отмена</button><button class="btn primary" id="kSave">Сохранить</button></div>`);
  $("#kSave", m).onclick = () => {
    const v = $("#kIn", m).value.trim();
    if (v && !/^sk-ant-/.test(v)) { toast("Ключ должен начинаться с sk-ant-"); return; }
    setAiKey(v);
    toast(v ? "Ключ сохранён" : "Ключ удалён");
    m.close();
    onSaved && onSaved();
  };
}

export function aiError(e) {
  const A = SDK;
  if (A && e instanceof A.AuthenticationError) return "Ключ API не подошёл. Проверьте его в настройках.";
  if (A && e instanceof A.PermissionDeniedError) return "У ключа нет доступа к модели. Проверьте настройки в console.anthropic.com.";
  if (A && e instanceof A.RateLimitError) return "Слишком много запросов. Подождите минуту и попробуйте снова.";
  if (A && e instanceof A.BadRequestError) return "Запрос отклонён: " + (e.message || "") + " Если дело в балансе — пополните его в console.anthropic.com (Billing).";
  if (A && e instanceof A.APIConnectionError) return "Нет связи с сервером. Проверьте интернет.";
  if (A && e instanceof A.APIError) return `Ошибка сервера (${e.status || "?"}). Попробуйте ещё раз.`;
  return "Не получилось связаться с ИИ: " + (e && e.message ? e.message : e);
}

export const COACH_SYSTEM = `Ты — шахматный тренер в приложении «Шахматы». Ученик говорит по-русски.
Как отвечать:
- Пиши по-русски, просто и дружелюбно, как живой тренер на занятии. Коротко: обычно 2–6 предложений, без длинных вступлений.
- Ходы записывай в русской нотации: Кр — король, Ф — ферзь, Л — ладья, С — слон, К — конь, пешки без буквы (e4, exd5).
- Оценки и варианты считает движок Stockfish, они даны в сообщении. Опирайся на них и не придумывай свои варианты: если движок не дал продолжения, говори об идеях и планах, а не о конкретных ходах.
- Объясняй «почему»: какая угроза, какая фигура без защиты, какой план, что упустил. Давай одно практическое правило, которое пригодится в следующих партиях.
- Оценку движка переводи на человеческий язык (например, +2 — «у белых лишняя фигура или большой перевес»), числа приводи редко.`;

/* потоковый ответ; onText получает весь накопленный текст */
export async function aiAsk({ system = COACH_SYSTEM, messages, effort = "low", onText = null, signal = null }) {
  const c = await client();
  const stream = c.beta.messages.stream({
    model: AI_MODEL,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort },
    system,
    messages,
  });
  let raw = "";
  for await (const event of stream) {
    if (signal && signal.aborted) { stream.abort(); throw new Error("aborted"); }
    if (event.type === "content_block_start" && event.content_block.type === "fallback") raw = "";
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      raw += event.delta.text;
      onText && onText(raw);
    }
  }
  const msg = await stream.finalMessage();
  if (msg.stop_reason === "refusal") throw new Error("ИИ не стал отвечать на этот вопрос. Попробуйте сформулировать иначе.");
  // после блока fallback ответ продолжает другая модель — берём текст после него
  let start = 0;
  msg.content.forEach((b, i) => { if (b.type === "fallback") start = i + 1; });
  return msg.content.slice(start).filter(b => b.type === "text").map(b => b.text).join("");
}

/* простое оформление ответа: абзацы и **жирный** */
export function aiHtml(text) {
  const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  return esc(text).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
}
