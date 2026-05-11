// @ts-nocheck
// Phase-2 slice: lines 1567-2348 of original src/app.ts

// ═══════ DRAWER ═══════
const DRAWER_DATA = {
  act: {
    title:'ACT Practice', badge:'ACT', desc:'ACT-aligned practice with Composite from English · Math · Reading (1–36). Science and Writing are optional add-ons for STEM and ELA scores.',
    maxScore:36, sections:[
      { id:'act-eng', name:'English', q:50, time:35, passages:true, passageCount:5, required:true },
      { id:'act-math', name:'Mathematics', q:45, time:50, passages:false, required:true },
      { id:'act-reading', name:'Reading', q:36, time:40, passages:true, passageCount:4, required:true },
      { id:'act-science', name:'Science', q:40, time:40, passages:true, passageCount:6, optional:true, desc:'Data interpretation, research summaries, conflicting viewpoints (Optional)' },
      { id:'act-writing', name:'Writing', q:1, time:40, passages:false, optional:true, desc:'Optional writing section with domain-level scoring' },
    ]
  },
  sat: {
    title:'SAT Practice', badge:'SAT', desc:'Digital SAT simulation with adaptive Reading & Writing and Math modules',
    maxScore:1600, sections:[
      { id:'sat-rw1', name:'R&W Module 1', q:27, time:32, passages:true, passageCount:27, required:true },
      { id:'sat-rw2', name:'R&W Module 2 (Adaptive)', q:27, time:32, passages:true, passageCount:27, required:true, desc:'Difficulty adapts based on Module 1 performance' },
      { id:'sat-math1', name:'Math Module 1', q:22, time:35, passages:false, required:true },
      { id:'sat-math2', name:'Math Module 2 (Adaptive)', q:22, time:35, passages:false, required:true, desc:'Difficulty adapts based on Module 1 performance' },
    ]
  },
  tcap: {
    title:'TCAP Assessment', badge:'TCAP Achievement + EOC',
    desc:'TCAP-style diagnostic with predicted scale score, performance level, and a practice plan. Pilot covers G3–10 — see subject grade ranges below.'
  }
};

// TCAP drawer configuration — drives the custom UI inside openDrawer('tcap').
// Subject-specific gradeRange overrides the default 3–10 range:
//   - Social Studies starts at G6 per TDOE.
//   - Science is G3–8 only for pilot (Biology G10 EOC deferred to Phase 2).
//   - ELA / Math extend to G10 because their HS EOC counterparts are in Phase 1
//     (English I G9 / English II G10 / Algebra I G9 / Geometry G10).
const DW_TCAP_CONFIG = {
  grades: [3,4,5,6,7,8,9,10],
  /* Subject card desc kept to a single short clause — the per-subject grade
   * range is conveyed by the G3–10 / G3–8 / G6–8 chip on each card, and EOC
   * course resolution (e.g. Math G9 → Algebra I EOC) shows in the footer
   * once the teacher picks a HS grade. Don't repeat that info in the desc. */
  subjects: [
    { id:'ela',     label:'ELA',            desc:'Reading, language, writing',                gradeRange:[3,10] },
    { id:'math',    label:'Math',           desc:'Operations through algebra',                gradeRange:[3,10] },
    { id:'science', label:'Science',        desc:'Life, earth, physical sciences',            gradeRange:[3,8]  },
    { id:'ss',      label:'Social Studies', desc:'History, geography, civics, economics',     gradeRange:[6,8]  }
  ],
  /* Pilot scope: only Diagnostic mode is supported. Benchmark Check was
   * removed because it overlapped 1:1 with Diagnostic in functional terms
   * (same blueprint, same scoring, same report — only the use-case framing
   * differed). Practice Set was removed because the underlying practice
   * engine (focused single-standard sets, gap-targeted item selection,
   * progress unlock) doesn't exist in Assessment yet — surfacing the option
   * would promise UX we can't deliver this iteration. The mode array is
   * preserved as a single-entry list so downstream `find(m => m.id ===
   * dwTcap.mode)` calls keep returning a real label, and re-introducing
   * additional modes later only requires appending entries here.
   *
   * NOTE: this does NOT remove the AI "practice plan" recommendations that
   * appear in Analytics or in the student report — those are downstream
   * AI-generated suggestions, separate from "create a practice assessment"
   * as a teacher-authored mode. */
  modes: [
    { id:'diagnostic', label:'Diagnostic', desc:'Full TCAP-style assessment · predicts scale score + 4-level performance + per-standard gaps + practice plan', recommended:true }
  ],
  /* Length picker removed for pilot — TDOE locks the per-Subpart item count
   * and time inside TCAP_SUBPART_BLUEPRINT (e.g. ELA G5 = 55 items / 235
   * min, fixed). The previous "Short Form 20 / Full Form 45" choice was
   * fictional vs the locked blueprint, surfaced two conflicting numbers
   * on the same screen, and only affected display strings — no functional
   * change. Real item-count totals now read straight from
   * tcapBlueprintTotals(subject, grade). Re-introducing teacher-selectable
   * sampling depth would be a Practice-mode feature (Phase 2). */
  lengths: []
};

