// @ts-nocheck
// Phase-2 slice: lines 11400-13415 of original src/app.ts

// ─── ACT-specific mock data set for Monitor Overview KPIs + Analytics ───
// 18 students with full 5-section scores. Distribution is intentionally
// realistic for a college-prep cohort: ~50 % at/above the 22 composite
// benchmark, ~28 % near (18-21), ~22 % below. Each row also lists the
// reporting categories the student lost the most points in — used by the
// Standard Heatmap and Action Center suggestions.
const ACT_BENCHMARKS = { english:18, math:22, reading:22, science:23, composite:22 };
const ACT_REPORTING_CATEGORIES = {
  english: [
    { code:'POW', name:'Production of Writing' },
    { code:'KLA', name:'Knowledge of Language' },
    { code:'CSE', name:'Conventions of Standard English' }
  ],
  math: [
    { code:'PHM', name:'Preparing for Higher Math' },
    { code:'IES', name:'Integrating Essential Skills' },
    { code:'MOD', name:'Modeling' }
  ],
  reading: [
    { code:'KID', name:'Key Ideas & Details' },
    { code:'CAS', name:'Craft & Structure' },
    { code:'IKI', name:'Integration of Knowledge' }
  ],
  science: [
    { code:'IOD', name:'Interpretation of Data' },
    { code:'SIN', name:'Scientific Investigation' },
    { code:'EMI', name:'Evaluation of Models' }
  ]
};
// Each entry: name + grade + per-section raw composite score (1-36 scale,
// null = not yet attempted), writing 2-12 (null = not graded / opted out),
// status, and the standards they lost the most points on.
const ACT_V2_STUDENTS = [
  { name:'Avery Parker',  grade:'11', eng:null, math:null, read:null, sci:null, writing:null, status:'auto-submit',  weakStandards:[] },
  { name:'Mia Collins',   grade:'11', eng:26,   math:22,   read:25,   sci:21,   writing:8,    status:'graded',       weakStandards:['IOD','SIN'] },
  { name:'Noah Patel',    grade:'11', eng:24,   math:21,   read:23,   sci:20,   writing:null, status:'awaiting-writing', weakStandards:['SIN','PHM'] },
  { name:'Sophia Lee',    grade:'11', eng:28,   math:18,   read:null, sci:null, writing:null, status:'in-progress',  weakStandards:[] },
  { name:'Liam Garcia',   grade:'11', eng:22,   math:24,   read:21,   sci:22,   writing:7,    status:'graded',       weakStandards:['CAS','MOD'] },
  { name:'Emma Brooks',   grade:'11', eng:30,   math:27,   read:29,   sci:26,   writing:9,    status:'graded',       weakStandards:[] },
  { name:'Lucas Chen',    grade:'11', eng:18,   math:19,   read:18,   sci:17,   writing:6,    status:'graded',       weakStandards:['POW','KID','SIN'] },
  { name:'Olivia Wright', grade:'11', eng:25,   math:20,   read:24,   sci:19,   writing:7,    status:'graded',       weakStandards:['PHM','IOD'] },
  { name:'Ethan Murphy',  grade:'11', eng:20,   math:17,   read:19,   sci:18,   writing:null, status:'awaiting-writing', weakStandards:['PHM','MOD','SIN'] },
  { name:'Ava Robinson',  grade:'11', eng:32,   math:30,   read:31,   sci:28,   writing:10,   status:'graded',       weakStandards:[] },
  { name:'Mason Hill',    grade:'11', eng:15,   math:14,   read:16,   sci:13,   writing:5,    status:'graded',       weakStandards:['POW','CSE','KID','IOD'] },
  { name:'Isabella Cox',  grade:'11', eng:23,   math:25,   read:22,   sci:24,   writing:8,    status:'graded',       weakStandards:['CAS'] },
  { name:'Logan Reed',    grade:'11', eng:19,   math:22,   read:18,   sci:20,   writing:6,    status:'graded',       weakStandards:['KID','CAS','IOD'] },
  { name:'Charlotte Bell',grade:'11', eng:27,   math:23,   read:26,   sci:22,   writing:9,    status:'graded',       weakStandards:['SIN'] },
  { name:'Jackson Cole',  grade:'11', eng:17,   math:16,   read:18,   sci:15,   writing:5,    status:'graded',       weakStandards:['POW','PHM','KID','IOD'] },
  { name:'Amelia Quinn',  grade:'11', eng:21,   math:19,   read:22,   sci:20,   writing:7,    status:'graded',       weakStandards:['MOD','SIN'] },
  { name:'Carter Diaz',   grade:'11', eng:24,   math:26,   read:23,   sci:25,   writing:8,    status:'graded',       weakStandards:['CAS'] },
  { name:'Harper Kim',    grade:'11', eng:16,   math:15,   read:17,   sci:14,   writing:null, status:'awaiting-writing', weakStandards:['POW','PHM','KID','IOD'] }
];

// Helpers (pure, no DOM) — used by both Overview KPI and Analytics.
function actComputeAnalytics() {
  const rows = ACT_V2_STUDENTS;
  const completed = rows.filter(r => r.eng != null && r.math != null && r.read != null && r.sci != null);
  const composites = completed.map(r => Math.round((r.eng + r.math + r.read + r.sci) / 4));
  const avg = composites.length ? +(composites.reduce((s, n) => s + n, 0) / composites.length).toFixed(1) : 0;
  const sectionAvgs = ['eng','math','read','sci'].map(k => {
    const scores = rows.map(r => r[k]).filter(n => n != null);
    return scores.length ? +(scores.reduce((s, n) => s + n, 0) / scores.length).toFixed(1) : 0;
  });
  const sectionBmKeys = ['english','math','reading','science'];
  const sectionMet = ['eng','math','read','sci'].map((k, i) => {
    const scores = rows.map(r => r[k]).filter(n => n != null);
    const bm = ACT_BENCHMARKS[sectionBmKeys[i]];
    const metN = scores.filter(n => n >= bm).length;
    return scores.length ? Math.round(metN / scores.length * 100) : 0;
  });
  const compositeMet = composites.filter(c => c >= ACT_BENCHMARKS.composite).length;
  const compositeMetPct = composites.length ? Math.round(compositeMet / composites.length * 100) : 0;
  const writingPending = rows.filter(r => r.status === 'awaiting-writing').length;
  return {
    rows, completed: completed.length, total: rows.length,
    composites, avg, compositeMet, compositeMetPct,
    sectionAvgs, sectionMet, writingPending
  };
}

// Aggregate weak-standard frequency across all students for the Standard
// Heatmap. Returns a list sorted by hits desc, with the canonical name
// resolved through ACT_REPORTING_CATEGORIES.
function actAggregateWeakStandards() {
  const flat = [];
  Object.entries(ACT_REPORTING_CATEGORIES).forEach(([sec, list]) => {
    list.forEach(c => flat.push({ ...c, section: sec }));
  });
  const counts = {};
  ACT_V2_STUDENTS.forEach(r => (r.weakStandards || []).forEach(code => {
    counts[code] = (counts[code] || 0) + 1;
  }));
  return flat.map(c => ({ ...c, hits: counts[c.code] || 0 }))
    .filter(c => c.hits > 0)
    .sort((a, b) => b.hits - a.hits);
}

// Performance View was previously a tabbed module (Composite distribution / Section heatmap).
// Section heatmap was removed (info redundant with the Score Dashboard cards above), so the
// _actAnalyticsView state and setActAnalyticsView() switcher are no longer needed.

// ── ACT Analytics dashboard (v3) — module-level state + data helpers ──
// _actAnSubject persists across re-renders so subject selection survives
// when the same Analytics panel is re-mounted (e.g. tab switch). The
// "see all skills" toggle similarly persists; reset to defaults when the
// teacher leaves the session detail view.
let _actAnSubject = 'composite';
let _actAnShowAllSkills = false;

// Section meta for Score Row + Distribution titles. Kept in one place so
// label / benchmark / accent colors stay in sync between the score cards
// and the distribution subject buttons.
function actAnSubjectMeta() {
  const a = actComputeAnalytics();
  return {
    composite: { avg:a.avg.toFixed(1), bm:ACT_BENCHMARKS.composite, label:'Composite', met:a.compositeMetPct },
    english:   { avg:a.sectionAvgs[0], bm:ACT_BENCHMARKS.english,   label:'English',   met:a.sectionMet[0] },
    math:      { avg:a.sectionAvgs[1], bm:ACT_BENCHMARKS.math,      label:'Math',      met:a.sectionMet[1] },
    reading:   { avg:a.sectionAvgs[2], bm:ACT_BENCHMARKS.reading,   label:'Reading',   met:a.sectionMet[2] },
    science:   { avg:a.sectionAvgs[3], bm:ACT_BENCHMARKS.science,   label:'Science',   met:a.sectionMet[3] },
  };
}

function actAnStudentSubjectScore(r, subject) {
  if (subject === 'composite') {
    if (r.eng == null || r.math == null || r.read == null || r.sci == null) return null;
    return Math.round((r.eng + r.math + r.read + r.sci) / 4);
  }
  if (subject === 'english') return r.eng;
  if (subject === 'math')    return r.math;
  if (subject === 'reading') return r.read;
  if (subject === 'science') return r.sci;
  return null;
}

// Histogram: 8 ACT-conventional buckets. First bucket is 1-8 (catch-all
// for very low scores, intentionally wider than the rest), others are
// 4-point bins (the granularity ACT itself uses on score reports).
function actAnDistribution(subject) {
  const bucketDefs = [
    { lo:1,  hi:8,  label:'1–8' },
    { lo:9,  hi:12, label:'9–12' },
    { lo:13, hi:16, label:'13–16' },
    { lo:17, hi:20, label:'17–20' },
    { lo:21, hi:24, label:'21–24' },
    { lo:25, hi:28, label:'25–28' },
    { lo:29, hi:32, label:'29–32' },
    { lo:33, hi:36, label:'33–36' },
  ];
  const buckets = bucketDefs.map(b => ({ ...b, students: [] }));
  const completed = ACT_V2_STUDENTS.filter(r => r.eng != null && r.math != null && r.read != null && r.sci != null);
  completed.forEach(r => {
    const score = actAnStudentSubjectScore(r, subject);
    if (score == null) return;
    const parts = r.name.split(/\s+/);
    const initials = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    const shortName = parts[0] + ' ' + (parts[1] ? parts[1][0] + '.' : '');
    const b = buckets.find(x => score >= x.lo && score <= x.hi);
    if (b) b.students.push({ i:initials, name:shortName, score });
  });
  buckets.forEach(b => b.students.sort((x, y) => y.score - x.score));
  const meta = actAnSubjectMeta()[subject] || actAnSubjectMeta().composite;
  const allScores = completed.map(r => actAnStudentSubjectScore(r, subject)).filter(s => s != null);
  const above = allScores.filter(s => s >= meta.bm).length;
  const below = allScores.length - above;
  return { buckets, ...meta, above, below };
}

// ── Interaction handlers (called from inline onclick) ──
function setActAnSubject(subject) {
  _actAnSubject = subject;
  document.querySelectorAll('.act-an-subj-btn').forEach(b => b.classList.toggle('active', b.dataset.subj === subject));
  document.querySelectorAll('.act-an-score-card').forEach(c => c.classList.toggle('selected', c.dataset.subj === subject));
  const root = document.getElementById('actAnDistBody');
  if (root) root.innerHTML = renderActAnDistributionBody(subject);
}

function toggleActAnSkills() {
  _actAnShowAllSkills = !_actAnShowAllSkills;
  const root = document.getElementById('actAnSkillsBody');
  if (root) root.innerHTML = renderActAnSkillsBody();
  const btn = document.getElementById('actAnSkillsToggleBtn');
  if (btn) {
    const std = actAggregateWeakStandards();
    btn.textContent = _actAnShowAllSkills ? 'Show less ↑' : `See all ${std.length} →`;
  }
}

