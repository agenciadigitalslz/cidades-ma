import { useSearchParams } from 'react-router-dom';
import { useMunicipios } from '../contexto/dadosContexto.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { INDICADORES_MAPA } from '../servicos/municipios.js';
import Destaque from '../componentes/Destaque.jsx';
import MapaMaranhao from '../componentes/MapaMaranhao.jsx';
import EstadoDados from '../componentes/EstadoDados.jsx';

/* O indicador escolhido fica na URL (?indicador=), para o mapa de densidade
   ou de crescimento ser um link compartilhável. */
export default function Mapa() {
  useTitulo('Mapa do Maranhão');
  const { municipios, status } = useMunicipios();
  const [params, setParams] = useSearchParams();
  const indicador = INDICADORES_MAPA[params.get('indicador')] ? params.get('indicador') : 'densidade';

  return (
    <>
      <Destaque
        rotulo="217 municípios no mapa"
        titulo="O Maranhão pintado por indicador"
        chamada="Cada município recebe a cor da faixa em que está. Escolha o indicador, passe o mouse para ler o valor e clique para abrir a página do município."
      />

      <section className="secao">
        <div className="container">
          <form className="barra-busca mb-4" onSubmit={(e) => e.preventDefault()}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6 col-lg-4">
                <label htmlFor="indicador-mapa">Pintar o mapa por</label>
                <select
                  className="form-select"
                  id="indicador-mapa"
                  value={indicador}
                  onChange={(e) => setParams({ indicador: e.target.value }, { replace: true })}
                >
                  {Object.entries(INDICADORES_MAPA).map(([chave, { rotulo }]) => (
                    <option key={chave} value={chave}>{rotulo}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-8">
                <p className="texto-apoio mb-0">
                  {indicador === 'crescimento'
                    ? 'Taxa geométrica anual entre os Censos de 2010 e 2022. Valores negativos são municípios que perderam população.'
                    : 'Censo Demográfico 2022. As faixas dividem os municípios em cinco grupos de tamanho parecido.'}
                </p>
              </div>
            </div>
          </form>

          {status === 'carregando' ? (
            <EstadoDados />
          ) : (
            <MapaMaranhao municipios={municipios} indicador={indicador} />
          )}

          {status !== 'carregando' && <EstadoDados className="mt-4 mb-0" />}
        </div>
      </section>
    </>
  );
}
