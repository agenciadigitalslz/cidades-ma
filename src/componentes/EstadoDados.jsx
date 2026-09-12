import { useMunicipios } from '../contexto/dadosContexto.js';

/* Diz de onde vieram os dados na tela. Se a API do IBGE não respondeu, a
   aplicação segue com a cópia local e avisa, em vez de fingir que consultou. */
export default function EstadoDados({ className = '' }) {
  const { status, consultadoEm, erro, recarregar } = useMunicipios();

  if (status === 'carregando') {
    return (
      <p className={`aviso-etapa ${className}`} role="status" aria-live="polite">
        <strong>Consultando a API do IBGE…</strong> Localidades e Censo 2022, tabela 4714 do SIDRA.
      </p>
    );
  }

  const hora = consultadoEm?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (status === 'reserva') {
    return (
      <p className={`aviso-etapa ${className}`} role="status">
        <strong>API do IBGE indisponível às {hora}.</strong> Exibindo a cópia local do Censo 2022,
        coletada da mesma API em agosto de 2026. Motivo: {erro}.{' '}
        <button type="button" className="btn btn-sm btn-neutro ms-2" onClick={recarregar}>
          Tentar de novo
        </button>
      </p>
    );
  }

  return (
    <p className={`texto-apoio ${className}`} role="status">
      Dados consultados ao vivo na API do IBGE às {hora}: Localidades e Censo Demográfico 2022
      (tabela 4714 do SIDRA).
    </p>
  );
}
