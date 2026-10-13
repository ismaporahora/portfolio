// shared.jsx — Planificando v2 · tokens, icons, primitives, sample data
// Loaded as a Babel script; exports everything to window at the end.

// ── Theme ────────────────────────────────────────────────
// Re-skinned to the "Look & Feel" graphic language (Notion-clean, warm ink,
// violet brand, Figtree). The whole prototype reads the global `T`; rebuild it
// from Tweaks via buildTheme() and reassign `T` so every screen re-skins at
// once. All Babel scripts share global scope, so reassigning `T` here is seen
// by every component at render time.
const THEME_BRANDS = {
  '#6D28D9': { brand: '#6D28D9', tint: '#EEE7FB', deep: '#5B21B6', hov: '#F4F0FC' },  // violet (default)
  '#4F47E6': { brand: '#4F47E6', tint: '#ECEBFD', deep: '#3E37C4', hov: '#F3F2FE' },  // indigo
  '#0E9F6E': { brand: '#0E9F6E', tint: '#E4F5EE', deep: '#0B7E58', hov: '#EEF8F3' },  // teal
  '#0B7FD6': { brand: '#0B7FD6', tint: '#E6F1FB', deep: '#0A66AD', hov: '#EDF6FD' },  // blue
};
const THEME_INKS = {
  'cálido': { ink: '#37352F', ink2: '#6B6862', muted: '#9B9A97', faint: '#C9C7C1' },
  'frío':   { ink: '#1F2329', ink2: '#586070', muted: '#9097A1', faint: '#C4C9D0' },
};
const THEME_FONTS = {
  'Figtree':         "'Figtree', system-ui, sans-serif",
  'Inter':           "'Inter', system-ui, sans-serif",
  'Hanken Grotesk':  "'Hanken Grotesk', system-ui, sans-serif",
  'Public Sans':     "'Public Sans', system-ui, sans-serif",
};
const THEME_DEFAULTS = {
  brand: '#6D28D9', ink: 'cálido', bg: '#F8F7F3', font: 'Figtree',
  marker: 'sin marcador', btn: 'redondeado', logoColor: '#6D28D9',
  cardRadius: 'medias', cardEnfasis: 'borde', aiIcon: 'chispa',
};

function buildTheme(tw) {
  const t = { ...THEME_DEFAULTS, ...(tw || {}) };
  const B = THEME_BRANDS[t.brand] || THEME_BRANDS['#6D28D9'];
  const ink = THEME_INKS[t.ink] || THEME_INKS['cálido'];
  const font = THEME_FONTS[t.font] || THEME_FONTS.Figtree;
  const cr = { 'nítido': 8, 'medias': 12, 'suaves': 16 }[t.cardRadius] || 12;
  const shadow = t.cardEnfasis === 'sombra';
  return {
    bg:        t.bg,
    bgDeep:    t.bg === '#FFFFFF' ? '#F4F2ED' : '#F1EFE9',
    surface:   '#FFFFFF',
    ink: ink.ink, ink2: ink.ink2, muted: ink.muted, faint: ink.faint,
    border:    '#E9E7E1',
    borderSoft:'#F1EFE9',
    // brand — violet, brand + primary actions ONLY
    brand: B.brand, brandDeep: B.deep, brandTint: B.tint,
    brandInk:  B.deep,      // accessible text/icon color on the light brand tint
    onBrand:   '#FFFFFF',   // text on the solid brand fill (primary buttons)
    // subject accents (warm, harmonised with the calmer palette)
    lengua:    '#C9762B',
    lenguaDeep:'#A85F1E',
    lenguaTint:'#FAF0E5',
    mate:      '#0B7FD6',
    mateDeep:  '#0A66AD',
    mateTint:  '#E6F1FB',
    // utility
    yellow:    '#E0A33C',
    errorTint: '#FCEDED',
    error:     '#D04545',
    font, head: font,
    // style tokens (driven by Tweaks)
    marker:    t.marker,                                   // none | tile | rule
    btnRadius: t.btn === 'píldora' ? 44 : 12,              // rounded vs pill
    brandHover: B.hov,                                     // light-violet hover for buttons/cards
    aiIcon:    t.aiIcon || 'chispa',                       // IA / generate glyph
    cardRadius: cr,                                        // content-card corners
    cardBorder: shadow ? '#F1EFE9' : '#E9E7E1',
    cardShadowCss: shadow ? '0 1px 2px rgba(0,0,0,.04), 0 8px 20px -10px rgba(0,0,0,.16)' : 'none',
    logoColor: t.logoColor || B.brand,
    radius: 12, radiusLg: 16, radiusSm: 10,
  };
}

