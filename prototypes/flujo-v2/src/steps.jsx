// steps.jsx — the individual conversational step inputs

const gradoLevel = (name) => {
  const m = (name || '').match(/\d/);
  return m ? parseInt(m[0], 10) : 2;
};

// ── Live question shell ──────────────────────────────────
// Marker treatment is driven by the global theme (T.marker), so Tweaks can
// switch the AI affordance across every step at once: sin marcador (default,
// the Look & Feel pick), azulejo (tile) or línea (accent rule).
const QuestionShell = ({ accent = T.brand, prompt, sub, children }) => {
  const head = (
    <h2 style={{ fontFamily: T.head, fontSize: 24, fontWeight: 600, color: T.ink,
      lineHeight: 1.22, margin: 0, letterSpacing: '-0.015em' }}>{prompt}</h2>
  );
  const subEl = sub && (
    <p style={{ fontFamily: T.font, fontSize: 14.5, color: T.ink2, lineHeight: 1.55, margin: '8px 0 0' }}>{sub}</p>
  );
  const body = <div style={{ marginTop: 20 }}>{children}</div>;

  if (T.marker === 'azulejo') return (
    <div className="cf-rise" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, marginTop: 2,
        background: T.brandTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={T.aiIcon} size={17} color={T.brandDeep} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{head}{subEl}{body}</div>
    </div>
  );

  if (T.marker === 'línea') return (
    <div className="cf-rise" style={{ borderLeft: `2.5px solid ${T.brand}`, paddingLeft: 18 }}>
      <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
        textTransform: 'uppercase', color: T.brand, marginBottom: 9 }}>Asistente</div>
      {head}{subEl}{body}
    </div>
  );

  // sin marcador (default) — clean, no affordance
  return (
    <div className="cf-rise">{head}{subEl}{body}</div>
  );
};

const ChoiceChip = ({ label, selected, accent, onClick, icon, sub, style }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, padding: sub ? '14px 18px' : '11px 18px',
        borderRadius: T.cardRadius, cursor: 'pointer', textAlign: 'left',
        border: `1.5px solid ${selected ? accent : (h ? `${accent}66` : T.cardBorder)}`,
        background: selected ? `${accent}14` : (h ? T.brandHover : T.surface),
        boxShadow: selected ? 'none' : T.cardShadowCss,
        transition: 'all 140ms ease', ...style,
      }}>
      {icon && <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: selected ? `${accent}24` : (h ? `${accent}1A` : T.bgDeep), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={18} color={(selected || h) ? accent : T.ink2} /></div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 600, color: selected ? T.ink : T.ink }}>{label}</div>
        {sub && <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {selected && <Icon name="check" size={17} color={accent} />}
    </button>
  );
};

