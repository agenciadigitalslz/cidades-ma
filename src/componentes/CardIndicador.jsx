/* Um indicador em destaque: rótulo, número grande, unidade e leitura de apoio. */
export default function CardIndicador({ rotulo, valor, unidade, apoio }) {
  return (
    <dl className="card-indicador">
      <dt>{rotulo}</dt>
      <dd>
        <span className="numero">{valor}</span>
        <span className="unidade">{unidade}</span>
        {apoio && <p className="texto-apoio mt-2 mb-0">{apoio}</p>}
      </dd>
    </dl>
  );
}
