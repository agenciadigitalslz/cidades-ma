/* Gera a imagem de prévia social (Open Graph, 1200 por 630) em public/og.jpg.
   É a imagem que WhatsApp, Telegram e redes mostram ao lado do link.
   Desenhada em HTML com a identidade do projeto e capturada pelo Chrome
   headless, sem dependência de biblioteca de imagem.

     node scripts/imagem-social.mjs */

import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const RAIZ = resolve(import.meta.dirname, '..');
const SAIDA = join(RAIZ, 'public', 'og.jpg');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORTA = 9381;

const HTML = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<style>
  html,body{margin:0;width:1200px;height:630px;overflow:hidden}
  body{background:#fd9d24;font-family:"Segoe UI",system-ui,sans-serif;color:#3d2600;position:relative}
  .marca{position:absolute;left:72px;top:64px;display:flex;align-items:center;gap:16px;font-family:Georgia,serif;font-weight:600;font-size:34px;color:#1c1c1a}
  .marca span{background:#1c1c1a;width:52px;height:52px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center}
  .marca svg{width:32px;height:32px;fill:none;stroke:#fd9d24;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
  .rotulo{position:absolute;left:72px;top:170px;font-size:20px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
  h1{position:absolute;left:72px;top:206px;margin:0;width:640px;font-family:Georgia,serif;font-weight:600;font-size:86px;line-height:1.02;letter-spacing:-.025em;color:#1c1c1a}
  .chamada{position:absolute;left:72px;top:418px;width:620px;font-size:28px;line-height:1.35}
  .fonte{position:absolute;left:72px;bottom:54px;font-size:20px;color:#3d2600}
  .painel{position:absolute;right:72px;top:150px;width:360px;background:rgba(255,255,255,.24);border:1.5px solid rgba(28,28,26,.18);padding:30px 32px;display:flex;flex-direction:column;gap:22px}
  .painel div{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid rgba(28,28,26,.16);padding-bottom:14px}
  .painel div:last-child{border:0;padding-bottom:0}
  .painel dt{font-size:15px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
  .painel dd{margin:0;font-family:Georgia,serif;font-weight:600;font-size:38px;letter-spacing:-.015em;color:#1c1c1a;font-variant-numeric:tabular-nums}
  .painel dd small{font-family:"Segoe UI",system-ui,sans-serif;font-weight:400;font-size:16px;color:#3d2600}
  .silhueta{position:absolute;right:-30px;bottom:-40px;width:560px;fill:none;stroke:#1c1c1a;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;opacity:.1}
</style></head><body>
<svg class="silhueta" viewBox="0 0 320 200"><path d="M8 192h304"/><path d="M28 192V96l44-26v122"/><path d="M72 192V60l40 22v110"/><path d="M112 192v-78h52v78"/><path d="M164 192V38l46 26v128"/><path d="M210 192v-62h44v62"/><path d="M254 192V78l40 22v92"/><path d="M44 112v14M44 140v14M56 112v14M56 140v14"/><path d="M86 84v14M86 112v14M86 140v14M98 84v14M98 112v14M98 140v14"/><path d="M128 132v12M144 132v12M128 158v12M144 158v12"/><path d="M178 62v14M178 90v14M178 118v14M194 62v14M194 90v14M194 118v14"/><path d="M224 148v14M240 148v14"/><path d="M268 102v14M268 130v14M282 102v14M282 130v14"/></svg>
<div class="marca"><span><svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V8l6-4v17"/><path d="M11 21V11h8v10"/><path d="M15 15h1M15 18h1"/></svg></span>Cidades MA</div>
<p class="rotulo">ODS 11 · Meta 11.3</p>
<h1>Sua cidade em números</h1>
<p class="chamada">Os 217 municípios do Maranhão em população, área e densidade, direto da API do IBGE.</p>
<p class="fonte">Censo Demográfico 2022 · UEMA / UEMAnet</p>
<dl class="painel">
  <div><dt>População</dt><dd>6.776.699 <small>hab.</small></dd></div>
  <div><dt>Área</dt><dd>329.651 <small>km²</small></dd></div>
  <div><dt>Municípios</dt><dd>217</dd></div>
</dl>
</body></html>`;

const arquivo = join(tmpdir(), 'cidades-ma-og.html');
writeFileSync(arquivo, HTML, 'utf8');

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
  '--window-size=1200,630', `--remote-debugging-port=${PORTA}`,
  '--user-data-dir=' + join(RAIZ, 'node_modules', '.chrome-og'),
], { stdio: 'ignore' });
process.on('exit', () => { try { chrome.kill(); } catch { /* fechado */ } });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function alvo() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORTA}/json`, { signal: AbortSignal.timeout(2000) });
      const a = (await r.json()).find((x) => x.type === 'page');
      if (a?.webSocketDebuggerUrl) return a;
    } catch { /* subindo */ }
    await dormir(500);
  }
  throw new Error('Chrome não respondeu');
}

const a = await alvo();
const ws = new WebSocket(a.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
const pend = new Map(); let seq = 0;
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
const enviar = (method, params = {}) => new Promise((res) => { const id = ++seq; pend.set(id, res); ws.send(JSON.stringify({ id, method, params })); });

await enviar('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await enviar('Page.navigate', { url: pathToFileURL(arquivo).href });
await dormir(800);
const { result } = await enviar('Page.captureScreenshot', { format: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
mkdirSync(join(RAIZ, 'public'), { recursive: true });
writeFileSync(SAIDA, Buffer.from(result.data, 'base64'));
console.log('gerado public/og.jpg,', Math.round(Buffer.from(result.data, 'base64').length / 1024), 'KB');
ws.close(); chrome.kill(); process.exit(0);
