/* Consumo da API pública do IBGE com a Fetch API.

   Duas chamadas, feitas em paralelo:
   1. Localidades (v1): a relação dos 217 municípios do Maranhão, com
      microrregião e mesorregião.
   2. Agregados (v3), tabela 4714 do SIDRA, Censo Demográfico 2022: população
      residente (variável 93), área territorial (6318) e densidade demográfica
      (614), pedidas de uma vez para todos os municípios do estado (N6[N3[21]]).

   Nenhuma das duas exige chave de acesso e ambas respondem com CORS aberto.
   As funções de interpretação são puras e testadas; a de rede é fina. */

const BASE = 'https://servicodados.ibge.gov.br/api';
export const UF_MARANHAO = '21';

export const URL_LOCALIDADES = `${BASE}/v1/localidades/estados/${UF_MARANHAO}/municipios?orderBy=nome`;
export const URL_CENSO =
  `${BASE}/v3/agregados/4714/periodos/2022/variaveis/93%7C6318%7C614` +
  `?localidades=N6%5BN3%5B${UF_MARANHAO}%5D%5D`;

const VARIAVEIS = { 93: 'populacao', 6318: 'area', 614: 'densidade' };

/* Converte a resposta de Localidades em objetos simples. */
export function interpretarLocalidades(json) {
  if (!Array.isArray(json)) throw new Error('Localidades: resposta inesperada');
  return json.map((m) => ({
    id: String(m.id),
    nome: m.nome,
    microrregiao: m.microrregiao?.nome ?? null,
    mesorregiao: m.microrregiao?.mesorregiao?.nome ?? null,
  }));
}

/* Converte a resposta do SIDRA em um mapa id -> { populacao, area, densidade }.
   O SIDRA devolve os valores como texto e usa "-" ou "..." para ausência. */
export function interpretarCenso(json) {
  if (!Array.isArray(json)) throw new Error('SIDRA: resposta inesperada');
  const porId = new Map();
  for (const variavel of json) {
    const campo = VARIAVEIS[variavel.id];
    if (!campo) continue;
    for (const resultado of variavel.resultados ?? []) {
      for (const serie of resultado.series ?? []) {
        const id = String(serie.localidade?.id);
        const bruto = Object.values(serie.serie ?? {})[0];
        const numero = Number.parseFloat(bruto);
        const atual = porId.get(id) ?? {};
        atual[campo] = Number.isFinite(numero) ? numero : null;
        porId.set(id, atual);
      }
    }
  }
  return porId;
}

/* Junta as duas fontes pelo código do município e ordena por população. */
export function combinar(localidades, censo) {
  return localidades
    .map((m) => ({
      ...m,
      populacao: censo.get(m.id)?.populacao ?? null,
      area: censo.get(m.id)?.area ?? null,
      densidade: censo.get(m.id)?.densidade ?? null,
    }))
    .sort((a, b) => (b.populacao ?? 0) - (a.populacao ?? 0));
}

async function pegarJson(url, { fetchFn, signal }) {
  const resposta = await fetchFn(url, { signal, headers: { Accept: 'application/json' } });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status} ao consultar ${url}`);
  return resposta.json();
}

/* Busca e combina. O tempo limite existe porque a API do IBGE às vezes demora
   mais do que uma apresentação aguenta: passado o limite, quem chama decide
   usar a cópia local. */
export async function buscarMunicipios({ fetchFn = globalThis.fetch, tempoLimiteMs = 10000 } = {}) {
  const controle = new AbortController();
  const temporizador = setTimeout(() => controle.abort(), tempoLimiteMs);
  try {
    const [localidades, censo] = await Promise.all([
      pegarJson(URL_LOCALIDADES, { fetchFn, signal: controle.signal }),
      pegarJson(URL_CENSO, { fetchFn, signal: controle.signal }),
    ]);
    return combinar(interpretarLocalidades(localidades), interpretarCenso(censo));
  } finally {
    clearTimeout(temporizador);
  }
}
