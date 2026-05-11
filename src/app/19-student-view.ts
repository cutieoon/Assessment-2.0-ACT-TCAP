// @ts-nocheck
// Phase-2 slice: lines 18377-19566 of original src/app.ts

// ═══════ STUDENT VIEW RENDERING ═══════
const STU_STATE = {};
const bookmarkSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
const bookmarkFilled = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
const flagSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`;
const flagFilled = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`;
const chevL = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const chevR = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
const elimX = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>`;
const eyeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
function stuElimButtonHtml(isEliminated) {
  return isEliminated ? 'Undo' : elimX;
}
function stuSyncElimButton(li, isEliminated) {
  const btn = li?.querySelector('.stu-elim');
  if (!btn) return;
  btn.innerHTML = stuElimButtonHtml(isEliminated);
  btn.classList.toggle('undo', !!isEliminated);
  btn.title = isEliminated ? 'Undo elimination' : 'Eliminate';
}

function stuBuildAllQuestions(sections) {
  let all = [];
  sections.forEach(sec => {
    const items = SAMPLE_Q[sec.id] || [];
    items.forEach(item => {
      if (item.type === 'RR_PASSAGE') {
        (item.questions || []).forEach(q => all.push({ ...q, passage: item, section: sec.id }));
      } else {
        all.push({ ...item, section: sec.id });
      }
    });
  });
  return all;
}

function stuInit(pageKey, sections, bodyId, footerId) {
  const allQ = stuBuildAllQuestions(sections);
  STU_STATE[pageKey] = {
    questions: allQ, sections, current: 0,
    marked: new Set(), answered: new Set(), eliminated: {}, answers: {},
    currentSecIdx: 0, lockedSecs: new Set(), annotations: {}, passageSnapshots: {}
  };
  stuGenSwitchSection(pageKey, 0);
}

function stuGenSwitchSection(pk, secIdx) {
  const st = STU_STATE[pk];
  st.currentSecIdx = secIdx;
  const sec = st.sections[secIdx];

  const secTime = sec.time || 45;
  stuStartTimer(pk, secTime, {
    onWarning: () => stuShow5MinWarning(pk),
    onTimeUp: () => stuTimeUpAutoSubmit(pk)
  });

  // Update header
  const secLabel = document.getElementById('stuGenSecLabel');
  const secInfo = document.getElementById('stuGenSecInfo');
  if (secLabel) secLabel.textContent = sec.name;

  // Render section tab bar
  const secBar = document.getElementById('stuGenSectionBar');
  if (secBar) {
    secBar.style.display = 'flex';
    secBar.innerHTML = st.sections.map((s, i) => {
      const isCurrent = i === secIdx;
      const cnt = st.questions.filter(q => q.section === s.id).length;
      const cls = ['stu-sec-tab', isCurrent ? 'active' : ''].filter(Boolean).join(' ');
      return `<div class="${cls}" onclick="stuGenSwitchSection('${pk}',${i})">${s.name}<span class="sec-badge">${cnt}</span></div>`;
    }).join('');
  }

  // Get section questions
  const secQ = st.questions.map((q, gi) => ({ ...q, globalIdx: gi })).filter(q => q.section === sec.id);
  st._secQuestions = secQ;

  // Render body
  stuRenderBody(pk, 'stuGenericBody', { hasSectionBar: true });

  // Render footer with section-scoped question tabs
  const footerEl = document.getElementById('stuGenericFooter');
  let tabs = secQ.map((q, i) => {
    const gi = q.globalIdx;
    const cls = ['stu-ftab', st.answered.has(gi) ? 'answered' : '', st.marked.has(gi) ? 'marked' : ''].filter(Boolean).join(' ');
    return `<div class="${cls}" data-gi="${gi}" data-si="${i}" onclick="stuGenGoLocal('${pk}',${i})">${i + 1}</div>`;
  }).join('');
  const chevL = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  const chevR = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  footerEl.innerHTML = `
    <button class="gen-nav-btn" id="${pk}-backBtn" onclick="stuGenGoPrev('${pk}')">${chevL} Back</button>
    <div class="stu-footer-tabs" id="${pk}-ftabs">${tabs}</div>
    <button class="gen-nav-btn" id="${pk}-nextBtn" onclick="stuGenGoNext('${pk}')">Next ${chevR}</button>
    <button class="stu-viewall-btn" onclick="stuOpenNavPanel('${pk}')">${eyeIcon} View All</button>
    <button class="stu-submit-btn" onclick="stuGenSubmit('${pk}')">Submit</button>`;

  // Update header info
  if (secInfo) secInfo.textContent = `${secQ.length} Questions`;

  stuGenGoLocal(pk, 0);
}

function stuGenGoLocal(pk, localIdx) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions;
  if (!secQ || localIdx < 0 || localIdx >= secQ.length) return;
  const globalIdx = secQ[localIdx].globalIdx;
  st.current = globalIdx;

  // Update header info
  const secInfo = document.getElementById('stuGenSecInfo');
  if (secInfo) secInfo.textContent = `Question ${localIdx + 1} of ${secQ.length}`;

  const q = st.questions[globalIdx];
  const isMarked = st.marked.has(globalIdx);
  const area = document.getElementById(pk + '-qArea');
  const typeName = TYPE_LABELS[q.type] || 'Multiple Choice';
  const hasPassage = !!q.passage;
  const savedAnswer = st.answers[globalIdx];

  let qInner = `<div class="stu-q-card">
    <div class="stu-q-head">
      <div style="display:flex;align-items:center">
        <div class="q-order">${localIdx + 1}</div>
        <button class="stu-q-bookmark ${isMarked ? 'active' : ''}" id="${pk}-bm" onclick="stuGenToggleMark('${pk}',${globalIdx},${localIdx})" title="Mark for Review">${isMarked ? bookmarkFilled : bookmarkSvg}</button>
        <span class="q-type">${typeName}</span>
      </div>
      <div class="q-pts"><span>${q.pts || 1}</span><span>${(q.pts||1) > 1 ? 'pts' : 'pt'}</span></div>
    </div>
    <div class="stu-q-stem">${q.text}</div>
    ${q.choices ? (() => {
      const elims = st.eliminated?.[globalIdx] || new Set();
      return `<ul class="stu-choices">${q.choices.map((c, ci) =>
        `<li class="${savedAnswer === ci ? 'selected' : ''} ${elims.has(ci) ? 'eliminated' : ''}" onclick="stuGenSelect(this,${globalIdx},${ci},'${pk}')"><span class="letter">${String.fromCharCode(65+ci)}</span><span>${c}</span><button class="stu-elim ${elims.has(ci) ? 'undo' : ''}" onclick="event.stopPropagation();stuToggleElim('${pk}',${globalIdx},${ci},this.parentElement)" title="${elims.has(ci) ? 'Undo elimination' : 'Eliminate'}">${stuElimButtonHtml(elims.has(ci))}</button></li>`
      ).join('')}</ul>`;
    })() : `<textarea style="width:100%;min-height:100px;border:1px solid #e4e4e7;border-radius:10px;padding:12px;font-size:14px;font-family:inherit;resize:vertical" placeholder="Type your answer..." oninput="STU_STATE['${pk}'].answered.add(${globalIdx})">${savedAnswer || ''}</textarea>`}
  </div>`;

  if (hasPassage) {
    const passageText = (q.passage.fullText || '').replace(/class="q-ref"/g, 'class="stu-hl-src"');
    area.innerHTML = `<div class="stu-passage-split ${stuNotesHidden(pk) ? 'notes-hidden' : ''}">
      <div class="stu-passage-panel" id="${pk}-pass">
        <div class="passage-title">${q.passage.title}</div>
        ${passageText}
      </div>
      ${stuPassageNotesHtml(pk, globalIdx)}
      <div class="stu-passage-resize" onmousedown="stuStartResize(event,'${pk}')"></div>
      <div class="stu-q-right">${qInner}</div>
    </div>`;
    stuRestorePassageState(pk, globalIdx);
    stuInitPassageHL(pk);
  } else {
    area.innerHTML = qInner;
  }

  // Footer tab highlighting
  const ftabs = document.getElementById(pk + '-ftabs');
  if (ftabs) {
    ftabs.querySelectorAll('.stu-ftab').forEach(t => {
      const si = parseInt(t.dataset.si);
      const gi = parseInt(t.dataset.gi);
      t.classList.toggle('current', si === localIdx);
      t.classList.toggle('answered', st.answered.has(gi) && si !== localIdx);
      t.classList.toggle('marked', st.marked.has(gi));
    });
    const at = ftabs.querySelector('.stu-ftab.current');
    if (at) at.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
  }
}

function stuGenSelect(li, globalIdx, choiceIdx, pk) {
  if (li.classList.contains('eliminated')) return;
  li.parentElement.querySelectorAll('li').forEach(l => l.classList.remove('selected'));
  li.classList.add('selected');
  STU_STATE[pk].answered.add(globalIdx);
  STU_STATE[pk].answers[globalIdx] = choiceIdx;
  const tab = document.querySelector(`#${pk}-ftabs .stu-ftab[data-gi="${globalIdx}"]`);
  if (tab) tab.classList.add('answered');
}

