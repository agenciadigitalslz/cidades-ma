import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import CabecalhoSite from './componentes/CabecalhoSite.jsx';
import RodapeSite from './componentes/RodapeSite.jsx';
import Inicio from './paginas/Inicio.jsx';
import Municipios from './paginas/Municipios.jsx';
import Indicadores from './paginas/Indicadores.jsx';
import Comparar from './paginas/Comparar.jsx';
import Mapa from './paginas/Mapa.jsx';
import Sobre from './paginas/Sobre.jsx';
import NaoEncontrada from './paginas/NaoEncontrada.jsx';

const CAMPOS_DE_TEXTO = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/* Atalho de teclado: a barra ("/") leva à busca de municípios e a foca,
   de qualquer página. Ignorado quando a pessoa já está digitando. */
function useAtalhoBusca() {
  const navegar = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (CAMPOS_DE_TEXTO.has(document.activeElement?.tagName)) return;
      e.preventDefault();
      if (pathname !== '/municipios') navegar('/municipios');
      setTimeout(() => document.getElementById('busca-municipio')?.focus(), 60);
    };
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [navegar, pathname]);
}

/* Arquitetura de página única: o cabeçalho e o rodapé ficam montados e só o
   miolo troca conforme a rota. O navegador nunca recarrega o documento. */
export default function App() {
  useAtalhoBusca();
  return (
    <>
      <a className="pular-para-conteudo" href="#conteudo">Pular para o conteúdo</a>
      <CabecalhoSite />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/municipios" element={<Municipios />} />
          <Route path="/municipios/:id" element={<Indicadores />} />
          <Route path="/comparar" element={<Comparar />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
      <RodapeSite />
    </>
  );
}
