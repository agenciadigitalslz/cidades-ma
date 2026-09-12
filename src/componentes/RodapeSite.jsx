import { Link } from 'react-router-dom';
import { useMunicipios } from '../contexto/dadosContexto.js';

export default function RodapeSite() {
  const { municipios } = useMunicipios();
  const total = municipios.length || 217;
  return (
    <footer className="rodape-site">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-5">
            <p className="marca-rodape">Cidades MA</p>
            <p>
              Os {total} municípios do Maranhão em população, área e densidade, em linguagem que
              dispensa código de tabela.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <h2>Dados</h2>
            <p>
              IBGE, Censo Demográfico 2022
              <br />
              Tabela 4714 do SIDRA, via API pública
            </p>
            <p>
              <a href="https://cidades.ibge.gov.br/" rel="noopener">Consultar no IBGE Cidades</a>
            </p>
          </div>
          <div className="col-6 col-md-4">
            <h2>Navegação</h2>
            <p>
              <Link to="/">Início</Link>
              <br />
              <Link to="/municipios">Municípios</Link>
              <br />
              <Link to="/sobre">Sobre o projeto</Link>
            </p>
          </div>
        </div>
        <div className="creditos">
          <p>ODS 11 · Cidades e Comunidades Sustentáveis · meta 11.3</p>
          <p>André Lopes · Andressa Souza · Pedro Aurélio · UEMA / UEMAnet</p>
        </div>
      </div>
    </footer>
  );
}
