// result.jsx — Pantalla de resultado (planificación generada) + estado de carga
// Espeja la vista de producción: tabs sticky (Secuencia · Consignas · Texto) con
// banner de regeneración, barra de formato siempre visible, y rail con
// "¿Qué cambiamos?" (chips fantasma + Pedir cambios + aviso honesto).

// ── build a planning model from the answers ──────────────
const buildPlan = (a) => {
  const s = subjectTheme(a.materia);
  const lvl = gradoLevel(a.grado);
  const u = a.universo ? ` ambientada en ${a.universo.toLowerCase()}` : '';
  const titulo = a.contenido || 'Secuencia didáctica';
  const fund = `Esta secuencia didáctica está pensada para ${a.grado} en el área de ${s.label}, en torno a ${titulo.toLowerCase()}${u}. ` +
    `Propone un recorrido progresivo que parte de los saberes previos del grupo y avanza hacia nuevas conceptualizaciones, en línea con el diseño curricular de CABA y los NAP del primer ciclo.` +
    (a.group && a.group.trim() ? ` Se ajusta al perfil del grupo: ${a.group.trim().toLowerCase()}` : '');
  const esMate = a.materia === 'matematica';
  const tema = (a.contenido || (esMate ? 'la resolución de problemas' : 'la lectura y la escritura')).toLowerCase();
  const uni = a.universo ? a.universo.toLowerCase() : null;
  const objetivos = esMate
    ? [`Resolver problemas que dan sentido a ${tema}, explorando distintas estrategias.`,
       'Registrar y comunicar los procedimientos propios y compararlos con los de sus pares.',
       'Avanzar progresivamente del material concreto hacia representaciones más abstractas.',
       'Participar en la revisión colectiva de resoluciones, tomando el error como parte del aprendizaje.']
    : ['Producir textos breves de manera cada vez más autónoma, respetando las correspondencias entre sonidos y letras, la separación de palabras y el uso de mayúscula y punto.',
       `Leer y comprender textos narrativos${uni ? ` vinculados a ${uni}` : ''}, reconstruyendo la secuencia y los personajes.`,
       'Reflexionar sobre el lenguaje (familias de palabras, rimas y convenciones ortográficas básicas) a partir de la lectura.',
       'Participar en la revisión de las propias escrituras y las de sus compañeros, proponiendo mejoras para una comunicación más clara.'];
  const nodales = esMate
    ? [`Resolución de problemas de ${tema} en contextos cotidianos.`,
       'Estrategias de cálculo y su registro.',
       'Comparación y comunicación de procedimientos.',
       'Uso de material concreto y representaciones gráficas.',
       'Revisión colectiva de resoluciones.']
    : ['Uso del lenguaje oral con múltiples propósitos.',
       'Comprensión de textos literarios: reconstrucción de la secuencia narrativa.',
       'Lectura en voz alta de textos breves con fluidez.',
       'Separación entre palabras y uso de mayúscula inicial y punto final.',
       'Reflexión sobre el lenguaje: familias de palabras y rimas.',
       'Pasos de la escritura: planificación, textualización y revisión.'];
  const indicadores = ['Participa en las instancias colectivas y aporta ideas.',
    'Avanza en autonomía respecto del punto de partida del grupo.',
    'Aplica lo trabajado en una producción propia.'];
  return { titulo, fund, objetivos, nodales, indicadores, suggested: a.clases || 4, accent: s, esMate, u: uni };
};

