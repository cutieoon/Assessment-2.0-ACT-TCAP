// @ts-nocheck
// Phase-2 slice: lines 24516-25160 of original src/app.ts

// ═══════ ACT REPORT — shadcn redesign helpers (v2) ═══════

// Color tier for category accuracy capsules. Thresholds chosen to match
// ACT mastery framing: ≥80 strong, 65–79 ok, 50–64 needs review, <50 critical.
function actCapsuleTier(pct) {
  if (pct >= 80) return 'tier-high';
  if (pct >= 65) return 'tier-mid';
  if (pct >= 50) return 'tier-low';
  return 'tier-crit';
}

// Subject metadata for the new dashboard. Color dots stay consistent
// across KPI cards, capsule rows, and readiness table.
const ACTR_SUBJECTS = [
  { k:'english', label:'English', dot:'actr-dot-eng', course:'English Composition' },
  { k:'math',    label:'Math',    dot:'actr-dot-math', course:'College Algebra' },
  { k:'reading', label:'Reading', dot:'actr-dot-rdg', course:'Social Sciences' },
  { k:'science', label:'Science', dot:'actr-dot-sci', course:'Biology' }
];

// ── A1 · Score Report Hero — single big card replacing the previous
//   stack of [Composite header] + [4 subject KPI cards] + [Derived strip].
//   Left half (purple gradient): COMPOSITE / percentile pill / met-chip.
//   Right half (white): SECTION SCORES with horizontal bars + BM tick +
//   numeric score + tier chip, then a thin divider and 3 derived items
//   (STEM / ELA / WRITING) stacked horizontally.
//
// Note: renderActReportHeader / renderActKpiDashboard / renderActDerivedStrip
//   are intentionally kept below as dead code so a one-line revert in
//   renderActReport can roll back to the older layout if this design
//   doesn't land. They are no longer called.
function renderActReportHero(d) {
  const composite = d.composite || 0;
  const usPct = d.usRank?.composite;
  const sc = d.scores || {};
  const bm = d.benchmarks || {};
  const ordinalSuffix = n => {
    const v = n % 100;
    if (v >= 11 && v <= 13) return 'th';
    switch (n % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th'; }
  };
  const subjectColors = {
    english: '#10b981',
    math:    '#3b82f6',
    reading: '#8b5cf6',
    science: '#f59e0b'
  };
  const sections = ACTR_SUBJECTS.map(meta => {
    const score = sc[meta.k];
    const bench = bm[meta.k];
    const met = (score != null && bench != null) ? score >= bench : false;
    const equal = score === bench;
    const tier = met && !equal ? 'met' : equal ? 'equal' : 'below';
    const icon = met && !equal ? '✓' : equal ? '=' : '⚠';
    return { ...meta, score, bench, tier, icon };
  });
  const metCount = sections.filter(s => s.score >= s.bench).length;
  const allMet = metCount === sections.length;
  const worst = [...sections].sort((a,b) => (a.score - a.bench) - (b.score - b.bench))[0];
  const subtitle = allMet
    ? 'All sections at benchmark'
    : (worst && worst.score < worst.bench ? `${worst.label} needs attention` : '');

  const barsHtml = sections.map(s => {
    const fillPct = Math.max(0, Math.min(100, Math.round(((s.score || 0) / 36) * 100)));
    const tickPct = Math.max(0, Math.min(100, Math.round(((s.bench || 0) / 36) * 100)));
    const color = subjectColors[s.k] || '#6040ca';
    return `<div class="actr-hero-bar-row">
      <div class="lbl"><span class="dot" style="background:${color}"></span>${s.label}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${fillPct}%;background:${color}"></div>
        <div class="bar-tick" style="left:${tickPct}%" title="Benchmark ${s.bench}"></div>
      </div>
      <div class="num-cell" style="color:${color}">${s.score ?? '—'}</div>
      <span class="chip ${s.tier}">${s.icon} BM ${s.bench ?? '—'}</span>
    </div>`;
  }).join('');

  // Derived row (STEM / ELA / Writing) — only render if any value present.
  const der = d.derived || {};
  const derivedItems = [];
  if (typeof der.stem === 'number') {
    const ok = der.stem >= (bm.stem || 0);
    derivedItems.push({
      kicker:'STEM',
      valHtml:`${der.stem}`,
      chipHtml:`<span class="chip ${ok ? 'met' : 'below'}">${ok ? '✓' : '⚠'} BM ${bm.stem ?? '—'}</span>`
    });
  }
  if (typeof der.ela === 'number') {
    const ok = der.ela >= (bm.ela || 0);
    derivedItems.push({
      kicker:'ELA',
      valHtml:`${der.ela}`,
      chipHtml:`<span class="chip ${ok ? 'met' : 'below'}">${ok ? '✓' : '⚠'} BM ${bm.ela ?? '—'}</span>`
    });
  }
  if (typeof der.writing === 'number') {
    const reviewState = der.writingReviewState || '';
    const isPending = /pending/i.test(reviewState);
    derivedItems.push({
      kicker:'Writing',
      valHtml:`${der.writing}<span class="d-scale"> / 12</span>`,
      chipHtml:`<span class="chip ${isPending ? 'below' : 'equal'}">${isPending ? 'Review pending' : 'Scored'}</span>`
    });
  }
  const derivedHtml = derivedItems.length ? `<div class="actr-hero-derived">
    ${derivedItems.map(it => `<div class="actr-hero-derived-item">
      <div class="d-kicker">${it.kicker}</div>
      <div class="d-num-row">
        <span class="d-num">${it.valHtml}</span>
        ${it.chipHtml}
      </div>
    </div>`).join('')}
  </div>` : '';

  return `<header class="actr-hero-card">
    <div class="actr-hero-left">
      <div>
        <div class="kicker">Composite Score</div>
        <div class="num-row"><span class="num">${composite}</span><span class="scale">/ 36</span></div>
      </div>
      ${usPct != null ? `<span class="actr-hero-pill">
        <span class="pct-num">${usPct}</span><sub>${ordinalSuffix(usPct)}</sub>
        <span class="label-text">US Percentile</span>
      </span>` : ''}
      <span class="actr-hero-pill stack">
        <span class="top-line"><span class="icon">${allMet ? '✓' : '◐'}</span><span><b>${metCount} / ${sections.length}</b> Benchmarks met</span></span>
        ${subtitle ? `<span class="sub-line">${subtitle}</span>` : ''}
      </span>
    </div>
    <div class="actr-hero-right">
      <div>
        <div class="h-kicker">Section Scores</div>
        <div class="actr-hero-bars">${barsHtml}</div>
      </div>
      ${derivedHtml}
    </div>
  </header>`;
}

// Header: kicker + title + meta + actions cluster.
// DEPRECATED — superseded by renderActReportHero (A1). Kept for one-line
// rollback. Not currently called by renderActReport.
function renderActReportHeader(d) {
  const studentName = (typeof STUDENT_PROFILE !== 'undefined' && STUDENT_PROFILE?.name)
    ? STUDENT_PROFILE.name : 'Student';
  // Composite hero: composite was previously one of 5 equal KPI cards. Now
  // it lives in the page header as the headline number, with percentile +
  // benchmarks-met chip + (optional) trend chip directly below it. The KPI
  // grid below renders only the 4 subject cards.
  const composite = d.composite || 0;
  const compositePct = Math.round((composite / 36) * 100);
  const usPct = d.usRank?.composite;
  const coreCount = 4; // English / Math / Reading / Science
  const sc = d.scores || {};
  const bm = d.benchmarks || {};
  let metCount = 0;
  ['english','math','reading','science'].forEach(k => {
    if ((sc[k] || 0) >= (bm[k] || 0)) metCount += 1;
  });
  const bmChipCls = metCount === coreCount ? 'met' : metCount === 0 ? 'below' : 'equal';
  // Page header — shadcn-flavored vertical stack: kicker / hero num / meta.
  // Replaces the old horizontal banner where every element fought for the
  // baseline (label, number, /36, percentile, chip). Trend chip is still
  // dropped — no prior-attempt data wired in this prototype.
  // English ordinal suffix: 1st, 2nd, 3rd, 4-20th, 21st, 22nd, 23rd, 24-30th...
  const ordinalSuffix = n => {
    const v = n % 100;
    if (v >= 11 && v <= 13) return 'th';
    switch (n % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th'; }
  };
  return `<header class="actr-header">
    <div class="actr-hero-num">
      <span class="nlbl">Composite</span>
      <div class="num-row">
        <span class="num">${composite}</span>
        <span class="scale">/ 36</span>
      </div>
    </div>
    <div class="actr-hero-meta">
      ${usPct != null ? `<span class="actr-hero-percentile"><span class="pct-num">${usPct}</span><sup>${ordinalSuffix(usPct)}</sup>US percentile</span>` : ''}
      ${usPct != null ? '<span class="actr-meta-sep">·</span>' : ''}
      <span class="actr-bm-chip ${bmChipCls}">${metCount} / ${coreCount} Benchmarks met</span>
    </div>
  </header>`;
}

// Sticky tab nav. Anchors must match section ids set in renderActReport.
function renderActReportTabs(hasWriting) {
  const tabs = [
    { id:'overview',        label:'Overview' },
    { id:'diagnostics',     label:'Diagnostics' },
    { id:'question-review', label:'My Question Record' }
  ];
  return `<nav class="actr-tabs" id="actrReportTabs" aria-label="On this page">
    <div class="actr-tabs-inner">
      ${tabs.map((t, i) => `<a class="tab ${i === 0 ? 'is-active' : ''}" data-target="${t.id}" onclick="actrJumpTab('${t.id}');return false;">${t.label}</a>`).join('')}
    </div>
  </nav>`;
}

// KPI dashboard: 4 subject cards (English / Math / Reading / Science).
// Composite was promoted to the page hero in renderActReportHeader so it
// gets the headline visual weight it deserves and no longer competes with
// the per-subject cards for the eye. metCount param is no longer used here
// (the hero shows it instead) — kept in the signature for caller stability.
function renderActKpiDashboard(d, coreScores, metCount) {
  const subjectCards = coreScores.map((s, i) => {
    const meta = ACTR_SUBJECTS[i] || ACTR_SUBJECTS.find(x => x.k === s.k);
    const met = s.score >= s.bm;
    const equal = s.score === s.bm;
    const chipCls = met && !equal ? 'met' : equal ? 'equal' : 'below';
    const chipIcon = met && !equal ? '✓' : equal ? '=' : '⚠';
    const chipText = `${chipIcon} Benchmark ${s.bm}`;
    const pctOf36 = Math.round((s.score / 36) * 100);
    // Section accuracy from categories — sums correct / total across items
    let acc = 0, totalQ = 0, correctQ = 0;
    const catSec = (ACT_REPORT.categories?.[s.k]?.items) || [];
    catSec.forEach(it => { totalQ += it.total || 0; correctQ += it.correct || 0; });
    if (totalQ) acc = Math.round((correctQ / totalQ) * 100);
    return `<div class="actr-kpi-card">
      <div class="label"><span>${s.label}</span></div>
      <div class="num-row">
        <span class="num">${s.score}</span>
        <span class="actr-bm-chip ${chipCls}">${chipText}</span>
      </div>
      <div class="foot"><span>${acc || '—'}% accuracy</span></div>
    </div>`;
  }).join('');

  return `<section class="actr-kpi-grid">${subjectCards}</section>`;
}

// Derived strip: STEM / ELA / Writing summary in a compact line.
function renderActDerivedStrip(d) {
  const der = d.derived || {};
  const bm = d.benchmarks || {};
  if (!der.stem && !der.ela && !der.writing) return '';
  const items = [];
  if (typeof der.stem === 'number') {
    const ok = der.stem >= (bm.stem || 0);
    items.push(`<span class="actr-derived-item">
      <span class="nm">STEM</span>
      <span class="val">${der.stem}</span>
      <span class="actr-bm-chip ${ok ? 'met' : 'below'}">${ok ? '✓' : '⚠'} Benchmark ${bm.stem || '—'}</span>
    </span>`);
  }
  if (typeof der.ela === 'number') {
    const ok = der.ela >= (bm.ela || 0);
    items.push(`<span class="actr-derived-item">
      <span class="nm">ELA</span>
      <span class="val">${der.ela}</span>
      <span class="actr-bm-chip ${ok ? 'met' : 'below'}">${ok ? '✓' : '⚠'} Benchmark ${bm.ela || '—'}</span>
    </span>`);
  }
  if (typeof der.writing === 'number') {
    items.push(`<span class="actr-derived-item">
      <span class="nm">Writing</span>
      <span class="val">${der.writing}<span class="scale-sm"> / 12</span></span>
      <span class="actr-bm-chip equal" title="${der.writingReviewState || ''}">${(der.writingReviewState || '').includes('pending') ? 'Review pending' : 'Scored'}</span>
    </span>`);
  }
  return `<section class="actr-derived-strip">
    <span class="label-prefix">Derived scores</span>
    ${items.join('')}
  </section>`;
}

// Per-subject diagnostics row — fuses 3 previously-separate views:
//   1) Subject score + colored dot              (was: KPI card recap)
//   2) Skill capsules colored by mastery tier   (was: category capsules row)
//   3) College readiness status chip            (was: readiness strip table)
// Layout (left → right): Subject + score + "predicts: <Course>"  | Skill chips |
//   ✓ Ready / = At benchmark / ⚠ Keep building. Clicking a capsule jumps to
// Question Record and selects that subject's tab. The standalone readiness
// strip / grid was removed — all of its information now lives on this row,
// and "predicts: <Course>" preserves the College Readiness mapping that the
// old strip exposed via its "Course it predicts" column.
function renderActDiagnosticsCapsules(categories, coreScores, bm) {
  const rows = ACTR_SUBJECTS.map((meta, i) => {
    const sc = coreScores.find(s => s.k === meta.k);
    const items = (categories?.[meta.k]?.items) || [];
    if (!items.length) return '';
    const caps = items.map(it => {
      const tier = actCapsuleTier(it.pct || 0);
      const short = (it.name || '').replace(/&/g, '&amp;');
      return `<button type="button" class="actr-cap ${tier}" onclick="actrCapsuleJump('${meta.k}')" title="${short} — ${it.correct}/${it.total} (${it.pct}%)">
        <span class="cap-nm">${short}</span>
        <span class="cap-pct">${it.pct}%</span>
      </button>`;
    }).join('');
    // Readiness chip — same vocabulary as the deleted readiness strip.
    const score = sc?.score ?? null;
    const bench = bm?.[meta.k];
    let readyHtml = '';
    if (score != null && bench != null) {
      const met = score >= bench;
      const equal = score === bench;
      const cls = met && !equal ? 'met' : equal ? 'equal' : 'below';
      const txt = met && !equal ? '✓ Ready' : equal ? '= At benchmark' : '⚠ Keep building';
      readyHtml = `<span class="actr-bm-chip ${cls}" title="Benchmark ${bench}">${txt}</span>`;
    }
    return `<div class="actr-capsule-row">
      <div class="subj-cell">
        <div class="top">
          <span class="dot ${meta.dot}"></span>
          <span class="nm">${meta.label}</span>
          <span class="sc">${score ?? '—'}</span>
        </div>
      </div>
      <div class="caps">${caps}</div>
      <div class="ready-cell">${readyHtml}</div>
    </div>`;
  }).filter(Boolean).join('');
  return `<div class="actr-capsules">${rows}</div>`;
}

// Capsule click handler — switches Question Record tab + scrolls there.
function actrCapsuleJump(subjectKey) {
  if (typeof setActReviewSection === 'function') {
    try { setActReviewSection(subjectKey); } catch(e) {}
  }
  setTimeout(() => reportJumpTo('question-review'), 50);
}

// The ACT report scrolls inside `.report-page` (overflow-y:auto), NOT window.
// Resolve the actual scroll container so jump/observer hit the right element.
function _actrScroller() {
  return document.getElementById('page-stu-act-report') || document.scrollingElement || document.documentElement;
}

// Sticky-tab anchor jump (smooth scroll, preserves URL hash visibility).
function actrJumpTab(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const scroller = _actrScroller();
  // Account for sticky tab bar height (~46px) so headings aren't hidden.
  const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 60;
  scroller.scrollTo({ top: Math.max(top, 0), behavior:'smooth' });
}

// Highlight active tab when user scrolls past each section.
let _actrTabsObserver = null;
function initActReportTabsObserver() {
  if (_actrTabsObserver) { try { _actrTabsObserver.disconnect(); } catch(e){} _actrTabsObserver = null; }
  const tabs = document.querySelectorAll('#actrReportTabs .tab');
  if (!tabs.length) return;
  const sectionIds = Array.from(tabs).map(t => t.dataset.target);
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const scroller = _actrScroller();
  // Activate the LAST section currently above the scroller top (+ tab bar offset).
  function refresh() {
    const offset = 80;
    const scTop = scroller.getBoundingClientRect().top;
    let activeId = sections[0].id;
    for (const s of sections) {
      if (s.getBoundingClientRect().top - scTop - offset <= 0) activeId = s.id;
    }
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.target === activeId));
  }
  refresh();
  // Use scroll listener instead of IntersectionObserver — simpler and
  // avoids "no entry above viewport" edge cases at top of page.
  const onScroll = () => requestAnimationFrame(refresh);
  scroller.addEventListener('scroll', onScroll, { passive:true });
  // Stash a sentinel so we can disconnect on re-render.
  _actrTabsObserver = { disconnect: () => scroller.removeEventListener('scroll', onScroll) };
}

