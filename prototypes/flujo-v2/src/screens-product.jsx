// screens-product.jsx — Pantallas a nivel producto para el storyboard.
// Concepto: "el grado es la casa". Reusa tokens + primitivas de shared/steps.
// Todas las pantallas llenan 100% del frame (el FlowMap las escala).

const TEACHER = 'Sofía';

// planificaciones de muestra por grado (id de SAVED_GRADES)
const PLANS_BY_GRADE = {
  g1: [
    { title: 'Lectura de textos narrativos', materia: 'lengua', clases: 8, date: 'Hace 2 días' },
    { title: 'Suma y resta con dificultades', materia: 'matematica', clases: 6, date: 'La semana pasada' },
    { title: 'La descripción de personajes', materia: 'lengua', clases: 5, date: '6 may' },
    { title: 'Figuras geométricas y sus elementos', materia: 'matematica', clases: 4, date: '28 abr' },
  ],
  g2: [
    { title: 'Estrategias de multiplicación', materia: 'matematica', clases: 7, date: 'Ayer' },
    { title: 'El texto instructivo', materia: 'lengua', clases: 5, date: '3 may' },
    { title: 'Iniciación a la división', materia: 'matematica', clases: 6, date: '21 abr' },
  ],
  g3: [
    { title: 'Reconocimiento de sonidos y letras', materia: 'lengua', clases: 6, date: 'Hace 4 días' },
    { title: 'Números naturales hasta el 100', materia: 'matematica', clases: 5, date: '2 may' },
  ],
};
const ALL_PLANS = Object.entries(PLANS_BY_GRADE).flatMap(([gid, ps]) => {
  const g = SAVED_GRADES.find(x => x.id === gid);
  return ps.map(p => ({ ...p, gradeId: gid, gradeName: g.name }));
});

// ── shared bits ──────────────────────────────────────────
const Avatar = ({ size = 34 }) => (
  <div style={{ width: size, height: size, borderRadius: size, flexShrink: 0,
    background: T.brandTint, color: T.brandDeep, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontFamily: T.head, fontSize: size * 0.42, fontWeight: 700 }}>S</div>
);

// switcher pill — the always-visible "cambiar de grado" affordance
const GradeSwitcherPill = ({ grade, open }) => (
  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 9, cursor: 'pointer',
    border: `1.5px solid ${open ? T.brand : T.border}`, background: open ? T.brandTint : T.surface,
    borderRadius: 44, padding: '7px 9px 7px 14px', fontFamily: T.font }}>
    <span style={{ width: 22, height: 22, borderRadius: 22, background: T.brand, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="users" size={12} color="#fff" />
    </span>
    <span style={{ fontSize: 14.5, fontWeight: 700, color: T.ink }}>{grade.name}</span>
    <Icon name="chevron-down" size={16} color={T.ink2} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
  </button>
);

const SwitcherDropdown = ({ current, style }) => (
  <div style={{ width: 320, background: T.surface, borderRadius: 16, padding: 8,
    border: `1px solid ${T.border}`, boxShadow: '0 18px 50px rgba(11,27,102,.18)', ...style }}>
    <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: '0.05em',
      textTransform: 'uppercase', padding: '8px 10px 6px' }}>Cambiar de grado</div>
    {SAVED_GRADES.map(g => {
      const on = g.id === current;
      return (
        <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 10px',
          borderRadius: 10, background: on ? T.brandHover : 'transparent', cursor: 'pointer' }}>
          <span style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: on ? T.brand : T.bgDeep, color: on ? '#fff' : T.ink2,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="users" size={16} color={on ? '#fff' : T.ink2} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.font, fontSize: 14.5, fontWeight: 700, color: T.ink }}>{g.name}</div>
            <div style={{ fontFamily: T.font, fontSize: 12, color: T.muted, whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.school}{g.students ? ` · ${g.students} est.` : ''}</div>
          </div>
          {on && <Icon name="check" size={17} color={T.brandDeep} />}
        </div>
      );
    })}
    <div style={{ height: 1, background: T.borderSoft, margin: '6px 8px' }} />
    {[['plus', 'Agregar un grado'], ['layers', 'Administrar mis grados']].map(([ic, lb]) => (
      <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
        borderRadius: 10, cursor: 'pointer', fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink2 }}>
        <Icon name={ic} size={16} color={T.ink2} /> {lb}
      </div>
    ))}
  </div>
);

