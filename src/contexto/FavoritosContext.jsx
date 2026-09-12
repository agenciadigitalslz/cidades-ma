import { useCallback, useMemo, useState } from 'react';
import { FavoritosContext } from './favoritosContexto.js';

const CHAVE = 'cidades-ma-favoritos';

function lerSalvos() {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) ?? '[]');
    return Array.isArray(bruto) ? bruto.map(String) : [];
  } catch {
    return [];
  }
}

function gravar(ids) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(ids));
  } catch {
    /* navegação privativa: a lista vale só nesta visita */
  }
}

/* "Minhas cidades": os municípios que a pessoa marcou, guardados no
   navegador. Estado compartilhado por cartões, páginas e a inicial. */
export function FavoritosProvider({ children }) {
  const [ids, setIds] = useState(lerSalvos);

  const alternar = useCallback((id) => {
    setIds((atual) => {
      const chave = String(id);
      const proximo = atual.includes(chave) ? atual.filter((x) => x !== chave) : [...atual, chave];
      gravar(proximo);
      return proximo;
    });
  }, []);

  const limpar = useCallback(() => {
    gravar([]);
    setIds([]);
  }, []);

  const valor = useMemo(
    () => ({ ids, alternar, limpar, ehFavorito: (id) => ids.includes(String(id)) }),
    [ids, alternar, limpar],
  );

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}