function renderActReport(){
  const session = getReportState('act');
  if (reportEdgePreview?.type === 'act' && reportEdgePreview.state !== 'released') {
    document.getElementById('actReportBody').innerHTML = renderReportGate('act');
    return;
  }
  _mergeActScores();
  const d = ACT_REPORT, c = document.getElementById('actReportBody');
  const sc = d.scores, bm = d.benchmarks;
  const coreScores = [
    { k:'english', label:'English', score:sc.english, bm:bm.english },
    { k:'math',    label:'Math',    score:sc.math,    bm:bm.math    },
    { k:'reading', label:'Reading', score:sc.reading, bm:bm.reading },
    { k:'science', label:'Science', score:sc.science, bm:bm.science }
  ];
  const metCount = coreScores.filter(s => s.score >= s.bm).length;
  const hasWriting = !!d.derived.writing;

  // A1 redesign: the previous 3-module stack (Composite header + 4 KPI
  // cards + Derived strip) is now a single integrated hero card with
  // purple-left / white-right split. Sticky tabs follow, then Overview
  // shows only AI Insights; Diagnostics + Question Record below.
  c.innerHTML = `<div class="actr-shell">
    ${renderActReportHero(d)}
    ${renderActReportTabs(hasWriting)}

    <section id="overview">
      ${renderActAiInsights(coreScores, d.categories, d)}
    </section>

    <section id="diagnostics" class="actr-section">
      <header class="actr-section-head">
        <div>
          <h2>Diagnostics</h2>
        </div>
      </header>
      ${renderActDiagnosticsCapsules(d.categories, coreScores, bm)}
    </section>

    <section id="question-review" class="actr-section">
      <header class="actr-section-head">
        <div>
          <h2>My Question Record</h2>
        </div>
      </header>
      ${renderActQuestionReviewSummary()}
    </section>
  </div>`;

  renderStudentInfoBar('actStudentInfo','ACT',d.testDate);
  initActReportTabsObserver();
}

