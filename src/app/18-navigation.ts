// @ts-nocheck
// Phase-2 slice: lines 17938-18376 of original src/app.ts

// ═══════ NAVIGATION ═══════
const allPages = ['homepage','flows','tag-insights','item-types','item-types-edit','item-types-stu','assessment-detail','session-detail','generic','new-edit','act','sat','tcap-class','tcap-config','student-profiles','stu-launch','stu-ready','stu-generic','stu-act','stu-sat','stu-act-report','stu-act-details','stu-sat-report','tcap-diag-report','tcap-stu'];
let currentPage = 'homepage';
let currentRole = 'teacher';

const teacherPages = [
  {id:'homepage',label:'Home',icon:'🏠',title:'Homepage'},
  {id:'session-detail',label:'Monitor',icon:'📡',title:'Assignment Monitor',
    // Monitor opens to whichever Assignment was last selected. The dropdown
    // gives an explicit ACT vs TCAP entry so reviewers can land on the right
    // session without going through the homepage list each time. Each item
    // calls loadSessionDetail() directly with the canonical demo session id
    // (sess-act-1 / sess-tcap-1), mirroring the dev-panel quick nav.
    subs:[
      {kind:'monitor-session',label:'ACT',  icon:'📝',meta:'ACT Practice Exam #3',                    action:"loadSessionDetail('sess-act-1')"},
      {kind:'monitor-session',label:'TCAP', icon:'🏛',meta:'Grade 5 ELA · TN Pilot · 4 SP',           action:"loadSessionDetail('sess-tcap-1')"},
    ]},
  {id:'act',label:'ACT Editor',icon:'📝',title:'ACT Editor'},
  {id:'tcap-edit',label:'TCAP Editor',icon:'🏛',title:'TCAP Sections Editor'},
  {id:'new-edit',label:'Tag Edit',icon:'🏷️',title:'Tag Edit'},
];
const studentPages = [
  {id:'stu-act',label:'ACT',icon:'📝',title:'ACT Test',action:"openStudentLaunch('sess-act-1', false)",activeIds:['stu-launch','stu-ready','stu-act'],
    subs:[
      {kind:'launch',label:'Start from beginning',icon:'▶',meta:'Launch flow'},
      {kind:'divider'},
      {kind:'subject',idx:0,label:'English',icon:'📖',meta:'50 Q · 35 min'},
      {kind:'subject',idx:1,label:'Mathematics',icon:'📐',meta:'45 Q · 50 min'},
      {kind:'subject',idx:2,label:'Reading',icon:'📚',meta:'36 Q · 40 min'},
      {kind:'subject',idx:3,label:'Science',icon:'🔬',meta:'40 Q · 40 min · optional'},
      {kind:'subject',idx:4,label:'Writing',icon:'✍️',meta:'1 essay · 40 min · optional'},
      {kind:'divider'},
      {kind:'completion',label:'Practice complete',icon:'✓',meta:'Submission summary',action:'demoActCompletion()'},
    ]},
  {id:'stu-sat',label:'SAT',icon:'📘',title:'SAT Test'},
  {id:'tcap-stu',label:'TCAP',icon:'🎓',title:'TCAP Test',
    subs:[
      {kind:'launch',label:'Start from beginning',icon:'▶',meta:'Step 1 · login'},
      {kind:'divider'},
      // SUBPARTS — each one swaps in its own pool + per-SP timer + brand and
      // jumps straight to Q1. One representative SP per subject (PRD §5.5.2).
      {kind:'tcap-subject',subject:'ELA Writing',     label:'ELA · Subpart 1 (Writing)',                    icon:'✍️',meta:'85 min · 1 essay · human-reviewed'},
      {kind:'tcap-subject',subject:'ELA Reading',     label:'ELA · Subpart 2 (Reading + Language)',         icon:'📖',meta:'50 min · 6 Q · reading + 1 editing task'},
      {kind:'tcap-subject',subject:'Math',            label:'Math · Subpart 1 (Calc-free)',                 icon:'📐',meta:'60 min · 6 Q · calc-free + graphing'},
      {kind:'tcap-subject',subject:'Science',         label:'Science · Subpart 1 (Pt 1)',                   icon:'🔬',meta:'45 min · 6 Q · data interp + hotspot + T/F'},
      {kind:'tcap-subject',subject:'Social Studies',  label:'Social Studies · Subpart 1 (History/Geo)',     icon:'🏛',meta:'45 min · 5 Q · primary source + timeline'},
      {kind:'divider'},
      // PRE-TEST setup screens (subject-agnostic).
      {kind:'phase',phase:'ready',    label:'Device check',           icon:'🔊',meta:'Step 2 of 3 · audio test'},
      {kind:'phase',phase:'direction',label:'Test directions',        icon:'📋',meta:'Step 3 of 3 · pre-test info'},
      {kind:'divider'},
      // POST-TEST states.
      {kind:'phase',phase:'paused',   label:'Paused (proctor)',       icon:'❚❚',meta:'Pause overlay'},
      {kind:'phase',phase:'review',   label:'Review summary',         icon:'📑',meta:'Before submit'},
      {kind:'phase',phase:'holding',  label:'Submitted · scoring',    icon:'⏳',meta:'Auto-grade in progress'},
    ]},
  {id:'stu-act-report',label:'ACT Report',icon:'📊',title:'ACT Student Report'},
  {id:'stu-sat-report',label:'SAT Report',icon:'📈',title:'SAT Student Report'},
  {id:'tcap-diag-report',label:'TCAP Report',icon:'🎯',title:'TCAP Student Report'},
];

