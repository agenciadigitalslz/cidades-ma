/* Cartão vazio com blocos pulsando, mostrado enquanto a API responde.
   Tem o mesmo tamanho do cartão real, para a grade não pular ao carregar. */
export default function CardEsqueleto() {
  return (
    <article className="card-municipio esqueleto" aria-hidden="true">
      <span className="bloco bloco-titulo"></span>
      <span className="bloco bloco-numero"></span>
      <span className="bloco bloco-linha"></span>
      <span className="bloco bloco-barra"></span>
      <span className="bloco bloco-linha curta"></span>
    </article>
  );
}

export function GradeEsqueleto({ quantidade = 8 }) {
  return (
    <div className="row g-3" role="status" aria-label="Carregando municípios">
      {Array.from({ length: quantidade }, (_, i) => (
        <div className="col-6 col-md-4 col-lg-3" key={i}>
          <CardEsqueleto />
        </div>
      ))}
    </div>
  );
}
