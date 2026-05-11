// @ts-nocheck
// Phase-2 slice: lines 16862-17937 of original src/app.ts

// ═══════ TCAP RENDERERS ═══════
function tcapPillHTML(level, opts = {}) {
  const size = opts.size || 'md';
  const pad = size === 'sm' ? '2px 8px' : '4px 12px';
  const fs = size === 'sm' ? '11px' : '12px';
  return `<span style="display:inline-flex;align-items:center;gap:6px;padding:${pad};border-radius:999px;background:${level.bg};color:${level.color};border:1px solid ${level.border};font-size:${fs};font-weight:700;letter-spacing:.2px"><span style="width:6px;height:6px;border-radius:999px;background:${level.color};display:inline-block"></span>${level.label}</span>`;
}

function tcapAcctBarColor(acc) {
  if (acc >= 0.80) return '#16a34a';
  if (acc >= 0.65) return '#2563eb';
  if (acc >= 0.50) return '#f59e0b';
  return '#dc2626';
}

function tcapAccBg(acc) {
  if (acc >= 0.80) return '#dcfce7';
  if (acc >= 0.65) return '#dbeafe';
  if (acc >= 0.50) return '#fef3c7';
  return '#fee2e2';
}

// ── Teacher: Class Predictions ────────────────────────────────────
function renderTcapClass(targetBodyId = 'tcapClassBody', targetSubtitleId = 'tcapClassSubtitle') {
  const cls = TCAP_CLASS;
  const gradeKey = tcapKey(cls.grade, cls.subject);
  const stds = TCAP_PROFILE.standardsMap[gradeKey] || [];
  const rows = tcapPredictAll(cls);
  const counts = tcapLevelCounts(rows);
  const total = rows.length;
  // riskRows = everyone Below + Approaching (used for bucket assign + heatmap).
  // razorRows = the tight subset who are within 8 scale pts of On Track per
  //             PRD §8 — these are the highest-leverage targeted-practice
  //             candidates (move 1 student → cross 1 cut → 1 more "On Track").
  const riskRows  = rows.filter(r => r.pred.level.index <= 1).sort((a,b) => a.pred.scaleScore - b.pred.scaleScore);
  const razorRows = rows.filter(r =>
    r.pred.level.id === 'approaching' &&
    r.pred.gapToNext &&
    r.pred.gapToNext.scalePointsToNext <= 8
  ).sort((a,b) => a.pred.gapToNext.scalePointsToNext - b.pred.gapToNext.scalePointsToNext);
  const remainingRiskCount = riskRows.filter(r => !isTcapPracticeAssigned(r.id)).length;
  const classAvgScale = Math.round(rows.reduce((s,r) => s + r.pred.scaleScore, 0) / Math.max(1,total));
  const onTrackFloor = TCAPScoringAdapter.getCutScores(gradeKey).proficient[0];
  const attentionRows = [...rows]
    .filter(r => r.pred.level.index <= 2)
    .sort((a,b) => a.pred.scaleScore - b.pred.scaleScore)
    .slice(0, 14);
  const heatmapRows = attentionRows.length ? attentionRows : [...rows].sort((a,b) => a.pred.scaleScore - b.pred.scaleScore).slice(0, 14);

  const subtitleEl = targetSubtitleId ? document.getElementById(targetSubtitleId) : null;
  if (subtitleEl) subtitleEl.textContent = `${cls.className} · Diagnostic completed ${cls.diagnosticDate} · ${total} students · 45 items · Class avg scale score ${classAvgScale} (On Track cut ${onTrackFloor})`;

  // Level distribution strip
  const strip = TCAP_PROFILE.performanceLevels.map(lvl => {
    const n = counts[lvl.id];
    const pct = total ? Math.round((n/total)*100) : 0;
    return `<div style="min-width:0;background:${lvl.bg};border:1px solid ${lvl.border};border-radius:10px;padding:10px;display:flex;align-items:center;justify-content:space-between;gap:8px">
      <div style="min-width:0">
        <div style="font-size:9px;font-weight:900;color:${lvl.color};letter-spacing:.25px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${lvl.shortLabel}</div>
        <div style="font-size:11px;color:${lvl.color};font-weight:700;margin-top:2px">${pct}%</div>
      </div>
      <div style="font-size:22px;font-weight:900;color:${lvl.color};line-height:1;font-variant-numeric:tabular-nums">${n}</div>
    </div>`;
  }).join('');

  // ─── Standards × Students heatmap (PRD §10 required module) ─────────────
  // Shows the 12-14 students closest to (or below) the cut, scored against
  // every standard in the active grade/subject map. Cells are colored by
  // accuracy bucket (≥85 green · ≥70 yellow-green · ≥50 yellow · <50 red).
  // Click a row to open the full diagnostic; hover to inspect % per std.
  // ─────────────────────────────────────────────────────────────────────
  const heatStandards = stds.slice(0, 7);  // cap at 7 cols for readability
  const heatHeader = `<div style="display:grid;grid-template-columns:minmax(160px,1.5fr) repeat(${heatStandards.length},minmax(54px,1fr));gap:6px;align-items:center;padding:0 4px 8px;border-bottom:1px solid #eef0f4">
    <div style="font-size:11px;font-weight:800;color:#71717a;text-transform:uppercase;letter-spacing:.04em">Student</div>
    ${heatStandards.map(s => `<div title="${s.name} · ${s.category}" style="font-size:10px;font-weight:900;color:#52525b;text-align:center;letter-spacing:.02em">${s.code}</div>`).join('')}
  </div>`;
  const heatBody = heatmapRows.slice(0, 12).map(r => {
    const cells = heatStandards.map(s => {
      const acc = (r.standards && r.standards[s.code] != null) ? r.standards[s.code] : null;
      if (acc == null) return `<div style="background:#fafafa;border:1px dashed #e7e5e4;border-radius:6px;padding:7px 4px;text-align:center;font-size:10px;color:#a8a29e">—</div>`;
      const pct = Math.round(acc * 100);
      return `<div title="${r.name} · ${s.code} ${s.name}: ${pct}%" style="background:${tcapAccBg(acc)};border:1px solid rgba(0,0,0,.04);border-radius:6px;padding:7px 4px;text-align:center;font-size:11px;font-weight:900;color:${tcapAcctBarColor(acc)};font-variant-numeric:tabular-nums;cursor:pointer" onclick="tcapOpenStudentReport('${r.id}')">${pct}</div>`;
    }).join('');
    const initials = r.name.split(/\s+/).map(w => w[0]).join('').slice(0,2);
    return `<div style="display:grid;grid-template-columns:minmax(160px,1.5fr) repeat(${heatStandards.length},minmax(54px,1fr));gap:6px;align-items:center;padding:6px 4px;border-bottom:1px solid #f4f4f5">
      <div style="display:flex;align-items:center;gap:8px;min-width:0;cursor:pointer" onclick="tcapOpenStudentReport('${r.id}')">
        <div style="width:26px;height:26px;border-radius:999px;background:#f5f3ff;color:#6040ca;font-size:10px;font-weight:900;display:grid;place-items:center;flex-shrink:0">${initials}</div>
        <div style="min-width:0;display:flex;align-items:center;gap:6px;flex-wrap:nowrap">
          <span style="font-size:12px;font-weight:800;color:#18181b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.name}</span>
          ${tcapPillHTML(r.pred.level,{size:'sm'})}
        </div>
      </div>
      ${cells}
    </div>`;
  }).join('');
  const heatLegend = `<div style="display:flex;align-items:center;gap:14px;font-size:10px;color:#71717a;font-weight:700;margin-top:10px;flex-wrap:wrap">
    <span>% correct on each standard</span>
    <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:#dcfce7;border:1px solid rgba(0,0,0,.04)"></span>≥85</span>
    <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:#ecfccb;border:1px solid rgba(0,0,0,.04)"></span>≥70</span>
    <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:#fef3c7;border:1px solid rgba(0,0,0,.04)"></span>≥50</span>
    <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:#fee2e2;border:1px solid rgba(0,0,0,.04)"></span>&lt;50</span>
  </div>`;

  // Razor's Edge / Near Target panel — PRD §10 module 3. Highest-leverage
  // students (within 8 scale pts of On Track) get the tight panel; the
  // broader Below/Approaching cohort is reachable via the Risk Bucket CTA
  // and the heatmap below. Each row makes the gap to On Track explicit.
  const razor = razorRows.slice(0,6).map(r => {
    const weak = tcapWeakestStandards(r, 3);
    const gapPts = r.pred.gapToNext ? r.pred.gapToNext.scalePointsToNext : null;
    const cutScore = r.pred.gapToNext ? r.pred.gapToNext.nextCutScore : onTrackFloor;
    const itemsToNext = r.pred.gapToNext ? r.pred.gapToNext.itemsToNext : null;
    const initials = r.name.split(/\s+/).map(w => w[0]).join('').slice(0,2);
    const weakCells = weak.map(w => {
      const pct = Math.round(w.acc * 100);
      return `<div title="${w.code} ${w.name}: ${pct}%" style="min-width:56px;padding:6px 7px;border-radius:9px;background:${tcapAccBg(w.acc)};border:1px solid rgba(0,0,0,.04);text-align:center">
        <div style="font-size:10px;font-weight:900;color:${tcapAcctBarColor(w.acc)}">${w.code}</div>
        <div style="font-size:12px;font-weight:900;color:${tcapAcctBarColor(w.acc)};font-variant-numeric:tabular-nums">${pct}%</div>
      </div>`;
    }).join('');
    // Per-row "Assign practice" button removed — bulk-assign action lives on
    // the right-side Practice plan card AND at the top of the Predictions
    // page (Risk Bucket CTA). The "✓ Practice assigned" badge stays as an
    // inline status next to the name once a row's practice has been routed.
    const practiceAssigned = isTcapPracticeAssigned(r.id);
    return `<div style="display:grid;grid-template-columns:minmax(260px,1fr) minmax(220px,.9fr);gap:14px;align-items:center;padding:12px 14px;border:1px solid #ddd6fe;background:#fff;border-radius:12px">
      <div style="display:flex;align-items:center;gap:12px;min-width:0">
        <div style="width:38px;height:38px;border-radius:999px;background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1px solid #ddd6fe;color:#6040ca;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">${initials}</div>
        <div style="min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-weight:900;color:#18181b;font-size:13px">${r.name}</span>
            <span style="font-size:16px;font-weight:900;color:${r.pred.level.color};font-variant-numeric:tabular-nums">${r.pred.scaleScore}</span>
            ${tcapPillHTML(r.pred.level,{size:'sm'})}
            ${practiceAssigned ? `<span class="tcap-practice-assigned" style="font-size:10px">✓ Practice assigned</span>` : ''}
          </div>
          <div style="font-size:11px;color:#52525b;margin-top:4px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            ${gapPts != null ? `<span style="color:#5b21b6;font-weight:800;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:999px;padding:2px 8px">▲ ${gapPts} pts to On Track (cut ${cutScore})</span>` : ''}
            ${itemsToNext != null ? `<span style="color:#71717a">${itemsToNext} targeted items can close it</span>` : ''}
          </div>
        </div>
      </div>
      <div style="display:flex;gap:7px;align-items:center;overflow-x:auto;padding-bottom:1px">${weakCells}</div>
    </div>`;
  }).join('');
  const razorEmpty = `<div style="padding:18px;border:1px dashed #ddd6fe;background:#faf5ff;border-radius:10px;text-align:center;color:#5b21b6;font-size:12px;font-weight:600">No Razor's Edge students this round — every Approaching student is more than 8 pts from On Track. Use the Risk Bucket below for broader practice.</div>`;

  // Layout rationale (3 stacked sections instead of the previous 2-col grid):
  //   1. Prediction snapshot — full-width compact strip; it's a class-level
  //      summary so it reads more naturally as a header band than as a tall
  //      sidebar card. The 4 performance-level chips lay out horizontally
  //      (1 row × 4 cols) instead of cramped 2×2.
  //   2. Near Target Students | Practice plan — 2-col action row. Heights
  //      now align because Practice plan ≈ 4 razor rows of content; the
  //      previous layout left a large empty area under Near Target Students
  //      because Practice plan was stacked on top of Prediction in the right
  //      column, ballooning the right column's height.
  //   3. Standards heatmap — unchanged, full-width data view.
  const body = `
    <div style="background:#fff;border:1px solid #eef0f4;border-radius:14px;padding:14px 16px;box-shadow:0 1px 2px rgba(0,0,0,.04);margin-bottom:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:12px;flex-wrap:wrap">
        <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
          <h3 style="margin:0;font-size:15px;font-weight:900;color:#18181b">Prediction snapshot</h3>
          <span style="font-size:11px;color:#71717a">Avg scale <b style="color:#18181b;font-variant-numeric:tabular-nums">${classAvgScale}</b> · On Track cut <b style="color:#18181b;font-variant-numeric:tabular-nums">${onTrackFloor}</b> · <span style="color:#5b21b6;font-weight:700">Projected, pending next diagnostic</span></span>
        </div>
        <a href="#" onclick="event.preventDefault();setSessionDetailTab('cut-scores')" title="Open the Cut Scores tab on this page (Subparts will be disabled — cut scores apply to composite score)" style="font-size:11px;color:#6040ca;font-weight:800;text-decoration:none;white-space:nowrap;flex-shrink:0">View profile</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">${strip}</div>
    </div>

    <div style="display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,.75fr);gap:14px;align-items:stretch;margin-bottom:16px">
      <div style="background:#fff;border:1px solid #eef0f4;border-radius:14px;padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.04);display:flex;flex-direction:column">
        <div style="margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <h3 style="margin:0;font-size:15px;font-weight:900;color:#18181b">Near Target Students</h3>
            <span style="font-size:9px;font-weight:900;letter-spacing:.5px;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:5px;padding:2px 6px;text-transform:uppercase">Razor's Edge</span>
          </div>
          <p style="font-size:11px;color:#71717a;margin:3px 0 0">Within 8 scale points of On Track — the highest-leverage students for targeted practice this cycle.</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">${razor || razorEmpty}</div>
        <!-- Footer hint — fills the residual height when razor rows are few
             (e.g. only 2 Approaching students close to cut). Anchors the
             reader to the heatmap below (the broader risk view) instead of
             leaving the card looking empty. -->
        ${razor ? `<div style="margin-top:auto;padding-top:14px">
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fafafa;border:1px dashed #e4e4e7;border-radius:10px">
            <span style="font-size:14px">↓</span>
            <div style="flex:1;font-size:11px;color:#52525b;line-height:1.5">
              <b style="color:#18181b">${riskRows.length - razorRows.length} more Below/Approaching students</b> are tracked in the Standards heatmap below — click any row to open their full diagnostic.
            </div>
          </div>
        </div>` : ''}
      </div>

      <div style="background:linear-gradient(180deg,#faf5ff,#fff);border:1px solid #ddd6fe;border-radius:14px;padding:16px;box-shadow:0 1px 2px rgba(96,64,202,.08);display:flex;flex-direction:column">
        <h3 style="margin:0;font-size:15px;font-weight:900;color:#18181b">Practice plan</h3>
        <p style="font-size:12px;color:#52525b;margin:6px 0 12px;line-height:1.5">Route at-risk students to standards-based practice using their weakest standards.</p>
        <div style="border:1px solid #ede9fe;background:#fff;border-radius:12px;padding:10px 12px;margin-bottom:10px">
          <div style="font-size:10px;font-weight:900;letter-spacing:.35px;text-transform:uppercase;color:#71717a;margin-bottom:3px">Source mix</div>
          <div style="font-size:12px;font-weight:800;color:#18181b">Mock item bank + Kira tagged items</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
          <div style="border:1px solid #ede9fe;background:#fff;border-radius:10px;padding:10px">
            <div style="font-size:18px;font-weight:900;color:#6040ca;line-height:1">${remainingRiskCount}</div>
            <div style="font-size:10px;color:#71717a;font-weight:800;text-transform:uppercase;margin-top:3px">Ready to assign</div>
          </div>
          <div style="border:1px solid #ede9fe;background:#fff;border-radius:10px;padding:10px">
            <div style="font-size:18px;font-weight:900;color:#6040ca;line-height:1">${tcapPracticeAssignedCount}</div>
            <div style="font-size:10px;color:#71717a;font-weight:800;text-transform:uppercase;margin-top:3px">Assigned</div>
          </div>
        </div>
        <button onclick="tcapAssignRiskBucket()" ${remainingRiskCount === 0 ? 'disabled' : ''} style="margin-top:auto;width:100%;background:${remainingRiskCount === 0 ? '#dcfce7' : '#6040ca'};color:${remainingRiskCount === 0 ? '#166534' : '#fff'};border:none;border-radius:9px;height:36px;font-size:12px;font-weight:900;cursor:${remainingRiskCount === 0 ? 'default' : 'pointer'}">${remainingRiskCount === 0 ? 'All risk practice assigned' : 'Assign practice'}</button>
      </div>
    </div>

    <!-- Standards heatmap (PRD §10) — full-width row beneath the action grid.
         Surfaces per-standard accuracy across the highest-leverage students
         so a teacher can see where to teach next, not just who to act on. -->
    <div style="background:#fff;border:1px solid #eef0f4;border-radius:14px;padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.04);margin-bottom:16px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;flex-wrap:wrap">
        <div>
          <h3 style="margin:0;font-size:15px;font-weight:900;color:#18181b">Standards heatmap</h3>
          <p style="font-size:11px;color:#71717a;margin:3px 0 0">Where the class is strong vs. struggling, standard by standard. Click a row to open that student's diagnostic.</p>
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
          <span style="font-size:10px;font-weight:800;color:#52525b;background:#f4f4f5;border:1px solid #e7e5e4;border-radius:999px;padding:4px 9px">Top ${Math.min(12, heatmapRows.length)} students near or below cut</span>
          <span style="font-size:10px;font-weight:800;color:#52525b;background:#f4f4f5;border:1px solid #e7e5e4;border-radius:999px;padding:4px 9px">${heatStandards.length} standards</span>
        </div>
      </div>
      <div style="overflow-x:auto">
        ${heatHeader}
        ${heatBody || `<div style="padding:24px;text-align:center;color:#a8a29e;font-size:12px">No standards data yet — heatmap will populate once students complete the diagnostic.</div>`}
      </div>
      ${heatLegend}
    </div>

  `;
  const target = document.getElementById(targetBodyId);
  if (target) target.innerHTML = body;
}

