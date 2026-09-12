import { useCallback, useEffect, useState } from 'react';

const CHAVE = 'cidades-ma-tema';
const raiz = () => document.documentElement;

function sistemaPrefereEscuro() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function temaInicial() {
  return raiz().getAttribute('data-tema') || (sistemaPrefereEscuro() ? 'escuro' : 'claro');
}

/* Tema claro e escuro com três estados: sem escolha segue o sistema; a escolha
   pelo botão vence o sistema nos dois sentidos e fica guardada no navegador. */
export function useTema() {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    raiz().setAttribute('data-tema', tema);
  }, [tema]);

  const alternar = useCallback(() => {
    setTema((atual) => {
      const novo = atual === 'escuro' ? 'claro' : 'escuro';
      try {
        localStorage.setItem(CHAVE, novo);
      } catch {
        /* navegação privativa: segue sem persistir */
      }
      return novo;
    });
  }, []);

  return { tema, alternar };
}
