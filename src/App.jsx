import { Routes, Route } from 'react-router-dom';
import CabecalhoSite from './componentes/CabecalhoSite.jsx';
import RodapeSite from './componentes/RodapeSite.jsx';
import Inicio from './paginas/Inicio.jsx';
import Municipios from './paginas/Municipios.jsx';
import Indicadores from './paginas/Indicadores.jsx';
import Comparar from './paginas/Comparar.jsx';
import Sobre from './paginas/Sobre.jsx';
import NaoEncontrada from './paginas/NaoEncontrada.jsx';

/* Arquitetura de página única: o cabeçalho e o rodapé ficam montados e só o
   miolo troca conforme a rota. O navegador nunca recarrega o documento. */
export default function App() {
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
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
      <RodapeSite />
    </>
  );
}
