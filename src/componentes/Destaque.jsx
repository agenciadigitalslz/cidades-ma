import { MarcaDagua } from './Icones.jsx';

/* Topo das páginas: o único bloco em cor. Recebe o rótulo, o título, a
   chamada e, opcionalmente, um painel à direita e ações abaixo. */
export default function Destaque({ rotulo, titulo, chamada, acoes, lateral, id }) {
  return (
    <section className="destaque" id={id}>
      <MarcaDagua />
      <div className="container">
        <div className="row align-items-center g-5">
          <div className={lateral ? 'col-12 col-lg-7' : 'col-12'}>
            {rotulo && <p className="rotulo">{rotulo}</p>}
            <h1>{titulo}</h1>
            {chamada && <p className="chamada">{chamada}</p>}
            {acoes && <p className="mt-4 mb-0">{acoes}</p>}
          </div>
          {lateral && <div className="col-12 col-lg-5">{lateral}</div>}
        </div>
      </div>
    </section>
  );
}
