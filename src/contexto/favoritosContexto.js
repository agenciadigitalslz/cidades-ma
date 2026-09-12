import { createContext, useContext } from 'react';

export const FavoritosContext = createContext(null);

export function useFavoritos() {
  const valor = useContext(FavoritosContext);
  if (!valor) throw new Error('useFavoritos precisa estar dentro de FavoritosProvider');
  return valor;
}
