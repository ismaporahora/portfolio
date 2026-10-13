// gradehome2.jsx — "El grado como proyecto"
// Home del grado con patrones de proyectos de IA:
//  · identidad visual por grado (ícono + color) en un sidebar
//  · knowledge base como panel lateral permanente y colapsable
//  · empty state que guía (prompts sugeridos / categorías)
//  · citas clickeables que abren la fuente (drawer con el pasaje)
//  · feedback de generación en vivo (streaming token a token + Detener)
// Reusa tokens y primitivas de shared.jsx / steps.jsx / result.jsx.

// ── Identidad visual por grado ───────────────────────────
const IDENTITY = {
  g1: { icon: 'book-open', hue: '#6D28D9', tint: '#EEE7FB', deep: '#5B21B6' },
  g2: { icon: 'lightbulb', hue: '#0B7FD6', tint: '#E6F1FB', deep: '#0A66AD' },
  g3: { icon: 'estrella',  hue: '#0E9F6E', tint: '#E4F5EE', deep: '#0B7E58' },
};
const idOf = (gid, override) => ({ ...(IDENTITY[gid] || IDENTITY.g1), ...(override || {}) });

const IDENTITY_COLORS = [
  { hue: '#6D28D9', tint: '#EEE7FB', deep: '#5B21B6' },
  { hue: '#0B7FD6', tint: '#E6F1FB', deep: '#0A66AD' },
  { hue: '#0E9F6E', tint: '#E4F5EE', deep: '#0B7E58' },
  { hue: '#C9762B', tint: '#FAF0E5', deep: '#A85F1E' },
  { hue: '#D04576', tint: '#FBE9F0', deep: '#A8345C' },
];
const IDENTITY_ICONS = ['book-open', 'lightbulb', 'estrella', 'users', 'globe', 'calculator'];

// ── Fuentes citables (knowledge del grado) ───────────────
const SOURCES = {
  'nap-lengua': {
    kind: 'NAP', title: 'Lengua · Primer Ciclo',
    org: 'Núcleos de Aprendizajes Prioritarios — Ministerio de Educación',
    loc: 'Documento oficial · pág. 28',
    snippet: 'La lectura compartida y la renarración de textos narrativos, identificando la secuencia de acciones y los personajes.',
    passage: 'El reconocimiento de la lectura como práctica social y la frecuentación y exploración asidua de variados textos en distintos escenarios y circuitos de lectura. La lectura compartida y la renarración de textos narrativos, identificando la secuencia de acciones y los personajes principales, con la colaboración del docente, en torno a lo literario.',
  },
  'dc-caba-lengua': {
    kind: 'Diseño Curricular', title: 'Prácticas del Lenguaje · CABA',
    org: 'Diseño Curricular — GCBA, Educación Primaria',
    loc: 'Tomo 1 · Prácticas del Lenguaje · pág. 112',
    snippet: 'Leer, escuchar leer y comentar diversidad de textos narrativos avanzando hacia la autonomía.',
    passage: 'Se propone que los niños participen de situaciones de lectura cada vez más autónomas: leer, escuchar leer y comentar diversidad de textos narrativos (cuentos tradicionales, fábulas, leyendas), reconstruyendo el hilo argumental y caracterizando a los personajes, avanzando progresivamente hacia la lectura por sí mismos.',
  },
};

// ── Citation chip (clickeable) ───────────────────────────
const Cite = ({ n, onClick, accent }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'baseline',
        fontFamily: T.font, fontSize: 11, fontWeight: 700, lineHeight: 1,
        color: h ? '#fff' : accent, background: h ? accent : `${accent}1F`,
        border: 'none', borderRadius: 5, padding: '2px 5px', margin: '0 1px', cursor: 'pointer',
        transition: 'all 120ms ease', transform: 'translateY(-1px)' }}>{n}</button>
  );
};

// ── Source drawer (abre el pasaje exacto) ────────────────
const SourceDrawer = ({ open, accent, onClose }) => {
  const ext = open && open !== 'ctx' ? SOURCES[open] : null;
  const isCtx = open === 'ctx';
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(24,20,16,.28)' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 440, background: T.surface,
        boxShadow: '-20px 0 60px rgba(0,0,0,.18)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: `1px solid ${T.borderSoft}` }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: T.head, fontSize: 15,
            fontWeight: 700, color: T.ink }}>
            <Icon name="file-text" size={17} color={accent} /> Fuente citada
          </span>
          <IconButton name="x" size={32} onClick={onClose} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          {isCtx ? (
            <React.Fragment>
              <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: accent }}>Contexto del grupo · cargado por vos</span>
              <h3 style={{ fontFamily: T.head, fontSize: 19, fontWeight: 700, color: T.ink, margin: '8px 0 4px' }}>2° A</h3>
              <p style={{ fontFamily: T.font, fontSize: 13, color: T.muted, margin: '0 0 18px' }}>Escuela N° 12 · D.E. 9</p>
              <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 16 }}>
                <p style={{ fontFamily: T.font, fontSize: 15.5, color: T.ink, lineHeight: 1.7, margin: 0 }}>
                  {GROUP_CONTEXT}
                </p>
              </div>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 22, border: 'none',
                background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 13.5, fontWeight: 600,
                color: accent }}><Icon name="pencil" size={14} color={accent} /> Editar el contexto del grupo</button>
            </React.Fragment>
          ) : ext ? (
            <React.Fragment>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: T.font, fontSize: 11,
                fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: accent,
                background: `${accent}14`, padding: '4px 9px', borderRadius: 6 }}>{ext.kind}</span>
              <h3 style={{ fontFamily: T.head, fontSize: 19, fontWeight: 700, color: T.ink, margin: '12px 0 4px',
                lineHeight: 1.25 }}>{ext.title}</h3>
              <p style={{ fontFamily: T.font, fontSize: 13, color: T.muted, margin: '0 0 20px', lineHeight: 1.5 }}>{ext.org}</p>
              <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: T.muted, marginBottom: 8 }}>Pasaje citado</div>
              <div style={{ borderRadius: 14, background: T.bgDeep, padding: '18px 20px', position: 'relative' }}>
                <p style={{ fontFamily: T.font, fontSize: 15.5, color: T.ink, lineHeight: 1.75, margin: 0 }}>
                  {hlSnippet(ext.passage, ext.snippet, accent)}
                </p>
              </div>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ display: 'inline-flex', alignItems: 'center',
                gap: 8, marginTop: 20, fontFamily: T.font, fontSize: 14, fontWeight: 600, color: accent,
                textDecoration: 'none' }}>
                Abrir el documento original <ExtArrow color={accent} />
              </a>
              <p style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, marginTop: 6 }}>{ext.loc}</p>
            </React.Fragment>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ExtArrow = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3h6v6M11 3L4 10" />
  </svg>
);
const hlSnippet = (passage, snippet, color) => {
  const i = passage.indexOf(snippet);
  if (i < 0) return passage;
  return <>{passage.slice(0, i)}<mark style={{ background: `${color}26`, color: T.ink, borderRadius: 3,
    padding: '1px 2px', fontWeight: 600 }}>{snippet}</mark>{passage.slice(i + snippet.length)}</>;
};

// ── Sidebar de grados (identidad + cambio rápido) ────────
const ProjectSidebar = ({ gradeId, onPick, identity }) => (
  <aside style={{ width: 250, flexShrink: 0, background: T.surface, borderRight: `1px solid ${T.borderSoft}`,
    display: 'flex', flexDirection: 'column', padding: '18px 12px' }}>
    <div style={{ padding: '0 8px 16px' }}><Logo height={21} /></div>
    <div style={{ fontFamily: T.font, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em',
      textTransform: 'uppercase', color: T.muted, padding: '4px 10px 8px' }}>Mis grados</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {SAVED_GRADES.map(g => {
        const id = g.id === gradeId ? identity : idOf(g.id);
        const on = g.id === gradeId;
        return (
          <button key={g.id} onClick={() => onPick(g.id)} style={{ display: 'flex', alignItems: 'center', gap: 11,
            padding: '9px 10px', borderRadius: 11, border: 'none', cursor: 'pointer', textAlign: 'left',
            background: on ? id.tint : 'transparent', transition: 'background 140ms' }}>
            <span style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: on ? id.hue : T.bgDeep,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={id.icon} size={16} color={on ? '#fff' : T.ink2} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.font, fontSize: 14.5, fontWeight: on ? 700 : 600,
                color: on ? id.deep : T.ink }}>{g.name}</div>
              <div style={{ fontFamily: T.font, fontSize: 11.5, color: T.muted, whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis' }}>{(PLANS_BY_GRADE[g.id] || []).length} planificaciones</div>
            </div>
          </button>
        );
      })}
    </div>
    <button style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px', marginTop: 6, borderRadius: 11,
      border: `1.5px dashed ${T.border}`, background: 'transparent', cursor: 'pointer',
      fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.ink2 }}>
      <Icon name="plus" size={16} /> Nuevo grado
    </button>
    <div style={{ flex: 1 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[['file-text', 'Mis planificaciones'], ['book-open', 'Biblioteca']].map(([ic, lb]) => (
        <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 10px', borderRadius: 10,
          fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.ink2, cursor: 'pointer' }}>
          <Icon name={ic} size={16} color={T.ink2} /> {lb}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginTop: 4 }}>
        <span style={{ width: 28, height: 28, borderRadius: 28, background: T.brandTint, color: T.brandDeep, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.head, fontSize: 12, fontWeight: 700 }}>S</span>
        <span style={{ fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.ink }}>Sofía</span>
      </div>
    </div>
  </aside>
);

// ── Knowledge base (panel lateral colapsable) ────────────
const KbSection = ({ icon, title, count, accent, open, onToggle, children }) => (
  <div style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
    <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%',
      padding: '13px 4px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
      <Icon name={icon} size={15} color={accent} />
      <span style={{ flex: 1, fontFamily: T.head, fontSize: 13.5, fontWeight: 700, color: T.ink }}>{title}</span>
      {count != null && <span style={{ fontFamily: T.font, fontSize: 11.5, fontWeight: 700, color: T.muted,
        background: T.bgDeep, borderRadius: 20, padding: '2px 8px' }}>{count}</span>}
      <Icon name="chevron-down" size={15} color={T.muted}
        style={{ transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform .18s' }} />
    </button>
    {open && <div style={{ padding: '0 4px 14px' }}>{children}</div>}
  </div>
);

const KnowledgePanel = ({ identity, collapsed, onExpand, onCollapse, onOpenSource }) => {
  const [open, setOpen] = React.useState({ contexto: true, archivos: true, contenidos: true });
  const tog = (k) => setOpen(o => ({ ...o, [k]: !o[k] }));
  const acc = identity.hue;

  if (collapsed) return (
    <div style={{ width: 56, flexShrink: 0, background: T.surface, borderLeft: `1px solid ${T.borderSoft}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: 14 }}>
      <button onClick={onExpand} title="Abrir conocimiento" style={{ width: 36, height: 36, borderRadius: 10,
        border: `1px solid ${T.border}`, background: T.surface, cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="chevron-right" size={16} color={T.ink2} style={{ transform: 'rotate(180deg)' }} />
      </button>
      {['info', 'paperclip', 'book-open'].map(ic => (
        <span key={ic} style={{ width: 36, height: 36, borderRadius: 10, background: identity.tint,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={ic} size={16} color={acc} /></span>
      ))}
    </div>
  );

  return (
    <aside style={{ width: 312, flexShrink: 0, background: T.surface, borderLeft: `1px solid ${T.borderSoft}`,
      display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 18px 12px' }}>
        <div>
          <div style={{ fontFamily: T.head, fontSize: 15, fontWeight: 800, color: T.ink }}>Conocimiento</div>
          <div style={{ fontFamily: T.font, fontSize: 12, color: T.muted }}>Lo que el grado ya sabe</div>
        </div>
        <IconButton name="chevron-right" size={30} onClick={onCollapse} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px' }}>
        <KbSection icon="info" title="Contexto del grupo" accent={acc} open={open.contexto} onToggle={() => tog('contexto')}>
          <div onClick={() => onOpenSource('ctx')} style={{ cursor: 'pointer', borderRadius: 11, background: T.bgDeep,
            padding: '12px 13px' }}>
            <p style={{ fontFamily: T.font, fontSize: 13, color: T.ink2, lineHeight: 1.55, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {SAVED_GRADES[0].note}</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontFamily: T.font,
              fontSize: 12, fontWeight: 600, color: acc }}><Icon name="pencil" size={12} color={acc} /> Editar</span>
          </div>
        </KbSection>

        <KbSection icon="paperclip" title="Archivos" count={2} accent={acc} open={open.archivos} onToggle={() => tog('archivos')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[['Lista de estudiantes.pdf', 'file-text'], ['Diagnóstico inicial.docx', 'file-text']].map(([f, ic]) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 10,
                border: `1px solid ${T.border}`, cursor: 'pointer' }}>
                <Icon name={ic} size={15} color={acc} />
                <span style={{ flex: 1, fontFamily: T.font, fontSize: 12.5, color: T.ink, whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis' }}>{f}</span>
              </div>
            ))}
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 10,
              border: `1.5px dashed ${T.border}`, background: 'transparent', cursor: 'pointer',
              fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.ink2 }}>
              <Icon name="plus" size={14} /> Subir un archivo
            </button>
          </div>
        </KbSection>

        <KbSection icon="book-open" title="Contenidos de referencia" count={2} accent={acc}
          open={open.contenidos} onToggle={() => tog('contenidos')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {Object.entries(SOURCES).map(([id, s]) => (
              <div key={id} onClick={() => onOpenSource(id)} style={{ borderRadius: 11, border: `1px solid ${T.border}`,
                padding: '11px 12px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <span style={{ fontFamily: T.font, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                    textTransform: 'uppercase', color: acc, background: `${acc}14`, padding: '2px 7px', borderRadius: 5 }}>{s.kind}</span>
                  <span style={{ fontFamily: T.head, fontSize: 12.5, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
                </div>
                <p style={{ fontFamily: T.font, fontSize: 12, color: T.muted, lineHeight: 1.5, margin: 0,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.snippet}</p>
              </div>
            ))}
          </div>
        </KbSection>
      </div>
      <div style={{ padding: 14, borderTop: `1px solid ${T.borderSoft}` }}>
        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%',
          padding: '10px', borderRadius: 11, border: 'none', background: identity.tint, cursor: 'pointer',
          fontFamily: T.font, fontSize: 13, fontWeight: 700, color: identity.deep }}>
          <Icon name="plus" size={15} color={identity.deep} /> Sumar al conocimiento
        </button>
      </div>
    </aside>
  );
};

// ── Streaming de generación (token a token + Detener) ────
const SUGGESTED_CLASES = 4;

const STREAM_PARTS = (gradeName, clases = SUGGESTED_CLASES) => ([
  { text: `Listo, pensé una secuencia para ${gradeName}. Parte de los saberes previos del grupo y avanza hacia la lectura autónoma de textos narrativos` },
  { cite: 'nap-lengua' },
  { text: `. Tomé el contexto que cargaste —grupo conversador, con tres estudiantes con apoyo de integración— para graduar las consignas` },
  { cite: 'ctx' },
  { text: `, y seguí la progresión del Diseño Curricular de CABA para Prácticas del Lenguaje` },
  { cite: 'dc-caba-lengua' },
  { text: `. Quedó en ${clases} clases, como pediste.` },
]);

// ── Cantidad de clases · varias formas de mostrarlo ──────
const ClaseStepper = ({ value, onChange, min = 2, max = 16 }) => {
  const rnd = (dis) => ({ width: 34, height: 34, borderRadius: 999, border: `1px solid ${T.border}`,
    background: T.surface, cursor: dis ? 'not-allowed' : 'pointer', opacity: dis ? 0.4 : 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s' });
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} title="Una menos"
        style={rnd(value <= min)} className="ng-chip"><Icon name="minus" size={16} color={T.ink} /></button>
      <span style={{ minWidth: 34, textAlign: 'center', fontFamily: T.head, fontSize: 22, fontWeight: 700, color: T.ink }}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} title="Una más"
        style={rnd(value >= max)} className="ng-chip"><Icon name="plus" size={16} color={T.ink} /></button>
    </div>
  );
};

const ClaseSelector = ({ ui = 'pastillas', value, onChange, suggested, acc }) => {
  if (ui === 'stepper') return <ClaseStepper value={value} onChange={onChange} />;

  if (ui === 'slider' || ui === 'marcas' || ui === 'burbuja') {
    const min = 2, max = 12;
    const pct = ((value - min) / (max - min)) * 100;
    const track = (
      <input type="range" className="gh-range" min={min} max={max} step={1} value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
        style={{ width: '100%', '--acc': acc,
          background: `linear-gradient(90deg, ${acc} ${pct}%, ${T.bgDeep} ${pct}%)` }} />
    );

    if (ui === 'burbuja') {
      return (
        <div style={{ maxWidth: 400 }}>
          <div style={{ position: 'relative', height: 32 }}>
            <span style={{ position: 'absolute', top: 0, left: `calc(${pct}% + ${(0.5 - pct / 100) * 22}px)`,
              transform: 'translateX(-50%)', background: acc, color: '#fff', fontFamily: T.head, fontSize: 12.5,
              fontWeight: 700, padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap' }}>{value} clases</span>
          </div>
          {track}
        </div>
      );
    }

    if (ui === 'marcas') {
      const ticks = []; for (let i = min; i <= max; i += 2) ticks.push(i);
      return (
        <div style={{ maxWidth: 400 }}>
          {track}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
            {ticks.map(t => (
              <span key={t} style={{ fontFamily: T.font, fontSize: 11.5, fontWeight: t === value ? 700 : 500,
                color: t === value ? acc : T.muted }}>{t}</span>
            ))}
          </div>
        </div>
      );
    }

    // slider lineal con el valor al costado
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, maxWidth: 440 }}>
        <div style={{ flex: 1 }}>{track}</div>
        <span style={{ minWidth: 82, textAlign: 'right', fontFamily: T.head, fontSize: 16, fontWeight: 700, color: T.ink }}>
          {value} clases</span>
      </div>
    );
  }

  // pastillas (default) — fila de números, el sugerido marcado
  const opts = [];
  for (let i = 4; i <= 12; i++) opts.push(i);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {opts.map(n => {
        const on = n === value;
        const sug = n === suggested;
        return (
          <button key={n} onClick={() => onChange(n)} title={sug ? 'Sugerido por la IA' : undefined}
            style={{ position: 'relative', minWidth: 44, height: 44, borderRadius: 12, cursor: 'pointer',
              border: `1.5px solid ${on ? acc : (sug ? `${acc}66` : T.border)}`,
              background: on ? acc : T.surface, color: on ? '#fff' : T.ink,
              fontFamily: T.head, fontSize: 16, fontWeight: 700, transition: 'all .12s' }}>
            {n}
            {sug && !on && <span style={{ position: 'absolute', top: -5, right: -5, width: 14, height: 14,
              borderRadius: 999, background: acc, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 0 2px ${T.surface}` }}>
              <Icon name={T.aiIcon} size={9} color="#fff" /></span>}
          </button>
        );
      })}
    </div>
  );
};