function tcapOpenStudentReport(studentId) {
  TCAP_CLASS.spotlightStudentId = studentId;
  switchRole('student', true);
  nav('tcap-diag-report');
}
const tcapPracticeAssignedStudentIds = new Set();
let tcapPracticeAssignedCount = 0;
function isTcapPracticeAssigned(studentId) {
  return tcapPracticeAssignedStudentIds.has(studentId);
}
let pendingPracticeAssign = null;
function resetPracticeAssignModal() {
  const icon = document.getElementById('practiceAssignIcon');
  const cancelBtn = document.getElementById('practiceAssignCancelBtn');
  const confirmBtn = document.getElementById('practiceAssignConfirmBtn');
  if (icon) {
    icon.className = 'modal-icon info';
    icon.textContent = '🎯';
  }
  if (cancelBtn) cancelBtn.style.display = '';
  if (confirmBtn) {
    confirmBtn.textContent = 'Assign practice';
    confirmBtn.onclick = confirmPracticeAssign;
    confirmBtn.className = 'modal-confirm';
  }
}
function tcapAssignOne(studentId) {
  const stu = TCAP_CLASS.students.find(s => s.id === studentId);
  const gradeKey = tcapKey(TCAP_CLASS.grade, TCAP_CLASS.subject);
  const pred = stu ? TCAPScoringAdapter.predict(stu, gradeKey) : null;
  const weak = stu ? tcapWeakestStandards(stu, 3) : [];
  pendingPracticeAssign = { mode:'single', studentId, count: stu ? 1 : 0 };
  resetPracticeAssignModal();
  document.getElementById('practiceAssignTitle').textContent = `Assign practice to ${stu ? stu.name : 'student'}?`;
  document.getElementById('practiceAssignSubtitle').textContent = `${TCAP_CLASS.className} · TCAP ${TCAP_CLASS.subject}`;
  document.getElementById('practiceAssignBody').innerHTML = `
    <p style="margin:0">This will create a personalized practice plan from the student's weakest standards and add it to Teacher Assignments.</p>
    <div class="stat">
      <div class="stat-item"><span class="val">${pred ? pred.scaleScore : '—'}</span><span class="lbl">Predicted scale</span></div>
      <div class="stat-item"><span class="val">${pred ? pred.level.shortLabel : '—'}</span><span class="lbl">Level</span></div>
      <div class="stat-item"><span class="val">${weak.length}</span><span class="lbl">Target skills</span></div>
    </div>
    <p style="margin:14px 0 0;font-size:12px;color:#52525b"><b>Targets:</b> ${weak.map(w => `${w.code} ${w.name}`).join(' · ') || 'Weakest standards from diagnostic'}</p>
    <p style="margin:10px 0 0;font-size:12px;color:#71717a">Source mix: mock item bank + Kira tagged items + AI-reviewed practice candidates. Prototype demo only.</p>
  `;
  document.getElementById('practiceAssignModalOverlay').classList.add('open');
}
function tcapAssignRiskBucket() {
  const rows = tcapPredictAll();
  const riskRows = rows.filter(r => r.pred.level.index <= 1);
  pendingPracticeAssign = { mode:'bucket', count:riskRows.length };
  resetPracticeAssignModal();
  document.getElementById('practiceAssignTitle').textContent = 'Assign practice to Risk Bucket?';
  document.getElementById('practiceAssignSubtitle').textContent = `${TCAP_CLASS.className} · ${riskRows.length} students below On Track`;
  document.getElementById('practiceAssignBody').innerHTML = `
    <p style="margin:0">This will create personalized practice plans for all students currently predicted below On Track.</p>
    <div class="stat">
      <div class="stat-item"><span class="val">${riskRows.length}</span><span class="lbl">Students</span></div>
      <div class="stat-item"><span class="val">3</span><span class="lbl">Weakest standards each</span></div>
      <div class="stat-item"><span class="val">TCAP</span><span class="lbl">Practice route</span></div>
    </div>
    <p style="margin:14px 0 0;font-size:12px;color:#52525b"><b>Included:</b> ${riskRows.slice(0,4).map(r => r.name).join(', ')}${riskRows.length > 4 ? `, +${riskRows.length - 4} more` : ''}</p>
    <p style="margin:10px 0 0;font-size:12px;color:#71717a">Each plan targets that student's weakest standards. Prototype demo only.</p>
  `;
  document.getElementById('practiceAssignModalOverlay').classList.add('open');
}
function closePracticeAssignModal() {
  pendingPracticeAssign = null;
  document.getElementById('practiceAssignModalOverlay').classList.remove('open');
}
function confirmPracticeAssign() {
  const pending = pendingPracticeAssign;
  const count = pending?.mode === 'single' ? 1 : (pending?.count || 0);
  if (pending?.mode === 'single' && pending.studentId) {
    tcapPracticeAssignedStudentIds.add(pending.studentId);
  } else if (pending?.mode === 'bucket') {
    const rows = tcapPredictAll();
    rows.filter(r => r.pred.level.index <= 1).forEach(r => tcapPracticeAssignedStudentIds.add(r.id));
  }
  tcapPracticeAssignedCount = tcapPracticeAssignedStudentIds.size;
  pendingPracticeAssign = null;
  if (document.getElementById('sessionAnalyticsTcapPredictionsBody')) {
    renderTcapClass('sessionAnalyticsTcapPredictionsBody', null);
  }
  if (document.getElementById('assessmentDetailBody') && document.getElementById('page-assessment-detail')?.classList.contains('active')) {
    renderAssessmentDetail();
  }
  const icon = document.getElementById('practiceAssignIcon');
  const cancelBtn = document.getElementById('practiceAssignCancelBtn');
  const confirmBtn = document.getElementById('practiceAssignConfirmBtn');
  if (icon) {
    icon.className = 'modal-icon success';
    icon.textContent = '✓';
  }
  document.getElementById('practiceAssignTitle').textContent = 'Practice assigned';
  document.getElementById('practiceAssignSubtitle').textContent = count === 1 ? '1 student practice plan created' : `${count} student practice plans created`;
  document.getElementById('practiceAssignBody').innerHTML = `
    <p style="margin:0">The practice plan has been added to Teacher Assignments.</p>
    <div class="stat">
      <div class="stat-item"><span class="val">${count}</span><span class="lbl">Assigned</span></div>
      <div class="stat-item"><span class="val">Ready</span><span class="lbl">Status</span></div>
    </div>
    <p style="margin:14px 0 0;font-size:12px;color:#71717a">Prototype note: production would show assignment status, due date, and student notification details here.</p>
  `;
  if (cancelBtn) cancelBtn.style.display = 'none';
  if (confirmBtn) {
    confirmBtn.textContent = 'Done';
    confirmBtn.onclick = closePracticeAssignModal;
    confirmBtn.className = 'modal-confirm success';
  }
}

