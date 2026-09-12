import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilos/base.css';
import './estilos/componentes.css';
import { DadosProvider } from './contexto/DadosContext.jsx';
import App from './App.jsx';

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <BrowserRouter>
      <DadosProvider>
        <App />
      </DadosProvider>
    </BrowserRouter>
  </StrictMode>,
);
