// retro.jsx — devolución sobre una planificación anterior relacionada
// La herramienta pregunta cómo les fue con una planificación previa de tema
// relacionado. La respuesta: (a) ajusta visiblemente la nueva planificación
// (callout en el repaso) y (b) se guarda como conocimiento del grado.

const RETRO_RATINGS = [
  { id: 'costo', label: 'Les costó' },
  { id: 'bien', label: 'Bien' },
  { id: 'genial', label: 'Muy bien' },
  { id: 'nouse', label: 'No la usé' },
];
const RETRO_SUG_FUNCIONO = ['La lectura en voz alta', 'El trabajo en parejas', 'Las consignas cortas'];
const RETRO_SUG_AJUSTAR = ['Más tiempo por actividad', 'Consignas más simples', 'Más apoyo visual'];

const retroRatingLabel = (id) => (RETRO_RATINGS.find(x => x.id === id) || {}).label || '';

const retroFact = (plan, ans) => {
  let s = `«${plan.title}»: ${retroRatingLabel(ans.rating).toLowerCase()}`;
  if (ans.rating === 'nouse') {
    if (ans.ajustar) s += ` · motivo: ${ans.ajustar.charAt(0).toLowerCase() + ans.ajustar.slice(1)}`;
    return s;
  }
  if (ans.funciono) s += ` · funcionó ${ans.funciono.charAt(0).toLowerCase() + ans.funciono.slice(1)}`;
  if (ans.ajustar) s += ` · ajustar: ${ans.ajustar.charAt(0).toLowerCase() + ans.ajustar.slice(1)}`;
  return s;
};

const retroAdjustText = (retro) => {
  const t = retro.plan.title;
  let s = retro.rating === 'costo'
    ? `Como les costó con «${t}», arranco esta secuencia con un repaso más pausado y consignas más cortas.`
    : retro.rating === 'genial'
    ? `Como «${t}» funcionó muy bien, retomo esa dinámica y subo un poco el desafío.`
    : `Retomo lo que trabajaron en «${t}» como punto de partida.`;
  if (retro.ajustar) s += ` También tengo en cuenta: “${retro.ajustar}”.`;
  else if (retro.funciono) s += ` Sostengo lo que funcionó: “${retro.funciono}”.`;
  return s;
};

// chip de valoración (Les costó / Bien / Muy bien)
const RetroChip = ({ label, on, onClick, acc }) => (
  <button onClick={onClick} className={on ? undefined : 'ng-chip'} style={{ padding: '9px 18px', borderRadius: 44,
    cursor: 'pointer', border: `1.5px solid ${on ? acc : T.border}`, background: on ? T.brandTint : T.surface,
    fontFamily: T.font, fontSize: 14, fontWeight: 600, color: on ? T.brandDeep : T.ink2, transition: 'all .15s' }}>
    {label}</button>
);

// referencia compacta a la planificación anterior
const RetroPlanRef = ({ plan }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12,
    border: `1px solid ${T.border}`, background: T.surface }}>
    <span style={{ width: 36, height: 36, borderRadius: 10, background: T.brandTint, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="book-open" size={17} color={T.brandDeep} /></span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: T.font, fontSize: 14.5, fontWeight: 700, color: T.ink }}>{plan.title}</div>
      <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>
        {plan.materia === 'matematica' ? 'Matemática' : 'Lengua'} · {plan.clases} clases · {plan.date.toLowerCase()}</div>
    </div>
  </div>
);

