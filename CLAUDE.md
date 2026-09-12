# CLAUDE.md | Cidades MA

> Complementa o CLAUDE.md global. Projeto acadêmico da disciplina Desenvolvimento Web (UEMA / UEMAnet), Nota 2 e Nota 3. Contexto em `CONTEXTO.md`.

## Regras locais

- **Stack fixa pelo enunciado:** React 19 + Vite 8 + React Router 7 + Bootstrap 5. Sem outra biblioteca de UI, sem TypeScript, sem gráfico de terceiros (o gráfico é SVG próprio).
- **Todo número vem do IBGE.** Nenhum valor estimado, arredondado ou inventado. A cópia local em `src/dados/` só entra quando a API falha, e a tela avisa.
- **Nomes em português** em componentes, hooks, funções, variáveis e comentários. Sem travessão nem hífen entre espaços em nenhum texto.
- **Identidade visual da Nota 1 é intocável:** laranja `#fd9d24` do ODS 11 como único acento, no máximo dois usos por tela; serifa nos títulos, sem-serifa no corpo; ícones SVG monoline; nunca emoji.
- **Acessibilidade não regride:** contraste medido nos dois temas, foco visível, rótulo em todo campo, alvos de 44px.
- **Validar sem dev server:** `npm test`, `npm run lint`, `npm run build`. Prova visual por Playwright sobre a pasta `dist/`.
- **Publicar só com autorização explícita** do André (Netlify e `git push`).

## Comandos

```
npm test && npm run lint && npm run build
```

## Onde estão as coisas

| O quê | Onde |
|---|---|
| Consumo da API e parsers | `src/servicos/ibge.js` (testes em `ibge.test.js`) |
| Regras da lista | `src/servicos/municipios.js` |
| Estado global | `src/contexto/DadosContext.jsx` |
| Rotas | `src/App.jsx` |
| Tokens de cor e tipografia | `src/estilos/base.css` |
| Entrega acadêmica (slides, prints) | `Academico/ADS/ultimo_semestre/1. Desenvolvimento Web/Nota 2/` |

---
Criado por André Lopes
Desenvolvedor Fullstack