// contexto del grupo que la IA tiene en cuenta (editable · compartido con "Lo que sé de…")
const DEFAULT_BRIEFS = {
  g1: 'Grupo conversador y participativo. La mayoría lee palabras y frases cortas; tres estudiantes con apoyo de integración y les cuesta sostener consignas largas.',
  g2: 'Niveles dispares en matemática: varios resuelven cálculos de dos cifras, otros todavía necesitan material concreto. Trabajan bien en parejas.',
  g3: 'Grupo en alfabetización inicial, con mucho entusiasmo por aprender. Tiempos de atención cortos; funciona mejor con juego y movimiento.',
};
const DEFAULT_FACTS = {
  g1: ['Grupo conversador y participativo', 'La mayoría lee palabras y frases cortas',
    '3 estudiantes con apoyo de integración', 'Les cuesta sostener consignas largas'],
  g2: ['Niveles dispares en matemática', 'Varios resuelven cálculos de dos cifras',
    'Otros todavía necesitan material concreto', 'Trabajan bien en parejas'],
  g3: ['Alfabetización inicial', 'Mucho entusiasmo por aprender',
    'Tiempos de atención cortos', 'Funciona mejor con juego y movimiento'],
};

// fila de hecho editable inline (click para editar)
const EditableFact = ({ value, onChange, acc }) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => { setDraft(value); }, [value]);
  const commit = () => { const v = draft.trim(); onChange(v || value); setEditing(false); };
  return (
    <div className="gh-factrow" style={{ display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 8px', margin: '0 -8px', borderRadius: 8, transition: 'background .12s' }}>
      {editing ? (
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
          style={{ flex: 1, border: `1px solid ${acc}`, borderRadius: 8, outline: 'none', padding: '6px 10px',
            fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink, background: T.surface }} />
      ) : (
        <span onClick={() => setEditing(true)} style={{ flex: 1, fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink,
          lineHeight: 1.5, cursor: 'text' }}>{value}</span>
      )}
      {!editing && (
        <button onClick={() => setEditing(true)} className="gh-factedit" style={{ border: 'none', background: 'transparent',
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, opacity: 0, transition: 'opacity .12s',
          fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.brandDeep }}>
          <Icon name="pencil" size={12} color={T.brandDeep} /> Editar</button>
      )}
    </div>
  );
};

// chip para sumar un dato directamente (pill punteada, como el producto)
const AddFactRow = ({ onAdd, acc, label = '¿Algo más que deba considerar?', placeholder = 'Escribí algo del grupo…' }) => {
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const commit = () => { const v = draft.trim(); if (v) onAdd(v); setDraft(''); setAdding(false); };
  if (adding) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', margin: '4px -8px 0' }}>
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
        placeholder={placeholder}
        style={{ flex: 1, border: `1px solid ${acc}`, borderRadius: 8, outline: 'none', padding: '6px 10px',
          fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink, background: T.surface }} />
    </div>
  );
  return (
    <button onClick={() => setAdding(true)} className="ng-chip" style={{ display: 'inline-flex', alignItems: 'center',
      gap: 7, padding: '8px 14px', marginTop: 10, borderRadius: 44, border: `1.5px dashed ${T.border}`,
      background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink2,
      alignSelf: 'flex-start' }}>
      <Icon name="plus" size={14} color={T.ink2} /> {label}</button>
  );
};

// pill punteada que abre el popup de «Lo que sé de…» con una pregunta dinámica
const FactChipButton = ({ label, onClick }) => (
  <button onClick={onClick} className="ng-chip" style={{ display: 'inline-flex', alignItems: 'center',
    gap: 7, padding: '8px 14px', borderRadius: 44, border: `1.5px dashed ${T.border}`,
    background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink2,
    alignSelf: 'flex-start', transition: 'background .12s' }}>
    <Icon name="plus" size={14} color={T.ink2} /> {label}</button>
);

// preguntas dinámicas del chip (rotan según los huecos del contexto)
const PREGUNTAS_MEMORIA = [
  '¿Algo más que deba tener en cuenta?',
  '¿Cómo vienen con la lectura?',
  '¿Cómo vienen con los números y el cálculo?',
  '¿Cómo es la dinámica del grupo para trabajar juntos?',
  '¿Hay estudiantes que necesiten algún apoyo en particular?',
  '¿Cuántos estudiantes son y cómo se organizan?',
];
const preguntaParaMemoria = (texto) => {
  const t = (texto || '').toLowerCase();
  if (!/lectura|leer|escritura/.test(t)) return '¿Cómo vienen con la lectura?';
  if (!/matem|números|cálculo|conteo|suma/.test(t)) return '¿Cómo vienen con los números y el cálculo?';
  if (!/apoyo|integración/.test(t)) return '¿Hay estudiantes que necesiten algún apoyo en particular?';
  if (!/grupo de|estudiantes son|\d+ (chicos|estudiantes)/.test(t)) return '¿Cuántos estudiantes son y cómo se organizan?';
  return PREGUNTAS_MEMORIA[0];
};
const preguntaParaRepaso = (texto, { materia, contenido } = {}) => {
  if (contenido) {
    const c = contenido.length > 60 ? contenido.slice(0, 60) + '…' : contenido;
    return `¿Qué saben tus estudiantes sobre ${c.toLowerCase()}?`;
  }
  return '¿Qué saben tus estudiantes sobre este contenido?';
};

const InfoTip = ({ text }) => {
  const [show, setShow] = React.useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button onClick={() => setShow(s => !s)} title="De dónde sale" style={{ border: 'none', background: 'transparent',
        cursor: 'pointer', display: 'inline-flex', padding: 2, borderRadius: 999, lineHeight: 0 }}>
        <Icon name="info" size={15} color={show ? T.ink2 : T.muted} />
      </button>
      {show && (
        <span role="tooltip" style={{ position: 'absolute', bottom: 'calc(100% + 7px)', left: 0, width: 236, zIndex: 30,
          background: T.ink, color: '#fff', fontFamily: T.font, fontSize: 12, fontWeight: 500, lineHeight: 1.5,
          padding: '10px 12px', borderRadius: 10, boxShadow: '0 12px 32px rgba(11,27,102,.28)' }}>{text}</span>
      )}
    </span>
  );
};

// botón de salida con confirmación (X arriba a la derecha)
const ExitButton = ({ onExit }) => {
  const [ask, setAsk] = React.useState(false);
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: -6, right: 0, zIndex: 10 }}>
        <IconButton name="x" size={34} onClick={() => setAsk(true)} title="Salir" />
      </div>
      {ask && (
        <div onClick={() => setAsk(false)} style={{ position: 'fixed', inset: 0, zIndex: 70,
          background: 'rgba(20,18,30,.34)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} className="gh-fade" style={{ width: 380, background: T.surface,
            borderRadius: 18, border: `1px solid ${T.border}`, boxShadow: '0 30px 80px -24px rgba(11,27,102,.4)',
            padding: '24px 24px 20px' }}>
            <div style={{ fontFamily: T.head, fontSize: 18, fontWeight: 800, color: T.ink }}>¿Salir sin generar?</div>
            <p style={{ fontFamily: T.font, fontSize: 14, color: T.ink2, lineHeight: 1.55, margin: '8px 0 20px' }}>
              Vas a perder lo que armaste hasta acá. Podés volver a empezar cuando quieras.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => { setAsk(false); onExit(); }} style={{ padding: '10px 16px', borderRadius: 44,
                border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 13.5,
                fontWeight: 600, color: '#D64545' }}>Salir</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setAsk(false)} style={{ padding: '10px 18px', borderRadius: 44,
                border: 'none', background: T.ink, cursor: 'pointer', fontFamily: T.font, fontSize: 13.5,
                fontWeight: 700, color: '#fff' }}>Seguir acá</button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

// "Atrás" chico (izquierda del footer)
const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none',
    background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.muted }}>
    <Icon name="arrow-left" size={16} color={T.muted} /> Atrás</button>
);

// valor editable con opciones fijas (ej. Materia) · dropdown como el de Grupo
const EditableChoice = ({ value, options, onChange, acc }) => {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', h, true);
    return () => document.removeEventListener('pointerdown', h, true);
  }, [open]);
  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div className="gh-factrow" onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 8px', margin: '0 -8px', borderRadius: 8, transition: 'background .12s', cursor: 'pointer' }}>
        <span style={{ flex: 1, fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink }}>{value}</span>
        <button className="gh-factedit" style={{ flexShrink: 0, border: 'none',
          background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
          opacity: 0, transition: 'opacity .12s', fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>
          <Icon name="chevron-down" size={13} color={T.brandDeep} /> Cambiar</button>
      </div>
      {open && (
        <div className="gh-fade" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: -8, minWidth: 200, zIndex: 40,
          background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`,
          boxShadow: '0 18px 44px -12px rgba(11,27,102,.22)', overflow: 'hidden', padding: 6 }}>
          {options.map(o => {
            const on = o === value;
            return (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }} className="gh-row"
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 11px',
                  borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ flex: 1, fontFamily: T.font, fontSize: 14, fontWeight: on ? 700 : 500, color: T.ink }}>{o}</span>
                {on && <Icon name="check" size={14} color={acc} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// grupo editable · dropdown con los grados cargados o crear uno nuevo
const EditableGradePick = ({ value, onChange, onNewGrade, acc }) => {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', h, true);
    return () => document.removeEventListener('pointerdown', h, true);
  }, [open]);
  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div className="gh-factrow" onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 8px', margin: '0 -8px', borderRadius: 8, transition: 'background .12s', cursor: 'pointer' }}>
        <span style={{ flex: 1, fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink }}>{value}</span>
        <button className="gh-factedit" style={{ flexShrink: 0, border: 'none', background: 'transparent',
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, opacity: 0, transition: 'opacity .12s',
          fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>
          <Icon name="chevron-down" size={13} color={T.brandDeep} /> Cambiar</button>
      </div>
      {open && (
        <div className="gh-fade" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: -8, minWidth: 250, zIndex: 40,
          background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`,
          boxShadow: '0 18px 44px -12px rgba(11,27,102,.22)', overflow: 'hidden', padding: 6 }}>
          {SAVED_GRADES.map(gr => {
            const on = gr.name === value;
            return (
              <button key={gr.id} onClick={() => { onChange(gr.name); setOpen(false); }} className="gh-row"
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 11px',
                  borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ flex: 1, fontFamily: T.font, fontSize: 14, fontWeight: on ? 700 : 500, color: T.ink }}>{gr.name}</span>
                <span style={{ fontFamily: T.font, fontSize: 11.5, color: T.muted }}>{gr.school}</span>
                {on && <Icon name="check" size={14} color={acc} />}
              </button>
            );
          })}
          <div style={{ height: 1, background: T.borderSoft, margin: '5px 4px' }}></div>
          <button onClick={() => { setOpen(false); onNewGrade && onNewGrade(); }} className="gh-row"
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 11px',
              borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
            <Icon name="plus" size={14} color={T.brandDeep} />
            <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.brandDeep }}>Crear un grado nuevo</span>
          </button>
        </div>
      )}
    </div>
  );
};

