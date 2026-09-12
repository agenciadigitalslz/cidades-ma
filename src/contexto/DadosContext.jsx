import { useEffect, useReducer, useCallback } from 'react';
import { DadosContext } from './dadosContexto.js';
import { buscarMunicipios } from '../servicos/ibge.js';
import copiaLocal from '../dados/municipios_ma.json';

/* Estado global dos dados, compartilhado por todas as páginas.
   Um único carregamento alimenta a página inicial, a grade, o detalhe e a
   comparação; trocar de rota não refaz a consulta. */

const inicial = {
  status: 'carregando', // carregando | ok | reserva
  municipios: [],
  origem: null, // 'api' | 'local'
  erro: null,
  consultadoEm: null,
};

function reduzir(estado, acao) {
  switch (acao.tipo) {
    case 'carregando':
      return { ...inicial };
    case 'ok':
      return { status: 'ok', municipios: acao.municipios, origem: 'api', erro: null, consultadoEm: new Date() };
    case 'reserva':
      return { status: 'reserva', municipios: copiaLocal, origem: 'local', erro: acao.erro, consultadoEm: new Date() };
    default:
      return estado;
  }
}

export function DadosProvider({ children }) {
  const [estado, despachar] = useReducer(reduzir, inicial);

  const carregar = useCallback(async () => {
    despachar({ tipo: 'carregando' });
    try {
      const municipios = await buscarMunicipios();
      despachar({ tipo: 'ok', municipios });
    } catch (erro) {
      /* A API caiu ou a rede falhou: a aplicação continua com a cópia do
         Censo 2022 gravada no pacote, e avisa na tela que está em reserva. */
      despachar({ tipo: 'reserva', erro: erro?.message ?? String(erro) });
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <DadosContext.Provider value={{ ...estado, recarregar: carregar }}>
      {children}
    </DadosContext.Provider>
  );
}
