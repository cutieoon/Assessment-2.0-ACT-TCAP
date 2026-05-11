// @ts-nocheck
// Phase-2 slice: lines 6211-6837 of original src/app.ts

// ─────────────────────────────────────────────────────────────────────────────
// Student Profiles (IEP / 504 / ELL / Gifted accommodations + Extended Time multiplier)
// ─────────────────────────────────────────────────────────────────────────────
// Owns the per-student accommodations record. The Extended Time multiplier here
// auto-applies to EVERY Subpart of EVERY TCAP assignment for this student
// (per-Subpart timer = blueprint minutes × multiplier, NOT a single lump-sum).
// The multiplier is configurable (1.0 / 1.2 / 1.5 / 2.0 / custom) — TDOE's 1.2x
// is just the recommended default, NOT a hard-coded constant.
const STUDENT_PROFILES = [
  { id:'stu-001', name:'Aaliyah J.',  grade:5, homeroom:'Period 2', flags:[],            extendedTimeMultiplier:1.0, extendedTimeReason:null,    notes:'' },
  { id:'stu-002', name:'Daniela R.',  grade:5, homeroom:'Period 2', flags:['IEP'],       extendedTimeMultiplier:1.2, extendedTimeReason:'IEP',   notes:'Reading IEP renewed 2025-03; ext-time per IEP team recommendation.' },
  { id:'stu-003', name:'Jamila B.',   grade:5, homeroom:'Period 2', flags:['504'],       extendedTimeMultiplier:1.5, extendedTimeReason:'504',   notes:'Anxiety accommodation; quiet test setting if available.' },
  { id:'stu-004', name:'Gabriel P.',  grade:5, homeroom:'Period 2', flags:['ELL','504'], extendedTimeMultiplier:2.0, extendedTimeReason:'ELL',   notes:'Year 2 ELL; bilingual glossary allowed for non-ELA subjects.' },
  { id:'stu-005', name:'Marcus J.',   grade:8, homeroom:'Period 5', flags:['Gifted'],    extendedTimeMultiplier:1.0, extendedTimeReason:null,    notes:'' },
  { id:'stu-006', name:'Sofia G.',    grade:7, homeroom:'Period 1', flags:['IEP','ELL'], extendedTimeMultiplier:1.5, extendedTimeReason:'IEP',   notes:'Combined IEP + ELL accommodations.' },
  { id:'stu-007', name:'Liam C.',     grade:4, homeroom:'Period 2', flags:[],            extendedTimeMultiplier:1.0, extendedTimeReason:null,    notes:'' },
  { id:'stu-008', name:'Maya R.',     grade:6, homeroom:'Period 3', flags:['IEP'],       extendedTimeMultiplier:1.2, extendedTimeReason:'IEP',   notes:'Math IEP — extended time on Math SP1/SP2/SP3.' }
];
const ACCOMMODATION_FLAG_OPTIONS = [
  { id:'IEP',    label:'IEP',    color:'#5b21b6', bg:'#f5f3ff', border:'#ddd6fe' },
  { id:'504',    label:'504',    color:'#0369a1', bg:'#eff6ff', border:'#bfdbfe' },
  { id:'ELL',    label:'ELL',    color:'#a16207', bg:'#fffbeb', border:'#fde68a' },
  { id:'Gifted', label:'Gifted', color:'#047857', bg:'#ecfdf5', border:'#a7f3d0' }
];
const EXT_TIME_PRESETS = [
  { value:1.0, label:'No extension',  desc:'Standard time' },
  { value:1.2, label:'×1.2',          desc:'TDOE default for IEP/504' },
  { value:1.5, label:'×1.5',          desc:'Common ELL / 504 accommodation' },
  { value:2.0, label:'×2.0',          desc:'Heavier IEP plans' }
];
function getStudentProfile(id) { return STUDENT_PROFILES.find(p => p.id === id); }
function flagPill(flagId) {
  const f = ACCOMMODATION_FLAG_OPTIONS.find(o => o.id === flagId);
  if (!f) return '';
  return `<span style="font-size:9.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:${f.color};background:${f.bg};border:1px solid ${f.border};padding:2px 7px;border-radius:999px;margin-right:4px">${f.label}</span>`;
}
function extPill(mul) {
  if (!mul || mul <= 1.0) return `<span style="font-size:11px;color:#71717a">Standard</span>`;
  return `<span style="font-size:10.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;padding:2px 8px;border-radius:999px">×${mul.toFixed(1)} ext-time</span>`;
}

