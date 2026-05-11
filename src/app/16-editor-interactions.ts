// @ts-nocheck
// Phase-2 slice: lines 16187-16861 of original src/app.ts

// ═══════ DOTS ARROW SCROLL ═══════
function scrollDots(bid, dir) {
  const container = document.getElementById(bid + '-dots');
  if (!container) return;
  container.scrollBy({ left: dir * 130, behavior: 'smooth' });
  setTimeout(() => updateDotsArrows(bid), 300);
}
function updateDotsArrows(bid) {
  const container = document.getElementById(bid + '-dots');
  const arrL = document.getElementById(bid + '-arrL');
  const arrR = document.getElementById(bid + '-arrR');
  if (!container || !arrL || !arrR) return;
  const overflows = container.scrollWidth > container.clientWidth + 2;
  arrL.classList.toggle('show', overflows && container.scrollLeft > 4);
  arrR.classList.toggle('show', overflows && container.scrollLeft < container.scrollWidth - container.clientWidth - 4);
}
function initAllDotsArrows() {
  document.querySelectorAll('.passage-block').forEach(b => {
    updateDotsArrows(b.id);
    passageGoTo(b.id, 0);
  });
}

// ── Delegated handlers for two notoriously fragile interactions in the
// passage editor: the "+" add-question button and the column-resize
// handle. Both live next to a contenteditable text panel which used to
// race them for mousedown/click events. We wire them at the BODY level
// so:
//   • inline attributes (onclick / onmousedown) can't be stripped by
//     stale cache, browser extensions, or CSP — events still bubble up.
//   • Future re-renders that add new buttons or new passage blocks are
//     automatically covered (delegation resolves targets at fire time).
// Idempotent: a single flag guards the whole block so re-running the
// script (e.g. HMR) won't stack listeners.
if (!window.__addDotDelegationInit) {
  window.__addDotDelegationInit = true;

  // ── + button click: backup path. Primary is inline onclick on the
  // button; this delegated listener only fires if the inline onclick was
  // stripped (extension / CSP / cache). passageAddQ debounces internally
  // so dual-firing is harmless.
  document.addEventListener('click', function(e) {
    const btn = e.target && e.target.closest && e.target.closest('.pq-dot.add-dot');
    if (!btn) return;
    const block = btn.closest('.passage-block');
    if (!block || !block.id) return;
    e.stopPropagation();
    passageAddQ(block.id);
  }, false);

  // ── Resize handle mousedown: backup path. Primary is inline
  // onmousedown="startResize(...)". startResize guards against double-
  // fire via the _resizingBid flag.
  document.addEventListener('mousedown', function(e) {
    const handle = e.target && e.target.closest && e.target.closest('.passage-resize-handle');
    if (!handle) return;
    const bid = handle.dataset.resizeBid;
    if (!bid) return;
    startResize(e, bid);
  }, false);
}

// Refresh overflow-driven arrows whenever the layout changes — window
// resize, sidebar collapse/expand, passage panel resize handle, etc.
function refreshAllDotsArrows() {
  document.querySelectorAll('.passage-block').forEach(b => updateDotsArrows(b.id));
}
window.addEventListener('resize', () => {
  // Throttle to one frame so we don't thrash on a continuous drag.
  if (refreshAllDotsArrows._raf) return;
  refreshAllDotsArrows._raf = requestAnimationFrame(() => {
    refreshAllDotsArrows._raf = null;
    refreshAllDotsArrows();
  });
});


// ═══════ MORE MENU TOGGLE ═══════
function togglePMenu(btn) {
  const menu = btn.parentElement.querySelector('.p-menu');
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.p-menu.open').forEach(m => m.classList.remove('open'));
  if (!wasOpen) menu.classList.add('open');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.p-actions')) {
    document.querySelectorAll('.p-menu.open').forEach(m => m.classList.remove('open'));
  }
});

