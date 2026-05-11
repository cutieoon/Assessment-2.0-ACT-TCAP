// @ts-nocheck
// Phase-2 slice: lines 19701-21984 of original src/app.ts

//  carries its own directions panel.
// ═══════════════════════════════════════════════════════════════════

const ACT_SUBJECT_THEMES = {
  English: {
    key: 'en',
    accent: '#6040ca',
    accentBg: '#faf8ff',
    accentBorder: '#ddd6fe',
    accentDark: '#4c1d95',
    icon: '📖',
    kicker: 'Section 1 of 4',
    directionsHtml: `<p>In the five passages that follow, certain words and phrases are <u>underlined and numbered</u>. In the right-hand column, you will find alternatives for each underlined part. Choose the one that best expresses the idea, makes the statement acceptable in standard written English, or is worded most consistently with the style and tone of the passage as a whole. If you think the original version is best, choose "NO CHANGE."</p><p>You will also find questions about a section of the passage, or about the passage as a whole. These questions do not refer to an underlined portion, but rather are identified by a number or numbers in a box.</p><p>For each question, choose the alternative you consider best and mark the corresponding answer.</p>`,
    tools: [
      { icon: '🖍', label: 'Highlighter' },
      { icon: '✏️', label: 'Notes' },
      { icon: '✕', label: 'Answer eliminator' },
      { icon: '🚩', label: 'Flag for review' }
    ],
    pacingNumber: '~42s',
    pacingNote: '5 passages · 50 items · 35 minutes',
    tip: 'Read passage and underlined parts together — most edits are local. Don\'t change anything that already sounds correct.'
  },
  Mathematics: {
    key: 'math',
    accent: '#6040ca',
    accentBg: '#faf8ff',
    accentBorder: '#ddd6fe',
    accentDark: '#4c1d95',
    icon: '📐',
    kicker: 'Section 2 of 4',
    directionsHtml: `<p>Solve each problem, choose the correct answer, and then mark the corresponding answer. Do not linger over problems that take too much time. Solve as many as you can; then return to the others in the time you have left.</p><p><b>Note:</b> Unless otherwise stated, all of the following should be assumed:</p><ul><li>Illustrative figures are NOT necessarily drawn to scale.</li><li>Geometric figures lie in a plane.</li><li>The word <i>line</i> indicates a straight line.</li><li>The word <i>average</i> indicates arithmetic mean.</li></ul>`,
    tools: [
      { icon: '🧮', label: 'Calculator (allowed)', highlight: true },
      { icon: '🖍', label: 'Highlighter' },
      { icon: '🚩', label: 'Flag for review' }
    ],
    pacingNumber: '~67s',
    pacingNote: '45 items · 50 minutes',
    tip: 'Easy and hard questions are mixed — skim all 45 first and bank the easy points before grinding on a single problem.'
  },
  Reading: {
    key: 'rd',
    accent: '#6040ca',
    accentBg: '#faf8ff',
    accentBorder: '#ddd6fe',
    accentDark: '#4c1d95',
    icon: '📚',
    kicker: 'Section 3 of 4',
    directionsHtml: `<p>This test contains four passages, each followed by several questions. After reading a passage, choose the best answer to each question and mark the corresponding answer. You may refer back to the passages as often as necessary.</p><p>Passages may be single, paired, or accompanied by an informational graphic.</p>`,
    tools: [
      { icon: '🖍', label: 'Highlighter' },
      { icon: '📝', label: 'Annotate' },
      { icon: '✕', label: 'Answer eliminator' },
      { icon: '✏️', label: 'Notes' },
      { icon: '🚩', label: 'Flag for review' }
    ],
    pacingNumber: '~67s',
    pacingNote: '4 passages · 36 items · 40 minutes',
    tip: 'Answer based only on what is stated or implied in the passage — not on outside knowledge or what "feels right."'
  },
  Science: {
    key: 'sci',
    accent: '#6040ca',
    accentBg: '#faf8ff',
    accentBorder: '#ddd6fe',
    accentDark: '#4c1d95',
    icon: '🔬',
    kicker: 'Section 4 of 4',
    directionsHtml: `<p>This test contains seven passages, each followed by several multiple-choice questions. After reading a passage, choose the best answer to each question and mark the corresponding answer.</p><p>You may refer to the passages as often as necessary. <b>You are NOT permitted to use a calculator on this test.</b></p>`,
    tools: [
      { icon: '🖍', label: 'Highlighter' },
      { icon: '✕', label: 'Answer eliminator' },
      { icon: '✏️', label: 'Notes' },
      { icon: '🚩', label: 'Flag for review' }
    ],
    pacingNumber: '~60s',
    pacingNote: '6–7 passages · 40 items · 40 minutes (Optional)',
    tip: 'Read figures, tables, and chart axes first — most questions are answered straight from the visuals; the prose is just framing.'
  },
  Writing: {
    key: 'wri',
    accent: '#6040ca',
    accentBg: '#faf8ff',
    accentBorder: '#ddd6fe',
    accentDark: '#4c1d95',
    icon: '✍️',
    kicker: 'Section 5 of 5 · Optional',
    directionsHtml: `<p>This is a test of your writing skills. You will have <b>forty (40) minutes</b> to read the prompt, plan your response, and write an essay in English.</p><p>Before you begin working, read all material carefully to understand exactly what you are being asked to do. Your planning notes are not scored; only the essay response is scored.</p><p><b>Your essay will be evaluated on:</b></p><ul><li>Clearly stating your own perspective and analyzing the relationship between your perspective and at least one other.</li><li>Developing your ideas with reasoning and specific examples.</li><li>Organizing your essay logically with effective transitions.</li><li>Communicating clearly with control of grammar, usage, and mechanics.</li></ul>`,
    tools: [
      { icon: '📝', label: 'Planning notes (not scored)' },
      { icon: '📋', label: 'Task checklist' },
      { icon: '⏱', label: 'Word counter' },
      { icon: '💾', label: 'Auto-save' }
    ],
    pacingNumber: '40',
    paceUnit: 'min total',
    pacingNote: '1 prompt · 40 minutes total · 1 scored essay',
    tip: 'Spend ~5 min planning, ~30 min drafting, ~5 min revising. Don\'t skip the revise pass — surface fixes lift Language & Conventions fastest.'
  }
};

// Subject-name lookup that tolerates ACT_SECTIONS variants ("Math" vs
// "Mathematics") so renaming a section in ACT_SECTIONS doesn't silently
// break the landing pages.
function actSubjectTheme(name) {
  if (!name) return null;
  if (ACT_SUBJECT_THEMES[name]) return ACT_SUBJECT_THEMES[name];
  if (/math/i.test(name)) return ACT_SUBJECT_THEMES.Mathematics;
  if (/eng/i.test(name)) return ACT_SUBJECT_THEMES.English;
  if (/read/i.test(name)) return ACT_SUBJECT_THEMES.Reading;
  if (/sci/i.test(name)) return ACT_SUBJECT_THEMES.Science;
  if (/writ/i.test(name)) return ACT_SUBJECT_THEMES.Writing;
  return null;
}

function stuActBegin(pk) {
  // Entry point from "Begin Test" / dev panel / monitor preview.
  // Goes through the new two-step onboarding instead of jumping
  // straight into Section 1.
  stuActShowExamLanding(pk);
}