// ── Step 1 · Grado ───────────────────────────────────────
const StepGrado = ({ grades, onSelect, onAddGrade, current }) => {
  const [adding, setAdding] = React.useState(grades.length === 0);
  const [name, setName] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [note, setNote] = React.useState('');
  const [files, setFiles] = React.useState([]);

  const save = () => {
    const g = { id: 'g' + Date.now(), name: name || level || 'Mi grado',
      school: 'Nuevo grupo', students: null, note, files: files.length, fresh: true };
    onAddGrade(g);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {grades.length > 0 && !adding && (
        <>
          <div style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.muted,
            textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tus grados guardados</div>
          {grades.map(g => (
            <ChoiceChip key={g.id} icon="users" accent={T.brand} selected={current === g.id}
              onClick={() => onSelect(g)} label={g.name}
              sub={`${g.school}${g.students ? ' · ' + g.students + ' estudiantes' : ''}`} />
          ))}
          <button onClick={() => setAdding(true)} style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '11px 18px', borderRadius: 14,
            border: `1.5px dashed ${T.border}`, background: 'transparent', cursor: 'pointer',
            fontFamily: T.font, fontSize: 14.5, fontWeight: 600, color: T.ink2 }}>
            <Icon name="plus" size={17} /> Agregar un grado
          </button>
        </>
      )}

      {adding && (
        <div style={{ borderRadius: 16, border: `1.5px solid ${T.border}`, background: T.surface, padding: 20 }}>
          {grades.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: T.head, fontSize: 15, fontWeight: 700, color: T.ink }}>Agregar un grado nuevo</span>
              <IconButton name="x" size={30} onClick={() => setAdding(false)} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <FieldLabel>¿Qué nivel es?</FieldLabel>
              <div style={{ display: 'flex', gap: 8 }}>
                {GRADES_OPTIONS.map(o => (
                  <button key={o} onClick={() => setLevel(o)} style={{
                    flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer',
                    border: `1.5px solid ${level === o ? T.brand : T.border}`,
                    background: level === o ? T.brandTint : T.surface,
                    fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink }}>{o}</button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Nombre del grupo <span style={{ color: T.muted, fontWeight: 400 }}>(opcional)</span></FieldLabel>
              <Field value={name} onChange={setName} placeholder="Ej. 2° A — Turno mañana" />
            </div>
            <div>
              <FieldLabel>¿Cómo es el grupo? <span style={{ color: T.muted, fontWeight: 400 }}>(opcional)</span></FieldLabel>
              <TextArea value={note} onChange={setNote} rows={3}
                placeholder="Contame lo que quieras: cantidad de estudiantes, particularidades, cómo vienen trabajando…" />
            </div>
            <UploadZone label="Subí archivos del grupo" hint="Listas, evaluaciones, notas — opcional"
              files={files} onPick={() => setFiles(['Lista de estudiantes.pdf'])} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
              borderRadius: 10, background: T.brandTint }}>
              <Icon name="info" size={15} color={T.brandDeep} />
              <span style={{ fontFamily: T.font, fontSize: 12.5, color: T.brandInk }}>
                Lo guardamos como tu grado, sin atarlo a ninguna materia. Lo vas a poder reusar la próxima vez.
              </span>
            </div>
            <PillButton onClick={save} disabled={!level && !name} icon="check">Guardar y usar este grado</PillButton>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Step 2 · Materia ─────────────────────────────────────
const StepMateria = ({ value, onSelect }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
    <ChoiceChip icon="book-open" label="Lengua" sub="Lectura, escritura, oralidad"
      accent={T.brand} selected={value === 'lengua'} onClick={() => onSelect('lengua')} />
    <ChoiceChip icon="calculator" label="Matemática" sub="Números, operaciones, geometría"
      accent={T.brand} selected={value === 'matematica'} onClick={() => onSelect('matematica')} />
  </div>
);

// ── Pill — small selectable/clickable chip with violet hover ───
const Pill = ({ selected, onClick, children, style }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ cursor: 'pointer', fontFamily: T.font, fontWeight: 600, transition: 'all 130ms ease',
        border: `1.5px solid ${selected ? T.brand : (h ? `${T.brand}66` : T.border)}`,
        background: selected ? T.brandTint : (h ? T.brandHover : T.surface),
        color: selected ? T.brandDeep : T.ink, ...style }}>{children}</button>
  );
};