// Renumber every visible question label within a section after a
// passage gains/loses items, so downstream passages stay in sequence.
//
// Why DOM-only: the editor doesn't bind .pq-num / .pq-dot text back to
// SAMPLE_Q on every keystroke (those mutations are batched on save), so
// the source of truth here is the rendered DOM. We:
//   1. Walk back from the changed passage block to its <subject-alias>
//      anchor (each ACT section is wrapped by one of these).
//   2. Collect every .passage-block and .q-card sibling between this
//      anchor and the next anchor (or end of main panel).
//   3. Walk those items in document order and reassign labels starting
//      from 1 — passage dots, slide .pq-num badges, .passage-q-count
//      counters, and standalone .q-card-num all get the same running n.
//
// Without this, adding a question to Passage I would leave Passage II
// (and everything after) with stale numbers that overlap I.
function renumberSectionFromBlock(block) {
  if (!block) return;
  const parent = block.parentElement;
  if (!parent) return;

  // 1) Find the section anchor (preceding .subject-alias). If the section
  // header was rendered without one, we just renumber from the start of
  // the parent — still better than the broken state.
  let anchor = null;
  let cursor = block.previousElementSibling;
  while (cursor) {
    if (cursor.classList && cursor.classList.contains('subject-alias')) { anchor = cursor; break; }
    cursor = cursor.previousElementSibling;
  }

  // 2) Collect all numbered items between this anchor and the next
  // anchor (or end). Order = document order = display order.
  const items = [];
  let node = anchor ? anchor.nextElementSibling : parent.firstElementChild;
  while (node) {
    if (node.classList && node.classList.contains('subject-alias')) break;
    if (node.classList && (node.classList.contains('passage-block') || node.classList.contains('q-card'))) {
      items.push(node);
    }
    node = node.nextElementSibling;
  }

  // 3) Renumber everything in this section sequentially starting from 1.
  let n = 1;
  items.forEach(el => {
    if (el.classList.contains('passage-block')) {
      const dots = el.querySelectorAll('.pq-dot:not(.add-dot)');
      const slideNums = el.querySelectorAll('.pq-slide .pq-num');
      const count = dots.length;
      dots.forEach((d, i) => { d.textContent = String(n + i); });
      slideNums.forEach((s, i) => { s.textContent = String(n + i); });
      n += count;
    } else {
      const num = el.querySelector('.q-card-num');
      if (num) num.textContent = String(n);
      n++;
    }
  });
}

// ═══════ DELETE QUESTION FROM PASSAGE BLOCK ═══════
function deletePassageQ(bid, idx) {
  const block = document.getElementById(bid);
  if (!block) return;
  const slides = block.querySelectorAll('.pq-slide');
  if (slides.length <= 1) { alert('Cannot delete the last question.'); return; }

  // Remove passage highlight for this question
  const qNum = slides[idx].querySelector('.pq-num')?.textContent;
  if (qNum) {
    const panel = block.querySelector('.passage-text-panel');
    if (panel) {
      panel.querySelectorAll(`.q-ref[data-q="${qNum}"]`).forEach(ref => {
        const frag = document.createDocumentFragment();
        while (ref.firstChild) frag.appendChild(ref.firstChild);
        ref.parentNode.replaceChild(frag, ref);
      });
    }
  }

  // Remove slide
  slides[idx].remove();

  // Remove corresponding dot (non-add-dot)
  const dots = block.querySelectorAll('.pq-dot:not(.add-dot)');
  if (dots[idx]) dots[idx].remove();

  // Re-index remaining slides + dots. Preserve the original GLOBAL question
  // numbers (q.n) on the visible labels — only update positional data-idx
  // and click handlers so navigation still works.
  const newSlides = block.querySelectorAll('.pq-slide');
  const newDots = block.querySelectorAll('.pq-dot:not(.add-dot)');
  newSlides.forEach((s, i) => { s.dataset.idx = i; });
  newDots.forEach((d, i) => {
    d.dataset.idx = i;
    d.onclick = function(){ passageGoTo(bid, i); };
  });

  // Navigate to safe index (passageGoTo updates the counter)
  const safeIdx = Math.min(idx, newSlides.length - 1);
  passageGoTo(bid, safeIdx);

  // Shift downstream passages' numbers down by 1.
  renumberSectionFromBlock(block);

  // Close menu
  document.querySelectorAll('.p-menu.open').forEach(m => m.classList.remove('open'));
}

