import { useEffect, useRef, useState } from 'react';
import { IconeCompartilhar } from './Icones.jsx';

/* Compartilha a página atual: no celular abre a folha nativa (Web Share
   API); no desktop copia o endereço e confirma na tela. */
export default function BotaoCompartilhar({ titulo, texto, className = '' }) {
  const [estado, setEstado] = useState('pronto'); // pronto | copiado | erro
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const avisar = (novo) => {
    setEstado(novo);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setEstado('pronto'), 2200);
  };

  const compartilhar = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, text: texto, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      avisar('copiado');
    } catch (erro) {
      if (erro?.name === 'AbortError') return; // a pessoa fechou a folha
      avisar('erro');
    }
  };

  const rotulo = estado === 'copiado' ? 'Link copiado' : estado === 'erro' ? 'Não foi possível copiar' : 'Compartilhar';

  return (
    <button type="button" className={`btn btn-neutro px-4 ${className}`} onClick={compartilhar}>
      <IconeCompartilhar className="icone-botao" aria-hidden="true" />
      <span aria-live="polite">{rotulo}</span>
    </button>
  );
}