/* ─── ACT Writing report section (v2) ─────────────────────────────────────
   ACT Writing is a SINGLE 40-min essay scored on 4 analytic rubric domains
   (each 2–12, summed from two raters → averaged). The report mirrors the
   pattern top platforms use (Princeton Review, Magoosh, Khan): a compact
   pacing/length/raters strip → AI takeaway → per-domain rubric breakdown
   with takeaways → expandable essay preview. Borrows the IELTS reference's
   tight stat-strip vibe but skips Part 1/Part 2 (ACT is one essay).
   ────────────────────────────────────────────────────────────────────────── */

// Per-domain qualitative tier from the 2–12 ACT Writing scale.
// Labels align with the ACT Writing Test Rubric's 6 per-rater levels
// (each rater scores 1–6, summed → 2–12) so this view stays consistent
// with the official rubric language used on the Review Mode page.
function _actWritingTier(score) {
  if (score >= 11) return { tag:'Effective',      cls:'tier-high' };
  if (score >= 9)  return { tag:'Well-developed', cls:'tier-high' };
  if (score >= 7)  return { tag:'Adequate',       cls:'tier-good' };
  if (score >= 5)  return { tag:'Developing',     cls:'tier-mid'  };
  if (score >= 3)  return { tag:'Weak',           cls:'tier-low'  };
  return                  { tag:'Inadequate',     cls:'tier-crit' };
}

