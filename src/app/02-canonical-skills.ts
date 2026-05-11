// @ts-nocheck
// Phase-2 slice: lines 1029-1129 of original src/app.ts

// ═══════ CANONICAL SKILL GRAPH (v1 — Reading branch + illustrative others) ═══════
// Single source of truth. Questions tag canonical_skill_ids[]; tests plug in via
// CROSSWALK. Change the skill ontology here, the whole app follows.
const CANONICAL_SKILLS = {
  // Reading
  'reading.main_idea':          { name:'Main Idea & Central Theme',   domain:'Reading' },
  'reading.supporting_detail':  { name:'Supporting Details',           domain:'Reading' },
  'reading.inference':          { name:'Inference',                    domain:'Reading', children:['reading.inference.character','reading.inference.causal'] },
  'reading.inference.character':{ name:'Character Motivation',         domain:'Reading', parent:'reading.inference' },
  'reading.inference.causal':   { name:'Causal Reasoning',             domain:'Reading', parent:'reading.inference' },
  'reading.vocab_in_context':   { name:'Vocabulary in Context',        domain:'Reading' },
  'reading.author_purpose':     { name:"Author's Purpose & Rhetoric",  domain:'Reading' },
  'reading.text_structure':     { name:'Text Structure & Organization',domain:'Reading' },
  'reading.evidence_based':     { name:'Textual Evidence',             domain:'Reading', children:['reading.evidence_based.quantitative'] },
  'reading.evidence_based.quantitative':{ name:'Quantitative Evidence',domain:'Reading', parent:'reading.evidence_based', testOnly:['SAT'] },
  'reading.cross_text':         { name:'Cross-Text Synthesis',         domain:'Reading' },
  'reading.tone':               { name:'Tone & Attitude',              domain:'Reading' },
  'reading.claims':             { name:'Claims & Counterclaims',       domain:'Reading' },
  // English / Writing (illustrative — names reused across ACT English + SAT Writing/Lang)
  'english.conventions':        { name:'Standard English Conventions', domain:'English' },
  'english.sentence_structure': { name:'Sentence Structure',           domain:'English' },
  'english.expression':         { name:'Expression of Ideas',          domain:'English' },
  // Math (illustrative)
  'math.number_quantity':       { name:'Number & Quantity',            domain:'Math' },
  'math.algebra':               { name:'Algebra',                      domain:'Math' },
  'math.functions':             { name:'Functions',                    domain:'Math' },
  'math.geometry':              { name:'Geometry',                     domain:'Math' },
  'math.statistics':            { name:'Statistics & Probability',     domain:'Math' },
  'math.advanced_math':         { name:'Advanced Math',                domain:'Math' },
  'math.problem_solving':       { name:'Problem Solving & Data Analysis', domain:'Math' },
  'math.modeling':              { name:'Modeling & Real-World Application', domain:'Math' },
  // Science (illustrative)
  'science.data_interpretation':{ name:'Data Interpretation',          domain:'Science' },
  'science.investigation':      { name:'Scientific Investigation',     domain:'Science' },
  'science.evaluation':         { name:'Evaluation of Models & Evidence', domain:'Science' },
};

// Crosswalk: test-native category  ⇄  canonical skill ids
// Drives the "By canonical skill" view in reports and the "derived native tag" chips in Item Properties.
const TEST_NATIVE_TO_CANONICAL = {
  // ACT Reading reporting categories
  'ACT:Reading:Key Ideas & Details':          ['reading.main_idea','reading.supporting_detail','reading.inference','reading.evidence_based'],
  'ACT:Reading:Craft & Structure':            ['reading.vocab_in_context','reading.author_purpose','reading.text_structure','reading.tone'],
  'ACT:Reading:Integration of Knowledge & Ideas':['reading.cross_text','reading.claims'],
  // ACT English
  'ACT:English:Conventions of Standard English':['english.conventions','english.sentence_structure'],
  'ACT:English:Production of Writing':         ['english.expression'],
  'ACT:English:Knowledge of Language':         ['english.expression','reading.vocab_in_context'],
  // ACT Math
  'ACT:Math:Preparing for Higher Math':        ['math.number_quantity','math.algebra','math.functions','math.geometry','math.statistics'],
  'ACT:Math:Integrating Essential Skills':     ['math.problem_solving'],
  'ACT:Math:Modeling':                         ['math.modeling'],
  // ACT Science
  'ACT:Science:Interpretation of Data':        ['science.data_interpretation'],
  'ACT:Science:Scientific Investigation':      ['science.investigation'],
  'ACT:Science:Evaluation of Models, Inferences & Experimental Results':['science.evaluation'],
  // SAT Reading/Writing (condensed illustrative mapping)
  'SAT:Reading:Information and Ideas':         ['reading.main_idea','reading.supporting_detail','reading.inference','reading.evidence_based','reading.evidence_based.quantitative'],
  'SAT:Reading:Craft and Structure':           ['reading.vocab_in_context','reading.author_purpose','reading.text_structure','reading.cross_text'],
  'SAT:Reading:Expression of Ideas':           ['english.expression'],
  'SAT:Reading:Standard English Conventions':  ['english.conventions','english.sentence_structure'],
};
// Reverse map: canonical → list of test-native tags it auto-populates
const CANONICAL_TO_TEST_NATIVE = (() => {
  const m = {};
  Object.entries(TEST_NATIVE_TO_CANONICAL).forEach(([nat, list]) => {
    list.forEach(c => { (m[c] = m[c] || []).push(nat); });
  });
  return m;
})();

// Deterministic demo assignment: map existing question (domain/id) → canonical ids
function getCanonicalForQuestion(q) {
  if (!q) return { primary:null, secondary:[] };
  const dom = (q.domain || '').toLowerCase();
  const id = q.id || q.n || 0;
  const pool = {
    reading:      ['reading.main_idea','reading.inference.character','reading.vocab_in_context','reading.author_purpose','reading.text_structure','reading.evidence_based','reading.tone','reading.claims','reading.supporting_detail','reading.cross_text'],
    grammar:      ['english.conventions','english.sentence_structure','english.expression'],
    vocabulary:   ['reading.vocab_in_context','english.expression'],
    comprehension:['reading.main_idea','reading.author_purpose','reading.inference','reading.text_structure'],
    literature:   ['reading.inference.character','reading.tone','reading.author_purpose'],
    english:      ['english.conventions','english.sentence_structure','english.expression'],
    math:         ['math.algebra','math.advanced_math','math.problem_solving'],
    writing:      ['english.expression','english.conventions'],
  };
  const key = Object.keys(pool).find(k => dom.includes(k)) || 'reading';
  const list = pool[key];
  const primary = list[id % list.length];
  const secondary = id % 3 === 0 ? [list[(id + 2) % list.length]] : [];
  return { primary, secondary };
}

function renderCanonicalChipCompact(q) {
  const { primary, secondary } = getCanonicalForQuestion(q);
  if (!primary) return '';
  const label = primary;
  const more = secondary.length ? `<span class="cnl-more">+${secondary.length}</span>` : '';
  return `<span class="q-card-canonical-chip" onclick="event.stopPropagation();openItemProperties(${q.id || q.n || 0},'${(q.domain||'').replace(/'/g,'')}','${(q.type||'').replace(/'/g,'')}')" title="Canonical skill: ${primary}${secondary.length?' (+'+secondary.join(', ')+')':''}"><span class="cnl-icon">🧭</span>${label}${more}</span>`;
}

