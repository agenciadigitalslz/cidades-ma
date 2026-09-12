import { Link } from 'react-router-dom';
import { useMunicipios } from '../contexto/dadosContexto.js';
import { useFavoritos } from '../contexto/favoritosContexto.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { totais, ordenar, porId } from '../servicos/municipios.js';
import Destaque from '../componentes/Destaque.jsx';
import PainelResumo from '../componentes/PainelResumo.jsx';
import BlocoExplicativo from '../componentes/BlocoExplicativo.jsx';
import CardMunicipio from '../componentes/CardMunicipio.jsx';
import { GradeEsqueleto } from '../componentes/CardEsqueleto.jsx';
import MapaMaranhao from '../componentes/MapaMaranhao.jsx';
import Distribuicao from '../componentes/Distribuicao.jsx';
import EstadoDados from '../componentes/EstadoDados.jsx';
import { IconeBanco, IconeBusca, IconeCidade } from '../componentes/Icones.jsx';

export default function Inicio() {
  useTitulo('Início');
  const { municipios, origem, status } = useMunicipios();
  const { ids: favoritos, limpar } = useFavoritos();
  const carregando = status === 'carregando';
  const soma = totais(municipios);
  const ordenados = ordenar(municipios, 'populacao');
  const maiores = ordenados.slice(0, 8);
  const maiorPopulacao = ordenados[0]?.populacao ?? 0;
  const minhas = favoritos.map((id) => porId(municipios, id)).filter(Boolean);
  const fonte = origem === 'api' ? 'Censo Demográfico 2022, IBGE, via API' : 'Censo Demográfico 2022, IBGE';

  return (
    <>
      <Destaque
        rotulo="ODS 11 · Meta 11.3"
        titulo="Sua cidade em números"
        chamada={`Indicadores urbanos dos ${soma.quantidade || 217} municípios do Maranhão, em linguagem que todo mundo entende. Sem código de tabela, sem planilha, sem cadastro.`}
        acoes={
          <>
            <Link className="btn btn-contraste btn-lg px-4 me-2" to="/municipios">
              Explorar municípios
            </Link>
            <Link className="btn btn-neutro btn-lg px-4" to="/mapa">
              Ver o mapa
            </Link>
          </>
        }
        lateral={<PainelResumo totais={soma} fonte={fonte} />}
      />

      <section className="secao">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <BlocoExplicativo icone={IconeBanco} rotuloIcone="Banco de dados" titulo="O dado existe">
                O IBGE publica população, área, densidade e crescimento de cada um dos {soma.quantidade || 217}{' '}
                municípios maranhenses. É informação pública e gratuita.
              </BlocoExplicativo>
            </div>
            <div className="col-12 col-md-4">
              <BlocoExplicativo icone={IconeBusca} rotuloIcone="Lupa" titulo="Mas está escondido">
                Para chegar até ele é preciso saber o número do agregado, o código da variável e o
                identificador do município. Quem não é pesquisador desiste antes.
              </BlocoExplicativo>
            </div>
            <div className="col-12 col-md-4">
              <BlocoExplicativo icone={IconeCidade} rotuloIcone="Cidade" titulo="E isso trava a participação">
                A meta 11.3 do ODS 11 pede planejamento urbano participativo. Não há participação sem
                acesso ao dado que fundamenta a decisão.
              </BlocoExplicativo>
            </div>
          </div>
        </div>
      </section>

      {minhas.length > 0 && (
        <section className="secao secao-alt" aria-labelledby="minhas-cidades">
          <div className="container">
            <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-2 mb-3">
              <h2 id="minhas-cidades" className="mb-0">Minhas cidades</h2>
              <p className="texto-apoio mb-0">
                {minhas.length >= 2 && (
                  <>
                    <Link to={`/comparar?a=${minhas[0].id}&b=${minhas[1].id}`}>
                      Comparar {minhas[0].nome} e {minhas[1].nome}
                    </Link>
                    {' · '}
                  </>
                )}
                <button type="button" className="btn btn-link p-0 align-baseline" onClick={limpar}>
                  Limpar a lista
                </button>
              </p>
            </div>
            <p className="texto-apoio mb-4">Guardadas neste navegador. Marque a estrela em qualquer município para incluir aqui.</p>
            <div className="row g-3">
              {minhas.map((m) => (
                <div className="col-6 col-md-4 col-lg-3" key={m.id}>
                  <CardMunicipio municipio={m} maiorPopulacao={maiorPopulacao} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="secao">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-12 col-lg-5">
              <h2>O estado no mapa</h2>
              <p>
                Cada município pintado pela densidade demográfica, em cinco faixas. A ilha de São
                Luís e o entorno de Imperatriz concentram gente; o sul e o leste são vastos e vazios.
              </p>
              <p>
                <Link className="btn btn-ods px-4" to="/mapa">Explorar o mapa por indicador</Link>
              </p>
            </div>
            <div className="col-12 col-lg-7">
              {carregando ? <EstadoDados /> : <MapaMaranhao municipios={municipios} indicador="densidade" compacto />}
            </div>
          </div>
        </div>
      </section>

      <section className="secao secao-alt">
        <div className="container">
          <h2>Como o Maranhão se distribui</h2>
          <p className="texto-apoio mb-4">Contagem de municípios por tamanho e por mesorregião, calculada dos dados carregados.</p>
          {carregando ? <EstadoDados /> : <Distribuicao municipios={municipios} />}
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <h2>Os oito municípios mais populosos</h2>
          <p className="texto-apoio mb-4">
            A lista completa, com busca e filtro, está em <Link to="/municipios">Municípios</Link>.
          </p>
          {carregando ? (
            <GradeEsqueleto quantidade={8} />
          ) : (
            <div className="row g-3">
              {maiores.map((m, i) => (
                <div className="col-6 col-md-4 col-lg-3" key={m.id}>
                  <CardMunicipio municipio={m} posicao={i + 1} maiorPopulacao={maiorPopulacao} />
                </div>
              ))}
            </div>
          )}
          <EstadoDados className="mt-4 mb-0" />
        </div>
      </section>
    </>
  );
}