// Whole-test ACT onboarding: scope, tools overview, accommodation
// banner, important rules, "I'm ready" CTA. Replaces the act-bb-card
// hybrid that previously tried to be both exam landing AND section 1
// preview at the same time.
function stuActShowExamLanding(pk) {
  const body = document.getElementById('stuActBody');
  const footer = document.getElementById('stuActFooter');
  const secBar = document.getElementById('stuActSectionBar');
  if (secBar) secBar.style.display = 'none';
  if (footer) footer.innerHTML = '';
  stuActSetChrome('overview');
  const headerLabel = document.getElementById('stuActSecLabel');
  if (headerLabel) headerLabel.textContent = 'Test overview';
  const secInfo = document.getElementById('stuActSecInfo');
  if (secInfo) secInfo.textContent = '';

  const st = STU_STATE[pk];
  if (!st || !body) return;
  const session = getSession(currentLaunchSessionId || currentSessionId) || {};
  const ext = st.extMultiplier || 1.0;
  const extPct = Math.round((ext - 1) * 100);
  const studentName = st.studentName || currentLaunchStudentName || 'Practice Student';
  const testName = session.title || 'ACT Practice Exam';
  const fmtMin = (m) => m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? (m % 60) + 'm' : ''}`.trim() : `${m}m`;

  // Show every section the student is actually taking — including
  // optional Science / Writing if they opted in. Filtering them out
  // (the previous behaviour) hid 40% of the test from the "you're
  // about to begin" overview, which led students to under-estimate
  // total scope. PRD §3.11/§3.5 cover the rationale.
  const allSections = st.sections || [];
  const totalQuestions = allSections.reduce((s, sec) =>
    s + (sec.questions || st.questions.filter(q => q.section === sec.id).length), 0);
  const baseTotal = allSections.reduce((s, sec) => s + (sec.time || 0), 0);
  const adjTotal = Math.round(baseTotal * ext);

  // ACT Enhanced break placement (PRD §3.5):
  //   * 10-min break after Mathematics (mandatory, before Reading)
  //   * 5-min break after Science only when the student also opted
  //     into Writing.
  // Use a name-based lookahead so any custom ordering still picks the
  // right slots without hard-coding indices.
  const sectionRows = [];
  allSections.forEach((sec, i) => {
    const t = actSubjectTheme(sec.name);
    const qCount = sec.questions || st.questions.filter(q => q.section === sec.id).length;
    const secTime = Math.round((sec.time || 0) * ext);
    const accent = t ? t.accent : '#64748b';
    const optBadge = sec.optional ? '<span class="act-el-opt-pill">Optional</span>' : '';
    const rowCls = sec.optional ? 'opt' : '';
    sectionRows.push(`<tr class="${rowCls}">
      <td><span class="act-el-dot" style="background:${accent}"></span>${i + 1}. ${sec.name}${optBadge}</td>
      <td>${qCount}</td>
      <td>${fmtMin(secTime)}</td>
    </tr>`);
    const next = allSections[i + 1];
    if (!next) return;
    if (/math/i.test(sec.name)) {
      sectionRows.push(`<tr class="brk"><td colspan="3"><span style="display:inline-flex;align-items:center;gap:6px"><span style="font-size:13px">☕</span>10-minute break</span></td></tr>`);
    } else if (/science/i.test(sec.name) && /writing/i.test(next.name)) {
      sectionRows.push(`<tr class="brk"><td colspan="3"><span style="display:inline-flex;align-items:center;gap:6px"><span style="font-size:13px">☕</span>5-minute break</span></td></tr>`);
    }
  });

  const accommodationBanner = extPct > 0
    ? `<div class="act-el-side-accom"><b>Extended time · +${extPct}%</b><span>${st.extReason || 'All section timers are extended.'}</span></div>`
    : '';

  // CTA shows the actual first section so the student knows exactly
  // what they're walking into — defends against custom orderings or
  // future re-sorting.
  const firstSec = allSections[0];
  const ctaLabel = firstSec ? `Begin ${firstSec.name}` : 'Begin test';

  // Build "Before you start" rules dynamically — only mention the
  // 5-min Science→Writing break if both are part of this lineup.
  const hasSciWriBreak = allSections.some(s => /science/i.test(s.name))
    && allSections.some(s => /writing/i.test(s.name));
  const breakRule = hasSciWriBreak
    ? 'A <b>10-minute break</b> follows Mathematics, and a <b>5-minute break</b> follows Science. Stay on this device.'
    : 'A <b>10-minute break</b> follows Mathematics. Stay on this device.';

  body.innerHTML = `<div class="act-el-wrap">
    <div class="act-el-grid">
      <main class="act-el-main">
        <div class="act-el-intro">
          <div class="act-el-kicker">Practice ACT · Onboarding</div>
          <h1 class="act-el-title">You're about to begin the ACT.</h1>
          <p class="act-el-sub">Take a moment to review what's coming. The timer doesn't start until you begin Section 1.</p>
        </div>

        <section class="act-el-section">
          <div class="act-el-section-head">
            <div class="act-el-section-title">Test order</div>
            <div class="act-el-section-meta">${allSections.length} section${allSections.length === 1 ? '' : 's'} · ${totalQuestions} questions · ${fmtMin(adjTotal)}${extPct > 0 ? ` (+${extPct}%)` : ''}</div>
          </div>
          <table class="act-el-contents">
            <thead><tr><th>Section</th><th>Questions</th><th>Time</th></tr></thead>
            <tbody>${sectionRows.join('')}</tbody>
          </table>
        </section>

        <section class="act-el-section">
          <div class="act-el-section-title">Tools you'll have</div>
          <div class="act-el-tools-row">
            <span class="act-el-chip">🖍 Highlighter</span>
            <span class="act-el-chip">✕ Answer eliminator</span>
            <span class="act-el-chip">✏️ Notes</span>
            <span class="act-el-chip">🚩 Flag for review</span>
            <span class="act-el-chip spec">🧮 Calculator <i>· Math only</i></span>
          </div>
        </section>

        <section class="act-el-section">
          <div class="act-el-section-title">Before you start</div>
          <ul class="act-el-rule-list">
            <li><span class="act-el-rule-icon">🔒</span><span>You <b>cannot return</b> to a section after you submit it.</span></li>
            <li><span class="act-el-rule-icon">⏱</span><span>Each section has its own timer — submitting early doesn't give time back to the next section.</span></li>
            <li><span class="act-el-rule-icon">☕</span><span>${breakRule}</span></li>
            <li><span class="act-el-rule-icon">🛠</span><span>Use the top-bar tools menu for highlighter, notes, calculator, and accessibility features.</span></li>
          </ul>
        </section>
      </main>

      <aside class="act-el-side">
        <div class="act-el-side-card">
          <div class="act-el-side-eyebrow">Ready to begin?</div>
          <div class="act-el-side-meta-grid">
            <div class="act-el-meta-item"><span>Student</span><b>${studentName}</b></div>
            <div class="act-el-meta-item"><span>Test</span><b>${testName}</b></div>
            <div class="act-el-meta-item"><span>Sections</span><b>${allSections.length}</b></div>
            <div class="act-el-meta-item"><span>Questions</span><b>${totalQuestions}</b></div>
            <div class="act-el-meta-item act-el-meta-wide"><span>Total time</span><b>${fmtMin(adjTotal)}${extPct > 0 ? ` <span style="color:#efff61">+${extPct}%</span>` : ''}</b></div>
          </div>
          ${accommodationBanner}
          <button class="act-el-cta" onclick="stuActShowSectionLanding('${pk}',0)">${ctaLabel} →</button>
          <div class="act-el-side-foot">
            <p class="act-el-footnote">Section 1 directions appear next. The timer hasn't started.</p>
            <button class="act-el-link" onclick="switchRole('teacher');nav('homepage')">Exit practice</button>
          </div>
        </div>
      </aside>
    </div>
  </div>`;
}

// Per-subject section landing — full-screen page that replaces the
// player area while the timer is still off. 5 modules: Hero,
// Directions, Tools, Pacing, CTA. Each subject has its own accent
// theme via ACT_SUBJECT_THEMES.
function stuActShowSectionLanding(pk, secIdx) {
  const st = STU_STATE[pk];
  if (!st) return;
  st.currentSecIdx = secIdx;
  const sec = st.sections[secIdx] || st.sections[0];

  // Writing now uses the same per-section landing template as the other
  // four subjects (rose accent, dedicated theme in ACT_SUBJECT_THEMES).
  // Previously fell back to the legacy generic-directions modal which
  // popped over whatever section was last shown — no dedicated screen.

  const theme = actSubjectTheme(sec && sec.name) || {
    key: 'gen', accent: '#1e3a5f', accentBg: '#f1f5f9', accentBorder: '#cbd5e1',
    accentDark: '#0f172a', icon: '📝', kicker: `Section ${secIdx + 1}`,
    directionsHtml: '<p>Read each question carefully and select the best answer.</p>',
    tools: [], pacingNumber: '—', pacingNote: '', tip: ''
  };

  const body = document.getElementById('stuActBody');
  const footer = document.getElementById('stuActFooter');
  const secBar = document.getElementById('stuActSectionBar');
  if (secBar) secBar.style.display = 'none';
  if (footer) footer.innerHTML = '';
  stuActSetChrome('overview');
  const headerLabel = document.getElementById('stuActSecLabel');
  if (headerLabel) headerLabel.textContent = 'Directions';
  const secInfo = document.getElementById('stuActSecInfo');
  if (secInfo) secInfo.textContent = sec.name;

  const ext = st.extMultiplier || 1.0;
  const extPct = Math.round((ext - 1) * 100);
  const adjTime = Math.round((sec.time || 0) * ext);
  const qCount = sec.questions || st.questions.filter(q => q.section === sec.id).length;
  const totalSec = (st.sections || []).length || 4;
  const visibleIdx = Math.min(secIdx, totalSec - 1);
  const dynamicKicker = `Section ${visibleIdx + 1} of ${totalSec}${sec.optional ? ' · Optional' : ''}`;

  // Progress dots — 1..N, current = filled with accent.
  const dots = Array.from({ length: totalSec }, (_, i) => {
    const cls = i < secIdx ? 'done' : (i === secIdx ? 'cur' : 'todo');
    return `<span class="act-sl-dot ${cls}"></span>`;
  }).join('');

  // Tools row — chips with subject icon + label.
  const toolChips = (theme.tools || []).map(t => {
    const cls = t.highlight ? 'act-sl-tool-chip hi' : 'act-sl-tool-chip';
    return `<div class="${cls}"><span>${t.icon}</span>${t.label}</div>`;
  }).join('');

  if (!body) return;
  body.innerHTML = `<div class="act-section-landing ${theme.key}" style="--accent:${theme.accent};--accent-bg:${theme.accentBg};--accent-border:${theme.accentBorder};--accent-dark:${theme.accentDark}">
    <div class="act-sl-hero">
      <div class="act-sl-hero-top">
        <div class="act-sl-icon">${theme.icon}</div>
        <div class="act-sl-progress">
          <div class="act-sl-kicker">${dynamicKicker}</div>
          <div class="act-sl-dots">${dots}</div>
        </div>
      </div>
      <h1 class="act-sl-title">${sec.name}</h1>
      <p class="act-sl-meta">${qCount} ${/writing/i.test(sec.name) ? 'essay' : 'items'} · ${adjTime} minutes${extPct > 0 ? ` <span class="act-sl-ext">+${extPct}% extended</span>` : ''}</p>
    </div>

    <div class="act-sl-body">
      <div class="act-sl-card">
        <div class="act-sl-card-title"><span class="act-sl-pin"></span>Tools available in this section</div>
        <div class="act-sl-tools">${toolChips || '<div class="act-sl-tools-empty">Standard tools.</div>'}</div>
      </div>
      <div class="act-sl-directions-hint">
        Need to re-read the rules? Tap Directions in the top bar any time.
      </div>

      <div class="act-sl-pace">
        <div class="act-sl-pace-num">
          <span class="num">${(theme.pacingNumber || '—').replace(/^~/, '')}</span>
          <span class="per">${theme.paceUnit || 'per item'}</span>
        </div>
        <div class="act-sl-pace-text">
          <span class="pace-label">Pacing target</span>
          <b>${theme.pacingNote || ''}</b>
          <span>${theme.tip || ''}</span>
        </div>
      </div>

      <div class="act-sl-cta-row">
        <button class="act-sl-back" onclick="stuActShowExamLanding('${pk}')">← Test overview</button>
        <button class="act-sl-start" onclick="stuActStartSection('${pk}',${secIdx})">Start ${sec.name} →</button>
      </div>
      <div class="act-sl-footnote">The timer starts the moment you press Start.</div>
    </div>
  </div>`;
}

// Legacy alias — break screen / exam complete fallback / monitor
// preview still call stuActShowSectionDirections by name. Route them
// through the new landing so callers don't need to know the new fn
// exists.
function stuActShowSectionDirections(pk, secIdx) {
  stuActShowSectionLanding(pk, secIdx);
}

function stuActStartSection(pk, secIdx) {
  stuCloseDirections();
  stuSwitchActSection(pk, secIdx);
}

function stuActSetChrome(mode) {
  const isOverview = mode === 'overview';
  document.querySelectorAll('#page-stu-act .act-nav-btn').forEach(btn => {
    btn.style.display = isOverview ? 'none' : 'inline-flex';
  });
  const answered = document.getElementById('stuActAnswered');
  if (answered) answered.style.display = isOverview ? 'none' : 'inline-flex';
  const timer = document.getElementById('stuActTimerWrap');
  if (timer) timer.style.display = isOverview ? 'none' : 'inline-flex';
  const qMenu = document.getElementById('stuActModuleInfo');
  if (qMenu) qMenu.style.display = isOverview ? 'none' : 'inline-flex';
  const directions = document.querySelector('#page-stu-act .sat-header-btn');
  if (directions) directions.style.display = isOverview ? 'none' : 'inline-flex';
  const extChip = document.getElementById('stuActExtChip');
  if (extChip && isOverview) extChip.style.display = 'none';
  if (!isOverview) stuRefreshActExtChip('stuAct');
}

// ─── Extended-time controls for ACT student shell ───────────────────────────
// Public API used by the dev panel to launch the ACT student view as a
// student with an accommodation. Updates the header chip, scales every
// section's time budget, and (if the timer is running) hot-restarts it
// so the change is visible immediately.
function stuActOpenWithExt(extMultiplier, extReason, studentName) {
  const pk = 'stuAct';
  switchRole('student', true);
  nav('stu-act');
  if (!STU_STATE[pk]) renderStuAct();
  STU_STATE[pk].extMultiplier = extMultiplier;
  STU_STATE[pk].extReason = extReason || null;
  STU_STATE[pk].studentName = studentName || null;
  stuRefreshActExtChip(pk);
  // Extended-time preview should still enter through the new ACT exam
  // landing; otherwise the freshly initialized currentSecIdx=0 would
  // skip onboarding and jump straight into English.
  stuActShowExamLanding(pk);
}
function stuRefreshActExtChip(pk) {
  if (pk !== 'stuAct') return;
  const st = STU_STATE[pk];
  const chip = document.getElementById('stuActExtChip');
  if (!chip) return;
  const pct = Math.round(((st?.extMultiplier || 1.0) - 1.0) * 100);
  if (pct <= 0) {
    chip.style.display = 'none';
  } else {
    chip.style.display = 'inline-flex';
    const pctEl = document.getElementById('stuActExtPct');
    const reasonEl = document.getElementById('stuActExtReason');
    if (pctEl) pctEl.textContent = String(pct);
    if (reasonEl) reasonEl.textContent = st.extReason ? ` · ${st.extReason}` : '';
  }
}

function stuShowOverview(pk, testType) {
  const bodyId = testType === 'act' ? 'stuActBody' : 'stuSatBody';
  const footerId = testType === 'act' ? 'stuActFooter' : 'stuSatFooter';
  const secBarId = testType === 'act' ? 'stuActSectionBar' : 'stuSatSectionBar';
  const body = document.getElementById(bodyId);
  const footer = document.getElementById(footerId);
  const secBar = document.getElementById(secBarId);
  if (secBar) secBar.style.display = 'none';
  footer.innerHTML = '';

  const st = STU_STATE[pk];
  const totalQ = st.questions.length;
  const totalSec = st.sections.length;
  const totalTime = st.sections.reduce((s, sec) => s + (sec.time || 0), 0);

  const isACT = testType === 'act';
  if (isACT) {
    stuActShowExamLanding(pk);
    return;
  }
  const title = isACT ? 'ACT Test' : 'Digital SAT';
  const accent = isACT ? '#1e3a5f' : '#1e3a5f';
  const beginFn = isACT ? `stuActBegin('${pk}')` : `stuSatBegin('${pk}')`;

  // Per-section row — for ACT we surface section-specific policy chips:
  // calculator policy (Math only), Writing's Optional + human-grading flags
  // so the student knows what to expect before pressing Begin.
  const sectionRows = st.sections.map(sec => {
    const isMath  = isACT && /math/i.test(sec.name);
    const isWrite = isACT && /writing/i.test(sec.name);
    const chips = [];
    if (isACT) {
      chips.push(isMath
        ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:5px;background:#ecfdf5;color:#15803d;border:1px solid #bbf7d0;font-size:10px;font-weight:700">🧮 Calc</span>`
        : `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:5px;background:#f4f4f5;color:#52525b;border:1px solid #e4e4e7;font-size:10px;font-weight:700">No calc</span>`);
      if (isWrite) {
        chips.push(`<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:5px;background:#fef3c7;color:#a16207;border:1px solid #fde68a;font-size:10px;font-weight:700">Optional</span>`);
        chips.push(`<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:5px;background:#f5f3ff;color:#5b21b6;border:1px solid #ddd6fe;font-size:10px;font-weight:700">🖋 Essay</span>`);
      }
    }
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid #f1f5f9;flex-wrap:wrap;gap:8px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="font-size:14px;color:#374151;font-weight:500">${sec.name}</span>
        ${chips.join('')}
      </div>
      <div style="display:flex;gap:16px;font-size:13px;color:#64748b">
        <span>${st.questions.filter(q => q.section === sec.id).length} questions</span>
        <span>${sec.time || '—'} min</span>
      </div>
    </div>`;
  }).join('');

  if (isACT) {
    stuActSetChrome('overview');
    const headerLabel = document.getElementById('stuActSecLabel');
    if (headerLabel) headerLabel.textContent = 'Start';
    const secInfo = document.getElementById('stuActSecInfo');
    if (secInfo) secInfo.textContent = '';
    const session = getSession(currentLaunchSessionId || currentSessionId) || {};
    const ext = st.extMultiplier || 1.0;
    const extPct = Math.round((ext - 1) * 100);
    const baseTotalTime = totalTime || session.timeLimitMinutes || 0;
    const adjustedTotalTime = Math.round(baseTotalTime * ext);
    const timingLabel = adjustedTotalTime
      ? `${adjustedTotalTime} min total${extPct > 0 ? ` (+${extPct}%)` : ''}`
      : (extPct > 0 ? `Extended time +${extPct}%` : 'Standard time');
    const firstSec = st.sections[0] || {};
    const firstQuestions = firstSec.questions || st.questions.filter(q => q.section === firstSec.id).length;
    const adjustedFirstTime = Math.round((firstSec.time || 45) * ext);
    const fmtTime = (mins) => mins >= 60 ? `${Math.floor(mins / 60)} hour${Math.floor(mins / 60) > 1 ? 's' : ''}${mins % 60 ? ` ${mins % 60} minutes` : ''}` : `${mins} minutes`;
    const contentsRows = st.sections.map((sec, i) => {
      const qCount = sec.optional && sec.questions === 1 ? '1 essay' : (sec.questions || st.questions.filter(q => q.section === sec.id).length);
      const secTime = Math.round((sec.time || 0) * ext);
      return `<tr>
        <td>${i + 1}. ${sec.name}${sec.optional ? ' (optional)' : ''}</td>
        <td>${qCount} · ${fmtTime(secTime)}</td>
      </tr>`;
    }).join('');
    const calculatorPolicy = /math/i.test(firstSec.name || '') ? 'Calculator allowed' : 'Calculator not allowed';
    const toolsLabel = /math/i.test(firstSec.name || '')
      ? 'Calculator · Highlighter'
      : 'Highlighter · Notes · Answer eliminator';
    const studentName = st.studentName || currentLaunchStudentName || 'Practice Student';
    const testName = session.title || 'ACT Practice Exam';
    const accommodationLabel = extPct > 0 ? `+${extPct}%${st.extReason ? ` · ${st.extReason}` : ''}` : 'Standard time';
    body.innerHTML = `<div class="act-launch-wrap">
      <div class="act-bb-card">
        <div class="act-bb-top">
          <div class="act-bb-status">Ready</div>
          <h2 class="act-bb-title">Begin ACT ${firstSec.name || 'English'}</h2>
          <p class="act-bb-sub">Your timer will begin after you select the start button.</p>
        </div>
        <div class="act-bb-body">
          <div class="act-bb-summary">
            <div class="act-bb-row"><span>Student</span><b>${studentName}</b></div>
            <div class="act-bb-row"><span>Test</span><b>${testName}</b></div>
            <div class="act-bb-row"><span>Next section</span><b>${firstSec.name || 'English'}</b></div>
            <div class="act-bb-row"><span>Timing</span><b>${accommodationLabel}</b></div>
          </div>
          <div class="act-bb-section">
            <div class="act-bb-pill"><b>${firstQuestions || 75}</b><span>Questions</span></div>
            <div class="act-bb-pill"><b>${fmtTime(adjustedFirstTime)}</b><span>Time</span></div>
            <div class="act-bb-pill"><b>${calculatorPolicy}</b><span>Tools</span></div>
          </div>
          <div class="act-bb-next">
            <div class="act-bb-next-label">Next step</div>
            <button class="act-bb-primary" onclick="${beginFn}">Accept & Start ${firstSec.name || 'English'}</button>
          </div>
          <details class="act-bb-order">
            <summary>View full test order</summary>
            <table><tbody>
              ${contentsRows}
              <tr><td>Total testing time</td><td>${timingLabel}</td></tr>
            </tbody></table>
          </details>
          <div class="act-bb-links">
            <button class="act-bb-link" onclick="switchRole('teacher');nav('homepage')">Exit practice</button>
          </div>
        </div>
      </div>
    </div>`;
    return;
  } else {
    const secLabel = document.getElementById('stuSatSecLabel');
    const modInfo = document.getElementById('stuSatModuleInfo');
    if (secLabel) secLabel.textContent = title;
    if (modInfo) modInfo.textContent = 'Overview';
    const timerDigits = document.getElementById('stuSatTimerDigits');
    if (timerDigits) timerDigits.textContent = '--:--';
  }

  body.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;padding:48px 24px;max-width:600px;margin:0 auto">
    <div style="width:72px;height:72px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:20px">${isACT ? '📝' : '📘'}</div>
    <h2 style="font-size:22px;font-weight:700;color:#1e293b;margin:0 0 6px">${title}</h2>
    <p style="font-size:14px;color:#64748b;margin:0 0 24px">Please review the test information below before beginning.</p>

    <div style="width:100%;display:flex;gap:12px;margin-bottom:24px">
      <div style="flex:1;background:#f8fafc;border-radius:10px;padding:14px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:#1e293b">${totalSec}</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px">Sections</div>
      </div>
      <div style="flex:1;background:#f8fafc;border-radius:10px;padding:14px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:#1e293b">${totalQ}</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px">Questions</div>
      </div>
      <div style="flex:1;background:#f8fafc;border-radius:10px;padding:14px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:#1e293b">${totalTime}</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px">Minutes</div>
      </div>
    </div>

    <div style="width:100%;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:24px">
      <div style="padding:10px 16px;background:#f8fafc;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #e5e7eb">Test Sections</div>
      ${sectionRows}
    </div>

    <div style="width:100%;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;margin-bottom:28px">
      <div style="font-size:13px;font-weight:600;color:#92400e;margin-bottom:4px">⚠️ Important</div>
      <ul style="margin:0;padding:0 0 0 16px;font-size:13px;color:#78350f;line-height:1.6">
        <li>You cannot return to a section after submitting it.</li>
        <li>Each section has a time limit — the timer starts when you begin.</li>
        ${isACT ? '<li>A 15-minute break is provided after the Mathematics section.</li>' : '<li>A 10-minute break is provided between Reading &amp; Writing and Math.</li>'}
        <li>Use the tools menu for accessibility features.</li>
      </ul>
    </div>

    <button onclick="${beginFn}" style="padding:14px 40px;background:${accent};color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:.15s;box-shadow:0 2px 8px rgba(0,0,0,.12)">Begin Test →</button>
  </div>`;
}

