// @ts-nocheck
// Phase-2 slice: lines 1130-1566 of original src/app.ts

// ═══════ Item Properties Drawer ═══════
let _ipState = { qId:0, qDomain:'', qType:'', primary:null, secondary:[], pickerOpen:false, assessmentType:'general', examTab:null, advancedOpen:false };

function getItemPropertiesAssessmentType() {
  const templateId = typeof activeTemplateId !== 'undefined' ? activeTemplateId : null;
  if (templateId === 'act') return 'ACT';
  if (templateId === 'tcap') return 'TCAP';
  if (templateId === 'sat') return 'SAT';
  return 'general';
}

function openItemProperties(qId, qDomain, qType) {
  const mock = { id:qId, n:qId, domain:qDomain, type:qType };
  const { primary, secondary } = getCanonicalForQuestion(mock);
  const assessmentType = getItemPropertiesAssessmentType();
  _ipState = { qId, qDomain, qType, primary, secondary, pickerOpen:false, assessmentType, examTab:assessmentType === 'general' ? null : assessmentType, advancedOpen:false };
  document.getElementById('ipQuestionRef').textContent = `Q${qId} · ${qDomain || 'Reading'}`;
  renderItemPropertiesBody();
  document.getElementById('itemPropsOverlay').classList.add('open');
}
function closeItemProperties() {
  document.getElementById('itemPropsOverlay').classList.remove('open');
}
function _ipRemove(which, id) {
  if (which === 'primary') _ipState.primary = null;
  else _ipState.secondary = _ipState.secondary.filter(s => s !== id);
  renderItemPropertiesBody();
}
function _ipPromote(id) {
  if (_ipState.primary) _ipState.secondary.push(_ipState.primary);
  _ipState.primary = id;
  _ipState.secondary = _ipState.secondary.filter(s => s !== id);
  renderItemPropertiesBody();
}
function _ipAccept(id, isPrimary) {
  if (isPrimary && !_ipState.primary) _ipState.primary = id;
  else if (!_ipState.secondary.includes(id) && _ipState.primary !== id) _ipState.secondary.push(id);
  renderItemPropertiesBody();
}
function _ipTogglePicker() {
  _ipState.pickerOpen = !_ipState.pickerOpen;
  renderItemPropertiesBody();
}
function _ipSetExamTab(tab) {
  _ipState.examTab = tab;
  renderItemPropertiesBody();
}
function _ipToggleAdvanced() {
  _ipState.advancedOpen = !_ipState.advancedOpen;
  renderItemPropertiesBody();
}

