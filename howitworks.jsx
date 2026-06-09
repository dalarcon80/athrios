/* ============================================================================
   How it works — Athrios Value OS operating model (compact, scroll-triggered)
   One model top→bottom: demand IN → 3 layers → value OUT. Premium, low-density.
   Fits ~1040×660. Vermilion = demand/ranking · purple = execution · green = proof.
   ============================================================================ */
(() => {
const { useState, useEffect, useRef } = React;

const ApexMk = ({ s = 22 }) =>
  <svg width={s} height={s} viewBox="0 0 96 96" fill="none">
    <g stroke="#F4F1EA" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"><path d="M22 86 L48 60 L74 86" /></g>
    <path d="M48 12 L76 56 L20 56 Z" fill="#FF4A2E" />
  </svg>;
const Chk = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;
const Replay = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>;
const Person = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/></svg>;
const Shield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>;

const DEMAND  = ['Margin visibility', 'Revenue leakage', 'Customer churn', 'Risk exposure', 'AI pilots without return'];
const L01SIG  = ['Context', 'Maturity', 'Ownership', 'Feasibility', 'Time to value'];
const L02MOD  = ['Value case', 'Capability blueprint', 'Execution path', 'Adoption path', 'Production build'];
const SPECS   = ['Business', 'Finance', 'Data', 'Platform', 'Governance'];
const CONTROLS= ['Quality gates', 'Evidence', 'Observability', 'FinOps'];
const PROOF   = ['Production proof', 'Adoption signal', 'KPI trust', 'Monetization'];

const rv = (on, d = 8) => ({ opacity: on ? 1 : 0, transform: on ? 'none' : `translateY(${d}px)` });

function HowItWorks() {
  const [t, setT] = useState(0);
  const ref = useRef(null);
  const startedRef = useRef(false);
  const t0Ref = useRef(0);
  const rafRef = useRef(0);
  const MAX = 7600;

  const run = () => {
    cancelAnimationFrame(rafRef.current);
    const tick = (ts) => {
      if (!t0Ref.current) t0Ref.current = ts;
      const e = ts - t0Ref.current; setT(e);
      if (e < MAX) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  const replay = () => { t0Ref.current = 0; setT(0); run(); };
  useEffect(() => {
    const onRestart = () => replay();
    window.addEventListener('hiw-restart', onRestart);
    return () => window.removeEventListener('hiw-restart', onRestart);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting && !startedRef.current) { startedRef.current = true; run(); } });
    }, { threshold: 0.25 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, []);

  const l1on = t >= 800,  l1out = t >= 1500;
  const l2on = t >= 2000, l2out = t >= 2900;
  const l3on = t >= 3300;
  const humanOk = t >= 4800;
  const ctrlOk  = t >= 4100;
  const gatePass = t >= 4900;
  const proofOk = t >= 5200;
  const l3out = t >= 5500;
  const valueOut = t >= 5900;
  const finalOn = t >= 6700;

  const bs = (active, done) => done ? 'done' : active ? 'active' : 'idle';

  return (
    <div className="hiw-wrap" ref={ref}>
      <div className="hiw-panel">
        <div className="hiw-bar">
          <span className="mk"><ApexMk s={22} /></span>
          <span className="ti">Athrios Value OS</span>
          <span className="sep" />
          <span className="sub">Operating model</span>
          <span className={'live' + (valueOut ? ' proven' : '')}><span className="d" />{valueOut ? 'Proven' : 'Running'}</span>
          <button className="hiw-replay" onClick={replay} title="Replay"><Replay /></button>
        </div>

        <div className="os-flow">
          {/* INPUT STRIP */}
          <div className={'os-input' + (t >= 1300 ? ' flowing' : '')}>
            <span className="os-inlabel"><span className="dotmk em" />Enterprise demand in</span>
            <div className="os-inchips">
              {DEMAND.map((d, i) => { const shown = t >= 150 + i * 130; const sel = i === 0 && t >= 1000; return <span key={i} className={'chip demand' + (sel ? ' sel' : '')} style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateX(-18px)', transition: 'opacity 0.5s var(--ease), transform 0.5s var(--ease)' }}>{d}{sel && <span className="seltag">selected</span>}</span>; })}
              <span className="chip more" style={rv(t >= 820, 4)}>+ more</span>
            </div>
          </div>

          {/* LAYER 01 */}
          <div className="os-row l1" data-state={bs(l1on, l1out)}>
            <div className="os-meta">
              <span className="os-kind">Layer 01</span>
              <span className="os-name">Value Intelligence</span>
              <span className="os-purpose">Reads context, maturity, ownership and value potential.</span>
            </div>
            <div className="os-mid">
              <div className="os-signals" style={rv(l1on, 6)}>{L01SIG.join('  ·  ')}</div>
            </div>
            <div className="os-card em" style={rv(l1out, 10)}>
              <span className="oc-ey">Ranked opportunity</span>
              <span className="oc-v">Margin visibility</span>
              <span className="oc-meta">High impact · clear owner · fast path</span>
            </div>
          </div>

          {/* LAYER 02 */}
          <div className="os-row l2" data-state={bs(l2on, l2out)}>
            <div className="os-meta">
              <span className="os-kind">Layer 02</span>
              <span className="os-name">Operating Execution</span>
              <span className="os-purpose">Turns the ranked priority into the execution recipe required to build, adopt and scale the capability.</span>
            </div>
            <div className="os-mid">
              <div className="os-chips">
                {L02MOD.map((d, i) => <span key={i} className="chip exec" style={rv(l2on && t >= 2100 + i * 110, 6)}>{d}</span>)}
              </div>
              <div className="os-micro" style={rv(l2on && t >= 2300, 4)}>AI-enabled execution · expert-governed decisions</div>
            </div>
            <div className="os-card pu" style={rv(l2out, 10)}>
              <span className="oc-ey">Output</span>
              <span className="oc-v">Governed execution playlist</span>
            </div>
          </div>

          {/* LAYER 03 */}
          <div className="os-row l3" data-state={bs(l3on, l3out)}>
            <div className="os-meta">
              <span className="os-kind">Layer 03</span>
              <span className="os-name">Trust &amp; Proof</span>
              <span className="os-purpose">Validates decisions and proves value in production.</span>
            </div>
            <div className="os-mid">
              <div className="os-mods">
                <div className={'l3mod human' + (humanOk ? ' done' : '')} style={{ ...rv(l3on, 6), ...(humanOk ? { borderColor: 'var(--fn-green-line)', background: 'var(--fn-green-tint)' } : {}) }}>
                  <div className="lm-head"><span className="lm-ico"><Person /></span>Human expert review</div>
                  <div className="lm-avs">
                    {SPECS.map((r, i) => { const ok = t >= 3700 + i * 230; return <span key={i} className={'lm-av' + (ok ? ' ok' : '')} title={r + ' specialist'} style={ok ? { color: 'var(--fn-green)', borderColor: 'var(--fn-green-line)', background: 'linear-gradient(180deg,rgba(34,197,94,0.4),rgba(34,197,94,0.16))' } : undefined}><Person /></span>; })}
                  </div>
                  <div className="lm-sub">Domain specialists approve business logic, metric model and adoption path before value is claimed.</div>
                  <span className={'lm-st' + (humanOk ? ' on' : '')} style={humanOk ? { color: 'var(--fn-green)', borderColor: 'var(--fn-green-line)', background: 'var(--fn-green-tint)' } : undefined}>{humanOk ? 'Specialist-approved' : 'In review'}</span>
                </div>
                <div className={'l3mod' + (ctrlOk ? ' done' : '')} style={rv(l3on && t >= 3450, 6)}>
                  <div className="lm-head">Operating controls</div>
                  <div className="lm-list">Quality gates<br/>Evidence trail<br/>Governance controls<br/>Production visibility</div>
                  <span className={'lm-st neutral' + (ctrlOk ? ' on' : '')} style={ctrlOk ? { color: 'var(--text-hi)', borderColor: 'var(--line-strong)', background: 'rgba(255,255,255,0.04)' } : undefined}>{ctrlOk ? 'Controlled' : 'Engaging'}</span>
                </div>
                <div className={'l3mod' + (proofOk ? ' done' : '')} style={rv(l3on && t >= 3600, 6)}>
                  <div className="lm-head">Value proof</div>
                  <div className="lm-list">Production proof<br/>Adoption signal<br/>KPI trust<br/>Value tracking</div>
                  <span className={'lm-st' + (proofOk ? ' on' : '')} style={proofOk ? { color: 'var(--fn-green)', borderColor: 'var(--fn-green-line)', background: 'var(--fn-green-tint)' } : undefined}>{proofOk ? 'Proven' : 'Measuring'}</span>
                </div>
              </div>
              <div className={'os-gatebar' + (gatePass ? ' pass' : '')} style={{ ...rv(l3on && t >= 4200, 6), ...(gatePass ? { borderStyle: 'solid', borderColor: 'var(--fn-green-line)', background: 'var(--fn-green-tint)' } : {}) }}>
                <span className="gb-ico" style={gatePass ? { color: 'var(--fn-green)' } : undefined}><Shield /></span>
                <span className="gb-txt" style={gatePass ? { color: 'var(--text-hi)' } : undefined}>No value claim passes without expert-approved evidence.</span>
                <span className="gb-st" style={gatePass ? { color: 'var(--fn-green)' } : undefined}>{gatePass ? 'Gate passed' : 'Gate pending'}</span>
              </div>
            </div>
            <div className="os-card gr" style={rv(l3out, 10)}>
              <span className="oc-ey">Trust &amp; proof</span>
              <span className="oc-v">Value proven in production</span>
              <span className="oc-meta">Live · adopted · measured</span>
            </div>
          </div>

          {/* OUTPUT BAR */}
          <div className={'os-outbar' + (valueOut ? ' on' : '')}>
            <span className="ob-label"><span className="dotmk gr" />Business value out</span>
            <div className="ob-proof">
              {['Live capability', 'Business adoption', 'Measured impact', 'Monetizable value'].map((v, i) =>
                <span key={i} className="ob-pi" style={rv(valueOut && t >= 6050 + i * 150, 6)}><Chk />{v}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="hiw-final" style={rv(finalOn, 8)}>
        <span>Usable.</span><span className="dot" /><span>Measured.</span><span className="dot" /><span>Monetizable.</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('how-root')).render(<HowItWorks />);
})();
