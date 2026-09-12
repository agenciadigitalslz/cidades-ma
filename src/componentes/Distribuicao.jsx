import { nInt } from '../servicos/formatar.js';
import { distribuicao } from '../servicos/municipios.js';

function Barras({ titulo, itens, rotulo, legenda }) {
  const maior = Math.max(...itens.map((i) => i.quantidade), 1);
  return (
    <div className="distribuicao">
      <h3>{titulo}</h3>
      <ol className="barras-distribuicao" aria-label={titulo}>
        {itens.map((item) => (
          <li key={rotulo(item)}>
            <span className="rotulo-dist">{rotulo(item)}</span>
            <span className="trilho-dist" aria-hidden="true">
              <span className="barra-dist" style={{ width: `${Math.max(2, (item.quantidade / maior) * 100)}%` }}></span>
            </span>
            <span className="valor-dist">
              {item.quantidade} <span className="texto-apoio">{item.quantidade === 1 ? 'município' : 'municípios'} · {nInt(item.populacao)} hab.</span>
            </span>
          </li>
        ))}
      </ol>
      {legenda && <p className="texto-apoio mb-0">{legenda}</p>}
    </div>
  );
}

/* Panorama do estado: como os 217 municípios se distribuem por tamanho e
   por mesorregião. Calculado dos dados já carregados. */
export default function Distribuicao({ municipios }) {
  const { classes, mesorregioes } = distribuicao(municipios);
  const pequenos = classes[0].quantidade + classes[1].quantidade;
  return (
    <div className="row g-5">
      <div className="col-12 col-lg-6">
        <Barras
          titulo="Por tamanho de população"
          itens={classes}
          rotulo={(c) => c.rotulo}
          legenda={`${pequenos} dos ${municipios.length} municípios têm menos de 20 mil habitantes.`}
        />
      </div>
      <div className="col-12 col-lg-6">
        <Barras
          titulo="Por mesorregião"
          itens={mesorregioes}
          rotulo={(r) => r.nome}
          legenda="Barra pela quantidade de municípios; o número ao lado traz a população somada."
        />
      </div>
    </div>
  );
}
