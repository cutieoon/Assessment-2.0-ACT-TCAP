// @ts-nocheck
// Phase-2 slice: lines 22203-22351 of original src/app.ts


// ═══════ ACT SCORE REPORT ═══════

const STUDENT_PROFILE = {
  name:'Ann C. Taylor', id:'STU-20129321', grade:'11th Grade',
  school:'Wheat Ridge Senior High School', schoolCode:'061-450',
  dob:'Sep 1, 2008', gradYear:'2026', state:'Colorado',
};

function renderStudentInfoBar(containerId, testType, testDate) {
  const s = STUDENT_PROFILE;
  const initials = s.name.split(' ').map(w=>w[0]).join('').slice(0,2);
  // Student profile fields beyond `name` (id / grade / class year / etc.)
  // come from the SIS roster, which the prototype doesn't actually wire up
  // reliably. Drop the meta line until that data path exists so the UI
  // doesn't promise data we can't obtain.
  document.getElementById(containerId).innerHTML = `
    <div class="sp-avatar">${initials}</div>
    <div class="sp-main">
      <div class="sp-name">${s.name}</div>
    </div>
    <div class="sp-fields">
      <div class="sp-field"><span class="sp-fl">Test Date</span><span class="sp-fv">${testDate}</span></div>
      <div class="sp-field"><span class="sp-fl">State</span><span class="sp-fv">${s.state}</span></div>
    </div>
  `;
}