let T = buildTheme();

// Violet is the only accent now — subjectTheme keeps the subject label but
// maps every subject to the brand colour.
const subjectTheme = (m) => ({
  color: T.brand, deep: T.brandDeep, tint: T.brandTint,
  label: m === 'matematica' ? 'Matemática' : 'Lengua',
});

// ── Icons (inline SVG, Lucide-style) ─────────────────────
const ICON_PATHS = {
  pencil: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
  'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></>,
  clipboard: <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h4"/></>,
  'arrow-right': <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
  'arrow-left': <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
  check: <path d="M20 6 9 17l-5-5"/>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  minus: <path d="M5 12h14"/>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></>,
  sparkles: <><path d="M9.5 3 11 7.5 15.5 9 11 10.5 9.5 15 8 10.5 3.5 9 8 7.5z"/><path d="M18 4l.7 2.1L21 7l-2.3.9L18 10l-.7-2.1L15 7l2.3-.9z"/></>,
  // — IA / generate glyphs (filled) —
  chispa: <path d="M12 4.5c.5 4.6 2.9 7 7.5 7.5C14.9 12.5 12.5 14.9 12 19.5 11.5 14.9 9.1 12.5 4.5 12 9.1 11.5 11.5 9.1 12 4.5Z"/>,
  destello: <path d="M12 2.5 13.7 10.3 21.5 12 13.7 13.7 12 21.5 10.3 13.7 2.5 12 10.3 10.3Z"/>,
  chispas2: <><path d="M10 2.5 11.3 8 16.8 9.3 11.3 10.6 10 16 8.7 10.6 3.2 9.3 8.7 8Z"/><path d="M17.5 12.5 18.2 15.3 21 16 18.2 16.7 17.5 19.5 16.8 16.7 14 16 16.8 15.3Z"/></>,
  estrella: <path d="M12 3.2l2.6 5.7 6.2.7-4.6 4.2 1.2 6.1L12 17.6 6.4 19.9l1.2-6.1L3 9.6l6.2-.7z"/>,
  rayo: <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z"/>,
  'chevron-down': <path d="m6 9 6 6 6-6"/>,
  'chevron-right': <path d="m9 18 6-6-6-6"/>,
  x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></>,
  share: <><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
  'book-open': <><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></>,
  calculator: <><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  'map-pin': <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
  lightbulb: <><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></>,
  info: <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>,
  'message-circle': <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>,
  search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
  globe: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></>,
  folder: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>,
  paperclip: <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>,
  'corner-down': <><path d="M9 10l-5 5 5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
  refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  wand: <><path d="m3 21 9-9"/><path d="M15 4V2M15 10V8M11 6H9M21 6h-2M18.4 3.4l-1.4 1.4M18.4 8.6 17 7.2"/></>,
  'layout-dashboard': <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
  'file-check': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></>,
  'gauge': <><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></>,
  'building': <><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></>,
  'cpu': <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></>,
  'trend-up': <><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></>,
  'trend-down': <><path d="M22 17 13.5 8.5 8.5 13.5 2 7"/><path d="M16 17h6v-6"/></>,
  'more-horizontal': <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
  'external-link': <><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
  'alert-triangle': <><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
  'filter': <path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/>,
  'link': <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
  'trash': <><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  'dollar': <><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  'thumbs-up': <><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></>,
  'thumbs-down': <><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></>,
  'git-branch': <><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></>,
  'calendar': <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  'upload': <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></>,
  'flag': <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
};

