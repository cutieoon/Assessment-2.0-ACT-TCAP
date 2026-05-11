// @ts-nocheck
// Phase-1 split: stuModal + ACT Practice Focus modal helpers (lines 34352–34568 of original).

function stuModal({icon='⚠️',iconType='warn',title,body,confirmText='Confirm',confirmClass='',cancelText='Cancel',onConfirm}){
  const ov=document.getElementById('stuModalOverlay');
  document.getElementById('stuModalIcon').textContent=icon;
  document.getElementById('stuModalIcon').className='modal-icon '+iconType;
  document.getElementById('stuModalTitle').textContent=title;
  document.getElementById('stuModalBody').innerHTML=body;
  const confirmBtn=document.getElementById('stuModalConfirm');
  const cancelBtn=document.getElementById('stuModalCancel');
  confirmBtn.textContent=confirmText;
  confirmBtn.className='modal-confirm '+(confirmClass||'');
  cancelBtn.style.display=cancelText?'':'none';
  if(cancelText)cancelBtn.textContent=cancelText;
  ov.classList.add('open');
  confirmBtn.onclick=()=>{ov.classList.remove('open');cancelBtn.style.display='';if(onConfirm)onConfirm()};
  cancelBtn.onclick=()=>{ov.classList.remove('open');cancelBtn.style.display=''};
}

// ── ACT Practice Focus modal ──────────────────────────────────────
// Buckets this attempt into Priority / Build / Maintain so the student
// (or teacher reading the same report) can see *where* to spend the next
// prep sessions, even before the Practice module ships. Reads from the
// global ACT_REPORT singleton so the modal stays in sync with the rest
// of the score report. Each bucket maps to a different signal:
//   • Priority — top-3 lowest-mastery reporting categories (<70%).
//                These are the official ACT sub-skill level. Biggest
//                single levers; what we'd target first when Practice
//                exists.
//   • Build    — sections strictly below benchmark, sorted by smallest
//                gap first (closest to "Met" = quickest readiness win).
//   • Maintain — sections at or above benchmark; surfaced so strong
//                areas don't silently regress between attempts.
// Buckets are derived deterministically; this is *not* an LLM call.
function _actPracticeFocusData(){
  const r = (typeof ACT_REPORT !== 'undefined') ? ACT_REPORT : {};
  const sc = r.scores || {};
  const bm = r.benchmarks || {};
  const cats = r.categories || {};
  const SECS = ['english','math','reading','science'];

  const allCats = [];
  SECS.forEach(secKey => {
    ((cats[secKey] && cats[secKey].items) || []).forEach(c => {
      if (typeof c.pct === 'number') allCats.push({ secKey, ...c });
    });
  });
  allCats.sort((a,b) => a.pct - b.pct);
  // Show clearly weak ones; if none under 70 %, fall back to the single lowest.
  let priority = allCats.filter(c => c.pct < 70).slice(0, 3);
  if (priority.length === 0 && allCats.length) priority = [allCats[0]];

  const build = SECS
    .map(k => ({ k, label: ACT_SECTION_LABELS[k] || k, score: sc[k], bench: bm[k] }))
    .filter(s => typeof s.score === 'number' && typeof s.bench === 'number' && s.score < s.bench)
    .map(s => ({ ...s, gap: s.bench - s.score }))
    .sort((a,b) => a.gap - b.gap);

  const maintain = SECS
    .map(k => ({ k, label: ACT_SECTION_LABELS[k] || k, score: sc[k], bench: bm[k] }))
    .filter(s => typeof s.score === 'number' && typeof s.bench === 'number' && s.score >= s.bench)
    .map(s => ({ ...s, margin: s.score - s.bench }))
    .sort((a,b) => b.margin - a.margin);

  return { r, priority, build, maintain };
}