// ═══════ DUPLICATE QUESTION IN PASSAGE BLOCK ═══════
function duplicatePassageQ(bid, idx) {
  const block = document.getElementById(bid);
  if (!block) return;
  const slides = block.querySelectorAll('.pq-slide');
  const source = slides[idx];
  if (!source) return;

  // Clone slide
  const clone = source.cloneNode(true);
  clone.style.display = 'none';
  source.after(clone);

  // The "+" is the last child of .pq-dots — insert the duplicated dot
  // BEFORE it so the row stays "1 2 … N +". Use the source dot's label
  // (clone keeps the same global #) so the new dot inherits a sane number
  // — re-numbering the whole section is out of scope for a per-passage
  // duplicate.
  const dotsContainer = block.querySelector('.pq-dots');
  const sourceDot = dotsContainer.querySelectorAll('.pq-dot:not(.add-dot)')[idx];
  const newDot = document.createElement('button');
  newDot.type = 'button';
  newDot.className = 'pq-dot';
  newDot.textContent = sourceDot ? sourceDot.textContent : String(slides.length + 1);
  const plusBtn = dotsContainer.querySelector('.pq-dot.add-dot');
  if (plusBtn) dotsContainer.insertBefore(newDot, plusBtn);
  else dotsContainer.appendChild(newDot);

  // Re-index positional handlers only — preserve global question labels.
  const newSlides = block.querySelectorAll('.pq-slide');
  const newDots = block.querySelectorAll('.pq-dot:not(.add-dot)');
  newSlides.forEach((s, i) => { s.dataset.idx = i; });
  newDots.forEach((d, i) => {
    d.dataset.idx = i;
    d.onclick = function(){ passageGoTo(bid, i); };
  });

  // Navigate to the duplicated question (passageGoTo updates the counter)
  passageGoTo(bid, idx + 1);

  // Shift downstream passages' numbers up by 1.
  renumberSectionFromBlock(block);

  document.querySelectorAll('.p-menu.open').forEach(m => m.classList.remove('open'));
}

