// @ts-nocheck
// Phase-2 slice: lines 14546-16186 of original src/app.ts

// ─── Standardized Parts Editor ───────────────────────────────────────────────
// One assessment can contain official parts/modules: TCAP Subparts, SAT Modules,
// and later ACT sections / MAP stages. The teacher sees one editor surface and
// switches official parts from the left outline.
function standardizedPartNoun(session) {
  if (!session) return 'Parts';
  if (session.testType === 'tcap') return 'Subparts';
  if (session.testType === 'sat') return 'Modules';
  return 'Parts';
}
function standardizedEditorTitle(session) {
  if (!session) return 'Standardized Editor';
  if (session.testType === 'tcap') return 'TCAP Editor';
  if (session.testType === 'sat') return 'SAT Editor';
  return `${testTypeLabel(session.testType)} Editor`;
}
function standardizedEditorSubtitle(session, parts) {
  if (!session) return '';
  if (session.testType === 'tcap') {
    const subjectMeta = (DW_TCAP_CONFIG.subjects || []).find(s => s.id === session.tcapSubject) || { label:String(session.tcapSubject || '').toUpperCase() };
    return `${subjectMeta.label} · Grade ${session.tcapGrade} · ${parts.length} ${standardizedPartNoun(session)}`;
  }
  if (session.testType === 'sat') return `Digital SAT · Reading & Writing + Math · ${parts.length} ${standardizedPartNoun(session)}`;
  return `${parts.length} ${standardizedPartNoun(session)}`;
}
function getStandardizedEditorParts(session) {
  if (!session) return [];
  if (session.testType === 'tcap' && Array.isArray(session.subparts)) {
    return session.subparts.map(sp => ({ ...sp, source:'session-subpart' }));
  }
  if (session.testType === 'sat') {
    return SAT_SECTIONS.map((sec, idx) => ({
      code:`M${idx + 1}`,
      label:sec.name,
      subtitle:sec.adaptive ? 'Adaptive module' : 'Base module',
      timeLimitMinutes:sec.time,
      itemsCount:sec.questions,
      items:SAMPLE_Q[sec.id] || [],
      source:'sample-section',
      sourceId:sec.id,
    }));
  }
  return [];
}
// ─────────────────────────────────────────────────────────────────────────────
// Preview as Student — a single header button that takes the teacher straight
// from the Editor into the matching student test runner. Replaces the old
// "go to dev panel and click TS-1" flow so demo storytelling stays continuous.
// Dispatches by session.testType:
//   tcap    → page-tcap-stu (9-phase TCAP runner via tcsOpen)
//   sat/act → existing stu-sat / stu-act pages
//   else    → stu-generic
// For TCAP we wire the launch chip to this session's title + first SP timing
// so the runner header reflects the chosen Grade × Subject mock.
// ─────────────────────────────────────────────────────────────────────────────
function previewAssessmentAsStudent(sessionId, subpartCode) {
  const session = (typeof SESSION_DATA !== 'undefined' ? SESSION_DATA : []).find(s => s.id === sessionId);
  if (!session) { console.warn('[previewAsStudent] session not found:', sessionId); return; }

  if (session.testType === 'tcap' && typeof tcsOpen === 'function') {
    // Deep-link target: prefer the SP the teacher is currently editing, fall
    // back to SP1. The TCAP runner header shows session.title + per-SP timer
    // so the preview reflects the chosen Subpart blueprint.
    const sp = Array.isArray(session.subparts)
      ? session.subparts.find(s => s.code === subpartCode) || session.subparts[0]
      : null;
    if (typeof TCS_STATE !== 'undefined') {
      TCS_STATE.testName = session.title || TCS_STATE.testName;
      if (sp && sp.timeLimitMinutes) {
        TCS_STATE.partTimeMin  = sp.timeLimitMinutes;
        TCS_STATE.remainingSec = sp.timeLimitMinutes * 60;
      }
    }
    // If the runner exposes subject-pool switching, route the preview into
    // that pool so SP4 lands in editing-style items, SP1 in essay, etc. Best-
    // effort: silently no-op when the pool isn't registered.
    if (sp && typeof tcsSwitchSubject === 'function') {
      const poolKey = tcapSubpartToPoolKey(session, sp);
      if (poolKey) { try { tcsSwitchSubject(poolKey); } catch (_) {} }
    }
    tcsOpen({ phase: 'launch' });
    return;
  }

  switchRole('student', true);
  if (session.testType === 'sat')      nav('stu-sat');
  else if (session.testType === 'act') nav('stu-act');
  else                                 nav('stu-generic');
}
// Map a session+subpart pair to the runner's TCS_POOLS key. Best-guess by
// (subject × subpart code) so a teacher editing ELA SP1 lands in the Writing
// pool, SP2 in Reading, etc. Math/Science/SS only have a single pool today
// (always SP1-style); we keep the mapping forward-compatible.
function tcapSubpartToPoolKey(session, sp) {
  const subj = String(session.tcapSubject || '').toLowerCase();
  const code = String(sp.code || '').toUpperCase();
  if (subj === 'ela') {
    if (code === 'SP1') return 'ELA Writing';
    return 'ELA Reading';
  }
  if (subj === 'math') return 'Math';
  if (subj === 'science' || subj === 'sci') return 'Science';
  if (subj === 'social-studies' || subj === 'ss' || subj === 'social_studies') return 'Social Studies';
  return null;
}

