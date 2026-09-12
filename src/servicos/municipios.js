/* Regras sobre a lista de municípios: ordenação, filtro, totais e ranking.
   São funções puras, sem React e sem rede, para que possam ser testadas
   isoladamente e reutilizadas em qualquer página. */

import { normalizar } from './formatar.js';

export const CRITERIOS = {
  populacao: { rotulo: 'População (maior primeiro)', chave: 'populacao', ordem: -1 },
  nome: { rotulo: 'Nome (A a Z)', chave: 'nome', ordem: 1 },
  area: { rotulo: 'Área (maior primeiro)', chave: 'area', ordem: -1 },
  densidade: { rotulo: 'Densidade (maior primeiro)', chave: 'densidade', ordem: -1 },
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

export function filtrar(lista, { termo = '', mesorregiao = '' } = {}) {
  const t = normalizar(termo);
  return lista.filter((m) => {
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

/* Posição no ranking estadual por população (1 = mais populoso). */
export function posicaoPorPopulacao(lista, id) {
  const ordenada = ordenar(lista, 'populacao');
  const i = ordenada.findIndex((m) => m.id === id);
  return i === -1 ? null : i + 1;
}

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
