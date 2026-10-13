// newgrade.jsx — Pantalla "Nuevo grado" (crear un grupo-clase como proyecto)
// Lo central es capturar el CONTEXTO del grupo, que es lo que hace buenas
// las planificaciones. Dos enfoques: 'formulario' (default del producto) y
// 'guiado'. La escuela se elige contra el índice oficial (nombre o CUE) y
// autocompleta la jurisdicción. Reusa tokens/primitivas de shared.jsx.

const YEAR_OPTS = ['1°', '2°', '3°'];
const SECTION_OPTS = ['A', 'B', 'C', 'D'];
const TURNO_OPTS = ['Mañana', 'Tarde'];

// las 24 jurisdicciones (como en el producto)
const JURISDICCIONES = ['Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
  'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'];
const SIN_JURISDICCION = 'Sin elegir';

// muestra del padrón oficial de escuelas (CUE + jurisdicción)
const ESCUELAS_INDEX = [
  { cue: '020049200', nombre: 'Escuela N° 12 D.E. 9 «Prof. Rodolfo Senet»', jurisdiccion: 'CABA' },
  { cue: '020112300', nombre: 'Escuela N° 4 D.E. 7 «Provincia de Corrientes»', jurisdiccion: 'CABA' },
  { cue: '060378900', nombre: 'Escuela Primaria N° 52 «Manuel Belgrano»', jurisdiccion: 'Buenos Aires' },
  { cue: '061245800', nombre: 'Instituto Belgrano', jurisdiccion: 'Buenos Aires' },
  { cue: '140087600', nombre: 'Escuela José María Paz', jurisdiccion: 'Córdoba' },
  { cue: '820033400', nombre: 'Escuela N° 6 «Domingo F. Sarmiento»', jurisdiccion: 'Santa Fe' },
];
const normEscuela = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.\s·°«»"]/g, '');
const buscarEscuelas = (q) => {
  const n = normEscuela(q);
  if (n.length < 2) return [];
  return ESCUELAS_INDEX.filter(e => normEscuela(e.nombre).includes(n) || e.cue.includes(n.replace(/\D/g, '') || '—')).slice(0, 5);
};