// ── Student: Diagnostic Report ────────────────────────────────────
// ── TCAP Practice Preview helpers (Student Diagnostic Report) ──
// Item pools by standard prefix. Each item is a "what we'd assign" preview, not a real
// runnable item — practice runtime is a V2 deliverable. Type/desc/sec are illustrative
// but realistic for the standard family.
const _TCAP_PRACTICE_ITEM_POOL = {
  RL: [
    { type:'MC',         label:'Multiple Choice',      sec:75,  desc:'Pick the sentence that best states the central idea or theme.' },
    { type:'Hot Text',   label:'Hot Text',             sec:120, desc:'Highlight the phrase that signals the theme.' },
    { type:'CR',         label:'Constructed Response', sec:180, desc:'Summarize the passage in 2 sentences using your own words.' }
  ],
  RI: [
    { type:'MC',         label:'Multiple Choice',      sec:90,  desc:"Identify the author's main purpose for including this paragraph." },
    { type:'Two-Part',   label:'Two-Part Evidence',    sec:120, desc:'Pick the answer + cite the supporting evidence sentence.' },
    { type:'CR',         label:'Constructed Response', sec:180, desc:'Explain how two informational ideas connect (cause→effect or compare→contrast).' }
  ],
  L: [
    { type:'MC',         label:'Multiple Choice',      sec:60,  desc:'What does the figurative phrase mean in context?' },
    { type:'FIB',        label:'Fill in the Blank',    sec:90,  desc:'Identify the device used: simile / metaphor / personification / idiom.' },
    { type:'Two-Part',   label:'Two-Part Evidence',    sec:100, desc:'Pick the metaphor + explain the comparison being made.' }
  ],
  W: [
    { type:'MC',         label:'Multiple Choice',      sec:75,  desc:'Which transition word best links the two paragraphs?' },
    { type:'CR',         label:'Constructed Response', sec:240, desc:'Add one supporting detail that strengthens the topic sentence.' },
    { type:'FIB',        label:'Fill in the Blank',    sec:60,  desc:'Choose the strongest organizational structure: chronological / problem-solution / cause-effect.' }
  ]
};
function tcapMockPracticeItems(stdCode, count) {
  const prefix = (stdCode || '').split('.')[0];
  const pool = _TCAP_PRACTICE_ITEM_POOL[prefix] || _TCAP_PRACTICE_ITEM_POOL.RL;
  return pool.slice(0, Math.max(1, count));
}
function tcapPracticeReason(acc) {
  return acc < 0.45 ? 'Foundation gap — start with worked examples'
       : acc < 0.6  ? 'Partial understanding — practice with feedback'
       :              'Near-mastery — challenge items to consolidate';
}
function tcapFmtSec(sec) {
  if (sec < 60) return sec + 's';
  const m = Math.floor(sec/60), s = sec % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}
