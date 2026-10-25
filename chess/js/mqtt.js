/* Минимальный клиент MQTT 3.1.1 поверх WebSocket: подключение, подписка,
   публикация (QoS 0), пинг и переподключение с паузой. Для онлайна этого
   достаточно: надёжность доставки обеспечивает сеанс в online.js. */
const enc = new TextEncoder(), dec = new TextDecoder();
const KEEPALIVE = 30;   // с, сообщаем брокеру
const PING = 12000;     // мс, как часто пингуем
const DEAD = 35000;     // мс без ответа — соединение считаем мёртвым

const str = s => { const b = enc.encode(s); return [b.length >> 8, b.length & 255, ...b]; };
function packet(type, body) {
  const len = [];
  let n = body.length;
  do { let d = n % 128; n = Math.floor(n / 128); if (n) d |= 128; len.push(d); } while (n);
  return new Uint8Array([type, ...len, ...body]);
}

export class Mqtt {
  constructor(url, { clientId, onMessage, onState }) {
    this.url = url; this.clientId = clientId;
    this.onMessage = onMessage; this.onState = onState;
    this.subs = new Set();
    this.ws = null; this.ok = false; this.st = "off";
    this.pid = 0; this.backoff = 1000; this.lastRx = 0;
  }
  state(s) { if (this.st !== s) { this.st = s; this.onState && this.onState(this); } }

  start() { this.stopped = false; if (!this.ws) this.open(); }
  stop() {
    this.stopped = true;
    clearTimeout(this.retryT); clearInterval(this.pingT);
    const ws = this.ws;
    this.ws = null; this.ok = false;
    if (ws) { try { ws.send(new Uint8Array([0xe0, 0])); } catch {} try { ws.close(); } catch {} }
    this.state("off");
  }

  open() {
    clearTimeout(this.retryT);
    let ws;
    try { ws = new WebSocket(this.url, ["mqtt"]); } catch { this.retry(); return; }
    ws.binaryType = "arraybuffer";
    this.ws = ws; this.ok = false; this.buf = new Uint8Array(0);
    this.state("connecting");
    const cto = setTimeout(() => { if (this.ws === ws && !this.ok) this.drop(); }, 10000);
    ws.onopen = () => {
      // CONNECT: протокол MQTT 3.1.1, чистый сеанс, keepalive
      try { ws.send(packet(0x10, [...str("MQTT"), 4, 2, 0, KEEPALIVE, ...str(this.clientId)])); } catch {}
    };
    ws.onmessage = e => { if (this.ws === ws && e.data instanceof ArrayBuffer) this.feed(new Uint8Array(e.data)); };
    ws.onerror = ws.onclose = () => { clearTimeout(cto); if (this.ws === ws) this.drop(); };
  }
  /* соединение потеряно: закрываем и переподключаемся */
  drop() {
    const ws = this.ws;
    this.ws = null; this.ok = false;
    clearInterval(this.pingT);
    if (ws) { ws.onclose = ws.onerror = ws.onmessage = null; try { ws.close(); } catch {} }
    if (this.stopped) return;
    this.state("down");
    this.retry();
  }
  retry() {
    if (this.stopped) return;
    clearTimeout(this.retryT);
    this.retryT = setTimeout(() => this.open(), this.backoff);
    this.backoff = Math.min(this.backoff * 2, 15000);
  }
  /* страница снова на экране или вернулся интернет: проверяем связь сразу */
  kick() {
    if (this.stopped) return;
    if (!this.ws) { this.backoff = 1000; this.open(); return; }
    if (!this.ok) return;
    const t = Date.now();
    this.raw([0xc0, 0]);
    clearTimeout(this.probeT);
    this.probeT = setTimeout(() => { if (this.ok && this.lastRx < t) this.drop(); }, 5000);
  }

  raw(bytes) {
    if (!this.ws || this.ws.readyState !== 1) return false;
    try { this.ws.send(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)); return true; } catch { return false; }
  }

  /* входящий поток может резать и склеивать пакеты */
  feed(chunk) {
    const b = new Uint8Array(this.buf.length + chunk.length);
    b.set(this.buf); b.set(chunk, this.buf.length);
    let off = 0;
    while (b.length - off >= 2) {
      let len = 0, mul = 1, i = off + 1, done = false;
      while (i < b.length && i < off + 5) {
        const d = b[i++];
        len += (d & 127) * mul; mul *= 128;
        if (!(d & 128)) { done = true; break; }
      }
      if (!done) { if (i >= off + 5) { this.drop(); return; } break; }
      if (b.length < i + len) break;
      this.handle(b[off], b.subarray(i, i + len));
      if (!this.ws) return;
      off = i + len;
    }
    this.buf = b.slice(off);
  }

  handle(h, body) {
    this.lastRx = Date.now();
    const type = h >> 4;
    if (type === 2) {                       // CONNACK
      if (body[1] !== 0) { this.drop(); return; }
      this.ok = true; this.backoff = 1000;
      for (const t of this.subs) this.sendSub(t);
      clearInterval(this.pingT);
      this.pingT = setInterval(() => {
        if (Date.now() - this.lastRx > DEAD) this.drop();
        else this.raw([0xc0, 0]);
      }, PING);
      this.state("up");
    } else if (type === 3) {                // PUBLISH
      const qos = (h >> 1) & 3;
      const tl = (body[0] << 8) | body[1];
      const topic = dec.decode(body.subarray(2, 2 + tl));
      let p = 2 + tl;
      if (qos) {
        const id = [body[p], body[p + 1]];
        p += 2;
        if (qos === 1) this.raw([0x40, 2, ...id]);   // PUBACK
      }
      try { this.onMessage(topic, dec.decode(body.subarray(p))); } catch (e) { console.error(e); }
    }
    // SUBACK, UNSUBACK, PINGRESP — достаточно отметки времени
  }

  nextId() { this.pid = this.pid % 65535 + 1; return [this.pid >> 8, this.pid & 255]; }
  sendSub(topic) { this.raw(packet(0x82, [...this.nextId(), ...str(topic), 0])); }
  subscribe(topic) {
    if (this.subs.has(topic)) return;
    this.subs.add(topic);
    if (this.ok) this.sendSub(topic);
  }
  unsubscribe(topic) {
    if (!this.subs.delete(topic)) return;
    if (this.ok) this.raw(packet(0xa2, [...this.nextId(), ...str(topic)]));
  }
  publish(topic, text) {
    if (!this.ok) return false;
    return this.raw(packet(0x30, [...str(topic), ...enc.encode(text)]));
  }
}