const FILLED_ICONS = ['chispa', 'destello', 'chispas2', 'estrella', 'rayo'];
const Icon = ({ name, size = 18, color = 'currentColor', strokeWidth = 2, style }) => {
  const filled = FILLED_ICONS.includes(name);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill={filled ? color : 'none'} stroke={filled ? 'none' : color}
         strokeWidth={filled ? 0 : strokeWidth} strokeLinecap="round" strokeLinejoin="round"
         style={{ flexShrink: 0, display: 'block', ...style }}>
      {ICON_PATHS[name] || null}
    </svg>
  );
};

// ── Logo ─────────────────────────────────────────────────
// Wordmark in Montserrat Alternates so the brand colour is tweakable. height
// maps to a cap size so existing height={22|26} call sites stay balanced.
const Logo = ({ height = 26 }) => (
  <span style={{ fontFamily: "'Montserrat Alternates', system-ui, sans-serif", fontWeight: 600,
    fontSize: height * 0.84, letterSpacing: '-0.01em', lineHeight: 1, color: T.logoColor,
    display: 'inline-block' }}>Planificando</span>
);

// ── Buttons ──────────────────────────────────────────────
const PillButton = ({ children, variant = 'primary', size = 'md', icon, iconRight,
                      onClick, disabled, style, full }) => {
  const [h, setH] = React.useState(false);
  const pad = size === 'lg' ? '14px 26px' : size === 'sm' ? '8px 16px' : '11px 22px';
  const fs = size === 'lg' ? 16 : size === 'sm' ? 13 : 14.5;
  const variants = {
    primary: { bg: h ? T.brandDeep : T.brand, fg: T.onBrand, bd: 'transparent' },
    ghost:   { bg: h ? T.brandHover : 'transparent', fg: T.ink, bd: T.border },
    soft:    { bg: h ? T.brandHover : T.surface, fg: T.ink, bd: T.border },
    quiet:   { bg: h ? T.brandHover : 'transparent', fg: T.ink2, bd: 'transparent' },
  };
  const v = disabled ? { bg: '#ECE9E1', fg: T.faint, bd: 'transparent' } : variants[variant];
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: pad, borderRadius: T.btnRadius, border: `1.5px solid ${v.bd}`,
        background: v.bg, color: v.fg, fontFamily: T.font, fontSize: fs, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 160ms ease',
        width: full ? '100%' : 'auto', whiteSpace: 'nowrap', ...style,
      }}>
      {icon && <Icon name={icon} size={fs + 2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={fs + 2} />}
    </button>
  );
};

const IconButton = ({ name, onClick, size = 36, title, accent, style }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: size, height: size, borderRadius: 44, flexShrink: 0,
        border: `1.5px solid ${h ? (accent || T.ink) : T.border}`,
        background: h ? T.brandHover : T.surface, color: accent || T.ink2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 150ms ease', ...style,
      }}>
      <Icon name={name} size={size * 0.46} />
    </button>
  );
};

// ── Form fields ──────────────────────────────────────────
const Field = ({ value, onChange, placeholder, accent = T.brand, autoFocus, onKeyDown, style }) => {
  const [f, setF] = React.useState(false);
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      autoFocus={autoFocus} onFocus={() => setF(true)} onBlur={() => setF(false)} onKeyDown={onKeyDown}
      style={{
        width: '100%', padding: '13px 16px', borderRadius: 12,
        border: `1.5px solid ${f ? accent : T.border}`,
        boxShadow: f ? `0 0 0 4px ${accent}22` : 'none',
        fontFamily: T.font, fontSize: 15.5, color: T.ink, background: T.surface,
        outline: 'none', transition: 'all 150ms ease', ...style,
      }} />
  );
};

const TextArea = ({ value, onChange, placeholder, accent = T.brand, rows = 4, autoFocus, style }) => {
  const [f, setF] = React.useState(false);
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      rows={rows} autoFocus={autoFocus} onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{
        width: '100%', padding: '13px 16px', borderRadius: 12, resize: 'vertical',
        border: `1.5px solid ${f ? accent : T.border}`,
        boxShadow: f ? `0 0 0 4px ${accent}22` : 'none',
        fontFamily: T.font, fontSize: 15, lineHeight: 1.6, color: T.ink, background: T.surface,
        outline: 'none', transition: 'all 150ms ease', ...style,
      }} />
  );
};

