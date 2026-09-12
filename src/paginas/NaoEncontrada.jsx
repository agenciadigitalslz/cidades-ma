import { Link } from 'react-router-dom';
import { useTitulo } from '../hooks/useTitulo.js';
import Destaque from '../componentes/Destaque.jsx';

export default function NaoEncontrada({ mensagem }) {
  useTitulo('Página não encontrada');
  return (
    <Destaque
      rotulo="Erro 404"
      titulo="Página não encontrada"
      chamada={mensagem ?? 'O endereço não corresponde a nenhuma página da aplicação.'}
      acoes={
        <Link className="btn btn-contraste px-4" to="/municipios">
          Ver os municípios
        </Link>
      }
    />
  );
}
