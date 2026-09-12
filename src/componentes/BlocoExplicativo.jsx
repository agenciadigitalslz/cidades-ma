/* Bloco de ícone, título e texto curto, usado em linha de três na página inicial. */
export default function BlocoExplicativo({ icone: Icone, rotuloIcone, titulo, children }) {
  return (
    <div className="bloco-explicativo">
      <Icone className="icone" role="img" aria-label={rotuloIcone} />
      <h3>{titulo}</h3>
      <p className="texto-apoio">{children}</p>
    </div>
  );
}
