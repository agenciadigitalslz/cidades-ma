import { describe, it, expect } from 'vitest';
import { projetar, carregarMalha, URL_MALHA } from './malha.js';

const geojson = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { codarea: '1' }, geometry: { type: 'Polygon', coordinates: [[[-46, -2], [-44, -2], [-44, -4], [-46, -4], [-46, -2]]] } },
    { type: 'Feature', properties: { codarea: '2' }, geometry: { type: 'MultiPolygon', coordinates: [[[[-44, -4], [-42, -4], [-42, -6], [-44, -6], [-44, -4]]], [[[-43, -7], [-42, -7], [-42, -8], [-43, -8], [-43, -7]]]] } },
  ],
};

describe('projetar', () => {
  it('produz um caminho por feição, com o código do município', () => {
    const r = projetar(geojson, 600);
    expect(r.formas.map((f) => f.id)).toEqual(['1', '2']);
    expect(r.formas[0].d.startsWith('M')).toBe(true);
    expect(r.formas[0].d.endsWith('Z')).toBe(true);
    expect(r.formas[1].d.split('Z').filter(Boolean)).toHaveLength(2);
  });
  it('encaixa a caixa envolvente na largura pedida e inverte a latitude', () => {
    const r = projetar(geojson, 600);
    expect(r.viewBox).toBe(`0 0 600 ${r.altura}`);
    expect(r.altura).toBeGreaterThan(0);
    /* O ponto mais ao norte (lat -2) fica no topo (y = 0). */
    expect(r.formas[0].d).toContain(' 0.0');
  });
  it('rejeita malha vazia', () => {
    expect(() => projetar({ features: [] })).toThrow();
  });
});

describe('carregarMalha', () => {
  it('usa a API quando ela responde', async () => {
    const fetchFn = async (url) => ({ ok: url === URL_MALHA, json: async () => geojson });
    const r = await carregarMalha({ fetchFn });
    expect(r.origem).toBe('api');
    expect(r.geojson.features).toHaveLength(2);
  });
  it('cai para a cópia local quando a API falha', async () => {
    const fetchFn = async () => ({ ok: false, status: 503 });
    const r = await carregarMalha({ fetchFn });
    expect(r.origem).toBe('local');
    expect(r.geojson.features).toHaveLength(217);
  });
});