function renderItemPropertiesBody() {
  const st = _ipState;
  const assigned = [st.primary, ...st.secondary].filter(Boolean);
  const aiSuggestions = (() => {
    const allSkills = Object.keys(CANONICAL_SKILLS);
    const domainHint = (st.qDomain || '').toLowerCase();
    const pool = allSkills.filter(k => {
      const s = CANONICAL_SKILLS[k];
      if (domainHint.includes('reading') || domainHint.includes('comprehension') || domainHint.includes('literature') || domainHint.includes('vocab')) return s.domain === 'Reading';
      if (domainHint.includes('english') || domainHint.includes('grammar') || domainHint.includes('writing')) return s.domain === 'English' || k === 'reading.vocab_in_context';
      if (domainHint.includes('math')) return s.domain === 'Math';
      return s.domain === 'Reading';
    });
    const seed = st.qId || 1;
    return pool.filter(p => !assigned.includes(p)).slice(seed % 3, (seed % 3) + 3).map((id, i) => ({ id, confidence: 0.92 - i * 0.07 }));
  })();

  const nativeTags = new Set();
  assigned.forEach(cid => (CANONICAL_TO_TEST_NATIVE[cid] || []).forEach(t => nativeTags.add(t)));
  const groupedNative = {};
  nativeTags.forEach(t => {
    const [test] = t.split(':');
    (groupedNative[test] = groupedNative[test] || []).push(t);
  });
  if (st.assessmentType === 'TCAP') {
    groupedNative.TCAP = groupedNative.TCAP || [
      'TCAP:ELA:Reading Informational Text',
      'TCAP:ELA:Key Ideas & Details'
    ];
  }

  const renderChip = (id, variant) => {
    const s = CANONICAL_SKILLS[id];
    if (!s) return '';
    const removable = variant !== 'suggested';
    return `<span class="canonical-chip ${variant}" ${variant === 'suggested' ? `onclick="_ipAccept('${id}',${st.primary ? 'false' : 'true'})"` : ''}>
      <span>${s.name}</span>
      <span class="chip-tag">${id}</span>
      ${variant === 'secondary' ? `<button class="chip-remove" onclick="event.stopPropagation();_ipPromote('${id}')" title="Promote to primary">▲</button>` : ''}
      ${removable ? `<button class="chip-remove" onclick="event.stopPropagation();_ipRemove('${variant}','${id}')" title="Remove">✕</button>` : ''}
    </span>`;
  };

  const picker = st.pickerOpen ? `
    <div class="ip-skill-picker open" onclick="event.stopPropagation()">
      <input class="picker-search" placeholder="Search skills (e.g. inference, vocab)…" oninput="_ipPickerFilter(this.value)">
      <div id="ipPickerList">${_ipPickerItems('')}</div>
    </div>` : '';

  const primarySkill = st.primary ? CANONICAL_SKILLS[st.primary] : null;
  const isStandardizedAssessment = st.assessmentType !== 'general';
  const examTabs = isStandardizedAssessment ? [st.assessmentType] : [];
  const activeTags = groupedNative[st.examTab] || [];
  const mappingByExam = {
    ACT: {
      title:'ACT reporting projection',
      sub:'No grade required. ACT uses section and reporting category for score interpretation.',
      fields:[
        ['Section', primarySkill?.domain === 'English' ? 'English' : primarySkill?.domain === 'Math' ? 'Math' : 'Reading'],
        ['Reporting category', activeTags.length ? activeTags.map(t => t.split(':').slice(1).join(' · ')).join(', ') : 'Auto-map from canonical skill'],
        ['Score output', 'Section score 1-36 · Composite contribution'],
        ['Teacher edit rule', 'Suggest correction; content admin can override']
      ],
      note:'ACT mapping intentionally omits grade level.'
    },
    TCAP: {
      title:'TCAP standards projection',
      sub:'TCAP needs grade, subject, standard, and performance-level reporting.',
      fields:[
        ['Grade', 'Grade 7'],
        ['Subject', primarySkill?.domain === 'Math' ? 'Math' : 'ELA'],
        ['Standard / cluster', activeTags.length ? activeTags.map(t => t.split(':').slice(1).join(' · ')).join(', ') : 'Auto-map from standards + skill'],
        ['Score output', 'Scale score · Below / Approaching / On Track / Mastered']
      ],
      note:'TCAP keeps grade because state accountability reports depend on grade-specific cut scores.'
    },
    SAT: {
      title:'SAT reporting projection',
      sub:'SAT uses domain-level reporting across Reading/Writing and Math.',
      fields:[
        ['Domain', primarySkill?.domain === 'Math' ? 'Math' : 'Reading and Writing'],
        ['Skill group', activeTags.length ? activeTags.map(t => t.split(':').slice(1).join(' · ')).join(', ') : 'Auto-map from canonical skill'],
        ['Module usage', 'Adaptive module 1 or 2 eligible'],
        ['Teacher edit rule', 'Suggest correction; admin override for shared bank items']
      ],
      note:'SAT mapping is collapsed unless the item is used in a SAT template.'
    }
  };
  const activeMap = mappingByExam[st.examTab] || null;
  const usableOptions = st.assessmentType === 'general'
    ? '<option selected>Current assessment</option><option selected>Benchmark practice</option><option>ACT template</option><option>TCAP template</option><option>SAT template</option><option>District common assessment</option>'
    : `<option selected>${st.assessmentType} template</option><option selected>Benchmark practice</option><option>Current assessment</option><option>District common assessment</option>`;
  const assessmentMappingHtml = isStandardizedAssessment && activeMap ? `
    <div class="ip-section ip-card">
      <div class="ip-sec-head">
        <div class="ip-sec-title"><span class="ip-sec-icon">🧩</span>${st.assessmentType} blueprint mapping</div>
        <span style="font-size:10px;color:#a1a1aa">template-specific · correctable</span>
      </div>
      <div class="ip-sec-desc">This section appears because the current assessment was created from a ${st.assessmentType} template. Generic assessments do not show ACT / TCAP / SAT mappings by default.</div>
      <div class="ip-tabs">
        ${examTabs.map(tab => `<button class="ip-tab active" onclick="_ipSetExamTab('${tab}')">${tab}${tab==='TCAP'?' · grade':''}</button>`).join('')}
      </div>
      <div class="ip-map-card">
        <div class="ip-map-top">
          <div>
            <div class="ip-map-title">${activeMap.title}</div>
            <div class="ip-map-sub">${activeMap.sub}</div>
          </div>
          <span class="ip-native-chip derived">auto</span>
        </div>
        <div class="ip-map-grid">
          ${activeMap.fields.map(([label,value]) => `<div class="ip-map-field ${String(value).length > 64 ? 'full' : ''}"><div class="label">${label}</div><div class="value">${value}</div></div>`).join('')}
        </div>
        <div class="ip-map-footer">
          <div class="ip-mini-note">${activeMap.note}</div>
          <button class="ip-correction-link">Report mismatch</button>
        </div>
      </div>
    </div>` : `
    <div class="ip-section ip-card">
      <div class="ip-sec-head">
        <div class="ip-sec-title"><span class="ip-sec-icon">🧩</span>Assessment use</div>
        <span style="font-size:10px;color:#a1a1aa">general assessment</span>
      </div>
      <div class="ip-sec-desc">This item is part of a teacher-created or general assessment. Keep tagging focused on reusable skills, standards, and item-bank metadata.</div>
      <div class="ip-map-card">
        <div class="ip-map-top">
          <div>
            <div class="ip-map-title">No standardized blueprint attached</div>
            <div class="ip-map-sub">ACT, TCAP, and SAT projections stay hidden unless this assessment is created from one of those templates or an admin attaches a blueprint.</div>
          </div>
          <span class="ip-native-chip editable">optional</span>
        </div>
        <div class="ip-map-grid">
          <div class="ip-map-field"><div class="label">Scoring</div><div class="value">Points / rubric</div></div>
          <div class="ip-map-field"><div class="label">Reporting</div><div class="value">Teacher Analytics by skill and standard</div></div>
          <div class="ip-map-field full"><div class="label">Optional setup</div><div class="value">Attach ACT, TCAP, SAT, or district blueprint only when this assessment needs standardized reporting.</div></div>
        </div>
        <div class="ip-map-footer">
          <div class="ip-mini-note">This keeps the common editor from feeling like an ACT / TCAP-only product.</div>
          <button class="ip-correction-link">Attach blueprint</button>
        </div>
      </div>
    </div>`;

  const body = `
    <div class="ip-summary-row">
      <div class="ip-summary-chip"><div class="label">Item source</div><div class="value">Teacher-authored</div></div>
      <div class="ip-summary-chip"><div class="label">Editability</div><div class="value">Directly editable</div></div>
      <div class="ip-summary-chip"><div class="label">Question type</div><div class="value">${st.qType || 'Multiple choice'}</div></div>
    </div>

    <div class="ip-section ip-card emphasis">
      <div class="ip-sec-head">
        <div class="ip-sec-title"><span class="ip-sec-icon">🧭</span>Core tagging <span class="ip-sec-req">*</span></div>
        <span style="font-size:10px;color:#a1a1aa">teacher-facing</span>
      </div>
      <div class="ip-section-row">
        <div class="ip-section-label">Primary skill</div>
        <div class="ip-section-value">
          <div class="canonical-picker-row">
            ${st.primary ? renderChip(st.primary, 'primary') : ''}
            ${!st.primary ? '<span style="font-size:11px;color:#a1a1aa">Choose the main skill this item measures.</span>' : ''}
            <button class="canonical-add-btn" onclick="event.stopPropagation();_ipTogglePicker()" style="position:relative">${st.primary ? 'Change' : '+ Add'} skill${picker}</button>
          </div>
          <div class="ip-mini-note">Used for Teacher Analytics, reporting categories, and intervention grouping.</div>
        </div>
      </div>
      <div class="ip-section-row">
        <div class="ip-section-label">Secondary skills</div>
        <div class="ip-section-value">
          <div class="canonical-picker-row">
            ${st.secondary.length ? st.secondary.map(id => renderChip(id, 'secondary')).join('') : '<span style="font-size:11px;color:#a1a1aa">Optional supporting skills. Keep this short.</span>'}
          </div>
        </div>
      </div>

      ${aiSuggestions.length ? `<div class="ip-ai-suggestions">
        <div class="ip-ai-head">
          <span class="ip-ai-title">✨ AI suggestions <span style="font-weight:500;color:#a78bfa;font-size:10px">(click to add)</span></span>
          <button class="btn-ip-regenerate" onclick="renderItemPropertiesBody()">↻ Regenerate</button>
        </div>
        <div>${aiSuggestions.map(s => `<span class="canonical-chip suggested" onclick="_ipAccept('${s.id}',${st.primary ? 'false' : 'true'})"><span>${CANONICAL_SKILLS[s.id].name}</span><span class="chip-tag">${s.id}</span><span class="chip-confidence">${Math.round(s.confidence * 100)}%</span></span>`).join('')}</div>
      </div>` : ''}
    </div>

    <div class="ip-section ip-card">
      <div class="ip-sec-head">
        <div class="ip-sec-title"><span class="ip-sec-icon">📚</span>Standards alignment</div>
        <span class="ip-native-chip editable">editable</span>
      </div>
      <div class="ip-sec-desc">This is the platform-compatible layer that replaces the old crowded standards/skills tag list.</div>
      <div class="ip-standards-card">
        <div class="ip-standard-path">
          <span>Tennessee Academic Standards</span><span>ELA</span><span>Grade 7</span><span>Reading Informational Text</span>
        </div>
        <div class="ip-standard-main">
          <div>
            <div class="ip-standard-code">7.RI.KID.2</div>
            <div class="ip-standard-title">Determine central ideas and summarize supporting details.</div>
            <div class="ip-standard-desc">Aligned because the item asks students to identify the central claim and select evidence from the passage.</div>
          </div>
          <button class="ip-small-action">Change</button>
        </div>
      </div>
    </div>

    ${assessmentMappingHtml}

    <div class="ip-accordion ${st.advancedOpen ? 'open' : ''}">
      <button class="ip-accordion-toggle" onclick="_ipToggleAdvanced()">
        <span><span class="title">Usage, metadata & eligibility</span><br><span class="sub">Advanced fields for item bank search and governance</span></span>
        <span style="font-size:14px;color:#71717a">${st.advancedOpen ? '⌃' : '⌄'}</span>
      </button>
      <div class="ip-accordion-body">
      <div class="ip-metadata-grid">
        <div class="ip-metadata-field"><label>Usable in tests</label>
          <select multiple style="height:64px">
            ${usableOptions}
          </select>
        </div>
        <div class="ip-metadata-field"><label>Difficulty (calibrated)</label>
          <select><option>Easy</option><option selected>Medium</option><option>Hard</option></select>
        </div>
        <div class="ip-metadata-field"><label>Source</label>
          <select><option>AI-generated</option><option selected>Teacher-authored</option><option>Released reference</option><option>Licensed item bank</option></select>
        </div>
        <div class="ip-metadata-field"><label>Usage eligibility</label>
          <select><option selected>Diagnostic + reporting</option><option>Diagnostic only</option><option>Reporting only</option><option>Field test only</option></select>
        </div>
      </div>
      <div class="ip-mini-note">Official or licensed content would show a correction request workflow instead of direct edits.</div>
      </div>
    </div>`;
  document.getElementById('itemPropsBody').innerHTML = body;
}