// ── Combobox de escuela (nombre o CUE, autocompleta jurisdicción) ──
const EscuelaCombobox = ({ value, onChange, onPick, autoFocus }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const matches = open ? buscarEscuelas(value) : [];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <Field value={value} autoFocus={autoFocus} placeholder="Nombre de la escuela o CUE"
        onChange={(v) => { onChange(v); setOpen(true); }} />
      {matches.length > 0 && (
        <div className="gh-fade" role="listbox" aria-label="Escuelas del índice"
          style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 45,
            background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`,
            boxShadow: '0 18px 44px rgba(11,27,102,.16)', overflow: 'hidden', padding: 5 }}>
          {matches.map(e => (
            <button key={e.cue} onMouseDown={ev => ev.preventDefault()}
              onClick={() => { onPick(e); setOpen(false); }} className="gh-row"
              style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '9px 11px',
                borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              <Icon name="building" size={16} color={T.brand} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 500, color: T.ink,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.nombre}</div>
                <div style={{ fontFamily: T.font, fontSize: 11.5, color: T.muted, marginTop: 1 }}>CUE {e.cue}</div>
              </div>
              <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                textTransform: 'uppercase', color: T.muted, flexShrink: 0 }}>{e.jurisdiccion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// prompts que ayudan a describir el grupo (rellenan / guían el contexto)
const CONTEXT_PROMPTS = [
  '¿Cómo vienen con la lectura y la escritura?',
  '¿Hay estudiantes con apoyo de integración?',
  '¿Cómo es la dinámica del grupo?',
  '¿Qué les interesa o los entusiasma?',
  '¿Cómo están en matemática?',
];
const CONTEXT_EXAMPLE = 'Grupo de 24 chicos, muy conversador. La mayoría lee palabras y frases cortas; cinco o seis todavía consolidando la lectura. Tres con apoyo de integración. Les cuesta sostener consignas largas, funciona arrancar desde lo oral.';

// ── Asistente "Ayudame a describirlo" ────────────────────
// Preguntas de diagnóstico con opciones; con las respuestas se
// compone la descripción del grupo (estilo preguntas de Claude).
const joinAnd = (arr) => arr.length <= 1 ? (arr[0] || '')
  : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];

const DIAG = [
  { id: 'tam', q: '¿Cuántos son en el grupo?', multi: false,
    opts: [
      { l: 'Menos de 20', f: 'menos de 20 chicos y chicas' },
      { l: 'Entre 20 y 25', f: 'entre 20 y 25 chicos y chicas' },
      { l: 'Entre 25 y 30', f: 'entre 25 y 30 chicos y chicas' },
      { l: 'Más de 30', f: 'más de 30 chicos y chicas' },
    ], tpl: f => `Es un grupo de ${f[0]}.` },
  { id: 'lengua', q: '¿Cómo vienen con la lectura y la escritura?', multi: true,
    opts: [
      { l: 'Leen y escriben con autonomía', f: 'leen y escriben con autonomía' },
      { l: 'Leen palabras y frases cortas', f: 'leen palabras y frases cortas' },
      { l: 'Consolidando la lectura', f: 'varios todavía están consolidando la lectura' },
      { l: 'En alfabetización inicial', f: 'están en plena alfabetización inicial' },
    ], tpl: f => `En lectura y escritura, ${joinAnd(f)}.` },
  { id: 'mate', q: '¿Y en matemática?', multi: true,
    opts: [
      { l: 'Cálculos con soltura', f: 'resuelven cálculos con soltura' },
      { l: 'Suman y restan con apoyo', f: 'suman y restan con apoyo de material concreto' },
      { l: 'Empiezan con sumas', f: 'cuentan y empiezan con las primeras sumas' },
      { l: 'Niveles dispares', f: 'hay niveles muy dispares' },
    ], tpl: f => `En matemática, ${joinAnd(f)}.` },
  { id: 'apoyo', q: '¿Hay estudiantes con apoyo de integración?', multi: false,
    opts: [
      { l: 'No', f: 'No hay estudiantes con apoyo de integración.' },
      { l: 'Uno o dos', f: 'Hay uno o dos estudiantes con apoyo de integración.' },
      { l: 'Tres o más', f: 'Hay tres o más estudiantes con apoyo de integración.' },
    ], tpl: f => f[0] },
  { id: 'dinamica', q: '¿Cómo es la dinámica del grupo?', multi: true,
    opts: [
      { l: 'Conversador y participativo', f: 'es conversador y participativo' },
      { l: 'Le cuesta la atención', f: 'le cuesta sostener la atención en consignas largas' },
      { l: 'Trabaja bien en equipo', f: 'trabaja bien en equipo' },
      { l: 'Mejor desde lo oral', f: 'funciona mejor arrancar desde lo oral' },
    ], tpl: f => `El grupo ${joinAnd(f)}.` },
  { id: 'interes', q: '¿Qué los entusiasma?', multi: true,
    opts: [
      { l: 'Los cuentos', f: 'los cuentos' },
      { l: 'Los juegos', f: 'los juegos' },
      { l: 'Lo audiovisual', f: 'lo audiovisual' },
      { l: 'El cuerpo y el movimiento', f: 'las actividades con el cuerpo' },
    ], tpl: f => `Les entusiasma${f.length > 1 ? 'n' : ''} ${joinAnd(f)}.` },
];

const AsstChip = ({ label, on, onClick }) => (
  <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px',
    borderRadius: 44, cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
    border: `1.5px solid ${on ? T.brand : T.border}`, background: on ? T.brandTint : T.surface,
    color: on ? T.brandDeep : T.ink2, transition: 'all .13s' }}>
    {on && <Icon name="check" size={13} color={T.brandDeep} />} {label}</button>
);

const QuestionBlock = ({ q, sel, onToggle }) => {
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const commit = () => { const v = draft.trim(); if (v && !sel.includes(v)) onToggle(v); setDraft(''); setAdding(false); };
  const customs = sel.filter(l => !q.opts.some(o => o.l === l));
  return (
    <div>
      <div style={{ fontFamily: T.head, fontSize: 14.5, fontWeight: 700, color: T.ink, marginBottom: 10 }}>
        {q.q} {q.multi && <span style={{ fontFamily: T.font, fontSize: 11.5, fontWeight: 600, color: T.faint }}>· elegí las que apliquen</span>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {q.opts.map(o => (
          <AsstChip key={o.l} label={o.l} on={sel.includes(o.l)} onClick={() => onToggle(o.l)} />
        ))}
        {customs.map(c => (
          <AsstChip key={c} label={c} on onClick={() => onToggle(c)} />
        ))}
        {adding ? (
          <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
            placeholder="Escribí tu respuesta…" style={{ minWidth: 190, padding: '8px 13px', borderRadius: 44,
              border: `1.5px solid ${T.brand}`, outline: 'none', fontFamily: T.font, fontSize: 13, fontWeight: 600,
              background: T.surface, color: T.ink }} />
        ) : (
          <button onClick={() => setAdding(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 13px', borderRadius: 44, cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
            border: `1.5px dashed ${T.border}`, background: 'transparent', color: T.muted }}>
            <Icon name="pencil" size={13} color={T.muted} /> Otra…</button>
        )}
      </div>
    </div>
  );
};

const DescribeAssistant = ({ onGenerate, onClose }) => {
  const [ans, setAns] = React.useState({});
  const [extra, setExtra] = React.useState('');
  const toggle = (q, label) => setAns(a => {
    const cur = a[q.id] || [];
    if (q.multi) return { ...a, [q.id]: cur.includes(label) ? cur.filter(x => x !== label) : [...cur, label] };
    return { ...a, [q.id]: cur.includes(label) ? [] : [label] };
  });
  const answered = Object.values(ans).some(v => v && v.length) || extra.trim();
  const build = () => {
    const out = [];
    DIAG.forEach(q => {
      const sel = ans[q.id] || [];
      if (!sel.length) return;
      const frags = sel.map(l => { const o = q.opts.find(x => x.l === l); return o ? o.f : l; });
      let s = q.tpl(frags).trim();
      s = s.charAt(0).toUpperCase() + s.slice(1);
      if (!/[.!?]$/.test(s)) s += '.';
      out.push(s);
    });
    let ex = extra.trim();
    if (ex) { if (!/[.!?]$/.test(ex)) ex += '.'; out.push(ex[0].toUpperCase() + ex.slice(1)); }
    onGenerate(out.join(' '));
  };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(20,18,30,.34)' }}>
      <div className="gh-fade" onClick={e => e.stopPropagation()} style={{ width: 520, maxHeight: '86%',
        display: 'flex', flexDirection: 'column', background: T.surface, borderRadius: 20,
        border: `1px solid ${T.border}`, boxShadow: '0 30px 80px -24px rgba(11,27,102,.4)', overflow: 'hidden' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '20px 22px 16px',
          borderBottom: `1px solid ${T.borderSoft}` }}>
          <span style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, background: T.brandTint,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={T.aiIcon} size={18} color={T.brandDeep} /></span>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: T.head, fontSize: 17, fontWeight: 800, color: T.ink, margin: 0,
              letterSpacing: '-0.2px' }}>Contame del grupo y armo la descripción</h2>
            <p style={{ fontFamily: T.font, fontSize: 13, color: T.muted, margin: '3px 0 0', lineHeight: 1.5 }}>
              Elegí lo que aplique. Con eso redacto un primer borrador que después ajustás.</p>
          </div>
          <IconButton name="x" size={32} onClick={onClose} title="Cerrar" />
        </div>

        {/* questions */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex',
          flexDirection: 'column', gap: 22 }}>
          {DIAG.map(q => (
            <QuestionBlock key={q.id} q={q} sel={ans[q.id] || []} onToggle={(label) => toggle(q, label)} />
          ))}
          <div>
            <div style={{ fontFamily: T.head, fontSize: 14.5, fontWeight: 700, color: T.ink, marginBottom: 10 }}>
              ¿Algo más que quieras sumar? <span style={{ fontFamily: T.font, fontSize: 11.5, fontWeight: 600, color: T.faint }}>· opcional</span></div>
            <TextArea value={extra} onChange={setExtra} rows={2} placeholder="Algún detalle particular del grupo…" />
          </div>
        </div>

        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px',
          borderTop: `1px solid ${T.borderSoft}`, background: T.bg }}>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.muted }}>Escribir yo mismo</button>
          <div style={{ flex: 1 }} />
          <PillButton icon={T.aiIcon} disabled={!answered} onClick={build}>Generar descripción</PillButton>
        </div>
      </div>
    </div>
  );
};

// ── Preview del "proyecto" que se está creando ───────────
const GradePreview = ({ year, section, school, turno, ctx }) => {
  const name = `${year || '2°'} ${section || 'A'}`;
  return (
    <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.surface,
      padding: 20, boxShadow: '0 10px 30px -16px rgba(11,27,102,.16)' }}>
      <div style={{ fontFamily: T.font, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: T.muted, marginBottom: 14 }}>Vista previa</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <span style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: T.brand,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 6px 16px -6px ${T.brand}` }}>
          <Icon name="users" size={22} color="#fff" /></span>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: T.head, fontSize: 19, fontWeight: 800, color: T.ink,
              letterSpacing: '-0.3px' }}>{name}</span>
            {turno && <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.brandDeep,
              background: T.brandTint, padding: '3px 9px', borderRadius: 20 }}>{turno}</span>}
          </div>
          <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis' }}>{school || 'Sin escuela'}</div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${T.borderSoft}`, marginTop: 16, paddingTop: 14 }}>
        <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
          textTransform: 'uppercase', color: T.muted, marginBottom: 6 }}>Lo que sabré del grupo</div>
        <p style={{ fontFamily: T.font, fontSize: 13.5, lineHeight: 1.6, margin: 0,
          color: ctx ? T.ink2 : T.faint }}>{ctx || 'Todavía sin contexto. Cuanto más cuentes, mejores planificaciones.'}</p>
      </div>
    </div>
  );
};