// ── Grade picker ─────────────────────────────────────────
// Light: saved grades as chips (if any) + the three levels for a new grade.
// The richer group context (name, notes, files) lives in the optional "Tu
// grupo" step, so the first screen stays clean even with no saved grades.
const GradoPicker = ({ grades = [], grado, gradoMeta, onPick }) => {
  const levels = (
    <div style={{ display: 'flex', gap: 8 }}>
      {GRADES_OPTIONS.map(o => (
        <Pill key={o} selected={grado === o && !gradoMeta} onClick={() => onPick({ grado: o, gradoMeta: null })}
          style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 14 }}>{o}</Pill>
      ))}
    </div>
  );
  if (!grades.length) return levels;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {grades.map(g => (
        <ChoiceChip key={g.id} icon="users" accent={T.brand} selected={gradoMeta?.id === g.id}
          label={g.name} sub={`${g.school}${g.students ? ' · ' + g.students + ' estudiantes' : ''}`}
          onClick={() => onPick({ grado: g.name, gradoMeta: g })} />
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' }}>
        <span style={{ flex: 1, height: 1, background: T.borderSoft }} />
        <span style={{ fontFamily: T.font, fontSize: 12, color: T.muted }}>o un grado nuevo</span>
        <span style={{ flex: 1, height: 1, background: T.borderSoft }} />
      </div>
      {levels}
    </div>
  );
};

// ── Step 1 · Grado + Materia (combinado) ─────────────────
const StepInicio = ({ grades = [], grado, gradoMeta, materia, onCommit }) => {
  const [g, setG] = React.useState({ grado: grado || null, gradoMeta: gradoMeta || null });
  const [m, setM] = React.useState(materia || null);
  const ready = g.grado && m;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <FieldLabel>Grado</FieldLabel>
        <GradoPicker grades={grades} grado={g.grado} gradoMeta={g.gradoMeta} onPick={setG} />
      </div>
      <div>
        <FieldLabel>Materia</FieldLabel>
        <StepMateria value={m} onSelect={setM} />
      </div>
      <PillButton size="lg" iconRight="arrow-right" disabled={!ready}
        onClick={() => onCommit({ grado: g.grado, gradoMeta: g.gradoMeta, materia: m })}>Continuar</PillButton>
    </div>
  );
};

// ── Step 3 · Contenido (autocomplete) ────────────────────
const StepContenido = ({ materia, grado, value, onCommit, defaultQuery, defaultOpen }) => {
  const [q, setQ] = React.useState(value || defaultQuery || '');
  const [open, setOpen] = React.useState(!!defaultOpen);
  const s = subjectTheme(materia);
  const level = gradoLevel(grado);
  const pool = NODAL[`${materia}-${level}`] || [];
  const matches = q.trim()
    ? pool.filter(c => c.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
    : pool.slice(0, 5);
  const exactInPool = pool.some(c => c.toLowerCase() === q.trim().toLowerCase());
  const freeText = q.trim().length > 0 && !exactInPool;

  const pick = (val, off) => { onCommit(val, off); };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <Field value={q} onChange={v => { setQ(v); setOpen(true); }} accent={s.color} autoFocus
          placeholder={`Ej. ${pool[0] || 'lo que querés enseñar'}…`}
          onKeyDown={e => { if (e.key === 'Enter' && q.trim()) pick(q.trim(), freeText); }} />
        {open && (matches.length > 0 || freeText) && (
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30,
            background: T.surface, borderRadius: 14, border: `1.5px solid ${T.border}`,
            boxShadow: '0 16px 40px rgba(11,27,102,0.12)', overflow: 'hidden' }}>
            {q.trim() === '' && (
              <div style={{ padding: '9px 14px', fontFamily: T.font, fontSize: 11.5, fontWeight: 700,
                color: T.muted, textTransform: 'uppercase', letterSpacing: '0.05em',
                borderBottom: `1px solid ${T.borderSoft}` }}>
                Contenidos del diseño curricular · {level}° grado
              </div>
            )}
            {matches.map((c, i) => (
              <button key={i} onClick={() => pick(c, false)} className="cf-opt" style={{
                display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '12px 14px',
                border: 'none', borderBottom: `1px solid ${T.borderSoft}`, background: 'transparent',
                cursor: 'pointer', textAlign: 'left', fontFamily: T.font, fontSize: 14.5, color: T.ink }}>
                <Icon name="search" size={15} color={s.color} />
                <span style={{ flex: 1 }}>{hl(c, q, s.color)}</span>
              </button>
            ))}
            {freeText && (
              <button onClick={() => pick(q.trim(), true)} className="cf-opt" style={{
                display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '12px 14px',
                border: 'none', background: T.bgDeep, cursor: 'pointer', textAlign: 'left' }}>
                <Icon name="pencil" size={15} color={T.ink2} />
                <span style={{ flex: 1, fontFamily: T.font, fontSize: 14.5, color: T.ink }}>
                  Usar lo que escribí: <strong style={{ color: T.ink }}>“{q.trim()}”</strong>
                </span>
              </button>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, color: T.muted }}>
        <Icon name="info" size={14} />
        <span style={{ fontFamily: T.font, fontSize: 12.5 }}>
          Escribí lo tuyo aunque no esté en la lista — lo tomamos como está y lo interpretamos por vos.
        </span>
      </div>
    </div>
  );
};