// ─────────────────────────────────────────────────────────────────────────────
// TCAP Subpart blueprint (TDOE official structure — read-only)
// Each subject's structure is fixed: number of subparts, time limits, and special
// rules (calculator on/off, must-be-first, human-grade-only) cannot be changed
// by teachers or admins. Teachers can only swap items inside a subpart and
// schedule each subpart on a different day. extMin = base × 1.2 (default
// extended-time multiplier; a student's profile can override).
// Predicted scale score is only computed once ALL subparts of a subject are submitted.
// ─────────────────────────────────────────────────────────────────────────────
const TCAP_SUBPART_BLUEPRINT = {
  ela: [
    { code:'SP1', label:'Writing',                    desc:'Narrative / Explanatory / Argumentative (random of 3)',  minutes:85, extMin:102, mustBeFirst:true, mustBeSeparate:true, humanGradeOnly:true, items:1, weight:0.35 },
    { code:'SP2', label:'Literary Reading',           desc:'Reading comprehension · literary passages',              minutes:50, extMin:60,  items:18, weight:0.22 },
    { code:'SP3', label:'Informational Reading',      desc:'Reading comprehension · informational text',             minutes:50, extMin:60,  items:18, weight:0.22 },
    { code:'SP4', label:'Language & Conventions',     desc:'Grammar, usage, mechanics',                              minutes:50, extMin:60,  items:18, weight:0.21 }
  ],
  math: [
    { code:'SP1', label:'Calculator-Free Computation',desc:'Basic computation · calculator disabled',                minutes:60, extMin:72,  mustBeFirst:true, calculator:false, items:18, weight:0.34 },
    { code:'SP2', label:'Problem Solving I',          desc:'Multi-step problems · calculator allowed',               minutes:60, extMin:72,  calculator:true,  items:18, weight:0.33 },
    { code:'SP3', label:'Problem Solving II',         desc:'Multi-step problems · calculator allowed',               minutes:60, extMin:72,  calculator:true,  items:18, weight:0.33 }
  ],
  science_3_4: [
    { code:'SP1', label:'Life · Earth · Physical Science', desc:'Single session covers full content',               minutes:50, extMin:60,  items:25, weight:1.0 }
  ],
  science_5_8: [
    { code:'SP1', label:'Life · Earth · Physical (Part 1)', desc:'First half of science content',                    minutes:45, extMin:54,  items:20, weight:0.5 },
    { code:'SP2', label:'Life · Earth · Physical (Part 2)', desc:'Second half · may include performance task',       minutes:45, extMin:54,  items:20, weight:0.5 }
  ],
  ss: [
    { code:'SP1', label:'History & Geography',         desc:'Tennessee state history, US history, geography',       minutes:45, extMin:54,  items:22, weight:0.5 },
    { code:'SP2', label:'Civics · Economics · Sources',desc:'Primary source analysis, civics, economics',           minutes:45, extMin:54,  items:22, weight:0.5 }
  ],
  /* HS EOC blueprints (PRD §5.6.4) — preliminary numbers based on TN DOE
     2024-25 published EOC blueprints; must be re-validated against the
     2025-26 release before pilot. Each EOC course is 3 Subparts, ~180-190
     minutes total, with the writing/calculator-free Subpart locked first.
     courseId keys mirror the AssessmentPackage.scope.courseId enum. */
  algebra_1_eoc: [
    { code:'SP1', label:'Calculator-Free',              desc:'Foundational algebra · calculator disabled',           minutes:65, extMin:78, mustBeFirst:true, calculator:false, items:24, weight:0.34 },
    { code:'SP2', label:'Calculator-Allowed Part 1',    desc:'Multi-step problems · calculator allowed',             minutes:65, extMin:78, calculator:true,  items:24, weight:0.36 },
    { code:'SP3', label:'Calculator-Allowed Part 2',    desc:'Functions, modeling, applications · calculator on',    minutes:50, extMin:60, calculator:true,  items:18, weight:0.30 }
  ],
  geometry_eoc: [
    { code:'SP1', label:'Calculator-Free',              desc:'Formal proofs + foundational geometry · calc off',     minutes:65, extMin:78, mustBeFirst:true, calculator:false, items:22, weight:0.34 },
    { code:'SP2', label:'Calculator-Allowed Part 1',    desc:'Coordinate geometry + similarity · calc on',           minutes:65, extMin:78, calculator:true,  items:22, weight:0.36 },
    { code:'SP3', label:'Calculator-Allowed Part 2',    desc:'Trigonometry + applications · calc on',                minutes:50, extMin:60, calculator:true,  items:18, weight:0.30 }
  ],
  english_1_eoc: [
    { code:'SP1', label:'Writing',                       desc:'Argumentative or analytical (random of 2) · 1 essay', minutes:90, extMin:108, mustBeFirst:true, mustBeSeparate:true, humanGradeOnly:true, items:1, weight:0.30 },
    { code:'SP2', label:'Reading · Literature',          desc:'Reading comprehension · literary passages',           minutes:50, extMin:60,                                       items:20, weight:0.35 },
    { code:'SP3', label:'Reading · Informational + Language', desc:'Informational text + grammar / usage conventions', minutes:50, extMin:60,                                  items:20, weight:0.35 }
  ],
  english_2_eoc: [
    { code:'SP1', label:'Writing',                       desc:'Argumentative or analytical (deeper task than Eng I)', minutes:90, extMin:108, mustBeFirst:true, mustBeSeparate:true, humanGradeOnly:true, items:1, weight:0.30 },
    { code:'SP2', label:'Reading · Literature',          desc:'Extended-text literary analysis',                     minutes:50, extMin:60,                                       items:20, weight:0.35 },
    { code:'SP3', label:'Reading · Informational + Language', desc:'Informational text + grammar / usage conventions', minutes:50, extMin:60,                                  items:20, weight:0.35 }
  ]
};