function renderStandardizedPartsEditor(session) {
  // Make sure currentSubpartCode points to a real official part in this session.
  const subparts = getStandardizedEditorParts(session);
  if (!subparts.find(sp => sp.code === currentSubpartCode)) {
    currentSubpartCode = subparts[0].code;
  }
  const activeSp = subparts.find(sp => sp.code === currentSubpartCode);
  const partNoun = standardizedPartNoun(session);

  // ── Header title + subtitle context (overwrites generic header text) ──
  const titleEl = document.querySelector('#page-new-edit .ne-title');
  const subEl = document.querySelector('#page-new-edit .ne-subtitle');
  const badgeEl = document.querySelector('#page-new-edit .ne-badge');
  if (titleEl) titleEl.textContent = `${standardizedEditorTitle(session)} · ${session.title}`;
  if (subEl)   subEl.innerHTML = standardizedEditorSubtitle(session, subparts);
  if (badgeEl) badgeEl.style.display = 'none';

  // ── Header right-actions: production AssessmentEditor Header has no
  //    Edit/Preview tab pair — just an autosave icon, a single Preview-as-
  //    student button, and Assign on the right. We dropped the Edit/Preview
  //    toggle (its "preview" mode was a stub linking back to the same student
  //    runner anyway) and surface in-page mode switching via the modebar
  //    Items / Coverage tabs instead. Neutralize `.ne-mode-tabs` pill styling
  //    so the lone outline button reads as standalone.
  const tabsEl = document.getElementById('newEditTabs');
  tabsEl.style.background = 'transparent';
  tabsEl.style.padding = '0';
  tabsEl.innerHTML = `
    <button class="btn-kira-outline" onclick="previewAssessmentAsStudent('${session.id}','${currentSubpartCode}')" style="display:inline-flex;align-items:center;gap:6px" title="Launch this Subpart in the student test runner — deep-links to ${currentSubpartCode}'s first item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/></svg>
      Preview ${currentSubpartCode} as student
    </button>`;

  // ── Outline: 4 official parts. Active SP expands inline to show its items
  // with type icon + standard chip + skill (truncated). Item rows are
  // clickable to scroll the corresponding question card into view, mirroring
  // the production AssessmentEditor's section/item drill-down pattern.
  const outlineHtml = subparts.map(sp => {
    const items = Array.isArray(sp.items) ? sp.items : [];
    const isActive = sp.code === currentSubpartCode;
    const itemCount = Array.isArray(sp.items) ? sp.items.length : (sp.itemsCount || 0);
    // Per-SP health pill: aggregates blueprint completeness based on whether
    // each item has a standard mapped. Real production should diff vs the
    // official blueprint table; here we use "missing standard" as a proxy.
    const missingStdCt = items.filter(it => !it.standard).length;
    const healthPill = items.length === 0
      ? '<span class="ne-section-health" style="background:#f4f4f5;color:#71717a">empty</span>'
      : missingStdCt > 0
        ? `<span class="ne-section-health" style="background:#fffbeb;color:#92400e;border:1px solid #fde68a">⚠ ${missingStdCt} std missing</span>`
        : '<span class="ne-section-health" style="background:#dcfce7;color:#15803d;border:1px solid #bbf7d0">✓ Blueprint OK</span>';
    // Item drill-down rendered only when SP is active (collapsed by default
    // so the 4-card outline stays scannable). Each row shows type icon +
    // standard code (mono-font) + truncated skill name.
    const itemsHtml = isActive && items.length ? `
      <div class="tcap-outline-items">
        ${items.map((it, i) => {
          const ic = tcapTypeIcon(it.type || '');
          const std = it.standard || '⚠ no std';
          const stdClass = it.standard ? '' : 'missing';
          const skill = (it.skill || '—').replace(/</g, '&lt;');
          return `<div class="tcap-outline-item" onclick="event.stopPropagation();tcapJumpToCard(${i})" title="Jump to Q${it.num || (i + 1)}">
            <span class="oq-num">${it.num || (i + 1)}</span>
            <span class="oq-ic" title="${(it.type || '').replace(/"/g, '&quot;')}">${ic}</span>
            <span class="oq-std ${stdClass}">${std}</span>
            <span class="oq-skill">${skill}</span>
          </div>`;
        }).join('')}
      </div>` : '';
    return `<div class="ne-section tcap-outline-section ${isActive ? 'is-active' : ''}" style="${isActive ? 'border-color:#8b5cf6;background:#f5f3ff' : ''}" onclick="setActiveSubpart('${sp.code}');setNewEditMode('edit')">
      <div class="ne-section-head" style="cursor:pointer">
        <div style="flex:1">
          <div class="ne-section-name" style="display:flex;align-items:center;gap:8px">
            <span style="display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:20px;border-radius:6px;background:#5b21b6;color:#fff;font-size:10px;font-weight:800;letter-spacing:.4px">${sp.code}</span>
            ${sp.label}
          </div>
          <div class="ne-section-meta">${sp.timeLimitMinutes || '—'} min · ${itemCount} items</div>
        </div>
        ${healthPill}
      </div>
      ${itemsHtml}
    </div>`;
  }).join('');
  document.getElementById('newEditOutline').innerHTML = outlineHtml;

  // ── Outline header stats (override the 12 items / 3 skills hard-coded) ──
  const totalItems = subparts.reduce((sum, sp) => sum + (Array.isArray(sp.items) ? sp.items.length : (sp.itemsCount || 0)), 0);
  const totalMin = subparts.reduce((sum, sp) => sum + (sp.timeLimitMinutes || 0), 0);
  const statsEl = document.querySelector('#page-new-edit .ne-outline-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="ne-stat"><div class="num">${totalItems}</div><div class="lbl">Items</div></div>
      <div class="ne-stat"><div class="num">${subparts.length}</div><div class="lbl">${partNoun}</div></div>
      <div class="ne-stat"><div class="num">${totalMin}</div><div class="lbl">Min</div></div>
    `;
  }

  // ── Active mode dispatch ──
  // 'coverage' shows a session-level Standards Coverage view (not SP-scoped);
  // 'preview' is legacy stub kept reachable by URL/dev-panel only;
  // default 'edit' renders the SP-scoped Items list.
  if (newEditMode === 'coverage') {
    return renderStandardizedPartCoverage(session, subparts);
  }
  if (newEditMode === 'preview') {
    return renderStandardizedPartPreview(session, activeSp);
  }
  renderStandardizedPartQuestions(session, activeSp);
}

function renderStandardizedPartQuestions(session, sp) {
  const modebarEl = document.getElementById('newEditModebar');
  modebarEl.style.flexDirection = 'column';
  modebarEl.style.alignItems = 'stretch';
  modebarEl.style.gap = '6px';
  modebarEl.innerHTML = `
    <div class="ne-filter-group" style="align-items:flex-start">
      <div class="ne-filter-label">
        <div class="title">${sp.code} — ${sp.label}</div>
        <div class="sub">${sp.timeLimitMinutes || '—'} min · ${Array.isArray(sp.items) ? sp.items.length : (sp.itemsCount || 0)} items${sp.calculatorPolicy ? ' · ' + sp.calculatorPolicy : ''}</div>
      </div>
      ${tcapEditorModeTabs('items')}
    </div>`;

  // ── Question cards: reuse the production-aligned q-card chrome (same one
  //    the ACT/SAT editor uses) so TCAP items render identically to the
  //    AssessmentEditor in kira-plat-frontend (QuestionCard.tsx +
  //    MultipleChoice/EditMode.tsx). The card layout is:
  //      Header  → numbered badge · type label + standard meta · AI / sliders /
  //                score / more buttons
  //      Body    → Single/Multiple answer tabs · stem · radio choice list · Add Option
  //    Items are blueprint-locked so editing is read-only; the More menu still
  //    deletes (prototype-only).
  const items = Array.isArray(sp.items) ? sp.items : [];
  if (!items.length) {
    document.getElementById('newEditContent').innerHTML = `<div class="ne-card ne-question-card" style="text-align:center;padding:40px 24px">
      <div style="font-size:28px;margin-bottom:10px">🗑</div>
      <div style="font-size:16px;font-weight:900;color:#18181b;margin-bottom:6px">No items in ${sp.code}</div>
      <div style="font-size:12px;color:#71717a;line-height:1.55;max-width:480px;margin:0 auto">All draft items for this official part were deleted. Production can enforce blueprint minimums later; this prototype removes items immediately.</div>
    </div>`;
    return;
  }
  document.getElementById('newEditContent').innerHTML = items.map((it, idx) => renderTcapQuestionCard(it, idx, sp)).join('');
}

// ─── TCAP question card (mirrors production AssessmentEditor) ───────────────
// `q-card` chrome is shared with the ACT/Generic editor (qCardShell). Items
// here render with a static body because TCAP items are blueprint-locked
// (`locked: true`); the prototype still allows Delete via the More menu.
//
// Card layout (top → bottom):
//   ┌──────────────────────────────────────────────────────────────────────┐
//   │ [#] type-name                              [✦][⚙][pts][⋯]            │  ← head
//   │     ┌─ 📐 W.5.1 ── 🎯 skill ── ◐ Medium ── 🔒 Locked ──┐              │  ← meta chips
//   ├──────────────────────────────────────────────────────────────────────┤
//   │ stem text                                                             │  ← body
//   │ (per-type preview matching what the student sees)                     │
//   └──────────────────────────────────────────────────────────────────────┘
//
// Standard + skill chips are surfaced ON the card (not hidden in a drawer)
// because TCAP is a standards-driven test — "which standard does this item
// measure?" is the #1 question a teacher asks while scanning a blueprint.
function renderTcapQuestionCard(item, idx, sp) {
  const num = item.num || (idx + 1);
  const points = item.points || 1;
  const typeName = item.type || 'Multiple Choice';
  const t = String(typeName).toLowerCase();
  const isEssay = t.includes('essay');
  const isMulti = t.includes('multi-select') || t.includes('multiple selection') || t.includes('multi select');
  const typeIcon = tcapTypeIcon(typeName);
  // Difficulty chip color follows TN convention: easy = green, medium = amber,
  // hard = rose. Defaults to neutral if missing.
  const difficulty = item.difficulty || 'Medium';
  const diffColor = ({Easy:'#16a34a', Medium:'#d97706', Hard:'#dc2626'})[difficulty] || '#71717a';
  const diffBg    = ({Easy:'#dcfce7', Medium:'#fef3c7', Hard:'#fee2e2'})[difficulty] || '#f4f4f5';
  // Standard chip: TCAP standards (e.g. W.5.1, RL.5.1, RI.5.2, L.5.2) get
  // signature TCAP purple. Items missing a standard render an amber warning
  // chip — a real production gap that needs blueprint reconciliation.
  const standardChip = item.standard
    ? `<span class="tcap-meta-chip tcap-meta-std" title="TCAP standard alignment">📐 ${item.standard}</span>`
    : `<span class="tcap-meta-chip tcap-meta-warn" title="No TCAP standard mapped — blueprint gap">⚠ standard missing</span>`;
  const skillChip = item.skill
    ? `<span class="tcap-meta-chip tcap-meta-skill" title="Skill measured by this item">🎯 ${item.skill}</span>`
    : '';
  const metaRow = `
    <div class="tcap-card-meta">
      ${standardChip}
      ${skillChip}
      <span class="tcap-meta-chip" style="color:${diffColor};background:${diffBg};border-color:${diffBg}">◐ ${difficulty}</span>
      ${item.locked ? '<span class="tcap-meta-chip" style="color:#71717a;background:#fafafa;border-color:#e4e4e7" title="Item content is fixed by the TCAP blueprint">🔒 Blueprint-locked</span>' : ''}
    </div>`;
  const head = `
    <div class="q-card-head">
      <span class="q-card-num">${num}</span>
      <div style="display:flex;flex:1;justify-content:space-between;align-items:center;gap:8px">
        <span class="q-card-type">${typeIcon} ${typeName}</span>
        <div class="q-card-actions">
          <button class="act-btn act-btn-ghost" title="Kira AI assist" onclick="iteToast('AI assist for TCAP items coming soon','info')">${ICONS.sparkle}</button>
          <button class="act-btn act-btn-outline" title="Item properties" onclick="iteToast('Item properties drawer coming soon','info')">${ICONS.sliders}</button>
          <div class="score-input-group" title="Locked by TCAP blueprint">
            <input value="${points}" readonly style="cursor:not-allowed;color:#71717a;background:#fafafa">
            <span class="unit" style="background:#fafafa">${points > 1 ? 'pts' : 'pt'}</span>
          </div>
          <div style="position:relative;display:inline-flex;flex-shrink:0">
            <button class="act-btn act-btn-outline" title="More" onclick="event.stopPropagation();tcapToggleQMenu(this)">${ICONS.dots3}</button>
            <div class="tcap-q-menu" style="display:none;position:absolute;right:0;top:48px;background:#fff;border:1px solid #e4e4e7;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.08);min-width:160px;padding:4px;z-index:50">
              <button onclick="tcapCloseQMenus();deleteStandardizedPartItem('${sp.code}',${idx})" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#dc2626;border-radius:6px;text-align:left;font-family:inherit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  // Body dispatch: per-type renderers approximate what the student will see,
  // so a teacher scanning the blueprint can tell at a glance which items are
  // Hot Text vs Two-Part vs Inline Choice — not just "yet another MC stub".
  const body = renderTcapItemBody(item, typeName, isEssay, isMulti);
  // Note: `metaRow` (standard / skill / difficulty / lock chips) is intentionally
  // NOT rendered on the card — the outline drill-down on the left already
  // surfaces standard + skill per item, so duplicating it on the card creates
  // visual noise. Restore by re-inserting `${metaRow}` between head and body
  // if a future review wants the per-card chip strip back.
  return `<div class="q-card selected" style="cursor:default;margin-bottom:14px">
    <div class="q-card-inner">
      ${head}
      <div class="q-card-body">${body}</div>
    </div>
  </div>`;
}

// Map item.type strings (as written in SESSION_DATA) to a single emoji icon
// surfaced on the card head. Keep the map small; default to the MC icon.
function tcapTypeIcon(typeName) {
  const t = String(typeName).toLowerCase();
  if (t.includes('essay'))                         return '📄';
  if (t.includes('hot text'))                      return '🖍️';
  if (t.includes('two-part') || t.includes('two part') || t.includes('evidence')) return '🧬';
  if (t.includes('inline'))                        return '🔽';
  if (t.includes('editing'))                       return '✍️';
  if (t.includes('multi-select') || t.includes('multi select') || t.includes('multiple select')) return '☑';
  if (t.includes('grid') || t.includes('numeric')) return '🔢';
  if (t.includes('matrix') || t.includes('match')) return '📊';
  if (t.includes('hot spot') || t.includes('hotspot')) return '🎯';
  if (t.includes('graph'))                         return '📈';
  if (t.includes('equation'))                      return '∑';
  if (t.includes('audio') || t.includes('listen')) return '🎧';
  if (t.includes('drag') || t.includes('drop'))    return '🧲';
  if (t.includes('true') || t.includes('false'))   return '⚖';
  if (t.includes('fill') || t.includes('blank'))   return '✏️';
  return '📝';
}

