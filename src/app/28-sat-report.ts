// @ts-nocheck
// Phase-2 slice: lines 25161-25360 of original src/app.ts

// ═══════ SAT SCORE REPORT ═══════

const SAT_REPORT = {
  testDate:'March 2025',
  total:1120, rw:620, math:500,
  scoreRange:{total:[1080,1160], rw:[590,650], math:[470,530]},
  // From SAT_PERCENTILE_TABLES (College Board User Percentile Ranks 2024).
  // Re-derive via satPercentile('total'|'rw'|'math', score).
  percentile:{total:62, rw:79, math:41},
  allTesterAvg:{total:1100, rw:560, math:540},
  benchmarks:{rw:480,math:530},
  bands:{ rw:'550–600', math:'470–540' },
  domains:{
    rw:[
      {name:'Information and Ideas',mastery:85,band:6,bandLabel:'610–670',qCount:'12–14',pctOfSection:26},
      {name:'Craft and Structure',mastery:70,band:5,bandLabel:'550–600',qCount:'13–15',pctOfSection:28},
      {name:'Expression of Ideas',mastery:62,band:4,bandLabel:'490–540',qCount:'8–12',pctOfSection:20},
      {name:'Standard English Conventions',mastery:78,band:5,bandLabel:'550–600',qCount:'11–15',pctOfSection:26},
    ],
    math:[
      {name:'Algebra',mastery:55,band:4,bandLabel:'470–540',qCount:'13–15',pctOfSection:35},
      {name:'Advanced Math',mastery:48,band:3,bandLabel:'420–460',qCount:'13–15',pctOfSection:35},
      {name:'Problem-Solving & Data Analysis',mastery:60,band:4,bandLabel:'470–540',qCount:'5–7',pctOfSection:15},
      {name:'Geometry & Trigonometry',mastery:42,band:3,bandLabel:'420–460',qCount:'5–7',pctOfSection:15},
    ]
  },
};

const SAT_BAND_LABELS=['','200–360','370–410','420–480','490–540','550–600','610–670','680–800'];
const SAT_BAND_COLORS=['','#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#16a34a'];

