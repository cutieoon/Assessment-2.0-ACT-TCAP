// @ts-nocheck
// Phase-2 slice: lines 6838-9180 of original src/app.ts


// ═══════════════════════════════════════════════════════════════
// ITEM TYPES — TEACHER EDIT WORKBENCH (interactive)
// Full-screen editor: sidebar lists 15 item types,
// main area shows the full authoring UI for the selected type.
// All controls are state-driven and persist while you switch types.
// ═══════════════════════════════════════════════════════════════
let _iteCurrentId = 'mc';
let _iteState = {};
function openItemTypesEdit(typeId) {
  if (typeId === 'ms') {
    _iteCurrentId = 'mc';
    iteState('mc').multi = true;
  } else if (typeId) {
    _iteCurrentId = typeId;
  }
  switchRole('teacher', true);
  nav('item-types-edit');
}

// ─── State management ───
function iteState(id) {
  if (!_iteState[id]) _iteState[id] = JSON.parse(JSON.stringify(ITE_DEFAULTS[id] || {}));
  return _iteState[id];
}
function iteResetType() {
  _iteState[_iteCurrentId] = JSON.parse(JSON.stringify(ITE_DEFAULTS[_iteCurrentId] || {}));
  renderItemTypesEdit();
  iteToast('Reset to default · ' + ITEM_TYPES.find(t=>t.id===_iteCurrentId).name, 'info');
}
function iteRerender() { renderItemTypesEdit(); }

// ─── Toast ───
function iteToast(msg, kind) {
  const old = document.getElementById('iteToast');
  if (old) old.remove();
  const div = document.createElement('div');
  div.id = 'iteToast';
  const bg = kind === 'info' ? '#7c3aed' : '#16a34a';
  div.style.cssText = `position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:${bg};color:#fff;padding:11px 22px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2);display:flex;align-items:center;gap:8px;transition:opacity .3s`;
  div.innerHTML = (kind === 'info' ? 'ℹ️' : '✓') + ' ' + msg;
  document.body.appendChild(div);
  setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 300); }, 2200);
}

// ─── Top bar actions ───
function iteSaveDraft() { iteToast('Draft saved'); }
function iteAddToAssessment() {
  const t = ITEM_TYPES.find(x => x.id === _iteCurrentId);
  iteToast(`"${t.name}" added to current assessment`);
}

// ─── Generic field setters ───
function iteSetStem(id, val)         { iteState(id).stem = val; }
function iteSetExplanation(id, val)  { iteState(id).explanation = val; }
function iteSetSample(id, val)       { iteState(id).sample = val; }
function iteSetTranscript(id, val)   { iteState(id).transcript = val; }
function iteSetWordLimit(id, val)    { iteState(id).wordLimit = parseInt(val)||0; }
function iteSetMinWords(id, val)     { iteState(id).minWords = parseInt(val)||0; }
function iteSetMaxWords(id, val)     { iteState(id).maxWords = parseInt(val)||0; }
function iteSetReqClicks(id, val)    { iteState(id).requiredClicks = parseInt(val)||0; }
function iteSetReqCount(id, val)     { iteState(id).requiredCount = parseInt(val)||0; iteRerender(); }
function iteSetGranularity(id, val)  { iteState(id).granularity = val; iteRerender(); }
function iteSetCompositeMode(id, val){ iteState(id).settings.mode = val; iteRerender(); }
function iteSetEqEngine(id, val)     { iteState(id).settings.engine = val; iteRerender(); }
function iteSetMatrixMode(id, val)   { iteState(id).settings.mode = val; iteRerender(); }
function iteSetMSMin(id, val)        { iteState(id).minSel = val; iteRerender(); }
function iteSetMSMax(id, val)        { iteState(id).maxSel = val; iteRerender(); }
function iteSetReplay(id, val)       { iteState(id).settings.replayLimit = val; iteRerender(); }
function iteSetTolerance(id, val)    { iteState(id).tolerance = val; }
function iteSetPrimaryNum(id, val)   { iteState(id).primary = val; }
function iteSetAudioFile(id, val)    { iteState(id).audioFile = val; }

function iteToggleSetting(id, key) {
  const s = iteState(id).settings;
  s[key] = !s[key];
  iteRerender();
}
function iteToggleTool(id, key) {
  iteState(id).tools[key] = !iteState(id).tools[key];
  iteRerender();
}

// ─── Options (MC / MS / Audio MC) ───
function iteAddOpt(id) {
  iteState(id).options.push({v:'New option', correct:false});
  iteRerender();
}
function iteDelOpt(id, idx) {
  const s = iteState(id);
  if (s.options.length <= 2) { iteToast('Need at least 2 options', 'info'); return; }
  s.options.splice(idx, 1);
  iteRerender();
}
function iteMoveOpt(id, idx, dir) {
  const s = iteState(id).options;
  const ni = idx + dir;
  if (ni < 0 || ni >= s.length) return;
  [s[idx], s[ni]] = [s[ni], s[idx]];
  iteRerender();
}
function iteToggleCorrect(id, idx) {
  const s = iteState(id);
  if (s.multi) s.options[idx].correct = !s.options[idx].correct;
  else s.options.forEach((o, i) => o.correct = (i === idx));
  iteRerender();
}
// Switch between Single Answer / Multiple Answers mode (matches platform's
// MULTIPLE_CHOICE_QUESTION isMultipleAnswers flag — same item, mode toggles).
// When switching from multi → single, keep the FIRST correct option only.
function iteSetMode(id, multi) {
  const s = iteState(id);
  if (s.multi === !!multi) return;
  s.multi = !!multi;
  if (!multi) {
    let kept = false;
    s.options.forEach(o => {
      if (o.correct && !kept) { kept = true; }
      else { o.correct = false; }
    });
    if (!kept && s.options[0]) s.options[0].correct = true;
  }
  iteRerender();
}
function iteUpdateOpt(id, idx, val) { iteState(id).options[idx].v = val; }

// ─── Two-Part ───
function iteTpAddOpt(id, part) {
  iteState(id)[part].options.push({v:'New option', correct:false});
  iteRerender();
}
function iteTpDelOpt(id, part, idx) {
  const opts = iteState(id)[part].options;
  if (opts.length <= 2) { iteToast('Need at least 2 options', 'info'); return; }
  opts.splice(idx, 1);
  iteRerender();
}
function iteTpToggleCorrect(id, part, idx) {
  const opts = iteState(id)[part].options;
  if (part === 'partA') opts.forEach((o, i) => o.correct = (i === idx));
  else opts[idx].correct = !opts[idx].correct;
  iteRerender();
}
function iteTpUpdateOpt(id, part, idx, val) { iteState(id)[part].options[idx].v = val; }
function iteTpUpdateStem(id, part, val)     { iteState(id)[part].stem = val; }

// ─── Two-Part · shared stimulus (Lv 2: typed and optional) ───
// Stimulus is what BOTH parts reference. Five types (matches SBAC catalog):
//   none — no shared content (pure logical Two-Part)
//   passage — text passage (ELA)
//   equation — LaTeX/inline math (Math)
//   image — uploaded diagram or chart (Science / SS)
//   table — data table (Science experiments, Math statistics)
// Each type's data is preserved in state, so switching types is non-destructive.
function iteTpSetStimType(id, type) {
  iteState(id).stimulus.type = type;
  iteRerender();
  if (type !== 'none') iteToast('Stimulus → ' + type.charAt(0).toUpperCase() + type.slice(1), 'info');
}
function iteTpSetStimPassage(id, val)   { iteState(id).stimulus.passage = val; }
function iteTpSetStimEquation(id, val)  { iteState(id).stimulus.equation = val; }
function iteTpSetStimImageAlt(id, val)  { iteState(id).stimulus.image.alt = val; }
function iteTpSetStimImageCaption(id, val) { iteState(id).stimulus.image.caption = val; }
function iteTpSimUploadImage(id) {
  const img = iteState(id).stimulus.image;
  img.uploaded = !img.uploaded;
  iteRerender();
  iteToast(img.uploaded ? 'Image uploaded · demo only' : 'Image removed', 'info');
}
function iteTpSetStimTableCap(id, val)  { iteState(id).stimulus.table.caption = val; }
function iteTpTableSetHeader(id, c, val){ iteState(id).stimulus.table.headers[c] = val; }
function iteTpTableSetCell(id, r, c, val){ iteState(id).stimulus.table.rows[r][c] = val; }
function iteTpTableAddRow(id) {
  const t = iteState(id).stimulus.table;
  t.rows.push(new Array(t.headers.length).fill(''));
  iteRerender();
}
function iteTpTableDelRow(id, r) {
  const t = iteState(id).stimulus.table;
  if (t.rows.length <= 1) { iteToast('Need at least 1 row', 'info'); return; }
  t.rows.splice(r, 1);
  iteRerender();
}
function iteTpTableAddCol(id) {
  const t = iteState(id).stimulus.table;
  t.headers.push('Col ' + (t.headers.length + 1));
  t.rows.forEach(r => r.push(''));
  iteRerender();
}
function iteTpTableDelCol(id, c) {
  const t = iteState(id).stimulus.table;
  if (t.headers.length <= 2) { iteToast('Need at least 2 columns', 'info'); return; }
  t.headers.splice(c, 1);
  t.rows.forEach(r => r.splice(c, 1));
  iteRerender();
}

// ─── Rubric ───
function iteAddRubric(id) {
  iteState(id).rubric.push({criterion:'New criterion', pts:1});
  iteRerender();
}
function iteDelRubric(id, idx) {
  const r = iteState(id).rubric;
  if (r.length <= 1) { iteToast('Need at least 1 criterion', 'info'); return; }
  r.splice(idx, 1);
  iteRerender();
}
function iteUpdateRubric(id, idx, key, val) {
  iteState(id).rubric[idx][key] = (key === 'pts') ? (parseInt(val)||0) : val;
  if (key === 'pts') iteRerender();
}

// ─── FIB blanks ───
function iteAddBlank(id)              { iteState(id).blanks.push({answers:['']}); iteRerender(); }
function iteDelBlank(id, idx) {
  const b = iteState(id).blanks;
  if (b.length <= 1) { iteToast('Need at least 1 blank', 'info'); return; }
  b.splice(idx, 1);
  iteRerender();
}
function iteAddBlankAns(id, bIdx)              { iteState(id).blanks[bIdx].answers.push(''); iteRerender(); }
function iteDelBlankAns(id, bIdx, aIdx) {
  const ans = iteState(id).blanks[bIdx].answers;
  if (ans.length <= 1) { iteToast('Need at least 1 accepted answer', 'info'); return; }
  ans.splice(aIdx, 1);
  iteRerender();
}
function iteUpdateBlankAns(id, bIdx, aIdx, val) { iteState(id).blanks[bIdx].answers[aIdx] = val; }

// ─── Grid-In equivalents ───
function iteAddEquiv(id)              { iteState(id).equivalents.push(''); iteRerender(); }
function iteDelEquiv(id, idx)         { iteState(id).equivalents.splice(idx, 1); iteRerender(); }
function iteUpdateEquiv(id, idx, val) { iteState(id).equivalents[idx] = val; }

