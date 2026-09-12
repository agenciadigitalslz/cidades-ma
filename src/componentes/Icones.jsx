/* Ícones monoline em SVG, herdando a cor do texto. Nunca emoji. */

export function IconeCidade(props) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V8l6-4v17" />
      <path d="M11 21V11h8v10" />
      <path d="M15 15h1M15 18h1" />
    </svg>
  );
}

export function IconeBanco(props) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  );
}

export function IconeBusca(props) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconeLua(props) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function IconeSol(props) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

/* Silhueta urbana do topo. Decorativa, portanto aria-hidden. */
export function MarcaDagua() {
  return (
    <svg className="marca-dagua" viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <path d="M8 192h304" />
      <path d="M28 192V96l44-26v122" />
      <path d="M72 192V60l40 22v110" />
      <path d="M112 192v-78h52v78" />
      <path d="M164 192V38l46 26v128" />
      <path d="M210 192v-62h44v62" />
      <path d="M254 192V78l40 22v92" />
      <path d="M44 112v14M44 140v14M56 112v14M56 140v14" />
      <path d="M86 84v14M86 112v14M86 140v14M98 84v14M98 112v14M98 140v14" />
      <path d="M128 132v12M144 132v12M128 158v12M144 158v12" />
      <path d="M178 62v14M178 90v14M178 118v14M194 62v14M194 90v14M194 118v14" />
      <path d="M224 148v14M240 148v14" />
      <path d="M268 102v14M268 130v14M282 102v14M282 130v14" />
    </svg>
  );
}