// ── Enfoque FORMULARIO ───────────────────────────────────
const NewGradeForm = ({ onCancel, onCreate }) => {
  const [year, setYear] = React.useState('2°');
  const [section, setSection] = React.useState('A');
  const [turno, setTurno] = React.useState('Mañana');
  const [school, setSchool] = React.useState('');
  const [jurisdiccion, setJurisdiccion] = React.useState(SIN_JURISDICCION);
  const [ctx, setCtx] = React.useState('');
  const [assist, setAssist] = React.useState(false);
  const ready = year && section;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start',
      maxWidth: 900, margin: '0 auto' }}>
      <div>
        {/* identidad — compacta, en una sola fila */}
        <div style={{ marginBottom: 26 }}>
          <label style={lbl}>Grado</label>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <MiniSelect label="Año" value={year} options={YEAR_OPTS} onChange={setYear} width={82} />
            <MiniSelect label="Sección" value={section} options={SECTION_OPTS} onChange={setSection} allowCustom width={88} />
            <MiniSelect label="Turno" value={turno} options={TURNO_OPTS} onChange={setTurno} width={112} />
          </div>
        </div>

        {/* escuela — índice oficial (nombre o CUE) + jurisdicción */}
        <div style={{ marginBottom: 26 }}>
          <label style={lbl}>Escuela <span style={opt}>· opcional</span></label>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <EscuelaCombobox value={school} onChange={setSchool}
              onPick={(e) => { setSchool(e.nombre); setJurisdiccion(e.jurisdiccion); }} />
            <MiniSelect label="Jurisdicción" value={jurisdiccion}
              options={[SIN_JURISDICCION, ...JURISDICCIONES]} onChange={setJurisdiccion} width={230} />
          </div>
        </div>

        {/* contexto — el corazón */}
        <div style={{ marginBottom: 26 }}>
          <label style={lbl}>Contexto del grupo</label>
          <p style={{ fontFamily: T.font, fontSize: 13, color: T.muted, margin: '4px 0 10px', lineHeight: 1.5 }}>
            Contá cómo es el grupo con tus palabras. Esto es lo que hace que las planificaciones se adapten a ellos.</p>
          <TextArea value={ctx} onChange={setCtx} rows={5}
            placeholder="Cómo vienen con la lectura, la dinámica del grupo, quiénes necesitan apoyo…" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
            <button onClick={() => setAssist(true)} className="ng-chip" style={chip(true)}>
              <Icon name={T.aiIcon} size={13} color={T.brandDeep} /> Ayudame a describirlo</button>
          </div>
        </div>
      </div>

      {/* sticky preview + actions */}
      <div style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <GradePreview year={year} section={section} school={school} turno={turno} ctx={ctx} />
        <PillButton full size="lg" icon="check" disabled={!ready}
          onClick={() => onCreate({ year, section, turno, school, jurisdiccion, ctx })}>Crear grado</PillButton>
        <button onClick={onCancel} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
          fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.muted }}>Cancelar</button>
      </div>
      {assist && <DescribeAssistant onClose={() => setAssist(false)}
        onGenerate={(text) => { setCtx(text); setAssist(false); }} />}
    </div>
  );
};

