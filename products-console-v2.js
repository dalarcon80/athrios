/* Products console — selector + active product lifecycle console.
   Input → Athrios Value OS core (active layer) → 8 canonical lifecycle areas
   assembling in sequence on a connected rail → value output → CTA.
   Restarts on tab change and on scene re-entry / scroll. */
(function(){
  const root = document.getElementById('pc2');
  if (!root) return;

  const XAVIO_MK = '<svg viewBox="0 0 96 96" fill="none"><g stroke="#F4F1EA" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"><path d="M20 22 L46 48"></path><path d="M20 74 L46 48"></path></g><path d="M44 28 L80 48 L44 68 Z" fill="#FF4A2E"></path></svg>';
  const XAVIO_MK_GREEN = '<svg viewBox="0 0 96 96" fill="none"><g stroke="#F4F1EA" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"><path d="M20 22 L46 48"></path><path d="M20 74 L46 48"></path></g><path d="M44 28 L80 48 L44 68 Z" fill="#10B981"></path></svg>';
  const APEX_MK = '<svg viewBox="0 0 96 96" fill="none"><g stroke="#F4F1EA" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"><path d="M22 86 L48 60 L74 86"></path></g><path d="M48 12 L76 56 L20 56 Z" fill="#FF4A2E"></path></svg>';

  const DATA = {
    data: {
      mark: XAVIO_MK,
      name: 'Xavio Data & AI <span class="by">by Athrios</span>',
      sub: 'Data & AI Value Execution System',
      shortCopy: 'Aligns demand, maturity, governance and delivery into measurable Data & AI value.',
      layer: 'Xavio Data & AI layer',
      copy: 'Industrializes the full Data & AI value lifecycle — aligning business demand, data maturity, governance, delivery and measurement into trusted products, models in production and measurable business impact.',
      input: 'Margin visibility',
      needs: ['Revenue leakage','Customer churn','Untrusted KPIs','Data monetization','AI pilots without return'],
      areas: ['Business Intake','Data Governance<br>& Strategy','Data Architecture<br>& Design','Data Modeling','Data Engineering','Data Quality'],
      transversal: ['CI/CD','Observability & FinOps','Adoption & Value Measurement'],
      outLabel: 'Data & AI value out',
      out: ['Trusted data product','Reliable metric','Model in production','Measured impact','Reusable value pattern','Monetization path'],
      cta: '<a class="btn btn-primary" href="xavio.html">Explore Xavio →</a>'
    },
    app: {
      mark: XAVIO_MK_GREEN,
      name: 'Xavio Applications <span class="by">by Athrios</span>',
      sub: 'Application Value Execution System',
      shortCopy: 'Aligns product demand, architecture, engineering and adoption into measurable application value.',
      layer: 'Xavio Applications layer',
      copy: 'Industrializes the full application value lifecycle — aligning product demand, architecture, engineering, release, adoption and measurement into usable software capabilities, business workflows and measurable impact.',
      input: 'Customer onboarding',
      needs: ['Digital sales flow','Claims workflow','Partner self-service','Field operations','Manual process automation'],
      areas: ['Business Intake','Design & UX','Application Architecture<br>& Platform','Code Development','Quality Engineering'],
      transversal: ['CI/CD','Observability & FinOps','Adoption & Value Measurement'],
      outLabel: 'Application value out',
      out: ['Usable capability','Production workflow','Business adoption','Measured impact','Reusable value pattern','Monetization path'],
      cta: '<a class="btn btn-primary" href="#contact">Request a briefing →</a>'
    }
  };
  const CHK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  const el = (s) => root.querySelector(s);
  let timers = [];
  const clear = () => { timers.forEach(t => clearTimeout(t)); timers = []; };

  function render(key){
    const d = DATA[key];
    root.setAttribute('data-active', key);
    el('.pc2-mk').innerHTML = d.mark;
    el('.pc2-name').innerHTML = d.name;
    el('.pc2-sub').textContent = d.sub;
    el('.pc2-copy').textContent = d.copy;
    el('.pc2-in-v').textContent = d.input;
    el('.pc2-in .il').textContent = 'Value priority';
    el('.pc2-copy').textContent = d.shortCopy || d.copy;
    el('.pc2-needs').innerHTML = (d.needs||[]).map(n=>`<span class="pc2-need">${n}</span>`).join('');
    el('.pc2-layer-t').textContent = d.layer;
    el('.pc2-nodes').innerHTML = d.areas.map((a,i)=>{
      const ang = (-90 + i*(360/d.areas.length)) * Math.PI/180, R = 34;
      const x = 50 + R*Math.cos(ang), y = 50 + R*Math.sin(ang);
      return `<div class="pc2-area" data-i="${i}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%"><span class="an">${('0'+(i+1)).slice(-2)}</span><span class="at">${a}</span></div>`;
    }).join('');
    // node sequence is shown by numbering + sequential activation (no orbit/arc)
    el('.pc2-trace').innerHTML = '';
    el('.pc2-out .ol').textContent = d.outLabel;
    el('.pc2-trans').innerHTML = '<span class="pt-label">Transversal layers</span>' + (d.transversal||[]).map(t=>`<span class="pt-band">${t}</span>`).join('');
    el('.pc2-out .oi').innerHTML = d.out.map(o=>`<span class="op">${CHK}${o}</span>`).join('');
    el('.pc2-cta').innerHTML = d.cta;
    root.querySelectorAll('.pc2-tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-k') === key));
  }

  function play(){
    clear();
    const out = el('.pc2-out'), cta = el('.pc2-cta');
    const inChip = el('.pc2-in'), core = el('.pc2-core'), demand = el('.pc2-demand');
    const areas = [...root.querySelectorAll('.pc2-area')];
    [inChip, core, out, cta, demand].forEach(n => n && n.classList.remove('on'));
    areas.forEach(a => a.classList.remove('in','lit','done'));
    // 1 need stack → 2 active need → 3 core → 4 lifecycle → 5 output → 6 cta
    timers.push(setTimeout(()=> demand.classList.add('on'), 150));
    timers.push(setTimeout(()=> inChip.classList.add('on'), 500));
    timers.push(setTimeout(()=> core.classList.add('on'), 950));
    const start = 1450, step = 340;
    const segs = [...root.querySelectorAll('.pc2-seg')];
    segs.forEach(s => s.classList.remove('on'));
    areas.forEach((a,i)=>{
      timers.push(setTimeout(()=>{
        a.classList.add('in','lit');
        const prev = areas[i-1]; if (prev){ prev.classList.remove('lit'); prev.classList.add('done'); }
        if (i > 0 && segs[i-1]) segs[i-1].classList.add('on');
      }, start + i*step));
    });
    const last = start + areas.length*step;
    timers.push(setTimeout(()=>{ const l=areas[areas.length-1]; l.classList.remove('lit'); l.classList.add('done'); }, last));
    timers.push(setTimeout(()=> out.classList.add('on'), last + 250));
    timers.push(setTimeout(()=> cta.classList.add('on'), last + 600));
  }

  let current = 'data';
  function select(key, replay){ if (key !== current || replay){ current = key; render(key); play(); } }
  root.querySelectorAll('.pc2-tab').forEach(t => t.addEventListener('click', () => select(t.getAttribute('data-k'), true)));
  render('data');

  const sec = document.getElementById('products');
  if (sec && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    let was = false;
    const io = new IntersectionObserver((es)=>{
      es.forEach(e=>{ const live = e.intersectionRatio >= 0.35; if (live && !was) play(); was = live; });
    }, { threshold:[0,0.35] });
    io.observe(sec);
  } else { play(); }
  window.__pc2play = play;
})();
