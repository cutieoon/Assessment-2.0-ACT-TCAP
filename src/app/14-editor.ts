// @ts-nocheck
// Phase-2 slice: lines 13643-14545 of original src/app.ts

// ═══════ SECTION MENU UTILITIES ═══════
let _openMenuId = null;
function toggleSectionMenu(menuId) {
  const menu = document.getElementById(menuId);
  const btn = document.getElementById('btn-' + menuId);
  if (!menu) return;
  const wasOpen = menu.classList.contains('show');
  closeAllSectionMenus();
  if (!wasOpen) {
    menu.classList.add('show');
    if (btn) btn.classList.add('open');
    _openMenuId = menuId;
  }
}
function closeSectionMenu(menuId) {
  const menu = document.getElementById(menuId);
  const btn = document.getElementById('btn-' + menuId);
  if (menu) menu.classList.remove('show');
  if (btn) btn.classList.remove('open');
  _openMenuId = null;
}
function closeAllSectionMenus() {
  document.querySelectorAll('.section-menu.show').forEach(m => m.classList.remove('show'));
  document.querySelectorAll('.section-menu-btn.open').forEach(b => b.classList.remove('open'));
  _openMenuId = null;
}
document.addEventListener('click', () => closeAllSectionMenus());

// ═══════ GENERIC SECTIONS (managed in sidebar, ⋯ menu) ═══════
let _openAqmId = null;
function toggleAddQMenu(secId) {
  const el = document.getElementById('aqm-' + secId);
  if (!el) return;
  if (_openAqmId && _openAqmId !== secId) closeAddQMenu();
  el.classList.toggle('open');
  _openAqmId = el.classList.contains('open') ? secId : null;
}
function closeAddQMenu() {
  if (_openAqmId) {
    const el = document.getElementById('aqm-' + _openAqmId);
    if (el) el.classList.remove('open');
    _openAqmId = null;
  }
}
// MVP types we render inline in the editor (mapped to existing display types)
const ADDQ_TYPE_MAP = {
  mc:           {label:'Multiple Choice',         type:'MC'},
  twopart:      {label:'Two-Part / Evidence',     type:'TP'},
  fib:          {label:'Fill in the Blank',       type:'FIB'},
  freeresponse: {label:'Constructed Response',    type:'CR'},
  passage:      {label:'Reading Passage',         type:'RR'},
  gridIn:       {label:'Grid-In / Numeric',       type:'GRIDIN'},
  essay:        {label:'Writing Prompt / Essay',  type:'ESSAY'},
  hottext:      {label:'Hot Text',                type:'HOTTEXT'},
};
function addQType(secId, qType) {
  // Phase 2 types open the library showcase instead of editor stub
  const phase2 = ['dragdrop','inline','matrix','eq','graph','hotspot','audio'];
  if (phase2.includes(qType)) {
    closeAddQMenu();
    openItemTypesLibrary('phase2');
    return;
  }
  const items = SAMPLE_Q[secId];
  if (!items) return;
  const allFlat = flattenQuestions(items);
  const nextN = allFlat.length > 0 ? allFlat[allFlat.length-1].n + 1 : 1;
  const meta = ADDQ_TYPE_MAP[qType] || {label:'Question', type:'MC'};
  items.push({n:nextN, label:meta.label, type:meta.type, flagged:false, answered:false});
  const sec = genericSections.find(s=>s.id===secId);
  if (sec) { sec.questions = flattenQuestions(items).length; sec.pts += 1; }
  renderGenericEditor();
}

function buildAddQMenu(secId) {
  return `
    <div class="add-q-menu-section-label">MVP must-have</div>
    <button class="add-q-menu-item primary" onclick="closeAddQMenu();addQType('${secId}','mc')"><span class="aqm-icon">📝</span>Multiple Choice<span class="aqm-sub">Single Answer · Multiple Answers</span><span class="add-q-menu-badge">COMMON</span></button>
    <button class="add-q-menu-item" onclick="closeAddQMenu();addQType('${secId}','twopart')"><span class="aqm-icon">🧬</span>Two-Part / Evidence<span class="add-q-menu-badge" style="background:#dcfce7;color:#15803d">TCAP</span></button>
    <button class="add-q-menu-item" onclick="closeAddQMenu();addQType('${secId}','fib')"><span class="aqm-icon">✏️</span>Fill in the Blank</button>
    <button class="add-q-menu-item" onclick="closeAddQMenu();addQType('${secId}','gridIn')"><span class="aqm-icon">🔢</span>Grid-In / Numeric</button>
    <button class="add-q-menu-item" onclick="closeAddQMenu();addQType('${secId}','freeresponse')"><span class="aqm-icon">💬</span>Constructed Response</button>
    <button class="add-q-menu-item" onclick="closeAddQMenu();addQType('${secId}','essay')"><span class="aqm-icon">📄</span>Writing Prompt / Essay</button>
    <button class="add-q-menu-item" onclick="closeAddQMenu();addQType('${secId}','passage')"><span class="aqm-icon">📖</span>Reading Passage + Qs<span class="add-q-menu-badge">NEW</span></button>
    <div class="add-q-menu-section-label">MVP nice-to-have</div>
    <button class="add-q-menu-item" onclick="closeAddQMenu();addQType('${secId}','hottext')"><span class="aqm-icon">🖍️</span>Hot Text<span class="add-q-menu-badge" style="background:#fef3c7;color:#a16207">NICE</span></button>
    <div class="add-q-menu-section-label">Phase 2 — preview design</div>
    <button class="add-q-menu-item phase2" onclick="closeAddQMenu();addQType('${secId}','dragdrop')"><span class="aqm-icon">🧲</span>Drag & Drop / Gap Match<span class="add-q-menu-badge phase2">PHASE 2</span></button>
    <button class="add-q-menu-item phase2" onclick="closeAddQMenu();addQType('${secId}','inline')"><span class="aqm-icon">🔽</span>Inline Choice (Cloze)<span class="add-q-menu-badge phase2">PHASE 2</span></button>
    <button class="add-q-menu-item phase2" onclick="closeAddQMenu();addQType('${secId}','matrix')"><span class="aqm-icon">📊</span>Matrix / Tabular<span class="add-q-menu-badge phase2">PHASE 2</span></button>
    <button class="add-q-menu-item phase2" onclick="closeAddQMenu();addQType('${secId}','eq')"><span class="aqm-icon">∑</span>Equation Editor<span class="add-q-menu-badge phase2">PHASE 2</span></button>
    <button class="add-q-menu-item phase2" onclick="closeAddQMenu();addQType('${secId}','graph')"><span class="aqm-icon">📈</span>Graphing / Number Line<span class="add-q-menu-badge phase2">PHASE 2</span></button>
    <button class="add-q-menu-item phase2" onclick="closeAddQMenu();addQType('${secId}','hotspot')"><span class="aqm-icon">🎯</span>Hot Spot (Image)<span class="add-q-menu-badge phase2">PHASE 2</span></button>
    <button class="add-q-menu-item phase2" onclick="closeAddQMenu();addQType('${secId}','audio')"><span class="aqm-icon">🎧</span>Listening / Audio<span class="add-q-menu-badge phase2">PHASE 2</span></button>
    <div class="add-q-menu-divider"></div>
    <button class="add-q-menu-item" onclick="closeAddQMenu();openItemTypesLibrary('all')" style="color:#7c3aed;font-weight:600"><span class="aqm-icon">🧩</span>Browse full Item Types Library →</button>
  `;
}
document.addEventListener('click', function(e) {
  if (_openAqmId && !e.target.closest('.add-q-inline')) closeAddQMenu();
});