// Per-type body dispatcher. Each renderer stays ≤30 LOC and approximates the
// student-facing shape (a Hot Text body shows highlighted-sentence chips, a
// Two-Part body shows Part A + Part B stems, etc.) so teachers reviewing a
// 21-item blueprint can scan composition without launching student preview.
function renderTcapItemBody(item, typeName, isEssay, isMulti) {
  const t = String(typeName).toLowerCase();
  if (isEssay)                                       return renderTcapEssayBody(item);
  if (t.includes('hot text'))                        return renderTcapHotTextBody(item);
  if (t.includes('two-part') || t.includes('two part') || t.includes('evidence')) return renderTcapTwoPartBody(item);
  if (t.includes('inline'))                          return renderTcapInlineBody(item);
  if (t.includes('editing'))                         return renderTcapEditingBody(item);
  if (t.includes('grid') || t.includes('numeric'))   return renderTcapGridInBody(item);
  if (t.includes('matrix') || t.includes('match'))   return renderTcapMatrixBody(item);
  if (t.includes('hot spot') || t.includes('hotspot')) return renderTcapHotspotBody(item);
  if (t.includes('graph'))                           return renderTcapGraphBody(item);
  if (t.includes('true') || t.includes('false'))     return renderTcapTfBody(item);
  if (t.includes('fill') || t.includes('blank'))     return renderTcapFibBody(item);
  return renderTcapChoiceBody(item, isMulti, typeName);
}
function renderTcapChoiceBody(item, isMulti, typeName) {
  const stem = `Sample stem for <b>${(item.skill || item.type || 'this item').replace(/</g,'&lt;')}</b>.`;
  const opts = ['Option A — sample stem','Option B — sample stem','Option C — sample stem','Option D — sample stem'];
  const correctIdx = 0;
  const t = String(typeName).toLowerCase();
  const placeholderTypes = { 'hot text':'Hot-text evidence preview', 'inline choice':'Inline-choice cloze preview', 'two-part':'Two-Part preview' };
  const placeholderHint = Object.keys(placeholderTypes).find(k => t.includes(k));
  return `
    <div class="q-mode-tabs" role="tablist" aria-label="Answer mode" style="margin-bottom:10px">
      <button class="q-mode-tab ${!isMulti?'active':''}" role="tab" aria-selected="${!isMulti}" onclick="iteToast('Locked by TCAP blueprint','info')"><span class="dot"></span>Single Answer</button>
      <button class="q-mode-tab ${isMulti?'active':''}" role="tab" aria-selected="${isMulti}" onclick="iteToast('Locked by TCAP blueprint','info')"><span class="sq"></span>Multiple Answers</button>
    </div>
    <textarea class="q-stem-edit" readonly>${stem.replace(/<[^>]+>/g,'')}</textarea>
    ${placeholderHint ? `<div style="margin:4px 0 10px;font-size:11px;color:#7c3aed;font-weight:600;text-transform:uppercase;letter-spacing:.4px">${placeholderTypes[placeholderHint]}</div>` : ''}
    <ul class="choices">
      ${opts.map((c, i) => {
        const isCorrect = isMulti ? (i === 0 || i === 2) : (i === correctIdx);
        return `<li class="choice${isCorrect ? ' correct' : ''}">
          <span class="letter ce-letter ${isMulti?'sq':''}" title="Locked by TCAP blueprint">${isMulti ? (isCorrect?'✓':'') : String.fromCharCode(65+i)}</span>
          <span style="flex:1;font-size:13px;color:#18181b;line-height:1.5;padding:2px 4px">${c}</span>
        </li>`;
      }).join('')}
    </ul>
    <div style="display:flex;justify-content:flex-end;margin-top:10px">
      <button class="q-add-opt-btn" onclick="iteToast('Locked by TCAP blueprint','info')">${ICONS.plus} Add Option</button>
    </div>
  `;
}
function renderTcapEssayBody(item) {
  const promptText = `Sample writing prompt for <b>${(item.skill || 'this essay item').replace(/</g,'&lt;')}</b>. Students compose a constructed response below.`;
  return `
    <textarea class="q-stem-edit" readonly>${promptText.replace(/<[^>]+>/g,'')}</textarea>
    <div style="margin-top:8px;border:1px dashed #d4d4d8;border-radius:8px;background:#fafafa;padding:14px 16px;color:#71717a;font-size:13px;line-height:1.6;font-style:italic">Student response area · word count + rubric appear during testing</div>
    <div style="margin-top:10px;display:flex;align-items:center;gap:8px;font-size:11px;color:#71717a">
      <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;background:#f4f4f5;border:1px solid #e4e4e7;font-weight:600">Human review only</span>
      <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;background:#f4f4f5;border:1px solid #e4e4e7;font-weight:600">Rubric · TDOE writing</span>
    </div>
  `;
}
// ─── TCAP per-type body previews ────────────────────────────────────────────
// Each renderer is a thin static approximation of what the student sees in
// the test runner — enough fidelity that a teacher can recognize Hot Text vs
// Two-Part vs Inline Choice on the editor card without launching the runner.
// All previews share `.tcap-body-passage` for serif passage chrome.
function _tcapStem(item) {
  return `Sample stem for <b>${(item.skill || item.type || 'this item').replace(/</g,'&lt;')}</b>.`;
}
function renderTcapHotTextBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>Click the sentence(s) that best support the central idea of the passage.</textarea>
    <div class="tcap-body-passage">
      <span class="ht-sent">Many cities have grown rapidly in recent decades.</span>
      <span class="ht-sent is-correct">This rapid growth has placed serious strain on water and electrical infrastructure.</span>
      <span class="ht-sent">Some local governments are responding with new conservation policies.</span>
      <span class="ht-sent is-correct">Engineers are also developing more efficient grid technologies.</span>
    </div>
    <div style="margin-top:8px;font-size:11px;color:#71717a">Student selects sentences directly in the passage · auto-graded by exact-match · 2 correct sentences expected</div>`;
}
function renderTcapTwoPartBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>${_tcapStem(item).replace(/<[^>]+>/g,'')}</textarea>
    <div class="tcap-body-twopart">
      <div class="pt-card">
        <span class="pt-label">Part A · Single answer</span>
        <div class="pt-stem">What is the central idea of the passage? <span style="color:#71717a">(MC, 1 correct)</span></div>
        <ul class="choices">
          <li><span style="display:inline-block;width:18px;color:#16a34a">✓</span><b>A</b> — Sample correct answer</li>
          <li><span style="display:inline-block;width:18px"></span>B — Distractor</li>
          <li><span style="display:inline-block;width:18px"></span>C — Distractor</li>
        </ul>
      </div>
      <div class="pt-card">
        <span class="pt-label">Part B · Evidence-based · Multi-select</span>
        <div class="pt-stem">Which two sentences from the passage support your answer to Part A?</div>
        <ul class="choices">
          <li><span style="display:inline-block;width:18px;color:#16a34a">✓</span>"Sentence 1 from passage…"</li>
          <li><span style="display:inline-block;width:18px;color:#16a34a">✓</span>"Sentence 2 from passage…"</li>
          <li><span style="display:inline-block;width:18px"></span>"Distractor sentence…"</li>
        </ul>
      </div>
    </div>
    <div style="margin-top:8px;font-size:11px;color:#71717a">Both parts must be correct to earn full credit (auto-graded as a unit)</div>`;
}
function renderTcapInlineBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>Choose the correct word for each blank to complete the paragraph.</textarea>
    <div class="tcap-body-passage">
      The dog <span class="inline-pill">barked</span> when the door opened, and the cat <span class="inline-pill">ran</span> away in surprise. Then the children <span class="inline-pill">laughed</span> and chased after them.
    </div>
    <div style="margin-top:8px;font-size:11px;color:#71717a">3 inline dropdowns · per-blank scoring · auto-graded</div>`;
}
function renderTcapEditingBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>For each underlined and numbered phrase, decide whether it should be revised. Choose NO CHANGE if the original is best.</textarea>
    <div class="tcap-body-passage">
      My grandmother lived on a small farm, and every July my cousins and I <span class="editing-span"><span class="editing-num">1</span>would travel</span> to visit her. She kept chickens and a vegetable garden <span class="editing-span"><span class="editing-num">2</span>who</span> stretched almost to the creek. By the time we left, <span class="editing-span"><span class="editing-num">3</span>each of us never</span> wanted to go home.
    </div>
    <div style="margin-top:8px;font-size:11px;color:#71717a">Each phrase opens a dropdown with NO CHANGE + 3 alternatives · per-edit auto-grading</div>`;
}
function renderTcapGridInBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>${_tcapStem(item).replace(/<[^>]+>/g,'')} Enter your numeric answer.</textarea>
    <dl class="tcap-body-grid">
      <dt>Answer</dt><dd><b>5</b> · tolerance ±0.01</dd>
      <dt>Equivalent forms</dt><dd>5/1 · 5.0 · 5.00</dd>
      <dt>Calculator</dt><dd>${item.calculatorPolicy && /allowed/i.test(item.calculatorPolicy) ? 'Allowed' : 'Disabled'}</dd>
    </dl>
    <div style="margin-top:8px;font-size:11px;color:#71717a">Student types into a 4-column bubble grid · auto-graded by numeric tolerance</div>`;
}
function renderTcapMatrixBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>${_tcapStem(item).replace(/<[^>]+>/g,'')} Mark each statement as True, False, or Not Stated.</textarea>
    <div class="tcap-body-matrix">
      <table>
        <thead><tr><th>Statement</th><th>True</th><th>False</th><th>N/S</th></tr></thead>
        <tbody>
          <tr><td>Statement 1 (sample)</td><td class="cell-circ"><span class="checked"></span></td><td class="cell-circ"><span></span></td><td class="cell-circ"><span></span></td></tr>
          <tr><td>Statement 2 (sample)</td><td class="cell-circ"><span></span></td><td class="cell-circ"><span class="checked"></span></td><td class="cell-circ"><span></span></td></tr>
          <tr><td>Statement 3 (sample)</td><td class="cell-circ"><span></span></td><td class="cell-circ"><span></span></td><td class="cell-circ"><span class="checked"></span></td></tr>
        </tbody>
      </table>
    </div>
    <div style="margin-top:8px;font-size:11px;color:#71717a">Per-row scoring · partial credit allowed</div>`;
}
function renderTcapHotspotBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>${_tcapStem(item).replace(/<[^>]+>/g,'')} Click the correct region in the diagram.</textarea>
    <div class="tcap-body-hotspot">
      <div class="img-stub">🖼</div>
      <div style="font-size:12px;color:#52525b;line-height:1.65">
        <div style="font-weight:700;color:#27272a;margin-bottom:4px">Hot Spot regions</div>
        <div>1 correct region · rectangular hit area · max 1 selection</div>
        <div style="color:#7c3aed;margin-top:4px">Image and region overlays auto-graded by region match</div>
      </div>
    </div>`;
}
function renderTcapGraphBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>${_tcapStem(item).replace(/<[^>]+>/g,'')} Plot the line on the coordinate plane.</textarea>
    <div class="tcap-body-graph">
      <div class="grid-svg"></div>
      <div class="legend">
        <div style="font-weight:700;color:#27272a;margin-bottom:4px">Graphing answer</div>
        <div>2 points required: <code>(0, 1)</code> and <code>(2, 3)</code> — slope 1</div>
        <div style="color:#71717a;margin-top:4px">Coordinate match · ±0.25 tolerance · snap-to-grid on</div>
      </div>
    </div>`;
}
function renderTcapTfBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>${_tcapStem(item).replace(/<[^>]+>/g,'')} Decide whether the statement is true or false.</textarea>
    <div class="tcap-body-tf">
      <div class="tf-btn"><span class="ic">✓</span>True</div>
      <div class="tf-btn"><span class="ic">✗</span>False</div>
    </div>
    <div style="margin-top:8px;font-size:11px;color:#71717a">Binary MC variant · single-select · auto-graded</div>`;
}
function renderTcapFibBody(item) {
  return `
    <textarea class="q-stem-edit" readonly>Type your answer in each blank.</textarea>
    <div class="tcap-body-fib">
      The capital of Tennessee is <span class="blank-pill">Nashville</span>. The Mississippi River flows past the city of <span class="blank-pill">Memphis</span>.
    </div>
    <div style="margin-top:8px;font-size:11px;color:#71717a">2 blanks · auto-graded with case-insensitive synonym match</div>`;
}
// Scroll a specific question card into view from the outline drill-down.
// Cards aren't given individual IDs by the renderer (they're stamped from
// SESSION_DATA item arrays), so we scope by index within the active SP's
// content area. Adds a brief highlight pulse via .is-jumped.
function tcapJumpToCard(idx) {
  const content = document.getElementById('newEditContent');
  if (!content) return;
  const cards = content.querySelectorAll('.q-card');
  const card = cards[idx];
  if (!card) return;
  card.scrollIntoView({behavior: 'smooth', block: 'center'});
  card.classList.add('tcap-jumped');
  setTimeout(() => card.classList.remove('tcap-jumped'), 1200);
}
function tcapToggleQMenu(btn) {
  const menu = btn.parentElement.querySelector('.tcap-q-menu');
  const open = menu.style.display === 'block';
  tcapCloseQMenus();
  if (!open) menu.style.display = 'block';
}
function tcapCloseQMenus() {
  document.querySelectorAll('.tcap-q-menu').forEach(m => m.style.display = 'none');
}
document.addEventListener('click', () => tcapCloseQMenus());

function deleteStandardizedPartItem(partCode, itemIdx) {
  const session = SESSION_DATA.find(s => s.id === currentSessionId);
  const part = getStandardizedEditorParts(session).find(p => p.code === partCode);
  if (!part || !Array.isArray(part.items) || itemIdx < 0 || itemIdx >= part.items.length) return;
  part.items.splice(itemIdx, 1);
  part.items.forEach((item, idx) => { item.num = idx + 1; });
  if (part.source === 'session-subpart') part.itemsCount = part.items.length;
  currentSubpartCode = partCode;
  renderNewEdit();
  iteToast(`Deleted item from ${partCode}`, 'ok');
}

// Modebar mode-tabs for TCAP editor. Lives inline in the modebar (right of
// the SP context) so the teacher's eye doesn't have to travel to the page
// header to swap views. Two modes: per-SP Items (default) and Standards
// Coverage (assessment-wide, not SP-scoped).
function tcapEditorModeTabs(active) {
  const mk = (id, label, icon) => `
    <button class="tcap-mode-tab ${active===id?'is-active':''}" onclick="setNewEditMode('${id==='items'?'edit':'coverage'}')">
      <span class="tcap-mode-ic">${icon}</span>${label}
    </button>`;
  return `
    <div class="tcap-mode-tabs">
      ${mk('items', 'Items', '📝')}
      ${mk('coverage', 'Standards Coverage', '📐')}
    </div>`;
}

// ─── Standards Coverage view ───────────────────────────────────────────────
// Assessment-wide (NOT SP-scoped). TCAP is a blueprint-driven test, so the
// most important meta-question is "across all 4 SP, do the 21 items cover
// the standards the official blueprint requires — and how many items per
// standard?" This view answers that:
//   1. Standards Heatmap   — standards × SP, cells colored by item count
//   2. Per-SP Composition  — item-type breakdown per SP (sparkline-style)
//   3. Blueprint vs Actual — official requirement vs what this assessment has,
//                            with gap callouts for missing/over-represented
//   4. Item Inventory      — flat list of all items grouped by standard
function renderStandardizedPartCoverage(session, subparts) {
  const modebarEl = document.getElementById('newEditModebar');
  modebarEl.style.flexDirection = 'column';
  modebarEl.style.alignItems = 'stretch';
  modebarEl.style.gap = '6px';
  // All items across all SPs, normalized so each carries its SP code for
  // grouping and heatmap color.
  const allItems = subparts.flatMap(sp => (sp.items || []).map(it => ({...it, _sp: sp.code, _spLabel: sp.label})));
  const totalItems = allItems.length;
  const totalPoints = allItems.reduce((sum, it) => sum + (it.points || 0), 0);
  const standards = Array.from(new Set(allItems.map(it => it.standard).filter(Boolean))).sort();
  const missingStd = allItems.filter(it => !it.standard).length;
  // Standards-by-SP heatmap: each cell = how many items in that SP measure
  // that standard. Color ramps purple by count (0=empty, 1=light, 2=mid, 3+=dark).
  const heatmap = standards.map(std => {
    const row = subparts.map(sp => (sp.items || []).filter(it => it.standard === std).length);
    const total = row.reduce((s, n) => s + n, 0);
    return {std, row, total};
  });
  modebarEl.innerHTML = `
    <div class="ne-filter-group" style="align-items:flex-start">
      <div class="ne-filter-label">
        <div class="title">Standards Coverage</div>
        <div class="sub">${standards.length} unique standard${standards.length===1?'':'s'} across ${totalItems} items / ${totalPoints} pts. Coverage is read-only — TCAP blueprint is fixed by TDOE.</div>
      </div>
      ${tcapEditorModeTabs('coverage')}
    </div>
    ${missingStd ? `<div class="ne-skill-alert" style="background:#fffbeb;border-color:#fde68a;color:#92400e">
      <div>
        <div class="main">⚠ ${missingStd} item${missingStd===1?'':'s'} missing a standard</div>
        <div class="sub">These items can't be reported to the TN state diagnostic and won't appear in standards heatmaps. Contact the blueprint owner.</div>
      </div>
    </div>` : ''}`;

  // ── Per-SP composition: type-mix breakdown per SP ──
  const compositionCards = subparts.map(sp => {
    const items = sp.items || [];
    const ct = items.length;
    const typeCounts = items.reduce((acc, it) => {
      const k = String(it.type || 'Other');
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const stdSet = Array.from(new Set(items.map(it => it.standard).filter(Boolean)));
    const totalPts = items.reduce((s, it) => s + (it.points || 0), 0);
    const typeBars = sortedTypes.map(([type, n]) => {
      const pct = ct ? Math.round((n / ct) * 100) : 0;
      const ic = tcapTypeIcon(type);
      return `<div class="cv-comp-row">
        <span class="cv-comp-label">${ic} ${type}</span>
        <div class="cv-comp-bar"><div class="cv-comp-fill" style="width:${pct}%"></div></div>
        <span class="cv-comp-num">${n}</span>
      </div>`;
    }).join('');
    return `<div class="cv-card">
      <div class="cv-card-head">
        <div>
          <span class="cv-sp-tag">${sp.code}</span>
          <span class="cv-sp-name">${sp.label}</span>
        </div>
        <div class="cv-card-stats">${ct} items · ${totalPts} pts · ${stdSet.length} std</div>
      </div>
      <div class="cv-comp-list">${typeBars || '<div style="color:#a1a1aa;font-size:11px;text-align:center;padding:12px">No items</div>'}</div>
    </div>`;
  }).join('');

  // ── Heatmap: standards × SP grid ──
  const heatHead = `<th class="hm-corner">Standard</th>${subparts.map(sp => `<th>${sp.code}</th>`).join('')}<th class="hm-total">Total</th>`;
  const heatRows = heatmap.map(({std, row, total}) => {
    const cells = row.map((n, i) => {
      const cls = n === 0 ? 'hm-empty' : n === 1 ? 'hm-low' : n === 2 ? 'hm-mid' : 'hm-high';
      const sp = subparts[i];
      return `<td class="hm-cell ${cls}" title="${std} × ${sp.code} = ${n} item${n===1?'':'s'}">${n || ''}</td>`;
    }).join('');
    return `<tr>
      <td class="hm-std">${std}</td>
      ${cells}
      <td class="hm-total"><b>${total}</b></td>
    </tr>`;
  }).join('');
  const heatmapCard = `<div class="cv-card cv-heatmap-card">
    <div class="cv-card-head">
      <div>
        <div class="cv-card-title">Standards × Subpart Heatmap</div>
        <div class="cv-card-sub">How many items in each (Subpart × Standard) cell. Darker purple = more items.</div>
      </div>
      <div class="cv-card-legend">
        <span class="hm-swatch hm-empty"></span> 0
        <span class="hm-swatch hm-low"></span> 1
        <span class="hm-swatch hm-mid"></span> 2
        <span class="hm-swatch hm-high"></span> 3+
      </div>
    </div>
    <div class="cv-heatmap-scroll">
      <table class="cv-heatmap"><thead><tr>${heatHead}</tr></thead><tbody>${heatRows || `<tr><td colspan="${subparts.length+2}" style="padding:24px;text-align:center;color:#a1a1aa;font-size:12px">No standards mapped yet.</td></tr>`}</tbody></table>
    </div>
  </div>`;

  // ── Blueprint vs Actual ──
  // The official TCAP blueprint isn't fully wired into SESSION_DATA; we
  // demo with a representative subset for ELA G5 and show "—" otherwise.
  // Real production would sync against tcap_blueprints API.
  const blueprintRows = tcapBlueprintRowsFor(session, allItems);
  const blueprintCard = `<div class="cv-card">
    <div class="cv-card-head">
      <div>
        <div class="cv-card-title">Blueprint vs Actual</div>
        <div class="cv-card-sub">${blueprintRows.length ? "Official TDOE blueprint requirement compared to this assessment's composition." : 'Blueprint reference not yet wired for this subject — coming with V2 blueprints API.'}</div>
      </div>
    </div>
    <div class="cv-bp-list">
      ${blueprintRows.length ? blueprintRows.map(r => `<div class="cv-bp-row ${r.kind}">
        <div class="cv-bp-name">${r.name}</div>
        <div class="cv-bp-bar"><div class="cv-bp-fill ${r.kind}" style="width:${r.pct}%"></div></div>
        <div class="cv-bp-stat">${r.actualCount} / ${r.requiredCount} items</div>
        <div class="cv-bp-flag">${r.label}</div>
      </div>`).join('') : '<div style="color:#a1a1aa;font-size:11.5px;text-align:center;padding:24px">No blueprint reference attached.</div>'}
    </div>
  </div>`;

  // ── Item inventory grouped by standard ──
  const byStd = standards.map(std => ({
    std,
    items: allItems.filter(it => it.standard === std),
  }));
  const inventoryCard = `<div class="cv-card cv-inventory-card">
    <div class="cv-card-head">
      <div>
        <div class="cv-card-title">Items grouped by standard</div>
        <div class="cv-card-sub">Quick scan of every item assigned to each standard. Click an item to jump to its question card in the editor.</div>
      </div>
    </div>
    <div class="cv-inv-list">
      ${byStd.map(({std, items}) => `<div class="cv-inv-group">
        <div class="cv-inv-std">${std} <span class="cv-inv-count">${items.length} item${items.length===1?'':'s'}</span></div>
        <div class="cv-inv-items">
          ${items.map(it => {
            const ic = tcapTypeIcon(it.type || '');
            return `<div class="cv-inv-item" onclick="setActiveSubpart('${it._sp}');renderNewEdit();setTimeout(()=>tcapJumpToCard(${(subparts.find(s=>s.code===it._sp).items || []).indexOf(it)}),120)">
              <span class="oq-num" style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:5px;background:#5b21b6;color:#fff;font-size:10px;font-weight:800;flex-shrink:0">${it.num}</span>
              <span style="font-size:11px;font-weight:700;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;padding:1px 7px;border-radius:4px;flex-shrink:0">${it._sp}</span>
              <span style="font-size:13px;flex-shrink:0">${ic}</span>
              <span style="flex:1;font-size:12px;color:#52525b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${(it.skill || it.type || '').replace(/</g,'&lt;')}</span>
              <span style="font-size:11px;color:#71717a;font-weight:600;flex-shrink:0">${it.points} pt${it.points===1?'':'s'}</span>
            </div>`;
          }).join('')}
        </div>
      </div>`).join('')}
    </div>
  </div>`;

  document.getElementById('newEditContent').innerHTML = `
    <div class="cv-grid">
      ${heatmapCard}
      ${blueprintCard}
      <div class="cv-grid-row-2">
        ${compositionCards}
      </div>
      ${inventoryCard}
    </div>`;
}

// Lookup the (mock) official TDOE blueprint requirement per subject. We only
// have the ELA G5 blueprint stubbed; other subjects return [] and the card
// renders the "blueprint reference not wired" state. Production should pull
// this from a tcap_blueprints registry keyed by subject × grade.
function tcapBlueprintRowsFor(session, allItems) {
  const subj = String(session.tcapSubject || '').toLowerCase();
  const grade = session.tcapGrade;
  // ELA G5 representative blueprint subset
  if (subj === 'ela' && grade === 5) {
    const bp = [
      {match:s=>/^RL\.5\./i.test(s||''),  name:'Reading: Literature (RL.5.x)',          required:8},
      {match:s=>/^RI\.5\./i.test(s||''),  name:'Reading: Informational Text (RI.5.x)',  required:6},
      {match:s=>/^L\.5\./i.test(s||''),   name:'Language Conventions (L.5.x)',           required:6},
      {match:s=>/^W\.5\./i.test(s||''),   name:'Writing (W.5.x)',                        required:1},
    ];
    return bp.map(b => {
      const actualCount = allItems.filter(it => b.match(it.standard)).length;
      const pct = b.required ? Math.min(100, Math.round((actualCount / b.required) * 100)) : 0;
      let kind = 'ok', label = '✓ Met';
      if (actualCount < b.required) { kind = 'short'; label = `Short ${b.required - actualCount}`; }
      else if (actualCount > b.required) { kind = 'over'; label = `Over +${actualCount - b.required}`; }
      return {name:b.name, requiredCount:b.required, actualCount, pct, kind, label};
    });
  }
  // Math G5 representative subset
  if (subj === 'math' && grade === 5) {
    const bp = [
      {match:s=>/^5\.OA\./i.test(s||''),  name:'Operations & Algebraic Thinking (5.OA.x)', required:5},
      {match:s=>/^5\.NBT\./i.test(s||''), name:'Number & Operations in Base 10 (5.NBT.x)', required:6},
      {match:s=>/^5\.NF\./i.test(s||''),  name:'Number & Operations: Fractions (5.NF.x)',  required:5},
      {match:s=>/^5\.MD\./i.test(s||''),  name:'Measurement & Data (5.MD.x)',              required:3},
      {match:s=>/^5\.G\./i.test(s||''),   name:'Geometry (5.G.x)',                         required:2},
    ];
    return bp.map(b => {
      const actualCount = allItems.filter(it => b.match(it.standard)).length;
      const pct = b.required ? Math.min(100, Math.round((actualCount / b.required) * 100)) : 0;
      let kind = 'ok', label = '✓ Met';
      if (actualCount < b.required) { kind = 'short'; label = `Short ${b.required - actualCount}`; }
      else if (actualCount > b.required) { kind = 'over'; label = `Over +${actualCount - b.required}`; }
      return {name:b.name, requiredCount:b.required, actualCount, pct, kind, label};
    });
  }
  return [];
}

function renderStandardizedPartPreview(session, sp) {
  document.getElementById('newEditModebar').innerHTML = `
    <div class="ne-filter-group">
      <div class="ne-filter-label">
        <div class="title">Preview ${sp.code} — ${sp.label}</div>
        <div class="sub">Student-facing preview · ${sp.timeLimitMinutes || '—'} min, ${sp.calculatorPolicy || 'N/A'}</div>
      </div>
      <button class="btn-kira-default" onclick="openStudentLaunch('${session.id}', true)">▶ Open student preview</button>
    </div>`;
  document.getElementById('newEditContent').innerHTML = `<div class="ne-card ne-question-card">
    <div class="ne-question-head">
      <div class="ne-question-title">
        <div class="num">▶</div>
        <div>
          <div class="type">Student-facing TCAP shell</div>
          <div class="meta">Open the student preview to walk through the full ${session.title}.</div>
        </div>
      </div>
    </div>
    <div class="ne-question-text">
      Click <b>Open student preview</b> above to enter the TCAP test shell. The preview honors the same lock-down rules as the live test (per-SP timer, calculator policy, optional break).
    </div>
  </div>`;
}
function renderNewEditOutline() {
  document.getElementById('newEditOutline').innerHTML = NEW_EDIT_SECTIONS.map(sec => {
    const items = NEW_EDIT_ITEMS.filter(i => i.section === sec.id);
    return `<div class="ne-section">
      <div class="ne-section-head">
        <div><div class="ne-section-name">${sec.name}</div><div class="ne-section-meta">${sec.meta}</div></div>
        <span class="ne-section-health">${sec.health}</span>
      </div>
      ${items.map(item => `<div class="ne-outline-q ${item.id===2?'active':''}">
        <div class="ne-q-num">${item.id}</div>
        <div class="ne-q-lines"><div class="ne-q-main">${item.skill}</div><div class="ne-q-sub">${item.standard} · ${item.type}</div></div>
        <span class="ne-q-status ${item.status === 'warn' ? 'warn' : item.status === 'ai' ? 'ai' : ''}"></span>
      </div>`).join('')}
    </div>`;
  }).join('');
}
function renderNewEditContent() {
  if (newEditMode === 'coverage') return renderNewCoverage();
  if (newEditMode === 'tagging') return renderNewTaggingReview();
  if (newEditMode === 'preview') return renderNewPreview();
  return renderNewEditQuestions();
}
function renderNewEditQuestions() {
  const skillCheckCount = NEW_EDIT_ITEMS.filter(i => i.status !== 'ok').length;
  document.getElementById('newEditModebar').innerHTML = `
    <div class="ne-filter-group">
      <div class="ne-filter-label">
        <div class="title">Edit questions</div>
        <div class="sub">Edit first. Skill checks are optional and only appear when needed.</div>
      </div>
      <div class="ne-skill-alert">
        <div>
          <div class="main">${skillCheckCount} skills may need review</div>
          <div class="sub">You can assign anyway. Review only if analytics/practice accuracy matters.</div>
        </div>
        <button class="btn-kira-outline" onclick="setNewEditMode('tagging')">Review</button>
      </div>
    </div>
    <div class="ne-filter-row">
      <button class="btn-kira-outline" onclick="setNewEditMode('coverage')">Assessment settings</button>
      <button class="btn-kira-default">Suggest skills</button>
    </div>`;
  document.getElementById('newEditContent').innerHTML = NEW_EDIT_ITEMS.slice(0,4).map(item => `
    <article class="ne-card ne-question-card">
      <div class="ne-question-head">
        <div class="ne-question-title">
          <div class="num">${item.id}</div>
          <div><div class="type">${item.type}</div><div class="meta">${item.standard} · ${item.confidence} confidence</div></div>
        </div>
        <button class="ip-small-action">More</button>
      </div>
      <div class="ne-question-text">${item.text}</div>
      <ul class="ne-choice-list">${item.choices.map((c,i) => `<li><span class="letter">${String.fromCharCode(65+i)}</span><span>${c}</span></li>`).join('')}</ul>
      <div class="ne-skill-line">
        <div class="copy">
          <span>Skill</span>
          <span class="ne-chip skill">${item.skill}</span>
          <span class="ne-chip ${item.status === 'ok' ? 'ok' : item.status === 'warn' ? 'review' : 'auto'}">${item.review}</span>
        </div>
        <button class="ip-small-action" onclick="setNewActiveReviewItem(${item.id});setNewEditMode('tagging')">Change</button>
      </div>
    </article>`).join('');
}
function renderNewTaggingReview() {
  const filteredItems = NEW_EDIT_ITEMS.filter(item => item.status !== 'ok');
  if (!filteredItems.some(item => item.id === newActiveReviewItemId) && filteredItems[0]) newActiveReviewItemId = filteredItems[0].id;
  const activeItem = NEW_EDIT_ITEMS.find(item => item.id === newActiveReviewItemId) || filteredItems[0] || NEW_EDIT_ITEMS[0];
  document.getElementById('newEditModebar').innerHTML = `
    <div class="ne-filter-group">
      <div class="ne-filter-label">
        <div class="title">Review Skills</div>
        <div class="sub">Optional check for questions where AI is less confident.</div>
      </div>
      <span class="ne-review-note">${filteredItems.length} questions need a look · not required before assigning</span>
    </div>
    <div class="ne-filter-row">
      <button class="btn-kira-outline" onclick="setNewEditMode('edit')">Back to edit</button>
      <button class="btn-kira-default" onclick="setNewEditMode('preview')">Continue to Preview</button>
    </div>`;
  document.getElementById('newEditContent').innerHTML = `
    <div class="ne-review-layout">
      <div class="ne-review-list">
        ${filteredItems.map(item => `<div class="ne-review-item ${item.id===newActiveReviewItemId?'active':''}" data-ne-review-item="${item.id}">
          <div class="ne-review-main">
            <div class="ne-review-title">Q${item.id}. ${item.text}</div>
            <div class="ne-review-meta">${item.type} · ${item.review} · ${item.confidence} AI confidence</div>
            <div class="ne-review-tags"><span class="ne-chip skill">${item.skill}</span><span class="ne-chip ${newTagConfidenceValue(item) < 85 ? 'review' : 'ok'}">${item.confidence}</span></div>
          </div>
          <div class="ne-confidence">${item.confidence}</div>
        </div>`).join('') || `<div class="ne-empty">No questions match this queue.</div>`}
      </div>
      ${renderNewTagInspector(activeItem, [], null)}
    </div>
    `;
}
function renderNewTagInspector(item, selectedItems, activeFilter) {
  if (!item) return `<aside class="ne-inspector"><div class="ne-empty">Select an item to review.</div></aside>`;
  const selectedCount = selectedItems.length || 1;
  const bulkMode = selectedCount > 1;
  return `<aside class="ne-inspector">
    <div class="ne-inspector-head">
      <div class="ne-inspector-kicker">${bulkMode ? 'Selected questions' : 'Skill check'}</div>
      <div class="ne-inspector-title">${bulkMode ? `${selectedCount} selected questions` : `Q${item.id}. What skill does this measure?`}</div>
      <div class="ne-inspector-sub">${bulkMode ? `Use bulk change only when the selected questions measure the same skill.` : item.text}</div>
    </div>
    <div class="ne-inspector-body">
      <div class="ne-inspector-section">
        <div class="label">AI suggested skill</div>
        <div class="ne-inspector-row"><span class="name">Suggested skill</span><span class="ne-chip skill editable" data-ne-item="${item.id}" data-ne-field="skill">${item.skill}</span></div>
        <div class="ne-inspector-row"><span class="name">Confidence</span><span class="ne-chip ${newTagConfidenceValue(item) < 85 ? 'review' : 'ok'}">${item.confidence}</span></div>
        <div class="ne-inspector-row"><span class="name">Current state</span><span class="ne-chip ${item.status === 'ok' ? 'ok' : item.status === 'warn' ? 'review' : 'auto'}">${item.review}</span></div>
      </div>
      <div class="ne-inspector-section">
        <div class="label">Why AI suggested this</div>
        <div style="font-size:12px;color:#52525b;line-height:1.55">${newAiSuggestedFix(item)} The system will use the final skill to derive standards, ACT / TCAP / SAT projections, analytics, and practice recommendations.</div>
        <div class="row" style="margin-top:10px">
          <button class="btn-kira-default" onclick="useSuggestedSkill(${item.id})">Use suggested skill</button>
          <button class="btn-kira-outline" data-ne-action="edit" data-ne-field="skill" data-ne-bulk="${bulkMode}">Change skill</button>
          <button class="btn-kira-outline" onclick="skipSuggestedSkill(${item.id})">Skip for now</button>
        </div>
      </div>
      <div class="ne-inspector-section">
        <div class="label">What stays automatic</div>
        <div style="font-size:12px;color:#52525b;line-height:1.55">Teachers do not need to manage ACT native categories, TCAP projections, SAT mappings, item-bank governance, or audit details here.</div>
      </div>
      ${bulkMode ? `<div class="ne-inspector-section">
        <div class="label">Bulk change</div>
        <div style="font-size:12px;color:#52525b;line-height:1.55">${selectedCount} checked questions can share one skill if they measure the same thing. This is optional.</div>
      </div>` : ''}
    </div>
    <div class="ne-inspector-actions">
      <div class="row">
        <button class="btn-kira-outline" onclick="setNewEditMode('edit')">Back to Edit Questions</button>
        <button class="btn-kira-default" onclick="setNewEditMode('preview')">Continue to Preview</button>
      </div>
    </div>
  </aside>`;
}
function renderNewCoverage() {
  document.getElementById('newEditModebar').innerHTML = `
    <div class="ne-filter-group">
      <div class="ne-filter-label">
        <div class="title">Assessment settings</div>
        <div class="sub">Optional blueprint and coverage details. Most teachers do not need this while editing questions.</div>
      </div>
      <span class="ne-review-note">General assessment · no standardized blueprint attached</span>
    </div>
    <div class="ne-filter-row"><button class="btn-kira-outline" onclick="setNewEditMode('edit')">Back to edit</button><button class="btn-kira-default">Attach blueprint</button></div>`;
  const blueprint = [
    ['Reading comprehension','6 / 8 items',75],
    ['Textual evidence','4 / 5 items',80],
    ['Vocabulary in context','2 / 4 items',50],
    ['Language conventions','5 / 6 items',83],
    ['Constructed response','3 / 5 items',60],
  ];
  document.getElementById('newEditContent').innerHTML = `
    <div class="ne-coverage-grid">
      <div class="ne-card ne-coverage-card">
        <div class="ne-coverage-title">Skill coverage</div>
        <div class="ne-coverage-sub">Coverage lives here instead of on every question card. Teachers can see whether this assessment has enough items per skill and standard before attaching any standardized blueprint.</div>
        ${blueprint.map(([name,stat,pct]) => `<div class="ne-blueprint-row">
          <div class="ne-blueprint-name">${name}</div>
          <div class="ne-blueprint-track"><div class="ne-blueprint-fill" style="width:${pct}%"></div></div>
          <div class="ne-blueprint-stat">${stat}</div>
        </div>`).join('')}
      </div>
      <div class="ne-card ne-coverage-card">
        <div class="ne-coverage-title">Recommended fixes</div>
        <div class="ne-coverage-sub">These are assembly-level gaps, not question editing tasks.</div>
        <div class="ne-gap-list">
          <div class="ne-gap-item"><div><div class="main">Language & Conventions under-covered</div><div class="sub">Add 2 items or convert existing grammar item.</div></div><span class="pill">Gap</span></div>
        <div class="ne-gap-item"><div><div class="main">Q2 skill needs a check</div><div class="sub">Improves analytics and practice routing if this assessment becomes standardized.</div></div><span class="pill">Review skill</span></div>
          <div class="ne-gap-item"><div><div class="main">Blueprint not attached</div><div class="sub">Attach ACT, TCAP, or future SAT only when this assessment uses that template.</div></div><span class="pill">Optional</span></div>
        </div>
      </div>
    </div>`;
}
function renderNewPreview() {
  document.getElementById('newEditModebar').innerHTML = `
    <div class="ne-filter-row">
      <button class="ne-filter-chip ${newPreviewMode==='student'?'active':''}" onclick="setNewPreviewMode('student')">Student View</button>
      <button class="ne-filter-chip ${newPreviewMode==='teacher'?'active':''}" onclick="setNewPreviewMode('teacher')">Teacher QA</button>
    </div>
    <div class="ne-filter-row"><button class="btn-kira-outline">Open full screen</button><button class="btn-kira-default">Ready to assign</button></div>`;
  const item = NEW_EDIT_ITEMS[1];
  document.getElementById('newEditContent').innerHTML = `
    <div class="ne-preview-wrap">
      <div class="ne-phone-preview">
        <div class="ne-preview-top"><span>Mid-Term Science Review</span><span>24:18</span></div>
        <div class="ne-preview-body">
          <div class="ne-question-title" style="margin-bottom:18px"><div class="num">2</div><div><div class="type">${item.type}</div><div class="meta">1 point</div></div></div>
          <div class="ne-question-text">${item.text}</div>
          <ul class="ne-choice-list">${item.choices.map((c,i) => `<li style="${newPreviewMode==='teacher' && i===0 ? 'border-color:#a7f3d0;background:#ecfdf5' : ''}"><span class="letter">${String.fromCharCode(65+i)}</span><span>${c}</span></li>`).join('')}</ul>
        </div>
      </div>
      <aside class="ne-qa-panel">
        <div class="ne-sec-title" style="font-size:14px;font-weight:900;margin-bottom:8px">Teacher QA checklist</div>
        <div class="ne-qa-row"><span class="label">Correct answer</span><span class="value">A</span></div>
        <div class="ne-qa-row"><span class="label">Primary skill</span><span class="value">${item.skill}</span></div>
        <div class="ne-qa-row"><span class="label">Standard</span><span class="value">${item.standard}</span></div>
        <div class="ne-qa-row"><span class="label">Blueprint</span><span class="value">Not attached</span></div>
        <div class="ne-qa-row"><span class="label">Optional check</span><span class="value" style="color:#c2410c">Skill needs review</span></div>
        <div style="margin-top:14px;display:flex;gap:8px"><button class="btn-kira-outline" onclick="setNewEditMode('tagging')">Review Skills</button><button class="btn-kira-default">Assign anyway</button></div>
      </aside>
    </div>`;
}

/** Render bottom question navigation bar with dot indicators */
function renderNavBar(elId, sections) {
  const el = document.getElementById(elId);
  if (!el) return;
  const allQs = sections.reduce((arr, s) => {
    const items = SAMPLE_Q[s.id] || [];
    return arr.concat(flattenQuestions(items));
  }, []);
  if (allQs.length === 0) { el.innerHTML = ''; return; }
  const prevIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  const nextIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  const dots = allQs.map((q, i) => {
    const st = i === 0 ? 'current' : (i < 3 ? 'answered' : (i === 4 ? 'flagged' : ''));
    return `<div class="q-nav-dot ${st}" title="Q${q.n}">${q.n}</div>`;
  }).join('');
  el.innerHTML = `<span class="nav-label">Question Nav</span>
    <div class="q-nav-dots">${dots}</div>
    <div class="nav-controls">
      <button class="nav-btn">${prevIcon} Prev</button>
      <button class="nav-btn">Next ${nextIcon}</button>
    </div>`;
}

// ═══════ MAIN PANEL: renders items (standalone Q, passage blocks) ═══════
function renderMainPanelItems(items, firstSelected, secId, editorType = 'generic') {
  let html = '';
  let isFirst = firstSelected;
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const dataAttr = secId ? ` data-main-sec="${secId}" data-main-idx="${idx}"` : '';
    if (item.type === 'RR_PASSAGE') {
      html += renderPassageBlock(item, isFirst, dataAttr, editorType);
      isFirst = false;
    } else {
      html += renderQuestionCard(item, isFirst, dataAttr, editorType);
      isFirst = false;
    }
  }
  return html;
}

/* ─────────────────────────── Shared question header (right-side) ───────────────────────────
   Every editable question — standalone (renderQuestionCard), passage-bound
   (renderPassageBlock slide), and newly-added (passageAddQ slide) — shares
   the SAME right-side action group: [AI assist] [Item Properties] [Score]
   followed optionally by [More]. Keep this contract in one place so the
   three call sites can't drift apart again. Order is fixed; do not swap.
   ──────────────────────────────────────────────────────────────────────── */
function questionHeaderActionsHtml(q, opts = {}) {
  const { hideStructureControls = false, dropdownMenu = '', slidersOpensTagging = true } = opts;
  const isActWriting = q && q.type === 'ACT_WRITING';
  const pts = (q && q.pts != null) ? q.pts : 1;
  // Sliders opens the inline Item Properties panel (skills, standards,
  // test mapping). For passage-bound slides we keep the same handler so
  // the affordance is identical across editors. Pass slidersOpensTagging:
  // false to render a no-op sliders button (rare).
  const safeDomain = (q && q.domain) ? String(q.domain).replace(/'/g, '') : '';
  const safeType   = (q && q.type)   ? String(q.type).replace(/'/g, '')   : '';
  const slidersOnclick = slidersOpensTagging
    ? `onclick="event.stopPropagation();toggleInlineTaggingPanel(this,${(q && (q.id || q.n)) || 0},'${safeDomain}','${safeType}')"`
    : '';
  // ACT scoring is per-section raw → 1–36 scaled (Composite = mean of E/M/R).
  // Surfacing a per-item "1 pt" badge in the editor would imply the teacher
  // can change weights and would suggest a fictional total — neither is true.
  // So in ACT editor (hideStructureControls), MC items render no score chip;
  // ACT Writing keeps a fixed display because the rubric max IS meaningful.
  let scoreHtml;
  if (isActWriting) {
    scoreHtml = `<div class="score-input-group fixed" title="ACT Writing: rubric max 12 (4 domains × 2 raters × 1–6, averaged)">
         <span class="score-fixed-value">${pts || 12}</span>
         <span class="unit">${(pts || 12) > 1 ? 'pts' : 'pt'}</span>
       </div>`;
  } else if (hideStructureControls) {
    scoreHtml = '';
  } else {
    scoreHtml = `<div class="score-input-group">
         <input value="${pts}" />
         <span class="unit">${pts > 1 ? 'pts' : 'pt'}</span>
       </div>`;
  }
  const moreHtml = hideStructureControls ? '' : `<div class="p-actions" style="position:relative">
    <button class="act-btn act-btn-outline" title="More" onclick="event.stopPropagation();togglePMenu(this)">${ICONS.dots3}</button>
    ${dropdownMenu}
  </div>`;
  return `<div class="q-card-actions">
    <button class="act-btn act-btn-ghost" title="AI Assist">${ICONS.sparkle}</button>
    <button class="act-btn act-btn-outline" title="Item Properties" ${slidersOnclick}>${ICONS.sliders}</button>
    ${scoreHtml}
    ${moreHtml}
  </div>`;
}

/** Render a unified passage block: passage left + ONE question at a time right, with reference highlighting */
// ⚠️ CRITICAL: bid must be GLOBALLY UNIQUE across the whole DOM, NOT just
// within one editor. The page renders all three editors (generic / act /
// sat) at the same time — only the active one is visible, the others are
// `display:none`. If we reset passageBlockCounter to 0 inside each
// renderXxxEditor, all three editors produce passage blocks named
// pb-0..pb-N with COLLIDING IDs, and `document.getElementById('pb-0')`
// returns the first match in DOM order — usually the HIDDEN copy in
// page-generic. Result: inline `onclick="passageAddQ('pb-0')"` looks
// fine but mutates the wrong (invisible) block, so the visible one
// "doesn't respond" to clicks. Same for the resize handle.
//
// Two-part fix:
//   1. Per-editor counter map (act/sat/generic each count from 0).
//   2. bid prefix includes the editor type → "pb-act-0", "pb-sat-0", etc.
// renderActEditor/renderSatEditor/renderGenericEditor still call
// `passageBlockCounter = 0` (it's harmless now because we no longer use
// that variable for the bid), but kept for backwards compat with any
// external code that might read it.
let passageBlockCounter = 0;
const _pbCounters = { generic: 0, act: 0, sat: 0 };
function renderPassageBlock(passage, firstSelected, dataAttr, editorType = 'generic') {
  const pqs = passage.questions || [];
  const hideStructureControls = isFixedActEditor(editorType);
  const passageContent = passage.fullText || passage.excerpt || '';
  const domainTag = passage.domain ? `<span style="display:inline-block;font-size:10px;font-weight:600;color:#71717a;background:#f0f0f0;padding:2px 8px;border-radius:4px;margin-left:8px">${passage.domain}</span>` : '';
  const qLabel = pqs.length === 1 ? '1 question' : `${pqs.length} questions`;
  const editorKey = (editorType in _pbCounters) ? editorType : 'generic';
  const bid = 'pb-' + editorKey + '-' + (_pbCounters[editorKey]++);
  passageBlockCounter++; // legacy: keep advancing the old counter too
  // Register bid → passage so applyHL / clearPassageRef can persist
  // edits (highlight spans + q.ref summaries) back to the source data.
  // Without this, switching sections / re-rendering wipes anchors.
  window._passageByBid = window._passageByBid || {};
  window._passageByBid[bid] = passage;

  const prevIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  const nextIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  const elimIcon = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>`;
  const locIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;

  // Build question dot nav. The "+" is rendered as the last child of
  // .pq-dots so it sits flush against the last numbered dot (no gap from
  // the right scroll arrow) and scrolls together with the rest of the row.
  // When the list overflows, the right arrow becomes the affordance to
  // reach + — that's preferable to the previous "+ outside the scroller"
  // layout, which split the visual grouping.
  // It's always available even in fixed-structure ACT view because adding
  // questions inside a passage is item-level swapping, not structural
  // editing of section count or order.
  // Show GLOBAL question numbers (q.n) in the dots so they match the
  // numbered badge on the question card. e.g. Passage III English shows
  // 31–45, not 1–15. data-idx stays local so passageGoTo still works.
  const dots = pqs.map((q, i) => `<button type="button" class="pq-dot ${i===0?'active':''}" data-idx="${i}" onclick="passageGoTo('${bid}',${i})">${q.n != null ? q.n : (i + 1)}</button>`).join('');
  // "+" lives INSIDE .pq-dots as the last child so it visually follows the
  // last numbered dot (e.g. "… 14 15 +") with no gap, and so it scrolls
  // with the rest of the row when the dot list overflows. The dashed-border
  // "add-dot" style differentiates it from the numeric dots.
  // Belt + suspenders click wiring (this button has broken too many times):
  //   • inline onclick → primary, fires synchronously on the button itself
  //   • body delegation in __addDotDelegationInit → backup, catches the
  //     click even if the inline attribute gets stripped
  //   • passageAddQ is internally debounced (100ms) so double-fire from
  //     both paths still only adds one slide.
  const addDotBtn = `<button type="button" class="pq-dot add-dot" title="Add Question" onclick="event.stopPropagation();passageAddQ('${bid}')">+</button>`;

  // Build each question slide (hidden except first)
  let slides = '';
  pqs.forEach((q, i) => {
    const typeName = TYPE_LABELS[q.type] || q.type;
    let choices = '';
    if (q.choices) {
      // Choice rendering centralized in _pqRenderChoicesSection so the
      // tab/option/add-option markup stays in sync between initial render
      // and post-toggle re-renders.
      choices = _pqRenderChoicesSection(bid, i, q);
    } else {
      choices = `<div style="background:#f4f4f5;border-radius:6px;padding:10px;font-size:12px;color:#71717a;font-style:italic">Student answer area</div>`;
    }
    // Highlight is shown ONLY in the passage panel itself (visible to the
    // teacher already). No chip in the question header — that was visual
    // duplication. q.ref still persists in data for backend / student-side
    // jump behavior; toolbar button + floating popup handle apply/remove.
    const refHint = '';
    const passageDropdown = hideStructureControls ? '' : `<div class="p-menu">
      <button onclick="duplicatePassageQ('${bid}',${i})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Duplicate</button>
      <button class="danger" onclick="deletePassageQ('${bid}',${i})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> Delete</button>
    </div>`;
    slides += `<div class="pq-slide" data-idx="${i}" style="${i>0?'display:none':''}">
      <div class="pq-single-body">
        <div class="pq-q-head">
          <span class="pq-num">${q.n}</span>
          <span class="pq-q-type">${typeName}</span>
          ${refHint}
          ${questionHeaderActionsHtml(q, { hideStructureControls, dropdownMenu: passageDropdown })}
        </div>
        ${q.choices ? _pqRenderModeTabs(bid, i, q) : ''}
        ${pqStemHtml(q.text, 'Type your question here…')}
        ${choices}
        ${renderEditorExplPanel(q)}
      </div>
    </div>`;
  });

  let html = `<div class="passage-block" id="${bid}"${dataAttr||''}>
    <div class="passage-block-header">
      <span class="p-title">${ICONS.bookOpen}<span class="p-title-text" contenteditable="true" spellcheck="false" data-placeholder="Passage title…" oninput="pqUpdatePassageTitle('${bid}',this.textContent)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}" onblur="pqUpdatePassageTitle('${bid}',this.textContent,true)">${escapeHtml(passage.title || '')}</span>${domainTag}</span>
    </div>
    <div class="passage-split">
      <div class="passage-text-panel" contenteditable="true" spellcheck="false">
        <div class="rte-bar" contenteditable="false">
          <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('bold')" title="Bold"><b>B</b></button>
          <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('italic')" title="Italic"><i>I</i></button>
          <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('underline')" title="Underline"><u>U</u></button>
          <div class="sep"></div>
          <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('insertOrderedList')" title="Numbered list">1.</button>
          <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('insertUnorderedList')" title="Bullet list">&bull;</button>
          <div class="sep"></div>
          <button type="button" onmousedown="event.preventDefault()" onclick="document.execCommand('formatBlock',false,'blockquote')" title="Quote">&ldquo;</button>
          <div class="sep"></div>
          <button type="button" class="rte-hl" onmousedown="event.preventDefault()" onclick="pqHighlightFromToolbar('${bid}')" title="Select passage text first, then click to highlight it for the current question">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
            Highlight in passage
          </button>
        </div>
        ${passageContent}
      </div>
      <!-- Belt + suspenders: inline onmousedown is the primary path,
           body delegation in __addDotDelegationInit is the backup.
           data-resize-bid is what delegation reads if inline gets stripped.
           startResize is internally debounced so dual-firing is harmless. -->
      <div class="passage-resize-handle" data-resize-bid="${bid}" onmousedown="startResize(event,'${bid}')"></div>
      <div class="passage-question-single">
        <div class="pq-nav-header">
          <div class="pq-dots-wrap">
            <button class="pq-dots-arrow" id="${bid}-arrL" onclick="scrollDots('${bid}',-1)"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
            <div class="pq-dots" id="${bid}-dots">${dots}${addDotBtn}</div>
            <button class="pq-dots-arrow" id="${bid}-arrR" onclick="scrollDots('${bid}',1)"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
        ${slides}
      </div>
    </div>
  </div><div style="margin-bottom:20px"></div>`;
  return html;
}

