import { describe, it, expect } from 'vitest';
import {
  filtrar, ordenar, mesorregioes, totais, posicao, posicaoPorPopulacao, proporcaoBarra, porId,
  quantis, faixaDe, distribuicao,
} from './municipios.js';
import { nInt, nDec, nSinal, normalizar, slug, ordinal } from './formatar.js';

const lista = [
  { id: '1', nome: 'São Luís', mesorregiao: 'Norte Maranhense', populacao: 1037775, area: 583.063, densidade: 1779.87, crescimento: 0.18 },
  { id: '2', nome: 'Imperatriz', mesorregiao: 'Oeste Maranhense', populacao: 273110, area: 1369.039, densidade: 199.49, crescimento: 0.9 },
  { id: '3', nome: 'Açailândia', mesorregiao: 'Oeste Maranhense', populacao: 106550, area: 5805.2, densidade: 18.35, crescimento: 0.15 },
  { id: '4', nome: 'Satubinha', mesorregiao: 'Centro Maranhense', populacao: 9500, area: 400, densidade: 23.7, crescimento: -2.56 },
];

describe('formatar', () => {
  it('usa separador brasileiro', () => {
    expect(nInt(1037775)).toBe('1.037.775');
    expect(nDec(583.063)).toBe('583,1');
    expect(nDec(1779.87, 2)).toBe('1.779,87');
    expect(nInt(null)).toBe('-');
    expect(ordinal(3)).toBe('3º');
  });
  it('mostra o sinal das taxas', () => {
    expect(nSinal(0.18)).toBe('+0,18');
    expect(nSinal(-2.56)).toBe('-2,56');
    expect(nSinal(0)).toBe('0,00');
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
  it('filtra por mesorregião, por lista de ids e combina com o termo', () => {
    expect(filtrar(lista, { mesorregiao: 'Oeste Maranhense' })).toHaveLength(2);
    expect(filtrar(lista, { mesorregiao: 'Oeste Maranhense', termo: 'imp' })).toHaveLength(1);
    expect(filtrar(lista, { ids: ['1', '4'] }).map((m) => m.id)).toEqual(['1', '4']);
  });
});

describe('ordenar', () => {
  it('por população, nome, área, densidade, crescimento e perda', () => {
    expect(ordenar(lista, 'populacao')[0].nome).toBe('São Luís');
    expect(ordenar(lista, 'nome')[0].nome).toBe('Açailândia');
    expect(ordenar(lista, 'area')[0].nome).toBe('Açailândia');
    expect(ordenar(lista, 'densidade')[3].nome).toBe('Açailândia');
    expect(ordenar(lista, 'crescimento')[0].nome).toBe('Imperatriz');
    expect(ordenar(lista, 'perda')[0].nome).toBe('Satubinha');
  });
  it('não altera a lista original', () => {
    const copia = [...lista];
    ordenar(lista, 'nome');
    expect(lista).toEqual(copia);
  });
});

describe('apoio', () => {
  it('lista mesorregiões únicas em ordem', () => {
    expect(mesorregioes(lista)).toEqual(['Centro Maranhense', 'Norte Maranhense', 'Oeste Maranhense']);
  });
  it('soma totais', () => {
    expect(totais(lista)).toEqual({ quantidade: 4, populacao: 1426935, area: 8157.302 });
  });
  it('posição no ranking por critério e barra', () => {
    expect(posicaoPorPopulacao(lista, '3')).toBe(3);
    expect(posicao(lista, '4', 'crescimento')).toBe(4);
    expect(proporcaoBarra(1037775, 1037775)).toBe(100);
    expect(proporcaoBarra(0, 1037775)).toBe(2);
    expect(porId(lista, 2).nome).toBe('Imperatriz');
  });
});

describe('quantis e faixas', () => {
  it('divide os valores em faixas de tamanho parecido', () => {
    const cortes = quantis([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
    expect(cortes).toHaveLength(4);
    expect(faixaDe(1, cortes)).toBe(0);
    expect(faixaDe(10, cortes)).toBe(4);
    expect(faixaDe(null, cortes)).toBeNull();
  });
  it('ignora valores ausentes', () => {
    expect(quantis([null, 5, undefined, 1], 2)).toEqual([3]);
    expect(quantis([], 5)).toEqual([]);
  });
});

describe('distribuicao', () => {
  it('conta por classe de população e por mesorregião', () => {
    const d = distribuicao(lista);
    expect(d.classes.map((c) => c.quantidade)).toEqual([1, 0, 0, 0, 3]);
    expect(d.classes[4].populacao).toBe(1037775 + 273110 + 106550);
    expect(d.mesorregioes[0]).toEqual({ nome: 'Norte Maranhense', quantidade: 1, populacao: 1037775 });
    expect(d.mesorregioes.map((r) => r.nome)).toEqual(['Norte Maranhense', 'Oeste Maranhense', 'Centro Maranhense']);
  });
});
