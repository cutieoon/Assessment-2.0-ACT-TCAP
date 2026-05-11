// @ts-nocheck
// Phase-2 slice: lines 2349-2639 of original src/app.ts

// ═══════ TCAP PROFILE — predictive scoring + cut scores ═══════
// NOTE: Cut score ranges below are MOCK (to be replaced with TN DOE published values during pilot).
// TCAP reports use **scale scores** (not raw %) — typical range ~300-450. Cut scores are scale-score
// boundaries that map performance to 4 levels. Structure follows the Grader-Redesign ScoringAdapter
// pattern used by STAAR/ACT.
const TCAP_PROFILE = {
  // ⚠️ User-visible labels follow Tennessee TDOE official terminology
  // (Below / Approaching / On Track / Mastered) — what every TN teacher
  // sees on real TCAP score reports each year. Internal IDs keep the
  // legacy `belowBasic` / `aboveProficient` shape to avoid breaking
  // every consumer of the cut-score map; only labels change.
  performanceLevels: [
    { id:'belowBasic',      label:'Below',         shortLabel:'B',  color:'#dc2626', bg:'#fef2f2', border:'#fecaca', index:0 },
    { id:'approaching',     label:'Approaching',   shortLabel:'AP', color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', index:1 },
    { id:'proficient',      label:'On Track',      shortLabel:'OT', color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe', index:2 },
    { id:'aboveProficient', label:'Mastered',      shortLabel:'M',  color:'#16a34a', bg:'#ecfdf5', border:'#a7f3d0', index:3 }
  ],
  // Scale-score domain used by all TCAP reports in this prototype (TDOE ~300-450 range).
  scaleRange: { min:300, max:450 },
  // cutScores[gradeKey] = { belowBasic:[lo,hi], approaching:[lo,hi], ... } — **scale score** bands.
  // Editable on the Admin Cut Score Config page; runtime state is TCAP_CUT_STATE.
  // Generated from per-subject baseline cut points (calibrated to G5) with a
  // small per-grade offset (+1 scale point per grade above G5). All 21 valid
  // combinations are pre-populated: ELA/Math/Science = G3-8, Social Studies = G6-8.
  defaultCutScores: (function () {
    // Baseline (G5) cut-score start values per subject: [approaching, proficient, aboveProficient]
    const baselines = {
      ela:     [340, 360, 400],
      math:    [337, 356, 396],
      science: [338, 358, 398],
      ss:      [339, 359, 399]
    };
    const subjects = [
      { id:'ela',     gradeRange:[3,8] },
      { id:'math',    gradeRange:[3,8] },
      { id:'science', gradeRange:[3,8] },
      { id:'ss',      gradeRange:[6,8] }
    ];
    const out = {};
    subjects.forEach(({ id, gradeRange }) => {
      for (let g = gradeRange[0]; g <= gradeRange[1]; g++) {
        const offset = g - 5;
        const [a, p, m] = baselines[id].map(v => v + offset);
        out[`g${g}_${id}`] = {
          belowBasic:      [300, a - 1],
          approaching:     [a, p - 1],
          proficient:      [p, m - 1],
          aboveProficient: [m, 450]
        };
      }
    });
    return out;
  })(),
  // Reporting categories (TN-aligned; trimmed to the standards most visible in TCAP blueprints)
  standardsMap: {
    'g5_ela': [
      { code:'RL.5.1',  name:'Key Ideas — Textual Evidence',        category:'Reading Literature' },
      { code:'RL.5.2',  name:'Theme & Summary',                     category:'Reading Literature' },
      { code:'RI.5.3',  name:'Connections in Informational Texts',  category:'Reading Informational' },
      { code:'RI.5.6',  name:'Point of View & Purpose',             category:'Reading Informational' },
      { code:'L.5.4',   name:'Vocabulary in Context',               category:'Language' },
      { code:'L.5.5',   name:'Figurative Language',                 category:'Language' },
      { code:'W.5.2',   name:'Informative Writing',                 category:'Writing' }
    ],
    'g5_math': [
      { code:'OA.5.1',  name:'Order of Operations',                 category:'Operations & Algebraic Thinking' },
      { code:'NBT.5.3', name:'Read/Write Decimals',                 category:'Number & Operations in Base Ten' },
      { code:'NBT.5.7', name:'Decimal Arithmetic',                  category:'Number & Operations in Base Ten' },
      { code:'NF.5.1',  name:'Fraction Addition/Subtraction',       category:'Number & Operations – Fractions' },
      { code:'NF.5.4',  name:'Fraction Multiplication',             category:'Number & Operations – Fractions' },
      { code:'MD.5.5',  name:'Volume of Rectangular Prisms',        category:'Measurement & Data' },
      { code:'G.5.3',   name:'Classify 2-D Figures',                category:'Geometry' }
    ],
    // Science / Social Studies standards — TN state code stems mirror the
    // public TN academic standards documents (PS / LS / ESS / SSP).
    'g3_sci': [
      { code:'3.PS1.1', name:'Forces & Motion of Objects',          category:'Physical Science' },
      { code:'3.LS1.1', name:'Plant & Animal Life Cycles',          category:'Life Science' },
      { code:'3.LS3.1', name:'Inherited Traits',                    category:'Life Science' },
      { code:'3.ESS2.1',name:'Weather Patterns Over Time',          category:'Earth & Space Science' },
      { code:'3.ETS1.1',name:'Define Engineering Problems',         category:'Engineering Design' },
    ],
    'g7_sci': [
      { code:'7.PS1.2', name:'Chemical Reactions',                  category:'Physical Science' },
      { code:'7.LS1.4', name:'Energy in Ecosystems',                category:'Life Science' },
      { code:'7.LS2.5', name:'Population Dynamics',                 category:'Life Science' },
      { code:'7.ESS2.4',name:'Cycling of Earth Materials',          category:'Earth & Space Science' },
      { code:'7.ETS2.1',name:'Engineering & Society',               category:'Engineering Design' },
    ],
    'g7_ss': [
      { code:'7.21',    name:'Tennessee Statehood (1796)',          category:'TN History' },
      { code:'7.32',    name:'Civil War & Reconstruction',          category:'TN History' },
      { code:'7.45',    name:'Tennessee Geographic Regions',        category:'Geography' },
      { code:'7.51',    name:'Three Branches of TN Government',     category:'Civics' },
      { code:'7.62',    name:'Supply, Demand, and Markets',         category:'Economics' },
    ],
  },
  // Weights used by TCAPScoringAdapter.predict(); sum should equal 1.
  predictiveWeights: { priorAccuracy:0.50, standardCoverage:0.30, difficultyAdjust:0.20 },
  // Avg scale-score points gained per calibrated practice item — drives "items to next level" estimate.
  scalePointsPerItem: 1.6
};

function tcapKey(grade, subject) { return `g${grade}_${subject}`; }

// Linear map between internal proficiency % (0-100) and TCAP scale score (scaleRange.min-max).
// The predictive engine works in % (like ScoringAdapter); we expose scale score as the user-facing unit.
function tcapPercentToScale(p) {
  const r = TCAP_PROFILE.scaleRange;
  return Math.round(r.min + (p / 100) * (r.max - r.min));
}
function tcapScaleToPercent(s) {
  const r = TCAP_PROFILE.scaleRange;
  const span = r.max - r.min;
  return Math.max(0, Math.min(100, Math.round(((s - r.min) / span) * 100)));
}

// Mutable runtime copy — edited live by the Admin Cut Score Config page (values are scale scores)
let TCAP_CUT_STATE = JSON.parse(JSON.stringify(TCAP_PROFILE.defaultCutScores));

// TCAPScoringAdapter — mirrors Grader-Redesign ScoringAdapter pattern
const TCAPScoringAdapter = {
  getCutScores(gradeKey) {
    return TCAP_CUT_STATE[gradeKey] || TCAP_PROFILE.defaultCutScores[gradeKey];
  },
  // Classify a scale score into a TCAP performance level using the active cut-score bands.
  levelFromScale(scaleScore, gradeKey) {
    const cuts = this.getCutScores(gradeKey);
    for (const lvl of TCAP_PROFILE.performanceLevels) {
      const band = cuts[lvl.id];
      if (band && scaleScore >= band[0] && scaleScore <= band[1]) return lvl;
    }
    return TCAP_PROFILE.performanceLevels[0];
  },
  // predict(studentStanding) → { percent, scaleScore, level, confidence, gapToNext }
  // gapToNext.scalePointsToNext is the TDOE-aligned unit ("X scale points from Proficient").
  predict(stu, gradeKey) {
    const w = TCAP_PROFILE.predictiveWeights;
    const blended = Math.round(
      stu.priorAccuracy * w.priorAccuracy * 100 +
      stu.standardCoverage * w.standardCoverage * 100 +
      stu.difficultyAdjust * w.difficultyAdjust * 100
    );
    const percent = Math.max(0, Math.min(100, blended));
    const scaleScore = tcapPercentToScale(percent);
    const level = this.levelFromScale(scaleScore, gradeKey);
    const confidence = Math.round(70 + stu.standardCoverage * 25);
    const cuts = this.getCutScores(gradeKey);
    let gapToNext = null;
    if (level.index < 3) {
      const nextLevel = TCAP_PROFILE.performanceLevels[level.index + 1];
      const nextFloor = cuts[nextLevel.id][0];
      const scalePointsToNext = Math.max(1, nextFloor - scaleScore);
      const itemsToNext = Math.max(3, Math.ceil(scalePointsToNext / TCAP_PROFILE.scalePointsPerItem));
      gapToNext = { nextLevel, scalePointsToNext, itemsToNext, nextCutScore: nextFloor };
    }
    return { percent, scaleScore, level, confidence, gapToNext };
  }
};

// Mock class roster — drives Teacher Class + Student Report pages.
//
// `TCAP_CLASS` is the *active* class. It's `let` so we can swap the active
// pointer whenever the teacher navigates to a different TCAP session. The
// canonical G5 ELA roster below stays as the demo source-of-truth; per-session
// rebrands live in `TCAP_CLASS_BY_SESSION` (built right after this declaration)
// and `setTcapClassForSession()` swaps the pointer on session change so the
// Analytics view never says "Grade 5 ELA" while looking at a Math session.
let TCAP_CLASS_DEFAULT = {
  className: 'Mr. Rivera · Grade 5 ELA · Period 2',
  grade: 5,
  subject: 'ela',
  diagnosticDate: 'Aug 14, 2025',
  students: [
    { id:'s-01', name:'Aaliyah J.',   priorAccuracy:0.82, standardCoverage:0.90, difficultyAdjust:0.78, standards:{ 'RL.5.1':0.90,'RL.5.2':0.82,'RI.5.3':0.75,'RI.5.6':0.70,'L.5.4':0.88,'L.5.5':0.80,'W.5.2':0.72 } },
    { id:'s-02', name:'Benjamin K.',  priorAccuracy:0.68, standardCoverage:0.72, difficultyAdjust:0.60, standards:{ 'RL.5.1':0.72,'RL.5.2':0.60,'RI.5.3':0.55,'RI.5.6':0.62,'L.5.4':0.70,'L.5.5':0.58,'W.5.2':0.64 } },
    { id:'s-03', name:'Carlos M.',    priorAccuracy:0.44, standardCoverage:0.48, difficultyAdjust:0.35, standards:{ 'RL.5.1':0.48,'RL.5.2':0.40,'RI.5.3':0.32,'RI.5.6':0.44,'L.5.4':0.50,'L.5.5':0.42,'W.5.2':0.38 } },
    { id:'s-04', name:'Daniela R.',   priorAccuracy:0.58, standardCoverage:0.62, difficultyAdjust:0.50, standards:{ 'RL.5.1':0.62,'RL.5.2':0.55,'RI.5.3':0.48,'RI.5.6':0.54,'L.5.4':0.66,'L.5.5':0.50,'W.5.2':0.52 } },
    { id:'s-05', name:'Eli W.',       priorAccuracy:0.90, standardCoverage:0.94, difficultyAdjust:0.86, standards:{ 'RL.5.1':0.95,'RL.5.2':0.90,'RI.5.3':0.88,'RI.5.6':0.84,'L.5.4':0.92,'L.5.5':0.86,'W.5.2':0.80 } },
    { id:'s-06', name:'Fatima A.',    priorAccuracy:0.72, standardCoverage:0.74, difficultyAdjust:0.65, standards:{ 'RL.5.1':0.78,'RL.5.2':0.70,'RI.5.3':0.65,'RI.5.6':0.68,'L.5.4':0.76,'L.5.5':0.64,'W.5.2':0.70 } },
    { id:'s-07', name:'Gabriel P.',   priorAccuracy:0.32, standardCoverage:0.40, difficultyAdjust:0.28, standards:{ 'RL.5.1':0.38,'RL.5.2':0.30,'RI.5.3':0.28,'RI.5.6':0.34,'L.5.4':0.42,'L.5.5':0.32,'W.5.2':0.28 } },
    { id:'s-08', name:'Hana S.',      priorAccuracy:0.64, standardCoverage:0.66, difficultyAdjust:0.58, standards:{ 'RL.5.1':0.68,'RL.5.2':0.62,'RI.5.3':0.58,'RI.5.6':0.60,'L.5.4':0.70,'L.5.5':0.58,'W.5.2':0.60 } },
    { id:'s-09', name:'Isaiah T.',    priorAccuracy:0.78, standardCoverage:0.80, difficultyAdjust:0.72, standards:{ 'RL.5.1':0.84,'RL.5.2':0.78,'RI.5.3':0.72,'RI.5.6':0.74,'L.5.4':0.82,'L.5.5':0.74,'W.5.2':0.72 } },
    { id:'s-10', name:'Jamila B.',    priorAccuracy:0.50, standardCoverage:0.54, difficultyAdjust:0.42, standards:{ 'RL.5.1':0.56,'RL.5.2':0.48,'RI.5.3':0.40,'RI.5.6':0.48,'L.5.4':0.58,'L.5.5':0.44,'W.5.2':0.46 } },
    { id:'s-11', name:'Kenji O.',     priorAccuracy:0.86, standardCoverage:0.88, difficultyAdjust:0.82, standards:{ 'RL.5.1':0.90,'RL.5.2':0.88,'RI.5.3':0.82,'RI.5.6':0.80,'L.5.4':0.90,'L.5.5':0.84,'W.5.2':0.78 } },
    { id:'s-12', name:'Leah C.',      priorAccuracy:0.60, standardCoverage:0.64, difficultyAdjust:0.56, standards:{ 'RL.5.1':0.66,'RL.5.2':0.58,'RI.5.3':0.52,'RI.5.6':0.56,'L.5.4':0.68,'L.5.5':0.54,'W.5.2':0.56 } },
    { id:'s-13', name:'Miguel V.',    priorAccuracy:0.38, standardCoverage:0.44, difficultyAdjust:0.30, standards:{ 'RL.5.1':0.44,'RL.5.2':0.36,'RI.5.3':0.32,'RI.5.6':0.38,'L.5.4':0.48,'L.5.5':0.34,'W.5.2':0.32 } },
    { id:'s-14', name:'Nora L.',      priorAccuracy:0.74, standardCoverage:0.76, difficultyAdjust:0.68, standards:{ 'RL.5.1':0.80,'RL.5.2':0.72,'RI.5.3':0.68,'RI.5.6':0.70,'L.5.4':0.78,'L.5.5':0.68,'W.5.2':0.70 } },
    { id:'s-15', name:'Omar H.',      priorAccuracy:0.54, standardCoverage:0.58, difficultyAdjust:0.48, standards:{ 'RL.5.1':0.60,'RL.5.2':0.52,'RI.5.3':0.46,'RI.5.6':0.50,'L.5.4':0.62,'L.5.5':0.48,'W.5.2':0.50 } },
    { id:'s-16', name:'Priya D.',     priorAccuracy:0.92, standardCoverage:0.96, difficultyAdjust:0.90, standards:{ 'RL.5.1':0.96,'RL.5.2':0.94,'RI.5.3':0.90,'RI.5.6':0.88,'L.5.4':0.96,'L.5.5':0.90,'W.5.2':0.86 } },
    { id:'s-17', name:'Quinn E.',     priorAccuracy:0.46, standardCoverage:0.50, difficultyAdjust:0.38, standards:{ 'RL.5.1':0.52,'RL.5.2':0.44,'RI.5.3':0.38,'RI.5.6':0.44,'L.5.4':0.54,'L.5.5':0.40,'W.5.2':0.42 } },
    { id:'s-18', name:'Ravi N.',      priorAccuracy:0.66, standardCoverage:0.70, difficultyAdjust:0.60, standards:{ 'RL.5.1':0.72,'RL.5.2':0.64,'RI.5.3':0.60,'RI.5.6':0.62,'L.5.4':0.72,'L.5.5':0.58,'W.5.2':0.62 } },
    { id:'s-19', name:'Sofia Q.',     priorAccuracy:0.80, standardCoverage:0.84, difficultyAdjust:0.76, standards:{ 'RL.5.1':0.86,'RL.5.2':0.80,'RI.5.3':0.76,'RI.5.6':0.78,'L.5.4':0.84,'L.5.5':0.76,'W.5.2':0.74 } },
    { id:'s-20', name:'Tariq U.',     priorAccuracy:0.42, standardCoverage:0.46, difficultyAdjust:0.34, standards:{ 'RL.5.1':0.48,'RL.5.2':0.40,'RI.5.3':0.34,'RI.5.6':0.40,'L.5.4':0.50,'L.5.5':0.36,'W.5.2':0.38 } },
    { id:'s-21', name:'Uma G.',       priorAccuracy:0.70, standardCoverage:0.72, difficultyAdjust:0.64, standards:{ 'RL.5.1':0.76,'RL.5.2':0.68,'RI.5.3':0.64,'RI.5.6':0.66,'L.5.4':0.74,'L.5.5':0.62,'W.5.2':0.66 } },
    { id:'s-22', name:'Victor Z.',    priorAccuracy:0.56, standardCoverage:0.60, difficultyAdjust:0.50, standards:{ 'RL.5.1':0.62,'RL.5.2':0.54,'RI.5.3':0.48,'RI.5.6':0.52,'L.5.4':0.64,'L.5.5':0.50,'W.5.2':0.52 } },
    { id:'s-23', name:'Willa F.',     priorAccuracy:0.88, standardCoverage:0.90, difficultyAdjust:0.84, standards:{ 'RL.5.1':0.92,'RL.5.2':0.88,'RI.5.3':0.84,'RI.5.6':0.82,'L.5.4':0.92,'L.5.5':0.84,'W.5.2':0.80 } },
    { id:'s-24', name:'Xavier I.',    priorAccuracy:0.36, standardCoverage:0.42, difficultyAdjust:0.28, standards:{ 'RL.5.1':0.42,'RL.5.2':0.34,'RI.5.3':0.30,'RI.5.6':0.36,'L.5.4':0.46,'L.5.5':0.32,'W.5.2':0.30 } },
    { id:'s-25', name:'Yara X.',      priorAccuracy:0.62, standardCoverage:0.66, difficultyAdjust:0.54, standards:{ 'RL.5.1':0.68,'RL.5.2':0.60,'RI.5.3':0.56,'RI.5.6':0.58,'L.5.4':0.68,'L.5.5':0.54,'W.5.2':0.58 } },
    { id:'s-26', name:'Zane Y.',      priorAccuracy:0.76, standardCoverage:0.78, difficultyAdjust:0.70, standards:{ 'RL.5.1':0.82,'RL.5.2':0.74,'RI.5.3':0.70,'RI.5.6':0.72,'L.5.4':0.80,'L.5.5':0.70,'W.5.2':0.70 } },
    { id:'s-27', name:'Amara E.',     priorAccuracy:0.52, standardCoverage:0.56, difficultyAdjust:0.46, standards:{ 'RL.5.1':0.58,'RL.5.2':0.50,'RI.5.3':0.44,'RI.5.6':0.48,'L.5.4':0.60,'L.5.5':0.46,'W.5.2':0.48 } },
    { id:'s-28', name:'Bodhi Y.',     priorAccuracy:0.30, standardCoverage:0.38, difficultyAdjust:0.24, standards:{ 'RL.5.1':0.36,'RL.5.2':0.28,'RI.5.3':0.22,'RI.5.6':0.30,'L.5.4':0.40,'L.5.5':0.26,'W.5.2':0.26 } }
  ],
  // Spotlight student for the Student Diagnostic Report page
  spotlightStudentId: 's-04'
};

// ─── Per-session class rebrand registry ─────────────────────────────────
// Each TCAP session in SESSION_DATA gets a class object with its own grade,
// subject, name, and per-standard accuracy keyed to that grade/subject's
// standards map. We re-use the 28-student demo roster (priorAccuracy /
// standardCoverage / difficultyAdjust stay constant — those are individual
// student traits) and remap the `standards` object to the session's
// standards. The result: a Math session shows G5 Math standards (NF.5.1
// etc.), a Science G7 session shows 7.PS1.2 etc., and the Analytics
// header / heatmap / risk panel never contradict the session being viewed.
//
// Why share students across sessions? In a real district, the same roster
// would NOT take TCAP in 4 different subjects — but for a *prototype*,
// surfacing realistic standards per subject matters more than building 4
// independent rosters of names. The teacher sees consistent class identity
// while the per-subject standards / cut-scores swap correctly.
function _tcapRemapStudents(studentTemplate, gradeKey) {
  const stds = TCAP_PROFILE.standardsMap[gradeKey] || [];
  // Build a deterministic per-standard accuracy from each student's
  // priorAccuracy + difficultyAdjust so different gradeKeys produce
  // distinct (but stable) heatmap shapes. Range stays in [0.18, 0.98].
  return studentTemplate.map((stu, sIdx) => {
    const standards = {};
    stds.forEach((s, idx) => {
      // Mix the student's prior accuracy with a stable per-standard offset
      // (-0.10 to +0.10) so each row has variety without random reseeding.
      const base = stu.priorAccuracy * 0.7 + stu.difficultyAdjust * 0.3;
      const offset = ((idx * 37 + sIdx * 13) % 21 - 10) / 100;
      const acc = Math.max(0.18, Math.min(0.98, +(base + offset).toFixed(2)));
      standards[s.code] = acc;
    });
    return Object.assign({}, stu, { standards });
  });
}
const TCAP_CLASS_BY_SESSION = (function buildClassRegistry () {
  const tmpl = TCAP_CLASS_DEFAULT.students;
  return {
    'sess-tcap-1':         { className:'Mr. Rivera · Grade 5 ELA · Period 2',     grade:5, subject:'ela',     gradeKey:'g5_ela',  diagnosticDate:'Aug 14, 2025' },
    'sess-tcap-math-g5':   { className:'Ms. Chen · Grade 5 Math · Period 3',      grade:5, subject:'math',    gradeKey:'g5_math', diagnosticDate:'Sep 04, 2025' },
    'sess-tcap-sci-g3':    { className:'Mr. Patel · Grade 3 Science · Period 1',  grade:3, subject:'science', gradeKey:'g3_sci',  diagnosticDate:'Sep 12, 2025' },
    'sess-tcap-sci-g7':    { className:'Ms. Okafor · Grade 7 Science · Period 4', grade:7, subject:'science', gradeKey:'g7_sci',  diagnosticDate:'Sep 18, 2025' },
    'sess-tcap-ss-g7':     { className:'Mr. Thompson · Grade 7 SS · Period 5',    grade:7, subject:'ss',      gradeKey:'g7_ss',   diagnosticDate:'Sep 25, 2025' },
  };
})();
// Pretty-print the raw subject id into the form teachers expect to see
// (raw ids `'ela' | 'math' | 'science' | 'ss'` come from cut-score keys
// and can't change without breaking gradeKey lookups).
function tcapSubjectLabel(rawSubject) {
  return ({ ela:'TCAP ELA', math:'TCAP Math', science:'TCAP Science', ss:'TCAP Social Studies' })[rawSubject] || ('TCAP ' + rawSubject);
}
function setTcapClassForSession(sessionId) {
  const meta = TCAP_CLASS_BY_SESSION[sessionId];
  if (!meta) return;  // unknown session — keep current
  TCAP_CLASS = Object.assign({}, meta, {
    students: _tcapRemapStudents(TCAP_CLASS_DEFAULT.students, meta.gradeKey),
    spotlightStudentId: TCAP_CLASS_DEFAULT.spotlightStudentId,
  });
}
// Active pointer — defaults to the canonical G5 ELA class for legacy
// callers that hit `TCAP_CLASS` before any session navigation happens.
let TCAP_CLASS = TCAP_CLASS_DEFAULT;
setTcapClassForSession('sess-tcap-1');

// Class-level aggregate computed on demand
function tcapPredictAll(cls = TCAP_CLASS) {
  const gradeKey = tcapKey(cls.grade, cls.subject);
  return cls.students.map(s => {
    const pred = TCAPScoringAdapter.predict(s, gradeKey);
    return { ...s, pred };
  });
}
function tcapLevelCounts(rows) {
  const counts = { belowBasic:0, approaching:0, proficient:0, aboveProficient:0 };
  rows.forEach(r => { counts[r.pred.level.id]++; });
  return counts;
}
function tcapWeakestStandards(student, topN = 3) {
  const gradeKey = tcapKey(TCAP_CLASS.grade, TCAP_CLASS.subject);
  const stds = TCAP_PROFILE.standardsMap[gradeKey] || [];
  const pairs = stds
    .map(st => ({ ...st, acc: student.standards[st.code] ?? 0.5 }))
    .sort((a,b) => a.acc - b.acc)
    .slice(0, topN);
  return pairs;
}
