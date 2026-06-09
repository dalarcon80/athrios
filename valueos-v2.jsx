/* ============================================================================
   Athrios Value OS — controller + window shell.
   rAF clock drives chapter advance + scrubber; scenes self-stagger from t.
   Pause on hover, manual chapter jump, replay, and a product-only fullscreen.
   ============================================================================ */
const { Scene1, Scene2, Scene3, Scene4, ApexMark } = window;

const CHAPTERS = [
  { name: 'Demand',  dur: 5600 },
  { name: 'Ranking', dur: 6000 },
  { name: 'Recipe',  dur: 7000 },
  { name: 'Impact',  dur: 8000 },
];
const SCENES = [Scene1, Scene2, Scene3, Scene4];

const IcExpand = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>;
const IcMin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>;
const IcReplay = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>;
const IcPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M7 4.5v15l13-7.5z"/></svg>;
const IcPause = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;

function ValueOS() {
  const [phase, setPhase] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [running, setRunning] = React.useState(true); // false only when film ended
  const [fs, setFs] = React.useState(false);

  const phaseRef = React.useRef(0);
  const elapsedRef = React.useRef(0);
  const runRef = React.useRef(true);
  const hoverRef = React.useRef(false);

  React.useEffect(() => { phaseRef.current = phase; }, [phase]);
  React.useEffect(() => { runRef.current = running; }, [running]);

  // master clock
  React.useEffect(() => {
    let raf, last = null;
    const loop = (ts) => {
      if (last == null) last = ts;
      const dt = Math.min(ts - last, 64); last = ts;
      if (runRef.current && !hoverRef.current) {
        let e = elapsedRef.current + dt;
        let ph = phaseRef.current;
        if (e >= CHAPTERS[ph].dur) {
          if (ph < CHAPTERS.length - 1) { ph += 1; e = 0; phaseRef.current = ph; setPhase(ph); }
          else { e = CHAPTERS[ph].dur; runRef.current = false; setRunning(false); }
        }
        elapsedRef.current = e; setElapsed(e);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const goTo = (i) => {
    phaseRef.current = i; elapsedRef.current = 0;
    setPhase(i); setElapsed(0); runRef.current = true; setRunning(true);
  };
  const replay = () => goTo(0);
  React.useEffect(() => {
    const onRestart = () => replay();
    window.addEventListener('vos-restart', onRestart);
    return () => window.removeEventListener('vos-restart', onRestart);
  }, []);
  const togglePlay = () => {
    if (!running) { // ended → replay
      if (phase === CHAPTERS.length - 1 && elapsed >= CHAPTERS[phase].dur) { replay(); return; }
      runRef.current = true; setRunning(true);
    } else { runRef.current = false; setRunning(false); }
  };

  // fullscreen esc
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setFs(false); };
    if (fs) { document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [fs]);

  const paused = !running || hoverRef.current;

  const windowEl = (
      <div className="vos-window"
        onMouseEnter={() => { hoverRef.current = true; }}
        onMouseLeave={() => { hoverRef.current = false; }}>

        {/* titlebar */}
        <div className="vos-titlebar">
          <span className="vos-tb-mark"><ApexMark s={22} /></span>
          <span className="vos-tb-title">Athrios Value OS</span>
          <span className="vos-tb-sep" />
          <span className="vos-tb-chapter">{('0' + (phase + 1)).slice(-2)} · {CHAPTERS[phase].name}</span>
          <div className="vos-tb-right">
            <span className={'vos-tb-live' + (running ? '' : ' paused')}>
              <span className="d" />{running ? 'Auto' : 'Hold'}
            </span>
            <button className="vos-iconbtn" onClick={() => setFs(f => !f)} title={fs ? 'Exit fullscreen' : 'Fullscreen'}>
              {fs ? <IcMin /> : <IcExpand />}
            </button>
          </div>
        </div>

        {/* stage */}
        <div className="vos-stage">
          {(() => { const S = SCENES[phase]; return <S key={phase} active={true} t={elapsed} />; })()}
        </div>

        {/* controls */}
        <div className="vos-controls">
          <button className="vos-iconbtn" onClick={togglePlay} title={paused ? 'Play' : 'Pause'}>
            {paused ? <IcPlay /> : <IcPause />}
          </button>
          <div className="vos-chapters">
            {CHAPTERS.map((c, i) => {
              const state = i < phase ? 'done' : i === phase ? 'active' : 'idle';
              const fill = i === phase ? Math.min(100, (elapsed / c.dur) * 100) : 0;
              return (
                <button key={i} className="vos-chapter" data-state={state} onClick={() => goTo(i)}>
                  <span className="cc-label">
                    <span className="cc-num">{('0' + (i + 1)).slice(-2)}</span>
                    <span className="cc-name">{c.name}</span>
                  </span>
                  <span className="cc-track"><i style={{ width: fill + '%', transition: state === 'active' ? 'width 0.12s linear' : 'none' }} /></span>
                </button>
              );
            })}
          </div>
          <div className="vos-ctl-actions">
            <button className="vos-iconbtn" onClick={replay} title="Replay"><IcReplay /></button>
            <button className="vos-iconbtn" onClick={() => setFs(f => !f)} title={fs ? 'Exit fullscreen' : 'Fullscreen'}>
              {fs ? <IcMin /> : <IcExpand />}
            </button>
          </div>
        </div>
      </div>
  );

  if (fs) {
    return ReactDOM.createPortal(
      <div className="vos-shell" data-fs="true">{windowEl}</div>,
      document.body
    );
  }
  return <div className="vos-shell">{windowEl}</div>;
}

ReactDOM.createRoot(document.getElementById('valueos-root')).render(<ValueOS />);
