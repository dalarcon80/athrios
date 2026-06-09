/* ============================================================================
   Athrios Value OS — the four cinematic scenes.
   Each receives { active, t } where t = elapsed ms inside this chapter.
   Reveals are driven from t so the film "doesn't move faster than you read".
   ============================================================================ */

/* tiny inline marks (no external icon dep, render-synchronous) */
const ApexMark = ({ s = 30, c = '#F4F1EA' }) =>
  <svg width={s} height={s} viewBox="0 0 96 96" fill="none">
    <g stroke={c} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"><path d="M22 86 L48 60 L74 86" /></g>
    <path d="M48 12 L76 56 L20 56 Z" fill="var(--ember)" />
  </svg>;
const IcTarget = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/></svg>;
const IcCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;
const IcGauge = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14 16 9"/><path d="M3.5 18a9 9 0 1 1 17 0"/><circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none"/></svg>;
const IcUp = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17 9 11l4 4 8-8"/><path d="M16 7h5v5"/></svg>;

/* premium signal sparkline — smooth area + line, draws in */
function Spark({ points, on, color = 'var(--fn-green)' }) {
  const W = 100, H = 30, max = Math.max(...points), min = Math.min(...points);
  const span = (max - min) || 1;
  const pts = points.map((p, i) => [ (i / (points.length - 1)) * W, H - 3 - ((p - min) / span) * (H - 6) ]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${W} ${H} L0 ${H} Z`;
  const last = pts[pts.length - 1];
  const gid = React.useMemo(() => 'sg' + Math.random().toString(36).slice(2, 7), []);
  return (
    <svg className="spark-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.28" /><stop offset="1" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <path d={area} fill={`url(#${gid})`} style={{ opacity: on ? 1 : 0, transition: 'opacity 0.6s var(--ease) 0.25s' }} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: 'stroke-dashoffset 0.9s var(--ease)' }} />
      <circle cx={last[0]} cy={last[1]} r="2.1" fill={color} vectorEffect="non-scaling-stroke"
        style={{ opacity: on ? 1 : 0, transition: 'opacity 0.4s var(--ease) 0.85s' }} />
    </svg>
  );
}

const reveal = (on, dist = 10) => ({ opacity: on ? 1 : 0, transform: on ? 'none' : `translateY(${dist}px)` });
const sceneStyle = (active) => ({ opacity: active ? 1 : 0, transform: active ? 'none' : 'scale(1.012)', pointerEvents: active ? 'auto' : 'none', transition: 'opacity 0.55s var(--ease), transform 0.7s var(--ease)' });
// per-chapter entrance: each scene remounts on chapter change (key) and eases in.
function useEnter() {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => { const id = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(id); }, []);
  return { opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(24px) scale(0.985)', transition: 'opacity 0.75s var(--ease), transform 0.9s var(--ease)' };
}

/* ── SCENE 1 — DEMAND FLOOD ─────────────────────────────────────────────── */
const DEMAND = [
  { l: 'Margin pressure',         x: 15, y: 19 },
  { l: 'Revenue leakage',         x: 45, y: 10 },
  { l: 'Customer churn',          x: 75, y: 13 },
  { l: 'Slow delivery',           x: 91, y: 35 },
  { l: 'Manual work',             x: 90, y: 66 },
  { l: 'Risk exposure',           x: 72, y: 88 },
  { l: 'Untrusted KPIs',          x: 43, y: 91 },
  { l: 'AI pilots without return',x: 15, y: 87 },
  { l: 'High cost to serve',      x: 7,  y: 62 },
  { l: 'Fragmented processes',    x: 8,  y: 37 },
];
function Scene1({ active, t }) {
  const tt = active ? t : 0;
  return (
    <div className="vos-scene" style={useEnter()}>
      <div className="vos-msg">
        <div className="vos-kicker">Chapter 01 · Demand</div>
        <h3 className="vos-headline">Demand is everywhere. Value is not.</h3>
        <div className="vos-subline" style={reveal(active && tt >= 450, 6)}>Competing priorities, pilots, and backlogs enter Athrios before they become disconnected execution.</div>
      </div>
      <div className="vos-canvas">
        <div className="dm-field">
          <svg className="dm-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            {DEMAND.map((d, i) => {
              const draw = tt >= 250 + i * 130;
              // lines retract toward the core as convergence completes
              const cstart = 2700 + i * 95;
              const raw = Math.max(0, Math.min(1, (tt - cstart) / 1500));
              const p = raw * raw * (3 - 2 * raw);
              const sx = d.x + (50 - d.x) * p, sy = d.y + (50 - d.y) * p;
              return <path key={i} d={`M ${sx} ${sy} L 50 50`} pathLength="1"
                style={{ strokeDasharray: 1, strokeDashoffset: draw ? 0 : 1, transition: 'stroke-dashoffset 0.7s var(--ease)', opacity: draw ? 0.3 * (1 - p * 0.6) : 0 }} />;
            })}
          </svg>
          {DEMAND.map((d, i) => {
            const appear = 200 + i * 130;
            const on = tt >= appear;
            // each signal streams fully into the core, staggered
            const cstart = 2700 + i * 95;
            const raw = Math.max(0, Math.min(1, (tt - cstart) / 1500));
            const p = raw * raw * (3 - 2 * raw);           // smoothstep
            const cx = d.x + (50 - d.x) * p;
            const cy = d.y + (50 - d.y) * p;
            const fade = !on ? 0 : (p < 0.72 ? 1 : Math.max(0, 1 - (p - 0.72) / 0.28));
            const sc = on ? (1 - p * 0.5) : 0.9;
            return (
              <div key={i} className={'dm-chip' + (on && p < 0.04 ? ' dm-float' : '')}
                style={{ left: cx + '%', top: cy + '%', opacity: fade,
                  transform: `translate(-50%,-50%) scale(${sc})`,
                  transition: 'opacity 0.35s var(--ease), transform 0.35s var(--ease)',
                  animationDelay: (i * 0.4) + 's' }}>
                <span className="cd" />{d.l}
              </div>
            );
          })}
          <div className="dm-node" style={{ opacity: active ? 1 : 0, transform: `translate(-50%,-50%) scale(${1 + Math.max(0, Math.min(1, (tt - 3400) / 1200)) * 0.08})`, transition: 'opacity 0.6s var(--ease), transform 0.5s var(--ease)' }}>
            <span className="dm-emit" style={{ opacity: tt >= 4100 ? 1 : 0 }} key={tt >= 4100 ? 'emit' : 'idle'} />
            <ApexMark s={30} />
            <span className="nl">Athrios</span>
            <span className="ns">Value OS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SCENE 2 — VALUE RANKING ────────────────────────────────────────────── */
