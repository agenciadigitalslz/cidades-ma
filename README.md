# Cidades MA

Indicadores urbanos dos 217 municípios do Maranhão, em linguagem acessível, com dados do Censo Demográfico de 2022 consumidos da API pública do IBGE.

Aplicação desenvolvida para a disciplina de **Desenvolvimento Web** do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas da UEMA / UEMAnet. **ODS 11**, Cidades e Comunidades Sustentáveis, meta 11.3 (planejamento participativo e integrado).

**Aplicação publicada:** (link adicionado na entrega)

## Equipe

- André da Silva Lopes
- Andressa de Jesus Nunes de Souza
- Pedro Aurélio Cutrim da Rocha Lima

## O que a aplicação faz

- Lista os 217 municípios com busca por nome (sem distinguir acento), filtro por mesorregião e ordenação por população, área, densidade ou nome. Os filtros ficam na URL, então o resultado pode ser compartilhado por link.
- Mostra os indicadores de cada município, a posição dele no estado e a comparação com qualquer outro, em gráfico e em tabela.
- Alterna entre tema claro e escuro, respeitando a preferência do sistema.
- Consulta a API do IBGE ao abrir e, se ela não responder em dez segundos, usa uma cópia local dos mesmos dados e avisa na tela.

## Como rodar

```
npm install
npm run dev        # servidor de desenvolvimento
npm test           # testes com Vitest
npm run lint       # oxlint
npm run build      # gera a pasta dist/ para publicação
npm run preview    # serve a pasta dist/ localmente
```

## Estrutura

```
cidades-ma/
├── index.html                 Documento único da aplicação (SPA)
├── public/_redirects          Reescrita de rotas para o Netlify
└── src/
    ├── main.jsx               Ponto de entrada: Router e provedor de dados
    ├── App.jsx                Rotas e esqueleto (cabeçalho, miolo, rodapé)
    ├── servicos/
    │   ├── ibge.js            Fetch API: Localidades e SIDRA 4714, com parser testado
    │   ├── municipios.js      Ordenar, filtrar, totais e ranking (funções puras)
    │   └── formatar.js        Números em pt-BR, normalização para busca
    ├── contexto/DadosContext.jsx   Estado global: carregando, ok ou reserva
    ├── hooks/                 useTema (claro/escuro) e useTitulo (título da aba)
    ├── componentes/           CabecalhoSite, BotaoTema, Destaque, PainelResumo,
    │                          BlocoExplicativo, CardMunicipio, CardIndicador,
    │                          TabelaComparativa, BarraBusca, GraficoBarras,
    │                          EstadoDados, RodapeSite, Icones
    ├── paginas/               Inicio, Municipios, Indicadores, Sobre, NaoEncontrada
    ├── estilos/               base.css (tokens, tipografia) e componentes.css
    └── dados/municipios_ma.json    Cópia local do Censo 2022, usada só em reserva
```

Cada componente corresponde a um bloco que a versão da Nota 1 já marcava com o comentário `<!-- Componente: X -->`. A migração foi recorte, não reescrita.

## Rotas

| Rota | Página |
|---|---|
| `/` | Início: panorama do estado e os oito municípios mais populosos |
| `/municipios` | Grade com busca, filtro e ordenação (`?q=`, `?regiao=`, `?ordem=`) |
| `/municipios/:id` | Indicadores do município e comparação com outro |
| `/sobre` | Problema, ODS, público-alvo, fontes e equipe |

## Fonte dos dados

Duas consultas à API pública do IBGE, feitas em paralelo com a Fetch API e combinadas pelo código do município:

- Relação dos municípios: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/21/municipios`
- População, área e densidade (Censo 2022, tabela 4714 do SIDRA, variáveis 93, 6318 e 614): `https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93|6318|614?localidades=N6[N3[21]]`

Nenhuma das duas exige chave de acesso. Nenhum valor é estimado pela equipe.

## Tecnologias

| Requisito da Nota 2 | Implementação |
|---|---|
| JavaScript ES6+, DOM e eventos | Módulos ES, `async/await`, eventos de formulário, teclado e clique tratados em React |
| Fetch API e JSON | `src/servicos/ibge.js`, com tempo limite e tratamento de erro |
| React: componentes | 13 componentes de função em `src/componentes/` |
| Gerenciamento de estado | `useState`, `useReducer` e Context (`DadosContext`), filtros na URL (`useSearchParams`) |
| Navegação e SPA | React Router 7, rotas aninhadas e rota 404 |
| Responsividade | Bootstrap 5 e CSS próprio, de 360px a 1440px |
| Testes | Vitest sobre parser da API, filtros, ordenação e formatação |
| Publicação | Vite gera `dist/`; Netlify serve com reescrita de rotas |

## Acessibilidade

Herdada da Nota 1 e mantida: contraste medido nos dois temas, foco visível, link para pular ao conteúdo, rótulos em todos os campos, alvos de toque de 44px, `aria-live` no resultado da busca e transições desligadas sob `prefers-reduced-motion`.

## Licença dos recursos

Dados do IBGE, de uso público. Ícones desenhados pela equipe em SVG. Bootstrap sob licença MIT.
