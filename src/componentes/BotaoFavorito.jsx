import { useFavoritos } from '../contexto/favoritosContexto.js';
import { IconeEstrela } from './Icones.jsx';

/* Marca ou desmarca um município em "Minhas cidades". */
export default function BotaoFavorito({ municipio, comTexto = false, className = '' }) {
  const { ehFavorito, alternar } = useFavoritos();
  const marcado = ehFavorito(municipio.id);
  const rotulo = marcado
    ? `Remover ${municipio.nome} das minhas cidades`
    : `Adicionar ${municipio.nome} às minhas cidades`;
  return (
    <button
      type="button"
      className={`botao-favorito${marcado ? ' marcado' : ''}${comTexto ? ' com-texto' : ''} ${className}`}
      aria-pressed={marcado}
      aria-label={rotulo}
      title={rotulo}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alternar(municipio.id);
      }}
    >
      <IconeEstrela aria-hidden="true" />
      {comTexto && <span>{marcado ? 'Nas minhas cidades' : 'Guardar em minhas cidades'}</span>}
    </button>
  );
}