/* (subject, grade) → EOC courseId resolver. Returns null when the combo is
 * NOT an EOC course (i.e. K-8 Achievement path). Used by tcapBlueprintFor
 * to pick the right Subpart blueprint for HS pilot grades. */
function tcapEocCourseFor(subjectId, grade) {
  if (grade === 9) {
    if (subjectId === 'math') return 'algebra_1_eoc';
    if (subjectId === 'ela')  return 'english_1_eoc';
  }
  if (grade === 10) {
    if (subjectId === 'math') return 'geometry_eoc';
    if (subjectId === 'ela')  return 'english_2_eoc';
  }
  return null;
}
/* Friendly course label for an EOC courseId — used in summary chips and
 * the assessment header. Returns null for non-EOC subjects. */
function tcapEocCourseLabel(subjectId, grade) {
  const id = tcapEocCourseFor(subjectId, grade);
  if (!id) return null;
  return ({
    algebra_1_eoc: 'Algebra I EOC',
    geometry_eoc:  'Geometry EOC',
    english_1_eoc: 'English I EOC',
    english_2_eoc: 'English II EOC'
  })[id] || null;
}

// Returns the Subpart blueprint that applies to a given (subject, grade) combination.
// Handles three branches:
//   - HS EOC (G9-10 ELA/Math) → routes to the courseId-keyed blueprint
//     (algebra_1_eoc / geometry_eoc / english_1_eoc / english_2_eoc).
//   - Science split: G3-4 single session, G5-8 two sessions.
//   - K-8 Achievement default: falls through to the subject-keyed blueprint.
// Returns [] if the combination is invalid (e.g. SS at G3, Science at G9).
function tcapBlueprintFor(subjectId, grade) {
  const eocId = tcapEocCourseFor(subjectId, grade);
  if (eocId) return TCAP_SUBPART_BLUEPRINT[eocId] || [];
  if (subjectId === 'science') {
    if (grade > 8) return [];
    return grade <= 4 ? TCAP_SUBPART_BLUEPRINT.science_3_4 : TCAP_SUBPART_BLUEPRINT.science_5_8;
  }
  if (subjectId === 'ss' && (grade < 6 || grade > 8)) return [];
  return TCAP_SUBPART_BLUEPRINT[subjectId] || [];
}
function tcapBlueprintTotals(subjectId, grade) {
  const sps = tcapBlueprintFor(subjectId, grade);
  return {
    subparts: sps.length,
    items: sps.reduce((s, sp) => s + sp.items, 0),
    minutes: sps.reduce((s, sp) => s + sp.minutes, 0),
    extMinutes: sps.reduce((s, sp) => s + sp.extMin, 0)
  };
}

let dwTcap = { grade:5, subjects:['ela'], mode:'diagnostic', length:'full' };
let activeTemplateId = null;

