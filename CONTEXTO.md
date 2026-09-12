# CONTEXTO | Cidades MA

**O que é:** aplicação web sobre o ODS 11 (meta 11.3) que apresenta e compara indicadores urbanos dos 217 municípios do Maranhão, com dados do Censo 2022 consumidos da API pública do IBGE.

**Para quem:** disciplina Desenvolvimento Web, UEMA / UEMAnet, Prof. Me. Edilson Carlos Silva Lima. Equipe: André da Silva Lopes, Andressa de Jesus Nunes de Souza, Pedro Aurélio Cutrim da Rocha Lima.

**Prazos:** Nota 2 (slides em PDF + link do código + link publicado) em 17/09/2026. Nota 3 (apresentação presencial no polo, 10 a 15 min) em 19/09/2026.

## Histórico

| Data | O que |
|---|---|
| 08/08/2026 | Proposta aprovada no polo: tema, ODS 11, público-alvo, funcionalidades |
| 31/08/2026 | Nota 1 postada: 4 páginas em HTML5 + CSS3 + Bootstrap, dados estáticos do IBGE, relatório PDF |
| 12/09/2026 | Nota 2 iniciada: migração para React + Vite + React Router, consumo ao vivo da API do IBGE, busca, filtro, ordenação, comparação com gráfico, testes |

## Decisões

- **React, não Angular.** O Roteiro de Estudos da Unidade 2 indica React (JSX, Hooks, Vite, React Router). A proposta de 08/08 já previa React.
- **Repositório próprio e público** (`agenciadigitalslz/cidades-ma`), separado do monorepo acadêmico, porque o tutor recebe o link do código.
- **Netlify** para publicação, com `_redirects` para as rotas do React Router.
- **API do IBGE sem chave.** Localidades (v1) + SIDRA 4714 (v3), em paralelo, combinadas pelo código do município. CORS aberto, confirmado em 12/09.
- **Cópia local como reserva.** Se a API não responder em 10 s, a aplicação usa `src/dados/municipios_ma.json` (coletado da mesma API em ago/2026) e avisa na tela. Protege a apresentação presencial de queda de rede.
- **Filtros na URL** (`useSearchParams`) em vez de estado local: resultado compartilhável e botão voltar coerente.
- **Gráfico em SVG próprio**, sem biblioteca: usa os tokens do tema e não adiciona dependência.
- **Menu retrátil por estado React**, sem o JavaScript do Bootstrap: só o CSS do Bootstrap é usado.

## Identidade visual (herdada da Nota 1)

- Acento único: `#fd9d24`, laranja oficial do ODS 11. Escuro `#8a5000` para texto sobre claro, `#f7b955` sobre escuro.
- Neutros quentes: `#faf9f6` fundo, `#1c1c1a` texto (claro); `#15140f` fundo, `#f2efe6` texto (escuro).
- Títulos em Georgia (serifa), corpo em Segoe UI / system-ui.
- Ícones SVG monoline, traço 1,7 a 1,8, `currentColor`.

## Pendências

- [ ] Publicar no Netlify e registrar o link no README e nos slides
- [ ] Criar o repositório público no GitHub e fazer o push (autorização do André)
- [ ] Capturas de tela (desktop, 360px, tema escuro, gráfico, API na aba Rede) para os slides
- [ ] Slides da Nota 2 em PDF (deck-builder), seis seções do enunciado
- [ ] Slides da Nota 3 para a apresentação de 19/09

---
Criado por André Lopes
Desenvolvedor Fullstack