function _tcapItemTypeColor(type) {
  switch(type){
    case 'MC':       return { bg:'#eef2ff', fg:'#4338ca', border:'#c7d2fe' };
    case 'Two-Part': return { bg:'#fdf4ff', fg:'#a21caf', border:'#f5d0fe' };
    case 'CR':       return { bg:'#fef3c7', fg:'#92400e', border:'#fde68a' };
    case 'FIB':      return { bg:'#ecfdf5', fg:'#047857', border:'#a7f3d0' };
    case 'Hot Text': return { bg:'#fff7ed', fg:'#c2410c', border:'#fed7aa' };
    default:         return { bg:'#f4f4f5', fg:'#52525b', border:'#e4e4e7' };
  }
}
function _tcapPreviewItemRow(item, idx) {
  const c = _tcapItemTypeColor(item.type);
  return `<div style="display:flex;gap:12px;padding:10px 12px;border:1px solid #eef0f4;border-radius:10px;background:#fff;align-items:flex-start">
    <div style="width:22px;flex-shrink:0;font-size:11px;font-weight:700;color:#a1a1aa;text-align:center;padding-top:2px">${idx+1}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;flex-wrap:wrap">
        <span style="font-size:10px;font-weight:800;letter-spacing:.3px;text-transform:uppercase;color:${c.fg};background:${c.bg};border:1px solid ${c.border};padding:2px 7px;border-radius:6px">${item.label}</span>
        <span style="font-size:10.5px;color:#71717a;font-variant-numeric:tabular-nums">~${tcapFmtSec(item.sec)}</span>
      </div>
      <div style="font-size:12.5px;color:#3f3f46;line-height:1.45">${item.desc}</div>
    </div>
  </div>`;
}
function _tcapPreviewStandardCard(st, items) {
  const pct = Math.round(st.acc * 100);
  const totalSec = items.reduce((s,it) => s + it.sec, 0);
  const itemsHtml = items.map((it,i) => _tcapPreviewItemRow(it,i)).join('');
  return `<section style="margin-bottom:14px;padding:14px;border:1px solid #eef0f4;border-radius:12px;background:#fafafa">
    <header style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px">
      <div style="min-width:0;flex:1">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px">
          <span style="font-size:13px;font-weight:800;color:#18181b">${st.code}</span>
          <span style="font-size:12px;color:#52525b;font-weight:500">· ${st.name}</span>
        </div>
        <div style="font-size:11px;color:#71717a">${st.category} · ${tcapPracticeReason(st.acc)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0">
        <div style="font-size:11px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.3px;font-weight:700">Diagnostic</div>
        <div style="font-size:15px;color:${tcapAcctBarColor(st.acc)};font-weight:800;font-variant-numeric:tabular-nums">${pct}%</div>
      </div>
    </header>
    <div style="display:flex;flex-direction:column;gap:6px">${itemsHtml}</div>
    <footer style="margin-top:10px;font-size:11px;color:#71717a;text-align:right;font-variant-numeric:tabular-nums">${items.length} items · ~${tcapFmtSec(totalSec)} total</footer>
  </section>`;
}
function openTcapPracticePreview(scope) {
  // scope === 'all' → full plan; otherwise scope is a standard code (e.g. 'RI.5.3')
  const cls = TCAP_CLASS;
  const stu = cls.students.find(s => s.id === cls.spotlightStudentId) || cls.students[0];
  const weakest = tcapWeakestStandards(stu, 5);
  const counts = [3,3,2,2,2];
  const titleEl = document.getElementById('tcapPracticePreviewTitle');
  const subEl   = document.getElementById('tcapPracticePreviewSubtitle');
  const iconEl  = document.getElementById('tcapPracticePreviewIcon');
  const bodyEl  = document.getElementById('tcapPracticePreviewBody');
  if (scope === 'all') {
    iconEl.textContent = '📋';
    titleEl.textContent = 'Your practice plan';
    const totalItems = weakest.reduce((sum,_st,i) => sum + counts[i], 0);
    const totalSec = weakest.reduce((sum,st,i) => {
      const items = tcapMockPracticeItems(st.code, counts[i]);
      return sum + items.reduce((s,it)=>s+it.sec, 0);
    }, 0);
    subEl.textContent = `${weakest.length} standards · ${totalItems} items · ~${tcapFmtSec(totalSec)} total`;
    bodyEl.innerHTML = `<p style="margin:0 0 14px;font-size:12.5px;color:#52525b;line-height:1.55">Each item is calibrated to your current level on that standard. After every miss, you'll see what the misconception was — that's how the gap closes faster than re-reading the passage.</p>` +
      weakest.map((st,i) => _tcapPreviewStandardCard(st, tcapMockPracticeItems(st.code, counts[i]))).join('');
  } else {
    const idx = weakest.findIndex(w => w.code === scope);
    const st = idx >= 0 ? weakest[idx] : weakest[0];
    const c  = idx >= 0 ? counts[idx]  : 2;
    const items = tcapMockPracticeItems(st.code, c);
    const totalSec = items.reduce((s,it)=>s+it.sec, 0);
    iconEl.textContent = '🎯';
    titleEl.textContent = `Preview · ${st.code}`;
    subEl.textContent = `${st.name} · ${items.length} items · ~${tcapFmtSec(totalSec)}`;
    bodyEl.innerHTML = _tcapPreviewStandardCard(st, items);
  }
  const ov = document.getElementById('tcapPracticePreviewOverlay');
  if (ov) {
    ov.dataset.scope = scope;
    ov.classList.add('open');
  }
}
function closeTcapPracticePreview() {
  const ov = document.getElementById('tcapPracticePreviewOverlay');
  if (ov) ov.classList.remove('open');
}
// Lazy-load html2canvas the first time the user clicks "Download as image".
let _html2canvasLoading = null;
function _loadHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  if (_html2canvasLoading) return _html2canvasLoading;
  _html2canvasLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    s.async = true;
    s.onload = () => resolve(window.html2canvas);
    s.onerror = () => { _html2canvasLoading = null; reject(new Error('Failed to load html2canvas')); };
    document.head.appendChild(s);
  });
  return _html2canvasLoading;
}
// Lucide Download + Loader2 SVGs, kept inline so we can swap on the button
// during the lazy-load + render cycle. currentColor lets them inherit the
// button text color (.modal-cancel → #52525b).
const _LUCIDE_DOWNLOAD_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
const _LUCIDE_LOADER_SVG   = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:tcSpin 0.7s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';

function downloadTcapPracticePreview() {
  const ov = document.getElementById('tcapPracticePreviewOverlay');
  const card = ov && ov.querySelector('.stu-modal');
  if (!card) return;
  const scope = (ov.dataset && ov.dataset.scope) || 'all';
  const safeScope = scope === 'all' ? 'plan' : scope.replace(/[^A-Za-z0-9.\-_]/g, '_');
  const filename = `tcap-practice-${safeScope}.png`;
  const btn  = document.getElementById('tcapPracticePreviewDlBtn');
  const lbl  = document.getElementById('tcapPracticePreviewDlLabel');
  const icon = document.getElementById('tcapPracticePreviewDlIcon');
  const origLabel = lbl ? lbl.textContent : '';
  if (btn)  btn.disabled = true;
  if (lbl)  lbl.textContent = 'Generating…';
  if (icon) icon.innerHTML = _LUCIDE_LOADER_SVG;
  _loadHtml2Canvas()
    .then(h2c => h2c(card, { backgroundColor: '#ffffff', scale: 2, useCORS: true, logging: false }))
    .then(canvas => {
      canvas.toBlob(blob => {
        if (!blob) throw new Error('toBlob returned null');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        if (typeof iteToast === 'function') iteToast(`Saved ${filename}`, 'success');
      }, 'image/png');
    })
    .catch(err => {
      console.error('[tcap practice preview] download failed', err);
      if (typeof iteToast === 'function') iteToast('Download failed — check your network and try again.', 'info');
    })
    .finally(() => {
      if (btn)  btn.disabled = false;
      if (lbl)  lbl.textContent = origLabel || 'Download as image';
      if (icon) icon.innerHTML = _LUCIDE_DOWNLOAD_SVG;
    });
}