function addSection() {
  const id = 'g-s' + Date.now();
  genericSections.push({ id, name:'Section ' + genericNextNum, questions:0, pts:0 });
  genericNextNum++; SAMPLE_Q[id] = [];
  renderGenericEditor();
}

function deleteSection(id) {
  if (genericSections.length <= 1) return;
  genericSections = genericSections.filter(s => s.id !== id);
  if (genericActiveSection === id) genericActiveSection = genericSections[0].id;
  if (_editorFocus.secId === id) {
    _editorFocus = { type:'generic', secId:genericSections[0].id, itemIdx:0, subQIdx:null };
  }
  renderGenericEditor();
}

function startRename(id, name) {
  const el = document.getElementById('grp-label-' + id);
  if (!el) return;
  el.outerHTML = `<input class="rename-input" id="ren-${id}" value="${name}" onclick="event.stopPropagation()" onblur="finishRename('${id}')" onkeydown="if(event.key==='Enter')this.blur();if(event.key==='Escape'){this.value='${name}';this.blur()}" autofocus />`;
  const inp = document.getElementById('ren-' + id);
  if (inp) { inp.focus(); inp.select(); }
}

function finishRename(id) {
  const inp = document.getElementById('ren-' + id);
  if (!inp) return;
  const nm = inp.value.trim() || 'Untitled';
  const s = genericSections.find(s => s.id === id);
  if (s) s.name = nm;
  renderGenericEditor();
}

function startTitleRename(btn) {
  if (!btn || btn.dataset.editing === 'true') return;
  const original = btn.textContent.trim();
  const input = document.createElement('input');
  input.className = 'title-edit-input';
  input.value = original;
  input.dataset.original = original;
  input.dataset.buttonId = btn.id || '';
  input.setAttribute('aria-label', 'Assessment title');
  btn.dataset.editing = 'true';
  btn.replaceWith(input);
  input.focus();
  input.select();
  input.addEventListener('blur', () => finishTitleRename(input));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') input.blur();
    if (event.key === 'Escape') {
      input.value = input.dataset.original || original;
      input.blur();
    }
  });
}

function finishTitleRename(input) {
  if (!input) return;
  const title = input.value.trim() || input.dataset.original || 'Untitled Assessment';
  const btn = document.createElement('button');
  btn.className = 'title-btn';
  btn.type = 'button';
  if (input.dataset.buttonId) btn.id = input.dataset.buttonId;
  btn.title = 'Double-click to rename';
  btn.ondblclick = function(){ startTitleRename(btn); };
  btn.textContent = title;
  input.replaceWith(btn);
}

function actWritingData(q = {}) {
  return {
    title: q.title || ACT_WRITING_PROMPT.title,
    topic: q.topic || ACT_WRITING_PROMPT.topic || (q.title || ACT_WRITING_PROMPT.title || '').toLowerCase(),
    issue: q.issue || q.prompt || q.text || ACT_WRITING_PROMPT.issue,
    perspectives: q.perspectives || ACT_WRITING_PROMPT.perspectives,
    taskInstructions: q.taskInstructions || ACT_WRITING_PROMPT.taskInstructions,
    taskFootnote: q.taskFootnote || ACT_WRITING_PROMPT.taskFootnote,
    directions: q.directions || ACT_WRITING_PROMPT.directions,
    planningPrompt: q.planningPrompt || ACT_WRITING_PROMPT.planningPrompt,
    rubricDomains: q.rubricDomains || ACT_WRITING_DOMAINS
  };
}

// ═══════ SIDEBAR CONTENT (SortableQuestionList + SortableSubjectGroup) ═══════

/** Flatten items to get all individual questions */
function flattenQuestions(items) {
  const flat = [];
  for (const item of items) {
    if (item.type === 'RR_PASSAGE') {
      for (const q of (item.questions||[])) flat.push(q);
    } else {
      flat.push(item);
    }
  }
  return flat;
}

function countQuestions(items) { return flattenQuestions(items).length; }
function isFixedActEditor(editorType) {
  return editorType === 'act';
}

// Lightweight HTML/attr escape — used wherever we render user-editable
// strings (passage titles, etc.) into a template literal.
function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escapeAttr(s) { return escapeHtml(s); }

// Max characters allowed when renaming a passage. Keeps the sidebar
// layout sane and matches the longest stock title (~50 chars) with
// generous headroom.
const PASSAGE_TITLE_MAX = 60;

/**
 * Inline-rename a passage title from the sidebar (double-click handler).
 * Replaces the title span with an <input>, commits on Enter or blur,
 * cancels on Escape. Updates SAMPLE_Q + sidebar + main panel header in
 * place — no full editor re-render, so scroll position is preserved.
 */
