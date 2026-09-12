import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import BotaoTema from './BotaoTema.jsx';
import { IconeCidade } from './Icones.jsx';

const LINKS = [
  { para: '/', rotulo: 'Início', exato: true },
  { para: '/municipios', rotulo: 'Municípios' },
  { para: '/sobre', rotulo: 'Sobre' },
];

/* Cabeçalho com navegação de página única. O menu retrátil é controlado por
   estado React, e não pelo script do Bootstrap: o clique alterna, a troca de
   rota fecha, e a tecla Escape fecha. */
export default function CabecalhoSite() {
  const { pathname } = useLocation();
  /* Guarda em qual rota o menu foi aberto: ao navegar, a rota muda e o menu
     passa a contar como fechado sem precisar de efeito. */
  const [abertoEm, setAbertoEm] = useState(null);
  const aberto = abertoEm === pathname;
  const setAberto = (valor) => setAbertoEm(valor ? pathname : null);

  useEffect(() => {
    if (!aberto) return undefined;
    const aoTeclar = (e) => e.key === 'Escape' && setAbertoEm(null);
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aberto]);

  return (
    <header className="cabecalho-site">
      <nav className="navbar navbar-expand-md container" aria-label="Navegação principal">
        <Link className="navbar-brand" to="/">
          <span className="marca-sigla" aria-hidden="true">
            <IconeCidade />
          </span>{' '}
          Cidades MA
        </Link>
        <div className="d-flex align-items-center order-md-last">
          <BotaoTema />
          <button
            className="navbar-toggler ms-2"
            type="button"
            aria-controls="menu-principal"
            aria-expanded={aberto}
            aria-label={aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            onClick={() => setAberto(!aberto)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className={`collapse navbar-collapse justify-content-end${aberto ? ' show' : ''}`} id="menu-principal">
          <ul className="navbar-nav">
            {LINKS.map(({ para, rotulo, exato }) => (
              <li className="nav-item" key={para}>
                <NavLink className="nav-link" to={para} end={exato}>
                  {rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
