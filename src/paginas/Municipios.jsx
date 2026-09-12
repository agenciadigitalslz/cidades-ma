import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMunicipios } from '../contexto/dadosContexto.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { filtrar, ordenar, mesorregioes, posicaoPorPopulacao } from '../servicos/municipios.js';
import Destaque from '../componentes/Destaque.jsx';
import BarraBusca from '../componentes/BarraBusca.jsx';
import CardMunicipio from '../componentes/CardMunicipio.jsx';
import EstadoDados from '../componentes/EstadoDados.jsx';

/* A busca, o filtro e a ordenação vivem na URL (?q=&regiao=&ordem=).
   Assim o resultado pode ser compartilhado por link e o botão voltar do
   navegador desfaz o último filtro, como se espera de uma página. */
export default function Municipios() {
  useTitulo('Municípios');
  const { municipios, status } = useMunicipios();
  const [params, setParams] = useSearchParams();

  const termo = params.get('q') ?? '';
  const mesorregiao = params.get('regiao') ?? '';
  const ordem = params.get('ordem') ?? 'populacao';

  const aoMudar = (mudanca) => {
    const proximo = new URLSearchParams(params);
    const mapa = { termo: 'q', mesorregiao: 'regiao', ordem: 'ordem' };
    for (const [campo, valor] of Object.entries(mudanca)) {
      const chave = mapa[campo];
      if (valor && !(chave === 'ordem' && valor === 'populacao')) proximo.set(chave, valor);
      else proximo.delete(chave);
    }
    setParams(proximo, { replace: true });
  };

  const regioes = useMemo(() => mesorregioes(municipios), [municipios]);
  const visiveis = useMemo(
    () => ordenar(filtrar(municipios, { termo, mesorregiao }), ordem),
    [municipios, termo, mesorregiao, ordem],
  );
  const maiorPopulacao = useMemo(() => ordenar(municipios, 'populacao')[0]?.populacao ?? 0, [municipios]);

  const resultado =
    status === 'carregando'
      ? 'Carregando a lista de municípios…'
      : visiveis.length === municipios.length
        ? `${municipios.length} municípios.`
        : `${visiveis.length} de ${municipios.length} municípios.`;

  return (
    <>
      <Destaque
        rotulo={`${municipios.length || 217} municípios`}
        titulo="Municípios do Maranhão"
        chamada="Busque pelo nome, filtre por mesorregião e ordene por população, área ou densidade. Dados do Censo Demográfico de 2022."
      />

      <section className="secao">
        <div className="container">
          <BarraBusca
            termo={termo}
            mesorregiao={mesorregiao}
            ordem={ordem}
            mesorregioes={regioes}
            aoMudar={aoMudar}
            resultado={resultado}
          />

          {status === 'carregando' && <EstadoDados className="mb-4" />}

          {status !== 'carregando' && visiveis.length === 0 && (
            <p className="aviso-etapa">
              <strong>Nenhum município encontrado.</strong> Confira a grafia ou limpe o filtro de mesorregião.
            </p>
          )}

          <div className="row g-3">
            {visiveis.map((m) => (
              <div className="col-6 col-md-4 col-lg-3" key={m.id}>
                <CardMunicipio
                  municipio={m}
                  posicao={posicaoPorPopulacao(municipios, m.id)}
                  maiorPopulacao={maiorPopulacao}
                />
              </div>
            ))}
          </div>

          {status !== 'carregando' && <EstadoDados className="mt-4 mb-0" />}
        </div>
      </section>
    </>
  );
}