// ═══════ ADD BLANK MC QUESTION TO PASSAGE BLOCK ═══════
// Resilience notes (this used to silently no-op too often):
//   1. Wrapped in try/catch + console.warn so any failure is visible in
//      DevTools instead of looking like "the button does nothing".
//   2. Backed by a delegated click listener on body (see
//      __addDotDelegationInit below) so the click reliably reaches us
//      even if a stale cache or browser extension strips inline onclick.
//   3. 100ms debounce per-bid so the inline onclick + body delegation
//      double-fire is harmless — only one add per real user click.
const _passageAddQLastFire = {};
function passageAddQ(bid) {
  // Visible click-feedback flash — flashes the + button green for 200ms
  // BEFORE doing any other work. If user clicks + and doesn't see this
  // flash, the click event isn't reaching this function at all (cache,
  // CSP, parent stopPropagation, etc.). If they see the flash but no
  // question is added, the bug is downstream (check the warn below).
  console.log('[passageAddQ] called for bid=' + bid);
  try {
    const block0 = document.getElementById(bid);
    const plusBtn = block0 && block0.querySelector('.pq-dot.add-dot');
    if (plusBtn) {
      plusBtn.classList.add('fired');
      setTimeout(() => plusBtn.classList.remove('fired'), 200);
    }
  } catch(_) {}
  try {
    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    if (_passageAddQLastFire[bid] && (now - _passageAddQLastFire[bid]) < 100) {
      console.log('[passageAddQ] debounced (within 100ms window)');
      return;
    }
    _passageAddQLastFire[bid] = now;
    const block = document.getElementById(bid);
    if (!block) { console.warn('passageAddQ: block not found for bid=' + bid); return; }
    const slides = block.querySelectorAll('.pq-slide');
    const dots = block.querySelector('.pq-dots');
    // Footer bar was removed; new slides are appended directly into the
    // single-question container, after existing slides.
    const slideHost = block.querySelector('.passage-question-single');
    if (!dots) { console.warn('passageAddQ: .pq-dots not found in', bid); return; }
    if (!slideHost) { console.warn('passageAddQ: .passage-question-single not found in', bid); return; }
    return _passageAddQImpl(block, slides, dots, slideHost, bid);
  } catch (e) {
    console.warn('passageAddQ threw:', e && e.message, e);
  }
}
function _passageAddQImpl(block, slides, dots, slideHost, bid) {
  const newIdx = slides.length;
  // Continue from the last existing dot's global number (q.n) so the new
  // question stays in sequence with this passage's range (e.g. P3 = 31–45,
  // adding one yields 46). Falls back to local index if no prior dot.
  const lastDot = dots.querySelectorAll('.pq-dot:not(.add-dot)');
  const lastNumRaw = lastDot.length ? parseInt(lastDot[lastDot.length - 1].textContent, 10) : NaN;
  const newNum = Number.isFinite(lastNumRaw) ? lastNumRaw + 1 : (newIdx + 1);
  const elimIcon = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>`;
  const slidersIcon = ICONS.sliders;
  const dots3Icon = ICONS.dots3;

  // The "+" now lives INSIDE .pq-dots as the last child. Insert the new
  // numbered dot BEFORE the + so the order stays "1 2 … N +".
  const newDot = document.createElement('button');
  newDot.type = 'button';
  newDot.className = 'pq-dot';
  newDot.dataset.idx = newIdx;
  newDot.textContent = newNum;
  newDot.onclick = function(){ passageGoTo(bid, newIdx); };
  const plusBtn = dots.querySelector('.pq-dot.add-dot');
  if (plusBtn) dots.insertBefore(newDot, plusBtn);
  else dots.appendChild(newDot);

  // Build new blank slide. Reuse questionHeaderActionsHtml so the new
  // slide's right-side header (AI / sliders / score / more) matches every
  // other question editor card byte-for-byte.
  const slide = document.createElement('div');
  slide.className = 'pq-slide';
  slide.dataset.idx = newIdx;
  slide.style.display = 'none';
  const newQ = {
    n: newNum, type: 'MC', pts: 1,
    text: '',
    choices: ['', '', '', ''],
    correct: null,
    isMultipleAnswers: false,
  };
  // Register the new question in the passage's data so _pqGetQ / pqAddOption /
  // pqOptDelete / pqToggleCorrect can find it. Without this the toolbar and
  // option menus would no-op on a freshly added slide.
  const passage = window._passageByBid && window._passageByBid[bid];
  if (passage) {
    if (!Array.isArray(passage.questions)) passage.questions = [];
    passage.questions[newIdx] = newQ;
  }
  const newDropdown = `<div class="p-menu">
    <button onclick="duplicatePassageQ('${bid}',${newIdx})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Duplicate</button>
    <button class="danger" onclick="deletePassageQ('${bid}',${newIdx})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> Delete</button>
  </div>`;
  slide.innerHTML = `<div class="pq-single-body">
    <div class="pq-q-head">
      <span class="pq-num">${newNum}</span>
      <span class="pq-q-type">Multiple Choice</span>
      ${questionHeaderActionsHtml(newQ, { hideStructureControls: false, dropdownMenu: newDropdown })}
    </div>
    ${pqStemHtml('', 'Type your question here…')}
    ${_pqRenderChoicesSection(bid, newIdx, newQ)}
    ${renderEditorExplPanel(newQ)}
  </div>`;

  slideHost.appendChild(slide);

  // Navigate to the new slide (passageGoTo updates the counter)
  passageGoTo(bid, newIdx);
  updateDotsArrows(bid);

  // Shift downstream passages' numbers up by 1 so the section stays
  // sequential (e.g. P1 going from 15 → 16 questions bumps P2's start
  // from 16 to 17, P3's from 31 to 32, etc.).
  const blockForRenumber = document.getElementById(bid);
  if (blockForRenumber) renumberSectionFromBlock(blockForRenumber);
}

// ═══════ SIDEBAR COLLAPSE / EXPAND ═══════
function collapseSidebar(sidebarId, openBtnId) {
  const sb = document.getElementById(sidebarId);
  const btn = document.getElementById(openBtnId);
  if (sb) sb.classList.add('collapsed');
  if (btn) btn.style.display = '';
}
function expandSidebar(sidebarId, openBtnId) {
  const sb = document.getElementById(sidebarId);
  const btn = document.getElementById(openBtnId);
  if (sb) sb.classList.remove('collapsed');
  if (btn) btn.style.display = 'none';
}

// ═══════ DRAGGABLE RESIZE HANDLE ═══════
let _resizing = null;
function enablePassageEdit(panel) {
  if (!panel) return;
  panel.setAttribute('contenteditable', 'true');
  panel.focus();
  panel.addEventListener('blur', function handler(e) {
    if (panel.contains(e.relatedTarget)) return;
    panel.setAttribute('contenteditable', 'false');
    panel.removeEventListener('blur', handler);
  }, { once: false });
}

// startResize is the inline-onmousedown entry point. The body delegation
// in __addDotDelegationInit calls into the SAME implementation. We guard
// against double-fire (inline + delegation) with a per-bid `_resizing`
// flag — once a drag is active, subsequent mousedowns on the same handle
// are ignored until mouseup clears the flag.
const _resizingBid = {};
function startResize(e, bid) {
  console.log('[startResize] called for bid=' + bid);
  if (_resizingBid[bid]) { console.log('[startResize] already resizing'); return; }
  _resizingBid[bid] = true;
  if (e && e.preventDefault) e.preventDefault();
  const block = document.getElementById(bid);
  if (!block) { _resizingBid[bid] = false; return; }
  const split = block.querySelector('.passage-split');
  const leftPanel = split && split.querySelector('.passage-text-panel');
  const handle = split && split.querySelector('.passage-resize-handle');
  if (!split || !leftPanel || !handle) { _resizingBid[bid] = false; return; }

  // Disable contenteditable for the duration of the drag — otherwise the
  // browser turns mousemove into a text-selection drag inside the panel
  // and the resize stalls. Restored on mouseup.
  const wasEditable = leftPanel.getAttribute('contenteditable');
  leftPanel.setAttribute('contenteditable', 'false');
  handle.classList.add('dragging');
  document.body.style.cursor = 'col-resize';

  const startX = e.clientX;
  const startW = leftPanel.offsetWidth;
  const totalW = split.offsetWidth;
  function onMove(ev) {
    const delta = ev.clientX - startX;
    const newW = Math.max(180, Math.min(totalW - 220, startW + delta));
    leftPanel.style.flex = '0 0 ' + newW + 'px';
  }
  function onUp() {
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    if (wasEditable !== null) leftPanel.setAttribute('contenteditable', wasEditable);
    else leftPanel.removeAttribute('contenteditable');
    _resizingBid[bid] = false;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

// ═══════ ACTIVE PASSAGE QUESTION TRACKING ═══════
let _activePassage = { bid: null, qNum: null };

// ═══════ FLOATING HIGHLIGHT POPUP ═══════
(function initHighlightPopup(){
  const popup = document.createElement('div');
  popup.id = 'hlPopup';
  popup.onmousedown = function(e){ e.preventDefault(); };
  popup.innerHTML = `
    <div class="hl-opt hp" onclick="applyHL('hl-p')" title="Highlight"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
    <div class="hl-opt hx" onclick="applyHL('')" title="Remove">✕</div>
  `;
  document.body.appendChild(popup);

  document.addEventListener('mouseup', function(e){
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) { popup.classList.remove('show'); return; }
    const panel = sel.anchorNode?.parentElement?.closest?.('.passage-text-panel');
    if (!panel) { popup.classList.remove('show'); return; }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    popup.style.left = (rect.left + rect.width / 2 - 60) + 'px';
    popup.style.top = (rect.top - 42) + 'px';
    popup.classList.add('show');
  });
  document.addEventListener('mousedown', function(e){
    if (e.target.closest('#hlPopup')) return;
    popup.classList.remove('show');
  });
})();

function applyHL(cls) {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;
  const panel = sel.anchorNode?.parentElement?.closest?.('.passage-text-panel');
  const bid = _activePassage.bid;
  const qNum = _activePassage.qNum;
  const block = bid ? document.getElementById(bid) : null;

  // Remove existing highlight for THIS question only (each question has its own)
  if (panel && qNum) {
    panel.querySelectorAll(`.q-ref[data-q="${qNum}"]`).forEach(old => {
      const frag = document.createDocumentFragment();
      while (old.firstChild) frag.appendChild(old.firstChild);
      old.parentNode.replaceChild(frag, old);
    });
  }

  // Apply new highlight + auto-link to current question
  if (cls) {
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.className = cls;
    if (qNum) {
      span.classList.add('q-ref', 'active-ref');
      span.dataset.q = qNum;
    }
    try { range.surroundContents(span); } catch(e) {}

    // Persist quote + panel HTML back to data so navigating away + back
    // doesn't wipe the highlight. No header chip is rendered — passage
    // panel is the sole UI surface for the highlight (cleaner, no dup).
    if (block && qNum) {
      const selectedText = span.textContent.substring(0, 30) + (span.textContent.length > 30 ? '...' : '');
      _persistPassageAnchor(bid, qNum, `"${selectedText}"`);
    }
  }

  document.getElementById('hlPopup').classList.remove('show');
  sel.removeAllRanges();
}

// Clear an existing passage reference: strip the highlight spans for this
// question and reset the ref-hint to its empty placeholder state. Mirrors
// the inverse of applyHL — used by the × button on filled hints.
function clearPassageRef(bid, qNum) {
  const block = document.getElementById(bid);
  if (!block) return;
  block.querySelectorAll(`.q-ref[data-q="${qNum}"]`).forEach(old => {
    const frag = document.createDocumentFragment();
    while (old.firstChild) frag.appendChild(old.firstChild);
    old.parentNode.replaceChild(frag, old);
  });
  block.querySelectorAll('.pq-slide').forEach(s => {
    const num = s.querySelector('.pq-num');
    if (num && num.textContent == qNum) {
      // Display-only chip: empty state = remove from DOM entirely. The
      // re-trigger lives in the passage RTE toolbar, not the question card.
      const hint = s.querySelector('.pq-ref-hint');
      if (hint) hint.remove();
    }
  });
  _persistPassageAnchor(bid, qNum, null);
}

// Snapshot live passage panel HTML + q.ref into the source data so anchors
// survive section / sidebar navigation (which re-runs renderPassageBlock).
// We strip the static .rte-bar before saving so the toolbar isn't baked
// into fullText every time.
function _persistPassageAnchor(bid, qNum, quotedText) {
  const passage = window._passageByBid && window._passageByBid[bid];
  if (!passage) return;
  const block = document.getElementById(bid);
  const panel = block && block.querySelector('.passage-text-panel');
  if (panel) {
    const clone = panel.cloneNode(true);
    const bar = clone.querySelector('.rte-bar');
    if (bar) bar.remove();
    passage.fullText = clone.innerHTML;
  }
  if (passage.questions) {
    const q = passage.questions.find(x => x.n == qNum);
    if (q) {
      if (quotedText == null) delete q.ref;
      else q.ref = quotedText;
    }
  }
}

// ═══════ EDITOR EXPLANATION PANEL (shared) ═══════
// Single source of truth for the "▼ Explanation" block under every editable
// question — used by both standalone q-cards (renderQuestionCard) and
// passage-bound slides (renderPassageBlock). Always renders an EMPTY
// textarea with the placeholder; teachers fill it in. Never pre-fills mock
// rationale (stale teacher copy) and never injects "solution steps" /
// "common mistakes" — those tripled the chrome and didn't read as a single
// authoring affordance. Skip for free-response writing where the rubric
// (not a one-line key) is the authoritative explanation.
function renderEditorExplPanel(q, opts = {}) {
  if (!q) return '';
  if (q.type === 'ESSAY' || opts.isActWriting || q.type === 'ACT_WRITING') return '';
  const uid = `expl-${(q.n != null ? q.n : 'x')}-${Math.random().toString(36).slice(2,6)}`;
  return `<div class="editor-expl-panel">
    <div class="editor-expl-toggle" onclick="document.getElementById('${uid}').classList.toggle('open')">
      <span>▼ Explanation</span>
    </div>
    <div class="editor-expl-body" id="${uid}">
      <textarea rows="2" placeholder="Add the answer rationale students will see after submission..."></textarea>
    </div>
  </div>`;
}

// ═══════ QUESTION CARD with MC interactions ═══════
function renderQuestionCard(q, selected, dataAttr, editorType = 'generic') {
  const typeName = TYPE_LABELS[q.type] || q.type;
  const isActWriting = q.type === 'ACT_WRITING';
  const hideStructureControls = isFixedActEditor(editorType);
  const elimIcon = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>`;
  let body = '';

  if (isActWriting) {
    // Editor view: render an empty canvas with placeholder hints, NOT the
    // ACT_WRITING_PROMPT defaults. The defaults still drive the student-
    // facing render (via actWritingData) so students see a populated prompt
    // by default. Only rubric domains use the fallback here, since they're
    // read-only ACT-defined reference material.
    const aw = actWritingData(q);
    const persp = (q.perspectives && q.perspectives.length === 3) ? q.perspectives : [{}, {}, {}];
    const tasksRaw = Array.isArray(q.taskInstructions) ? q.taskInstructions.join('\n') : (q.taskInstructions || '');
    body = `<div class="act-writing-card">
      <div class="act-writing-card-head">
        <div>
          <div class="act-writing-kicker">ACT Writing Editor</div>
          <div class="act-writing-title">One Issue · Three Perspectives · 40-Minute Essay</div>
          <div class="act-writing-edit-note">Configure the ACT Writing prompt students will see. Scoring follows ACT's official 4-domain rubric (applied during grading).</div>
        </div>
      </div>
      <div class="act-writing-grid">
        <div class="act-writing-field">
          <label>Prompt title</label>
          <input class="act-writing-input" placeholder="e.g. Capstone Projects in High School" value="${q.title || ''}">
        </div>
        <div class="act-writing-field">
          <label>Timing / scoring model</label>
          <input class="act-writing-input" placeholder="40 minutes · Writing score 2-12 · 4 ACT domains (set by ACT)" readonly>
        </div>
      </div>
      <div class="act-writing-field">
        <label>Issue background</label>
        <textarea class="act-writing-textarea" placeholder="Set up the topic in 2-3 sentences students can ground their essay in...">${q.issue || ''}</textarea>
      </div>
      <div class="act-writing-perspectives">
        ${persp.map((p, i) => `<div class="act-writing-perspective">
          <b>${(p && p.label) || `Perspective ${i + 1}`}</b>
          <textarea class="act-writing-textarea" placeholder="Write a stance students will be asked to evaluate, agree, or disagree with...">${(p && p.text) || ''}</textarea>
        </div>`).join('')}
      </div>
      <div class="act-writing-field act-writing-task">
        <label>Student task instructions</label>
        <textarea class="act-writing-textarea" placeholder="Tell students what they need to do — e.g. Evaluate the three perspectives, develop your own, and explain how it relates to the others...">${tasksRaw}</textarea>
      </div>
    </div>`;
  } else if (q.type === 'ESSAY') {
    body = `<div class="answer-area" style="min-height:80px"><em>Student essay response area (long-form writing)</em></div>`;
  } else if (q.type === 'CODE') {
    body = `<div style="background:#1e1e1e;color:#d4d4d4;border-radius:8px;padding:12px 16px;font-family:'Fira Code',monospace;font-size:12px;line-height:1.6">
      <div style="color:#608b4e"># Student code area</div>
      <div><span style="color:#c586c0">def</span> <span style="color:#dcdcaa">solution</span>():</div>
      <div style="padding-left:16px;color:#6a9955">pass</div>
    </div>`;
  } else if (q.choices) {
    body = `<ul class="choices">${q.choices.map((c, i) =>
      `<li class="choice ${i === q.correct ? 'correct' : ''}" onclick="this.classList.toggle('selected')">
        <span class="letter">${String.fromCharCode(65 + i)}</span>
        <span>${c}</span>
        <button class="elim-btn" onclick="event.stopPropagation();this.parentElement.classList.toggle('eliminated')" title="Eliminate">${elimIcon}</button>
      </li>`
    ).join('')}</ul>`;
  } else {
    body = `<div class="answer-area"><em>Student answer area</em></div>`;
  }

  const explPanel = renderEditorExplPanel(q, { isActWriting });

  return `<div class="q-card ${selected ? 'selected' : ''}"${dataAttr||''}>
    <div class="q-card-inner">
      <div class="q-card-head">
        <span class="q-card-num">${q.n}</span>
        <div style="display:flex;flex:1;justify-content:space-between;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
            <span class="q-card-type">${typeName}</span>
          </div>
          ${questionHeaderActionsHtml(q, { hideStructureControls })}
        </div>
      </div>
      <div class="q-card-body">
        ${isActWriting ? '' : `<div class="question-text">${q.text}</div>`}
        ${body}
        ${explPanel}
      </div>
    </div>
  </div>
  ${hideStructureControls ? '' : `<div class="add-q-inline"><button>${ICONS.plus} Add Question</button></div>`}`;
}