// planificación list row
const PlanRow = ({ p, showGrade }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 14px', borderRadius: 12,
    background: T.surface, border: `1px solid ${T.border}`, cursor: 'pointer' }}>
    <span style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: T.brandTint,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={p.materia === 'matematica' ? 'calculator' : 'book-open'} size={18} color={T.brandDeep} />
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: T.head, fontSize: 15, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
        <SubjectLabel materia={p.materia} size={10.5} />
        <span style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>
          {showGrade ? `${p.gradeName} · ` : ''}{p.clases} clases · {p.date}
        </span>
      </div>
    </div>
    <Icon name="chevron-right" size={18} color={T.faint} />
  </div>
);

// ── 1 · Login ────────────────────────────────────────────
const LoginScreen = () => (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: T.bg, padding: 40 }}>
    <div style={{ width: 420 }}>
      <div style={{ marginBottom: 28 }}><Logo height={30} /></div>
      <h1 style={{ fontFamily: T.head, fontSize: 30, fontWeight: 800, color: T.ink, letterSpacing: '-0.5px',
        lineHeight: 1.15, margin: 0 }}>Bienvenida de nuevo</h1>
      <p style={{ fontFamily: T.font, fontSize: 15, color: T.ink2, lineHeight: 1.55, margin: '10px 0 26px' }}>
        Entrá para seguir planificando con tus grados.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><FieldLabel>Email</FieldLabel><Field value="sofia.docente@escuela.edu.ar" onChange={() => {}} /></div>
        <div><FieldLabel>Contraseña</FieldLabel><Field value="••••••••" onChange={() => {}} /></div>
        <PillButton full size="lg" iconRight="arrow-right">Ingresar</PillButton>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
        <span style={{ flex: 1, height: 1, background: T.border }} />
        <span style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>o</span>
        <span style={{ flex: 1, height: 1, background: T.border }} />
      </div>
      <PillButton full variant="ghost" icon="globe">Continuar con Google</PillButton>
      <p style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, textAlign: 'center', marginTop: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Icon name="check" size={14} color={T.brandDeep} /> Gratis para docentes de primer ciclo
      </p>
    </div>
  </div>
);

// ── 2 · Onboarding — crear el primer grado ───────────────
const OnboardingFirstGrade = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 28px', borderBottom: `1px solid ${T.borderSoft}` }}>
      <Logo height={22} />
      <span style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.muted }}>Paso 1 de 2</span>
    </div>
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 28px 60px' }}>
        <h1 style={{ fontFamily: T.head, fontSize: 27, fontWeight: 800, color: T.ink, letterSpacing: '-0.4px',
          lineHeight: 1.15, margin: 0 }}>Creemos tu primer grado</h1>
        <p style={{ fontFamily: T.font, fontSize: 14.5, color: T.ink2, lineHeight: 1.55, margin: '10px 0 24px' }}>
          Tu grado es tu espacio de trabajo: desde ahí planificás cualquier materia. Lo guardamos sin atarlo a un área.
        </p>
        <StepGrado grades={[]} onSelect={() => {}} onAddGrade={() => {}} />
      </div>
    </div>
  </div>
);

