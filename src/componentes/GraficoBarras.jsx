import { nInt, nDec } from '../servicos/formatar.js';

/* Gráfico de barras horizontais para comparar dois municípios em três
   indicadores. Desenhado em SVG puro, sem biblioteca: usa os tokens de cor do
   tema, então fica legível no claro e no escuro. Cada indicador tem a própria
   escala, porque população e densidade não cabem no mesmo eixo. */

const LARGURA = 640;
const ALTURA_BARRA = 18;
const ESPACO = 6;
const ALTURA_GRUPO = 2 * ALTURA_BARRA + ESPACO + 40;
const MARGEM_ESQ = 8;
const LARGURA_ROTULO = 150;
const LARGURA_VALOR = 110;

export default function GraficoBarras({ a, b, indicadores, legenda }) {
  const altura = indicadores.length * ALTURA_GRUPO + 8;
  const larguraBarraMax = LARGURA - MARGEM_ESQ - LARGURA_ROTULO - LARGURA_VALOR - 16;

  return (
    <figure className="grafico-barras">
      <svg
        viewBox={`0 0 ${LARGURA} ${altura}`}
        role="img"
        aria-label={`Comparação entre ${a.nome} e ${b.nome} em ${indicadores.map((i) => i.rotulo.toLowerCase()).join(', ')}`}
      >
        {indicadores.map((ind, g) => {
          const va = a[ind.chave] ?? 0;
          const vb = b[ind.chave] ?? 0;
          const maior = Math.max(va, vb, 1);
          const y0 = g * ALTURA_GRUPO + 8;
          const fmt = (v) => (ind.casas ? nDec(v, ind.casas) : nInt(v));
          return (
            <g key={ind.chave}>
              <text className="titulo-grupo" x={MARGEM_ESQ} y={y0 + 14}>
                {ind.rotulo} <tspan className="unidade-grupo">({ind.unidade})</tspan>
              </text>
              {[
                { m: a, v: va, classe: 'barra-a' },
                { m: b, v: vb, classe: 'barra-b' },
              ].map(({ m, v, classe }, i) => {
                const y = y0 + 24 + i * (ALTURA_BARRA + ESPACO);
                const w = Math.max(2, Math.round((v / maior) * larguraBarraMax));
                const x = MARGEM_ESQ + LARGURA_ROTULO;
                return (
                  <g key={m.id}>
                    <text className="rotulo-barra" x={x - 10} y={y + ALTURA_BARRA - 5} textAnchor="end">
                      {m.nome}
                    </text>
                    <rect className={classe} x={x} y={y} width={w} height={ALTURA_BARRA} rx="2" />
                    <text className="valor-barra" x={x + w + 8} y={y + ALTURA_BARRA - 5}>
                      {fmt(v)}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      {legenda && <figcaption className="texto-apoio mt-2">{legenda}</figcaption>}
    </figure>
  );
}