function stuGenToggleMark(pk, globalIdx, localIdx) {
  const st = STU_STATE[pk];
  if (st.marked.has(globalIdx)) st.marked.delete(globalIdx); else st.marked.add(globalIdx);
  stuGenGoLocal(pk, localIdx);
}

function stuGenGoPrev(pk) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions || [];
  const curLocal = secQ.findIndex(q => q.globalIdx === st.current);
  if (curLocal > 0) stuGenGoLocal(pk, curLocal - 1);
}

function stuGenGoNext(pk) {
  const st = STU_STATE[pk];
  const secQ = st._secQuestions || [];
  const curLocal = secQ.findIndex(q => q.globalIdx === st.current);
  if (curLocal < secQ.length - 1) stuGenGoLocal(pk, curLocal + 1);
}

function stuGenSubmit(pk) {
  stuStopTimer(pk);
  const st = STU_STATE[pk];
  const totalQ = st.questions.length;
  const answeredCount = st.questions.filter((q, i) => st.answered.has(i)).length;
  const unanswered = totalQ - answeredCount;

  stuModal({
    icon: '📋', iconType: 'warn',
    title: 'Submit Test?',
    body: `<p>Are you sure you want to submit this test? You cannot change your answers after submitting.</p>
      <div class="stat">
        <div class="stat-item"><span class="val">${answeredCount}</span><span class="lbl">Answered</span></div>
        <div class="stat-item"><span class="val">${unanswered}</span><span class="lbl">Unanswered</span></div>
        <div class="stat-item"><span class="val">${totalQ}</span><span class="lbl">Total</span></div>
      </div>`,
    confirmText: 'Submit Test', confirmClass: 'danger',
    onConfirm() { stuExamComplete(pk, 'generic'); }
  });
}

function stuRenderBody(pageKey, bodyId, opts) {
  const st = STU_STATE[pageKey];
  const secs = st.sections;
  const el = document.getElementById(bodyId);
  const hasSectionBar = opts?.hasSectionBar;

  // Progress bar (for pages without a dedicated section bar, e.g. Generic)
  let progressHtml = '';
  if (secs.length > 1 && !hasSectionBar) {
    const secIdx = st.currentSecIdx || 0;
    const pct = ((secIdx + 1) / secs.length) * 100;
    const labelsW = secs.length * 138;
    progressHtml = `<div class="stu-progress" style="max-width:${labelsW}px">
      <div class="stu-progress-bar"><div class="stu-progress-fill" id="${pageKey}-progFill" style="width:${pct}%"></div></div>
      <div class="stu-progress-labels">${secs.map((s, i) =>
        `<span class="${i === secIdx ? 'current' : 'other'}" id="${pageKey}-secLbl-${i}">${s.name}</span>`
      ).join('')}</div>
    </div>`;
  }

  el.innerHTML = `<div class="stu-card">
    ${progressHtml}
    <div id="${pageKey}-qArea"></div>
    <div class="stu-actions" id="${pageKey}-actions"></div>
  </div>`;
}

function stuRenderFooter(pageKey, footerId) {
  const st = STU_STATE[pageKey];
  const el = document.getElementById(footerId);
  let tabs = st.questions.map((q, i) =>
    `<div class="stu-ftab" data-i="${i}" onclick="stuGoToQ('${pageKey}',${i},'${footerId.replace('Footer','Body')}','${footerId}')">${q.n}</div>`
  ).join('');
  el.innerHTML = `<div class="stu-footer-tabs" id="${pageKey}-ftabs">${tabs}</div>
    <button class="stu-viewall-btn" onclick="stuOpenNavPanel('${pageKey}')">${eyeIcon} View All</button>
    <button class="stu-submit-btn" onclick="stuGenSubmit('${pageKey}')">Submit</button>`;
}