// ─── Hot Text (Lv 2 · in-place 3-state token) ───
// Tokenize a passage based on granularity. Returns array of {text, kind}
// where kind is 'token' (clickable unit) or 'gap' (whitespace/punct decoration).
function iteHotTokenize(passage, granularity) {
  if (!passage) return [];
  if (granularity === 'Word') {
    // Split into words + the gaps between them. Preserve spaces & punctuation.
    const out = [];
    const re = /(\s+|[,;:.!?"()\u2014\u2013])/g;
    let last = 0, m;
    while ((m = re.exec(passage)) !== null) {
      if (m.index > last) out.push({text: passage.slice(last, m.index), kind:'token'});
      out.push({text: m[0], kind:'gap'});
      last = m.index + m[0].length;
    }
    if (last < passage.length) out.push({text: passage.slice(last), kind:'token'});
    return out;
  }
  if (granularity === 'Phrase (custom span)') {
    // Phrase mode: split on commas/semicolons/sentence boundaries.
    const out = [];
    const re = /([,;]|\.\s+|\?\s+|!\s+|\n+)/g;
    let last = 0, m;
    while ((m = re.exec(passage)) !== null) {
      const piece = passage.slice(last, m.index).trim();
      if (piece) out.push({text: piece, kind:'token'});
      out.push({text: m[0], kind:'gap'});
      last = m.index + m[0].length;
    }
    const tail = passage.slice(last).trim();
    if (tail) out.push({text: tail, kind:'token'});
    return out;
  }
  // Sentence mode (default)
  const out = [];
  const re = /([.!?]+\s*)/g;
  let last = 0, m;
  while ((m = re.exec(passage)) !== null) {
    const sent = passage.slice(last, m.index).trim();
    if (sent) out.push({text: sent + m[0].trim(), kind:'token'});
    if (m[0].endsWith(' ') || /\s/.test(m[0])) out.push({text:' ', kind:'gap'});
    last = m.index + m[0].length;
  }
  const tail = passage.slice(last).trim();
  if (tail) out.push({text: tail, kind:'token'});
  return out;
}
// Cycle a token: none → sel → correct → none
function iteHotCycle(id, tokenIdx) {
  const s = iteState(id);
  const cur = s.tokenStates[tokenIdx] || 'none';
  s.tokenStates[tokenIdx] = (cur === 'none') ? 'sel' : (cur === 'sel') ? 'correct' : 'none';
  iteRerender();
}
function iteHotSetPassage(id, val) {
  iteState(id).passage = val;
}
function iteHotSetGranularity(id, val) {
  const s = iteState(id);
  s.granularity = val;
  // Reset token states because token indices changed
  s.tokenStates = {};
  if (s.settings.autoSelectAll) {
    const tokens = iteHotTokenize(s.passage, val).filter(t=>t.kind==='token');
    tokens.forEach((_, i) => { s.tokenStates[i] = 'sel'; });
  }
  iteRerender();
  iteToast(`Granularity → ${val} · token states reset`, 'info');
}
function iteHotResetMarks(id) {
  iteState(id).tokenStates = {};
  iteRerender();
  iteToast('All marks cleared', 'info');
}
function iteHotMarkAllSelectable(id) {
  const s = iteState(id);
  const tokens = iteHotTokenize(s.passage, s.granularity).filter(t=>t.kind==='token');
  tokens.forEach((_, i) => { if (s.tokenStates[i] !== 'correct') s.tokenStates[i] = 'sel'; });
  iteRerender();
}

// ─── Grid-In (Lv 2 · accept range / unit / calculator / SAT bubble grid) ───
function iteGridSetRange(id, val)      { iteState(id).acceptRange = val; }
function iteGridSetUnit(id, val)       { iteState(id).unit = val; }
function iteGridSetCalc(id, val)       { iteState(id).calculator = val; iteRerender(); }
function iteGridSetDigits(id, val) {
  iteState(id).gridDigits = Math.max(3, Math.min(6, parseInt(val)||4));
  iteRerender();
}
// Render a SAT/TCAP-style bubble grid preview for a given primary answer.
// Each column shows: input box at top → blank/fraction-bar/decimal/0-9 bubbles.
// Bubbles in the column matching the primary answer's digits are filled.
function gridRenderBubbleGrid(primary, cols, allowFrac, allowDec) {
  primary = String(primary || '').trim();
  const chars = primary.split('').slice(0, cols);
  while (chars.length < cols) chars.push('');
  const colSpecs = chars.map((ch, ci) => {
    const isDigit = /[0-9]/.test(ch);
    return {
      ci,
      ch,
      isFrac: ch === '/',
      isDec:  ch === '.',
      isNeg:  ch === '-',
      digit:  isDigit ? ch : null,
    };
  });
  return `
    <div class="grid-bubble-grid" style="--cols:${cols}">
      <div class="gbb-row gbb-input-row">
        ${colSpecs.map(c => `<div class="gbb-cell"><input class="gbb-input" value="${c.ch||''}" maxlength="1" readonly></div>`).join('')}
      </div>
      <div class="gbb-row">
        ${colSpecs.map((c,i) => `<div class="gbb-cell"><span class="gbb-bub gbb-frac ${c.isFrac && allowFrac ? 'on':''} ${i===0||!allowFrac?'gbb-disabled':''}">/</span></div>`).join('')}
      </div>
      <div class="gbb-row">
        ${colSpecs.map(c => `<div class="gbb-cell"><span class="gbb-bub gbb-dec ${c.isDec && allowDec ? 'on':''} ${!allowDec?'gbb-disabled':''}">.</span></div>`).join('')}
      </div>
      ${[0,1,2,3,4,5,6,7,8,9].map(d => `
        <div class="gbb-row">
          ${colSpecs.map(c => `<div class="gbb-cell"><span class="gbb-bub ${String(d)===c.digit ? 'on':''}">${d}</span></div>`).join('')}
        </div>`).join('')}
    </div>`;
}

// ─── Drag-Drop (Lv 2 · 4 variants) ───
function iteDDSetVariant(id, v) {
  iteState(id).variant = v;
  iteRerender();
  iteToast('Drag-Drop variant → ' + v.charAt(0).toUpperCase() + v.slice(1), 'info');
}
function iteDDSetStem(id, val)         { iteState(id)[iteState(id).variant].stem = val; }
// Sentence variant
function iteDDSentSetTemplate(id, val) { iteState(id).sentence.template = val; iteRerender(); }
function iteDDSentAddChip(id)          { iteState(id).sentence.chips.push('new term'); iteRerender(); }
function iteDDSentDelChip(id, idx)     { iteState(id).sentence.chips.splice(idx, 1); iteRerender(); }
function iteDDSentUpdateChip(id, idx, val) { iteState(id).sentence.chips[idx] = val; }
function iteDDSentAddSlot(id) {
  const s = iteState(id).sentence;
  s.slots.push({answer:''});
  s.template = (s.template || '').trim() + ` {slot:${s.slots.length}}`;
  iteRerender();
}
function iteDDSentDelSlot(id, idx) {
  const s = iteState(id).sentence;
  if (s.slots.length <= 1) { iteToast('Need at least 1 slot', 'info'); return; }
  s.slots.splice(idx, 1);
  s.template = (s.template || '').replace(new RegExp(`\\s?\\{slot:${idx+1}\\}\\s?`, 'g'), ' ').replace(/\s{2,}/g,' ');
  for (let i = idx + 2; i <= s.slots.length + 1; i++) {
    s.template = s.template.replace(new RegExp(`\\{slot:${i}\\}`, 'g'), `{slot:${i-1}}`);
  }
  iteRerender();
}
function iteDDSentUpdateSlot(id, idx, val) { iteState(id).sentence.slots[idx].answer = val; }
// Bucket variant
function iteDDBucketAdd(id)            { iteState(id).bucket.buckets.push({label:'New bucket', correct:[]}); iteRerender(); }
function iteDDBucketDel(id, idx) {
  const b = iteState(id).bucket.buckets;
  if (b.length <= 2) { iteToast('Need at least 2 buckets', 'info'); return; }
  b.splice(idx, 1);
  iteRerender();
}
function iteDDBucketSetLabel(id, idx, val) { iteState(id).bucket.buckets[idx].label = val; }
function iteDDBucketSetItems(id, idx, val) {
  iteState(id).bucket.buckets[idx].correct = val.split(',').map(s => s.trim()).filter(Boolean);
  iteRerender();
}
// Match variant
function iteDDMatchAdd(id)             { iteState(id).match.pairs.push({left:'', right:''}); iteRerender(); }
function iteDDMatchDel(id, idx) {
  const p = iteState(id).match.pairs;
  if (p.length <= 2) { iteToast('Need at least 2 pairs', 'info'); return; }
  p.splice(idx, 1);
  iteRerender();
}
function iteDDMatchSet(id, idx, side, val) { iteState(id).match.pairs[idx][side] = val; }
// Image variant
function iteDDImgAddRegion(id) {
  iteState(id).image.regions.push({x:30+Math.random()*30, y:30+Math.random()*30, w:16, h:12, label:'New', correct:'New'});
  iteRerender();
}
function iteDDImgDelRegion(id, idx) {
  const r = iteState(id).image.regions;
  if (r.length <= 1) { iteToast('Need at least 1 region', 'info'); return; }
  r.splice(idx, 1);
  iteRerender();
}
function iteDDImgSetRegion(id, idx, key, val) { iteState(id).image.regions[idx][key] = val; iteRerender(); }
function iteDDImgAddChip(id)           { iteState(id).image.chips.push('new label'); iteRerender(); }
function iteDDImgDelChip(id, idx)      { iteState(id).image.chips.splice(idx, 1); iteRerender(); }
function iteDDImgUpdateChip(id, idx, val) { iteState(id).image.chips[idx] = val; }

// ─── Inline Choice (Lv 2 · {dd:N} marker syntax, single source of truth) ───
// Passage contains markers like {dd:1}, {dd:2}. Number of dropdowns auto-syncs
// to marker count: missing dropdowns are appended with defaults; extras are kept
// in case the author re-adds them, but flagged "orphan" in UI.
function iteInlineSetPassage(id, val) {
  const s = iteState(id);
  s.passage = val;
  iteInlineSyncDropdowns(id);
  iteRerender();
}
function iteInlineSyncDropdowns(id) {
  const s = iteState(id);
  const markers = (s.passage || '').match(/\{dd:(\d+)\}/g) || [];
  const numbers = markers.map(m => parseInt(m.match(/\d+/)[0])).filter(n => n>0);
  const maxN = numbers.length ? Math.max(...numbers) : 0;
  while (s.dropdowns.length < maxN) {
    s.dropdowns.push({options:['option A','option B','option C'], correct:0});
  }
}
function iteInlineAddDropdown(id) {
  const s = iteState(id);
  const next = s.dropdowns.length + 1;
  s.dropdowns.push({options:['option A','option B','option C'], correct:0});
  // Append the new marker at the end of the passage if not already present
  if (!new RegExp(`\\{dd:${next}\\}`).test(s.passage)) {
    s.passage = (s.passage || '').trim() + ` {dd:${next}}`;
  }
  iteRerender();
}
function iteInlineAddOpt(id, ddIdx) { iteState(id).dropdowns[ddIdx].options.push('new option'); iteRerender(); }
function iteInlineDelOpt(id, ddIdx, oIdx) {
  const opts = iteState(id).dropdowns[ddIdx].options;
  if (opts.length <= 2) { iteToast('Need at least 2 options per dropdown', 'info'); return; }
  opts.splice(oIdx, 1);
  if (iteState(id).dropdowns[ddIdx].correct >= opts.length) iteState(id).dropdowns[ddIdx].correct = 0;
  iteRerender();
}
function iteInlineSetCorrect(id, ddIdx, oIdx)         { iteState(id).dropdowns[ddIdx].correct = oIdx; iteRerender(); }
function iteInlineUpdateOpt(id, ddIdx, oIdx, val)     { iteState(id).dropdowns[ddIdx].options[oIdx] = val; }
function iteInlineDelDropdown(id, ddIdx) {
  const s = iteState(id);
  if (s.dropdowns.length <= 1) { iteToast('Need at least 1 dropdown', 'info'); return; }
  // Remove the marker for this dropdown number from the passage
  const markerNum = ddIdx + 1;
  s.passage = (s.passage || '').replace(new RegExp(`\\s?\\{dd:${markerNum}\\}\\s?`, 'g'), ' ').replace(/\s{2,}/g, ' ');
  s.dropdowns.splice(ddIdx, 1);
  // Renumber later markers in passage
  for (let i = markerNum + 1; i <= s.dropdowns.length + 1; i++) {
    s.passage = s.passage.replace(new RegExp(`\\{dd:${i}\\}`, 'g'), `{dd:${i-1}}`);
  }
  iteRerender();
}

// ─── Matrix (Lv 2 · 3 modes: single per row / multi per row / match pairs) ───
function iteMatrixSetMode(id, mode) {
  iteState(id).mode = mode;
  iteRerender();
  iteToast('Matrix mode → ' + (mode==='single'?'Single per row':mode==='multi'?'Multi per row':'Match pairs'), 'info');
}
function iteMatrixAddRow(id) { iteState(id).rows.push({label:'New statement', correct:0, correctSet:[]}); iteRerender(); }
function iteMatrixDelRow(id, idx) {
  const r = iteState(id).rows;
  if (r.length <= 1) { iteToast('Need at least 1 row', 'info'); return; }
  r.splice(idx, 1);
  iteRerender();
}
function iteMatrixSetCorrect(id, rowIdx, colIdx) { iteState(id).rows[rowIdx].correct = colIdx; iteRerender(); }
function iteMatrixToggleCorrect(id, rowIdx, colIdx) {
  const row = iteState(id).rows[rowIdx];
  if (!row.correctSet) row.correctSet = [];
  const i = row.correctSet.indexOf(colIdx);
  if (i >= 0) row.correctSet.splice(i, 1);
  else row.correctSet.push(colIdx);
  iteRerender();
}
function iteMatrixUpdateRow(id, rowIdx, val)     { iteState(id).rows[rowIdx].label = val; }
function iteMatrixAddCol(id) { iteState(id).columns.push('Col ' + (iteState(id).columns.length + 1)); iteRerender(); }
function iteMatrixDelCol(id, idx) {
  const c = iteState(id).columns;
  if (c.length <= 2) { iteToast('Need at least 2 columns', 'info'); return; }
  c.splice(idx, 1);
  iteState(id).rows.forEach(r => {
    if (r.correct >= c.length) r.correct = 0;
    if (r.correctSet) r.correctSet = r.correctSet.filter(i => i < c.length);
  });
  iteRerender();
}
function iteMatrixUpdateCol(id, idx, val) { iteState(id).columns[idx] = val; }
// Match-pairs sub-variant
function iteMatrixMatchAdd(id) { iteState(id).matchPairs.push({left:'',right:''}); iteRerender(); }
function iteMatrixMatchDel(id, idx) {
  const p = iteState(id).matchPairs;
  if (p.length <= 2) { iteToast('Need at least 2 pairs', 'info'); return; }
  p.splice(idx, 1);
  iteRerender();
}
function iteMatrixMatchSet(id, idx, side, val) { iteState(id).matchPairs[idx][side] = val; }

// ─── Hot Spot (Lv 2 · rect + polygon, region naming, max selections) ───
function iteHotspotSetTool(id, t) { iteState(id).activeTool = t; iteRerender(); iteToast('Tool → ' + t, 'info'); }
function iteHotspotAddRegion(id) {
  const tool = iteState(id).activeTool || 'rect';
  if (tool === 'polygon') {
    // Add a triangle-ish placeholder polygon
    const cx = 30 + Math.random() * 35, cy = 25 + Math.random() * 35;
    iteState(id).regions.push({
      kind:'polygon', name:'Region ' + (iteState(id).regions.length + 1), correct:false,
      points:[[cx,cy],[cx+15,cy+5],[cx+10,cy+18]],
    });
  } else {
    iteState(id).regions.push({
      kind:'rect', name:'Region ' + (iteState(id).regions.length + 1), correct:false,
      x:30+Math.random()*30, y:25+Math.random()*30, w:18, h:18,
    });
  }
  iteRerender();
}
function iteHotspotDelRegion(id, idx) {
  if (iteState(id).regions.length <= 1) { iteToast('Need at least 1 region', 'info'); return; }
  iteState(id).regions.splice(idx, 1);
  iteRerender();
}
function iteHotspotSetName(id, idx, val)    { iteState(id).regions[idx].name = val; iteRerender(); }
function iteHotspotToggleCorr(id, idx) {
  iteState(id).regions[idx].correct = !iteState(id).regions[idx].correct;
  iteRerender();
}
function iteHotspotSetMaxSel(id, val) { iteState(id).maxSelections = parseInt(val) || 1; }

// ─── Equation Editor (Lv 2 · grouped palette + live equivalence demo) ───
function iteEqSetPaletteTab(id, t)   { iteState(id).paletteTab = t; iteRerender(); }
function iteEqSetStudentInput(id, val){ iteState(id).studentInput = val; }
function iteEqInsert(id, sym) {
  // Append symbol to the live student-input demo so author can see palette work
  iteState(id).studentInput = (iteState(id).studentInput || '') + sym;
  iteRerender();
  iteToast(`Inserted: ${sym}`, 'info');
}
// Light-touch normalization to fake a CAS engine for the demo. Real backend
// uses a proper symbolic equivalence engine (sympy / Mathematica / WIRIS).
function iteEqNormalize(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/×|⋅|\*/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/[{}]/g, '')
    .replace(/^x=/,'')
    .replace(/[,;]/g, ',')
    .split(/(?:or|,|∨)/i)
    .map(p => p.trim())
    .filter(Boolean)
    .sort()
    .join('|');
}
function iteEqIsEquivalent(input, accepted) {
  const ni = iteEqNormalize(input);
  if (!ni) return false;
  return accepted.some(a => iteEqNormalize(a) === ni);
}

// ─── Graphing (Lv 2 · 6 graph types with distinct reference canvases) ───
function iteGraphSetType(id, t) {
  iteState(id).graphType = t;
  iteRerender();
  iteToast('Graph type → ' + t, 'info');
}
function iteGraphSetAnswerForType(id, val) {
  iteState(id).answerByType[iteState(id).graphType] = val;
  iteState(id).answer = val;
}
function iteGraphSetTolerance(id, val) { iteState(id).tolerance = val; }
// Render the reference visual for the chosen graph type as inline SVG.
function iteGraphRender(type) {
  if (type === 'point') {
    return `
      <svg viewBox="0 0 200 140" class="gr-svg">
        <line x1="0" y1="70" x2="200" y2="70" class="gr-axis"/>
        <line x1="100" y1="0" x2="100" y2="140" class="gr-axis"/>
        ${[20,40,60,80,120,140,160,180].map(x => `<line x1="${x}" y1="68" x2="${x}" y2="72" class="gr-tick"/>`).join('')}
        ${[10,30,50,90,110,130].map(y => `<line x1="98" y1="${y}" x2="102" y2="${y}" class="gr-tick"/>`).join('')}
        <circle cx="140" cy="40" r="5" class="gr-pt"/>
        <text x="146" y="36" class="gr-lbl">(2, 3)</text>
      </svg>`;
  }
  if (type === 'line') {
    return `
      <svg viewBox="0 0 200 140" class="gr-svg">
        <line x1="0" y1="70" x2="200" y2="70" class="gr-axis"/>
        <line x1="100" y1="0" x2="100" y2="140" class="gr-axis"/>
        <line x1="20" y1="110" x2="180" y2="30" class="gr-line"/>
        <circle cx="100" cy="60" r="4" class="gr-pt"/>
        <text x="106" y="56" class="gr-lbl">(0, 1)</text>
        <circle cx="140" cy="40" r="4" class="gr-pt"/>
        <text x="146" y="36" class="gr-lbl">(2, 3)</text>
      </svg>`;
  }
  if (type === 'parabola') {
    return `
      <svg viewBox="0 0 200 140" class="gr-svg">
        <line x1="0" y1="70" x2="200" y2="70" class="gr-axis"/>
        <line x1="100" y1="0" x2="100" y2="140" class="gr-axis"/>
        <path d="M 20 30 Q 100 200 180 30" class="gr-line" fill="none"/>
        <circle cx="60" cy="70" r="4" class="gr-pt"/>
        <circle cx="140" cy="70" r="4" class="gr-pt"/>
        <text x="44" y="86" class="gr-lbl">(−2, 0)</text>
        <text x="124" y="86" class="gr-lbl">(2, 0)</text>
        <circle cx="100" cy="120" r="4" class="gr-pt"/>
        <text x="106" y="124" class="gr-lbl">(0, −4)</text>
      </svg>`;
  }
  if (type === 'region') {
    return `
      <svg viewBox="0 0 200 140" class="gr-svg">
        <defs>
          <pattern id="diag" patternUnits="userSpaceOnUse" width="6" height="6"><path d="M 0,6 L 6,0" stroke="#7c3aed" stroke-width=".6" opacity=".5"/></pattern>
        </defs>
        <line x1="0" y1="70" x2="200" y2="70" class="gr-axis"/>
        <line x1="100" y1="0" x2="100" y2="140" class="gr-axis"/>
        <polygon points="20,110 180,30 200,0 0,0" fill="url(#diag)"/>
        <line x1="20" y1="110" x2="180" y2="30" class="gr-line gr-dashed"/>
        <text x="60" y="40" class="gr-lbl">y &gt; 2x − 1</text>
      </svg>`;
  }
  if (type === 'numberline') {
    return `
      <svg viewBox="0 0 200 60" class="gr-svg" style="height:80px">
        <line x1="10" y1="30" x2="190" y2="30" class="gr-axis" stroke-width="1.5"/>
        <polygon points="190,30 184,26 184,34" class="gr-axis" fill="#27272a"/>
        <polygon points="10,30 16,26 16,34" class="gr-axis" fill="#27272a"/>
        ${[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n,i) => `
          <line x1="${20+i*16}" y1="26" x2="${20+i*16}" y2="34" class="gr-tick"/>
          <text x="${20+i*16}" y="48" class="gr-lbl" text-anchor="middle">${n}</text>`).join('')}
        <circle cx="68" cy="30" r="6" class="gr-pt-closed"/>
        <text x="68" y="18" class="gr-lbl" text-anchor="middle">−2</text>
        <circle cx="180" cy="30" r="6" class="gr-pt-closed"/>
        <text x="180" y="18" class="gr-lbl" text-anchor="middle">5</text>
      </svg>`;
  }
  if (type === 'inequality') {
    return `
      <svg viewBox="0 0 200 60" class="gr-svg" style="height:80px">
        <line x1="10" y1="30" x2="190" y2="30" class="gr-axis" stroke-width="1.5"/>
        <polygon points="190,30 184,26 184,34" class="gr-axis" fill="#27272a"/>
        ${[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n,i) => `
          <line x1="${20+i*16}" y1="26" x2="${20+i*16}" y2="34" class="gr-tick"/>
          <text x="${20+i*16}" y="48" class="gr-lbl" text-anchor="middle">${n}</text>`).join('')}
        <line x1="84" y1="30" x2="190" y2="30" stroke="#16a34a" stroke-width="3"/>
        <circle cx="84" cy="30" r="6" class="gr-pt-closed"/>
        <text x="84" y="18" class="gr-lbl" text-anchor="middle">x ≥ −1</text>
      </svg>`;
  }
  return '<div class="gr-empty">No reference visual for this type yet.</div>';
}

// ─── Listening / Audio (Lv 2 · flexible follow-up + waveform + segments) ───
function iteAudioSetFollowup(id, t)        { iteState(id).followupType = t; iteRerender(); iteToast('Follow-up → ' + t.toUpperCase(), 'info'); }
function iteAudioFibAdd(id)                { iteState(id).fibAnswers.push(''); iteRerender(); }
function iteAudioFibDel(id, idx) {
  const a = iteState(id).fibAnswers;
  if (a.length <= 1) { iteToast('Need at least 1 answer', 'info'); return; }
  a.splice(idx, 1); iteRerender();
}
function iteAudioFibUpdate(id, idx, val)   { iteState(id).fibAnswers[idx] = val; }
function iteAudioCrSet(id, val)            { iteState(id).crSample = val; }
function iteAudioSegAdd(id) {
  const segs = iteState(id).segments;
  const dur = iteState(id).durationSec || 60;
  const last = segs.length ? segs[segs.length-1].end : 0;
  const nextEnd = Math.min(last + 15, dur);
  segs.push({start: last, end: nextEnd, label: 'Segment ' + (segs.length + 1)});
  iteRerender();
}
function iteAudioSegDel(id, idx) {
  const segs = iteState(id).segments;
  segs.splice(idx, 1);
  iteRerender();
}
function iteAudioSegSet(id, idx, key, val) {
  const v = (key === 'label') ? val : (parseInt(val) || 0);
  iteState(id).segments[idx][key] = v;
  iteRerender();
}
// Format seconds as M:SS
function audioFmtTime(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
}

// ─── Sources / Checklist ───
function iteAddSource(id)              { iteState(id).sources.push({label:'New source'}); iteRerender(); }
function iteDelSource(id, idx)         { iteState(id).sources.splice(idx, 1); iteRerender(); }
function iteUpdateSource(id, idx, val) { iteState(id).sources[idx].label = val; }
function iteAddChecklist(id)           { iteState(id).checklist.push('New item'); iteRerender(); }
function iteDelChecklist(id, idx) {
  if (iteState(id).checklist.length <= 1) { iteToast('Need at least 1 checklist item', 'info'); return; }
  iteState(id).checklist.splice(idx, 1);
  iteRerender();
}
function iteUpdateChecklist(id, idx, val) { iteState(id).checklist[idx] = val; }

// ─── Defaults for each type ───
const ITE_DEFAULTS = {
  mc: {
    stem: 'Which fraction is equivalent to 2/4?',
    options: [{v:'1/2',correct:true},{v:'1/3',correct:false},{v:'2/3',correct:false},{v:'3/4',correct:false}],
    explanation: '',
    settings: {shuffle:true, lockdown:false, eliminator:true, partial:true, penalize:false},
    minSel: '1', maxSel: 'All',
    multi: false,
  },
  twopart: {
    // Shared stimulus is OPTIONAL and TYPED — Part A & B reference it but the
    // item also works with no stimulus at all (e.g. a pure logical Two-Part).
    // Each type's data is preserved when switching, so the author can experiment.
    stimulus: {
      type: 'passage', // 'none' | 'passage' | 'equation' | 'image' | 'table'
      passage: 'The garden was bright with sunflowers, but Maya barely noticed. She kept walking, past the hedges and the old fountain, her hands deep in her pockets. The note from her grandmother sat folded in her palm. The path felt longer than it had yesterday.\n\nThree years had passed since they last spoke. Yet here she was, doing what was asked of her. Even the dark afternoons could not change that. She would keep going, one step at a time.',
      equation: 'y = 2x + 3',
      image: {filename:'cell_diagram.png', alt:'Labeled diagram of a plant cell', caption:'Figure 1 · Plant cell organelles', uploaded:false},
      table: {
        caption: 'Density of three liquid samples',
        headers: ['Trial', 'Mass (g)', 'Volume (mL)', 'Density (g/mL)'],
        rows: [
          ['1', '24.5', '10.0', '2.45'],
          ['2', '48.7', '20.0', '2.44'],
          ['3', '73.2', '30.0', '2.44'],
        ],
      },
    },
    partA: {stem:'What is the central theme of the passage?', options:[{v:'Resilience in the face of loss',correct:true},{v:'The thrill of adventure',correct:false},{v:'Trust in nature',correct:false},{v:'The joy of solitude',correct:false}]},
    partB: {stem:'Which sentences from the passage best support your answer to Part A? Select two.', options:[{v:'"She kept walking, past the hedges and the old fountain…"',correct:true},{v:'"The garden was bright with sunflowers."',correct:false},{v:'"Three years had passed since they last spoke."',correct:false},{v:'"Even the dark afternoons could not change that."',correct:true}]},
    settings: {mode:'composite', linked:false},
  },
  fib: {
    stem: 'The capital of Tennessee is [blank]. The Mississippi River flows past the city of [blank].',
    blanks: [{answers:['Nashville','nashville']},{answers:['Memphis']}],
    explanation: '',
    settings: {caseInsensitive:true, trim:true, aiSynonyms:true},
  },
  gridin: {
    stem: 'Solve for x: 3x + 5 = 20',
    primary: '5',
    tolerance: '±0.01',
    equivalents: ['5/1','5.0','5.00'],
    explanation: '',
    // SAT/TCAP-style numeric grid + new accept-range / unit / calculator settings
    acceptRange: '',           // e.g. '[3, 5]' or '4 ± 0.5'
    unit: '',                  // e.g. 'meters', 'kg', '%'
    calculator: 'basic',       // 'none' | 'basic' | 'scientific' | 'desmos'
    gridDigits: 4,             // number of bubble columns (3-5 typical)
    settings: {fractions:true, decimals:true, negative:false, bubbles:true, scientific:false, showGridToStudent:true},
  },
  cr: {
    stem: 'Explain why mitochondria are called the "powerhouse of the cell." Use specific evidence from the text.',
    sample: 'Mitochondria are called the powerhouse of the cell because they produce most of the cell\'s ATP through cellular respiration. The text states that the electron transport chain in the mitochondria produces approximately 34 ATP molecules per glucose, far more than glycolysis or the Krebs cycle.',
    rubric: [{criterion:'Identifies ATP production',pts:2},{criterion:'Mentions cellular respiration',pts:1},{criterion:'Cites textual evidence',pts:1}],
    settings: {aiGrade:true, teacherReview:true},
    wordLimit: 200,
  },
  essay: {
    stem: 'Some schools are considering switching to a four-day school week, with longer days and Fridays off. Write an opinion essay arguing whether your school should adopt this schedule. Use evidence from the sources provided.',
    sources: [{label:'Source A — "The Case for a 4-Day Week" (article, 380 words)'},{label:'Source B — Survey: Parent perspectives (chart + 200 words)'}],
    checklist: ['State your opinion clearly in the introduction','Use evidence from at least 2 sources','Address the opposing view','Conclude with a call to action'],
    rubric: [{criterion:'Focus & purpose',pts:4},{criterion:'Use of evidence',pts:3},{criterion:'Organization',pts:2},{criterion:'Conventions',pts:1}],
    settings: {planning:true, spellcheck:true},
    minWords: 250, maxWords: 500,
  },
  hottext: {
    // SBAC/Cambium pattern — author edits the SAME passage students see.
    // `passage` is the raw text. Tokenization happens at render time based
    // on `granularity`. `tokenStates` maps token index → 3-state:
    //   'none'    — decoration / non-clickable
    //   'sel'     — selectable (student can click) but not correct
    //   'correct' — selectable AND correct
    // Click on a token in the passage cycles: none → sel → correct → none.
    stem: 'Click the sentence(s) that best support the central idea of the passage.',
    passage: 'Many cities across the United States have grown rapidly in recent decades. This rapid growth has placed serious strain on water and electrical infrastructure. Some local governments are responding with new conservation policies. Engineers are also developing more efficient grid technologies. Without these changes, supply shortages may become common in coming years.',
    granularity: 'Sentence',
    tokenStates: {0:'sel', 1:'correct', 2:'sel', 3:'sel', 4:'correct'},
    explanation: '',
    settings: {partial:false, autoSelectAll:true},
    requiredCount: 2,
  },
  dragdrop: {
    // Lv 2: 4 variants (Learnosity-style). Variant data isolated; switching
    // preserves all four configurations.
    variant: 'sentence',  // 'sentence' | 'bucket' | 'match' | 'image'
    sentence: {
      stem: 'Drag each term into the correct blank to complete the sentence.',
      template: 'A {slot:1} makes its own food using sunlight, while a {slot:2} eats other organisms for energy.',
      slots: [{answer:'producer'},{answer:'consumer'}],
      chips: ['producer','consumer','decomposer','parasite','predator'],
    },
    bucket: {
      stem: 'Sort each animal into the correct ecosystem.',
      buckets: [
        {label:'Ocean',  correct:['shark','octopus','tuna']},
        {label:'Forest', correct:['deer','squirrel','owl']},
        {label:'Desert', correct:['lizard','scorpion','camel']},
      ],
    },
    match: {
      stem: 'Match each U.S. state with its capital.',
      pairs: [
        {left:'Tennessee',     right:'Nashville'},
        {left:'California',    right:'Sacramento'},
        {left:'Massachusetts', right:'Boston'},
        {left:'Florida',       right:'Tallahassee'},
      ],
    },
    image: {
      stem: 'Drag each label onto the correct organelle in the cell diagram.',
      imageFile: 'plant_cell.png',
      imageAlt: 'Cross-section of a plant cell',
      regions: [
        {x:30, y:35, w:14, h:14, label:'Nucleus',      correct:'Nucleus'},
        {x:60, y:25, w:18, h:10, label:'Chloroplast',  correct:'Chloroplast'},
        {x:50, y:60, w:20, h:12, label:'Cell wall',    correct:'Cell wall'},
      ],
      chips: ['Nucleus','Chloroplast','Cell wall','Mitochondria','Vacuole'],
    },
    settings: {redrag:true, partial:true, shuffle:true},
  },
  inline: {
    // Single-source-of-truth: the stem IS the passage. Use {dd:N} markers
    // wherever a dropdown should appear. Number of dropdowns auto-syncs to
    // marker count. Best practice from Cambium / SBAC / Learnosity.
    stem: 'Read the paragraph and choose the correct word for each blank.',
    passage: 'The dog {dd:1} when the door opened, and the cat {dd:2} away in surprise. Then the children {dd:3} and chased after them.',
    dropdowns: [
      {options:['barked','bark','barking'], correct:0},
      {options:['ran','run','running'], correct:0},
      {options:['laughed','laugh','laughing'], correct:0},
    ],
    settings: {perBlank:true, showCount:false, shuffleOpts:false},
  },
  matrix: {
    // Lv 2: 3 mode tabs at top — Single per row / Multi per row / Match pairs.
    // Single & Multi share rows×columns. Match has its own left↔right pairs.
    mode: 'single', // 'single' | 'multi' | 'match'
    stem: 'Mark whether each statement about photosynthesis is True, False, or Not Stated.',
    columns: ['True','False','Not Stated'],
    rows: [
      {label:'Photosynthesis releases oxygen', correct:0,    correctSet:[0]},
      {label:'Plants need sunlight at night',  correct:1,    correctSet:[1]},
      {label:'All plants are the color green', correct:2,    correctSet:[2]},
    ],
    matchPairs: [
      {left:'Mitochondria',  right:'Cellular respiration'},
      {left:'Chloroplast',   right:'Photosynthesis'},
      {left:'Ribosome',      right:'Protein synthesis'},
      {left:'Nucleus',       right:'DNA storage'},
    ],
    settings: {partial:true, shuffleRows:false},
  },
  eq: {
    stem: 'Solve for x. Show your work using the equation editor.   2x² − 8 = 0',
    equivalents: ['x = ±2','{-2, 2}','x = 2 or x = -2'],
    studentInput: 'x = 2 or x = -2',  // demo: what a student might type
    paletteTab: 'operators',          // 'greek' | 'operators' | 'functions' | 'templates'
    settings: {engine:'CAS', orderInsensitive:true, simplificationHint:false, allowGraphing:true},
  },
  graph: {
    // Lv 2: 6 graph types — each renders a different reference canvas
    graphType: 'line',  // 'point' | 'line' | 'parabola' | 'region' | 'numberline' | 'inequality'
    stem: 'Plot the line y = x + 1',
    answer: '2 points: (0,1) and (2,3)',
    answerByType: {
      point:      '(2, 3)',
      line:       '2 points: (0,1) and (2,3) — slope 1, y-intercept 1',
      parabola:   'y = x² − 4 — vertex (0,−4), zeros at ±2',
      region:     'y > 2x − 1 — shade above the dashed boundary line',
      numberline: 'x = −2 (closed) and x = 5 (closed)',
      inequality: 'x ≥ −1 — closed circle at −1, shaded right',
    },
    tolerance: '±0.25',
    tools: {plotPoint:true, drawLine:true, segment:false, shade:false, snap:true},
  },
  hotspot: {
    // Lv 2: regions support both rect and polygon. Each region is named (e.g.
    // "Mitochondria") and tagged correct/distractor.
    stem: 'Click on the mitochondria in the diagram of the cell.',
    imageFile: 'plant_cell.png',
    imageAlt: 'Cross-section of a plant cell showing organelles',
    activeTool: 'rect',  // 'rect' | 'polygon' (which tool the author is currently using)
    regions: [
      {kind:'rect',    name:'Mitochondria',  correct:true,  x:30, y:25, w:25, h:35},
      {kind:'polygon', name:'Chloroplast',   correct:false, points:[[60,25],[78,28],[82,42],[72,52],[58,46]]},
      {kind:'rect',    name:'Cell wall',     correct:false, x:5,  y:5,  w:90, h:90},
    ],
    settings: {multiCorrect:true, hover:true, snapGrid:false, showOutlines:true},
    maxSelections: 1,
    requiredClicks: 1,
  },
  editing: {
    // Editing Task — TCAP ELA SP4 / ACT English. Authoring contract mirrors
    // inline-cloze: a passage with {ed:N} markers, plus per-edit metadata
    // (original, options[A is always NO CHANGE], answer, tag for diagnostic).
    stem: 'Read the passage. For each underlined and numbered phrase, decide whether it should be revised. If the original wording is best, choose NO CHANGE.',
    passage: 'My grandmother lived on a small farm in West Tennessee, and every July my cousins and I {ed:1} to visit her. She kept chickens, an old goat named Pepper, and a vegetable garden {ed:2} stretched almost to the creek. On rainy mornings we would sit on her porch and listen {ed:3} her tell stories about her own childhood. By the time we left in August, {ed:4} wanted to go home.',
    edits: [
      {original:'would travel',     options:['NO CHANGE','traveled','will travel','traveling'],     answer:0, tag:'verb tense · past habitual'},
      {original:'who',              options:['NO CHANGE','that','which','where'],                   answer:2, tag:'relative pronoun · for non-person antecedent'},
      {original:'as',               options:['NO CHANGE','with','while','after'],                   answer:0, tag:'subordinating conjunction'},
      {original:'each of us never', options:['NO CHANGE','none of us','each of us','no one of us'], answer:1, tag:'double negative · subject–verb agreement'},
    ],
    settings: {perEdit:true, shuffleOpts:false, showTags:true},
  },
  audio: {
    // Lv 2: follow-up question type is selectable (MC/MS/FIB/CR), waveform
    // visualization, and segment markers for "play 0:30-1:00 then answer".
    stem: 'What does Anna want?',
    audioFile: 'dialogue_classroom.mp3',
    duration: '1:24',
    durationSec: 84,
    transcript: 'Anna: Hi, I\'m looking for a book about birds for my brother. Librarian: Do you know what age he is? Anna: He\'s seven. Librarian: Then the picture-book section will work best — let me show you…',
    followupType: 'mc',  // 'mc' | 'ms' | 'fib' | 'cr'
    // MC/MS share `options`. FIB uses `fibAnswers`. CR uses `crSample`.
    options: [{v:'A book about birds for her brother',correct:true},{v:'A quiet space to study',correct:false},{v:'Help with her homework',correct:false}],
    multi: false,
    fibAnswers: ['picture-book section', 'picture book section'],
    crSample: 'Anna wants help finding a book about birds appropriate for her seven-year-old brother. The librarian suggests the picture-book section.',
    segments: [
      {start:0,  end:32, label:'Anna asks for help'},
      {start:32, end:60, label:'Librarian asks about age'},
      {start:60, end:84, label:'Librarian recommends section'},
    ],
    settings: {replayLimit:'2', transcriptShow:false, autoPause:true},
  },
};

function renderItemTypesEdit() {
  const t = ITEM_TYPES.find(x => x.id === _iteCurrentId) || ITEM_TYPES[0];
  document.getElementById('iteTopbar').innerHTML = `
    <button class="ite-back" onclick="nav('item-types')">← Item Types Library</button>
    <span class="ite-divider"></span>
    <span class="ite-title">Teacher Edit Workbench <small>· author every item type in one place</small></span>
    <span class="ite-cnt">${ITEM_TYPES.length} types</span>
    <div class="ite-actions">
      <button onclick="iteResetType()" title="Restore default values for this item type">↺ Reset</button>
      <button onclick="switchRole('student',true);openItemTypesStu('${t.id}')">👀 Try as student</button>
      <button onclick="iteSaveDraft()">💾 Save draft</button>
      <button class="primary" onclick="iteAddToAssessment()">＋ Add to assessment</button>
    </div>
  `;
  document.getElementById('iteSide').innerHTML = renderIteSidebar();
  document.getElementById('iteMain').innerHTML = renderIteMain(t);
  document.getElementById('iteProp').innerHTML = '';
}

function renderIteSidebar() {
  const phaseGroups = [
    {phase:'must',  label:'MVP must-have',    color:'#16a34a'},
    {phase:'nice',  label:'MVP nice-to-have', color:'#f59e0b'},
    {phase:'phase2',label:'Phase 2 backlog',  color:'#6b7280'},
  ];
  return phaseGroups.map(g => {
    const items = ITEM_TYPES.filter(t => t.phase === g.phase);
    return `
      <div class="ite-side-head"><span class="dot" style="background:${g.color}"></span>${g.label} <span style="float:right;color:#71717a;font-weight:600">${items.length}</span></div>
      ${items.map(t => {
        const isActive = t.id === _iteCurrentId;
        const modeHint = t.id === 'mc' ? '<span class="nm-mode-hint">Single · Multi</span>' : '';
        return `
        <div class="ite-nav-item ${isActive ? 'active' : ''}" onclick="_iteCurrentId='${t.id}';renderItemTypesEdit()">
          <div class="nm-ic">${t.icon}</div>
          <div class="nm-meta">
            <div class="nm-name">${t.name}${modeHint}</div>
            <div class="nm-tag">${t.subjects.slice(0,2).join(' · ')}</div>
          </div>
          <span class="nm-flag">${isActive ? '●' : ''}</span>
        </div>`;
      }).join('')}
    `;
  }).join('');
}

function renderIteMain(t) {
  const phaseLabels = {must:'MVP must-have', nice:'MVP nice-to-have', phase2:'Phase 2 backlog'};
  const isGap = t.kira && /not supported/i.test(t.kira);
  const banner = isGap
    ? `<div class="ed-banner ${t.phase==='phase2'?'ph2':''}">⚠️ <div><b>${t.kira}.</b> ${t.phase==='phase2'?'This editor design lives in the prototype so we can validate UX with TN piloters before engineering builds it. Not in v1.':'Engineering needs to add this item type before TCAP pilot launch (Aug 3, 2025).'}</div></div>`
    : `<div class="ed-banner ok">✅ <div><b>${t.kira}.</b> The editor below maps to the existing Kira authoring API and can be wired up directly.</div></div>`;
  return `
    <div class="ed-head">
      <div class="ed-icon">${t.icon}</div>
      <div class="ed-titles">
        <div class="ed-name">${t.name} <span class="itl-phase ${t.phase}">${phaseLabels[t.phase]}</span></div>
        <div class="ed-sub">${t.sub}</div>
      </div>
    </div>
    ${banner}
    ${ITEM_EDITOR_BUILDERS[t.id] ? ITEM_EDITOR_BUILDERS[t.id](t) : '<div class="ed-card">Editor not yet designed.</div>'}
  `;
}

// ─── Properties panel state ───
let _itePropState = {};
const ITE_PROP_DEFAULTS = {
  points: '1',
  difficulty: 'Medium',
  time: '90',
  dismissedAi: [],
};
function iteProp(id) {
  if (!_itePropState[id]) _itePropState[id] = {
    points: (ITEM_TYPES.find(t=>t.id===id)?.scoring.match(/\d+/) || ['1'])[0],
    difficulty: 'Medium',
    time: '90',
    standards: [...(ITEM_TYPES.find(t=>t.id===id)?.standards || [])],
    subjects:  [...(ITEM_TYPES.find(t=>t.id===id)?.subjects  || [])],
    dismissedAi: [],
  };
  return _itePropState[id];
}
function itePropSet(id, key, val)   { iteProp(id)[key] = val; iteRerender(); }
function itePropDelStd(id, idx)     { iteProp(id).standards.splice(idx,1); iteRerender(); }
function itePropAddStd(id) {
  const v = prompt('Standard code (e.g. 5.RL.KID.2)');
  if (v && v.trim()) { iteProp(id).standards.push(v.trim()); iteRerender(); }
}
function itePropDelSubj(id, idx)    { iteProp(id).subjects.splice(idx,1); iteRerender(); }
function itePropAddSubj(id) {
  const v = prompt('Subject (e.g. ELA, Math, Science)');
  if (v && v.trim()) { iteProp(id).subjects.push(v.trim()); iteRerender(); }
}
function iteAiAct(id, idx, action) {
  iteProp(id).dismissedAi.push(idx);
  iteToast(action === 'apply' ? 'AI suggestion applied' : 'AI suggestion dismissed');
  iteRerender();
}

function renderIteProp(t) {
  const p = iteProp(t.id);
  const aiCards = [
    {head:'✦ Suggested rephrasing',  text:'Make the stem more concrete: "<i>Identify the central theme of paragraphs 2–4.</i>"', primary:'Apply'},
    {head:'✦ Distractor analysis',   text:'Option C may be too easy to eliminate. Consider tightening the language.',           primary:'Suggest fix'},
  ];
  return `
    <div class="pp-section">
      <div class="pp-title">Item properties</div>
      <div class="pp-row"><span class="lab">Question type</span><span class="val">${t.name}</span></div>
      <div class="pp-row"><span class="lab">Points</span>
        <input type="number" min="0" value="${p.points}" oninput="iteProp('${t.id}').points=this.value" style="width:60px;border:1px solid #e4e4e7;border-radius:6px;padding:3px 6px;font-size:12px;font-weight:700;text-align:right">
      </div>
      <div class="pp-row"><span class="lab">Difficulty</span>
        <select onchange="itePropSet('${t.id}','difficulty',this.value)" style="border:1px solid #e4e4e7;border-radius:6px;padding:3px 6px;font-size:12px;font-weight:600;background:#fff">
          ${['Easy','Medium','Hard'].map(d => `<option ${d===p.difficulty?'selected':''}>${d}</option>`).join('')}
        </select>
      </div>
      <div class="pp-row"><span class="lab">Time est.</span>
        <span style="display:inline-flex;align-items:center;gap:4px"><input type="number" min="10" value="${p.time}" oninput="iteProp('${t.id}').time=this.value" style="width:54px;border:1px solid #e4e4e7;border-radius:6px;padding:3px 6px;font-size:12px;font-weight:700;text-align:right"><span style="font-size:11px;color:#71717a">sec</span></span>
      </div>
    </div>
    <div class="pp-section">
      <div class="pp-title">Standards alignment</div>
      <div class="pp-pills">
        ${p.standards.map((s, i) => `<span class="ed-pill std" style="cursor:pointer" onclick="itePropDelStd('${t.id}',${i})" title="Click to remove">${s} ×</span>`).join('')}
        <span class="ed-pill" style="cursor:pointer;background:#f4f4f5;color:#52525b" onclick="itePropAddStd('${t.id}')">+ Add</span>
      </div>
      <div style="font-size:11px;color:#71717a;margin-top:8px;line-height:1.5">Linked to <b>${p.standards[0] || '—'}</b> — Determine a theme and explain how it is conveyed through key details.</div>
    </div>
    <div class="pp-section">
      <div class="pp-title">Subjects</div>
      <div class="pp-pills">
        ${p.subjects.map((s, i) => `<span class="ed-pill" style="cursor:pointer" onclick="itePropDelSubj('${t.id}',${i})" title="Click to remove">${s} ×</span>`).join('')}
        <span class="ed-pill" style="cursor:pointer;background:#f4f4f5;color:#52525b" onclick="itePropAddSubj('${t.id}')">+ Add</span>
      </div>
    </div>
    <div class="pp-section">
      <div class="pp-title">Scoring rules</div>
      <div style="font-size:12px;color:#27272a;line-height:1.55">${t.scoring}</div>
    </div>
    <div class="pp-section">
      <div class="pp-title">✦ Kira AI assist</div>
      ${aiCards.map((c, i) => p.dismissedAi.includes(i) ? '' : `
      <div class="pp-ai-card" ${i>0?'style="margin-top:8px"':''}>
        <div class="ai-head">${c.head}</div>
        <div class="ai-text">${c.text}</div>
        <div class="ai-actions"><button onclick="iteAiAct('${t.id}',${i},'dismiss')">Dismiss</button><button class="primary" onclick="iteAiAct('${t.id}',${i},'apply')">${c.primary}</button></div>
      </div>`).join('')}
      ${p.dismissedAi.length === aiCards.length ? `<div style="font-size:11px;color:#a1a1aa;text-align:center;padding:14px 0;font-style:italic">All suggestions resolved · check back after edits</div>` : ''}
    </div>
    <div class="pp-section">
      <div class="pp-title">Audit</div>
      <div class="pp-row"><span class="lab">Source</span><span class="val">Kira AI · reviewed</span></div>
      <div class="pp-row"><span class="lab">Last edited</span><span class="val">2 min ago</span></div>
      <div class="pp-row"><span class="lab">Author</span><span class="val">Mr. Rivera</span></div>
    </div>
  `;
}

// ─── Reusable row helpers ───
function edStemTools() {
  return `<div class="ed-stem-tools"><button class="et-btn">B</button><button class="et-btn"><i>I</i></button><button class="et-btn">U</button><button class="et-btn">∑</button><button class="et-btn">📷</button></div>`;
}
function edToggle(id, key) {
  const on = !!iteState(id).settings[key];
  return `<div class="ed-toggle ${on?'':'off'}" onclick="iteToggleSetting('${id}','${key}')"></div>`;
}
function edToolToggle(id, key) {
  const on = !!iteState(id).tools[key];
  return `<div class="ed-toggle ${on?'':'off'}" onclick="iteToggleTool('${id}','${key}')"></div>`;
}
function mcOptRow(id, idx, multi) {
  const opt = iteState(id).options[idx];
  const cls = (opt.correct ? 'correct ' : '') + (multi ? 'square' : '');
  const marker = opt.correct ? (multi ? '✓' : '●') : '';
  const letter = String.fromCharCode(65 + idx);
  return `<div class="ed-opt-row ${cls}">
    <span class="ed-opt-marker" onclick="iteToggleCorrect('${id}',${idx})" title="Toggle correct answer">${marker}</span>
    <span class="ed-opt-letter">${letter}</span>
    <input class="ed-opt-input" value="${(opt.v||'').replace(/"/g,'&quot;')}" oninput="iteUpdateOpt('${id}',${idx},this.value)" placeholder="Option text">
    <span class="ed-opt-actions">
      <button onclick="iteMoveOpt('${id}',${idx},-1)" title="Move up">↑</button>
      <button onclick="iteMoveOpt('${id}',${idx},1)" title="Move down">↓</button>
      <button onclick="iteDelOpt('${id}',${idx})" title="Delete">×</button>
    </span>
  </div>`;
}
function tpOptRow(id, part, idx) {
  const multi = part === 'partB';
  const opt = iteState(id)[part].options[idx];
  const cls = (opt.correct ? 'correct ' : '') + (multi ? 'square' : '');
  const marker = opt.correct ? (multi ? '✓' : '●') : '';
  const letter = String.fromCharCode(65 + idx);
  return `<div class="ed-opt-row ${cls}">
    <span class="ed-opt-marker" onclick="iteTpToggleCorrect('${id}','${part}',${idx})" title="Toggle correct">${marker}</span>
    <span class="ed-opt-letter">${letter}</span>
    <input class="ed-opt-input" value="${(opt.v||'').replace(/"/g,'&quot;')}" oninput="iteTpUpdateOpt('${id}','${part}',${idx},this.value)">
    <span class="ed-opt-actions"><button onclick="iteTpDelOpt('${id}','${part}',${idx})" title="Delete">×</button></span>
  </div>`;
}
function rubricRow(id, idx) {
  const r = iteState(id).rubric[idx];
  return `<div class="ed-rubric-row">
    <input value="${(r.criterion||'').replace(/"/g,'&quot;')}" oninput="iteUpdateRubric('${id}',${idx},'criterion',this.value)" placeholder="Criterion">
    <input class="pts" type="number" value="${r.pts}" oninput="iteUpdateRubric('${id}',${idx},'pts',this.value)" min="0">
    <button class="ed-add-opt" style="padding:4px 8px" onclick="iteDelRubric('${id}',${idx})">×</button>
  </div>`;
}

// ─── Generic q-card shell — matches platform's renderQuestionCard chrome ───
// All "existing" item types (MC/MS/TP/FIB/CR/GRIDIN/ESSAY/HOTTEXT/Audio) render
// inside this shell so the editor matches what teachers already see in the
// Assessment Editor. The bodyHtml slot is type-specific.
function qCardShell(id, opts) {
  const s = iteState(id);
  const p = iteProp(id);
  const typeName = opts.typeName || 'Question';
  const badges = (opts.badges || []).join('');
  const num = opts.num || '1';
  const stemHandler = opts.stemHandler || `iteSetStem('${id}',this.value)`;
  const stemValue = opts.stem !== undefined ? opts.stem : (s.stem || '');
  return `
    <div class="q-card selected" style="cursor:default;margin-bottom:0">
      <div class="q-card-inner">
        <div class="q-card-head">
          <span class="q-card-num">${num}</span>
          <div style="display:flex;flex:1;justify-content:space-between;align-items:center;gap:8px">
            <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
              <span class="q-card-type">${typeName}</span>
              ${badges}
            </div>
            <div class="q-card-actions">
              <button class="act-btn act-btn-ghost" title="Kira AI assist" onclick="iteToast('AI assist — see right panel','info')">${ICONS.sparkle}</button>
              <button class="act-btn act-btn-outline" title="Item properties — see right panel" onclick="iteToast('Item properties — see right panel','info')">${ICONS.sliders}</button>
              <div class="score-input-group">
                <input value="${p.points}" oninput="iteProp('${id}').points=this.value">
                <span class="unit">${parseInt(p.points)>1?'pts':'pt'}</span>
              </div>
              <button class="act-btn act-btn-outline" title="More" onclick="iteToast('More options coming soon','info')">${ICONS.dots3}</button>
            </div>
          </div>
        </div>
        <div class="q-card-body">
          ${opts.modeTabsSlot || ''}
          ${opts.stemSlot === false ? '' : `<textarea class="q-stem-edit" oninput="${stemHandler}" placeholder="${opts.stemPlaceholder||'Question stem…'}">${stemValue}</textarea>`}
          ${opts.body || ''}
          ${opts.showExplanation && s.explanation !== undefined ? (() => {
            const uid = `ite-expl-${id}-${Math.random().toString(36).slice(2,6)}`;
            return `<div class="editor-expl-panel">
              <div class="editor-expl-toggle" onclick="document.getElementById('${uid}').classList.toggle('open')">
                <span>▼ Explanation</span>
              </div>
              <div class="editor-expl-body" id="${uid}">
                <textarea rows="2" oninput="iteSetExplanation('${id}',this.value)" placeholder="Add the answer rationale students will see after submission...">${s.explanation || ''}</textarea>
              </div>
            </div>`;
          })() : ''}
        </div>
      </div>
    </div>`;
}

// Choice-list body (MC / Audio MC). Mode tabs are now rendered separately
// via iteModeTabsHtml() and placed ABOVE the stem (see qCardShell.modeTabsSlot)
// so the toggle anchors the whole MC card rather than sitting between the
// stem and the choices. The platform's MultipleChoice/MultipleSelection
// switcher semantics are unchanged: one item, isMultipleAnswers toggles mode.
function iteModeTabsHtml(id) {
  const s = iteState(id);
  const multi = !!s.multi;
  return `<div class="q-mode-tabs" role="tablist" aria-label="Answer mode" style="margin-bottom:10px">
    <button class="q-mode-tab ${!multi?'active':''}" role="tab" aria-selected="${!multi}" onclick="iteSetMode('${id}',false)"><span class="dot"></span>Single Answer</button>
    <button class="q-mode-tab ${multi?'active':''}" role="tab" aria-selected="${multi}" onclick="iteSetMode('${id}',true)"><span class="sq"></span>Multiple Answers</button>
  </div>`;
}
function qCardChoiceBody(id, showModeTabs) {
  const s = iteState(id);
  const multi = !!s.multi;
  return `<ul class="choices">
      ${s.options.map((o, i) => `
        <li class="choice ${o.correct?'correct':''}">
          <span class="letter ce-letter ${multi?'sq':''}" onclick="iteToggleCorrect('${id}',${i})" title="${multi?'Toggle correct':'Mark as correct'}">${multi ? (o.correct?'✓':'') : String.fromCharCode(65+i)}</span>
          <input class="ce-text" value="${(o.v||'').replace(/"/g,'&quot;')}" oninput="iteUpdateOpt('${id}',${i},this.value)" placeholder="Option text">
          <span class="ce-actions">
            <button onclick="iteMoveOpt('${id}',${i},-1)" title="Move up">↑</button>
            <button onclick="iteMoveOpt('${id}',${i},1)" title="Move down">↓</button>
            <button class="del" onclick="iteDelOpt('${id}',${i})" title="Delete">×</button>
          </span>
        </li>`).join('')}
    </ul>
    <button class="q-add-opt-btn" onclick="iteAddOpt('${id}')">+ Add option</button>`;
}

