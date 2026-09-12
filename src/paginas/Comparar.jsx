import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMunicipios } from '../contexto/dadosContexto.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { nInt, nDec, nSinal, ordinal } from '../servicos/formatar.js';
import { ordenar, porId, posicaoPorPopulacao } from '../servicos/municipios.js';
import Destaque from '../componentes/Destaque.jsx';
import GraficoBarras from '../componentes/GraficoBarras.jsx';
import TabelaComparativa from '../componentes/TabelaComparativa.jsx';
import BotaoCompartilhar from '../componentes/BotaoCompartilhar.jsx';
import EstadoDados from '../componentes/EstadoDados.jsx';

const INDICADORES = [
  { chave: 'populacao', rotulo: 'População residente', unidade: 'habitantes' },
  { chave: 'area', rotulo: 'Área territorial', unidade: 'km²', casas: 1 },
  { chave: 'densidade', rotulo: 'Densidade demográfica', unidade: 'hab/km²', casas: 2 },
];

/* Comparação livre entre dois municípios quaisquer. O par vive na URL
   (?a=&b=), então "Bacabal contra Codó" é um link que pode ser enviado. */
export default function Comparar() {
  useTitulo('Comparar municípios');
  const { municipios, status } = useMunicipios();
  const [params, setParams] = useSearchParams();
  const ordenados = useMemo(() => ordenar(municipios, 'populacao'), [municipios]);

  const aId = params.get('a') || ordenados[0]?.id || '';
  const bId = params.get('b') || ordenados[1]?.id || '';
  const a = porId(municipios, aId);
  const b = porId(municipios, bId);

  const escolher = (lado, id) => {
    const proximo = new URLSearchParams(params);
    proximo.set(lado, id);
    setParams(proximo, { replace: true });
  };
  const inverter = () => {
    const proximo = new URLSearchParams(params);
    proximo.set('a', bId);
    proximo.set('b', aId);
    setParams(proximo, { replace: true });
  };

  const titulo = a && b ? `${a.nome} e ${b.nome}` : 'Comparar municípios';

  return (
    <>
      <Destaque
        rotulo="Comparação livre"
        titulo={titulo}
        chamada="Escolha dois municípios quaisquer do Maranhão e veja população, área, densidade e crescimento lado a lado. O endereço desta página guarda o par escolhido."
        acoes={a && b && <BotaoCompartilhar titulo={`${a.nome} e ${b.nome} em números`} texto={`Comparação entre ${a.nome} e ${b.nome} com dados do Censo 2022.`} />}
      />

      <section className="secao">
        <div className="container">
          {status === 'carregando' && <EstadoDados className="mb-4" />}

          <form className="barra-busca mb-4" onSubmit={(e) => e.preventDefault()}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-5">
                <label htmlFor="municipio-a">Primeiro município</label>
                <select className="form-select" id="municipio-a" value={aId} onChange={(e) => escolher('a', e.target.value)}>
                  {ordenados.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-2 d-grid">
                <button type="button" className="btn btn-neutro" onClick={inverter} aria-label="Inverter a ordem dos municípios">
                  Inverter
                </button>
              </div>
              <div className="col-12 col-md-5">
                <label htmlFor="municipio-b">Segundo município</label>
                <select className="form-select" id="municipio-b" value={bId} onChange={(e) => escolher('b', e.target.value)}>
                  {ordenados.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>

          {a && b && a.id === b.id && (
            <p className="aviso-etapa">
              <strong>Os dois lados são o mesmo município.</strong> Escolha outro em um dos campos para comparar.
            </p>
          )}

          {a && b && a.id !== b.id && (
            <>
              <div className="row g-3 mb-4">
                {[a, b].map((m, i) => (
                  <div className="col-12 col-md-6" key={m.id}>
                    <dl className="card-indicador">
                      <dt>{i === 0 ? 'Primeiro' : 'Segundo'} · {ordinal(posicaoPorPopulacao(municipios, m.id))} em população</dt>
                      <dd>
                        <span className="numero">
                          <Link to={`/municipios/${m.id}`}>{m.nome}</Link>
                        </span>
                        <span className="unidade">{m.mesorregiao}</span>
                        <p className="texto-apoio mt-2 mb-0">
                          {nInt(m.populacao)} habitantes em {nDec(m.area)} km², {nDec(m.densidade, 2)} hab/km².
                          Crescimento de {nSinal(m.crescimento)}% ao ano entre 2010 e 2022.
                        </p>
                      </dd>
                    </dl>
                  </div>
                ))}
              </div>

              <GraficoBarras
                a={a}
                b={b}
                indicadores={INDICADORES}
                legenda="Cada indicador tem a própria escala: a barra maior de cada par é o valor mais alto entre os dois municípios."
              />
              <TabelaComparativa
                municipios={[a, b]}
                focoId={a.id}
                legenda="População, área, densidade e crescimento. Fonte: IBGE, Censos 2010 e 2022."
              />
            </>
          )}

          {status !== 'carregando' && <EstadoDados className="mt-4 mb-0" />}
        </div>
      </section>
    </>
  );
}