let pendingExtendedTime = { studentName:null, percent:100 };
function openExtendedTimeModal(studentName) {
  const session = getSession(currentSessionId);
  const row = (session.studentRows || []).find(s => s.name === studentName);
  pendingExtendedTime = { studentName, percent: row?.extendedTimePct || 100 };
  stuModal({
    icon:'⏱',
    iconType:'info',
    title:`Extend time for ${studentName}?`,
    body:extendedTimeBody(session, studentName),
    confirmText:'Apply extension',
    onConfirm:()=>confirmExtendedTime()
  });
}
function extendedTimeBody(session, studentName) {
  const extra = Math.max(0, pendingExtendedTime.percent - 100);
  const base = session.timeLimitMinutes || 90;
  const total = Math.round(base * pendingExtendedTime.percent / 100);
  const isAct = session.testType === 'act';
  const scopeCopy = isAct
    ? 'This applies to this student only. Remaining ACT section timers use the adjusted time; completed/submitted sections are not recalculated.'
    : 'This applies to this student only. It affects the assessment timer, not the scheduled window.';
  return `<p style="margin:0">${scopeCopy}</p>
    <div class="stat">
      <div class="stat-item"><span class="val">+${extra}%</span><span class="lbl">Extension</span></div>
      <div class="stat-item"><span class="val">${pendingExtendedTime.percent}%</span><span class="lbl">Time allowed</span></div>
      <div class="stat-item"><span class="val">${total}m</span><span class="lbl">${isAct ? 'Core time' : 'Total time'}</span></div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;margin-top:14px">
      <button class="modal-cancel" onclick="adjustExtendedTime(-10)" style="border:none;padding:9px 14px;border-radius:10px;font-weight:800;cursor:pointer">-10%</button>
      <div id="extendedTimeValue" style="flex:1;text-align:center;font-size:18px;font-weight:900;color:#18181b">${pendingExtendedTime.percent}%</div>
      <button class="modal-cancel" onclick="adjustExtendedTime(10)" style="border:none;padding:9px 14px;border-radius:10px;font-weight:800;cursor:pointer">+10%</button>
    </div>
    <p style="margin:12px 0 0;font-size:12px;color:#71717a">Matches old Assessment: +10% steps, max +200%; base is test duration, not schedule window. Student: <b>${studentName}</b>.</p>`;
}
function adjustExtendedTime(delta) {
  pendingExtendedTime.percent = Math.max(100, Math.min(300, pendingExtendedTime.percent + delta));
  const session = getSession(currentSessionId);
  document.getElementById('stuModalBody').innerHTML = extendedTimeBody(session, pendingExtendedTime.studentName);
}
function confirmExtendedTime() {
  const session = getSession(currentSessionId);
  const row = (session.studentRows || []).find(s => s.name === pendingExtendedTime.studentName);
  if (row) {
    row.extendedTimePct = pendingExtendedTime.percent;
    row.lastActivity = pendingExtendedTime.percent > 100
      ? `Extended time set to ${pendingExtendedTime.percent}%`
      : 'Standard time restored';
    if (session.testType === 'act') {
      currentLaunchSessionId = session.id;
      currentLaunchStudentName = row.name;
    }
  }
  session.status = session.status === 'Completed' ? 'Extended' : session.status;
  renderSessionDetail();
}
function canExtendStudentRow(session, stu, monitorClosed) {
  if (!session || monitorClosed) return false;
  if (session.testType === 'tutor') return false;
  const status = String(stu?.status || '').toLowerCase();
  return !/(graded|submitted|completed|expired|auto-submit|released)/.test(status);
}
function toggleSessionStudentMoreMenu(studentName, event) {
  if (event) event.stopPropagation();
  const nextName = openSessionMoreStudentName === studentName ? null : studentName;
  closeSessionStudentMoreMenu();
  openSessionMoreStudentName = nextName;
  if (!nextName) return;
  const id = sessionMoreMenuId(studentName);
  const menu = document.getElementById(id);
  if (menu) menu.classList.add('open');
  setTimeout(() => document.addEventListener('click', closeSessionStudentMoreMenu, { once:true }), 0);
}
function closeSessionStudentMoreMenu() {
  document.querySelectorAll('.session-more-menu.open').forEach(menu => menu.classList.remove('open'));
  openSessionMoreStudentName = null;
}
function sessionMoreMenuId(studentName) {
  return 'sessMore-' + String(studentName || 'student').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
}
function openExtendedTimeFromMore(studentName) {
  closeSessionStudentMoreMenu();
  openExtendedTimeModal(studentName);
}
function openRemoveStudentFromMore(studentName) {
  closeSessionStudentMoreMenu();
  openRemoveStudentModal(studentName);
}
function yesNoPill(flag) {
  return flag ? 'Enabled' : 'Disabled';
}
function testPageForType(type) {
  return ({ generic:'stu-generic', act:'stu-act', sat:'stu-sat' })[type] || 'stu-generic';
}
function reportPageForType(type) {
  return ({ act:'stu-act-report', sat:'stu-sat-report' })[type];
}
function getDefaultReportSessionId(type) {
  return SESSION_DATA.find(s => s.testType === type && s.reportState === 'released')?.id
    || SESSION_DATA.find(s => s.testType === type)?.id
    || currentLaunchSessionId;
}
function openStudentReport(type) {
  reportEdgePreview = null;
  currentReportSessionId = getDefaultReportSessionId(type);
  nav(reportPageForType(type));
}
function previewReportState(type, state) {
  currentReportSessionId = `sess-${type}-1`;
  reportEdgePreview = { type, state };
  keepReportEdgePreview = true;
  switchRole('student', true);
  nav(reportPageForType(type));
}
function openAssessmentList() {
  nav('homepage');
}
function backFromMonitor() {
  const session = SESSION_DATA.find(s => s.id === currentSessionId);
  if (session) {
    const parentId = session.parentAssessmentId || session.id;
    openAssessmentDetail(parentId);
    return;
  }
  nav('homepage');
}
function openFlowsPage(flowId) {
  if (flowId) currentFlowId = flowId;
  switchRole('teacher', true);
  nav('flows');
}
function openTagInsightsPage() {
  switchRole('teacher', true);
  nav('tag-insights');
}