function nav(pageId) {
  if (pageId === 'tcap-class') {
    loadSessionDetail('sess-tcap-1','analytics');
    return;
  }
  const requestedPageId = pageId;
  if (pageId === 'tcap-edit') {
    const session = getSession(currentSessionId);
    if (!session || session.testType !== 'tcap') {
      currentSessionId = 'sess-tcap-1';
      currentAssessmentDetailSessionId = 'sess-tcap-1';
    }
    pageId = 'new-edit';
  }
  if (requestedPageId === 'new-edit') {
    currentSessionId = 'sess-generic-1';
    currentAssessmentDetailSessionId = 'sess-generic-1';
    newEditMode = 'edit';
  }
  document.getElementById('devPanel').classList.remove('open');
  closeDrawer();
  closeAssignModal();
  if (pageId === 'stu-act-report' || pageId === 'stu-act-details' || pageId === 'stu-sat-report') {
    if (keepReportEdgePreview) keepReportEdgePreview = false;
    else reportEdgePreview = null;
  }
  ['stuGen', 'stuAct', 'stuSat'].forEach(k => stuStopTimer(k));
  let _matched = false;
  allPages.forEach(id => {
    const el = document.getElementById('page-' + id);
    if (el) {
      const on = (id === pageId);
      el.classList.toggle('active', on);
      if (on) _matched = true;
    }
  });
  if (!_matched) {
    console.warn('[nav] unknown pageId →', pageId, '· falling back to homepage');
    const home = document.getElementById('page-homepage');
    if (home) home.classList.add('active');
    pageId = 'homepage';
  }
  currentPage = requestedPageId === 'tcap-edit' ? 'tcap-edit' : pageId;
  renderToolbarPages();
  // Render student view on first navigation
  if (pageId === 'flows') renderFlowsPage();
  if (pageId === 'assessment-detail') renderAssessmentDetail();
  if (pageId === 'session-detail') renderSessionDetail();
  if (pageId === 'new-edit') renderNewEdit();
  if (pageId === 'grader') renderGrader();
  if (pageId === 'stu-launch') renderStudentLaunch();
  if (pageId === 'stu-ready') renderStudentReadyCheck();
  if (pageId === 'stu-generic' && !STU_STATE.stuGen) renderStuGeneric();
  if (pageId === 'stu-act' && !STU_STATE.stuAct) renderStuAct();
  if (pageId === 'stu-sat' && !STU_STATE.stuSat) renderStuSat();
  if (pageId === 'stu-act-report') renderActReport();
  if (pageId === 'stu-act-details') renderActQuestionDetailPage();
  if (pageId === 'stu-sat-report') renderSatReport();
  if (pageId === 'tcap-diag-report') renderTcapStudentReport();
  if (pageId === 'tcap-config') renderTcapConfig();
  if (pageId === 'student-profiles') renderStudentProfilesPage();
  if (pageId === 'item-types') renderItemTypesLibrary();
  if (pageId === 'item-types-edit') renderItemTypesEdit();
  if (pageId === 'item-types-stu') renderItemTypesStu();
  if (pageId === 'tcap-stu') {
    if (!TCS_STATE.timer) tcsStartTimer();
    tcsRender();
  }
}