const claseFor = (i, plan, a) => {
  const amb = plan.u ? ` ambientada en ${plan.u}` : '';
  const lengua = [
    { t: 'Lectura y saberes previos',
      inicio: 'Conversamos sobre qué saben del tema y registramos en el pizarrón las ideas que van surgiendo.',
      desarrollo: `Leo en voz alta el texto seleccionado${amb}, con buena entonación. Compartimos primeras impresiones —de qué trata, qué personajes aparecen— y releemos deteniéndonos en las palabras nuevas para construir su significado entre todos.`,
      cierre: 'Entre todos escribimos una frase breve sobre lo trabajado y la copiamos en el cuaderno.',
      tarea: 'Buscar en casa otro texto parecido para compartir en la próxima clase.' },
    { t: 'La secuencia narrativa',
      inicio: 'Recuperamos lo leído y compartimos lo que trajeron de casa.',
      desarrollo: 'En grupos pequeños ordenan imágenes según los momentos del relato y escriben una oración breve debajo de cada una. Recorro los grupos acompañando sin adelantar la respuesta.',
      cierre: 'Cada grupo comparte su secuencia y acordamos entre todos el orden y las oraciones más claras.',
      tarea: 'Dibujar la parte favorita y escribir una oración que explique por qué.' },
    { t: 'Los personajes',
      inicio: 'Listamos juntos los personajes que aparecen en el texto.',
      desarrollo: 'Cada grupo relee buscando cómo es su personaje —qué hace, qué dice, qué siente— y arma una lista de características con palabras del texto.',
      cierre: 'Presentan sus personajes y construimos entre todos una descripción completa que copiamos en el cuaderno.',
      tarea: 'Imaginar y escribir en 5 o 6 renglones qué le pasó al personaje antes o después del relato.' },
    { t: 'Sonidos y rimas',
      inicio: 'Releo marcando las palabras del final de cada verso y preguntamos qué tienen en común.',
      desarrollo: 'Identificamos juntos las rimas y jugamos a encontrar palabras que rimen, anotándolas en el pizarrón agrupadas por sonido.',
      cierre: 'Escriben en el cuaderno una lista de palabras que riman.',
      tarea: 'Buscar tres parejas de rimas en otro texto.' },
    { t: 'De la imagen a la oración',
      inicio: 'Compartimos las rimas que encontraron.',
      desarrollo: 'A partir de una serie de imágenes, cada estudiante escribe palabras y oraciones que las describen. Acompaño la escritura autónoma según cada nivel.',
      cierre: 'Compartimos algunas producciones y comentamos entre todos.',
      tarea: 'Elegir una imagen y escribir un cuento breve de 5 o 6 renglones.' },
    { t: 'Separar palabras, mayúscula y punto',
      inicio: 'Escribo una oración sin separar las palabras ni usar mayúsculas y discutimos si se entiende.',
      desarrollo: 'Reconstruimos la oración separando las palabras y colocando mayúscula inicial y punto final. Reflexionamos sobre por qué ayudan a la lectura.',
      cierre: 'Corrigen en el cuaderno una serie de oraciones escritas sin esas convenciones.',
      tarea: 'Escribir tres oraciones sobre el texto respetando separación, mayúsculas y puntos.' },
    { t: 'Planificación de la escritura',
      inicio: 'Conversamos qué nos gustaría contar y qué cambiaríamos del relato leído.',
      desarrollo: `Planificamos juntos el cuento${amb}: personajes, lugar, problema y resolución. Cada estudiante escribe un primer borrador con el apoyo de un esquema (Había una vez… De pronto… Finalmente…).`,
      cierre: 'Comparten los borradores y revisamos si son coherentes con lo planificado.',
      tarea: 'Escribir cómo es el personaje principal del propio cuento.' },
    { t: 'Revisión y versión final',
      inicio: 'Releemos los borradores en silencio.',
      desarrollo: 'Revisamos un borrador de ejemplo entre todos (ortografía, separación, mayúsculas y puntos) y luego cada uno mejora el propio. Pasamos en limpio la versión final, cuidando la presentación.',
      cierre: 'Armamos una antología con las producciones para compartir con la comunidad.',
      tarea: 'No hay tarea.' },
  ];
  const mate = [
    { t: 'Exploración del problema',
      inicio: 'Presento una situación abierta y registramos las ideas y estrategias que surgen.',
      desarrollo: `Resuelven en parejas un problema${amb} con material concreto. Recorro observando los distintos caminos de resolución.`,
      cierre: 'Ponemos en común las estrategias y las registramos en un afiche.',
      tarea: 'Resolver un problema similar para compartir en la próxima clase.' },
    { t: 'Estrategias de resolución',
      inicio: 'Recuperamos las estrategias del afiche.',
      desarrollo: 'Comparamos distintos procedimientos para una misma situación y discutimos cuáles son más cómodos y por qué.',
      cierre: 'Cada uno registra en el cuaderno la estrategia que más le sirvió.',
      tarea: 'Escribir cómo resolvió un cálculo y por qué.' },
    { t: 'Del concreto a la representación',
      inicio: 'Retomamos lo trabajado con material concreto.',
      desarrollo: 'Avanzamos hacia representaciones gráficas y numéricas de las mismas situaciones, en parejas.',
      cierre: 'Comparamos representaciones y acordamos cuáles comunican mejor.',
      tarea: 'Representar un problema de dos maneras distintas.' },
    { t: 'Práctica de complejidad creciente',
      inicio: 'Repasamos lo acordado hasta acá.',
      desarrollo: 'Resuelven situaciones de complejidad creciente con puesta en común de procedimientos.',
      cierre: 'Sistematizamos los pasos que nos ayudan a resolver.',
      tarea: 'Resolver dos problemas en el cuaderno.' },
    { t: 'Errores que enseñan',
      inicio: 'Presento resoluciones con errores típicos.',
      desarrollo: 'Entre todos identificamos dónde está el error y cómo corregirlo, sin señalar a nadie.',
      cierre: 'Anotamos una pista para no repetir ese error.',
      tarea: 'Revisar una resolución propia y mejorarla.' },
    { t: 'Juego matemático',
      inicio: 'Presento las reglas de un juego vinculado al tema.',
      desarrollo: `Juegan en grupos${amb}; el juego pone en uso las estrategias trabajadas.`,
      cierre: 'Conversamos qué estrategias ganadoras descubrieron.',
      tarea: 'Enseñar el juego en casa y contar cómo les fue.' },
    { t: 'Problemas de varios pasos',
      inicio: 'Recuperamos las estrategias del juego.',
      desarrollo: 'Resuelven problemas que requieren más de una operación, planificando los pasos.',
      cierre: 'Compartimos cómo organizaron la resolución.',
      tarea: 'Inventar un problema para un compañero.' },
    { t: 'Cierre y evaluación formativa',
      inicio: 'Repasamos el recorrido completo.',
      desarrollo: 'Resuelven una consigna individual breve que me permite observar avances; ofrezco una devolución.',
      cierre: 'Cada uno registra algo que aprendió y algo que quiere seguir practicando.',
      tarea: 'No hay tarea.' },
  ];
  const arcs = plan.esMate ? mate : lengua;
  return arcs[i % arcs.length];
};

