/* Regras sobre a lista de municípios: ordenação, filtro, totais, ranking,
   faixas e distribuição. São funções puras, sem React e sem rede, para que
   possam ser testadas isoladamente e reutilizadas em qualquer página. */

import { normalizar } from './formatar.js';

export const CRITERIOS = {
  populacao: { rotulo: 'População (maior primeiro)', chave: 'populacao', ordem: -1 },
  nome: { rotulo: 'Nome (A a Z)', chave: 'nome', ordem: 1 },
  area: { rotulo: 'Área (maior primeiro)', chave: 'area', ordem: -1 },
  densidade: { rotulo: 'Densidade (maior primeiro)', chave: 'densidade', ordem: -1 },
  crescimento: { rotulo: 'Crescimento 2010 a 2022 (maior primeiro)', chave: 'crescimento', ordem: -1 },
  perda: { rotulo: 'Perda de população (maior primeiro)', chave: 'crescimento', ordem: 1 },
};

/* Indicadores que o mapa e os gráficos sabem pintar. */
export const INDICADORES_MAPA = {
  populacao: { rotulo: 'População residente', unidade: 'habitantes', casas: 0 },
  densidade: { rotulo: 'Densidade demográfica', unidade: 'hab/km²', casas: 2 },
  area: { rotulo: 'Área territorial', unidade: 'km²', casas: 1 },
  crescimento: { rotulo: 'Crescimento anual 2010 a 2022', unidade: '% ao ano', casas: 2 },
};

export function ordenar(lista, criterio = 'populacao') {
  const { chave, ordem } = CRITERIOS[criterio] ?? CRITERIOS.populacao;
  const copia = [...lista];
  copia.sort((a, b) => {
    if (chave === 'nome') return a.nome.localeCompare(b.nome, 'pt-BR') * ordem;
    return ((a[chave] ?? 0) - (b[chave] ?? 0)) * ordem;
  });
  return copia;
}

export function filtrar(lista, { termo = '', mesorregiao = '', ids = null } = {}) {
  const t = normalizar(termo);
  return lista.filter((m) => {
    if (ids && !ids.includes(m.id)) return false;
    if (mesorregiao && m.mesorregiao !== mesorregiao) return false;
    if (t && !normalizar(m.nome).includes(t)) return false;
    return true;
  });
}

export function mesorregioes(lista) {
  return [...new Set(lista.map((m) => m.mesorregiao).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  );
}

export function totais(lista) {
  return {
    quantidade: lista.length,
    populacao: lista.reduce((s, m) => s + (m.populacao ?? 0), 0),
    area: lista.reduce((s, m) => s + (m.area ?? 0), 0),
  };
}

/* Posição no ranking estadual por um critério (1 = primeiro). */
export function posicao(lista, id, criterio = 'populacao') {
  const i = ordenar(lista, criterio).findIndex((m) => m.id === id);
  return i === -1 ? null : i + 1;
}

export const posicaoPorPopulacao = (lista, id) => posicao(lista, id, 'populacao');

/* Barra proporcional ao maior município, em escala de raiz quadrada:
   São Luís tem 20 vezes a população da mediana e, em escala linear,
   quase todas as barras ficariam invisíveis. */
export function proporcaoBarra(valor, maior) {
  if (!maior || !valor) return 2;
  return Math.max(2, Math.round(Math.sqrt(valor / maior) * 100));
}

export function porId(lista, id) {
  return lista.find((m) => m.id === String(id)) ?? null;
}

/* Cortes por quantis: devolve n-1 limites que dividem os valores em n
   faixas com quantidade parecida de municípios. Serve para colorir o mapa
   sem que São Luís esmague a escala. */
export function quantis(valores, n = 5) {
  const v = valores.filter((x) => x != null && Number.isFinite(x)).sort((a, b) => a - b);
  if (v.length === 0) return [];
  const cortes = [];
  for (let i = 1; i < n; i++) {
    const pos = (i / n) * (v.length - 1);
    const base = Math.floor(pos);
    const resto = pos - base;
    cortes.push(v[base] + (v[Math.min(base + 1, v.length - 1)] - v[base]) * resto);
  }
  return cortes;
}

/* Índice da faixa (0 a n-1) de um valor dados os cortes. */
export function faixaDe(valor, cortes) {
  if (valor == null || !Number.isFinite(valor)) return null;
  let i = 0;
  while (i < cortes.length && valor > cortes[i]) i++;
  return i;
}

const CLASSES_POPULACAO = [
  { rotulo: 'até 10 mil', max: 10000 },
  { rotulo: '10 a 20 mil', max: 20000 },
  { rotulo: '20 a 50 mil', max: 50000 },
  { rotulo: '50 a 100 mil', max: 100000 },
  { rotulo: 'mais de 100 mil', max: Infinity },
];

/* Distribuição dos municípios por classe de população e por mesorregião. */
export function distribuicao(lista) {
  const porClasse = CLASSES_POPULACAO.map((c) => ({ rotulo: c.rotulo, quantidade: 0, populacao: 0 }));
  for (const m of lista) {
    const i = CLASSES_POPULACAO.findIndex((c) => (m.populacao ?? 0) < c.max);
    porClasse[i].quantidade += 1;
    porClasse[i].populacao += m.populacao ?? 0;
  }
  const porRegiao = new Map();
  for (const m of lista) {
    const nome = m.mesorregiao ?? 'Sem mesorregião';
    const r = porRegiao.get(nome) ?? { nome, quantidade: 0, populacao: 0 };
    r.quantidade += 1;
    r.populacao += m.populacao ?? 0;
    porRegiao.set(nome, r);
  }
  return {
    classes: porClasse,
    mesorregioes: [...porRegiao.values()].sort((a, b) => b.populacao - a.populacao),
  };
}
