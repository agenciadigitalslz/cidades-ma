import { Link } from 'react-router-dom';
import { nInt, nDec } from '../servicos/formatar.js';

/* Tabela de comparação. A linha em foco recebe destaque visual e uma barra
   lateral, para não depender só de cor. */
export default function TabelaComparativa({ municipios, focoId, legenda }) {
  return (
    <div className="rolagem-tabela">
      <table className="tabela-comparativa">
        <caption>{legenda}</caption>
        <thead>
          <tr>
            <th scope="col">Município</th>
            <th scope="col">Mesorregião</th>
            <th scope="col" className="numerico">População</th>
            <th scope="col" className="numerico">Área (km²)</th>
            <th scope="col" className="numerico">Densidade (hab/km²)</th>
          </tr>
        </thead>
        <tbody>
          {municipios.map((m) => (
            <tr key={m.id} className={m.id === focoId ? 'destacada' : undefined}>
              <th scope="row">
                {m.id === focoId ? m.nome : <Link to={`/municipios/${m.id}`}>{m.nome}</Link>}
              </th>
              <td>{m.mesorregiao}</td>
              <td className="numerico">{nInt(m.populacao)}</td>
              <td className="numerico">{nDec(m.area)}</td>
              <td className="numerico">{nDec(m.densidade, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
