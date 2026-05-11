// @ts-nocheck
// Phase-2 slice: lines 9181-9880 of original src/app.ts

// ═══════════════════════════════════════════════════════════════
// ITEM TYPES — STUDENT TEST
// Full-screen student answer experience: 15 questions, one per type.
// Each type has real interactive controls (click, type, drag, draw).
// ═══════════════════════════════════════════════════════════════
let _itsCurrentIdx = 0;
let _itsAnswered = new Set();
let _itsFlagged = new Set();

// ─── Per-type answer state ───
let _itsAnswers = {};
const ITS_ANSWER_DEFAULTS = {
  mc:       () => ({sel: null}),
  ms:       () => ({sel: []}),
  twopart:  () => ({a: null, b: []}),
  fib:      () => ({blanks: ['', '']}),
  gridin:   () => ({val: ''}),
  cr:       () => ({text: ''}),
  essay:    () => ({text: '', checklist: [false,false,false,false]}),
  hottext:  () => ({sel: []}),
  dragdrop: () => ({slots: [null, null]}),
  inline:   () => ({choices: [null, null, null]}),
  matrix:   () => ({rows: [null, null, null, null]}),
  eq:       () => ({val: ''}),
  graph:    () => ({points: []}),
  hotspot:  () => ({pins: []}),
  audio:    () => ({played: 0, playing: false, mc: null}),
  editing:  () => ({picks: [null, null, null, null]}),
};
function itsAns(id) {
  if (!_itsAnswers[id]) _itsAnswers[id] = (ITS_ANSWER_DEFAULTS[id] || (() => ({})))();
  return _itsAnswers[id];
}
function itsResetAll() { _itsAnswers = {}; _itsAnswered = new Set(); _itsFlagged = new Set(); }
function itsMarkAnswered(id, isAns) {
  const idx = ITEM_TYPES.findIndex(t => t.id === id);
  if (idx < 0) return;
  if (isAns) _itsAnswered.add(idx); else _itsAnswered.delete(idx);
}
// Per-type "is answered" check
function itsIsAns(id) {
  const a = itsAns(id);
  switch(id) {
    case 'mc':       return a.sel !== null;
    case 'ms':       return a.sel.length > 0;
    case 'twopart':  return a.a !== null && a.b.length > 0;
    case 'fib':      return a.blanks.some(b => b && b.trim());
    case 'gridin':   return !!a.val;
    case 'cr':       return !!a.text.trim();
    case 'essay':    return !!a.text.trim();
    case 'hottext':  return a.sel.length > 0;
    case 'dragdrop': return a.slots.some(s => s);
    case 'inline':   return a.choices.some(c => c);
    case 'matrix':   return a.rows.some(r => r !== null);
    case 'eq':       return !!a.val;
    case 'graph':    return a.points.length > 0;
    case 'hotspot':  return a.pins.length > 0;
    case 'audio':    return a.mc !== null;
    case 'editing':  return a.picks.some(p => p !== null);
    default:         return false;
  }
}
function itsRefreshAnsweredFlags() {
  ITEM_TYPES.forEach((t, i) => {
    if (itsIsAns(t.id)) _itsAnswered.add(i);
    else _itsAnswered.delete(i);
  });
}

