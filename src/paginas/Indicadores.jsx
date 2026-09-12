import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMunicipios } from '../contexto/dadosContexto.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { nInt, nDec, nSinal, ordinal, slug } from '../servicos/formatar.js';
import { ordenar, porId, posicao, totais } from '../servicos/municipios.js';
import Destaque from '../componentes/Destaque.jsx';
import CardIndicador from '../componentes/CardIndicador.jsx';
import TabelaComparativa from '../componentes/TabelaComparativa.jsx';
import GraficoBarras from '../componentes/GraficoBarras.jsx';
import MapaMaranhao from '../componentes/MapaMaranhao.jsx';
import BotaoFavorito from '../componentes/BotaoFavorito.jsx';
import BotaoCompartilhar from '../componentes/BotaoCompartilhar.jsx';
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

  const posPop = posicao(municipios, foco.id, 'populacao');
  const posDens = posicao(municipios, foco.id, 'densidade');
  const posArea = posicao(municipios, foco.id, 'area');
  const posCresc = posicao(municipios, foco.id, 'crescimento');
  const vizinhos = municipios.filter((m) => m.microrregiao === foco.microrregiao && m.id !== foco.id);

  return (
    <>
      <Destaque
        id={slug(foco.nome)}
        rotulo={`${ordinal(posPop)} em população · ${foco.mesorregiao}`}
        titulo={foco.nome}
        chamada={`Indicadores urbanos segundo o Censo Demográfico de 2022. Microrregião ${foco.microrregiao}.`}
        acoes={
          <span className="acoes-topo">
            <BotaoFavorito municipio={foco} comTexto className="btn btn-contraste px-4" />
            <BotaoCompartilhar titulo={`${foco.nome} em números`} texto={`${foco.nome}: ${nInt(foco.populacao)} habitantes, ${nDec(foco.densidade, 2)} hab/km². Censo 2022.`} />
            <a
              className="btn btn-neutro px-4"
              href={`https://cidades.ibge.gov.br/brasil/ma/${slug(foco.nome)}/panorama`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver no IBGE Cidades <span className="visually-hidden">(abre em nova aba)</span>
            </a>
          </span>
        }
      />

      <section className="secao">
        <div className="container">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-3">
              <CardIndicador
                rotulo="População residente"
                valor={nInt(foco.populacao)}
                unidade="habitantes"
                apoio={`${nDec((foco.populacao / soma.populacao) * 100, 2)}% da população do estado.`}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <CardIndicador
                rotulo="Área territorial"
                valor={nDec(foco.area)}
                unidade="km²"
                apoio={`${nDec((foco.area / soma.area) * 100, 2)}% do território, ${ordinal(posArea)} maior área.`}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <CardIndicador
                rotulo="Densidade demográfica"
                valor={nDec(foco.densidade, 2)}
                unidade="hab/km²"
                apoio={posDens === 1 ? 'A maior entre os municípios do estado.' : `${ordinal(posDens)} maior densidade do estado.`}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <CardIndicador
                rotulo="Crescimento 2010 a 2022"
                valor={`${nSinal(foco.crescimento)}%`}
                unidade="ao ano"
                apoio={
                  foco.variacao == null
                    ? 'Sem dado de variação.'
                    : `${foco.variacao >= 0 ? 'Ganhou' : 'Perdeu'} ${nInt(Math.abs(foco.variacao))} habitantes desde 2010, ${ordinal(posCresc)} maior crescimento.`
                }
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
                legenda="População, área, densidade e crescimento. Fonte: IBGE, Censos 2010 e 2022."
              />
            </>
          )}
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-12 col-lg-5">
              <h2>Onde fica e quem está por perto</h2>
              <p>
                {foco.nome} em destaque no mapa, pintado por densidade. Na microrregião{' '}
                {foco.microrregiao} estão outros {vizinhos.length} municípios:
              </p>
              <ul className="lista-vizinhos">
                {ordenar(vizinhos, 'populacao').map((v) => (
                  <li key={v.id}>
                    <Link to={`/municipios/${v.id}`}>{v.nome}</Link>
                    <span className="texto-apoio"> · {nInt(v.populacao)} hab.</span>
                    {' · '}
                    <Link to={`/comparar?a=${foco.id}&b=${v.id}`} className="texto-apoio">comparar</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-12 col-lg-7">
              <MapaMaranhao municipios={municipios} indicador="densidade" compacto focoId={foco.id} />
            </div>
          </div>
        </div>
      </section>

      <section className="secao secao-alt">
        <div className="container">
          <h2>Os dez mais populosos do estado</h2>
          <TabelaComparativa
            municipios={ordenados.slice(0, 10).some((m) => m.id === foco.id) ? ordenados.slice(0, 10) : [foco, ...ordenados.slice(0, 10)]}
            focoId={foco.id}
            legenda={`${foco.nome} em destaque. Fonte: IBGE, Censos 2010 e 2022.`}
          />
          <EstadoDados className="mt-4 mb-0" />
        </div>
      </section>
    </>
  );
}