function stuRenderActSectionBar(pk) {
  const st = STU_STATE[pk];
  const bar = document.getElementById('stuActSectionBar');
  bar.innerHTML = st.sections.map((sec, i) => {
    const isLocked = st.lockedSecs.has(i);
    const isActive = i === st.currentSecIdx;
    const isFuture = i > st.currentSecIdx && !isLocked;
    const secQ = st.questions.filter(q => q.section === sec.id);
    let status = '';
    if (isLocked) status = ' <span class="lock-icon">✓</span>';
    else if (isFuture) status = ' <span class="lock-icon">🔒</span>';
    const cls = ['stu-sec-tab', isActive ? 'active' : '', (isLocked || isFuture) ? 'locked' : ''].filter(Boolean).join(' ');
    return `<div class="${cls}">
      ${sec.name}
      <span class="sec-badge">${secQ.length}</span>
      ${status}
    </div>`;
  }).join('');
}

function stuSwitchActSection(pk, secIdx) {
  const st = STU_STATE[pk];
  stuActSetChrome('test');
  st.currentSecIdx = secIdx;
  const sec = st.sections[secIdx];

  // ACT sections are sequential; do not show clickable-looking section tabs.
  const secBar = document.getElementById('stuActSectionBar');
  if (secBar) secBar.style.display = 'none';
  stuRefreshActExtChip(pk);

  // Update header — apply ext-time multiplier so the displayed minutes
  // and the timer countdown reflect the per-section accommodated budget
  // (e.g. 45 min English × 1.2 = 54 min for an IEP student).
  document.getElementById('stuActSecLabel').textContent = sec.name;
  const baseSecTime = sec.time || 35;
  const ext = st.extMultiplier || 1.0;
  const secTime = Math.round(baseSecTime * ext);
  document.getElementById('stuActMin').textContent = String(secTime).padStart(2, '0');
  document.getElementById('stuActSec').textContent = '00';
  const actTimerDigits = document.getElementById('stuActTimerDigits');
  if (actTimerDigits) actTimerDigits.textContent = `${String(secTime).padStart(2, '0')}:00`;

  stuStartTimer(pk, secTime, {
    onWarning: () => stuShow5MinWarning(pk),
    onTimeUp: () => stuTimeUpAutoSubmit(pk)
  });

  // Get section questions
  const secQ = st.questions.map((q, gi) => ({ ...q, globalIdx: gi })).filter(q => q.section === sec.id);
  st._secQuestions = secQ;

  // Update ANSWERED badge
  stuActUpdateAnswered(pk);

  // Render body
  stuRenderBody(pk, 'stuActBody', { hasSectionBar: true });

  // ACT student shell: left tools, centered question menu, right navigation.
  // Tools per section follow the ACT-style digital test shell:
  //   • Calculator + Graphing Calculator: Math only
  //   • Highlights & Notes: any section with passages
  //   • Highlighter / Eliminator / Mask / Line Reader / Contrast / Zoom: all
  //   • Scratch paper is provided physically by the proctor — no on-screen
  //     scratch pad is offered (mirrors official ACT online testing).
  const footerEl = document.getElementById('stuActFooter');
  const isMath = sec.id === 'act-math';
  const isPassageSec = sec.id === 'act-eng' || sec.id === 'act-reading';
  const qMenuIcon = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  footerEl.innerHTML = `<div style="display:flex;align-items:center;gap:6px">
      <div style="position:relative">
        <button class="act-toolbar-btn" onclick="stuActToggleToolsMenu('${pk}')" id="${pk}-toolsBtn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          TOOLS
        </button>
        <div class="act-tools-dropdown" id="${pk}-toolsDropdown">
          <button onclick="stuToggleLineReader('${pk}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg> Line Reader</button>
          <button onclick="stuToggleElimMode('${pk}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg> Answer Eliminator</button>
          <button onclick="stuToggleAnswerMask('${pk}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/></svg> Answer Masking</button>
          <div class="tool-sep"></div>
          <button onclick="stuToggleContrast('${pk}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/></svg> Color Contrast</button>
        </div>
      </div>
      ${isMath ? `<button class="act-toolbar-btn" onclick="stuToggleCalc('${pk}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="16" y2="18"/></svg> CALCULATOR</button>` : ''}
      <button class="act-toolbar-btn" id="${pk}-hlBtn" onclick="stuActToggleHL('${pk}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> HIGHLIGHTER</button>
      <button class="act-toolbar-btn" id="${pk}-flagBtn" onclick="stuActFlagCurrent('${pk}')">
        ${flagSvg} FLAG
      </button>
    </div>
    <button class="sat-q-menu-trigger" id="${pk}-footerQMenu" onclick="stuOpenNavPanel('${pk}')">Question 1 of ${secQ.length} ${qMenuIcon}</button>
    <div style="display:flex;align-items:center;gap:8px">
      <button class="act-nav-btn" onclick="stuActFooterPrev('${pk}')">Back</button>
      <button class="act-endtest-btn" id="${pk}-nextBtn" onclick="stuActFooterNextOrSubmit('${pk}')">Next</button>
    </div>`;

  // Navigate to first question in section
  stuActGoLocal(pk, 0);
}

function stuActUpdateAnswered(pk) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ) return;
  const cnt = secQ.filter(q => st.answered.has(q.globalIdx)).length;
  const el = document.getElementById('stuActAnswered');
  if (el) el.textContent = `ANSWERED ${cnt} OF ${secQ.length}`;
}

function stuActToggleToolsMenu(pk) {
  const dd = document.getElementById(pk + '-toolsDropdown');
  if (dd) dd.classList.toggle('open');
}

function stuActToggleHL(pk) {
  const btn = document.getElementById(pk + '-hlBtn');
  if (btn) btn.classList.toggle('active-tool');
}

function stuActToggleIndex(pk) {
  const panel = document.getElementById(pk + '-indexPanel');
  const overlay = document.getElementById(pk + '-indexOverlay');
  if (!panel || !overlay) return;
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open');
  overlay.classList.toggle('open');
  if (!isOpen) stuActRenderIndex(pk);
}

function stuActRenderIndex(pk) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ) return;
  const list = document.getElementById(pk + '-indexList');
  if (!list) return;
  list.innerHTML = secQ.map((q, i) => {
    const gi = q.globalIdx;
    const isCurrent = gi === st.current;
    const isAnswered = st.answered.has(gi);
    const isFlagged = st.marked.has(gi);
    const cls = ['act-index-item', isCurrent ? 'current' : '', isAnswered ? 'answered' : '', isFlagged ? 'flagged' : ''].filter(Boolean).join(' ');
    return `<div class="${cls}" onclick="stuActGoLocal('${pk}',${i});stuActToggleIndex('${pk}')">
      <span class="idx-num">${i + 1}</span>
      <span>Question ${i + 1}</span>
      ${isAnswered ? '<span class="idx-label">Answered</span>' : ''}
      ${isFlagged ? '<span class="idx-label" style="color:#f97316">Flagged</span>' : ''}
    </div>`;
  }).join('');
}

function stuActGoLocal(pk, localIdx) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ || localIdx < 0 || localIdx >= secQ.length) return;
  const globalIdx = secQ[localIdx].globalIdx;
  st.current = globalIdx;

  // Update header info
  document.getElementById('stuActSecInfo').textContent = `Question ${localIdx + 1} of ${secQ.length}`;
  const qMenuLabel = `Question ${localIdx + 1} of ${secQ.length}`;
  const qMenuIcon = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const headerMenu = document.getElementById('stuActModuleInfo');
  if (headerMenu) headerMenu.innerHTML = `${qMenuLabel} ${qMenuIcon}`;
  const footerMenu = document.getElementById(pk + '-footerQMenu');
  if (footerMenu) footerMenu.innerHTML = `${qMenuLabel} ${qMenuIcon}`;

  const q = st.questions[globalIdx];
  const isMarked = st.marked.has(globalIdx);
  const area = document.getElementById(pk + '-qArea');
  const typeName = TYPE_LABELS[q.type] || 'Multiple Choice';
  const hasPassage = !!q.passage;
  const savedAnswer = st.answers[globalIdx];
  let answerHtml = '';
  let stemHtml = q.text || '';
  if (q.type === 'ACT_WRITING') {
    const aw = actWritingData(q);
    stemHtml = '';
    if (st.reviewMode) {
      // ── Review mode: read-only essay + rubric breakdown ──────────────
      // Pull score / domain / meta from the report fixture so review reflects
      // the same data the score report shows. Falls back to live answer or
      // the prototype's seeded essayPreview when no live submission exists.
      const meta = ACT_REPORT?.derived?.writingMeta || {};
      const domainScores = ACT_REPORT?.derived?.writingDomains || q.domainScores || {};
      const score = ACT_REPORT?.derived?.writing || q.score || '—';
      const reviewState = ACT_REPORT?.derived?.writingReviewState || q.reviewState || 'Auto-scored';
      const essayText = (savedAnswer && String(savedAnswer).trim()) || meta.essayPreview || q.response || '';
      const essayParas = essayText
        ? essayText.split(/\n+/).map(p => `<p>${p.trim()}</p>`).join('')
        : '';
      const wc = essayText ? essayText.trim().split(/\s+/).filter(Boolean).length : 0;
      const timeUsed = meta.timeUsedMin ?? 0;
      const timeAllowed = meta.timeAllowedMin ?? 40;
      const wordTarget = meta.wordTarget || [300, 500];
      const lookupDomain = (label) => {
        return domainScores[label]
          || domainScores[label.replace(' and ', ' & ')]
          || domainScores[label.replace(' & ', ' and ')]
          || 0;
      };
      // ── ACT Writing Test Rubric — 6 levels per rater ──
      // Domain score (2–12) = sum of two raters, each scoring 1–6 per domain.
      // Map score → average per-rater level so we can show the official ACT
      // rubric language for that level. Adapted (paraphrased for length)
      // from the public ACT Writing Test Rubric.
      const ACT_RUBRIC = {
        levelLabel: { 6:'Effective', 5:'Well-developed', 4:'Adequate', 3:'Developing', 2:'Weak', 1:'Inadequate' },
        domains: {
          'Ideas and Analysis': {
            6:'Generates an argument that critically engages with multiple perspectives. Thesis reflects a precise position; engagement with implications and underlying values is nuanced.',
            5:'Generates a thoughtful argument on the issue. Thesis reflects clarity in thought and purpose; engagement with multiple perspectives recognizes implications and complications.',
            4:'Generates an argument that responds productively to multiple perspectives. Thesis reflects clarity in thought; engagement is recognizable but limited.',
            3:'Generates an argument that weakly responds to multiple perspectives. Thesis reflects some clarity, but engagement with other perspectives is unclear or simplistic.',
            2:'Generates an argument that weakly responds to the issue. Position lacks clarity; engagement with other perspectives is largely missing.',
            1:'Fails to generate a clear argument on the issue. Position is unclear or absent.',
          },
          'Development and Support': {
            6:'Reasoning and illustration are skillful. Qualifications and complications enrich the argument; ideas are convincingly developed.',
            5:'Reasoning and illustration are credible and clarifying. Most ideas are developed with thoughtful explanations and well-chosen examples.',
            4:'Reasoning and illustration adequately develop the argument. Examples and explanations clarify meaning and support the perspective.',
            3:'Reasoning and illustration are mostly relevant but tend to restate ideas or remain general. Development is inconsistent.',
            2:'Reasoning and illustration are weak; explanations mostly repeat claims rather than support them.',
            1:'Reasoning and illustration are absent or fail to support any argument.',
          },
          'Organization': {
            6:'Skillful organization unifies the argument. Logical sequencing, effective grouping, and purposeful transitions strengthen relationships among ideas.',
            5:'Productive organization unifies the argument. Logical sequencing and clear transitions reinforce relationships among ideas.',
            4:'Clear organization. Logical grouping and adequate transitions clarify relationships among ideas.',
            3:'Basic organization. Grouping and transitions are present but inconsistent; the through-line is sometimes hard to follow.',
            2:'Weak organization. Grouping is unclear and transitions are abrupt or missing.',
            1:'Little or no organization. Ideas appear in random order; the reader cannot follow the argument.',
          },
          'Language Use and Conventions': {
            6:'Skillful use of language. Word choice is precise and varied, syntax is varied and effective, and conventions rarely impede meaning.',
            5:'Well-developed use of language. Word choice is precise, sentence structure is varied, and minor convention errors do not impede meaning.',
            4:'Adequate use of language. Word choice and sentence structure are appropriate; convention errors are present but do not impede meaning.',
            3:'Developing use of language. Word choice is mostly appropriate but sentence structure becomes simple or repetitive; some errors distract.',
            2:'Weak use of language. Word choice and sentence structure are limited; convention errors begin to impede meaning.',
            1:'Inadequate use of language. Word choice and sentence structure are unclear; convention errors impede understanding.',
          },
        },
      };
      // Domain score 2–12 → per-rater level 1–6 (round half-up so 7 → 4, 9 → 5, etc.)
      const toLvl = (v) => Math.max(1, Math.min(6, Math.round((v || 0) / 2)));
      const domainCards = aw.rubricDomains.map(d => {
        const v = lookupDomain(d.label);
        const lvl = v ? toLvl(v) : 0;
        const lvlName = lvl ? ACT_RUBRIC.levelLabel[lvl] : '—';
        const desc = lvl ? (ACT_RUBRIC.domains[d.label]?.[lvl] || d.desc) : d.desc;
        return `<div class="aw-rv-rubric-card lvl-${lvl}">
          <div class="top"><b>${d.label}</b><span class="v">${v || '—'}<span class="u">/12</span></span></div>
          <div class="actlvl">
            <span class="lvl-num">Level ${lvl || '—'} of 6</span>
            <span class="lvl-name">${lvlName}</span>
          </div>
          <div class="desc">${desc}</div>
        </div>`;
      }).join('');
      // Teacher feedback callout — surfaces the human note a teacher left
      // during grading. No AI / algorithmic fallback: when the field is
      // empty or grading is still pending, the entire callout disappears
      // (students should never see synthetic "feedback" presented as if a
      // teacher wrote it). Source: ACT_REPORT.derived.writingTeacherFeedback.
      const feedbackText = String(ACT_REPORT?.derived?.writingTeacherFeedback || '').trim();
      const feedbackPending = reviewState && /pending/i.test(reviewState);
      const nextStepHtml = (!feedbackPending && feedbackText) ? `<div class="aw-rv-next">
          <div>
            <b>Feedback</b>
            <p>${feedbackText}</p>
          </div>
        </div>` : '';
      answerHtml = `<div class="act-writing-review">
        <div class="aw-rv-score">
          <div class="aw-rv-score-num">
            <div class="v">${score}<span class="u">/12</span></div>
            <div class="lbl">Writing Score</div>
          </div>
          <div class="aw-rv-score-meta">
            <div class="aw-rv-score-title">${aw.title}</div>
            <div class="aw-rv-score-state">${reviewState}</div>
            <div class="aw-rv-score-stats">
              <span><b>${timeUsed}m</b> used <span class="dim">/ ${timeAllowed}m allowed</span></span>
              <span><b>${wc}</b> words <span class="dim">/ target ${wordTarget[0]}–${wordTarget[1]}</span></span>
              <span><b>4</b> domains <span class="dim">· 12 pts each</span></span>
            </div>
          </div>
        </div>
        <details class="aw-rv-prompt">
          <summary>
            <span class="ttl"><span class="chev">▶</span> The prompt you responded to</span>
            <span class="toggle">Click to expand</span>
          </summary>
          <div class="aw-rv-prompt-body">
            <p>${aw.issue}</p>
            ${aw.perspectives.map((p, i) => `<div class="perspective"><b>${p.label || `Perspective ${i + 1}`}</b><br>${p.text || ''}</div>`).join('')}
            <p style="margin-top:14px;color:#475569"><b style="color:#190d40">Essay Task —</b> Write a unified, coherent essay about <em>${aw.topic}</em>. In your essay, be sure to:</p>
            <ul style="margin:6px 0 0;padding-left:20px;color:#374151;font-size:13px;line-height:1.65">${aw.taskInstructions.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
        </details>
        <div class="aw-rv-essay">
          <div class="aw-rv-essay-head">
            <span class="ttl">Your essay</span>
            <span class="meta"><b>${wc}</b> words · <b>${timeUsed}m</b> spent · auto-saved</span>
          </div>
          <div class="aw-rv-essay-body">${essayParas || '<div class="aw-rv-essay-empty">No essay submission on record.</div>'}</div>
        </div>
        <div class="aw-rv-rubric">
          <div class="aw-rv-rubric-head">Rubric feedback · 4 ACT domains</div>
          <div class="aw-rv-rubric-sub">Each domain is scored 1–6 per rater (two raters → 2–12 total). The description below shows the ACT rubric language for the level your essay landed at.</div>
          <div class="aw-rv-rubric-grid">${domainCards}</div>
          <div class="aw-rv-rubric-foot">Descriptions adapted from the ACT Writing Test Rubric.</div>
        </div>
        ${nextStepHtml}
      </div>`;
    } else {
      // ── Live composition mode (during the timed exam) ────────────────
      const wc = savedAnswer ? String(savedAnswer).trim().split(/\s+/).filter(Boolean).length : 0;
      const plan = st.writingPlans?.[globalIdx] || '';
      // Build a single quickbar/drawer "view-prompt" surface so the
      // student can jump to any part of the prompt while drafting,
      // without scrolling back up. Two layers:
      //   • Sticky chip bar (sits between stim and essay) — a thin
      //     scroll-pinned row with one chip per prompt section. Lets
      //     the student peek + scroll-up via anchor while still seeing
      //     the essay area.
      //   • Floating "View prompt" FAB + right-side drawer — opens a
      //     full prompt mirror (issue / 3 perspectives / essay task)
      //     with quick-jump tabs. Stays put while drafting.
      const drawerSections = [
        { id:'issue', label:'Issue',           html:`<h3>${aw.title}</h3><p>${aw.issue}</p>` },
        ...aw.perspectives.map((p, i) => ({
          id:`p${i+1}`,
          label:p.label || `Perspective ${['One','Two','Three'][i] || (i+1)}`,
          html:`<div class="aw-d-kicker">${p.label || `Perspective ${['One','Two','Three'][i] || (i+1)}`}</div><p>${p.text || ''}</p>`
        })),
        { id:'task', label:'Essay Task',
          html:`<div class="aw-d-kicker">Essay Task</div>
            <p>Write a unified, coherent essay about <em>${aw.topic}</em>. In your essay, be sure to:</p>
            <ul>${aw.taskInstructions.map(t => `<li>${t}</li>`).join('')}</ul>
            ${aw.taskFootnote ? `<p class="aw-d-foot">${aw.taskFootnote}</p>` : ''}` }
      ];
      const drawerTabs = drawerSections.map((s, i) =>
        `<button class="aw-drawer-tab${i===0?' active':''}" data-tab="${s.id}" onclick="awOpenDrawer('${s.id}')">${s.label}</button>`
      ).join('');
      const drawerBody = drawerSections.map(s =>
        `<section id="aw-d-${s.id}" data-section="${s.id}">${s.html}</section>`
      ).join('');

      answerHtml = `<div class="act-writing-student">
        <article class="aw-stim" id="awStim">
          <div class="aw-stim-kicker">ACT Writing</div>
          <h3 class="aw-stim-title">${aw.title}</h3>
          <p class="aw-stim-issue">${aw.issue}</p>
          <p class="aw-stim-persp-intro">Read and carefully consider these perspectives. Each suggests a particular way of thinking about ${aw.topic}.</p>
          <div class="aw-stim-persp-grid">
            ${aw.perspectives.map((p, i) => `<div class="aw-persp-col">
              <div class="aw-persp-num">${p.label || `Perspective ${['One','Two','Three'][i] || (i+1)}`}</div>
              <p>${p.text || ''}</p>
            </div>`).join('')}
          </div>
          <div class="aw-stim-task">
            <h4>Essay Task</h4>
            <p>Write a unified, coherent essay about <em>${aw.topic}</em>. In your essay, be sure to:</p>
            <ul>${aw.taskInstructions.map(t => `<li>${t}</li>`).join('')}</ul>
            ${aw.taskFootnote ? `<p class="aw-stim-task-foot">${aw.taskFootnote}</p>` : ''}
          </div>
        </article>

        <section class="aw-resp">
          <div class="aw-resp-head">
            <div class="aw-resp-head-ttl">Your Essay</div>
            <div class="aw-resp-head-sub">Auto-saving as you type</div>
          </div>
          <div class="aw-plan">
            <div class="aw-plan-head">
              <span class="aw-plan-ttl">Planning notes</span>
              <span class="aw-plan-meta">Not scored &middot; for your own use</span>
            </div>
            <textarea placeholder="Brainstorm your perspective, evidence, and how you will respond to a competing view…" oninput="stuActWritingPlan(${globalIdx},'${pk}',this)">${plan}</textarea>
          </div>
          <div class="aw-essay-wrap">
            <textarea class="aw-essay" placeholder="Begin writing your essay here." oninput="stuActWritingAnswer(${globalIdx},'${pk}',this)">${savedAnswer || ''}</textarea>
            <div class="aw-essay-foot">
              <span class="aw-essay-foot-wc"><b id="${pk}-writing-wc">${wc}</b> words</span>
            </div>
          </div>
        </section>
      </div>

      <button class="aw-prompt-fab" type="button" onclick="awOpenDrawer()" aria-label="View prompt">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        View prompt
      </button>

      <div class="aw-drawer-overlay" onclick="awCloseDrawer()"></div>
      <aside class="aw-drawer" role="dialog" aria-label="Writing prompt" aria-modal="true">
        <header class="aw-drawer-head">
          <span class="aw-drawer-head-ttl">${aw.title}</span>
          <button class="aw-drawer-close" onclick="awCloseDrawer()" type="button" aria-label="Close prompt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </header>
        <nav class="aw-drawer-tabs">${drawerTabs}</nav>
        <div class="aw-drawer-body">${drawerBody}</div>
      </aside>`;
    }
  } else if (q.choices) {
    if (st.reviewMode) {
      // Review render: no click handler, no eliminator. Mark the correct
      // option green; if the student picked a wrong option, mark it red.
      // For skipped items, prepend a neutral banner so the page doesn't
      // look identical to a correctly answered question (where the only
      // visual signal is the green correct option).
      const isSkipped = savedAnswer === undefined || savedAnswer === null;
      const skippedBanner = isSkipped
        ? `<div class="stu-review-skipped-banner">
            <span class="icon" aria-hidden="true">⊘</span>
            <span><b>You skipped this question.</b> The correct answer is highlighted below.</span>
          </div>`
        : '';
      answerHtml = skippedBanner + `<ul class="stu-choices review">${q.choices.map((c, ci) => {
        const isCorrect = ci === q.correct;
        const isStudent = ci === savedAnswer;
        const cls = [];
        if (isCorrect) cls.push('review-correct');
        else if (isStudent) cls.push('review-wrong');
        let mark = '';
        if (isCorrect) mark = '<span class="review-mark">Correct</span>';
        else if (isStudent) mark = '<span class="review-mark">Your answer</span>';
        return `<li class="${cls.join(' ')}"><span class="letter">${String.fromCharCode(65+ci)}</span><span>${c}</span>${mark}</li>`;
      }).join('')}</ul>`;
    } else {
      const elims = st.eliminated?.[globalIdx] || new Set();
      answerHtml = `<ul class="stu-choices">${q.choices.map((c, ci) =>
        `<li class="${savedAnswer === ci ? 'selected' : ''} ${elims.has(ci) ? 'eliminated' : ''}" onclick="stuActSelect(this,${globalIdx},${ci},'${pk}')"><span class="letter">${String.fromCharCode(65+ci)}</span><span>${c}</span><button class="stu-elim ${elims.has(ci) ? 'undo' : ''}" onclick="event.stopPropagation();stuToggleElim('${pk}',${globalIdx},${ci},this.parentElement)" title="${elims.has(ci) ? 'Undo elimination' : 'Eliminate'}">${stuElimButtonHtml(elims.has(ci))}</button></li>`
      ).join('')}</ul>`;
    }
  } else {
    answerHtml = `<textarea style="width:100%;min-height:100px;border:1px solid #e4e4e7;border-radius:10px;padding:12px;font-size:14px;font-family:inherit;resize:vertical" placeholder="Type your answer..." oninput="stuActAnswer(${globalIdx},'${pk}')">${savedAnswer || ''}</textarea>`;
  }

  let reviewBanner = '';
  let reviewExplanation = '';
  if (st.reviewMode) {
    const status = actReviewQStatus(q, savedAnswer);
    const sec = st.sections[st.currentSecIdx]?.name || '';
    const pillCls = status === 'correct' ? 'correct' : status === 'wrong' ? 'wrong' : status === 'blank' ? 'blank' : '';
    const pillLabel = status === 'correct' ? 'Correct' : status === 'wrong' ? 'Incorrect' : status === 'blank' ? 'Skipped' : 'Essay';
    // "Showing all questions" is the default state and tells the user nothing
    // they didn't already see — only surface the filter label when an active,
    // non-default filter is selected.
    const filterLbl = st.reviewFilter === 'wrong'   ? 'Showing wrong answers only'
                    : st.reviewFilter === 'correct' ? 'Showing correct answers only'
                    : '';
    reviewBanner = `<div class="stu-review-banner">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:11px;color:#1e40af;font-weight:900;letter-spacing:.4px">REVIEW MODE</span>
        <span style="font-size:11px;color:#3730a3;font-weight:600">${sec}${filterLbl ? ` · ${filterLbl}` : ''}</span>
      </div>
      <div class="stu-review-actions">
        <button onclick="stuActExitReview()">← Back to report</button>
      </div>
    </div>`;
    if (q.type !== 'ACT_WRITING' && q.type !== 'ESSAY' && q.choices) {
      // Status pills removed: the answer list above already encodes the
      // verdict via the green/red border + per-choice CORRECT/YOUR ANSWER
      // markers. Re-stating "Correct · A / Your answer · A" as separate
      // pills was pure duplication, so the explanation card now goes
      // straight to the labeled body.
      // Passage reference pill (e.g. "PARAGRAPH 1, LINES 1-2") is only
      // useful when there is no passage to highlight — for passage-based
      // items the left panel already underlines/scrolls to the cited span,
      // so repeating it here is redundant.
      const refPill = (!hasPassage && q.ref)
        ? `<div class="review-meta"><span class="review-meta-pill">${q.ref}</span></div>`
        : '';
      reviewExplanation = `<div class="stu-review-explanation">
        ${refPill}
        <h4>Explanation</h4>
        <div>${actReviewExplanation(q)}</div>
      </div>`;
    } else if (q.type === 'ACT_WRITING' || q.type === 'ESSAY') {
      // ACT Writing review now embeds the essay + rubric directly in
      // answerHtml, so the bottom block is redundant for it. Other
      // constructed-response types use a single "Feedback" pill in the
      // metadata row position (where the 3 answer-pills would sit).
      if (q.type !== 'ACT_WRITING') {
        reviewExplanation = `<div class="stu-review-explanation">
          <div class="review-meta">
            <span class="review-meta-pill">Feedback</span>
            ${q.ref ? `<span class="review-meta-pill">${q.ref}</span>` : ''}
          </div>
          <div>Essays and short-answer items are scored against the rubric in the report. Open the analytics tab on the report page to see domain scores.</div>
        </div>`;
      }
    } else if (q.choices === undefined) {
      // Edge case: non-essay item without choices (e.g., short answer).
      // Use the Feedback pill fallback so review pages never dead-end
      // with an empty info area.
      reviewExplanation = `<div class="stu-review-explanation">
        <div class="review-meta">
          <span class="review-meta-pill">Feedback</span>
          ${q.ref ? `<span class="review-meta-pill">${q.ref}</span>` : ''}
        </div>
        <div>${actReviewExplanation(q)}</div>
      </div>`;
    }
  }

  let qInner = `${reviewBanner}<div class="stu-q-card">
    <div class="stu-q-head">
      <div style="display:flex;align-items:center;gap:6px">
        <div class="q-order">${localIdx + 1}</div>
        <span class="q-type">${typeName}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <button class="stu-q-bookmark ${isMarked ? 'active' : ''}" onclick="stuActToggleMark('${pk}',${globalIdx},${localIdx})" title="Flag for Review">
          ${isMarked ? flagFilled : flagSvg}
        </button>
        <div class="q-pts"><span>${q.pts || 1}</span><span>${(q.pts||1) > 1 ? 'pts' : 'pt'}</span></div>
      </div>
    </div>
    ${stemHtml ? `<div class="stu-q-stem">${stemHtml}</div>` : ''}
    ${answerHtml}
    ${reviewExplanation}
  </div>`;

  if (hasPassage) {
    const passageText = (q.passage.fullText || '').replace(/class="q-ref"/g, 'class="stu-hl-src"');
    area.innerHTML = `<div class="stu-passage-split ${stuNotesHidden(pk) ? 'notes-hidden' : ''}">
      <div class="stu-passage-panel" id="${pk}-pass">
        <div class="passage-title">${q.passage.title}</div>
        ${passageText}
      </div>
      ${stuPassageNotesHtml(pk, globalIdx)}
      <div class="stu-passage-resize" onmousedown="stuStartResize(event,'${pk}')"></div>
      <div class="stu-q-right">${qInner}</div>
    </div>`;
    stuRestorePassageState(pk, globalIdx);
    const panel = document.getElementById(pk + '-pass');
    if (panel) {
      panel.querySelectorAll('.stu-hl-src').forEach(el => {
        el.classList.toggle('stu-hl-active', el.dataset.q == String(q.n));
      });
      const ref = panel.querySelector(`.stu-hl-src[data-q="${q.n}"]`);
      if (ref) setTimeout(() => ref.scrollIntoView({ behavior:'smooth', block:'center' }), 100);
    }
    stuInitPassageHL(pk);
  } else {
    // No passage (Math / English / Science single items + ACT_WRITING):
    // render the question directly. We deliberately drop the `stu-passage-split
    // simple` wrapper and the side Notes rail here — passage notes are tied
    // to passage-based items, and the wrapper would also reactivate the
    // full-width `:has(.stu-passage-split)` override and undo our 760px
    // centered column.
    area.innerHTML = qInner;
  }

  // ACT Gateway: No separate actions row — Nav uses top bar Prev/Next
  const actionsEl = document.getElementById(pk + '-actions');
  if (actionsEl) actionsEl.innerHTML = '';

  // Update FLAG button in bottom toolbar
  const flagBtn = document.getElementById(pk + '-flagBtn');
  if (flagBtn) {
    flagBtn.className = 'act-toolbar-btn' + (isMarked ? ' active-tool' : '');
    flagBtn.innerHTML = (isMarked ? flagFilled : flagSvg) + ' FLAG';
    if (isMarked) flagBtn.style.cssText = 'background:#fff7ed;border-color:#f97316;color:#f97316';
    else flagBtn.style.cssText = '';
  }

  // Update ITEM COUNTER
  const counter = document.getElementById(pk + '-itemCounter');
  if (counter) counter.textContent = `${localIdx + 1} of ${secQ.length}`;
  const nextBtn = document.getElementById(pk + '-nextBtn');
  if (nextBtn) {
    if (st.reviewMode) {
      const atEnd = localIdx === secQ.length - 1;
      nextBtn.textContent = atEnd ? 'End of section' : 'Next';
      nextBtn.disabled = atEnd;
      nextBtn.style.opacity = atEnd ? '0.55' : '';
      nextBtn.style.cursor = atEnd ? 'default' : '';
    } else {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '';
      nextBtn.style.cursor = '';
      nextBtn.textContent = localIdx === secQ.length - 1 ? 'Submit Section' : 'Next';
    }
  }

  // Update ANSWERED badge
  stuActUpdateAnswered(pk);

  // Sync scratch pad per question
  if (_scratchPads[pk]?.currentQKey) {
    const qKey = pk + '-q-' + localIdx;
    if (_scratchPads[pk].currentQKey !== qKey) _scratchLoadForQuestion(pk, qKey);
  }

  // Reapply masking if active
  if (STU_TOOLS[pk]?.maskingOn) setTimeout(() => stuApplyMasking(pk), 10);
}