const OPPS = [
  { n: '01', name: 'Margin control',     desc: 'Protect commercial margin',   val: '$24.0M', sample: true, pri: 'P1', top: true },
  { n: '02', name: 'Revenue assurance',  desc: 'Stop revenue leakage',         val: 'High impact',  pri: 'P2' },
  { n: '03', name: 'Customer retention', desc: 'Reduce churn exposure',        val: 'Strategic',    pri: 'P3' },
  { n: '04', name: 'Cost-to-serve',      desc: 'Fast operational savings',     val: 'Fast savings', pri: 'P4' },
  { n: '05', name: 'Risk monitoring',    desc: 'Continuous risk signal',       val: 'Critical',     pri: 'P5' },
];
const CRIT = [
  { l: 'Impact', s: 'Very high', w: 94 }, { l: 'Ownership', s: 'Clear', w: 88 }, { l: 'Maturity fit', s: 'Strong', w: 82 },
  { l: 'Time to value', s: 'Fast', w: 78 }, { l: 'Feasibility', s: 'High', w: 90 },
];
function Scene2({ active, t }) {
  const tt = active ? t : 0;
  const lift = tt >= 3900;
  return (
    <div className="vos-scene" style={useEnter()}>
      <div className="vos-msg">
        <div className="vos-kicker">Chapter 02 · Ranking</div>
        <h3 className="vos-headline">Athrios ranks demand by value and execution reality.</h3>
      </div>
      <div className="vos-canvas">
        <div className="rk-grid">
          <div className="rk-list">
            {OPPS.map((o, i) => {
              const on = tt >= 250 + i * 320;
              const cls = 'rk-row vr' + (o.top ? ' top' : '') + (o.top && lift ? ' lift' : '') + (!o.top && lift ? ' dim' : '');
              const rowStyle = o.top
                ? { opacity: on ? 1 : 0, transform: lift ? 'translateY(-8px) scale(1.03)' : (on ? 'none' : 'translateY(12px)') }
                : reveal(on, 12);
              return (
                <div key={i} className={cls} style={rowStyle}>
                  <span className="rk-num">{o.n}</span>
                  <div className="rk-mid">
                    <div className="rk-name">{o.name}</div>
                    <div className="rk-desc">{o.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="rk-val">{o.val}</div>
                    {o.sample && <div className="rk-sample">Sample value at stake</div>}
                  </div>
                  <span className="rk-pri">{o.pri}</span>
                </div>
              );
            })}
          </div>
          <div className="rk-crit vr" style={reveal(tt >= 900, 12)}>
            <h4>Value &amp; execution criteria</h4>
            {CRIT.map((c, i) => (
              <div className="ci" key={i}>
                <div className="cl"><span>{c.l}</span><em>{c.s}</em></div>
                <div className="cbar"><i style={{ width: (tt >= 1100 + i * 160 ? c.w : 0) + '%' }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SCENE 3 — EXPERT-GOVERNED RECIPE ───────────────────────────────────── */
const MODULES = ['Value case', 'Maturity fit', 'Metric model', 'Capability blueprint', 'Adoption path', 'Impact loop'];
const EXPERTS = [
  { r: 'Commercial Lead', i: 'CL' }, { r: 'Finance Owner', i: 'FO' }, { r: 'Data Architect', i: 'DA' },
  { r: 'Platform Owner', i: 'PO' }, { r: 'Governance Lead', i: 'GL' },
];
const GATES = ['Value case approved', 'Metric model validated', 'Architecture fit checked', 'Adoption path confirmed', 'Production evidence mapped'];
function Scene3({ active, t }) {
  const tt = active ? t : 0;
  return (
    <div className="vos-scene" style={useEnter()}>
      <div className="vos-msg">
        <div className="vos-kicker">Chapter 03 · Recipe</div>
        <h3 className="vos-headline">A governed value recipe is assembled.</h3>
      </div>
      <div className="vos-canvas">
        <div className="rc-wrap">
          <div className="rc-selected vr" style={{ opacity: tt >= 200 ? 1 : 0, transform: tt >= 200 ? 'none' : 'translateY(-20px) scale(1.025)', transition: 'opacity 0.6s var(--ease), transform 0.8s var(--ease)' }}>
            <span className="ri"><IcTarget /></span>
            <div>
              <div className="rn">Margin control</div>
              <div className="ro">Business outcome — protect commercial margin</div>
            </div>
            <span className="rtag">Selected opportunity</span>
          </div>
          <div className="rc-cols">
            <div className="rc-col mods">
              <h4><span className="hd" />Recipe modules</h4>
              {MODULES.map((m, i) => (
                <div key={i} className="rc-item vr" style={reveal(tt >= 700 + i * 200, 8)}>
                  <span className="di blue" />{m}
                </div>
              ))}
            </div>
            <div className="rc-col exps">
              <h4><span className="hd" />Domain experts</h4>
              {EXPERTS.map((e, i) => (
                <div key={i} className="rc-item expert vr" style={reveal(tt >= 1000 + i * 200, 8)}>
                  <span className="rgi">{e.i}</span>{e.r}
                </div>
              ))}
            </div>
            <div className="rc-col gates">
              <h4><span className="hd" />Quality gates</h4>
              {GATES.map((g, i) => {
                const shown = tt >= 1400 + i * 200;
                const passed = tt >= 3000 + i * 560;
                return (
                  <div key={i} className={'rc-item vr' + (passed ? ' passed' : '')} style={reveal(shown, 8)}>
                    <span className="di" style={{ background: passed ? 'var(--fn-green)' : 'var(--text-faint)', transition: 'background 0.4s' }} />
                    {g}
                    <span className="ck">{passed ? <IcCheck /> : null}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SCENE 4 — IMPACT PROOF (the wow) ───────────────────────────────────── */
const TILES = [
  { l: 'Time to value', v: 'Accelerated', s: [4, 6, 5, 8, 11, 14, 16] },
  { l: 'Rework',        v: 'Reduced',     s: [16, 13, 14, 9, 8, 5, 4] },
  { l: 'KPI trust',     v: 'Increased',   s: [6, 7, 9, 10, 13, 15, 17] },
  { l: 'Adoption',      v: 'Active',      s: [3, 5, 7, 9, 12, 14, 16] },
  { l: 'Revenue',       v: 'Protected',   s: [9, 10, 10, 11, 12, 13, 15] },
  { l: 'Margin visibility', v: 'Improved',s: [5, 6, 8, 9, 11, 13, 16] },
];
function Scene4({ active, t }) {
  const tt = active ? t : 0;
  const down = (l) => l === 'Rework';
  return (
    <div className="vos-scene" style={useEnter()}>
      <div className="vos-msg">
        <div className="vos-kicker" style={{ color: 'var(--fn-green)' }}>Chapter 04 · Impact</div>
        <h3 className="vos-headline" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>Value proven in production.</h3>
      </div>
      <div className="vos-canvas">
        <div className="ip-wrap">
          <div className="ip-live vr" style={reveal(tt >= 150, 8)}>
            <span className="ip-livepill"><span className="d" />Production capability live</span>
            <div className="ip-capname-big"><span className="ic"><IcGauge /></span>Commercial Performance Command Center</div>
            <div className="ip-users">Used by Commercial Leadership · Finance · Sales Operations</div>
          </div>
          <div className="ip-proof-label vr" style={reveal(tt >= 420, 6)}><span className="bar" />Impact proof</div>
          <div className="ip-grid">
            {TILES.map((tile, i) => {
              const on = tt >= 700 + i * 360;
              return (
                <div key={i} className="ip-tile vr" style={reveal(on, 14)}>
                  <span className="proven" style={{ opacity: on ? 1 : 0, transition: 'opacity 0.5s var(--ease)' }}><IcCheck /></span>
                  <div className="tl">{tile.l}</div>
                  <div className="tv">
                    <span className="ar" style={{ transform: down(tile.l) ? 'scaleY(-1)' : 'none' }}><IcUp /></span>
                    {tile.v}
                  </div>
                  <div className="ip-spark">
                    <Spark points={tile.s} on={on} color={down(tile.l) ? 'var(--fn-teal)' : 'var(--fn-green)'} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ip-out vr" style={reveal(tt >= 3900, 8)}>
            <span>Usable.</span><span className="dot" /><span>Measured.</span><span className="dot" /><span>Monetizable.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Scene1, Scene2, Scene3, Scene4, ApexMark });
