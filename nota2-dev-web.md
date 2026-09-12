# Nota 2 - Dev Web - Finalização e Publicação

**Prazo:** 17/09/2026, 23h59 | **Apresentação (Nota 3):** 19/09, 13h às 17h no polo
**Entrega:** slides em PDF (cada integrante posta o mesmo arquivo) + link do GitHub + link da aplicação publicada

## Goal

Transformar o site estático da Nota 1 em uma aplicação React publicada, que consome a API do IBGE ao vivo, com busca, filtro, ordenação e comparação entre municípios, e documentar tudo em slides.

## Tasks

- [x] 1. Esqueleto Vite + React 19 + React Router 7 + Bootstrap 5 em `Documents\Projetos\cidades-ma` → Verify: `npm run build` sem erro
- [x] 2. Serviço da API (Localidades + SIDRA 4714) com parser puro → Verify: `npm test` verde em `ibge.test.js`
- [x] 3. Contexto de dados com reserva local e aviso na tela → Verify: derrubar a rede e ver o aviso "modo de reserva"
- [x] 4. Portar os 11 blocos da Nota 1 para componentes → Verify: as 4 páginas renderizam iguais à Nota 1
- [x] 5. Busca, filtro e ordenação na URL → Verify: `/municipios?q=sao&regiao=Norte%20Maranhense` filtra e o voltar desfaz
- [x] 6. Detalhe por rota `/municipios/:id` com comparação, gráfico SVG e tabela → Verify: trocar o município no select redesenha o gráfico
- [ ] 7. Prova visual em 360px, 768px e 1440px, claro e escuro, sobre `dist/` → Verify: capturas em `Nota 2/capturas/`
- [ ] 8. Repositório público `agenciadigitalslz/cidades-ma` e push (com autorização) → Verify: link abre para quem não está logado
- [ ] 9. Publicar no Netlify (com autorização) → Verify: `/municipios/2111300` abre direto pelo link, sem 404
- [ ] 10. Slides da Nota 2 (deck-builder), seis seções do enunciado, com capturas e links → Verify: PDF abre, links testados
- [ ] 11. Postagem individual dos três integrantes no AVA até 17/09

## Mapa dos critérios (10,0)

| Critério | Pontos | Onde está |
|---|---|---|
| Continuidade com a Nota 1 | 1,0 | mesmos blocos, mesma identidade, slide de introdução |
| JavaScript, DOM e eventos | 1,5 | menu por estado, busca, select, teclado (Escape), tema |
| Fetch API e JSON | 1,5 | `ibge.js`, duas chamadas em paralelo, parser testado |
| Componentes React | 1,5 | 13 componentes em `src/componentes/` |
| Estado, navegação e SPA | 1,0 | Context + useReducer, useSearchParams, React Router, 404 |
| Funcionalidades previstas | 1,0 | lista, busca, detalhe, comparação (proposta de 08/08) |
| Responsividade | 1,0 | Bootstrap + CSS próprio, capturas em 3 larguras |
| Testes e correções | 0,5 | Vitest, lint, build, prova visual; slide com o que foi corrigido |
| Publicação e links | 0,5 | Netlify + GitHub |
| Relatório em linguagem técnica | 0,5 | slides no padrão da casa |

## Done When

- [ ] `npm test`, `npm run lint` e `npm run build` limpos
- [ ] Aplicação publicada e link testado em navegador anônimo
- [ ] Slides em PDF postados pelos três integrantes

---
Criado por André Lopes
Desenvolvedor Fullstack
