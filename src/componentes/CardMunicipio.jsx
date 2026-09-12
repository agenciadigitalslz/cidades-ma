import { Link } from 'react-router-dom';
import { nInt, ordinal } from '../servicos/formatar.js';
import { proporcaoBarra } from '../servicos/municipios.js';
import BotaoFavorito from './BotaoFavorito.jsx';

/* Cartão da grade. O cartão inteiro é a área de clique (stretched-link);
   a estrela fica acima dele para poder ser clicada sem abrir a página. */
export default function CardMunicipio({ municipio, posicao, maiorPopulacao }) {
  const proporcao = proporcaoBarra(municipio.populacao, maiorPopulacao);
  return (
    <article className="card-municipio">
      {posicao && <p className="posicao">{ordinal(posicao)}</p>}
      <h3>
        <Link className="stretched-link" to={`/municipios/${municipio.id}`}>
          {municipio.nome}
        </Link>
      </h3>
      <p className="populacao mb-0">{nInt(municipio.populacao)}</p>
      <p className="unidade mb-0">habitantes</p>
      <p className="barra-proporcao" style={{ '--proporcao': `${proporcao}%` }} aria-hidden="true">
        <span></span>
      </p>
      <p className="regiao mb-0">{municipio.mesorregiao}</p>
      <BotaoFavorito municipio={municipio} className="no-cartao" />
    </article>
  );
}