// ── Enfoque GUIADO (conversacional) ──────────────────────
const GUIDED_STEPS = [
  { key: 'name', q: '¿Para qué grado querés enseñar?', kind: 'name' },
  { key: 'school', q: '¿En qué escuela?', kind: 'school', skip: true },
  { key: 'ctx', q: 'Contame cómo es el grupo', sub: 'Con tus palabras: cómo vienen, qué los entusiasma, quiénes necesitan apoyo.', kind: 'ctx' },
];

const NewGradeGuided = ({ onCancel, onCreate }) => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ year: '2°', section: 'A', turno: 'Mañana',
    school: '', jurisdiccion: SIN_JURISDICCION, ctx: '' });
  const [assist, setAssist] = React.useState(false);
  const set = (patch) => setData(d => ({ ...d, ...patch }));
  const s = GUIDED_STEPS[step];
  const last = step === GUIDED_STEPS.length - 1;
  const next = () => last ? onCreate(data) : setStep(step + 1);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* progress */}
      <div role="progressbar" aria-label={`Paso ${step + 1} de ${GUIDED_STEPS.length}`}
        style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {GUIDED_STEPS.map((_, i) => (
          <span key={i} style={{ flex: 1, height: 4, borderRadius: 4,
            background: i <= step ? T.brand : T.bgDeep, transition: 'background .25s' }} />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: T.brandTint, display: 'flex',
          alignItems: 'center', justifyContent: 'center' }}><Icon name={T.aiIcon} size={16} color={T.brandDeep} /></span>
        <span style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.muted }}>Nuevo grado · paso {step + 1} de {GUIDED_STEPS.length}</span>
      </div>
      <h1 style={{ fontFamily: T.head, fontSize: 28, fontWeight: 800, color: T.ink, letterSpacing: '-0.5px',
        margin: 0, lineHeight: 1.15 }}>{s.q}</h1>
      {s.sub && <p style={{ fontFamily: T.font, fontSize: 15, color: T.ink2, lineHeight: 1.55, margin: '10px 0 0' }}>{s.sub}</p>}

      <div style={{ marginTop: 22 }}>
        {s.kind === 'name' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Segmented opts={YEAR_OPTS} value={data.year} onChange={v => set({ year: v })} />
              <SectionPicker value={data.section} onChange={v => set({ section: v })} />
            </div>
            <div>
              <div style={{ ...lbl, marginBottom: 9 }}>Turno</div>
              <Segmented opts={TURNO_OPTS} value={data.turno} onChange={v => set({ turno: v })} />
            </div>
          </div>
        )}
        {s.kind === 'school' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <EscuelaCombobox value={data.school} autoFocus
              onChange={v => set({ school: v })}
              onPick={(e) => set({ school: e.nombre, jurisdiccion: e.jurisdiccion })} />
            <div>
              <div style={{ ...lbl, marginBottom: 9 }}>Jurisdicción</div>
              <MiniSelect label="" value={data.jurisdiccion}
                options={[SIN_JURISDICCION, ...JURISDICCIONES]} onChange={v => set({ jurisdiccion: v })} width={230} />
            </div>
          </div>
        )}
        {s.kind === 'ctx' && (
          <React.Fragment>
            <TextArea value={data.ctx} onChange={v => set({ ctx: v })} rows={5}
              placeholder="Escribilo libremente…" autoFocus />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
              <button onClick={() => setAssist(true)} className="ng-chip" style={chip(true)}>
                <Icon name={T.aiIcon} size={13} color={T.brandDeep} /> Ayudame a describirlo</button>
            </div>
          </React.Fragment>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 30 }}>
        <button onClick={step === 0 ? onCancel : () => setStep(step - 1)} style={{ display: 'inline-flex',
          alignItems: 'center', gap: 7, border: 'none', background: 'transparent', cursor: 'pointer',
          fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink2 }}>
          <Icon name="arrow-left" size={16} color={T.ink2} /> {step === 0 ? 'Cancelar' : 'Atrás'}</button>
        <div style={{ flex: 1 }} />
        {s.skip && <button onClick={next} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
          fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.muted }}>Omitir</button>}
        <PillButton icon={last ? 'check' : undefined} iconRight={last ? undefined : 'arrow-right'}
          onClick={next}>{last ? 'Crear grado' : 'Siguiente'}</PillButton>
      </div>
      {assist && <DescribeAssistant onClose={() => setAssist(false)}
        onGenerate={(text) => { set({ ctx: text }); setAssist(false); }} />}
    </div>
  );
};

