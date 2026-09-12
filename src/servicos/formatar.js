/* Formatação de números no padrão brasileiro. Centralizada para que a
   grade, os cartões, a tabela e o gráfico mostrem o mesmo valor do mesmo jeito. */

export const nInt = (n) =>
  n == null || Number.isNaN(n) ? '-' : Math.round(n).toLocaleString('pt-BR');

export const nDec = (n, casas = 1) =>
  n == null || Number.isNaN(n)
    ? '-'
    : n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/* Número com sinal explícito, para taxas de crescimento: "+0,18" ou "-0,27". */
export const nSinal = (n, casas = 2) =>
  n == null || Number.isNaN(n) ? '-' : `${n > 0 ? '+' : ''}${nDec(n, casas)}`;

/* Remove acentos e caixa: "São Luís" e "sao luis" precisam casar na busca. */
export const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/* Identificador legível para URLs externas, como o IBGE Cidades. */
export const slug = (nome) => normalizar(nome).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const ordinal = (n) => (n == null ? '-' : `${n}º`);