// One-line domain takeaway. Generic-sensitive copy keyed off the tier so
// the report reads like a real rubric report rather than placeholder text.
function _actWritingDomainTakeaway(label, score) {
  const map = {
    'Ideas and Analysis': {
      high: 'Perspective is precise and engages other views head-on.',
      good: 'Clear stance; would benefit from explicit acknowledgment of a counter-perspective.',
      mid:  'Position is identifiable but engagement with other views feels surface-level.',
      low:  'Perspective drifts; tighten your central claim before drafting.',
    },
    'Development and Support': {
      high: 'Specific, well-chosen evidence with sustained reasoning.',
      good: 'Examples are present but generic — concrete cases would lift the score.',
      mid:  'Reasoning leans on assertion rather than evidence; aim for one detailed example per paragraph.',
      low:  'Add concrete evidence; without it, claims read as opinion.',
    },
    'Organization': {
      high: 'Strong intro → conclusion arc with smooth, purposeful transitions.',
      good: 'Structure is clear; transitions could vary beyond "first/next/finally".',
      mid:  'Paragraph breaks are present but the through-line gets lost mid-essay.',
      low:  'Outline before drafting — readers lose the argument by paragraph 3.',
    },
    'Language Use and Conventions': {
      high: 'Confident sentence variety; mechanics rarely distract.',
      good: 'Sentence variety is solid; watch run-ons in the middle paragraphs.',
      mid:  'Repetitive structure and a few mechanics slips slow the reader down.',
      low:  'Surface errors are frequent enough to obscure meaning — proofread aloud.',
    },
  };
  const tier = score >= 10 ? 'high' : score >= 8 ? 'good' : score >= 6 ? 'mid' : 'low';
  return (map[label] || {})[tier] || 'Practice with timed rubric-aligned writing prompts.';
}

