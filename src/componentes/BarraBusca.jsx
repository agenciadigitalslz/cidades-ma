import { CRITERIOS } from '../servicos/municipios.js';

/* Busca, filtro e ordenação. Componente controlado: quem usa guarda o estado
   (na página de municípios, ele vive na URL, para que o resultado seja
   compartilhável e o botão voltar funcione). */
export default function BarraBusca({ termo, mesorregiao, ordem, mesorregioes, aoMudar, resultado, soMinhas = false, temFavoritos = false }) {
  return (
    <form className="barra-busca mb-4" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-5">
          <label htmlFor="busca-municipio">Buscar município</label>
          <input
            className="form-control"
            id="busca-municipio"
            type="search"
            placeholder="Digite o nome do município"
            aria-describedby="busca-resultado"
            value={termo}
            onChange={(e) => aoMudar({ termo: e.target.value })}
            autoComplete="off"
          />
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="filtro-regiao">Filtrar por mesorregião</label>
          <select
            className="form-select"
            id="filtro-regiao"
            value={mesorregiao}
            onChange={(e) => aoMudar({ mesorregiao: e.target.value })}
          >
            <option value="">Todas as mesorregiões</option>
            {mesorregioes.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-3">
          <label htmlFor="ordem">Ordenar por</label>
          <select className="form-select" id="ordem" value={ordem} onChange={(e) => aoMudar({ ordem: e.target.value })}>
            {Object.entries(CRITERIOS).map(([chave, { rotulo }]) => (
              <option key={chave} value={chave}>{rotulo}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
        <p className="texto-apoio mb-0" id="busca-resultado" aria-live="polite">
          {resultado}
        </p>
        {temFavoritos && (
          <div className="form-check mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="so-minhas"
              checked={soMinhas}
              onChange={(e) => aoMudar({ soMinhas: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="so-minhas">Só as minhas cidades</label>
          </div>
        )}
      </div>
    </form>
  );
}
