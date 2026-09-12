import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMunicipios } from '../contexto/dadosContexto.js';
import { useFavoritos } from '../contexto/favoritosContexto.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { filtrar, ordenar, mesorregioes, posicaoPorPopulacao } from '../servicos/municipios.js';
import Destaque from '../componentes/Destaque.jsx';
import BarraBusca from '../componentes/BarraBusca.jsx';
import CardMunicipio from '../componentes/CardMunicipio.jsx';
import { GradeEsqueleto } from '../componentes/CardEsqueleto.jsx';
import EstadoDados from '../componentes/EstadoDados.jsx';

/* A busca, o filtro e a ordenação vivem na URL (?q=&regiao=&ordem=&minhas=1).
   Assim o resultado pode ser compartilhado por link e o botão voltar do
   navegador desfaz o último filtro, como se espera de uma página. */
export default function Municipios() {
  useTitulo('Municípios');
  const { municipios, status } = useMunicipios();
  const { ids: favoritos } = useFavoritos();
  const [params, setParams] = useSearchParams();

  const termo = params.get('q') ?? '';
  const mesorregiao = params.get('regiao') ?? '';
  const ordem = params.get('ordem') ?? 'populacao';
  const soMinhas = params.get('minhas') === '1';

  const aoMudar = (mudanca) => {
    const proximo = new URLSearchParams(params);
    const mapa = { termo: 'q', mesorregiao: 'regiao', ordem: 'ordem', soMinhas: 'minhas' };
    for (const [campo, valor] of Object.entries(mudanca)) {
      const chave = mapa[campo];
      const vazio = !valor || (chave === 'ordem' && valor === 'populacao');
      if (vazio) proximo.delete(chave);
      else proximo.set(chave, valor === true ? '1' : valor);
    }
    setParams(proximo, { replace: true });
  };

  const regioes = useMemo(() => mesorregioes(municipios), [municipios]);
  const visiveis = useMemo(
    () => ordenar(filtrar(municipios, { termo, mesorregiao, ids: soMinhas ? favoritos : null }), ordem),
    [municipios, termo, mesorregiao, ordem, soMinhas, favoritos],
  );
  const maiorPopulacao = useMemo(() => ordenar(municipios, 'populacao')[0]?.populacao ?? 0, [municipios]);

  const carregando = status === 'carregando';
  const resultado = carregando
    ? 'Carregando a lista de municípios…'
    : visiveis.length === municipios.length
      ? `${municipios.length} municípios. Dica: a tecla "/" traz o cursor para esta busca de qualquer página.`
      : `${visiveis.length} de ${municipios.length} municípios.`;

  return (
    <>
      <Destaque
        rotulo={`${municipios.length || 217} municípios`}
        titulo="Municípios do Maranhão"
        chamada="Busque pelo nome, filtre por mesorregião e ordene por população, área, densidade ou crescimento. Dados do Censo Demográfico de 2022."
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
            soMinhas={soMinhas}
            temFavoritos={favoritos.length > 0}
          />

          {carregando && <GradeEsqueleto quantidade={12} />}

          {!carregando && visiveis.length === 0 && (
            <p className="aviso-etapa">
              <strong>Nenhum município encontrado.</strong>{' '}
              {soMinhas ? 'Marque a estrela em algum município para ele aparecer aqui.' : 'Confira a grafia ou limpe o filtro de mesorregião.'}
            </p>
          )}

          {!carregando && (
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
          )}

          {!carregando && <EstadoDados className="mt-4 mb-0" />}
        </div>
      </section>
    </>
  );
}
