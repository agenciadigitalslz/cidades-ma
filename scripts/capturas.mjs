/* Prova visual da aplicação construída, sem servidor de desenvolvimento.
   Serve a pasta dist/ com fallback de SPA, abre o Chrome headless por CDP e
   captura as páginas em desktop (1440) e celular (360), nos temas claro e
   escuro, com a API do IBGE ao vivo. Rodar depois de `npm run build`:

     node scripts/capturas.mjs [pasta-de-saida]

   Saída padrão: capturas/ na raiz do projeto. */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const RAIZ = resolve(import.meta.dirname, '..');
const DIST = join(RAIZ, 'dist');
const SAIDA = resolve(process.argv[2] ?? join(RAIZ, 'capturas'));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORTA_HTTP = 4173;
const PORTA_CDP = 9379;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/ não existe. Rode npm run build antes.');
  process.exit(1);
}
mkdirSync(SAIDA, { recursive: true });

/* Servidor estático mínimo com a mesma regra do _redirects do Netlify. */
const servidor = createServer((req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let arquivo = join(DIST, caminho);
  if (!existsSync(arquivo) || statSync(arquivo).isDirectory()) arquivo = join(DIST, 'index.html');
  res.writeHead(200, { 'Content-Type': TIPOS[extname(arquivo)] ?? 'application/octet-stream' });
  res.end(readFileSync(arquivo));
});
await new Promise((r) => servidor.listen(PORTA_HTTP, '127.0.0.1', r));

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
  '--force-device-scale-factor=2',
  `--remote-debugging-port=${PORTA_CDP}`,
  '--user-data-dir=' + join(RAIZ, 'node_modules', '.chrome-capturas'),
], { stdio: 'ignore' });
const encerrar = () => { try { chrome.kill(); } catch { /* já fechado */ } servidor.close(); };
process.on('exit', encerrar);

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function alvoPagina() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORTA_CDP}/json`, { signal: AbortSignal.timeout(2000) });
      const a = (await r.json()).find((x) => x.type === 'page');
      if (a?.webSocketDebuggerUrl) return a;
    } catch { /* ainda subindo */ }
    await dormir(500);
  }
  throw new Error('Chrome não abriu a porta de depuração');
}

function conectar(url) {
  const ws = new WebSocket(url);
  const pendentes = new Map();
  let seq = 0;
  const pronto = new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pendentes.has(m.id)) {
      const { resolve: ok, reject } = pendentes.get(m.id);
      pendentes.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : ok(m.result);
    }
  };
  const enviar = (metodo, params = {}) => new Promise((ok, reject) => {
    const id = ++seq;
    pendentes.set(id, { resolve: ok, reject });
    ws.send(JSON.stringify({ id, method: metodo, params }));
  });
  return { pronto, enviar, fechar: () => ws.close() };
}

const avaliar = (cli, expressao, esperar = false) =>
  cli.enviar('Runtime.evaluate', { expression: expressao, awaitPromise: esperar, returnByValue: true }).then((r) => r.result?.value);

/* Espera o React montar e o contexto sair de "carregando" (texto de status na tela). */
async function esperarDados(cli) {
  for (let i = 0; i < 80; i++) {
    const pronto = await avaliar(cli, `document.readyState === 'complete' && !document.body.innerText.includes('Consultando a API')`);
    if (pronto) return;
    await dormir(250);
  }
}

const CENAS = [
  { nome: '01-inicio-desktop', rota: '/', largura: 1440, altura: 900 },
  { nome: '02-municipios-desktop', rota: '/municipios', largura: 1440, altura: 900 },
  { nome: '03-busca-filtro-desktop', rota: '/municipios?q=sao&regiao=Norte%20Maranhense&ordem=densidade', largura: 1440, altura: 900 },
  { nome: '04-indicadores-sao-luis-desktop', rota: '/municipios/2111300', largura: 1440, altura: 900 },
  { nome: '05-indicadores-imperatriz-escuro', rota: '/municipios/2105302', largura: 1440, altura: 900, tema: 'escuro' },
  { nome: '06-sobre-desktop', rota: '/sobre', largura: 1440, altura: 900 },
  { nome: '07-inicio-360', rota: '/', largura: 360, altura: 780, movel: true },
  { nome: '08-municipios-360', rota: '/municipios?q=imp', largura: 360, altura: 780, movel: true },
  { nome: '09-indicadores-360-escuro', rota: '/municipios/2111300', largura: 360, altura: 780, movel: true, tema: 'escuro' },
  { nome: '10-menu-aberto-360', rota: '/sobre', largura: 360, altura: 780, movel: true, abrirMenu: true },
  { nome: '12-comparar-bacabal-codo', rota: '/comparar?a=2101202&b=2103307', largura: 1440, altura: 900 },
  { nome: '11-rota-inexistente', rota: '/nao-existe', largura: 1024, altura: 700 },
];

try {
  const alvo = await alvoPagina();
  const cli = conectar(alvo.webSocketDebuggerUrl);
  await cli.pronto;
  await cli.enviar('Page.enable');
  await cli.enviar('Runtime.enable');

  for (const cena of CENAS) {
    await cli.enviar('Emulation.setDeviceMetricsOverride', {
      width: cena.largura, height: cena.altura, deviceScaleFactor: 2, mobile: !!cena.movel,
    });
    await cli.enviar('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: cena.tema === 'escuro' ? 'dark' : 'light' }],
    });
    /* Limpa a escolha manual de tema para a emulação valer. */
    await cli.enviar('Page.navigate', { url: `http://127.0.0.1:${PORTA_HTTP}${cena.rota}` });
    await dormir(300);
    await avaliar(cli, `localStorage.removeItem('cidades-ma-tema'); document.documentElement.removeAttribute('data-tema');`);
    await esperarDados(cli);
    if (cena.abrirMenu) {
      await avaliar(cli, `document.querySelector('.navbar-toggler').click()`);
      await dormir(200);
    }
    await dormir(400);
    const { data } = await cli.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !cena.abrirMenu });
    writeFileSync(join(SAIDA, `${cena.nome}.png`), Buffer.from(data, 'base64'));
    const status = await avaliar(cli, `(document.querySelector('[role="status"]')?.innerText || '').slice(0, 90)`);
    console.log(`salvo ${cena.nome}.png | ${status}`);
  }
  cli.fechar();
  encerrar();
  process.exit(0);
} catch (e) {
  console.error('ERRO:', e.message);
  encerrar();
  process.exit(1);
}