function switchRole(role, skipNav) {
  currentRole = role;
  // Reset contrast when switching to teacher
  if (role === 'teacher') {
    document.body.classList.remove('contrast-dark', 'contrast-sepia');
    document.querySelectorAll('.stu-line-reader.open').forEach(l => l.classList.remove('open'));
    document.querySelectorAll('.stu-notepad.open').forEach(n => n.classList.remove('open'));
    document.querySelectorAll('.stu-nav-panel.open').forEach(n => n.classList.remove('open'));
    document.querySelectorAll('.stu-calc-panel.open').forEach(n => n.classList.remove('open'));
    document.querySelectorAll('.stu-ref-panel.open').forEach(n => n.classList.remove('open'));
  }
  document.getElementById('roleTeacher').className =
    'toolbar-role-btn' + (role === 'teacher' ? ' active' : '');
  document.getElementById('roleStudent').className =
    'toolbar-role-btn' + (role === 'student' ? ' active' : '');
  renderToolbarPages();
  if (!skipNav) {
    if (role === 'teacher') nav(teacherPages[0].id);
    else nav(studentPages[0].id);
  }
}

function renderToolbarPages() {
  const pages = currentRole === 'teacher' ? teacherPages : studentPages;
  document.getElementById('viewPages').innerHTML = pages.map(p => {
    const isActive = currentPage === p.id || (Array.isArray(p.activeIds) && p.activeIds.includes(currentPage));
    const hasSubs = Array.isArray(p.subs) && p.subs.length > 0;
    // Pages with subs open a popover on click instead of navigating
    // straight away. The popover's first item is "Start from beginning"
    // (which keeps the original launch flow), followed by quick-jumps.
    const onClick = hasSubs
      ? `toolbarToggleSubs('${p.id}', this)`
      : (p.action || `nav('${p.id}')`);
    const caret = hasSubs ? '<span class="caret">▾</span>' : '';
    return `<button class="toolbar-page-btn ${isActive?'active':''} ${hasSubs?'has-subs':''}" data-page-id="${p.id}" onclick="${onClick}" title="${p.title || p.label}"><span class="ico">${p.icon}</span><span class="txt">${p.label}</span>${caret}</button>`;
  }).join('');
}

