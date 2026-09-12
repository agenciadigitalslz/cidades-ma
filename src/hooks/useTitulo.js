import { useEffect } from 'react';

/* Numa aplicação de página única o título da aba não muda sozinho:
   cada página declara o seu. */
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | Cidades MA` : 'Cidades MA';
  }, [titulo]);
}