// ═══════════════════════════════════════════════════════════════
// ITEM TYPES LIBRARY — full catalog of question types for TCAP / ACT
// Phase tags: 'must' (MVP must-have), 'nice' (MVP nice-to-have), 'phase2'
// ═══════════════════════════════════════════════════════════════
let _itlFilter = 'all';
function openItemTypesLibrary(filter) {
  if (filter) _itlFilter = filter;
  switchRole('teacher', true);
  nav('item-types');
}

const ITEM_TYPES = [
  // ─── MVP must-have ───
  {
    id:'mc', name:'Multiple Choice', icon:'📝', phase:'must',
    sub:'Single Answer (one correct), Multiple Answers (select all), or True / False (binary). Highest-volume item across TCAP, ACT, SAT.',
    subjects:['ELA','Math','Science','SS'], standards:['TCAP','ACT','SAT'],
    scoring:'Auto · 1 pt', kira:'Supported',
    teacher:`
      <div class="mini-tabs"><span class="mini-tab active">◉ Single Answer</span><span class="mini-tab">☑ Multiple Answers</span><span class="mini-tab">⚖ True / False</span></div>
      <div class="editor-row"><span class="key">Stem</span><span>Which fraction is equivalent to <b>2/4</b>?</span></div>
      <div class="mini-row-grp">
        <div class="editor-row correct"><span class="key">A ✓</span><span>1/2</span></div>
        <div class="editor-row"><span class="key">B</span><span>1/3</span></div>
        <div class="editor-row"><span class="key">C</span><span>2/3</span></div>
        <div class="editor-row"><span class="key">D</span><span>3/4</span></div>
      </div>
      <div class="badge-row">⚙️ Shuffle · Lockdown · Eliminator tool · T/F sub-variant</div>`,
    student:`
      <div class="stem">Which fraction is equivalent to <b>2/4</b>?</div>
      <div class="opt selected"><span class="marker">●</span><span><b>A.</b> 1/2</span></div>
      <div class="opt"><span class="marker"></span><span><b>B.</b> 1/3</span></div>
      <div class="opt"><span class="marker"></span><span><b>C.</b> 2/3</span></div>
      <div class="opt"><span class="marker"></span><span><b>D.</b> 3/4</span></div>`
  },
  {
    id:'twopart', name:'Two-Part / Evidence-Based', icon:'🧬', phase:'must',
    sub:'Signature TCAP ELA item: Part A = inference (MC), Part B = textual evidence (MS). Scored as a unit.',
    subjects:['ELA','SS'], standards:['TCAP','SBAC','PARCC'],
    scoring:'Auto · both parts must be correct (0/1)', kira:'NOT supported · build needed',
    teacher:`
      <div class="editor-row"><span class="key">Passage</span><span style="font-style:italic;color:#71717a">Excerpt from "The Light Outside" (linked)</span></div>
      <div class="editor-row"><span class="key">Part A</span><span>What is the central theme? <i>(MC, 1 correct)</i></span></div>
      <div class="editor-row correct"><span class="key">A ✓</span><span>Resilience in the face of loss</span></div>
      <div class="editor-row"><span class="key">Part B</span><span>Which sentences support the answer to A? <i>(MS)</i></span></div>
      <div class="editor-row correct"><span class="key">☑ s2</span><span>"She kept walking…"</span></div>
      <div class="editor-row correct"><span class="key">☑ s5</span><span>"Even the dark…"</span></div>
      <div class="editor-row"><span class="key">⚙️</span><span>Both parts must be correct to score</span></div>`,
    student:`
      <div class="twopart">
        <div class="pt-label">Part A</div>
        <div class="stem">What is the central theme of the passage?</div>
        <div class="opt selected"><span class="marker">●</span><span><b>A.</b> Resilience in the face of loss</span></div>
        <div class="opt"><span class="marker"></span><span><b>B.</b> The thrill of adventure</span></div>
        <div class="pt-label" style="margin-top:6px">Part B — supporting evidence</div>
        <div class="opt square selected"><span class="marker">✓</span><span>"She kept walking…"</span></div>
        <div class="opt square"><span class="marker"></span><span>"The garden was bright…"</span></div>
        <div class="opt square selected"><span class="marker">✓</span><span>"Even the dark…"</span></div>
      </div>`
  },
  {
    id:'fib', name:'Fill in the Blank', icon:'✏️', phase:'must',
    sub:'Short text input with accepted answer list. Synonym matching + case insensitivity.',
    subjects:['ELA','Math','Science'], standards:['TCAP','ACT'],
    scoring:'Auto · pattern match', kira:'Supported',
    teacher:`
      <div class="editor-row"><span class="key">Stem</span><span>The capital of Tennessee is <span class="blank">_____</span>.</span></div>
      <div class="editor-row correct"><span class="key">Match 1</span><span>Nashville</span></div>
      <div class="editor-row correct"><span class="key">Match 2</span><span>nashville</span></div>
      <div class="badge-row">⚙️ Case insensitive · Trim whitespace</div>`,
    student:`
      <div class="stem">The capital of Tennessee is <span class="blank" style="min-width:90px;color:#7c3aed">Nashville</span>.</div>
      <div class="ans-input">Type your answer here…</div>`
  },
  {
    id:'gridin', name:'Grid-In / Numeric', icon:'🔢', phase:'must',
    sub:'Bubble-grid numeric entry, fractions, decimals. Required by TCAP Math constructed-response items.',
    subjects:['Math'], standards:['TCAP','SAT'],
    scoring:'Auto · numeric tolerance', kira:'Supported',
    teacher:`
      <div class="editor-row"><span class="key">Stem</span><span>If 3x + 5 = 20, what is x?</span></div>
      <div class="mini-row-grp">
        <div class="editor-row correct"><span class="key">Answer</span><span>5 · tolerance ±0.01</span></div>
        <div class="editor-row"><span class="key">Range</span><span>optional, e.g. [3, 5]</span></div>
        <div class="editor-row"><span class="key">Unit</span><span>none · Calculator: <b>Basic</b></span></div>
      </div>
      <div class="mini-bubble-grid">
        ${[' ',' ',' ','5'].map(v=>`
          <div class="gi-display ${v===' '?'empty':''}">${v}</div>`).join('')}
        ${[0,1,2,3,4,5,6,7,8,9].flatMap(d => [' ',' ',' ','5'].map(v => `<div class="gi-bubble ${d==parseInt(v)?'fill':''}">${d}</div>`)).join('')}
      </div>
      <div class="badge-row">SAT-style bubble grid · 4 cols · accept range / unit / calc</div>`,
    student:`
      <div class="stem" style="text-align:center">If 3x + 5 = 20, x = ?</div>
      <div class="gridin">
        ${[' ',' ','5'].map(v=>`<div class="gi-col">
          <div class="gi-display ${v===' '?'empty':''}">${v}</div>
          ${[0,1,2,3,4,5,6,7,8,9].map(d=>`<div class="gi-bubble ${d==parseInt(v)?'fill':''}">${d}</div>`).join('')}
        </div>`).join('')}
      </div>`
  },
  {
    id:'cr', name:'Constructed Response (Short)', icon:'📝', phase:'must',
    sub:'1–3 sentence open response. Rubric-scored 0–4 by AI grader + teacher review.',
    subjects:['ELA','Math','Science','SS'], standards:['TCAP','ACT'],
    scoring:'AI rubric + teacher override · 0–4 pts', kira:'Supported (FREE_RESPONSE_SHORT)',
    teacher:`
      <div class="editor-row"><span class="key">Stem</span><span>Explain why mitochondria are called the "powerhouse of the cell."</span></div>
      <div class="rubric">
        <div class="r-line"><span>Identifies ATP production</span><span>2pt</span></div>
        <div class="r-line"><span>Mentions cellular respiration</span><span>1pt</span></div>
        <div class="r-line"><span>Uses textual evidence</span><span>1pt</span></div>
      </div>
      <div class="badge-row">🤖 AI scoring on · teacher review queue</div>`,
    student:`
      <div class="stem">Explain why mitochondria are called the "powerhouse of the cell."</div>
      <div class="essay-area">
        <div class="row1">Mitochondria produce ATP through cellular respiration<span class="cur"></span></div>
        <div class="meta"><span>Auto-saved</span><span>16 / 200 words</span></div>
      </div>`
  },
  {
    id:'essay', name:'Writing Prompt / Essay', icon:'📄', phase:'must',
    sub:'Long-form writing with sources, planning checklist, and rubric. TCAP ELA writing prompt.',
    subjects:['ELA','SS'], standards:['TCAP','ACT-Writing'],
    scoring:'AI rubric (4 traits) + teacher · 0–10 pts', kira:'Supported (ESSAY)',
    teacher:`
      <div class="editor-row"><span class="key">Prompt</span><span>Write an opinion essay: Should schools require a 4-day week?</span></div>
      <div class="editor-row"><span class="key">Sources</span><span>2 articles attached</span></div>
      <div class="rubric">
        <div class="r-line"><span>Focus & purpose</span><span>4pt</span></div>
        <div class="r-line"><span>Evidence</span><span>3pt</span></div>
        <div class="r-line"><span>Organization</span><span>2pt</span></div>
        <div class="r-line"><span>Conventions</span><span>1pt</span></div>
      </div>
      <div class="badge-row">⚙️ Min 250 words · planner enabled</div>`,
    student:`
      <div class="stem">Should schools require a 4-day week? Use the sources to support your view.</div>
      <div class="essay-area" style="min-height:84px">
        <div class="row1">A four-day school week could give students more time to rest, but it also raises concerns about<span class="cur"></span></div>
        <div class="meta"><span>📋 Planner · 2/4 sources cited</span><span>87 / 250+ words</span></div>
      </div>`
  },
  {
    id:'editing', name:'Editing Task', icon:'✍️', phase:'must',
    sub:'Underlined phrases inside a passage. Each opens a dropdown with "NO CHANGE" + 3 alternatives — student decides whether to revise. Core item of TCAP ELA Subpart 4 (Language conventions); also used by ACT English.',
    subjects:['ELA'], standards:['TCAP','ACT-English','SBAC'],
    scoring:'Auto · per-edit match', kira:'NOT supported · build needed',
    teacher:`
      <div class="mini-tabs"><span class="mini-tab active">✎ Inline edits</span><span class="mini-tab">📝 Whole-sentence revise</span></div>
      <div class="editor-row"><span class="key">Passage</span><span style="line-height:1.7">The team <span class="mini-marker">{ed:1}</span> the championship last year, and they hope <span class="mini-marker">{ed:2}</span> repeat the win this season.</span></div>
      <div class="mini-row-grp">
        <div class="editor-row correct"><span class="key">{ed:1} ✓</span><span><b>NO CHANGE</b> · "won" · "win" · "winning"</span></div>
        <div class="editor-row correct"><span class="key">{ed:2} ✓</span><span><b>"to"</b> · NO CHANGE ("for") · "of" · "with"</span></div>
      </div>
      <div class="badge-row">{ed:N} marker syntax · 4 options per edit · NO CHANGE always option A · per-edit partial credit</div>`,
    student:`
      <div class="stem">Read the passage. For each underlined phrase, decide if it needs editing.</div>
      <div class="its-passage" style="max-height:none">
        <p>The team <span class="ed set" style="display:inline-flex;align-items:center;gap:4px;background:#ede9fe;border:1.5px solid #7c3aed;border-radius:6px;padding:2px 8px;color:#5b21b6;font-size:13px;font-weight:600"><span style="background:#7c3aed;color:#fff;border-radius:3px;font-size:9px;padding:1px 5px;margin-right:2px">1</span>won</span> the championship last year, and they hope <span class="ed empty" style="display:inline-flex;align-items:center;gap:4px;background:#fff;border:1.5px dashed #c4b5fd;border-radius:6px;padding:2px 8px;color:#7c3aed;font-size:13px;font-weight:600;font-style:italic"><span style="background:#a78bfa;color:#fff;border-radius:3px;font-size:9px;padding:1px 5px;margin-right:2px;font-style:normal">2</span>for ▾</span> repeat the win this season.</p>
      </div>`
  },

  // ─── MVP nice-to-have ───
  {
    id:'hottext', name:'Hot Text', icon:'🖍️', phase:'nice',
    sub:'Click sentences/words in passage as the answer. Common in TCAP ELA evidence selection.',
    subjects:['ELA','SS'], standards:['TCAP','SBAC'],
    scoring:'Auto · exact selection match', kira:'NOT supported · build needed',
    teacher:`
      <div class="mini-tabs"><span class="mini-tab active">Sentence</span><span class="mini-tab">Word</span><span class="mini-tab">Phrase</span><span class="mini-badge-new">In-place 3-state</span></div>
      <div class="editor-row"><span class="key">Prompt</span><span>Click the sentence(s) that support the main idea.</span></div>
      <div class="mini-passage">
        <span class="ht-tok ht-sel">Many cities have grown rapidly.</span>
        <span class="ht-tok ht-correct">This growth strains water and power supplies.</span>
        <span class="ht-tok ht-sel">Some governments are responding with new policies.</span>
        <span class="ht-tok ht-none">Engineers also work on grid technologies.</span>
      </div>
      <div class="badge-row">3 states · click any token to cycle: decoration → selectable → correct ✓</div>`,
    student:`
      <div class="stem">Click the sentence that best supports the main idea.</div>
      <div class="hottext">
        <span class="hot">Many cities have grown rapidly.</span>
        <span class="hot selected">This growth strains water and power supplies.</span>
        <span class="hot">Some governments are responding with new policies.</span>
      </div>`
  },

  // ─── Phase 2 ───
  {
    id:'dragdrop', name:'Drag & Drop / Gap Match', icon:'🧲', phase:'phase2',
    sub:'Drag terms into correct slots in a sentence, diagram, or sequence. Used in Math vocab + Science labels.',
    subjects:['ELA','Math','Science'], standards:['TCAP','PARCC'],
    scoring:'Auto · per-slot match', kira:'NOT supported · Phase 2',
    teacher:`
      <div class="mini-tabs"><span class="mini-tab active">📝 Sentence</span><span class="mini-tab">🪣 Bucket</span><span class="mini-tab">⇄ Match</span><span class="mini-tab">🖼 Image</span></div>
      <div class="editor-row"><span class="key">Stem</span><span>Drag the correct term into each blank.</span></div>
      <div class="gapline">A <span class="gapslot">producer</span> makes its own food, while a <span class="gapslot">consumer</span> eats other organisms.</div>
      <div class="dragsource"><span class="dragchip placed">producer</span><span class="dragchip placed">consumer</span><span class="dragchip">decomposer</span><span class="dragchip">parasite</span></div>
      <div class="badge-row">4 variants · each saves its own state</div>`,
    student:`
      <div class="stem">Drag each term into the correct blank.</div>
      <div class="gapline">A <span class="gapslot">producer</span> makes its own food, while a <span class="gapslot empty">drop here</span> eats other organisms.</div>
      <div class="dragsource"><span class="dragchip placed">producer</span><span class="dragchip">consumer</span><span class="dragchip">decomposer</span><span class="dragchip">parasite</span></div>`
  },
  {
    id:'inline', name:'Inline Choice (Cloze)', icon:'🔽', phase:'phase2',
    sub:'Inline dropdown menus inside a sentence. Compact alternative to drag-drop for grammar/vocab.',
    subjects:['ELA','Math'], standards:['TCAP','SBAC'],
    scoring:'Auto · per-dropdown match', kira:'NOT supported · Phase 2',
    teacher:`
      <div class="editor-row"><span class="key">Passage</span><span>The dog <span class="mini-marker">{dd:1}</span> when the door opened, and the cat <span class="mini-marker">{dd:2}</span> away.</span></div>
      <div class="mini-row-grp">
        <div class="editor-row correct"><span class="key">{dd:1} ✓</span><span><b>barked</b> · bark · barking</span></div>
        <div class="editor-row correct"><span class="key">{dd:2} ✓</span><span><b>ran</b> · run · running</span></div>
      </div>
      <div class="badge-row">{dd:N} marker syntax · auto-syncs dropdowns to passage</div>`,
    student:`
      <div class="stem">Choose the correct word for each blank.</div>
      <div class="inline-text">The dog <span class="dd">barked</span> when the door <span class="dd">opened</span>, and the cat <span class="dd">ran</span> away.</div>`
  },
  {
    id:'matrix', name:'Matrix / Match Tabular', icon:'📊', phase:'phase2',
    sub:'Match items in rows × columns (e.g., compare features). Used in Science classification + ELA True/False.',
    subjects:['ELA','Math','Science','SS'], standards:['TCAP','PARCC'],
    scoring:'Auto · per-cell match', kira:'NOT supported · Phase 2',
    teacher:`
      <div class="mini-tabs"><span class="mini-tab active">◉ One per row</span><span class="mini-tab">☑ Multi per row</span><span class="mini-tab">⇄ Match pairs</span></div>
      <div class="editor-row"><span class="key">Prompt</span><span>Mark whether each statement is True / False / Not stated.</span></div>
      <div class="matrix">
        <div></div><div class="mh">T</div><div class="mh">F</div><div class="mh">N/S</div>
        <div class="mr">Photosynthesis releases O₂</div><div class="mc checked"><div class="o"></div></div><div class="mc"><div class="o"></div></div><div class="mc"><div class="o"></div></div>
        <div class="mr">Plants need sunlight at night</div><div class="mc"><div class="o"></div></div><div class="mc checked"><div class="o"></div></div><div class="mc"><div class="o"></div></div>
      </div>
      <div class="badge-row">3 modes · per-row partial credit</div>`,
    student:`
      <div class="stem">Mark each statement.</div>
      <div class="matrix">
        <div></div><div class="mh">T</div><div class="mh">F</div><div class="mh">N/S</div>
        <div class="mr">Photosynthesis releases O₂</div><div class="mc checked"><div class="o"></div></div><div class="mc"><div class="o"></div></div><div class="mc"><div class="o"></div></div>
        <div class="mr">Plants need sunlight at night</div><div class="mc"><div class="o"></div></div><div class="mc checked"><div class="o"></div></div><div class="mc"><div class="o"></div></div>
        <div class="mr">All plants are green</div><div class="mc"><div class="o"></div></div><div class="mc"><div class="o"></div></div><div class="mc checked"><div class="o"></div></div>
      </div>`
  },
  {
    id:'eq', name:'Equation Editor', icon:'∑', phase:'phase2',
    sub:'Math expression input with palette for fractions, exponents, roots. Equivalence-based grading.',
    subjects:['Math'], standards:['TCAP','SAT'],
    scoring:'Auto · symbolic equivalence (CAS)', kira:'NOT supported · Phase 2',
    teacher:`
      <div class="mini-tabs"><span class="mini-tab">Greek</span><span class="mini-tab active">Operators</span><span class="mini-tab">Functions</span><span class="mini-tab">Templates</span></div>
      <div class="editor-row"><span class="key">Stem</span><span>Solve for x: <b>2x² − 8 = 0</b></span></div>
      <div class="mini-row-grp">
        <div class="editor-row correct"><span class="key">≡ form 1</span><span>x = ±2</span></div>
        <div class="editor-row correct"><span class="key">≡ form 2</span><span>{-2, 2}</span></div>
        <div class="editor-row correct"><span class="key">≡ form 3</span><span>x = 2 or x = -2</span></div>
      </div>
      <div class="mini-eq-pad">
        ${['+','−','×','÷','=','≠','≤','≥'].map(s=>`<div class="k">${s}</div>`).join('')}
      </div>
      <div class="mini-eq-verdict">✓ Equivalent — CAS auto-grades correct</div>`,
    student:`
      <div class="stem">Solve for x.</div>
      <div class="eq-input">x = ±2</div>
      <div class="eq-pad">
        <div class="k">x²</div><div class="k">√x</div><div class="k">⁄</div><div class="k">π</div><div class="k">±</div>
        <div class="k">7</div><div class="k">8</div><div class="k">9</div><div class="k">+</div><div class="k">−</div>
        <div class="k">4</div><div class="k">5</div><div class="k">6</div><div class="k">×</div><div class="k">÷</div>
      </div>`
  },
  {
    id:'graph', name:'Graphing / Number Line', icon:'📈', phase:'must',
    sub:'Plot points, lines, regions on a coordinate plane or number line. High-frequency in TCAP Math Subparts 2 & 3 (calculator-allowed) for grades 6–8.',
    subjects:['Math'], standards:['TCAP','SBAC'],
    scoring:'Auto · coordinate match (with tolerance)', kira:'NOT supported · build needed',
    teacher:`
      <div class="mini-tabs"><span class="mini-tab">·</span><span class="mini-tab active">╱ Line</span><span class="mini-tab">∪</span><span class="mini-tab">▦</span><span class="mini-tab">═</span><span class="mini-tab">≥</span></div>
      <div class="editor-row"><span class="key">Stem</span><span>Plot the line y = x + 1</span></div>
      <div class="editor-row correct"><span class="key">Answer</span><span>2 points: (0,1) and (2,3) · slope 1</span></div>
      <div class="badge-row">6 graph types · point / line / parabola / region / number-line / inequality</div>`,
    student:`
      <div class="stem">Plot the line y = x + 1.</div>
      <div class="graph">
        <div class="axis-x"></div><div class="axis-y"></div>
        <div class="ln" style="left:50%;top:42%;width:48%;transform:rotate(-25deg)"></div>
        <div class="pt" style="left:50%;top:42%"></div>
        <div class="pt" style="left:75%;top:30%"></div>
      </div>`
  },
  {
    id:'hotspot', name:'Hot Spot (Image)', icon:'🎯', phase:'phase2',
    sub:'Click on regions in an image. Used in Science (anatomy, maps) and Geography.',
    subjects:['Science','SS'], standards:['TCAP'],
    scoring:'Auto · region match', kira:'NOT supported · Phase 2',
    teacher:`
      <div class="mini-tabs"><span class="mini-tab active">▭ Rect</span><span class="mini-tab">⬡ Polygon</span></div>
      <div class="editor-row"><span class="key">Stem</span><span>Click on the mitochondria in the cell.</span></div>
      <div class="mini-svg-stage">
        <div class="ph">🖼 plant_cell.png</div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="30" y="25" width="25" height="35" fill="rgba(22,163,74,.22)" stroke="#15803d" stroke-width=".6" rx="2"/>
          <foreignObject x="30" y="20" width="50" height="6"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:5px;font-weight:700;color:#fff;background:#16a34a;padding:0 2px;border-radius:2px;display:inline-block">✓ Mitochondria</div></foreignObject>
          <polygon points="60,28 78,32 76,46 64,48" fill="rgba(168,85,247,.18)" stroke="#7c3aed" stroke-width=".6" stroke-dasharray=".8,.6"/>
          <foreignObject x="60" y="22" width="50" height="6"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:5px;font-weight:700;color:#fff;background:#7c3aed;padding:0 2px;border-radius:2px;display:inline-block">Chloroplast</div></foreignObject>
        </svg>
      </div>
      <div class="badge-row">Rect + Polygon · region naming · max selections</div>`,
    student:`
      <div class="stem">Click on the mitochondria.</div>
      <div class="hotspot"><div class="reg" style="left:30%;top:30%;width:24%;height:45%"></div></div>`
  },
  {
    id:'audio', name:'Listening / Audio', icon:'🎧', phase:'phase2',
    sub:'Audio prompt + MC/MS or short response. Required for ELL and ELA listening standards.',
    subjects:['ELA','ELL'], standards:['TCAP','WIDA'],
    scoring:'Auto · MC/MS · or rubric for response', kira:'NOT supported · Phase 2',
    teacher:`
      <div class="editor-row"><span class="key">Audio</span><span>📎 dialogue_classroom.mp3 · 1:24</span></div>
      <div class="mini-wave">
        ${[18,32,45,58,40,62,35,52,48,55,38,28,44,50,35,40,52,30,45,38,52,40,28,18].map(h=>`<span class="b" style="height:${h}%"></span>`).join('')}
      </div>
      <div class="mini-segs"><span class="s">0:00–0:32 Anna asks</span><span class="s">0:32–1:00 Age</span><span class="s">1:00–1:24 Recommend</span></div>
      <div class="mini-tabs" style="margin-top:6px"><span class="mini-tab active">◉ MC</span><span class="mini-tab">☑ MS</span><span class="mini-tab">⌐ FIB</span><span class="mini-tab">✎ CR</span></div>
      <div class="editor-row"><span class="key">Q1</span><span>What does Anna want? <i>(follow-up: MC)</i></span></div>
      <div class="badge-row">Waveform · 3 segments · 4 follow-up types</div>`,
    student:`
      <div class="stem">Listen, then answer.</div>
      <div class="audio-player"><div class="play">▶</div><div class="wave"></div><div class="time">0:32 / 1:24</div></div>
      <div class="opt"><span class="marker"></span><span><b>A.</b> A book about birds</span></div>
      <div class="opt selected"><span class="marker">●</span><span><b>B.</b> Help finding a book</span></div>
      <div class="opt"><span class="marker"></span><span><b>C.</b> Quiet space to study</span></div>`
  },
];