function startPassageRename(ev, spanEl) {
  ev.stopPropagation();
  ev.preventDefault();
  if (!spanEl || spanEl.dataset.renaming === '1') return;
  const secId = spanEl.dataset.sec;
  const idx = +spanEl.dataset.idx;
  const editorType = spanEl.dataset.editor || 'generic';
  const item = (SAMPLE_Q[secId] || [])[idx];
  if (!item || item.type !== 'RR_PASSAGE') return;
  const current = item.title || spanEl.textContent.trim();

  const labelRow = spanEl.closest('.sidebar-passage-label');
  const oldRowOnclick = labelRow ? labelRow.onclick : null;
  if (labelRow) labelRow.onclick = null;

  spanEl.dataset.renaming = '1';
  const input = document.createElement('input');
  input.type = 'text';
  input.value = current;
  input.maxLength = PASSAGE_TITLE_MAX;
  input.spellcheck = false;
  input.className = 'sb-passage-rename-input';
  input.style.cssText = 'flex:1;min-width:0;font:inherit;color:inherit;background:#fff;border:1px solid #c084fc;border-radius:4px;padding:1px 6px;outline:none;box-shadow:0 0 0 2px rgba(192,132,252,.18)';
  spanEl.style.display = 'none';
  spanEl.parentNode.insertBefore(input, spanEl.nextSibling);

  // Counter chip so the user sees the cap as they type.
  const counter = document.createElement('span');
  counter.style.cssText = 'font-size:10px;color:#a1a1aa;font-weight:500;flex-shrink:0;margin-left:4px';
  const updateCounter = () => { counter.textContent = `${input.value.length}/${PASSAGE_TITLE_MAX}`; };
  updateCounter();
  input.parentNode.insertBefore(counter, input.nextSibling);

  input.focus();
  input.select();

  let done = false;
  const cleanup = () => {
    if (counter.parentNode) counter.parentNode.removeChild(counter);
    if (input.parentNode) input.parentNode.removeChild(input);
    spanEl.style.display = '';
    delete spanEl.dataset.renaming;
    if (labelRow) labelRow.onclick = oldRowOnclick;
  };
  const finish = (commit) => {
    if (done) return; done = true;
    if (commit) {
      const v = input.value.trim().slice(0, PASSAGE_TITLE_MAX);
      if (v && v !== current) commitPassageRename(editorType, secId, idx, v, spanEl);
    }
    cleanup();
  };

  input.addEventListener('input', updateCounter);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')      { e.preventDefault(); finish(true); }
    else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
  });
  input.addEventListener('blur', () => finish(true));
}

/** Persist + propagate the new title to sidebar tooltip + main panel header. */
function commitPassageRename(editorType, secId, idx, newTitle, spanEl) {
  const item = (SAMPLE_Q[secId] || [])[idx];
  if (!item || item.type !== 'RR_PASSAGE') return;
  item.title = newTitle;

  if (spanEl) {
    spanEl.textContent = newTitle;
    spanEl.setAttribute('title', `${newTitle} (double-click to rename)`);
  }

  // Sync the main panel passage block header in place. The .p-title span
  // contains: bookOpen icon + " " + title + optional domain tag, so we
  // rebuild it to keep the icon and tag intact.
  const cfg = EDITOR_MAP[editorType];
  if (cfg) {
    const mainEl = document.getElementById(cfg.main);
    if (mainEl) {
      const block = mainEl.querySelector(`[data-main-sec="${secId}"][data-main-idx="${idx}"]`);
      const titleEl = block && block.querySelector('.p-title');
      if (titleEl) {
        const domainTag = item.domain ? `<span style="display:inline-block;font-size:10px;font-weight:600;color:#71717a;background:#f0f0f0;padding:2px 8px;border-radius:4px;margin-left:8px">${escapeHtml(item.domain)}</span>` : '';
        titleEl.innerHTML = `${ICONS.bookOpen} ${escapeHtml(newTitle)}${domainTag}`;
      }
    }
  }
}

/** Render sidebar items — handles standalone Q and RR_PASSAGE groups */
function renderSidebarItems(items, secId, editorType) {
  let html = '';
  const hideStructureControls = isFixedActEditor(editorType);
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    if (item.type === 'RR_PASSAGE') {
      const pqs = item.questions || [];
      // Per-passage "Nq" badge intentionally NOT rendered. The section
      // header above already shows the question range (e.g. "1-50 English"),
      // and the passage list right below shows individual numbered items
      // — duplicating "10q" on every row was visual noise.
      // Row click → jump + ensure expanded (no collapse). Caret toggles
      // collapse/expand separately, so a double-click on the title to
      // rename never causes a flicker collapse/expand cycle.
      const rowClick = `selectItem('${editorType}','${secId}',${idx});const c=this.nextElementSibling;if(c.style.display==='none'){c.style.display='flex';const k=this.querySelector('.caret');if(k)k.style.transform='rotate(0deg)';}`.replace(/\s+/g,' ');
      const caretToggle = `event.stopPropagation();const lbl=this.closest('.sidebar-passage-label');const c=lbl.nextElementSibling;const collapsed=c.style.display==='none';c.style.display=collapsed?'flex':'none';this.style.transform=collapsed?'rotate(0deg)':'rotate(-90deg)';`.replace(/\s+/g,' ');
      html += `<div class="sidebar-passage-group">
        <div class="sidebar-passage-label" onclick="${rowClick}">
          ${ICONS.bookOpen} <span class="sb-passage-title" data-sec="${secId}" data-idx="${idx}" data-editor="${editorType}" title="${escapeAttr(item.title)} (double-click to rename)" ondblclick="startPassageRename(event,this)" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:text">${escapeHtml(item.title)}</span>
          <span class="caret" style="transition:.15s" onclick="${caretToggle}">${ICONS.caretDown}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:1px">
          ${pqs.map((q, qi) => `<div class="q-list-item" data-sec="${secId}" data-idx="${idx}" data-qi="${qi}">
            ${hideStructureControls ? '' : `<span class="drag-handle">${ICONS.gripV}</span>`}
            <button class="item-btn" onclick="selectItem('${editorType}','${secId}',${idx},${qi})">
              ${ICONS[TYPE_ICON[q.type]]||ICONS.mc}
              <span class="q-num-badge">${q.n}</span>
              <span class="q-type-text">${TYPE_LABELS[q.type]||q.type}</span>
            </button>
          </div>`).join('')}
        </div>
      </div>`;
    } else {
      const icon = ICONS[TYPE_ICON[item.type]] || ICONS.mc;
      html += `<div class="q-list-item" data-sec="${secId}" data-idx="${idx}">
        ${hideStructureControls ? '' : `<span class="drag-handle">${ICONS.gripV}</span>`}
        <button class="item-btn" onclick="selectItem('${editorType}','${secId}',${idx})">
          ${icon}
          <span class="q-num-badge">${item.n}</span>
          <span class="q-type-text">${TYPE_LABELS[item.type]||item.type}</span>
        </button>
      </div>`;
    }
  }
  return html;
}