// compacto: dropdown chico para no ocupar espacio protagónico
const MiniSelect = ({ label, value, options, onChange, allowCustom, width = 92 }) => {
  const [open, setOpen] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setAdding(false); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const commit = () => { const v = draft.trim().toUpperCase(); if (v) onChange(v); setDraft(''); setAdding(false); setOpen(false); };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {label ? <div style={{ fontFamily: T.font, fontSize: 11.5, fontWeight: 600, color: T.muted, marginBottom: 6 }}>{label}</div> : null}
      <button onClick={() => setOpen(o => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
        width, padding: '9px 12px', borderRadius: 10, border: `1px solid ${open ? T.brand : T.border}`,
        background: T.surface, cursor: 'pointer', fontFamily: T.font, fontSize: 14.5, fontWeight: 700, color: T.ink,
        transition: 'border-color .15s' }}>
        <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        <Icon name="chevron-down" size={15} color={T.muted}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '100%', background: T.surface,
          borderRadius: 12, padding: 6, border: `1px solid ${T.border}`,
          boxShadow: '0 18px 44px rgba(11,27,102,.16)', zIndex: 40, maxHeight: 280, overflowY: 'auto' }}>
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ display: 'flex', alignItems: 'center',
              gap: 8, width: '100%', padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
              background: o === value ? T.bgDeep : 'transparent', fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink }}>
              <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{o}</span>{o === value && <Icon name="check" size={15} color={T.brandDeep} />}
            </button>
          ))}
          {allowCustom && (adding ? (
            <input autoFocus value={draft} maxLength={14} onChange={e => setDraft(e.target.value)} onBlur={commit}
              onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setAdding(false); setDraft(''); } }}
              placeholder="Otra…" style={{ width: '100%', marginTop: 2, padding: '8px 10px', borderRadius: 8,
                border: `1px solid ${T.brand}`, outline: 'none', fontFamily: T.font, fontSize: 14, fontWeight: 600 }} />
          ) : (
            <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent',
              fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.brandDeep }}>
              <Icon name="plus" size={15} color={T.brandDeep} /> Otra…</button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── segmented control ────────────────────────────────────
