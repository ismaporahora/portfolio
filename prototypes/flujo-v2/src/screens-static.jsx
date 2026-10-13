// screens-static.jsx — frozen snapshots of each conversational step,
// composed from the real flow primitives so the canvas shows exactly what
// the functional prototype will render. No advancing; handlers are no-ops.

const STEPS_S = [
  { key: 'inicio',    topic: 'Grado y materia' },
  { key: 'contenido', topic: 'Qué enseñar' },
  { key: 'universo',  topic: 'Universo temático' },
  { key: 'grupo',     topic: 'Tu grupo' },
];
const STEP_TOPIC = { inicio: 'Grado y materia', grado: 'Grado', materia: 'Materia',
  contenido: 'Qué enseñar', universo: 'Universo temático', grupo: 'Tu grupo' };

const noop = () => {};

// A representative full set of answers used across the snapshots.
const SAMPLE = {
  textoBase: 'La vaca que puso un huevo — Cuento de Andy Cutbill. Una vaquita está convencida de que no sabe hacer nada especial, hasta que un día aparece un huevo en el corral y todos creen que lo puso ella…',
  grado: '2° A', gradoMeta: SAVED_GRADES[0],
  materia: 'lengua',
  contenido: 'Lectura de textos narrativos', contenidoFree: false,
  universo: 'La granja',
  group: SAVED_GRADES[0].note,
  saberes: 'algunos ya leen solos y otros siguen la lectura del docente',
};

// ── Shared flow chrome (mirrors flow.jsx top bar) ────────
const FlowChrome = ({ materia, step, children }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px', borderBottom: `1px solid ${T.borderSoft}`, flexShrink: 0, background: T.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Logo height={22} />
        <span style={{ width: 1, height: 22, background: T.border }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: T.font,
          fontSize: 13.5, fontWeight: 600, color: T.ink2 }}>
          <Icon name="arrow-left" size={16} /> Volver al inicio
        </span>
      </div>
      <div>
        {step != null && <FlowProgress index={step} />}
      </div>
    </div>
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '36px 28px 60px',
        display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  </div>
);

const dotForS = (key, a) => (key === 'materia' || key === 'contenido') && a.materia
  ? subjectTheme(a.materia).color : T.brand;

const cardContentS = (key, a, skipped) => {
  if (key === 'grado') return a.grado;
  if (key === 'materia') return <SubjectLabel materia={a.materia} size={13} />;
  if (key === 'contenido') return a.contenido;
  if (key === 'universo') return skipped.universo ? 'Sin universo temático' : a.universo;
  if (key === 'grupo') return skipped.grupo ? 'Saltaste este paso' : (a.group || a.saberes || 'Contexto agregado');
  return null;
};

// The active question for a given step key (static, no-op handlers).
const ActiveQuestion = ({ stepKey, a, entry, grades }) => {
  const s = subjectTheme(a.materia);
  if (stepKey === 'inicio') return (
    <QuestionShell prompt="¿Para qué grado y materia?"
      sub={entry === 'text' ? 'Por tu texto la materia queda en Lengua, pero podés cambiarla.' : 'Elegí el grado y el área. Después vemos qué enseñar.'}>
      <StepInicio grades={grades} grado={a.grado} gradoMeta={a.gradoMeta} materia={a.materia} onCommit={noop} />
    </QuestionShell>
  );
  if (stepKey === 'grado') return (
    <QuestionShell prompt="¿Para qué grado vas a planificar?"
      sub="Elegí un grado guardado o creá uno nuevo. El grado se guarda sin materia: lo reusás para cualquier área.">
      <StepGrado grades={grades} onSelect={noop} onAddGrade={noop} />
    </QuestionShell>
  );
  if (stepKey === 'materia') return (
    <QuestionShell prompt="¿Qué materia?"
      sub={entry === 'text' ? 'Por tu texto la dejamos en Lengua, pero podés cambiarla.' : 'Elegí el área de la secuencia.'}>
      <StepMateria value={a.materia} onSelect={noop} />
    </QuestionShell>
  );
  if (stepKey === 'contenido') return (
    <QuestionShell accent={s.color} prompt="¿Qué querés enseñar?"
      sub="Escribí y te sugerimos contenidos del diseño curricular para ese grado y materia.">
      <StepContenido materia={a.materia} grado={a.grado} onCommit={noop}
        defaultQuery="Lectura" defaultOpen />
    </QuestionShell>
  );
  if (stepKey === 'universo') return (
    <QuestionShell prompt="¿Querés situarlo en algún universo temático?"
      sub="Le da un hilo narrativo a la secuencia. Es opcional — podés saltearlo.">
      <StepUniverso value={null} onCommit={noop} onSkip={noop} />
    </QuestionShell>
  );
  if (stepKey === 'grupo') return (
    <QuestionShell accent={s.color} prompt="Contame cómo es tu grupo."
      sub="Esto nos ayuda a personalizar la planificación y se guarda para la próxima. Todo opcional.">
      <StepGrupo materia={a.materia} grado={a.grado} gradoMeta={a.gradoMeta} contenido={a.contenido}
        group={null} saberes={null} onCommit={noop} onSkip={noop} />
    </QuestionShell>
  );
  return null;
};

// FlowSnapshot — history cards above + the active question, like flow.jsx
// frozen at a chosen step. `history` lists resolved step keys to show as
// AnswerCards; `active` is the step key whose question is open (or 'revision').
const FlowSnapshot = ({ entry = 'scratch', a = SAMPLE, skipped = {}, history = [], active, grades = SAVED_GRADES }) => {
  const keyToIndex = (k) => {
    const nk = (k === 'grado' || k === 'materia') ? 'inicio' : k;
    return Math.max(0, STEPS_S.findIndex(s => s.key === nk));
  };
  const stepIndex = active === 'revision' ? STEPS_S.length : keyToIndex(active);
  const valFor = (key) => key === 'materia' ? subjectTheme(a.materia).label : cardContentS(key, a, skipped);
  const rows = [];
  history.forEach(key => {
    if (key === 'inicio') {
      rows.push({ topic: 'Grado', value: a.grado, onEdit: noop });
      rows.push({ topic: 'Materia', value: subjectTheme(a.materia).label, onEdit: noop });
    } else {
      rows.push({ topic: STEP_TOPIC[key] || key, value: valFor(key),
        skipped: (key === 'universo' && skipped.universo) || (key === 'grupo' && skipped.grupo), onEdit: noop });
    }
  });

  if (active === 'revision') return (
    <FlowChrome materia={a.materia} step={STEPS_S.length}>
      {entry === 'text' && <TextoBaseCard text={a.textoBase} onEdit={noop} />}
      <RevisionSummary a={a} onEdit={noop} onGenerate={noop} />
    </FlowChrome>
  );
  return (
    <FlowChrome materia={a.materia} step={stepIndex}>
      {entry === 'text' && <TextoBaseCard text={a.textoBase} onEdit={noop} />}
      <SummaryList rows={rows} />
      {active && <ActiveQuestion stepKey={active} a={a} entry={entry} grades={grades} />}
    </FlowChrome>
  );
};

Object.assign(window, { FlowSnapshot, SAMPLE });