const ITL_PHASES = [
  {id:'must',  label:'MVP must-have',     color:'#16a34a', desc:'Core item types required for TCAP pilot launch (Aug 3, 2025)'},
  {id:'nice',  label:'MVP nice-to-have',  color:'#f59e0b', desc:'Designed for pilot, ship if engineering capacity allows'},
  {id:'phase2',label:'Phase 2 backlog',   color:'#6b7280', desc:'Designed in prototype · build after pilot v1 ships'},
];

function renderItemTypesLibrary() {
  const isUnsupported = (t) => t.kira && /not\s*supported/i.test(t.kira);
  const counts = {must:0, nice:0, phase2:0, unsupported:0};
  ITEM_TYPES.forEach(t => {
    counts[t.phase]++;
    if (isUnsupported(t)) counts.unsupported++;
  });
  let filtered;
  if (_itlFilter === 'all')              filtered = ITEM_TYPES;
  else if (_itlFilter === 'unsupported') filtered = ITEM_TYPES.filter(isUnsupported);
  else                                   filtered = ITEM_TYPES.filter(t => t.phase === _itlFilter);
  const visibleTypes = ITEM_TYPES;

  let sections;
  if (_itlFilter === 'unsupported') {
    sections = filtered.length === 0 ? '' : `
      <div class="itl-section">
        <div class="itl-section-head">
          <span class="dot" style="background:#dc2626"></span>
          <h3>Not supported by Kira yet</h3>
          <span class="cnt">${filtered.length}</span>
          <span class="note">Kira authoring API can't render these item types today. Each one is designed up front in this prototype so engineering has a spec when capacity opens up.</span>
        </div>
        <div class="itl-grid">
          ${filtered.map(t => renderItemTypeCard(t)).join('')}
        </div>
      </div>`;
  } else {
    sections = ITL_PHASES.map(ph => {
      const items = filtered.filter(t => t.phase === ph.id);
      if (items.length === 0) return '';
      return `
        <div class="itl-section">
          <div class="itl-section-head">
            <span class="dot" style="background:${ph.color}"></span>
            <h3>${ph.label}</h3>
            <span class="cnt">${items.length}</span>
            <span class="note">${ph.desc}</span>
          </div>
          <div class="itl-grid">
            ${items.map(t => renderItemTypeCard(t)).join('')}
          </div>
        </div>`;
    }).join('');
  }

  document.getElementById('itlBody').innerHTML = `
    <button class="itl-back" onclick="nav('homepage')">← Back to Homepage</button>
    <div class="itl-head">
      <div>
        <div class="itl-kicker">Assessment 2.0 · Item Type Catalog</div>
        <h1 class="itl-title">Item Types Library</h1>
        <p class="itl-sub">All ${visibleTypes.length} item types Kira will need to support TCAP, ACT, and other standardized assessments. Each card shows the teacher authoring view (left) and the student response view (right). Development is phased — but the prototype designs all types up front so we can validate UX with TN piloters and pre-spec the work for engineering.</p>
      </div>
    </div>

    <div class="itl-tabs">
      <button class="itl-tab ${_itlFilter==='all'?'active':''}"         onclick="setItlFilter('all')">All <span class="ct">${visibleTypes.length}</span></button>
      <button class="itl-tab ${_itlFilter==='must'?'active':''}"        onclick="setItlFilter('must')">MVP must <span class="ct">${counts.must}</span></button>
      <button class="itl-tab ${_itlFilter==='unsupported'?'active':''}" onclick="setItlFilter('unsupported')">Not Support <span class="ct">${counts.unsupported}</span></button>
    </div>

    ${sections}
  `;
}