function _ipPickerItems(q) {
  const query = (q || '').toLowerCase();
  const byDomain = {};
  Object.entries(CANONICAL_SKILLS).forEach(([id, s]) => {
    if (query && !(id.toLowerCase().includes(query) || s.name.toLowerCase().includes(query))) return;
    (byDomain[s.domain] = byDomain[s.domain] || []).push({ id, ...s });
  });
  return Object.entries(byDomain).map(([dom, list]) => `
    <div class="picker-group-label">${dom}</div>
    ${list.map(s => `<div class="picker-item" onclick="_ipAccept('${s.id}',${_ipState.primary ? 'false' : 'true'});_ipState.pickerOpen=false;renderItemPropertiesBody()">
      <span>${s.name}${s.testOnly ? `<span class="canonical-skill-row csr-test-badge" style="margin-left:6px">${s.testOnly[0]}-only</span>` : ''}</span>
      <span class="picker-id">${s.id}</span>
    </div>`).join('')}
  `).join('');
}
function _ipPickerFilter(q) {
  const list = document.getElementById('ipPickerList');
  if (list) list.innerHTML = _ipPickerItems(q);
}

function toggleInlineTaggingPanel(btn, qId, qDomain, qType) {
  document.querySelectorAll('.inline-tagging-panel').forEach(panel => panel.remove());
  openItemProperties(qId, qDomain, qType);
}

