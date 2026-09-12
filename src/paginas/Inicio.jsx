import { Link } from 'react-router-dom';
import { useMunicipios } from '../contexto/dadosContexto.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { totais, ordenar } from '../servicos/municipios.js';
import Destaque from '../componentes/Destaque.jsx';
import PainelResumo from '../componentes/PainelResumo.jsx';
import BlocoExplicativo from '../componentes/BlocoExplicativo.jsx';
import CardMunicipio from '../componentes/CardMunicipio.jsx';
import EstadoDados from '../componentes/EstadoDados.jsx';
import { IconeBanco, IconeBusca, IconeCidade } from '../componentes/Icones.jsx';

export default function Inicio() {
  useTitulo('Início');
  const { municipios, origem } = useMunicipios();
  const soma = totais(municipios);
  const ordenados = ordenar(municipios, 'populacao');
  const maiores = ordenados.slice(0, 8);
  const maiorPopulacao = ordenados[0]?.populacao ?? 0;
  const fonte = origem === 'api' ? 'Censo Demográfico 2022, IBGE, via API' : 'Censo Demográfico 2022, IBGE';

  return (
    <>
      <Destaque
        rotulo="ODS 11 · Meta 11.3"
        titulo="Sua cidade em números"
        chamada={`Indicadores urbanos dos ${soma.quantidade || 217} municípios do Maranhão, em linguagem que todo mundo entende. Sem código de tabela, sem planilha, sem cadastro.`}
        acoes={
          <Link className="btn btn-contraste btn-lg px-4" to="/municipios">
            Explorar municípios
          </Link>
        }
        lateral={<PainelResumo totais={soma} fonte={fonte} />}
      />

      <section className="secao">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <BlocoExplicativo icone={IconeBanco} rotuloIcone="Banco de dados" titulo="O dado existe">
                O IBGE publica população, área e densidade de cada um dos {soma.quantidade || 217}{' '}
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

      <section className="secao secao-alt">
        <div className="container">
          <h2>Os oito municípios mais populosos</h2>
          <p className="texto-apoio mb-4">
            A lista completa, com busca e filtro, está em <Link to="/municipios">Municípios</Link>.
          </p>
          <div className="row g-3">
            {maiores.map((m, i) => (
              <div className="col-6 col-md-4 col-lg-3" key={m.id}>
                <CardMunicipio municipio={m} posicao={i + 1} maiorPopulacao={maiorPopulacao} />
              </div>
            ))}
          </div>
          <EstadoDados className="mt-4 mb-0" />
        </div>
      </section>
    </>
  );
}