function stuGoToQ(pageKey, idx, bodyId, footerId) {
  const st = STU_STATE[pageKey];
  if (idx < 0 || idx >= st.questions.length) return;
  st.current = idx;
  const q = st.questions[idx];
  const isMarked = st.marked.has(idx);
  const area = document.getElementById(pageKey + '-qArea');
  const typeName = TYPE_LABELS[q.type] || 'Multiple Choice';

  // Determine if this is a passage question
  const hasPassage = !!q.passage;

  let qInner = `<div class="stu-q-card">
    <div class="stu-q-head">
      <div style="display:flex;align-items:center">
        <div class="q-order">${q.n}</div>
        <button class="stu-q-bookmark ${isMarked ? 'active' : ''}" id="${pageKey}-bm" onclick="stuToggleMark('${pageKey}',${idx},'${bodyId}','${footerId}')" title="Mark for Review">${isMarked ? bookmarkFilled : bookmarkSvg}</button>
        <span class="q-type">${typeName}</span>
      </div>
      <div class="q-pts"><span>${q.pts || 1}</span><span>${(q.pts||1) > 1 ? 'pts' : 'pt'}</span></div>
    </div>
    <div class="stu-q-stem">${q.text}</div>
    ${q.choices ? `<ul class="stu-choices">${q.choices.map((c, ci) =>
      `<li class="${(STU_STATE[pageKey]?.eliminated?.[idx]||new Set()).has(ci)?'eliminated':''}" onclick="stuSelect(this,${idx},'${pageKey}','${footerId}')"><span class="letter">${String.fromCharCode(65+ci)}</span><span>${c}</span><button class="stu-elim ${(STU_STATE[pageKey]?.eliminated?.[idx]||new Set()).has(ci)?'undo':''}" onclick="event.stopPropagation();stuToggleElim('${pageKey}',${idx},${ci},this.parentElement)" title="${(STU_STATE[pageKey]?.eliminated?.[idx]||new Set()).has(ci)?'Undo elimination':'Eliminate'}">${stuElimButtonHtml((STU_STATE[pageKey]?.eliminated?.[idx]||new Set()).has(ci))}</button></li>`
    ).join('')}</ul>` : ((q.type === 'gridIn' || q.type === 'SA') ? `<div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;padding:20px;text-align:center">
      <div style="font-size:11px;font-weight:600;color:#71717a;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Enter your answer</div>
      <input type="text" inputmode="decimal" style="width:160px;height:48px;border:2px solid #d4d4d8;border-radius:10px;text-align:center;font-size:22px;font-weight:700;font-family:inherit;outline:none;transition:.2s" onfocus="this.style.borderColor='var(--kira)'" onblur="this.style.borderColor='#d4d4d8'" oninput="stuAnswer(${idx},'${pageKey}','${footerId}')" placeholder="?" value="${st.answers[idx]||''}">
      <div style="font-size:10px;color:#a1a1aa;margin-top:6px">Accepts: integers, decimals, fractions (e.g. 1/2)</div>
    </div>` : `<textarea style="width:100%;min-height:100px;border:1px solid #e4e4e7;border-radius:10px;padding:12px;font-size:14px;font-family:inherit;resize:vertical" placeholder="Type your answer..." oninput="stuAnswer(${idx},'${pageKey}','${footerId}')"></textarea>`)}
  </div>`;

  if (hasPassage) {
    const passageText = (q.passage.fullText || '').replace(/class="q-ref"/g, 'class="stu-hl-src"');
    area.innerHTML = `<div class="stu-passage-split ${stuNotesHidden(pageKey) ? 'notes-hidden' : ''}">
      <div class="stu-passage-panel" id="${pageKey}-pass">
        <div class="passage-title">${q.passage.title}</div>
        ${passageText}
      </div>
      ${stuPassageNotesHtml(pageKey, idx)}
      <div class="stu-passage-resize" onmousedown="stuStartResize(event,'${pageKey}')"></div>
      <div class="stu-q-right">${qInner}</div>
    </div>`;
    stuRestorePassageState(pageKey, idx);
    // Highlight active q-ref
    const panel = document.getElementById(pageKey + '-pass');
    if (panel) {
      panel.querySelectorAll('.stu-hl-src').forEach(el => {
        el.classList.toggle('stu-hl-active', el.dataset.q == String(q.n));
      });
      const ref = panel.querySelector(`.stu-hl-src[data-q="${q.n}"]`);
      if (ref) setTimeout(() => ref.scrollIntoView({ behavior:'smooth', block:'center' }), 100);
    }
  } else {
    area.innerHTML = qInner;
  }

  // Actions
  const actionsEl = document.getElementById(pageKey + '-actions');
  const isFirst = idx === 0;
  const isLast = idx === st.questions.length - 1;
  actionsEl.innerHTML = `<div class="nav-group">
      ${!isFirst ? `<button class="nav-pill" onclick="stuGoToQ('${pageKey}',${idx-1},'${bodyId}','${footerId}')">${chevL} Previous</button>` : ''}
      ${!isLast ? `<button class="nav-pill" onclick="stuGoToQ('${pageKey}',${idx+1},'${bodyId}','${footerId}')">Next ${chevR}</button>` : ''}
    </div>`;

  // Update footer tabs
  const ftabs = document.getElementById(pageKey + '-ftabs');
  if (ftabs) {
    ftabs.querySelectorAll('.stu-ftab').forEach((t, i) => {
      t.classList.toggle('current', i === idx);
      t.classList.toggle('answered', st.answered.has(i) && i !== idx);
      t.classList.toggle('marked', st.marked.has(i));
    });
    const activeTab = ftabs.querySelector('.stu-ftab.current');
    if (activeTab) activeTab.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
  }

  // Update progress bar
  if (st.sections.length > 1) {
    const curSec = q.section;
    const secIdx = st.sections.findIndex(s => s.id === curSec);
    const fill = document.getElementById(pageKey + '-progFill');
    if (fill) fill.style.width = ((secIdx + 1) / st.sections.length * 100) + '%';
    st.sections.forEach((s, i) => {
      const lbl = document.getElementById(pageKey + '-secLbl-' + i);
      if (lbl) { lbl.className = i === secIdx ? 'current' : 'other'; }
    });
  }
}

function stuSelect(li, qIdx, pageKey, footerId) {
  if (li.classList.contains('eliminated')) return;
  li.parentElement.querySelectorAll('li').forEach(l => l.classList.remove('selected'));
  li.classList.add('selected');
  STU_STATE[pageKey].answered.add(qIdx);
  const tab = document.querySelector(`#${pageKey}-ftabs .stu-ftab[data-i="${qIdx}"]`);
  if (tab) tab.classList.add('answered');
}

function stuAnswer(qIdx, pageKey, footerId) {
  STU_STATE[pageKey].answered.add(qIdx);
  const tab = document.querySelector(`#${pageKey}-ftabs .stu-ftab[data-i="${qIdx}"]`);
  if (tab) tab.classList.add('answered');
}

function stuToggleMark(pageKey, idx, bodyId, footerId) {
  const st = STU_STATE[pageKey];
  if (st.marked.has(idx)) st.marked.delete(idx); else st.marked.add(idx);
  stuGoToQ(pageKey, idx, bodyId, footerId);
}

