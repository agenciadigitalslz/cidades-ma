import { useTema } from '../hooks/useTema.js';
import { IconeLua, IconeSol } from './Icones.jsx';

export default function BotaoTema() {
  const { tema, alternar } = useTema();
  const escuro = tema === 'escuro';
  return (
    <button
      className="botao-tema"
      type="button"
      aria-label="Alternar entre tema claro e escuro"
      aria-pressed={escuro}
      onClick={alternar}
    >
      <IconeLua className="icone-lua" aria-hidden="true" />
      <IconeSol className="icone-sol" aria-hidden="true" />
    </button>
  );
}
