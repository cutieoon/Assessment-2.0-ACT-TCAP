// @ts-nocheck
// Phase-2 slice: lines 22957-23153 of original src/app.ts

// ─────────────────────────────────────────────────────────────────────────
// Official score → US percentile lookup tables.
//
// Source for ACT: ACT National Norms, graduating classes 2022-2024 (the
// most recently published National Profile Report cohort). Each table
// maps the 1-36 scale score to its cumulative national percentile rank.
// Direct lookup, no estimation. STEM and ELA were retired by ACT in
// September 2023 and have no current published norms — they fall back to
// the legacy estimator and should be treated as illustrative.
//
// Source for SAT: College Board SAT User Percentiles 2024 ("nationally
// representative sample"). Sparse tables (every 50 / 25 points) with
// linear interpolation between anchors so any 10-point score resolves to
// a sensible percentile without storing 121 entries by hand.
// ─────────────────────────────────────────────────────────────────────────

const ACT_PERCENTILE_TABLES = {
  composite: { 36:100, 35:99, 34:99, 33:98, 32:96, 31:94, 30:92, 29:90, 28:87,
    27:84, 26:81, 25:76, 24:72, 23:67, 22:60, 21:55, 20:49, 19:42,
    18:36, 17:30, 16:24, 15:17, 14:12, 13:7, 12:4, 11:2, 10:1,
    9:1, 8:1, 7:1, 6:1, 5:1, 4:1, 3:1, 2:1, 1:1 },
  english:   { 36:99, 35:99, 34:98, 33:97, 32:96, 31:95, 30:93, 29:91, 28:89,
    27:87, 26:84, 25:81, 24:78, 23:74, 22:70, 21:65, 20:61, 19:56,
    18:51, 17:47, 16:41, 15:36, 14:26, 13:16, 12:8, 11:4, 10:1,
    9:1, 8:1, 7:1, 6:1, 5:1, 4:1, 3:1, 2:1, 1:1 },
  math:      { 36:99, 35:99, 34:99, 33:99, 32:99, 31:98, 30:97, 29:96, 28:94,
    27:91, 26:86, 25:80, 24:74, 23:67, 22:61, 21:55, 20:49, 19:38,
    18:26, 17:14, 16:6,  15:3,  14:1,  13:1, 12:1, 11:1, 10:1,
    9:1, 8:1, 7:1, 6:1, 5:1, 4:1, 3:1, 2:1, 1:1 },
  reading:   { 36:99, 35:98, 34:97, 33:96, 32:94, 31:92, 30:89, 29:87, 28:84,
    27:81, 26:77, 25:73, 24:68, 23:64, 22:59, 21:54, 20:50, 19:45,
    18:40, 17:35, 16:28, 15:19, 14:12, 13:7, 12:3, 11:1, 10:1,
    9:1, 8:1, 7:1, 6:1, 5:1, 4:1, 3:1, 2:1, 1:1 },
  science:   { 36:99, 35:99, 34:99, 33:98, 32:97, 31:96, 30:94, 29:92, 28:88,
    27:83, 26:76, 25:67, 24:58, 23:49, 22:41, 21:32, 20:26, 19:19,
    18:12, 17:6,  16:3,  15:1,  14:1,  13:1, 12:1, 11:1, 10:1,
    9:1, 8:1, 7:1, 6:1, 5:1, 4:1, 3:1, 2:1, 1:1 }
};

const SAT_PERCENTILE_TABLES = {
  total: { 400:1, 500:1, 600:1, 700:2, 800:9, 850:16, 900:23, 950:32,
    1000:41, 1050:50, 1100:59, 1150:67, 1200:75, 1250:80, 1300:87,
    1350:92, 1400:95, 1450:98, 1500:99, 1550:99, 1600:99 },
  rw:    { 200:1, 250:1, 300:1, 350:2, 400:11, 450:27, 500:44, 550:60,
    600:75, 650:86, 700:93, 750:98, 800:99 },
  math:  { 200:1, 250:1, 300:1, 350:3, 400:11, 450:25, 500:41, 550:56,
    600:70, 650:81, 700:91, 750:96, 800:99 }
};

// Linear interpolation between sparse table anchors. Used for SAT (10-point
// score grain) so we don't have to hand-write 121 total-score entries.
function _percentileFromTable(table, score) {
  const keys = Object.keys(table).map(Number).sort((a,b) => a-b);
  if (!keys.length) return null;
  if (score <= keys[0]) return table[keys[0]];
  if (score >= keys[keys.length - 1]) return table[keys[keys.length - 1]];
  for (let i = 0; i < keys.length - 1; i++) {
    if (score >= keys[i] && score <= keys[i + 1]) {
      const frac = (score - keys[i]) / (keys[i + 1] - keys[i]);
      return Math.round(table[keys[i]] + frac * (table[keys[i + 1]] - table[keys[i]]));
    }
  }
  return null;
}

function actPercentile(scoreType, score) {
  const tbl = ACT_PERCENTILE_TABLES[scoreType];
  if (!tbl) return null;
  const s = Math.round(score || 0);
  if (s < 1 || s > 36) return null;
  return tbl[s] != null ? tbl[s] : null;
}

function satPercentile(scoreType, score) {
  const tbl = SAT_PERCENTILE_TABLES[scoreType];
  if (!tbl) return null;
  return _percentileFromTable(tbl, score || 0);
}

// Legacy approximation. Kept ONLY for ACT STEM / ELA (retired by ACT in
// 2023, no published norms exist) and as a defensive fallback. New code
// should call actPercentile / satPercentile so percentiles trace back to
// official norms.
function _estimatePercentile(score, max) {
  const p = score / max;
  if (p >= 0.97) return 99;
  if (p >= 0.90) return 90 + Math.round((p - 0.90) * 100);
  if (p >= 0.50) return 50 + Math.round((p - 0.50) * 100);
  return Math.max(1, Math.round(p * 60));
}