function stuActSelect(li, globalIdx, choiceIdx, pk) {
  if (li.classList.contains('eliminated')) return;
  li.parentElement.querySelectorAll('li').forEach(l => l.classList.remove('selected'));
  li.classList.add('selected');
  STU_STATE[pk].answered.add(globalIdx);
  STU_STATE[pk].answers[globalIdx] = choiceIdx;
  stuActUpdateAnswered(pk);
}

function stuActAnswer(globalIdx, pk) {
  STU_STATE[pk].answered.add(globalIdx);
}

function stuActWritingAnswer(globalIdx, pk, textarea) {
  const st = STU_STATE[pk];
  if (!st) return;
  st.answers[globalIdx] = textarea.value;
  if (textarea.value.trim()) st.answered.add(globalIdx);
  else st.answered.delete(globalIdx);
  const wc = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
  const wcEl = document.getElementById(pk + '-writing-wc');
  if (wcEl) wcEl.textContent = wc;
  stuActUpdateAnswered(pk);
}
function stuActWritingPlan(globalIdx, pk, textarea) {
  const st = STU_STATE[pk];
  if (!st) return;
  if (!st.writingPlans) st.writingPlans = {};
  st.writingPlans[globalIdx] = textarea.value;
}

// ── ACT Writing prompt drawer ─────────────────────────────────────
// Open the right-side prompt drawer; if a sectionId is given, scroll
// to that section in the drawer body and mark its tab active. The
// quickbar chips, the FAB, and the drawer's own tabs all funnel
// through awOpenDrawer() so behavior stays consistent.
function awOpenDrawer(sectionId) {
  const overlay = document.querySelector('.aw-drawer-overlay');
  const drawer = document.querySelector('.aw-drawer');
  if (!overlay || !drawer) return;
  overlay.classList.add('open');
  drawer.classList.add('open');
  if (!awOpenDrawer._lastFocus) {
    awOpenDrawer._lastFocus = document.activeElement;
  }
  // Defer the scroll so the drawer transition has a frame to start
  // and scrollIntoView lands at the final layout, not the offstage one.
  requestAnimationFrame(() => {
    const targetId = sectionId || (drawer.querySelector('.aw-drawer-tab.active')?.dataset?.tab) || 'issue';
    const target = drawer.querySelector(`#aw-d-${targetId}`);
    if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
    drawer.querySelectorAll('.aw-drawer-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === targetId)
    );
    drawer.querySelector('.aw-drawer-close')?.focus();
  });
}
function awCloseDrawer() {
  const overlay = document.querySelector('.aw-drawer-overlay');
  const drawer = document.querySelector('.aw-drawer');
  if (!overlay || !drawer) return;
  overlay.classList.remove('open');
  drawer.classList.remove('open');
  // Return focus to whatever the student was working on (essay or
  // plan textarea), if it's still around.
  const last = awOpenDrawer._lastFocus;
  awOpenDrawer._lastFocus = null;
  if (last && document.contains(last) && typeof last.focus === 'function') {
    setTimeout(() => last.focus(), 0);
  }
}
// Bind Esc-to-close once at the document level.
if (!window._awEscBound) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.querySelector('.aw-drawer.open')) {
      awCloseDrawer();
    }
  });
  window._awEscBound = true;
}