// ── Toolbar sub-page popover ─────────────────────────────────────────────
// Pages declared with `subs` (e.g. ACT student exam → 5 subjects) open a
// floating popover above the toolbar instead of navigating directly. Sub
// items can be: { kind:'launch' } (calls the original page action),
// { kind:'subject', idx, ... } (quick-jumps to that ACT section), or
// { kind:'divider' } (visual separator).
function toolbarToggleSubs(pageId, anchorBtn) {
  const pop = document.getElementById('toolbarSubsPop');
  if (!pop) return;
  const isOpen = pop.classList.contains('open') && pop.dataset.pageId === pageId;
  // Always close first so re-clicking the same button toggles cleanly,
  // and clicking a different page swaps the popover content/anchor.
  toolbarCloseSubs();
  if (isOpen) return;
  const pages = currentRole === 'teacher' ? teacherPages : studentPages;
  const page = pages.find(p => p.id === pageId);
  if (!page || !Array.isArray(page.subs)) return;
  pop.dataset.pageId = pageId;
  pop.innerHTML = page.subs.map(s => {
    if (s.kind === 'divider') return `<div class="sub-divider"></div>`;
    let onClick = '';
    if (s.kind === 'launch') {
      // Dedicated restart paths so "Start from beginning" really restarts
      // when the user is already on the destination page (otherwise
      // nav('stu-act') is a silent no-op).
      if (page.id === 'stu-act')        onClick = `toolbarRestartAct()`;
      else if (page.id === 'tcap-stu')  onClick = `toolbarRestartTcap()`;
      else onClick = page.action || `nav('${page.id}')`;
    } else if (s.kind === 'subject' && page.id === 'stu-act') {
      onClick = `quickJumpActSubject(${s.idx})`;
    } else if (s.kind === 'tcap-subject' && page.id === 'tcap-stu') {
      // TCAP subject swap: load the subject's pool, brand, test name, then
      // jump straight into Q1 of that subject (the most natural "show me
      // this subject's flow" action for a stakeholder demo).
      onClick = `quickJumpTcapSubject('${s.subject}')`;
    } else if (s.kind === 'phase' && page.id === 'tcap-stu') {
      // TCAP runner phases (launch / ready / direction / test / break / paused / review / holding).
      // Optional s.idx threads into tcsDemo's `opts.idx` to place the test phase on a specific item.
      onClick = (s.idx != null)
        ? `quickJumpTcapPhase('${s.phase}', ${s.idx})`
        : `quickJumpTcapPhase('${s.phase}')`;
    } else {
      onClick = s.action || '';
    }
    const meta = s.meta ? `<span class="sub-meta">${s.meta}</span>` : '';
    return `<button onclick="toolbarCloseSubs();${onClick}" title="${s.label}"><span class="sub-ico">${s.icon || ''}</span><span>${s.label}</span>${meta}</button>`;
  }).join('');
  // Position above the anchor button, clamped to viewport.
  // Clear the defensive inline display:none that toolbarCloseSubs sets so
  // the .open class's display:flex can take effect.
  pop.style.display = '';
  pop.classList.add('open');
  const r = anchorBtn.getBoundingClientRect();
  const popW = pop.offsetWidth;
  const popH = pop.offsetHeight;
  let left = r.left + r.width / 2 - popW / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - popW - 8));
  let top = r.top - popH - 8;
  if (top < 8) top = r.bottom + 8; // flip below if no room above
  pop.style.left = left + 'px';
  pop.style.top = top + 'px';
  // Mark anchor as open for caret rotation.
  document.querySelectorAll('.toolbar-page-btn.is-open').forEach(b => b.classList.remove('is-open'));
  anchorBtn.classList.add('is-open');
}
function toolbarCloseSubs() {
  const pop = document.getElementById('toolbarSubsPop');
  if (pop) {
    pop.classList.remove('open');
    // Defensive: also force inline display:none so any later style/class
    // mutation can't accidentally re-show stale popover content. The next
    // toolbarToggleSubs() open clears this back to default before re-rendering.
    pop.style.display = 'none';
    // Clear the dataset.pageId association so the next toolbarToggleSubs()
    // never treats the popover as "still open for this pageId" (which would
    // cause it to bail without re-rendering, leaving the user clicking with
    // no visible response).
    pop.dataset.pageId = '';
  }
  document.querySelectorAll('.toolbar-page-btn.is-open').forEach(b => b.classList.remove('is-open'));
}
// Click anywhere outside (including other toolbar buttons) closes the popover.
document.addEventListener('click', (e) => {
  const pop = document.getElementById('toolbarSubsPop');
  if (!pop || !pop.classList.contains('open')) return;
  if (e.target.closest('.toolbar-subs-pop')) return;
  if (e.target.closest('.toolbar-page-btn.has-subs')) return; // anchor handles its own toggle
  toolbarCloseSubs();
}, true);
window.addEventListener('resize', toolbarCloseSubs);

// "Start from beginning" — toolbar action for ACT. Force-resets STU_STATE
// and shows the Test overview screen, so even when the student is already
// mid-exam the click visibly restarts from the top instead of being a
// no-op nav('stu-act') call.
function toolbarRestartAct() {
  if (currentRole !== 'student') switchRole('student', true);
  const pk = 'stuAct';
  delete STU_STATE[pk];          // wipe any in-progress run
  if (typeof stuStopTimer === 'function') stuStopTimer(pk);
  if (typeof stuCloseDirections === 'function') stuCloseDirections();
  nav('stu-act');                 // triggers renderStuAct() since state is gone
  // renderStuAct → builds initial layout but doesn't auto-show the overview
  // landing on its own; the original entry point (Begin Test) goes through
  // stuActBegin → stuActShowExamLanding. Replicate that here so users land
  // on the exam onboarding screen.
  setTimeout(() => {
    if (typeof stuActBegin === 'function') stuActBegin(pk);
  }, 30);
}