// Draggable resize for student passage view
function stuStartResize(e, pageKey) {
  e.preventDefault();
  const split = e.target.parentElement;
  const left = split.querySelector('.stu-passage-panel');
  const right = split.querySelector('.stu-q-right');
  const startX = e.clientX;
  const startW = left.offsetWidth;
  function onMove(ev) {
    const dx = ev.clientX - startX;
    const newW = Math.max(200, Math.min(split.offsetWidth - 300, startW + dx));
    left.style.width = newW + 'px';
    left.style.flex = 'none';
    right.style.flex = '1';
  }
  function onUp() { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

// ═══════ UNIVERSAL COUNTDOWN TIMER ENGINE ═══════
const STU_TIMERS = {};

function stuStartTimer(pk, minutes, opts = {}) {
  stuStopTimer(pk);
  const total = minutes * 60;
  STU_TIMERS[pk] = {
    remaining: total, total, running: true,
    onTick: opts.onTick || null,
    onWarning: opts.onWarning || null,
    onTimeUp: opts.onTimeUp || null,
    warned: false
  };
  STU_TIMERS[pk].interval = setInterval(() => stuTimerTick(pk), 1000);
  stuTimerUpdateDisplay(pk);
}

function stuStopTimer(pk) {
  if (STU_TIMERS[pk]?.interval) { clearInterval(STU_TIMERS[pk].interval); STU_TIMERS[pk].interval = null; }
  if (STU_TIMERS[pk]) STU_TIMERS[pk].running = false;
}

function stuTimerTick(pk) {
  const t = STU_TIMERS[pk];
  if (!t || !t.running) return;
  t.remaining--;
  stuTimerUpdateDisplay(pk);
  if (t.onTick) t.onTick(t.remaining);
  if (t.remaining === 300 && !t.warned && t.onWarning) { t.warned = true; t.onWarning(); }
  if (t.remaining <= 0) { stuStopTimer(pk); if (t.onTimeUp) t.onTimeUp(); }
}

function stuTimerUpdateDisplay(pk) {
  const t = STU_TIMERS[pk];
  if (!t) return;
  const s = Math.max(0, t.remaining);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');

  if (pk === 'stuSat') {
    const el = document.getElementById('stuSatTimerDigits');
    if (el) el.textContent = `${mm}:${ss}`;
    if (s <= 300 && s > 0) el?.classList.add('timer-warn');
    else el?.classList.remove('timer-warn');
  } else if (pk === 'stuAct') {
    const minEl = document.getElementById('stuActMin');
    const secEl = document.getElementById('stuActSec');
    const digitEl = document.getElementById('stuActTimerDigits');
    if (minEl) minEl.textContent = mm;
    if (secEl) secEl.textContent = ss;
    if (digitEl) digitEl.textContent = `${mm}:${ss}`;
    if (s <= 300) { minEl?.classList.add('timer-warn'); secEl?.classList.add('timer-warn'); digitEl?.classList.add('timer-warn'); }
    else { minEl?.classList.remove('timer-warn'); secEl?.classList.remove('timer-warn'); digitEl?.classList.remove('timer-warn'); }
  } else if (pk === 'stuGen') {
    const minEl = document.getElementById('stuGenMin');
    const secEl = document.getElementById('stuGenSec');
    if (minEl) minEl.textContent = mm;
    if (secEl) secEl.textContent = ss;
    if (s <= 300) { minEl?.classList.add('timer-warn'); secEl?.classList.add('timer-warn'); }
    else { minEl?.classList.remove('timer-warn'); secEl?.classList.remove('timer-warn'); }
  }
}

function stuShow5MinWarning(pk) {
  const ov = document.createElement('div');
  ov.className = 'time-warning-overlay';
  ov.id = pk + '-timeWarnOverlay';
  const label = pk === 'stuSat' ? 'module' : pk === 'stuAct' ? 'section' : 'section';
  ov.innerHTML = `<div class="time-warning-box">
    <h3>⏰ 5 Minutes Remaining</h3>
    <p>You have 5 minutes left in this ${label}. Please review your answers and make sure you have answered all questions.</p>
    <button onclick="this.closest('.time-warning-overlay').remove()">Continue</button>
  </div>`;
  document.body.appendChild(ov);
}

function stuTimeUpAutoSubmit(pk) {
  const existing = document.getElementById(pk + '-timeWarnOverlay');
  if (existing) existing.remove();

  const ov = document.createElement('div');
  ov.className = 'time-warning-overlay';
  ov.id = pk + '-timeUpOverlay';
  ov.innerHTML = `<div class="time-warning-box">
    <h3>⏱️ Time's Up!</h3>
    <p>Time has expired. Your answers have been automatically saved.</p>
    <button onclick="stuTimeUpProceed('${pk}')">OK</button>
  </div>`;
  document.body.appendChild(ov);
}

function stuTimeUpProceed(pk) {
  document.getElementById(pk + '-timeUpOverlay')?.remove();
  if (pk === 'stuAct') stuActSubmitSection(pk);
  else if (pk === 'stuSat') stuSatAutoAdvance(pk);
  else if (pk === 'stuGen') stuGenAutoAdvance(pk);
}

// ═══════ STUDENT TOOLS (ACT/SAT shared) ═══════
const STU_TOOLS = {};

// Tools dropdown
function stuToggleTools(pk) {
  const menu = document.getElementById(pk + 'ToolsMenu');
  if (!menu) return;
  menu.classList.toggle('open');
}
document.addEventListener('click', function(e) {
  document.querySelectorAll('.stu-tools-menu.open').forEach(m => {
    if (!m.parentElement.contains(e.target)) m.classList.remove('open');
  });
  // Close ACT tools dropdown on outside click
  document.querySelectorAll('.act-tools-dropdown.open').forEach(m => {
    if (!m.parentElement.contains(e.target)) m.classList.remove('open');
  });
});

// Timer hide/show
function stuToggleTimer(pk) {
  if (!STU_TOOLS[pk]) STU_TOOLS[pk] = {};
  STU_TOOLS[pk].timerHidden = !STU_TOOLS[pk].timerHidden;
  const parts = document.getElementById(pk + 'TimerWrap');
  if (!parts) return;
  const vis = STU_TOOLS[pk].timerHidden ? 'hidden' : 'visible';
  parts.querySelectorAll('.cd-part, .cd-sep').forEach(n => n.style.visibility = vis);
  const digits = parts.querySelector('.sat-timer-digits');
  if (digits) digits.style.visibility = vis;
  const btn = document.getElementById(pk + 'TimerToggle');
  if (btn) btn.innerHTML = STU_TOOLS[pk].timerHidden
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

// Notepad
function stuOpenNotepad(pk) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  const np = document.getElementById(pk + '-notepad');
  if (np) np.classList.add('open');
}
function stuCloseNotepad(pk) {
  const np = document.getElementById(pk + '-notepad');
  if (np) np.classList.remove('open');
}

// ═══════ SCRATCH PAD (Canvas Drawing) ═══════
const _scratchPads = {};
function _getScratchCtx(pk) {
  if (_scratchPads[pk]) return _scratchPads[pk];
  const canvas = document.getElementById(pk + '-scratchCanvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  _scratchPads[pk] = {
    canvas, ctx, drawing: false, tool: 'pen', color: '#1e293b', lineWidth: 2,
    history: [], historyIdx: -1, perQuestion: {}, currentQKey: null, gridOn: false
  };
  _scratchInitToolbar(pk);
  _scratchBindEvents(pk);
  _scratchMakeDraggable(pk);
  return _scratchPads[pk];
}

function _scratchInitToolbar(pk) {
  const tb = document.getElementById(pk + '-scratchToolbar');
  if (!tb) return;
  const colors = [
    { c: '#1e293b', label: 'Black' },
    { c: '#dc2626', label: 'Red' },
    { c: '#2563eb', label: 'Blue' },
    { c: '#16a34a', label: 'Green' }
  ];
  const penSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
  const eraserSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>';
  const undoSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';
  const redoSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/></svg>';
  const gridSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="3" y2="21"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="21" y1="3" x2="21" y2="21"/><line x1="3" y1="3" x2="21" y2="3"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="3" y1="21" x2="21" y2="21"/></svg>';

  tb.innerHTML = `
    <button class="stb-pen active" onclick="_scratchSetTool('${pk}','pen')" title="Pen">${penSvg}</button>
    <button class="stb-eraser" onclick="_scratchSetTool('${pk}','eraser')" title="Eraser">${eraserSvg}</button>
    <div class="stb-sep"></div>
    ${colors.map(c => `<button class="stb-color ${c.c === '#1e293b' ? 'active' : ''}" style="background:${c.c}" title="${c.label}" onclick="_scratchSetColor('${pk}','${c.c}')"></button>`).join('')}
    <div class="stb-sep"></div>
    <select onchange="_scratchSetWidth('${pk}',+this.value)" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;background:#fff;height:28px;cursor:pointer">
      <option value="1">Thin</option>
      <option value="2" selected>Medium</option>
      <option value="4">Thick</option>
    </select>
    <div class="stb-sep"></div>
    <button onclick="_scratchUndo('${pk}')" title="Undo">${undoSvg}</button>
    <button onclick="_scratchRedo('${pk}')" title="Redo">${redoSvg}</button>
    <button onclick="_scratchClear('${pk}')" title="Clear" style="font-size:11px;font-weight:600;width:auto;padding:0 8px">Clear</button>
    <div class="stb-sep"></div>
    <button class="stb-grid" onclick="_scratchToggleGrid('${pk}')" title="Grid">${gridSvg}</button>`;
}

function _scratchBindEvents(pk) {
  const pad = _scratchPads[pk];
  const c = pad.canvas;
  const getPos = (e) => {
    const r = c.getBoundingClientRect();
    const scaleX = c.width / r.width;
    const scaleY = c.height / r.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - r.left) * scaleX, y: (clientY - r.top) * scaleY };
  };
  const startDraw = (e) => {
    e.preventDefault();
    pad.drawing = true;
    const p = getPos(e);
    pad.ctx.beginPath();
    pad.ctx.moveTo(p.x, p.y);
    pad.ctx.lineWidth = pad.tool === 'eraser' ? pad.lineWidth * 5 : pad.lineWidth;
    pad.ctx.strokeStyle = pad.tool === 'eraser' ? '#ffffff' : pad.color;
    pad.ctx.lineCap = 'round';
    pad.ctx.lineJoin = 'round';
    pad.ctx.globalCompositeOperation = pad.tool === 'eraser' ? 'destination-out' : 'source-over';
  };
  const moveDraw = (e) => {
    if (!pad.drawing) return;
    e.preventDefault();
    const p = getPos(e);
    pad.ctx.lineTo(p.x, p.y);
    pad.ctx.stroke();
  };
  const endDraw = () => {
    if (!pad.drawing) return;
    pad.drawing = false;
    pad.ctx.closePath();
    _scratchSaveState(pk);
  };
  c.addEventListener('mousedown', startDraw);
  c.addEventListener('mousemove', moveDraw);
  c.addEventListener('mouseup', endDraw);
  c.addEventListener('mouseleave', endDraw);
  c.addEventListener('touchstart', startDraw, { passive: false });
  c.addEventListener('touchmove', moveDraw, { passive: false });
  c.addEventListener('touchend', endDraw);
}