/* ── Toolbar-driven passage highlight ──
   Bridges the passage RTE toolbar's "Highlight in passage" button with the
   existing applyHL() pipeline. Validates pre-conditions (selection exists,
   selection is INSIDE this passage, an active question is set) and surfaces
   missing pieces via toast so the teacher knows what to fix. */
window.pqHighlightFromToolbar = function(bid) {
  const sel = window.getSelection();
  const block = document.getElementById(bid);
  const panel = block?.querySelector('.passage-text-panel');
  const inPanel = sel && !sel.isCollapsed && sel.anchorNode &&
    panel && panel.contains(sel.anchorNode);
  if (!inPanel) {
    if (typeof iteToast === 'function') iteToast('Select text in the passage first, then click Highlight','info');
    return;
  }
  if (!_activePassage || _activePassage.bid !== bid || !_activePassage.qNum) {
    if (typeof iteToast === 'function') iteToast('Open a question on the right first — highlight anchors to the active question','info');
    return;
  }
  applyHL('hl-p');
};

/* ── Question stem editable input + ⋮ Add Image / Equation menu ──
   Mirrors production MultipleChoice from @kira-learning-platform/app-kits:
   the stem is a contenteditable text box with a hover-revealed corner
   menu (Add Image, Equation). Image/equation handlers are stubbed for
   the prototype — production wires them through onUploadPhoto() and
   the LaTeX equation editor; here a toast confirms the click path. */