function qCardChoiceEditor(id, opts) {
  const s = iteState(id);
  const multi = !!s.multi;
  const correctCount = s.options.filter(o => o.correct).length;
  const modeLabel = multi
    ? `<span style="font-size:11px;font-weight:700;background:#ede9fe;color:#6d28d9;padding:3px 9px;border-radius:999px">${correctCount} correct</span>`
    : `<span style="font-size:11px;font-weight:700;background:#dcfce7;color:#15803d;padding:3px 9px;border-radius:999px">Single answer</span>`;
  const badges = (opts.modeBadge === false) ? [] : [modeLabel];
  return qCardShell(id, {
    typeName: opts.typeName,
    badges,
    modeTabsSlot: opts.showModeTabs ? iteModeTabsHtml(id) : '',
    body: qCardChoiceBody(id, false),
    showExplanation: opts.showExplanation,
  });
}

// ─── Two-Part shared stimulus renderer (Lv 2: 5 typed stimulus options) ───
// Renders a card whose top is a type selector (None / Passage / Equation /
// Image / Table) and whose body is the editor for the chosen type. Matches
// SBAC/Cambium "shared stimulus" pattern: BOTH parts reference this content,
// but the item is also valid with type='none'.
const TP_STIM_TYPES = [
  {id:'none',     label:'None',          icon:'∅',  hint:'Pure logical Two-Part — no shared content'},
  {id:'passage',  label:'Text Passage',  icon:'📖', hint:'ELA reading evidence'},
  {id:'equation', label:'Equation',      icon:'∑',  hint:'Math expression both parts reference'},
  {id:'image',    label:'Image / Diagram', icon:'🖼', hint:'Science diagrams, SS maps'},
  {id:'table',    label:'Data Table',    icon:'▦',  hint:'Experiment data, statistics'},
];
function renderTpStimulus(s) {
  const stim = s.stimulus;
  const type = stim.type || 'none';
  const tabs = TP_STIM_TYPES.map(t => `
    <button class="tp-stim-tab ${type===t.id?'active':''}" onclick="iteTpSetStimType('twopart','${t.id}')" title="${t.hint}">
      <span class="tp-stim-tab-ic">${t.icon}</span>${t.label}
    </button>`).join('');

  let body = '';
  if (type === 'none') {
    body = `
      <div class="tp-stim-empty">
        <div class="tp-stim-empty-ic">∅</div>
        <div class="tp-stim-empty-title">No shared stimulus</div>
        <div class="tp-stim-empty-sub">Part A and Part B will stand on their own.<br>Use this for pure logical Two-Part items (e.g. "Pick a fraction" → "Pick its decimal equivalent").</div>
        <div class="tp-stim-empty-pick">
          ${TP_STIM_TYPES.filter(t=>t.id!=='none').map(t => `<button class="tp-stim-pick" onclick="iteTpSetStimType('twopart','${t.id}')"><span>${t.icon}</span>${t.label}</button>`).join('')}
        </div>
      </div>`;
  } else if (type === 'passage') {
    body = `
      <div class="q-section-label">Source passage <span class="q-section-help">Part B options should be sentence-level evidence drawn from this passage</span></div>
      <textarea class="tp-stim-passage" oninput="iteTpSetStimPassage('twopart',this.value)" placeholder="Paste or type the source passage…">${stim.passage || ''}</textarea>
      <div class="tp-stim-meta">
        <span>${(stim.passage||'').trim().split(/\s+/).filter(Boolean).length} words</span>
        <span>·</span>
        <span>${(stim.passage||'').split(/[.!?]+/).filter(p=>p.trim()).length} sentences</span>
        <button class="linkish" onclick="iteToast('AI: passage Lexile / readability check coming soon','info')">⚡ Check readability</button>
      </div>`;
  } else if (type === 'equation') {
    body = `
      <div class="q-section-label">Equation / expression <span class="q-section-help">Use LaTeX (e.g. <code>y = mx + b</code>, <code>x^2 + 2x - 3 = 0</code>)</span></div>
      <input class="tp-stim-eq" value="${(stim.equation||'').replace(/"/g,'&quot;')}" oninput="iteTpSetStimEquation('twopart',this.value)" placeholder="LaTeX expression…">
      <div class="tp-stim-eq-preview"><span class="tp-stim-eq-label">Student preview:</span><span class="tp-stim-eq-render">${stim.equation || '—'}</span></div>
      <div class="tp-stim-meta">
        <button class="linkish" onclick="iteToast('Equation editor (palette) coming soon','info')">∑ Open equation editor</button>
        <button class="linkish" onclick="iteToast('AI: variant generator coming soon','info')">⚡ Generate variants with AI</button>
      </div>`;
  } else if (type === 'image') {
    const img = stim.image;
    body = `
      <div class="q-section-label">Image / diagram <span class="q-section-help">Used by both parts. Provide alt text for accessibility.</span></div>
      <div class="tp-stim-img-zone ${img.uploaded?'has-file':''}" onclick="iteTpSimUploadImage('twopart')">
        ${img.uploaded ? `
          <div class="tp-stim-img-preview">
            <div class="tp-stim-img-thumb">🖼</div>
            <div class="tp-stim-img-info">
              <div class="tp-stim-img-name">${img.filename || 'image.png'}</div>
              <div class="tp-stim-img-sub">Uploaded · click to replace · auto-resized to 800px wide</div>
            </div>
          </div>` : `
          <div class="tp-stim-img-empty">
            <div class="tp-stim-img-empty-ic">⬆</div>
            <div class="tp-stim-img-empty-title">Click to upload diagram or drag image here</div>
            <div class="tp-stim-img-empty-sub">PNG / JPG / SVG · max 5 MB · 1024 × 1024 recommended</div>
          </div>`}
      </div>
      <div class="tp-stim-img-fields">
        <label>Alt text <span class="req">required for SR-compliance</span></label>
        <input class="tp-stim-input" value="${(img.alt||'').replace(/"/g,'&quot;')}" oninput="iteTpSetStimImageAlt('twopart',this.value)" placeholder="Describe the image for screen readers…">
        <label>Caption <span class="opt">shown below the image</span></label>
        <input class="tp-stim-input" value="${(img.caption||'').replace(/"/g,'&quot;')}" oninput="iteTpSetStimImageCaption('twopart',this.value)" placeholder="e.g. Figure 1 · Cell organelles">
      </div>`;
  } else if (type === 'table') {
    const tbl = stim.table;
    body = `
      <div class="q-section-label">Data table <span class="q-section-help">Both parts reference the data in this table</span></div>
      <input class="tp-stim-input" value="${(tbl.caption||'').replace(/"/g,'&quot;')}" oninput="iteTpSetStimTableCap('twopart',this.value)" placeholder="Table caption (e.g. 'Density of three liquid samples')" style="margin-bottom:10px;font-weight:600">
      <div class="tp-stim-table-wrap">
        <table class="tp-stim-table">
          <thead>
            <tr>
              ${tbl.headers.map((h,c) => `
                <th>
                  <input value="${(h||'').replace(/"/g,'&quot;')}" oninput="iteTpTableSetHeader('twopart',${c},this.value)" placeholder="Column ${c+1}">
                  <button class="tp-tbl-del-col" onclick="iteTpTableDelCol('twopart',${c})" title="Delete column">×</button>
                </th>`).join('')}
              <th class="tp-tbl-add"><button onclick="iteTpTableAddCol('twopart')" title="Add column">+ Col</button></th>
            </tr>
          </thead>
          <tbody>
            ${tbl.rows.map((row,r) => `
              <tr>
                ${row.map((cell,c) => `<td><input value="${(cell||'').replace(/"/g,'&quot;')}" oninput="iteTpTableSetCell('twopart',${r},${c},this.value)" placeholder="—"></td>`).join('')}
                <td class="tp-tbl-row-actions"><button onclick="iteTpTableDelRow('twopart',${r})" title="Delete row">×</button></td>
              </tr>`).join('')}
            <tr class="tp-tbl-add-row">
              <td colspan="${tbl.headers.length+1}"><button onclick="iteTpTableAddRow('twopart')">+ Add row</button></td>
            </tr>
          </tbody>
        </table>
      </div>`;
  }

  return `
    <div class="tp-stim-card">
      <div class="tp-stim-head">
        <div class="tp-stim-title">
          <span class="tp-stim-title-label">Shared stimulus</span>
          <span class="tp-stim-title-badge ${type==='none'?'opt':''}">${type==='none'?'Optional':'Active'}</span>
        </div>
        <div class="tp-stim-tabs" role="tablist" aria-label="Stimulus type">${tabs}</div>
      </div>
      <div class="tp-stim-body">${body}</div>
    </div>`;
}