function closeInlineTaggingPanel(btn) {
  const panel = btn.closest('.inline-tagging-panel');
  if (panel) panel.remove();
}

function renderInlineTaggingPanel(qId, qDomain, qType) {
  const mock = { id:qId, n:qId, domain:qDomain, type:qType };
  const { primary, secondary } = getCanonicalForQuestion(mock);
  const primarySkill = primary ? CANONICAL_SKILLS[primary] : null;
  const secondaryHtml = secondary.length
    ? secondary.map(id => `<span class="canonical-chip secondary"><span>${CANONICAL_SKILLS[id]?.name || id}</span><span class="chip-tag">${id}</span></span>`).join('')
    : '<span style="font-size:11px;color:#a1a1aa">Optional supporting skills. Keep this short.</span>';
  const primaryHtml = primary
    ? `<span class="canonical-chip primary"><span>${primarySkill?.name || primary}</span><span class="chip-tag">${primary}</span></span>`
    : '<span style="font-size:11px;color:#a1a1aa">Choose the main skill this item measures.</span>';
  const actCategory = primarySkill?.domain === 'Math'
    ? 'Math · Preparing for Higher Math'
    : primarySkill?.domain === 'English'
      ? 'English · Conventions of Standard English'
      : 'Reading · Key Ideas & Details';
  const satCategory = primarySkill?.domain === 'Math'
    ? 'Math · Algebra / Advanced Math'
    : 'Reading and Writing · Information and Ideas';

  return `
    <div class="inline-tagging-head">
      <div>
        <div class="inline-tagging-title">🧭 Assessment Tagging <span style="font-size:11px;color:#71717a;font-weight:700">Q${qId}</span></div>
        <div class="inline-tagging-sub">Edit what this item measures here. Test-specific tags are projected below, so teachers do not manage ACT / TCAP / SAT tags one by one.</div>
      </div>
      <div class="inline-tagging-actions">
        <button class="ip-small-action">Apply to similar</button>
        <button class="inline-tagging-close" onclick="closeInlineTaggingPanel(this)">×</button>
      </div>
    </div>
    <div class="inline-tagging-body">
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="ip-card emphasis">
          <div class="ip-sec-head">
            <div class="ip-sec-title"><span class="ip-sec-icon">🧭</span>Core tagging <span class="ip-sec-req">*</span></div>
            <span style="font-size:10px;color:#a1a1aa">teacher-facing</span>
          </div>
          <div class="ip-section-row">
            <div class="ip-section-label">Primary skill</div>
            <div class="ip-section-value">
              <div class="canonical-picker-row">${primaryHtml}<button class="canonical-add-btn">Change skill</button></div>
              <div class="ip-mini-note">Main driver for Teacher Analytics, reporting groups, and intervention planning.</div>
            </div>
          </div>
          <div class="ip-section-row">
            <div class="ip-section-label">Secondary skills</div>
            <div class="ip-section-value"><div class="canonical-picker-row">${secondaryHtml}<button class="canonical-add-btn">+ Add optional</button></div></div>
          </div>
          <div class="ip-ai-suggestions">
            <div class="ip-ai-head">
              <span class="ip-ai-title">✨ AI suggestions <span style="font-weight:500;color:#a78bfa;font-size:10px">(click to add)</span></span>
              <button class="btn-ip-regenerate">↻ Regenerate</button>
            </div>
            <span class="canonical-chip suggested"><span>Supporting Details</span><span class="chip-tag">reading.supporting_detail</span><span class="chip-confidence">88%</span></span>
            <span class="canonical-chip suggested"><span>Textual Evidence</span><span class="chip-tag">reading.evidence_based</span><span class="chip-confidence">81%</span></span>
          </div>
        </div>
        <div class="ip-card">
          <div class="ip-sec-head">
            <div class="ip-sec-title"><span class="ip-sec-icon">📚</span>Standards alignment</div>
            <span class="ip-native-chip editable">editable</span>
          </div>
          <div class="ip-standards-card">
            <div class="ip-standard-path">
              <span>Tennessee Academic Standards</span><span>ELA</span><span>Grade 7</span><span>Reading Informational Text</span>
            </div>
            <div class="ip-standard-main">
              <div>
                <div class="ip-standard-code">7.RI.KID.2</div>
                <div class="ip-standard-title">Determine central ideas and summarize supporting details.</div>
                <div class="ip-standard-desc">This replaces the crowded standards/skills tag stack with a compact alignment card.</div>
              </div>
              <button class="ip-small-action">Change</button>
            </div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="ip-card">
          <div class="ip-sec-head">
            <div class="ip-sec-title"><span class="ip-sec-icon">🧩</span>Assessment mapping</div>
            <span style="font-size:10px;color:#a1a1aa">auto-mapped · correctable</span>
          </div>
          <div class="ip-tabs">
            <button class="ip-tab">ACT</button>
            <button class="ip-tab active">TCAP · grade</button>
            <button class="ip-tab">SAT</button>
          </div>
          <div class="ip-map-card">
            <div class="ip-map-top">
              <div>
                <div class="ip-map-title">TCAP standards projection</div>
                <div class="ip-map-sub">TCAP needs grade, subject, standard, and performance-level reporting.</div>
              </div>
              <span class="ip-native-chip derived">auto</span>
            </div>
            <div class="ip-map-grid">
              <div class="ip-map-field"><div class="label">Grade</div><div class="value">Grade 7</div></div>
              <div class="ip-map-field"><div class="label">Subject</div><div class="value">ELA</div></div>
              <div class="ip-map-field full"><div class="label">TCAP cluster</div><div class="value">ELA · Reading Informational Text · Key Ideas & Details</div></div>
              <div class="ip-map-field full"><div class="label">Score output</div><div class="value">Scale score · Below / Approaching / On Track / Mastered</div></div>
            </div>
            <div class="ip-map-footer">
              <div class="ip-mini-note">ACT projection: ${actCategory}. SAT projection: ${satCategory}.</div>
              <button class="ip-correction-link">Report mismatch</button>
            </div>
          </div>
        </div>
        <div class="ip-accordion">
          <button class="ip-accordion-toggle">
            <span><span class="title">Usage, metadata & eligibility</span><br><span class="sub">Advanced fields stay collapsed by default</span></span>
            <span style="font-size:14px;color:#71717a">⌄</span>
          </button>
        </div>
      </div>
    </div>`;
}