// ── 3 · Home del grado (el grado es la casa) — 3 navs ────
const GradeHome = ({ gradeId = 'g1', nav = 'topbar', switcherOpen = false }) => {
  const g = SAVED_GRADES.find(x => x.id === gradeId) || SAVED_GRADES[0];
  const plans = PLANS_BY_GRADE[gradeId] || [];

  const greeting = (
    <div style={{ fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.brandDeep,
      display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
      <Icon name={T.aiIcon} size={15} color={T.brandDeep} /> Hola, {TEACHER}
    </div>
  );

  const hero = (
    <div style={{ marginBottom: 22 }}>
      {greeting}
      <h1 style={{ fontFamily: T.head, fontSize: 30, fontWeight: 800, color: T.ink, letterSpacing: '-0.5px',
        lineHeight: 1.1, margin: 0 }}>{g.name}</h1>
      <p style={{ fontFamily: T.font, fontSize: 14, color: T.ink2, margin: '8px 0 0',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="map-pin" size={14} color={T.muted} /> {g.school}</span>
        {g.students && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="users" size={14} color={T.muted} /> {g.students} estudiantes</span>}
      </p>
    </div>
  );

  const noteCard = (
    <div style={{ display: 'flex', gap: 11, padding: '14px 16px', borderRadius: 14, background: T.brandTint,
      marginBottom: 26 }}>
      <Icon name="info" size={16} color={T.brandDeep} style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.brandDeep, letterSpacing: '0.05em',
          textTransform: 'uppercase', marginBottom: 4 }}>Contexto del grupo</div>
        <p style={{ fontFamily: T.font, fontSize: 13.5, color: T.ink, lineHeight: 1.55, margin: 0 }}>{g.note}</p>
      </div>
      <span style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep, whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start' }}><Icon name="pencil" size={13} /> Editar</span>
    </div>
  );

  const planBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: T.head, fontSize: 17, fontWeight: 700, color: T.ink, margin: 0 }}>
          Tus planificaciones en {g.name}
        </h2>
        <span style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep }}>Ver todas ({plans.length})</span>
      </div>
      {plans.slice(0, 4).map((p, i) => <PlanRow key={i} p={p} />)}
    </div>
  );

  const ctaBlock = (
    <div style={{ borderRadius: 18, border: `1.5px solid ${T.border}`, background: T.surface, padding: 20,
      marginBottom: 28 }}>
      <h2 style={{ fontFamily: T.head, fontSize: 18, fontWeight: 700, color: T.ink, margin: '0 0 4px' }}>
        Planificá para este grado
      </h2>
      <p style={{ fontFamily: T.font, fontSize: 13.5, color: T.ink2, margin: '0 0 16px' }}>
        El grado ya está puesto. Elegí la materia y armamos la secuencia.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <PillButton size="lg" icon={T.aiIcon}>Planificar algo nuevo</PillButton>
        <span style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>o directo en</span>
        {['Lengua', 'Matemática'].map(m => (
          <Pill key={m} onClick={() => {}} style={{ padding: '9px 15px', borderRadius: 44, fontSize: 13 }}>{m}</Pill>
        ))}
      </div>
    </div>
  );

  // ---- nav: topbar (default / featured) ----
  if (nav === 'topbar') return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '14px 26px', borderBottom: `1px solid ${T.borderSoft}`, position: 'relative', background: T.bg }}>
        <Logo height={22} />
        <div style={{ justifySelf: 'center', position: 'relative' }}>
          <GradeSwitcherPill grade={g} open={switcherOpen} />
          {switcherOpen && <SwitcherDropdown current={gradeId}
            style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }} />}
        </div>
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 18 }}>
          {['Mis grados', 'Biblioteca'].map(n => (
            <span key={n} style={{ fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.ink2 }}>{n}</span>
          ))}
          <Avatar />
        </div>
      </header>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '34px 30px 60px' }}>
          {hero}{noteCard}{ctaBlock}{planBlock}
        </div>
      </div>
    </div>
  );

  // ---- nav: sidebar ----
  if (nav === 'sidebar') {
    const items = [['layers', 'Planificar', true], ['users', 'Mis grados', false], ['file-text', 'Mis planificaciones', false], ['book-open', 'Biblioteca', false]];
    return (
      <div style={{ height: '100%', display: 'flex', background: T.bg }}>
        <aside style={{ width: 244, flexShrink: 0, borderRight: `1px solid ${T.borderSoft}`,
          background: T.surface, display: 'flex', flexDirection: 'column', padding: '20px 14px' }}>
          <div style={{ padding: '0 8px 18px' }}><Logo height={21} /></div>
          <div style={{ borderRadius: 14, border: `1.5px solid ${T.border}`, padding: 12, marginBottom: 16 }}>
            <div style={{ fontFamily: T.font, fontSize: 10.5, fontWeight: 700, color: T.muted, letterSpacing: '0.05em',
              textTransform: 'uppercase', marginBottom: 8 }}>Grado actual</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: T.brand, color: '#fff', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="users" size={15} color="#fff" /></span>
              <span style={{ flex: 1, fontFamily: T.head, fontSize: 16, fontWeight: 700, color: T.ink }}>{g.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, fontFamily: T.font,
              fontSize: 12.5, fontWeight: 600, color: T.brandDeep, cursor: 'pointer' }}>
              <Icon name="refresh" size={13} color={T.brandDeep} /> Cambiar de grado
            </div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map(([ic, lb, on]) => (
              <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
                borderRadius: 10, background: on ? T.brandTint : 'transparent',
                fontFamily: T.font, fontSize: 14, fontWeight: 600, color: on ? T.brandDeep : T.ink2 }}>
                <Icon name={ic} size={17} color={on ? T.brandDeep : T.ink2} /> {lb}
              </div>
            ))}
          </nav>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px' }}>
            <Avatar size={30} />
            <span style={{ fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.ink }}>{TEACHER}</span>
          </div>
        </aside>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '34px 34px 60px' }}>
            {hero}{noteCard}{ctaBlock}{planBlock}
          </div>
        </div>
      </div>
    );
  }

  // ---- nav: tabs (grados como pestañas) ----
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 26px 0', background: T.bg }}>
        <Logo height={21} />
        <Avatar size={30} />
      </header>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, padding: '12px 22px 0',
        borderBottom: `1px solid ${T.border}` }}>
        {SAVED_GRADES.map(gr => {
          const on = gr.id === gradeId;
          return (
            <div key={gr.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
              borderRadius: '12px 12px 0 0', background: on ? T.surface : 'transparent',
              border: on ? `1px solid ${T.border}` : '1px solid transparent', borderBottom: on ? `1px solid ${T.surface}` : '1px solid transparent',
              marginBottom: -1, fontFamily: T.font, fontSize: 14, fontWeight: on ? 700 : 600, color: on ? T.ink : T.ink2 }}>
              <span style={{ width: 18, height: 18, borderRadius: 6, background: on ? T.brand : T.bgDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="users" size={10} color={on ? '#fff' : T.muted} /></span>
              {gr.name}
            </div>
          );
        })}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', fontFamily: T.font,
          fontSize: 13.5, fontWeight: 600, color: T.muted }}><Icon name="plus" size={15} /> Grado</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', background: T.surface }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 30px 60px' }}>
          {hero}{noteCard}{ctaBlock}{planBlock}
        </div>
      </div>
    </div>
  );
};