const FieldRow = ({ label, first, top, children }) => (
  <div className="gh-fieldrow" style={{ display: 'flex', gap: 18, padding: '15px 0', alignItems: top ? 'flex-start' : 'center',
    borderTop: first ? 'none' : `1px solid ${T.borderSoft}` }}>
    <div style={{ width: 104, flexShrink: 0, fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.muted,
      paddingTop: top ? 3 : 0 }}>{label}</div>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

// valor editable inline · "Editar" aparece en hover, a la derecha
const EditableValue = ({ value, onChange, acc }) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => { setDraft(value); }, [value]);
  const commit = () => { const v = draft.trim(); onChange(v || value); setEditing(false); };
  if (editing) return (
    <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
      style={{ width: '100%', border: `1px solid ${acc}`, borderRadius: 8, outline: 'none', padding: '6px 10px',
        fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink, background: T.surface }} />
  );
  return (
    <div className="gh-factrow" onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 8px', margin: '0 -8px', borderRadius: 8, transition: 'background .12s', cursor: 'text' }}>
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink }}>{value}</span>
      <button className="gh-factedit" style={{ flexShrink: 0, border: 'none',
        background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
        opacity: 0, transition: 'opacity .12s', fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>
        <Icon name="pencil" size={12} color={T.brandDeep} /> Editar</button>
    </div>
  );
};

// valor editable con sugerencias de contenidos del diseño curricular (ambas materias)
const EditableContentValue = ({ value, onChange, onPickMateria, gradeName, acc }) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => { setDraft(value); }, [value]);
  const level = gradoLevel(gradeName);
  const pool = [...(NODAL[`lengua-${level}`] || []).map(c => ({ c, m: 'lengua' })),
                ...(NODAL[`matematica-${level}`] || []).map(c => ({ c, m: 'matematica' }))];
  const q = draft.trim().toLowerCase();
  const matches = editing && q ? pool.filter(o => o.c.toLowerCase().includes(q) && o.c.toLowerCase() !== q).slice(0, 6) : [];
  const commit = () => { const v = draft.trim(); onChange(v || value); setEditing(false); };
  const pick = (o) => { onChange(o.c); if (onPickMateria) onPickMateria(o.m); setEditing(false); };
  if (editing) return (
    <div style={{ position: 'relative' }}>
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
        style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${acc}`, borderRadius: 8, outline: 'none', padding: '6px 10px',
          fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink, background: T.surface }} />
      {matches.length > 0 && (
        <div className="gh-fade" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40,
          background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`,
          boxShadow: '0 18px 44px -12px rgba(11,27,102,.22)', overflow: 'hidden' }}>
          <div style={{ padding: '8px 13px', fontFamily: T.font, fontSize: 11, fontWeight: 700,
            color: T.muted, textTransform: 'uppercase', letterSpacing: '0.05em',
            borderBottom: `1px solid ${T.borderSoft}` }}>
            Contenidos del diseño curricular · {level}° grado
          </div>
          {matches.map((o, i) => (
            <button key={i} onMouseDown={e => e.preventDefault()} onClick={() => pick(o)} className="gh-row"
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 13px',
                border: 'none', borderBottom: i < matches.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              <Icon name={o.m === 'matematica' ? 'calculator' : 'book-open'} size={15} color={acc} />
              <span style={{ flex: 1, fontFamily: T.font, fontSize: 14, color: T.ink }}>{o.c}</span>
              <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                textTransform: 'uppercase', color: T.muted }}>{o.m === 'matematica' ? 'Matemática' : 'Lengua'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
  return (
    <div className="gh-factrow" onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 8px', margin: '0 -8px', borderRadius: 8, transition: 'background .12s', cursor: 'text' }}>
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink }}>{value}</span>
      <button className="gh-factedit" style={{ flexShrink: 0, border: 'none',
        background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
        opacity: 0, transition: 'opacity .12s', fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>
        <Icon name="pencil" size={12} color={T.brandDeep} /> Editar</button>
    </div>
  );
};

// ── Banco de textos (Lengua) · muestra del futuro banco (~40 en Biblioteca) ──
const TEXT_BANK = [
  { id: 't1', title: 'La nube que quería tocar el mar', author: 'Relato · adaptación', tema: 'Cuento · textos narrativos',
    grado: '2°', palabras: 360,
    excerpt: 'Había una vez una nube pequeña y curiosa que vivía muy alto en el cielo y miraba el mar todos los días.',
    passage: 'Había una vez una nube pequeña y curiosa que vivía muy alto en el cielo, más arriba que los pájaros y que las copas de los árboles más grandes. Todas las mañanas, apenas salía el sol, se asomaba con cuidado por el borde del cielo y miraba el mar, allá abajo, tan azul y tan enorme que le costaba creer que fuera de verdad. Se pasaba horas preguntándose cómo sería tocar el agua, si estaría fría o tibia, si haría cosquillas o si sonaría como cuando llovía sobre los techos. Las otras nubes, que eran grandes y perezosas, se reían de ella: “Las nubes vivimos en el cielo”, le decían, “el mar no es asunto nuestro”. Pero la nubecita no dejaba de mirar hacia abajo y de soñar. Un día de mucho viento, una ráfaga la empujó despacito hacia el sur. La nube viajó sobre montañas nevadas, sobre ciudades llenas de luces y sobre campos amarillos donde los caballos levantaban la cabeza para verla pasar. Cuanto más viajaba, más pequeña se sentía, pero también más valiente. A medida que avanzaba hacia el mar, el aire se fue poniendo cada vez más frío. La nubecita empezó a temblar y, sin darse cuenta, sus bordes se volvieron gotitas pesadas. Primero cayó una gota, después otra, y enseguida se convirtió en una lluvia finita y alegre que descendió, gota a gota, justo sobre las olas. Y entonces sucedió lo que tanto había soñado: al tocar el agua, la nube dejó de ser nube y pasó a formar parte del mar. Ya no lo miraba desde arriba, lejana y curiosa: ahora era una ola más, que subía y bajaba con las demás, que mojaba la arena y volvía a empezar. Con el tiempo, el sol la levantaría otra vez hacia el cielo, y ella volvería a ser nube. Pero nunca olvidaría que, para conocer de verdad algo, a veces hay que animarse a formar parte de eso que tanto miramos de lejos.' },
  { id: 't2', title: 'El zorro y el racimo de uvas', author: 'Fábula · tradición de Esopo', tema: 'Fábula · enseñanza',
    grado: '2°', palabras: 160,
    excerpt: 'Un zorro caminaba con mucha hambre cuando vio, colgando de una parra, un racimo de uvas brillantes.',
    passage: 'Un zorro caminaba con mucha hambre por el campo cuando vio, colgando de una parra bien alta, un racimo de uvas brillantes. Dio un salto para alcanzarlas, pero no llegó. Probó otra vez, tomando carrera, y tampoco. Lo intentó una y otra vez hasta quedar cansado. Al final, se dio media vuelta y dijo, encogiéndose de hombros: “Seguro que están verdes”. Y siguió su camino. A veces, cuando algo nos cuesta, preferimos decir que no lo queríamos.' },
  { id: 't3', title: 'Martina y la semilla', author: 'Relato · adaptación', tema: 'Cuento · secuencia narrativa',
    grado: '2°', palabras: 190,
    excerpt: 'Martina encontró una semilla chiquita en el patio de la escuela y decidió cuidarla hasta ver qué pasaba.',
    passage: 'Martina encontró una semilla chiquita en el patio de la escuela. La guardó en su bolsillo y, al llegar a casa, la plantó en una maceta con tierra. Todos los días la regaba un poquito y la ponía cerca de la ventana. Pasaron muchos días sin que sucediera nada. Martina casi se olvida de la maceta, hasta que una mañana vio un brote verde asomando de la tierra. Con el tiempo, aquel brote se convirtió en una planta con flores. Martina aprendió que las cosas importantes necesitan paciencia.' },
  { id: 't4', title: 'El ratón de campo y el de ciudad', author: 'Fábula · tradición de Esopo', tema: 'Fábula · comparación',
    grado: '2°', palabras: 175,
    excerpt: 'Un ratón de campo invitó a su primo de la ciudad a comer pan y semillas bajo la sombra de un árbol.',
    passage: 'Un ratón de campo invitó a su primo de la ciudad a comer pan y semillas bajo la sombra de un árbol. El de ciudad, acostumbrado a manjares, lo invitó entonces a su casa. Allí había quesos y tortas, pero cada vez que empezaban a comer, aparecían el gato y la gente y tenían que esconderse asustados. El ratón de campo, cansado de tantos sustos, se despidió: “Prefiero mi pan tranquilo antes que tus quesos con miedo”. Y volvió contento a su campo.' },
];
const suggestTexts = (contenido) => TEXT_BANK.slice(0, 2);

// tarjeta de texto sugerida (leer + seleccionar)
const TextCard = ({ t, selected, onSelect }) => {
  const [read, setRead] = React.useState(false);
  return (
    <div onClick={() => setRead(r => !r)} style={{ borderRadius: 15, cursor: 'pointer', background: T.surface,
      border: `1.5px solid ${selected ? T.brand : T.border}`,
      boxShadow: selected ? `0 0 0 3px ${T.brand}1F` : '0 1px 4px rgba(11,27,102,.05)',
      transition: 'border-color .15s, box-shadow .15s', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: '16px 18px' }}>
        <span onClick={(e) => { e.stopPropagation(); onSelect(); }} title="Elegir este texto"
          style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0, marginTop: 2, cursor: 'pointer',
          border: `2px solid ${selected ? T.brand : T.border}`, background: selected ? T.brand : T.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
          {selected && <Icon name="check" size={13} color="#fff" />}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div onClick={(e) => { e.stopPropagation(); onSelect(); }}
            style={{ fontFamily: T.head, fontSize: 16, fontWeight: 700, color: T.ink, cursor: 'pointer', display: 'inline-block' }}>{t.title}</div>
          <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, marginTop: 2 }}>
            {t.author} · {t.tema} · {t.palabras} palabras</div>
          <p style={{ fontFamily: T.font, fontSize: 14, color: T.ink2, lineHeight: 1.6, margin: '10px 0 0' }}>
            {read ? t.passage : t.excerpt}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
            fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>
            <Icon name="chevron-down" size={14} color={T.brandDeep}
              style={read ? { transform: 'rotate(180deg)' } : undefined} />
            {read ? 'Mostrar menos' : 'Leer el texto completo'}</div>
        </div>
      </div>
    </div>
  );
};

