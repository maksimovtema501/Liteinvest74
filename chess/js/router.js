/* Маршруты вида #/puzzle/rated?x=1. Экран возвращает функцию очистки —
   она вызывается при уходе (таймеры, доски, задания движка). */
import { $, closeModal } from "./util.js";
import { setActive } from "./store.js";

const routes = {};
let cleanup = null;
let onNav = null;

export function route(name, fn) { routes[name] = fn; }
export function setNavHook(fn) { onNav = fn; }

export function go(path) {
  const h = "#/" + path;
  if (location.hash === h) render(); else location.hash = h;
}
export function replace(path) {
  history.replaceState(null, "", "#/" + path);
  render();
}

export function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, qs] = raw.split("?");
  const parts = path.split("/").map(decodeURIComponent);
  return { name: parts[0] || "home", arg: parts.slice(1).join("/"), params: Object.fromEntries(new URLSearchParams(qs || "")) };
}

export function render() {
  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } }
  cleanup = null;
  closeModal();
  // ссылка-приглашение вида #join=КОД
  const join = location.hash.match(/^#join=([\w-]+)/);
  if (join) { history.replaceState(null, "", "#/online?join=" + join[1]); }
  const { name, arg, params } = parseHash();
  const fn = routes[name] || routes.home;
  document.body.classList.remove("immersive");
  setActive(null);
  scrollTo(0, 0);
  const view = $("#view");
  view.innerHTML = "";
  const r = fn(view, arg, params);
  cleanup = typeof r === "function" ? r : null;
  onNav && onNav(routes[name] ? name : "home");
}

addEventListener("hashchange", render);