const TEMPLATE_CONFIGS = {
  act: {
    id:'act',
    title:'ACT Practice',
    eyebrow:'Standardized Template · ACT',
    desc:'High-structure template with official section composition, timing, and score report behavior.',
    complexity:'high',
    launch:'legacyDrawer',
    legacyType:'act',
    chips:['3-section composite','Optional Science','Score report']
  },
  tcap: {
    id:'tcap',
    title:'TCAP Diagnostic',
    eyebrow:'Standardized Template · Tennessee',
    desc:'Grade-aware state diagnostic with performance-level prediction, cut-score reporting, and practice plan output.',
    complexity:'high',
    launch:'legacyDrawer',
    legacyType:'tcap',
    chips:['Grade required','Scale score','Practice plan']
  },
  sat: {
    id:'sat',
    title:'Digital SAT Practice',
    eyebrow:'Standardized Template · SAT',
    desc:'High-structure template with Reading & Writing and Math modules, adaptive routing, timing, and score report behavior.',
    complexity:'high',
    outputPage:'sat',
    fields:[
      { id:'module', label:'Module structure', options:['Full adaptive test','Reading & Writing only','Math only','Custom modules'] },
      { id:'length', label:'Length', options:['Full length','Short practice','Skill benchmark'] },
      { id:'routing', label:'Routing', options:['Adaptive module 2','Fixed modules','Teacher selected'] },
      { id:'report', label:'Report output', options:['Score prediction','Domain report','Practice plan'] }
    ],
    chips:['Adaptive modules','Domain scores','Practice plan'],
    preview:'The shared workspace can carry SAT-specific module setup without creating a separate SAT modal.'
  },
  'quick-test': {
    id:'quick-test',
    title:'Quick Test',
    desc:'Fastest path for a focused quiz. Use defaults, then refine in the editor.',
    complexity:'low',
    outputPage:'generic',
    chips:['10 questions','Untimed','Auto-draft']
  },
  'upload-materials': {
    id:'upload-materials',
    title:'Upload Materials',
    desc:'Create from documents, slides, images, or lesson notes without leaving the homepage.',
    complexity:'medium',
    outputPage:'generic',
    fields:[
      { id:'source', label:'Source type', options:['PDF / Doc','Slides','Images','Mixed files'] },
      { id:'goal', label:'Assessment goal', options:['Reading check','Exit ticket','Unit review','Diagnostic'] },
      { id:'length', label:'Length', options:['Short · 8 items','Medium · 15 items','Long · 25 items'] },
      { id:'grading', label:'Grading', options:['Auto-grade only','Mixed auto + manual','Teacher review first'] }
    ],
    preview:'AI will extract core concepts, draft questions, and open the shared Assessment Editor for review.'
  },
  'upload-existing': {
    id:'upload-existing',
    title:'Upload Existing Exam',
    desc:'Digitize an existing assessment and preserve its original structure.',
    complexity:'medium',
    outputPage:'generic',
    fields:[
      { id:'format', label:'Input format', options:['PDF','Word','Excel / CSV','Scanned images'] },
      { id:'structure', label:'Keep structure', options:['Preserve sections','Auto-detect sections','Single section'] },
      { id:'answers', label:'Answer key', options:['Detect from file','Upload separately','Add later'] },
      { id:'rubric', label:'Rubric', options:['Auto-detect','Use Kira default','Add later'] }
    ],
    preview:'Kira will parse questions, choices, answer keys, and scoring rules before opening the editor.'
  },
  'course-lessons': {
    id:'course-lessons',
    title:'Course & Lessons',
    desc:'Generate from Kira course content and keep alignment visible from the start.',
    complexity:'medium',
    outputPage:'generic',
    fields:[
      { id:'course', label:'Course scope', options:['Current unit','Selected lessons','Full module','Custom range'] },
      { id:'coverage', label:'Coverage', options:['Core concepts','Standards gaps','Vocabulary','Mixed'] },
      { id:'difficulty', label:'Difficulty', options:['Balanced','Foundational','Challenge','Adaptive'] },
      { id:'length', label:'Length', options:['10 items','15 items','25 items','Custom'] }
    ],
    preview:'The editor will open with lesson-linked questions and compact tagging summaries.'
  },
  'timed-exam': {
    id:'timed-exam',
    title:'Timed Exam',
    desc:'Formal assessment shell with timing, sections, and release rules.',
    complexity:'medium',
    outputPage:'generic',
    fields:[
      { id:'duration', label:'Duration', options:['30 min','45 min','60 min','Custom'] },
      { id:'sections', label:'Sections', options:['Single section','ELA + Math','Reading + Writing','Custom sections'] },
      { id:'delivery', label:'Delivery', options:['Student-paced','Teacher-paced','Locked window'] },
      { id:'release', label:'Release rule', options:['Immediate','After teacher review','Scheduled'] }
    ],
    preview:'Use this when test conditions matter more than a standardized exam blueprint.'
  }
};

function tcapGradeLabel(g) {
  const n = parseInt(g, 10);
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  const suf = s[(v - 20) % 10] || s[v] || s[0];
  return `${n}${suf} grade`;
}

// Returns the grade list available for the given subject id, honoring DW_TCAP_CONFIG.subjects[i].gradeRange.
// Falls back to DW_TCAP_CONFIG.grades when no range is declared.
function tcapGradesForSubject(subjectId) {
  const subj = DW_TCAP_CONFIG.subjects.find(s => s.id === subjectId);
  if (!subj || !subj.gradeRange) return DW_TCAP_CONFIG.grades.slice();
  const [lo, hi] = subj.gradeRange;
  return DW_TCAP_CONFIG.grades.filter(g => g >= lo && g <= hi);
}
// Snap grade to the nearest valid grade for a subject (used when switching subjects).
function tcapSnapGradeToSubject(grade, subjectId) {
  const grades = tcapGradesForSubject(subjectId);
  if (grades.includes(grade)) return grade;
  return grades.reduce((best, g) => Math.abs(g - grade) < Math.abs(best - grade) ? g : best, grades[0]);
}
function dwTcapSelectGrade(v) {
  dwTcap.grade = parseInt(v,10);
  dwTcapRefreshBlueprint();
  dwTcapUpdateSummary();
}

// Re-render the Subpart blueprint card after grade/subject change. Safe no-op
// if the blueprint slot isn't on the page yet (e.g. drawer not open).
function dwTcapRefreshBlueprint() {
  const slot = document.getElementById('dwTcapBlueprintField');
  if (slot) slot.innerHTML = renderTcapBlueprintBlock();
}