const TextPicker = ({ gradeName, identity, prompt, selectedId, onSelect, onContinue, onBack, onExit, modoPropio = false }) => {
  const acc = identity.hue;
  const texts = React.useMemo(() => suggestTexts(prompt), [prompt]);
  const [sel, setSel] = React.useState(selectedId || null);
  const [uploaded, setUploaded] = React.useState(null);
  const [titulo, setTitulo] = React.useState('');
  const [pegado, setPegado] = React.useState('');
  const pick = (t) => { setSel(t.id); onSelect && onSelect(t); };
  const doUpload = () => {
    const up = { id: 'upload', title: titulo.trim() || 'texto-narrativo.pdf', author: 'Subido por vos', tema: 'Texto propio', palabras: null };
    setUploaded(up); pick(up);
  };
  const propioListo = uploaded || pegado.trim();
  const propioObj = () => uploaded || { id: 'upload', title: titulo.trim() || 'Texto propio',
    author: 'Subido por vos', tema: 'Texto propio', palabras: null, passage: pegado.trim() || null };
  const selObj = sel === 'upload' ? (uploaded || (propioListo ? propioObj() : null)) : texts.find(x => x.id === sel);

  // modo propio — sin sugerencias del banco ni Biblioteca; solo cargar/pegar
  if (modoPropio) return (
    <div style={{ maxWidth: 660, margin: '0 auto', position: 'relative' }}>
      <ExitButton onExit={onExit} />
      <QuestionShell prompt="Cargá tu propio texto"
        sub="Las planificaciones de Lengua se apoyan en un texto. Pegá o subí el que querés trabajar.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 8 }}>Título del texto</div>
            <Field value={titulo} onChange={setTitulo} placeholder="Ej. La vaca que puso un huevo" autoFocus />
          </div>
          {uploaded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 15,
              background: T.surface, border: `1.5px solid ${T.brand}`, boxShadow: `0 0 0 3px ${T.brand}1F` }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: T.brandTint,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="file-text" size={18} color={T.brandDeep} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.head, fontSize: 15, fontWeight: 700, color: T.ink }}>{uploaded.title}</div>
                <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, marginTop: 1 }}>Subido por vos · lo usamos como base</div>
              </div>
              <button onClick={() => { setUploaded(null); setSel(null); }}
                title="Quitar" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={16} color={T.muted} /></button>
            </div>
          ) : (
            <button onClick={doUpload} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '18px', borderRadius: 15, border: `1.5px dashed ${T.border}`, background: 'transparent',
              cursor: 'pointer', fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink2 }} className="ng-chip">
              <Icon name="upload" size={17} color={T.ink2} /> Subí o arrastrá tu texto
              <span style={{ fontWeight: 500, color: T.faint }}>· PDF o Word (.docx)</span></button>
          )}
          <div>
            <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 8 }}>…o pegá el texto acá</div>
            <TextArea value={pegado} onChange={setPegado} rows={5} placeholder="Pegá el texto acá…" />
          </div>
        </div>
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14 }}>
          <BackBtn onClick={onBack} />
          <div style={{ flex: 1 }} />
          <button onClick={onBack} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.muted }}>Cancelar</button>
          <PillButton size="lg" iconRight="arrow-right" disabled={!propioListo}
            onClick={() => propioListo && onContinue(propioObj())}>Usar este texto</PillButton>
        </div>
      </QuestionShell>
    </div>
  );

  return (
    <div style={{ maxWidth: 660, margin: '0 auto', position: 'relative' }}>
      <ExitButton onExit={onExit} />
      <QuestionShell prompt="Elegí un texto para trabajar"
        sub={`Las planificaciones de Lengua se apoyan en un texto. Para “${(prompt || 'este contenido').toLowerCase()}” te sugiero estos dos. Leelos y elegí el que mejor te sirva, o subí el tuyo.`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          {texts.map(t => (
            <TextCard key={t.id} t={t} selected={sel === t.id} onSelect={() => pick(t)} />
          ))}
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 12, border: 'none',
          background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: T.font, fontSize: 13,
          fontWeight: 600, color: T.brandDeep }}>
          <Icon name="book-open" size={15} color={T.brandDeep} /> Ver más textos en la Biblioteca</button>

        {/* subir texto propio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.borderSoft }} />
          <span style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.faint }}>o</span>
          <div style={{ flex: 1, height: 1, background: T.borderSoft }} />
        </div>
        {uploaded ? (
          <div onClick={() => pick(uploaded)} style={{ display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer',
            padding: '14px 16px', borderRadius: 15, background: T.surface,
            border: `1.5px solid ${sel === 'upload' ? T.brand : T.border}`,
            boxShadow: sel === 'upload' ? `0 0 0 3px ${T.brand}1F` : 'none', transition: 'all .15s' }}>
            <span style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0,
              border: `2px solid ${sel === 'upload' ? T.brand : T.border}`, background: sel === 'upload' ? T.brand : T.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {sel === 'upload' && <Icon name="check" size={13} color="#fff" />}</span>
            <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: T.brandTint,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="file-text" size={18} color={T.brandDeep} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.head, fontSize: 15, fontWeight: 700, color: T.ink }}>{uploaded.title}</div>
              <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, marginTop: 1 }}>Subido por vos · lo usamos como base</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setUploaded(null); if (sel === 'upload') setSel(null); }}
              title="Quitar" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={16} color={T.muted} /></button>
          </div>
        ) : (
          <button onClick={doUpload} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '18px', borderRadius: 15, border: `1.5px dashed ${T.border}`, background: 'transparent',
            cursor: 'pointer', fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink2 }} className="ng-chip">
            <Icon name="upload" size={17} color={T.ink2} /> Subir mi propio texto
            <span style={{ fontWeight: 500, color: T.faint }}>· PDF, Word o imagen</span></button>
        )}

        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14 }}>
          <BackBtn onClick={onBack} />
          <div style={{ flex: 1 }} />
          <PillButton size="lg" iconRight="arrow-right" disabled={!selObj}
            onClick={() => selObj && onContinue(selObj)}>Continuar</PillButton>
        </div>
      </QuestionShell>
    </div>
  );
};

// contenido de la fila "Texto" en la revisión (leer + cambiar)
const SelectedText = ({ texto, onChange }) => (
  <div className="gh-factrow" onClick={onChange} style={{ display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '7px 8px', margin: '0 -8px', borderRadius: 8, transition: 'background .12s', cursor: 'pointer' }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink }}>{texto.title}</div>
      <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, marginTop: 3 }}>
        {typeof texto.palabras === 'number' ? `${texto.author} · ${texto.tema} · ${texto.palabras} palabras` : `${texto.author} · texto propio`}</div>
    </div>
    <button className="gh-factedit" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5,
      border: 'none', background: 'transparent', cursor: 'pointer', opacity: 0, transition: 'opacity .12s',
      fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>
      <Icon name="refresh" size={13} color={T.brandDeep} /> Cambiar texto</button>
  </div>
);

// ── Universo temático (opcional · como en el prototipo) ──
const UniversoPicker = ({ gradeName, identity, value, onContinue, onSkip, onBack, onExit }) => {
  const acc = identity.hue;
  const [sel, setSel] = React.useState(value || null);
  const [custom, setCustom] = React.useState('');
  const chosen = custom.trim() || sel;
  return (
    <div style={{ maxWidth: 660, margin: '0 auto', position: 'relative' }}>
      <ExitButton onExit={onExit} />
      <QuestionShell prompt="¿Querés situarlo en algún universo temático?"
        sub="Le da un hilo narrativo a la secuencia y hace las consignas más atractivas para el grupo. Es opcional.">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {UNIVERSOS.map(u => {
            const on = sel === u && !custom.trim();
            return (
              <button key={u} onClick={() => { setSel(u); setCustom(''); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 44,
                  cursor: 'pointer', fontFamily: T.font, fontSize: 13.5, fontWeight: 600,
                  border: `1.5px solid ${on ? T.brand : T.border}`, background: on ? T.brandTint : T.surface,
                  color: on ? T.brandDeep : T.ink2, transition: 'all .13s' }}>
                {on && <Icon name="check" size={13} color={T.brandDeep} />} {u}</button>
            );
          })}
        </div>
        <input value={custom} onChange={e => { setCustom(e.target.value); if (e.target.value) setSel(null); }}
          placeholder="…o escribí tu propio universo temático"
          style={{ width: '100%', marginTop: 14, padding: '11px 14px', borderRadius: 12, border: `1.5px solid ${T.border}`,
            outline: 'none', fontFamily: T.font, fontSize: 14.5, color: T.ink, background: T.surface }} />
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14 }}>
          <BackBtn onClick={onBack} />
          <div style={{ flex: 1 }} />
          <button onClick={onSkip} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.muted }}>Saltear</button>
          <PillButton size="lg" iconRight="arrow-right" disabled={!chosen}
            onClick={() => onContinue(chosen)}>Continuar</PillButton>
        </div>
      </QuestionShell>
    </div>
  );
};

// ── Saber previo en el repaso — chip de pregunta (Enter confirma) + banner de otras preguntas ──
const SP_EXTRA = '¿Algo más que deba tener en cuenta?';
const SP_OTRAS = PREGUNTAS_MEMORIA.filter(q => q !== SP_EXTRA);

// chip punteado con la pregunta · al tocarlo se abre el campo, Enter confirma
const PreguntaChip = ({ question, acc, onCommit }) => {
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const commit = () => { const v = draft.trim(); if (v) onCommit(question, v); setDraft(''); setAdding(false); };
  if (!adding) return <FactChipButton label={question} onClick={() => setAdding(true)} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: T.font, fontSize: 13.5,
        fontWeight: 600, lineHeight: 1.4, color: T.ink }}>
        <Icon name={T.aiIcon} size={13} color={T.brand} />{question}</span>
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
        placeholder="Escribí lo que observaste y apretá Enter"
        style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${acc}`, borderRadius: 8, outline: 'none',
          padding: '8px 11px', fontFamily: T.font, fontSize: 14.5, fontWeight: 500, color: T.ink, background: T.surface }} />
    </div>
  );
};

const SaberPrevio = ({ question, acc, onOpenMemoria }) => {
  const [answers, setAnswers] = React.useState([]);
  const [queue, setQueue] = React.useState([question, SP_EXTRA]);
  const [jump, setJump] = React.useState(null);
  const [dismissed, setDismissed] = React.useState(false);
  const done = answers.map(a => a.q);
  const active = (jump && !done.includes(jump)) ? jump : queue.find(q => !done.includes(q));
  const otras = SP_OTRAS.filter(q => !queue.includes(q) && !done.includes(q));
  const commit = (q, v) => setAnswers(l => [...l, { q, a: v }]);
  const ask = (q) => { setQueue(l => l.includes(q) ? l : [...l, q]); setJump(q); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch' }}>
      {answers.map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, background: T.brandTint,
          borderRadius: 10, padding: '10px 12px' }}>
          <Icon name="check" size={15} color={T.brandDeep} strokeWidth={2.4} style={{ marginTop: 2, flex: 'none' }} />
          <span style={{ flex: 1, fontFamily: T.font, fontSize: 13.5, fontWeight: 500, lineHeight: 1.5,
            color: T.brandDeep, textWrap: 'pretty' }}>{a.a}</span>
        </div>
      ))}

      {active && <PreguntaChip key={active} question={active} acc={acc} onCommit={commit} />}

      {!dismissed && otras.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: T.brandSoft || '#F4F0FC',
          borderRadius: 10, padding: '10px 12px 11px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.ink2 }}>
              Otras preguntas que afinan el resultado</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
              {otras.slice(0, 3).map(q => (
                <button key={q} onClick={() => ask(q)} style={{ border: 'none', background: 'transparent', padding: 0,
                  cursor: 'pointer', textAlign: 'left', fontFamily: T.font, fontSize: 13.5, fontWeight: 600,
                  lineHeight: 1.45, color: T.brandDeep }}>{q}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setDismissed(true)} aria-label="Descartar" style={{ flex: 'none', border: 'none',
            background: 'transparent', padding: 2, cursor: 'pointer', display: 'flex' }}>
            <Icon name="x" size={14} color={T.muted} />
          </button>
        </div>
      )}
    </div>
  );
};

const ReviewInstance = ({ gradeName, identity, prompt, materia, clases, onChangeClases, clasesUI = 'slider',
  brief = '', texto, onChangeText, universo, onSetUniverso, onGenerate, onBack, onExit, onOpenMemoria,
  prevPlan = null, retro = null, universoEmpty = 'chip' }) => {
  const acc = identity.hue;
  const materiaLabel = materia === 'matematica' ? 'Matemática' : 'Lengua';
  // universo vacío — chip punteado (producto); link/placeholder quedan como variantes
  const [addingUni, setAddingUni] = React.useState(false);
  const [uniDraft, setUniDraft] = React.useState('');
  const commitUni = () => { const v = uniDraft.trim(); if (v && onSetUniverso) onSetUniverso(v); setUniDraft(''); setAddingUni(false); };
  // continuidad — sale de las planificaciones guardadas; responder es opcional
  const [continuidad, setContinuidad] = React.useState(retro && retro.rating !== 'nouse' ? 'retoma' : null);
  const [contNota, setContNota] = React.useState(retro ? (retro.ajustar || retro.funciono || '') : '');
  const showUniversoRow = materia === 'matematica' || !texto;
  const val = { fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink, lineHeight: 1.6 };
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
      <QuestionShell prompt="Repasemos antes de avanzar a la planificación"
        sub="Revisá que esté todo bien y elegí cuántas clases. Vas a poder seguir ajustando después.">
        <div style={{ marginTop: 4 }}>
          <FieldRow label="Grupo" first><span style={val}>{gradeName}</span></FieldRow>
          <FieldRow label="Materia"><span style={val}>{materiaLabel}</span></FieldRow>
          <FieldRow label="Qué enseñar"><span style={val}>{prompt}</span></FieldRow>

          {texto && (
            <FieldRow label="Texto" top>
              <SelectedText texto={texto} onChange={onChangeText} />
            </FieldRow>
          )}

          {showUniversoRow && (
          <FieldRow label="Universo" top>
            {universo
              ? <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <EditableValue value={universo} onChange={(v) => onSetUniverso && onSetUniverso(v)} acc={acc} />
                </div>
              : addingUni
                ? <input autoFocus value={uniDraft} onChange={e => setUniDraft(e.target.value)} onBlur={commitUni}
                    onKeyDown={e => { if (e.key === 'Enter') commitUni(); if (e.key === 'Escape') { setUniDraft(''); setAddingUni(false); } }}
                    placeholder="Escribí el universo temático…"
                    style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${acc}`, borderRadius: 8, outline: 'none',
                      padding: '6px 10px', fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.ink, background: T.surface }} />
                : universoEmpty === 'link'
                  ? <button onClick={() => setAddingUni(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                      border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: T.font,
                      fontSize: 14, fontWeight: 600, color: T.brandDeep }}>
                      <Icon name="plus" size={14} color={T.brandDeep} /> Situar en un universo temático</button>
                : universoEmpty === 'placeholder'
                  ? <div className="gh-factrow" onClick={() => setAddingUni(true)} style={{ display: 'flex', alignItems: 'center',
                      gap: 8, padding: '7px 8px', margin: '0 -8px', borderRadius: 8, transition: 'background .12s', cursor: 'text' }}>
                      <span style={{ flex: 1, fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.muted }}>
                        Sin universo temático <span style={{ fontSize: 13 }}>· opcional</span></span>
                      <span className="gh-factedit" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, opacity: 0,
                        transition: 'opacity .12s', fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.brandDeep }}>
                        <Icon name="plus" size={12} color={T.brandDeep} /> Agregar</span>
                    </div>
                : <FactChipButton label="Agregar universo temático" onClick={() => setAddingUni(true)} />}
          </FieldRow>
          )}

          <FieldRow label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>Tengo en cuenta
            <InfoTip text={`Muestro lo pertinente para esta planificación. Se edita desde «Lo que sé de ${gradeName}» — tocá el chip o «Ver todo».`} /></span>} top>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={val}>{brief}{' '}
                <button onClick={onOpenMemoria} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
                  padding: 0, fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brand, whiteSpace: 'nowrap' }}>
                  Ver todo</button>
              </span>
              <SaberPrevio question={preguntaParaRepaso(brief, { materia, contenido: prompt })}
                acc={acc} onOpenMemoria={onOpenMemoria} />
            </div>
          </FieldRow>

          {prevPlan && (
            <FieldRow label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>Continuidad
              <InfoTip text={`Sale de tus planificaciones guardadas de ${materiaLabel} en ${gradeName}. Responder es opcional.`} /></span>} top>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <span style={val}>Ya planificaste «{prevPlan.title}» con este grupo, {prevPlan.date.toLowerCase()}.</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <RetroChip label="Retoma esa secuencia" on={continuidad === 'retoma'} acc={acc}
                    onClick={() => setContinuidad(x => x === 'retoma' ? null : 'retoma')} />
                  <RetroChip label="Arranca algo nuevo" on={continuidad === 'nuevo'} acc={acc}
                    onClick={() => setContinuidad(x => x === 'nuevo' ? null : 'nuevo')} />
                </div>
                {continuidad === 'retoma' && (
                  <input aria-label="Cómo resultó la secuencia anterior" value={contNota}
                    onChange={e => setContNota(e.target.value)}
                    placeholder="¿Qué funcionó y qué no la vez pasada?"
                    style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${T.border}`, borderRadius: 10,
                      outline: 'none', padding: '9px 12px', fontFamily: T.font, fontSize: 14.5, fontWeight: 500,
                      color: T.ink, background: T.surface }} />
                )}
              </div>
            </FieldRow>
          )}

          <FieldRow label="Clases" top>
            <ClaseSelector ui={clasesUI} value={clases} onChange={onChangeClases} suggested={SUGGESTED_CLASES} acc={acc} />
          </FieldRow>
        </div>

        <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
          <BackBtn onClick={onBack} />
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: T.font, fontSize: 13, color: T.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="clock" size={14} /> Tarda cerca de un minuto</span>
          <PillButton size="lg" icon={T.aiIcon} onClick={onGenerate}>Generar planificación</PillButton>
        </div>
      </QuestionShell>
    </div>
  );
};

// ── Skeleton de generación con consejos de uso ───────────
// ── Espera: la versión que salió a producción (generating-skeleton.tsx) ──
// Pregunta de contexto con Sí / A medias / Todavía no / Tu respuesta, el
// asentimiento del chip, el riel de progreso y el banner «Planificación lista».
// La respuesta no cambia la planificación en curso: suma a «Lo que sé de …».
const PREGUNTAS_ESPERA = {
  matematica: [
    { texto: '¿Saben armar sumas que den 10?', saber: 'Armar sumas que den 10' },
    { texto: '¿Pueden sumar 1 a cualquier número?', saber: 'Sumar 1 a cualquier número' },
    { texto: '¿Cuentan de 10 en 10 hasta 100?', saber: 'Contar de 10 en 10 hasta 100' },
    { texto: '¿Resuelven problemas de dos pasos?', saber: 'Resolver problemas de dos pasos' },
  ],
  lengua: [
    { texto: '¿Siguen la lectura de un cuento en voz alta?', saber: 'Seguir la lectura de un cuento' },
    { texto: '¿Escriben palabras conocidas sin ayuda?', saber: 'Escribir palabras conocidas' },
    { texto: '¿Pueden contar con sus palabras lo que leyeron?', saber: 'Renarrar lo leído' },
    { texto: '¿Reconocen las letras de su nombre?', saber: 'Reconocer las letras de su nombre' },
  ],
};
const ESPERA_LISTO_MS = 9000;     // en el producto tarda cerca de un minuto
const ESPERA_ASENTIMIENTO_MS = 900;
const ESPERA_TRANSICION_MS = 500;
const ESPERA_AUTO_NAV_MS = 4000;
const ETIQUETAS_ESPERA = { si: 'Sí', medias: 'A medias', no: 'Todavía no' };

const ChipEspera = ({ texto, estado, onClick }) => (
  <button onClick={onClick} aria-pressed={estado === 'seleccionado'}
    className={estado === 'seleccionado' ? 'gh-tick' : undefined}
    style={{ cursor: 'pointer', borderRadius: 999, padding: '9px 20px', fontFamily: T.font, fontSize: 14.5,
      fontWeight: 600, transition: 'all .2s', border: `1.5px solid ${estado === 'seleccionado' ? T.brand : T.border}`,
      background: estado === 'seleccionado' ? T.brand : T.surface, color: estado === 'seleccionado' ? T.onBrand : T.ink,
      opacity: estado === 'apagado' ? 0.45 : 1 }}>{texto}</button>
);

const GeneratingSkeleton = ({ gradeName, materia, tema, onDone }) => {
  const preguntas = PREGUNTAS_ESPERA[materia === 'matematica' ? 'matematica' : 'lengua'];
  const [indice, setIndice] = React.useState(0);
  const [fase, setFase] = React.useState('pregunta');
  const [respuesta, setRespuesta] = React.useState(null);
  const [fila, setFila] = React.useState(null);
  const [guardadas, setGuardadas] = React.useState(0);
  const [escribiendo, setEscribiendo] = React.useState(false);
  const [borrador, setBorrador] = React.useState('');
  const [listo, setListo] = React.useState(false);
  const [seg, setSeg] = React.useState(0);
  const ultima = React.useRef(0);
  const pregunta = indice < preguntas.length ? preguntas[indice] : null;
  const agradeciendo = fase !== 'pregunta';

  React.useEffect(() => { const id = setInterval(() => setSeg(s => s + 1), 1000); return () => clearInterval(id); }, []);
  React.useEffect(() => { const id = setTimeout(() => setListo(true), ESPERA_LISTO_MS); return () => clearTimeout(id); }, []);
  React.useEffect(() => {
    if (fase === 'pregunta') return;
    const id = setTimeout(() => {
      if (fase === 'asentimiento') return setFase('transicion');
      setRespuesta(null); setIndice(v => v + 1); setFase('pregunta');
    }, fase === 'asentimiento' ? ESPERA_ASENTIMIENTO_MS : ESPERA_TRANSICION_MS);
    return () => clearTimeout(id);
  }, [fase]);
  // Al llegar el resultado, espera unos segundos desde la última interacción y abre la planificación.
  React.useEffect(() => {
    if (!listo || escribiendo) return;
    let id;
    const intentar = (ms) => { id = setTimeout(() => {
      const t = Date.now() - ultima.current;
      if (t >= ESPERA_AUTO_NAV_MS) onDone && onDone(); else intentar(ESPERA_AUTO_NAV_MS - t);
    }, ms); };
    intentar(ESPERA_AUTO_NAV_MS);
    return () => clearTimeout(id);
  }, [listo, escribiendo]);

  const registrar = (valorLabel) => {
    setFila({ saber: pregunta.saber, valorLabel, deshecha: false });
    setGuardadas(g => g + 1);
    ultima.current = Date.now();
    setFase('asentimiento');
  };
  const responder = (valor) => { if (!pregunta || agradeciendo) return; setRespuesta(valor); registrar(ETIQUETAS_ESPERA[valor]); };
  const responderLibre = () => {
    const texto = borrador.replace(/\s+/g, ' ').trim().slice(0, 200);
    setBorrador(''); setEscribiendo(false);
    if (!pregunta || agradeciendo || !texto) return;
    registrar(texto);
  };
  const saltear = () => { if (agradeciendo) return; ultima.current = Date.now(); setFase('transicion'); };
  const deshacer = () => { ultima.current = Date.now(); setFila(f => ({ ...f, deshecha: true })); setGuardadas(g => Math.max(0, g - 1)); };

  const subcopy = seg < 30 ? `Con el contexto de ${gradeName} · tarda cerca de un minuto` : 'Queda menos de medio minuto';
  const card = { borderRadius: 14, border: `1px solid ${T.border}`, background: T.surface, padding: '24px 26px' };
  const eyebrow = { fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.brand };
  const checkSvg = (color, cls) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M20 6L9 17l-5-5" className={cls} /></svg>
  );

  return (
    <div className="gh-fade" style={{ maxWidth: 720, margin: '0 auto' }}>
      {fase === 'transicion' ? (
        <div style={{ ...card, minHeight: 196 }}>
          <div className="gh-sk" style={{ height: 11, width: '42%', marginBottom: 12 }} />
          <div className="gh-sk" style={{ height: 18, width: '86%', marginBottom: 12 }} />
          <div className="gh-sk" style={{ height: 13, width: '68%', marginBottom: 18 }} />
          <div style={{ display: 'flex', gap: 9 }}>
            {[64, 96, 104].map(w => <div key={w} className="gh-sk" style={{ height: 36, width: w, borderRadius: 999 }} />)}
          </div>
        </div>
      ) : pregunta ? (
        <div style={{ ...card, minHeight: 196 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
            <Icon name="lightbulb" size={17} color={T.brand} />
            <span style={eyebrow}>Mientras esperás{indice > 0 ? ` · ${indice + 1} de ${preguntas.length}` : ''}</span>
          </div>
          <p key={indice} className="gh-fade" style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, lineHeight: 1.45, color: T.ink, letterSpacing: '-0.2px' }}>{pregunta.texto}</p>
          <p style={{ fontFamily: T.font, fontSize: 13, lineHeight: 1.55, color: T.ink2, marginTop: 8 }}>
            Esto no cambia la planificación que estoy armando: suma a «Lo que sé de {gradeName}» para que las próximas salgan más ajustadas.</p>
          <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 9 }}>
            {['si', 'medias', 'no'].map(v => (
              <ChipEspera key={v} texto={ETIQUETAS_ESPERA[v]} onClick={() => responder(v)}
                estado={respuesta == null ? 'normal' : respuesta === v ? 'seleccionado' : 'apagado'} />
            ))}
            {escribiendo ? (
              <input autoFocus value={borrador} maxLength={200} aria-label="Tu respuesta" placeholder="Escribí tu respuesta…"
                onChange={e => { setBorrador(e.target.value); ultima.current = Date.now(); }}
                onBlur={responderLibre}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); responderLibre(); } if (e.key === 'Escape') { setBorrador(''); setEscribiendo(false); } }}
                style={{ minWidth: 220, flex: 1, borderRadius: 999, border: `1.5px solid ${T.brand}`, background: T.surface, padding: '9px 20px',
                  fontFamily: T.font, fontSize: 14.5, fontWeight: 600, color: T.ink, outline: 'none' }} />
            ) : (
              <button onClick={() => { if (agradeciendo) return; ultima.current = Date.now(); setEscribiendo(true); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', borderRadius: 999, padding: '9px 20px',
                  border: `1.5px dashed ${T.border}`, background: 'transparent', fontFamily: T.font, fontSize: 14.5, fontWeight: 600, color: T.muted }}>
                <Icon name="pencil" size={13} /> Tu respuesta</button>
            )}
            <div style={{ flex: 1 }} />
            <button onClick={saltear} style={{ cursor: 'pointer', border: 0, background: 'none', fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.brand }}>Otra pregunta</button>
          </div>
        </div>
      ) : (
        <div style={{ ...card, padding: '20px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            {checkSvg(T.brand)}
            <span style={eyebrow}>Gracias — {guardadas} {guardadas === 1 ? 'respuesta guardada' : 'respuestas guardadas'}</span>
          </div>
          <p style={{ fontFamily: T.font, fontSize: 13.5, lineHeight: 1.55, color: T.ink2, marginTop: 6 }}>
            Las próximas planificaciones de {gradeName} van a salir más ajustadas.</p>
        </div>
      )}

      {fila && (
        <div key={fila.saber + fila.deshecha} className="cf-rise" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10,
          borderRadius: 12, background: T.brandTint, padding: '12px 18px' }}>
          {fila.deshecha ? (
            <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, lineHeight: 1.5, color: T.muted }}>
              Respuesta deshecha — no quedó en «Lo que sé de {gradeName}»</span>
          ) : (
            <React.Fragment>
              {checkSvg(T.brand, 'gh-draw')}
              <span style={{ flex: 1, minWidth: 0, fontFamily: T.font, fontSize: 13.5, lineHeight: 1.5, color: T.brandDeep }}>
                <strong>{fila.saber} — {fila.valorLabel}.</strong> Guardado en «Lo que sé de {gradeName}»</span>
              <button onClick={deshacer} style={{ flexShrink: 0, cursor: 'pointer', border: 0, background: 'none', fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.brand }}>Deshacer</button>
            </React.Fragment>
          )}
        </div>
      )}

      {listo ? (
        <div className="cf-rise" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 13, borderRadius: 14, background: T.brand,
          padding: '18px 20px', boxShadow: '0 12px 30px -12px rgba(76,29,149,.45)' }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {checkSvg('#FFFFFF')}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.onBrand }}>Planificación lista</div>
            <div style={{ fontFamily: T.font, fontSize: 12.5, color: 'rgba(255,255,255,.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tema || 'Tu planificación'} · guardada en {gradeName}</div>
          </div>
          <button onClick={onDone} style={{ flexShrink: 0, cursor: 'pointer', border: 0, borderRadius: 10, background: '#FFFFFF', color: T.brandDeep,
            padding: '9px 16px', fontFamily: T.font, fontSize: 13.5, fontWeight: 700 }}>Abrir planificación</button>
        </div>
      ) : (
        <div style={{ marginTop: 16, borderRadius: 14, border: `1px solid ${T.border}`, background: T.surface, padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="cf-pulse" style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: T.brandTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={T.aiIcon} size={15} color={T.brand} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.font, fontSize: 13.5, fontWeight: 700, color: T.ink }}>Armando tu planificación…</div>
              <div style={{ fontFamily: T.font, fontSize: 12, color: T.muted }}>{subcopy}</div>
            </div>
          </div>
          <div style={{ marginTop: 12, height: 5, borderRadius: 5, background: T.bgDeep, overflow: 'hidden', position: 'relative' }}>
            <div className="gh-rail" style={{ position: 'absolute', top: 0, bottom: 0, width: '34%', borderRadius: 5, background: T.brand }} />
          </div>
        </div>
      )}
    </div>
  );
};

const GenerationStream = ({ gradeName, identity, clases = SUGGESTED_CLASES, onOpenSource, onOpenPlan, onDiscard }) => {
  const parts = React.useMemo(() => STREAM_PARTS(gradeName, clases), [gradeName, clases]);
  // flatten to atoms (chars + cite markers)
  const atoms = React.useMemo(() => {
    const a = [];
    parts.forEach((p, pi) => {
      if (p.cite) a.push({ cite: p.cite, key: 'c' + pi });
      else for (let i = 0; i < p.text.length; i++) a.push({ ch: p.text[i], key: pi + '-' + i });
    });
    return a;
  }, [parts]);
  const [n, setN] = React.useState(0);
  const [stopped, setStopped] = React.useState(false);
  const acc = identity.hue;
  const done = n >= atoms.length;

  React.useEffect(() => {
    if (stopped || done) return;
    const t = setTimeout(() => setN(x => Math.min(atoms.length, x + (atoms[x] && atoms[x].cite ? 1 : 2))), 18);
    return () => clearTimeout(t);
  }, [n, stopped, done, atoms]);

  let citeN = 0;
  const rendered = [];
  for (let i = 0; i < n; i++) {
    const at = atoms[i];
    if (at.cite) { citeN++; rendered.push(<Cite key={at.key} n={citeN} accent={acc} onClick={() => onOpenSource(at.cite)} />); }
    else rendered.push(at.ch);
  }
  const working = !done && !stopped;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
        <span className={working ? 'cf-pulse' : ''} style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: identity.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={T.aiIcon} size={20} color={acc} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: T.head, fontSize: 15.5, fontWeight: 700, color: T.ink }}>
            {working ? 'Armando tu planificación…' : 'Planificación lista'}
          </div>
          <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>
            {working ? 'Pensando con el contexto de 2° A' : 'Guardada en 2° A'}
          </div>
        </div>
        {working && (
          <button onClick={() => setStopped(true)} style={{ display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 14px', borderRadius: 44, border: `1.5px solid ${T.border}`, background: T.surface,
            cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink }}>
            <span style={{ width: 11, height: 11, borderRadius: 2, background: T.ink }} /> Detener
          </button>
        )}
      </div>

      <div style={{ borderRadius: 16, border: `1.5px solid ${T.border}`, background: T.surface, padding: '22px 24px' }}>
        <p style={{ fontFamily: T.font, fontSize: 15.5, color: T.ink, lineHeight: 1.75, margin: 0 }}>
          {rendered}{working && <span className="gh-caret" style={{ display: 'inline-block', width: 2, height: 18,
            background: acc, marginLeft: 2, verticalAlign: 'text-bottom' }} />}
        </p>

        {done && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
              {['Lectura y saberes previos', 'La secuencia narrativa', 'Los personajes', `+${Math.max(0, clases - 3)} clases`].map(c => (
                <span key={c} style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.ink2,
                  background: T.bgDeep, borderRadius: 8, padding: '7px 12px' }}>{c}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <PillButton icon="arrow-right" onClick={onOpenPlan} style={{ flexDirection: 'row-reverse' }}>
                Abrir planificación completa</PillButton>
              <PillButton variant="ghost" icon={T.aiIcon}>Pedir cambios</PillButton>
              <div style={{ flex: 1 }} />
              <button onClick={onDiscard} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.muted }}>Descartar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Composer / empty state ───────────────────────────────
const SUGGESTED = [
  { ic: 'file-text', label: 'A partir de un texto que tengo', accion: 'texto-propio' },
  { ic: 'paperclip', label: 'A partir de una planificación mía', soon: true },
];
// rotan en el placeholder, tipeadas letra por letra
const PLACEHOLDER_HINTS = [
  'lectura de textos narrativos…',
  'estrategias de multiplicación…',
  'escritura de cuentos…',
  'problemas de suma y resta…',
  'la secuencia narrativa de un cuento…',
  'reconocer los personajes de una historia…',
];
const CATEGORIES = [
  { ic: 'book-open', t: 'Una secuencia', d: 'Varias clases sobre un contenido' },
  { ic: 'file-text', t: 'A partir de un texto', d: 'Subí un cuento o una consigna' },
];

// hook: tipea/borra las PLACEHOLDER_HINTS en bucle mientras esté activo
const useTypingPlaceholder = (hints, active) => {
  const [text, setText] = React.useState('');
  React.useEffect(() => {
    if (!active) { setText(''); return; }
    let hint = 0, char = 0, mode = 'type', timer;
    const tick = () => {
      const full = hints[hint];
      if (mode === 'type') {
        char++;
        setText(full.slice(0, char));
        if (char >= full.length) { mode = 'hold'; timer = setTimeout(tick, 1700); return; }
        timer = setTimeout(tick, 45 + Math.random() * 45);
      } else if (mode === 'hold') {
        mode = 'erase'; timer = setTimeout(tick, 30);
      } else {
        char--;
        setText(full.slice(0, Math.max(0, char)));
        if (char <= 0) { hint = (hint + 1) % hints.length; mode = 'type'; timer = setTimeout(tick, 350); return; }
        timer = setTimeout(tick, 22);
      }
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [active, hints]);
  return text;
};

const MATERIAS = [
  { id: 'lengua', label: 'Lengua', ic: 'book-open' },
  { id: 'matematica', label: 'Matemática', ic: 'calculator' },
];

const Composer = ({ identity, mode, promptsUI = 'menu', gradeName = '2° A', hasContext = true, onSend }) => {
  const [v, setV] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const [materia, setMateria] = React.useState(null);
  const [showDrop, setShowDrop] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [sendOpen, setSendOpen] = React.useState(false);
  const sendRef = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (sendRef.current && !sendRef.current.contains(e.target)) setSendOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const acc = identity.hue;
  const typed = useTypingPlaceholder(PLACEHOLDER_HINTS, !v && !focus);
  const ph = (!v && !focus)
    ? 'Probá: ' + typed
    : `¿Qué querés planificar para ${gradeName}? Escribilo con tus palabras…`;
  // contenidos del diseño curricular que matchean lo que se escribe (siempre ambas materias)
  const level = gradoLevel(gradeName);
  const pool = [...(NODAL[`lengua-${level}`] || []).map(c => ({ c, m: 'lengua' })),
                ...(NODAL[`matematica-${level}`] || []).map(c => ({ c, m: 'matematica' }))];
  const query = v.trim().toLowerCase();
  const matches = query ? pool.filter(o => o.c.toLowerCase().includes(query)).slice(0, 6) : [];
  const dropOpen = showDrop && focus && matches.length > 0;
  const pickContent = (o) => { setV(o.c); setMateria(o.m); setShowDrop(false); };
  const hlC = (text) => {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query);
    if (i < 0) return text;
    return <React.Fragment>{text.slice(0, i)}<span style={{ color: acc, fontWeight: 700 }}>{text.slice(i, i + query.length)}</span>{text.slice(i + query.length)}</React.Fragment>;
  };
  const box = (
    <div style={{ position: 'relative', borderRadius: 20, background: T.surface, padding: 8,
      border: `1.5px solid ${focus ? acc : T.border}`,
      boxShadow: focus
        ? `0 0 0 4px ${acc}1F, 0 18px 44px -18px rgba(11,27,102,.22)`
        : '0 2px 10px rgba(11,27,102,.05), 0 14px 36px -20px rgba(11,27,102,.16)',
      transition: 'box-shadow .18s, border-color .18s' }}>
      <textarea value={v} onChange={e => { setV(e.target.value); setShowDrop(true); }} rows={2}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        placeholder={ph}
        style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 17, color: T.ink, padding: '12px 14px 4px', lineHeight: 1.55 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 2px' }}>
        {promptsUI === 'menu' && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(o => !o)} title="Sugerencias para empezar" aria-label="Sugerencias para empezar"
              style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, cursor: 'pointer',
                border: `1px solid ${menuOpen ? acc : T.border}`, background: menuOpen ? T.brandTint : T.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .13s' }}>
              <Icon name="plus" size={18} color={menuOpen ? acc : T.ink2}
                style={{ transform: menuOpen ? 'rotate(45deg)' : 'none', transition: 'transform .15s' }} />
            </button>
            {menuOpen && (
              <div className="gh-fade" role="menu" style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, zIndex: 50,
                minWidth: 300, background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`,
                boxShadow: '0 18px 44px -12px rgba(11,27,102,.22)', overflow: 'hidden', padding: 6 }}>
                {SUGGESTED.map(s => (
                  <button key={s.label} disabled={s.soon}
                    onClick={s.soon ? undefined : () => { setMenuOpen(false); onSend('', 'lengua', { textoPropio: true }); }}
                    className={s.soon ? undefined : 'gh-row'}
                    style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '10px 12px',
                      borderRadius: 9, border: 'none', background: 'transparent',
                      cursor: s.soon ? 'default' : 'pointer', textAlign: 'left', opacity: s.soon ? .55 : 1,
                      fontFamily: T.font, fontSize: 14, fontWeight: 500, color: T.ink }}>
                    <Icon name={s.ic} size={16} color={s.soon ? T.muted : acc} />
                    <span style={{ flex: 1 }}>{s.label}</span>
                    {s.soon && <span style={{ fontFamily: T.font, fontSize: 10.5, fontWeight: 700,
                      letterSpacing: '0.05em', textTransform: 'uppercase', color: T.muted,
                      border: `1px solid ${T.border}`, borderRadius: 44, padding: '2px 8px' }}>Próximamente</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div ref={sendRef} style={{ position: 'relative' }}>
          <button title="Planificar" aria-label="Planificar"
            onClick={() => {
              if (!v.trim()) return;
              const inferred = materia || (matches.length ? matches[0].m : null);
              if (inferred) onSend(v.trim(), inferred);
              else setSendOpen(o => !o);
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44,
              borderRadius: 13, flexShrink: 0, border: 'none', cursor: v.trim() ? 'pointer' : 'default',
              background: acc, color: '#fff', opacity: v.trim() ? 1 : .45,
              boxShadow: `0 6px 16px -6px ${acc}`, transition: 'opacity .15s' }}>
            <Icon name={T.aiIcon} size={20} color="#fff" />
          </button>
          {sendOpen && (
            <div className="gh-fade" role="menu" aria-label="¿Para qué materia?"
              style={{ position: 'absolute', bottom: 'calc(100% + 10px)', right: 0, zIndex: 50,
              minWidth: 240, background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`,
              boxShadow: '0 18px 44px -12px rgba(11,27,102,.22)', overflow: 'hidden', padding: 6 }}>
              <div style={{ padding: '7px 12px 6px', fontFamily: T.font, fontSize: 11, fontWeight: 700,
                color: T.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ¿Para qué materia?
              </div>
              {[{ id: 'lengua', label: 'Lengua', ic: 'book-open' }, { id: 'matematica', label: 'Matemática', ic: 'calculator' }].map(m => (
                <button key={m.id} onClick={() => { setSendOpen(false); onSend(v.trim(), m.id); }} className="gh-row"
                  style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '10px 12px',
                    borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
                    fontFamily: T.font, fontSize: 14.5, fontWeight: 500, color: T.ink }}>
                  <Icon name={m.ic} size={17} color={acc} /> {m.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      {dropOpen && (
        <div className="gh-fade" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 40,
          background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`,
          boxShadow: '0 18px 44px -12px rgba(11,27,102,.22)', overflow: 'hidden' }}>
          <div style={{ padding: '9px 15px', fontFamily: T.font, fontSize: 11, fontWeight: 700,
            color: T.muted, textTransform: 'uppercase', letterSpacing: '0.05em',
            borderBottom: `1px solid ${T.borderSoft}` }}>
            Contenidos del diseño curricular · {level}° grado
          </div>
          {matches.map((o, i) => (
            <button key={i} onMouseDown={e => e.preventDefault()} onClick={() => pickContent(o)} className="gh-row"
              style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '11px 15px',
                border: 'none', borderBottom: i < matches.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              <Icon name={o.m === 'matematica' ? 'calculator' : 'book-open'} size={16} color={acc} />
              <span style={{ flex: 1, fontFamily: T.font, fontSize: 14.5, color: T.ink }}>{hlC(o.c)}</span>
              {!materia && <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                textTransform: 'uppercase', color: T.muted }}>{o.m === 'matematica' ? 'Matemática' : 'Lengua'}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: acc, display: 'flex',
          alignItems: 'center', gap: 7, marginBottom: 8 }}>
          <Icon name={T.aiIcon} size={15} color={acc} /> Hola, Sofía
        </div>
        <h1 style={{ fontFamily: T.head, fontSize: 32, fontWeight: 800, color: T.ink, letterSpacing: '-0.6px',
          lineHeight: 1.1, margin: 0 }}>¿Qué planificamos para {gradeName}?</h1>
        <p style={{ fontFamily: T.font, fontSize: 15, color: T.ink2, lineHeight: 1.55, margin: '10px 0 0' }}>
          {hasContext
            ? 'Conozco el contexto del grupo y los contenidos de referencia. Contame qué querés enseñar y armamos la secuencia. Por ahora puedo ayudarte en Lengua y Matemática.'
            : 'Contame qué querés enseñar y armamos la secuencia. Cargá el contexto del grupo acá abajo así sale a la medida. Por ahora puedo ayudarte en Lengua y Matemática.'}
        </p>
      </div>

      {mode === 'categorias' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          {CATEGORIES.map(c => (
            <button key={c.t} onClick={() => onSend(c.t)} style={{ display: 'flex', alignItems: 'center', gap: 13,
              padding: '16px 18px', borderRadius: 15, border: `1.5px solid ${T.border}`, background: T.surface,
              cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: identity.tint,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={c.ic} size={19} color={acc} /></span>
              <div>
                <div style={{ fontFamily: T.head, fontSize: 15, fontWeight: 700, color: T.ink }}>{c.t}</div>
                <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, marginTop: 2 }}>{c.d}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {box}

      {mode === 'minimo' && (
        <div style={{ marginTop: 12, fontFamily: T.font, fontSize: 13, color: T.muted, textAlign: 'center' }}>
          Probá: <button onClick={() => onSend(SUGGESTED[0].label)} style={{ border: 'none', background: 'transparent',
            cursor: 'pointer', color: acc, fontWeight: 600, fontFamily: T.font, fontSize: 13 }}>“{SUGGESTED[0].label}”</button>
        </div>
      )}
    </div>
  );
};

const GROUP_CONTEXT = 'Grupo de 24 chicos y chicas, muy conversador y participativo. La mayoría llega a 2° leyendo palabras y frases cortas, pero hay cinco o seis que todavía están consolidando la lectura y necesitan que les lea en voz alta. Tres estudiantes tienen apoyo de integración: dos con adecuaciones en Lengua y uno que trabaja con maestra de apoyo dos veces por semana. Vienen entusiasmados con los cuentos, pero les cuesta sostener la atención en consignas largas o escritas, así que funciona mejor arrancar desde lo oral. En Matemática manejan el conteo hasta 100 y empiezan con sumas, aunque todavía se apoyan bastante en material concreto.';

// ── Top bar · navegación entre grados en la barra ────────
const TopBarSwitcher = ({ gradeId, onPick, onNew, label }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const g = SAVED_GRADES.find(x => x.id === gradeId) || SAVED_GRADES[0];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
        border: 'none', background: open ? T.bgDeep : 'transparent', borderRadius: 10, padding: '7px 11px',
        cursor: 'pointer', fontFamily: T.head, fontSize: 16, fontWeight: 700, color: T.ink }}>
        {label || g.name}
        <Icon name="chevron-down" size={16} color={T.muted}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 300, background: T.surface,
          borderRadius: 14, padding: 7, border: `1px solid ${T.border}`,
          boxShadow: '0 18px 50px rgba(11,27,102,.16)', zIndex: 30 }}>
          {SAVED_GRADES.map(x => {
            const on = x.id === gradeId;
            return (
              <button key={x.id} onClick={() => { onPick(x.id); setOpen(false); }} style={{ display: 'flex',
                alignItems: 'center', gap: 10, width: '100%', padding: '9px 10px', borderRadius: 9, border: 'none',
                cursor: 'pointer', textAlign: 'left', background: on ? T.bgDeep : 'transparent' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.ink }}>{x.name}</div>
                  <div style={{ fontFamily: T.font, fontSize: 12, color: T.muted, whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.school} · {(PLANS_BY_GRADE[x.id] || []).length} planif.</div>
                </div>
                {on && <Icon name="check" size={16} color={T.brandDeep} />}
              </button>
            );
          })}
          <div style={{ height: 1, background: T.borderSoft, margin: '5px 8px' }} />
          <button onClick={() => { setOpen(false); onNew && onNew(); }} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 10px',
            borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: T.font,
            fontSize: 13.5, fontWeight: 600, color: T.ink2 }}><Icon name="plus" size={15} color={T.ink2} /> Nuevo grado</button>
        </div>
      )}
    </div>
  );
};

// ── Conocimiento inline («Lo que sé de…», como memoria-card) ──
const InlineKnowledge = ({ gradeName, accent, emphasis = false, empty = false, onSetup, ctxText = null }) => {
  const [open, setOpen] = React.useState(!!emphasis);
  const texto = ctxText || GROUP_CONTEXT;
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${emphasis ? `${accent}33` : T.border}`,
      background: emphasis ? `${accent}0A` : T.surface }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%',
        padding: '14px 18px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
        <Icon name="info" size={16} color={accent} />
        <span style={{ fontFamily: T.head, fontSize: 14.5, fontWeight: 700, color: T.ink }}>Lo que sé de {gradeName}</span>
        <span style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>{empty ? '· sin cargar' : '· cómo es el grupo'}</span>
        {emphasis && <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: accent,
          background: `${accent}16`, padding: '3px 9px', borderRadius: 44 }}>Empezá por acá</span>}
        <div style={{ flex: 1 }} />
        <Icon name="chevron-down" size={16} color={T.muted}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }} />
      </button>
      {open && (empty ? (
        <div style={{ padding: '0 18px 20px' }}>
          <p style={{ fontFamily: T.font, fontSize: 14.5, color: T.ink2, lineHeight: 1.6, margin: '0 0 16px', maxWidth: 520 }}>
            Todavía no cargaste el contexto de {gradeName}. Contame cómo es el grupo y qué saben tus estudiantes
            para que cada planificación salga a la medida.</p>
          <PillButton iconRight="arrow-right" onClick={onSetup}>
            {`Completar el contexto de ${gradeName}`}</PillButton>
        </div>
      ) : (
        <div className="gh-factrow" style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: T.muted }}>Cómo es el grupo</div>
              <div style={{ flex: 1 }} />
              <button onClick={onSetup} className="gh-factedit" style={{ border: 'none', background: 'transparent',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, opacity: 0, transition: 'opacity .12s',
                fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>
                <Icon name="pencil" size={12} color={T.brandDeep} /> Editar</button>
            </div>
            <p style={{ fontFamily: T.font, fontSize: 15, color: T.ink, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{texto}</p>
          </div>
          <FactChipButton label={preguntaParaMemoria(texto)} onClick={onSetup} />
        </div>
      ))}
    </div>
  );
};

// ── Popup «Lo que sé de…» — se edita con pedidos en lenguaje natural ──
const ContextSetup = ({ gradeName, initial = '', onSave, onClose }) => {
  const [parts, setParts] = React.useState(() => initial ? initial.split('\n\n') : []);
  const [added, setAdded] = React.useState([]);           // índices resaltados (recién agregados)
  const [pedido, setPedido] = React.useState('');
  const [aplicando, setAplicando] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  const [fallo, setFallo] = React.useState(false);
  const [prev, setPrev] = React.useState(null);           // para Deshacer
  const commit = (next, nextAdded) => {
    setPrev({ parts, added });
    setParts(next); setAdded(nextAdded);
    onSave(next.join('\n\n'));
    setOk(true); setFallo(false); setPedido('');
  };
  const aplicar = () => {
    const p = pedido.trim();
    if (!p || aplicando) return;
    setAplicando(true); setOk(false); setFallo(false);
    setTimeout(() => {
      setAplicando(false);
      const add = p.match(/^agreg(?:á|a)(?:me)?\s+(?:que\s+)?(.+)$/i);
      const rem = p.match(/^sac(?:á|a)(?:me)?\s+(?:que\s+)?(.+)$/i);
      if (add) {
        let t = add[1].trim();
        t = t.charAt(0).toUpperCase() + t.slice(1);
        if (!/[.!?]$/.test(t)) t += '.';
        commit([...parts, t], [parts.length]);
      } else if (rem) {
        const q = rem[1].trim().toLowerCase();
        const next = parts.filter(x => !x.toLowerCase().includes(q));
        if (next.length === parts.length) setFallo(true);
        else commit(next, []);
      } else {
        setFallo(true);
      }
    }, 900);
  };
  const deshacer = () => {
    if (!prev) return;
    setParts(prev.parts); setAdded(prev.added);
    onSave(prev.parts.join('\n\n'));
    setPrev(null); setOk(false);
  };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(20,18,30,.34)' }}>
      <div className="gh-fade" onClick={e => e.stopPropagation()} role="dialog" aria-label={`Lo que sé de ${gradeName}`}
        style={{ width: 560, maxHeight: '86%', display: 'flex', flexDirection: 'column', background: T.surface,
        borderRadius: 18, border: `1px solid ${T.border}`, boxShadow: '0 30px 80px -24px rgba(11,27,102,.4)',
        overflow: 'hidden' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px 14px',
          borderBottom: `1px solid ${T.borderSoft}` }}>
          <h2 style={{ flex: 1, fontFamily: T.head, fontSize: 15.5, fontWeight: 700, color: T.ink, margin: 0 }}>
            Lo que sé de {gradeName}</h2>
          <IconButton name="x" size={32} onClick={onClose} title="Cerrar" />
        </div>

        {/* cuerpo */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px' }}>
          {parts.length === 0 ? (
            <p style={{ fontFamily: T.font, fontSize: 14.5, color: T.muted, lineHeight: 1.7, margin: 0 }}>
              Todavía no hay nada cargado. Pedime que agregue lo que sabés del grupo — por ejemplo,
              «agregá que les cuesta la escritura».</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {parts.map((p, i) => (
                <p key={i} style={{ fontFamily: T.font, fontSize: 14.5, color: T.ink, lineHeight: 1.7, margin: 0,
                  background: added.includes(i) ? T.brandTint : 'transparent',
                  borderRadius: added.includes(i) ? 8 : 0, padding: added.includes(i) ? '6px 9px' : 0 }}>{p}</p>
              ))}
            </div>
          )}
          {ok && (
            <div className="gh-fade" style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 14,
              padding: '9px 12px', borderRadius: 10, background: T.brandTint }}>
              <Icon name="check" size={15} color={T.brandDeep} />
              <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.brandDeep }}>Listo</span>
              <button onClick={deshacer} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>Deshacer</button>
            </div>
          )}
          {fallo && (
            <p role="status" style={{ fontFamily: T.font, fontSize: 13, color: T.ink2, lineHeight: 1.5,
              margin: '14px 0 0' }}>
              Ese pedido todavía no lo puedo aplicar — probá con «agregá…» o «sacá…»</p>
          )}
        </div>

        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px',
          borderTop: `1px solid ${T.borderSoft}`, background: T.bg }}>
          <input value={pedido} onChange={e => setPedido(e.target.value)} autoFocus
            aria-label="¿Qué querés cambiar?"
            onKeyDown={e => { if (e.key === 'Enter') aplicar(); }}
            placeholder="Por ejemplo: «agregá que les cuesta la escritura»"
            style={{ flex: 1, border: `1.5px solid ${T.border}`, borderRadius: 12, outline: 'none',
              padding: '10px 14px', fontFamily: T.font, fontSize: 14, fontWeight: 500, color: T.ink,
              background: T.surface }} />
          <PillButton size="sm" disabled={!pedido.trim() || aplicando} onClick={aplicar}>
            {aplicando ? 'Aplicando…' : 'Aplicar'}</PillButton>
        </div>
      </div>
    </div>
  );
};

