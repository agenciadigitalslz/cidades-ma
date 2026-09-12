import { describe, it, expect } from 'vitest';
import { interpretarLocalidades, interpretarCenso, combinar, buscarMunicipios, URL_LOCALIDADES, URL_CENSO } from './ibge.js';

const localidades = [
  { id: 2111300, nome: 'São Luís', microrregiao: { nome: 'Aglomeração Urbana de São Luís', mesorregiao: { nome: 'Norte Maranhense' } } },
  { id: 2105302, nome: 'Imperatriz', microrregiao: { nome: 'Imperatriz', mesorregiao: { nome: 'Oeste Maranhense' } } },
];

const censo = [
  { id: '93', variavel: 'População residente', resultados: [{ series: [
    { localidade: { id: '2111300' }, serie: { 2022: '1037775' } },
    { localidade: { id: '2105302' }, serie: { 2022: '273110' } },
  ] }] },
  { id: '6318', variavel: 'Área', resultados: [{ series: [
    { localidade: { id: '2111300' }, serie: { 2022: '583.063' } },
    { localidade: { id: '2105302' }, serie: { 2022: '...' } },
  ] }] },
  { id: '614', variavel: 'Densidade', resultados: [{ series: [
    { localidade: { id: '2111300' }, serie: { 2022: '1779.87' } },
  ] }] },
];

describe('interpretarLocalidades', () => {
  it('extrai id como texto, nome, microrregião e mesorregião', () => {
    const r = interpretarLocalidades(localidades);
    expect(r[0]).toEqual({ id: '2111300', nome: 'São Luís', microrregiao: 'Aglomeração Urbana de São Luís', mesorregiao: 'Norte Maranhense' });
  });
  it('rejeita resposta que não é lista', () => {
    expect(() => interpretarLocalidades({})).toThrow();
  });
});

describe('interpretarCenso', () => {
  it('converte os valores em número e trata ausência como null', () => {
    const m = interpretarCenso(censo);
    expect(m.get('2111300')).toEqual({ populacao: 1037775, area: 583.063, densidade: 1779.87 });
    expect(m.get('2105302')).toEqual({ populacao: 273110, area: null });
  });
});

describe('combinar', () => {
  it('junta pelo código e ordena por população', () => {
    const r = combinar(interpretarLocalidades(localidades), interpretarCenso(censo));
    expect(r.map((m) => m.nome)).toEqual(['São Luís', 'Imperatriz']);
    expect(r[1].densidade).toBeNull();
  });
});

describe('buscarMunicipios', () => {
  it('chama as duas URLs e devolve a lista combinada', async () => {
    const chamadas = [];
    const fetchFn = async (url) => {
      chamadas.push(url);
      return { ok: true, json: async () => (url === URL_LOCALIDADES ? localidades : censo) };
    };
    const r = await buscarMunicipios({ fetchFn });
    expect(chamadas).toEqual(expect.arrayContaining([URL_LOCALIDADES, URL_CENSO]));
    expect(r).toHaveLength(2);
    expect(r[0].populacao).toBe(1037775);
  });
  it('propaga erro HTTP para quem chama decidir a reserva', async () => {
    const fetchFn = async () => ({ ok: false, status: 503, json: async () => ({}) });
    await expect(buscarMunicipios({ fetchFn })).rejects.toThrow('HTTP 503');
  });
});
