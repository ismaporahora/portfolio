// flow.jsx — Conversational flow orchestrator (opciones A y B)

const STEPS = [
  { key: 'inicio',    topic: 'Grado y materia' },
  { key: 'contenido', topic: 'Qué enseñar' },
  { key: 'universo',  topic: 'Universo temático', optional: true },
  { key: 'grupo',     topic: 'Tu grupo', optional: true },
];

// ── Progress indicator (benchmark #7) ────────────────────
// Several treatments to compare (see the "Indicador de progreso" section in
// the canvas). Switch the default here. index 0..N-1 = capture step; >= N = Revisión.
const PROGRESS_VARIANT = 'barra'; // barra | etiqueta | segmentos | puntos | anillo | fraccion | ninguno

const FlowProgress = ({ index, variant = PROGRESS_VARIANT }) => {
  const N = STEPS.length;
  const isRev = index >= N;
  const num = Math.min(index + 1, N);
  const stepName = isRev ? 'Revisión' : STEPS[index].topic;
  const frac = `${isRev ? N : num}/${N}`;
  const pct = ((isRev ? N : num) / N) * 100;
  const txt = (col = T.ink2, fs = 12) => ({ fontFamily: T.font, fontSize: fs, fontWeight: 600,
    color: col, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' });

  if (variant === 'ninguno') return null;

  if (variant === 'fraccion')
    return <span style={txt()}>{isRev ? 'Revisión' : `Paso ${num} de ${N}`}</span>;

  if (variant === 'etiqueta') return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
      <span style={txt(T.ink, 13.5)}>{stepName}</span>
      <span style={txt(T.faint)}>{frac}</span>
    </span>
  );

  if (variant === 'barra') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={txt()}>{frac}</span>
      <div style={{ width: 88, height: 5, borderRadius: 5, background: T.border, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 5, background: T.brand, transition: 'width 220ms ease' }} />
      </div>
    </div>
  );

  if (variant === 'segmentos') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={txt()}>{frac}</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: N }).map((_, i) => (
          <span key={i} style={{ width: 18, height: 5, borderRadius: 2,
            background: (isRev || i < num) ? T.brand : T.border, transition: 'background 150ms' }} />
        ))}
      </div>
    </div>
  );

  if (variant === 'anillo') {
    const R = 9, C = 2 * Math.PI * R, p = (isRev ? N : num) / N;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ display: 'block', transform: 'rotate(-90deg)' }}>
          <circle cx="12" cy="12" r={R} fill="none" stroke={T.border} strokeWidth="3" />
          <circle cx="12" cy="12" r={R} fill="none" stroke={T.brand} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - p)} style={{ transition: 'stroke-dashoffset 250ms ease' }} />
        </svg>
        <span style={txt(T.ink, 13.5)}>{stepName}</span>
      </span>
    );
  }

  // puntos (dots only)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: N }).map((_, i) => (
        <span key={i} style={{ width: (!isRev && i === index) ? 16 : 6, height: 6, borderRadius: 6,
          background: (isRev || i <= index) ? T.brand : T.faint, transition: 'all 150ms ease' }} />
      ))}
    </div>
  );
};

// ── Running summary (Screen 04 hairline list) ────────
// The collected answers as borderless rows — topic · value · Editar on hover.
const SummaryRow = ({ topic, value, skipped, first, onEdit }) => {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={onEdit} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 8px', margin: '0 -8px',
        borderRadius: 6, cursor: 'pointer', background: h ? T.brandHover : 'transparent',
        borderTop: first ? 'none' : `1px solid ${T.borderSoft}`, transition: 'background 120ms ease' }}>
      <span style={{ width: 116, flexShrink: 0, fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.muted }}>{topic}</span>
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 14.5, fontWeight: 500,
        color: skipped ? T.muted : T.ink, fontStyle: skipped ? 'italic' : 'normal' }}>{value}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, opacity: h ? 1 : 0,
        transition: 'opacity 120ms', fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>
        <Icon name="pencil" size={13} color={T.brandDeep} /> Editar
      </span>
    </div>
  );
};

const SummaryList = ({ rows }) => {
  if (!rows || !rows.length) return null;
  return (
    <div className="cf-rise" style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
      {rows.map((r, i) => (
        <SummaryRow key={r.topic} topic={r.topic} value={r.value} skipped={r.skipped} first={i === 0} onEdit={r.onEdit} />
      ))}
    </div>
  );
};