// Renders the read-only "what subparts will be created" preview that lives
// inside the TCAP creation drawer. The whole block is redrawn whenever the
// teacher changes grade or subject, so the preview always matches the current
// selection. The footer summary line + total badges are computed from
// tcapBlueprintTotals().
function renderTcapBlueprintBlock() {
  const subjectId = dwTcap.subjects[0];
  const subjectMeta = DW_TCAP_CONFIG.subjects.find(s => s.id === subjectId) || DW_TCAP_CONFIG.subjects[0];
  const sps = tcapBlueprintFor(subjectId, dwTcap.grade);
  const totals = tcapBlueprintTotals(subjectId, dwTcap.grade);
  if (!sps.length) {
    return `<div style="font-size:12px;color:#71717a;padding:12px;background:#fafafa;border:1px dashed #e4e4e7;border-radius:10px;text-align:center">No Subpart blueprint available for this grade × subject combination.</div>`;
  }
  const sessionWord = sps.length === 1 ? 'session' : 'independent sessions';
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <span class="dw-label" style="margin:0">Subpart Schedule <span style="font-weight:500;color:#71717a;font-size:11px;margin-left:4px">(read-only · TDOE blueprint)</span></span>
      <span style="font-size:10px;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;padding:2px 7px;border-radius:999px;font-weight:700;letter-spacing:.3px;text-transform:uppercase">${sps.length} ${sessionWord}</span>
    </div>
    <div style="font-size:11px;color:#71717a;line-height:1.45;margin:-2px 0 10px">
      Each Subpart is a separate session you can schedule independently. The number of Subparts and their time limits are fixed by the state — you can swap items inside a Subpart, but you cannot change segments or duration.
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${sps.map((sp, i) => {
        const tags = [];
        if (sp.mustBeFirst)     tags.push({ label:'Must be 1st', color:'#b91c1c', bg:'#fef2f2', border:'#fecaca' });
        if (sp.mustBeSeparate)  tags.push({ label:'Separate session', color:'#b91c1c', bg:'#fef2f2', border:'#fecaca' });
        if (sp.calculator===false) tags.push({ label:'No calculator', color:'#b45309', bg:'#fffbeb', border:'#fde68a' });
        if (sp.calculator===true)  tags.push({ label:'Calculator OK', color:'#0369a1', bg:'#eff6ff', border:'#bfdbfe' });
        if (sp.humanGradeOnly)  tags.push({ label:'Human review only', color:'#5b21b6', bg:'#f5f3ff', border:'#ddd6fe' });
        return `
        <div style="display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:11px 13px;border:1px solid #e4e4e7;border-radius:10px;background:#fff">
          <div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;background:#f5f3ff;color:#5b21b6;font-size:11px;font-weight:800;letter-spacing:.3px">${sp.code}</div>
          <div style="min-width:0">
            <div style="font-size:13px;font-weight:700;color:#18181b;margin-bottom:2px">${sp.label}</div>
            <div style="font-size:11px;color:#71717a;line-height:1.4">${sp.desc}</div>
            ${tags.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:5px">${tags.map(t => `<span style="font-size:9.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:${t.color};background:${t.bg};border:1px solid ${t.border};padding:1px 6px;border-radius:999px">${t.label}</span>`).join('')}</div>` : ''}
          </div>
          <div style="text-align:right;white-space:nowrap">
            <div style="font-size:14px;font-weight:800;color:#18181b">${sp.minutes} min</div>
            <div style="font-size:10px;color:#71717a;font-weight:600">+ext ${sp.extMin} min</div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:10px 12px;background:#f9fafb;border:1px solid #e4e4e7;border-radius:10px;font-size:12px">
      <div><span style="color:#71717a">Total testing time</span> <b style="color:#18181b;margin-left:4px">${totals.minutes} min</b> <span style="color:#71717a;margin-left:8px">·</span> <span style="color:#71717a;margin-left:4px">with ext-time (×1.2)</span> <b style="color:#18181b;margin-left:4px">${totals.extMinutes} min</b></div>
      <div style="font-size:11px;color:#5b21b6;font-weight:700">Grade ${dwTcap.grade} ${subjectMeta.label}</div>
    </div>
  `;
}
function dwTcapSelectGradeBtn(btn, g) {
  dwTcap.grade = g;
  btn.parentElement.querySelectorAll('.dw-grade-btn').forEach(b => {
    b.classList.remove('active');
    b.style.background = '#fff';
    b.style.color = '#3f3f46';
  });
  btn.classList.add('active');
  btn.style.background = '#6040ca';
  btn.style.color = '#fff';
  dwTcapUpdateSummary();
}
function dwTcapToggleSubject(id, btn) {
  dwTcap.subjects = [id];
  // Snap grade into the new subject's allowed range (e.g. switching to Social Studies clamps G3 → G6).
  dwTcap.grade = tcapSnapGradeToSubject(dwTcap.grade, id);
  btn.parentElement.querySelectorAll('.dw-subj-btn').forEach(b => {
    const subjectId = b.dataset.tcapSubject;
    const active = subjectId === id;
    const indicator = b.querySelector('.dw-subj-indicator');
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
    b.style.borderColor = active ? '#6040ca' : '#e4e4e7';
    b.style.background = active ? '#f5f3ff' : '#fff';
    if (indicator) {
      indicator.style.borderColor = active ? '#6040ca' : '#d4d4d8';
      indicator.style.background = active ? '#6040ca' : '#fff';
      indicator.style.boxShadow = active ? 'inset 0 0 0 3px #fff' : 'none';
    }
  });
  // Re-render the grade <select> options to match the new subject's gradeRange.
  const gradeSelect = document.querySelector('.dw-grade-select');
  if (gradeSelect) {
    const grades = tcapGradesForSubject(id);
    gradeSelect.innerHTML = grades.map(g => `<option value="${g}" ${g===dwTcap.grade?'selected':''}>${tcapGradeLabel(g)}</option>`).join('');
  }
  dwTcapRefreshBlueprint();
  dwTcapUpdateSummary();
}
function dwTcapSelectMode(id, card) {
  dwTcap.mode = id;
  card.parentElement.querySelectorAll('.dw-radio-card').forEach(c => {
    c.classList.remove('active');
    c.style.borderColor = '#e4e4e7';
    c.style.background = '#fff';
  });
  card.classList.add('active');
  card.style.borderColor = '#6040ca';
  card.style.background = '#f5f3ff';
  dwTcapUpdateSummary();
}
function dwTcapSelectLength(id, card) {
  dwTcap.length = id;
  card.parentElement.querySelectorAll('.dw-radio-card').forEach(c => {
    c.classList.remove('active');
    c.style.borderColor = '#e4e4e7';
    c.style.background = '#fff';
  });
  card.classList.add('active');
  card.style.borderColor = '#6040ca';
  card.style.background = '#f5f3ff';
  dwTcapUpdateSummary();
}
function dwTcapUpdateSummary() {
  const subjectObj = DW_TCAP_CONFIG.subjects.find(s => s.id === dwTcap.subjects[0]) || DW_TCAP_CONFIG.subjects[0];
  const modeObj = DW_TCAP_CONFIG.modes.find(m => m.id === dwTcap.mode) || DW_TCAP_CONFIG.modes[0];
  // Item count and time read straight from the locked TDOE blueprint —
  // there is no longer a teacher-selectable Length picker; the previous
  // Short/Full choice contradicted the blueprint and was display-only.
  const totals = tcapBlueprintTotals(subjectObj.id, dwTcap.grade);
  const totalItems = totals.items;
  const totalTime = totals.minutes;
  const gradeSpan = `Grade ${dwTcap.grade}`;
  const subjSpan = subjectObj.label;
  const modeLabel = modeObj.label;
  // HS EOC tail — when the (subject, grade) combo resolves to an EOC course
  // the assessment is actually Algebra I / Geometry / English I / English II
  // EOC, not generic "ELA G9". Surface the course label so the teacher knows
  // which test will be created (cut scores, blueprint, and standards mapping
  // all key off the EOC courseId, not the subject+grade combo).
  const eocLabel = tcapEocCourseLabel(subjectObj.id, dwTcap.grade);
  const eocTail  = eocLabel ? ` <span style="color:#5b21b6;font-weight:700">→ ${eocLabel}</span>` : '';
  const eocFootTail = eocLabel ? ` → ${eocLabel}` : '';
  const sum = document.getElementById('dwTcapSummary');
  if (sum) sum.innerHTML = `<strong>${gradeSpan} ${subjSpan}</strong>${eocTail} · ${modeLabel} · <strong>${totalItems} items</strong> · ~${totalTime} min<br><span style="color:#71717a;font-weight:500">One TCAP assessment is created per subject. Create Math separately if needed.</span>`;
  const foot = document.getElementById('drawerFooterBar');
  if (foot) foot.innerHTML = `<span style="color:#3d2c5a">${gradeSpan} ${subjSpan}${eocFootTail} · ${modeLabel} · ${totalItems} items · ~${totalTime} min</span>`;
  const generateBtn = document.getElementById('dwBtnGenerate');
  if (generateBtn) generateBtn.textContent = `Create TCAP ${modeLabel}`;
}

function tcapSetupMetrics() {
  const modeObj = DW_TCAP_CONFIG.modes.find(m => m.id === dwTcap.mode) || DW_TCAP_CONFIG.modes[0];
  const selectedSubjects = DW_TCAP_CONFIG.subjects.filter(s => dwTcap.subjects.includes(s.id));
  // Pull totals from the locked TDOE blueprint instead of the removed
  // Length picker. Falls back to the primary subject when several are
  // selected (legacy multi-subject path; current pilot enforces one).
  const primarySubjectId = (selectedSubjects[0] && selectedSubjects[0].id) || dwTcap.subjects[0];
  const totals = tcapBlueprintTotals(primarySubjectId, dwTcap.grade);
  return { modeObj, selectedSubjects, totalItems: totals.items, totalTime: totals.minutes };
}

function tcapCleanModeLabel(label) {
  return String(label || '').replace(/^[^\w]+/u, '').trim();
}

function openTemplateLauncher(templateId) {
  const cfg = TEMPLATE_CONFIGS[templateId];
  if (!cfg) return;
  activeTemplateId = templateId;
  closeTemplateQuick();
  closeTemplateInline();
  closeDrawer();

  if (cfg.launch === 'legacyDrawer') {
    openDrawer(cfg.legacyType || templateId);
    return;
  }
  if (cfg.complexity === 'low') {
    openTemplateQuick(templateId);
    return;
  }
  if (cfg.complexity === 'medium') {
    openTemplateInline(templateId);
    return;
  }
  openTemplateSetup(templateId);
}

function openTemplateSetup(templateId) {
  const cfg = TEMPLATE_CONFIGS[templateId];
  if (!cfg) return;
  if (templateId === 'tcap') {
    closeTemplateSetup();
    openDrawer('tcap');
    return;
  }
  activeTemplateId = templateId;
  currentDrawerType = templateId;
  if (templateId === 'tcap') dwTcap = { grade:5, subjects:['ela'], mode:'diagnostic', length:'full' };
  document.getElementById('tsEyebrow').textContent = cfg.eyebrow || 'Template Configure Workspace';
  document.getElementById('tsTitle').textContent = `Configure ${cfg.title}`;
  document.getElementById('tsDesc').textContent = cfg.desc || 'Use the shared configuration workspace for templates that need structured setup before generation.';
  renderTemplateSetup();
  document.getElementById('templateSetupOverlay').classList.add('open');
}

function closeTemplateSetup() {
  const overlay = document.getElementById('templateSetupOverlay');
  if (overlay) overlay.classList.remove('open');
}

function closeTemplateQuick() {
  const panel = document.getElementById('templateQuickPanel');
  if (panel) panel.classList.remove('open');
}

function closeTemplateInline() {
  const panel = document.getElementById('templateInlinePanel');
  if (panel) {
    panel.classList.remove('open');
    panel.innerHTML = '';
  }
}

function openTemplateQuick(templateId) {
  const cfg = TEMPLATE_CONFIGS[templateId];
  const panel = document.getElementById('templateQuickPanel');
  if (!cfg || !panel) return;
  panel.innerHTML = `
    <div class="tl-quick-body">
      <div>
        <div class="tl-quick-title">${cfg.title}</div>
        <div class="tl-quick-sub">${cfg.desc}</div>
        <div class="tl-chip-row">${(cfg.chips || []).map(c => `<span class="tl-chip">${c}</span>`).join('')}</div>
      </div>
      <div class="tl-quick-actions">
        <button class="ts-secondary" onclick="closeTemplateQuick()">Cancel</button>
        <button class="ts-primary" onclick="templateLauncherGenerate('${templateId}')">Create</button>
      </div>
    </div>`;
  panel.classList.add('open');
}

function openTemplateInline(templateId) {
  const cfg = TEMPLATE_CONFIGS[templateId];
  const panel = document.getElementById('templateInlinePanel');
  if (!cfg || !panel) return;
  panel.innerHTML = `
    <div class="tl-inline-head">
      <div>
        <div class="tl-inline-title">${cfg.title}</div>
        <div class="tl-inline-sub">${cfg.desc}</div>
      </div>
      <button class="ts-close" onclick="closeTemplateInline()" aria-label="Close">×</button>
    </div>
    <div class="tl-inline-body">
      <div class="tl-field-grid">
        ${(cfg.fields || []).map(f => `<div class="tl-field">
          <label>${f.label}</label>
          <select>${(f.options || []).map(o => `<option>${o}</option>`).join('')}</select>
        </div>`).join('')}
      </div>
      <div class="tl-mini-preview">
        <strong>Launcher rule:</strong> medium templates stay inline on the homepage. ${cfg.preview || ''}
      </div>
    </div>
    <div class="tl-inline-actions">
      <button class="ts-secondary" onclick="closeTemplateInline()">Cancel</button>
      <button class="ts-primary" onclick="templateLauncherGenerate('${templateId}')">Create Assessment</button>
    </div>`;
  panel.classList.add('open');
  panel.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function renderTemplateSetup() {
  const body = document.getElementById('templateSetupBody');
  if (!body) return;
  if (activeTemplateId !== 'tcap') {
    renderGenericTemplateSetup();
    return;
  }
  const { modeObj, selectedSubjects, totalItems, totalTime } = tcapSetupMetrics();
  const subjectLabel = selectedSubjects.map(s => s.label).join(' + ');
  body.innerHTML = `
    <div class="ts-panel ts-config">
      <div style="padding:10px 12px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;font-size:11px;color:#5b21b6;line-height:1.5">
        <strong>Pilot:</strong> TCAP Achievement G3–8 (Social Studies G6–8) + 4 EOC courses for G9–10.
      </div>
      <div>
        <div class="ts-section-head">
          <div class="ts-section-title">Grade Level</div>
          <div class="ts-section-note">Required for TCAP cut scores and standards</div>
        </div>
        <div class="ts-grade-grid">
          ${tcapGradesForSubject(dwTcap.subjects[0]).map(g => `<button class="ts-grade-btn ${dwTcap.grade===g?'active':''}" onclick="tsTcapSelectGrade(${g})">${g}</button>`).join('')}
        </div>
      </div>

      <div>
        <div class="ts-section-head">
          <div class="ts-section-title">Subject</div>
          <div class="ts-section-note">Choose one subject per TCAP diagnostic</div>
        </div>
        <div class="ts-card-grid">
          ${DW_TCAP_CONFIG.subjects.map(s => `<button class="ts-option-card ${dwTcap.subjects.includes(s.id)?'active':''}" onclick="tsTcapToggleSubject('${s.id}')">
            <div class="name">${s.label}</div>
            <div class="meta">${s.desc}</div>
          </button>`).join('')}
        </div>
      </div>

      <!-- Assessment Mode selector removed — pilot ships with Diagnostic
           only (see DW_TCAP_CONFIG.modes comment). The summary card and
           assessment title still surface "Diagnostic" as the product label,
           the picker just doesn't ask the teacher to choose. -->

      <div>
        <div class="ts-section-head">
          <div class="ts-section-title">Subpart Schedule <span style="font-size:11px;color:#71717a;font-weight:500;margin-left:4px">read-only · TDOE blueprint</span></div>
          <div class="ts-section-note">Each Subpart = 1 independent session. Number of Subparts and time limits are fixed.</div>
        </div>
        ${renderTcapBlueprintBlock()}
      </div>

      <!-- "Length per Subpart" picker removed for pilot — TDOE locks both
           item count and time per Subpart inside TCAP_SUBPART_BLUEPRINT.
           The previous Short/Full options were display-only fiction that
           contradicted the blueprint shown directly above. Real totals are
           rendered from tcapBlueprintTotals() in the Setup Summary card to
           the right and in the Subpart Schedule block above. -->
    </div>

    <div class="ts-side">
      <div class="ts-panel ts-summary-card">
        <div class="ts-summary-title">Setup Summary</div>
        <div class="ts-metric-grid">
          <div class="ts-metric"><div class="val">${totalItems}</div><div class="label">Total items</div></div>
          <div class="ts-metric"><div class="val">~${totalTime}</div><div class="label">Minutes</div></div>
        </div>
        <div class="ts-summary-line"><strong>Grade ${dwTcap.grade}</strong> · ${subjectLabel}${(() => { const eoc = tcapEocCourseLabel(selectedSubjects[0]?.id, dwTcap.grade); return eoc ? ` <span style="color:#5b21b6;font-weight:700">→ ${eoc}</span>` : ''; })()} · ${tcapCleanModeLabel(modeObj.label)} · TDOE blueprint</div>
        <div class="ts-summary-line">Outputs: TCAP scale score, 4-level prediction, standards gaps, and personalized practice path.</div>
        <div class="ts-summary-line">Teacher can optionally check AI suggested skills later in <strong>Review Skills</strong>, not inside this setup step.</div>
      </div>

      <div class="ts-panel ts-preview-card">
        <div class="ts-summary-title">What Teachers Get</div>
        <div class="ts-preview-report">
          <div class="ts-preview-top">
            <div class="small">Student report preview</div>
            <div class="big">Predicted TCAP Level</div>
          </div>
          <div class="ts-level-row">
            <div class="ts-level">Below<br>Basic</div>
            <div class="ts-level active">Approaching</div>
            <div class="ts-level">Proficient</div>
            <div class="ts-level">Above<br>Proficient</div>
          </div>
          <div class="ts-practice-preview">
            <div class="ts-practice-row"><span>Razor's Edge students</span><strong>Auto-flagged</strong></div>
            <div class="ts-practice-row"><span>Practice plan</span><strong>Generated after diagnostic</strong></div>
            <div class="ts-practice-row"><span>Board-ready evidence</span><strong>Proficiency view</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
  const footer = document.getElementById('templateSetupFooterSummary');
  if (footer) footer.innerHTML = `<strong>Grade ${dwTcap.grade}</strong> · ${subjectLabel} · <strong>${totalItems} items</strong> · ~${totalTime} min`;
}

function tsTcapSelectGrade(g) {
  dwTcap.grade = g;
  renderTemplateSetup();
}

function tsTcapToggleSubject(id) {
  dwTcap.subjects = [id];
  // Snap grade into the new subject's allowed range (Social Studies → G6–8 only)
  dwTcap.grade = tcapSnapGradeToSubject(dwTcap.grade, id);
  renderTemplateSetup();
}

function tsTcapSelectMode(id) {
  dwTcap.mode = id;
  renderTemplateSetup();
}

function tsTcapSelectLength(id) {
  dwTcap.length = id;
  renderTemplateSetup();
}

function templateSetupGenerate() {
  if (!activeTemplateId) return;
  currentDrawerType = activeTemplateId;
  closeTemplateSetup();
  templateLauncherGenerate(activeTemplateId);
}

function renderGenericTemplateSetup() {
  const cfg = TEMPLATE_CONFIGS[activeTemplateId];
  const body = document.getElementById('templateSetupBody');
  if (!cfg || !body) return;
  body.innerHTML = `
    <div class="ts-panel ts-config">
      <div class="ts-section-head">
        <div>
          <div class="ts-section-title">${cfg.title} configuration</div>
          <div class="ts-section-note">Shared workspace layout driven by template metadata.</div>
        </div>
      </div>
      <div class="tl-field-grid">
        ${(cfg.fields || []).map(f => `<div class="tl-field">
          <label>${f.label}</label>
          <select>${(f.options || []).map(o => `<option>${o}</option>`).join('')}</select>
        </div>`).join('')}
      </div>
    </div>
    <div class="ts-side">
      <div class="ts-panel ts-summary-card">
        <div class="ts-summary-title">Setup Summary</div>
        <div class="ts-summary-line">${cfg.desc}</div>
        <div class="ts-summary-line">${(cfg.chips || []).join(' · ') || 'Shared editor output'}</div>
      </div>
      <div class="ts-panel ts-preview-card">
        <div class="ts-summary-title">Teacher Preview</div>
        <div class="tl-mini-preview">${cfg.preview || 'The generated assessment opens in the shared Assessment Editor for review.'}</div>
      </div>
    </div>`;
  const footer = document.getElementById('templateSetupFooterSummary');
  if (footer) footer.innerHTML = `<strong>${cfg.title}</strong> · Shared configure workspace`;
}

function templateLauncherGenerate(templateId) {
  const cfg = TEMPLATE_CONFIGS[templateId];
  if (!cfg) return;
  closeTemplateQuick();
  closeTemplateInline();
  if (templateId === 'tcap') {
    currentDrawerType = 'tcap';
    drawerGenerate();
    return;
  }
  const overlay = document.createElement('div');
  overlay.className = 'ai-gen-overlay';
  overlay.innerHTML = `
    <div class="ai-gen-modal">
      <h3>✦ Creating ${cfg.title}</h3>
      <p class="ai-gen-sub">Using the unified Template Launcher path</p>
      <div class="ai-gen-progress"><div class="ai-gen-progress-bar" style="width:100%"></div></div>
      <div class="ai-gen-steps">
        <div class="ai-gen-step active"><span class="step-icon">✓</span><span>Template selected · ${cfg.complexity} interaction</span></div>
        <div class="ai-gen-step active"><span class="step-icon">✓</span><span>Applying defaults and opening shared editor</span></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.remove();
    nav(cfg.outputPage || 'generic');
  }, 900);
}