function pqStemHtml(text, placeholder) {
  // Preserve raw HTML in stem (mock data sometimes embeds <em>/<sup>);
  // production source is sanitized server-side before reaching this layer.
  const safe = text || '';
  const ph = (placeholder || 'Type your question here…').replace(/"/g, '&quot;');
  const imgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
  const eqIcon  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7V5a2 2 0 0 1 2-2h2"/><path d="M5 17v2a2 2 0 0 0 2 2h2"/><path d="M19 7V5a2 2 0 0 0-2-2h-2"/><path d="M19 17v2a2 2 0 0 1-2 2h-2"/><path d="M9 9l6 6"/><path d="M15 9l-6 6"/></svg>`;
  const dotsIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`;
  return `<div class="pq-stem-wrap">
    <div class="pq-stem" contenteditable="true" data-placeholder="${ph}" spellcheck="false">${safe}</div>
    <div class="pq-stem-tools">
      <button type="button" class="pq-stem-tools-btn" title="More" onclick="pqStemMenuToggle(event,this)">${dotsIcon}</button>
      <div class="pq-stem-menu" role="menu">
        <button type="button" onclick="pqStemAddImage(event,this)">${imgIcon}<span>Add Image</span></button>
        <button type="button" onclick="pqStemAddEquation(event,this)">${eqIcon}<span>Equation</span></button>
      </div>
    </div>
  </div>`;
}
window.pqStemMenuToggle = function(ev, btn) {
  ev.stopPropagation();
  const tools = btn.parentElement;
  const isOpen = tools.classList.contains('open');
  document.querySelectorAll('.pq-stem-tools.open').forEach(t => t.classList.remove('open'));
  if (!isOpen) tools.classList.add('open');
};
window.pqStemAddImage = function(ev, btn) {
  ev.stopPropagation();
  btn.closest('.pq-stem-tools')?.classList.remove('open');
  if (typeof iteToast === 'function') iteToast('Add Image — opens upload dialog (production wires onUploadPhoto)','info');
};
window.pqStemAddEquation = function(ev, btn) {
  ev.stopPropagation();
  btn.closest('.pq-stem-tools')?.classList.remove('open');
  if (typeof iteToast === 'function') iteToast('Equation editor — production opens KaTeX/MathLive inline editor','info');
};
// Click-outside closes any open stem menu.
document.addEventListener('click', (e) => {
  if (!e.target.closest('.pq-stem-tools')) {
    document.querySelectorAll('.pq-stem-tools.open').forEach(t => t.classList.remove('open'));
  }
});

/** Navigate to a specific question within a passage block */
function passageGoTo(bid, idx) {
  const block = document.getElementById(bid);
  if (!block) return;
  const slides = block.querySelectorAll('.pq-slide');
  const dots = block.querySelectorAll('.pq-dot:not(.add-dot)');
  const total = slides.length;
  slides.forEach((s,i) => s.style.display = i===idx ? '' : 'none');
  dots.forEach((d,i) => {
    d.classList.toggle('active', i===idx);
    if (i===idx) {
      const dotsContainer = d.parentElement;
      const dLeft = d.offsetLeft - dotsContainer.offsetLeft;
      dotsContainer.scrollTo({ left: dLeft - dotsContainer.clientWidth / 2 + d.offsetWidth / 2, behavior: 'smooth' });
    }
  });
  setTimeout(() => updateDotsArrows(bid), 350);
  // Bottom Prev/Next bar removed — top dot strip is the only navigator now.
  const prevBtn = block.querySelector(`[id="${bid}-prev"]`);
  const nextBtn = block.querySelector(`[id="${bid}-next"]`);
  if (prevBtn) prevBtn.disabled = idx===0;
  if (nextBtn) nextBtn.disabled = idx===total-1;

  // Track active passage + question for "Link Q" feature
  const qNum = slides[idx]?.querySelector('.pq-num')?.textContent;
  _activePassage = { bid: bid, qNum: qNum || null };

  // Show only current question's highlight, dim all others
  block.querySelectorAll('.q-ref').forEach(el => {
    if (el.dataset.q == qNum) {
      el.classList.add('active-ref');
      el.classList.remove('inactive-ref');
    } else {
      el.classList.remove('active-ref');
      el.classList.add('inactive-ref');
    }
  });
  if (qNum) {
    const ref = block.querySelector(`.q-ref[data-q="${qNum}"]`);
    if (ref) ref.scrollIntoView({ behavior:'smooth', block:'center' });
  }
}
function passagePrev(bid) {
  const block = document.getElementById(bid);
  const active = block?.querySelector('.pq-dot.active');
  if (active) { const i = parseInt(active.dataset.idx); if (i > 0) passageGoTo(bid, i-1); }
}
function passageNext(bid) {
  const block = document.getElementById(bid);
  const active = block?.querySelector('.pq-dot.active');
  if (active) { const i = parseInt(active.dataset.idx); const total = block.querySelectorAll('.pq-slide').length; if (i < total-1) passageGoTo(bid, i+1); }
}

/* ── MC mode (Single ↔ Multi) + correct-answer toggling ──
   Mirrors production app's MultipleChoice/MultipleSelection switcher:
   one item type with `isMultipleAnswers` flag. Single mode persists
   `q.correct` (one index); Multi mode persists `q.correctMulti` (array).
   Switching modes preserves any existing correct selection by merging
   the two shapes so the teacher's prior pick isn't lost on toggle. */
function _pqGetQ(bid, qIdx) {
  const passage = window._passageByBid && window._passageByBid[bid];
  if (!passage || !Array.isArray(passage.questions)) return null;
  return passage.questions[qIdx] || null;
}
// Mode tabs (Single ↔ Multi) for passage MC items. Lives ABOVE the question
// stem so the toggle anchors the entire MC card rather than sitting between
// the stem and the choices. _pqRerenderChoices refreshes both this standalone
// tabs element and the choices list whenever pqSetMode flips the mode.
function _pqRenderModeTabs(bid, qIdx, q) {
  const multi = !!q.isMultipleAnswers;
  return `<div class="q-mode-tabs" role="tablist" aria-label="Answer mode" style="margin-bottom:10px">
    <button class="q-mode-tab ${!multi?'active':''}" role="tab" aria-selected="${!multi}" onclick="pqSetMode('${bid}',${qIdx},false)"><span class="dot"></span>Single Answer</button>
    <button class="q-mode-tab ${multi?'active':''}" role="tab" aria-selected="${multi}" onclick="pqSetMode('${bid}',${qIdx},true)"><span class="sq"></span>Multiple Answers</button>
  </div>`;
}
function _pqRenderChoicesSection(bid, qIdx, q) {
  const dotsIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`;
  const imgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
  const eqIcon  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7V5a2 2 0 0 1 2-2h2"/><path d="M5 17v2a2 2 0 0 0 2 2h2"/><path d="M19 7V5a2 2 0 0 0-2-2h-2"/><path d="M19 17v2a2 2 0 0 1-2 2h-2"/><path d="M9 9l6 6"/><path d="M15 9l-6 6"/></svg>`;
  const trashIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
  const plusIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  const multi = !!q.isMultipleAnswers;
  const correctSet = multi
    ? (Array.isArray(q.correctMulti) ? new Set(q.correctMulti) : new Set([q.correct].filter(v => v != null)))
    : null;
  const isCi = (ci) => multi ? correctSet.has(ci) : ci === q.correct;
  // Mode tabs are rendered separately above the stem (see _pqRenderModeTabs +
  // slide template). _pqRerenderChoices refreshes the standalone tabs in
  // place when the mode toggles.
  // Each option mirrors production MultipleChoice: text + hover ⋮ menu
  // (Add Image, Equation, Delete). Production wires Image via onUploadPhoto,
  // Equation via the in-component LaTeX editor, Delete via onOptionDelete.
  const optMenu = (ci) => `<div class="pq-opt-tools">
    <button type="button" class="pq-opt-tools-btn" title="More" onclick="event.stopPropagation();pqOptMenuToggle(event,this)">${dotsIcon}</button>
    <div class="pq-opt-menu" role="menu">
      <button type="button" onclick="event.stopPropagation();pqOptAddImage(event,this)">${imgIcon}<span>Add Image</span></button>
      <button type="button" onclick="event.stopPropagation();pqOptAddEquation(event,this)">${eqIcon}<span>Equation</span></button>
      <button type="button" onclick="event.stopPropagation();pqOptDelete('${bid}',${qIdx},${ci})">${trashIcon}<span>Delete</span></button>
    </div>
  </div>`;
  const list = `<ul class="pq-choices${multi?' multi':''}">${(q.choices || []).map((c, ci) =>
    `<li class="${isCi(ci)?'correct':''}"><span class="letter" title="${multi?'Toggle correct':'Mark as correct'}" onclick="event.stopPropagation();pqToggleCorrect('${bid}',${qIdx},${ci})">${String.fromCharCode(65+ci)}</span><span class="pq-opt-text" contenteditable="true" data-placeholder="Option ${String.fromCharCode(65+ci)}" oninput="pqUpdateOptionText('${bid}',${qIdx},${ci},this.textContent)">${c||''}</span>${optMenu(ci)}</li>`
  ).join('')}</ul>`;
  // Add Option button (production: onOptionAdd). Disabled visually past 8
  // entries to keep MC keyable to A–H letters and prevent runaway lists.
  const cap = (q.choices || []).length >= 8;
  const addBtn = `<button type="button" class="pq-add-opt" ${cap ? 'disabled title="Up to 8 options"' : ''} onclick="pqAddOption('${bid}',${qIdx})">${plusIcon}<span>Add Option</span></button>`;
  return list + addBtn;
}
function _pqRerenderChoices(bid, qIdx) {
  const block = document.getElementById(bid);
  if (!block) return;
  const slide = block.querySelector(`.pq-slide[data-idx="${qIdx}"]`);
  if (!slide) return;
  const q = _pqGetQ(bid, qIdx);
  if (!q) return;
  // Tabs sit above the stem (see slide template). Refresh in place if present
  // so active state and toggle handlers stay current after pqSetMode.
  const tabsEl = slide.querySelector('.q-mode-tabs');
  if (tabsEl) {
    const tmpT = document.createElement('div');
    tmpT.innerHTML = _pqRenderModeTabs(bid, qIdx, q);
    const newTabs = tmpT.querySelector('.q-mode-tabs');
    if (newTabs) tabsEl.replaceWith(newTabs);
  }
  // Choices list + Add Option button (no tabs in this fragment anymore).
  const listEl = slide.querySelector('.pq-choices');
  const addBtnEl = slide.querySelector('.pq-add-opt');
  if (!listEl) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = _pqRenderChoicesSection(bid, qIdx, q);
  const newList = tmp.querySelector('.pq-choices');
  const newAddBtn = tmp.querySelector('.pq-add-opt');
  if (newList) listEl.replaceWith(newList);
  if (addBtnEl && newAddBtn) addBtnEl.replaceWith(newAddBtn);
  else if (newAddBtn && newList) newList.parentElement.insertBefore(newAddBtn, newList.nextSibling);
}
window.pqSetMode = function(bid, qIdx, multi) {
  const q = _pqGetQ(bid, qIdx);
  if (!q) return;
  if (multi) {
    // Single → Multi: seed correctMulti from q.correct so the prior pick stays.
    if (!Array.isArray(q.correctMulti)) {
      q.correctMulti = (q.correct != null) ? [q.correct] : [];
    }
    q.isMultipleAnswers = true;
  } else {
    // Multi → Single: keep first correct as q.correct (or null if none).
    if (Array.isArray(q.correctMulti) && q.correctMulti.length) {
      q.correct = q.correctMulti[0];
    }
    q.isMultipleAnswers = false;
  }
  _pqRerenderChoices(bid, qIdx);
};
window.pqToggleCorrect = function(bid, qIdx, ci) {
  const q = _pqGetQ(bid, qIdx);
  if (!q) return;
  if (q.isMultipleAnswers) {
    if (!Array.isArray(q.correctMulti)) q.correctMulti = [];
    const i = q.correctMulti.indexOf(ci);
    if (i >= 0) q.correctMulti.splice(i, 1);
    else q.correctMulti.push(ci);
  } else {
    // Single mode: clicking re-marks correct (toggle off if same).
    q.correct = (q.correct === ci) ? null : ci;
  }
  _pqRerenderChoices(bid, qIdx);
};

/* ── Per-option ⋮ menu (Add Image / Equation / Delete) + Add Option ──
   Mirrors production MultipleChoice's per-option authoring tools. The
   image/equation handlers are stubbed via toast for the prototype; in
   production they call onUploadPhoto and the in-component LaTeX editor.
   Delete + Add Option mutate q.choices and rerender via the same
   _pqRenderChoicesSection that single/multi tab toggling uses. */
window.pqOptMenuToggle = function(ev, btn) {
  ev.stopPropagation();
  const tools = btn.parentElement;
  const isOpen = tools.classList.contains('open');
  document.querySelectorAll('.pq-opt-tools.open').forEach(t => t.classList.remove('open'));
  if (!isOpen) tools.classList.add('open');
};
window.pqOptAddImage = function(ev, btn) {
  ev.stopPropagation();
  btn.closest('.pq-opt-tools')?.classList.remove('open');
  if (typeof iteToast === 'function') iteToast('Add Image to option — production wires onUploadPhoto','info');
};
window.pqOptAddEquation = function(ev, btn) {
  ev.stopPropagation();
  btn.closest('.pq-opt-tools')?.classList.remove('open');
  if (typeof iteToast === 'function') iteToast('Equation in option — production opens KaTeX/MathLive inline editor','info');
};
window.pqOptDelete = function(bid, qIdx, ci) {
  const q = _pqGetQ(bid, qIdx);
  if (!q || !Array.isArray(q.choices)) return;
  if (q.choices.length <= 2) {
    if (typeof iteToast === 'function') iteToast('A multiple-choice question needs at least 2 options','info');
    return;
  }
  q.choices.splice(ci, 1);
  // Fix up correct indices so they still point at the right options after
  // the splice. Indices >= ci shift down by 1; the deleted index is dropped.
  if (q.isMultipleAnswers) {
    if (Array.isArray(q.correctMulti)) {
      q.correctMulti = q.correctMulti
        .filter(idx => idx !== ci)
        .map(idx => idx > ci ? idx - 1 : idx);
    }
  } else {
    if (q.correct === ci) q.correct = null;
    else if (typeof q.correct === 'number' && q.correct > ci) q.correct -= 1;
  }
  _pqRerenderChoices(bid, qIdx);
};
window.pqAddOption = function(bid, qIdx) {
  const q = _pqGetQ(bid, qIdx);
  if (!q) return;
  if (!Array.isArray(q.choices)) q.choices = [];
  if (q.choices.length >= 8) return;
  q.choices.push('');
  _pqRerenderChoices(bid, qIdx);
};
// Persist contenteditable option-text edits straight to q.choices. Keep it
// in-place — DON'T trigger a rerender, that would lose cursor / selection.
window.pqUpdateOptionText = function(bid, qIdx, ci, text) {
  const q = _pqGetQ(bid, qIdx);
  if (!q || !Array.isArray(q.choices)) return;
  q.choices[ci] = text;
};
// Persist contenteditable passage title edits to:
//   - the live passage object (window._passageByBid[bid])
//   - SAMPLE_Q[secId][idx].title (so re-render keeps the new name)
//   - the sidebar label (so the sidebar tooltip + visible name stay in sync)
// Called on `oninput` (live, no rerender → keeps cursor) and again on
// `onblur` with `final=true` (final commit; trims + falls back to default
// if user emptied it).
window.pqUpdatePassageTitle = function(bid, text, final) {
  const passage = window._passageByBid && window._passageByBid[bid];
  if (!passage) return;
  let next = (text || '').replace(/\s+/g, ' ');
  if (final) next = next.trim();
  // On blur, refuse to commit empty — restore previous title in DOM.
  if (final && !next) {
    const blockEl = document.getElementById(bid);
    const span = blockEl && blockEl.querySelector('.p-title-text');
    if (span) span.textContent = passage.title || '';
    return;
  }
  passage.title = next;
  // Mirror to SAMPLE_Q + sidebar by walking up to the block's data attrs.
  const blockEl = document.getElementById(bid);
  if (!blockEl) return;
  const wrapper = blockEl.closest('[data-main-sec][data-main-idx]') || blockEl;
  const secId = wrapper.dataset.mainSec;
  const idx = +wrapper.dataset.mainIdx;
  if (secId && Number.isFinite(idx) && SAMPLE_Q[secId] && SAMPLE_Q[secId][idx]) {
    SAMPLE_Q[secId][idx].title = next;
  }
  // Update the matching sidebar label in place (no full rerender).
  document.querySelectorAll(`.sidebar-passage-label .sb-passage-title`).forEach(el => {
    if (el.dataset.sec === secId && +el.dataset.idx === idx) {
      el.textContent = next;
      el.setAttribute('title', `${next} (double-click to rename)`);
    }
  });
};
// Click-outside closes any open option menu (in addition to stem menu).
document.addEventListener('click', (e) => {
  if (!e.target.closest('.pq-opt-tools')) {
    document.querySelectorAll('.pq-opt-tools.open').forEach(t => t.classList.remove('open'));
  }
});
function highlightRef(bid, qNum) {
  const block = document.getElementById(bid);
  if (!block) return;
  block.querySelectorAll('.q-ref').forEach(el => {
    if (el.dataset.q == qNum) {
      el.classList.add('active-ref');
      el.classList.remove('inactive-ref');
    } else {
      el.classList.remove('active-ref');
      el.classList.add('inactive-ref');
    }
  });
  const ref = block.querySelector(`.q-ref[data-q="${qNum}"]`);
  if (ref) ref.scrollIntoView({ behavior:'smooth', block:'center' });
}

