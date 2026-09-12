import { useTitulo } from '../hooks/useTitulo.js';
import { URL_LOCALIDADES, URL_CENSO } from '../servicos/ibge.js';
import Destaque from '../componentes/Destaque.jsx';

export default function Sobre() {
  useTitulo('Sobre');
  return (
    <>
      <Destaque
        rotulo="Projeto acadêmico"
        titulo="Sobre o Cidades MA"
        chamada="Aplicação desenvolvida para a disciplina de Desenvolvimento Web do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas da UEMA / UEMAnet."
      />

      <section className="secao">
        <div className="container">
          <div className="row g-5">
            <div className="col-12 col-lg-7 texto-longo">
              <h2>O problema</h2>
              <p>
                Os indicadores urbanos dos municípios maranhenses são públicos e existem: população,
                densidade demográfica, área territorial, saneamento e coleta de resíduos. Entretanto,
                estão dispersos em portais técnicos do IBGE, organizados por código de tabela e
                concebidos para o uso de pesquisadores.
              </p>
              <p>
                Quem precisa desses dados para decidir ou para cobrar, como vereadores, conselhos
                municipais, jornalistas locais, estudantes e moradores, não consegue consultá-los nem
                compará-los de forma simples. O dado existe, mas não chega a quem deveria utilizá-lo.
              </p>

              <h2 className="mt-5">O ODS 11 e a meta 11.3</h2>
              <p>
                O Objetivo de Desenvolvimento Sustentável 11 trata de tornar as cidades e os
                assentamentos humanos inclusivos, seguros, resilientes e sustentáveis. A meta 11.3
                pede especificamente o aumento da capacidade para o planejamento participativo e
                integrado.
              </p>
              <p>
                Dado público que a população não consegue ler não sustenta participação social. É
                essa lacuna que a aplicação procura reduzir.
              </p>

              <h2 className="mt-5">Público-alvo</h2>
              <ul>
                <li>Gestores e conselhos municipais, para embasar decisões e planos diretores</li>
                <li>Imprensa local, para apurar pautas a partir de dado oficial</li>
                <li>Estudantes e professores, em pesquisas escolares e trabalhos acadêmicos</li>
                <li>Moradores, para compreender e cobrar a situação do próprio município</li>
              </ul>
            </div>

            <div className="col-12 col-lg-5 texto-longo">
              <h2>Como os dados chegam</h2>
              <p>
                Ao abrir a aplicação, o navegador faz duas consultas em paralelo à API pública do
                IBGE, com a Fetch API, e combina as respostas em JSON pelo código do município:
              </p>
              <ul>
                <li>
                  Relação dos municípios do Maranhão, com micro e mesorregião:{' '}
                  <a href={URL_LOCALIDADES} target="_blank" rel="noopener noreferrer">API de Localidades</a>
                </li>
                <li>
                  População residente, área territorial e densidade demográfica do Censo 2022,
                  tabela 4714 do SIDRA: <a href={URL_CENSO} target="_blank" rel="noopener noreferrer">API de Agregados</a>
                </li>
              </ul>
              <p>
                Se a API não responder em dez segundos, a aplicação usa uma cópia dos mesmos dados
                gravada no pacote e avisa na tela que está em modo de reserva. Nenhum valor é
                estimado pela equipe.
              </p>

              <h2 className="mt-5">Tecnologias</h2>
              <p>
                A primeira versão foi construída com HTML5 semântico, CSS3 e Bootstrap 5. Nesta
                segunda versão, a aplicação foi reorganizada em React, com componentes, estado
                compartilhado por contexto, navegação de página única com React Router e
                empacotamento com Vite. A cor de destaque reproduz o laranja oficial do ODS 11.
              </p>

              <h2 className="mt-5">Equipe</h2>
              <ul>
                <li>André da Silva Lopes</li>
                <li>Andressa de Jesus Nunes de Souza</li>
                <li>Pedro Aurélio Cutrim da Rocha Lima</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