// Quick-jump into a specific ACT subject. Skips the prior screens
// (launch → ready → exam overview) but still lands on the subject's
// own landing page — the one with subject directions, tools list,
// pacing tip, and "Begin English / Mathematics / …" CTA — so demos
// see the full per-section onboarding instead of being dropped into
// question 1 with no context.
function quickJumpActSubject(secIdx) {
  if (currentRole !== 'student') switchRole('student', true);
  const pk = 'stuAct';
  if (!STU_STATE[pk]) renderStuAct();
  nav('stu-act');
  const st = STU_STATE[pk];
  if (st) {
    st.reviewMode = false;
    const page = document.getElementById('page-stu-act');
    if (page) page.classList.remove('review-mode');
  }
  if (typeof stuCloseDirections === 'function') stuCloseDirections();
  if (typeof stuStopTimer === 'function') stuStopTimer(pk);
  // Show the per-section landing screen. For Writing this internally
  // routes through the legacy directions modal (Writing landing isn't
  // built yet), which is fine.
  if (typeof stuActShowSectionLanding === 'function') {
    setTimeout(() => stuActShowSectionLanding(pk, secIdx), 30);
  }
}

// "Practice complete" — toolbar shortcut for showing the post-test
// hand-off page (the one with sections / answered / essay summary +
// View report / Return home CTAs). Two cases:
//   • Student already finished a run → use the live STU_STATE so the
//     numbers are real.
//   • No run in progress → fabricate a "fully completed" demo state
//     so the page renders meaningfully for design review without
//     forcing the demoer to play through 2+ hours of ACT first.
function demoActCompletion() {
  if (currentRole !== 'student') switchRole('student', true);
  const pk = 'stuAct';

  if (!STU_STATE[pk] || !STU_STATE[pk].sections || !STU_STATE[pk].questions) {
    // Mock a completed practice run. Section count + question total
    // mirror a typical Enhanced ACT (4 core sections + Writing) so
    // the summary card reads believably. The last item is an essay
    // with non-empty answer → status renders "Submitted".
    const demoSections = [
      { id:'act-eng', name:'English' },
      { id:'act-math', name:'Mathematics' },
      { id:'act-reading', name:'Reading' },
      { id:'act-science', name:'Science' },
      { id:'act-writing', name:'Writing' }
    ];
    const total = 175;
    const demoQuestions = Array.from({ length: total - 1 }, (_, i) => ({ type:'MC', section:'demo' }));
    demoQuestions.push({ type:'ACT_WRITING', section:'act-writing' });
    const demoAnswered = new Set(Array.from({ length: total }, (_, i) => i));
    STU_STATE[pk] = {
      sections: demoSections,
      questions: demoQuestions,
      lockedSecs: new Set([0, 1, 2, 3, 4]),
      answered: demoAnswered,
      answers: { [total - 1]: 'Demo essay text — placeholder for completion-page demo.' }
    };
  } else {
    const st = STU_STATE[pk];
    if (!(st.lockedSecs instanceof Set)) st.lockedSecs = new Set();
    for (let i = 0; i < (st.sections?.length || 0); i++) st.lockedSecs.add(i);
  }

  if (typeof stuStopTimer === 'function') stuStopTimer(pk);
  if (typeof stuCloseDirections === 'function') stuCloseDirections();
  nav('stu-act');
  setTimeout(() => {
    if (typeof stuActShowCompletion === 'function') stuActShowCompletion(pk);
  }, 40);
}