// ── Full form (benchmark #8 · escape hatch for fast users) ──
// Every field at once, sharing the same answer state as the guided flow so
// toggling between the two never loses input.
const FullForm = ({ a, setA, grades, onGenerate }) => {
  const up = (patch) => setA(p => ({ ...p, ...patch }));
  const s = subjectTheme(a.materia);
  const canGen = a.grado && a.materia && a.contenido;
  return (
    <div className="cf-rise" style={{ maxWidth: 620, margin: '0 auto', padding: '32px 28px 120px',
      display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div>
        <h2 style={{ fontFamily: T.head, fontSize: 24, fontWeight: 600, color: T.ink,
          letterSpacing: '-0.015em', margin: 0 }}>Tu planificación</h2>
        <p style={{ fontFamily: T.font, fontSize: 14.5, color: T.ink2, lineHeight: 1.55, margin: '8px 0 0' }}>
          Completá lo que quieras y generamos. Volvé al modo guiado cuando quieras — se guarda todo.
        </p>
      </div>

      <div>
        <FieldLabel>Grado</FieldLabel>
        <GradoPicker grades={grades} grado={a.grado} gradoMeta={a.gradoMeta}
          onPick={({ grado, gradoMeta }) => up({ grado, gradoMeta })} />
      </div>

      <div>
        <FieldLabel>Materia</FieldLabel>
        <StepMateria value={a.materia} onSelect={(m) => up({ materia: m })} />
      </div>

      <div>
        <FieldLabel>¿Qué querés enseñar?</FieldLabel>
        <Field value={a.contenido || ''} onChange={(v) => up({ contenido: v, contenidoFree: true })}
          accent={s.color} placeholder="Ej. Lectura de textos narrativos" />
      </div>

      <div>
        <FieldLabel>Universo temático <span style={{ color: T.muted, fontWeight: 400 }}>(opcional)</span></FieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {UNIVERSOS.map(u => (
            <Pill key={u} selected={a.universo === u} onClick={() => up({ universo: a.universo === u ? null : u })}
              style={{ padding: '8px 15px', borderRadius: T.radiusSm + 2, fontSize: 13.5, fontWeight: 500 }}>{u}</Pill>
          ))}
        </div>
        <Field value={a.universo && !UNIVERSOS.includes(a.universo) ? a.universo : ''}
          onChange={(v) => up({ universo: v || null })} placeholder="…o escribí tu propio universo" />
      </div>

      <div>
        <FieldLabel>Tu grupo <span style={{ color: T.muted, fontWeight: 400 }}>(opcional)</span></FieldLabel>
        <TextArea value={a.group && a.group.trim() ? a.group : ''} onChange={(v) => up({ group: v })} rows={3}
          placeholder="Contanos cómo es el grupo: cantidad, particularidades, cómo vienen trabajando…" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
        <PillButton size="lg" icon={T.aiIcon} disabled={!canGen} onClick={onGenerate}>Generar planificación</PillButton>
        {!canGen && <span style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>Completá grado, materia y qué enseñar.</span>}
      </div>
    </div>
  );
};

// ── Accumulated answer card (editable) ───────────────────
const AnswerCard = ({ topic, dot, children, onEdit, skipped }) => {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={onEdit} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="cf-rise" style={{
        display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px 13px 14px',
        borderRadius: 14, cursor: 'pointer', background: T.surface,
        border: `1.5px solid ${h ? T.faint : T.border}`, transition: 'all 140ms ease',
      }}>
      <span style={{ width: 9, height: 9, borderRadius: 9, flexShrink: 0, background: dot || T.brand }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.muted,
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{topic}</div>
        <div style={{ fontFamily: T.font, fontSize: 14.5, color: skipped ? T.muted : T.ink,
          fontWeight: skipped ? 400 : 500, lineHeight: 1.4,
          fontStyle: skipped ? 'italic' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</div>
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: T.font, fontSize: 13,
        fontWeight: 600, color: h ? T.ink : T.muted, flexShrink: 0, transition: 'all 140ms' }}>
        <Icon name="pencil" size={14} /> {skipped ? 'Agregar' : 'Editar'}
      </span>
    </div>
  );
};

const TextoBaseCard = ({ text, onEdit }) => (
  <div className="cf-rise" style={{ borderRadius: 16, border: `1.5px solid ${T.brand}55`,
    background: T.brandTint, padding: '16px 18px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: T.font, fontSize: 11,
        fontWeight: 700, color: T.brandDeep, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <Icon name="file-text" size={15} color={T.brandDeep} /> Tu texto base
      </span>
      <button onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: 5, border: 'none',
        background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.brandDeep }}>
        <Icon name="pencil" size={14} /> Cambiar
      </button>
    </div>
    <p style={{ fontFamily: T.font, fontSize: 14, color: T.ink, lineHeight: 1.6, margin: 0,
      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{text}</p>
  </div>
);

// ── Revision summary ─────────────────────────────────────
const RevisionSummary = ({ a, onEdit, onGenerate }) => {
  const rows = [
    { topic: 'Grado', value: a.grado, onEdit: () => onEdit(0) },
    { topic: 'Materia', value: subjectTheme(a.materia).label, onEdit: () => onEdit(0) },
    { topic: 'Qué enseñar', value: a.contenido, onEdit: () => onEdit(1) },
  ];
  if (a.universo) rows.push({ topic: 'Universo temático', value: a.universo, onEdit: () => onEdit(2) });
  if (a.group && a.group.trim()) rows.push({ topic: 'Tu grupo', value: a.group + (a.saberes ? ` · ${a.saberes}` : ''), onEdit: () => onEdit(3) });
  return (
    <div className="cf-rise">
      <QuestionShell prompt="Esto entendí." sub="Revisá que esté todo bien y generamos. Vas a poder seguir ajustando después.">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {rows.map((r, i) => (
            <SummaryRow key={r.topic} topic={r.topic} value={r.value} first={i === 0} onEdit={r.onEdit} />
          ))}
        </div>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <PillButton size="lg" icon={T.aiIcon} onClick={onGenerate}>Generar planificación</PillButton>
          <span style={{ fontFamily: T.font, fontSize: 13, color: T.muted, display: 'flex',
            alignItems: 'center', gap: 6 }}>
            <Icon name="clock" size={14} /> Tarda unos segundos
          </span>
        </div>
      </QuestionShell>
    </div>
  );
};

// ── Orchestrator ─────────────────────────────────────────
const ConversationalFlow = ({ entry, grades, onAddGrade, onGenerate, onBack }) => {
  const [a, setA] = React.useState(() => ({
    textoBase: entry === 'text' ? 'La vaca que puso un huevo — Cuento de Andy Cutbill. Una vaquita está convencida de que no sabe hacer nada especial, hasta que un día aparece un huevo en el corral y todos creen que lo puso ella…' : null,
    grado: null, gradoMeta: null,
    materia: entry === 'text' ? 'lengua' : null,
    contenido: null, contenidoFree: false,
    universo: null, group: null, saberes: null,
  }));
  const [skipped, setSkipped] = React.useState({});
  const [active, setActive] = React.useState(0);
  const [view, setView] = React.useState('chat'); // chat | form (escape hatch)
  const scrollRef = React.useRef(null);

  const resolved = (i) => {
    const k = STEPS[i].key;
    if (k === 'inicio') return !!a.grado && !!a.materia;
    if (k === 'contenido') return !!a.contenido;
    if (k === 'universo') return skipped.universo || !!a.universo;
    if (k === 'grupo') return skipped.grupo || a.group != null;
    return false;
  };

  const advance = (from) => {
    for (let i = from + 1; i < STEPS.length; i++) if (!resolved(i)) return setActive(i);
    setActive('revision');
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [active]);

  const s = subjectTheme(a.materia);

  // collected answers (resolved steps except the one being edited); the
  // combined "inicio" step expands into separate Grado + Materia rows.
  const summaryValue = (i) => {
    const k = STEPS[i].key;
    if (k === 'contenido') return a.contenido;
    if (k === 'universo') return skipped.universo ? 'Sin universo temático' : a.universo;
    if (k === 'grupo') return skipped.grupo ? 'Saltaste este paso' : (a.group?.trim() || a.saberes || 'Contexto agregado');
    return null;
  };
  const isSkippedVal = (i) => {
    const k = STEPS[i].key;
    return (k === 'universo' && skipped.universo) || (k === 'grupo' && skipped.grupo);
  };
  const summaryRows = [];
  STEPS.forEach((st, i) => {
    if (i === active || !resolved(i)) return;
    if (st.key === 'inicio') {
      summaryRows.push({ topic: 'Grado', value: a.grado, onEdit: () => setActive(i) });
      summaryRows.push({ topic: 'Materia', value: subjectTheme(a.materia).label, onEdit: () => setActive(i) });
    } else {
      summaryRows.push({ topic: st.topic, value: summaryValue(i), skipped: isSkippedVal(i), onEdit: () => setActive(i) });
    }
  });

  const progIndex = active === 'revision' ? STEPS.length : active;

  const formToggle = (
    <button onClick={() => setView(view === 'chat' ? 'form' : 'chat')}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: `1px solid ${T.border}`,
        background: T.surface, cursor: 'pointer', borderRadius: 44, padding: '6px 13px',
        fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.ink2, whiteSpace: 'nowrap' }}>
      <Icon name={view === 'chat' ? 'layers' : 'message-circle'} size={14} />
      {view === 'chat' ? 'Formulario completo' : 'Modo guiado'}
    </button>
  );

  // step input renderer
  const renderActive = (i) => {
    const k = STEPS[i].key;
    if (k === 'inicio') return (
      <QuestionShell prompt="¿Para qué grado y materia?"
        sub={entry === 'text' ? 'Por tu texto la materia queda en Lengua, pero podés cambiarla.' : 'Elegí el grado y el área. Después vemos qué enseñar.'}>
        <StepInicio grades={grades} grado={a.grado} gradoMeta={a.gradoMeta} materia={a.materia}
          onCommit={({ grado, gradoMeta, materia }) => { setA(p => ({ ...p, grado, gradoMeta, materia })); advance(0); }} />
      </QuestionShell>
    );
    if (k === 'contenido') return (
      <QuestionShell accent={s.color} prompt="¿Qué querés enseñar?"
        sub="Escribí y te sugerimos contenidos del diseño curricular para ese grado y materia.">
        <StepContenido materia={a.materia} grado={a.grado} value={a.contenido}
          onCommit={(val, free) => { setA(p => ({ ...p, contenido: val, contenidoFree: free })); advance(1); }} />
      </QuestionShell>
    );
    if (k === 'universo') return (
      <QuestionShell prompt="¿Querés situarlo en algún universo temático?"
        sub="Le da un hilo narrativo a la secuencia. Es opcional — podés saltearlo.">
        <StepUniverso value={a.universo}
          onCommit={(val) => { setA(p => ({ ...p, universo: val })); setSkipped(p => ({ ...p, universo: false })); advance(2); }}
          onSkip={() => { setA(p => ({ ...p, universo: null })); setSkipped(p => ({ ...p, universo: true })); advance(2); }} />
      </QuestionShell>
    );
    if (k === 'grupo') return (
      <QuestionShell accent={s.color} prompt="Contame cómo es tu grupo."
        sub="Esto nos ayuda a personalizar la planificación y se guarda para la próxima. Todo opcional.">
        <StepGrupo materia={a.materia} grado={a.grado} gradoMeta={a.gradoMeta} contenido={a.contenido}
          group={a.group} saberes={a.saberes}
          onCommit={({ group, saberes }) => { setA(p => ({ ...p, group: group || ' ', saberes })); setSkipped(p => ({ ...p, grupo: false })); advance(3); }}
          onSkip={() => { setSkipped(p => ({ ...p, grupo: true })); advance(3); }} />
      </QuestionShell>
    );
  };

  // answer card content
  const cardContent = (i) => {
    const k = STEPS[i].key;
    if (k === 'grado') return a.grado;
    if (k === 'materia') return <SubjectLabel materia={a.materia} size={13} />;
    if (k === 'contenido') return <>{a.contenido}{a.contenidoFree && <span style={{ marginLeft: 8, fontSize: 12, color: T.muted, fontStyle: 'italic' }}>· interpretado por vos</span>}</>;
    if (k === 'universo') return skipped.universo ? 'Sin universo temático' : a.universo;
    if (k === 'grupo') return skipped.grupo ? 'Saltaste este paso' : (a.group?.trim() || a.saberes || 'Contexto agregado');
    return null;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', borderBottom: `1px solid ${T.borderSoft}`, flexShrink: 0, background: T.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Logo height={22} />
          <span style={{ width: 1, height: 22, background: T.border }} />
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 7, border: 'none',
            background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.ink2 }}>
            <Icon name="arrow-left" size={16} /> Volver al inicio
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {view === 'chat' && <FlowProgress index={progIndex} />}
          {formToggle}
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
        {view === 'form'
          ? <FullForm a={a} setA={setA} grades={grades} onGenerate={() => onGenerate(a)} />
          : (
            <div style={{ maxWidth: 660, margin: '0 auto', padding: '36px 28px 120px',
              display: 'flex', flexDirection: 'column', gap: 14 }}>
              {a.textoBase && <TextoBaseCard text={a.textoBase} onEdit={onBack} />}

              {active === 'revision'
                ? <RevisionSummary a={a} onEdit={(i) => setActive(i)} onGenerate={() => onGenerate(a)} />
                : <React.Fragment>
                    <SummaryList rows={summaryRows} />
                    {typeof active === 'number' && renderActive(active)}
                  </React.Fragment>}
            </div>
          )}
      </div>
    </div>
  );
};

Object.assign(window, { ConversationalFlow, AnswerCard, TextoBaseCard, RevisionSummary,
  FlowProgress, SummaryRow, SummaryList, FullForm });