function _scratchMakeDraggable(pk) {
  const handle = document.getElementById(pk + '-scratchDrag');
  const panel = document.getElementById(pk + '-scratchPanel');
  if (!handle || !panel) return;
  let dragging = false, sx, sy, sl, st;
  handle.addEventListener('mousedown', (e) => {
    if (e.target.closest('.sh-close')) return;
    dragging = true;
    const rect = panel.getBoundingClientRect();
    panel.style.transform = 'none';
    panel.style.left = rect.left + 'px';
    panel.style.top = rect.top + 'px';
    sx = e.clientX; sy = e.clientY; sl = rect.left; st = rect.top;
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    panel.style.left = (sl + e.clientX - sx) + 'px';
    panel.style.top = (st + e.clientY - sy) + 'px';
  });
  document.addEventListener('mouseup', () => { dragging = false; });
}

function _scratchSaveState(pk) {
  const pad = _scratchPads[pk];
  pad.history = pad.history.slice(0, pad.historyIdx + 1);
  pad.history.push(pad.canvas.toDataURL());
  pad.historyIdx = pad.history.length - 1;
}

function _scratchRestoreState(pk) {
  const pad = _scratchPads[pk];
  if (pad.historyIdx < 0) { pad.ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height); return; }
  const img = new Image();
  img.onload = () => { pad.ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height); pad.ctx.drawImage(img, 0, 0); };
  img.src = pad.history[pad.historyIdx];
}

function _scratchUndo(pk) {
  const pad = _scratchPads[pk]; if (!pad || pad.historyIdx < 0) return;
  pad.historyIdx--; _scratchRestoreState(pk);
}
function _scratchRedo(pk) {
  const pad = _scratchPads[pk]; if (!pad || pad.historyIdx >= pad.history.length - 1) return;
  pad.historyIdx++; _scratchRestoreState(pk);
}
function _scratchClear(pk) {
  const pad = _scratchPads[pk]; if (!pad) return;
  pad.ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height);
  _scratchSaveState(pk);
}

function _scratchSetTool(pk, tool) {
  const pad = _scratchPads[pk]; if (!pad) return;
  pad.tool = tool;
  pad.canvas.style.cursor = tool === 'eraser' ? 'cell' : 'crosshair';
  const tb = document.getElementById(pk + '-scratchToolbar');
  if (tb) {
    tb.querySelector('.stb-pen')?.classList.toggle('active', tool === 'pen');
    tb.querySelector('.stb-eraser')?.classList.toggle('active', tool === 'eraser');
  }
}
function _scratchSetColor(pk, color) {
  const pad = _scratchPads[pk]; if (!pad) return;
  pad.color = color;
  if (pad.tool === 'eraser') _scratchSetTool(pk, 'pen');
  const tb = document.getElementById(pk + '-scratchToolbar');
  if (tb) tb.querySelectorAll('.stb-color').forEach(b => b.classList.toggle('active', b.style.backgroundColor === color || b.title.toLowerCase() === ({
    '#1e293b': 'black', '#dc2626': 'red', '#2563eb': 'blue', '#16a34a': 'green'
  })[color]));
}
function _scratchSetWidth(pk, w) {
  const pad = _scratchPads[pk]; if (pad) pad.lineWidth = w;
}
function _scratchToggleGrid(pk) {
  const pad = _scratchPads[pk]; if (!pad) return;
  pad.gridOn = !pad.gridOn;
  const wrap = document.getElementById(pk + '-scratchWrap');
  if (wrap) wrap.classList.toggle('grid-on', pad.gridOn);
  const tb = document.getElementById(pk + '-scratchToolbar');
  if (tb) tb.querySelector('.stb-grid')?.classList.toggle('active', pad.gridOn);
}

function _scratchResizeCanvas(pk) {
  const pad = _scratchPads[pk]; if (!pad) return;
  const wrap = document.getElementById(pk + '-scratchWrap');
  if (!wrap) return;
  const saved = pad.canvas.toDataURL();
  pad.canvas.width = wrap.clientWidth;
  pad.canvas.height = wrap.clientHeight;
  if (pad.history.length > 0) {
    const img = new Image();
    img.onload = () => { pad.ctx.drawImage(img, 0, 0); };
    img.src = saved;
  }
}

function _scratchSaveForQuestion(pk) {
  const pad = _scratchPads[pk]; if (!pad || !pad.currentQKey) return;
  pad.perQuestion[pad.currentQKey] = {
    data: pad.canvas.toDataURL(),
    history: [...pad.history],
    historyIdx: pad.historyIdx
  };
}
function _scratchLoadForQuestion(pk, qKey) {
  const pad = _scratchPads[pk]; if (!pad) return;
  if (pad.currentQKey) _scratchSaveForQuestion(pk);
  pad.currentQKey = qKey;
  const saved = pad.perQuestion[qKey];
  if (saved) {
    pad.history = [...saved.history];
    pad.historyIdx = saved.historyIdx;
    _scratchRestoreState(pk);
  } else {
    pad.ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height);
    pad.history = [];
    pad.historyIdx = -1;
  }
}

function stuOpenScratch(pk) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  document.getElementById(pk + '-toolsDropdown')?.classList.remove('open');
  const panel = document.getElementById(pk + '-scratchPanel');
  if (!panel) return;
  panel.style.left = '50%';
  panel.style.top = '50%';
  panel.style.transform = 'translate(-50%,-50%)';
  panel.classList.add('open');
  const backdrop = document.getElementById(pk + '-scratchBackdrop');
  if (backdrop) backdrop.classList.add('open');
  const pad = _getScratchCtx(pk);
  if (pad) {
    setTimeout(() => {
      _scratchResizeCanvas(pk);
      const st = STU_STATE[pk];
      if (st && st._secQuestions) {
        const localIdx = st._secQuestions.findIndex(q => q.globalIdx === st.current);
        const qKey = pk + '-q-' + (localIdx >= 0 ? localIdx : 0);
        if (pad.currentQKey !== qKey) _scratchLoadForQuestion(pk, qKey);
        const qInfo = document.getElementById(pk + '-scratchQinfo');
        if (qInfo) qInfo.textContent = '— Question ' + ((localIdx >= 0 ? localIdx : 0) + 1);
      }
    }, 50);
  }
}
function stuCloseScratch(pk) {
  const pad = _scratchPads[pk];
  if (pad) _scratchSaveForQuestion(pk);
  const panel = document.getElementById(pk + '-scratchPanel');
  if (panel) panel.classList.remove('open');
  const backdrop = document.getElementById(pk + '-scratchBackdrop');
  if (backdrop) backdrop.classList.remove('open');
}