// ── Step 4 · Universo (opcional) ─────────────────────────
const StepUniverso = ({ value, onCommit, onSkip }) => {
  const [q, setQ] = React.useState(value || '');
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {UNIVERSOS.map(u => (
          <Pill key={u} selected={value === u} onClick={() => onCommit(u)}
            style={{ padding: '8px 15px', borderRadius: T.radiusSm + 2, fontSize: 13.5, fontWeight: 500 }}>{u}</Pill>
        ))}
      </div>
      <Field value={q} onChange={setQ} placeholder="…o escribí tu propio universo temático"
        onKeyDown={e => { if (e.key === 'Enter' && q.trim()) onCommit(q.trim()); }} />
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <PillButton variant="primary" disabled={!q.trim()} onClick={() => q.trim() && onCommit(q.trim())} iconRight="arrow-right">Usar este universo</PillButton>
        <PillButton variant="quiet" onClick={onSkip}>Saltear · quizás después</PillButton>
      </div>
    </div>
  );
};

// ── Step 5 · Tu grupo (opcional) ─────────────────────────
const StepGrupo = ({ materia, grado, gradoMeta, contenido, group, saberes, onCommit, onSkip }) => {
  const [g, setG] = React.useState(group || gradoMeta?.note || '');
  const [sab, setSab] = React.useState(saberes || '');
  const s = subjectTheme(materia);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {gradoMeta?.note && (
        <div style={{ display: 'flex', gap: 9, padding: '11px 14px', borderRadius: 12, background: T.brandTint }}>
          <Icon name="check" size={15} color={T.brandDeep} style={{ marginTop: 2 }} />
          <span style={{ fontFamily: T.font, fontSize: 13, color: T.brandInk, lineHeight: 1.5 }}>
            Ya tenemos contexto guardado de <strong>{grado}</strong>. Podés editarlo o sumar más abajo.
          </span>
        </div>
      )}
      <div>
        <FieldLabel>¿Cómo es tu grupo?</FieldLabel>
        <TextArea value={g} onChange={setG} accent={s.color} rows={3}
          placeholder="Ej. son muy conversadores, hay tres estudiantes con apoyo de integración…" />
      </div>
      <div>
        <FieldLabel>¿Qué saben tus estudiantes sobre <span style={{ color: s.deep }}>{contenido || 'este tema'}</span>?</FieldLabel>
        <TextArea value={sab} onChange={setSab} accent={s.color} rows={2}
          placeholder="Ej. algunos ya resuelven sumas de dos cifras y otros todavía no…" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, color: T.muted }}>
          <Icon name="folder" size={14} />
          <span style={{ fontFamily: T.font, fontSize: 12.5 }}>
            Esto se guarda como contexto de <strong style={{ color: T.ink2 }}>{grado}</strong> para tus próximas planificaciones.
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <PillButton variant="primary" onClick={() => onCommit({ group: g, saberes: sab })}
          iconRight="arrow-right">Listo, seguimos</PillButton>
        <PillButton variant="quiet" onClick={onSkip}>Saltear este paso</PillButton>
      </div>
    </div>
  );
};

// helpers
const FieldLabel = ({ children }) => (
  <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 8 }}>{children}</div>
);

const hl = (text, q, color) => {
  if (!q.trim()) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark style={{ background: 'transparent', color, fontWeight: 700 }}>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
};

Object.assign(window, {
  gradoLevel, QuestionShell, ChoiceChip, FieldLabel, Pill,
  StepGrado, StepMateria, StepContenido, StepUniverso, StepGrupo,
  GradoPicker, StepInicio,
});