function stuActToggleMark(pk, globalIdx, localIdx) {
  const st = STU_STATE[pk];
  if (st.marked.has(globalIdx)) st.marked.delete(globalIdx); else st.marked.add(globalIdx);
  stuActGoLocal(pk, localIdx);
}

function stuActFlagCurrent(pk) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ) return;
  const localIdx = secQ.findIndex(q => q.globalIdx === st.current);
  if (localIdx < 0) return;
  stuActToggleMark(pk, st.current, localIdx);
}

function stuActFooterPrev(pk) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ) return;
  const localIdx = secQ.findIndex(q => q.globalIdx === st.current);
  if (localIdx > 0) stuActGoLocal(pk, localIdx - 1);
}

function stuActFooterNext(pk) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ) return;
  const localIdx = secQ.findIndex(q => q.globalIdx === st.current);
  if (localIdx < secQ.length - 1) stuActGoLocal(pk, localIdx + 1);
}

function stuActFooterNextOrSubmit(pk) {
  const st = STU_STATE[pk];
  const secQ = st?._secQuestions;
  if (!secQ) return;
  const localIdx = secQ.findIndex(q => q.globalIdx === st.current);
  if (st.reviewMode) {
    // In review mode the Next button never submits; it just walks to the
    // next question and stops at the last one (use the back-to-report
    // banner button to exit).
    if (localIdx < secQ.length - 1) stuActGoLocal(pk, localIdx + 1);
    return;
  }
  if (localIdx >= secQ.length - 1) stuActSubmitSection(pk);
  else stuActGoLocal(pk, localIdx + 1);
}

function stuActSubmitSection(pk) {
  stuStopTimer(pk);
  const st = STU_STATE[pk];
  const secIdx = st.currentSecIdx;
  const sec = st.sections[secIdx];
  const secQ = st.questions.filter(q => q.section === sec.id);
  const answeredCount = secQ.filter((q, i) => {
    const gi = st.questions.indexOf(q);
    return st.answered.has(gi);
  }).length;
  const unanswered = secQ.length - answeredCount;

  stuModal({
    icon:'📋', iconType:'warn',
    title:`Submit ${sec.name}?`,
    body:`<p>You cannot return to this section after submitting.</p>
      <div class="stat">
        <div class="stat-item"><span class="val">${answeredCount}</span><span class="lbl">Answered</span></div>
        <div class="stat-item"><span class="val">${unanswered}</span><span class="lbl">Unanswered</span></div>
        <div class="stat-item"><span class="val">${secQ.length}</span><span class="lbl">Total</span></div>
      </div>`,
    confirmText:'Submit Section', confirmClass:'danger',
    onConfirm(){
      st.lockedSecs.add(secIdx);
      let nextIdx = -1;
      for (let i = 0; i < st.sections.length; i++) {
        if (!st.lockedSecs.has(i)) { nextIdx = i; break; }
      }
      if (nextIdx >= 0) {
        // ACT Enhanced break placement (PRD §3.5): name-based so it
        // works regardless of which optional sections the student
        // opted into.
        //   * 10-min break after Math (mandatory before Reading)
        //   * 5-min break after Science only when Writing is next
        const justName = (sec.name || '').toLowerCase();
        const nextName = (st.sections[nextIdx]?.name || '').toLowerCase();
        let breakMin = 0;
        if (justName.includes('math')) breakMin = 10;
        else if (justName.includes('science') && nextName.includes('writing')) breakMin = 5;
        if (breakMin > 0) {
          stuActShowBreak(pk, nextIdx, breakMin);
        } else {
          stuActShowSectionDirections(pk, nextIdx);
        }
      } else {
        stuExamComplete(pk, 'act');
      }
    }
  });
  return;
}

