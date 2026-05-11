// @ts-nocheck
// Phase-2 slice: lines 19567-19700 of original src/app.ts

// ─── ACT review mode (player → post-submission review) ──────────────────
// Re-uses the existing stu-act player. When reviewMode is on:
//   • timer/tools hidden via #page-stu-act.review-mode CSS
//   • choices render with .stu-choices.review showing correct/wrong/your-answer
//   • an explanation panel is appended below the question card
//   • bottom Q menu (stuOpenNavPanel) colors cells by correct/wrong/blank
const ACT_REVIEW_SECTION_TO_IDX = { english:0, math:1, reading:2, science:3, writing:4 };
const ACT_QSEC_TO_REVIEWKEY     = { 'act-eng':'english', 'act-math':'math', 'act-reading':'reading', 'act-science':'science', 'act-writing':'writing' };

function _actReviewSeed(sectionKey, n) {
  let h = 0; const s = String(sectionKey || '') + ':' + String(n || 0);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function actReviewFakeAnswer(q, sectionKey) {
  if (!q.choices) return undefined;
  const seed = _actReviewSeed(sectionKey, q.n || 0);
  const r = seed % 10;
  const correct = (typeof q.correct === 'number') ? q.correct : 0;
  if (r < 7) return correct;                                  // 70% correct
  if (r < 9) return (correct + 1) % q.choices.length;         // 20% wrong
  return undefined;                                           // 10% blank
}
function stuActSeedReviewAnswers(pk) {
  const st = STU_STATE[pk];
  if (!st) return;
  st.questions.forEach((q, gi) => {
    if (q.type === 'ACT_WRITING' || q.type === 'ESSAY') return;
    if (Object.prototype.hasOwnProperty.call(st.answers, gi)) return;
    const key = ACT_QSEC_TO_REVIEWKEY[q.section] || 'english';
    const ans = actReviewFakeAnswer(q, key);
    if (ans !== undefined) {
      st.answers[gi] = ans;
      st.answered.add(gi);
    }
  });
}
function actReviewQStatus(q, studentAnswer) {
  if (q.type === 'ACT_WRITING' || q.type === 'ESSAY') return 'essay';
  if (studentAnswer === undefined || studentAnswer === null) return 'blank';
  return studentAnswer === q.correct ? 'correct' : 'wrong';
}
function actReviewExplanation(q) {
  // Prefer the explanation shipped on the question itself (SAMPLE_Q is the
  // single source of truth for student-facing items). Fall back to ACT_QUESTIONS
  // (teacher report fixtures) only when the question doesn't carry its own.
  if (q.explanation) return q.explanation;
  const key = ACT_QSEC_TO_REVIEWKEY[q.section] || '';
  const list = (typeof ACT_QUESTIONS !== 'undefined' && ACT_QUESTIONS[key]) || [];
  const match = list.find(x => x.n === q.n);
  if (match?.explanation) return match.explanation;
  if (q.choices) {
    const letter = String.fromCharCode(65 + (q.correct || 0));
    return `The correct choice is <b>${letter}</b>. The other options either misread the question stem, violate a tested convention, or rely on outside information not supported by the passage.`;
  }
  return 'See the answer key for full reasoning on this constructed-response item.';
}
function stuActEnterReview(filter, sectionKey) {
  switchRole('student', true);
  const pk = 'stuAct';
  if (!STU_STATE[pk]) renderStuAct();
  const st = STU_STATE[pk];
  st.reviewMode    = true;
  st.reviewFilter  = filter || 'all';
  st.reviewSection = sectionKey || 'all';
  stuActSeedReviewAnswers(pk);

  // Pick the section to land on. If a specific section was requested, use it.
  // Otherwise (section='all') and filter='wrong' → jump into the section that
  // has the first wrong question, so the teacher/student lands on something
  // actionable instead of question 1 English.
  let targetSecIdx = 0;
  if (st.reviewSection !== 'all' && ACT_REVIEW_SECTION_TO_IDX[st.reviewSection] != null) {
    targetSecIdx = ACT_REVIEW_SECTION_TO_IDX[st.reviewSection];
  } else if (st.reviewFilter === 'wrong') {
    const idx = st.questions.findIndex((q, gi) => {
      if (q.type === 'ACT_WRITING' || q.type === 'ESSAY') return false;
      const a = st.answers[gi];
      return a !== undefined && a !== q.correct;
    });
    if (idx >= 0) {
      const secId = st.questions[idx].section;
      const found = st.sections.findIndex(s => s.id === secId);
      if (found >= 0) targetSecIdx = found;
    }
  }

  nav('stu-act');
  const page = document.getElementById('page-stu-act');
  if (page) page.classList.add('review-mode');
  stuSwitchActSection(pk, targetSecIdx);
  stuStopTimer(pk);

  // Find first matching local question inside this section per filter
  const secQ = st._secQuestions || [];
  let localIdx = 0;
  if (st.reviewFilter === 'wrong') {
    const hit = secQ.findIndex(q => {
      if (q.type === 'ACT_WRITING' || q.type === 'ESSAY') return false;
      const a = st.answers[q.globalIdx];
      return a !== undefined && a !== q.correct;
    });
    if (hit >= 0) localIdx = hit;
  } else if (st.reviewFilter === 'correct') {
    const hit = secQ.findIndex(q => {
      if (q.type === 'ACT_WRITING' || q.type === 'ESSAY') return false;
      const a = st.answers[q.globalIdx];
      return a === q.correct;
    });
    if (hit >= 0) localIdx = hit;
  }
  if (secQ.length) stuActGoLocal(pk, localIdx);
}
function stuActExitReview() {
  const pk = 'stuAct';
  const st = STU_STATE[pk];
  if (st) st.reviewMode = false;
  const page = document.getElementById('page-stu-act');
  if (page) page.classList.remove('review-mode');
  nav('stu-act-report');
}

// ═══════════════════════════════════════════════════════════════════
//  ACT EXAM-START SCREENS
// ═══════════════════════════════════════════════════════════════════
//  Layered onboarding before the timer starts:
//    stuActBegin → stuActShowExamLanding   (1 screen, whole-test scope)
//                → stuActShowSectionLanding (4 screens, per-subject)
//                → stuActStartSection      (timer ON, player live)
//
//  Each subject (English / Mathematics / Reading / Science) gets its
//  own accent color, icon, real-ACT-style directions, tool list,
//  pacing tip — driven by ACT_SUBJECT_THEMES below. Writing remains on
//  the legacy generic-modal flow because the essay editor already