function openActPracticeFocus(){
  const { r, priority, build, maintain } = _actPracticeFocusData();
  const testDate = (r && r.testDate) ? r.testDate : 'this attempt';

  // ── Header meta ──
  const metaParts = [];
  if (priority.length) metaParts.push(`<b>${priority.length}</b> priority`);
  if (build.length)    metaParts.push(`<b>${build.length}</b> building`);
  if (maintain.length) metaParts.push(`<b>${maintain.length}</b> maintaining`);
  const metaEl = document.getElementById('actPracticeFocusMeta');
  if (metaEl) metaEl.innerHTML = metaParts.join(' · ') + ` · from ${testDate}`;

  // ── Priority card (reporting categories under 70 % mastery) ──
  const priorityHtml = priority.length
    ? priority.map(c => `
      <div class="actr-pf-row">
        <div class="actr-pf-row-main">
          <div class="actr-pf-row-title">${c.name}</div>
          <div class="actr-pf-row-sub">${ACT_SECTION_LABELS[c.secKey] || c.secKey} · ${c.correct} of ${c.total} correct on this attempt</div>
        </div>
        <div class="actr-pf-row-metric" title="${c.pct}% correct on this attempt — not an ACT readiness percentile">${c.pct}<span class="unit">%</span></div>
      </div>`).join('')
    : `<div class="actr-pf-empty">No reporting categories below 70 % mastery on this attempt.</div>`;

  // ── Build card (sections below benchmark) ──
  const buildHtml = build.length
    ? build.map(s => {
        const gapNote = s.gap === 1 ? '1 pt to benchmark' : `${s.gap} pts to benchmark`;
        return `
        <div class="actr-pf-row">
          <div class="actr-pf-row-main">
            <div class="actr-pf-row-title">${s.label}</div>
            <div class="actr-pf-row-sub">Section score · ${gapNote} of ${s.bench}</div>
          </div>
          <div class="actr-pf-row-metric">${s.score}<span class="unit">/${s.bench}</span></div>
        </div>`;
      }).join('')
    : `<div class="actr-pf-empty">All sections already meet the readiness benchmark.</div>`;

  // ── Maintain card (sections at or past benchmark) ──
  const maintainHtml = maintain.length
    ? maintain.map(s => {
        const note = s.margin === 0
          ? `Section score · at benchmark of ${s.bench}`
          : `Section score · ${s.margin} pt${s.margin === 1 ? '' : 's'} past benchmark of ${s.bench}`;
        return `
        <div class="actr-pf-row">
          <div class="actr-pf-row-main">
            <div class="actr-pf-row-title">${s.label}</div>
            <div class="actr-pf-row-sub">${note}</div>
          </div>
          <div class="actr-pf-row-metric">${s.score}<span class="unit">/${s.bench}</span></div>
        </div>`;
      }).join('')
    : `<div class="actr-pf-empty">No section currently meets the benchmark.</div>`;

  document.getElementById('actPracticeFocusBody').innerHTML = `
    <p class="actr-pf-intro">Based on this attempt's reporting categories and ACT readiness benchmarks. Priority items tend to move the section score most per minute spent.</p>

    <div class="actr-pf-card priority">
      <div class="actr-pf-card-head">
        <span class="actr-pf-card-title">Priority focus</span>
        <span class="actr-pf-card-count">${priority.length || 0} ${priority.length === 1 ? 'category' : 'categories'}</span>
      </div>
      <div class="actr-pf-card-sub">Lowest mastery on this attempt — biggest single lever for the next session.</div>
      <div class="actr-pf-card-list">${priorityHtml}</div>
      <div class="actr-pf-card-foot">% reflects correct items on this attempt only — not an ACT readiness percentile.</div>
    </div>

    <div class="actr-pf-card build">
      <div class="actr-pf-card-head">
        <span class="actr-pf-card-title">Build to benchmark</span>
        <span class="actr-pf-card-count">${build.length || 0} ${build.length === 1 ? 'section' : 'sections'}</span>
      </div>
      <div class="actr-pf-card-sub">Below the readiness benchmark — sorted by closest to "Met".</div>
      <div class="actr-pf-card-list">${buildHtml}</div>
    </div>

    <div class="actr-pf-card maintain">
      <div class="actr-pf-card-head">
        <span class="actr-pf-card-title">Maintain</span>
        <span class="actr-pf-card-count">${maintain.length || 0} ${maintain.length === 1 ? 'section' : 'sections'}</span>
      </div>
      <div class="actr-pf-card-sub">Already at or past the benchmark — light review keeps the lead.</div>
      <div class="actr-pf-card-list">${maintainHtml}</div>
    </div>

    <p class="actr-pf-footnote">Reporting categories are the official ACT sub-skill level. Once the Practice module ships, this list becomes a one-click targeted practice set.</p>
  `;
  document.getElementById('actPracticeFocusOverlay').classList.add('open');
}

function closeActPracticeFocus(){
  document.getElementById('actPracticeFocusOverlay').classList.remove('open');
}

// Snapshot the modal card to a PNG and trigger a download. Uses
// html2canvas (loaded from CDN). The modal body is set to scroll past
// 85vh so we temporarily lift the cap and unlock overflow so the full
// content is captured even when the viewport is short. State is
// restored before the function returns. Filename is keyed off the
// student name + test date so multiple snapshots don't collide.
async function actPracticeFocusDownload(btn){
  const card = document.querySelector('#actPracticeFocusOverlay .stu-modal');
  if (!card) return;
  if (typeof html2canvas !== 'function') {
    (typeof iteToast === 'function') && iteToast('Image library is still loading — try again in a moment.', 'info');
    return;
  }
  const body = card.querySelector('.stu-modal-body');
  const prevLabel = btn ? btn.textContent : '';
  const prevDisabled = btn ? btn.disabled : false;
  if (btn) { btn.textContent = 'Generating…'; btn.disabled = true; }

  // Lift the height/scroll caps so html2canvas paints the full card.
  const cardPrev = { maxHeight: card.style.maxHeight, height: card.style.height };
  const bodyPrev = body ? { maxHeight: body.style.maxHeight, overflow: body.style.overflow } : null;
  card.style.maxHeight = 'none';
  card.style.height = 'auto';
  if (body) { body.style.maxHeight = 'none'; body.style.overflow = 'visible'; }

  try {
    const canvas = await html2canvas(card, {
      backgroundColor: '#ffffff',
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true,
      logging: false,
    });
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    if (!blob) throw new Error('blob-failed');
    const r = (typeof ACT_REPORT !== 'undefined') ? ACT_REPORT : {};
    const studentSlug = ((typeof STUDENT_PROFILE !== 'undefined' && STUDENT_PROFILE && STUDENT_PROFILE.name)
      ? STUDENT_PROFILE.name : 'student').replace(/\s+/g,'-').toLowerCase();
    const dateSlug = (r.testDate || 'latest').replace(/\s+/g,'-').toLowerCase();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `practice-focus-${studentSlug}-${dateSlug}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    (typeof iteToast === 'function') && iteToast('Practice focus image downloaded.', 'success');
  } catch (err) {
    (typeof iteToast === 'function') && iteToast('Image export failed — try again.', 'error');
  } finally {
    card.style.maxHeight = cardPrev.maxHeight;
    card.style.height = cardPrev.height;
    if (body && bodyPrev) { body.style.maxHeight = bodyPrev.maxHeight; body.style.overflow = bodyPrev.overflow; }
    if (btn) { btn.textContent = prevLabel; btn.disabled = prevDisabled; }
  }
}