// ═══════ ACT BREAK SCREEN ═══════
// Calm, brand-aligned break screen. `breakMin` defaults to 10 (the
// mandatory Math→Reading break) but supports the 5-min Science→Writing
// break too — see PRD §3.5 break rules.
function stuActShowBreak(pk, nextIdx, breakMin) {
  const minutes = Number.isFinite(breakMin) && breakMin > 0 ? breakMin : 10;
  const body = document.getElementById('stuActBody');
  const footer = document.getElementById('stuActFooter');
  const secBar = document.getElementById('stuActSectionBar');
  if (secBar) secBar.style.display = 'none';
  if (footer) footer.innerHTML = '';
  stuActSetChrome('overview');

  const st = STU_STATE[pk];
  const justSec = st?.sections?.[st.currentSecIdx];
  const nextSec = st?.sections?.[nextIdx];
  const justName = justSec?.name || 'this section';
  const nextName = nextSec?.name || 'the next section';

  const headerLabel = document.getElementById('stuActSecLabel');
  if (headerLabel) headerLabel.textContent = 'Break';
  const secInfo = document.getElementById('stuActSecInfo');
  if (secInfo) secInfo.textContent = `${String(minutes).padStart(2,'0')}:00 remaining`;

  const fmt = (rem) => String(Math.floor(rem/60)).padStart(2,'0') + ' : ' + String(rem%60).padStart(2,'0');

  body.innerHTML = `<div class="act-bk-wrap">
    <div class="act-bk-card">
      <div class="act-bk-icon">☕</div>
      <div class="act-bk-kicker">${minutes}-minute break</div>
      <h1 class="act-bk-title">Nice work — pause and reset.</h1>
      <p class="act-bk-sub">You finished <b>${justName}</b>. ${nextName} starts when the timer ends or when you resume.</p>

      <div class="act-bk-timer-card">
        <div class="act-bk-timer-label">Time remaining</div>
        <div class="act-bk-timer" id="stuActBreakTimer">${fmt(minutes * 60)}</div>
      </div>

      <p class="act-bk-pitch">Step away, stretch, and breathe. Your timer keeps running but <b>your section progress is saved</b> — answers, flags, and notes are all locked in.</p>

      <button class="act-bk-cta" onclick="stuActShowSectionDirections('${pk}',${nextIdx})">Resume to ${nextName} →</button>

      <div class="act-bk-rules">
        <div class="act-bk-rules-title">During the break</div>
        <ul class="act-bk-rules-list">
          <li><span class="act-bk-rule-dot"></span><span>Don't close this tab — the next section's directions appear here automatically.</span></li>
          <li><span class="act-bk-rule-dot"></span><span>No phones, notes, textbooks, or other web pages. The honor code still applies.</span></li>
          <li><span class="act-bk-rule-dot"></span><span>If you need quiet — water, restroom, a stretch — now's the time.</span></li>
        </ul>
      </div>
    </div>
  </div>`;

  stuStartTimer(pk, minutes, {
    onTick(rem) {
      const el = document.getElementById('stuActBreakTimer');
      if (el) el.textContent = fmt(rem);
      const info = document.getElementById('stuActSecInfo');
      if (info) info.textContent = `${Math.floor(rem/60)}:${String(rem%60).padStart(2,'0')} remaining`;
    },
    onTimeUp() { stuActShowSectionDirections(pk, nextIdx); }
  });
}

// Student passage highlight with annotations
let _stuHlRange = null;
let _stuHlPageKey = null;
let _stuHlGlobalIdx = null;
let _stuHlText = '';
let _stuAnnDraft = null;