function _mergeActScores() {
  const st = STU_STATE['stu-act'];
  if (!st?._finalScores) return;
  const fs = st._finalScores, ss = fs.scaledSections;
  ACT_REPORT.composite = fs.composite;
  ACT_REPORT.scores = { english: ss.english||0, math: ss.math||0, reading: ss.reading||0, science: ss.science||0 };
  ACT_REPORT.derived.stem = ss.stem||0;
  ACT_REPORT.derived.ela = ss.ela||0;
  ACT_REPORT.testDate = new Date().toLocaleDateString('en-US', { month:'long', year:'numeric' });

  const secPct = {};
  Object.entries(fs.sectionScores).forEach(([id, s]) => {
    const k = id.replace('act-','').replace('eng','english');
    secPct[k] = s.total > 0 ? s.correct / s.total : 0;
  });

  // composite + 4 core sections come from official ACT National Norms
  // tables (see ACT_PERCENTILE_TABLES). STEM and ELA were retired by ACT
  // in Sept 2023 and have no published norms, so they fall back to the
  // legacy estimator and are flagged as such in code.
  ['composite','english','math','reading','science','stem','ela'].forEach(k => {
    const v = k === 'composite' ? fs.composite : (k === 'stem' ? ss.stem : k === 'ela' ? ss.ela : ACT_REPORT.scores[k]);
    const official = actPercentile(k, v);
    ACT_REPORT.usRank[k] = official != null ? official : _estimatePercentile(v, 36);
    ACT_REPORT.stateRank[k] = Math.max(1, ACT_REPORT.usRank[k] - Math.floor(Math.random() * 15 + 5));
  });

  Object.entries(ACT_REPORT.categories).forEach(([sec, data]) => {
    const p = secPct[sec] || 0.5;
    data.score = ACT_REPORT.scores[sec] || 0;
    data.items.forEach(cat => {
      const jitter = 0.9 + Math.random() * 0.2;
      cat.correct = Math.round(cat.total * p * jitter);
      cat.correct = Math.min(cat.correct, cat.total);
      cat.pct = Math.round(cat.correct / cat.total * 100);
      cat.inRange = cat.pct >= 60;
      if (cat.subs) {
        cat.subs.forEach(sub => {
          const sj = 0.85 + Math.random() * 0.3;
          sub.correct = Math.round(sub.total * p * sj);
          sub.correct = Math.min(sub.correct, sub.total);
          sub.pct = Math.round(sub.correct / sub.total * 100);
        });
      }
    });
  });

  ACT_REPORT.ncrc = fs.composite >= 26 ? 'Gold' : fs.composite >= 22 ? 'Silver' : 'Bronze';
}

function _mergeSatScores() {
  const st = STU_STATE['stu-sat'];
  if (!st?._finalScores) return;
  const fs = st._finalScores, ss = fs.scaledSections;
  SAT_REPORT.total = fs.composite;
  SAT_REPORT.rw = ss.rw || 200;
  SAT_REPORT.math = ss.math || 200;
  SAT_REPORT.testDate = new Date().toLocaleDateString('en-US', { month:'long', year:'numeric' });

  const sem = 30;
  SAT_REPORT.scoreRange = {
    total: [Math.max(400, fs.composite - sem * 2), Math.min(1600, fs.composite + sem * 2)],
    rw: [Math.max(200, ss.rw - sem), Math.min(800, ss.rw + sem)],
    math: [Math.max(200, ss.math - sem), Math.min(800, ss.math + sem)]
  };

  // SAT percentiles come from College Board's User Percentile Ranks (2024
  // nationally-representative sample). Sparse anchor table with linear
  // interpolation; see SAT_PERCENTILE_TABLES + _percentileFromTable.
  SAT_REPORT.percentile = {
    total: satPercentile('total', fs.composite),
    rw:    satPercentile('rw', ss.rw),
    math:  satPercentile('math', ss.math)
  };

  SAT_REPORT.allTesterAvg = { total: 1028, rw: 520, math: 508 };

  function _scoreToBand(score) {
    if (score >= 680) return 7;
    if (score >= 610) return 6;
    if (score >= 550) return 5;
    if (score >= 490) return 4;
    if (score >= 420) return 3;
    if (score >= 370) return 2;
    return 1;
  }
  SAT_REPORT.bands = {
    rw: SAT_BAND_LABELS[_scoreToBand(ss.rw)] || '200–360',
    math: SAT_BAND_LABELS[_scoreToBand(ss.math)] || '200–360'
  };

  const rwPct = ss.rwTotal > 0 ? ss.rwRaw / ss.rwTotal : 0.5;
  const mPct = ss.mathTotal > 0 ? ss.mathRaw / ss.mathTotal : 0.5;
  ['rw','math'].forEach(sec => {
    const basePct = sec === 'rw' ? rwPct : mPct;
    const secScore = sec === 'rw' ? ss.rw : ss.math;
    SAT_REPORT.domains[sec].forEach(dm => {
      const jitter = 0.85 + Math.random() * 0.3;
      dm.mastery = Math.max(10, Math.min(100, Math.round(basePct * 100 * jitter)));
      dm.band = _scoreToBand(Math.round(secScore * (dm.mastery / 100) + secScore * 0.3));
      dm.band = Math.max(1, Math.min(7, dm.band));
      dm.bandLabel = SAT_BAND_LABELS[dm.band];
    });
  });
}

