import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMunicipios } from '../contexto/dadosContexto.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { nInt, nDec, ordinal, slug } from '../servicos/formatar.js';
import { ordenar, porId, posicaoPorPopulacao, totais } from '../servicos/municipios.js';
import Destaque from '../componentes/Destaque.jsx';
import CardIndicador from '../componentes/CardIndicador.jsx';
import TabelaComparativa from '../componentes/TabelaComparativa.jsx';
import GraficoBarras from '../componentes/GraficoBarras.jsx';
import EstadoDados from '../componentes/EstadoDados.jsx';
import NaoEncontrada from './NaoEncontrada.jsx';

const INDICADORES = [
  { chave: 'populacao', rotulo: 'População residente', unidade: 'habitantes' },
  { chave: 'area', rotulo: 'Área territorial', unidade: 'km²', casas: 1 },
  { chave: 'densidade', rotulo: 'Densidade demográfica', unidade: 'hab/km²', casas: 2 },
];

export default function Indicadores() {
  const { id } = useParams();
  const { municipios, status } = useMunicipios();
  const foco = porId(municipios, id);
  useTitulo(foco ? `Indicadores de ${foco.nome}` : 'Indicadores');

  const ordenados = useMemo(() => ordenar(municipios, 'populacao'), [municipios]);
  const soma = useMemo(() => totais(municipios), [municipios]);
  const posicao = foco ? posicaoPorPopulacao(municipios, foco.id) : null;

  /* Comparação padrão: a capital, ou o segundo mais populoso quando o foco é a capital. */
  const padraoComparado = ordenados[0]?.id === foco?.id ? ordenados[1]?.id : ordenados[0]?.id;
  /* A escolha guarda para qual município foi feita: ao trocar de rota, a
     escolha antiga deixa de valer e a comparação volta ao padrão. */
  const [escolha, setEscolha] = useState(null);
  const comparadoId = escolha?.paraId === id ? escolha.comparadoId : '';
  const setComparadoId = (valor) => setEscolha({ paraId: id, comparadoId: valor });
  const comparado = porId(municipios, comparadoId || padraoComparado);

  if (status === 'carregando') {
    return (
      <section className="secao">
        <div className="container">
          <EstadoDados />
        </div>
      </section>
    );
  }

  if (!foco) return <NaoEncontrada mensagem={`Não existe município com o código ${id} no Maranhão.`} />;

  const densidadeRank = ordenar(municipios, 'densidade').findIndex((m) => m.id === foco.id) + 1;
  const areaRank = ordenar(municipios, 'area').findIndex((m) => m.id === foco.id) + 1;

  return (
    <>
      <Destaque
        id={slug(foco.nome)}
        rotulo={`${ordinal(posicao)} em população · ${foco.mesorregiao}`}
        titulo={foco.nome}
        chamada={`Indicadores urbanos segundo o Censo Demográfico de 2022. Microrregião ${foco.microrregiao}.`}
        acoes={
          <>
            <Link className="btn btn-contraste px-4 me-2" to="/municipios">
              Todos os municípios
            </Link>
            <a
              className="btn btn-neutro px-4"
              href={`https://cidades.ibge.gov.br/brasil/ma/${slug(foco.nome)}/panorama`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver no IBGE Cidades <span className="visually-hidden">(abre em nova aba)</span>
            </a>
          </>
        }
      />

      <section className="secao">
        <div className="container">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <CardIndicador
                rotulo="População residente"
                valor={nInt(foco.populacao)}
                unidade="habitantes"
                apoio={`${nDec((foco.populacao / soma.populacao) * 100, 2)}% da população do estado.`}
              />
            </div>
            <div className="col-12 col-md-4">
              <CardIndicador
                rotulo="Área territorial"
                valor={nDec(foco.area)}
                unidade="km²"
                apoio={`${nDec((foco.area / soma.area) * 100, 2)}% do território maranhense, ${ordinal(areaRank)} maior área.`}
              />
            </div>
            <div className="col-12 col-md-4">
              <CardIndicador
                rotulo="Densidade demográfica"
                valor={nDec(foco.densidade, 2)}
                unidade="hab/km²"
                apoio={densidadeRank === 1 ? 'A maior entre os municípios do estado.' : `${ordinal(densidadeRank)} maior densidade do estado.`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="secao secao-alt">
        <div className="container">
          <h2>Comparar com outro município</h2>
          <div className="row g-3 align-items-end mb-4">
            <div className="col-12 col-md-6 col-lg-4">
              <label htmlFor="comparar-com" className="form-label fw-semibold">
                Comparar {foco.nome} com
              </label>
              <select
                className="form-select"
                id="comparar-com"
                value={comparado?.id ?? ''}
                onChange={(e) => setComparadoId(e.target.value)}
              >
                {ordenados
                  .filter((m) => m.id !== foco.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p className="texto-apoio mb-0">
                Quer comparar outro par?{' '}
                <Link to={comparado ? `/comparar?a=${foco.id}&b=${comparado.id}` : '/comparar'}>
                  Abrir a comparação livre
                </Link>
                , com qualquer dois municípios e um link para compartilhar.
              </p>
            </div>
          </div>

          {comparado && (
            <>
              <GraficoBarras
                a={foco}
                b={comparado}
                indicadores={INDICADORES}
                legenda="Cada indicador tem a própria escala: a barra maior de cada par é o valor mais alto entre os dois municípios."
              />
              <TabelaComparativa
                municipios={[foco, comparado]}
                focoId={foco.id}
                legenda="População, área e densidade demográfica. Fonte: IBGE, Censo Demográfico 2022."
              />
            </>
          )}

          <h2 className="mt-5">Os dez mais populosos do estado</h2>
          <TabelaComparativa
            municipios={ordenados.slice(0, 10).some((m) => m.id === foco.id) ? ordenados.slice(0, 10) : [foco, ...ordenados.slice(0, 10)]}
            focoId={foco.id}
            legenda={`${foco.nome} em destaque. Fonte: IBGE, Censo Demográfico 2022.`}
          />

          <EstadoDados className="mt-4 mb-0" />
        </div>
      </section>
    </>
  );
}