function renderTcapStudentReport() {
  const cls = TCAP_CLASS;
  const gradeKey = tcapKey(cls.grade, cls.subject);
  const stds = TCAP_PROFILE.standardsMap[gradeKey] || [];
  const stu = cls.students.find(s => s.id === cls.spotlightStudentId) || cls.students[0];
  const pred = TCAPScoringAdapter.predict(stu, gradeKey);

  // Level ladder with scale-score cut points (so students see both their score & the bar to clear)
  const cuts = TCAPScoringAdapter.getCutScores(gradeKey);
  const ladder = TCAP_PROFILE.performanceLevels.map(lvl => {
    const active = lvl.id === pred.level.id;
    const passed = lvl.index < pred.level.index;
    const band = cuts[lvl.id];
    return `<div style="flex:1;padding:10px 8px;border-radius:8px;background:${active?lvl.bg:'#fafafa'};border:2px solid ${active?lvl.border:'#e4e4e7'};text-align:center;position:relative;opacity:${passed?.55:1}">
      <div style="font-size:10px;font-weight:700;color:${active?lvl.color:'#a1a1aa'};letter-spacing:.3px;text-transform:uppercase">${lvl.label}</div>
      <div style="font-size:10px;color:${active?lvl.color:'#a1a1aa'};margin-top:2px;font-variant-numeric:tabular-nums">${band[0]}–${band[1]}</div>
      <div style="font-size:10px;color:${active?lvl.color:'#a1a1aa'};margin-top:3px">${active?'← You are here':passed?'Passed':''}</div>
    </div>`;
  }).join('<div style="align-self:center;color:#d4d4d8;font-weight:700">→</div>');

  // Weakest + practice plan
  const weakest = tcapWeakestStandards(stu, 5);
  const practicePlan = weakest.map((st,i) => {
    const pct = Math.round(st.acc*100);
    const itemsRec = [3,3,2,2,2][i] || 2;
    const reason = st.acc < 0.45 ? 'Foundation gap — start with worked examples' : st.acc < 0.6 ? 'Partial understanding — practice with feedback' : 'Near-mastery — challenge items to consolidate';
    return `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border:1px solid #eef0f4;border-radius:10px;background:#fff">
      <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1">
        <div style="width:44px;height:44px;border-radius:10px;background:${tcapAccBg(st.acc)};color:${tcapAcctBarColor(st.acc)};font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${pct}%</div>
        <div style="min-width:0">
          <div style="font-size:13px;font-weight:700;color:#18181b">${st.code} <span style="font-weight:500;color:#52525b">· ${st.name}</span></div>
          <div style="font-size:11px;color:#71717a;margin-top:2px">${st.category} · ${reason}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
        <div style="font-size:11px;color:#52525b;font-weight:600;font-variant-numeric:tabular-nums">${itemsRec} items recommended</div>
        <button onclick="openTcapPracticePreview('${st.code}')" style="background:#f5f3ff;color:#5b21b6;border:1px solid #ddd6fe;padding:4px 10px;border-radius:6px;font-weight:700;font-size:11px;cursor:pointer;white-space:nowrap">Preview →</button>
      </div>
    </div>`;
  }).join('');

  // Gap to next level — expressed in TCAP scale points (the unit TDOE uses in reports)
  let gapHTML = '';
  if (pred.gapToNext) {
    const tgt = pred.gapToNext.nextLevel;
    gapHTML = `<div style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1px solid #ddd6fe;border-radius:12px;padding:18px 20px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#5b21b6;margin-bottom:8px">Gap to next level</div>
      <div style="font-size:16px;font-weight:700;color:#18181b;margin-bottom:4px">You're <span style="color:#5b21b6">${pred.gapToNext.scalePointsToNext} scale points</span> from <span style="color:${tgt.color}">${tgt.label}</span> (cut score ${pred.gapToNext.nextCutScore})</div>
      <div style="font-size:13px;color:#52525b;line-height:1.5">Mastering your ${weakest.slice(0,2).map(w=>w.code).join(' and ')} weaknesses should lift you past the cut. Your plan below targets ~${pred.gapToNext.itemsToNext} calibrated items — that's typically enough to cross the boundary.</div>
    </div>`;
  } else {
    gapHTML = `<div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:18px 20px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#047857;margin-bottom:8px">Mastered — keep it up</div>
      <div style="font-size:15px;color:#18181b;line-height:1.5">You're predicted at the top tier (scale score ${pred.scaleScore} · ${cuts.aboveProficient[0]}+ cut). Maintenance practice will keep you above the cut score through the April TCAP window.</div>
    </div>`;
  }

  // Reporting category bars
  const byCategory = {};
  weakest.concat(stds.filter(s => !weakest.find(w => w.code === s.code)).map(s => ({...s, acc: stu.standards[s.code] ?? 0.5 }))).forEach(s => {
    if (!byCategory[s.category]) byCategory[s.category] = [];
    byCategory[s.category].push(s);
  });
  const catHTML = Object.keys(byCategory).map(cat => {
    const arr = byCategory[cat];
    const avg = arr.reduce((sum,x) => sum + x.acc, 0) / arr.length;
    const pct = Math.round(avg*100);
    return `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #f4f4f5">
      <div style="flex:0 0 220px;font-size:12px;color:#3f3f46;font-weight:600">${cat}</div>
      <div style="flex:1;height:10px;background:#f4f4f5;border-radius:999px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${tcapAcctBarColor(avg)};border-radius:999px"></div></div>
      <div style="flex:0 0 48px;text-align:right;font-size:12px;color:${tcapAcctBarColor(avg)};font-weight:700">${pct}%</div>
    </div>`;
  }).join('');

  // Where You Stand — cohort percentile vs the rest of the class.
  // Uses real per-student predictions from tcapPredictAll() so the comparison is honest
  // (real prototype data, not invented numbers). Class is ~28 students; state-cohort
  // comparison would need a wider data source and is out of MVP scope.
  const cohortHTML = (() => {
    const all = tcapPredictAll(cls);
    const scores = all.map(r => r.pred.scaleScore).sort((a,b) => a - b);
    const n = scores.length;
    const my = pred.scaleScore;
    const lt = scores.filter(s => s <  my).length;
    const eq = scores.filter(s => s === my).length;
    const pct = Math.max(1, Math.min(99, Math.round((lt + 0.5*eq) / n * 100)));
    const qScore = (q) => {
      const pos = (q/100) * (n - 1);
      const lo = Math.floor(pos), hi = Math.ceil(pos);
      return Math.round(scores[lo] + (scores[hi] - scores[lo]) * (pos - lo));
    };
    const q25 = qScore(25), q50 = qScore(50), q75 = qScore(75);
    const cMin = scores[0], cMax = scores[n - 1];
    // Pad domain so labels at the ends don't clip.
    const span = Math.max(1, cMax - cMin);
    const domMin = cMin - span * 0.05;
    const domMax = cMax + span * 0.05;
    const xOf = (s) => 14 + ((s - domMin) / (domMax - domMin)) * 272;
    const myX = xOf(my), q25X = xOf(q25), q50X = xOf(q50), q75X = xOf(q75);
    // Build the contextual story so the number doesn't sit alone.
    let delta = '';
    if (pct >= 75) {
      delta = `Top quartile of the class — <b>+${my - q75}</b> above the 75th-percentile peer (${q75}).`;
    } else if (pct >= 50) {
      delta = `Above the median — <b>+${my - q50}</b> above the typical peer (${q50}); <b>+${q75 - my}</b> to reach the top quartile.`;
    } else if (pct >= 25) {
      delta = `Below the median — <b>${my - q50}</b> from the typical peer (${q50}); <b>+${q50 - my}</b> to reach the median.`;
    } else {
      delta = `Below the bottom quartile — <b>+${q25 - my}</b> to reach the 25th-percentile peer (${q25}).`;
    }
    const className = (cls.className || '').split(' · ').slice(0,2).join(' · ');
    return `
      <div style="background:#fff;border:1px solid #eef0f4;border-radius:12px;padding:20px;box-shadow:0 1px 2px rgba(0,0,0,.04)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <h3 style="margin:0;font-size:15px;font-weight:700;color:#18181b">Where You Stand</h3>
          <span style="font-size:10px;color:#5b21b6;font-weight:700;letter-spacing:.3px;text-transform:uppercase;background:#f5f3ff;border:1px solid #ddd6fe;padding:3px 8px;border-radius:999px">Peer Comparison</span>
        </div>
        <p style="font-size:11.5px;color:#71717a;margin:0 0 10px;line-height:1.45">Compared to <b>${n} Grade ${cls.grade} ${cls.subject.toUpperCase()} students</b> in ${className}.</p>
        <svg viewBox="0 0 300 78" style="width:100%;height:78px" role="img" aria-label="Cohort distribution with your position">
          <rect x="14" y="42" width="272" height="8" rx="4" fill="#f4f4f5"/>
          <rect x="${q25X}" y="42" width="${q75X - q25X}" height="8" rx="4" fill="#ddd6fe"/>
          <line x1="${q50X}" y1="36" x2="${q50X}" y2="56" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
          <text x="${q50X}" y="68" text-anchor="middle" font-size="9" fill="#7c3aed" font-weight="700">median ${q50}</text>
          <text x="14"  y="68" text-anchor="start" font-size="9" fill="#a1a1aa">${cMin}</text>
          <text x="286" y="68" text-anchor="end"   font-size="9" fill="#a1a1aa">${cMax}</text>
          <line x1="${myX}" y1="32" x2="${myX}" y2="40" stroke="${pred.level.color}" stroke-width="1.5"/>
          <circle cx="${myX}" cy="46" r="7" fill="${pred.level.color}" stroke="#fff" stroke-width="2.5"/>
          <text x="${myX}" y="22" text-anchor="middle" font-size="11" fill="${pred.level.color}" font-weight="800">You · ${my}</text>
        </svg>
        <div style="margin-top:6px;padding:10px 12px;background:#faf5ff;border:1px solid #ede9fe;border-radius:10px">
          <div style="font-size:13px;color:#18181b;line-height:1.5">Your scale score sits at the <b style="color:${pred.level.color}">${pct}${(()=>{const r=pct%100;if(r>=11&&r<=13)return'th';switch(pct%10){case 1:return'st';case 2:return'nd';case 3:return'rd';default:return'th';}})()} percentile</b> of this cohort.</div>
          <div style="font-size:11.5px;color:#52525b;line-height:1.5;margin-top:4px">${delta}</div>
        </div>
      </div>`;
  })();

  const body = `
    <div style="background:linear-gradient(135deg,${pred.level.bg},#fff);border:1px solid ${pred.level.border};border-radius:16px;padding:24px 28px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,.05)">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px">
        <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
          <div style="text-align:center">
            <div style="font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#52525b;margin-bottom:4px">Predicted Scale Score</div>
            <div style="font-size:56px;font-weight:800;color:${pred.level.color};line-height:1;font-variant-numeric:tabular-nums">${pred.scaleScore}</div>
            <div style="font-size:11px;color:#71717a;margin-top:4px">Range ${TCAP_PROFILE.scaleRange.min}–${TCAP_PROFILE.scaleRange.max}</div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#52525b;margin-bottom:4px">Performance Level</div>
            <div style="font-size:28px;font-weight:800;color:${pred.level.color};line-height:1;margin-bottom:8px">${pred.level.label}</div>
            <div style="font-size:13px;color:#52525b">Confidence <b>${pred.confidence}%</b> · Based on 45-item diagnostic</div>
            <div style="font-size:11px;color:#71717a;margin-top:4px">Student: <b>${stu.name}</b> · Grade ${cls.grade} ${cls.subject.toUpperCase()}</div>
          </div>
        </div>
        <div style="min-width:280px">
          <div style="display:flex;align-items:stretch;gap:6px">${ladder}</div>
        </div>
      </div>
    </div>

    ${gapHTML}

    <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:16px;align-items:start">
      <div style="background:#fff;border:1px solid #eef0f4;border-radius:12px;padding:20px;box-shadow:0 1px 2px rgba(0,0,0,.04)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <h3 style="margin:0;font-size:15px;font-weight:700;color:#18181b">🎯 Your Personalized Practice Plan</h3>
          <span style="font-size:11px;color:#6040ca;font-weight:700;background:#f5f3ff;padding:3px 10px;border-radius:999px;border:1px solid #ddd6fe">AI · Aligned to TN standards</span>
        </div>
        <p style="font-size:12px;color:#52525b;margin:0 0 12px;line-height:1.5">Focus on these ${weakest.length} standards this cycle. Each item is calibrated to your current level and explains the misconception when you miss it.</p>
        <div style="display:flex;flex-direction:column;gap:8px">${practicePlan}</div>
        <button onclick="openTcapPracticePreview('all')" style="width:100%;margin-top:14px;background:#6040ca;color:#fff;border:none;padding:12px 18px;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.04)">📋 See your practice plan</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="background:#fff;border:1px solid #eef0f4;border-radius:12px;padding:20px;box-shadow:0 1px 2px rgba(0,0,0,.04)">
          <h3 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#18181b">Reporting Categories</h3>
          <div>${catHTML}</div>
        </div>
        ${cohortHTML}
      </div>
    </div>
  `;
  document.getElementById('tcapStudentBody').innerHTML = body;
}

