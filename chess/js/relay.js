/* Общий канал связи для онлайна: публичные MQTT-брокеры, подключаемся ко всем
   сразу. Сообщение уходит через каждый доступный брокер, получатель берёт
   первую копию. Если какой-то сервер недоступен или заблокирован, работают
   остальные; прямое соединение между устройствами не нужно. */
import { Mqtt } from "./mqtt.js";

export const NS = "lc74chess/v2/";
const BROKERS = [
  ["EMQX", "wss://broker.emqx.io:8084/mqtt"],
  ["HiveMQ", "wss://broker.hivemq.com:8884/mqtt"],
  ["Mosquitto", "wss://test.mosquitto.org:8081/mqtt"],
  ["Eclipse", "wss://mqtt.eclipseprojects.io/mqtt"],
];
function brokers() {
  // для проверки на своих брокерах: localStorage["chess-brokers"] = '[["A","ws://localhost:9001"]]'
  try { const b = JSON.parse(localStorage.getItem("chess-brokers") || "null"); if (Array.isArray(b) && b.length) return b; } catch {}
  return BROKERS;
}

export function rid(n) {
  const a = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(a, x => "abcdefghijklmnopqrstuvwxyz0123456789"[x % 36]).join("");
}

/* фильтр MQTT: + — один уровень, # — всё остальное */
function match(filter, topic) {
  if (filter === topic) return true;
  const f = filter.split("/"), t = topic.split("/");
  for (let i = 0; i < f.length; i++) {
    if (f[i] === "#") return true;
    if (i >= t.length || (f[i] !== "+" && f[i] !== t[i])) return false;
  }
  return f.length === t.length;
}

class Relay {
  constructor() {
    this.me = rid(12);
    this.clients = [];
    this.handlers = new Map();   // фильтр → Set(обработчиков)
    this.seen = new Map();       // id уже полученных сообщений — копии с других брокеров пропускаем
    this.watchers = new Set();
    this.holds = new Set();
    this.wake = () => { if (document.visibilityState !== "hidden") this.kick(); };
  }

  start() {
    if (this.clients.length) return;
    this.clients = brokers().map(([name, url]) => {
      const c = new Mqtt(url, { clientId: "lc74" + rid(16), onMessage: (t, p) => this.onMsg(t, p), onState: () => this.emit() });
      c.name = name;
      for (const f of this.handlers.keys()) c.subscribe(f);
      c.start();
      return c;
    });
    document.addEventListener("visibilitychange", this.wake);
    addEventListener("online", this.wake);
    this.emit();
  }
  stop() {
    this.clients.forEach(c => c.stop());
    this.clients = [];
    document.removeEventListener("visibilitychange", this.wake);
    removeEventListener("online", this.wake);
    this.emit();
  }
  /* кто-то пользуется связью — держим подключение; без пользователей закрываем через 20 с */
  hold(key) { this.holds.add(key); clearTimeout(this.idleT); this.start(); }
  release(key) {
    this.holds.delete(key);
    if (!this.holds.size) { clearTimeout(this.idleT); this.idleT = setTimeout(() => { if (!this.holds.size) this.stop(); }, 20000); }
  }

  /* проверить, живы ли соединения (пинг с коротким ожиданием) */
  kick() { this.clients.forEach(c => c.kick()); }
  get up() { return this.clients.filter(c => c.ok).length; }
  status() { return this.clients.map(c => ({ name: c.name, st: c.st })); }
  watch(cb) { this.watchers.add(cb); return () => this.watchers.delete(cb); }
  emit() { for (const cb of this.watchers) try { cb(); } catch (e) { console.error(e); } }

  /* ждём хотя бы один брокер, а потом ещё немного — чтобы успели остальные */
  ready(timeout = 15000) {
    return new Promise((res, rej) => {
      const t0 = Date.now();
      const check = () => {
        const up = this.up, all = this.clients.length;
        if (up && (up === all || Date.now() - t0 > 2500 || !this.clients.some(c => c.st === "connecting"))) return res(up);
        if (Date.now() - t0 > timeout) return rej(new Error("Нет связи с серверами игры. Проверьте интернет; если включён VPN или блокировщик рекламы — попробуйте без него (или наоборот, с VPN)."));
        setTimeout(check, 200);
      };
      check();
    });
  }

  on(filter, cb) {
    let set = this.handlers.get(filter);
    if (!set) {
      set = new Set();
      this.handlers.set(filter, set);
      this.clients.forEach(c => c.subscribe(filter));
    }
    set.add(cb);
    return () => {
      set.delete(cb);
      if (!set.size && this.handlers.get(filter) === set) {
        this.handlers.delete(filter);
        this.clients.forEach(c => c.unsubscribe(filter));
      }
    };
  }

  pub(topic, msg) {
    const text = JSON.stringify({ ...msg, id: rid(10), from: this.me });
    let n = 0;
    for (const c of this.clients) if (c.publish(topic, text)) n++;
    return n;
  }

  onMsg(topic, payload) {
    let m;
    try { m = JSON.parse(payload); } catch { return; }
    if (!m || typeof m !== "object" || typeof m.id !== "string" || typeof m.from !== "string" || m.from === this.me) return;
    if (this.seen.has(m.id)) return;
    this.seen.set(m.id, 1);
    if (this.seen.size > 3000) { let k = 0; for (const id of this.seen.keys()) { this.seen.delete(id); if (++k >= 1000) break; } }
    for (const [f, set] of this.handlers) if (match(f, topic)) for (const cb of [...set]) try { cb(m, topic); } catch (e) { console.error(e); }
  }
}

export const relay = new Relay();