// ── 4 · Planificar — elegí materia (grado ya puesto) ─────
const PlanMateriaScreen = ({ gradeId = 'g1' }) => {
  const g = SAVED_GRADES.find(x => x.id === gradeId) || SAVED_GRADES[0];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', borderBottom: `1px solid ${T.borderSoft}`, background: T.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Logo height={22} />
          <span style={{ width: 1, height: 22, background: T.border }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: T.font,
            fontSize: 13.5, fontWeight: 600, color: T.ink2 }}><Icon name="arrow-left" size={16} /> Volver a {g.name}</span>
        </div>
        <div><FlowProgress index={0} /></div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', padding: '36px 28px 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '8px 14px', borderRadius: 44,
            background: T.brandTint, marginBottom: 22 }}>
            <span style={{ width: 22, height: 22, borderRadius: 22, background: T.brand,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="users" size={12} color="#fff" /></span>
            <span style={{ fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.brandInk }}>
              Planificando para <strong>{g.name}</strong></span>
            <span style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep,
              borderLeft: `1px solid ${T.brand}44`, paddingLeft: 9 }}>cambiar</span>
          </div>
          <QuestionShell prompt="¿Qué materia vas a planificar?"
            sub={`El grado ya está: ${g.name}. Elegí el área y seguimos con qué enseñar.`}>
            <StepMateria value="lengua" onSelect={() => {}} />
            <div style={{ marginTop: 22 }}>
              <PillButton size="lg" iconRight="arrow-right">Continuar</PillButton>
            </div>
          </QuestionShell>
        </div>
      </div>
    </div>
  );
};