// ── Admin: Cut Score Config ───────────────────────────────────────
let tcapConfigGradeKey = 'g5_ela';
let tcapConfigReturnToAnalytics = false;
function openTcapCutScoresFromAnalytics() {
  tcapConfigReturnToAnalytics = true;
  nav('tcap-config');
}
function backToTcapAnalytics() {
  tcapConfigReturnToAnalytics = false;
  loadSessionDetail('sess-tcap-1','analytics');
}
// Helpers to parse / build the gradeKey: e.g. "g5_ela" → { grade:5, subject:'ela' }
function parseTcapKey(key) {
  const m = (key || '').match(/^g(\d+)_(.+)$/);
  return m ? { grade:parseInt(m[1],10), subject:m[2] } : { grade:5, subject:'ela' };
}
function renderTcapConfig(targetElId) {
  // `targetElId` lets the same editor body render either into the standalone
  // District-Admin tcap-config page (#tcapConfigBody, default) OR inline
  // into the session-detail page's Cut Scores tab panel
  // (#sessionCutScoresInlineBody). The body markup is identical — the only
  // surface-level difference is whether a "Back to Analytics" affordance is
  // needed, which the standalone page handles with its own back chip.
  const inline = !!targetElId && targetElId !== 'tcapConfigBody';
  const backBtn = document.getElementById('tcapConfigBackBtn');
  if (backBtn) backBtn.style.display = (!inline && tcapConfigReturnToAnalytics) ? 'inline-flex' : 'none';

  // Make sure the selected key is still valid (e.g. SS only allows G6-8). If not, snap to a valid one.
  if (!TCAP_CUT_STATE[tcapConfigGradeKey]) tcapConfigGradeKey = 'g5_ela';
  const sel = parseTcapKey(tcapConfigGradeKey);
  const subjectMeta = DW_TCAP_CONFIG.subjects.find(s => s.id === sel.subject) || DW_TCAP_CONFIG.subjects[0];
  const cuts = TCAPScoringAdapter.getCutScores(tcapConfigGradeKey);
  const cls = TCAP_CLASS;
  const rows = tcapPredictAll(cls);
  const counts = tcapLevelCounts(rows);
  const total = rows.length;
  const previewMatchesSel = (cls.grade === sel.grade && cls.subject === sel.subject);

  // Subject selector (4 subjects)
  const subjectButtons = DW_TCAP_CONFIG.subjects.map(s => {
    const active = s.id === sel.subject;
    return `<button onclick="tcapSetConfigSubject('${s.id}')" style="padding:8px 14px;border-radius:8px;border:1px solid ${active?'#6040ca':'#e4e4e7'};background:${active?'#f5f3ff':'#fff'};color:${active?'#5b21b6':'#52525b'};font-weight:${active?700:500};font-size:12px;cursor:pointer">${s.label}</button>`;
  }).join('');

  // Grade selector — restricted by current subject's gradeRange
  const grades = tcapGradesForSubject(sel.subject);
  const gradeButtons = grades.map(g => {
    const active = g === sel.grade;
    return `<button onclick="tcapSetConfigGradeNum(${g})" style="min-width:42px;padding:8px 12px;border-radius:8px;border:1px solid ${active?'#6040ca':'#e4e4e7'};background:${active?'#f5f3ff':'#fff'};color:${active?'#5b21b6':'#52525b'};font-weight:${active?700:500};font-size:12px;cursor:pointer">G${g}</button>`;
  }).join('');

  // Slider band — scale-score based, uses TCAP_PROFILE.scaleRange (300-450).
  const range = TCAP_PROFILE.scaleRange;
  const span = range.max - range.min;
  const lvls = TCAP_PROFILE.performanceLevels;

  const segments = lvls.map((lvl, i) => {
    const lo = cuts[lvl.id][0];
    const hi = cuts[lvl.id][1];
    const w = (hi - lo + 1) / span * 100;
    return `<div style="width:${w}%;background:${lvl.bg};border-right:${i<3?`2px solid ${lvl.color}`:'none'};position:relative;height:100%">
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:11px;font-weight:700;color:${lvl.color};white-space:nowrap">${lvl.shortLabel}</div>
    </div>`;
  }).join('');

  const sliders = lvls.slice(1).map((lvl, i) => {
    const val = cuts[lvl.id][0];
    return `<div style="padding:12px 16px;background:#fafafa;border:1px solid #eef0f4;border-radius:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:10px;height:10px;border-radius:2px;background:${lvl.color}"></span>
          <span style="font-size:12px;font-weight:700;color:#18181b">${lvl.label} starts at</span>
        </div>
        <span style="font-size:14px;font-weight:800;color:${lvl.color};font-variant-numeric:tabular-nums">${val}</span>
      </div>
      <input type="range" min="${range.min}" max="${range.max}" value="${val}" step="1" oninput="tcapCutSliderInput(${i},this.value)" onchange="tcapCutSliderInput(${i},this.value,true)" style="width:100%;accent-color:${lvl.color};cursor:pointer"/>
    </div>`;
  }).join('');

  // Predicted counts comparison
  const distRow = TCAP_PROFILE.performanceLevels.map(lvl => {
    const n = counts[lvl.id];
    const pct = total ? Math.round((n/total)*100) : 0;
    return `<div style="flex:1;padding:10px 12px;background:${lvl.bg};border:1px solid ${lvl.border};border-radius:8px;text-align:center">
      <div style="font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:${lvl.color}">${lvl.label}</div>
      <div style="font-size:22px;font-weight:800;color:${lvl.color};line-height:1;margin-top:4px">${n}</div>
      <div style="font-size:11px;color:${lvl.color};font-weight:600">${pct}%</div>
    </div>`;
  }).join('');

  const body = `
    <div style="background:#fff;border:1px solid #eef0f4;border-radius:12px;padding:20px;margin-bottom:16px;box-shadow:0 1px 2px rgba(0,0,0,.04)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px">
        <h3 style="margin:0;font-size:15px;font-weight:700;color:#18181b">Grade · Subject Profile</h3>
        <span style="font-size:11px;color:#71717a">Cut scores apply per (grade × subject). Edit one at a time.</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:11px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#71717a;min-width:54px">Subject</span>
          <div style="display:flex;gap:8px;flex-wrap:wrap">${subjectButtons}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:11px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#71717a;min-width:54px">Grade</span>
          <div style="display:flex;gap:6px;flex-wrap:wrap">${gradeButtons}</div>
          ${subjectMeta.gradeRange ? `<span style="font-size:10px;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;padding:2px 7px;border-radius:999px;font-weight:700;margin-left:6px">${subjectMeta.label}: G${subjectMeta.gradeRange[0]}–${subjectMeta.gradeRange[1]} only</span>` : ''}
        </div>
      </div>
      <div style="margin-top:14px;padding:10px 12px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;font-size:12px;color:#5b21b6;line-height:1.5">
        Editing <b>Grade ${sel.grade} ${subjectMeta.label}</b> · <b>21 Achievement profiles</b> (ELA / Math / Science G3–8, Social Studies G6–8) + <b>4 EOC profiles</b> (Algebra I, Geometry, English I, English II G9–10) — 25 total in pilot scope.
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;align-items:start">
      <div style="background:#fff;border:1px solid #eef0f4;border-radius:12px;padding:22px;box-shadow:0 1px 2px rgba(0,0,0,.04)">
        <h3 style="margin:0 0 6px;font-size:15px;font-weight:700;color:#18181b">Cut-Score Boundaries (scale score)</h3>
        <p style="margin:0 0 16px;font-size:12px;color:#52525b">Drag the sliders to set where each level begins. The bar below shows the resulting bands across the ${range.min}–${range.max} TCAP scale-score range. ${previewMatchesSel ? 'Changes preview against the current class below.' : `Live preview reflects the demo class (G${cls.grade} ${cls.subject.toUpperCase()}); switch the selector to G${cls.grade} ${cls.subject.toUpperCase()} to see counts move.`}</p>
        <div style="height:44px;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;display:flex;margin-bottom:8px">${segments}</div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:#a1a1aa;font-weight:600;margin-bottom:20px">
          <span>${range.min}</span><span>${Math.round(range.min + span*0.25)}</span><span>${Math.round(range.min + span*0.5)}</span><span>${Math.round(range.min + span*0.75)}</span><span>${range.max}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">${sliders}</div>
      </div>

      <div style="background:#fff;border:1px solid #eef0f4;border-radius:12px;padding:22px;box-shadow:0 1px 2px rgba(0,0,0,.04)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <h3 style="margin:0;font-size:15px;font-weight:700;color:#18181b">Live Class Preview</h3>
          <span style="font-size:10px;background:#ecfdf5;color:#047857;padding:3px 8px;border-radius:999px;font-weight:700;letter-spacing:.3px;text-transform:uppercase">Live</span>
        </div>
        <p style="margin:0 0 14px;font-size:12px;color:#52525b">Mr. Rivera · Grade ${cls.grade} ${cls.subject.toUpperCase()} · ${total} students${previewMatchesSel ? '' : ' <span style="color:#a16207">(demo class differs from selection)</span>'}</p>
        <div style="display:flex;gap:6px;margin-bottom:16px">${distRow}</div>
        <div style="padding:12px 14px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;font-size:12px;color:#78350f;line-height:1.5">
          <b>What changes here?</b> Moving a boundary 5 pts can shift several students across levels. TN DOE publishes official cut scores each year — confirm yours match before the pilot starts.
        </div>
        <div style="margin-top:12px;display:flex;gap:8px">
          ${inline
            ? `<button onclick="setSessionDetailTab('analytics')" style="flex:1;background:#fff;border:1px solid #e4e4e7;color:#18181b;padding:10px;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer">← Back to Analytics</button>`
            : `<button onclick="loadSessionDetail('sess-tcap-1','analytics')" style="flex:1;background:#fff;border:1px solid #e4e4e7;color:#18181b;padding:10px;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer">← Back to Analytics</button>`}
          <button onclick="tcapOpenStudentReport('${cls.spotlightStudentId}')" style="flex:1;background:#fff;border:1px solid #e4e4e7;color:#18181b;padding:10px;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer">Sample Student Report →</button>
        </div>
      </div>
    </div>
  `;
  const targetEl = document.getElementById(targetElId || 'tcapConfigBody');
  if (targetEl) targetEl.innerHTML = body;

  const classBadge = document.getElementById('tcapClassCutBadge');
  if (classBadge) {
    const changed = JSON.stringify(TCAP_CUT_STATE[tcapConfigGradeKey]) !== JSON.stringify(TCAP_PROFILE.defaultCutScores[tcapConfigGradeKey]);
    classBadge.innerHTML = `⚙️ Cut-score profile: ${changed ? '<b style="color:#5b21b6">Custom</b>' : 'District default'}`;
  }
}

