import { nInt } from '../servicos/formatar.js';

/* Resumo do estado inteiro, calculado sobre a lista carregada da API. */
export default function PainelResumo({ totais, fonte }) {
  return (
    <dl className="painel-resumo">
      <div>
        <dt>População residente</dt>
        <dd>
          {nInt(totais.populacao)} <span className="un">hab.</span>
        </dd>
      </div>
      <div>
        <dt>Área territorial</dt>
        <dd>
          {nInt(totais.area)} <span className="un">km²</span>
        </dd>
      </div>
      <div>
        <dt>Municípios</dt>
        <dd>{totais.quantidade}</dd>
      </div>
      <p className="fonte">{fonte}</p>
    </dl>
  );
}