// ── 5 · Mis grados (listado) — variantes de layout ───────
const GradeCard = ({ g }) => (
  <div style={{ borderRadius: 16, border: `1.5px solid ${T.border}`, background: T.surface, padding: 18,
    display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: T.brandTint,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="users" size={21} color={T.brandDeep} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.head, fontSize: 18, fontWeight: 700, color: T.ink }}>{g.name}</div>
        <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>{g.school}{g.students ? ` · ${g.students} estudiantes` : ''}</div>
      </div>
    </div>
    <p style={{ fontFamily: T.font, fontSize: 13, color: T.ink2, lineHeight: 1.5, margin: 0,
      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{g.note}</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
      <PillButton size="sm" iconRight="arrow-right">Entrar</PillButton>
      <PillButton size="sm" variant="ghost" icon={T.aiIcon}>Planificar</PillButton>
    </div>
  </div>
);

const MisGrados = ({ layout = 'cards' }) => {
  const Header = (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
      <div>
        <h1 style={{ fontFamily: T.head, fontSize: 27, fontWeight: 800, color: T.ink, letterSpacing: '-0.4px', margin: 0 }}>Mis grados</h1>
        <p style={{ fontFamily: T.font, fontSize: 14, color: T.ink2, margin: '6px 0 0' }}>
          Cada grado es un espacio de trabajo. Entrá a uno para planificar.</p>
      </div>
      <PillButton icon="plus">Agregar grado</PillButton>
    </div>
  );
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 26px', borderBottom: `1px solid ${T.borderSoft}` }}>
        <Logo height={22} /><Avatar />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 30px 60px' }}>
          {Header}
          {layout === 'cards' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {SAVED_GRADES.map(g => <GradeCard key={g.id} g={g} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SAVED_GRADES.map(g => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 12, background: T.surface, border: `1px solid ${T.border}` }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: T.brandTint,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="users" size={19} color={T.brandDeep} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.head, fontSize: 15.5, fontWeight: 700, color: T.ink }}>{g.name}</div>
                    <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.school}{g.students ? ` · ${g.students} est.` : ''} · {(PLANS_BY_GRADE[g.id] || []).length} planificaciones</div>
                  </div>
                  <PillButton size="sm" variant="ghost" iconRight="arrow-right">Entrar</PillButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Planificaciones agrupadas por grado (variante de listado)
const PlanificacionesGrouped = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 26px', borderBottom: `1px solid ${T.borderSoft}` }}>
      <Logo height={22} /><Avatar />
    </div>
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 30px 60px' }}>
        <h1 style={{ fontFamily: T.head, fontSize: 27, fontWeight: 800, color: T.ink, letterSpacing: '-0.4px', margin: 0 }}>Mis planificaciones</h1>
        <div style={{ display: 'flex', gap: 8, margin: '16px 0 26px' }}>
          {['Todos los grados', 'Todas las materias'].map(f => (
            <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 44, border: `1.5px solid ${T.border}`, background: T.surface,
              fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink2 }}>{f}<Icon name="chevron-down" size={14} color={T.muted} /></span>
          ))}
        </div>
        {SAVED_GRADES.filter(g => (PLANS_BY_GRADE[g.id] || []).length).map(g => (
          <div key={g.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: 8, background: T.brandTint,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="users" size={13} color={T.brandDeep} /></span>
              <span style={{ fontFamily: T.head, fontSize: 15.5, fontWeight: 700, color: T.ink }}>{g.name}</span>
              <span style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>· {(PLANS_BY_GRADE[g.id] || []).length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(PLANS_BY_GRADE[g.id] || []).map((p, i) => <PlanRow key={i} p={{ ...p, gradeName: g.name }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

Object.assign(window, {
  LoginScreen, OnboardingFirstGrade, GradeHome, PlanMateriaScreen,
  MisGrados, PlanificacionesGrouped, PLANS_BY_GRADE, ALL_PLANS,
});