// ─── Per-type editor builders (state-driven, fully interactive) ───
const ITEM_EDITOR_BUILDERS = {
  mc: t => {
    const s = iteState('mc');
    const multi = !!s.multi;
    const scoringCard = multi ? `
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Scoring rules <span style="font-size:11px;color:#71717a;font-weight:500;margin-left:6px">applies in Multiple Answers mode</span></div>
      <div class="ed-row"><label>Min selections</label><select class="ed-input" style="max-width:80px" onchange="iteSetMSMin('mc',this.value)">${[1,2,3].map(n=>`<option ${String(n)===String(s.minSel)?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="ed-row"><label>Max selections</label><select class="ed-input" style="max-width:80px" onchange="iteSetMSMax('mc',this.value)">${[2,3,4,'All'].map(n=>`<option ${String(n)===String(s.maxSel)?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="ed-row"><label>Partial credit</label>${edToggle('mc','partial')}<span style="font-size:11px;color:#71717a">⅓ pt per correct · −¼ per incorrect</span></div>
      <div class="ed-row"><label>Penalize over-select</label>${edToggle('mc','penalize')}</div>
    </div>` : '';
    return `
    ${qCardChoiceEditor('mc', {typeName:'Multiple Choice', showExplanation:true, showModeTabs:true})}
    ${scoringCard}`;
  },
  twopart: t => {
    const s = iteState('twopart');
    const bCorr = s.partB.options.filter(o=>o.correct).length;
    const partABody = `
      <ul class="choices">
        ${s.partA.options.map((o, i) => `
          <li class="choice ${o.correct?'correct':''}">
            <span class="letter ce-letter" onclick="iteTpToggleCorrect('twopart','partA',${i})" title="Mark as correct">${String.fromCharCode(65+i)}</span>
            <input class="ce-text" value="${(o.v||'').replace(/"/g,'&quot;')}" oninput="iteTpUpdateOpt('twopart','partA',${i},this.value)" placeholder="Option text">
            <span class="ce-actions"><button class="del" onclick="iteTpDelOpt('twopart','partA',${i})">×</button></span>
          </li>`).join('')}
      </ul>
      <button class="q-add-opt-btn" onclick="iteTpAddOpt('twopart','partA')">+ Add Part A option</button>`;
    const partBBody = `
      <ul class="choices">
        ${s.partB.options.map((o, i) => `
          <li class="choice ${o.correct?'correct':''}">
            <span class="letter ce-letter sq" onclick="iteTpToggleCorrect('twopart','partB',${i})" title="Toggle correct">${o.correct?'✓':String.fromCharCode(65+i)}</span>
            <input class="ce-text" value="${(o.v||'').replace(/"/g,'&quot;')}" oninput="iteTpUpdateOpt('twopart','partB',${i},this.value)" placeholder="${s.stimulus.type==='passage' ? 'Evidence sentence' : 'Evidence / supporting choice'}">
            <span class="ce-actions"><button class="del" onclick="iteTpDelOpt('twopart','partB',${i})">×</button></span>
          </li>`).join('')}
      </ul>
      <button class="q-add-opt-btn" onclick="iteTpAddOpt('twopart','partB')">+ Add Part B option</button>`;
    return `
    ${renderTpStimulus(s)}
    <div class="q-tp-stack">
      ${qCardShell('twopart', {
        typeName:'Two-Part · Part A',
        num:'1a',
        badges:[`<span style="font-size:11px;font-weight:700;background:#dbeafe;color:#1e40af;padding:3px 9px;border-radius:999px">Single correct</span>`],
        stem: s.partA.stem,
        stemHandler:`iteTpUpdateStem('twopart','partA',this.value)`,
        body: partABody,
      })}
      ${qCardShell('twopart', {
        typeName:'Two-Part · Part B',
        num:'1b',
        badges:[`<span style="font-size:11px;font-weight:700;background:#ede9fe;color:#6d28d9;padding:3px 9px;border-radius:999px">${bCorr} correct</span>`],
        stem: s.partB.stem,
        stemHandler:`iteTpUpdateStem('twopart','partB',this.value)`,
        body: partBBody,
      })}
    </div>
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Composite scoring</div>
      <div class="ed-row"><label>Mode</label>
        <select class="ed-input" style="max-width:280px" onchange="iteSetCompositeMode('twopart',this.value)">
          <option value="composite"   ${s.settings.mode==='composite'  ?'selected':''}>Atomic — both A & B must be correct (0/1)</option>
          <option value="independent" ${s.settings.mode==='independent'?'selected':''}>Additive — A and B scored separately (0/2)</option>
          <option value="gated"       ${s.settings.mode==='gated'      ?'selected':''}>Gated — B only scored if A is correct</option>
        </select>
      </div>
      <div class="ed-row"><label>Show Part B only after Part A</label>${edToggle('twopart','linked')}<span style="font-size:11px;color:#71717a">student must commit to A before seeing B</span></div>
    </div>`;
  },
  fib: t => {
    const s = iteState('fib');
    let blankIdx = 0;
    const stemPreview = s.stem
      ? s.stem.replace(/\[blank\]/g, () => `<span class="q-blank-pill">⓿${++blankIdx}</span>`)
      : '<span style="color:#a1a1aa">Use <code>[blank]</code> in the stem to mark a blank…</span>';
    const body = `
      <div class="q-section-label">Stem preview <span class="q-section-help">${s.blanks.length} blank${s.blanks.length===1?'':'s'} found</span></div>
      <div class="q-passage-card" style="margin-bottom:14px"><div class="q-passage-text">${stemPreview}</div></div>
      ${s.blanks.map((b, bi) => `
        <div class="q-section-label">
          <span>Blank ${bi+1} · accepted answers</span>
          <button class="linkish" onclick="iteDelBlank('fib',${bi})">× delete blank</button>
        </div>
        <ul class="q-list">
          ${b.answers.map((a, ai) => `
          <li class="q-list-row correct">
            <span class="q-list-tag">✓</span>
            <input class="q-list-input" value="${a.replace(/"/g,'&quot;')}" oninput="iteUpdateBlankAns('fib',${bi},${ai},this.value)" placeholder="Accepted answer / synonym">
            <span class="q-list-actions"><button onclick="iteDelBlankAns('fib',${bi},${ai})">×</button></span>
          </li>`).join('')}
        </ul>
        <button class="q-add-opt-btn" onclick="iteAddBlankAns('fib',${bi})">+ Accepted answer / synonym</button>`).join('')}
      <button class="q-add-opt-btn" onclick="iteAddBlank('fib')" style="margin-top:14px;width:100%;border-color:#a78bfa;color:#7c3aed">+ Add another blank</button>`;
    return `
    ${qCardShell('fib', {typeName:'Fill in the Blank', body, showExplanation:true, stemPlaceholder:'Type the sentence; use [blank] where students fill in.'})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Match settings</div>
      <div class="ed-row"><label>Case insensitive</label>${edToggle('fib','caseInsensitive')}</div>
      <div class="ed-row"><label>Trim whitespace</label>${edToggle('fib','trim')}</div>
      <div class="ed-row"><label>Allow synonyms (AI)</label>${edToggle('fib','aiSynonyms')}<span style="font-size:11px;color:#71717a">auto-suggest variations</span></div>
    </div>`;
  },
  gridin: t => {
    const s = iteState('gridin');
    const showBubbles = s.settings.bubbles;
    const body = `
      <div class="q-section-label">Numeric answer ${s.unit?`<span class="q-section-help">unit: ${s.unit}</span>`:''}</div>
      <div class="q-numeric-card">
        <div>
          <label>Primary answer</label>
          <input class="primary" value="${s.primary}" oninput="iteSetPrimaryNum('gridin',this.value);iteRerender()">
        </div>
        <div>
          <label>Tolerance</label>
          <input value="${s.tolerance}" oninput="iteSetTolerance('gridin',this.value)" placeholder="e.g. ±0.01 or none">
        </div>
        <div>
          <label>Accept range <span style="font-size:10px;color:#a1a1aa;font-weight:500">optional</span></label>
          <input value="${(s.acceptRange||'').replace(/"/g,'&quot;')}" oninput="iteGridSetRange('gridin',this.value)" placeholder="e.g. [3, 5] or 4 ± 0.5">
        </div>
        <div>
          <label>Unit <span style="font-size:10px;color:#a1a1aa;font-weight:500">optional</span></label>
          <input value="${(s.unit||'').replace(/"/g,'&quot;')}" oninput="iteGridSetUnit('gridin',this.value)" placeholder="e.g. m, kg, %">
        </div>
      </div>

      <div class="q-section-label">Equivalent forms (auto-accepted) · ${s.equivalents.length}</div>
      <ul class="q-list">
        ${s.equivalents.map((e, i) => `
        <li class="q-list-row correct">
          <span class="q-list-tag">≡</span>
          <input class="q-list-input" value="${e.replace(/"/g,'&quot;')}" oninput="iteUpdateEquiv('gridin',${i},this.value)" placeholder="e.g. 5/1, 5.0">
          <span class="q-list-actions"><button onclick="iteDelEquiv('gridin',${i})">×</button></span>
        </li>`).join('')}
      </ul>
      <button class="q-add-opt-btn" onclick="iteAddEquiv('gridin')">+ Add equivalent form</button>

      ${showBubbles ? `
      <div class="q-section-label" style="margin-top:14px">SAT/TCAP bubble grid preview <span class="q-section-help">${s.gridDigits}-column grid · bubbles light up to match primary answer</span></div>
      <div class="grid-bubble-wrap">
        ${gridRenderBubbleGrid(s.primary, s.gridDigits, s.settings.fractions, s.settings.decimals)}
        <div class="grid-bubble-side">
          <div class="gbb-side-label">Grid columns</div>
          <select class="ed-input" onchange="iteGridSetDigits('gridin',this.value)" style="max-width:80px">
            ${[3,4,5,6].map(n => `<option ${String(n)===String(s.gridDigits)?'selected':''}>${n}</option>`).join('')}
          </select>
          <div class="gbb-side-hint">Students fill the input row; bubbles auto-fill below for visual confirmation. Matches the SAT Bluebook / TCAP grid-in widget.</div>
        </div>
      </div>` : ''}`;

    return `
    ${qCardShell('gridin', {typeName:'Grid-In / Numeric', body, showExplanation:true})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Input format</div>
      <div class="ed-row"><label>Allow fractions</label>${edToggle('gridin','fractions')}<span style="font-size:11px;color:#71717a">"3/4" accepted</span></div>
      <div class="ed-row"><label>Allow decimals</label>${edToggle('gridin','decimals')}<span style="font-size:11px;color:#71717a">"0.75" accepted</span></div>
      <div class="ed-row"><label>Allow negative</label>${edToggle('gridin','negative')}</div>
      <div class="ed-row"><label>Allow scientific notation</label>${edToggle('gridin','scientific')}<span style="font-size:11px;color:#71717a">"1.5 × 10⁻³"</span></div>
    </div>
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Student tools</div>
      <div class="ed-row"><label>Calculator</label>
        <select class="ed-input" style="max-width:200px" onchange="iteGridSetCalc('gridin',this.value)">
          <option value="none"        ${s.calculator==='none'?'selected':''}>None</option>
          <option value="basic"       ${s.calculator==='basic'?'selected':''}>Basic (4-function)</option>
          <option value="scientific"  ${s.calculator==='scientific'?'selected':''}>Scientific</option>
          <option value="desmos"      ${s.calculator==='desmos'?'selected':''}>Desmos (graphing)</option>
        </select>
        <span style="font-size:11px;color:#71717a">${s.calculator==='none'?'no calculator allowed':'shown in side panel during this item'}</span>
      </div>
      <div class="ed-row"><label>Show bubble grid widget</label>${edToggle('gridin','bubbles')}<span style="font-size:11px;color:#71717a">SAT/TCAP visual confirmation grid</span></div>
      <div class="ed-row"><label>Show grid to student during exam</label>${edToggle('gridin','showGridToStudent')}<span style="font-size:11px;color:#71717a">vs hidden auxiliary view</span></div>
    </div>`;
  },
  cr: t => {
    const s = iteState('cr');
    const total = s.rubric.reduce((sum,r)=>sum+(parseInt(r.pts)||0),0);
    const body = `
      <div class="answer-area" style="min-height:80px"><em>Student short-response area · max ${s.wordLimit} words</em></div>
      <div class="q-section-label">Sample / model answer <span class="q-section-help">seeds the AI grader · not shown to students</span></div>
      <textarea class="q-stem-edit" style="min-height:80px;background:#fafbfc" oninput="iteSetSample('cr',this.value)" placeholder="Sample answer for AI grader…">${s.sample}</textarea>
      <div class="q-section-label">Rubric · ${total} points total</div>
      <ul class="q-list">
        ${s.rubric.map((r, i) => `
        <li class="q-list-row">
          <span class="q-list-tag">${i+1}</span>
          <input class="q-list-input" value="${(r.criterion||'').replace(/"/g,'&quot;')}" oninput="iteUpdateRubric('cr',${i},'criterion',this.value)" placeholder="Criterion">
          <input class="q-list-input pts" type="number" value="${r.pts}" oninput="iteUpdateRubric('cr',${i},'pts',this.value)" min="0" title="Points">
          <span class="q-list-actions"><button onclick="iteDelRubric('cr',${i})">×</button></span>
        </li>`).join('')}
      </ul>
      <button class="q-add-opt-btn" onclick="iteAddRubric('cr')">+ Add criterion</button>`;
    return `
    ${qCardShell('cr', {typeName:'Constructed Response', body, showExplanation:true})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Grading workflow</div>
      <div class="ed-row"><label>AI auto-grade</label>${edToggle('cr','aiGrade')}</div>
      <div class="ed-row"><label>Teacher review queue</label>${edToggle('cr','teacherReview')}</div>
      <div class="ed-row"><label>Word limit</label><input class="ed-input" value="${s.wordLimit}" oninput="iteSetWordLimit('cr',this.value)" type="number" style="max-width:80px"><span style="font-size:11px;color:#71717a">words max</span></div>
    </div>`;
  },
  essay: t => {
    const s = iteState('essay');
    const total = s.rubric.reduce((sum,r)=>sum+(parseInt(r.pts)||0),0);
    const body = `
      <div class="answer-area" style="min-height:120px"><em>Student long-form essay area · ${s.minWords}–${s.maxWords} words</em></div>
      <div class="q-section-label">Source materials</div>
      <ul class="q-list">
        ${s.sources.map((src, i) => `
        <li class="q-list-row">
          <span class="q-list-tag">📎</span>
          <input class="q-list-input" value="${(src.label||'').replace(/"/g,'&quot;')}" oninput="iteUpdateSource('essay',${i},this.value)" placeholder="Source label">
          <span class="q-list-actions"><button onclick="iteDelSource('essay',${i})">×</button></span>
        </li>`).join('')}
      </ul>
      <button class="q-add-opt-btn" onclick="iteAddSource('essay')">+ Add source</button>
      <div class="q-section-label">Planning checklist <span class="q-section-help">shown to students before they write</span></div>
      <ul class="q-list">
        ${s.checklist.map((c, i) => `
        <li class="q-list-row">
          <span class="q-list-tag">☐</span>
          <input class="q-list-input" value="${c.replace(/"/g,'&quot;')}" oninput="iteUpdateChecklist('essay',${i},this.value)" placeholder="Checklist item">
          <span class="q-list-actions"><button onclick="iteDelChecklist('essay',${i})">×</button></span>
        </li>`).join('')}
      </ul>
      <button class="q-add-opt-btn" onclick="iteAddChecklist('essay')">+ Add checklist item</button>
      <div class="q-section-label">${s.rubric.length}-trait rubric · ${total} points total</div>
      <ul class="q-list">
        ${s.rubric.map((r, i) => `
        <li class="q-list-row">
          <span class="q-list-tag">${i+1}</span>
          <input class="q-list-input" value="${(r.criterion||'').replace(/"/g,'&quot;')}" oninput="iteUpdateRubric('essay',${i},'criterion',this.value)" placeholder="Trait">
          <input class="q-list-input pts" type="number" value="${r.pts}" oninput="iteUpdateRubric('essay',${i},'pts',this.value)" min="0" title="Points">
          <span class="q-list-actions"><button onclick="iteDelRubric('essay',${i})">×</button></span>
        </li>`).join('')}
      </ul>
      <button class="q-add-opt-btn" onclick="iteAddRubric('essay')">+ Add trait</button>`;
    return `
    ${qCardShell('essay', {typeName:'Writing Prompt / Essay', body, showExplanation:false, stemPlaceholder:'Writing prompt…'})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Settings</div>
      <div class="ed-row"><label>Min words</label><input class="ed-input" value="${s.minWords}" oninput="iteSetMinWords('essay',this.value)" type="number" style="max-width:80px"></div>
      <div class="ed-row"><label>Max words</label><input class="ed-input" value="${s.maxWords}" oninput="iteSetMaxWords('essay',this.value)" type="number" style="max-width:80px"></div>
      <div class="ed-row"><label>Allow planning notes</label>${edToggle('essay','planning')}</div>
      <div class="ed-row"><label>Spell-check</label>${edToggle('essay','spellcheck')}</div>
    </div>`;
  },
  hottext: t => {
    const s = iteState('hottext');
    const tokens = iteHotTokenize(s.passage, s.granularity);
    let tokenIdx = -1;
    let selCount = 0, corrCount = 0;
    const passageHtml = tokens.map(tok => {
      if (tok.kind === 'gap') return `<span class="ht-gap">${tok.text.replace(/\n/g,'<br>')}</span>`;
      tokenIdx++;
      const state = s.tokenStates[tokenIdx] || 'none';
      if (state === 'sel') selCount++;
      if (state === 'correct') { corrCount++; selCount++; }
      const next = (state === 'none') ? 'mark selectable' : (state === 'sel') ? 'mark correct' : 'unmark';
      return `<span class="ht-tok ht-${state}" data-i="${tokenIdx}" onclick="iteHotCycle('hottext',${tokenIdx})" title="Click to ${next}">${tok.text}</span>`;
    }).join('');

    const body = `
      <div class="q-section-label">Source passage <span class="q-section-help">click any ${s.granularity.toLowerCase()} below to mark it · cycles: Decoration → Selectable → Correct ✓</span></div>
      <textarea class="ht-passage-edit" oninput="iteHotSetPassage('hottext',this.value)" placeholder="Paste or type the passage here…">${s.passage || ''}</textarea>

      <div class="ht-toolbar">
        <div class="ht-tool-grp">
          <span class="ht-tool-lbl">Granularity</span>
          <div class="ht-seg" role="tablist">
            ${['Sentence','Word','Phrase (custom span)'].map(g => `
              <button class="ht-seg-btn ${s.granularity===g?'active':''}" onclick="iteHotSetGranularity('hottext','${g}')">${g}</button>`).join('')}
          </div>
        </div>
        <div class="ht-tool-grp">
          <button class="ht-action" onclick="iteHotMarkAllSelectable('hottext')" title="Make all units selectable">⊕ All selectable</button>
          <button class="ht-action" onclick="iteHotResetMarks('hottext')" title="Clear all marks">✕ Reset marks</button>
        </div>
      </div>

      <div class="q-section-label" style="margin-top:14px">Live preview · this is what students see <span class="q-section-help">${selCount} clickable · ${corrCount} correct</span></div>
      <div class="ht-passage-preview">${passageHtml || '<em class="ht-empty">Type a passage above to start marking…</em>'}</div>

      <div class="ht-legend">
        <span class="ht-legend-item"><span class="ht-tok ht-none">Decoration</span> not clickable</span>
        <span class="ht-legend-item"><span class="ht-tok ht-sel">Selectable</span> student can click but wrong</span>
        <span class="ht-legend-item"><span class="ht-tok ht-correct">Correct ✓</span> student should click</span>
      </div>`;
    return `
    ${qCardShell('hottext', {typeName:'Hot Text', body, showExplanation:true})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Selection settings</div>
      <div class="ed-row"><label>Required selections</label><input class="ed-input" value="${s.requiredCount}" oninput="iteSetReqCount('hottext',this.value)" type="number" min="1" style="max-width:80px"><span style="font-size:11px;color:#71717a">student must pick this many ${s.granularity.toLowerCase()}s</span></div>
      <div class="ed-row"><label>Partial credit</label>${edToggle('hottext','partial')}<span style="font-size:11px;color:#71717a">award per-correct, deduct per-wrong</span></div>
      <div class="ed-row"><label>Auto-mark new units selectable</label>${edToggle('hottext','autoSelectAll')}<span style="font-size:11px;color:#71717a">when granularity changes</span></div>
    </div>`;
  },
  dragdrop: t => {
    const s = iteState('dragdrop');
    const v = s.variant || 'sentence';
    const variants = [
      {id:'sentence', label:'Sentence blank', icon:'📝', hint:'Drag chips into blanks in a sentence'},
      {id:'bucket',   label:'Drag to bucket', icon:'🪣', hint:'Sort chips into N labeled buckets'},
      {id:'match',    label:'Match pairs',    icon:'⇄',  hint:'Connect items in left column to right column'},
      {id:'image',    label:'Drag to image',  icon:'🖼',  hint:'Drag chips onto regions in an image'},
    ];
    const variantTabs = `
      <div class="dd-var-tabs" role="tablist">
        ${variants.map(vr => `
          <button class="dd-var-tab ${v===vr.id?'active':''}" onclick="iteDDSetVariant('dragdrop','${vr.id}')" title="${vr.hint}">
            <span class="dd-var-ic">${vr.icon}</span>${vr.label}
          </button>`).join('')}
      </div>`;

    let body = '';
    if (v === 'sentence') {
      const sv = s.sentence;
      // Render template preview with slots highlighted
      const previewHtml = (sv.template || '').replace(/\{slot:(\d+)\}/g, (_, n) => {
        const idx = parseInt(n) - 1;
        const ans = sv.slots[idx]?.answer || '?';
        return `<span class="dd-slot-pill">⌐ ${ans}</span>`;
      });
      body = `
        <div class="q-section-label">Sentence template <span class="q-section-help">use <code class="ic-code">{slot:1}</code>, <code class="ic-code">{slot:2}</code>… for blanks</span></div>
        <textarea class="ic-passage-edit" oninput="iteDDSentSetTemplate('dragdrop',this.value)" placeholder="A {slot:1} makes its own food using sunlight…">${sv.template || ''}</textarea>
        <div class="ic-toolbar">
          <button class="ht-action" onclick="iteDDSentAddSlot('dragdrop')">+ Add slot {slot:${sv.slots.length+1}}</button>
          <span class="ic-meta">${sv.slots.length} slots · ${sv.chips.length} chips (incl. distractors)</span>
        </div>
        <div class="q-section-label" style="margin-top:14px">Live preview · what students see</div>
        <div class="ic-preview">${previewHtml || '<em class="ht-empty">Type a sentence above…</em>'}</div>
        <div class="q-section-label" style="margin-top:14px">Slot answers <span class="q-section-help">each must match a chip exactly</span></div>
        <ul class="q-list">
          ${sv.slots.map((sl, i) => `
          <li class="q-list-row correct">
            <span class="q-list-tag">${i+1}</span>
            <input class="q-list-input" value="${(sl.answer||'').replace(/"/g,'&quot;')}" oninput="iteDDSentUpdateSlot('dragdrop',${i},this.value)" placeholder="correct chip for slot ${i+1}">
            <span class="q-list-actions"><button onclick="iteDDSentDelSlot('dragdrop',${i})">×</button></span>
          </li>`).join('')}
        </ul>
        <div class="q-section-label" style="margin-top:14px">Chip pool <span class="q-section-help">visible to students · include distractors to make it harder</span></div>
        <div class="dd-chip-pool">
          ${sv.chips.map((c, i) => `
          <div class="dd-chip-edit">
            <span class="dd-chip-grip">⠿</span>
            <input value="${c.replace(/"/g,'&quot;')}" oninput="iteDDSentUpdateChip('dragdrop',${i},this.value)">
            <button onclick="iteDDSentDelChip('dragdrop',${i})">×</button>
          </div>`).join('')}
          <button class="dd-chip-add" onclick="iteDDSentAddChip('dragdrop')">+ chip</button>
        </div>`;
    } else if (v === 'bucket') {
      const bv = s.bucket;
      body = `
        <div class="q-section-label">Buckets · ${bv.buckets.length} categories <span class="q-section-help">enter chip names comma-separated under each bucket</span></div>
        <div class="dd-bucket-grid">
          ${bv.buckets.map((b, i) => `
          <div class="dd-bucket-card">
            <div class="dd-bucket-head">
              <input class="dd-bucket-label" value="${(b.label||'').replace(/"/g,'&quot;')}" oninput="iteDDBucketSetLabel('dragdrop',${i},this.value)" placeholder="Bucket name">
              <button class="dd-bucket-del" onclick="iteDDBucketDel('dragdrop',${i})" title="Delete">×</button>
            </div>
            <textarea class="dd-bucket-items" oninput="iteDDBucketSetItems('dragdrop',${i},this.value)" placeholder="chip 1, chip 2, chip 3…">${(b.correct || []).join(', ')}</textarea>
            <div class="dd-bucket-chips">
              ${b.correct.map(c => `<span class="dd-chip-preview">${c}</span>`).join('')}
            </div>
          </div>`).join('')}
        </div>
        <button class="q-add-opt-btn" onclick="iteDDBucketAdd('dragdrop')">+ Add bucket</button>`;
    } else if (v === 'match') {
      const mv = s.match;
      body = `
        <div class="q-section-label">Match pairs · left column ↔ right column <span class="q-section-help">${mv.pairs.length} pairs · students drag from right to left</span></div>
        <div class="dd-match-table">
          <div class="dd-match-row dd-match-head">
            <span>Left (anchor)</span>
            <span class="dd-match-arrow">↔</span>
            <span>Right (drag target)</span>
            <span></span>
          </div>
          ${mv.pairs.map((p, i) => `
          <div class="dd-match-row">
            <input value="${(p.left||'').replace(/"/g,'&quot;')}" oninput="iteDDMatchSet('dragdrop',${i},'left',this.value)" placeholder="e.g. Tennessee">
            <span class="dd-match-arrow">↔</span>
            <input value="${(p.right||'').replace(/"/g,'&quot;')}" oninput="iteDDMatchSet('dragdrop',${i},'right',this.value)" placeholder="e.g. Nashville">
            <button class="dd-bucket-del" onclick="iteDDMatchDel('dragdrop',${i})">×</button>
          </div>`).join('')}
        </div>
        <button class="q-add-opt-btn" onclick="iteDDMatchAdd('dragdrop')">+ Add pair</button>`;
    } else if (v === 'image') {
      const iv = s.image;
      body = `
        <div class="q-section-label">Image with drop regions · ${iv.regions.length} regions</div>
        <div class="dd-img-stage">
          <div class="dd-img-placeholder">🖼 ${iv.imageFile} <span class="dd-img-alt">${iv.imageAlt}</span></div>
          ${iv.regions.map((r, i) => `
          <div class="dd-img-region" style="left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%">
            <span class="dd-img-region-label">${r.label}</span>
          </div>`).join('')}
        </div>
        <div class="q-section-label" style="margin-top:14px">Region labels & correct chip mapping</div>
        <ul class="q-list">
          ${iv.regions.map((r, i) => `
          <li class="q-list-row correct">
            <span class="q-list-tag">${i+1}</span>
            <input class="q-list-input" value="${(r.label||'').replace(/"/g,'&quot;')}" oninput="iteDDImgSetRegion('dragdrop',${i},'label',this.value)" placeholder="Region label (visible to author)">
            <span style="color:#a1a1aa;font-size:11px">accepts:</span>
            <input class="q-list-input" value="${(r.correct||'').replace(/"/g,'&quot;')}" oninput="iteDDImgSetRegion('dragdrop',${i},'correct',this.value)" placeholder="correct chip name">
            <span class="q-list-actions"><button onclick="iteDDImgDelRegion('dragdrop',${i})">×</button></span>
          </li>`).join('')}
        </ul>
        <button class="q-add-opt-btn" onclick="iteDDImgAddRegion('dragdrop')">+ Add region</button>
        <div class="q-section-label" style="margin-top:14px">Chip pool · ${iv.chips.length} chips</div>
        <div class="dd-chip-pool">
          ${iv.chips.map((c, i) => `
          <div class="dd-chip-edit">
            <span class="dd-chip-grip">⠿</span>
            <input value="${c.replace(/"/g,'&quot;')}" oninput="iteDDImgUpdateChip('dragdrop',${i},this.value)">
            <button onclick="iteDDImgDelChip('dragdrop',${i})">×</button>
          </div>`).join('')}
          <button class="dd-chip-add" onclick="iteDDImgAddChip('dragdrop')">+ chip</button>
        </div>`;
    }

    const stem = (s[v] && s[v].stem) || '';
    return `
    ${qCardShell('dragdrop', {
      typeName:'Drag & Drop / Gap Match',
      stem,
      stemHandler:`iteDDSetStem('dragdrop',this.value)`,
      stemPlaceholder:'Question stem…',
      body: variantTabs + body,
      showExplanation:true,
    })}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Settings</div>
      <div class="ed-row"><label>Allow re-drag</label>${edToggle('dragdrop','redrag')}</div>
      <div class="ed-row"><label>Partial credit per slot</label>${edToggle('dragdrop','partial')}</div>
      <div class="ed-row"><label>Shuffle chips</label>${edToggle('dragdrop','shuffle')}</div>
    </div>`;
  },
  inline: t => {
    const s = iteState('inline');
    iteInlineSyncDropdowns('inline');
    const markersFound = (s.passage || '').match(/\{dd:(\d+)\}/g) || [];
    const markerNums = markersFound.map(m => parseInt(m.match(/\d+/)[0]));
    const usedSet = new Set(markerNums);

    // Render preview: replace each {dd:N} with a styled pill showing the
    // current correct answer (so author can sanity-check the sentence reads well).
    const previewHtml = (s.passage || '').replace(/\{dd:(\d+)\}/g, (_, n) => {
      const idx = parseInt(n) - 1;
      const dd = s.dropdowns[idx];
      const cur = dd ? (dd.options[dd.correct] || '?') : '?';
      return `<span class="ic-pill" title="Dropdown ${n} — currently shows correct answer">▼ ${cur}</span>`;
    });

    const body = `
      <div class="q-section-label">Passage with inline dropdowns <span class="q-section-help">use <code class="ic-code">{dd:1}</code>, <code class="ic-code">{dd:2}</code>… to mark dropdown positions</span></div>
      <textarea class="ic-passage-edit" oninput="iteInlineSetPassage('inline',this.value)" placeholder="Type a passage. Insert {dd:1}, {dd:2}… where each dropdown should appear.">${s.passage || ''}</textarea>

      <div class="ic-toolbar">
        <button class="ht-action" onclick="iteInlineAddDropdown('inline')">+ Add dropdown (auto-inserts {dd:${s.dropdowns.length + 1}})</button>
        <span class="ic-meta">${markersFound.length} marker${markersFound.length===1?'':'s'} in passage · ${s.dropdowns.length} dropdown${s.dropdowns.length===1?'':'s'} configured</span>
      </div>

      <div class="q-section-label" style="margin-top:14px">Live preview · what students see <span class="q-section-help">pills show currently correct answer</span></div>
      <div class="ic-preview">${previewHtml || '<em class="ht-empty">Add some passage text above…</em>'}</div>

      <div class="q-section-label" style="margin-top:14px">Per-dropdown options <span class="q-section-help">click ◉ to mark the correct answer</span></div>
      <div class="ic-dropdowns">
        ${s.dropdowns.map((dd, di) => {
          const isUsed = usedSet.has(di + 1);
          return `
          <div class="ic-dd-card ${isUsed?'':'orphan'}">
            <div class="ic-dd-head">
              <span class="ic-dd-tag">{dd:${di+1}}</span>
              ${isUsed ? '' : '<span class="ic-dd-orphan">⚠ marker not in passage · re-add or delete</span>'}
              <span class="ic-dd-summary">correct: <b>${dd.options[dd.correct] || '—'}</b></span>
              <button class="ic-dd-del" onclick="iteInlineDelDropdown('inline',${di})" title="Delete this dropdown">×</button>
            </div>
            <ul class="choices">
              ${dd.options.map((o, oi) => {
                const isC = oi === dd.correct;
                return `<li class="choice ${isC?'correct':''}">
                  <span class="letter ce-letter" onclick="iteInlineSetCorrect('inline',${di},${oi})" title="Mark as correct">${isC?'✓':String.fromCharCode(65+oi)}</span>
                  <input class="ce-text" value="${o.replace(/"/g,'&quot;')}" oninput="iteInlineUpdateOpt('inline',${di},${oi},this.value)" placeholder="Option text">
                  <span class="ce-actions"><button class="del" onclick="iteInlineDelOpt('inline',${di},${oi})">×</button></span>
                </li>`;
              }).join('')}
            </ul>
            <button class="q-add-opt-btn" onclick="iteInlineAddOpt('inline',${di})">+ Add option</button>
          </div>`;
        }).join('')}
      </div>`;
    return `
    ${qCardShell('inline', {typeName:'Inline Choice (Cloze)', body, showExplanation:true})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Settings</div>
      <div class="ed-row"><label>Per-blank scoring</label>${edToggle('inline','perBlank')}<span style="font-size:11px;color:#71717a">each correct dropdown earns a fraction of the point</span></div>
      <div class="ed-row"><label>Shuffle options per dropdown</label>${edToggle('inline','shuffleOpts')}</div>
      <div class="ed-row"><label>Show option count to student</label>${edToggle('inline','showCount')}<span style="font-size:11px;color:#71717a">e.g. "▼ (3 options)"</span></div>
    </div>`;
  },
  editing: t => {
    // Editing Task author view — the design lives here so engineering has a
    // spec when capacity opens up. State editing is scoped to text-only fields
    // (stem + passage); per-edit cards are READ-ONLY in this prototype since
    // the underlying authoring API doesn't yet support this item type.
    const s = iteState('editing');
    const markersFound = (s.passage || '').match(/\{ed:(\d+)\}/g) || [];
    // Render the live preview by replacing each {ed:N} with a numbered chip
    // showing the original text — author can sanity-check the passage flows.
    const previewHtml = (s.passage || '').replace(/\{ed:(\d+)\}/g, (_, n) => {
      const idx = parseInt(n) - 1;
      const ed = s.edits[idx];
      const original = ed ? ed.original : '?';
      return `<span class="ic-pill" style="background:#fef3c7;color:#92400e;border-color:#fbbf24" title="Edit ${n}: ${ed?ed.tag:'?'}"><span style="background:#92400e;color:#fff;border-radius:3px;font-size:9px;padding:1px 4px;margin-right:4px;font-weight:800">${n}</span>${original}</span>`;
    });
    const body = `
      <div class="q-section-label">Passage with editable phrases <span class="q-section-help">use <code class="ic-code">{ed:1}</code>, <code class="ic-code">{ed:2}</code>… to mark each phrase. Option A is ALWAYS "NO CHANGE" by TNReady convention.</span></div>
      <textarea class="ic-passage-edit" oninput="iteState('editing').passage=this.value;iteRerender()" placeholder="Type the passage. Insert {ed:1}, {ed:2}… where each underlined phrase should appear.">${s.passage || ''}</textarea>

      <div class="ic-toolbar">
        <span class="ic-meta">${markersFound.length} marker${markersFound.length===1?'':'s'} in passage · ${s.edits.length} edit${s.edits.length===1?'':'s'} configured</span>
      </div>

      <div class="q-section-label" style="margin-top:14px">Live preview · what students see <span class="q-section-help">numbered chips show the original phrase students will see</span></div>
      <div class="ic-preview" style="line-height:2.0;font-family:Georgia,'Times New Roman',serif">${previewHtml || '<em class="ht-empty">Add some passage text above…</em>'}</div>

      <div class="q-section-label" style="margin-top:14px">Per-edit options <span class="q-section-help">option A = NO CHANGE (kept as-is by convention) · ✓ marks the correct revision</span></div>
      <div class="ic-dropdowns">
        ${s.edits.map((ed, di) => {
          return `
          <div class="ic-dd-card">
            <div class="ic-dd-head">
              <span class="ic-dd-tag" style="background:#fef3c7;color:#92400e">{ed:${di+1}}</span>
              <span class="ic-dd-summary">testing: <b>${ed.tag}</b></span>
              <span class="ic-dd-summary" style="margin-left:auto">correct: <b>${ed.options[ed.answer]==='NO CHANGE' ? 'NO CHANGE (keep "'+ed.original+'")' : ed.options[ed.answer]}</b></span>
            </div>
            <div style="font-size:11px;color:#71717a;padding:0 12px 8px">Original phrase in passage: <b style="color:#92400e">"${ed.original}"</b></div>
            <ul class="choices">
              ${ed.options.map((o, oi) => {
                const isC = oi === ed.answer;
                const isNc = oi === 0;
                return `<li class="choice ${isC?'correct':''}">
                  <span class="letter ce-letter" title="${isC?'Correct answer':'Distractor'}">${isC?'✓':String.fromCharCode(65+oi)}</span>
                  <span class="ce-text" style="padding:8px 10px;color:#27272a;font-size:13px">${isNc?'<b>NO CHANGE</b>':o}${isNc?` <span style="color:#71717a;font-style:italic;margin-left:6px">(keeps "${ed.original}")</span>`:''}</span>
                </li>`;
              }).join('')}
            </ul>
          </div>`;
        }).join('')}
      </div>`;
    return `
    ${qCardShell('editing', {typeName:'Editing Task', body, showExplanation:false})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Settings</div>
      <div class="ed-row"><label>Per-edit scoring</label>${edToggle('editing','perEdit')}<span style="font-size:11px;color:#71717a">each correct edit earns a fraction of the point</span></div>
      <div class="ed-row"><label>Shuffle option order</label>${edToggle('editing','shuffleOpts')}<span style="font-size:11px;color:#71717a">NO CHANGE always stays in position A</span></div>
      <div class="ed-row"><label>Show "what's being tested" tag</label>${edToggle('editing','showTags')}<span style="font-size:11px;color:#71717a">surfaces in diagnostic report only — never to the student</span></div>
    </div>
    <div class="ed-card" style="margin-top:14px;background:#fef3c7;border-color:#fbbf24">
      <div class="ed-card-label" style="color:#92400e">⚠️ Editor design status</div>
      <div style="font-size:13px;color:#52525b;line-height:1.6">Per-edit option editing (add/delete/reorder per edit) is intentionally read-only in this prototype. The TNReady editor UX for Editing Task uses an inline-passage author mode; we'll spec the full interaction with engineering when this item type enters the build queue.</div>
    </div>`;
  },
  matrix: t => {
    const s = iteState('matrix');
    const mode = s.mode || 'single';
    const modes = [
      {id:'single', label:'One per row',    icon:'◉', hint:'Radio — student picks exactly one column per row (e.g. T/F/Not Stated)'},
      {id:'multi',  label:'Multi per row',  icon:'☑', hint:'Checkbox — student picks any number of columns per row'},
      {id:'match',  label:'Match pairs',    icon:'⇄', hint:'Connect items in left column to right column (e.g. organelle ↔ function)'},
    ];
    const modeTabs = `
      <div class="dd-var-tabs">
        ${modes.map(m => `
          <button class="dd-var-tab ${mode===m.id?'active':''}" onclick="iteMatrixSetMode('matrix','${m.id}')" title="${m.hint}">
            <span class="dd-var-ic">${m.icon}</span>${m.label}
          </button>`).join('')}
      </div>`;

    let body = '';
    if (mode === 'match') {
      body = `
        <div class="q-section-label">Match pairs · ${s.matchPairs.length} pairs <span class="q-section-help">students draw lines between matching items</span></div>
        <div class="dd-match-table">
          <div class="dd-match-row dd-match-head">
            <span>Left column</span>
            <span class="dd-match-arrow">↔</span>
            <span>Right column</span>
            <span></span>
          </div>
          ${s.matchPairs.map((p, i) => `
          <div class="dd-match-row">
            <input value="${(p.left||'').replace(/"/g,'&quot;')}" oninput="iteMatrixMatchSet('matrix',${i},'left',this.value)" placeholder="e.g. Mitochondria">
            <span class="dd-match-arrow">↔</span>
            <input value="${(p.right||'').replace(/"/g,'&quot;')}" oninput="iteMatrixMatchSet('matrix',${i},'right',this.value)" placeholder="e.g. Cellular respiration">
            <button class="dd-bucket-del" onclick="iteMatrixMatchDel('matrix',${i})">×</button>
          </div>`).join('')}
        </div>
        <button class="q-add-opt-btn" onclick="iteMatrixMatchAdd('matrix')">+ Add pair</button>`;
    } else {
      const isMulti = mode === 'multi';
      body = `
        <div class="q-section-label">Matrix · ${s.rows.length} rows × ${s.columns.length} columns <span class="q-section-help">click a cell to ${isMulti?'toggle':'set'} the correct answer</span></div>
        <div class="mx-table-wrap">
          <table class="mx-table">
            <thead>
              <tr>
                <th class="mx-corner"></th>
                ${s.columns.map((c, ci) => `
                <th class="mx-col-head">
                  <input value="${(c||'').replace(/"/g,'&quot;')}" oninput="iteMatrixUpdateCol('matrix',${ci},this.value)" placeholder="Col ${ci+1}">
                  <button class="mx-del" onclick="iteMatrixDelCol('matrix',${ci})" title="Delete column">×</button>
                </th>`).join('')}
                <th class="mx-add-col"><button onclick="iteMatrixAddCol('matrix')" title="Add column">+ Col</button></th>
              </tr>
            </thead>
            <tbody>
              ${s.rows.map((r, ri) => `
              <tr>
                <td class="mx-row-head">
                  <input value="${(r.label||'').replace(/"/g,'&quot;')}" oninput="iteMatrixUpdateRow('matrix',${ri},this.value)" placeholder="Row ${ri+1} statement">
                  <button class="mx-del" onclick="iteMatrixDelRow('matrix',${ri})" title="Delete row">×</button>
                </td>
                ${s.columns.map((_, ci) => {
                  const isCorrect = isMulti
                    ? (r.correctSet || []).includes(ci)
                    : r.correct === ci;
                  const handler = isMulti
                    ? `iteMatrixToggleCorrect('matrix',${ri},${ci})`
                    : `iteMatrixSetCorrect('matrix',${ri},${ci})`;
                  return `<td class="mx-cell"><span class="mx-mark ${isMulti?'sq':''} ${isCorrect?'on':''}" onclick="${handler}" title="Click to mark">${isCorrect?(isMulti?'✓':'●'):''}</span></td>`;
                }).join('')}
                <td></td>
              </tr>`).join('')}
              <tr class="mx-add-row">
                <td colspan="${s.columns.length+2}"><button onclick="iteMatrixAddRow('matrix')">+ Add row</button></td>
              </tr>
            </tbody>
          </table>
        </div>`;
    }

    return `
    ${qCardShell('matrix', {typeName:'Matrix / Tabular', body: modeTabs + body, showExplanation:true})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Settings</div>
      <div class="ed-row"><label>Partial credit per row</label>${edToggle('matrix','partial')}<span style="font-size:11px;color:#71717a">award per-correct, deduct per-wrong</span></div>
      <div class="ed-row"><label>Shuffle rows</label>${edToggle('matrix','shuffleRows')}</div>
    </div>`;
  },
  eq: t => {
    const s = iteState('eq');
    const tab = s.paletteTab || 'operators';
    const palettes = {
      greek:     ['α','β','γ','δ','ε','θ','λ','μ','π','ρ','σ','τ','φ','ω','Δ','Σ','Π','Ω'],
      operators: ['+','−','×','÷','=','≠','≈','≤','≥','±','∞','%','·','/','^','<','>'],
      functions: ['√','∛','sin(','cos(','tan(','log(','ln(','|x|','x²','x³','xⁿ','eˣ','π','i','∑','∫'],
      templates: ['a/b','√x','x²','xⁿ','(a,b)','{a,b,c}','[a,b]','f(x)','lim','d/dx','∫dx','∑ⁿ','x = ±a','x ∈ {…}'],
    };
    const tabs = ['greek','operators','functions','templates'];

    const isMatch = iteEqIsEquivalent(s.studentInput || '', s.equivalents || []);

    const body = `
      <div class="q-section-label">Accepted equation forms · ${s.equivalents.length}</div>
      <ul class="q-list">
        ${s.equivalents.map((e, i) => `
        <li class="q-list-row correct">
          <span class="q-list-tag">≡</span>
          <input class="q-list-input" value="${e.replace(/"/g,'&quot;')}" oninput="iteUpdateEquiv('eq',${i},this.value);iteRerender()" placeholder="e.g. x = ±2 or {-2, 2}" style="font-family:'SF Mono',monospace">
          <span class="q-list-actions"><button onclick="iteDelEquiv('eq',${i})">×</button></span>
        </li>`).join('')}
      </ul>
      <button class="q-add-opt-btn" onclick="iteAddEquiv('eq')">+ Add equivalent form</button>

      <div class="q-section-label" style="margin-top:14px">Symbol palette · click a symbol to insert into the student-demo input below <span class="q-section-help">student sees this same palette during the exam</span></div>
      <div class="eq-palette-tabs">
        ${tabs.map(tk => `<button class="eq-palette-tab ${tk===tab?'active':''}" onclick="iteEqSetPaletteTab('eq','${tk}')">${tk[0].toUpperCase()+tk.slice(1)}</button>`).join('')}
      </div>
      <div class="eq-palette-grid">
        ${palettes[tab].map(sym => `<button class="eq-key" onclick="iteEqInsert('eq','${sym.replace(/'/g, "\\'")}')">${sym}</button>`).join('')}
      </div>

      <div class="q-section-label" style="margin-top:14px">Try as student · live equivalence check <span class="q-section-help">type/insert an answer to see if it would auto-grade as correct</span></div>
      <div class="eq-try-row">
        <input class="eq-try-input" value="${(s.studentInput||'').replace(/"/g,'&quot;')}" oninput="iteEqSetStudentInput('eq',this.value);iteRerender()" placeholder="Type your answer attempt…">
        <span class="eq-try-verdict ${isMatch?'ok':'no'}">${isMatch?'✓ Equivalent — auto-graded correct':'✕ Not equivalent — would be marked wrong'}</span>
      </div>
      <div class="eq-try-hint">Engine normalises whitespace · case · ×/÷/* · or-separators · {} braces · sorted alternatives. ${s.settings.engine==='CAS'?'CAS mode also tries symbolic simplification.':'String mode only — no algebraic simplification.'}</div>`;
    return `
    ${qCardShell('eq', {typeName:'Equation Editor', body, showExplanation:true})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Grading engine</div>
      <div class="ed-row"><label>Equivalence engine</label>
        <select class="ed-input" style="max-width:240px" onchange="iteSetEqEngine('eq',this.value)">
          <option value="CAS"    ${s.settings.engine==='CAS'?'selected':''}>CAS · symbolic (recommended)</option>
          <option value="String" ${s.settings.engine==='String'?'selected':''}>String match only</option>
        </select>
      </div>
      <div class="ed-row"><label>Order-independent</label>${edToggle('eq','orderInsensitive')}<span style="font-size:11px;color:#71717a">"a + b" ≡ "b + a"</span></div>
      <div class="ed-row"><label>Show simplification hint</label>${edToggle('eq','simplificationHint')}<span style="font-size:11px;color:#71717a">e.g. "Try simplifying first"</span></div>
      <div class="ed-row"><label>Allow graphing calculator</label>${edToggle('eq','allowGraphing')}<span style="font-size:11px;color:#71717a">Desmos panel in side bar</span></div>
    </div>`;
  },
  graph: t => {
    const s = iteState('graph');
    const gtype = s.graphType || 'line';
    const types = [
      {id:'point',      label:'Single point',  icon:'·',  hint:'Plot a single ordered pair (x, y)'},
      {id:'line',       label:'Line',          icon:'╱',  hint:'Plot a straight line by 2 points or slope/intercept'},
      {id:'parabola',   label:'Parabola',      icon:'∪',  hint:'Quadratic — plot vertex + zeros'},
      {id:'region',     label:'Region (2D)',   icon:'▦',  hint:'Shade a half-plane defined by an inequality'},
      {id:'numberline', label:'Number line',   icon:'═',  hint:'Plot points on a 1-D number line'},
      {id:'inequality', label:'Inequality (1D)', icon:'≥', hint:'Open/closed circle + arrow on number line'},
    ];
    const typeTabs = `
      <div class="dd-var-tabs">
        ${types.map(g => `
          <button class="dd-var-tab ${gtype===g.id?'active':''}" onclick="iteGraphSetType('graph','${g.id}')" title="${g.hint}">
            <span class="dd-var-ic">${g.icon}</span>${g.label}
          </button>`).join('')}
      </div>`;
    const ans = s.answerByType[gtype] || '';

    const body = `
      ${typeTabs}
      <div class="q-section-label">Reference plot · ${gtype} <span class="q-section-help">this is the answer key — students see a blank canvas and plot their own</span></div>
      <div class="gr-canvas">${iteGraphRender(gtype)}</div>

      <div class="q-section-label" style="margin-top:14px">Answer key (text description)</div>
      <textarea class="ic-passage-edit" style="min-height:60px;font-family:'SF Mono',monospace" oninput="iteGraphSetAnswerForType('graph',this.value)" placeholder="e.g. y = x + 1 — slope 1, y-intercept 1">${ans}</textarea>

      <div class="q-section-label" style="margin-top:14px">Position tolerance</div>
      <input class="ed-input" value="${s.tolerance}" oninput="iteGraphSetTolerance('graph',this.value)" style="max-width:160px" placeholder="e.g. ±0.25 grid units">`;
    return `
    ${qCardShell('graph', {typeName:'Graphing / Number Line', body, showExplanation:true})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Tools available to student</div>
      <div class="ed-row"><label>Plot point</label>${edToolToggle('graph','plotPoint')}</div>
      <div class="ed-row"><label>Draw line</label>${edToolToggle('graph','drawLine')}</div>
      <div class="ed-row"><label>Draw segment / ray</label>${edToolToggle('graph','segment')}</div>
      <div class="ed-row"><label>Shade region</label>${edToolToggle('graph','shade')}<span style="font-size:11px;color:#71717a">required for Region type</span></div>
      <div class="ed-row"><label>Snap to grid</label>${edToolToggle('graph','snap')}</div>
    </div>`;
  },
  hotspot: t => {
    const s = iteState('hotspot');
    const correctCount = s.regions.filter(r => r.correct).length;
    const tool = s.activeTool || 'rect';

    // Render each region as SVG (rect or polygon), so polygons display properly
    const svgRegions = s.regions.map((r, i) => {
      const isC = r.correct;
      const cls = isC ? 'hs-region-correct' : 'hs-region-distractor';
      if (r.kind === 'polygon') {
        const pts = (r.points || []).map(([x,y]) => `${x},${y}`).join(' ');
        const cx = (r.points || []).reduce((a,p)=>a+p[0],0) / (r.points.length||1);
        const cy = (r.points || []).reduce((a,p)=>a+p[1],0) / (r.points.length||1);
        return `
          <polygon points="${pts}" class="hs-svg-shape ${cls}"></polygon>
          <foreignObject x="${cx-8}" y="${cy-3}" width="40" height="14">
            <div xmlns="http://www.w3.org/1999/xhtml" class="hs-svg-label">${isC?'✓ ':''}${r.name}</div>
          </foreignObject>`;
      }
      return `
        <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" class="hs-svg-shape ${cls}" rx="2"></rect>
        <foreignObject x="${r.x}" y="${Math.max(0,r.y-5)}" width="50" height="14">
          <div xmlns="http://www.w3.org/1999/xhtml" class="hs-svg-label">${isC?'✓ ':''}${r.name}</div>
        </foreignObject>`;
    }).join('');

    const body = `
      <div class="q-section-label">Image canvas <span class="q-section-help">${s.regions.length} regions · ${correctCount} correct · current tool: <b>${tool}</b></span></div>
      <div class="hs-toolbar">
        <div class="ht-tool-grp">
          <span class="ht-tool-lbl">Tool</span>
          <div class="ht-seg">
            <button class="ht-seg-btn ${tool==='rect'?'active':''}" onclick="iteHotspotSetTool('hotspot','rect')" title="Rectangle: drag corners to size">▭ Rect</button>
            <button class="ht-seg-btn ${tool==='polygon'?'active':''}" onclick="iteHotspotSetTool('hotspot','polygon')" title="Polygon: click to add vertices, double-click to close">⬡ Polygon</button>
          </div>
        </div>
        <div class="ht-tool-grp">
          <button class="ht-action" onclick="iteHotspotAddRegion('hotspot')">+ Add ${tool==='polygon'?'polygon':'region'}</button>
          <button class="ht-action" onclick="iteToast('Image upload — demo only','info')">📷 Replace image</button>
        </div>
      </div>
      <div class="hs-canvas">
        <div class="hs-img-bg">🖼 ${s.imageFile} <span class="hs-img-alt">${s.imageAlt}</span></div>
        <svg class="hs-svg" viewBox="0 0 100 100" preserveAspectRatio="none">${svgRegions}</svg>
      </div>

      <div class="q-section-label" style="margin-top:14px">Region details</div>
      <ul class="q-list">
        ${s.regions.map((r, i) => `
        <li class="q-list-row ${r.correct?'correct':''}">
          <span class="q-list-tag" onclick="iteHotspotToggleCorr('hotspot',${i})" style="cursor:pointer" title="Toggle correct">${r.correct?'✓':i+1}</span>
          <input class="q-list-input" value="${(r.name||'').replace(/"/g,'&quot;')}" oninput="iteHotspotSetName('hotspot',${i},this.value)" placeholder="Region name (e.g. Mitochondria)">
          <span style="font-size:10px;color:#71717a;background:#f4f4f5;padding:2px 7px;border-radius:5px;font-weight:600;text-transform:uppercase">${r.kind}</span>
          <span class="q-list-actions"><button onclick="iteHotspotDelRegion('hotspot',${i})">×</button></span>
        </li>`).join('')}
      </ul>`;
    return `
    ${qCardShell('hotspot', {typeName:'Hot Spot (Image)', body, showExplanation:true})}
    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Student interaction</div>
      <div class="ed-row"><label>Max selections allowed</label><input class="ed-input" value="${s.maxSelections}" oninput="iteHotspotSetMaxSel('hotspot',this.value)" type="number" min="1" style="max-width:80px"><span style="font-size:11px;color:#71717a">student can click at most this many regions</span></div>
      <div class="ed-row"><label>Required clicks</label><input class="ed-input" value="${s.requiredClicks}" oninput="iteSetReqClicks('hotspot',this.value)" type="number" style="max-width:80px"></div>
      <div class="ed-row"><label>Allow multiple correct regions</label>${edToggle('hotspot','multiCorrect')}</div>
      <div class="ed-row"><label>Show outline on hover</label>${edToggle('hotspot','hover')}</div>
      <div class="ed-row"><label>Show region outlines to student</label>${edToggle('hotspot','showOutlines')}<span style="font-size:11px;color:#71717a">turn off for blind-target items</span></div>
      <div class="ed-row"><label>Snap polygon vertices to grid</label>${edToggle('hotspot','snapGrid')}</div>
    </div>`;
  },
  audio: t => {
    const s = iteState('audio');
    const ftype = s.followupType || 'mc';
    const followups = [
      {id:'mc', label:'Multiple Choice',  icon:'◉', hint:'Single-correct multiple choice'},
      {id:'ms', label:'Multi-Select',     icon:'☑', hint:'2+ correct options'},
      {id:'fib', label:'Fill in Blank',   icon:'⌐', hint:'Short typed answer (auto-graded)'},
      {id:'cr',  label:'Constructed Resp.',icon:'✎', hint:'Open-ended written response'},
    ];
    const followupTabs = `
      <div class="dd-var-tabs">
        ${followups.map(f => `
          <button class="dd-var-tab ${ftype===f.id?'active':''}" onclick="iteAudioSetFollowup('audio','${f.id}')" title="${f.hint}">
            <span class="dd-var-ic">${f.icon}</span>${f.label}
          </button>`).join('')}
      </div>`;

    // Static waveform: 60 random-ish bars driven by a deterministic PRF on
    // the duration. Segment markers overlay on top.
    const dur = s.durationSec || 60;
    const bars = Array.from({length:60}, (_, i) => {
      const seed = (i * 37) % 100;
      const h = 12 + (seed % 70);
      return h;
    });
    const waveBars = bars.map(h => `<span class="aud-wave-bar" style="height:${h}%"></span>`).join('');
    const segMarkers = (s.segments || []).map((sg, i) => {
      const left = (sg.start / dur) * 100;
      const width = ((sg.end - sg.start) / dur) * 100;
      return `<div class="aud-seg-marker" style="left:${left}%;width:${width}%" title="${sg.label}"><span>${sg.label}</span></div>`;
    }).join('');

    let followupBody = '';
    if (ftype === 'mc' || ftype === 'ms') {
      // Force the choice-card into the right mode for this preview
      s.multi = (ftype === 'ms');
      followupBody = qCardChoiceEditor('audio', {
        typeName: ftype === 'ms' ? 'Audio · Multi-Select' : 'Audio · Multiple Choice',
        modeBadge: false,
        showModeTabs: false,
      });
    } else if (ftype === 'fib') {
      followupBody = `
        <div class="ed-card">
          <div class="ed-card-label">Question stem (typed by student in a text input)</div>
          ${edStemTools()}
          <textarea class="ed-stem-input" oninput="iteSetStem('audio',this.value)">${s.stem}</textarea>
          <div class="ed-card-label" style="margin-top:14px">Accepted answers · ${s.fibAnswers.length}</div>
          <ul class="q-list">
            ${s.fibAnswers.map((a, i) => `
            <li class="q-list-row correct">
              <span class="q-list-tag">${i+1}</span>
              <input class="q-list-input" value="${(a||'').replace(/"/g,'&quot;')}" oninput="iteAudioFibUpdate('audio',${i},this.value)" placeholder="acceptable answer (case-insensitive)">
              <span class="q-list-actions"><button onclick="iteAudioFibDel('audio',${i})">×</button></span>
            </li>`).join('')}
          </ul>
          <button class="q-add-opt-btn" onclick="iteAudioFibAdd('audio')">+ Add accepted answer</button>
        </div>`;
    } else if (ftype === 'cr') {
      followupBody = `
        <div class="ed-card">
          <div class="ed-card-label">Constructed-response prompt</div>
          ${edStemTools()}
          <textarea class="ed-stem-input" oninput="iteSetStem('audio',this.value)">${s.stem}</textarea>
          <div class="ed-card-label" style="margin-top:14px">Sample full-credit answer (rubric anchor · hidden from student)</div>
          <textarea class="ed-stem-input" style="min-height:80px" oninput="iteAudioCrSet('audio',this.value)">${s.crSample || ''}</textarea>
          <div class="ed-card-help" style="margin-top:6px">Connect a rubric in <b>Settings → Rubric</b>. Auto-scoring uses Kira AI; teacher reviews.</div>
        </div>`;
    }

    return `
    <div class="ed-card">
      <div class="ed-card-label">Audio prompt</div>
      <div class="ed-audio-row">
        <div class="ed-audio-icon">🎧</div>
        <div class="ed-audio-meta">
          <div class="nm"><input value="${s.audioFile}" oninput="iteSetAudioFile('audio',this.value)" style="border:none;background:transparent;font-size:13px;font-weight:600;color:#18181b;width:100%;outline:none"></div>
          <div class="info">${s.duration} · uploaded · auto-transcribed</div>
        </div>
        <div class="ed-audio-actions">
          <button onclick="iteToast('Playback — demo only','info')">▶ Play</button>
          <button onclick="iteToast('Audio upload — demo only','info')">↺ Replace</button>
        </div>
      </div>
      <div class="aud-wave-card">
        <div class="aud-wave-track">
          ${waveBars}
          ${segMarkers}
        </div>
        <div class="aud-wave-time">
          <span>0:00</span><span>${audioFmtTime(Math.floor(dur/2))}</span><span>${s.duration}</span>
        </div>
      </div>
      <div class="ed-card-label" style="margin-top:14px">Audio segments · ${s.segments.length} <span style="font-size:11px;color:#71717a;font-weight:500">define playable chunks for "play 0:30-1:00 then answer"</span></div>
      <div class="aud-seg-list">
        ${s.segments.map((sg, i) => `
        <div class="aud-seg-row">
          <span class="aud-seg-num">${i+1}</span>
          <input class="aud-seg-input" value="${sg.start}" oninput="iteAudioSegSet('audio',${i},'start',this.value)" type="number" min="0" max="${dur}" title="Start (sec)">
          <span style="color:#a1a1aa">→</span>
          <input class="aud-seg-input" value="${sg.end}" oninput="iteAudioSegSet('audio',${i},'end',this.value)" type="number" min="0" max="${dur}" title="End (sec)">
          <input class="aud-seg-label" value="${(sg.label||'').replace(/"/g,'&quot;')}" oninput="iteAudioSegSet('audio',${i},'label',this.value)" placeholder="Segment label">
          <button class="dd-bucket-del" onclick="iteAudioSegDel('audio',${i})">×</button>
        </div>`).join('')}
      </div>
      <button class="q-add-opt-btn" onclick="iteAudioSegAdd('audio')">+ Add segment</button>
    </div>
    <div class="ed-card">
      <div class="ed-card-label">Auto-generated transcript (optional, hidden from student)</div>
      <textarea class="ed-stem-input" style="min-height:80px" oninput="iteSetTranscript('audio',this.value)">${s.transcript}</textarea>
    </div>

    <div class="ed-card">
      <div class="ed-card-label">Follow-up question type</div>
      ${followupTabs}
    </div>
    ${followupBody}

    <div class="ed-card" style="margin-top:14px">
      <div class="ed-card-label">Audio settings</div>
      <div class="ed-row"><label>Replay limit</label>
        <select class="ed-input" style="max-width:120px" onchange="iteSetReplay('audio',this.value)">
          ${['1','2','3','Unlimited'].map(n => `<option ${String(n)===String(s.settings.replayLimit)?'selected':''}>${n}</option>`).join('')}
        </select>
      </div>
      <div class="ed-row"><label>Show transcript on request</label>${edToggle('audio','transcriptShow')}<span style="font-size:11px;color:#71717a">Accommodation only</span></div>
      <div class="ed-row"><label>Auto-pause on focus loss</label>${edToggle('audio','autoPause')}</div>
    </div>`;
  },
};