// The algorithmic "Next Step" generator (ACT_NEXT_STEP_PRIORITY +
// ACT_NEXT_STEP_MAP + _actNextStepFor) was removed. The callout below the
// rubric is now teacher-authored only: derived.writingTeacherFeedback. If
// the teacher hasn't left a note (or grading is still pending), nothing
// renders. Rationale: students should never see synthetic generic advice
// presented as if a teacher wrote it.

function renderActWritingSectionV2(d, opts = {}) {
  const embedded = opts.embedded === true;
  const w = d.derived.writing;
  const dom = d.derived.writingDomains || {};
  const m   = d.derived.writingMeta || {};
  const reviewState = d.derived.writingReviewState || 'Review pending';
  const tier = _actWritingTier(w);

  // ── Pacing / Length / Raters strip ──
  // Status dot encodes "is this healthy" without a progress bar; the
  // numeric value + range live in the same line.
  const timeUsed = m.timeUsedMin ?? 0;
  const timeAllowed = m.timeAllowedMin ?? 40;
  const timePct = Math.min(100, Math.round((timeUsed / timeAllowed) * 100));
  const timeNote = timePct > 95 ? 'Right at the wire'
                : timePct > 75 ? 'Used most of the window'
                : timePct > 50 ? 'Healthy pace'
                : 'Finished early';
  const timeDot = timePct > 95 ? 'warn' : 'ok';

  const wordCount = m.wordCount ?? 0;
  const wTarget = m.wordTarget || [300, 500];
  const inRange = wordCount >= wTarget[0] && wordCount <= wTarget[1];
  const overShort = wordCount < wTarget[0];
  const wordNote = inRange ? 'Within suggested range'
                : overShort ? 'Below recommended length'
                : 'Above recommended length';
  const wordDot = inRange ? 'ok' : overShort ? 'crit' : 'warn';

  const r1 = m.rater1, r2 = m.rater2;
  const raterAgree = m.raterAgreement || 'agreed';
  const raterLine = (r1 != null && r2 != null)
    ? `${r1} + ${r2}`
    : '—';
  const raterNote = raterAgree === 'agreed' ? 'Both raters agreed'
                  : raterAgree === 'minor'   ? '1-point spread (averaged)'
                  : 'Third rater resolved spread';
  const raterDot = raterAgree === 'agreed' ? 'ok' : raterAgree === 'minor' ? 'warn' : 'crit';

  const stripHtml = `<div class="actw-strip">
    <div class="actw-stat">
      <div class="actw-stat-label">Time used</div>
      <div class="actw-stat-value">${timeUsed} <span class="muted">/ ${timeAllowed} min</span></div>
      <div class="actw-stat-note"><span class="actw-stat-dot ${timeDot}"></span>${timeNote}</div>
    </div>
    <div class="actw-stat">
      <div class="actw-stat-label">Word count</div>
      <div class="actw-stat-value">${wordCount} <span class="muted">/ ${wTarget[0]}–${wTarget[1]}</span></div>
      <div class="actw-stat-note"><span class="actw-stat-dot ${wordDot}"></span>${wordNote}</div>
    </div>
    <div class="actw-stat">
      <div class="actw-stat-label">Raters (sum)</div>
      <div class="actw-stat-value">${raterLine} <span class="muted">/ 12</span></div>
      <div class="actw-stat-note"><span class="actw-stat-dot ${raterDot}"></span>${raterNote}</div>
    </div>
  </div>`;

  // ── Per-domain rubric breakdown ──
  // No progress bar; the score itself + tier badge + colored card edge
  // carry the visual weight. Generic rubric definition moved to a tooltip
  // on the domain name (it's the same text for every student).
  const domainRows = ACT_WRITING_DOMAINS.map(meta => {
    const score = dom[meta.label] ?? 0;
    const tierInfo = _actWritingTier(score);
    const takeaway = _actWritingDomainTakeaway(meta.label, score);
    const tip = (meta.desc || '').replace(/"/g, '&quot;');
    return `<div class="actw-domain ${tierInfo.cls}">
      <div class="actw-domain-head">
        <div class="actw-domain-name" data-tip="${tip}">${meta.label}<span class="info" aria-hidden="true">i</span></div>
        <div class="actw-domain-score">${score}<span class="muted">/12</span> <span class="actw-tier ${tierInfo.cls}">${tierInfo.tag}</span></div>
      </div>
      <div class="actw-domain-takeaway"><span class="ai-mark">✦</span>${takeaway}</div>
    </div>`;
  }).join('');

  // ── Essay preview (collapsed by default) ──
  const essayHtml = m.essayPreview ? `<details class="actw-essay">
    <summary>
      <span class="actw-essay-summary-text">View prompt and your response</span>
      <span class="actw-essay-summary-meta">${m.promptTitle || ACT_WRITING_PROMPT.title} · ${wordCount} words</span>
    </summary>
    <div class="actw-essay-body">
      <div class="actw-essay-prompt">
        <div class="actw-essay-kicker">Prompt</div>
        <div class="actw-essay-prompt-title">${m.promptTitle || ACT_WRITING_PROMPT.title}</div>
        <div class="actw-essay-prompt-body">${ACT_WRITING_PROMPT.issue || ''}</div>
      </div>
      <div class="actw-essay-response">
        <div class="actw-essay-kicker">Your response</div>
        <div class="actw-essay-response-body">${m.essayPreview.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
      </div>
    </div>
  </details>` : '';

  // ── AI takeaway (one strong line, surfaces top strength + biggest lever) ──
  const sortedDomains = Object.entries(dom).sort((a,b) => b[1] - a[1]);
  const topDomain = sortedDomains[0];
  const lowDomain = sortedDomains[sortedDomains.length - 1];
  const aiLine = (topDomain && lowDomain) ? `<div class="ai-line">
    <span class="ai-icon">✦</span>
    <span>Strongest: <b>${topDomain[0]}</b> (${topDomain[1]}/12). Most room to grow: <b>${lowDomain[0]}</b> (${lowDomain[1]}/12).</span>
  </div>` : '';

  // Headline strip — when embedded inside the Writing tab of My Question
  // Record we drop the page-level <section>/<h2> wrapper and render a
  // lighter heading (the tab itself already says "Writing"), then route
  // students into the full essay-review page with an explicit CTA.
  if (embedded) {
    // QR is the lean summary view: composite score, the "what to focus on"
    // AI line, and 4 rubric-domain cards with per-domain takeaways. Pacing /
    // length / rater metadata + the full essay + official rubric language all
    // live on the Review Mode page; duplicating them here only creates two
    // pages saying the same thing.
    return `<div class="actw-embedded">
      <div class="actw-embedded-head">
        <div class="actw-embedded-title">
          <span class="actw-embedded-score">${w} <span class="muted">/ 12</span></span>
          <span class="actw-headline-tier ${tier.cls}">${tier.tag}</span>
          <span class="actw-headline-state">${reviewState}</span>
        </div>
      </div>
      ${aiLine}
      <div class="actw-domain-grid">${domainRows}</div>
      <div class="qrec-cta-row">
        <button class="qrec-cta" onclick="openActQuestionDetails('all','writing')">Open in Review Mode</button>
      </div>
    </div>`;
  }

  return `<section id="writing" class="actr-section">
    <header class="actr-section-head">
      <div>
        <h2>Writing
          <span class="actw-headline-score">${w} / 12</span>
          <span class="actw-headline-tier ${tier.cls}">${tier.tag}</span>
          <span class="actw-headline-state">${reviewState}</span>
        </h2>
        <div class="sub">Single 40-minute essay. Scored on 4 analytic rubric domains (each 2–12).</div>
      </div>
    </header>

    ${stripHtml}
    ${aiLine}

    <div class="actw-domain-grid">${domainRows}</div>

    ${essayHtml}
  </section>`;
}

// renderActReadinessGrid + renderActReadinessStrip removed — both were
// independent readiness views that the new 3-column Diagnostics row absorbs:
//   • Status (✓ Ready / = At benchmark / ⚠ Keep building) → row's right chip
//   • "Course it predicts" (English Composition, etc.)    → row's "predicts:" line
// Keeping them around would have been dead code with no entry point.