// pregunta específica opcional con sugerencias
const RetroDetail = ({ label, value, onChange, suggestions, acc, placeholder }) => (
  <div>
    <div style={{ fontFamily: T.font, fontSize: 13.5, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
      {label} <span style={{ fontWeight: 500, color: T.muted }}>· opcional</span></div>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${T.border}`, borderRadius: 10,
        outline: 'none', padding: '9px 12px', fontFamily: T.font, fontSize: 14.5, fontWeight: 500,
        color: T.ink, background: T.surface }} />
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
      {suggestions.filter(s => s !== value).map(s => (
        <button key={s} onClick={() => onChange(s)} className="ng-chip" style={{ padding: '5px 12px', borderRadius: 44,
          border: `1px solid ${T.border}`, background: T.surface, cursor: 'pointer', fontFamily: T.font,
          fontSize: 12.5, fontWeight: 600, color: T.ink2 }}>{s}</button>
      ))}
    </div>
  </div>
);

// ── Paso del flujo guiado (entre composer y repaso) ──────
const RetroStep = ({ gradeName, plan, identity, onContinue, onSkip, onBack, onExit }) => {
  const acc = identity.hue;
  const [rating, setRating] = React.useState(null);
  const [funciono, setFunciono] = React.useState('');
  const [ajustar, setAjustar] = React.useState('');
  const commit = () => {
    if (!rating) { onSkip(); return; }
    const ans = { rating, funciono: funciono.trim(), ajustar: ajustar.trim(), plan, src: 'paso' };
    onContinue({ ...ans, fact: retroFact(plan, ans) });
  };
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }} className="cf-rise">
      <QuestionShell prompt={`Antes de seguir… ¿cómo les fue con «${plan.title}»?`}
        sub={`La trabajaron hace poco y toca un tema relacionado. Tu respuesta me ayuda a ajustar la nueva planificación para ${gradeName}.`}>
        <div style={{ marginTop: 4 }}>
          <RetroPlanRef plan={plan} />
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {RETRO_RATINGS.map(r => (
              <RetroChip key={r.id} label={r.label} on={rating === r.id} acc={acc}
                onClick={() => setRating(x => x === r.id ? null : r.id)} />
            ))}
          </div>
          {rating && rating !== 'nouse' && (
            <div className="cf-rise" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
              <RetroDetail label="¿Qué funcionó?" value={funciono} onChange={setFunciono} acc={acc}
                suggestions={RETRO_SUG_FUNCIONO} placeholder="Algo que quieras sostener…" />
              <RetroDetail label="¿Qué ajustarías?" value={ajustar} onChange={setAjustar} acc={acc}
                suggestions={RETRO_SUG_AJUSTAR} placeholder="Algo para hacer distinto esta vez…" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: T.font, fontSize: 12.5, color: acc }}>
                <Icon name={T.aiIcon} size={13} color={acc} /> Lo guardo en «Lo que sé de {gradeName}» y lo uso para ajustar esta planificación
              </div>
            </div>
          )}
          {rating === 'nouse' && (
            <div className="cf-rise" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
              <RetroDetail label="¿Por qué no la usaste?" value={ajustar} onChange={setAjustar} acc={acc}
                suggestions={[]} placeholder="No hubo tiempo, cambió el plan…" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: T.font, fontSize: 12.5, color: acc }}>
                <Icon name={T.aiIcon} size={13} color={acc} /> Lo guardo en «Lo que sé de {gradeName}»
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
          <BackBtn onClick={onBack} />
          <div style={{ flex: 1 }} />
          <button onClick={onSkip} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.muted }}>Saltear por ahora</button>
          <PillButton size="lg" icon="arrow-right" onClick={commit}>Continuar</PillButton>
        </div>
      </QuestionShell>
    </div>
  );
};

// ── Banner en el home del grado ──────────────────────────
const RetroBanner = ({ plan, gradeName, saved, onSave, onDismiss }) => {
  const acc = T.brand;
  const [rating, setRating] = React.useState(null);
  const [ajustar, setAjustar] = React.useState('');
  if (saved) return (
    <div className="gh-fade" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 18px',
      borderRadius: 14, background: T.brandTint }}>
      <Icon name="check" size={17} color={T.brandDeep} />
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 13.5, fontWeight: 500, color: T.brandDeep, lineHeight: 1.5 }}>
        Listo, quedó en «Lo que sé de {gradeName}». Lo voy a tener en cuenta en tu próxima planificación.</span>
      <button onClick={onDismiss} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
        display: 'flex', padding: 3, opacity: .65 }}><Icon name="x" size={14} color={T.brandDeep} /></button>
    </div>
  );
  return (
    <div className="cf-rise" style={{ padding: '17px 20px 18px', borderRadius: 16, border: `1px solid ${T.border}`,
      background: T.surface, boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.head, fontSize: 15.5, fontWeight: 700, color: T.ink, letterSpacing: '-0.2px' }}>
            ¿Cómo les fue con «{plan.title}»?</div>
          <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted, marginTop: 3 }}>
            Tu respuesta mejora las próximas planificaciones</div>
        </div>
        <button onClick={onDismiss} style={{ border: 'none', background: 'transparent', cursor: 'pointer',
          fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.muted, padding: '4px 6px', flexShrink: 0 }}>
          Ahora no</button>
      </div>
      <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
        {RETRO_RATINGS.map(r => (
          <RetroChip key={r.id} label={r.label} on={rating === r.id} acc={acc}
            onClick={() => setRating(x => x === r.id ? null : r.id)} />
        ))}
      </div>
      {rating && (
        <div className="cf-rise" style={{ display: 'flex', gap: 9, marginTop: 12, alignItems: 'center' }}>
          <input value={ajustar} onChange={e => setAjustar(e.target.value)} autoFocus
            onKeyDown={e => { if (e.key === 'Enter') { const ans = { rating, funciono: '', ajustar: ajustar.trim(), plan, src: 'banner' }; onSave({ ...ans, fact: retroFact(plan, ans) }); } }}
            placeholder={rating === 'nouse' ? '¿Por qué no la usaste? · opcional' : '¿Algo que ajustarías? · opcional'}
            style={{ flex: 1, border: `1px solid ${T.border}`, borderRadius: 10, outline: 'none', padding: '8px 12px',
              fontFamily: T.font, fontSize: 13.5, fontWeight: 500, color: T.ink, background: T.surface }} />
          <PillButton onClick={() => { const ans = { rating, funciono: '', ajustar: ajustar.trim(), plan, src: 'banner' }; onSave({ ...ans, fact: retroFact(plan, ans) }); }}>Guardar</PillButton>
        </div>
      )}
    </div>
  );
};