function tcapSetConfigGrade(k) { tcapConfigGradeKey = k; renderTcapConfig(); }
// New 4-subject × full-grade selectors. Switching subject snaps the grade if the
// new subject doesn't cover the current grade (e.g. ELA G4 → SS G6).
function tcapSetConfigSubject(subjectId) {
  const sel = parseTcapKey(tcapConfigGradeKey);
  const newGrade = tcapSnapGradeToSubject(sel.grade, subjectId);
  tcapConfigGradeKey = `g${newGrade}_${subjectId}`;
  renderTcapConfig();
}
function tcapSetConfigGradeNum(g) {
  const sel = parseTcapKey(tcapConfigGradeKey);
  tcapConfigGradeKey = `g${g}_${sel.subject}`;
  renderTcapConfig();
}

// Move the [i]-th boundary (index 0 = approaching start, 1 = proficient start, 2 = aboveProficient start)
function tcapCutSliderInput(i, val, commit) {
  val = parseInt(val, 10);
  const cuts = TCAP_CUT_STATE[tcapConfigGradeKey];
  const lvls = ['belowBasic', 'approaching', 'proficient', 'aboveProficient'];
  const boundaryLevel = lvls[i+1];
  const prevLevel = lvls[i];
  // Enforce ordering — clamp within the scale-score range, not 0-99 (legacy bug).
  const range = TCAP_PROFILE.scaleRange;
  const min = (cuts[prevLevel][0]) + 1;
  const maxBoundaryLevel = lvls[i+2];
  const max = maxBoundaryLevel ? cuts[maxBoundaryLevel][0] - 1 : range.max;
  val = Math.max(min, Math.min(max, val));
  cuts[boundaryLevel][0] = val;
  cuts[prevLevel][1] = val - 1;
  renderTcapConfig();
}

function tcapResetCutScores() {
  TCAP_CUT_STATE[tcapConfigGradeKey] = JSON.parse(JSON.stringify(TCAP_PROFILE.defaultCutScores[tcapConfigGradeKey]));
  renderTcapConfig();
}

