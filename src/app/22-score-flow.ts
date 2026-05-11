// @ts-nocheck
// Phase-2 slice: lines 21985-22202 of original src/app.ts

// ═══════ END-TO-END SCORE + REPORT FLOW ═══════

function stuExamComplete(pk, testType) {
  stuStopTimer(pk);
  const st = STU_STATE[pk];
  const scores = stuCalcScores(pk, testType);
  st._finalScores = scores;
  currentReportSessionId = currentLaunchSessionId;

  // ACT now uses a dedicated completion page (replaces the old
  // "Test Complete!" modal) — see stuActShowCompletion below. The
  // SAT / generic flows still use the modal until they get their
  // own hand-off pages.
  if (testType === 'act') {
    stuActShowCompletion(pk);
    return;
  }

  const reportPage = testType === 'sat' ? 'stu-sat-report' : 'homepage';

  let modalBody = '';
  if (testType === 'sat') {
    const ss = scores.scaledSections;
    modalBody = `<p>All modules have been submitted.</p>
      <div class="stat">
        <div class="stat-item"><span class="val" style="font-size:32px;color:#2563eb">${scores.composite}</span><span class="lbl">Total / 1600</span></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">
        <div style="text-align:center;padding:8px;background:#f8f9fa;border-radius:8px"><div style="font-size:20px;font-weight:700;color:#7c3aed">${ss.rw}</div><div style="font-size:10px;color:#64748b">Reading & Writing</div></div>
        <div style="text-align:center;padding:8px;background:#f8f9fa;border-radius:8px"><div style="font-size:20px;font-weight:700;color:#2563eb">${ss.math}</div><div style="font-size:10px;color:#64748b">Math</div></div>
      </div>
      ${reportPage !== 'homepage' ? '<p style="margin-top:10px;color:#64748b;font-size:12px">Would you like to view your score report?</p>' : ''}`;
  } else {
    modalBody = `<p>All sections have been submitted.</p>
      <div class="stat">
        <div class="stat-item"><span class="val">${scores.totalCorrect}</span><span class="lbl">Correct</span></div>
        <div class="stat-item"><span class="val">${scores.totalQuestions}</span><span class="lbl">Total</span></div>
        <div class="stat-item"><span class="val">${scores.pct}%</span><span class="lbl">Score</span></div>
      </div>`;
  }

  stuModal({
    icon: '🎉', iconType: 'success',
    title: 'Test Complete!',
    body: modalBody,
    confirmText: reportPage !== 'homepage' ? 'View Report' : 'Done',
    confirmClass: 'success',
    cancelText: 'Close',
    onConfirm() { nav(reportPage); }
  });
}

// ── ACT practice completion page ─────────────────────────────────
// Replaces the old "Test Complete!" modal for ACT. After the last
// section is submitted (stuActSubmitSection → stuExamComplete), this
// renders into the existing stu-act chrome:
//   • header label flips to "Practice complete"; section bar + tools
//     footer + timer all hidden
//   • body becomes a centered hand-off: ✓ icon → headline →
//     3-stat summary (sections / answered / essay) → one-line
//     foreshadow → primary "View report" + ghost "Return home"
// We intentionally don't preview composite or section scores —
// those live on the report and earn the click instead of being
// duplicated here.
function stuActShowCompletion(pk) {
  stuStopTimer(pk);
  const st = STU_STATE[pk];
  if (!st) return;

  stuActSetChrome('overview');
  const secBar = document.getElementById('stuActSectionBar');
  if (secBar) secBar.style.display = 'none';
  const footer = document.getElementById('stuActFooter');
  if (footer) footer.innerHTML = '';

  const headerLabel = document.getElementById('stuActSecLabel');
  if (headerLabel) headerLabel.textContent = 'Practice complete';
  const secInfo = document.getElementById('stuActSecInfo');
  if (secInfo) secInfo.textContent = '';
  const moduleInfo = document.getElementById('stuActModuleInfo');
  if (moduleInfo) { moduleInfo.innerHTML = ''; moduleInfo.onclick = null; }

  const sectionsCompleted = st.lockedSecs ? st.lockedSecs.size : (st.sections?.length || 0);
  const sectionsTotal = st.sections?.length || sectionsCompleted;
  const questionsAnswered = st.answered ? st.answered.size : 0;
  const questionsTotal = st.questions?.length || 0;

  // Writing essay status: included + submitted / included + skipped /
  // not included (student didn't opt into the optional Writing section).
  const writingQ = (st.questions || []).find(q => q.type === 'ACT_WRITING' || q.type === 'ESSAY');
  let essayLabel = '—';
  let essayMuted = true;
  if (writingQ) {
    const gi = st.questions.indexOf(writingQ);
    const essay = st.answers?.[gi];
    if (essay && String(essay).trim()) {
      essayLabel = 'Submitted';
      essayMuted = false;
    } else {
      essayLabel = 'Skipped';
      essayMuted = true;
    }
  } else {
    essayLabel = 'Not included';
    essayMuted = true;
  }

  const body = document.getElementById('stuActBody');
  if (!body) { nav('stu-act-report'); return; }
  body.innerHTML = `<div class="act-completion">
    <div class="act-completion-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <div class="act-completion-titles">
      <h1>You're done with ACT Practice</h1>
      <p class="sub">Your responses have been submitted and scored.</p>
    </div>
    <div class="act-completion-stats">
      <div class="act-completion-stat">
        <span class="v">${sectionsCompleted}<small> / ${sectionsTotal}</small></span>
        <span class="lbl">Sections</span>
      </div>
      <div class="act-completion-stat">
        <span class="v">${questionsAnswered}<small> / ${questionsTotal}</small></span>
        <span class="lbl">Answered</span>
      </div>
      <div class="act-completion-stat">
        <span class="v text${essayMuted ? ' muted' : ''}">${essayLabel}</span>
        <span class="lbl">Essay</span>
      </div>
    </div>
    <div class="act-completion-foreshadow">
      Your <b>full score report</b> is ready &mdash; including <b>AI Insights</b>, reporting category mastery, and a personalized practice focus to guide what to work on next.
    </div>
    <div class="act-completion-actions">
      <button class="act-completion-cta primary" onclick="nav('stu-act-report')" type="button">View report &rarr;</button>
      <button class="act-completion-cta ghost" onclick="nav('homepage')" type="button">Return home</button>
    </div>
  </div>`;
}