function actAnShowTooltip(e, el) {
  const tip = document.getElementById('actAnBarTooltip');
  if (!tip) return;
  const range = el.dataset.range;
  let students = [];
  try { students = JSON.parse(el.dataset.students.replace(/&#39;/g, "'")); } catch (err) { students = []; }
  const rows = students.map(s => `<div class="row">
    <div class="ai">${s.i}</div>
    <span class="nm">${s.name}</span>
    <span class="sc">${s.score}</span>
  </div>`).join('');
  tip.innerHTML = `<div class="hd">Score ${range}</div>${rows || '<div class="hd" style="margin:0">No students</div>'}`;
  actAnMoveTooltip(e);
  tip.classList.add('visible');
}

function actAnMoveTooltip(e) {
  const tip = document.getElementById('actAnBarTooltip');
  if (!tip) return;
  const x = e.clientX + 14;
  const y = e.clientY - 10;
  const w = tip.offsetWidth || 200;
  const vw = window.innerWidth;
  tip.style.left = (x + w > vw - 10 ? e.clientX - w - 14 : x) + 'px';
  tip.style.top = y + 'px';
}

function actAnHideTooltip() {
  const tip = document.getElementById('actAnBarTooltip');
  if (tip) tip.classList.remove('visible');
}

// ─── ACT Monitor Overview KPI strip (rendered above the participants table) ──
// 4 stat tiles + a 5-section progress strip. Strictly ACT-only.
function renderActOverviewKpi(session) {
  const a = actComputeAnalytics();
  const completionPct = Math.round(a.completed / a.total * 100);
  const tiles = [
    { label:'Avg composite', val:a.avg.toFixed(1), sub:`/ 36 · BM ${ACT_BENCHMARKS.composite}`, color:a.avg >= ACT_BENCHMARKS.composite ? '#15803d' : '#b45309' },
    { label:'Composite ≥ benchmark', val:a.compositeMetPct + '%', sub:`${a.compositeMet} of ${a.completed} completed`, color:'#1d4ed8' },
    { label:'Completion', val:completionPct + '%', sub:`${a.completed}/${a.total} students done`, color:'#6b21a8' },
    { label:'Writing essays pending', val:String(a.writingPending), sub:a.writingPending ? 'Open Grading Queue ›' : 'All graded', color:a.writingPending ? '#b91c1c' : '#71717a' }
  ];
  const sections = [
    { lbl:'English', avg:a.sectionAvgs[0], met:a.sectionMet[0], bm:ACT_BENCHMARKS.english, color:'#1d4ed8' },
    { lbl:'Math',    avg:a.sectionAvgs[1], met:a.sectionMet[1], bm:ACT_BENCHMARKS.math,    color:'#16a34a' },
    { lbl:'Reading', avg:a.sectionAvgs[2], met:a.sectionMet[2], bm:ACT_BENCHMARKS.reading, color:'#a16207' },
    { lbl:'Science', avg:a.sectionAvgs[3], met:a.sectionMet[3], bm:ACT_BENCHMARKS.science, color:'#7c3aed' },
    { lbl:'Writing', avg:'—', met:'—', bm:'rubric', color:'#db2777', special:'human' }
  ];
  return `
    <div style="margin-bottom:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
      ${tiles.map(t => `<div style="background:#fff;border:1px solid #ede9fe;border-radius:12px;padding:12px 14px">
        <div style="font-size:10px;font-weight:800;letter-spacing:.4px;color:#71717a;text-transform:uppercase">${t.label}</div>
        <div style="font-size:24px;font-weight:900;color:${t.color};margin-top:4px;line-height:1">${t.val}</div>
        <div style="font-size:11px;color:#71717a;margin-top:4px">${t.sub}</div>
      </div>`).join('')}
    </div>
    <div style="margin-bottom:14px;background:#fff;border:1px solid #ede9fe;border-radius:12px;padding:12px 14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div style="font-size:12px;font-weight:800;color:#18181b">Section avg + benchmark coverage</div>
        <span style="font-size:10px;color:#71717a;font-weight:700">5 sections · Writing graded with rubric</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">
        ${sections.map(s => {
          if (s.special === 'human') {
            return `<div style="border:1px dashed #fbcfe8;background:#fff5fa;border-radius:10px;padding:10px 12px">
              <div style="font-size:11px;font-weight:800;color:${s.color}">${s.lbl}</div>
              <div style="font-size:18px;font-weight:900;color:${s.color};margin:4px 0 2px;line-height:1">🖋</div>
              <div style="font-size:10px;color:#9d174d;font-weight:700">Human-graded · 6-trait rubric</div>
            </div>`;
          }
          const pctOfMax = Math.round((s.avg / 36) * 100);
          const benchPct = Math.round((s.bm / 36) * 100);
          const meetingBench = s.avg >= s.bm;
          return `<div style="border:1px solid #f1f3f7;border-radius:10px;padding:10px 12px">
            <div style="display:flex;align-items:baseline;justify-content:space-between">
              <div style="font-size:11px;font-weight:800;color:#18181b">${s.lbl}</div>
              <div style="font-size:10px;color:${meetingBench ? '#15803d' : '#b91c1c'};font-weight:800">${meetingBench ? '✓' : '↓'} BM ${s.bm}</div>
            </div>
            <div style="font-size:18px;font-weight:900;color:${s.color};margin:2px 0 4px;line-height:1">${s.avg}<span style="font-size:11px;color:#71717a;font-weight:700"> / 36</span></div>
            <div style="position:relative;height:6px;border-radius:3px;background:#f4f4f5;margin-bottom:4px">
              <div style="height:100%;width:${pctOfMax}%;background:${s.color};border-radius:3px"></div>
              <div style="position:absolute;top:-2px;bottom:-2px;left:${benchPct}%;width:2px;background:#15803d"></div>
            </div>
            <div style="font-size:10px;color:#52525b;font-weight:700">${s.met}% met</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

// ─── ACT Analytics rendering (v3) ────────────────────────────────────────────
// 2-column dashboard layout that maps to a teacher's actual reading order:
//   Row 1: Score Row — Composite hero (purple) + 4 section cards (clickable
//          to swap the Distribution chart's subject).
//   Row 2: Alert banner — only when writing essays are pending grading.
//   Row 3 (2-col):
//     Left:  Score Distribution (subject-tabbed histogram + tooltip)
//          + Skill Gaps · Practice Recommendations (top 3, expandable to full list).
//     Right: Completion ring + top 7 students mini-list (CTA → Overview tab).
// State (_actAnSubject + _actAnShowAllSkills) lives module-level so subject
// selection and skill list expansion survive partial re-renders.
function renderActAnalytics(session, model, total) {
  const titleHtml = `<h3 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1a1d26;letter-spacing:-.2px">${model.title}</h3>`;
  return `<div class="session-card act-an-root" style="margin-bottom:16px;padding:24px;background:#fff;border-radius:16px">
    ${titleHtml}
    ${renderActAnScoreRow()}
    ${renderActAnAlertBanner()}
    <div class="act-an-two-col">
      <div class="col-left">
        ${renderActAnDistribution()}
        ${renderActAnSkills()}
      </div>
      <div class="col-right">
        ${renderActAnCompletion()}
        ${renderActAnStudents()}
      </div>
    </div>
    <div class="act-an-bar-tooltip" id="actAnBarTooltip"></div>
  </div>`;
}

// ── Row 1: Score Row (Composite hero + 4 section cards) ──
// Composite is solid Kira purple to anchor the row visually. Section cards
// stay neutral white; the BM-met % bar is colored by tier (good ≥70 / warn
// 50-69 / bad <50) so a teacher can scan section health at a glance.
// Every card is clickable: it sets _actAnSubject and re-renders the
// Distribution chart inline.
function renderActAnScoreRow() {
  const meta = actAnSubjectMeta();
  const cards = [];
  cards.push(`<div class="act-an-score-card composite ${_actAnSubject === 'composite' ? 'selected' : ''}" data-subj="composite" onclick="setActAnSubject('composite')">
    <div class="lbl">Composite</div>
    <div class="num-row"><span class="num">${meta.composite.avg}</span><span class="denom"> / 36</span></div>
    <div class="bm-row">
      <div class="bar-wrap"><div class="bar" style="width:${meta.composite.met}%"></div></div>
      <span class="bm-pct">${meta.composite.met}% met BM ${meta.composite.bm}</span>
    </div>
  </div>`);
  ['english','math','reading','science'].forEach(k => {
    const m = meta[k];
    const tier = m.met >= 70 ? 'good' : m.met >= 50 ? 'warn' : 'bad';
    const warningSuffix = tier === 'bad' ? ' <span class="warn-icon" title="Below 50% met benchmark">⚠</span>' : '';
    cards.push(`<div class="act-an-score-card subj tier-${tier} ${_actAnSubject === k ? 'selected' : ''}" data-subj="${k}" onclick="setActAnSubject('${k}')">
      <div class="lbl">${m.label}${warningSuffix}</div>
      <div class="num-row"><span class="num">${m.avg}</span><span class="denom"> / 36</span></div>
      <div class="bm-row">
        <div class="bar-wrap"><div class="bar bar-${tier}" style="width:${m.met}%"></div></div>
        <span class="bm-pct">${m.met}% met BM ${m.bm}</span>
      </div>
    </div>`);
  });
  return `<div class="act-an-score-row">${cards.join('')}</div>`;
}

// ── Row 2: Alert banner (only when writing essays are pending) ──
// Lists up to 3 student names for context so the teacher knows whose essays
// are sitting in the queue. Click anywhere → jumps to grading queue toast.
function renderActAnAlertBanner() {
  const a = actComputeAnalytics();
  if (!a.writingPending) return '';
  const pendingNames = ACT_V2_STUDENTS
    .filter(r => r.status === 'awaiting-writing')
    .map(r => {
      const parts = r.name.split(/\s+/);
      return parts[0] + ' ' + (parts[1] ? parts[1][0] + '.' : '');
    });
  const namesHtml = pendingNames.slice(0, 3).join(', ') + (pendingNames.length > 3 ? `, +${pendingNames.length - 3} more` : '');
  const essayWord = a.writingPending === 1 ? 'essay' : 'essays';
  return `<div class="act-an-alert-banner" onclick="iteToast('Open Grading Queue — ACT Writing essays','info')">
    <div class="icon">✎</div>
    <div class="text">
      <strong>${a.writingPending} writing ${essayWord} pending grading — students are waiting for feedback</strong>
      <span>${namesHtml}</span>
    </div>
    <button class="cta" onclick="event.stopPropagation();iteToast('Open Grading Queue — ACT Writing essays','info')">Open Grading Queue →</button>
  </div>`;
}

// ── Row 3 left: Distribution histogram (subject-tabbed + tooltip) ──
function renderActAnDistribution() {
  const a = actComputeAnalytics();
  return `<div class="act-an-card">
    <div class="act-an-card-header">
      <span class="act-an-card-title">Score Distribution</span>
      <span class="act-an-card-sub">${a.completed} students</span>
    </div>
    <div class="act-an-subj-tabs">
      ${['composite','english','math','reading','science'].map(k => {
        const lbl = actAnSubjectMeta()[k].label;
        return `<button class="act-an-subj-btn ${_actAnSubject === k ? 'active' : ''}" data-subj="${k}" onclick="setActAnSubject('${k}')">${lbl}</button>`;
      }).join('')}
    </div>
    <div id="actAnDistBody">${renderActAnDistributionBody(_actAnSubject)}</div>
  </div>`;
}

function renderActAnDistributionBody(subject) {
  const d = actAnDistribution(subject);
  const maxN = Math.max(...d.buckets.map(b => b.students.length), 1);
  // Bucket → BM relationship: above-BM (entire bucket above BM, green) /
  // bm-range (bucket touches BM zone, purple) / below-bm (bucket entirely
  // below BM, neutral grey).
  const barClass = (b) => {
    if (b.lo >= d.bm) return 'above-bm';
    if (b.hi >= d.bm - 3) return 'bm-range';
    return 'below-bm';
  };
  const bars = d.buckets.map(b => {
    const n = b.students.length;
    const h = n > 0 ? Math.max(8, (n / maxN) * 100) : 4;
    const cls = barClass(b);
    const isBm = b.lo <= d.bm && b.hi >= d.bm;
    const hasStu = n > 0;
    // Embed students JSON in data-attr, escape single quotes since the
    // attribute itself uses single quotes.
    const studentsAttr = hasStu
      ? `data-range="${b.label}" data-students='${JSON.stringify(b.students).replace(/'/g, '&#39;')}'`
      : '';
    const handlers = hasStu
      ? `onmouseenter="actAnShowTooltip(event,this)" onmousemove="actAnMoveTooltip(event)" onmouseleave="actAnHideTooltip()"`
      : '';
    return `<div class="bar-group">
      <span class="bar-count">${n > 0 ? n : ''}</span>
      ${isBm ? `<div class="bm-label-top">BM${d.bm}</div>` : ''}
      <div class="bar-col ${cls}" ${studentsAttr} ${handlers} style="height:${h}px;${n === 0 ? 'opacity:0.3;' : ''}"></div>
      <span class="bar-label">${b.label}</span>
    </div>`;
  }).join('');
  return `
    <div class="act-an-dist-meta">
      <span><strong>${d.above}</strong> at or above BM</span>
      <span class="sep">·</span>
      <span><strong>${d.below}</strong> below</span>
      <span class="sep">·</span>
      <span>Avg <strong>${d.avg}</strong> vs BM <strong class="bm">${d.bm}</strong></span>
    </div>
    <div class="act-an-legend">
      <div class="li"><div class="dot above-bm"></div>Above BM</div>
      <div class="li"><div class="dot bm-range"></div>At/near BM</div>
      <div class="li"><div class="dot below-bm"></div>Below BM</div>
    </div>
    <div class="act-an-dist-chart">${bars}</div>
    <div class="act-an-dist-axis"><span>1</span><span>36</span></div>
  `;
}

// ── Row 3 left (cont.): Skill Gaps · Practice Recommendations ──
function renderActAnSkills() {
  const std = actAggregateWeakStandards();
  if (!std.length) return '';
  const initLabel = _actAnShowAllSkills ? 'Show less ↑' : `See all ${std.length} →`;
  return `<div class="act-an-card">
    <div class="act-an-card-header">
      <span class="act-an-card-title">Skill Gaps · Practice Recommendations</span>
      <button class="act-an-see-all" id="actAnSkillsToggleBtn" onclick="toggleActAnSkills()">${initLabel}</button>
    </div>
    <div id="actAnSkillsBody">${renderActAnSkillsBody()}</div>
  </div>`;
}

function renderActAnSkillsBody() {
  const std = actAggregateWeakStandards();
  if (!std.length) return `<div style="padding:14px 0;color:#8892a8;font-size:13px;text-align:center">No skill gaps detected — class is on track.</div>`;
  const a = actComputeAnalytics();
  const list = _actAnShowAllSkills ? std : std.slice(0, 3);
  return list.map(s => {
    // Severity tiers (count-based): ≥6 hits = red, 4-5 = orange, <4 = yellow
    const sev = s.hits >= 6 ? { fill:'#ef4444', tag:'red' }
              : s.hits >= 4 ? { fill:'#f59e0b', tag:'orange' }
              : { fill:'#fbbf24', tag:'yellow' };
    const pct = Math.round(s.hits / a.total * 100);
    return `<div class="act-an-skill-row">
      <span class="act-an-skill-tag ${sev.tag}">${s.code}</span>
      <span class="act-an-skill-name">${s.name}</span>
      <div class="act-an-skill-bar-wrap"><div class="act-an-skill-bar" style="width:${pct}%;background:${sev.fill}"></div></div>
      <span class="act-an-skill-count"><strong>${s.hits}</strong><span>/${a.total}</span></span>
    </div>`;
  }).join('');
}

// ── Row 3 right: Completion ring ──
function renderActAnCompletion() {
  const a = actComputeAnalytics();
  const pct = a.total ? Math.round(a.completed / a.total * 100) : 0;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);
  return `<div class="act-an-card">
    <div class="act-an-card-header"><span class="act-an-card-title">Completion</span></div>
    <div class="act-an-comp-row">
      <div class="ring">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="${radius}" fill="none" stroke="#e8ebf0" stroke-width="6"/>
          <circle cx="30" cy="30" r="${radius}" fill="none" stroke="#6040ca" stroke-width="6"
            stroke-dasharray="${circumference.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
            stroke-linecap="round" transform="rotate(-90 30 30)"/>
        </svg>
        <div class="lbl"><span class="big">${pct}%</span><span class="small">done</span></div>
      </div>
      <div class="info">
        <div class="done">${a.completed} / ${a.total} students completed</div>
        <div class="sub">${a.total - a.completed} ${a.total - a.completed === 1 ? 'student' : 'students'} still in progress or not started</div>
      </div>
    </div>
  </div>`;
}

// ── Row 3 right (cont.): Top students mini-list ──
// Shows the top 7 by composite. Pending essay = student submitted but
// status is awaiting-writing → "Essay pending" badge; otherwise "Complete".
// CTA at the bottom jumps the teacher to the Overview tab to see all rows.
function renderActAnStudents() {
  const sorted = ACT_V2_STUDENTS
    .filter(r => r.eng != null && r.math != null && r.read != null && r.sci != null)
    .map(r => ({
      name: r.name,
      i: r.name.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(),
      score: Math.round((r.eng + r.math + r.read + r.sci) / 4),
      pending: r.status === 'awaiting-writing'
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 7);
  const total = ACT_V2_STUDENTS.length;
  return `<div class="act-an-card">
    <div class="act-an-card-header">
      <span class="act-an-card-title">Students</span>
      <span class="act-an-card-sub">sorted by score ↓</span>
    </div>
    <div>
      ${sorted.map(s => `<div class="act-an-student-row">
        <div class="avatar">${s.i}</div>
        <span class="name">${s.name}</span>
        <span class="score" style="color:${s.score >= ACT_BENCHMARKS.composite ? '#10b981' : '#8892a8'}">${s.score}</span>
        <span class="badge ${s.pending ? 'pending' : 'done'}">${s.pending ? 'Essay pending' : 'Complete'}</span>
      </div>`).join('')}
    </div>
    <div style="margin-top:10px;text-align:center">
      <button class="act-an-see-all" onclick="setSessionDetailTab('overview')">View all ${total} students →</button>
    </div>
  </div>`;
}

// renderActOverviewSectionScore (legacy v2 helper) was removed:
//   - The new Analytics dashboard (v3) renders its own Score Row directly via
//     renderActAnScoreRow(), which makes each card clickable to switch the
//     Distribution chart subject. Carrying the old "selectedSectionKey" branch
//     would have been dead code, so it was deleted to avoid future confusion.

function renderSessionDetail() {
  const session = getSession(currentSessionId);
  // ── TCAP: build effectiveSession that swaps in the active Subpart's
  //         status / counters / studentRows / timer / window. The parent
  //         session record is preserved (title, blueprint, etc.); only the
  //         SP-scoped fields are temporarily overlaid for Monitor rendering.
  const isTcap = session.testType === 'tcap' && Array.isArray(session.subparts) && session.subparts.length;
  let activeSp = null;
  let effective = session;
  if (isTcap) {
    activeSp = session.subparts.find(sp => sp.code === currentSubpartCode) || session.subparts[0];
    currentSubpartCode = activeSp.code;
    // Map raw SP status to legacy lifecycle vocabulary used by Monitor UI:
    const spStatusToLifecycle = (s) => {
      const lc = String(s || '').toLowerCase();
      if (lc.includes('released'))  return 'Released';
      if (lc.includes('completed') || lc.includes('graded') || lc.includes('submitted')) return 'Completed';
      if (lc.includes('paused'))    return 'Paused';
      if (lc.includes('extended'))  return 'Extended';
      if (lc.includes('in progress') || lc.includes('live')) return 'In Progress';
      if (lc.includes('scheduled')) return 'Scheduled';
      return 'Not Started';
    };
    effective = Object.assign({}, session, {
      title:`${session.title} · ${activeSp.code} ${activeSp.label}`,
      status:spStatusToLifecycle(activeSp.status),
      students:activeSp.students != null ? activeSp.students : session.students,
      ready:activeSp.ready || 0,
      inProgress:activeSp.inProgress || 0,
      submitted:activeSp.submitted || 0,
      graded:activeSp.graded || 0,
      pendingRelease:activeSp.pendingRelease || 0,
      released:activeSp.released || 0,
      window:activeSp.schedule || session.window,
      windowStatus:activeSp.status === 'Released' ? 'Released' : (activeSp.status === 'Submitted' ? 'Closed' : (activeSp.status || session.windowStatus)),
      gradingModel:activeSp.gradingModel || session.gradingModel,
      timeLimitMinutes:activeSp.timeLimitMinutes || session.timeLimitMinutes,
      calculatorPolicy:activeSp.calculatorPolicy || session.calculatorPolicy,
      studentRows:Array.isArray(activeSp.studentRows) && activeSp.studentRows.length ? activeSp.studentRows : (session.studentRows || []),
      assignmentCode:activeSp.code ? `${session.assignmentCode}-${activeSp.code}` : session.assignmentCode
    });
  }
  // Use `effective` everywhere a SP-scoped value matters; keep `session` for
  // parent-level facts that should not change when swapping SP (id, testType…).
  const view = effective;
  // Human-grading SP detection: when the active SP is a writing SP whose
  // gradingModel includes "human", we surface a special "Awaiting teacher
  // review" badge rather than the generic "Completed". This signals that
  // the SP submission itself is done but the rubric review is still owed.
  const spHumanGrading = isTcap && activeSp && (
    String(activeSp.gradingModel || '').toLowerCase().includes('human') ||
    (Array.isArray(activeSp.rules) && activeSp.rules.some(r => String(r).toLowerCase().includes('human')))
  );
  const spAwaitingReview = spHumanGrading && (view.status === 'Completed' || view.status === 'Submitted')
    && (activeSp.pendingRelease || 0) + ((activeSp.submitted || 0) - (activeSp.graded || 0)) > 0;
  if (spAwaitingReview) {
    view.status = 'Awaiting teacher review';
  }
  const statusBadgeClass = view.status === 'In Progress' ? 'in-progress'
    : view.status === 'Completed' ? 'completed'
    : view.status === 'Released' ? 'released'
    : view.status === 'Awaiting teacher review' ? 'in-progress'
    : 'upcoming';
  const lifecycle = assignmentLifecycleState(view);
  const joinEnabled = !['Completed','Ended','Released'].includes(lifecycle);
  const mode = deliveryModeLabel(session.deliveryMode);
  const isLive = mode === 'Live Mode';
  const primaryAction = monitorPrimaryAction(view);
  const primaryActionHandler = primaryAction === 'Review'
    ? `setSessionDetailTab('analytics')`
    : `alert('${primaryAction} session control is kept from the old Assessment monitor.')`;
  const endButton = ['Completed','Ended','Released'].includes(lifecycle)
    ? ''
    : `<button class="monitor-action-btn danger" onclick="openEndAssignmentModal()">End</button>`;
  const joinCode = view.assignmentCode || 'KIRA-TEST';
  const joinLink = `https://app.kira-learning.com/join/${joinCode}`;
  const monitorClosed = ['Completed','Ended','Released'].includes(lifecycle);
  // Top thin bar — mirrors production session detail page header (FE: page.tsx).
  // Holds breadcrumb-style Back + secondary actions (View All / Create New).
  document.getElementById('sessionDetailHeader').innerHTML = renderMonitorTopbar(view, session);
  // Hero card — mirrors production layout: 2-column with cover/title/insights
  // on the left and SessionTimerView (LIVE or SCHEDULED variant) on the right.
  document.getElementById('sessionDetailHero').innerHTML = renderSessionMonitorHero(view, session);
  // Legacy expanded AI insights panel is no longer toggled from the header —
  // a brief insight + jump-off CTAs live inside the hero card now. Clear the
  // wrap so the old panel doesn't render twice.
  const _aiWrap = document.getElementById('sessionAiInsightsWrap');
  if (_aiWrap) _aiWrap.innerHTML = '';
  // ── Subpart selector tab (TCAP only) ──
  // Tab dispatch — only TCAP exposes Cut Scores; non-TCAP sessions never see
  // the tab and silently fall back to Overview if the URL/state somehow lands
  // on 'cut-scores' for them.
  let tab = sessionDetailTab;
  if (tab === 'cut-scores' && !isTcap) tab = 'overview';
  if (tab !== 'analytics' && tab !== 'cut-scores') tab = 'overview';

  // ── Tab strip + inline SP picker / lock chip (TCAP only) ─────────────
  // The Subpart picker AND the "Subparts disabled while viewing cut scores"
  // lock chip both live INSIDE the tab strip, right-aligned via
  // `margin-left:auto`. Rationale:
  //   - The previous standalone SP-picker bar ate a full row above the
  //     tabs even though it carried a single control. Folding it into the
  //     tab row reclaims a row and groups SP selection with tab navigation
  //     (both pick "what content is shown below").
  //   - When the user switches to the Cut Scores tab, the picker is hidden
  //     and replaced in the same right-side slot by the lock chip — so
  //     the tab strip itself communicates "Cut Scores doesn't have a SP
  //     dimension". This also satisfies the request that the lock chip
  //     appears to the right of Cut Scores.
  // The standalone `sessionSubpartTabsWrap` slot is intentionally cleared.
  const spTabsEl = document.getElementById('sessionSubpartTabsWrap');
  if (spTabsEl) spTabsEl.innerHTML = '';

  let tabRightSlot = '';
  if (isTcap) {
    const cutMode = tab === 'cut-scores';
    const activeSp = session.subparts.find(s => s.code === currentSubpartCode) || session.subparts[0];
    const stClassFor = (sp) => {
      const lc = String(sp.status || '').toLowerCase();
      if (lc.includes('released'))                                    return 'released';
      if (lc.includes('completed') || lc.includes('graded') || lc.includes('submitted')) return 'completed';
      if (lc.includes('progress') || lc.includes('paused') || lc.includes('extended') || lc.includes('live')) return 'in-progress';
      return 'scheduled';
    };
    if (cutMode) {
      tabRightSlot = `<span class="sp-tab-locked-note tcap-tab-lock" title="Cut scores apply to the composite scale score, not per-Subpart">🔒 Subparts disabled while viewing cut scores</span>`;
    } else {
      const menuItems = session.subparts.map(sp => {
        const isActive = sp.code === currentSubpartCode;
        const stClass  = stClassFor(sp);
        return `<button class="sp-picker-item ${isActive ? 'active' : ''}" onclick="tcapSpPickerSelect('${sp.code}')">
          <span class="sp-picker-item-code">${sp.code}</span>
          <span class="sp-picker-item-name">${sp.label}</span>
          <span class="sp-tab-status ${stClass}">${sp.status}</span>
          <span class="sp-picker-item-meta">${sp.timeLimitMinutes || '—'} min · ${sp.submitted || 0}/${sp.students || 0}</span>
          ${isActive ? `<span class="sp-picker-item-check" aria-hidden="true">✓</span>` : ''}
        </button>`;
      }).join('');
      tabRightSlot = `
        <div class="sp-picker-wrap tcap-tab-picker" id="tcapSpPickerWrap">
          <button type="button" class="sp-picker-trigger" onclick="tcapSpPickerToggle(event)">
            <span class="sp-picker-trigger-label">Subpart</span>
            <span class="sp-picker-trigger-code">${activeSp.code}</span>
            <span class="sp-picker-trigger-name">${activeSp.label}</span>
            <span class="sp-tab-status ${stClassFor(activeSp)}">${activeSp.status}</span>
            <svg class="sp-picker-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="sp-picker-menu" id="tcapSpPickerMenu" role="listbox" aria-hidden="true">
            <div class="sp-picker-menu-head">All Subparts · ${session.subparts.length}</div>
            ${menuItems}
          </div>
        </div>
      `;
    }
  }
  const cutScoresTab = isTcap
    ? `<button class="session-detail-tab ${tab === 'cut-scores' ? 'active' : ''}" onclick="setSessionDetailTab('cut-scores')" title="District cut-score profile · applies to composite scale score">Cut Scores <span style="font-size:9px;opacity:.7;font-weight:600">· District</span></button>`
    : '';
  document.getElementById('sessionDetailTabs').innerHTML = `
    <button class="session-detail-tab ${tab === 'overview' ? 'active' : ''}" onclick="setSessionDetailTab('overview')">Overview</button>
    <button class="session-detail-tab ${tab === 'analytics' ? 'active' : ''}" onclick="setSessionDetailTab('analytics')">Analytics</button>
    ${cutScoresTab}
    ${tabRightSlot}
  `;
  document.getElementById('sessionOverviewPanel').classList.toggle('active', tab === 'overview');
  document.getElementById('sessionAnalyticsPanel').classList.toggle('active', tab === 'analytics');
  const cutPanel = document.getElementById('sessionCutScoresPanel');
  if (cutPanel) cutPanel.classList.toggle('active', tab === 'cut-scores');
  // When Cut Scores tab is active on a TCAP session, render the cut-score
  // editor inline using the same renderer as the standalone tcap-config page,
  // but pointed at the session-context container so the SP context is kept.
  if (isTcap && tab === 'cut-scores') {
    // Default the editor's selector to this session's grade × subject so the
    // teacher lands on "their" profile instead of the global G5 ELA default.
    if (session.grade && session.subject) {
      const subjectId = String(session.subject).toLowerCase();
      const candidate = `g${session.grade}_${subjectId}`;
      if (typeof TCAP_CUT_STATE !== 'undefined' && TCAP_CUT_STATE[candidate]) {
        tcapConfigGradeKey = candidate;
      }
    }
    renderTcapConfig('sessionCutScoresInlineBody');
  }
  // AI insights panel (legacy expanded grid) is intentionally not re-rendered
  // here — the brief insight + CTAs now live inline in the hero card. The
  // wrap remains in the DOM but stays empty unless a future feature opts in.
  document.getElementById('sessionAnalyticsWrap').innerHTML = renderSessionAnalytics(view);
  if (session.testType === 'tcap') {
    renderTcapClass('sessionAnalyticsTcapPredictionsBody', null);
  }
  // Participants Table — for ACT we render an inline 4-bar progress widget
  // for the Questions column (parsed from stu.progress text like
  // "ENG 38/50 · Math 28/45 · Reading 23/36 · Science 22/40"). For other
  // assessment types the column stays as a plain text label.
  // Standalone "Report" + "Last Activity" columns were removed in prior passes
  // (no Report column anywhere; Last Activity is implied by Status). Actions
  // shows a unified Grade / Graded button across all test types.
  const showReportStateColumn = false;
  const showLastActivityColumn = false;
  const selectedAttr = (actual, expected) => actual === expected ? 'selected' : '';
  const actQuestionSwitcher = session.testType === 'act'
    ? `<div class="act-monitor-tools">
        <div class="act-monitor-select-wrap">
          <select class="act-monitor-select" aria-label="Subject" onchange="setActMonitorQuestionSection(this.value)">
            <option value="all" ${selectedAttr(actMonitorQuestionSection,'all')}>Subject: All</option>
            <option value="eng" ${selectedAttr(actMonitorQuestionSection,'eng')}>English</option>
            <option value="math" ${selectedAttr(actMonitorQuestionSection,'math')}>Math</option>
            <option value="read" ${selectedAttr(actMonitorQuestionSection,'read')}>Reading</option>
            <option value="sci" ${selectedAttr(actMonitorQuestionSection,'sci')}>Science</option>
            <option value="writing" ${selectedAttr(actMonitorQuestionSection,'writing')}>Writing</option>
          </select>
        </div>
        <div class="act-monitor-select-wrap">
          <select class="act-monitor-select" aria-label="Question type" onchange="setActMonitorQuestionKind(this.value)">
            <option value="all" ${selectedAttr(actMonitorQuestionKind,'all')}>All Questions</option>
            <option value="rubric" ${selectedAttr(actMonitorQuestionKind,'rubric')}>Rubric Graded</option>
            <option value="selected" ${selectedAttr(actMonitorQuestionKind,'selected')}>Selected Response</option>
          </select>
        </div>
      </div>`
    : '';
  // Section score summary moved to Analytics tab — keep Overview focused on
  // participants & per-question performance only.
  // Subject / Question type filters mount into the card header slot so they
  // sit visually with the "Participants" title rather than above the table.
  const toolsSlot = document.getElementById('sessionStudentToolsSlot');
  if (toolsSlot) toolsSlot.innerHTML = actQuestionSwitcher;
  // ACT and SAT hide the Grade column — both are grade-agnostic college-
  // admissions tests, so grade is a Student property (from the SIS roster),
  // not a test-blueprint property. TCAP keeps the column because the TCAP
  // blueprint is grade-keyed (G5 ELA ≠ G7 ELA).
  const showGradeColumn = session.testType !== 'act' && session.testType !== 'sat';
  document.getElementById('sessionStudentTableWrap').innerHTML = `
    <table class="session-student-table">
      <thead>
        <tr>
          <th>Participants</th>
          ${showGradeColumn ? '<th>Grade</th>' : ''}
          <th>Score</th>
          <th>Status</th>
          ${showReportStateColumn ? '<th>Report</th>' : ''}
          <th class="q-col">${session.testType === 'act' ? 'Questions' : 'Progress'}</th>
          ${showLastActivityColumn ? '<th>Last Activity</th>' : ''}
          <th>Actions</th>
          <th>More</th>
        </tr>
      </thead>
      <tbody>
        ${(view.studentRows || []).map(stu => {
          const isAwaitingWriting = /writing review|awaiting/i.test(String(stu.lastActivity || ''));
          const lastActivityHtml = isAwaitingWriting
            ? `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;background:#fffbeb;color:#a16207;border:1px solid #fde68a;font-size:11px;font-weight:700">🖋 ${stu.lastActivity}</span>`
            : (stu.lastActivity || '—');
          const extPct = stu.extendedTimePct || 100;
          const extBadge = extPct > 100
            ? `<span style="display:inline-flex;align-items:center;gap:3px;margin-top:4px;padding:2px 7px;border-radius:999px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;font-size:10px;font-weight:800">⏱ ${extPct}% time</span>`
            : '';
          const canExtend = canExtendStudentRow(session, stu, monitorClosed);
          const escapedName = stu.name.replace(/'/g, "\\'");
          const moreId = sessionMoreMenuId(stu.name);
          const extHint = canExtend
            ? 'Set extra time for this student only.'
            : 'Extended Time is only available before a student finishes.';
          const progressHtml = (session.testType === 'act' && /ENG/.test(String(stu.progress || '')))
            ? renderActQuestionProgressGrid(stu.progress, stu.name, actMonitorQuestionSection, stu.status, actMonitorQuestionKind)
            : (stu.progress || '—');
          // Per prior PM call: In Progress / Not Started rows show "-" in the
          // Score column across ALL test types (no "in progress" / "not started"
          // text inside the Score cell).
          const isUnscored = !/submitted/i.test(String(stu.status || ''))
            || /not\s*started|in\s*progress|paused|extended|^pending$|^—$/i.test(String(stu.score || '').trim());
          const scoreHtml = isUnscored ? '-' : (stu.score || '-');
          const submittedForGrading = /submitted/i.test(String(stu.status || ''));
          const scoreValue = String(stu.score || '').trim();
          const hasNumericScore = /\d/.test(scoreValue) && !/pending|progress|started/i.test(scoreValue);
          const needsWritingGrade = /waiting for writing review|awaiting.*review|needs teacher review/i.test(String(stu.lastActivity || ''));
          // Grade / Graded action is unified across ALL test types (per prior PM call).
          // Graded = student submitted AND has a numeric score AND no pending writing review.
          const isGraded = submittedForGrading && hasNumericScore && !needsWritingGrade;
          const actActionLabel = isGraded ? 'Graded' : 'Grade';
          const actActionDisabled = !submittedForGrading;
          const actActionClass = `grade-action ${isGraded ? 'done' : 'todo'}`;
          const reportableType = (session.testType === 'act' || session.testType === 'sat');
          const actActionClick = isGraded
            ? (reportableType
                ? `openStudentReport('${session.testType}')`
                : `iteToast('Open student report — ${escapedName}','info')`)
            : `iteToast('Open grading view — ${escapedName}','info')`;
          const avatar = studentAvatarInitials(stu.name);
          return `<tr>
            <td>
              <div class="session-student-person">
                <span class="session-student-avatar">${avatar}</span>
                <div class="session-student-main">
                  <div style="font-weight:700">${stu.name}</div>
                  ${extBadge}
                </div>
              </div>
            </td>
            ${showGradeColumn ? `<td>${stu.grade || '—'}</td>` : ''}
            <td>${scoreHtml}</td>
            <td><span class="student-status-pill ${studentStatusClass(stu.status)}">${stu.status}</span></td>
            ${showReportStateColumn ? `<td><span class="student-status-pill ${studentStatusClass(stu.reportState)}">${stu.reportState}</span></td>` : ''}
            <td class="q-col">${progressHtml}</td>
            ${showLastActivityColumn ? `<td>${lastActivityHtml}</td>` : ''}
            <td>
              <div class="session-table-actions">
                <button class="${actActionClass}" onclick="${actActionClick}" ${actActionDisabled ? 'disabled' : ''}>${actActionLabel}</button>
              </div>
            </td>
            <td>
              <div class="session-more-wrap">
                <button class="session-more-btn" onclick="toggleSessionStudentMoreMenu('${escapedName}', event)" title="More actions">⋯</button>
                <div class="session-more-menu ${openSessionMoreStudentName === stu.name ? 'open' : ''}" id="${moreId}" onclick="event.stopPropagation()">
                  <button onclick="openExtendedTimeFromMore('${escapedName}')" ${canExtend ? '' : 'disabled'}><span>⏱</span><span>Extended Time</span></button>
                  <button class="danger" onclick="openRemoveStudentFromMore('${escapedName}')" ${monitorClosed ? 'disabled' : ''}><span>🗑</span><span>Remove</span></button>
                  <div class="hint">${extHint}</div>
                </div>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
}

// ─── ACT Question Progress cells ────────────────────────────────────────────
// Mirrors the launched assessment monitor pattern: progress is shown as
// question cells, not section bars. Each cell opens the student report.
function renderActQuestionProgressGrid(progressText, studentName, selectedSectionKey, studentStatus, questionKind = 'all') {
  // ─── ⚠️ TDZ-safe header: do NOT split or reorder this block ───────────────
  // History: this function has broken Monitor 3× by re-introducing a
  // ReferenceError ("Cannot access 'label' before initialization"). All
  // shared locals are hoisted with `let` + safe defaults so even if a later
  // edit reorders the body, the not-submitted early-return below keeps
  // working. If you need a different label/status, mutate these vars — do
  // not redeclare them with `const` further down.
  let label = 'ALL';
  let isSubmitted = false;
  let isInProgress = false;
  let safeName = String(studentName || 'student').replace(/"/g, '&quot;');
  // ─────────────────────────────────────────────────────────────────────────
  const m = String(progressText || '').match(/(ENG|English)\s*(\d+)\s*\/\s*(\d+).*?(Math)\s*(\d+)\s*\/\s*(\d+).*?(Reading)\s*(\d+)\s*\/\s*(\d+).*?(Science)\s*(\d+)\s*\/\s*(\d+)/i);
  if (!m) return progressText || '—';
  const normalizedStatus = String(studentStatus || '').toLowerCase();
  // Broadened regexes — Monitor's status taxonomy now includes graded /
  // released / awaiting-writing-review / paused / extended / ready, so the
  // narrow `/submitted|auto-submitted/` would mis-classify those rows and
  // either show empty cells or skip the question grid entirely.
  isSubmitted = /submitted|auto-submitted|graded|released|awaiting/.test(normalizedStatus);
  isInProgress = /progress|paused|extended|live|ready/.test(normalizedStatus);
  const sections = [
    { key:'eng', lbl:'ENG', filled:parseInt(m[2],10), total:parseInt(m[3],10) },
    { key:'math', lbl:'MATH', filled:parseInt(m[5],10), total:parseInt(m[6],10) },
    { key:'read', lbl:'READ', filled:parseInt(m[8],10), total:parseInt(m[9],10) },
    { key:'sci', lbl:'SCI', filled:parseInt(m[11],10), total:parseInt(m[12],10) },
    { key:'writing', lbl:'WRITING', filled:isSubmitted ? 1 : 0, total:1 }
  ];
  let visibleSections = selectedSectionKey && selectedSectionKey !== 'all'
    ? sections.filter(sec => sec.key === selectedSectionKey)
    : sections.slice();
  if (questionKind === 'rubric') visibleSections = visibleSections.filter(sec => sec.key === 'writing');
  if (questionKind === 'selected') visibleSections = visibleSections.filter(sec => sec.key !== 'writing');
  if (!visibleSections.length) {
    return `<div class="act-question-progress"><div style="font-size:11px;color:#a1a1aa;font-weight:800">No questions for this filter</div></div>`;
  }
  label = selectedSectionKey && selectedSectionKey !== 'all'
    ? visibleSections[0].lbl
    : (questionKind === 'rubric' ? 'RUBRIC' : questionKind === 'selected' ? 'SELECTED RESPONSE' : 'ALL');
  if (!isSubmitted) {
    return `<div class="act-question-progress" aria-label="${label} question results unavailable for ${safeName}">
      <span style="display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:24px;color:#a1a1aa;font-size:13px;font-weight:800">-</span>
    </div>`;
  }
  const items = visibleSections.flatMap(sec => Array.from({ length: sec.total }, (_, i) => ({ sec, localIndex:i })));
  const total = visibleSections.reduce((sum, sec) => sum + sec.total, 0);
  const cells = items.map(({ sec, localIndex }) => {
    const answered = localIndex < sec.filled;
    let state = 'todo';
    let mark = '';
    if (isSubmitted) {
      const correct = answered && ((localIndex + safeName.length + sec.key.length) % 4 !== 0);
      state = correct ? 'correct' : 'wrong';
      mark = correct ? '✓' : '×';
    } else if (isInProgress && answered) {
      state = 'answered';
      mark = '•';
    }
    if (sec.key === 'writing' && answered) {
      state = 'answered';
      mark = isSubmitted ? '✓' : '•';
    }
    const qLabel = `${sec.lbl} question ${localIndex + 1}`;
    const statusLabel = sec.key === 'writing' && isSubmitted ? 'submitted' : state === 'correct' ? 'correct' : state === 'wrong' ? 'wrong' : state === 'answered' ? 'answered' : 'not answered';
    return `<button class="act-question-cell ${state}" title="${qLabel} · ${statusLabel}" aria-label="${qLabel}" onclick="openStudentReport('act')">${mark}</button>`;
  }).join('');
  return `<div class="act-question-progress" aria-label="${label} question progress for ${safeName}">
    <div class="act-monitor-qmatrix act-monitor-qhead" style="--q-count:${total}">
      ${Array.from({ length: total }, (_, i) => `<div class="act-monitor-qnum">Q${i + 1}</div>`).join('')}
    </div>
    <div class="act-monitor-qmatrix" style="--q-count:${total}">${cells}</div>
  </div>`;
}
function openStudentLaunch(sessionId, switchToStudent, studentName) {
  currentLaunchSessionId = sessionId;
  currentLaunchStudentName = studentName || currentLaunchStudentName;
  if (switchToStudent) switchRole('student', true);
  const session = getSession(sessionId);
  if (session?.testType === 'act') {
    nav('stu-act');
    return;
  }
  nav('stu-launch');
}
function renderStudentLaunch() {
  const session = getSession(currentLaunchSessionId);
  document.getElementById('studentLaunchCard').innerHTML = `
    <div class="launch-hero">
      <div>
        <span class="launch-badge">${session.icon} ${testTypeLabel(session.testType)}</span>
        <h2>${session.title}</h2>
        <p>${session.className} · Launch window: ${session.window}</p>
      </div>
      <button class="btn-kira-outline" onclick="currentSessionId=currentLaunchSessionId;switchRole('teacher');nav('session-detail')">Exit Preview</button>
    </div>
    <div class="session-meta-list" style="margin-bottom:16px">
      <div class="session-meta-item"><div class="k">Estimated time</div><div class="v">${session.testType==='act' ? '3 hr 35 min + optional writing' : session.testType==='sat' ? '2 hr 14 min' : '45 min'}</div></div>
      <div class="session-meta-item"><div class="k">Tools available</div><div class="v">${session.testType==='sat' ? 'Highlights & Notes, Desmos, scratch pad' : session.testType==='act' ? 'Calculator, eliminator, highlights & notes' : 'Standard tools'}</div></div>
    </div>
    <div class="session-card" style="padding:16px 18px">
      <h3>Before you begin</h3>
      <p style="font-size:13px;color:#52525b;line-height:1.6">You will complete a ready check before the assessment opens. The countdown starts only after you confirm that your device, browser, and tools are ready.</p>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px">
      <button class="btn-kira-outline" onclick="nav('homepage')">Back</button>
      <button class="btn-kira-default" onclick="nav('stu-ready')">Begin Ready Check</button>
    </div>
  `;
}
function renderStudentReadyCheck() {
  const session = getSession(currentLaunchSessionId);
  // Pre-flight check (not the deep ACT-Gateway device check that the
  // student must run before the readiness deadline). This is a lightweight
  // last-second confirmation: device fullscreen, allowed tools loaded,
  // policy acknowledged. Wording is intentionally distinct from the
  // official device-readiness flow which happens days/weeks earlier.
  const isACT  = session.testType === 'act';
  const isSAT  = session.testType === 'sat';
  const isTCAP = session.testType === 'tcap';
  const platformNote = isACT
    ? 'Done your <b>ACT Gateway device readiness check</b> already? This is just a quick last-second confirmation before the timer starts.'
    : isTCAP
    ? 'Already completed your TestNav practice/device check this season? This is the start-of-session confirmation.'
    : 'Quick last-check before the test starts.';
  const toolsCopy = isSAT ? 'Desmos and reference sheet are available for Math only · Highlights & Notes are available on passages.'
    : isACT ? 'Highlighter is available everywhere · Calculator unlocks only on Math · Notes can be added to selected passage text.'
    : isTCAP ? 'Calculator unlocks only on Math SP2/SP3 · Scratch Pad and Highlighter available throughout.'
    : 'Core testing tools are available.';
  document.getElementById('studentReadyCard').innerHTML = `
    <div class="launch-hero">
      <div>
        <span class="launch-badge">Pre-flight check</span>
        <h2>${session.title}</h2>
        <p style="font-size:13px;color:#52525b;line-height:1.5">${platformNote}</p>
      </div>
    </div>
    <div class="checklist">
      <label class="check-item"><input type="checkbox" checked /><div><div class="title">Display & input check</div><div class="sub">Fullscreen, stable internet, and keyboard input all look good.</div></div></label>
      <label class="check-item"><input type="checkbox" checked /><div><div class="title">Section tools loaded</div><div class="sub">${toolsCopy}</div></div></label>
      <label class="check-item"><input type="checkbox" checked /><div><div class="title">Test policy acknowledged</div><div class="sub">I understand timing, submission, and that reports stay locked until my teacher releases them.</div></div></label>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:18px;flex-wrap:wrap">
      <span style="font-size:11px;color:#71717a">Need a deep device check? Run <b>${isACT ? 'ACT Gateway' : isTCAP ? 'TestNav' : 'Kira device'}</b> ahead of test day.</span>
      <div style="display:flex;gap:10px">
        <button class="btn-kira-outline" onclick="nav('stu-launch')">Back</button>
        <button class="btn-kira-default" onclick="nav('${testPageForType(session.testType)}')">Start Assessment</button>
      </div>
    </div>
  `;
}
function sessionReleaseReports() {
  const session = getSession(currentSessionId);
  session.reportState = 'released';
  session.status = 'Released';
  if (session.testType === graderTestType) {
    GRADER_DATA.students.forEach(stu => {
      if (stu.status === 'pending_release' || stu.status === 'graded') stu.status = 'released';
    });
    syncLinkedSessionCounts(session.id);
    graderRenderStuList();
  }
  session.pendingRelease = 0;
  renderSessionDetail();
}
function openSessionGrader(sessionId) {
  const session = getSession(sessionId || currentSessionId);
  loadGrader(session.id);
}
function syncLinkedSessionCounts(sessionId) {
  const linkedSession = getSession(sessionId || currentSessionId);
  if (!linkedSession || GRADER_DATA.testType !== linkedSession.testType) return;
  linkedSession.graded = GRADER_DATA.students.filter(stu => stu.status === 'graded').length;
  linkedSession.pendingRelease = GRADER_DATA.students.filter(stu => stu.status === 'pending_release').length;
  linkedSession.released = GRADER_DATA.students.filter(stu => stu.status === 'released').length;
}
function renderReportGate(testType) {
  const session = getReportState(testType);
  const locked = session.reportState !== 'released';
  const gateTitle = session.reportState === 'pending_release' ? 'Report Pending Release' : 'Report Locked';
  const gateBody = session.reportState === 'pending_release'
    ? 'Your teacher has finished scoring, but the report has not been released to students yet.'
    : 'This report stays hidden until grading and teacher review are complete.';
  return `
    <div class="report-gate">
      <span class="launch-badge">${testType.toUpperCase()} Report</span>
      <h2>${gateTitle}</h2>
      <p>${gateBody}</p>
      <p><strong>Refresh rule:</strong> teacher overrides update the teacher view immediately, but student-facing report cards refresh only after the next release action.</p>
      <p><strong>AI explanation sources:</strong></p>
      <div class="source-list">${session.explanationSources.map(src => `<span class="source-chip">${src}</span>`).join('')}</div>
      ${locked ? `<div style="margin-top:18px"><button class="btn-kira-outline" onclick="nav('${testPageForType(testType)}')">Back to Assessment</button></div>` : ''}
    </div>
  `;
}
function buildPlaceholderRoster(type, className, n) {
  const names = ['Avery Parker','Mia Collins','Noah Patel','Sophia Lee','Daniel Kim','Olivia Singh','Ethan Brooks','Layla Hassan'];
  const grade = type === 'tcap' ? '5' : '11';
  return names.slice(0, n).map(name => ({
    name,
    grade,
    score: '—',
    status: 'Not Started',
    reportState: 'Locked',
    progress: '0 / —',
    lastActivity: 'Waiting for session start'
  }));
}
/* ── Assign Modal — 5-section accordion (mirrors production AssignToStudentsDialog).
   Production source: src/app/assessment/components/AssignToStudentsDialog/.
   Each accordion expands inline with a real form: SessionName / ScheduleType
   (Live ↔ Scheduled tabs + dates + time limit + extra-time chips) /
   GradingMethod (AI vs Manual select) / Add Classes or Students (search +
   class accordion + checkboxes) / Proctoring Settings (anti-cheat switch +
   stepper). State lives on `assignState` and a full re-render runs on each
   toggle. Text inputs commit to state on every keystroke so re-renders don't
   drop the value. */
/* Seed roster for the Assign modal student picker.
 *
 * Each student carries a `tags[]` array — every tag is its own selectable
 * chip in the picker (Course / Section / Period / Class / Grade / Teacher).
 * `tcapTestOverride` marks an accelerated student (e.g. G7 taking Algebra I
 * EOC) so the picker can render the "↗ Accelerated" badge and the post-pick
 * footnote without needing a real district admin override pipeline.
 *
 * `classes[]` is preserved as the underlying group container for K-8 / ACT
 * / SAT flows (legacy contract). For TCAP we additionally seed HS EOC
 * cohorts (Algebra I, Geometry, English I, English II) so the picker can
 * demo Course / Section tag search and the accelerated-student override.
 *
 * Volume is intentionally inflated to ~30+ students so the picker's
 * suggestions dropdown has enough material to demonstrate filter + dedup
 * behavior without looking like a stub. */
function _assignSeedClasses(type, isTcap, primaryClass) {
  const defaultGrade = isTcap ? '5' : type === 'sat' ? '11' : '11';

  /* Build a single student record + auto-derived tags.
   *
   * Tag kinds (intentionally minimal):
   *   - class    — full "Course · Period N" identifier (most specific, the
   *                primary chip a teacher will pick)
   *   - course   — just the course (e.g. "Algebra I"); fans out across all
   *                periods of that course
   *   - grade    — "Grade 5" / "Grade 9" etc.; fans out across all classes
   *                at that grade
   *   - teacher  — for K-12 where one teacher owns multiple classes
   *
   * NOTE: a standalone "Section/Period" tag (e.g. just "Period 1") is
   * intentionally NOT generated. Period numbers are reused across
   * different courses and grades — "Period 1" by itself is ambiguous and
   * would silently mix Algebra I G9 with Grade 5 ELA students. The Class
   * tag already encodes "Course · Period N" so the picker covers the
   * realistic teacher intent. PRD §5.7.2 mentions Section as a recognized
   * tag — that PRD wording will be tightened in the next sync to clarify
   * Section is encoded INSIDE the Class tag, not as a standalone chip. */
  const buildStudent = (cls, name, opts = {}) => {
    const grade = opts.grade || defaultGrade;
    const teacher = opts.teacher || (isTcap ? 'Mr. Rivera' : 'Ms. Johnson');
    const baseTags = [
      { kind:'class',   label: cls },
      { kind:'grade',   label: `Grade ${grade}` },
      { kind:'teacher', label: teacher }
    ];
    if (opts.course) baseTags.push({ kind:'course', label: opts.course });
    return {
      id: `${cls}-${name}`.replace(/[^a-z0-9]+/gi,'-').toLowerCase(),
      name,
      email: `${name.split(' ').join('.').toLowerCase()}@school.edu`,
      grade,
      teacher,
      tags: baseTags,
      tcapTestOverride: opts.override || null
    };
  };

  /* Group container — class + students + selection state. The picker's
     selection state actually lives at top level on assignState (selectedTagIds
     + selectedStudentIds) but we keep this Set field for backward compat
     with any non-picker code path that still iterates per-class. */
  const makeClass = (cls, students) => ({
    id: cls.replace(/[^a-z0-9]+/gi,'-').toLowerCase(),
    name: cls,
    students,
    expanded: false,
    selectedStudentIds: new Set()
  });

  /* ── K-8 / ACT / SAT path: two classes, no Course tag ─────────────── */
  if (!isTcap || type !== 'tcap') {
    const altName = type === 'sat' ? 'Grade 11 Honors' : 'Period 3 — College Prep';
    return [
      makeClass(primaryClass, [
        ['Avery Parker', { section:'Period 2' }],
        ['Mia Collins',  { section:'Period 2' }],
        ['Noah Patel',   { section:'Period 2' }],
        ['Sophia Lee',   { section:'Period 2' }],
        ['Ethan Brooks', { section:'Period 2' }],
        ['Jaden Wu',     { section:'Period 2' }]
      ].map(([n, o]) => buildStudent(primaryClass, n, o))),
      makeClass(altName, [
        ['Maya Brooks',  { section:'Period 3' }],
        ['Samuel Lin',   { section:'Period 3' }],
        ['Olivia Adams', { section:'Period 3' }],
        ['Riley Tran',   { section:'Period 3' }],
        ['Eli Carter',   { section:'Period 3' }]
      ].map(([n, o]) => buildStudent(altName, n, o)))
    ];
  }

  /* ── TCAP path: K-8 cohorts + 4 HS EOC cohorts + accelerated G7/G8 ── */
  return [
    /* K-8 ELA — primary cohort kept identical to prior seed */
    makeClass(primaryClass, [
      buildStudent(primaryClass, 'Avery Parker', { section:'Period 2', teacher:'Mr. Rivera' }),
      buildStudent(primaryClass, 'Mia Collins',  { section:'Period 2', teacher:'Mr. Rivera' }),
      buildStudent(primaryClass, 'Noah Patel',   { section:'Period 2', teacher:'Mr. Rivera' }),
      buildStudent(primaryClass, 'Sophia Lee',   { section:'Period 2', teacher:'Mr. Rivera' }),
      buildStudent(primaryClass, 'Ethan Brooks', { section:'Period 2', teacher:'Mr. Rivera' }),
      buildStudent(primaryClass, 'Jaden Wu',     { section:'Period 2', teacher:'Mr. Rivera' })
    ]),
    makeClass('Grade 5 ELA · Period 3', [
      buildStudent('Grade 5 ELA · Period 3', 'Maya Brooks',  { section:'Period 3', teacher:'Mr. Rivera' }),
      buildStudent('Grade 5 ELA · Period 3', 'Samuel Lin',   { section:'Period 3', teacher:'Mr. Rivera' }),
      buildStudent('Grade 5 ELA · Period 3', 'Olivia Adams', { section:'Period 3', teacher:'Mr. Rivera' }),
      buildStudent('Grade 5 ELA · Period 3', 'Riley Tran',   { section:'Period 3', teacher:'Mr. Rivera' }),
      buildStudent('Grade 5 ELA · Period 3', 'Eli Carter',   { section:'Period 3', teacher:'Mr. Rivera' })
    ]),

    /* HS Algebra I EOC — typical G9 + 2 accelerated G7 + 1 accelerated G8.
       The accelerated students will surface a purple "↗ Accelerated" badge
       in the picker's suggestion rows (and a footnote when selected). */
    makeClass('Algebra I · Period 1', [
      buildStudent('Algebra I · Period 1', 'Diego Hernandez', { course:'Algebra I', section:'Period 1', grade:'9', teacher:'Mr. Khan' }),
      buildStudent('Algebra I · Period 1', 'Anna Petrov',     { course:'Algebra I', section:'Period 1', grade:'9', teacher:'Mr. Khan' }),
      buildStudent('Algebra I · Period 1', 'Marcus Bell',     { course:'Algebra I', section:'Period 1', grade:'9', teacher:'Mr. Khan' }),
      buildStudent('Algebra I · Period 1', 'Sara Chen',       { course:'Algebra I', section:'Period 1', grade:'9', teacher:'Mr. Khan' }),
      buildStudent('Algebra I · Period 1', 'Miguel Vega',     { course:'Algebra I', section:'Period 1', grade:'7', teacher:'Mr. Khan',
                                                                 override:{ kind:'accelerated', from:'G7', to:'Algebra I EOC' } }),
      buildStudent('Algebra I · Period 1', 'Aisha Rahman',    { course:'Algebra I', section:'Period 1', grade:'8', teacher:'Mr. Khan',
                                                                 override:{ kind:'accelerated', from:'G8', to:'Algebra I EOC' } })
    ]),
    makeClass('Algebra I · Period 2', [
      buildStudent('Algebra I · Period 2', 'Tyler Quinn',     { course:'Algebra I', section:'Period 2', grade:'9', teacher:'Mr. Khan' }),
      buildStudent('Algebra I · Period 2', 'Bianca Romero',   { course:'Algebra I', section:'Period 2', grade:'9', teacher:'Mr. Khan' }),
      buildStudent('Algebra I · Period 2', 'Jordan Park',     { course:'Algebra I', section:'Period 2', grade:'9', teacher:'Mr. Khan' }),
      buildStudent('Algebra I · Period 2', 'Theo Walker',     { course:'Algebra I', section:'Period 2', grade:'7', teacher:'Mr. Khan',
                                                                 override:{ kind:'accelerated', from:'G7', to:'Algebra I EOC' } })
    ]),

    /* HS Geometry EOC — typical G10 cohort */
    makeClass('Geometry · Period 4', [
      buildStudent('Geometry · Period 4', 'Hannah Wright',  { course:'Geometry', section:'Period 4', grade:'10', teacher:'Ms. Sato' }),
      buildStudent('Geometry · Period 4', 'Owen Mitchell',  { course:'Geometry', section:'Period 4', grade:'10', teacher:'Ms. Sato' }),
      buildStudent('Geometry · Period 4', 'Layla Hassan',   { course:'Geometry', section:'Period 4', grade:'10', teacher:'Ms. Sato' }),
      buildStudent('Geometry · Period 4', 'Caleb Foster',   { course:'Geometry', section:'Period 4', grade:'10', teacher:'Ms. Sato' })
    ]),

    /* HS English I EOC — G9 cohort */
    makeClass('English I · Period 2', [
      buildStudent('English I · Period 2', 'Imani Daniels', { course:'English I', section:'Period 2', grade:'9', teacher:'Ms. Greene' }),
      buildStudent('English I · Period 2', 'Lucas Kim',     { course:'English I', section:'Period 2', grade:'9', teacher:'Ms. Greene' }),
      buildStudent('English I · Period 2', 'Priya Shah',    { course:'English I', section:'Period 2', grade:'9', teacher:'Ms. Greene' })
    ]),

    /* HS English II EOC — G10 cohort */
    makeClass('English II · Period 5', [
      buildStudent('English II · Period 5', 'Sebastian Cole', { course:'English II', section:'Period 5', grade:'10', teacher:'Ms. Greene' }),
      buildStudent('English II · Period 5', 'Zoe Anderson',   { course:'English II', section:'Period 5', grade:'10', teacher:'Ms. Greene' }),
      buildStudent('English II · Period 5', 'Adrian Cruz',    { course:'English II', section:'Period 5', grade:'10', teacher:'Ms. Greene' })
    ])
  ];
}
function openAssignModal(type) {
  const isTcap = type === 'tcap';
  const className = isTcap ? 'Grade 5 ELA · Period 2'
    : type === 'sat' ? 'Grade 11 Advisory'
    : 'Period 2 — College Prep';
  // ACT time limit is fixed by the official blueprint (sum of included sections).
  const actTotal = (typeof ACT_SECTIONS !== 'undefined')
    ? ACT_SECTIONS.filter(s => !s._excluded).reduce((sum, s) => sum + (s.time | 0), 0)
    : 205;
  const defaultDuration = isTcap ? 50 : type === 'act' ? actTotal : type === 'sat' ? 134 : 60;
  assignState = {
    assessmentType: type || 'generic',
    className,
    deliveryMode: (type === 'sat' || isTcap) ? 'Scheduled Mode' : 'Live Mode',
    // Per-section open/close state — all expanded by default like production.
    opens: { name:true, schedule:true, grading:true, students:true, proctor:true },
    // Form values — defaults match the production AssignToStudentsDialog.
    sessionName: `${testTypeLabel(type || 'generic')} practice · ${className}`,
    scheduleType: (type === 'sat' || isTcap) ? 'SCHEDULED' : 'LIVE',
    availableFromDate: '',
    availableFromTime: '09:00',
    availableUntilDate: '',
    availableUntilTime: '17:00',
    timeLimit: defaultDuration,
    extraTime: 0,
    gradingMethod: type === 'act' ? 'MANUAL' : 'AUTO_AI',
    classes: _assignSeedClasses(type, isTcap, className),
    /* Picker selection state — flattened to top-level from the legacy
       per-class Sets. Two parallel sources: tag chips (purple) and
       individual student picks (gray). Effective roster is the union of
       both, deduped by student.id (see _assignEffectiveStudents). */
    selectedTagIds: new Set(),       // string ids: `${kind}:${label}` (e.g. 'course:Algebra I')
    selectedStudentIds: new Set(),   // student ids individually picked
    searchQuery: '',
    suggestOpen: false,              // true once the search field gains focus or has input
    antiCheatEnabled: true,
    maxViolationCount: 5,
    reportState: 'pending_release',
  };
  document.getElementById('assignModalOverlay').classList.add('open');
  renderAssignModal();
}
function closeAssignModal() {
  document.getElementById('assignModalOverlay').classList.remove('open');
}
/* ─────────────── Assign-modal student picker — selection helpers ───────────────
 * Picker semantics (PRD §5.7): a teacher can select recipients via two
 * parallel paths — TAG chips (Course/Section/Period/Class/Grade/Teacher) or
 * individual STUDENT chips. Effective roster = union of both, deduped by
 * student.id. Tags are ids of the form `${kind}:${label}` so we can compare
 * cleanly against student.tags[].
 *
 * The legacy per-class `selectedStudentIds` Sets are NOT used by the picker
 * — they're kept only because some downstream code still iterates classes.
 * Top-level `assignState.selectedTagIds` and `assignState.selectedStudentIds`
 * are the source of truth. */

function _assignAllStudents() {
  const seen = new Set();
  const out = [];
  (assignState.classes || []).forEach(c => c.students.forEach(s => {
    if (!seen.has(s.id)) { seen.add(s.id); out.push(s); }
  }));
  return out;
}

function _assignTagId(tag) { return `${tag.kind}:${tag.label}`; }

/* Aggregate every distinct tag across the seeded roster. Each tag carries:
 *   - id, kind, label   — shape mirrors student.tags[]
 *   - studentIds[]      — pre-resolved roster for this tag (for chip expand)
 *   - count             — studentIds.length, displayed as "(N)" in the chip
 */
function _assignAllTags() {
  const map = new Map();
  _assignAllStudents().forEach(s => (s.tags || []).forEach(t => {
    const id = _assignTagId(t);
    if (!map.has(id)) map.set(id, { id, kind:t.kind, label:t.label, studentIds:[] });
    map.get(id).studentIds.push(s.id);
  }));
  return Array.from(map.values()).map(t => ({ ...t, count: t.studentIds.length }));
}

/* Effective roster = union of (students under any selected tag) + (students
 * picked individually). Returns a Set of student ids; callers map back to
 * full student objects via _assignStudentById when they need names/grade. */
function _assignEffectiveStudentIds() {
  const ids = new Set(assignState.selectedStudentIds);
  const allTags = _assignAllTags();
  assignState.selectedTagIds.forEach(tagId => {
    const tag = allTags.find(t => t.id === tagId);
    if (tag) tag.studentIds.forEach(sid => ids.add(sid));
  });
  return ids;
}

function _assignTotalSelected() { return _assignEffectiveStudentIds().size; }

function _assignStudentById(id) {
  return _assignAllStudents().find(s => s.id === id) || null;
}

/* Whether any selected tag's roster contains this student id — used to
 * stop the user removing an "implicitly added" student via the individual
 * × button (we surface a hint instead). */
function _assignStudentCoveredByTag(studentId) {
  const allTags = _assignAllTags();
  for (const tagId of assignState.selectedTagIds) {
    const tag = allTags.find(t => t.id === tagId);
    if (tag && tag.studentIds.includes(studentId)) return true;
  }
  return false;
}

/* Search suggestions — splits matches into two groups (tags first, then
 * individual students). Tag matches surface BOTH by tag-label fragment AND
 * by any student-name fragment within that tag's roster (so typing a
 * student name still surfaces the section tag they belong to, in case the
 * teacher actually wants the whole section).
 *
 * Returns {tags:[...], students:[...]} where each row is already filtered
 * for "not currently selected" so the dropdown doesn't show what's already
 * in the chip strip. Empty query returns {tags:[], students:[]} — the
 * Recent-Tags section handles empty state separately. */
function _assignSearchSuggestions() {
  const q = (assignState.searchQuery || '').trim().toLowerCase();
  if (!q) return { tags:[], students:[] };

  const allTags = _assignAllTags();
  const allStudents = _assignAllStudents();

  // Tag match: label contains q OR any student in the tag matches q
  const tagMatches = allTags
    .filter(t => !assignState.selectedTagIds.has(t.id))
    .filter(t => {
      if (t.label.toLowerCase().includes(q)) return true;
      return t.studentIds.some(sid => {
        const s = allStudents.find(x => x.id === sid);
        return s && s.name.toLowerCase().includes(q);
      });
    })
    // Class beats Course beats Grade/Teacher — Class is the most specific
    // tag (a fully-qualified "Course · Period N" identifier) so it usually
    // matches the teacher's intent better than the broad Course chip
    // (which fans out across all periods).
    .sort((a, b) => {
      const order = { class:0, course:1, grade:2, teacher:3 };
      return (order[a.kind] || 9) - (order[b.kind] || 9);
    });

  // Student match: direct name OR email match, excluded if already chosen
  const studentMatches = allStudents
    .filter(s => !assignState.selectedStudentIds.has(s.id))
    .filter(s => s.name.toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q));

  return { tags: tagMatches.slice(0, 8), students: studentMatches.slice(0, 12) };
}

/* (former _assignRecentTags helper removed — the focus-only "Suggested
 * for TCAP" empty-state panel was pulled per UX feedback. The picker now
 * shows suggestions only after the user types something.) */
function renderAssignModal() {
  document.getElementById('assignModalTitle').textContent = 'Assign to Students';
  const nextBtn = document.getElementById('assignNextBtn');
  const totalSelected = _assignTotalSelected();
  const isDisabled = !(assignState.sessionName || '').trim() || (assignState.timeLimit | 0) <= 0;
  if (nextBtn) {
    nextBtn.textContent = 'Assign';
    nextBtn.disabled = isDisabled;
    nextBtn.style.opacity = isDisabled ? '.5' : '1';
    nextBtn.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
  }
  const body = document.getElementById('assignModalBody');
  // Lucide-style SVG icons matching production SectionCard icon prop.
  const ICON_USERS = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  const ICON_TIMER = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="14" x2="15" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`;
  const ICON_STAR  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 8.5 22 9.5 17 14.5 18 22 12 18.5 6 22 7 14.5 2 9.5 9 8.5 12 2"/></svg>`;
  const ICON_EYE   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  body.innerHTML = `
    <div class="assign-accordion" style="display:flex;flex-direction:column;gap:14px">
      ${assignAccordionCard({
        id:'name', title:'Assignment name', subtitle:'Create a title for this assignment',
        icon: ICON_USERS, tone:'people',
        value: assignState.sessionName,
        open: assignState.opens.name,
        body: _assignSectionName(),
      })}
      ${assignAccordionCard({
        id:'schedule', title:'Schedule type', subtitle:'Choose between a live session or a time window',
        icon: ICON_TIMER, tone:'clock',
        value: (() => {
          const baseLabel = assignState.assessmentType === 'act'
            ? `ACT blueprint · ${assignState.timeLimit} min`
            : `${assignState.timeLimit} min`;
          if (assignState.scheduleType === 'LIVE') {
            const total = (assignState.timeLimit | 0) + (assignState.extraTime | 0);
            return `Live session · ${baseLabel}${assignState.extraTime ? ` + ${assignState.extraTime} min buffer (${total} min total)` : ''}`;
          }
          return `Scheduled window · ${baseLabel}`;
        })(),
        open: assignState.opens.schedule,
        body: _assignSectionSchedule(),
      })}
      ${assignAccordionCard({
        id:'grading', title:'Grading method', subtitle:'Select AI for instant grading or Manual for teacher review',
        icon: ICON_STAR, tone:'star',
        value: assignState.gradingMethod === 'AUTO_AI' ? 'AI grading (instant)' : 'Manual grading (teacher review)',
        open: assignState.opens.grading,
        body: _assignSectionGrading(),
      })}
      ${assignAccordionCard({
        id:'students', title:'Add students', subtitle:'Search by name, course, period, class, or teacher',
        icon: ICON_USERS, tone:'people',
        value: totalSelected ? `${totalSelected} student${totalSelected > 1 ? 's' : ''} selected` : '',
        open: assignState.opens.students,
        body: _assignSectionStudents(),
      })}
      ${assignAccordionCard({
        id:'proctor', title:'Proctoring settings', subtitle:'Configure proctoring monitoring and limits',
        icon: ICON_EYE, tone:'shield',
        value: assignState.antiCheatEnabled ? `On · max ${assignState.maxViolationCount} violations` : 'Off',
        open: assignState.opens.proctor,
        body: _assignSectionProctor(),
      })}
    </div>
  `;
}
function assignAccordionCard(opts) {
  const { id, title, subtitle, icon, tone='people', value='', open=false, body='' } = opts || {};
  const valueLine = value
    ? `<div class="assign-acc-value has-value">${value}</div>`
    : '';
  // Body HTML lives inside .assign-acc-body. CSS shows it only when the card
  // has the .open class. Toggle via assignToggleSection so state survives
  // re-renders.
  return `<div class="assign-acc-card ${open ? 'open' : ''}" data-section="${id}">
    <div class="assign-acc-head" onclick="assignToggleSection('${id}')">
      <div class="assign-acc-icon tone-${tone}">${icon}</div>
      <div class="assign-acc-text">
        <div class="assign-acc-title">${title}</div>
        <div class="assign-acc-sub">${subtitle}</div>
        ${valueLine}
      </div>
      <div class="assign-acc-chevron">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
    <div class="assign-acc-body">
      <div class="assign-section-body">${body}</div>
    </div>
  </div>`;
}
function assignToggleSection(id) {
  if (!assignState.opens) assignState.opens = {};
  assignState.opens[id] = !assignState.opens[id];
  renderAssignModal();
}
function assignSetField(field, value) {
  assignState[field] = value;
  // Skip full re-render for high-frequency text inputs (kept on caller side
  // via oninput) — for toggles/selects, we want the value chip in the head
  // to refresh, so re-render. The caller decides which path by passing
  // `_skipRender` via a wrapper if needed.
  renderAssignModal();
}
function assignTextInput(field, value) {
  // Live-text path — write through to state but skip re-render so the input
  // keeps focus while typing.
  assignState[field] = value;
}
function assignSetSchedule(type) {
  assignState.scheduleType = type;
  renderAssignModal();
}
function assignSetExtraTime(min) {
  assignState.extraTime = min | 0;
  renderAssignModal();
}
function assignSetGradingMethod(value) {
  assignState.gradingMethod = value;
  renderAssignModal();
}
function assignSetSearch(value) {
  assignState.searchQuery = value;
  // Suggestions only open once the user has typed something. Earlier
  // iteration auto-popped a "Suggested for TCAP" panel on focus alone —
  // pulled per UX feedback because it crowded the modal before any user
  // intent and forced a large vertical decision before the search field
  // had been touched.
  assignState.suggestOpen = !!(value && value.trim().length);
  // Re-render is required so the suggestions list reflects the new query,
  // but a full re-render kills input focus + caret position. Capture both
  // BEFORE the render and restore them after the DOM is replaced.
  renderAssignModal();
  const inp = document.querySelector('.aspk-search input');
  if (inp) {
    inp.focus();
    try { inp.setSelectionRange(value.length, value.length); } catch (e) { /* noop */ }
  }
}
/* Focus handler intentionally a no-op — kept so the inline onfocus binding
 * doesn't throw if any code path still references it. The picker only opens
 * suggestions on typed input, never on focus alone. */
function assignFocusSearch() { /* intentionally empty — see assignSetSearch */ }
function assignAddTag(tagId) {
  if (!tagId) return;
  assignState.selectedTagIds.add(tagId);
  // Once a tag is added, drop any individual picks already covered by it
  // so the chip strip stays minimal (the tag chip implies its roster).
  const allTags = _assignAllTags();
  const tag = allTags.find(t => t.id === tagId);
  if (tag) tag.studentIds.forEach(sid => assignState.selectedStudentIds.delete(sid));
  // Clear the search input — pattern feels right after a successful add
  assignState.searchQuery = '';
  assignState.suggestOpen = false;
  renderAssignModal();
}
function assignRemoveTag(tagId) {
  assignState.selectedTagIds.delete(tagId);
  renderAssignModal();
}
function assignAddStudent(studentId) {
  if (!studentId) return;
  // Skip if already covered by a selected tag — surface a hint via toast
  // instead of silently no-op'ing so the teacher knows why.
  if (_assignStudentCoveredByTag(studentId)) {
    if (typeof iteToast === 'function') iteToast('Already included via a selected tag.', 'info');
    return;
  }
  assignState.selectedStudentIds.add(studentId);
  assignState.searchQuery = '';
  assignState.suggestOpen = false;
  renderAssignModal();
}
function assignRemoveStudent(studentId) {
  assignState.selectedStudentIds.delete(studentId);
  renderAssignModal();
}
function assignSelectAllResults() {
  const sug = _assignSearchSuggestions();
  sug.tags.forEach(t => assignState.selectedTagIds.add(t.id));
  sug.students.forEach(s => {
    if (!_assignStudentCoveredByTag(s.id)) assignState.selectedStudentIds.add(s.id);
  });
  assignState.searchQuery = '';
  assignState.suggestOpen = false;
  renderAssignModal();
}
function assignClearAllStudents() {
  assignState.selectedTagIds.clear();
  assignState.selectedStudentIds.clear();
  renderAssignModal();
}
/* Click-outside to close the suggestions dropdown — mirrors the SP picker
 * pattern in Analytics. Single document listener guarded by suggestOpen so
 * we don't pay re-render cost when the modal is closed. */
document.addEventListener('click', (ev) => {
  if (!assignState || !assignState.suggestOpen) return;
  const wrap = document.querySelector('.aspk-search-wrap');
  if (wrap && !wrap.contains(ev.target)) {
    assignState.suggestOpen = false;
    renderAssignModal();
  }
});
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && assignState && assignState.suggestOpen) {
    assignState.suggestOpen = false;
    renderAssignModal();
  }
});
function assignToggleAntiCheat() {
  assignState.antiCheatEnabled = !assignState.antiCheatEnabled;
  renderAssignModal();
}
function assignAdjustViolation(delta) {
  const next = Math.min(10, Math.max(1, (assignState.maxViolationCount | 0) + delta));
  assignState.maxViolationCount = next;
  renderAssignModal();
}
function assignSetViolation(value) {
  const n = parseInt(String(value).replace(/\D/g,''), 10);
  if (Number.isNaN(n)) return;
  assignState.maxViolationCount = Math.min(10, Math.max(1, n));
  renderAssignModal();
}
function assignSetTimeLimit(value) {
  if (assignState.assessmentType === 'act') return; // Locked by ACT Enhanced blueprint.
  const n = parseInt(String(value).replace(/\D/g,''), 10);
  assignState.timeLimit = Number.isNaN(n) ? 0 : Math.min(300, Math.max(0, n));
  renderAssignModal();
}
/* ── Section body renderers ── */
function _assignSectionName() {
  const v = assignState.sessionName || '';
  return `
    <div class="assign-input-wrap">
      <input class="assign-input has-suffix" type="text" maxlength="40"
        value="${v.replace(/"/g,'&quot;')}"
        placeholder="Enter assignment name"
        oninput="assignTextInput('sessionName', this.value); document.getElementById('assignNameCounter').textContent = this.value.length + '/40'"
        onblur="renderAssignModal()" />
      <span class="assign-input-suffix" id="assignNameCounter">${v.length}/40</span>
    </div>
  `;
}
function _assignActIncludedSections() {
  if (typeof ACT_SECTIONS === 'undefined') return [];
  return ACT_SECTIONS.filter(s => !s._excluded);
}
function _assignActFixedTotal() {
  return _assignActIncludedSections().reduce((sum, s) => sum + (s.time | 0), 0);
}
function _assignActSectionBreakdown() {
  const sections = _assignActIncludedSections();
  const total = _assignActFixedTotal();
  const rows = sections.map(s => `
    <div class="assign-act-section-row">
      <div class="name">
        <span class="dot"></span>
        <span>${s.name}</span>
        ${s.optional ? '<span class="opt">Optional</span>' : ''}
      </div>
      <div class="q">${s.questions} questions</div>
      <div class="t">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${s.time} min
      </div>
    </div>
  `).join('');
  return `
    <div class="assign-act-locked">
      <div class="assign-act-locked-head">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>Locked by ACT Enhanced blueprint</span>
      </div>
      <div class="assign-act-section-list">${rows}</div>
      <div class="assign-act-total">
        <span>Total exam time</span>
        <strong>${total} min</strong>
      </div>
    </div>
    <div class="assign-act-helper">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>ACT exam times are set by the official ACT Enhanced blueprint and can't be edited per assignment. Use <b>Session duration</b> below to add a buffer on top of the locked time.</span>
    </div>
  `;
}
function _assignSectionSchedule() {
  const isLive = assignState.scheduleType === 'LIVE';
  const isAct = assignState.assessmentType === 'act';
  const limit = assignState.timeLimit | 0;
  const extra = assignState.extraTime | 0;
  return `
    <div class="assign-tabs">
      <button class="assign-tab ${isLive?'active':''}" onclick="assignSetSchedule('LIVE')">Live session</button>
      <button class="assign-tab ${!isLive?'active':''}" onclick="assignSetSchedule('SCHEDULED')">Schedule for later</button>
    </div>
    ${!isLive ? `
      <div>
        <div class="assign-section-title">Available period</div>
        <div class="assign-section-desc">Set the start and end of the testing window.</div>
      </div>
      <div class="assign-row">
        <div class="col">
          <label>Available from</label>
          <input class="assign-input" type="date" value="${assignState.availableFromDate || ''}"
            oninput="assignTextInput('availableFromDate', this.value)" onchange="renderAssignModal()" />
        </div>
        <div class="col">
          <label>Time</label>
          <input class="assign-input" type="time" value="${assignState.availableFromTime || '09:00'}"
            oninput="assignTextInput('availableFromTime', this.value)" />
        </div>
      </div>
      <div class="assign-row">
        <div class="col">
          <label>Available until</label>
          <input class="assign-input" type="date" value="${assignState.availableUntilDate || ''}"
            oninput="assignTextInput('availableUntilDate', this.value)" onchange="renderAssignModal()" />
        </div>
        <div class="col">
          <label>Time</label>
          <input class="assign-input" type="time" value="${assignState.availableUntilTime || '17:00'}"
            oninput="assignTextInput('availableUntilTime', this.value)" />
        </div>
      </div>
    ` : ''}
    <div>
      <div class="assign-section-title">Time limit</div>
      <div class="assign-section-desc">${isAct ? 'ACT exam times are fixed per subject by the official ACT Enhanced blueprint.' : 'How long each student has from the moment they start.'}</div>
    </div>
    ${isAct ? _assignActSectionBreakdown() : `
      <div class="assign-input-wrap">
        <svg class="assign-input-prefix-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <input class="assign-input has-prefix has-suffix" type="number" min="1" max="300"
          value="${limit || ''}" placeholder="60"
          oninput="assignTextInput('timeLimit', parseInt(this.value,10) || 0)"
          onblur="assignSetTimeLimit(this.value)" />
        <span class="assign-input-suffix">mins</span>
      </div>
    `}
    ${isLive ? `
      <div>
        <div class="assign-section-title">Session duration</div>
        <div class="assign-section-desc">${isAct ? 'Buffer time is added on top of every ACT subject\u2019s locked time.' : 'Add buffer time so students get a brief grace window.'}</div>
      </div>
      <div class="assign-duration-card">
        <div class="duration-col">
          <span class="lab">Base duration</span>
          <span class="val">⏱ ${limit > 0 ? limit + ' minutes' : '— minutes'}</span>
        </div>
        <div class="duration-col">
          <span class="lab">Total duration</span>
          <span class="val">⏱ ${limit > 0 ? (limit + extra) + ' minutes' : '— minutes'}</span>
        </div>
      </div>
      <div class="assign-segmented">
        ${[0,5,10,15].map(m => `<button class="${extra===m?'active':''}" onclick="assignSetExtraTime(${m})">${m===0 ? 'None' : '+ ' + m + ' min'}</button>`).join('')}
      </div>
    ` : ''}
  `;
}
function _assignSectionGrading() {
  const v = assignState.gradingMethod || 'AUTO_AI';
  return `
    <select class="assign-select" onchange="assignSetGradingMethod(this.value)">
      <option value="AUTO_AI" ${v==='AUTO_AI'?'selected':''}>AI grading (instant)</option>
      <option value="MANUAL" ${v==='MANUAL'?'selected':''}>Manual grading (teacher review)</option>
    </select>
    <div class="assign-helper">${v==='AUTO_AI' ? 'Selected response items grade instantly. Constructed responses still need teacher review.' : 'All items wait for teacher review before reports are released to students.'}</div>
  `;
}
/* ─────────────── Assign-modal — student picker render ────────────────
 * Three-band layout (PRD §5.7.3):
 *   1. Search input          — single field for both tag and name fragments
 *   2. "Currently selected"  — chip strip (purple TAG chips, gray STUDENT
 *                              chips) with × removal + summary + Clear all
 *   3. Suggestions / empty   — dropdown anchored under the search input.
 *                              Either a Recent-Tags empty state, or live
 *                              TAGS+STUDENTS suggestion groups when typing.
 * Accelerated students get a small "↗ Accelerated" pill in suggestion rows
 * AND in the selected-chip; an aggregate footnote appears under the chip
 * strip when ≥1 accelerated student is in the effective roster. */
function _assignSectionStudents() {
  const allTags = _assignAllTags();
  const total = _assignTotalSelected();
  const effectiveIds = _assignEffectiveStudentIds();

  /* ─── Selected chip strip ─── */
  const tagChips = Array.from(assignState.selectedTagIds).map(tagId => {
    const tag = allTags.find(t => t.id === tagId);
    if (!tag) return '';
    return `<span class="aspk-chip tag" data-kind="${tag.kind}">
      <span class="aspk-chip-kind">${tag.kind === 'course' ? 'Course' : tag.kind === 'class' ? 'Class' : tag.kind === 'grade' ? 'Grade' : 'Teacher'}</span>
      <span class="aspk-chip-label">${tag.label}</span>
      <span class="aspk-chip-count">${tag.count}</span>
      <button class="aspk-chip-x" onclick="assignRemoveTag('${tag.id}')" aria-label="Remove ${tag.label}">×</button>
    </span>`;
  }).join('');

  const studentChips = Array.from(assignState.selectedStudentIds).map(sid => {
    const s = _assignStudentById(sid);
    if (!s) return '';
    const accel = s.tcapTestOverride?.kind === 'accelerated';
    return `<span class="aspk-chip student${accel ? ' is-accel' : ''}">
      <span class="aspk-chip-label">${s.name}</span>
      <span class="aspk-chip-meta">G${s.grade}</span>
      ${accel ? `<span class="aspk-accel-flag" title="Grade-${s.tcapTestOverride.from} student taking ${s.tcapTestOverride.to}">↗ Accelerated</span>` : ''}
      <button class="aspk-chip-x" onclick="assignRemoveStudent('${s.id}')" aria-label="Remove ${s.name}">×</button>
    </span>`;
  }).join('');

  const allSelectedChips = tagChips + studentChips;

  /* Accelerated footnote — surface under chip strip if any effective
     student carries an override. Counted from the effective roster (not
     just individual picks) so a tag covering an accelerated student also
     triggers the disclosure. */
  let accelCount = 0;
  effectiveIds.forEach(sid => {
    const s = _assignStudentById(sid);
    if (s?.tcapTestOverride?.kind === 'accelerated') accelCount++;
  });
  const accelFootnote = accelCount > 0
    ? `<div class="aspk-accel-footnote">
        <span class="aspk-accel-footnote-icon">↗</span>
        <span><b>${accelCount} accelerated student${accelCount === 1 ? '' : 's'}</b> in this roster — they're enrolled below the standard grade for this EOC course (district override required). Their score will count toward course grade per the TN EOC weighting policy.</span>
      </div>`
    : '';

  const summary = total > 0
    ? `<div class="aspk-summary">
        <span><b>${total}</b> student${total === 1 ? '' : 's'} selected${assignState.selectedTagIds.size > 0 ? ` across ${assignState.selectedTagIds.size} tag${assignState.selectedTagIds.size === 1 ? '' : 's'}${assignState.selectedStudentIds.size > 0 ? ` + ${assignState.selectedStudentIds.size} hand-picked` : ''}` : ''}</span>
        <button class="aspk-clear" onclick="assignClearAllStudents()">Clear all</button>
      </div>`
    : '';

  /* ─── Suggestions / empty state ─── */
  const renderTagRow = (tag) => {
    const kindLabel = tag.kind === 'course' ? 'Course' : tag.kind === 'class' ? 'Class' : tag.kind === 'grade' ? 'Grade' : 'Teacher';
    return `<button class="aspk-suggest-row aspk-suggest-tag" onclick="assignAddTag('${tag.id}')">
      <span class="aspk-suggest-tag-kind">${kindLabel}</span>
      <span class="aspk-suggest-tag-label">${tag.label}</span>
      <span class="aspk-suggest-tag-count">${tag.count} student${tag.count === 1 ? '' : 's'}</span>
      <span class="aspk-suggest-add">+ Add</span>
    </button>`;
  };
  const renderStudentRow = (s) => {
    const accel = s.tcapTestOverride?.kind === 'accelerated';
    const classTag = (s.tags || []).find(t => t.kind === 'class');
    const ctx = classTag?.label || '';
    return `<button class="aspk-suggest-row aspk-suggest-student" onclick="assignAddStudent('${s.id}')">
      <span class="aspk-suggest-name">${s.name}</span>
      <span class="aspk-suggest-grade">G${s.grade}</span>
      <span class="aspk-suggest-ctx">${ctx}</span>
      ${accel ? `<span class="aspk-accel-flag" title="Grade-${s.tcapTestOverride.from} student taking ${s.tcapTestOverride.to}">↗ Accelerated</span>` : ''}
      <span class="aspk-suggest-add">+ Add</span>
    </button>`;
  };

  /* Suggestions panel — appears ONLY when there is typed query text.
     Empty-state focus does not pop a panel (see assignSetSearch comment). */
  let suggestBody = '';
  if (assignState.suggestOpen) {
    const q = (assignState.searchQuery || '').trim();
    const sug = _assignSearchSuggestions();
    const totalHits = sug.tags.length + sug.students.length;
    if (totalHits === 0) {
      suggestBody = `<div class="aspk-suggest-empty">No tags or students match "${q}".</div>`;
    } else {
      const tagBlock = sug.tags.length > 0
        ? `<div class="aspk-suggest-group">
            <div class="aspk-suggest-group-head">Tags · ${sug.tags.length}</div>
            ${sug.tags.map(renderTagRow).join('')}
          </div>` : '';
      const studentBlock = sug.students.length > 0
        ? `<div class="aspk-suggest-group">
            <div class="aspk-suggest-group-head">Students · ${sug.students.length}</div>
            ${sug.students.map(renderStudentRow).join('')}
          </div>` : '';
      const selectAll = totalHits > 1
        ? `<div class="aspk-suggest-foot">
            <button class="aspk-suggest-bulk" onclick="assignSelectAllResults()">Select all results: ${totalHits}</button>
          </div>` : '';
      suggestBody = tagBlock + studentBlock + selectAll;
    }
  }

  return `
    <div class="aspk-search-wrap">
      <div class="aspk-search">
        <svg class="aspk-search-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search students, courses, periods, or teachers" value="${(assignState.searchQuery || '').replace(/"/g,'&quot;')}"
          oninput="assignSetSearch(this.value)"
          onfocus="assignFocusSearch()" />
        <span class="aspk-search-hint">e.g. "Miguel", "Algebra I", "Period 1"</span>
      </div>
      ${suggestBody ? `<div class="aspk-suggest">${suggestBody}</div>` : ''}
    </div>

    ${allSelectedChips ? `
      <div class="aspk-selected">
        <div class="aspk-selected-head">Currently selected</div>
        <div class="aspk-chip-strip">${allSelectedChips}</div>
        ${summary}
        ${accelFootnote}
      </div>
    ` : `
      <div class="aspk-empty-roster">
        <div class="aspk-empty-roster-icon">👥</div>
        <div class="aspk-empty-roster-title">No students selected yet</div>
        <div class="aspk-empty-roster-sub">Use the search above to add by tag (e.g. <b>Algebra I · Period 1</b>) or by individual name.</div>
      </div>
    `}
  `;
}
function _assignSectionProctor() {
  const on = !!assignState.antiCheatEnabled;
  const n = assignState.maxViolationCount | 0;
  return `
    <div class="assign-toggle-row">
      <div class="left">
        <div class="assign-section-title">Anti-cheating monitor</div>
        <div class="assign-section-desc">Detect tab-switches, copy/paste, and screen-share attempts.</div>
      </div>
      <span class="assign-switch ${on ? 'on' : ''}" onclick="assignToggleAntiCheat()" role="switch" aria-checked="${on}"></span>
    </div>
    ${on ? `
      <div>
        <div class="assign-section-title">Violation limit</div>
        <div class="assign-section-desc">Auto-submit after this many violations.</div>
      </div>
      <div class="assign-stepper">
        <button onclick="assignAdjustViolation(-1)" ${n <= 1 ? 'disabled' : ''}>−</button>
        <input type="text" inputmode="numeric" value="${n}" oninput="assignSetViolation(this.value)" />
        <button onclick="assignAdjustViolation(1)" ${n >= 10 ? 'disabled' : ''}>+</button>
      </div>
    ` : ''}
  `;
}
function assignNextStep() {
  // Final submit — pull every field straight off `assignState` (not the old
  // step machine, which the new accordion modal doesn't use).
  if (!(assignState.sessionName || '').trim()) {
    iteToast('Add an assignment name before assigning.', 'info');
    assignState.opens.name = true;
    renderAssignModal();
    return;
  }
  if ((assignState.timeLimit | 0) <= 0) {
    iteToast('Set a time limit before assigning.', 'info');
    assignState.opens.schedule = true;
    renderAssignModal();
    return;
  }
  const totalSelected = _assignTotalSelected();
  // Build a roster snapshot from the picker's effective student set
  // (selectedTagIds expanded ∪ selectedStudentIds, deduped). The new
  // session row in Monitor uses these names; ordering preserves the
  // seed roster's natural order so the demo rosters look stable.
  const effectiveIds = _assignEffectiveStudentIds();
  const rosterNames = [];
  (assignState.classes || []).forEach(c => c.students.forEach(s => {
    if (effectiveIds.has(s.id)) rosterNames.push(s.name);
  }));
  const sessionId = `sess-${assignState.assessmentType}-${Date.now()}`;
  const isTcap = assignState.assessmentType === 'tcap';
  const parentId = currentAssessmentDetailSessionId &&
    SESSION_DATA.find(s => s.id === currentAssessmentDetailSessionId && s.testType === assignState.assessmentType)
      ? currentAssessmentDetailSessionId
      : null;
  const window = assignState.scheduleType === 'SCHEDULED' && assignState.availableFromDate && assignState.availableUntilDate
    ? `${assignState.availableFromDate} · ${assignState.availableFromTime} - ${assignState.availableUntilTime}`
    : 'Apr 12, 2026 · 9:00 AM - 11:00 AM';
  const deliveryMode = assignState.scheduleType === 'LIVE' ? 'Live Mode' : 'Scheduled Mode';
  SESSION_DATA.unshift({
    id:sessionId,
    parentAssessmentId: parentId,
    testType:assignState.assessmentType,
    icon:assignState.assessmentType === 'sat' ? '📘' : assignState.assessmentType === 'act' ? '📝' : isTcap ? '🏛' : '📄',
    title:assignState.sessionName,
    teacher:isTcap ? 'Mr. Rivera' : 'Ms. Johnson',
    className:assignState.className,
    status:assignState.scheduleType === 'LIVE' ? 'Not Started' : 'Scheduled',
    progress:0,
    deliveryMode,
    window,
    timeLimitMinutes: assignState.timeLimit,
    gradingModel: assignState.gradingMethod === 'AUTO_AI'
      ? 'Auto-grade · instant'
      : 'Manual review · teacher grades all items',
    releaseRule:isTcap ? 'TCAP projections and practice plans release after teacher review.' : 'Teacher releases reports after final QA review.',
    reportState:'pending_release',
    explanationSources:isTcap ? ['Answer Key','Standards Crosswalk','Skill Tags','Cut Score Profile'] : ['Answer Key','Skill Tags','Teacher Override'],
    students: totalSelected || (rosterNames.length || 12),
    ready:0,inProgress:0,submitted:0,graded:0,pendingRelease:0,released:0,
    proctoring: { antiCheat: assignState.antiCheatEnabled, maxViolations: assignState.antiCheatEnabled ? assignState.maxViolationCount : 0 },
    studentRows: rosterNames.length
      ? rosterNames.slice(0,8).map(name => ({
          name, grade: isTcap ? '5' : '11', score: '—', status: 'Not Started',
          progress: '0 / 0', lastActivity: 'Waiting for student to join'
        }))
      : buildPlaceholderRoster(assignState.assessmentType, assignState.className, Math.min(4, totalSelected || 4))
  });
  closeAssignModal();
  currentSessionId = sessionId;
  if (parentId) {
    openAssessmentDetail(parentId);
  } else {
    nav('session-detail');
  }
}
function assignPrevStep() {
  // Legacy stub — kept so any old code paths that still call it don't error.
  // The new accordion modal has no Prev/Next steps.