// ─── Student Profiles list page ────────────────────────────────────────────
let _stuProfileFilter = 'all'; // 'all' | 'ext' | 'iep' | '504' | 'ell'
function renderStudentProfilesPage() {
  const body = document.getElementById('studentProfilesBody');
  if (!body) return;
  const allCount = STUDENT_PROFILES.length;
  const extCount = STUDENT_PROFILES.filter(p => p.extendedTimeMultiplier > 1.0).length;
  const iepCount = STUDENT_PROFILES.filter(p => p.flags.includes('IEP')).length;
  const c504    = STUDENT_PROFILES.filter(p => p.flags.includes('504')).length;
  const ellCount = STUDENT_PROFILES.filter(p => p.flags.includes('ELL')).length;
  const filterBtn = (id, label, count, color) => {
    const active = _stuProfileFilter === id;
    return `<button onclick="_stuProfileFilter='${id}';renderStudentProfilesPage()" style="padding:7px 14px;border-radius:999px;border:1px solid ${active?(color||'#6040ca'):'#e4e4e7'};background:${active?(color||'#6040ca'):'#fff'};color:${active?'#fff':'#52525b'};font-weight:${active?700:500};font-size:12px;cursor:pointer">${label} <span style="margin-left:4px;font-weight:800">${count}</span></button>`;
  };
  const visible = STUDENT_PROFILES.filter(p => {
    if (_stuProfileFilter === 'all') return true;
    if (_stuProfileFilter === 'ext') return p.extendedTimeMultiplier > 1.0;
    return p.flags.includes(_stuProfileFilter);
  });
  // Summary card
  const summary = `
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px">
      <div style="background:#fff;border:1px solid #eef0f4;border-radius:10px;padding:14px"><div style="font-size:10.5px;color:#71717a;font-weight:700;text-transform:uppercase;letter-spacing:.3px">Total students</div><div style="font-size:24px;font-weight:800;color:#18181b;margin-top:4px">${allCount}</div></div>
      <div style="background:#fff;border:1px solid #eef0f4;border-radius:10px;padding:14px"><div style="font-size:10.5px;color:#5b21b6;font-weight:700;text-transform:uppercase;letter-spacing:.3px">Extended time</div><div style="font-size:24px;font-weight:800;color:#5b21b6;margin-top:4px">${extCount}</div></div>
      <div style="background:#fff;border:1px solid #eef0f4;border-radius:10px;padding:14px"><div style="font-size:10.5px;color:#5b21b6;font-weight:700;text-transform:uppercase;letter-spacing:.3px">IEP</div><div style="font-size:24px;font-weight:800;color:#18181b;margin-top:4px">${iepCount}</div></div>
      <div style="background:#fff;border:1px solid #eef0f4;border-radius:10px;padding:14px"><div style="font-size:10.5px;color:#0369a1;font-weight:700;text-transform:uppercase;letter-spacing:.3px">504 plan</div><div style="font-size:24px;font-weight:800;color:#18181b;margin-top:4px">${c504}</div></div>
      <div style="background:#fff;border:1px solid #eef0f4;border-radius:10px;padding:14px"><div style="font-size:10.5px;color:#a16207;font-weight:700;text-transform:uppercase;letter-spacing:.3px">ELL</div><div style="font-size:24px;font-weight:800;color:#18181b;margin-top:4px">${ellCount}</div></div>
    </div>`;
  // Filter chips
  const filters = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
      ${filterBtn('all','All students',allCount,'#6040ca')}
      ${filterBtn('ext','Extended time',extCount,'#5b21b6')}
      ${filterBtn('IEP','IEP',iepCount,'#5b21b6')}
      ${filterBtn('504','504 plan',c504,'#0369a1')}
      ${filterBtn('ELL','ELL',ellCount,'#a16207')}
    </div>`;
  // Table rows
  const rows = visible.map(p => {
    const flagPills = p.flags.length ? p.flags.map(flagPill).join('') : '<span style="font-size:11px;color:#a1a1aa">None</span>';
    const reason = p.extendedTimeReason ? `<span style="font-size:11px;color:#71717a;margin-left:6px">(${p.extendedTimeReason})</span>` : '';
    return `
      <div style="display:grid;grid-template-columns:auto 1fr 220px 200px auto;gap:14px;align-items:center;padding:14px 16px;border:1px solid #eef0f4;border-radius:10px;background:#fff">
        <div style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:999px;background:#f5f3ff;color:#5b21b6;font-size:13px;font-weight:800">${p.name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>
        <div style="min-width:0">
          <div style="font-size:14px;font-weight:700;color:#18181b">${p.name}</div>
          <div style="font-size:11.5px;color:#71717a;margin-top:2px">Grade ${p.grade} · ${p.homeroom} · ${p.id}</div>
        </div>
        <div>${flagPills}</div>
        <div style="display:flex;align-items:center;gap:6px">${extPill(p.extendedTimeMultiplier)}${reason}</div>
        <button onclick="openStudentProfileEdit('${p.id}')" style="background:#fff;color:#5b21b6;border:1px solid #ddd6fe;padding:7px 14px;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer">Edit</button>
      </div>`;
  }).join('');
  body.innerHTML = `
    ${summary}
    ${filters}
    <div style="display:flex;flex-direction:column;gap:8px">${rows || '<div style="padding:30px;text-align:center;color:#71717a">No students match this filter.</div>'}</div>
    <div style="margin-top:16px;padding:12px 14px;background:#fef3c7;border:1px solid #fde68a;border-radius:10px;font-size:12px;color:#78350f;line-height:1.5">
      <b>How Extended Time applies:</b> Setting a multiplier here auto-adjusts every Subpart timer for every TCAP assignment that student takes (e.g. ×1.2 turns ELA SP1 from 85 min → 102 min, SP2 from 50 min → 60 min, etc.). It is <b>not</b> a single lump-sum on the total. Per-assignment override is still possible from the Monitor row but does not write back to the profile.
    </div>
  `;
}

// Edit modal — reuses iteToast pattern. Stores state in a temp object and writes
// back on Save; Cancel discards. Multiplier supports 4 presets + custom number.
let _editingProfile = null;
function openStudentProfileEdit(id) {
  const p = getStudentProfile(id);
  if (!p) return;
  _editingProfile = JSON.parse(JSON.stringify(p));
  renderStudentProfileEditModal();
}
function renderStudentProfileEditModal() {
  if (!_editingProfile) return;
  const p = _editingProfile;
  const flagsHTML = ACCOMMODATION_FLAG_OPTIONS.map(f => {
    const on = p.flags.includes(f.id);
    return `<button onclick="toggleProfileFlag('${f.id}')" style="padding:8px 14px;border-radius:8px;border:2px solid ${on?f.color:'#e4e4e7'};background:${on?f.bg:'#fff'};color:${on?f.color:'#52525b'};font-weight:${on?700:500};font-size:12px;cursor:pointer;display:flex;align-items:center;gap:6px"><span style="width:9px;height:9px;border-radius:2px;background:${on?f.color:'#d4d4d8'}"></span>${f.label}</button>`;
  }).join('');
  const presetsHTML = EXT_TIME_PRESETS.map(preset => {
    const on = Math.abs(p.extendedTimeMultiplier - preset.value) < 0.01;
    return `<button onclick="setProfileMultiplier(${preset.value})" style="padding:10px 12px;border-radius:8px;border:2px solid ${on?'#5b21b6':'#e4e4e7'};background:${on?'#f5f3ff':'#fff'};color:${on?'#5b21b6':'#52525b'};text-align:left;cursor:pointer;font-size:12px">
      <div style="font-weight:700;font-size:13px;color:${on?'#5b21b6':'#18181b'}">${preset.label}</div>
      <div style="font-size:11px;color:#71717a;margin-top:2px">${preset.desc}</div>
    </button>`;
  }).join('');
  const isPreset = EXT_TIME_PRESETS.some(p2 => Math.abs(p2.value - p.extendedTimeMultiplier) < 0.01);
  const reasonOptions = ['IEP','504','ELL','Medical','Other'].map(r => `<option value="${r}" ${p.extendedTimeReason===r?'selected':''}>${r}</option>`).join('');
  // Subpart preview — show how multiplier expands ELA SP1's 85 min into the per-Subpart adjusted time.
  const elaSp1 = TCAP_SUBPART_BLUEPRINT.ela[0];
  const elaSp2 = TCAP_SUBPART_BLUEPRINT.ela[1];
  const adjustedSp1 = Math.ceil(elaSp1.minutes * p.extendedTimeMultiplier);
  const adjustedSp2 = Math.ceil(elaSp2.minutes * p.extendedTimeMultiplier);
  document.getElementById('stuProfileModalTitle').textContent = `Edit accommodations · ${p.name}`;
  document.getElementById('stuProfileModalBody').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:18px">
      <div>
        <div style="font-size:12px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#71717a;margin-bottom:8px">Accommodation flags</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${flagsHTML}</div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#71717a;margin-bottom:8px">Extended Time multiplier</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px">${presetsHTML}</div>
        <div style="display:flex;align-items:center;gap:10px">
          <label style="font-size:11.5px;color:#52525b;font-weight:600">Custom:</label>
          <input type="number" step="0.05" min="1.0" max="3.0" value="${p.extendedTimeMultiplier}" oninput="setProfileMultiplier(parseFloat(this.value))" style="width:90px;padding:7px 10px;border:1px solid #e4e4e7;border-radius:6px;font-size:12px;font-family:'SF Mono',monospace">
          <span style="font-size:10.5px;color:#71717a">Range 1.0–3.0 · current: <b>×${p.extendedTimeMultiplier.toFixed(2)}</b></span>
        </div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#71717a;margin-bottom:8px">Reason ${p.extendedTimeMultiplier > 1.0 ? '<span style="color:#dc2626;text-transform:none;font-weight:600">(required when multiplier ≠ 1.0)</span>' : ''}</div>
        <select onchange="_editingProfile.extendedTimeReason = this.value || null;renderStudentProfileEditModal()" style="width:100%;padding:9px 12px;border:1px solid #e4e4e7;border-radius:8px;font-size:13px;background:#fff">
          <option value="">— select reason —</option>
          ${reasonOptions}
        </select>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#71717a;margin-bottom:8px">Notes (optional)</div>
        <textarea oninput="_editingProfile.notes = this.value" rows="2" style="width:100%;padding:9px 12px;border:1px solid #e4e4e7;border-radius:8px;font-size:13px;font-family:inherit;resize:vertical">${p.notes || ''}</textarea>
      </div>
      <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:12px 14px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#5b21b6;margin-bottom:6px">Subpart preview (×${p.extendedTimeMultiplier.toFixed(2)})</div>
        <div style="font-size:12px;color:#27272a;line-height:1.7">
          ELA SP1 (Writing): <b>${elaSp1.minutes} min</b> → <b style="color:#5b21b6">${adjustedSp1} min</b><br>
          ELA SP2 (Literary Reading): <b>${elaSp2.minutes} min</b> → <b style="color:#5b21b6">${adjustedSp2} min</b><br>
          <span style="font-size:11px;color:#71717a">Adjusted per-Subpart, NOT lump-sum on total.</span>
        </div>
      </div>
    </div>`;
  document.getElementById('stuProfileModalOverlay').classList.add('open');
}
function toggleProfileFlag(flagId) {
  if (!_editingProfile) return;
  const idx = _editingProfile.flags.indexOf(flagId);
  if (idx >= 0) _editingProfile.flags.splice(idx, 1);
  else _editingProfile.flags.push(flagId);
  renderStudentProfileEditModal();
}
function setProfileMultiplier(v) {
  if (!_editingProfile || isNaN(v)) return;
  _editingProfile.extendedTimeMultiplier = Math.max(1.0, Math.min(3.0, v));
  renderStudentProfileEditModal();
}
function closeStudentProfileEdit() {
  _editingProfile = null;
  document.getElementById('stuProfileModalOverlay').classList.remove('open');
}
function saveStudentProfileEdit() {
  if (!_editingProfile) return;
  if (_editingProfile.extendedTimeMultiplier > 1.0 && !_editingProfile.extendedTimeReason) {
    alert('Please select a reason for the extended-time accommodation.');
    return;
  }
  const idx = STUDENT_PROFILES.findIndex(p => p.id === _editingProfile.id);
  if (idx >= 0) STUDENT_PROFILES[idx] = _editingProfile;
  iteToast(`✓ Saved accommodations for ${_editingProfile.name}`, 'ok');
  closeStudentProfileEdit();
  renderStudentProfilesPage();
}
function tcapSaveCutScores() {
  alert('✓ Admin demo: cut-score profile saved locally.\nTeacher flow treats this as a profile review, not a teacher publishing action.');
}