// ── controls ─────────────────────────────────────────────
const ClassStepper = ({ value, setValue, suggested, accent }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.ink }}>Cantidad de clases</span>
      <span style={{ fontFamily: T.font, fontSize: 12, color: T.muted }}>Sugerido por la IA: {suggested}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconButton name="minus" size={34} onClick={() => setValue(Math.max(1, value - 1))} />
      <div style={{ minWidth: 96, textAlign: 'center' }}>
        <div style={{ fontFamily: T.head, fontSize: 26, fontWeight: 800, color: T.ink, lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: T.font, fontSize: 11.5, color: T.muted, marginTop: 2 }}>
          {value === 1 ? 'actividad puntual' : 'clases'}
        </div>
      </div>
      <IconButton name="plus" size={34} onClick={() => setValue(Math.min(8, value + 1))} />
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <section style={{ marginBottom: 30 }}>
    <h3 style={{ fontFamily: T.head, fontSize: 17, fontWeight: 700, color: T.ink, margin: '0 0 12px' }}>{title}</h3>
    {children}
  </section>
);

// sugerencias de regeneración — fallback verbatim del producto
const REGEN_SUGERENCIAS = [
  'Incorporá otras formas de demostrar el aprendizaje: oral, dibujo, selección, reconocimiento físico de letras.',
  'Cambiá el recurso del juego.',
  'Ajustá el campo numérico.',
];