function setItlFilter(f) { _itlFilter = f; renderItemTypesLibrary(); }

function renderItemTypeCard(t) {
  const kiraClass = /not\s*supported/i.test(t.kira) ? 'warn' :
                    /partial|build/i.test(t.kira)   ? 'partial' : 'ok';
  // Standards chips — render the "Used in" list as colored chips so the
  // standard codes (TCAP, ACT, SAT…) are scannable rather than buried in a
  // dot-separated string. Color per assessment family.
  const standardsChipsHtml = (t.standards || []).map(s => {
    const lc = String(s).toLowerCase();
    let bg = '#f3e8ff', color = '#7c3aed', border = '#e9d5ff';
    if (lc.includes('tcap'))      { bg = '#f5f3ff'; color = '#5b21b6'; border = '#ddd6fe'; }
    else if (lc.includes('act'))  { bg = '#eff6ff'; color = '#1d4ed8'; border = '#bfdbfe'; }
    else if (lc.includes('sat'))  { bg = '#ecfdf5'; color = '#15803d'; border = '#bbf7d0'; }
    else if (lc.includes('iready')|| lc.includes('mastery') || lc.includes('formative')) { bg = '#fff7ed'; color = '#9a3412'; border = '#fed7aa'; }
    return `<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:6px;background:${bg};color:${color};border:1px solid ${border};font-size:10px;font-weight:800;letter-spacing:.3px;margin:0 4px 4px 0">${s}</span>`;
  }).join('');
  return `
    <div class="it-card">
      <div class="it-card-head">
        <div class="left">
          <div class="ic">${t.icon}</div>
          <div class="meta">
            <div class="name">${t.name}</div>
          </div>
        </div>
      </div>
      <div class="it-card-body single">
        <div class="it-side teacher">
          <p class="it-desc">${t.sub}</p>
          <dl class="it-meta-list">
            <div class="r"><dt>Subjects</dt><dd>${t.subjects.join(' · ')}</dd></div>
            <div class="r"><dt>Used in</dt><dd style="display:flex;flex-wrap:wrap">${standardsChipsHtml}</dd></div>
            <div class="r"><dt>Scoring</dt><dd>${t.scoring}</dd></div>
            <div class="r"><dt>Kira platform</dt><dd><span class="kira-pill ${kiraClass}">${t.kira}</span></dd></div>
          </dl>
        </div>
      </div>
      <div class="it-card-actions">
        <button class="primary" onclick="openItemTypesEdit('${t.id}')">✎ Open in Editor</button>
        <button onclick="switchRole('student',true);openItemTypesStu('${t.id}')">👀 Try as Student</button>
      </div>
    </div>`;
}
