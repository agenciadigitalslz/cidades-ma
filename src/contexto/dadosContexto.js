import { createContext, useContext } from 'react';

/* O objeto de contexto e o hook ficam separados do provedor para que o
   arquivo do provedor exporte só um componente (exigência do Fast Refresh). */
export const DadosContext = createContext(null);

export function useMunicipios() {
  const valor = useContext(DadosContext);
  if (!valor) throw new Error('useMunicipios precisa estar dentro de DadosProvider');
  return valor;
}