const UploadZone = ({ label = 'Subí o arrastrá un archivo', hint = 'PDF, Word o imagen', accent = T.brand, onPick, files = [] }) => {
  const [h, setH] = React.useState(false);
  return (
    <div>
      <div onClick={onPick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{
          border: `1.5px dashed ${h ? accent : T.border}`, borderRadius: 14,
          background: h ? `${accent}0E` : T.bgDeep, padding: '22px 18px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          cursor: 'pointer', transition: 'all 150ms ease', textAlign: 'center',
        }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}1F`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="upload" size={19} color={accent} />
        </div>
        <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink }}>{label}</div>
        <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>{hint}</div>
      </div>
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 10, background: T.surface, border: `1px solid ${T.border}` }}>
              <Icon name="file-text" size={16} color={accent} />
              <span style={{ fontFamily: T.font, fontSize: 13.5, color: T.ink, flex: 1 }}>{f}</span>
              <Icon name="check" size={15} color={T.brandDeep} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Subject label (inline text, no container) ────────────
const SubjectLabel = ({ materia, size = 11 }) => {
  const s = subjectTheme(materia);
  return (
    <span style={{ fontFamily: T.font, fontSize: size, fontWeight: 700, color: s.color,
      textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
  );
};

// ── Sample data ──────────────────────────────────────────
const SAVED_GRADES = [
  { id: 'g1', name: '2° A', school: 'Escuela N° 12 · D.E. 9', students: 24,
    note: 'Grupo muy conversador. Tres estudiantes con apoyo de integración. Vienen trabajando bien la lectura en voz alta.', files: 1 },
  { id: 'g2', name: '3° B', school: 'Escuela N° 12 · D.E. 9', students: 27,
    note: 'Niveles dispares en matemática: varios resuelven cálculos de dos cifras y otros todavía necesitan material concreto.', files: 0 },
  { id: 'g3', name: '1° C', school: 'Instituto Belgrano', students: 21,
    note: 'Primer año de alfabetización inicial. Mucho entusiasmo, tiempos de atención cortos.', files: 2 },
];

// contenidos nodales por grado+materia (diseño curricular CABA — muestra)
const NODAL = {
  'lengua-1': ['Reconocimiento de sonidos y letras', 'Lectura de palabras y frases breves', 'Escritura del propio nombre y palabras conocidas', 'Escucha y renarración de cuentos', 'La conversación: pedir y dar la palabra'],
  'lengua-2': ['Lectura de textos narrativos', 'La descripción de personajes y lugares', 'Escritura de textos breves con propósito', 'Reflexión sobre el lenguaje: el sustantivo', 'Lectura en voz alta y fluidez', 'Producción colectiva de textos'],
  'lengua-3': ['Lectura inferencial de cuentos', 'Producción escrita: la carta y la noticia', 'El texto instructivo', 'Reflexión sobre el lenguaje: familia de palabras', 'Revisión y reescritura de textos propios'],
  'matematica-1': ['Números naturales hasta el 100', 'Conteo y correspondencia', 'Suma y resta en situaciones cotidianas', 'Figuras geométricas básicas', 'Medida: comparación de longitudes'],
  'matematica-2': ['Números naturales hasta el 1000', 'Suma y resta con dificultades', 'Introducción a la multiplicación', 'Figuras geométricas y sus elementos', 'Medida: longitud, tiempo y dinero', 'Resolución de problemas de varios pasos'],
  'matematica-3': ['Números hasta el 10.000', 'Estrategias de multiplicación', 'Iniciación a la división', 'Fracciones de uso frecuente', 'Perímetro y figuras', 'Problemas con más de una operación'],
};

const UNIVERSOS = ['El cruce de los Andes', 'Los dinosaurios', 'El fondo del mar', 'La granja', 'El espacio y los planetas', 'Los pueblos originarios'];

const GRADES_OPTIONS = ['1° grado', '2° grado', '3° grado'];

Object.assign(window, {
  T, buildTheme, THEME_BRANDS, THEME_INKS, THEME_FONTS, THEME_DEFAULTS,
  subjectTheme, Icon, Logo, PillButton, IconButton, Field, TextArea, UploadZone,
  SubjectLabel, SAVED_GRADES, NODAL, UNIVERSOS, GRADES_OPTIONS,
});