const segBtn = (on) => ({ minWidth: 40, padding: '9px 13px', borderRadius: 9,
  border: 'none', cursor: 'pointer', fontFamily: T.font, fontSize: 14.5, fontWeight: on ? 700 : 600,
  background: on ? T.surface : 'transparent', color: on ? T.ink : T.ink2,
  boxShadow: on ? '0 1px 3px rgba(0,0,0,.1)' : 'none', transition: 'all .12s' });

const Segmented = ({ opts, value, onChange }) => (
  <div style={{ display: 'inline-flex', gap: 4, background: T.bgDeep, borderRadius: 12, padding: 4 }}>
    {opts.map(o => (
      <button key={o} onClick={() => onChange(o)} style={segBtn(o === value)}>{o}</button>
    ))}
  </div>
);

// sección con opción "+" para una letra/nombre que no esté en la lista
const SectionPicker = ({ value, onChange }) => {
  const [extras, setExtras] = React.useState([]);
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const all = [...SECTION_OPTS, ...extras];
  const commit = () => {
    const v = draft.trim().toUpperCase();
    if (v) { if (!all.includes(v)) setExtras(e => [...e, v]); onChange(v); }
    setDraft(''); setAdding(false);
  };
  return (
    <div role="radiogroup" aria-label="Sección" style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
      background: T.bgDeep, borderRadius: 12, padding: 4 }}>
      {all.map(o => (
        <button key={o} onClick={() => onChange(o)} style={segBtn(o === value)}>{o}</button>
      ))}
      {adding ? (
        <input autoFocus value={draft} maxLength={12} aria-label="Otra sección"
          onChange={e => setDraft(e.target.value)} onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
          placeholder="Otra" style={{ width: 74, padding: '9px 11px', borderRadius: 9, border: `1px solid ${T.brand}`,
            outline: 'none', fontFamily: T.font, fontSize: 14.5, fontWeight: 600, background: T.surface, color: T.ink }} />
      ) : (
        <button onClick={() => setAdding(true)} title="Otra sección"
          style={{ ...segBtn(false), color: T.brandDeep, fontWeight: 700, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={16} color={T.brandDeep} /></button>
      )}
    </div>
  );
};