// ─── Raw-to-Scale conversion tables (approximated from official published data) ───
const ACT_SCALE = {
  english: [1,2,3,4,5,6,6,7,8,9,10,10,11,12,12,13,13,14,14,15,15,15,16,16,17,17,17,18,18,18,19,19,19,20,20,20,21,21,21,22,22,22,23,23,23,24,24,24,25,25,25,26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34,35,35,35,36,36,36,36],
  math:    [1,2,3,4,5,6,7,8,9,10,10,11,12,13,13,14,15,16,16,17,17,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34,35,35,36,36,36,36,36],
  reading: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,36,36,36,36],
  science: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,36,36,36,36]
};
const SAT_RW_SCALE = [200,210,220,230,240,250,260,270,280,290,300,310,310,320,330,340,340,350,360,370,370,380,390,400,410,420,420,430,440,450,460,470,480,490,500,510,520,530,540,550,570,580,600,610,620,640,660,680,700,720,740,760,780,800,800];
const SAT_MATH_SCALE = [200,210,220,230,240,250,260,280,290,300,310,320,340,350,370,390,400,410,430,440,460,470,480,490,510,520,530,540,550,560,570,580,590,600,620,640,660,680,700,730,760,790,800,800];

function _scaleLookup(table, raw) {
  if (raw <= 0) return table[0];
  if (raw >= table.length) return table[table.length - 1];
  return table[raw];
}

function stuCalcScores(pk, testType) {
  const st = STU_STATE[pk];
  const qs = st.questions;
  let totalCorrect = 0, totalQuestions = qs.length;
  const sectionScores = {};

  qs.forEach((q, gi) => {
    const secId = q.section;
    if (!sectionScores[secId]) sectionScores[secId] = { correct: 0, total: 0, name: secId };
    sectionScores[secId].total++;

    const ans = st.answers?.[gi];
    if (ans !== undefined && ans !== null) {
      const isCorrect = (q.correctIdx !== undefined && ans === q.correctIdx)
        || (q.correct !== undefined && ans === q.correct);
      if (isCorrect) { totalCorrect++; sectionScores[secId].correct++; }
    }
  });

  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  let composite = 0, scaledSections = {};

  if (testType === 'act') {
    const secMap = { 'act-eng':'english', 'act-math':'math', 'act-reading':'reading', 'act-science':'science' };
    Object.entries(sectionScores).forEach(([id, s]) => {
      const key = secMap[id] || id;
      const table = ACT_SCALE[key];
      s.scaled = table ? _scaleLookup(table, s.correct) : Math.round((s.correct / Math.max(s.total,1)) * 36);
      scaledSections[key] = s.scaled;
    });
    // ACT Composite = average of the 4 core sections (English, Math,
    // Reading, Science) rounded to the nearest whole number, per ACT
    // scoring policy. Science had been omitted here, which understated
    // composite by ~1 point whenever Science was below the others.
    const coreVals = ['english','math','reading','science'].map(k => scaledSections[k]).filter(v => Number.isFinite(v));
    composite = coreVals.length > 0 ? Math.round(coreVals.reduce((a,b) => a+b, 0) / coreVals.length) : 0;

    const stem = scaledSections.math && scaledSections.science
      ? Math.round((scaledSections.math + scaledSections.science) / 2) : null;
    const writingScaled = scaledSections.writing;
    const ela = scaledSections.english && scaledSections.reading && writingScaled
      ? Math.round((scaledSections.english + scaledSections.reading + writingScaled) / 3) : null;
    scaledSections.stem = stem;
    scaledSections.ela = ela;
  } else if (testType === 'sat') {
    const rwSecs = Object.entries(sectionScores).filter(([k]) => k.includes('rw'));
    const mathSecs = Object.entries(sectionScores).filter(([k]) => k.includes('math'));
    const rwCorrect = rwSecs.reduce((a, [, s]) => a + s.correct, 0);
    const rwTotal = rwSecs.reduce((a, [, s]) => a + s.total, 0);
    const mathCorrect = mathSecs.reduce((a, [, s]) => a + s.correct, 0);
    const mathTotal = mathSecs.reduce((a, [, s]) => a + s.total, 0);
    const rwScore = _scaleLookup(SAT_RW_SCALE, rwCorrect);
    const mathScore = _scaleLookup(SAT_MATH_SCALE, mathCorrect);
    composite = rwScore + mathScore;
    scaledSections = { rw: rwScore, math: mathScore, rwRaw: rwCorrect, rwTotal, mathRaw: mathCorrect, mathTotal };
  }

  return { totalCorrect, totalQuestions, pct, sectionScores, composite, scaledSections };
}
