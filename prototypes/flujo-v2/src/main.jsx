// Entrada del prototipo publicado: el home del grado con las opciones que
// salieron a producción, sin el panel de tweaks del archivo de diseño.
const W = 1360, H = 864;

const Stage = ({ children }) => {
  const [s, setS] = React.useState(1);
  React.useEffect(() => {
    const fit = () => {
      const w = window.innerWidth, h = window.innerHeight - 44; // 44 = barra superior
      if (w < 1 || h < 1) { requestAnimationFrame(fit); return; }
      setS(Math.max(0.2, Math.min((w - 40) / W, (h - 32) / H, 1)));
    };
    fit(); requestAnimationFrame(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 44, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: W, height: H, flexShrink: 0, transform: `scale(${s})`, transformOrigin: 'center center',
        background: T.bg, borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 40px 100px -30px rgba(0,0,0,.4), 0 0 0 1px rgba(0,0,0,.05)' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Stage>
      <GradeProjectHome layout="minimal" kbMode="panel" emptyMode="prompts" estado="con"
        universoEmpty="chip" cambios="aplica" startNew={false} nuevoMode="formulario" retroMode="banner" />
    </Stage>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
