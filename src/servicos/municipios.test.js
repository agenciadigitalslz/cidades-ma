import { describe, it, expect } from 'vitest';
import { filtrar, ordenar, mesorregioes, totais, posicaoPorPopulacao, proporcaoBarra, porId } from './municipios.js';
import { nInt, nDec, normalizar, slug } from './formatar.js';

const lista = [
  { id: '1', nome: 'São Luís', mesorregiao: 'Norte Maranhense', populacao: 1037775, area: 583.063, densidade: 1779.87 },
  { id: '2', nome: 'Imperatriz', mesorregiao: 'Oeste Maranhense', populacao: 273110, area: 1369.039, densidade: 199.49 },
  { id: '3', nome: 'Açailândia', mesorregiao: 'Oeste Maranhense', populacao: 106550, area: 5805.2, densidade: 18.35 },
];

describe('formatar', () => {
  it('usa separador brasileiro', () => {
    expect(nInt(1037775)).toBe('1.037.775');
    expect(nDec(583.063)).toBe('583,1');
    expect(nDec(1779.87, 2)).toBe('1.779,87');
    expect(nInt(null)).toBe('-');
  });
  it('normaliza acentos e caixa para a busca', () => {
    expect(normalizar('São Luís')).toBe('sao luis');
    expect(slug('Açailândia')).toBe('acailandia');
  });
});

describe('filtrar', () => {
  it('casa sem acento e sem caixa', () => {
    expect(filtrar(lista, { termo: 'SAO' }).map((m) => m.nome)).toEqual(['São Luís']);
    expect(filtrar(lista, { termo: 'acai' }).map((m) => m.nome)).toEqual(['Açailândia']);
  });
  it('filtra por mesorregião e combina com o termo', () => {
    expect(filtrar(lista, { mesorregiao: 'Oeste Maranhense' })).toHaveLength(2);
    expect(filtrar(lista, { mesorregiao: 'Oeste Maranhense', termo: 'imp' })).toHaveLength(1);
  });
});

describe('ordenar', () => {
  it('por população, nome, área e densidade', () => {
    expect(ordenar(lista, 'populacao')[0].nome).toBe('São Luís');
    expect(ordenar(lista, 'nome')[0].nome).toBe('Açailândia');
    expect(ordenar(lista, 'area')[0].nome).toBe('Açailândia');
    expect(ordenar(lista, 'densidade')[2].nome).toBe('Açailândia');
  });
  it('não altera a lista original', () => {
    const copia = [...lista];
    ordenar(lista, 'nome');
    expect(lista).toEqual(copia);
  });
});

describe('apoio', () => {
  it('lista mesorregiões únicas em ordem', () => {
    expect(mesorregioes(lista)).toEqual(['Norte Maranhense', 'Oeste Maranhense']);
  });
  it('soma totais', () => {
    expect(totais(lista)).toEqual({ quantidade: 3, populacao: 1417435, area: 7757.302 });
  });
  it('posição no ranking e barra', () => {
    expect(posicaoPorPopulacao(lista, '3')).toBe(3);
    expect(proporcaoBarra(1037775, 1037775)).toBe(100);
    expect(proporcaoBarra(0, 1037775)).toBe(2);
    expect(porId(lista, 2).nome).toBe('Imperatriz');
  });
});