/** Render a sidebar subject group — generic mode (⋯ menu with Rename / Delete) */
function renderSidebarGroupGeneric(sec) {
  const items = SAMPLE_Q[sec.id] || [];
  const qCount = countQuestions(items);
  const allQs = flattenQuestions(items);
  const range = allQs.length > 0 ? `${allQs[0].n}-${allQs[allQs.length-1].n}` : '';
  const canDelete = genericSections.length > 1;
  const escapedName = sec.name.replace(/'/g, "\\'");
  const menuId = 'menu-' + sec.id;
  const dotsIcon = `<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><circle cx="128" cy="60" r="16"/><circle cx="128" cy="128" r="16"/><circle cx="128" cy="196" r="16"/></svg>`;
  const pencilIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`;
  const trashIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;

  const isFocused = _editorFocus.secId === sec.id;
  return `<div class="subject-group" data-sec-group="${sec.id}">
    <div class="subject-group-trigger" style="cursor:pointer" onclick="
      const items=this.nextElementSibling;
      if(items.style.display==='none'){items.style.display='flex';this.querySelector('.caret').style.transform='';}
      scrollEditorToSection('${sec.id}','generic');
    ">
      <span class="left">${ICONS.listBullets}<span class="label" id="grp-label-${sec.id}">${range ? range + ' ' : ''}${sec.name}</span></span>
      <span style="display:flex;align-items:center;gap:2px">
        <span class="sec-badge sec-badge-default" style="font-size:10px;padding:1px 6px">${qCount}q</span>
        <div class="section-menu-wrapper">
          <button class="section-menu-btn" id="btn-${menuId}" onclick="event.stopPropagation();toggleSectionMenu('${menuId}')" title="Section options">${dotsIcon}</button>
          <div class="section-menu" id="${menuId}">
            <button class="section-menu-item" onclick="event.stopPropagation();closeSectionMenu('${menuId}');startRename('${sec.id}','${escapedName}')">${pencilIcon} Rename</button>
            ${canDelete ? `<div class="section-menu-sep"></div><button class="section-menu-item danger" onclick="event.stopPropagation();closeSectionMenu('${menuId}');deleteSection('${sec.id}')">${trashIcon} Delete Section</button>` : ''}
          </div>
        </div>
        <span class="caret">${ICONS.caretDown}</span>
      </span>
    </div>
    <div class="subject-group-items">
      ${qCount === 0 ? '<div style="padding:8px 12px;font-size:12px;color:#a1a1aa">No questions yet</div>' : renderSidebarItems(items, sec.id, 'generic')}
    </div>
    <div class="add-q-inline" style="position:relative">
      <button onclick="event.stopPropagation();toggleAddQMenu('${sec.id}')">${ICONS.plus} Add Question</button>
      <div class="add-q-menu" id="aqm-${sec.id}">${buildAddQMenu(sec.id)}</div>
    </div>
  </div>`;
}

// Click on a sidebar group → scroll the matching section header in the
// main panel into view (and ensure the group is expanded for context).
function scrollEditorToSection(secId, testType) {
  const map = { act:'actMainPanel', sat:'satMainPanel', generic:'genericMainPanel' };
  const panel = document.getElementById(map[testType] || '');
  if (!panel) return;
  const target = panel.querySelector(`[data-sec-anchor="${secId}"]`);
  if (!target) return;
  const containerRect = panel.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const offset = targetRect.top - containerRect.top + panel.scrollTop - 16;
  panel.scrollTo({ top: Math.max(0, offset), behavior:'smooth' });
  target.classList.remove('section-flash');
  void target.offsetWidth; // force reflow so the animation restarts
  target.classList.add('section-flash');
  setTimeout(() => target.classList.remove('section-flash'), 1300);
}

/** Render a sidebar subject group — standardized mode (locked, with info badges) */
function renderSidebarGroupStd(sec, testType) {
  if (sec.optional && sec._excluded) return '';
  const items = SAMPLE_Q[sec.id] || [];
  const allQs = flattenQuestions(items);
  const range = allQs.length > 0 ? `${allQs[0].n}-${allQs[allQs.length-1].n}` : '';
  const hideStructureControls = isFixedActEditor(testType);
  // Click on the row → scroll to section + ensure expanded. Caret is a
  // separate click target for collapse/expand only, so navigation never
  // accidentally hides the section the teacher just jumped to.
  const triggerOnClick = `
    const grp=this.parentElement;
    const items=grp.querySelector('.subject-group-items');
    const addQ=grp.querySelector('.add-q-inline');
    this.classList.remove('collapsed');
    if(items)items.style.display='flex';
    if(addQ)addQ.style.display='block';
    scrollEditorToSection('${sec.id}','${testType}');`.replace(/\s+/g,' ');
  const caretOnClick = `
    event.stopPropagation();
    const trig=this.closest('.subject-group-trigger');
    const grp=trig.parentElement;
    const items=grp.querySelector('.subject-group-items');
    const addQ=grp.querySelector('.add-q-inline');
    trig.classList.toggle('collapsed');
    const collapsed=trig.classList.contains('collapsed');
    if(items)items.style.display=collapsed?'none':'flex';
    if(addQ)addQ.style.display=collapsed?'none':'block';`.replace(/\s+/g,' ');
  return `<div class="subject-group" data-sec-group="${sec.id}">
    <button class="subject-group-trigger" onclick="${triggerOnClick}">
      <span class="left">${ICONS.listBullets}<span class="label">${range ? range + ' ' : ''}${sec.name}</span>${sec.optional ? '<span class="sec-opt-tag">· optional</span>' : ''}${sec.adaptive ? '<span class="sec-opt-tag">· adaptive</span>' : ''}</span>
      <span class="sec-info">
        <span class="caret" onclick="${caretOnClick}" role="button" tabindex="0" title="Collapse / expand">${ICONS.caretDown}</span>
      </span>
    </button>
    <div class="subject-group-items">
      ${allQs.length === 0 ? `<div style="padding:8px 12px;font-size:12px;color:#a1a1aa">${sec.filled} of ${sec.questions} questions to fill</div>` : renderSidebarItems(items, sec.id, testType)}
    </div>
    ${hideStructureControls ? '' : `<div class="add-q-inline" style="position:relative">
      <button onclick="event.stopPropagation();toggleAddQMenu('${sec.id}')">${ICONS.plus} Add Question</button>
      <div class="add-q-menu" id="aqm-${sec.id}">${buildAddQMenu(sec.id)}</div>
    </div>`}
  </div>`;
}

/** Toggle optional sections on/off for standardized tests */
function toggleOptSection(testType, secId) {
  const sections = testType === 'act' ? ACT_SECTIONS : SAT_SECTIONS;
  const sec = sections.find(s => s.id === secId);
  if (sec && sec.optional) {
    sec._excluded = !sec._excluded;
    if (testType === 'act') renderActEditor();
    else renderSatEditor();
  }
}

/** Editor type → { mainPanelId, sidebarId, openBtnId, getSections } */
const EDITOR_MAP = {
  generic: { main:'genericMainPanel', sidebar:'genericSidebar', openBtn:'genericOpenBtn', getSections:()=>genericSections },
  act:     { main:'actMainPanel',     sidebar:'actSidebar',     openBtn:'actOpenBtn',     getSections:()=>ACT_SECTIONS.filter(s=>!s._excluded) },
  sat:     { main:'satMainPanel',     sidebar:'satSidebar',     openBtn:'satOpenBtn',     getSections:()=>SAT_SECTIONS },
};

function selectItem(editorType, secId, itemIdx, subQIdx) {
  _editorFocus = { type: editorType, secId, itemIdx: itemIdx ?? 0, subQIdx: subQIdx ?? null };
  const cfg = EDITOR_MAP[editorType];
  if (!cfg) return;

  const sidebarEl = document.getElementById(cfg.sidebar);
  if (sidebarEl) {
    sidebarEl.querySelectorAll('.q-list-item').forEach(el => el.classList.remove('selected'));
    if (subQIdx != null) {
      const match = sidebarEl.querySelector(`.q-list-item[data-sec="${secId}"][data-idx="${itemIdx}"][data-qi="${subQIdx}"]`);
      if (match) match.classList.add('selected');
    } else {
      const match = sidebarEl.querySelector(`.q-list-item[data-sec="${secId}"][data-idx="${itemIdx}"]`);
      if (match) match.classList.add('selected');
    }
  }

  // Scroll to the item in main panel
  const mainEl = document.getElementById(cfg.main);
  if (!mainEl) return;
  const target = mainEl.querySelector(`[data-main-sec="${secId}"][data-main-idx="${itemIdx}"]`);
  if (target) {
    target.scrollIntoView({ behavior:'smooth', block:'center' });
    target.classList.add('flash-highlight');
    setTimeout(() => target.classList.remove('flash-highlight'), 1200);
    // If passage and subQIdx given, navigate to that question
    if (subQIdx != null && target.classList.contains('passage-block')) {
      const bid = target.id;
      if (bid) passageGoTo(bid, subQIdx);
    }
  }
}

function renderGenericEditor() {
  passageBlockCounter = 0;
  _pbCounters.generic = 0;
  const allQs = genericSections.reduce((sum, s) => sum + countQuestions(SAMPLE_Q[s.id]||[]), 0);
  const allPts = genericSections.reduce((sum, s) => flattenQuestions(SAMPLE_Q[s.id]||[]).reduce((p, q) => p + (q.pts||0), 0) + sum, 0);
  document.getElementById('genericSidebarTitle').textContent = `${allQs} Questions · ${allPts} pts`;

  document.getElementById('genericSidebarContent').innerHTML =
    genericSections.map(s => renderSidebarGroupGeneric(s)).join('');

  let mainHtml = '';
  genericSections.forEach(sec => {
    const items = SAMPLE_Q[sec.id] || [];
    mainHtml += `<div class="subject-alias" data-sec-anchor="${sec.id}" style="scroll-margin-top:16px"><input class="alias-input" value="${sec.name}" /><button class="menu-btn">${ICONS.dotsH}</button></div>`;
    mainHtml += renderMainPanelItems(items, sec.id === genericSections[0].id, sec.id, 'generic');
    if (countQuestions(items) === 0) {
      mainHtml += `<div style="padding:24px;text-align:center;color:#a1a1aa;font-size:13px;border:1px dashed #e4e4e7;border-radius:8px;margin-bottom:16px">No questions in "${sec.name}" — click + Add Question</div>`;
    }
  });

  document.getElementById('genericMainPanel').innerHTML = `<div class="q-main-gradient"><div class="q-main-container"><div style="margin-top:16px">${mainHtml}</div></div></div>`;
  setTimeout(() => initAllDotsArrows(), 50);
}

function addQToStd(testType) {
  const sections = testType === 'act' ? ACT_SECTIONS.filter(s=>!s._excluded) : SAT_SECTIONS;
  const focusSec = _editorFocus.secId && sections.find(s=>s.id===_editorFocus.secId) ? _editorFocus.secId : sections[0]?.id;
  if (!focusSec) return;
  const items = SAMPLE_Q[focusSec]; if (!items) return;
  const allFlat = flattenQuestions(items);
  const nextN = allFlat.length > 0 ? allFlat[allFlat.length-1].n + 1 : 1;
  items.push({n:nextN, label:'New Question', type:'mc', flagged:false, answered:false});
  const sec = sections.find(s=>s.id===focusSec);
  if (sec) { sec.filled = Math.min(sec.filled + 1, sec.questions); }
  if (testType === 'act') renderActEditor(); else renderSatEditor();
}

// ═══════ ACT EDITOR (sections in sidebar as locked groups) ═══════
function renderActEditor() {
  passageBlockCounter = 0;
  _pbCounters.act = 0;
  const activeSections = ACT_SECTIONS.filter(s => !s._excluded);
  const totalQ = activeSections.reduce((s, x) => s + x.questions, 0);
  // ACT does not accumulate raw points — each section's raw correct count is
  // converted via ACT_SCALE to a 1–36 scaled score, and Composite = mean of
  // the three Core sections. So we surface the score model the teacher will
  // see in the report instead of a fictional "X pts" total.
  document.getElementById('actSidebarTitle').textContent = `${totalQ} items · Composite 1–36`;

  document.getElementById('actSidebarContent').innerHTML =
    ACT_SECTIONS.map(s => renderSidebarGroupStd(s, 'act')).join('');

  // ─── ACT structure summary ───
  // Compact 3-line banner matching the production "Assessment Generated"
  // height (image 2). Section facts inlined as one calm prose line — no
  // table, no totals — to keep visual weight minimal.
  const inline = activeSections.map(s => {
    const items = /writing/i.test(s.name) ? '1 essay' : `${s.questions} items`;
    const opt = s.optional ? ' <span class="act-bp-opt">Optional</span>' : '';
    return `<span class="act-bp-seg"><b>${s.name}</b>: ${items}, ${s.time} min${opt}</span>`;
  }).join('<span class="act-bp-dot">·</span>');
  const headerBanner = `<div class="act-bp-banner">
    <div class="act-bp-banner-head">
      <div class="act-bp-banner-title">ACT Practice Exam structure</div>
      <button class="act-bp-banner-close" title="Hide" onclick="this.closest('.act-bp-banner').style.display='none'">×</button>
    </div>
    <div class="act-bp-banner-sub">Section order, timing, and item count are fixed by ACT — you can swap items within each bank.</div>
    <div class="act-bp-banner-line">${inline}</div>
  </div>`;

  let mainHtml = headerBanner;
  activeSections.forEach(sec => {
    const items = SAMPLE_Q[sec.id] || [];
    const isWrite = /writing/i.test(sec.name);
    mainHtml += `<div class="subject-alias" data-sec-anchor="${sec.id}" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;scroll-margin-top:16px">
      <input class="alias-input" value="${sec.name}" readonly />
    </div>`;
    if (items.length > 0 || countQuestions(items) > 0) {
      mainHtml += renderMainPanelItems(items, sec.id === activeSections[0].id, sec.id, 'act');
    } else {
      mainHtml += `<div style="padding:24px;text-align:center;color:#a1a1aa;font-size:13px;border:1px dashed #e4e4e7;border-radius:8px;margin-bottom:16px">${sec.name}: ${sec.questions} questions · ${sec.time} min${sec.optional?' · Optional':''}</div>`;
    }
  });

  document.getElementById('actMainPanel').innerHTML = `<div class="q-main-gradient"><div class="q-main-container"><div style="margin-top:16px">${mainHtml}</div></div></div>`;
  setTimeout(() => initAllDotsArrows(), 50);
}

// ═══════ SAT EDITOR (sections in sidebar as locked groups) ═══════
function renderSatEditor() {
  passageBlockCounter = 0;
  _pbCounters.sat = 0;
  const totalQ = SAT_SECTIONS.reduce((s, x) => s + x.questions, 0);
  const totalPts = totalQ; // SAT items are 1 pt each in the raw section view.
  document.getElementById('satSidebarTitle').textContent = `${totalQ} Questions · ${totalPts} pts`;

  document.getElementById('satSidebarContent').innerHTML =
    SAT_SECTIONS.map(s => renderSidebarGroupStd(s, 'sat')).join('');

  let mainHtml = '';
  SAT_SECTIONS.forEach(sec => {
    const items = SAMPLE_Q[sec.id] || [];
    mainHtml += `<div class="subject-alias" data-sec-anchor="${sec.id}" style="scroll-margin-top:16px"><input class="alias-input" value="${sec.name}" readonly /><button class="menu-btn">${ICONS.dotsH}</button></div>`;
    if (items.length > 0 || countQuestions(items) > 0) {
      mainHtml += renderMainPanelItems(items, sec.id === SAT_SECTIONS[0].id, sec.id, 'sat');
    } else {
      mainHtml += `<div style="padding:24px;text-align:center;color:#a1a1aa;font-size:13px;border:1px dashed #e4e4e7;border-radius:8px;margin-bottom:16px">${sec.name}: ${sec.questions} questions · ${sec.time} min${sec.adaptive?' · Adaptive':''}</div>`;
    }
  });

  document.getElementById('satMainPanel').innerHTML = `<div class="q-main-gradient"><div class="q-main-container"><div style="margin-top:16px">${mainHtml}</div></div></div>`;
  setTimeout(() => initAllDotsArrows(), 50);
}

// ═══════ NEW EDIT CONCEPT (compare against current editor) ═══════
let newEditMode = 'edit';
let newPreviewMode = 'teacher';
let newTagEditor = null;
let newSelectedTagItems = [2,3,6];
let newTagFilter = 'needs-review';
let newActiveReviewItemId = 2;
const NEW_EDIT_SECTIONS = [
  { id:'ne-reading-info', name:'Reading Informational Text', meta:'6 items · 2 skills to check', health:'2 check' },
  { id:'ne-reading-lit', name:'Reading Literature', meta:'4 items · 1 AI suggested skill', health:'1 AI' },
  { id:'ne-language', name:'Language & Conventions', meta:'2 items · ready', health:'ready' },
];
const NEW_EDIT_ITEMS = [
  { id:1, section:'ne-reading-info', type:'MCQ', status:'ok', review:'Using suggested skill', confidence:'94%', skill:'Main Idea', standard:'7.RI.KID.2', act:'Key Ideas', tcap:'Grade 7 ELA', sat:'Info & Ideas', text:'Which sentence best states the central idea of the passage?', choices:['The author explains why wetland restoration requires long-term planning.','The author argues that cities should remove older drainage systems.','The passage compares two unrelated environmental projects.','The passage describes how one student became a scientist.'] },
  { id:2, section:'ne-reading-info', type:'MCQ', status:'warn', review:'Missing skill', confidence:'72%', skill:'Inference', standard:'Missing', act:'Key Ideas', tcap:'Needs mapping', sat:'Info & Ideas', text:'What can the reader infer about the community meeting?', choices:['Residents were divided about the proposed restoration timeline.','The project had already received final approval.','The author attended the meeting as a student volunteer.','The city council rejected the proposal immediately.'] },
  { id:3, section:'ne-reading-info', type:'Short', status:'ai', review:'AI suggested', confidence:'86%', skill:'Textual Evidence', standard:'7.RI.KID.1', act:'Key Ideas', tcap:'Grade 7 ELA', sat:'Info & Ideas', text:'Select one piece of evidence that best supports the author’s claim about long-term impact.', choices:['Evidence from paragraph 4','Evidence from paragraph 1','Evidence from the title','Evidence from the caption'] },
  { id:4, section:'ne-reading-info', type:'MCQ', status:'ok', review:'Using suggested skill', confidence:'91%', skill:'Vocabulary in Context', standard:'7.RI.CS.4', act:'Craft & Structure', tcap:'Grade 7 ELA', sat:'Craft & Structure', text:'As used in paragraph 5, what does "sustained" most nearly mean?', choices:['Maintained','Interrupted','Measured','Predicted'] },
  { id:5, section:'ne-reading-lit', type:'MCQ', status:'ok', review:'Changed by teacher', confidence:'89%', skill:'Character Motivation', standard:'7.RL.KID.3', act:'Key Ideas', tcap:'Grade 7 ELA', sat:'--', text:'Why does the narrator hesitate before answering?', choices:['She is unsure how much of the truth to reveal.','She cannot remember the question.','She wants the conversation to end quickly.','She is distracted by the weather.'] },
  { id:6, section:'ne-reading-lit', type:'MCQ', status:'ai', review:'AI suggested', confidence:'79%', skill:'Tone & Attitude', standard:'7.RL.CS.6', act:'Craft & Structure', tcap:'Grade 7 ELA', sat:'Craft & Structure', text:'Which word best describes the narrator’s tone in the final paragraph?', choices:['Reflective','Dismissive','Playful','Detached'] },
  { id:7, section:'ne-language', type:'MCQ', status:'ok', review:'Using suggested skill', confidence:'96%', skill:'Conventions', standard:'7.L.CSE.1', act:'English', tcap:'Grade 7 ELA', sat:'Conventions', text:'Which revision corrects the sentence?', choices:['The wetlands are important because they absorb stormwater.','The wetlands is important because they absorb stormwater.','The wetlands are important they absorb stormwater.','The wetlands, important because absorb stormwater.'] },
];

function setNewEditMode(mode) {
  newEditMode = mode;
  renderNewEdit();
}
function setNewPreviewMode(mode) {
  newPreviewMode = mode;
  renderNewEditContent();
}
function setNewTagFilter(filter) {
  newTagFilter = filter;
  renderNewTaggingReview();
}
function setNewActiveReviewItem(itemId) {
  newActiveReviewItemId = itemId;
  renderNewTaggingReview();
}
function newTagConfidenceValue(item) {
  return parseInt(String(item.confidence || '0').replace('%',''), 10) || 0;
}
function newTagFilterDefs() {
  const count = predicate => NEW_EDIT_ITEMS.filter(predicate).length;
  return [
    { id:'needs-review', label:'Needs a look', hint:'optional', count:count(i => i.status !== 'ok') },
    { id:'missing-skill', label:'Missing skill', hint:'best to fix', count:count(i => i.review === 'Missing skill') },
    { id:'ai-suggested', label:'AI suggested', hint:'check or skip', count:count(i => i.status === 'ai') },
    { id:'low-confidence', label:'Low confidence', hint:'under 85%', count:count(i => newTagConfidenceValue(i) < 85) },
    { id:'reviewed', label:'Reviewed', hint:'done', count:count(i => i.status === 'ok') },
    { id:'all', label:'All questions', hint:'full list', count:NEW_EDIT_ITEMS.length }
  ];
}
function getNewTagFilteredItems() {
  const filters = {
    'needs-review': item => item.status !== 'ok',
    'missing-skill': item => item.review === 'Missing skill',
    'ai-suggested': item => item.status === 'ai',
    'low-confidence': item => newTagConfidenceValue(item) < 85,
    reviewed: item => item.status === 'ok',
    all: () => true
  };
  return NEW_EDIT_ITEMS.filter(filters[newTagFilter] || filters['needs-review']);
}
function getNewSelectedItemIds() {
  const checked = Array.from(document.querySelectorAll('[data-ne-select]:checked')).map(input => parseInt(input.dataset.neSelect, 10)).filter(Boolean);
  return checked.length ? checked : newSelectedTagItems;
}
function newPrimaryTagSummary(item) {
  return `<span class="ne-chip skill">${item.skill}</span><span class="ne-chip ${item.standard === 'Missing' ? 'review' : 'standard'}">${item.standard}</span><span class="ne-chip ${item.status === 'ok' ? 'ok' : item.status === 'warn' ? 'review' : 'auto'}">${item.review}</span>`;
}
function newBlueprintSummary() {
  return `<span class="ne-chip more" title="General Assessment works without a standardized blueprint. ACT, TCAP, and future SAT attach context only when needed.">General mode · blueprint optional</span>`;
}
function newAiSuggestedFix(item) {
  if (item.standard === 'Missing') return `AI suggests ${item.skill} based on the question stem and answer choices.`;
  if (item.status === 'ai') return `AI suggests ${item.skill}; review it if the question is intended to measure a different skill.`;
  if (newTagConfidenceValue(item) < 85) return `AI is less confident. Check whether ${item.skill} is the best match.`;
  return `AI suggests ${item.skill}. You can keep it or change it.`;
}
function useSuggestedSkill(itemId) {
  const item = NEW_EDIT_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  item.review = 'Using suggested skill';
  item.status = 'ok';
  renderNewEdit();
}
function skipSuggestedSkill(itemId) {
  const item = NEW_EDIT_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  item.review = 'Skipped for now';
  item.status = 'ai';
  renderNewEdit();
}
function openNewTagEditor(itemId, field, bulk, selectedIds) {
  newTagEditor = { itemId, field, bulk: !!bulk, selectedIds: selectedIds || [] };
  showNewTagEditorOverlay();
}
function closeNewTagEditor() {
  newTagEditor = null;
  const overlay = document.getElementById('newTagEditorOverlay');
  if (overlay) overlay.remove();
}
function newTagFieldLabel(field) {
  return ({ skill:'Primary skill', standard:'Standard alignment', act:'ACT mapping', tcap:'TCAP mapping', sat:'SAT mapping', status:'Review status' })[field] || 'Tag';
}
function newTagOptions(field) {
  const options = {
    skill:['Main Idea','Inference','Textual Evidence','Vocabulary in Context','Character Motivation','Tone & Attitude','Conventions'],
    standard:['7.RI.KID.1','7.RI.KID.2','7.RI.CS.4','7.RL.KID.3','7.RL.CS.6','7.L.CSE.1','Missing'],
    act:['Key Ideas','Craft & Structure','English','Needs mapping'],
    tcap:['Grade 7 ELA','Needs mapping','Reading Informational Text','Reading Literature','Language & Conventions'],
    sat:['Info & Ideas','Craft & Structure','Conventions','--'],
    status:['AI suggested','Using suggested skill','Changed by teacher','Skipped for now','Missing skill']
  };
  return options[field] || [];
}
function newTagAiSuggestion(field) {
  return ({ skill:'Textual Evidence', standard:'7.RI.KID.1', act:'Key Ideas', tcap:'Grade 7 ELA', sat:'Info & Ideas', status:'Using suggested skill' })[field] || '';
}
function applyNewTagEdit() {
  if (!newTagEditor) return;
  const field = newTagEditor.field;
  const select = document.getElementById('newTagManualValue');
  const value = select ? select.value : '';
  if (!value) return;
  const selectedIds = newTagEditor.selectedIds && newTagEditor.selectedIds.length ? newTagEditor.selectedIds : getNewSelectedItemIds();
  const targets = newTagEditor.bulk
    ? NEW_EDIT_ITEMS.filter(item => selectedIds.includes(item.id))
    : NEW_EDIT_ITEMS.filter(item => item.id === newTagEditor.itemId);
  targets.forEach(item => {
    if (field === 'status') {
      item.review = value;
      item.status = value === 'Using suggested skill' || value === 'Changed by teacher' ? 'ok' : value === 'Missing skill' ? 'warn' : 'ai';
    } else {
      item[field] = value;
      if (field === 'skill') {
        item.review = 'Changed by teacher';
        item.status = 'ok';
      }
      if (field === 'standard' && value !== 'Missing' && item.review === 'Missing skill') {
        item.review = 'AI suggested';
      }
      if (field === 'tcap' && value !== 'Needs mapping') item.tcap = value;
    }
  });
  newTagEditor = null;
  const overlay = document.getElementById('newTagEditorOverlay');
  if (overlay) overlay.remove();
  renderNewEdit();
}
function renderNewTagEditorOverlay() {
  if (!newTagEditor) return '';
  const item = NEW_EDIT_ITEMS.find(i => i.id === newTagEditor.itemId) || NEW_EDIT_ITEMS.find(i => i.status !== 'ok') || NEW_EDIT_ITEMS[0];
  const field = newTagEditor.field;
  const current = newTagEditor.bulk ? 'Mixed values' : (field === 'status' ? item?.review : (item?.[field] || ''));
  const selectedCount = newTagEditor.bulk ? ((newTagEditor.selectedIds && newTagEditor.selectedIds.length) || getNewSelectedItemIds().length) : 1;
  const options = newTagOptions(field);
  const ai = newTagAiSuggestion(field);
  return `<div class="ne-tag-edit-overlay" onclick="if(event.target===this)closeNewTagEditor()">
    <div class="ne-tag-edit-card">
      <div class="ne-tag-edit-head">
        <div>
          <div class="ne-tag-edit-kicker">${newTagEditor.bulk ? 'Update selected questions' : 'Change skill'}</div>
          <div class="ne-tag-edit-title">${newTagFieldLabel(field)}</div>
          <div class="ne-tag-edit-sub">${newTagEditor.bulk ? `Apply this change to ${selectedCount} selected question${selectedCount>1?'s':''}.` : `Q${item.id} · ${item.text}`}</div>
        </div>
        <button class="inline-tagging-close" onclick="closeNewTagEditor()">×</button>
      </div>
      <div class="ne-tag-edit-body">
        <div class="ne-edit-field">
          <label>Current value</label>
          <input value="${current}" readonly>
        </div>
        <div class="ne-ai-suggestion">
          <div class="copy">Suggested value: <b>${ai}</b><br><span style="color:#a78bfa;font-weight:700">Use it only if it matches what the question measures.</span></div>
          <button onclick="document.getElementById('newTagManualValue').value='${ai}'">Use suggestion</button>
        </div>
        <div class="ne-edit-field">
          <label>Manual value</label>
          <select id="newTagManualValue">
            ${options.map(opt => `<option ${opt===current?'selected':''}>${opt}</option>`).join('')}
          </select>
        </div>
        ${newTagEditor.bulk ? `<div class="ne-edit-field">
          <label>Apply mode</label>
          <select><option>Replace existing value</option><option>Add without overwriting</option><option>Clear field</option></select>
        </div>` : ''}
      </div>
      <div class="ne-tag-edit-foot">
        <div class="note">This does not block Preview or Assign. It only improves analytics and practice recommendations.</div>
        <div style="display:flex;gap:8px">
          <button class="btn-kira-outline" onclick="closeNewTagEditor()">Cancel</button>
          <button class="btn-kira-default" onclick="applyNewTagEdit()">Apply</button>
        </div>
      </div>
    </div>
  </div>`;
}
function showNewTagEditorOverlay() {
  const old = document.getElementById('newTagEditorOverlay');
  if (old) old.remove();
  const html = renderNewTagEditorOverlay();
  if (!html) return;
  const wrap = document.createElement('div');
  wrap.id = 'newTagEditorOverlay';
  wrap.innerHTML = html;
  document.body.appendChild(wrap);
}
function handleNewEditClick(e) {
  const reviewItem = e.target.closest('[data-ne-review-item]');
  if (reviewItem && !e.target.closest('input,button,[data-ne-item]')) {
    e.preventDefault();
    e.stopImmediatePropagation();
    setNewActiveReviewItem(parseInt(reviewItem.dataset.neReviewItem, 10));
    return;
  }
  const filter = e.target.closest('[data-ne-filter]');
  if (filter) {
    e.preventDefault();
    e.stopImmediatePropagation();
    setNewTagFilter(filter.dataset.neFilter);
    return;
  }
  const action = e.target.closest('[data-ne-action]');
  if (action) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const field = action.dataset.neField || 'status';
    const selectedIds = getNewSelectedItemIds();
    openNewTagEditor(parseInt(action.dataset.neItem || selectedIds[0] || 2, 10), field, action.dataset.neBulk === 'true', selectedIds);
    return;
  }
  const chip = e.target.closest('[data-ne-item][data-ne-field]');
  if (!chip) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  openNewTagEditor(parseInt(chip.dataset.neItem, 10), chip.dataset.neField, false);
}
document.addEventListener('click', handleNewEditClick, true);
function renderNewEdit() {
  const session = SESSION_DATA.find(s => s.id === currentSessionId);
  const standardizedParts = getStandardizedEditorParts(session);
  // Standardized tests render as one assessment with official parts/modules.
  // TCAP uses Subparts; SAT uses Modules; both share this editor surface.
  if (session && standardizedParts.length) {
    return renderStandardizedPartsEditor(session);
  }
  // ── legacy general-assessment editor (unchanged) ───────────────────────
  const titleEl = document.querySelector('#page-new-edit .ne-title');
  const subEl = document.querySelector('#page-new-edit .ne-subtitle');
  const badgeEl = document.querySelector('#page-new-edit .ne-badge');
  if (titleEl) titleEl.textContent = 'Teacher Edit Concept · Mid-Term Science Review';
  if (subEl)   subEl.textContent  = 'One shared editor: existing General Assessment first, with optional ACT / TCAP / future SAT blueprint context';
  if (badgeEl) badgeEl.style.display = '';
  const tabs = [
    { id:'edit', label:'Edit Questions' },
    { id:'preview', label:'Preview' },
  ];
  // Restore pill-tab styling (the standardized editor neutralizes it).
  const tabsEl = document.getElementById('newEditTabs');
  tabsEl.style.background = '';
  tabsEl.style.padding = '';
  tabsEl.innerHTML = tabs.map(t =>
    `<button class="${newEditMode===t.id?'active':''}" onclick="setNewEditMode('${t.id}')">${t.label}</button>`
  ).join('');
  renderNewEditOutline();
  renderNewEditContent();
}