// Question Nav Panel (grid view)
function stuOpenNavPanel(pk) {
  const st = STU_STATE[pk];
  if (!st) return;
  const panel = document.getElementById(pk + '-navPanel');
  if (!panel) return;
  if (panel.classList.contains('open')) { panel.classList.remove('open'); return; }

  const useSec = !!st._secQuestions;
  const qs = useSec ? st._secQuestions : st.questions;
  const total = qs.length;
  const answeredCount = qs.filter((q, i) => {
    const gi = useSec ? q.globalIdx : i;
    return st.answered.has(gi);
  }).length;
  const markedCount = qs.filter((q, i) => {
    const gi = useSec ? q.globalIdx : i;
    return st.marked.has(gi);
  }).length;
  const skippedCount = total - answeredCount;

  const isReview = pk === 'stuAct' && st.reviewMode;
  let cells = qs.map((q, i) => {
    const gi = useSec ? q.globalIdx : i;
    const cls = ['stu-nav-cell'];
    if (gi === st.current) cls.push('current');
    if (st.answered.has(gi)) cls.push('answered');
    if (st.marked.has(gi)) cls.push('marked');
    if (!st.answered.has(gi) && gi !== st.current) cls.push('skipped');
    if (isReview) {
      const fullQ = st.questions[gi];
      const status = actReviewQStatus(fullQ, st.answers?.[gi]);
      cls.push('review-' + status);
    }
    let onclick;
    if (pk === 'stuAct') onclick = `stuActGoLocal('${pk}',${i})`;
    else if (pk === 'stuSat') onclick = `stuSatGoLocal('${pk}',${i})`;
    else onclick = `stuGenGoLocal('${pk}',${i})`;
    return `<div class="${cls.join(' ')}" onclick="${onclick};document.getElementById('${pk}-navPanel').classList.remove('open')">${i + 1}</div>`;
  }).join('');

  const secName = st.sections[st.currentSecIdx]?.name || 'All Questions';
  const isSat = pk === 'stuSat';
  let legend = isSat ? `<div class="nav-legend">
    <div class="nav-legend-item"><div class="nav-legend-dot" style="background:#0d3320;border-color:#22c55e"></div> Answered</div>
    <div class="nav-legend-item"><div class="nav-legend-dot" style="background:#0f172a;border-color:#334155"></div> Unanswered</div>
    <div class="nav-legend-item"><div class="nav-legend-dot" style="background:#0f172a;border-color:#334155;position:relative"><span style="position:absolute;top:-3px;right:-3px;width:7px;height:7px;border-radius:50%;background:#ef4444;border:1px solid #1e293b;display:block"></span></div> For Review</div>
    <div class="nav-legend-item"><div class="nav-legend-dot" style="background:#1e3a5f;border-color:#3b82f6"></div> Current</div>
  </div>` : '';

  let filterRow, subtitleLine, headTitle;
  if (isReview) {
    let correctCount = 0, wrongCount = 0, blankCount = 0, essayCount = 0;
    qs.forEach(q => {
      const gi = useSec ? q.globalIdx : st.questions.indexOf(q);
      const fullQ = st.questions[gi];
      const status = actReviewQStatus(fullQ, st.answers?.[gi]);
      if (status === 'correct') correctCount++;
      else if (status === 'wrong') wrongCount++;
      else if (status === 'blank') blankCount++;
      else if (status === 'essay') essayCount++;
    });
    headTitle = `${secName} — Review`;
    // Writing-only review: there's no correct/wrong/skipped — essays
    // are scored on the ACT 4-domain rubric, so we drop those chips and
    // legend swatches and surface the rubric-scoring framing instead.
    const writingOnly = essayCount === total && total > 0;
    if (writingOnly) {
      subtitleLine = `${secName} · ${total} essay${total > 1 ? 's' : ''} · auto-scored on the ACT 4-domain rubric`;
      filterRow = '';
      legend = `<div class="nav-legend">
        <div class="nav-legend-item"><div class="nav-legend-dot" style="background:#fff;border-color:#a78bfa"></div> Essay</div>
      </div>`;
    } else {
      const subParts = [];
      if (correctCount) subParts.push(`${correctCount} correct`);
      if (wrongCount)   subParts.push(`${wrongCount} wrong`);
      if (blankCount)   subParts.push(`${blankCount} skipped`);
      if (essayCount)   subParts.push(`${essayCount} essay${essayCount > 1 ? 's' : ''}`);
      subtitleLine = `${secName} · ${subParts.join(' · ')}`;
      const reviewPills = [
        `<span class="filter-pill active" onclick="stuNavFilter('${pk}','all',this)">All (${total})</span>`,
        correctCount > 0 ? `<span class="filter-pill" onclick="stuNavFilter('${pk}','review-correct',this)">Correct (${correctCount})</span>` : '',
        wrongCount   > 0 ? `<span class="filter-pill" onclick="stuNavFilter('${pk}','review-wrong',this)">Wrong (${wrongCount})</span>`     : '',
        blankCount   > 0 ? `<span class="filter-pill" onclick="stuNavFilter('${pk}','review-blank',this)">Skipped (${blankCount})</span>`   : '',
        essayCount   > 0 ? `<span class="filter-pill" onclick="stuNavFilter('${pk}','review-essay',this)">Essay (${essayCount})</span>`     : ''
      ].filter(Boolean).join('');
      filterRow = `<div class="filter-row">${reviewPills}</div>`;
      const legendItems = [];
      if (correctCount > 0) legendItems.push(`<div class="nav-legend-item"><div class="nav-legend-dot" style="background:#dcfce7;border-color:#16a34a"></div> Correct</div>`);
      if (wrongCount > 0)   legendItems.push(`<div class="nav-legend-item"><div class="nav-legend-dot" style="background:#fee2e2;border-color:#ef4444"></div> Wrong</div>`);
      if (blankCount > 0)   legendItems.push(`<div class="nav-legend-item"><div class="nav-legend-dot" style="background:#f4f4f5;border-color:#d4d4d8"></div> Skipped</div>`);
      if (essayCount > 0)   legendItems.push(`<div class="nav-legend-item"><div class="nav-legend-dot" style="background:#fff;border-color:#a78bfa"></div> Essay</div>`);
      legend = `<div class="nav-legend">${legendItems.join('')}</div>`;
    }
  } else {
    headTitle = isSat ? 'Question Menu' : secName + ' — Question Navigator';
    subtitleLine = `${secName} · ${answeredCount} answered · ${skippedCount} unanswered · ${markedCount} for review`;
    filterRow = `<div class="filter-row">
      <span class="filter-pill active" onclick="stuNavFilter('${pk}','all',this)">All (${total})</span>
      <span class="filter-pill" onclick="stuNavFilter('${pk}','answered',this)">Answered (${answeredCount})</span>
      <span class="filter-pill" onclick="stuNavFilter('${pk}','skipped',this)">Unanswered (${skippedCount})</span>
      <span class="filter-pill" onclick="stuNavFilter('${pk}','marked',this)">For Review (${markedCount})</span>
    </div>`;
  }
  panel.innerHTML = `<h3>${headTitle}</h3>
    <div class="subtitle">${subtitleLine}</div>
    ${filterRow}
    <div class="stu-nav-grid">${cells}</div>${legend}`;
  panel.classList.add('open');
}
function stuNavFilter(pk, type, btn) {
  btn.parentElement.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById(pk + '-navPanel');
  panel.querySelectorAll('.stu-nav-cell').forEach(c => {
    if (type === 'all') { c.style.display = ''; return; }
    c.style.display = c.classList.contains(type) ? '' : 'none';
  });
}

// Answer Eliminator persistence
function stuToggleElim(pk, globalIdx, choiceIdx, li) {
  const st = STU_STATE[pk];
  if (!st.eliminated) st.eliminated = {};
  if (!st.eliminated[globalIdx]) st.eliminated[globalIdx] = new Set();
  const s = st.eliminated[globalIdx];
  if (s.has(choiceIdx)) {
    s.delete(choiceIdx);
    li.classList.remove('eliminated');
    stuSyncElimButton(li, false);
  } else {
    s.add(choiceIdx);
    li.classList.add('eliminated');
    li.classList.remove('selected');
    if (st.answers?.[globalIdx] === choiceIdx) {
      delete st.answers[globalIdx];
      st.answered?.delete?.(globalIdx);
      const tab = document.querySelector(`#${pk}-ftabs .stu-ftab[data-gi="${globalIdx}"], #${pk}-ftabs .stu-ftab[data-i="${globalIdx}"]`);
      tab?.classList.remove('answered');
      if (pk === 'stuAct') stuActUpdateAnswered(pk);
    }
    stuSyncElimButton(li, true);
  }
}

// Generic Answer Eliminator mode toggle (shows X buttons on choices)
function stuToggleElimMode(pk) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  document.getElementById(pk + '-toolsDropdown')?.classList.remove('open');
  const pageMap = { stuAct:'page-stu-act', stuSat:'page-stu-sat', stuGen:'page-stu-generic' };
  const page = document.getElementById(pageMap[pk]);
  if (page) page.classList.toggle('elim-mode');
}