// ── TCAP toolbar dropdown helpers ─────────────────────────────────────────
// The TCAP runner is a single page (`tcap-stu`) that internally cycles
// through phases (launch → ready → direction → test → break → review →
// holding, with `paused` overlay). Reuses tcsDemo() — already a full reset
// + role switch + nav + render + timer-start API, so each sub-item is a
// one-call jump. "Start from beginning" routes through a dedicated wrapper
// (mirrors the ACT pattern) so it visibly restarts even if the student is
// already on tcap-stu.
function toolbarRestartTcap() {
  if (typeof toolbarCloseSubs === 'function') toolbarCloseSubs();
  if (typeof tcsStopTimer === 'function')      tcsStopTimer();
  if (typeof tcsStopBreakTimer === 'function') tcsStopBreakTimer();
  if (typeof tcsOpen === 'function') tcsOpen({ phase: 'launch' });
  else if (typeof tcsDemo === 'function') tcsDemo('launch');
  if (typeof iteToast === 'function') iteToast('▶ Restarted from beginning', 'info');
}
function quickJumpTcapPhase(phase, idx) {
  if (typeof tcsDemo !== 'function') return;
  // Belt-and-suspenders close popover — the inline onclick already does this,
  // but if anything earlier in the chain throws we still want to dismiss.
  if (typeof toolbarCloseSubs === 'function') toolbarCloseSubs();
  if (idx == null) tcsDemo(phase);
  else tcsDemo(phase, { idx: idx });
  // tcsDemo bypasses tcsSetPhase, so the 'ready' auto-verify hook never
  // fires through the demo path. Trigger it here so jumping into the
  // device-check page lands with network/screen rows actively verifying
  // (matching the live entry behavior).
  if (phase === 'ready' && typeof tcsAutoVerifyPassiveChecks === 'function') {
    tcsAutoVerifyPassiveChecks();
  }
  // Always surface a toast so the click never feels silent — especially
  // when the student is already on the same phase (e.g., re-clicking
  // "Launch · login" while on the launch screen still pre-fills the inputs
  // but the visible change is subtle).
  const labels = {
    launch:    '🚪 Jumped to · Launch · login',
    ready:     '🔊 Jumped to · Device check',
    direction: '📋 Jumped to · Test directions',
    test:      `📝 Jumped to · Test · Q${(idx||0)+1}`,
    paused:    '❚❚ Jumped to · Paused (proctor)',
    review:    '📑 Jumped to · Review summary',
    holding:   '⏳ Jumped to · Submitted · scoring',
  };
  if (typeof iteToast === 'function') iteToast(labels[phase] || `Jumped to ${phase}`, 'info');
}
// Subject swap from the TCAP toolbar dropdown. Loads that subject's pool,
// resets per-question scratch state, then drops the student into the
// "test" phase at Q1 so the demo immediately shows real subject content
// (rather than landing on the launch screen and forcing extra clicks).
function quickJumpTcapSubject(subject) {
  if (typeof tcsSwitchSubject !== 'function' || typeof tcsDemo !== 'function') return;
  if (typeof toolbarCloseSubs === 'function') toolbarCloseSubs();
  tcsSwitchSubject(subject);
  tcsDemo('test', { idx: 0 });
  const ico = {
    'ELA Writing':'✍️',
    'ELA Reading':'📖',
    'Math':'📐',
    'Science':'🔬',
    'Social Studies':'🏛',
  }[subject] || '📝';
  const meta = (typeof _TCS_SUBJECT_META !== 'undefined' && _TCS_SUBJECT_META[subject]) || {};
  const label = meta.short || subject;
  if (typeof iteToast === 'function') iteToast(`${ico} Jumped to · ${label} · Q1`, 'info');
}

let toolbarCollapsed = false;
function toggleToolbarCollapse() {
  toolbarCollapsed = !toolbarCollapsed;
  const c = document.getElementById('toolbarContent'), icon = document.getElementById('toolbarCollapseIcon'), ci = document.getElementById('toolbarCollapsedIcon'), dh = document.getElementById('dragHandle');
  if (toolbarCollapsed) { c.style.maxWidth='0'; c.style.opacity='0'; icon.innerHTML='<polyline points="9 18 15 12 9 6"/>'; ci.classList.remove('hidden'); dh.classList.add('hidden'); }
  else { c.style.maxWidth='1120px'; c.style.opacity='1'; icon.innerHTML='<polyline points="15 18 9 12 15 6"/>'; ci.classList.add('hidden'); dh.classList.remove('hidden'); }
}

(function(){
  const bar=document.getElementById('viewSwitcher'),h=document.getElementById('dragHandle'),ci=document.getElementById('toolbarCollapsedIcon');
  let d=false,ox=0,oy=0,m=false;
  function sd(e){d=true;m=false;const r=bar.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;bar.style.transition='none';e.preventDefault()}
  h.addEventListener('mousedown',sd);ci.addEventListener('mousedown',e=>{sd(e);ci._ds=true});
  document.addEventListener('mousemove',e=>{if(!d)return;m=true;let x=e.clientX-ox,y=e.clientY-oy;x=Math.max(0,Math.min(innerWidth-bar.offsetWidth,x));y=Math.max(0,Math.min(innerHeight-bar.offsetHeight,y));bar.style.left=x+'px';bar.style.top=y+'px';bar.style.bottom='auto';bar.style.transform='none'});
  document.addEventListener('mouseup',()=>{if(d){d=false;bar.style.transition='';if(!m&&ci._ds)toggleToolbarCollapse();ci._ds=false;m=false}});
})();