function stuEscHtml(v) {
  return String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function stuEnsureAnnotationState(pk) {
  const st = STU_STATE[pk];
  if (!st) return null;
  if (!st.annotations) st.annotations = {};
  if (!st.passageSnapshots) st.passageSnapshots = {};
  return st;
}

function stuCurrentGlobalIdx(pk) {
  const st = STU_STATE[pk];
  return st ? st.current : null;
}

function stuAnnotationList(pk, globalIdx) {
  const st = stuEnsureAnnotationState(pk);
  if (!st || globalIdx == null) return [];
  if (!st.annotations[globalIdx]) st.annotations[globalIdx] = [];
  return st.annotations[globalIdx];
}

function stuMakeAnnId() {
  return 'ann-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

function stuFindAnnotation(pk, globalIdx, annId) {
  return stuAnnotationList(pk, globalIdx).find(a => a.id === annId) || null;
}

function stuNotesHidden(pk) {
  return STU_TOOLS[pk]?.notesHidden !== false;
}

function stuNoteSummary(note) {
  const text = String(note || '').trim();
  return text || 'No note text yet';
}

function stuPassageNotesListHtml(pk, globalIdx) {
  const notes = stuAnnotationList(pk, globalIdx);
  if (!notes.length) {
    return `<div class="stu-notes-title">Notes</div>
      <div class="stu-notes-empty">Highlight any passage text to start a note.</div>`;
  }
  const trashSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path></svg>`;
  return `<div class="stu-notes-title">Notes (${notes.length})</div>
    ${notes.map(a => `<div class="stu-note-card" data-ann-id="${a.id}">
      <div class="stu-note-head">
        <span class="stu-note-quote" title="${stuEscHtml(a.excerpt || 'Selected text')}">${stuEscHtml(a.excerpt || 'Selected text')}</span>
        <button class="stu-note-delete" onclick="stuDeleteNoteFromList('${pk}',${globalIdx},'${a.id}')" title="Delete note">${trashSvg}</button>
      </div>
      <textarea placeholder="Type your note here…" oninput="stuUpdateNoteText('${pk}',${globalIdx},'${a.id}',this.value)">${stuEscHtml(a.note || '')}</textarea>
    </div>`).join('')}`;
}

function stuUpdateNoteText(pk, globalIdx, annId, text) {
  const ann = stuFindAnnotation(pk, globalIdx, annId);
  if (!ann) return;
  ann.note = text;
  const span = document.querySelector(`#${pk}-pass .stu-ann[data-ann-id="${annId}"]`);
  if (span) {
    if (String(text || '').trim()) span.classList.add('stu-annotation');
    else span.classList.remove('stu-annotation');
    stuSnapshotPassage(pk, globalIdx);
  }
}

function stuDeleteNoteFromList(pk, globalIdx, annId) {
  const list = stuAnnotationList(pk, globalIdx);
  const idx = list.findIndex(a => a.id === annId);
  if (idx >= 0) list.splice(idx, 1);
  const target = document.querySelector(`#${pk}-pass .stu-ann[data-ann-id="${annId}"]`);
  if (target) {
    stuUnwrapNode(target);
    stuSnapshotPassage(pk, globalIdx);
  }
  stuRefreshPassageNotes(pk, globalIdx);
}

function stuOpenNotesPanel(pk) {
  if (!STU_TOOLS[pk]) STU_TOOLS[pk] = {};
  STU_TOOLS[pk].notesHidden = false;
  const split = document.getElementById(pk + '-notes')?.closest('.stu-passage-split');
  if (!split) return;
  split.classList.remove('notes-hidden');
  split.querySelectorAll('.stu-notes-toggle').forEach(toggle => {
    toggle.textContent = 'Hide';
    toggle.setAttribute('aria-expanded', 'true');
  });
}

function stuFocusNoteCard(pk, annId) {
  setTimeout(() => {
    const panel = document.getElementById(pk + '-notes');
    const card = panel?.querySelector(`.stu-note-card[data-ann-id="${annId}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior:'smooth', block:'center' });
    card.querySelector('textarea')?.focus();
  }, 60);
}

function stuPassageNotesHtml(pk, globalIdx) {
  const hidden = stuNotesHidden(pk);
  return `<div class="stu-notes-toggle-rail"><button class="stu-notes-toggle" onclick="event.stopPropagation();stuTogglePassageNotes('${pk}',this)" onmousedown="event.stopPropagation()" aria-expanded="${hidden ? 'false' : 'true'}">${hidden ? 'Show' : 'Hide'}</button></div>
    <aside class="stu-passage-notes" id="${pk}-notes" data-global-idx="${globalIdx}">${stuPassageNotesListHtml(pk, globalIdx)}</aside>`;
}

function stuRefreshPassageNotes(pk, globalIdx = stuCurrentGlobalIdx(pk)) {
  const panel = document.getElementById(pk + '-notes');
  if (!panel || globalIdx == null) return;
  panel.dataset.globalIdx = String(globalIdx);
  panel.innerHTML = stuPassageNotesListHtml(pk, globalIdx);
}

function stuTogglePassageNotes(pk, btn) {
  if (!STU_TOOLS[pk]) STU_TOOLS[pk] = {};
  STU_TOOLS[pk].notesHidden = !stuNotesHidden(pk);
  const split = btn?.closest('.stu-passage-split');
  if (!split) return;
  const hidden = stuNotesHidden(pk);
  split.classList.toggle('notes-hidden', hidden);
  split.querySelectorAll('.stu-notes-toggle').forEach(toggle => {
    toggle.textContent = hidden ? 'Show' : 'Hide';
    toggle.setAttribute('aria-expanded', String(!hidden));
  });
  if (!hidden) stuRefreshPassageNotes(pk);
}

function stuOpenNoteFromList(pk, globalIdx, annId) {
  const ann = document.querySelector(`#${pk}-pass .stu-ann[data-ann-id="${annId}"]`);
  stuOpenNotePopup({
    pk,
    globalIdx,
    annId,
    anchorRect: ann?.getBoundingClientRect?.() || document.getElementById(pk + '-notes')?.getBoundingClientRect?.()
  });
}

function stuSnapshotPassage(pk, globalIdx) {
  const st = stuEnsureAnnotationState(pk);
  const panel = document.getElementById(pk + '-pass');
  if (!st || !panel || globalIdx == null) return;
  st.passageSnapshots[globalIdx] = panel.innerHTML;
}

function stuRestorePassageState(pk, globalIdx) {
  const st = stuEnsureAnnotationState(pk);
  const panel = document.getElementById(pk + '-pass');
  if (!st || !panel || globalIdx == null) return;
  if (st.passageSnapshots[globalIdx]) panel.innerHTML = st.passageSnapshots[globalIdx];
}

function stuApplyAnnClasses(span, ann) {
  if (!span || !ann) return;
  ['hl-y','hl-g','hl-b','hl-p','hl-u','stu-annotation'].forEach(cls => span.classList.remove(cls));
  span.classList.add('stu-ann');
  if (ann.color) span.classList.add(ann.color);
  if (ann.note) span.classList.add('stu-annotation');
  span.dataset.annId = ann.id;
}

function stuWrapRangeWithAnnotation(range, ann) {
  if (!range || !ann) return null;
  const span = document.createElement('span');
  stuApplyAnnClasses(span, ann);
  try {
    range.surroundContents(span);
  } catch(e) {
    try {
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    } catch(err) {
      return null;
    }
  }
  return span;
}

function stuUnwrapNode(node) {
  if (!node?.parentNode) return;
  const parent = node.parentNode;
  while (node.firstChild) parent.insertBefore(node.firstChild, node);
  parent.removeChild(node);
  parent.normalize?.();
}

function stuFindAnnNodeInRange(pk, range) {
  const panel = document.getElementById(pk + '-pass');
  if (!panel || !range) return null;
  let node = range.commonAncestorContainer;
  if (node.nodeType !== 1) node = node.parentElement;
  const direct = node?.closest?.('.stu-ann[data-ann-id]');
  if (direct && panel.contains(direct)) return direct;
  return Array.from(panel.querySelectorAll('.stu-ann[data-ann-id]')).find(el => {
    try { return range.intersectsNode(el); } catch(e) { return false; }
  }) || null;
}

function stuRemoveSelectedAnnotations(pk, globalIdx, range) {
  const panel = document.getElementById(pk + '-pass');
  if (!panel || !range) return false;
  const targets = new Set();
  const direct = stuFindAnnNodeInRange(pk, range);
  if (direct) targets.add(direct);
  panel.querySelectorAll('.stu-ann[data-ann-id]').forEach(el => {
    try { if (range.intersectsNode(el)) targets.add(el); } catch(e) {}
  });
  if (!targets.size) return false;
  const list = stuAnnotationList(pk, globalIdx);
  targets.forEach(el => {
    const idx = list.findIndex(a => a.id === el.dataset.annId);
    if (idx >= 0) list.splice(idx, 1);
    stuUnwrapNode(el);
  });
  stuSnapshotPassage(pk, globalIdx);
  return true;
}

function stuInitPassageHL(pk) {
  const panel = document.getElementById(pk + '-pass');
  if (!panel) return;
  panel.addEventListener('mouseup', function() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!panel.contains(range.commonAncestorContainer)) return;
    const text = String(sel.toString() || '').trim();
    if (!text) return;
    _stuHlRange = range.cloneRange();
    _stuHlPageKey = pk;
    _stuHlGlobalIdx = stuCurrentGlobalIdx(pk);
    _stuHlText = text;
    let popup = document.getElementById('stuHlPopup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'stuHlPopup';
      popup.className = 'stu-hl-popup';
      popup.onmousedown = function(e) { e.preventDefault(); };
      document.body.appendChild(popup);
    }
    const isSatCtx = pk.includes('Sat');
    const pencilSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path></svg>`;
    popup.innerHTML = isSatCtx
      ? `<button class="hl-y" onclick="stuApplyHL('hl-y')" title="Yellow"></button><button class="hl-b" onclick="stuApplyHL('hl-b')" title="Blue"></button><button class="hl-p" onclick="stuApplyHL('hl-p')" title="Pink"></button><div class="hl-sep"></div><button class="hl-u" onclick="stuApplyHL('hl-u')" title="Underline">U</button><div class="hl-sep"></div><button class="hl-note-btn" onclick="stuApplyHL('note')" title="Add note">${pencilSvg}</button><button class="hl-clear" onclick="stuApplyHL(null)" title="Remove">✕</button>`
      : `<button class="hl-y" onclick="stuApplyHL('hl-y')" title="Yellow"></button><button class="hl-g" onclick="stuApplyHL('hl-g')" title="Green"></button><button class="hl-b" onclick="stuApplyHL('hl-b')" title="Blue"></button><button class="hl-p" onclick="stuApplyHL('hl-p')" title="Pink"></button><div class="hl-sep"></div><button class="hl-u" onclick="stuApplyHL('hl-u')" title="Underline">U</button><div class="hl-sep"></div><button class="hl-note-btn" onclick="stuApplyHL('note')" title="Add note">${pencilSvg}</button><button class="hl-clear" onclick="stuApplyHL(null)" title="Remove">✕</button>`;
    const rect = range.getBoundingClientRect();
    popup.style.display = 'flex';
    popup.style.left = Math.max(8, Math.min(window.innerWidth - 230, rect.left + rect.width / 2 - 95)) + 'px';
    popup.style.top = Math.max(8, rect.top - 42) + 'px';
  });

  // Click on existing highlights to jump to the matching note in the side panel.
  panel.addEventListener('click', function(e) {
    const ann = e.target.closest('.stu-ann[data-ann-id]');
    if (!ann) return;
    e.stopPropagation();
    stuOpenNotesPanel(pk);
    stuRefreshPassageNotes(pk, stuCurrentGlobalIdx(pk));
    stuFocusNoteCard(pk, ann.dataset.annId);
  });
}

function stuOpenNotePopup(opts = {}) {
  const popup = document.getElementById('stuHlPopup');
  if (popup) popup.style.display = 'none';
  const pk = opts.pk || _stuHlPageKey;
  const globalIdx = opts.globalIdx ?? _stuHlGlobalIdx ?? stuCurrentGlobalIdx(pk);
  if (!pk || globalIdx == null) return;
  const existing = opts.annId ? stuFindAnnotation(pk, globalIdx, opts.annId) : null;
  const range = opts.range ? opts.range.cloneRange() : (_stuHlRange ? _stuHlRange.cloneRange() : null);
  const excerpt = existing?.excerpt || _stuHlText || String(range?.toString?.() || '').trim() || 'Selected text';
  const annId = existing?.id || opts.annId || stuMakeAnnId();
  _stuAnnDraft = {
    pk,
    globalIdx,
    annId,
    range,
    color: existing?.color || opts.color || 'hl-y',
    excerpt,
    isExisting: !!existing
  };

  let apop = document.getElementById('stuAnnotationPopup');
  if (!apop) {
    apop = document.createElement('div');
    apop.id = 'stuAnnotationPopup';
    apop.className = 'stu-annotation-popup';
    document.body.appendChild(apop);
  }
  apop.innerHTML = `<div class="ann-head">
      <div style="flex:1">
        <div class="ann-kicker">Highlight note</div>
        <div class="ann-excerpt">"${stuEscHtml(excerpt)}"</div>
      </div>
      <button class="ann-close" onclick="stuCloseAnnotationPopup()" title="Close">&times;</button>
    </div>
    <textarea id="stuAnnText" placeholder="Add a note about this text...">${stuEscHtml(existing?.note || '')}</textarea>
    <div class="ann-actions">
      <button class="ann-delete" onclick="stuDeleteAnnotation()">Delete</button>
      <button class="ann-save" onclick="stuSaveAnnotation()">Save</button>
    </div>`;
  const rect = opts.anchorRect || range?.getBoundingClientRect?.() || { left: 24, bottom: 120 };
  apop.style.left = Math.max(8, Math.min(window.innerWidth - 296, rect.left)) + 'px';
  apop.style.top = Math.max(8, Math.min(window.innerHeight - 190, rect.bottom + 8)) + 'px';
  apop.classList.add('open');
  setTimeout(() => document.getElementById('stuAnnText')?.focus(), 0);
}

function stuShowAnnotation() {
  stuOpenNotePopup();
}

function stuCloseAnnotationPopup() {
  document.getElementById('stuAnnotationPopup')?.classList.remove('open');
  _stuAnnDraft = null;
}

function stuSaveAnnotation() {
  const apop = document.getElementById('stuAnnotationPopup');
  if (!apop || !_stuAnnDraft) return;
  const { pk, globalIdx, annId, range, color, excerpt } = _stuAnnDraft;
  const text = document.getElementById('stuAnnText')?.value || '';
  const list = stuAnnotationList(pk, globalIdx);
  let ann = list.find(a => a.id === annId);
  if (!ann) {
    ann = { id: annId, color, note: text, excerpt, path: null };
    list.push(ann);
  }
  ann.color = ann.color || color || 'hl-y';
  ann.note = text;
  ann.excerpt = excerpt;
  let target = document.querySelector(`#${pk}-pass .stu-ann[data-ann-id="${annId}"]`);
  if (!target && range) target = stuWrapRangeWithAnnotation(range, ann);
  else if (target) stuApplyAnnClasses(target, ann);
  stuSnapshotPassage(pk, globalIdx);
  if (String(text).trim()) {
    if (!STU_TOOLS[pk]) STU_TOOLS[pk] = {};
    STU_TOOLS[pk].notesHidden = false;
    const split = document.getElementById(pk + '-notes')?.closest('.stu-passage-split');
    split?.classList.remove('notes-hidden');
    split?.querySelectorAll('.stu-notes-toggle').forEach(toggle => {
      toggle.textContent = 'Hide';
      toggle.setAttribute('aria-expanded', 'true');
    });
  }
  stuRefreshPassageNotes(pk, globalIdx);
  apop.classList.remove('open');
  window.getSelection()?.removeAllRanges();
  _stuHlRange = null;
  _stuHlPageKey = null;
  _stuHlGlobalIdx = null;
  _stuHlText = '';
  _stuAnnDraft = null;
}

function stuDeleteAnnotation() {
  const apop = document.getElementById('stuAnnotationPopup');
  if (!apop || !_stuAnnDraft) { apop?.classList.remove('open'); return; }
  const { pk, globalIdx, annId } = _stuAnnDraft;
  const list = stuAnnotationList(pk, globalIdx);
  const idx = list.findIndex(a => a.id === annId);
  if (idx >= 0) list.splice(idx, 1);
  const target = document.querySelector(`#${pk}-pass .stu-ann[data-ann-id="${annId}"]`);
  if (target) {
    stuUnwrapNode(target);
    stuSnapshotPassage(pk, globalIdx);
  }
  stuRefreshPassageNotes(pk, globalIdx);
  apop.classList.remove('open');
  _stuAnnDraft = null;
}

function stuApplyHL(cls) {
  const sel = window.getSelection();
  const popup = document.getElementById('stuHlPopup');
  if (popup) popup.style.display = 'none';
  if (!_stuHlRange) return;
  const pk = _stuHlPageKey;
  const globalIdx = _stuHlGlobalIdx ?? stuCurrentGlobalIdx(pk);
  if (!pk || globalIdx == null) return;
  let focusAnnId = null;
  if (!cls) {
    stuRemoveSelectedAnnotations(pk, globalIdx, _stuHlRange);
  } else {
    const existingNode = stuFindAnnNodeInRange(pk, _stuHlRange);
    let ann = existingNode ? stuFindAnnotation(pk, globalIdx, existingNode.dataset.annId) : null;
    const colorClass = cls === 'note' ? (ann?.color || 'hl-y') : cls;
    if (ann && existingNode) {
      ann.color = colorClass;
      stuApplyAnnClasses(existingNode, ann);
    } else {
      ann = { id: stuMakeAnnId(), color: colorClass, note: '', excerpt: _stuHlText || String(_stuHlRange.toString() || '').trim(), path: null };
      stuAnnotationList(pk, globalIdx).push(ann);
      stuWrapRangeWithAnnotation(_stuHlRange, ann);
    }
    focusAnnId = ann?.id || null;
    stuSnapshotPassage(pk, globalIdx);
  }
  sel?.removeAllRanges();
  _stuHlRange = null;
  _stuHlPageKey = null;
  _stuHlGlobalIdx = null;
  _stuHlText = '';
  if (cls) {
    stuOpenNotesPanel(pk);
    stuRefreshPassageNotes(pk, globalIdx);
    if (focusAnnId) stuFocusNoteCard(pk, focusAnnId);
  } else {
    stuRefreshPassageNotes(pk, globalIdx);
  }
}
document.addEventListener('mousedown', function(e) {
  const popup = document.getElementById('stuHlPopup');
  if (popup && popup.style.display !== 'none' && !popup.contains(e.target)) {
    popup.style.display = 'none';
  }
  const apop = document.getElementById('stuAnnotationPopup');
  if (apop && apop.classList.contains('open') && !apop.contains(e.target) && !e.target.closest('.stu-ann')) {
    apop.classList.remove('open');
  }
  // Close nav panels on outside click
  document.querySelectorAll('.stu-nav-panel.open').forEach(p => {
    if (!p.contains(e.target) && !e.target.closest('.stu-viewall-btn') && !e.target.closest('.sat-q-menu-trigger')) p.classList.remove('open');
  });
  // Close notepads on outside click
  document.querySelectorAll('.stu-notepad.open').forEach(n => {
    if (!n.contains(e.target) && !e.target.closest('[onclick*="stuOpenNotepad"]')) n.classList.remove('open');
  });
});

function renderStuSat() {
  const pk = 'stuSat';
  const allQ = stuBuildAllQuestions(SAT_SECTIONS);
  STU_STATE[pk] = {
    questions: allQ, sections: SAT_SECTIONS, current: 0,
    marked: new Set(), answered: new Set(), answers: {}, eliminated: {},
    currentSecIdx: 0, lockedSecs: new Set(), notes: {},
    annotations: {}, passageSnapshots: {}
  };
  stuShowOverview(pk, 'sat');
}
function stuSatBegin(pk) {
  stuSwitchSatModule(pk, 0);
}

function stuSwitchSatModule(pk, secIdx) {
  const st = STU_STATE[pk];
  st.currentSecIdx = secIdx;
  const sec = st.sections[secIdx];

  // Update header
  const isMath = sec.id.includes('math');
  document.getElementById('stuSatSecLabel').textContent = isMath ? 'Math' : 'Reading & Writing';
  const modBtn = document.getElementById('stuSatModuleInfo');
  if (modBtn) { modBtn.innerHTML = sec.name; modBtn.onclick = () => stuOpenNavPanel('stuSat'); }
  const secTime = sec.time || 32;
  const timerDigits = document.getElementById('stuSatTimerDigits');
  if (timerDigits) timerDigits.textContent = String(secTime).padStart(2, '0') + ':00';

  stuStartTimer(pk, secTime, {
    onWarning: () => stuShow5MinWarning(pk),
    onTimeUp: () => stuTimeUpAutoSubmit(pk)
  });

  // Show/hide math-only tools
  const calcBtn = document.getElementById('stuSat-calcBtn');
  const refBtn = document.getElementById('stuSat-refBtn');
  const scrToggle = document.getElementById('stuSat-scratchToggle');
  if (calcBtn) calcBtn.style.display = isMath ? 'flex' : 'none';
  if (refBtn) refBtn.style.display = isMath ? 'flex' : 'none';
  if (scrToggle) scrToggle.classList.toggle('visible', isMath);

  // Render section tabs — SAT is strictly sequential: only current module is accessible
  const secBar = document.getElementById('stuSatSectionBar');
  if (secBar) {
    secBar.style.display = 'flex';
    secBar.innerHTML = st.sections.map((s, i) => {
      const isLocked = st.lockedSecs.has(i);
      const isCurrent = i === secIdx;
      const isFuture = i > secIdx && !isLocked;
      const isClickable = isCurrent;
      let status = '';
      if (isLocked) status = ' <span class="lock-icon">✓</span>';
      else if (isFuture) status = ' <span class="lock-icon">🔒</span>';
      const cls = ['stu-sec-tab', isCurrent ? 'active' : '', (isLocked || isFuture) ? 'locked' : ''].filter(Boolean).join(' ');
      return `<div class="${cls}">${s.name}${status}</div>`;
    }).join('');
  }

  // Get section questions
  const secQ = st.questions.map((q, gi) => ({ ...q, globalIdx: gi })).filter(q => q.section === sec.id);
  st._secQuestions = secQ;

  // Render body
  stuRenderBody(pk, 'stuSatBody', { hasSectionBar: true });

  // Render footer — shared standardized shell: Back | Question Menu | Next / Submit
  const footerEl = document.getElementById('stuSatFooter');
  const qMenuIcon = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  footerEl.innerHTML = `
    <button class="act-nav-btn" id="${pk}-backBtn" onclick="stuSatGoPrev('${pk}')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg> Back</button>
    <button class="sat-q-menu-trigger" id="${pk}-footerQMenu" onclick="stuOpenNavPanel('${pk}')">Question 1 of ${secQ.length} ${qMenuIcon}</button>
    <div style="display:flex;align-items:center;gap:8px">
      <button class="act-nav-btn" id="${pk}-nextBtn" onclick="stuSatGoNext('${pk}')">Next <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
      <button class="stu-submit-btn" onclick="stuSatSubmitModule('${pk}')">Submit</button>
    </div>`;

  stuSatGoLocal(pk, 0);
}

function stuSatGoPrev(pk) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ) return;
  const localIdx = secQ.findIndex(q => q.globalIdx === st.current);
  if (localIdx > 0) stuSatGoLocal(pk, localIdx - 1);
}
function stuSatGoNext(pk) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ) return;
  const localIdx = secQ.findIndex(q => q.globalIdx === st.current);
  if (localIdx < secQ.length - 1) stuSatGoLocal(pk, localIdx + 1);
}
function stuSatToggleElimMode() {
  const page = document.getElementById('page-stu-sat');
  if (page) page.classList.toggle('sat-elim-mode');
}

function stuSatGoLocal(pk, localIdx) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ || localIdx < 0 || localIdx >= secQ.length) return;
  const globalIdx = secQ[localIdx].globalIdx;
  st.current = globalIdx;

  // Bluebook shows "Question X of Y" in header — clickable pill to open Question Menu
  const qMenuLabel = `Question ${localIdx + 1} of ${secQ.length}`;
  const qMenuIcon = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const modInfo = document.getElementById('stuSatModuleInfo');
  if (modInfo) modInfo.innerHTML = `${qMenuLabel} ${qMenuIcon}`;
  const footerMenu = document.getElementById(pk + '-footerQMenu');
  if (footerMenu) footerMenu.innerHTML = `${qMenuLabel} ${qMenuIcon}`;

  const q = st.questions[globalIdx];
  const isMarked = st.marked.has(globalIdx);
  const area = document.getElementById(pk + '-qArea');
  const typeName = TYPE_LABELS[q.type] || 'Multiple Choice';
  const hasPassage = !!q.passage;
  const savedAnswer = st.answers[globalIdx];

  let qInner = `<div class="stu-q-card">
    <div class="stu-q-head">
      <div style="display:flex;align-items:center;gap:6px">
        <div class="q-order">${localIdx + 1}</div>
        <span class="q-type">${typeName}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <button class="sat-mark-btn ${isMarked ? 'active' : ''}" id="${pk}-bm" onclick="stuSatToggleMark('${pk}',${globalIdx},${localIdx})" title="Mark for Review">
          ${isMarked ? bookmarkFilled : bookmarkSvg}
        </button>
        <div class="q-pts"><span>${q.pts || 1}</span><span>${(q.pts||1) > 1 ? 'pts' : 'pt'}</span></div>
      </div>
    </div>
    <div class="stu-q-stem">${q.text}</div>
    ${q.choices ? (() => {
      const elims = st.eliminated?.[globalIdx] || new Set();
      return `<ul class="stu-choices">${q.choices.map((c, ci) =>
        `<li class="${savedAnswer === ci ? 'selected' : ''} ${elims.has(ci) ? 'eliminated' : ''}" onclick="stuSatSelect(this,${globalIdx},${ci},'${pk}')"><span class="letter">${String.fromCharCode(65+ci)}</span><span>${c}</span><button class="stu-elim ${elims.has(ci) ? 'undo' : ''}" onclick="event.stopPropagation();stuToggleElim('${pk}',${globalIdx},${ci},this.parentElement)" title="${elims.has(ci) ? 'Undo elimination' : 'Eliminate'}">${stuElimButtonHtml(elims.has(ci))}</button></li>`
      ).join('')}</ul>`;
    })() : `<textarea style="width:100%;min-height:100px;border:1px solid #e4e4e7;border-radius:10px;padding:12px;font-size:14px;font-family:inherit;resize:vertical" placeholder="Type your answer..." oninput="stuSatAnswer(${globalIdx},'${pk}')">${savedAnswer || ''}</textarea>`}
  </div>`;

  if (hasPassage) {
    const passageText = (q.passage.fullText || '').replace(/class="q-ref"/g, 'class="stu-hl-src"');
    area.innerHTML = `<div class="stu-passage-split ${stuNotesHidden(pk) ? 'notes-hidden' : ''}">
      <div class="stu-passage-panel" id="${pk}-pass">
        <div class="passage-title">${q.passage.title}</div>
        ${passageText}
      </div>
      ${stuPassageNotesHtml(pk, globalIdx)}
      <div class="stu-passage-resize" onmousedown="stuStartResize(event,'${pk}')"></div>
      <div class="stu-q-right">${qInner}</div>
    </div>`;
    stuRestorePassageState(pk, globalIdx);
    const panel = document.getElementById(pk + '-pass');
    if (panel) {
      panel.querySelectorAll('.stu-hl-src').forEach(el => {
        el.classList.toggle('stu-hl-active', el.dataset.q == String(q.n));
      });
      const ref = panel.querySelector(`.stu-hl-src[data-q="${q.n}"]`);
      if (ref) setTimeout(() => ref.scrollIntoView({ behavior:'smooth', block:'center' }), 100);
    }
    stuInitPassageHL(pk);
  } else {
    area.innerHTML = qInner;
  }

  // SAT Bluebook: Navigation via footer Back/Next, no in-question nav
  const actionsEl = document.getElementById(pk + '-actions');
  if (actionsEl) actionsEl.innerHTML = '';

  // Footer tab highlighting + mark for review bookmark
  const _msvg = `<svg class="ftab-mark" width="8" height="8" viewBox="0 0 24 24" fill="#e11d48" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
  const ftabs = document.getElementById(pk + '-ftabs');
  if (ftabs) {
    ftabs.querySelectorAll('.stu-ftab').forEach(t => {
      const si = parseInt(t.dataset.si);
      const gi = parseInt(t.dataset.gi);
      t.classList.toggle('current', si === localIdx);
      t.classList.toggle('answered', st.answered.has(gi) && si !== localIdx);
      const isNowMarked = st.marked.has(gi);
      t.classList.toggle('marked', isNowMarked);
      const existingMark = t.querySelector('.ftab-mark');
      if (isNowMarked && !existingMark) t.insertAdjacentHTML('beforeend', _msvg);
      else if (!isNowMarked && existingMark) existingMark.remove();
    });
    const at = ftabs.querySelector('.stu-ftab.current');
    if (at) at.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
  }

  // Sync scratch pad per question
  if (_scratchPads[pk]?.currentQKey) {
    const qKey = pk + '-q-' + localIdx;
    if (_scratchPads[pk].currentQKey !== qKey) _scratchLoadForQuestion(pk, qKey);
  }

  // Reapply masking if active
  if (STU_TOOLS[pk]?.maskingOn) setTimeout(() => stuApplyMasking(pk), 10);
}

function stuSatSelect(li, globalIdx, choiceIdx, pk) {
  if (li.classList.contains('eliminated')) return;
  li.parentElement.querySelectorAll('li').forEach(l => l.classList.remove('selected'));
  li.classList.add('selected');
  STU_STATE[pk].answered.add(globalIdx);
  STU_STATE[pk].answers[globalIdx] = choiceIdx;
  const tab = document.querySelector(`#${pk}-ftabs .stu-ftab[data-gi="${globalIdx}"]`);
  if (tab) tab.classList.add('answered');
}