// Answer Masking
function stuToggleAnswerMask(pk) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  if (!STU_TOOLS[pk]) STU_TOOLS[pk] = {};
  STU_TOOLS[pk].maskingOn = !STU_TOOLS[pk].maskingOn;
  stuApplyMasking(pk);
}
function stuApplyMasking(pk) {
  const qArea = document.getElementById(pk + '-qArea');
  if (!qArea) return;
  const ul = qArea.querySelector('.stu-choices');
  if (!ul) return;
  const on = STU_TOOLS[pk]?.maskingOn;
  ul.classList.toggle('masked', !!on);
  if (on) {
    ul.querySelectorAll('li').forEach(li => {
      if (!li.querySelector('.mask-reveal')) {
        const btn = document.createElement('button');
        btn.className = 'mask-reveal';
        btn.innerHTML = '👁';
        btn.onclick = function(e) { e.stopPropagation(); li.classList.toggle('revealed'); };
        li.appendChild(btn);
      }
    });
  } else {
    ul.querySelectorAll('.mask-reveal').forEach(b => b.remove());
    ul.querySelectorAll('li').forEach(li => li.classList.remove('revealed'));
  }
}

// Line Reader
function stuToggleLineReader(pk) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  const lr = document.getElementById(pk + '-lineReader');
  if (!lr) return;
  if (lr.classList.contains('open')) { lr.classList.remove('open'); return; }
  lr.classList.add('open');
  if (!STU_TOOLS[pk]) STU_TOOLS[pk] = {};
  let winY = STU_TOOLS[pk].lrY || (window.innerHeight / 2 - 20);
  const winH = 40;
  function positionLR() {
    const top = document.getElementById(pk + '-lrTop');
    const win = document.getElementById(pk + '-lrWin');
    const bot = document.getElementById(pk + '-lrBot');
    const handle = document.getElementById(pk + '-lrHandle');
    const close = document.getElementById(pk + '-lrClose');
    top.style.top = '0'; top.style.height = winY + 'px';
    win.style.top = winY + 'px'; win.style.height = winH + 'px';
    bot.style.top = (winY + winH) + 'px'; bot.style.bottom = '0';
    handle.style.top = (winY + winH) + 'px';
    if (close) close.style.top = (winY + winH) + 'px';
  }
  positionLR();
  const handle = document.getElementById(pk + '-lrHandle');
  handle.onmousedown = function(e) {
    e.preventDefault();
    const startY = e.clientY, startWY = winY;
    function onM(ev) { winY = Math.max(60, Math.min(window.innerHeight - 80, startWY + ev.clientY - startY)); STU_TOOLS[pk].lrY = winY; positionLR(); }
    function onU() { document.removeEventListener('mousemove', onM); document.removeEventListener('mouseup', onU); }
    document.addEventListener('mousemove', onM); document.addEventListener('mouseup', onU);
  };
}

// Color Contrast
function stuToggleContrast(pk) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  if (!STU_TOOLS[pk]) STU_TOOLS[pk] = {};
  const modes = ['', 'contrast-dark', 'contrast-sepia'];
  const cur = STU_TOOLS[pk].contrastIdx || 0;
  const next = (cur + 1) % modes.length;
  STU_TOOLS[pk].contrastIdx = next;
  modes.forEach(m => { if (m) document.body.classList.remove(m); });
  if (modes[next]) document.body.classList.add(modes[next]);
}

// Zoom
function stuZoom(pk, dir) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  if (!STU_TOOLS[pk]) STU_TOOLS[pk] = {};
  const cur = STU_TOOLS[pk].zoom || 100;
  const nxt = Math.max(80, Math.min(150, cur + dir * 10));
  STU_TOOLS[pk].zoom = nxt;
  const pageMap = { stuAct:'page-stu-act', stuSat:'page-stu-sat', stuGen:'page-stu-generic' };
  const pageEl = document.getElementById(pageMap[pk]);
  if (pageEl) pageEl.style.fontSize = nxt + '%';
}