const lbl = { fontFamily: 'Figtree, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#37352F', letterSpacing: '-0.1px' };
const opt = { fontWeight: 500, color: '#9B968C' };
const chip = (primary) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px',
  borderRadius: 44, cursor: 'pointer', fontFamily: 'Figtree, sans-serif', fontSize: 12.5, fontWeight: 600,
  border: `1px solid ${primary ? 'transparent' : 'rgba(0,0,0,.1)'}`,
  background: primary ? '#EEE7FB' : '#fff', color: primary ? '#5B21B6' : '#605A50' });

// ── toggle de enfoque (formulario / guiado) ──────────────
const ModeToggle = ({ value, onChange }) => {
  const opts = [
    { key: 'formulario', label: 'Formulario', icon: 'clipboard' },
    { key: 'guiado', label: 'Guiado', icon: T.aiIcon },
  ];
  return (
    <div style={{ display: 'inline-flex', gap: 4, background: T.bgDeep, borderRadius: 11, padding: 4 }}>
      {opts.map(o => {
        const on = o.key === value;
        return (
          <button key={o.key} onClick={() => onChange(o.key)} style={{ display: 'inline-flex',
            alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13, fontWeight: on ? 700 : 600,
            background: on ? T.surface : 'transparent', color: on ? T.ink : T.ink2,
            boxShadow: on ? '0 1px 3px rgba(0,0,0,.1)' : 'none', transition: 'all .13s' }}>
            <Icon name={o.icon} size={15} color={on ? T.brandDeep : T.muted} /> {o.label}</button>
        );
      })}
    </div>
  );
};

// ── pantalla contenedora ─────────────────────────────────
const NewGradeScreen = ({ mode = 'formulario', onCancel, onCreate }) => {
  const [m, setM] = React.useState(mode);
  React.useEffect(() => { setM(mode); }, [mode]);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, overflow: 'hidden' }}>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 26px',
        borderBottom: `1px solid ${T.borderSoft}` }}>
        <span style={{ fontFamily: T.head, fontSize: 16, fontWeight: 700, color: T.ink }}>Nuevo grado</span>
        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <Logo height={21} /></span>
        <div style={{ flex: 1 }} />
        <ModeToggle value={m} onChange={setM} />
        <span style={{ width: 1, height: 22, background: T.border, margin: '0 4px' }} />
        <IconButton name="x" size={34} onClick={onCancel} title="Cerrar" />
      </header>
      <div style={{ flex: 1, overflowY: 'auto', padding: '44px 28px 56px' }}>
        {m === 'guiado'
          ? <NewGradeGuided key="guiado" onCancel={onCancel} onCreate={onCreate} />
          : <NewGradeForm key="formulario" onCancel={onCancel} onCreate={onCreate} />}
      </div>
    </div>
  );
};

Object.assign(window, { NewGradeScreen, DescribeAssistant, EscuelaCombobox, JURISDICCIONES, ESCUELAS_INDEX });