function downloadReport(bodyId, filename) {
  const body = document.getElementById(bodyId);
  const s = STUDENT_PROFILE;
  const testDate = bodyId==='actReportBody' ? ACT_REPORT.testDate : SAT_REPORT.testDate;
  const isACT = bodyId==='actReportBody';
  const accent = isACT ? '#6C3FE4' : '#2563eb';

  let iframe = document.getElementById('pdfFrame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'pdfFrame';
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:210mm;height:297mm;border:none';
    document.body.appendChild(iframe);
  }
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${filename}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fff;color:#27272a;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      @page{size:A4;margin:10mm 14mm}
      .ph{background:linear-gradient(135deg,#190d40,#2d1b69);padding:20px 24px;color:#fff;display:flex;align-items:center;justify-content:space-between}
      .ph h1{font-size:16px;font-weight:700;margin:0}
      .ph .pl{font-size:13px;font-weight:700;color:${accent};opacity:.9}
      .ps{display:flex;align-items:center;gap:16px;padding:16px 24px;border-bottom:1px solid #e4e4e7;background:#fafafa}
      .ps .av{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,${accent},#a78bfa);color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;flex-shrink:0}
      .ps .nm{font-size:16px;font-weight:800;color:#190d40}
      .ps .mt{font-size:11px;color:#71717a;margin-top:2px}
      .ps .fg{display:grid;grid-template-columns:repeat(4,auto);gap:2px 18px}
      .ps .fl{font-size:8px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:.4px}
      .ps .fv{font-size:11px;font-weight:600;color:#27272a}
      .pb{padding:16px 24px}
    </style>
    <style>${document.querySelector('style').textContent}</style>
  </head><body>
    <div class="ph">
      <h1>${filename.replace(/_/g,' ')}</h1>
      <span class="pl">Kira Learning</span>
    </div>
    <div class="ps">
      <div class="av">${s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
      <div style="flex:1;min-width:0">
        <div class="nm">${s.name}</div>
        <div class="mt">ID: ${s.id} · ${s.grade} · Class of ${s.gradYear}</div>
      </div>
      <div class="fg">
        <div><div class="fl">Test Date</div><div class="fv">${testDate}</div></div>
        <div><div class="fl">State</div><div class="fv">${s.state}</div></div>
      </div>
    </div>
    <div class="pb">${body.innerHTML}</div>
  </body></html>`);
  doc.close();
  setTimeout(() => { iframe.contentWindow.print(); }, 300);
}

const ACT_REPORT = {
  testDate:'April 2025', composite:24,
  scores:{ english:26, math:22, reading:25, science:21 },
  /* Optional. When non-empty, the Composite KPI card renders a trend
     chip (e.g. "↑ +2 vs Mar"). When empty/undefined, NO chip is shown
     — never fake progress. Latest entry = most recent prior attempt. */
  priorAttempts:[
    { date:'March 2025', composite:22 }
  ],
  derived:{ stem:22, ela:26, writing:8, writingReviewState:'Scored by Kira AI',
    /* Optional teacher-authored feedback shown below the rubric grid.
       Empty / missing → entire feedback callout is hidden (no AI fallback,
       no algorithmic "next step" — students only see human notes). */
    writingTeacherFeedback:'Your stance is clear and the "magnifying the gap" closing really lands. The "structural support" idea in paragraph 2 stays abstract though — name one school where this gap actually shows up, even just one line. Paragraph 3 lists competencies but doesn\'t anchor any one of them; pick the strongest (research? presentation?) and give it two full sentences. Strong voice overall. — Ms. Patel',
    writingDomains:{ 'Ideas and Analysis':8, 'Development and Support':7, 'Organization':9, 'Language Use and Conventions':8 },
    /* Single-essay session telemetry. Time is in minutes, with 40-min
       allotment per ACT spec. Word target 300–500 reflects published ACT
       Writing rubric guidance for upper-tier responses. */
    writingMeta:{
      timeUsedMin:32, timeAllowedMin:40,
      wordCount:412, wordTarget:[300,500],
      rater1:8, rater2:8,                 // single domain reading per rater is summed in domain scores; overall agreement shown here
      raterAgreement:'agreed',            // 'agreed' | 'minor' | 'third-rater'
      promptTitle:'Capstone Projects and Graduation',
      essayPreview:'In recent years, schools across the country have begun debating whether every student should be required to complete a capstone project before graduation. While some educators argue that capstones provide an invaluable bridge between classroom learning and real-world problem solving, others worry that the requirement adds stress to already overworked students and may not be supported equally across schools.\n\nI believe that capstone projects should be required, but only when paired with structural support — flexible topic selection, faculty mentorship, and dedicated time within the school week. Without that scaffolding, the requirement risks becoming yet another inequity, magnifying the gap between students with abundant resources and those without.\n\nThe argument for capstones rests on a simple truth: meaningful learning happens when students are forced to apply, not just absorb. A capstone demands research, project planning, iteration, and public presentation — competencies every college and career will expect. The opposing view that students are already overloaded is real, but the answer is not to remove the experience; it is to make space for it.'
    }
  },
  // Percentiles below come from ACT_PERCENTILE_TABLES (official ACT
  // National Norms 2022-2024) for composite + 4 core sections. STEM and
  // ELA fall back to the legacy estimator (no published norms).
  // Re-derive any time scores change by calling actPercentile(key, score).
  usRank:{ composite:72, english:84, math:61, reading:73, science:32, stem:61, ela:72 },
  stateRank:{ composite:60, english:72, math:49, reading:60, science:22, stem:50, ela:60 },
  benchmarks:{ english:18, math:22, reading:22, science:23, stem:26, ela:20 },
  ncrc:'Silver',
  categories:{
    english:{ score:26, items:[
      {name:'Production of Writing',correct:13,total:17,pct:76,inRange:true},
      {name:'Knowledge of Language',correct:7,total:9,pct:78,inRange:true},
      {name:'Conventions of Standard English',correct:13,total:17,pct:76,inRange:true},
    ]},
    math:{ score:22, items:[
      {name:'Preparing for Higher Math',correct:20,total:33,pct:61,inRange:false, subs:[
        {name:'Number & Quantity',correct:3,total:5,pct:60},
        {name:'Algebra',correct:5,total:8,pct:63},
        {name:'Functions',correct:4,total:8,pct:50},
        {name:'Geometry',correct:5,total:8,pct:63},
        {name:'Statistics & Probability',correct:3,total:4,pct:75},
      ]},
      {name:'Integrating Essential Skills',correct:5,total:8,pct:63,inRange:false},
      {name:'Modeling',correct:10,total:16,pct:63,inRange:false},
    ]},
    reading:{ score:25, items:[
      {name:'Key Ideas & Details',correct:11,total:14,pct:79,inRange:true},
      {name:'Craft & Structure',correct:7,total:9,pct:78,inRange:true},
      {name:'Integration of Knowledge & Ideas',correct:5,total:7,pct:71,inRange:true},
    ]},
    science:{ score:21, items:[
      {name:'Interpretation of Data',correct:9,total:17,pct:53,inRange:false},
      {name:'Scientific Investigation',correct:4,total:9,pct:44,inRange:false},
      {name:'Evaluation of Models, Inferences & Experimental Results',correct:5,total:10,pct:50,inRange:false},
    ]},
  },
};