// ── Empty state · grado sin planificaciones ─────────────
const EmptyPlans = ({ gradeName }) => (
  <div style={{ maxWidth: 720, margin: '32px auto 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', borderRadius: 16,
      border: `1px dashed ${T.border}`, background: 'transparent' }}>
      <span style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: T.bgDeep,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="layers" size={19} color={T.muted} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.head, fontSize: 14.5, fontWeight: 700, color: T.ink2 }}>
          Todavía no planificaste nada en {gradeName}</div>
        <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted, marginTop: 2 }}>
          Lo que generes con el asistente queda guardado acá, listo para retomar y compartir.</div>
      </div>
    </div>
  </div>
);

// ── Empty state · primer uso, sin ningún grado ──────────
const FirstRun = ({ onCreate }) => {
  const acc = T.brand;
  const points = [
    { ic: 'info', t: 'Contá cómo es tu grupo', d: 'El contexto que cargues guía todas las planificaciones.' },
    { ic: T.aiIcon, t: 'Planificá en minutos', d: 'Describís qué querés enseñar y armamos la secuencia.' },
    { ic: 'book-open', t: 'Apoyado en el currículum', d: 'Cita los NAP y el diseño curricular de tu jurisdicción.' },
  ];
  return (
    <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: T.font, fontSize: 13.5,
        fontWeight: 600, color: acc, marginBottom: 12 }}>
        <Icon name={T.aiIcon} size={15} color={acc} /> Hola, Sofía
      </div>
      <h1 style={{ fontFamily: T.head, fontSize: 32, fontWeight: 800, color: T.ink, letterSpacing: '-0.6px',
        lineHeight: 1.1, margin: 0 }}>Empecemos por tu primer grado</h1>
      <p style={{ fontFamily: T.font, fontSize: 15.5, color: T.ink2, lineHeight: 1.6, margin: '12px auto 0',
        maxWidth: 460 }}>
        Un grado guarda el contexto de tu grupo y todo lo que planifiques con él. Creá el primero y empezamos.
        Por ahora te acompaño en Lengua y Matemática.</p>
      <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center' }}>
        <PillButton size="lg" icon="plus" onClick={onCreate}>Crear mi primer grado</PillButton>
      </div>
      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, textAlign: 'left' }}>
        {points.map(p => (
          <div key={p.t} style={{ padding: '18px 16px', borderRadius: 15, background: T.surface,
            border: `1px solid ${T.border}` }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: T.brandTint, display: 'flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: 11 }}>
              <Icon name={p.ic} size={18} color={acc} /></span>
            <div style={{ fontFamily: T.head, fontSize: 14.5, fontWeight: 700, color: T.ink }}>{p.t}</div>
            <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, lineHeight: 1.5, marginTop: 3 }}>{p.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Home del grado ───────────────────────────────────────
const GradeProjectHome = ({ kbMode = 'panel', emptyMode = 'prompts', promptsUI = 'menu', clasesUI = 'slider', layout = 'minimal', nuevoMode = 'formulario', retroMode = 'banner', startNew = false, estado = 'con', universoOn = false, universoEmpty = 'chip', cambios = 'aplica' }) => {
  const [gradeId, setGradeId] = React.useState('g1');
  const [gen, setGen] = React.useState(null);            // null | { prompt, materia, clases, phase }
  const [factsByGrade, setFactsByGrade] = React.useState(DEFAULT_FACTS);
  const [briefsByGrade, setBriefsByGrade] = React.useState(DEFAULT_BRIEFS);
  const [openSource, setOpenSource] = React.useState(null);
  const [screen, setScreen] = React.useState(startNew ? 'nuevo' : 'home');
  React.useEffect(() => { setScreen(startNew ? 'nuevo' : 'home'); }, [startNew]);
  // el flujo puede pisar el tweak de estado: crear grado → home vacío con su contexto
  const [override, setOverride] = React.useState(null); // { estado, ctx, name }
  React.useEffect(() => { setOverride(null); }, [estado]);
  const [ctxSetup, setCtxSetup] = React.useState(false);
  const view = 'planificar';
  const [kbCollapsed, setKbCollapsed] = React.useState(kbMode === 'collapsed');
  React.useEffect(() => { setKbCollapsed(kbMode === 'collapsed'); }, [kbMode]);

  const gBase = SAVED_GRADES.find(x => x.id === gradeId) || SAVED_GRADES[0];
  const g = override && override.name ? { ...gBase, name: override.name } : gBase;
  // identidad neutra por ahora (sin color/ícono por grado)
  const identity = { hue: T.brand, tint: T.brandTint, deep: T.brandDeep, icon: 'users' };
  const plans = PLANS_BY_GRADE[gradeId] || [];
  const acc = identity.hue;
  const facts = factsByGrade[gradeId] || [];
  const estadoEff = override ? override.estado : estado;
  const isEmpty = estadoEff === 'vacio';
  const isFirstRun = estadoEff === 'nuevo';
  const customCtx = (override && override.ctx) || null;
  const plansToShow = (isEmpty || isFirstRun) ? [] : plans;
  const prevPlan = plansToShow[0] || null;
  const [retro, setRetro] = React.useState(null);           // devolución sobre la planificación anterior
  const [retroDismissed, setRetroDismissed] = React.useState(false);
  React.useEffect(() => { setRetro(null); setRetroDismissed(false); }, [gradeId, retroMode]);
  const [memoriaFull, setMemoriaFull] = React.useState(null);   // «Lo que sé de…» editado vía popup
  React.useEffect(() => { setMemoriaFull(null); }, [gradeId, estado]);
  const handleCreate = (d) => {
    setScreen('home');
    setOverride({ estado: 'vacio',
      ctx: d && d.ctx && d.ctx.trim() ? d.ctx.trim() : null,
      name: d && d.year ? `${d.year} ${d.section || ''}`.trim() : null });
  };
  const editBrief = (val) => setBriefsByGrade(m => ({ ...m, [gradeId]: val }));
  const editFact = (i, val) => setFactsByGrade(m => ({ ...m, [gradeId]: (m[gradeId] || []).map((f, j) => j === i ? val : f) }));
  const addFact = (val) => setFactsByGrade(m => ({ ...m, [gradeId]: [...(m[gradeId] || []), val] }));
  const pick = (id) => { setGradeId(id); setGen(null); setOverride(null); };
  // extracto de «Lo que sé de…» para la fila "Tengo en cuenta" del repaso
  const briefTextFull = memoriaFull || customCtx || briefsByGrade[gradeId] || '';
  const briefText = briefTextFull.length > 220 ? briefTextFull.slice(0, 220) + '…' : briefTextFull;

  if (screen === 'nuevo') {
    return <NewGradeScreen mode={nuevoMode} onCancel={() => setScreen('home')} onCreate={handleCreate} />;
  }

  if (gen && gen.phase === 'plan') {
    return <ResultScreen a={{ grado: g.name, materia: gen.materia, contenido: gen.prompt, clases: gen.clases,
        universo: gen.universo, texto: gen.texto }} cambiosResultado={cambios}
      onBack={() => setGen(x => ({ ...x, phase: 'revision' }))} onRestart={() => setGen(null)} />;
  }

  // ── Layout minimalista: top bar + conocimiento inline ──
  if (layout === 'minimal') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg,
        position: 'relative', overflow: 'hidden' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 26px',
          borderBottom: `1px solid ${T.borderSoft}` }}>
          <Logo height={21} />
          {!isFirstRun && <React.Fragment>
            <span style={{ width: 1, height: 22, background: T.border }} />
            <TopBarSwitcher gradeId={gradeId} label={g.name} onPick={pick} onNew={() => setScreen('nuevo')} />
          </React.Fragment>}
          <div style={{ flex: 1 }} />
          {['Mis grados', 'Biblioteca'].map(n => (
            <span key={n} style={{ fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.ink2,
              cursor: 'pointer' }}>{n}</span>
          ))}
          <span style={{ width: 30, height: 30, borderRadius: 30, background: T.brandTint, color: T.brandDeep,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.head, fontSize: 13,
            fontWeight: 700, marginLeft: 6 }}>S</span>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: view === 'grupo' ? '34px 28px 56px' : '48px 28px 56px' }}>
          {isFirstRun && !gen ? (
            <FirstRun onCreate={() => setScreen('nuevo')} />
          ) : (
          <React.Fragment>
          {gen && gen.phase === 'retro'
            ? <RetroStep gradeName={g.name} identity={identity} plan={prevPlan || PLANS_BY_GRADE.g1[0]}
                onContinue={(ans) => { setRetro(ans); if (ans.fact) addFact(ans.fact); setGen(x => ({ ...x, phase: x.materia === 'lengua' ? 'texto' : 'revision' })); }}
                onSkip={() => setGen(x => ({ ...x, phase: x.materia === 'lengua' ? 'texto' : 'revision' }))}
                onBack={() => setGen(null)} onExit={() => setGen(null)} />
            : gen && gen.phase === 'texto'
            ? <TextPicker gradeName={g.name} identity={identity} prompt={gen.prompt} selectedId={gen.texto && gen.texto.id}
                modoPropio={!!gen.textoPropio}
                onSelect={(t) => setGen(x => ({ ...x, texto: t }))}
                onContinue={(t) => setGen(x => ({ ...x, texto: t, phase: universoOn ? 'universo' : 'revision' }))}
                onBack={() => setGen(null)} onExit={() => setGen(null)} />
            : gen && gen.phase === 'universo'
            ? <UniversoPicker gradeName={g.name} identity={identity} value={gen.universo}
                onContinue={(u) => setGen(x => ({ ...x, universo: u, phase: 'revision' }))}
                onSkip={() => setGen(x => ({ ...x, universo: null, phase: 'revision' }))}
                onBack={() => setGen(x => x.materia === 'lengua' ? { ...x, phase: 'texto' } : null)} onExit={() => setGen(null)} />
            : gen && gen.phase === 'revision'
            ? <ReviewInstance gradeName={g.name} identity={identity} prompt={gen.prompt} materia={gen.materia} retro={retro}
                clases={gen.clases} onChangeClases={(c) => setGen(x => ({ ...x, clases: c }))} clasesUI={clasesUI}
                brief={briefText}
                texto={gen.texto} onChangeText={() => setGen(x => ({ ...x, phase: 'texto' }))}
                universo={gen.universo} onSetUniverso={(v) => setGen(x => ({ ...x, universo: v }))}
                prevPlan={prevPlan} onOpenMemoria={() => setCtxSetup(true)}
                onGenerate={() => setGen(x => ({ ...x, phase: 'result' }))} universoEmpty={universoEmpty}
                onBack={() => setGen(x => x.materia === 'lengua' ? { ...x, phase: (universoOn ? 'universo' : 'texto') } : null)} onExit={() => setGen(null)} />
            : gen
            ? <GeneratingSkeleton gradeName={g.name} materia={gen.materia} tema={gen.prompt}
                onDone={() => setGen(x => ({ ...x, phase: 'plan' }))} />
            : <Composer identity={identity} mode={emptyMode} promptsUI={promptsUI} gradeName={g.name}
                hasContext={!isEmpty || !!customCtx || !!memoriaFull}
                onSend={(p, m, opts) => {
                  if (opts && opts.textoPropio) { setGen({ prompt: '', materia: 'lengua', clases: SUGGESTED_CLASES, textoPropio: true, phase: 'texto' }); return; }
                  const mat = m || 'lengua'; const askR = (retroMode === 'paso' || retroMode === 'ambos') && !retro && !!prevPlan;
                  setGen({ prompt: p, materia: mat, clases: SUGGESTED_CLASES, phase: askR ? 'retro' : (mat === 'lengua' ? 'texto' : 'revision') }); }} />}


          {!gen && (() => {
            const sinContexto = isEmpty && !customCtx && !memoriaFull;
            const bannerBlock = (retroMode === 'banner' || retroMode === 'ambos') && !retroDismissed && prevPlan && (!retro || retro.src === 'banner') ? (
              <div style={{ maxWidth: 720, margin: '26px auto 0' }}>
                <RetroBanner plan={prevPlan} gradeName={g.name} saved={retro && retro.src === 'banner' ? retro : null}
                  onSave={(ans) => { setRetro(ans); if (ans.fact) addFact(ans.fact); }}
                  onDismiss={() => { setRetroDismissed(true); }} />
              </div>
            ) : null;
            const contextoBlock = (
              <div style={{ maxWidth: 720, margin: '28px auto 0' }}>
                <InlineKnowledge gradeName={g.name} accent={acc}
                  emphasis={sinContexto} empty={sinContexto} ctxText={memoriaFull || customCtx}
                  onSetup={() => setCtxSetup(true)} />
              </div>
            );
            // producto: sin contexto todavía → el bloque de contexto va arriba y el banner debajo
            return sinContexto
              ? <React.Fragment>{contextoBlock}{bannerBlock}</React.Fragment>
              : <React.Fragment>{bannerBlock}{contextoBlock}</React.Fragment>;
          })()}

          {!gen && (plansToShow.length > 0 ? (
            <div style={{ maxWidth: 720, margin: '36px auto 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontFamily: T.head, fontSize: 15.5, fontWeight: 700, color: T.ink, margin: 0 }}>
                  Planificaciones recientes</h3>
                <span style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: acc }}>Ver todas ({plansToShow.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plansToShow.slice(0, 3).map((p, i) => <PlanRow key={i} p={p} />)}
              </div>
            </div>
          ) : isEmpty ? (
            <EmptyPlans gradeName={g.name} />
          ) : null)}
          </React.Fragment>
          )}
        </div>
        {ctxSetup && <ContextSetup gradeName={g.name}
          initial={memoriaFull || customCtx || (isEmpty ? '' : GROUP_CONTEXT)}
          onClose={() => setCtxSetup(false)}
          onSave={(text) => { setMemoriaFull(text); if (isEmpty && !customCtx) setOverride(o => ({ ...(o || {}), estado: 'vacio', ctx: text })); }} />}
        <SourceDrawer open={openSource} accent={acc} onClose={() => setOpenSource(null)} />
      </div>
    );
  }

  // ── Layout workspace: sidebar + panel lateral ──────────
  return (
    <div style={{ height: '100%', display: 'flex', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <ProjectSidebar gradeId={gradeId} identity={identity} onPick={(id) => { setGradeId(id); setGen(null); }} />

      {/* main workspace */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* grade identity header */}
        <header style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 28px',
          borderBottom: `1px solid ${T.borderSoft}` }}>
          <span style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: acc,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 16px -6px ${acc}` }}>
            <Icon name={identity.icon} size={22} color="#fff" /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <h2 style={{ fontFamily: T.head, fontSize: 20, fontWeight: 800, color: T.ink, letterSpacing: '-0.3px', margin: 0 }}>{g.name}</h2>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: T.muted,
                display: 'flex', alignItems: 'center' }} title="Personalizar"><Icon name="pencil" size={14} /></button>
            </div>
            <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>{g.school} · {g.students} estudiantes</div>
          </div>
          {kbCollapsed && kbMode !== 'hidden' && (
            <button onClick={() => setKbCollapsed(false)} style={{ display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 44, border: `1.5px solid ${T.border}`, background: T.surface,
              cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink2 }}>
              <Icon name="info" size={15} /> Conocimiento</button>
          )}
        </header>

        {/* body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 28px 48px' }}>
          {gen && gen.phase === 'retro'
            ? <RetroStep gradeName={g.name} identity={identity} plan={prevPlan || PLANS_BY_GRADE.g1[0]}
                onContinue={(ans) => { setRetro(ans); if (ans.fact) addFact(ans.fact); setGen(x => ({ ...x, phase: x.materia === 'lengua' ? 'texto' : 'revision' })); }}
                onSkip={() => setGen(x => ({ ...x, phase: x.materia === 'lengua' ? 'texto' : 'revision' }))}
                onBack={() => setGen(null)} onExit={() => setGen(null)} />
            : gen && gen.phase === 'texto'
            ? <TextPicker gradeName={g.name} identity={identity} prompt={gen.prompt} selectedId={gen.texto && gen.texto.id}
                modoPropio={!!gen.textoPropio}
                onSelect={(t) => setGen(x => ({ ...x, texto: t }))}
                onContinue={(t) => setGen(x => ({ ...x, texto: t, phase: universoOn ? 'universo' : 'revision' }))}
                onBack={() => setGen(null)} onExit={() => setGen(null)} />
            : gen && gen.phase === 'universo'
            ? <UniversoPicker gradeName={g.name} identity={identity} value={gen.universo}
                onContinue={(u) => setGen(x => ({ ...x, universo: u, phase: 'revision' }))}
                onSkip={() => setGen(x => ({ ...x, universo: null, phase: 'revision' }))}
                onBack={() => setGen(x => x.materia === 'lengua' ? { ...x, phase: 'texto' } : null)} onExit={() => setGen(null)} />
            : gen && gen.phase === 'revision'
            ? <ReviewInstance gradeName={g.name} identity={identity} prompt={gen.prompt} materia={gen.materia} retro={retro}
                clases={gen.clases} onChangeClases={(c) => setGen(x => ({ ...x, clases: c }))} clasesUI={clasesUI}
                brief={briefText}
                texto={gen.texto} onChangeText={() => setGen(x => ({ ...x, phase: 'texto' }))}
                universo={gen.universo} onSetUniverso={(v) => setGen(x => ({ ...x, universo: v }))}
                prevPlan={prevPlan} onOpenMemoria={() => setCtxSetup(true)}
                onGenerate={() => setGen(x => ({ ...x, phase: 'result' }))} universoEmpty={universoEmpty}
                onBack={() => setGen(x => x.materia === 'lengua' ? { ...x, phase: (universoOn ? 'universo' : 'texto') } : null)} onExit={() => setGen(null)} />
            : gen
            ? <GeneratingSkeleton gradeName={g.name} materia={gen.materia} tema={gen.prompt}
                onDone={() => setGen(x => ({ ...x, phase: 'plan' }))} />
            : <Composer identity={identity} mode={emptyMode} promptsUI={promptsUI} gradeName={g.name}
                onSend={(p, m, opts) => {
                  if (opts && opts.textoPropio) { setGen({ prompt: '', materia: 'lengua', clases: SUGGESTED_CLASES, textoPropio: true, phase: 'texto' }); return; }
                  const mat = m || 'lengua'; const askR = (retroMode === 'paso' || retroMode === 'ambos') && !retro && !!prevPlan;
                  setGen({ prompt: p, materia: mat, clases: SUGGESTED_CLASES, phase: askR ? 'retro' : (mat === 'lengua' ? 'texto' : 'revision') }); }} />}

          {/* recientes */}
          {plans.length > 0 && !gen && (
            <div style={{ maxWidth: 720, margin: '40px auto 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontFamily: T.head, fontSize: 15.5, fontWeight: 700, color: T.ink, margin: 0 }}>
                  Planificaciones recientes</h3>
                <span style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: acc }}>Ver todas ({plans.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plans.slice(0, 3).map((p, i) => <PlanRow key={i} p={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>

      {kbMode !== 'hidden' &&
        <KnowledgePanel identity={identity} collapsed={kbCollapsed}
          onExpand={() => setKbCollapsed(false)} onCollapse={() => setKbCollapsed(true)}
          onOpenSource={setOpenSource} />}

      {ctxSetup && <ContextSetup gradeName={g.name}
        initial={memoriaFull || customCtx || (isEmpty ? '' : GROUP_CONTEXT)}
        onClose={() => setCtxSetup(false)}
        onSave={(text) => { setMemoriaFull(text); if (isEmpty && !customCtx) setOverride(o => ({ ...(o || {}), estado: 'vacio', ctx: text })); }} />}
      <SourceDrawer open={openSource} accent={acc} onClose={() => setOpenSource(null)} />
    </div>
  );
};

Object.assign(window, { GradeProjectHome, IDENTITY_COLORS, IDENTITY_ICONS, idOf });