// aviso honesto cuando el pedido no produce cambios (ADR 0028)
const AVISO_NO_APLICADO = 'Ese pedido no se pudo aplicar sobre esta planificación — quedó como estaba. Probá pedirlo de otra manera o con más detalle.';

// chip fantasma de sugerencia (lista vertical, ícono + arriba)
const SugerenciaGhost = ({ texto, onPick }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onPick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 7, width: '100%', textAlign: 'left',
        border: 'none', background: h ? T.brandTint : 'transparent', cursor: 'pointer',
        borderRadius: 8, padding: '4px 6px', transition: 'background .12s' }}>
      <Icon name="plus" size={15} color={T.brand} style={{ marginTop: 2 }} />
      <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 500, color: T.brandDeep, lineHeight: 1.4 }}>{texto}</span>
    </button>
  );
};

const ResultScreen = ({ a, onBack, onRestart, cambiosResultado = 'aplica' }) => {
  const plan = React.useMemo(() => buildPlan(a), [a]);
  const count = a.clases || plan.suggested;
  const tabs = ['Secuencia', 'Consignas'].concat(a.texto ? ['Texto'] : []);
  const [tab, setTab] = React.useState('Secuencia');
  const [changeMsg, setChangeMsg] = React.useState('');
  const [pidiendo, setPidiendo] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  const [notApplied, setNotApplied] = React.useState(false);
  const [undone, setUndone] = React.useState(false);
  const acc = plan.accent;

  const sendChange = () => {
    if (!changeMsg.trim() || pidiendo) return;
    setPidiendo(true); setNotApplied(false);
    setTimeout(() => {
      setPidiendo(false);
      if (cambiosResultado === 'no-aplica') { setNotApplied(true); }
      else { setApplied(true); setUndone(false); setChangeMsg(''); }
    }, 1400);
  };

  const fmtBtn = (t, cmd, gl, w, fs, td) => (
    <button key={cmd} title={t} onMouseDown={(e) => { e.preventDefault(); document.execCommand(cmd); }}
      style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surface,
        cursor: 'pointer', fontFamily: T.font, fontSize: 14, fontWeight: w, fontStyle: fs, textDecoration: td, color: T.ink }}>{gl}</button>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 28px', borderBottom: `1px solid ${T.borderSoft}`, flexShrink: 0, background: T.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Logo height={22} />
          <span style={{ width: 1, height: 22, background: T.border }} />
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 7, border: 'none',
            background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.ink2 }}>
            <Icon name="arrow-left" size={16} /> Ajustar respuestas
          </button>
        </div>
        <button onClick={onRestart} style={{ display: 'flex', alignItems: 'center', gap: 7, border: 'none',
          background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 13.5, fontWeight: 600, color: T.ink2 }}>
          <Icon name="plus" size={15} /> Nueva
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 28px 100px',
          display: 'grid', gridTemplateColumns: '1fr 296px', gap: 36, alignItems: 'start' }}>

          {/* main column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <SubjectLabel materia={a.materia} size={12} />
              <span style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted }}>· {a.grado} · hoy</span>
            </div>
            <h1 style={{ fontFamily: T.head, fontSize: 30, fontWeight: 800, color: T.ink,
              letterSpacing: '-0.4px', lineHeight: 1.15, margin: '0 0 6px' }}>{plan.titulo}</h1>
            {a.universo && <p style={{ fontFamily: T.font, fontSize: 14.5, color: acc.deep, margin: '0 0 4px',
              display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="globe" size={15} color={acc.deep} /> {a.universo}</p>}

            {/* sticky: banner de regeneración + tabs + barra de formato */}
            <div style={{ position: 'sticky', top: 0, zIndex: 20, background: T.bg, paddingTop: 8 }}>
              {applied && (
                <div className="gh-fade" style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px',
                  borderRadius: 12, background: T.brandTint, marginBottom: 10 }}>
                  <Icon name="check" size={16} color={T.brandDeep} />
                  <span style={{ flex: 1, fontFamily: T.font, fontSize: 13.5, color: T.brandInk, lineHeight: 1.5 }}>
                    Listo, ajustamos la planificación con tu pedido. Revisala y seguí editando lo que quieras.
                  </span>
                  <button onClick={() => { setApplied(false); setUndone(true); }} style={{ display: 'inline-flex',
                    alignItems: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer',
                    fontFamily: T.font, fontSize: 12.5, fontWeight: 600, color: T.brandDeep, whiteSpace: 'nowrap' }}>
                    <Icon name="refresh" size={13} color={T.brandDeep} /> Deshacer todo</button>
                  <button onClick={() => setApplied(false)} title="Cerrar" style={{ border: 'none', background: 'transparent',
                    cursor: 'pointer', display: 'flex', padding: 2, opacity: .6 }}>
                    <Icon name="x" size={14} color={T.brandDeep} /></button>
                </div>
              )}
              {undone && (
                <div className="gh-fade" style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px',
                  borderRadius: 12, background: T.bgDeep, marginBottom: 10 }}>
                  <Icon name="refresh" size={15} color={T.ink2} />
                  <span style={{ flex: 1, fontFamily: T.font, fontSize: 13.5, color: T.ink2, lineHeight: 1.5 }}>
                    Volviste a la versión anterior.
                  </span>
                  <button onClick={() => { setUndone(false); setApplied(true); }} style={{ border: 'none',
                    background: 'transparent', cursor: 'pointer', fontFamily: T.font, fontSize: 12.5,
                    fontWeight: 600, color: T.brandDeep, whiteSpace: 'nowrap' }}>Rehacer</button>
                  <button onClick={() => setUndone(false)} title="Cerrar" style={{ border: 'none', background: 'transparent',
                    cursor: 'pointer', display: 'flex', padding: 2, opacity: .6 }}>
                    <Icon name="x" size={14} color={T.ink2} /></button>
                </div>
              )}
              <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${T.borderSoft}` }}>
                {tabs.map(t => {
                  const on = t === tab;
                  return (
                    <button key={t} role="tab" aria-selected={on} onClick={() => setTab(t)}
                      style={{ padding: '9px 13px', border: 'none', background: 'transparent', cursor: 'pointer',
                        borderBottom: on ? `2px solid ${T.brand}` : '2px solid transparent', marginBottom: -1,
                        fontFamily: T.font, fontSize: 13.5, fontWeight: on ? 700 : 600,
                        color: on ? T.ink : T.muted, transition: 'color .12s' }}>{t}</button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0',
                background: T.bg, borderBottom: `1px solid ${T.borderSoft}` }}>
                {[['Negrita', 'bold', 'B', 800, 'normal', 'none'], ['Cursiva', 'italic', 'I', 600, 'italic', 'none'], ['Subrayado', 'underline', 'U', 600, 'normal', 'underline']].map(x => fmtBtn(...x))}
                <button title="Lista" onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertUnorderedList'); }}
                  style={{ height: 30, padding: '0 10px', borderRadius: 7, border: `1px solid ${T.border}`, background: T.surface,
                    cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink }}>• Lista</button>
                <span style={{ marginLeft: 'auto', fontFamily: T.font, fontSize: 12.5, color: T.muted,
                  display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="file-check" size={14} color={T.muted} /> Tus cambios quedan guardados
                </span>
              </div>
            </div>

            {/* documento — siempre editable, como el producto */}
            <div className="cf-rise" contentEditable suppressContentEditableWarning
              style={{ outline: 'none', paddingTop: 22 }}>

              {tab === 'Secuencia' && (
                <React.Fragment>
                  <Section title="Fundamentación">
                    <p style={{ fontFamily: T.font, fontSize: 15, color: T.ink2, lineHeight: 1.7, margin: 0 }}>{plan.fund}</p>
                  </Section>

                  <Section title="Objetivos de aprendizaje">
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {plan.objetivos.map((o, i) => (
                        <li key={i} style={{ display: 'flex', gap: 10, fontFamily: T.font, fontSize: 15, color: T.ink2, lineHeight: 1.6 }}>
                          <Icon name="check" size={17} color={acc.color} style={{ marginTop: 3, flexShrink: 0 }} />{o}
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section title="Contenidos nodales">
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {plan.nodales.map((o, i) => (
                        <li key={i} style={{ display: 'flex', gap: 10, fontFamily: T.font, fontSize: 14.5, color: T.ink2, lineHeight: 1.55 }}>
                          <span style={{ width: 5, height: 5, borderRadius: 5, background: acc.color, marginTop: 8, flexShrink: 0 }} />{o}
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section title={count === 1 ? 'La actividad' : `Las ${count} clases`}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {Array.from({ length: count }).map((_, i) => {
                        const c = claseFor(i, plan, a);
                        return (
                          <div key={i} style={{ borderRadius: T.cardRadius, border: `1.5px solid ${T.cardBorder}`,
                            background: T.surface, boxShadow: T.cardShadowCss, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px',
                              borderBottom: `1px solid ${T.borderSoft}` }}>
                              <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: acc.tint,
                                color: acc.deep, fontFamily: T.head, fontSize: 14, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                              <span style={{ flex: 1, fontFamily: T.head, fontSize: 15, fontWeight: 600, color: T.ink }}>
                                {count === 1 ? plan.titulo : c.t}
                              </span>
                            </div>
                            <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                              {[['Inicio', c.inicio], ['Desarrollo', c.desarrollo], ['Cierre y consolidación', c.cierre], ['Tarea', c.tarea]].map(([lab, txt]) => (
                                <div key={lab}>
                                  <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                                    textTransform: 'uppercase', color: T.muted, marginBottom: 3 }}>{lab}</div>
                                  <p style={{ fontFamily: T.font, fontSize: 14, color: T.ink2, lineHeight: 1.6, margin: 0 }}>{txt}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Section>

                  <Section title="Indicadores de avance">
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {plan.indicadores.map((o, i) => (
                        <li key={i} style={{ display: 'flex', gap: 10, fontFamily: T.font, fontSize: 15, color: T.ink2, lineHeight: 1.6 }}>
                          <Icon name="check" size={17} color={acc.color} style={{ marginTop: 3, flexShrink: 0 }} />{o}
                        </li>
                      ))}
                    </ul>
                  </Section>
                </React.Fragment>
              )}

              {tab === 'Consignas' && (
                <Section title="Consignas para estudiantes">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Array.from({ length: count }).map((_, i) => {
                      const c = claseFor(i, plan, a);
                      return (
                        <div key={i} style={{ borderRadius: T.cardRadius, border: `1.5px solid ${T.cardBorder}`,
                          background: T.surface, padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, background: acc.tint,
                              color: acc.deep, fontFamily: T.head, fontSize: 13, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                            <span style={{ fontFamily: T.head, fontSize: 14.5, fontWeight: 600, color: T.ink }}>{c.t}</span>
                          </div>
                          <p style={{ fontFamily: T.font, fontSize: 14, color: T.ink2, lineHeight: 1.6, margin: 0 }}>{c.cierre} {c.tarea !== 'No hay tarea.' ? `Para casa: ${c.tarea.toLowerCase()}` : ''}</p>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {tab === 'Texto' && a.texto && (
                <Section title={a.texto.title}>
                  <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, marginBottom: 12 }}>
                    {typeof a.texto.palabras === 'number' ? `${a.texto.author} · ${a.texto.tema} · ${a.texto.palabras} palabras` : `${a.texto.author} · texto propio`}
                  </div>
                  <p style={{ fontFamily: T.font, fontSize: 15, color: T.ink2, lineHeight: 1.75, margin: 0 }}>
                    {a.texto.passage || 'El texto que subiste se usa como base de la secuencia.'}
                  </p>
                </Section>
              )}
            </div>
          </div>

          {/* rail */}
          <aside style={{ position: 'sticky', top: 8, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* pedir cambios */}
            <div style={{ borderRadius: 18, border: `1.5px solid ${T.border}`, background: T.surface, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon name={T.aiIcon} size={16} color={T.brandDeep} />
                <span style={{ fontFamily: T.head, fontSize: 14, fontWeight: 700, color: T.ink }}>¿Qué cambiamos?</span>
              </div>
              {pidiendo ? (
                <div style={{ padding: '4px 0 8px' }}>
                  <blockquote style={{ margin: '0 0 10px', paddingLeft: 10, borderLeft: `2.5px solid ${T.border}`,
                    fontFamily: T.font, fontSize: 13.5, fontStyle: 'italic', color: T.ink2, lineHeight: 1.5 }}>
                    {changeMsg}</blockquote>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: T.font,
                    fontSize: 13, fontWeight: 600, color: T.brandDeep }}>
                    <span className="cf-pulse" style={{ display: 'inline-flex' }}><Icon name={T.aiIcon} size={15} color={T.brandDeep} /></span>
                    Pidiendo cambios…</span>
                </div>
              ) : (
                <React.Fragment>
                  <TextArea value={changeMsg} onChange={setChangeMsg} rows={3}
                    placeholder="Ej. sumá más juego en las primeras clases…" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '10px 0' }}>
                    {REGEN_SUGERENCIAS.map(s => (
                      <SugerenciaGhost key={s} texto={s} onPick={() => setChangeMsg(s)} />
                    ))}
                  </div>
                  {notApplied && (
                    <p role="status" style={{ fontFamily: T.font, fontSize: 12.5, color: T.ink2, lineHeight: 1.5,
                      margin: '0 0 10px' }}>{AVISO_NO_APLICADO}</p>
                  )}
                  <PillButton full size="sm" icon={T.aiIcon} onClick={sendChange} disabled={!changeMsg.trim()}>Pedir cambios</PillButton>
                </React.Fragment>
              )}
            </div>

            {/* acciones */}
            <div style={{ borderRadius: 18, border: `1.5px solid ${T.border}`, background: T.surface, padding: 8 }}>
              {[['download', 'Descargar'], ['share', 'Compartir'], ['copy', 'Copiar contenido']].map(([ic, lb]) => (
                <button key={lb} className="cf-act" style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%',
                  padding: '11px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 11,
                  fontFamily: T.font, fontSize: 14, fontWeight: 500, color: T.ink, textAlign: 'left' }}>
                  <Icon name={ic} size={17} color={T.ink2} /> {lb}
                </button>
              ))}
            </div>

            {/* nota */}
            <p style={{ fontFamily: T.font, fontSize: 12, color: T.muted, lineHeight: 1.5, textAlign: 'center', margin: '2px 8px 0',
              display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <Icon name="info" size={13} /> Todo lo que ves es editable por vos.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

// ── generating state ─────────────────────────────────────
const GeneratingScreen = ({ a }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
    <div className="cf-pulse" style={{ width: 64, height: 64, borderRadius: 20, background: T.brandTint,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={T.aiIcon} size={30} color={T.brandDeep} />
    </div>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontFamily: T.head, fontSize: 22, fontWeight: 700, color: T.ink, margin: 0 }}>Armando tu planificación…</h2>
      <p style={{ fontFamily: T.font, fontSize: 14.5, color: T.ink2, margin: '8px 0 0' }}>
        Estamos pensando {a.contenido ? `“${a.contenido.toLowerCase()}”` : 'tu secuencia'} para {a.grado}.
      </p>
    </div>
  </div>
);

Object.assign(window, { ResultScreen, GeneratingScreen, buildPlan });