function stuSatAnswer(globalIdx, pk) {
  STU_STATE[pk].answered.add(globalIdx);
}

function stuSatToggleMark(pk, globalIdx, localIdx) {
  const st = STU_STATE[pk];
  if (st.marked.has(globalIdx)) st.marked.delete(globalIdx); else st.marked.add(globalIdx);
  stuSatGoLocal(pk, localIdx);
}

function stuSatSubmitModule(pk) {
  stuStopTimer(pk);
  const st = STU_STATE[pk];
  const secIdx = st.currentSecIdx;
  const sec = st.sections[secIdx];
  const secQ = st._secQuestions || [];
  const answeredCount = secQ.filter(q => st.answered.has(q.globalIdx)).length;
  const unanswered = secQ.length - answeredCount;

  stuModal({
    icon:'📋', iconType:'warn',
    title:`Submit ${sec.name}?`,
    body:`<p>You cannot return to this module after submitting.</p>
      <div class="stat">
        <div class="stat-item"><span class="val">${answeredCount}</span><span class="lbl">Answered</span></div>
        <div class="stat-item"><span class="val">${unanswered}</span><span class="lbl">Unanswered</span></div>
        <div class="stat-item"><span class="val">${secQ.length}</span><span class="lbl">Total</span></div>
      </div>`,
    confirmText:'Submit Module', confirmClass:'danger',
    onConfirm(){
      st.lockedSecs.add(secIdx);
      let nextIdx = -1;
      for (let i = 0; i < st.sections.length; i++) {
        if (!st.lockedSecs.has(i)) { nextIdx = i; break; }
      }
      if (nextIdx >= 0) {
        const needsBreak = secIdx === 1 && nextIdx === 2;
        const isAdaptiveRoute = (secIdx === 0 && nextIdx === 1) || (secIdx === 2 && nextIdx === 3);
        if (needsBreak) {
          stuSatShowBreak(pk, nextIdx);
        } else if (isAdaptiveRoute) {
          stuSatShowAdaptiveRouting(pk, secIdx, nextIdx);
        } else {
          stuSwitchSatModule(pk, nextIdx);
        }
      } else {
        stuExamComplete(pk, 'sat');
      }
    }
  });
  return;
}

// ═══════ SAT ADAPTIVE ROUTING ═══════
function stuSatShowAdaptiveRouting(pk, fromIdx, toIdx) {
  const st = STU_STATE[pk];
  const fromSec = st.sections[fromIdx];
  const secQ = st._secQuestions || [];
  const answeredCorrect = secQ.filter(q => {
    const correctIdx = q.correctIdx !== undefined ? q.correctIdx : q.correct;
    return st.answered.has(q.globalIdx) && st.answers[q.globalIdx] === correctIdx;
  }).length;
  const total = secQ.length;
  const pct = total > 0 ? (answeredCorrect / total * 100) : 0;
  const isHard = pct >= 70;
  const routeName = isHard ? 'Higher Difficulty' : 'Standard Difficulty';
  const routeColor = isHard ? '#7c3aed' : '#3b82f6';
  const sectionName = fromIdx <= 1 ? 'Reading & Writing' : 'Math';

  const body = document.getElementById('stuSatBody');
  const footer = document.getElementById('stuSatFooter');
  footer.style.display = 'none';

  body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100%;background:linear-gradient(135deg,#0f172a,#1e293b)">
      <div style="text-align:center;color:#fff;max-width:480px;padding:40px">
        <div style="font-size:48px;margin-bottom:16px">🔀</div>
        <h2 style="font-size:22px;font-weight:700;margin:0 0 8px">Adaptive Routing</h2>
        <p style="color:#94a3b8;font-size:14px;margin:0 0 28px">${sectionName} — Module 1 complete</p>

        <div style="background:rgba(255,255,255,.06);border-radius:12px;padding:20px;margin-bottom:24px">
          <div style="display:flex;justify-content:center;gap:32px;margin-bottom:16px">
            <div><div style="font-size:28px;font-weight:700;color:#60a5fa">${answeredCorrect}</div><div style="font-size:11px;color:#94a3b8">Correct</div></div>
            <div><div style="font-size:28px;font-weight:700;color:#f59e0b">${total - answeredCorrect}</div><div style="font-size:11px;color:#94a3b8">Incorrect</div></div>
            <div><div style="font-size:28px;font-weight:700;color:#fff">${Math.round(pct)}%</div><div style="font-size:11px;color:#94a3b8">Accuracy</div></div>
          </div>
          <div style="height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#60a5fa,${routeColor});border-radius:3px;transition:width 1.5s ease-out"></div>
          </div>
        </div>

        <div id="routeReveal" style="opacity:0;transform:translateY(10px);transition:all .6s ease-out">
          <div style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:${routeColor};border-radius:9999px;font-weight:600;font-size:14px;margin-bottom:16px">
            ${isHard ? '🔥' : '📘'} Routed to: ${routeName} Module
          </div>
          <p style="color:#94a3b8;font-size:12px;margin:0 0 20px;line-height:1.5">
            ${isHard
              ? 'Your strong Module 1 performance qualifies you for harder questions. Higher difficulty → higher potential score (up to 800).'
              : 'Module 2 will contain questions calibrated to your current level. All score ranges remain accessible.'}
          </p>
          <button class="btn-kira" onclick="stuSwitchSatModule('${pk}',${toIdx})" style="padding:10px 28px;font-size:14px;border-radius:9999px">
            Continue to Module 2 →
          </button>
        </div>

        <div style="margin-top:20px;font-size:10px;color:#475569">
          Powered by Item Response Theory (IRT) · <a href="https://arxiv.org/abs/2502.19275" target="_blank" style="color:#818cf8">arXiv:2502.19275</a>
        </div>
      </div>
    </div>`;

  setTimeout(() => {
    const reveal = document.getElementById('routeReveal');
    if (reveal) { reveal.style.opacity = '1'; reveal.style.transform = 'translateY(0)'; }
  }, 1800);
}

// ═══════ SAT BREAK SCREEN ═══════
function stuSatShowBreak(pk, nextIdx) {
  const body = document.getElementById('stuSatBody');
  const footer = document.getElementById('stuSatFooter');
  const secBar = document.getElementById('stuSatSectionBar');
  if (secBar) secBar.style.display = 'none';
  footer.innerHTML = '';

  document.getElementById('stuSatSecLabel').textContent = 'Break';
  const modBtn = document.getElementById('stuSatModuleInfo');
  if (modBtn) { modBtn.innerHTML = '10:00 remaining'; modBtn.onclick = null; }
  const timerDigits = document.getElementById('stuSatTimerDigits');
  if (timerDigits) timerDigits.textContent = '10:00';

  body.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:40px">
    <div style="width:80px;height:80px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:36px;margin-bottom:24px">☕</div>
    <h2 style="font-size:24px;font-weight:700;color:#1e293b;margin:0 0 8px">Take a Break</h2>
    <p style="font-size:15px;color:#64748b;max-width:460px;line-height:1.6;margin:0 0 16px">
      You have completed the Reading and Writing section. You now have a <strong>10-minute break</strong> before starting the Math section.
    </p>
    <p style="font-size:14px;color:#1e3a5f;font-weight:600;margin:0 0 8px" id="stuSatBreakTimer">10:00</p>
    <p style="font-size:13px;color:#94a3b8;margin:0 0 32px">
      The break timer is counting down. You can resume early if you're ready.
    </p>
    <button onclick="stuSwitchSatModule('${pk}',${nextIdx})" style="padding:12px 32px;background:#1e3a5f;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:.15s">Resume Test →</button>
  </div>`;

  stuStartTimer(pk, 10, {
    onTick(rem) {
      const el = document.getElementById('stuSatBreakTimer');
      if (el) el.textContent = String(Math.floor(rem/60)).padStart(2,'0') + ':' + String(rem%60).padStart(2,'0');
    },
    onTimeUp() { stuSwitchSatModule(pk, nextIdx); }
  });
}

// ═══════ AUTO-ADVANCE ON TIME-UP ═══════

function stuSatAutoAdvance(pk) {
  const st = STU_STATE[pk];
  const secIdx = st.currentSecIdx;
  st.lockedSecs.add(secIdx);
  let nextIdx = -1;
  for (let i = 0; i < st.sections.length; i++) {
    if (!st.lockedSecs.has(i)) { nextIdx = i; break; }
  }
  if (nextIdx >= 0) {
    const needsBreak = secIdx === 1 && nextIdx === 2;
    if (needsBreak) stuSatShowBreak(pk, nextIdx);
    else stuSwitchSatModule(pk, nextIdx);
  } else {
    stuExamComplete(pk, 'sat');
  }
}

function stuGenAutoAdvance(pk) {
  const st = STU_STATE[pk];
  const secIdx = st.currentSecIdx;
  const nextIdx = secIdx + 1;
  if (nextIdx < st.sections.length) {
    stuGenSwitchSection(pk, nextIdx);
  } else {
    stuExamComplete(pk, 'generic');
  }
}