// Directions
function stuCloseDirections() {
  document.getElementById('stuDirectionsOverlay')?.classList.remove('open');
}
function stuDirectionsPanel(title, body, footerHtml) {
  let overlay = document.getElementById('stuDirectionsOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'stuDirectionsOverlay';
    overlay.className = 'stu-directions-overlay';
    overlay.onclick = (event) => { if (event.target === overlay) stuCloseDirections(); };
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<section class="stu-directions-panel" role="dialog" aria-modal="true" aria-label="${title}" onclick="event.stopPropagation()">
      <div class="stu-directions-content">${body}</div>
      <div class="stu-directions-footer">${footerHtml || `<button class="stu-directions-close" onclick="stuCloseDirections()">Close</button>`}</div>
    </section>`;
  overlay.classList.add('open');
}
function stuShowDirections(pk, options = {}) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  document.getElementById(pk + '-toolsDropdown')?.classList.remove('open');
  const isAct = pk.includes('Act');
  const actSec = isAct ? STU_STATE[pk]?.sections?.[STU_STATE[pk]?.currentSecIdx]?.id : null;
  const actEnglishDirections = `<div style="text-align:left;font-size:14px;line-height:1.7;color:#374151">
      <p style="margin:0 0 14px">In the passages that follow, certain words and phrases are highlighted and underlined. Most of the questions will ask you to choose the alternative to the highlighted portion that best expresses the idea, makes the statement appropriate for standard written English, or is worded most consistently with the style and tone of the passage as a whole. If you think the original version is best, choose <b>"No Change."</b> Other questions will ask about a section of the passage, or about the passage as a whole. These questions do not refer to a highlighted portion of the passage, but rather are identified by an asterisk in brackets.</p>
      <p style="margin:0">For many of the questions, you must read several sentences beyond the question to determine the answer. Be sure that you have read far enough ahead each time you choose an alternative.</p>
    </div>`;
  const actMathDirections = `<div style="text-align:left;font-size:14px;line-height:1.7;color:#374151">
      <p style="margin:0 0 14px">Solve each problem and choose the correct answer. Do not linger over problems that take too much time. Solve as many as you can; then return to the others in the time you have left for this test.</p>
      <p style="margin:0 0 14px">You are permitted to use a calculator on this test. You may use your calculator for any problems you choose, but some of the problems may best be done without using a calculator.</p>
      <p style="margin:0 0 8px;font-weight:800;color:#111827">Note: Unless otherwise stated, all of the following should be assumed.</p>
      <ol style="margin:0;padding-left:20px">
        <li>Illustrative figures are NOT necessarily drawn to scale.</li>
        <li>Geometric figures lie in a plane.</li>
        <li>The word line indicates a straight line.</li>
        <li>The word average indicates arithmetic mean.</li>
      </ol>
    </div>`;
  const actWritingDirections = `<div style="text-align:left;font-size:14px;line-height:1.7;color:#374151">
      <p style="margin:0 0 14px">This is a test of your writing skills. You will have forty (40) minutes to read the prompt, plan your response, and write an essay in English.</p>
      <p style="margin:0 0 14px">Before you begin working, read all material carefully to understand exactly what you are being asked to do. Your planning notes are not scored; only the essay response is scored.</p>
      <p style="margin:0 0 8px;font-weight:800;color:#111827">Your essay will be evaluated based on your ability to:</p>
      <ul style="margin:0;padding-left:20px">
        <li>Clearly state your own perspective and analyze the relationship between your perspective and at least one other perspective.</li>
        <li>Develop and support your ideas with reasoning and examples.</li>
        <li>Organize your ideas clearly and logically.</li>
        <li>Communicate your ideas effectively in standard written English.</li>
      </ul>
    </div>`;
  const actTestDirections = `<div style="text-align:left;font-size:14px;line-height:1.7;color:#374151">
      <p style="margin:0 0 12px">This test has four core sections plus Writing when assigned. You cannot return to a section after submitting.</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 16px;font-size:13px">
        <thead><tr style="border-bottom:2px solid #e5e7eb"><th style="text-align:left;padding:6px 12px;font-weight:600;color:#1e293b">Section</th><th style="text-align:center;padding:6px 12px;font-weight:600;color:#1e293b">Questions</th><th style="text-align:center;padding:6px 12px;font-weight:600;color:#1e293b">Time</th></tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:6px 12px">English</td><td style="text-align:center;padding:6px 12px">50*</td><td style="text-align:center;padding:6px 12px">35 min</td></tr>
          <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:6px 12px">Mathematics</td><td style="text-align:center;padding:6px 12px">45*</td><td style="text-align:center;padding:6px 12px">50 min</td></tr>
          <tr style="background:#fffbeb;border-bottom:1px solid #f1f5f9"><td colspan="3" style="padding:6px 12px;font-weight:600;color:#92400e;text-align:center">10-Minute Break</td></tr>
          <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:6px 12px">Reading</td><td style="text-align:center;padding:6px 12px">36*</td><td style="text-align:center;padding:6px 12px">40 min</td></tr>
          <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:6px 12px">Science (Optional)</td><td style="text-align:center;padding:6px 12px">40*</td><td style="text-align:center;padding:6px 12px">40 min</td></tr>
          <tr><td style="padding:6px 12px">Writing (Optional)</td><td style="text-align:center;padding:6px 12px">1 essay</td><td style="text-align:center;padding:6px 12px">40 min</td></tr>
        </tbody>
      </table>
    </div>`;
  const title = options.title || (isAct ? (actSec === 'act-eng' ? 'ACT English Directions' : actSec === 'act-math' ? 'ACT Mathematics Directions' : actSec === 'act-writing' ? 'ACT Writing Directions' : 'ACT Test Directions') : 'Digital SAT Directions');
  const body = isAct
    ? (actSec === 'act-eng' ? actEnglishDirections : actSec === 'act-math' ? actMathDirections : actSec === 'act-writing' ? actWritingDirections : actTestDirections)
    : `<div style="text-align:left;font-size:14px;line-height:1.7;color:#374151">
        <p style="margin:0 0 12px">This test has two sections, each with two modules.</p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 16px;font-size:13px">
          <thead><tr style="border-bottom:2px solid #e5e7eb"><th style="text-align:left;padding:6px 12px;font-weight:600;color:#1e293b">Module</th><th style="text-align:center;padding:6px 12px;font-weight:600;color:#1e293b">Questions</th><th style="text-align:center;padding:6px 12px;font-weight:600;color:#1e293b">Time</th></tr></thead>
          <tbody>
            <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:6px 12px">R&W Module 1</td><td style="text-align:center;padding:6px 12px">27</td><td style="text-align:center;padding:6px 12px">32 min</td></tr>
            <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:6px 12px">R&W Module 2</td><td style="text-align:center;padding:6px 12px">27</td><td style="text-align:center;padding:6px 12px">32 min</td></tr>
            <tr style="background:#fffbeb;border-bottom:1px solid #f1f5f9"><td colspan="3" style="padding:6px 12px;font-weight:600;color:#92400e;text-align:center">☕ 10-Minute Break</td></tr>
            <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:6px 12px">Math Module 1</td><td style="text-align:center;padding:6px 12px">22</td><td style="text-align:center;padding:6px 12px">35 min</td></tr>
            <tr><td style="padding:6px 12px">Math Module 2</td><td style="text-align:center;padding:6px 12px">22</td><td style="text-align:center;padding:6px 12px">35 min</td></tr>
          </tbody>
        </table>
        <div style="background:#f8fafc;border-radius:8px;padding:12px 14px;margin:0 0 8px">
          <p style="margin:0 0 6px;font-weight:600;font-size:13px;color:#1e293b">Tools Available</p>
          <ul style="margin:0;padding:0 0 0 18px;font-size:13px;color:#475569;line-height:1.6">
            <li><b>Desmos Calculator</b> — Math modules only</li>
            <li><b>Reference Sheet</b> — Math modules only</li>
            <li><b>Mark for Review</b> — Flag questions to revisit</li>
            <li><b>Highlights & Notes</b> — Highlight and add notes to passage text</li>
            <li><b>Option Eliminator</b> — Cross out wrong choices</li>
          </ul>
        </div>
      </div>`;
  const finalBody = options.includeStatement ? `<div style="text-align:left;font-size:14px;line-height:1.7;color:#374151">
      <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;margin-bottom:14px">
        <p style="margin:0 0 8px;font-weight:800;color:#111827">Examinee Statement</p>
        <p style="margin:0">Review the directions carefully. By selecting Accept, you confirm that you are ready to begin this timed section and understand that submitted sections cannot be reopened.</p>
      </div>
    </div>${body}` : body;
  const footer = options.startAction
    ? `<button class="stu-directions-close" onclick="${options.cancelAction || 'stuCloseDirections()'}">${options.secondaryLabel || 'Decline'}</button>
       <button class="stu-directions-close" style="background:#6040ca;color:#fff;border-color:#6040ca" onclick="${options.startAction}">${options.primaryLabel || 'Accept & Start'}</button>`
    : null;
  stuDirectionsPanel(title, finalBody, footer);
}

// Calculator (SAT + ACT Math)
function stuToggleCalc(pk) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  document.getElementById(pk + '-toolsDropdown')?.classList.remove('open');
  const panel = document.getElementById(pk + '-calcPanel');
  if (panel) panel.classList.toggle('open');
}

// Reference Sheet (SAT only)
function stuToggleRefSheet(pk) {
  document.getElementById(pk + 'ToolsMenu')?.classList.remove('open');
  const panel = document.getElementById(pk + '-refPanel');
  if (panel) panel.classList.toggle('open');
}

// ── Render functions for each student page ──
function renderStuGeneric() {
  stuInit('stuGen', GENERIC_SECTIONS, 'stuGenericBody', 'stuGenericFooter');
}

function renderStuAct() {
  const pk = 'stuAct';
  const allQ = stuBuildAllQuestions(ACT_SECTIONS);
  const session = getSession(currentLaunchSessionId || currentSessionId);
  const launchRow = (session?.studentRows || []).find(s => s.name === currentLaunchStudentName)
    || (session?.studentRows || []).find(s => (s.extendedTimePct || 100) > 100)
    || (session?.studentRows || [])[0]
    || null;
  const extPct = launchRow?.extendedTimePct || 100;
  STU_STATE[pk] = {
    questions: allQ, sections: ACT_SECTIONS, current: 0,
    marked: new Set(), answered: new Set(), answers: {}, eliminated: {},
    currentSecIdx: 0, lockedSecs: new Set(),
    // Extended-time accommodation: 1.0 = none, 1.2 = standard IEP,
    // 1.5 = 504, 2.0 = ELL. Drives both the per-section timer budget
    // and the header chip. The default now reads the selected monitor row
    // so the teacher's per-student Extended Time setting carries into launch.
    extMultiplier: Math.max(1.0, extPct / 100),
    extReason: launchRow?.extendedTimeReason || (extPct > 100 ? 'Monitor setting' : null),
    studentName: launchRow?.name || null,
    writingPlans: {},
    annotations: {},
    passageSnapshots: {},
    // Review mode: re-uses this player as a post-submission review surface.
    // Set via stuActEnterReview() from the report. When on, choices show
    // correct/wrong, an explanation panel is appended, the timer + tools
    // are hidden, and the bottom-nav menu uses correct/wrong/blank colors.
    reviewMode: false,
    reviewFilter: 'all',
    reviewSection: 'all'
  };
  stuRefreshActExtChip(pk);
  // A fresh launch always exits any prior review-mode state.
  const _actPage = document.getElementById('page-stu-act');
  if (_actPage) _actPage.classList.remove('review-mode');
  stuShowOverview(pk, 'act');
}

