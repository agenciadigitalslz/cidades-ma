/* Malha geográfica dos municípios do Maranhão, da API de malhas do IBGE,
   em GeoJSON. A projeção para o SVG é uma função pura: converte longitude e
   latitude em coordenadas de tela, ajustando a largura pela latitude média
   (projeção equirretangular), o que basta para um mapa estadual. */

const BASE = 'https://servicodados.ibge.gov.br/api';

export const URL_MALHA =
  `${BASE}/v3/malhas/estados/21?formato=application/vnd.geo+json&intrarregiao=municipio&qualidade=minima`;

function aneis(geometria) {
  if (geometria.type === 'Polygon') return geometria.coordinates;
  if (geometria.type === 'MultiPolygon') return geometria.coordinates.flat();
  return [];
}

/* Devolve o viewBox e, para cada município, o caminho SVG e o centro. */
export function projetar(geojson, largura = 600) {
  const feicoes = geojson?.features ?? [];
  if (feicoes.length === 0) throw new Error('Malha: nenhuma feição');

  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const f of feicoes) {
    for (const anel of aneis(f.geometry)) {
      for (const [lon, lat] of anel) {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }

  const kx = Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180));
  const escala = largura / Math.max((maxLon - minLon) * kx, maxLat - minLat);
  const altura = Math.ceil((maxLat - minLat) * escala);
  const px = (lon) => ((lon - minLon) * kx * escala).toFixed(1);
  const py = (lat) => ((maxLat - lat) * escala).toFixed(1);

  const formas = feicoes.map((f) => {
    const partes = aneis(f.geometry);
    const d = partes
      .map((anel) => 'M' + anel.map(([lon, lat]) => `${px(lon)} ${py(lat)}`).join('L') + 'Z')
      .join('');
    const primeiro = partes[0] ?? [];
    const cx = primeiro.reduce((s, [lon]) => s + Number(px(lon)), 0) / (primeiro.length || 1);
    const cy = primeiro.reduce((s, [, lat]) => s + Number(py(lat)), 0) / (primeiro.length || 1);
    return { id: String(f.properties?.codarea ?? ''), d, centro: [cx, cy] };
  });

  return { viewBox: `0 0 ${largura} ${altura}`, largura, altura, formas };
}

/* Busca a malha na API; se falhar, usa a cópia local (carregada só aqui,
   para não pesar o pacote principal). Devolve também a origem. */
export async function carregarMalha({ fetchFn = globalThis.fetch, tempoLimiteMs = 10000 } = {}) {
  const controle = new AbortController();
  const temporizador = setTimeout(() => controle.abort(), tempoLimiteMs);
  try {
    const resposta = await fetchFn(URL_MALHA, { signal: controle.signal });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return { geojson: await resposta.json(), origem: 'api' };
  } catch {
    const { default: local } = await import('../dados/malha_ma.json');
    return { geojson: local, origem: 'local' };
  } finally {
    clearTimeout(temporizador);
  }
}
