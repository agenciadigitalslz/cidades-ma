import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carregarMalha, projetar } from '../servicos/malha.js';
import { INDICADORES_MAPA, quantis, faixaDe, porId } from '../servicos/municipios.js';
import { nDec, nInt, nSinal } from '../servicos/formatar.js';

const FAIXAS = 5;

function formatarValor(valor, indicador) {
  const def = INDICADORES_MAPA[indicador];
  if (valor == null) return 'sem dado';
  if (indicador === 'crescimento') return `${nSinal(valor, def.casas)} ${def.unidade}`;
  return `${def.casas ? nDec(valor, def.casas) : nInt(valor)} ${def.unidade}`;
}

/* Mapa dos 217 municípios em SVG, pintado por faixas de quantis do indicador
   escolhido. Passar o mouse mostra o município e o valor; clicar abre a
   página dele. A malha vem da API do IBGE, com cópia local como reserva. */
export default function MapaMaranhao({ municipios, indicador = 'densidade', compacto = false, focoId = null }) {
  const navegar = useNavigate();
  const [malha, setMalha] = useState(null);
  const [origem, setOrigem] = useState(null);
  const [ativo, setAtivo] = useState(null);

  useEffect(() => {
    let cancelado = false;
    carregarMalha().then(({ geojson, origem: de }) => {
      if (cancelado) return;
      setMalha(projetar(geojson, 600));
      setOrigem(de);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  const cortes = useMemo(() => quantis(municipios.map((m) => m[indicador]), FAIXAS), [municipios, indicador]);
  const def = INDICADORES_MAPA[indicador];
  const municipioAtivo = ativo ? porId(municipios, ativo) : null;

  if (!malha) {
    return (
      <div className="mapa esqueleto-mapa" role="status" aria-live="polite">
        <span className="bloco"></span>
        <p className="texto-apoio mb-0">Carregando a malha dos municípios…</p>
      </div>
    );
  }

  return (
    <div className={`mapa${compacto ? ' compacto' : ''}`}>
      <svg
        viewBox={malha.viewBox}
        role="img"
        aria-label={`Mapa do Maranhão com os ${municipios.length} municípios pintados por ${def.rotulo.toLowerCase()}, em cinco faixas`}
        onMouseLeave={() => setAtivo(null)}
      >
        {malha.formas.map((forma) => {
          const m = porId(municipios, forma.id);
          const faixa = m ? faixaDe(m[indicador], cortes) : null;
          const classes = ['municipio', faixa == null ? 'sem-dado' : `faixa-${faixa}`];
          if (forma.id === ativo) classes.push('ativo');
          if (forma.id === focoId) classes.push('foco');
          return (
            <path
              key={forma.id}
              d={forma.d}
              className={classes.join(' ')}
              onMouseEnter={() => setAtivo(forma.id)}
              onFocus={() => setAtivo(forma.id)}
              onClick={() => navegar(`/municipios/${forma.id}`)}
            >
              <title>{m ? `${m.nome}: ${formatarValor(m[indicador], indicador)}` : forma.id}</title>
            </path>
          );
        })}
      </svg>

      <div className="painel-mapa">
        <p className="leitura-mapa" aria-live="polite">
          {municipioAtivo ? (
            <>
              <strong>{municipioAtivo.nome}</strong> · {formatarValor(municipioAtivo[indicador], indicador)}
              <span className="texto-apoio"> · clique para abrir</span>
            </>
          ) : (
            <span className="texto-apoio">Passe o mouse ou toque em um município.</span>
          )}
        </p>
        <ol className="legenda-mapa" aria-label={`Faixas de ${def.rotulo.toLowerCase()}`}>
          {Array.from({ length: FAIXAS }, (_, i) => {
            const de = i === 0 ? null : cortes[i - 1];
            const ate = i === FAIXAS - 1 ? null : cortes[i];
            const f = (v) => (indicador === 'crescimento' ? nSinal(v, 2) : def.casas ? nDec(v, def.casas) : nInt(v));
            const texto = de == null ? `até ${f(ate)}` : ate == null ? `acima de ${f(de)}` : `${f(de)} a ${f(ate)}`;
            return (
              <li key={i}>
                <span className={`amostra faixa-${i}`} aria-hidden="true"></span>
                {texto}
              </li>
            );
          })}
        </ol>
        {!compacto && (
          <p className="texto-apoio mb-0">
            Faixas por quintis: cada cor reúne cerca de um quinto dos municípios. Malha{' '}
            {origem === 'api' ? 'consultada ao vivo na API de malhas do IBGE' : 'da cópia local da API de malhas do IBGE'}.
          </p>
        )}
      </div>
    </div>
  );
}