// ─── Interaction handlers ───
function itsSelMC(id, i) { itsAns(id).sel = i; renderItemTypesStu(); }
function itsTglMS(id, i) { const s = itsAns(id).sel; const k = s.indexOf(i); if (k>=0) s.splice(k,1); else s.push(i); renderItemTypesStu(); }
function itsTpA(i)       { itsAns('twopart').a = i; renderItemTypesStu(); }
function itsTpB(i)       { const b = itsAns('twopart').b; const k = b.indexOf(i); if (k>=0) b.splice(k,1); else b.push(i); renderItemTypesStu(); }
function itsFibIn(i, val){ itsAns('fib').blanks[i] = val; itsRefreshAnsweredFlags(); /* no rerender to preserve cursor */ }
function itsGridKey(k)   { const a = itsAns('gridin');
  if (k === '⌫') a.val = a.val.slice(0, -1);
  else if (k === '±') { if (a.val.startsWith('-')) a.val = a.val.slice(1); else if (a.val) a.val = '-' + a.val; }
  else if (k === 'C')  a.val = '';
  else a.val += k;
  renderItemTypesStu();
}
function itsCrIn(val)    { itsAns('cr').text = val; itsRefreshAnsweredFlags(); }
function itsEssayIn(val) { itsAns('essay').text = val; itsRefreshAnsweredFlags(); }
function itsTglCheck(i)  { const a = itsAns('essay'); a.checklist[i] = !a.checklist[i]; renderItemTypesStu(); }
function itsHotTglIdx(i) { const s = itsAns('hottext').sel; const k = s.indexOf(i); if (k>=0) s.splice(k,1); else s.push(i); renderItemTypesStu(); }
let _itsDragChip = null;
function itsDragStart(chip, e) { _itsDragChip = chip; if (e && e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', chip); } }
function itsDragOver(e)        { e.preventDefault(); e.currentTarget.classList.add('over'); }
function itsDragLeave(e)       { e.currentTarget.classList.remove('over'); }
function itsDropSlot(slot, e)  { if (e) e.preventDefault();
  const chip = _itsDragChip || (e && e.dataTransfer && e.dataTransfer.getData('text/plain'));
  if (!chip) return;
  const a = itsAns('dragdrop');
  if (a.slots[slot]) {} // overwrite
  a.slots[slot] = chip;
  _itsDragChip = null;
  renderItemTypesStu();
}
function itsClearSlot(i)       { itsAns('dragdrop').slots[i] = null; renderItemTypesStu(); }
function itsClickChip(chip)    { // tap-to-place fallback for non-DnD UX
  const a = itsAns('dragdrop');
  const empty = a.slots.indexOf(null);
  if (empty >= 0) { a.slots[empty] = chip; renderItemTypesStu(); }
}
let _itsInlineOpen = null;
function itsTglInlineDD(i, e)  { if (e) e.stopPropagation(); _itsInlineOpen = _itsInlineOpen === i ? null : i; renderItemTypesStu(); }
function itsPickInline(i, val) { itsAns('inline').choices[i] = val; _itsInlineOpen = null; renderItemTypesStu(); }
let _itsEditingOpen = null;
function itsTglEditingDD(i, e) { if (e) e.stopPropagation(); _itsEditingOpen = _itsEditingOpen === i ? null : i; renderItemTypesStu(); }
function itsPickEditing(i, val){ itsAns('editing').picks[i] = val; _itsEditingOpen = null; renderItemTypesStu(); }
function itsMatrixSet(row, col){ itsAns('matrix').rows[row] = col; renderItemTypesStu(); }
function itsEqKey(k)           { const a = itsAns('eq');
  if (k === '⌫') a.val = a.val.slice(0, -1);
  else if (k === 'C') a.val = '';
  else a.val += k;
  renderItemTypesStu();
}
function itsEqIn(val)          { itsAns('eq').val = val; itsRefreshAnsweredFlags(); }
function itsGraphClick(e)      { const r = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * 100;
  const y = ((e.clientY - r.top)  / r.height) * 100;
  const a = itsAns('graph');
  a.points.push({x, y});
  if (a.points.length > 4) a.points.shift();
  renderItemTypesStu();
}
function itsGraphReset()       { itsAns('graph').points = []; renderItemTypesStu(); }
function itsHotspotClick(e)    { const r = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * 100;
  const y = ((e.clientY - r.top)  / r.height) * 100;
  itsAns('hotspot').pins = [{x, y}];
  renderItemTypesStu();
}
function itsAudioPlay()        { const a = itsAns('audio');
  if (a.played >= 2 && !a.playing) return; // play limit
  a.playing = !a.playing;
  if (a.playing) {
    setTimeout(() => { const cur = itsAns('audio'); cur.played++; cur.playing = false; renderItemTypesStu(); }, 1200);
  }
  renderItemTypesStu();
}
function itsAudioMC(i)         { itsAns('audio').mc = i; renderItemTypesStu(); }

// Click anywhere closes inline / editing dropdowns
document.addEventListener('click', e => {
  let needsRender = false;
  if (_itsInlineOpen !== null && !e.target.closest('.dd') && !e.target.closest('.its-inline-dd')) {
    _itsInlineOpen = null;
    needsRender = true;
  }
  if (_itsEditingOpen !== null && !e.target.closest('.its-editing-text .ed') && !e.target.closest('.its-editing-dd')) {
    _itsEditingOpen = null;
    needsRender = true;
  }
  if (needsRender) renderItemTypesStu();
});

function itsCurrentType() { return ITEM_TYPES[_itsCurrentIdx].id; }
function openItemTypesStu(typeId) {
  if (typeId) {
    const idx = ITEM_TYPES.findIndex(t => t.id === typeId);
    if (idx >= 0) _itsCurrentIdx = idx;
  }
  switchRole('student', true);
  nav('item-types-stu');
}
function exitItemTypesStu() {
  switchRole('teacher', true);
  nav('item-types');
}
function itsGoTo(idx) {
  if (idx < 0 || idx >= ITEM_TYPES.length) return;
  _itsInlineOpen = null;
  _itsEditingOpen = null;
  _itsCurrentIdx = idx;
  renderItemTypesStu();
}
function itsToggleFlag() {
  if (_itsFlagged.has(_itsCurrentIdx)) _itsFlagged.delete(_itsCurrentIdx);
  else _itsFlagged.add(_itsCurrentIdx);
  renderItemTypesStu();
}
function itsClearAnswer() {
  const t = ITEM_TYPES[_itsCurrentIdx];
  _itsAnswers[t.id] = (ITS_ANSWER_DEFAULTS[t.id] || (() => ({})))();
  renderItemTypesStu();
}

function renderItemTypesStu() {
  // Dispatcher: ITEM_STUDENT_BUILDERS interaction handlers all call this.
  // Route to the correct re-render based on current page so dropdowns / drag-drop
  // / matrix etc. work in BOTH the Item Types Library sandbox AND the TCAP test.
  if (currentPage === 'tcap-stu') {
    if (TCS_STATE.phase === 'test') {
      const body = document.getElementById('tcsBody');
      if (body) body.innerHTML = tcsViewTest();
    }
    return;
  }
  if (currentPage !== 'item-types-stu') return;  // wrong page, skip silently
  itsRefreshAnsweredFlags();
  const t = ITEM_TYPES[_itsCurrentIdx];
  document.getElementById('itsSecLabel').textContent = `Item Type Showcase · ${t.name}`;
  document.getElementById('itsSecInfo').textContent = `Question ${_itsCurrentIdx+1} of ${ITEM_TYPES.length}`;

  document.getElementById('itsSide').innerHTML = renderItsSide();
  const answered = itsIsAns(t.id);
  document.getElementById('itsMain').innerHTML = `
    <div class="its-stage">
      <div class="its-q-meta">
        <span class="chip">Question ${_itsCurrentIdx+1}</span>
        <span class="chip subj">${t.subjects[0]}</span>
        <span class="chip points">${(t.scoring.match(/\d+/) || ['1'])[0]} pt</span>
        <span class="chip">${t.name}</span>
        ${t.phase==='phase2' ? '<span class="chip" style="background:#f1f5f9;color:#475569">Phase 2 design</span>' : ''}
        ${answered ? '<span class="chip" style="background:#dcfce7;color:#15803d">✓ Answered</span>' : ''}
      </div>
      ${ITEM_STUDENT_BUILDERS[t.id] ? ITEM_STUDENT_BUILDERS[t.id](t) : '<div>Student view not designed.</div>'}
    </div>
  `;
  document.getElementById('itsFooter').innerHTML = `
    <div class="left">
      <button onclick="itsToggleFlag()">${_itsFlagged.has(_itsCurrentIdx) ? '🚩 Unflag' : '⚐ Flag for review'}</button>
      ${answered ? `<button onclick="itsClearAnswer()" style="color:#71717a">↺ Clear answer</button>` : ''}
    </div>
    <div class="pgs">${_itsAnswered.size} / ${ITEM_TYPES.length} answered · ${_itsFlagged.size} flagged</div>
    <div class="right">
      <button onclick="itsGoTo(${_itsCurrentIdx-1})" ${_itsCurrentIdx===0?'disabled style="opacity:.4;cursor:not-allowed"':''}>← Prev</button>
      <button class="primary" onclick="itsGoTo(${_itsCurrentIdx+1})">${_itsCurrentIdx === ITEM_TYPES.length-1 ? 'Submit test ✓' : 'Next →'}</button>
    </div>
  `;
}

function renderItsSide() {
  const phaseGroups = [
    {phase:'must',  label:'MVP must-have'},
    {phase:'nice',  label:'MVP nice-to-have'},
    {phase:'phase2',label:'Phase 2 design'},
  ];
  return phaseGroups.map(g => {
    const idxs = ITEM_TYPES.map((t,i) => ({t,i})).filter(x => x.t.phase === g.phase);
    return `
      <div class="its-side-head">${g.label}</div>
      ${idxs.map(({t,i}) => `
        <div class="its-q ${i === _itsCurrentIdx ? 'active' : ''} ${_itsAnswered.has(i) ? 'answered' : ''} ${_itsFlagged.has(i) ? 'flagged' : ''}" onclick="itsGoTo(${i})">
          <div class="its-q-num">${i+1}</div>
          <div class="its-q-name">${t.name}</div>
          <span class="its-q-flag">${_itsFlagged.has(i) ? '🚩' : ''}</span>
        </div>`).join('')}
    `;
  }).join('');
}

// ─── Per-type student builders (interactive) ───
// Each builder receives (t, q) where t is the ITEM_TYPE metadata and q is the
// current TCS_QUESTIONS entry. If q.content is provided, the builder renders
// from that data (subject-specific stems / options / passages). If q.content
// is absent (e.g. teacher-side editor preview), builders fall back to the
// historical hardcoded content so existing call sites keep working.
const _itcDefaults = {
  // Default content per item type — used when q.content is missing.
  // Anything subject-specific lives in TCS_QUESTIONS[i].content instead.
  mc:       {stem:'Which fraction is equivalent to <b>2/4</b>?', options:['1/2','1/3','2/3','3/4']},
  ms:       {stem:'Select <b>all</b> of the prime numbers from the list below.', options:['2','3','4','5','9']},
  twopart:  {
    passageHtml:'<p>The garden was bright with sunflowers, but Maya barely noticed. <span class="hot %B0%">She kept walking, past the hedges and the old fountain</span>, her hands deep in her pockets. The note from her grandmother sat folded in her palm. The path felt longer than it had yesterday.</p><p>Three years had passed since they last spoke. Yet here she was, doing what was asked of her. <span class="hot %B3%">Even the dark afternoons could not change that. She would keep going, one step at a time.</span></p>',
    partA:{stem:'What is the central theme of the passage?', options:['Resilience in the face of loss','The thrill of adventure','Trust in nature','The joy of solitude']},
    partB:{stem:'Which two sentences from the passage best support your answer to Part A?', options:['"She kept walking, past the hedges and the old fountain…"','"The garden was bright with sunflowers."','"Three years had passed since they last spoke."','"Even the dark afternoons could not change that."']},
  },
  fib:      {stem:'Type your answer in each blank.', template:'The capital of Tennessee is %BLANK0%. The Mississippi River flows past the city of %BLANK1%.', blanks:[{placeholder:'city name'},{placeholder:'city name'}]},
  gridin:   {stem:'If 3x + 5 = 20, what is the value of x?', instr:'Enter your numeric answer using the keypad below.'},
  cr:       {stem:'Explain why mitochondria are called the "powerhouse of the cell." Use specific evidence from the text.', instr:'Write 1–3 sentences. You may type up to 200 words.', maxWords:200},
  essay:    {stem:'Should your school adopt a four-day school week? Use evidence from the sources to support your view.',
             instr:'Plan your response, then write a multi-paragraph essay. Cite at least one source by number when you use it.',
             minWords:0, sources:2,
             checklist:['State your opinion clearly in the introduction','Use evidence from at least 2 sources','Address the opposing view','Conclude with a call to action'],
             sourcesData:[
               {label:'Source 1', title:'Why Some Schools Are Switching to Four-Day Weeks', byline:'Education Today · 2024',
                bodyHtml:'<p>Across rural and small-town America, more than 850 school districts have shifted to a four-day school week — usually closing on Mondays or Fridays. Supporters point to several benefits.</p><p>"<b>Teacher recruiting got noticeably easier</b> after we moved to a four-day week," said Superintendent Lyle Carter of a Colorado district that made the switch in 2022. Students often use the extra day off for medical appointments, family time, or after-school jobs that would otherwise pull them out of class.</p><p>A 2023 study from the University of Oregon found that <b>student attendance rose by an average of 6%</b> in districts that adopted the schedule, and <b>teacher turnover dropped by 4%</b>. However, the same study cautioned that the longer school days these districts adopted (often 7.5 hours instead of 6.5) can be tiring for younger students.</p>'},
               {label:'Source 2', title:'A Parent\'s View: We Tried the Four-Day Week, and It Hurt Our Kids', byline:'Editorial, Memphis Commercial Appeal · 2024',
                bodyHtml:'<p>When our county switched to a four-day school week, my husband and I — both nurses — suddenly had to find childcare for an extra weekday. We are not alone. <b>Roughly 65% of working parents in our district reported the change made their family budget tighter</b>, according to a survey by the local school board.</p><p>Beyond the financial strain, my own children — ages 8 and 11 — came home from the longer school days exhausted. Reading scores in our district <b>dropped 11 points</b> in the two years following the switch. Our youngest started skipping breakfast just to make it onto the early-morning bus.</p><p>A four-day week sounds appealing in the abstract. In practice, for working families and younger learners, the costs add up faster than the supposed benefits.</p>'},
             ]},
  hottext:  {stem:'Click the two sentences that best support the central idea of the passage.', instr:'Tap a sentence to select it. Tap again to unselect. Choose two.', targetCount:2,
             sentences:[
               'Many cities across the United States have grown rapidly in recent decades.',
               'This rapid growth has placed serious strain on water and electrical infrastructure.',
               'Some local governments are responding with new conservation policies.',
               'Engineers are also developing more efficient grid technologies.',
               'Without these changes, supply shortages may become common in coming years.',
             ]},
  dragdrop: {stem:'Drag each term into the correct blank to complete the sentence.', instr:'Drag a chip from the tray below to a blank — or just tap a chip to auto-fill the next empty slot.',
             chips:['producer','consumer','decomposer','parasite','predator'],
             template:'A %SLOT0% makes its own food using sunlight, while a %SLOT1% eats other organisms for energy.'},
  inline:   {stem:'Choose the correct word for each blank to complete the paragraph.', instr:'Click any blank to see options.',
             template:'The dog %BLANK0% when the door opened, and the cat %BLANK1% away in surprise. Then the children %BLANK2% and chased after them.',
             blanks:[
               {opts:['barked','bark','barking'], placeholder:'verb (past)'},
               {opts:['ran','run','running'],     placeholder:'verb (past)'},
               {opts:['laughed','laugh','laughing'], placeholder:'verb (past)'},
             ]},
  matrix:   {stem:'Mark whether each statement about photosynthesis is True, False, or Not Stated in the passage.', instr:'Select one option in each row.',
             rows:['Photosynthesis releases oxygen.','Plants need sunlight at night.','All plants are the color green.','Photosynthesis stores chemical energy.'],
             cols:['True','False','Not Stated']},
  eq:       {stem:'Solve for x. Use the equation editor to enter your answer. &nbsp; 2x² − 8 = 0', instr:'Type directly, or tap the math symbols below.', placeholder:'Type your answer (e.g. x = ±2)'},
  graph:    {stem:'Plot the line y = x + 1 on the coordinate plane below.', instr:'Click two points on the grid to draw a line.'},
  hotspot:  {stem:'Click on the mitochondria in the diagram of the cell.', instr:'Tap the region in the image. You can tap again to change your answer.'},
  audio:    {stem:'Listen to the dialogue, then answer the question.', clipName:'Library dialogue', clipDuration:'1:24', maxPlays:2,
             mcStem:'What does Anna want?',
             options:['A book about birds for her brother','Help finding a picture book for a 7-year-old','A quiet space to study']},
  // Editing Task — TCAP ELA Subpart 4 / ACT English signature item.
  // Authoring contract: `template` is plain text with %ED0%, %ED1%… markers.
  // `edits[i]` carries that edit's `original` text (rendered when nothing or
  // NO CHANGE is picked), `opts` (option A is ALWAYS "NO CHANGE" by convention),
  // an `answer` index marking the correct option, and an optional `tag` hinting
  // what the edit tests (verb tense, pronoun, etc.) — surfaced in the diagnostic
  // report, never to the student.
  editing:  {stem:'Read the passage. For each <b>underlined and numbered</b> phrase, decide whether it should be revised. If the original wording is best, choose <b>NO CHANGE</b>.',
             instr:'Click any underlined phrase to see its options. Your choice replaces the original in the passage.',
             template:'My grandmother lived on a small farm in West Tennessee, and every July my cousins and I %ED0% to visit her. She kept chickens, an old goat named Pepper, and a vegetable garden %ED1% stretched almost to the creek. On rainy mornings we would sit on her porch and listen %ED2% her tell stories about her own childhood. By the time we left in August, %ED3% wanted to go home.',
             edits:[
               {original:'would travel',     opts:['NO CHANGE','traveled','will travel','traveling'],          answer:0, tag:'verb tense · past habitual'},
               {original:'who',              opts:['NO CHANGE','that','which','where'],                        answer:2, tag:'relative pronoun · for non-person'},
               {original:'as',               opts:['NO CHANGE','with','while','after'],                        answer:0, tag:'subordinating conjunction'},
               {original:'each of us never', opts:['NO CHANGE','none of us','each of us','no one of us'],      answer:1, tag:'double negative · subject–verb agreement'},
             ]},
};
function _itcContent(type, q) {
  // Merge q.content over the type default. Per-key shallow merge so a
  // question can override only `stem` and inherit everything else.
  const def = _itcDefaults[type] || {};
  const ov  = (q && q.content) ? q.content : null;
  if (!ov) return def;
  return Object.assign({}, def, ov);
}
const ITEM_STUDENT_BUILDERS = {
  mc: (t, q) => {
    const a = itsAns('mc');
    const c = _itcContent('mc', q);
    // True/False sub-variant — TNReady delivers TF as MC with 2 binary options.
    // Visually we render large side-by-side buttons (no ABCD letters) so
    // students don't read it as a normal MC. Trigger via q.content.variant='tf'.
    if (c.variant === 'tf') {
      const tfOpts = c.options && c.options.length === 2 ? c.options : ['True','False'];
      return `
        <div class="its-q-stem">${c.stem}</div>
        ${c.instr ? `<div class="its-q-instr">${c.instr}</div>` : ''}
        <div class="its-tf-row">
          ${tfOpts.map((v,i) => `
            <button class="its-tf-btn ${a.sel===i?'selected':''} ${i===0?'tf-true':'tf-false'}" onclick="itsSelMC('mc',${i})">
              <span class="tf-ic">${i===0?'✓':'✗'}</span>
              <span class="tf-lab">${v}</span>
            </button>`).join('')}
        </div>`;
    }
    const opts = (c.options || []).map((v, i) => ({l:'ABCDE'[i] || (i+1), v}));
    return `
      <div class="its-q-stem">${c.stem}</div>
      ${c.instr ? `<div class="its-q-instr">${c.instr}</div>` : ''}
      <div class="its-options">
        ${opts.map((o,i) => `
          <div class="its-option ${a.sel===i?'selected':''}" onclick="itsSelMC('mc',${i})">
            <span class="marker">${a.sel===i?'●':''}</span>
            <span class="letter">${o.l}</span>
            <span class="text">${o.v}</span>
          </div>`).join('')}
      </div>`;
  },
  ms: (t, q) => {
    const a = itsAns('ms');
    const c = _itcContent('ms', q);
    const opts = (c.options || []).map((v, i) => ({l:'ABCDE'[i] || (i+1), v}));
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr || 'Select all that apply. You may pick more than one answer.'} <b>${a.sel.length}</b> selected.</div>
      <div class="its-options">
        ${opts.map((o,i) => {
          const sel = a.sel.includes(i);
          return `<div class="its-option square ${sel?'selected':''}" onclick="itsTglMS('ms',${i})">
            <span class="marker">${sel?'✓':''}</span>
            <span class="letter">${o.l}</span>
            <span class="text">${o.v}</span>
          </div>`;
        }).join('')}
      </div>`;
  },
  twopart: (t, q) => {
    const a = itsAns('twopart');
    const c = _itcContent('twopart', q);
    const linkedToA = a.a !== null;
    // Fill in selection state placeholders %B0% .. %B5% in the passage HTML
    const passage = (c.passageHtml || '').replace(/%B(\d+)%/g, (_, n) => a.b.includes(+n) ? 'selected' : '');
    return `
      <div class="its-q-stem">${c.stem || 'Read the passage. Then answer Part A and Part B.'}</div>
      <div class="its-passage">${passage}</div>
      <div class="its-twopart">
        <div class="pt">
          <div class="pt-label">Part A</div>
          <div class="pt-stem">${c.partA.stem}</div>
          <div class="its-options">
            ${c.partA.options.map((v,i) => `
              <div class="its-option ${a.a===i?'selected':''}" onclick="itsTpA(${i})">
                <span class="marker">${a.a===i?'●':''}</span>
                <span class="letter">${'ABCD'[i]}</span>
                <span class="text">${v}</span>
              </div>`).join('')}
          </div>
        </div>
        <div class="pt" style="${linkedToA?'':'opacity:.55'}">
          <div class="pt-label">Part B ${linkedToA?'':'· answer Part A first'}</div>
          <div class="pt-stem">${c.partB.stem}</div>
          <div class="its-options">
            ${c.partB.options.map((v,i) => {
              const sel = a.b.includes(i);
              return `<div class="its-option square ${sel?'selected':''}" onclick="${linkedToA?`itsTpB(${i})`:''}">
                <span class="marker">${sel?'✓':''}</span>
                <span class="text">${v}</span>
              </div>`;
            }).join('')}
          </div>
          ${a.b.length > 0 ? `<div style="font-size:11px;color:#7c3aed;font-weight:600;margin-top:8px">${a.b.length} of 2 evidence sentences selected</div>` : ''}
        </div>
      </div>`;
  },
  fib: (t, q) => {
    const a = itsAns('fib');
    const c = _itcContent('fib', q);
    // Replace %BLANK0%, %BLANK1%... in the template with input fields.
    const body = (c.template || '').replace(/%BLANK(\d+)%/g, (_, n) => {
      const i = +n;
      const ph = (c.blanks && c.blanks[i] && c.blanks[i].placeholder) || '';
      return `<input class="its-blank-input" value="${(a.blanks[i]||'').replace(/"/g,'&quot;')}" oninput="itsFibIn(${i},this.value)" placeholder="${ph}">`;
    });
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${body}</div>`;
  },
  gridin: (t, q) => {
    const a = itsAns('gridin');
    const c = _itcContent('gridin', q);
    const display = a.val || '_';
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr}</div>
      <div class="its-numeric-display">${display}</div>
      <div class="its-numeric-pad">
        ${['7','8','9','4','5','6','1','2','3','.','0','⌫','/','−','±'].map(k =>
          `<button class="key" onclick="itsGridKey('${k}')">${k}</button>`).join('')}
      </div>
      <div style="margin-top:10px;text-align:center;font-size:11px;color:#71717a">Tip: ⌫ to delete, ± to flip sign, / for fraction</div>`;
  },
  cr: (t, q) => {
    const a = itsAns('cr');
    const c = _itcContent('cr', q);
    const wc = a.text.trim() ? a.text.trim().split(/\s+/).length : 0;
    const max = c.maxWords || 200;
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr}</div>
      <textarea class="its-text-input" oninput="itsCrIn(this.value);document.getElementById('crWc').textContent=this.value.trim()?this.value.trim().split(/\\s+/).length:0" placeholder="Type your answer here…">${a.text}</textarea>
      <div style="margin-top:8px;font-size:11px;color:#71717a;display:flex;justify-content:space-between"><span>Auto-saved · just now</span><span><span id="crWc">${wc}</span> / ${max} words</span></div>`;
  },
  essay: (t, q) => {
    const a = itsAns('essay');
    const c = _itcContent('essay', q);
    const wc = a.text.trim() ? a.text.trim().split(/\s+/).length : 0;
    const checks = c.checklist || [];
    const sources = c.sourcesData || [];
    const srcN = sources.length || c.sources || 0;
    // Stash source data on a global the slide-in panel can read (the panel
    // lives outside the essay item's DOM, so a window-level handoff is the
    // simplest cross-component contract here).
    if (srcN > 0) window._tcsActiveSources = sources;
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr}</div>
      ${srcN > 0 ? `
      <button class="its-source-trigger" onclick="tcsOpenSources()" title="Open the source viewer (slides in from the left)">
        <span class="src-ic">📎</span>
        <span>View ${srcN} source${srcN === 1 ? '' : 's'} →</span>
      </button>` : ''}
      <div class="its-checklist">
        <div class="ck-title">Planning checklist · ${a.checklist.filter(Boolean).length}/${checks.length} done</div>
        ${checks.map((c,i) => `
          <div class="ck-item ${a.checklist[i]?'done':''}" onclick="itsTglCheck(${i})" style="cursor:pointer">
            <span class="ck-box">${a.checklist[i]?'✓':''}</span><span>${c}</span>
          </div>`).join('')}
      </div>
      <div class="its-essay-area">
        <div class="essay-tools">
          <button class="tk">B</button><button class="tk"><i>I</i></button><button class="tk">U</button>
          <span style="width:1px;height:18px;background:#e4e4e7;margin:0 4px"></span>
          <button class="tk">📋</button><button class="tk">↶</button><button class="tk">↷</button>
          <span style="margin-left:auto;font-size:11px;color:#71717a">Spell-check on</span>
        </div>
        <textarea class="essay-text" oninput="itsEssayIn(this.value);document.getElementById('essayWc').textContent=this.value.trim()?this.value.trim().split(/\\s+/).length:0" placeholder="Begin writing your essay here…">${a.text}</textarea>
        <div class="essay-foot"><span>Auto-saved · just now</span><span><span id="essayWc">${wc}</span> words · write a multi-paragraph response</span></div>
      </div>`;
  },
  hottext: (t, q) => {
    const a = itsAns('hottext');
    const c = _itcContent('hottext', q);
    const sents = c.sentences || [];
    const target = c.targetCount || 2;
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr || 'Tap a sentence to select it. Tap again to unselect.'} Choose ${target}. <b>${a.sel.length}</b> selected.</div>
      <div class="its-passage">
        <p>${sents.map((s,i) => `<span class="hot ${a.sel.includes(i)?'selected':''}" onclick="itsHotTglIdx(${i})">${s}</span>`).join(' ')}</p>
      </div>`;
  },
  dragdrop: (t, q) => {
    const a = itsAns('dragdrop');
    const c = _itcContent('dragdrop', q);
    const allChips = c.chips || [];
    const placed = new Set(a.slots.filter(Boolean));
    const renderSlot = (i) => {
      const v = a.slots[i];
      return v
        ? `<span class="slot filled" ondragover="itsDragOver(event)" ondragleave="itsDragLeave(event)" ondrop="itsDropSlot(${i},event)" onclick="itsClearSlot(${i})" title="Click to clear">${v} <span style="opacity:.5;margin-left:4px">×</span></span>`
        : `<span class="slot empty" ondragover="itsDragOver(event)" ondragleave="itsDragLeave(event)" ondrop="itsDropSlot(${i},event)">drop here</span>`;
    };
    const body = (c.template || '').replace(/%SLOT(\d+)%/g, (_, n) => renderSlot(+n));
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr}</div>
      <div class="its-drag-area">${body}</div>
      <div class="its-drag-tray">
        ${allChips.map(c => {
          const used = placed.has(c);
          return `<span class="chip ${used?'placed':''}" draggable="${!used}" ondragstart="itsDragStart('${c}',event)" onclick="${used?'':`itsClickChip('${c}')`}">${c}</span>`;
        }).join('')}
      </div>`;
  },
  inline: (t, q) => {
    const a = itsAns('inline');
    const c = _itcContent('inline', q);
    const blanks = c.blanks || [];
    const renderDD = (i) => {
      const val = a.choices[i];
      const open = _itsInlineOpen === i;
      const ph = (blanks[i] && blanks[i].placeholder) || '';
      const opts = (blanks[i] && blanks[i].opts) || [];
      return `<span class="dd ${val?'set':'empty'}" onclick="itsTglInlineDD(${i},event)">${val || ph}${open ? `
        <div class="its-inline-dd">
          ${opts.map(o => `<button class="${val===o?'picked':''}" onclick="event.stopPropagation();itsPickInline(${i},'${o}')">${o}</button>`).join('')}
        </div>` : ''}</span>`;
    };
    const body = (c.template || '').replace(/%BLANK(\d+)%/g, (_, n) => renderDD(+n));
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr}</div>
      <div class="its-passage" style="max-height:none;overflow:visible">
        <div class="its-inline-text">${body}</div>
      </div>`;
  },
  matrix: (t, q) => {
    const a = itsAns('matrix');
    const c = _itcContent('matrix', q);
    const rows = c.rows || [];
    const cols = c.cols || ['True','False','Not Stated'];
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr || 'Select one option in each row.'} <b>${a.rows.filter(r=>r!==null).length}/${rows.length}</b> rows answered.</div>
      <table class="its-matrix">
        <thead><tr><th style="width:55%"></th>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((r, ri) => `<tr>
            <td class="row-label">${r}</td>
            ${cols.map((_, ci) => `<td onclick="itsMatrixSet(${ri},${ci})" style="cursor:pointer">
              <span class="opt-circ ${a.rows[ri]===ci?'checked':''}"></span>
            </td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>`;
  },
  eq: (t, q) => {
    const a = itsAns('eq');
    const c = _itcContent('eq', q);
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr}</div>
      <input class="its-eq-input" value="${a.val.replace(/"/g,'&quot;')}" oninput="itsEqIn(this.value);" placeholder="${c.placeholder}" style="width:100%;border:2px solid #e4e4e7;outline:none">
      <div class="its-eq-pad" style="margin-top:14px">
        ${['x²','x³','√','π','±','≤','≥','7','8','9','+','−','(',')','4','5','6','×','÷','a/b','⌫'].map(k =>
          `<div class="key" onclick="itsEqKey('${k}')">${k}</div>`).join('')}
      </div>`;
  },
  graph: (t, q) => {
    const a = itsAns('graph');
    const c = _itcContent('graph', q);
    const ptDots = a.points.map((p,i) =>
      `<div class="pt" style="left:${p.x}%;top:${p.y}%" title="Point ${i+1}: (${((p.x-50)/15).toFixed(1)}, ${((50-p.y)/15).toFixed(1)})"></div>`
    ).join('');
    let line = '';
    if (a.points.length >= 2) {
      const [p1, p2] = a.points;
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      const ang = Math.atan2(dy, dx) * 180 / Math.PI;
      line = `<div class="ln" style="left:${p1.x}%;top:${p1.y}%;width:${len}%;transform:rotate(${ang}deg)"></div>`;
    }
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr} Click two points on the grid to draw a line. Click again to add more points (max 4). <b>${a.points.length}</b> point${a.points.length===1?'':'s'} placed.</div>
      <div class="its-graph-stage" onclick="itsGraphClick(event)">
        <div class="axis ax-x"></div><div class="axis ax-y"></div>
        ${line}
        ${ptDots}
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button onclick="itsGraphReset()" style="font-size:12px;padding:6px 12px;border-radius:6px;border:1px solid #d4d4d8;background:#fff;cursor:pointer">↺ Reset</button>
        <button style="font-size:12px;padding:6px 12px;border-radius:6px;border:1px solid #7c3aed;background:#7c3aed;color:#fff;cursor:pointer">/ Line tool</button>
        <span style="margin-left:auto;font-size:11px;color:#71717a;align-self:center">Snap to grid: on</span>
      </div>`;
  },
  hotspot: (t, q) => {
    const a = itsAns('hotspot');
    const c = _itcContent('hotspot', q);
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr}</div>
      <div class="its-hotspot-img" onclick="itsHotspotClick(event)">
        ${a.pins.map(p => `<div class="pin" style="left:${p.x}%;top:${p.y}%">✓</div>`).join('')}
      </div>
      ${a.pins.length > 0 ? `<div style="margin-top:10px;font-size:11px;color:#7c3aed;font-weight:600">📍 Pin placed at (${a.pins[0].x.toFixed(0)}%, ${a.pins[0].y.toFixed(0)}%) · tap a different spot to change</div>` : ''}`;
  },
  audio: (t, q) => {
    const a = itsAns('audio');
    const c = _itcContent('audio', q);
    const maxPlays = c.maxPlays || 2;
    const playsLeft = Math.max(0, maxPlays - a.played);
    const opts = c.options || [];
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-audio">
        <div class="play" onclick="itsAudioPlay()" style="cursor:${playsLeft===0&&!a.playing?'not-allowed':'pointer'};opacity:${playsLeft===0&&!a.playing?'.4':'1'}">${a.playing ? '❚❚' : '▶'}</div>
        <div class="wave" style="${a.playing?'animation:none':''}"></div>
        <div class="meta">
          <span class="nm">${c.clipName}</span>
          <span>${a.playing?'Playing…':a.played?'Played':'0:00'} / ${c.clipDuration}</span>
          <span>Replays left: <b>${playsLeft}</b></span>
        </div>
      </div>
      <div class="its-q-stem" style="font-size:14px">${c.mcStem}</div>
      <div class="its-options">
        ${opts.map((v,i) => `
          <div class="its-option ${a.mc===i?'selected':''}" onclick="itsAudioMC(${i})">
            <span class="marker">${a.mc===i?'●':''}</span>
            <span class="letter">${'ABC'[i]}</span>
            <span class="text">${v}</span>
          </div>`).join('')}
      </div>`;
  },
  editing: (t, q) => {
    const a = itsAns('editing');
    const c = _itcContent('editing', q);
    const edits = c.edits || [];
    const answeredCt = a.picks.filter(p => p !== null).length;
    // Render one underlined edit. If the student has picked something other
    // than NO CHANGE, show that text. Otherwise (or NO CHANGE) show the
    // original. The numbered chip + dashed underline mimics TestNav's
    // editing-task pattern; the dropdown anchors below the trigger.
    const renderEd = (i) => {
      const ed = edits[i] || {};
      const opts = ed.opts || ['NO CHANGE'];
      const original = ed.original || '';
      const picked = a.picks[i];
      const isNoChange = picked === 'NO CHANGE';
      const isChanged = picked !== null && !isNoChange;
      const display = isChanged ? picked : original;
      const stateClass = picked === null ? 'untouched' : (isChanged ? 'changed' : 'kept');
      const open = _itsEditingOpen === i;
      const escAttr = (s) => String(s).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
      return `<span class="ed ${stateClass} ${open?'open':''}" onclick="itsTglEditingDD(${i},event)">
        <span class="ed-num">${i+1}</span>
        <span class="ed-text">${display}</span>
        ${open ? `
          <div class="its-editing-dd" onclick="event.stopPropagation()">
            ${opts.map((o, oi) => {
              const sel = picked === o || (picked === null && oi === 0 && false); // never auto-pick
              const isNc = oi === 0;
              const labelInDD = isNc
                ? `<b>NO CHANGE</b> <span class="ed-orig">(keep "${original}")</span>`
                : o;
              return `<button class="${sel?'picked':''} ${isNc?'nochg':''}" onclick="itsPickEditing(${i},'${escAttr(o)}')">${labelInDD}</button>`;
            }).join('')}
            ${picked !== null ? `<button class="ed-clear" onclick="event.stopPropagation();itsAns('editing').picks[${i}]=null;_itsEditingOpen=null;renderItemTypesStu()">↺ Clear my answer</button>` : ''}
          </div>` : ''}
      </span>`;
    };
    const body = (c.template || '').replace(/%ED(\d+)%/g, (_, n) => renderEd(+n));
    return `
      <div class="its-q-stem">${c.stem}</div>
      <div class="its-q-instr">${c.instr || 'Click any underlined phrase to see its options.'} <b>${answeredCt}/${edits.length}</b> edits decided.</div>
      <div class="its-passage" style="max-height:none;overflow:visible">
        <div class="its-editing-text">${body}</div>
      </div>`;
  },
};