function renderSatReport(){
  const session = getReportState('sat');
  if (reportEdgePreview?.type === 'sat' && reportEdgePreview.state !== 'released') {
    document.getElementById('satReportBody').innerHTML = renderReportGate('sat');
    return;
  }
  _mergeSatScores();
  const d=SAT_REPORT, c=document.getElementById('satReportBody');
  const sessionMeta = getReportState('sat');
  let h=`<div class="session-card" style="margin-bottom:16px">
    <h3 style="margin-bottom:8px">Score explanation sources</h3>
    <p style="font-size:13px;color:#52525b;line-height:1.6;margin-bottom:10px">Adaptive routing, scoring, and AI insights are generated from scoring keys, tagged skills, module response patterns, and teacher overrides. Student-facing report cards refresh on the next report release after grading changes.</p>
    <div class="source-list">${sessionMeta.explanationSources.map(src => `<span class="source-chip">${src}</span>`).join('')}</div>
  </div>`;

  // — 1. Score Hero (SAT style)
  h+=`<div class="score-hero" style="flex-direction:column;gap:0">
    <div style="display:flex;align-items:center;gap:32px;padding-bottom:18px;border-bottom:1px solid #f4f4f5">
      <div class="composite-ring" style="border-color:#2563eb;width:136px;height:136px;box-shadow:0 0 0 6px rgba(37,99,235,.08)">
        <span class="big" style="color:#2563eb;font-size:40px">${d.total}</span>
        <span class="lbl">TOTAL</span>
        <span style="font-size:9px;color:#a1a1aa">400–1600</span>
      </div>
      <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:14px">`;
  const satSecColors={rw:'#7c3aed',math:'#2563eb'};
  [{k:'rw',label:'Reading & Writing',max:800},{k:'math',label:'Math',max:800}].forEach(s=>{
    const v=d[s.k], met=v>=d.benchmarks[s.k], sr=d.scoreRange[s.k], pctile=d.percentile[s.k], avg=d.allTesterAvg[s.k];
    const col=satSecColors[s.k];
    h+=`<div style="text-align:left;padding:16px 18px;border-radius:14px;background:#fafafa;border:1px solid #f0f0f0">
      <div style="display:flex;align-items:baseline;gap:6px">
        <span style="font-size:34px;font-weight:800;color:${col};line-height:1">${v}</span>
        <span style="font-size:11px;color:#a1a1aa;font-weight:500">/ ${s.max}</span>
      </div>
      <div style="font-size:12px;font-weight:600;color:#52525b;margin-top:2px">${s.label}</div>
      <div style="font-size:10px;color:#a1a1aa;margin-top:8px">Range: ${sr[0]}–${sr[1]} · Avg: ${avg}</div>
      <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
        <span style="font-size:9px;font-weight:700;background:${met?'#dcfce7':'#fef2f2'};color:${met?'#16a34a':'#ef4444'};padding:2px 8px;border-radius:9999px">${met?'✓ Met':'✗ Below'} BM ${d.benchmarks[s.k]}</span>
        <span style="font-size:9px;font-weight:700;background:#eff6ff;color:#2563eb;padding:2px 8px;border-radius:9999px">${pctile}th %ile</span>
      </div>
    </div>`;
  });
  h+=`</div></div>`;
  h+=`<div style="display:flex;align-items:center;gap:16px;padding-top:14px;font-size:11px;color:#71717a">
    <span>Total Percentile: <b style="color:#2563eb">${d.percentile.total}th</b></span>
    <span style="color:#e4e4e7">|</span>
    <span>All Tester Avg: <b>${d.allTesterAvg.total}</b></span>
  </div>`;
  h+=`</div>`;

  // — 2. Knowledge & Skills (SAT-specific: mastery bars + performance bands)
  const secMeta={rw:{icon:'📖',label:'Reading & Writing',color:'#7c3aed'},math:{icon:'📐',label:'Math',color:'#2563eb'}};
  ['rw','math'].forEach(sec=>{
    const doms=d.domains[sec], m=secMeta[sec], secScore=d[sec];
    h+=`<div class="domain-section">
      <h3>${m.icon} ${m.label} <span class="section-score-pill" style="background:${m.color}10;color:${m.color}">Score: ${secScore} / 800</span></h3>
      <div class="subtitle">Knowledge & Skills — Performance Score Bands (1–7)</div>`;
    doms.forEach(dm=>{
      const barW=Math.round(dm.mastery);
      const bCol=SAT_BAND_COLORS[dm.band]||'#71717a';
      h+=`<div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-size:12px;font-weight:600;color:#27272a">${dm.name}</span>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:9px;color:#a1a1aa">${dm.qCount} Q · ${dm.pctOfSection}% of section</span>
            <span style="font-size:9px;font-weight:700;color:${bCol};background:${bCol}18;padding:2px 8px;border-radius:9999px">Band ${dm.band}: ${dm.bandLabel}</span>
          </div>
        </div>
        <div style="display:flex;gap:2px;height:16px">`;
      for(let i=1;i<=7;i++){
        const active=i<=dm.band;
        h+=`<div style="flex:1;border-radius:${i===1?'4px 0 0 4px':i===7?'0 4px 4px 0':'0'};background:${active?bCol+'cc':'#f4f4f5'};transition:.4s" title="Band ${i}: ${SAT_BAND_LABELS[i]}"></div>`;
      }
      h+=`</div>
        <div style="display:flex;justify-content:space-between;margin-top:2px">
          <span style="font-size:8px;color:#a1a1aa">200</span>
          <span style="font-size:8px;color:#a1a1aa">800</span>
        </div>
      </div>`;
    });
    h+=`</div>`;
  });

  // — 3. Percentile Rankings
  h+=`<div class="rank-section"><h3>📊 All Tester Percentile Rankings</h3>
    <div class="subtitle" style="margin-bottom:12px;font-size:11px;color:#71717a">Compared to all 12th-grade SAT takers from the past 3 years</div>`;
  [{k:'total',label:'Total'},{k:'rw',label:'Reading & Writing'},{k:'math',label:'Math'}].forEach(r=>{
    h+=`<div class="rank-row"><span class="rank-label">${r.label}</span>
      <div class="rank-bar"><div class="rank-fill" style="width:${d.percentile[r.k]}%;background:linear-gradient(90deg,#93c5fd,#2563eb)"></div></div>
      <span class="rank-pct" style="color:#2563eb">${d.percentile[r.k]}%</span></div>`;
  });
  h+=`</div>`;

  // — 4. Benchmarks
  h+=`<div class="rank-section"><h3>📌 College & Career Readiness Benchmarks</h3>
    <div class="subtitle" style="font-size:11px;color:#71717a;margin-bottom:12px">75% chance of earning C or better in related first-semester college courses</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">`;
  [{k:'rw',label:'Reading & Writing',bm:480},{k:'math',label:'Math',bm:530}].forEach(s=>{
    const v=d[s.k], met=v>=s.bm, diff=v-s.bm;
    h+=`<div style="padding:16px;border-radius:12px;border:2px solid ${met?'#dcfce7':'#fef2f2'};background:${met?'#f0fdf420':'#fef2f220'}">
      <div style="font-size:12px;font-weight:700;color:#27272a">${s.label}</div>
      <div style="display:flex;align-items:baseline;gap:8px;margin-top:8px">
        <span style="font-size:28px;font-weight:800;color:${met?'#16a34a':'#ef4444'}">${v}</span>
        <span style="font-size:12px;color:#71717a">BM: ${s.bm}</span>
      </div>
      <div style="font-size:11px;font-weight:600;color:${met?'#16a34a':'#ef4444'};margin-top:4px">${met?`✓ Met (+${diff} above)`:`✗ ${Math.abs(diff)} below benchmark`}</div>
      <div style="margin-top:8px;height:6px;background:#f4f4f5;border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${Math.min(100,Math.round(v/s.bm*100))}%;background:${met?'#16a34a':'#ef4444'};border-radius:3px"></div>
      </div>
    </div>`;
  });
  h+=`</div></div>`;

  // — 5. Priority Focus Areas (UWorld/ScoreSmart-style: big slice + short bar)
  h+=`<div class="domain-section" style="margin-bottom:40px"><h3>🎯 Priority Focus Areas</h3>
    <div class="subtitle">Domains with highest impact potential — "big slice + short bar" = top priority</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px">`;
  const allDoms=[...d.domains.rw.map(x=>({...x,sec:'R&W'})),...d.domains.math.map(x=>({...x,sec:'Math'}))];
  allDoms.forEach(dm=>dm.impact=dm.pctOfSection*(100-dm.mastery)/100);
  allDoms.sort((a,b)=>b.impact-a.impact);
  allDoms.forEach((dm,i)=>{
    const priority=i<2?'High':i<4?'Medium':'Low';
    const priColor=i<2?'#ef4444':i<4?'#f59e0b':'#71717a';
    const bCol=SAT_BAND_COLORS[dm.band];
    h+=`<div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:10px;padding:14px;${i<2?'border-left:3px solid '+priColor:''}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:12px;font-weight:600;color:#27272a">${dm.name}</span>
        <span style="font-size:9px;font-weight:700;color:${priColor};background:${priColor}15;padding:2px 8px;border-radius:9999px">${priority} Priority</span>
      </div>
      <div style="font-size:10px;color:#71717a">${dm.sec} · ${dm.pctOfSection}% of section · ${dm.qCount} questions</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:6px">
        <div style="flex:1;height:8px;background:#f4f4f5;border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${dm.mastery}%;background:${bCol};border-radius:4px"></div>
        </div>
        <span style="font-size:10px;font-weight:700;color:${bCol}">Band ${dm.band}</span>
      </div>
      <div style="font-size:10px;color:#52525b;margin-top:6px">${i<2?'Focus here for maximum score impact. Drill practice problems in this domain.':'Continue practicing to maintain and improve.'}</div>
    </div>`;
  });
  h+=`</div></div>`;

  // — 6. Question Review (Tier 2 / Tier 3)
  const satSections = [
    {key:'rw',icon:'📖',label:'Reading & Writing'},
    {key:'math',icon:'📐',label:'Math'},
  ];
  h+=`<div class="domain-section" style="margin-bottom:40px"><h3>📋 Question Review</h3>
    <div class="subtitle">Click any question to see the full explanation — includes Grid-in solution steps and common mistakes</div>`;
  satSections.forEach(sec=>{
    const qs = SAT_QUESTIONS[sec.key] || [];
    const wrongCount = qs.filter(q => q.type === 'GRID_IN' ? !(q.correctAnswers||[]).includes(q.student) : q.student !== q.correct).length;
    h+=`<div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none';this.querySelector('.chevron').textContent=this.nextElementSibling.style.display==='none'?'▶':'▼'">
        <span style="font-size:14px">${sec.icon}</span>
        <span style="font-size:13px;font-weight:700;color:#190d40">${sec.label}</span>
        <span style="font-size:11px;color:#71717a">${qs.length} sample questions</span>
        ${wrongCount>0?`<span style="font-size:10px;font-weight:700;color:#ef4444;background:#fef2f2;padding:2px 8px;border-radius:9999px">${wrongCount} wrong</span>`:'<span style="font-size:10px;font-weight:700;color:#16a34a;background:#f0fdf4;padding:2px 8px;border-radius:9999px">All correct</span>'}
        <span class="chevron" style="font-size:10px;color:#a1a1aa">▼</span>
      </div>
      <div>
        ${renderReportQuestionMap('sat',sec.key)}
      </div>
    </div>`;
  });
  h+=`</div>`;

  c.innerHTML=h;
  renderStudentInfoBar('satStudentInfo','SAT',d.testDate);
}

