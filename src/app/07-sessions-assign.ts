// @ts-nocheck
// Phase-2 slice: lines 3515-6210 of original src/app.ts

// ═══════ SESSIONS / ASSIGN FLOW ═══════
const SESSION_DATA = [
  {
    id:'sess-generic-1', testType:'generic', icon:'📄', title:'Mid-Term Science Review', teacher:'Ms. Johnson',
    className:'Period 3 — English 10', status:'Completed', progress:100, deliveryMode:'Live Mode',
    window:'Mar 15, 2026 · 9:00 AM - 11:00 AM', gradingModel:'Mixed auto + manual grading',
    releaseRule:'Teacher reviews short answers, then releases all reports together.',
    reportState:'pending_release', explanationSources:['Answer Key','Teacher Override','Skill Tags'],
    students:12, ready:0, inProgress:0, submitted:12, graded:9, pendingRelease:3, released:0,
    subtitle:'Assessment session setup for teacher-created exam',
    lastModifiedAt:'Mar 15, 2026',
    assignmentCode:'GEN-0315',
    timeLimitMinutes:45,
    windowStatus:'Closed',
    closedAt:'Mar 15, 2026, 11:00',
    scoreSource:['Answer Key','Teacher Override'],
    sectionOrder:['Science Review'],
    sectionTiming:[{label:'Science Review', minutes:45}],
    calculatorPolicy:'Standard classroom tools only.',
    launchPolicy:'Students must complete the ready check before starting.',
    currentPhase:'Release',
    autoSubmitEnabled:true,
    fiveMinuteWarningEnabled:true,
    compositeRefreshBehavior:'Teacher changes update scores immediately; student reports refresh on release.',
    studentRows:[
      { name:'Bob Kim', grade:'10', score:'88%', status:'Submitted', reportState:'Pending Release', progress:'12 / 12', lastActivity:'Teacher override saved · 10:41 AM' },
      { name:'Emma Wilson', grade:'10', score:'84%', status:'Submitted', reportState:'Locked', progress:'12 / 12', lastActivity:'Awaiting teacher review' }
    ]
  },
  {
    id:'sess-act-1', testType:'act', icon:'📝', title:'ACT Practice Exam #3', teacher:'Ms. Johnson',
    className:'Period 2 — College Prep', status:'In Progress', progress:68, deliveryMode:'Live Mode',
    window:'Apr 10, 2026 · 8:30 AM - 12:15 PM', gradingModel:'Auto-grade MC + teacher review Writing',
    releaseRule:'ACT reports are available to students after submission; optional Writing can remain awaiting review.',
    reportState:'available_after_submit', explanationSources:['Answer Key','Response Pattern','Skill Tags'],
    students:28, ready:4, inProgress:19, submitted:5, graded:0, pendingRelease:0, released:0,
    subtitle:'Standardized Assessment Setup for ACT',
    lastModifiedAt:'Feb 24, 2026',
    assignmentCode:'ACT-ENH-2402',
    timeLimitMinutes:125,
    windowStatus:'Expired',
    closedAt:'Feb 10, 2026, 17:00',
    scoreSource:['Answer Key','Teacher Override'],
    sectionOrder:['English','Math','Reading','Science','Writing (Optional)'],
    sectionTiming:[
      {label:'English', minutes:35},
      {label:'Math', minutes:50},
      {label:'Reading', minutes:40},
      {label:'Science', minutes:40},
      {label:'Writing', minutes:40}
    ],
    calculatorPolicy:'Calculator is available for Math only.',
    launchPolicy:'Students must pass the ready check before the ACT shell unlocks.',
    currentPhase:'Monitor',
    autoSubmitEnabled:true,
    fiveMinuteWarningEnabled:true,
    compositeRefreshBehavior:'ACT score reports are available after submission; Writing review updates the optional Writing score when completed.',
    studentRows:[
      { name:'Avery Parker', grade:'11', score:'1 / 36', status:'Auto-Submitted', progress:'ENG 0/50 · Math 0/45 · Reading 0/36 · Science 0/40', lastActivity:'Expired · Auto-submitted at 12:15 PM' },
      { name:'Mia Collins', grade:'11', score:'24 / 36', status:'Submitted', progress:'ENG 42/50 · Math 31/45 · Reading 26/36 · Science 25/40', lastActivity:'Writing updated · 1:04 PM' },
      { name:'Noah Patel', grade:'11', score:'22 / 36', status:'Submitted', progress:'ENG 38/50 · Math 28/45 · Reading 23/36 · Science 22/40', lastActivity:'Waiting for writing review' },
      { name:'Sophia Lee', grade:'11', score:'In progress', status:'In Progress', progress:'ENG 50/50 · Math 23/45 · Reading 0/36 · Science 0/40', lastActivity:'Math section active · 10:42 AM' },
      { name:'Ethan Brooks', grade:'11', score:'Not started', status:'Not Started', progress:'ENG 0/50 · Math 0/45 · Reading 0/36 · Science 0/40', lastActivity:'Waiting for student to join' }
    ]
  },
  {
    // Sample sibling assignments under the same ACT assessment so the Setup
    // page's "View All Assignments" grid renders multiple cards (matches the
    // FE assignment list pattern shown in the reference design).
    id:'sess-act-1b', parentAssessmentId:'sess-act-1', testType:'act', icon:'📝',
    title:'ACT Full Battery Assessment', teacher:'Ms. Johnson',
    className:'Period 4 — College Prep', status:'Scheduled', progress:0, deliveryMode:'Scheduled Mode',
    window:'Feb 10, 2026, 5:00 PM', students:1, ready:0, inProgress:0, submitted:0, graded:0,
    timeLimitMinutes:125, windowStatus:'Expired', closedAt:'Feb 10, 2026, 5:00 PM',
    lastModifiedAt:'Feb 2, 2026', assignmentCode:'ACT-FULL-0210',
    sectionOrder:['English','Math','Reading','Science','Writing (Optional)']
  },
  {
    id:'sess-act-1c', parentAssessmentId:'sess-act-1', testType:'act', icon:'📝',
    title:'ACT Full Battery Assessment', teacher:'Ms. Johnson',
    className:'Period 5 — College Prep', status:'In Progress', progress:0, deliveryMode:'Live Mode',
    window:'Feb 10, 2026 · 1:30 PM', students:1, ready:0, inProgress:1, submitted:0, graded:0,
    timeLimitMinutes:125, windowStatus:'Expired', closedAt:'Feb 10, 2026, 5:00 PM',
    lastModifiedAt:'Feb 2, 2026', assignmentCode:'ACT-FULL-LIVE',
    sectionOrder:['English','Math','Reading','Science','Writing (Optional)']
  },
  {
    // ─── TCAP Test "Grade 5 ELA Aug 2025" — 1 record with embedded subparts ───
    // Market-standard model (TestNav / Schoolnet / PowerSchool / Mastery Connect):
    // a single Test/Assessment record carries N embedded Sections that can each be
    // independently scheduled, locked, monitored, and analytics-released. NO
    // separate Assignment record per Subpart, NO Group container layer.
    // Top-level fields are aggregated views (status, students, etc.) derived
    // from the active SP for legacy UI; per-SP data lives in `subparts[]`.
    id:'sess-tcap-1', testType:'tcap', icon:'🏛',
    title:'Grade 5 ELA — TCAP Diagnostic Aug 2025', teacher:'Mr. Rivera',
    tcapSubject:'ela', tcapGrade:5, blueprintKey:'ela',
    cohortClassName:'Grade 5 ELA · Period 2', cohortStudents:28,
    cutScoreProfileKey:'g5_ela',
    windowStart:'2025-08-14', windowEnd:'2025-08-17',
    className:'Grade 5 ELA · Period 2', status:'Completed', progress:100, deliveryMode:'Scheduled Mode',
    window:'Aug 14–17, 2025 · 4 Subparts',
    gradingModel:'Auto-grade SP2/SP3/SP4 + Human review SP1 essay',
    releaseRule:'Composite ELA score releases after ALL 4 Subparts are submitted.',
    reportState:'pending_release', explanationSources:['Answer Key','Standards Crosswalk','Skill Tags','Cut Score Profile','Rubric'],
    students:28, ready:0, inProgress:0, submitted:28, graded:26, pendingRelease:2, released:0,
    subtitle:'TCAP G5 ELA · 4 Subparts · 235 min total (with ext-time 282 min)',
    lastModifiedAt:'Aug 17, 2025',
    assignmentCode:'TCAP-G5-ELA-AUG2025',
    timeLimitMinutes:235,                      // sum of all 4 SP minutes
    windowStatus:'Closed', closedAt:'Aug 17, 2025, 10:00',
    scoreSource:['Answer Key','Standards Crosswalk','Cut Score Profile','Rubric'],
    sectionOrder:['SP1 Writing','SP2 Literary Reading','SP3 Informational Reading','SP4 Language & Conventions'],
    sectionTiming:[
      {label:'SP1 Writing', minutes:85},
      {label:'SP2 Literary Reading', minutes:50},
      {label:'SP3 Informational Reading', minutes:50},
      {label:'SP4 Language & Conventions', minutes:50}
    ],
    calculatorPolicy:'N/A — ELA (no calculator on any SP).',
    launchPolicy:'SP1 must be first; SP2-4 unlock after SP1 closes; each SP requires ready check.',
    currentPhase:'Released',
    autoSubmitEnabled:true, fiveMinuteWarningEnabled:true,
    compositeRefreshBehavior:'ELA composite scale score releases only after all 4 SP submitted; teacher rubric overrides on SP1 refresh composite immediately.',
    // ─── Embedded Sections (Subparts) ───────────────────────────────────────
    // Each subpart carries its own schedule, status, students/grading counts,
    // studentRows, items, and lockState. Independently administer-able but
    // never separated from this parent Test record.
    subparts:[
      {
        code:'SP1', label:'Writing', subtitle:'Narrative / Explanatory / Argumentative (random of 3)',
        schedule:'Aug 14, 2025 · 9:00 AM - 10:42 AM', schedDate:'2025-08-14',
        status:'Submitted', lockState:'locked-after-complete',
        students:28, ready:0, inProgress:0, submitted:28, graded:26, pendingRelease:2, released:0,
        timeLimitMinutes:85, extTimeMinutes:102,
        gradingModel:'Human review only — essay rubric',
        calculatorPolicy:'N/A — Writing',
        rules:['Must be 1st','Separate session','Human review only'],
        weight:0.35,
        itemsCount:1,
        items:[
          { id:101, num:1, type:'Essay (Writing)', skill:'Argumentative Essay — text-based', standard:'W.5.1', difficulty:'Medium', points:6, locked:true }
        ],
        studentRows:[
          { name:'Aaliyah J.', grade:'5', score:'4/6 · On Track', status:'Submitted', reportState:'Pending Release', progress:'1 / 1', lastActivity:'Essay reviewed — strong claim, weak evidence' },
          { name:'Daniela R.', grade:'5', score:'3/6 · Approaching', status:'Submitted', reportState:'Pending Release', progress:'1 / 1', lastActivity:'Needs more textual evidence' },
          { name:'Jamila B.',  grade:'5', score:'pending',          status:'Submitted', reportState:'Locked',           progress:'1 / 1', lastActivity:'Awaiting teacher rubric review' },
          { name:'Gabriel P.', grade:'5', score:'2/6 · Below',      status:'Submitted', reportState:'Pending Release', progress:'1 / 1', lastActivity:'Foundational support — paragraph structure' }
        ]
      },
      {
        code:'SP2', label:'Literary Reading', subtitle:'Reading comprehension · literary passages',
        schedule:'Aug 15, 2025 · 9:00 AM - 10:00 AM', schedDate:'2025-08-15',
        status:'Submitted', lockState:'locked-after-complete',
        students:28, ready:0, inProgress:0, submitted:28, graded:28, pendingRelease:0, released:0,
        timeLimitMinutes:50, extTimeMinutes:60,
        gradingModel:'Auto-grade · MC + multi-select',
        calculatorPolicy:'N/A — ELA',
        rules:[],
        weight:0.22,
        itemsCount:18,
        items:[
          { id:201, num:1, type:'Multiple Choice', skill:'Inference RL.5.1', standard:'RL.5.1', difficulty:'Medium', points:1, locked:true },
          { id:202, num:2, type:'Multiple Choice', skill:'Theme RL.5.2', standard:'RL.5.2', difficulty:'Medium', points:1, locked:true },
          { id:203, num:3, type:'Multi-select',   skill:'Character analysis RL.5.3', standard:'RL.5.3', difficulty:'Hard', points:2, locked:true },
          { id:204, num:4, type:'Hot Text',       skill:'Cite evidence RL.5.1', standard:'RL.5.1', difficulty:'Medium', points:1, locked:true },
          { id:205, num:5, type:'Multiple Choice', skill:'Word meaning in context RL.5.4', standard:'RL.5.4', difficulty:'Easy', points:1, locked:true },
          { id:206, num:6, type:'Multiple Choice', skill:'Plot structure RL.5.5', standard:'RL.5.5', difficulty:'Medium', points:1, locked:true },
          { id:207, num:7, type:'Multi-select',   skill:'Compare characters RL.5.3', standard:'RL.5.3', difficulty:'Hard', points:2, locked:true },
          { id:208, num:8, type:'Inline Choice',  skill:'Vocabulary RL.5.4', standard:'RL.5.4', difficulty:'Easy', points:1, locked:true }
        ],
        studentRows:[
          { name:'Aaliyah J.', grade:'5', score:'15/18 · On Track', status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Strong on inference RL.5.3, weak on theme RL.5.2' },
          { name:'Daniela R.', grade:'5', score:'12/18 · Approaching', status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Needs work on character development' },
          { name:'Jamila B.',  grade:'5', score:'13/18 · Approaching', status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Inconsistent on cite-evidence items' },
          { name:'Gabriel P.', grade:'5', score:'8/18 · Below',        status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Foundational vocabulary intervention' }
        ]
      },
      {
        code:'SP3', label:'Informational Reading', subtitle:'Reading comprehension · informational text',
        schedule:'Aug 16, 2025 · 9:00 AM - 10:00 AM', schedDate:'2025-08-16',
        status:'Submitted', lockState:'locked-after-complete',
        students:28, ready:0, inProgress:0, submitted:28, graded:28, pendingRelease:0, released:0,
        timeLimitMinutes:50, extTimeMinutes:60,
        gradingModel:'Auto-grade · MC + multi-select + evidence-based',
        calculatorPolicy:'N/A — ELA',
        rules:[],
        weight:0.22,
        itemsCount:18,
        items:[
          { id:301, num:1, type:'Multiple Choice', skill:'Main idea RI.5.2', standard:'RI.5.2', difficulty:'Medium', points:1, locked:true },
          { id:302, num:2, type:'Multiple Choice', skill:'Supporting details RI.5.1', standard:'RI.5.1', difficulty:'Easy', points:1, locked:true },
          { id:303, num:3, type:'Multi-select',   skill:'Author purpose RI.5.6', standard:'RI.5.6', difficulty:'Hard', points:2, locked:true },
          { id:304, num:4, type:'Hot Text',       skill:'Evidence-based RI.5.1', standard:'RI.5.1', difficulty:'Medium', points:1, locked:true },
          { id:305, num:5, type:'Multiple Choice', skill:'Text features RI.5.7', standard:'RI.5.7', difficulty:'Easy', points:1, locked:true },
          { id:306, num:6, type:'Two-Part',       skill:'Integrate sources RI.5.9', standard:'RI.5.9', difficulty:'Hard', points:2, locked:true }
        ],
        studentRows:[
          { name:'Aaliyah J.', grade:'5', score:'14/18 · On Track', status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Strong on main idea RI.5.2, weak on author purpose RI.5.6' },
          { name:'Daniela R.', grade:'5', score:'11/18 · Approaching', status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Needs work on integrating multiple sources' },
          { name:'Jamila B.',  grade:'5', score:'13/18 · Approaching', status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Strong on text features, weak on inference' },
          { name:'Gabriel P.', grade:'5', score:'7/18 · Below',        status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Foundational reading intervention' }
        ]
      },
      {
        code:'SP4', label:'Language & Conventions', subtitle:'Grammar, usage, mechanics',
        schedule:'Aug 17, 2025 · 9:00 AM - 10:00 AM', schedDate:'2025-08-17',
        status:'Released', lockState:'locked-after-complete',
        students:28, ready:0, inProgress:0, submitted:28, graded:28, pendingRelease:0, released:28,
        timeLimitMinutes:50, extTimeMinutes:60,
        gradingModel:'Auto-grade · grammar/usage/mechanics MC',
        calculatorPolicy:'N/A — ELA',
        rules:['Triggers composite on release'],
        weight:0.21,
        itemsCount:18,
        items:[
          { id:401, num:1, type:'Multiple Choice', skill:'Conventions L.5.1',     standard:'L.5.1', difficulty:'Easy',   points:1, locked:true },
          { id:402, num:2, type:'Multiple Choice', skill:'Pronouns L.5.1.d',     standard:'L.5.1', difficulty:'Medium', points:1, locked:true },
          { id:403, num:3, type:'Multiple Choice', skill:'Verb tenses L.5.1.b',  standard:'L.5.1', difficulty:'Medium', points:1, locked:true },
          { id:404, num:4, type:'Multiple Choice', skill:'Punctuation L.5.2.a',  standard:'L.5.2', difficulty:'Medium', points:1, locked:true },
          { id:405, num:5, type:'Inline Choice',  skill:'Comma usage L.5.2.b',   standard:'L.5.2', difficulty:'Hard',   points:1, locked:true },
          { id:406, num:6, type:'Multiple Choice', skill:'Spelling L.5.2.e',     standard:'L.5.2', difficulty:'Easy',   points:1, locked:true }
        ],
        studentRows:[
          { name:'Aaliyah J.', grade:'5', score:'16/18 · Mastered',        status:'Submitted', reportState:'Released', progress:'18 / 18', lastActivity:'Strong on conventions L.5.1' },
          { name:'Daniela R.', grade:'5', score:'13/18 · On Track',        status:'Submitted', reportState:'Released', progress:'18 / 18', lastActivity:'Strong on usage, mixed on punctuation' },
          { name:'Jamila B.',  grade:'5', score:'11/18 · Approaching',     status:'Submitted', reportState:'Released', progress:'18 / 18', lastActivity:'Comma/semicolon rules need review' },
          { name:'Gabriel P.', grade:'5', score:'9/18 · Below',            status:'Submitted', reportState:'Released', progress:'18 / 18', lastActivity:'Foundational grammar intervention' }
        ]
      }
    ],
    // Aggregated student-level view across all 4 SP (legacy reports, share-able to old grader)
    studentRows:[
      { name:'Aaliyah J.', grade:'5', score:'342 · On Track',        status:'Submitted', reportState:'Pending Release', progress:'45 / 45', lastActivity:'Practice plan ready · weak standard RI.5.3' },
      { name:'Daniela R.', grade:'5', score:'318 · Approaching',     status:'Submitted', reportState:'Pending Release', progress:'45 / 45', lastActivity:'Near Target · 6 pts to On Track' },
      { name:'Jamila B.',  grade:'5', score:'305 · Approaching',     status:'Submitted', reportState:'Locked',          progress:'45 / 45', lastActivity:'Needs teacher review · constructed response' },
      { name:'Gabriel P.', grade:'5', score:'272 · Below',           status:'Submitted', reportState:'Pending Release', progress:'45 / 45', lastActivity:'Foundational Support · vocabulary + evidence' }
    ]
  },
  // ─── TCAP Math G5 (3 Subparts · SP1 calculator-disabled, SP2/3 calculator-allowed) ───
  {
    id:'sess-tcap-math-g5', testType:'tcap', icon:'🏛',
    title:'Grade 5 Math — TCAP Diagnostic Aug 2025', teacher:'Mr. Rivera',
    tcapSubject:'math', tcapGrade:5, blueprintKey:'math',
    cohortClassName:'Grade 5 Math · Period 4', cohortStudents:24,
    cutScoreProfileKey:'g5_math',
    windowStart:'2025-08-18', windowEnd:'2025-08-20',
    className:'Grade 5 Math · Period 4', status:'In Progress', progress:67, deliveryMode:'Scheduled Mode',
    window:'Aug 18–20, 2025 · 3 Subparts',
    gradingModel:'Auto-grade · MC + Grid-In + Two-Part',
    releaseRule:'Composite Math score releases after ALL 3 Subparts are submitted.',
    reportState:'pending_release', explanationSources:['Answer Key','Standards Crosswalk','Skill Tags','Cut Score Profile'],
    students:24, ready:0, inProgress:8, submitted:16, graded:16, pendingRelease:0, released:0,
    subtitle:'TCAP G5 Math · 3 Subparts · 180 min total (with ext-time 216 min)',
    lastModifiedAt:'Aug 20, 2025',
    assignmentCode:'TCAP-G5-MATH-AUG2025',
    timeLimitMinutes:180,
    windowStatus:'Active', closedAt:null,
    scoreSource:['Answer Key','Standards Crosswalk','Cut Score Profile'],
    sectionOrder:['SP1 Calculator-Free','SP2 Problem Solving I','SP3 Problem Solving II'],
    sectionTiming:[
      {label:'SP1 Calculator-Free', minutes:60},
      {label:'SP2 Problem Solving I', minutes:60},
      {label:'SP3 Problem Solving II', minutes:60}
    ],
    calculatorPolicy:'SP1: calculator disabled. SP2/SP3: calculator allowed.',
    launchPolicy:'SP1 must be first; SP2-3 unlock after SP1 closes; each SP requires ready check.',
    currentPhase:'Monitor',
    autoSubmitEnabled:true, fiveMinuteWarningEnabled:true,
    compositeRefreshBehavior:'Math composite scale score releases only after all 3 SP submitted.',
    subparts:[
      {
        code:'SP1', label:'Calculator-Free Computation', subtitle:'Basic computation · calculator disabled',
        schedule:'Aug 18, 2025 · 9:00 AM - 10:12 AM', schedDate:'2025-08-18',
        status:'Submitted', lockState:'locked-after-complete',
        students:24, ready:0, inProgress:0, submitted:24, graded:24, pendingRelease:0, released:0,
        timeLimitMinutes:60, extTimeMinutes:72,
        gradingModel:'Auto-grade · MC + Grid-In',
        calculatorPolicy:'Calculator disabled — basic computation',
        rules:['Must be 1st','No calculator'],
        weight:0.34,
        itemsCount:18,
        items:[
          { id:1101, num:1, type:'Multiple Choice', skill:'Multi-digit multiplication 5.NBT.5', standard:'5.NBT.5', difficulty:'Easy',   points:1, locked:true },
          { id:1102, num:2, type:'Grid-In',         skill:'Decimal addition 5.NBT.7',           standard:'5.NBT.7', difficulty:'Medium', points:1, locked:true },
          { id:1103, num:3, type:'Multiple Choice', skill:'Order of operations 5.OA.1',         standard:'5.OA.1',  difficulty:'Medium', points:1, locked:true },
          { id:1104, num:4, type:'Grid-In',         skill:'Fraction division 5.NF.7',           standard:'5.NF.7',  difficulty:'Hard',   points:1, locked:true },
          { id:1105, num:5, type:'Multiple Choice', skill:'Place value 5.NBT.1',                standard:'5.NBT.1', difficulty:'Easy',   points:1, locked:true }
        ],
        studentRows:[
          { name:'Brooke L.',  grade:'5', score:'14/18 · On Track',  status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Strong on multi-digit ops, weak on fractions' },
          { name:'Carlos M.',  grade:'5', score:'10/18 · Approaching', status:'Submitted', reportState:'Pending Release', progress:'18 / 18', lastActivity:'Needs work on fraction division 5.NF.7' }
        ]
      },
      {
        code:'SP2', label:'Problem Solving I', subtitle:'Multi-step problems · calculator allowed',
        schedule:'Aug 19, 2025 · 9:00 AM - 10:00 AM', schedDate:'2025-08-19',
        status:'In Progress', lockState:'open',
        students:24, ready:0, inProgress:8, submitted:16, graded:16, pendingRelease:0, released:0,
        timeLimitMinutes:60, extTimeMinutes:72,
        gradingModel:'Auto-grade · MC + Two-Part',
        calculatorPolicy:'Calculator allowed (Desmos basic)',
        rules:['Calculator OK'],
        weight:0.33,
        itemsCount:18,
        items:[
          { id:1201, num:1, type:'Multiple Choice', skill:'Word problems 5.OA.2',          standard:'5.OA.2',  difficulty:'Medium', points:1, locked:true },
          { id:1202, num:2, type:'Two-Part',        skill:'Volume reasoning 5.MD.5',       standard:'5.MD.5',  difficulty:'Hard',   points:2, locked:true },
          { id:1203, num:3, type:'Multiple Choice', skill:'Coordinate plane 5.G.1',        standard:'5.G.1',   difficulty:'Medium', points:1, locked:true },
          { id:1204, num:4, type:'Grid-In',         skill:'Unit conversion 5.MD.1',        standard:'5.MD.1',  difficulty:'Easy',   points:1, locked:true }
        ],
        studentRows:[
          { name:'Brooke L.',  grade:'5', score:'12/18 · On Track',  status:'Submitted',   reportState:'Pending Release', progress:'18 / 18', lastActivity:'Strong on word problems, weak on volume' },
          { name:'Carlos M.',  grade:'5', score:'In progress',         status:'In Progress', reportState:'Locked',          progress:'9 / 18',  lastActivity:'Currently on Q9' }
        ]
      },
      {
        code:'SP3', label:'Problem Solving II', subtitle:'Multi-step problems · calculator allowed',
        schedule:'Aug 20, 2025 · 9:00 AM - 10:00 AM', schedDate:'2025-08-20',
        status:'Not Started', lockState:'locked-until-prereq',
        students:24, ready:24, inProgress:0, submitted:0, graded:0, pendingRelease:0, released:0,
        timeLimitMinutes:60, extTimeMinutes:72,
        gradingModel:'Auto-grade · MC + Grid-In + Two-Part',
        calculatorPolicy:'Calculator allowed (Desmos basic)',
        rules:['Calculator OK','Triggers composite on release'],
        weight:0.33,
        itemsCount:18,
        items:[
          { id:1301, num:1, type:'Two-Part',        skill:'Fraction multiplication 5.NF.4',  standard:'5.NF.4',  difficulty:'Hard',   points:2, locked:true },
          { id:1302, num:2, type:'Multiple Choice', skill:'Decimal place value 5.NBT.3',     standard:'5.NBT.3', difficulty:'Medium', points:1, locked:true },
          { id:1303, num:3, type:'Grid-In',         skill:'Mixed number ops 5.NF.1',         standard:'5.NF.1',  difficulty:'Hard',   points:1, locked:true }
        ],
        studentRows:[
          { name:'Brooke L.',  grade:'5', score:'Not started', status:'Not Started', reportState:'Locked', progress:'0 / 18', lastActivity:'Waiting for window to open' },
          { name:'Carlos M.',  grade:'5', score:'Not started', status:'Not Started', reportState:'Locked', progress:'0 / 18', lastActivity:'Waiting for SP2 to finish' }
        ]
      }
    ],
    studentRows:[
      { name:'Brooke L.',  grade:'5', score:'pending · 2/3 SP done',  status:'In Progress', reportState:'Locked', progress:'36 / 54', lastActivity:'SP1+SP2 done · awaiting SP3' },
      { name:'Carlos M.',  grade:'5', score:'pending · 2/3 SP done',  status:'In Progress', reportState:'Locked', progress:'27 / 54', lastActivity:'SP2 in progress · Q9' }
    ]
  },
  // ─── TCAP Science G3 (1 single Subpart · combined Life/Earth/Physical) ───
  {
    id:'sess-tcap-sci-g3', testType:'tcap', icon:'🏛',
    title:'Grade 3 Science — TCAP Diagnostic Sep 2025', teacher:'Ms. Park',
    tcapSubject:'science', tcapGrade:3, blueprintKey:'science_3_4',
    cohortClassName:'Grade 3 Science · Period 1', cohortStudents:22,
    cutScoreProfileKey:'g3_science',
    windowStart:'2025-09-08', windowEnd:'2025-09-08',
    className:'Grade 3 Science · Period 1', status:'Scheduled', progress:0, deliveryMode:'Scheduled Mode',
    window:'Sep 8, 2025 · 1 Subpart',
    gradingModel:'Auto-grade · MC + Multi-Select',
    releaseRule:'Single-session test — score releases after submission.',
    reportState:'locked', explanationSources:['Answer Key','Standards Crosswalk','Skill Tags','Cut Score Profile'],
    students:22, ready:22, inProgress:0, submitted:0, graded:0, pendingRelease:0, released:0,
    subtitle:'TCAP G3 Science · 1 Subpart · 50 min total (with ext-time 60 min)',
    lastModifiedAt:'Sep 5, 2025',
    assignmentCode:'TCAP-G3-SCI-SEP2025',
    timeLimitMinutes:50,
    windowStatus:'Scheduled', closedAt:null,
    scoreSource:['Answer Key','Standards Crosswalk','Cut Score Profile'],
    sectionOrder:['SP1 Life · Earth · Physical Science'],
    sectionTiming:[{label:'SP1 Life · Earth · Physical', minutes:50}],
    calculatorPolicy:'N/A — Science (basic ruler/protractor only).',
    launchPolicy:'Single-session test; ready check required.',
    currentPhase:'Setup',
    autoSubmitEnabled:true, fiveMinuteWarningEnabled:true,
    compositeRefreshBehavior:'Single-session — score releases immediately after submission.',
    subparts:[
      {
        code:'SP1', label:'Life · Earth · Physical Science', subtitle:'Single session covers full content',
        schedule:'Sep 8, 2025 · 9:00 AM - 9:50 AM', schedDate:'2025-09-08',
        status:'Not Started', lockState:'open-on-schedule',
        students:22, ready:22, inProgress:0, submitted:0, graded:0, pendingRelease:0, released:0,
        timeLimitMinutes:50, extTimeMinutes:60,
        gradingModel:'Auto-grade · MC + Multi-Select',
        calculatorPolicy:'N/A — Science',
        rules:['Single-session test'],
        weight:1.0,
        itemsCount:25,
        items:[
          { id:2101, num:1, type:'Multiple Choice', skill:'Life cycles 3.LS.1',          standard:'3.LS.1',  difficulty:'Easy',   points:1, locked:true },
          { id:2102, num:2, type:'Multiple Choice', skill:'Weather patterns 3.ESS.2',    standard:'3.ESS.2', difficulty:'Medium', points:1, locked:true },
          { id:2103, num:3, type:'Multi-select',   skill:'Forces & motion 3.PS.2',       standard:'3.PS.2',  difficulty:'Medium', points:2, locked:true },
          { id:2104, num:4, type:'Multiple Choice', skill:'Habitats 3.LS.4',             standard:'3.LS.4',  difficulty:'Easy',   points:1, locked:true }
        ],
        studentRows:[
          { name:'Diego F.',  grade:'3', score:'Not started', status:'Not Started', reportState:'Locked', progress:'0 / 25', lastActivity:'Waiting for window to open' },
          { name:'Emma S.',   grade:'3', score:'Not started', status:'Not Started', reportState:'Locked', progress:'0 / 25', lastActivity:'Waiting for window to open' }
        ]
      }
    ],
    studentRows:[
      { name:'Diego F.', grade:'3', score:'Not started', status:'Not Started', reportState:'Locked', progress:'0 / 25', lastActivity:'Waiting for window to open' },
      { name:'Emma S.',  grade:'3', score:'Not started', status:'Not Started', reportState:'Locked', progress:'0 / 25', lastActivity:'Waiting for window to open' }
    ]
  },
  // ─── TCAP Science G7 (2 Subparts · split Life/Earth/Physical across SP1+SP2) ───
  {
    id:'sess-tcap-sci-g7', testType:'tcap', icon:'🏛',
    title:'Grade 7 Science — TCAP Benchmark Oct 2025', teacher:'Ms. Park',
    tcapSubject:'science', tcapGrade:7, blueprintKey:'science_5_8',
    cohortClassName:'Grade 7 Science · Period 5', cohortStudents:26,
    cutScoreProfileKey:'g7_science',
    windowStart:'2025-10-13', windowEnd:'2025-10-14',
    className:'Grade 7 Science · Period 5', status:'Released', progress:100, deliveryMode:'Scheduled Mode',
    window:'Oct 13–14, 2025 · 2 Subparts',
    gradingModel:'Auto-grade · MC + Multi-Select + Hot Text',
    releaseRule:'Composite Science score releases after BOTH Subparts are submitted.',
    reportState:'released', explanationSources:['Answer Key','Standards Crosswalk','Skill Tags','Cut Score Profile'],
    students:26, ready:0, inProgress:0, submitted:26, graded:26, pendingRelease:0, released:26,
    subtitle:'TCAP G7 Science · 2 Subparts · 90 min total (with ext-time 108 min)',
    lastModifiedAt:'Oct 14, 2025',
    assignmentCode:'TCAP-G7-SCI-OCT2025',
    timeLimitMinutes:90,
    windowStatus:'Released', closedAt:'Oct 14, 2025, 10:00',
    scoreSource:['Answer Key','Standards Crosswalk','Cut Score Profile'],
    sectionOrder:['SP1 Life · Earth · Physical (Part 1)','SP2 Life · Earth · Physical (Part 2)'],
    sectionTiming:[
      {label:'SP1 Part 1', minutes:45},
      {label:'SP2 Part 2', minutes:45}
    ],
    calculatorPolicy:'Calculator allowed (Desmos basic) for quantitative items.',
    launchPolicy:'Two sequential sessions; SP2 unlocks after SP1 closes.',
    currentPhase:'Released',
    autoSubmitEnabled:true, fiveMinuteWarningEnabled:true,
    compositeRefreshBehavior:'Science composite scale score releases only after both SP submitted.',
    subparts:[
      {
        code:'SP1', label:'Life · Earth · Physical (Part 1)', subtitle:'First half of science content',
        schedule:'Oct 13, 2025 · 9:00 AM - 9:45 AM', schedDate:'2025-10-13',
        status:'Released', lockState:'locked-after-complete',
        students:26, ready:0, inProgress:0, submitted:26, graded:26, pendingRelease:0, released:26,
        timeLimitMinutes:45, extTimeMinutes:54,
        gradingModel:'Auto-grade · MC + Multi-Select',
        calculatorPolicy:'Calculator allowed',
        rules:[],
        weight:0.5,
        itemsCount:20,
        items:[
          { id:3101, num:1, type:'Multiple Choice', skill:'Cell biology 7.LS.1',         standard:'7.LS.1',  difficulty:'Medium', points:1, locked:true },
          { id:3102, num:2, type:'Multi-select',   skill:'Energy transfer 7.PS.3',       standard:'7.PS.3',  difficulty:'Hard',   points:2, locked:true },
          { id:3103, num:3, type:'Hot Text',       skill:'Evidence in observations 7.LS.4', standard:'7.LS.4', difficulty:'Medium', points:1, locked:true },
          { id:3104, num:4, type:'Multiple Choice', skill:'Plate tectonics 7.ESS.2',     standard:'7.ESS.2', difficulty:'Easy',   points:1, locked:true }
        ],
        studentRows:[
          { name:'Felix W.',  grade:'7', score:'17/20 · On Track',  status:'Submitted', reportState:'Released', progress:'20 / 20', lastActivity:'Strong on cell biology, weak on tectonics' },
          { name:'Grace H.',  grade:'7', score:'13/20 · Approaching', status:'Submitted', reportState:'Released', progress:'20 / 20', lastActivity:'Needs work on energy transfer' }
        ]
      },
      {
        code:'SP2', label:'Life · Earth · Physical (Part 2)', subtitle:'Second half · may include performance task',
        schedule:'Oct 14, 2025 · 9:00 AM - 9:45 AM', schedDate:'2025-10-14',
        status:'Released', lockState:'locked-after-complete',
        students:26, ready:0, inProgress:0, submitted:26, graded:26, pendingRelease:0, released:26,
        timeLimitMinutes:45, extTimeMinutes:54,
        gradingModel:'Auto-grade · MC + performance task auto-rubric',
        calculatorPolicy:'Calculator allowed',
        rules:['Triggers composite on release'],
        weight:0.5,
        itemsCount:20,
        items:[
          { id:3201, num:1, type:'Multiple Choice', skill:'Genetics 7.LS.3',             standard:'7.LS.3',  difficulty:'Medium', points:1, locked:true },
          { id:3202, num:2, type:'Two-Part',        skill:'Chemical reactions 7.PS.1',   standard:'7.PS.1',  difficulty:'Hard',   points:2, locked:true },
          { id:3203, num:3, type:'Multi-select',   skill:'Ecosystem dynamics 7.LS.2',    standard:'7.LS.2',  difficulty:'Medium', points:2, locked:true }
        ],
        studentRows:[
          { name:'Felix W.',  grade:'7', score:'15/20 · On Track',  status:'Submitted', reportState:'Released', progress:'20 / 20', lastActivity:'Strong on chemistry, weak on genetics' },
          { name:'Grace H.',  grade:'7', score:'12/20 · Approaching', status:'Submitted', reportState:'Released', progress:'20 / 20', lastActivity:'Mixed on ecosystem dynamics' }
        ]
      }
    ],
    studentRows:[
      { name:'Felix W.',  grade:'7', score:'335 · On Track',   status:'Submitted', reportState:'Released', progress:'40 / 40', lastActivity:'Composite released · Practice plan ready' },
      { name:'Grace H.',  grade:'7', score:'312 · Approaching',  status:'Submitted', reportState:'Released', progress:'40 / 40', lastActivity:'Near Target · 8 pts to On Track' }
    ]
  },
  // ─── TCAP Social Studies G7 (2 Subparts · History/Geo + Civics/Economics) ───
  {
    id:'sess-tcap-ss-g7', testType:'tcap', icon:'🏛',
    title:'Grade 7 Social Studies — TCAP Benchmark Oct 2025', teacher:'Mr. Hayes',
    tcapSubject:'ss', tcapGrade:7, blueprintKey:'ss',
    cohortClassName:'Grade 7 SS · Period 6', cohortStudents:25,
    cutScoreProfileKey:'g7_ss',
    windowStart:'2025-10-20', windowEnd:'2025-10-21',
    className:'Grade 7 Social Studies · Period 6', status:'Completed', progress:100, deliveryMode:'Scheduled Mode',
    window:'Oct 20–21, 2025 · 2 Subparts',
    gradingModel:'Auto-grade · MC + Multi-Select + Two-Part',
    releaseRule:'Composite SS score releases after BOTH Subparts are submitted.',
    reportState:'pending_release', explanationSources:['Answer Key','Standards Crosswalk','Skill Tags','Cut Score Profile'],
    students:25, ready:0, inProgress:0, submitted:25, graded:25, pendingRelease:25, released:0,
    subtitle:'TCAP G7 SS · 2 Subparts · 90 min total (with ext-time 108 min)',
    lastModifiedAt:'Oct 21, 2025',
    assignmentCode:'TCAP-G7-SS-OCT2025',
    timeLimitMinutes:90,
    windowStatus:'Closed', closedAt:'Oct 21, 2025, 10:00',
    scoreSource:['Answer Key','Standards Crosswalk','Cut Score Profile'],
    sectionOrder:['SP1 History & Geography','SP2 Civics · Economics · Sources'],
    sectionTiming:[
      {label:'SP1 History & Geography', minutes:45},
      {label:'SP2 Civics · Economics', minutes:45}
    ],
    calculatorPolicy:'N/A — Social Studies (no calculator).',
    launchPolicy:'Two sequential sessions; SP2 unlocks after SP1 closes.',
    currentPhase:'Pending Release',
    autoSubmitEnabled:true, fiveMinuteWarningEnabled:true,
    compositeRefreshBehavior:'SS composite scale score releases only after both SP submitted.',
    subparts:[
      {
        code:'SP1', label:'History & Geography', subtitle:'Tennessee state history, US history, geography',
        schedule:'Oct 20, 2025 · 9:00 AM - 9:45 AM', schedDate:'2025-10-20',
        status:'Submitted', lockState:'locked-after-complete',
        students:25, ready:0, inProgress:0, submitted:25, graded:25, pendingRelease:25, released:0,
        timeLimitMinutes:45, extTimeMinutes:54,
        gradingModel:'Auto-grade · MC + Multi-Select',
        calculatorPolicy:'N/A — SS',
        rules:[],
        weight:0.5,
        itemsCount:22,
        items:[
          { id:4101, num:1, type:'Multiple Choice', skill:'TN early history 7.SS.1',     standard:'7.SS.1',  difficulty:'Easy',   points:1, locked:true },
          { id:4102, num:2, type:'Multi-select',   skill:'US expansion 7.SS.4',         standard:'7.SS.4',  difficulty:'Medium', points:2, locked:true },
          { id:4103, num:3, type:'Multiple Choice', skill:'Geographic regions 7.SS.6',  standard:'7.SS.6',  difficulty:'Medium', points:1, locked:true },
          { id:4104, num:4, type:'Multiple Choice', skill:'Map skills 7.SS.7',          standard:'7.SS.7',  difficulty:'Easy',   points:1, locked:true }
        ],
        studentRows:[
          { name:'Henry K.',  grade:'7', score:'18/22 · On Track',  status:'Submitted', reportState:'Pending Release', progress:'22 / 22', lastActivity:'Strong on TN history, weak on geographic regions' },
          { name:'Iris N.',   grade:'7', score:'14/22 · Approaching', status:'Submitted', reportState:'Pending Release', progress:'22 / 22', lastActivity:'Needs work on US expansion timeline' }
        ]
      },
      {
        code:'SP2', label:'Civics · Economics · Sources', subtitle:'Primary source analysis, civics, economics',
        schedule:'Oct 21, 2025 · 9:00 AM - 9:45 AM', schedDate:'2025-10-21',
        status:'Submitted', lockState:'locked-after-complete',
        students:25, ready:0, inProgress:0, submitted:25, graded:25, pendingRelease:25, released:0,
        timeLimitMinutes:45, extTimeMinutes:54,
        gradingModel:'Auto-grade · MC + Two-Part + Hot Text',
        calculatorPolicy:'N/A — SS',
        rules:['Triggers composite on release'],
        weight:0.5,
        itemsCount:22,
        items:[
          { id:4201, num:1, type:'Multiple Choice', skill:'Branches of government 7.SS.10', standard:'7.SS.10', difficulty:'Easy',   points:1, locked:true },
          { id:4202, num:2, type:'Two-Part',        skill:'Primary source analysis 7.SS.12', standard:'7.SS.12', difficulty:'Hard',   points:2, locked:true },
          { id:4203, num:3, type:'Hot Text',       skill:'Cite evidence in source 7.SS.12', standard:'7.SS.12', difficulty:'Medium', points:1, locked:true },
          { id:4204, num:4, type:'Multiple Choice', skill:'Supply & demand 7.SS.14',         standard:'7.SS.14', difficulty:'Medium', points:1, locked:true }
        ],
        studentRows:[
          { name:'Henry K.',  grade:'7', score:'17/22 · On Track',  status:'Submitted', reportState:'Pending Release', progress:'22 / 22', lastActivity:'Strong on civics, mixed on primary source analysis' },
          { name:'Iris N.',   grade:'7', score:'15/22 · On Track',  status:'Submitted', reportState:'Pending Release', progress:'22 / 22', lastActivity:'Strong on supply/demand reasoning' }
        ]
      }
    ],
    studentRows:[
      { name:'Henry K.',  grade:'7', score:'pending · 2/2 SP done',  status:'Submitted', reportState:'Pending Release', progress:'44 / 44', lastActivity:'Composite pending release' },
      { name:'Iris N.',   grade:'7', score:'pending · 2/2 SP done',  status:'Submitted', reportState:'Pending Release', progress:'44 / 44', lastActivity:'Composite pending release' }
    ]
  },
  {
    id:'sess-sat-1', testType:'sat', icon:'📘', title:'SAT Practice Test — March', teacher:'Ms. Johnson',
    className:'Grade 11 Advisory', status:'Released', progress:100, deliveryMode:'Scheduled Mode',
    window:'Mar 28-29, 2026 · Any time before 5:00 PM', gradingModel:'Auto-grade + AI explanation review',
    releaseRule:'Student reports unlock after teacher confirms adaptive review and release.',
    reportState:'released', explanationSources:['Answer Key','Response Pattern','Skill Tags','Teacher Override'],
    students:24, ready:0, inProgress:0, submitted:24, graded:24, pendingRelease:0, released:24,
    subtitle:'Digital SAT session setup with adaptive module routing',
    lastModifiedAt:'Mar 28, 2026',
    assignmentCode:'SAT-MAR-2026',
    timeLimitMinutes:134,
    windowStatus:'Released',
    closedAt:'Mar 29, 2026, 17:00',
    scoreSource:['Answer Key','Response Pattern','Teacher Override'],
    sectionOrder:['R&W Module 1','R&W Module 2','Math Module 1','Math Module 2'],
    sectionTiming:[{label:'R&W M1', minutes:32},{label:'R&W M2', minutes:32},{label:'Math M1', minutes:35},{label:'Math M2', minutes:35}],
    calculatorPolicy:'Desmos available for Math modules only.',
    launchPolicy:'Students must pass the ready check before the SAT shell unlocks.',
    currentPhase:'Released',
    autoSubmitEnabled:true,
    fiveMinuteWarningEnabled:true,
    compositeRefreshBehavior:'Adaptive review refreshes teacher scores immediately; student-facing reports update on release.',
    studentRows:[
      { name:'Grace Lee', grade:'11', score:'1280', status:'Submitted', reportState:'Released', progress:'RW 620 · Math 660', lastActivity:'Report viewed · Mar 30' },
      { name:'Jake Williams', grade:'11', score:'1160', status:'Submitted', reportState:'Released', progress:'RW 560 · Math 600', lastActivity:'Report viewed · Mar 30' }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// TCAP Subpart helpers (Sections-Embedded model)
// ─────────────────────────────────────────────────────────────────────────────
// Each TCAP SESSION_DATA row carries an embedded `subparts: []` array. These
// helpers read from that array; legacy ACT/SAT/Generic sessions return null
// (they have no subparts).
function getSessionSubpart(sessionId, code) {
  const s = SESSION_DATA.find(x => x.id === sessionId);
  if (!s || !s.subparts) return null;
  return s.subparts.find(sp => sp.code === code) || null;
}
function getSessionSubparts(sessionId) {
  const s = SESSION_DATA.find(x => x.id === sessionId);
  return (s && s.subparts) || [];
}
// Currently-active Subpart for Editor / Monitor context. Defaults to the first
// SP that's not yet Released, falling back to SP1.
let currentSubpartCode = 'SP1';
function getActiveSubpart(sessionId) {
  const sps = getSessionSubparts(sessionId);
  if (!sps.length) return null;
  return sps.find(sp => sp.code === currentSubpartCode) || sps[0];
}
function setActiveSubpart(code) {
  currentSubpartCode = code;
}
// ── TCAP Subpart picker dropdown (replaces the old horizontal SP strip) ──
let _tcapSpPickerOpen = false;
function tcapSpPickerToggle(ev) {
  if (ev) { ev.stopPropagation(); ev.preventDefault(); }
  _tcapSpPickerOpen = !_tcapSpPickerOpen;
  const wrap = document.getElementById('tcapSpPickerWrap');
  if (wrap) wrap.classList.toggle('open', _tcapSpPickerOpen);
  const menu = document.getElementById('tcapSpPickerMenu');
  if (menu) menu.setAttribute('aria-hidden', _tcapSpPickerOpen ? 'false' : 'true');
}
function tcapSpPickerClose() {
  if (!_tcapSpPickerOpen) return;
  _tcapSpPickerOpen = false;
  const wrap = document.getElementById('tcapSpPickerWrap');
  if (wrap) wrap.classList.remove('open');
  const menu = document.getElementById('tcapSpPickerMenu');
  if (menu) menu.setAttribute('aria-hidden', 'true');
}
function tcapSpPickerSelect(code) {
  setActiveSubpart(code);
  tcapSpPickerClose();
  if (typeof renderSessionDetail === 'function') renderSessionDetail();
}
// Close on outside click / ESC. The handler runs on every document click;
// it's a no-op while the dropdown is closed so the cost is negligible.
document.addEventListener('click', (ev) => {
  if (!_tcapSpPickerOpen) return;
  const wrap = document.getElementById('tcapSpPickerWrap');
  if (wrap && !wrap.contains(ev.target)) tcapSpPickerClose();
});
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && _tcapSpPickerOpen) tcapSpPickerClose();
});
// Returns true when ALL Subparts of this TCAP test are submitted/released
// (composite scoring trigger).
function tcapAllSubpartsDone(session) {
  if (!session || !session.subparts || !session.subparts.length) return false;
  const done = ['Submitted','Graded','Released','Completed'];
  return session.subparts.every(sp => done.some(d => (sp.status || '').includes(d)));
}
function tcapSubpartProgress(session) {
  if (!session || !session.subparts) return { done:0, total:0 };
  const done = ['Submitted','Graded','Released','Completed'];
  const total = session.subparts.length;
  const completed = session.subparts.filter(sp => done.some(d => (sp.status || '').includes(d))).length;
  return { done:completed, total };
}

let currentSessionId = 'sess-act-1';
let currentLaunchSessionId = 'sess-act-1';
let currentLaunchStudentName = null;
let currentReportSessionId = 'sess-sat-1';
let sessionDetailTab = 'overview';
let actMonitorQuestionSection = 'all';
let actMonitorQuestionKind = 'all';
let pendingRemoveStudentName = null;
let openSessionMoreStudentName = null;
let reportEdgePreview = null;
let keepReportEdgePreview = false;
let currentFlowId = 'overview';
let currentFlowRole = 'combined';
function setFlowRole(role){ currentFlowRole = role; renderFlowsPage(); }
function setFlowId(id){ currentFlowId = id; currentFlowRole = 'combined'; renderFlowsPage(); }
const ASSIGN_STEPS = ['Audience','Delivery','Confirm'];
const FLOW_DIAGRAMS = [
  {
    id:'overview',
    label:'Overview',
    labelZh:'总览',
    icon:'🏠',
    description:'Top-level map of the current Assessment 2.0 standardized-testing prototype.',
    descriptionZh:'Assessment 2.0 标化考试原型的顶层地图——一张图看清所有主流程之间的关系。',
    chips:['Teacher', 'Student', 'Release'],
    chipsZh:['教师端', '学生端', '发布'],
    mermaid:`flowchart LR
      H["Homepage"] --> D["Drawer Config"]
      D --> GEN["AI Generate"]
      GEN --> E["Editor"]
      E --> A["Assign"]
      A --> SD["Assignment Monitor"]
      SD --> G["Grader Studio"]
      SD --> L["Student Launch"]
      L --> R["Ready Check"]
      R --> T["Standardized Runtime<br/>ACT · SAT · TCAP"]
      T --> RP["Student Report"]
      G --> PR["Pending Release"]
      PR --> RL["Released Report"]`,
    mermaidZh:`flowchart LR
      H["首页"] --> D["Drawer 配置"]
      D --> GEN["AI 生成"]
      GEN --> E["Editor 审阅"]
      E --> A["布置"]
      A --> SD["作业监控"]
      SD --> G["批改 Studio"]
      SD --> L["学生进入考试"]
      L --> R["准备确认"]
      R --> T["标化考试运行时<br/>ACT · SAT · TCAP"]
      T --> RP["学生报告"]
      G --> PR["待发布"]
      PR --> RL["已发布报告"]`,
    nodeActions:{
      H:  "switchRole('teacher',true);nav('homepage')",
      D:  "switchRole('teacher',true);nav('homepage');setTimeout(()=>openDrawer('act'),250)",
      GEN:"switchRole('teacher',true);nav('act')",
      E:  "switchRole('teacher',true);nav('act')",
      A:  "switchRole('teacher',true);nav('act');setTimeout(()=>openAssignModal('act'),250)",
      SD: "switchRole('teacher',true);loadSessionDetail('sess-act-1')",
      L:  "switchRole('student',true);openStudentLaunch('sess-act-1', false)",
      R:  "switchRole('student',true);nav('stu-ready')",
      T:  "switchRole('student',true);nav('stu-act')",
      RP: "switchRole('student',true);openStudentReport('act')",
      PR: "switchRole('teacher',true);loadSessionDetail('sess-act-1')",
      RL: "switchRole('student',true);openStudentReport('act')"
    }
  },
  {
    id:'act',
    label:'ACT Flow',
    labelZh:'ACT 流程',
    icon:'🎯',
    description:'ACT-specific path. 4 fixed sections + optional Writing, run as a single sitting (1 Assignment). Section breaks live inside the Runner. Writing routes to Grading Studio for human scoring.',
    descriptionZh:'ACT 专属路径：4 个固定 section + 可选 Writing，一次坐下来跑完 = 1 个 Assignment。Section 之间的 break 在 Runner 内处理。Writing 走 Grading Studio 人工评分。',
    chips:['1 sitting = 1 Assignment','Optional Writing','Section breaks','Human-graded Essay'],
    chipsZh:['1 次坐下 = 1 Assignment','可选 Writing','Section 间 break','Writing 人工批改'],
    roleViews:{ combined:'act', teacher:'act_teacher', student:'act_student' },
    mermaid:`flowchart LR
      H["Homepage"] --> D["ACT Drawer<br/>4 sections + optional Writing"]
      D --> GEN["AI Generate<br/>per-section blueprint"]
      GEN --> E["Editor<br/>section tabs"]
      E --> A["Assign<br/>1 sitting = 1 Assignment"]
      A --> L["Student Launch"]
      L --> S1["Section 1 · English<br/>45 min · 75 items"]
      S1 --> S2["Section 2 · Math<br/>60 min · 60 items"]
      S2 --> BR["Break · 10 min"]
      BR --> S3["Section 3 · Reading<br/>35 min · 40 items"]
      S3 --> S4["Section 4 · Science<br/>35 min · 40 items"]
      S4 --> W["Writing (optional)<br/>40 min · 1 essay"]
      W --> SUB["Submit"]
      S4 -. skip Writing .-> SUB
      SUB --> G["Grader<br/>auto MCQ + manual Essay"]
      G --> PR["Pending Release"]
      PR --> RP["Released Report"]`,
    mermaidZh:`flowchart LR
      H["首页"] --> D["ACT Drawer<br/>4 section + 可选 Writing"]
      D --> GEN["AI 生成<br/>分 section 蓝图"]
      GEN --> E["Editor 审阅<br/>section tab"]
      E --> A["布置<br/>1 次坐下 = 1 Assignment"]
      A --> L["学生进入"]
      L --> S1["Section 1 · English<br/>45 min · 75 题"]
      S1 --> S2["Section 2 · Math<br/>60 min · 60 题"]
      S2 --> BR["Break · 10 min"]
      BR --> S3["Section 3 · Reading<br/>35 min · 40 题"]
      S3 --> S4["Section 4 · Science<br/>35 min · 40 题"]
      S4 --> W["Writing（可选）<br/>40 min · 1 篇 essay"]
      W --> SUB["交卷"]
      S4 -. 无 Writing 直接交卷 .-> SUB
      SUB --> G["批改<br/>选择题自动 + Writing 人工"]
      G --> PR["待发布"]
      PR --> RP["学生报告"]`,
    nodeActions:{
      H:  "switchRole('teacher',true);nav('homepage')",
      D:  "switchRole('teacher',true);nav('homepage');setTimeout(()=>openDrawer('act'),250)",
      GEN:"switchRole('teacher',true);nav('act')",
      E:  "switchRole('teacher',true);nav('act')",
      A:  "switchRole('teacher',true);nav('act');setTimeout(()=>openAssignModal('act'),250)",
      L:  "switchRole('student',true);openStudentLaunch('sess-act-1', false)",
      S1: "switchRole('student',true);nav('stu-act')",
      S2: "switchRole('student',true);nav('stu-act')",
      BR: "switchRole('student',true);nav('stu-act')",
      S3: "switchRole('student',true);nav('stu-act')",
      S4: "switchRole('student',true);nav('stu-act')",
      W:  "switchRole('student',true);nav('stu-act')",
      SUB:"switchRole('student',true);nav('stu-act')",
      G:  "switchRole('teacher',true);loadSessionDetail('sess-act-1')",
      PR: "switchRole('teacher',true);loadSessionDetail('sess-act-1')",
      RP: "switchRole('student',true);openStudentReport('act')"
    }
  },
  {
    id:'tcap',
    label:'TCAP Flow',
    labelZh:'TCAP 流程',
    icon:'📋',
    description:'TCAP-specific path. Subpart count varies by Subject × Grade; Live mode means teacher starts each Subpart; cross-day pause and make-up are first-class; Writing routes to handwritten upload (G3-5) or typed (G6-8) — both human-graded.',
    descriptionZh:'TCAP 专属路径：Subpart 数量随"科目 × 年级"动态变化；Live mode 下教师逐个 Subpart 放行；跨天 pause / 缺考补考是一等公民；Writing 链路 G3-5 走手写上传、G6-8 走 typed，都是人工批改。',
    chips:['Dynamic Subparts','Live Mode','Cross-day Pause','Handwritten Writing','⚠️ Open Decision'],
    chipsZh:['动态 Subpart','Live Mode','跨天 pause','手写 Writing','⚠️ 决策待定'],
    roleViews:{ combined:'tcap', teacher:'tcap_teacher', student:'tcap_student' },
    mermaid:`flowchart LR
      H["Homepage"] --> D["TCAP Drawer<br/>Subject × Grade<br/>→ N subparts"]
      D --> GEN["AI Generate<br/>per-subpart blueprint"]
      GEN --> FLOOR{"Item bank floor<br/>≥8 items / standard"}
      FLOOR -- pass --> E["Editor<br/>subpart tabs"]
      FLOOR -- short --> RG["Regen + tag QA"]
      RG --> E
      E --> DEC["⚠️ Open Decision<br/>1 Assignment OR<br/>4 Sub-Assignments?"]
      DEC --> A["Assign<br/>Live-mode coordination"]
      A --> SP1["Subpart 1<br/>teacher starts"]
      SP1 --> SP2["Subpart 2"]
      SP2 -. cross-day pause / make-up .-> SP3["Subpart 3"]
      SP3 --> SPN["Subpart N"]
      SPN --> SUB["Submit"]
      SUB --> G["Grader<br/>auto MCQ + handwritten Writing"]
      G --> PR["Pending Release"]
      PR --> RP["Released Report"]`,
    mermaidZh:`flowchart LR
      H["首页"] --> D["TCAP Drawer<br/>科目 × 年级<br/>→ N 个 subpart"]
      D --> GEN["AI 生成<br/>分 subpart 蓝图"]
      GEN --> FLOOR{"题库下限<br/>≥8 题 / standard"}
      FLOOR -- 达标 --> E["Editor 审阅<br/>subpart tab"]
      FLOOR -- 不足 --> RG["补生成 + 标 QA"]
      RG --> E
      E --> DEC["⚠️ 待定决策<br/>1 个 Assignment 还是<br/>4 个 Sub-Assignment？"]
      DEC --> A["布置<br/>Live mode 协同"]
      A --> SP1["Subpart 1<br/>教师启动"]
      SP1 --> SP2["Subpart 2"]
      SP2 -. 跨天 pause / 补考 .-> SP3["Subpart 3"]
      SP3 --> SPN["Subpart N"]
      SPN --> SUB["交卷"]
      SUB --> G["批改<br/>选择题自动 + 手写 Writing"]
      G --> PR["待发布"]
      PR --> RP["学生报告"]`,
    nodeActions:{
      H:  "switchRole('teacher',true);nav('homepage')",
      D:  "switchRole('teacher',true);nav('homepage');setTimeout(()=>openDrawer('tcap'),250)",
      GEN:"switchRole('teacher',true);openTcapEdit('sess-tcap-1')",
      E:  "switchRole('teacher',true);openTcapEdit('sess-tcap-1')",
      A:  "switchRole('teacher',true);openTcapEdit('sess-tcap-1');setTimeout(()=>openAssignModal('tcap'),250)",
      SP1:"switchRole('student',true);previewAssessmentAsStudent('sess-tcap-1')",
      SP2:"switchRole('student',true);previewAssessmentAsStudent('sess-tcap-1')",
      SP3:"switchRole('student',true);previewAssessmentAsStudent('sess-tcap-1')",
      SPN:"switchRole('student',true);previewAssessmentAsStudent('sess-tcap-1')",
      SUB:"switchRole('student',true);previewAssessmentAsStudent('sess-tcap-1')",
      G:  "switchRole('teacher',true);loadSessionDetail('sess-tcap-1')",
      PR: "switchRole('teacher',true);loadSessionDetail('sess-tcap-1')",
      RP: "switchRole('student',true);openStudentReport('act')"
    }
  },
  {
    id:'skillGraph',
    label:'Skill Graph',
    labelZh:'技能图谱',
    icon:'🧭',
    description:"Kira's cross-test backbone. Every question is addressed by a test-agnostic skill coordinate, not a test-specific tag. One question bank can serve ACT, SAT, STAAR, SSAT — and whatever comes next — without rebuilds. Student skill profiles become cumulative across tests rather than reset per product.",
    descriptionZh:'Kira 的跨考试底盘。每道题都用"与考试无关的技能坐标"定位，而不是绑死在某个考试的标签上。同一个题库可以同时服务 ACT、SAT、STAAR、SSAT——以及将来新增的任何考试——不用重建。学生的能力画像会跨考试累积，而不是每换一个产品就从零开始。',
    chips:['Infrastructure', 'Cross-test', 'Phase 1'],
    chipsZh:['基础设施', '跨考试', 'Phase 1'],
    heroHtml:`<div class="sk-compat" role="group" aria-label="Question design compatibility flow">
      <div class="sk-compat-col">
        <div class="sk-compat-head">One Question</div>
        <div class="sk-compat-card">
          <span class="ico">📝</span>
          <div><b>Reading · Inference item</b><div class="sub">"…the narrator suggests that…"</div></div>
        </div>
      </div>
      <div class="sk-compat-arrow">→</div>
      <div class="sk-compat-col">
        <div class="sk-compat-head">Canonical Tag</div>
        <div class="sk-compat-card">
          <span class="mono">reading.inference</span>
          <span style="font-size:11px;color:#71717a">+ character</span>
        </div>
      </div>
      <div class="sk-compat-arrow">→</div>
      <div class="sk-compat-col">
        <div class="sk-compat-head">Serves N Tests</div>
        <div class="sk-compat-tests">
          <div class="sk-compat-test"><span class="tn">ACT</span><span class="tc">KID · Inference</span></div>
          <div class="sk-compat-test"><span class="tn">SAT</span><span class="tc">IIC · Inferences</span></div>
          <div class="sk-compat-test"><span class="tn">STAAR</span><span class="tc">RC.4</span></div>
          <div class="sk-compat-test dim"><span class="tn">SSAT</span><span class="tc">—</span></div>
        </div>
      </div>
    </div>`,
    heroHtmlZh:`<div class="sk-compat" role="group" aria-label="题目设计兼容流程">
      <div class="sk-compat-col">
        <div class="sk-compat-head">同一道题</div>
        <div class="sk-compat-card">
          <span class="ico">📝</span>
          <div><b>Reading · 推理题</b><div class="sub">"作者暗示……"</div></div>
        </div>
      </div>
      <div class="sk-compat-arrow">→</div>
      <div class="sk-compat-col">
        <div class="sk-compat-head">Canonical 标签</div>
        <div class="sk-compat-card">
          <span class="mono">reading.inference</span>
          <span style="font-size:11px;color:#71717a">+ 人物动机</span>
        </div>
      </div>
      <div class="sk-compat-arrow">→</div>
      <div class="sk-compat-col">
        <div class="sk-compat-head">同时服务 N 个考试</div>
        <div class="sk-compat-tests">
          <div class="sk-compat-test"><span class="tn">ACT</span><span class="tc">KID · Inference</span></div>
          <div class="sk-compat-test"><span class="tn">SAT</span><span class="tc">IIC · Inferences</span></div>
          <div class="sk-compat-test"><span class="tn">STAAR</span><span class="tc">RC.4</span></div>
          <div class="sk-compat-test dim"><span class="tn">SSAT</span><span class="tc">—</span></div>
        </div>
      </div>
    </div>`,
    mermaid:`flowchart LR
      R(("Reading<br/>canonical domain"))
      R --> MI["Main Idea ·<br/>Central Theme"]
      R --> SD["Supporting Details"]
      R --> INF["Inference"]
      INF --> INF1["↳ Character Motivation"]
      INF --> INF2["↳ Causal"]
      R --> VOC["Vocab in Context"]
      R --> AP["Author's Purpose<br/>· Rhetoric"]
      R --> TS["Text Structure<br/>· Organization"]
      R --> EB["Textual Evidence"]
      EB --> EBQ["↳ Quantitative<br/>[SAT-only]"]
      R --> CT["Cross-Text Synthesis"]
      R --> TN["Tone · Attitude"]
      R --> CC["Claims ·<br/>Counterclaims"]
      classDef satOnly fill:#fef3c7,stroke:#d97706,color:#78350f
      class EBQ satOnly`,
    mermaidZh:`flowchart LR
      R(("阅读<br/>canonical 领域"))
      R --> MI["主旨 ·<br/>中心思想"]
      R --> SD["细节定位"]
      R --> INF["推理"]
      INF --> INF1["↳ 人物动机"]
      INF --> INF2["↳ 因果推理"]
      R --> VOC["词汇在语境中的含义"]
      R --> AP["作者意图<br/>与修辞"]
      R --> TS["文本结构<br/>与组织"]
      R --> EB["文本证据"]
      EB --> EBQ["↳ 量化证据<br/>[仅 SAT]"]
      R --> CT["跨文本综合"]
      R --> TN["语气与态度"]
      R --> CC["观点 ·<br/>反驳"]
      classDef satOnly fill:#fef3c7,stroke:#d97706,color:#78350f
      class EBQ satOnly`,
    rightCardHtml:`<h3>Cross-test Mapping (Reading v1)</h3>
      <p style="font-size:12px;color:#71717a;margin:0 0 12px;line-height:1.6">How each canonical skill lands in ACT / SAT official reporting categories. A future test plugs into this same matrix — STAAR column shown as illustration.</p>
      <div style="overflow-x:auto;border:1px solid #e4e4e7;border-radius:10px">
        <table class="sk-mapping">
          <thead>
            <tr>
              <th>Canonical skill</th>
              <th>ACT</th>
              <th>SAT</th>
              <th>STAAR<br/><span style="font-weight:500;text-transform:none;letter-spacing:0;color:#a1a1aa">illustrative</span></th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="canonical">reading.main_idea</td><td>KID</td><td>CAS</td><td>RC.2</td></tr>
            <tr><td class="canonical">reading.supporting_detail</td><td>KID</td><td>IIC</td><td>RC.3</td></tr>
            <tr><td class="canonical">reading.inference</td><td>KID</td><td>IIC</td><td>RC.4</td></tr>
            <tr><td class="canonical">reading.vocab_in_context</td><td>CS</td><td>CAS</td><td>RC.8</td></tr>
            <tr><td class="canonical">reading.author_purpose</td><td>CS</td><td>CAS</td><td>RC.7</td></tr>
            <tr><td class="canonical">reading.text_structure</td><td>CS</td><td>CAS</td><td>RC.9</td></tr>
            <tr><td class="canonical">reading.evidence_based</td><td>KID</td><td>IIC</td><td>RC.5</td></tr>
            <tr><td class="canonical">reading.evidence_based.quantitative</td><td class="null-cell">—</td><td>IIC</td><td class="null-cell">—</td></tr>
            <tr><td class="canonical">reading.cross_text</td><td>IOK</td><td>CAS</td><td class="null-cell">—</td></tr>
            <tr><td class="canonical">reading.tone</td><td>CS</td><td>CAS</td><td>RC.6</td></tr>
            <tr><td class="canonical">reading.claims</td><td>IOK</td><td>IIC</td><td>RC.10</td></tr>
          </tbody>
        </table>
      </div>
      <p style="font-size:11px;color:#a1a1aa;margin-top:10px;line-height:1.6">Legend: <b>—</b> = no equivalent in that test. Intentional null beats fake mapping — honest gaps preserve student signal quality.</p>`,
    rightCardHtmlZh:`<h3>跨考试映射表（Reading v1）</h3>
      <p style="font-size:12px;color:#71717a;margin:0 0 12px;line-height:1.6">每个 canonical 技能在 ACT / SAT 官方报告分类里对应的位置。未来接入新考试，就是在这张矩阵上新增一列——STAAR 列仅作示意。</p>
      <div style="overflow-x:auto;border:1px solid #e4e4e7;border-radius:10px">
        <table class="sk-mapping">
          <thead>
            <tr>
              <th>Canonical 技能</th>
              <th>ACT</th>
              <th>SAT</th>
              <th>STAAR<br/><span style="font-weight:500;text-transform:none;letter-spacing:0;color:#a1a1aa">示意</span></th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="canonical">reading.main_idea</td><td>KID</td><td>CAS</td><td>RC.2</td></tr>
            <tr><td class="canonical">reading.supporting_detail</td><td>KID</td><td>IIC</td><td>RC.3</td></tr>
            <tr><td class="canonical">reading.inference</td><td>KID</td><td>IIC</td><td>RC.4</td></tr>
            <tr><td class="canonical">reading.vocab_in_context</td><td>CS</td><td>CAS</td><td>RC.8</td></tr>
            <tr><td class="canonical">reading.author_purpose</td><td>CS</td><td>CAS</td><td>RC.7</td></tr>
            <tr><td class="canonical">reading.text_structure</td><td>CS</td><td>CAS</td><td>RC.9</td></tr>
            <tr><td class="canonical">reading.evidence_based</td><td>KID</td><td>IIC</td><td>RC.5</td></tr>
            <tr><td class="canonical">reading.evidence_based.quantitative</td><td class="null-cell">—</td><td>IIC</td><td class="null-cell">—</td></tr>
            <tr><td class="canonical">reading.cross_text</td><td>IOK</td><td>CAS</td><td class="null-cell">—</td></tr>
            <tr><td class="canonical">reading.tone</td><td>CS</td><td>CAS</td><td>RC.6</td></tr>
            <tr><td class="canonical">reading.claims</td><td>IOK</td><td>IIC</td><td>RC.10</td></tr>
          </tbody>
        </table>
      </div>
      <p style="font-size:11px;color:#a1a1aa;margin-top:10px;line-height:1.6">图例：<b>—</b> 表示该考试里没有对应的类别。我们坚持"诚实的缺口"优于"硬凑的映射"——不真实的映射会污染学生信号。</p>`,
    bodyHtml:`<div class="flows-card">
      <h4>① Why this exists — the argument</h4>
      <div class="sk-principle-row">
        <div class="sk-principle"><b>One tree, N tests</b><span>Canonical skills describe ability, not exam branding. A test is just a composition that pulls a subset of the tree.</span></div>
        <div class="sk-principle"><b>Cumulative student profile</b><span>ACT Reading "Main Idea" ≡ SAT RW "Main Idea" — same node, same signal. A student's skill picture accumulates across every test they take.</span></div>
        <div class="sk-principle"><b>Config-only for new tests</b><span>Adding STAAR/SSAT = skill pool subset + section rules + scoring adapter. No new question bank, no new tag dictionary, no new report template.</span></div>
      </div>
    </div>
    <div class="flows-card">
      <h4>② How a question gets addressed</h4>
      <p>Same Reading inference question — before vs after canonical skill graph lands. The new field (<b>canonical_skill_ids</b>) is what makes the item usable across tests and makes student signal aggregatable.</p>
      <div class="sk-before-after">
        <div>
          <div style="font-size:11px;font-weight:800;color:#991b1b;margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px">Before — today</div>
          <pre class="sk-json">{
  "id": "q_act_read_12",
  "stem": "...the narrator suggests that...",
  <span class="k">"act_tag"</span>: <span class="s">"KID - Inference"</span>,  <span class="c">// ACT-only</span>
  <span class="k">"sat_tag"</span>: <span class="s">null</span>           <span class="c">// reusable in SAT? can't tell</span>
}</pre>
        </div>
        <div>
          <div style="font-size:11px;font-weight:800;color:#166534;margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px">After — Phase 1</div>
          <pre class="sk-json">{
  "id": "q_act_read_12",
  "stem": "...the narrator suggests that...",
  <span class="k new">"canonical_skill_ids"</span>: [
    <span class="s">"reading.inference"</span>,
    <span class="s">"reading.inference.character"</span>
  ],
  <span class="k">"act_native_tag"</span>: <span class="s">"KID - Inference"</span>,
  <span class="k">"sat_native_tag"</span>: <span class="s">"IIC - Inferences"</span>,
  <span class="k new">"usable_in_tests"</span>: [<span class="s">"ACT_READING"</span>, <span class="s">"SAT_RW"</span>, <span class="s">"ISEE_READING"</span>]
}</pre>
        </div>
      </div>
    </div>
    <div class="flows-card">
      <h4>③ Adding a new test — STAAR walkthrough</h4>
      <p>Illustrative: what it takes to plug STAAR Grade 10 Reading into the platform, assuming the canonical skill graph is in place. The bet is: engineering effort stays bounded as test count grows.</p>
      <div class="sk-steps">
        <div class="sk-step">
          <div class="sk-step-title"><span class="sk-step-num">1</span>Map STAAR domains</div>
          <div class="sk-step-desc">Open the mapping YAML, add a STAAR column. Reuse existing canonical nodes — only add new skills if STAAR tests something neither ACT nor SAT tests.</div>
          <div class="sk-step-code">reading.main_idea:
  staar_rc: RC.2
reading.inference:
  staar_rc: RC.4</div>
        </div>
        <div class="sk-step">
          <div class="sk-step-title"><span class="sk-step-num">2</span>Define STAAR_PROFILE</div>
          <div class="sk-step-desc">One config file — sections, timing, question types, break schedule, scoring rules. Same schema as ACT_PROFILE / SAT_PROFILE.</div>
          <div class="sk-step-code">STAAR_PROFILE = {
  testType: "STAAR",
  sections: [ ... ],
  skill_pool: ["reading.*"],
  scoringAdapter: STAARAdapter
}</div>
        </div>
        <div class="sk-step">
          <div class="sk-step-title"><span class="sk-step-num">3</span>Register scoring adapter</div>
          <div class="sk-step-desc">Implement STAARScoringAdapter (computeScores, reporting categories). Editor / Student Exam / Reports inherit automatically from Profile-driven rendering.</div>
          <div class="sk-step-code">registerAdapter("STAAR",
  STAARAdapter)
// Editor: unchanged
// Reports: unchanged</div>
        </div>
      </div>
      <p style="margin:12px 0 0;font-size:12px;color:#52525b;line-height:1.6">Net engineering effort: <b>~1 config file + 1 adapter + QA</b>. Zero schema migrations, zero new question-bank tables, zero re-tagging of existing items.</p>
    </div>
    <div class="flows-card">
      <h4>④ Phase 1 scope — what we commit to</h4>
      <div class="sk-scope">
        <div class="sk-scope-col sk-scope-in">
          <h5>✅ In Phase 1</h5>
          <ul>
            <li><b>v1 Canonical Skill Graph</b> — 180–220 skills across Reading / Writing / Math / Science, 3 layers max</li>
            <li><b>canonical_skill_ids[]</b> field on every question, required on save</li>
            <li><b>Dual-tag Editor</b> — canonical + test-native, AI suggests canonical tag on question save</li>
            <li><b>ACT / SAT mapping table</b> populated, validated with κ ≥ 0.70 inter-rater agreement</li>
            <li><b>Student skill profile</b> aggregates on canonical nodes (teacher-only view)</li>
          </ul>
        </div>
        <div class="sk-scope-col sk-scope-out">
          <h5>❌ Deferred (not Phase 1)</h5>
          <ul>
            <li><b>Peer-normed difficulty</b> — needs data volume, P2</li>
            <li><b>Student-facing canonical view</b> — teacher-only first, P2 exposes to students</li>
            <li><b>Adaptive routing across tests</b> — P3 with MAP</li>
            <li><b>Unified question DB physical merge</b> — logical layer first, physical merge P2</li>
            <li><b>Lesson library mapping</b> — outside assessment scope, P3+</li>
          </ul>
        </div>
      </div>
    </div>`,
    bodyHtmlZh:`<div class="flows-card">
      <h4>① 为什么要做——核心论点</h4>
      <div class="sk-principle-row">
        <div class="sk-principle"><b>一棵树，N 个考试</b><span>Canonical 技能描述的是"能力"，而不是"某个考试的分类"。考试本身就是一次组合——从这棵能力树里抽一个子集出来考。</span></div>
        <div class="sk-principle"><b>学生画像跨考试累积</b><span>ACT Reading 的 "Main Idea" ≡ SAT RW 的 "Main Idea"——同一个节点，同一种信号。学生无论考什么试，能力画像都在往同一个地方沉淀。</span></div>
        <div class="sk-principle"><b>接入新考试只改配置</b><span>加 STAAR/SSAT = 技能池子集 + 章节规则 + 计分适配器。不新建题库、不新建标签字典、不新建报告模板。</span></div>
      </div>
    </div>
    <div class="flows-card">
      <h4>② 一道题是怎么被"索引"的</h4>
      <p>同样一道 Reading 推理题——在 canonical skill graph 落地前 vs 落地后。关键新增字段是 <b>canonical_skill_ids</b>，它让一道题能跨考试复用，也让学生信号能真正聚合起来。</p>
      <div class="sk-before-after">
        <div>
          <div style="font-size:11px;font-weight:800;color:#991b1b;margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px">Before — 目前做法</div>
          <pre class="sk-json">{
  "id": "q_act_read_12",
  "stem": "...the narrator suggests that...",
  <span class="k">"act_tag"</span>: <span class="s">"KID - Inference"</span>,  <span class="c">// 只在 ACT 里有意义</span>
  <span class="k">"sat_tag"</span>: <span class="s">null</span>           <span class="c">// 能不能在 SAT 用？判断不出来</span>
}</pre>
        </div>
        <div>
          <div style="font-size:11px;font-weight:800;color:#166534;margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px">After — Phase 1</div>
          <pre class="sk-json">{
  "id": "q_act_read_12",
  "stem": "...the narrator suggests that...",
  <span class="k new">"canonical_skill_ids"</span>: [
    <span class="s">"reading.inference"</span>,
    <span class="s">"reading.inference.character"</span>
  ],
  <span class="k">"act_native_tag"</span>: <span class="s">"KID - Inference"</span>,
  <span class="k">"sat_native_tag"</span>: <span class="s">"IIC - Inferences"</span>,
  <span class="k new">"usable_in_tests"</span>: [<span class="s">"ACT_READING"</span>, <span class="s">"SAT_RW"</span>, <span class="s">"ISEE_READING"</span>]
}</pre>
        </div>
      </div>
    </div>
    <div class="flows-card">
      <h4>③ 接入一个新考试——STAAR 演示</h4>
      <p>示意：假设 canonical skill graph 已经落地，把 STAAR 十年级阅读接入平台需要做什么。我们押注的核心事情是——<b>随着考试数量增长，工程成本保持有限</b>。</p>
      <div class="sk-steps">
        <div class="sk-step">
          <div class="sk-step-title"><span class="sk-step-num">1</span>映射 STAAR 分类</div>
          <div class="sk-step-desc">打开映射 YAML，加一列 STAAR。优先复用已有 canonical 节点——只有在 STAAR 考到 ACT 和 SAT 都不考的东西时，才新增节点。</div>
          <div class="sk-step-code">reading.main_idea:
  staar_rc: RC.2
reading.inference:
  staar_rc: RC.4</div>
        </div>
        <div class="sk-step">
          <div class="sk-step-title"><span class="sk-step-num">2</span>定义 STAAR_PROFILE</div>
          <div class="sk-step-desc">一个配置文件——章节、时长、题型、休息规则、计分规则。和 ACT_PROFILE / SAT_PROFILE 同一个 schema。</div>
          <div class="sk-step-code">STAAR_PROFILE = {
  testType: "STAAR",
  sections: [ ... ],
  skill_pool: ["reading.*"],
  scoringAdapter: STAARAdapter
}</div>
        </div>
        <div class="sk-step">
          <div class="sk-step-title"><span class="sk-step-num">3</span>注册计分适配器</div>
          <div class="sk-step-desc">实现 STAARScoringAdapter（算分、报告分类）。Editor / 学生考试页 / 报告 都直接从 Profile 驱动，零改动。</div>
          <div class="sk-step-code">registerAdapter("STAAR",
  STAARAdapter)
// Editor：不动
// 报告：不动</div>
        </div>
      </div>
      <p style="margin:12px 0 0;font-size:12px;color:#52525b;line-height:1.6">净工程成本：<b>约 1 个配置文件 + 1 个适配器 + QA</b>。零 schema 迁移，零新建题库表，零对存量题目重新打标。</p>
    </div>
    <div class="flows-card">
      <h4>④ Phase 1 范围——承诺做什么</h4>
      <div class="sk-scope">
        <div class="sk-scope-col sk-scope-in">
          <h5>✅ Phase 1 做</h5>
          <ul>
            <li><b>v1 Canonical Skill Graph</b>——Reading / Writing / Math / Science 共 180–220 个技能，最多 3 层</li>
            <li><b>canonical_skill_ids[]</b> 字段——每道题必填，保存时强校验</li>
            <li><b>双标签 Editor</b>——canonical + 考试原生，保存时 AI 自动建议 canonical 标签</li>
            <li><b>ACT / SAT 映射表</b>——全量填充，标注员一致性 κ ≥ 0.70</li>
            <li><b>学生技能画像</b>——在 canonical 节点上聚合（先只对教师开放）</li>
          </ul>
        </div>
        <div class="sk-scope-col sk-scope-out">
          <h5>❌ Phase 1 不做</h5>
          <ul>
            <li><b>基于同辈数据的难度校准</b>——需要数据量，放 P2</li>
            <li><b>学生端看 canonical 视图</b>——先只对教师开放，P2 再下放到学生</li>
            <li><b>跨考试自适应路由</b>——和 MAP 一起放 P3</li>
            <li><b>题库物理合并</b>——先做逻辑层映射，物理合并放 P2</li>
            <li><b>和 Lesson 库对齐</b>——不在 Assessment 范围内，P3+</li>
          </ul>
        </div>
      </div>
    </div>`,
    nodeActions:{
      R:   "switchRole('teacher',true);nav('act')",
      MI:  "switchRole('teacher',true);nav('act')",
      SD:  "switchRole('teacher',true);nav('act')",
      INF: "switchRole('teacher',true);nav('act')",
      INF1:"switchRole('teacher',true);nav('act')",
      INF2:"switchRole('teacher',true);nav('act')",
      VOC: "switchRole('teacher',true);nav('act')",
      AP:  "switchRole('teacher',true);nav('act')",
      TS:  "switchRole('teacher',true);nav('act')",
      EB:  "switchRole('teacher',true);nav('act')",
      EBQ: "switchRole('teacher',true);nav('sat')",
      CT:  "switchRole('teacher',true);nav('act')",
      TN:  "switchRole('teacher',true);nav('act')",
      CC:  "switchRole('teacher',true);nav('act')"
    }
  },
  {
    id:'edge',
    label:'Edge States',
    labelZh:'边缘态',
    icon:'🧪',
    description:'Preview report-locked states and other release-related edge cases without polluting primary navigation.',
    descriptionZh:'预览"报告锁定"等和发布相关的边缘状态，不污染主导航。',
    chips:['Pending Release', 'Locked State'],
    chipsZh:['待发布', '锁定态'],
    mermaid:`flowchart LR
      G["Teacher finishes grading"] --> P["Report Pending Release"]
      P --> S["Student opens report"]
      S --> Gate["Pending Release Gate"]
      Gate --> R["Teacher releases reports"]
      R --> Live["Full Student Report"]`,
    mermaidZh:`flowchart LR
      G["教师批改完成"] --> P["报告待发布"]
      P --> S["学生打开报告"]
      S --> Gate["待发布拦截页"]
      Gate --> R["教师发布报告"]
      R --> Live["完整学生报告"]`,
    nodeActions:{
      P:   "switchRole('teacher',true);loadSessionDetail('sess-act-1')",
      S:   "previewReportState('act','pending_release')",
      Gate:"previewReportState('act','pending_release')",
      R:   "switchRole('teacher',true);loadSessionDetail('sess-act-1')",
      Live:"switchRole('student',true);openStudentReport('act')"
    }
  },
  {
    id:'ai',
    label:'AI Generate',
    labelZh:'AI 生成',
    icon:'🤖',
    description:'Current AI-driven creation flow from prompt to editor review, assignment, and delivery.',
    descriptionZh:'当前 AI 驱动的出题流程：Prompt → Editor 审阅 → 布置 → 派发。',
    chips:['Prompt', 'Review', 'Governance'],
    chipsZh:['Prompt', '审阅', '治理'],
    mermaid:`flowchart LR
      P["Homepage Prompt / Drawer"] --> CFG["ACT / SAT Config<br/>Framework · Composition · Sections"]
      CFG --> G["AI Generation Pipeline"]
      G --> R["Editor Review"]
      R --> T["Teacher Adjusts Blueprint / Items"]
      T --> A["Assign"]
      A --> S["Session Delivery"]
      S --> GR["Grader + Release"]
      G -. Rules / guardrails .-> GOV["AI Rules + Item Quality Checks"]`,
    mermaidZh:`flowchart LR
      P["首页 Prompt / Drawer"] --> CFG["ACT / SAT 配置<br/>框架 · 题量构成 · 章节"]
      CFG --> G["AI 生成流水线"]
      G --> R["Editor 审阅"]
      R --> T["教师调整蓝图 / 题目"]
      T --> A["布置"]
      A --> S["会话派发"]
      S --> GR["批改 + 发布"]
      G -. 规则 / 约束 .-> GOV["AI 规则 + 题目质量检查"]`,
    nodeActions:{
      P:   "switchRole('teacher',true);nav('homepage')",
      CFG: "switchRole('teacher',true);openDrawer('act')",
      G:   "switchRole('teacher',true);nav('act')",
      R:   "switchRole('teacher',true);nav('act')",
      T:   "switchRole('teacher',true);nav('act')",
      A:   "switchRole('teacher',true);nav('act');setTimeout(()=>openAssignModal('act'),250)",
      S:   "switchRole('teacher',true);loadSessionDetail('sess-act-1')",
      GOV: "switchRole('teacher',true);nav('act')"
    }
  }
];
const FLOW_PHASES = {
  overview: [
    { label:'Setup', labelZh:'起点', accent:'🏁',
      nodes:[
        { id:'H', icon:'🏠', title:'Homepage', titleZh:'首页', desc:'Teacher dashboard — assessments & coursework.', descZh:'教师工作台 · 总览 Assessment 与作业' }
      ]
    },
    { label:'Authoring', labelZh:'出题', accent:'✍️',
      nodes:[
        { id:'D',   icon:'🧩', title:'Drawer Config', titleZh:'Drawer 配置', desc:'Pick test type & exam composition.', descZh:'选择考试类型与题量构成' },
        { id:'GEN', icon:'🤖', title:'AI Generate',   titleZh:'AI 生成',     desc:'Prompt-driven item creation.',        descZh:'Prompt 驱动自动生题' },
        { id:'E',   icon:'📝', title:'Editor',        titleZh:'Editor 审阅', desc:'Review & tag each item.',             descZh:'审阅并打标每道题' }
      ]
    },
    { label:'Deliver & Monitor', labelZh:'派发 & 监控', accent:'📬',
      nodes:[
        { id:'A',  icon:'📬', title:'Assign',             titleZh:'布置',        desc:'Audience → Delivery → Confirm.',    descZh:'选对象 → 派发方式 → 确认' },
        { id:'SD', icon:'📊', title:'Assignment Monitor', titleZh:'作业监控',    desc:'Delivery status, progress, grading.', descZh:'派发状态 · 进度 · 批改' }
      ]
    },
    { label:'Split', labelZh:'分叉', accent:'🔀', branch:true,
      nodes:[
        { id:'G', icon:'🎯', title:'Grader Studio',   titleZh:'批改 Studio',   desc:'Teacher grades submissions.',     descZh:'教师批改学生答卷',        lane:'teacher' },
        { id:'L', icon:'🚪', title:'Student Launch',  titleZh:'学生进入',       desc:'Pre-launch shell for students.',  descZh:'学生预进入壳页',          lane:'student' }
      ]
    },
    { label:'Student · Test', labelZh:'学生 · 答题', accent:'🎓',
      nodes:[
        { id:'R', icon:'✅', title:'Ready Check',       titleZh:'准备确认',     desc:'Equipment & environment check.', descZh:'设备与环境确认', lane:'student' },
        { id:'T', icon:'📘', title:'Standardized Runtime', titleZh:'答题运行时',   desc:'ACT · SAT · TCAP — see test-specific tabs for details.', descZh:'ACT · SAT · TCAP — 详细差异看对应 tab', lane:'student' }
      ]
    },
    { label:'Release', labelZh:'发布', accent:'🏁',
      nodes:[
        { id:'PR', icon:'⏳', title:'Pending Release', titleZh:'待发布',  desc:'Graded; awaiting teacher release.', descZh:'批改完毕 · 等教师放行', lane:'teacher' },
        { id:'RP', icon:'📈', title:'Student Report',  titleZh:'学生报告', desc:'Final released score report.',     descZh:'已发布的完整成绩报告',  lane:'student' }
      ]
    }
  ],
  act_teacher: [
    { label:'Setup', labelZh:'起点', accent:'🏁',
      nodes:[{ id:'H', icon:'🏠', title:'Homepage', titleZh:'首页', desc:'Teacher dashboard.', descZh:'教师工作台' }]
    },
    { label:'Authoring', labelZh:'出题', accent:'🎯',
      nodes:[
        { id:'D',   icon:'🧩', title:'ACT Drawer',   titleZh:'ACT Drawer',  desc:'Pick 4 sections + optional Writing toggle.',   descZh:'4 个固定 section + 是否带 Writing' },
        { id:'GEN', icon:'🤖', title:'AI Generate',  titleZh:'AI 生成',      desc:'Per-section blueprint.',                       descZh:'分 section 蓝图生题' },
        { id:'E',   icon:'📝', title:'Editor',       titleZh:'Editor 审阅',  desc:'Section-tab review; Writing rubric attached.', descZh:'Section tab 审阅；Writing 自动挂 rubric' }
      ]
    },
    { label:'Deliver', labelZh:'派发', accent:'📬',
      nodes:[{ id:'A', icon:'📬', title:'Assign · 1 sitting = 1 Assignment', titleZh:'布置 · 1 次坐下 = 1 Assignment', desc:'Whole exam dispatched as a single assignment.', descZh:'整张试卷作为 1 个 assignment 派发' }]
    },
    { label:'Monitor', labelZh:'监控', accent:'📡',
      nodes:[
        { id:'SD', icon:'📊', title:'Assignment Monitor', titleZh:'作业监控',     desc:'Session overview + controls.',   descZh:'会话总览 + 控制面板' },
        { id:'M',  icon:'🔄', title:'Per-student Status', titleZh:'逐学生状态',   desc:'In-progress / submitted / late.', descZh:'答题中 / 已交 / 逾期' }
      ]
    },
    { label:'Grade', labelZh:'批改', accent:'✅',
      nodes:[
        { id:'G',  icon:'🎯', title:'Grader',                  titleZh:'批改',         desc:'Auto-score MCQ; Writing → manual rubric (4 dimensions × 2 raters).', descZh:'选择题自动评分；Writing 走人工 rubric（4 维 × 2 个 rater）' },
        { id:'P',  icon:'⏳', title:'Send to Pending Release', titleZh:'进入待发布',   desc:'Graded; awaiting release.',                                          descZh:'批改完毕 · 等待发布' }
      ]
    },
    { label:'Release', labelZh:'发布', accent:'🚀',
      nodes:[
        { id:'SD2', icon:'🔍', title:'Assignment Review', titleZh:'作业复盘', desc:'QA before release.',      descZh:'发布前的质量复盘' },
        { id:'RR',  icon:'🚀', title:'Release Reports',   titleZh:'发布报告', desc:'Unlock student reports.', descZh:'放行学生成绩报告' }
      ]
    }
  ],
  act_student: [
    { label:'Enter', labelZh:'进入', accent:'🚪',
      nodes:[{ id:'L', icon:'🚪', title:'Student Launch', titleZh:'学生进入', desc:'Pre-launch shell.', descZh:'学生预进入壳页' }]
    },
    { label:'Ready', labelZh:'准备', accent:'✅',
      nodes:[{ id:'RC', icon:'✅', title:'Ready Check', titleZh:'准备确认', desc:'Equipment & environment check.', descZh:'设备与环境确认' }]
    },
    { label:'ACT Sitting', labelZh:'ACT 答题', accent:'📘', cluster:true,
      nodes:[
        { id:'S1', icon:'📖', title:'Section 1 · English', titleZh:'Section 1 · English', desc:'45 min · 75 items',                                  descZh:'45 min · 75 题' },
        { id:'S2', icon:'🧮', title:'Section 2 · Math',    titleZh:'Section 2 · Math',    desc:'60 min · 60 items',                                  descZh:'60 min · 60 题' },
        { id:'BR', icon:'☕', title:'Break',                titleZh:'休息',                 desc:'10 min after Math.',                                 descZh:'数学结束后 10 分钟休息' },
        { id:'S3', icon:'📚', title:'Section 3 · Reading', titleZh:'Section 3 · Reading', desc:'35 min · 40 items',                                  descZh:'35 min · 40 题' },
        { id:'S4', icon:'🔬', title:'Section 4 · Science', titleZh:'Section 4 · Science', desc:'35 min · 40 items',                                  descZh:'35 min · 40 题' },
        { id:'W',  icon:'✍️', title:'Writing · optional',  titleZh:'Writing · 可选',       desc:'40 min · 1 essay · skipped if Drawer toggled off.',  descZh:'40 min · 1 篇 essay · Drawer 关闭则跳过' }
      ]
    },
    { label:'Submit', labelZh:'交卷', accent:'📤',
      nodes:[{ id:'SUB', icon:'📤', title:'Auto Submit / Finish', titleZh:'自动提交 / 交卷', desc:'System collects responses.', descZh:'系统自动收卷' }]
    },
    { label:'Wait', labelZh:'等待', accent:'⏳',
      nodes:[{ id:'WAIT', icon:'⏳', title:'Await Teacher Release', titleZh:'等待教师发布', desc:'Report locked until teacher releases.', descZh:'报告锁定 · 等教师发布' }]
    },
    { label:'Report', labelZh:'报告', accent:'📈',
      nodes:[{ id:'REP', icon:'📈', title:'Score Report', titleZh:'成绩报告', desc:'Composite + per-section + Writing 2-12.', descZh:'综合分 + 各 section 分 + Writing 2-12 分' }]
    }
  ],
  tcap_teacher: [
    { label:'Setup', labelZh:'起点', accent:'🏁',
      nodes:[{ id:'H', icon:'🏠', title:'Homepage', titleZh:'首页', desc:'Teacher dashboard.', descZh:'教师工作台' }]
    },
    { label:'Authoring', labelZh:'出题', accent:'📋',
      nodes:[
        { id:'D',     icon:'🧩', title:'TCAP Drawer',           titleZh:'TCAP Drawer',           desc:'Subject × Grade → number of subparts is dynamic.',                            descZh:'科目 × 年级 → subpart 数量动态变化' },
        { id:'GEN',   icon:'🤖', title:'AI Generate',           titleZh:'AI 生成',                desc:'Per-subpart blueprint with TN standards map (ELA 2019 / Math 2021).',          descZh:'分 subpart 蓝图，对齐 TN 标准（ELA 2019 / Math 2021）' },
        { id:'FLOOR', icon:'📦', title:'Item bank floor check', titleZh:'题库下限校验',           desc:'≥8 items / standard / difficulty.',                                            descZh:'每个 standard × 难度 ≥ 8 题' },
        { id:'E',     icon:'📝', title:'Editor',                titleZh:'Editor',                desc:'Subpart tabs; Writing rubric attached for ELA SP1.',                            descZh:'subpart tab 审阅；ELA SP1 Writing 自动挂 rubric' }
      ]
    },
    { label:'Decision', labelZh:'决策点', accent:'⚠️',
      nodes:[{ id:'DEC', icon:'⚠️', title:'1 Assignment OR 4 Sub-Assignments?', titleZh:'1 个 Assignment 还是 4 个 Sub-Assignment？',
        desc:'Open product question — Option X (current prototype) keeps subparts inside one assignment; Option Z (industry standard) wraps an AssessmentPackage with N sub-assignments.',
        descZh:'未拍板 — Option X（原型现状）：1 个 assignment 内嵌 subparts；Option Z（行业标准）：1 个 AssessmentPackage 包 N 个 sub-assignment' }]
    },
    { label:'Deliver · Live', labelZh:'派发 · Live', accent:'📡',
      nodes:[
        { id:'A',  icon:'📬', title:'Assign · Live-coordinated', titleZh:'布置 · Live 协同', desc:'Teacher controls per-subpart start; supports synchronized class-wide launch.', descZh:'教师逐 subpart 启动；支持全班同步开考' },
        { id:'MK', icon:'🔁', title:'Make-up policy',            titleZh:'补考策略',          desc:'Default: reopen missed subpart only (pending TN piloter / TDOE sign-off · PRD §5.5.7).', descZh:'默认：仅重开缺考的 subpart（等 TN piloter / TDOE 拍板 · PRD 5.5.7）' }
      ]
    },
    { label:'Monitor', labelZh:'监控', accent:'📊',
      nodes:[
        { id:'SD', icon:'📊', title:'Per-subpart Monitor',   titleZh:'按 subpart 监控',   desc:'Status × Subpart matrix; pause / resume per cohort.',                  descZh:'状态 × subpart 矩阵；按班级 pause / resume' },
        { id:'M',  icon:'🔄', title:'Per-student Status',    titleZh:'逐学生状态',         desc:'In-progress / submitted / late / make-up needed.',                     descZh:'答题中 / 已交 / 逾期 / 待补考' }
      ]
    },
    { label:'Grade', labelZh:'批改', accent:'✅',
      nodes:[
        { id:'G', icon:'🎯', title:'Grader · Dual-mode',      titleZh:'批改 · 双模式',  desc:'Auto-score MCQ + manual Writing; G3-5 handwritten upload viewer, G6-8 typed viewer.', descZh:'选择题自动；Writing 手动评分 — G3-5 手写扫描 viewer、G6-8 typed viewer' },
        { id:'P', icon:'⏳', title:'Send to Pending Release', titleZh:'进入待发布',     desc:'Graded; awaiting release.',                                                       descZh:'批改完毕 · 等待发布' }
      ]
    },
    { label:'Release', labelZh:'发布', accent:'🚀',
      nodes:[
        { id:'SD2', icon:'🔍', title:'Assignment Review',  titleZh:'作业复盘',     desc:'QA before release; "preliminary cut-score" banner shown until 2026-27.',     descZh:'发布前 QA；2026-27 之前显示 "preliminary cut-score" 横幅' },
        { id:'RR',  icon:'🚀', title:'Release Reports',    titleZh:'发布报告',     desc:'Unlock student reports.',                                                     descZh:'放行学生成绩报告' }
      ]
    }
  ],
  tcap_student: [
    { label:'Enter', labelZh:'进入', accent:'🚪',
      nodes:[{ id:'L', icon:'🚪', title:'Student Launch', titleZh:'学生进入', desc:'Pre-launch shell.', descZh:'学生预进入壳页' }]
    },
    { label:'Ready', labelZh:'准备', accent:'✅',
      nodes:[{ id:'RC', icon:'✅', title:'Ready Check', titleZh:'准备确认', desc:'Equipment & environment check.', descZh:'设备与环境确认' }]
    },
    { label:'TCAP Subparts (varies by subject)', labelZh:'TCAP Subpart（按 subject 不同）', accent:'📋',
      subjectLanes:[
        { label:'ELA', labelZh:'ELA', sub:'4 Subparts · 235 min', subZh:'4 个 Subpart · 235 分钟',
          nodes:[
            { id:'SP1', icon:'✍️', title:'SP1 · Writing',       titleZh:'SP1 · Writing',     desc:'85 min · human-review only · scheduled first.',   descZh:'85 分钟 · 仅人工评分 · 必须最先安排' },
            { id:'SP2', icon:'📖', title:'SP2 · Lit Reading',   titleZh:'SP2 · 文学阅读',     desc:'50 min · literary comprehension.',                  descZh:'50 分钟 · 文学类阅读理解' },
            { id:'SP3', icon:'📰', title:'SP3 · Info Reading',  titleZh:'SP3 · 信息阅读',     desc:'50 min · informational text.',                      descZh:'50 分钟 · 信息类文本' },
            { id:'SPN', icon:'🔤', title:'SP4 · Language',      titleZh:'SP4 · 语言规范',     desc:'50 min · conventions.',                             descZh:'50 分钟 · 语言规范' }
          ]
        },
        { label:'Math', labelZh:'Math', sub:'3 Subparts · 180 min', subZh:'3 个 Subpart · 180 分钟',
          nodes:[
            { id:'SP1', icon:'➗', title:'SP1 · No-Calc',          titleZh:'SP1 · 无计算器',    desc:'60 min · calculator disabled · scheduled first.', descZh:'60 分钟 · 计算器禁用 · 必须最先安排' },
            { id:'SP2', icon:'🧮', title:'SP2 · Problem Solving',  titleZh:'SP2 · 问题求解 I',  desc:'60 min · calculator allowed.',                      descZh:'60 分钟 · 可用计算器' },
            { id:'SP3', icon:'🧮', title:'SP3 · Problem Solving',  titleZh:'SP3 · 问题求解 II', desc:'60 min · calculator allowed.',                      descZh:'60 分钟 · 可用计算器' },
            null
          ]
        },
        { label:'Science 5-8 / SS', labelZh:'Science 5-8 / 社科', sub:'2 Subparts · 90 min', subZh:'2 个 Subpart · 90 分钟',
          nodes:[
            { id:'SP1', icon:'🔬', title:'SP1 · Part 1', titleZh:'SP1 · 第 1 部分', desc:'45 min.', descZh:'45 分钟' },
            { id:'SP2', icon:'🔬', title:'SP2 · Part 2', titleZh:'SP2 · 第 2 部分', desc:'45 min.', descZh:'45 分钟' },
            null,
            null
          ]
        },
        { label:'Science 3-4', labelZh:'Science 3-4', sub:'1 Subpart · 50 min', subZh:'1 个 Subpart · 50 分钟',
          nodes:[
            { id:'SP1', icon:'🔬', title:'SP1 · Single Session', titleZh:'SP1 · 单次完成', desc:'50 min · full content in one session.', descZh:'50 分钟 · 一次性考完全部内容' },
            null,
            null,
            null
          ]
        }
      ],
      legend:{
        icon:'⏸️',
        text:'Cross-day pause may occur between any two subparts; state is autosaved (especially ELA SP1 Writing).',
        textZh:'subpart 之间可跨天暂停；状态自动保存（尤其 ELA SP1 Writing）。'
      }
    },
    { label:'Submit', labelZh:'交卷', accent:'📤',
      nodes:[{ id:'SUB', icon:'📤', title:'Submit', titleZh:'交卷', desc:'After last subpart; partial-submit allowed if make-up active.', descZh:'最后一个 subpart 完成后交卷；补考状态允许分次提交' }]
    },
    { label:'Wait', labelZh:'等待', accent:'⏳',
      nodes:[{ id:'WAIT', icon:'⏳', title:'Await Teacher Release', titleZh:'等待教师发布', desc:'Report locked until teacher releases.', descZh:'报告锁定 · 等教师发布' }]
    },
    { label:'Report', labelZh:'报告', accent:'📈',
      nodes:[{ id:'REP', icon:'📈', title:'Score Report', titleZh:'成绩报告', desc:'Performance level (1-4) + Near Target Students bucket + per-standard breakdown.', descZh:'Performance level（1-4）+ Near Target Students bucket + 按 standard 拆解' }]
    }
  ],
  act: [
    { label:'Setup', labelZh:'起点', accent:'🏁',
      nodes:[
        { id:'H', icon:'🏠', title:'Homepage', titleZh:'首页', desc:'Teacher dashboard.', descZh:'教师工作台' }
      ]
    },
    { label:'ACT Authoring', labelZh:'ACT 出题', accent:'🎯',
      nodes:[
        { id:'D',   icon:'🧩', title:'ACT Drawer',   titleZh:'ACT Drawer',   desc:'4 fixed sections + optional Writing toggle.',     descZh:'4 个固定 section + 可选 Writing 开关' },
        { id:'GEN', icon:'🤖', title:'AI Generate',  titleZh:'AI 生成',       desc:'Per-section blueprint (English / Math / Reading / Science).', descZh:'分 section 蓝图（英语 / 数学 / 阅读 / 科学）' },
        { id:'E',   icon:'📝', title:'Editor',       titleZh:'Editor',       desc:'Section-tab review; Writing tab if enabled.',     descZh:'Section tab 审阅；开了 Writing 才出 Writing tab' }
      ]
    },
    { label:'Deliver', labelZh:'派发', accent:'📬',
      nodes:[
        { id:'A',  icon:'📬', title:'Assign · 1 sitting = 1 Assignment', titleZh:'布置 · 1 次坐下 = 1 Assignment', desc:"Whole exam dispatched as one assignment object — unlike TCAP.", descZh:'整张试卷作为 1 个 assignment 派发——与 TCAP 不同' }
      ]
    },
    { label:'Student · ACT Sitting', labelZh:'学生 · ACT 答题', accent:'🎓', cluster:true,
      nodes:[
        { id:'L',  icon:'🚪', title:'Student Launch', titleZh:'学生进入', desc:'Pre-launch shell.', descZh:'学生预进入壳页', lane:'student' },
        { id:'S1', icon:'📖', title:'Section 1 · English', titleZh:'Section 1 · English', desc:'45 min · 75 items',         descZh:'45 min · 75 题',         lane:'student' },
        { id:'S2', icon:'🧮', title:'Section 2 · Math',    titleZh:'Section 2 · Math',    desc:'60 min · 60 items',         descZh:'60 min · 60 题',         lane:'student' },
        { id:'BR', icon:'☕', title:'Break',                titleZh:'休息',                 desc:'10 min after Math.',        descZh:'数学结束后 10 分钟休息', lane:'student' },
        { id:'S3', icon:'📚', title:'Section 3 · Reading', titleZh:'Section 3 · Reading', desc:'35 min · 40 items',         descZh:'35 min · 40 题',         lane:'student' },
        { id:'S4', icon:'🔬', title:'Section 4 · Science', titleZh:'Section 4 · Science', desc:'35 min · 40 items',         descZh:'35 min · 40 题',         lane:'student' },
        { id:'W',  icon:'✍️', title:'Writing · optional',  titleZh:'Writing · 可选',       desc:'40 min · 1 essay · skipped if Drawer toggled off.', descZh:'40 min · 1 篇 essay · Drawer 关闭则跳过', lane:'student' },
        { id:'SUB',icon:'📤', title:'Submit',              titleZh:'交卷',                 desc:'Auto-collect responses.',   descZh:'系统自动收卷',           lane:'student' }
      ]
    },
    { label:'Grade & Release', labelZh:'批改 & 发布', accent:'🚀',
      nodes:[
        { id:'G',  icon:'🎯', title:'Grader',             titleZh:'批改',     desc:'Auto-score MCQ; Writing → manual rubric grading (Ideas / Development / Organization / Language).', descZh:'选择题自动评分；Writing 走人工 rubric 批改（Ideas / Development / Organization / Language）', lane:'teacher' },
        { id:'PR', icon:'⏳', title:'Pending Release',    titleZh:'待发布',   desc:'Awaiting teacher release.',                  descZh:'等教师放行', lane:'teacher' },
        { id:'RP', icon:'📈', title:'Released Report',    titleZh:'学生报告', desc:'Composite + per-section + Writing 2-12.',     descZh:'综合分 + 各 section 分 + Writing 2-12 分', lane:'student' }
      ]
    }
  ],
  tcap: [
    { label:'Setup', labelZh:'起点', accent:'🏁',
      nodes:[
        { id:'H', icon:'🏠', title:'Homepage', titleZh:'首页', desc:'Teacher dashboard.', descZh:'教师工作台' }
      ]
    },
    { label:'TCAP Authoring', labelZh:'TCAP 出题', accent:'📋',
      nodes:[
        { id:'D',     icon:'🧩', title:'TCAP Drawer',           titleZh:'TCAP Drawer',           desc:'Subject × Grade → number of subparts is dynamic (ELA 4 / Math 2 / Sci 1 / SS 1).', descZh:'科目 × 年级 → subpart 数量动态变化（ELA 4 / Math 2 / Sci 1 / SS 1）' },
        { id:'GEN',   icon:'🤖', title:'AI Generate',           titleZh:'AI 生成',                desc:'Per-subpart blueprint with TN standards map (ELA 2019 / Math 2021).',          descZh:'分 subpart 蓝图，对齐 TN 标准（ELA 2019 / Math 2021）' },
        { id:'FLOOR', icon:'📦', title:'Item bank floor check', titleZh:'题库下限校验',           desc:'≥8 items / standard / difficulty; under-floor → regen + flag for QA.',          descZh:'每个 standard × 难度 ≥ 8 题；不足则补生成 + 标 QA' },
        { id:'E',     icon:'📝', title:'Editor',                titleZh:'Editor',                desc:'Subpart tabs; Writing rubric attached for ELA SP1 (G3-5 paper / G6-8 typed).',  descZh:'subpart tab 审阅；ELA SP1 Writing 自动挂 rubric（G3-5 纸笔 / G6-8 电子）' }
      ]
    },
    { label:'Decision', labelZh:'决策点', accent:'⚠️',
      nodes:[
        { id:'DEC', icon:'⚠️', title:'1 Assignment OR 4 Sub-Assignments?', titleZh:'1 个 Assignment 还是 4 个 Sub-Assignment？',
          desc:'Open product question — Option X (current prototype) keeps subparts inside one assignment; Option Z (industry standard) wraps an AssessmentPackage with N sub-assignments. Affects monitor card count, make-up granularity, Live-mode UX.',
          descZh:'未拍板 — Option X（原型现状）：1 个 assignment 内嵌 subparts；Option Z（行业标准）：1 个 AssessmentPackage 包 N 个 sub-assignment。直接影响监控卡片数量、补考粒度、Live-mode 操作。' }
      ]
    },
    { label:'Deliver · Live Mode', labelZh:'派发 · Live Mode', accent:'📡',
      nodes:[
        { id:'A',  icon:'📬', title:'Assign · Live-coordinated', titleZh:'布置 · Live 协同', desc:'Teacher controls per-subpart start; supports synchronized class-wide launch.', descZh:'教师逐 subpart 启动；支持全班同步开考' },
        { id:'MK', icon:'🔁', title:'Make-up policy',            titleZh:'补考策略',          desc:'Default: reopen missed subpart only (pending TN piloter / TDOE sign-off · PRD §5.5.7).', descZh:'默认：仅重开缺考的 subpart（等 TN piloter / TDOE 拍板 · PRD 5.5.7）' }
      ]
    },
    { label:'Student · TCAP Subparts (varies by subject)', labelZh:'学生 · TCAP Subpart（按 subject 不同）', accent:'🎓',
      subjectLanes:[
        { label:'ELA', labelZh:'ELA', sub:'4 Subparts · 235 min', subZh:'4 个 Subpart · 235 分钟',
          nodes:[
            { id:'L',   icon:'🚪', title:'Launch',              titleZh:'进入',             desc:'Pre-launch + readiness.',                          descZh:'预进入 + 准备确认' },
            { id:'SP1', icon:'✍️', title:'SP1 · Writing',       titleZh:'SP1 · Writing',     desc:'85 min · human-review only.',                      descZh:'85 分钟 · 仅人工评分' },
            { id:'SP2', icon:'📖', title:'SP2 · Lit Reading',   titleZh:'SP2 · 文学阅读',     desc:'50 min · literary comprehension.',                  descZh:'50 分钟 · 文学阅读' },
            { id:'SP3', icon:'📰', title:'SP3 · Info Reading',  titleZh:'SP3 · 信息阅读',     desc:'50 min · informational text.',                      descZh:'50 分钟 · 信息文本' },
            { id:'SPN', icon:'🔤', title:'SP4 · Language',      titleZh:'SP4 · 语言规范',     desc:'50 min · conventions.',                             descZh:'50 分钟 · 语言规范' },
            { id:'SUB', icon:'📤', title:'Submit',              titleZh:'交卷',              desc:'After SP4.',                                        descZh:'SP4 完成后交卷' }
          ]
        },
        { label:'Math', labelZh:'Math', sub:'3 Subparts · 180 min', subZh:'3 个 Subpart · 180 分钟',
          nodes:[
            { id:'L',   icon:'🚪', title:'Launch',                titleZh:'进入',             desc:'Pre-launch + readiness.',                  descZh:'预进入 + 准备确认' },
            { id:'SP1', icon:'➗', title:'SP1 · No-Calc',          titleZh:'SP1 · 无计算器',    desc:'60 min · calculator disabled.',             descZh:'60 分钟 · 计算器禁用' },
            { id:'SP2', icon:'🧮', title:'SP2 · Problem Solving',  titleZh:'SP2 · 问题求解 I',  desc:'60 min · calculator allowed.',              descZh:'60 分钟 · 可用计算器' },
            { id:'SP3', icon:'🧮', title:'SP3 · Problem Solving',  titleZh:'SP3 · 问题求解 II', desc:'60 min · calculator allowed.',              descZh:'60 分钟 · 可用计算器' },
            null,
            { id:'SUB', icon:'📤', title:'Submit',                titleZh:'交卷',             desc:'After SP3.',                                descZh:'SP3 完成后交卷' }
          ]
        },
        { label:'Science 5-8 / SS', labelZh:'Science 5-8 / 社科', sub:'2 Subparts · 90 min', subZh:'2 个 Subpart · 90 分钟',
          nodes:[
            { id:'L',   icon:'🚪', title:'Launch',       titleZh:'进入',          desc:'Pre-launch + readiness.', descZh:'预进入 + 准备确认' },
            { id:'SP1', icon:'🔬', title:'SP1 · Part 1', titleZh:'SP1 · 第 1 部分', desc:'45 min.',                  descZh:'45 分钟' },
            { id:'SP2', icon:'🔬', title:'SP2 · Part 2', titleZh:'SP2 · 第 2 部分', desc:'45 min.',                  descZh:'45 分钟' },
            null,
            null,
            { id:'SUB', icon:'📤', title:'Submit',       titleZh:'交卷',          desc:'After SP2.',              descZh:'SP2 完成后交卷' }
          ]
        },
        { label:'Science 3-4', labelZh:'Science 3-4', sub:'1 Subpart · 50 min', subZh:'1 个 Subpart · 50 分钟',
          nodes:[
            { id:'L',   icon:'🚪', title:'Launch',                titleZh:'进入',           desc:'Pre-launch + readiness.',         descZh:'预进入 + 准备确认' },
            { id:'SP1', icon:'🔬', title:'SP1 · Single Session',  titleZh:'SP1 · 单次完成',  desc:'50 min · full content in one go.', descZh:'50 分钟 · 一次考完全部内容' },
            null,
            null,
            null,
            { id:'SUB', icon:'📤', title:'Submit',                titleZh:'交卷',           desc:'After SP1.',                       descZh:'SP1 完成后交卷' }
          ]
        }
      ],
      legend:{
        icon:'⏸️',
        text:'Cross-day pause may occur between any two subparts; state is autosaved (especially ELA SP1 Writing).',
        textZh:'subpart 之间可跨天暂停；状态自动保存（尤其 ELA SP1 Writing）。'
      }
    },
    { label:'Grade & Release', labelZh:'批改 & 发布', accent:'🚀',
      nodes:[
        { id:'G',  icon:'🎯', title:'Grader · Dual-mode',    titleZh:'批改 · 双模式', desc:'Auto-score MCQ + manual Writing; G3-5 handwritten upload viewer, G6-8 typed viewer.', descZh:'选择题自动；Writing 手动评分 — G3-5 手写扫描 viewer、G6-8 typed viewer', lane:'teacher' },
        { id:'PR', icon:'⏳', title:'Pending Release',        titleZh:'待发布',         desc:'Awaiting teacher release; Cut-score banner shows "preliminary" until 2026-27.',     descZh:'等教师放行；Cut-score 横幅在 2026-27 前显示 "preliminary"',                lane:'teacher' },
        { id:'RP', icon:'📈', title:'Released Report',       titleZh:'学生报告',       desc:'Performance level (1-4) + Near Target Students bucket + per-standard breakdown.',  descZh:'Performance level（1-4）+ Near Target Students bucket + 按 standard 拆解',  lane:'student' }
      ]
    }
  ],
  edge: [
    { label:'Grading done', labelZh:'批改完成', accent:'✅',
      nodes:[{ id:'G', icon:'✅', title:'Teacher finishes grading', titleZh:'教师批改完成', desc:'All submissions graded.', descZh:'所有答卷批改完毕' }]
    },
    { label:'Pending', labelZh:'待发布', accent:'⏳',
      nodes:[{ id:'P', icon:'⏳', title:'Report Pending Release', titleZh:'报告待发布', desc:'Not yet visible to students.', descZh:'学生还看不到报告' }]
    },
    { label:'Student opens', labelZh:'学生打开', accent:'👀',
      nodes:[{ id:'S', icon:'👀', title:'Student opens report', titleZh:'学生打开报告', desc:'Student clicks into their report.', descZh:'学生点开自己的报告' }]
    },
    { label:'Gate', labelZh:'拦截', accent:'🚧',
      nodes:[{ id:'Gate', icon:'🚧', title:'Pending Release Gate', titleZh:'待发布拦截页', desc:'Locked state instead of full report.', descZh:'显示锁定拦截页，而不是完整报告' }]
    },
    { label:'Teacher releases', labelZh:'教师发布', accent:'🚀',
      nodes:[{ id:'R', icon:'🚀', title:'Teacher releases reports', titleZh:'教师发布报告', desc:'Batch unlock from monitor.', descZh:'从监控端批量放行' }]
    },
    { label:'Live', labelZh:'放行', accent:'📈',
      nodes:[{ id:'Live', icon:'📈', title:'Full Student Report', titleZh:'完整学生报告', desc:'Unlocked score + skill breakdown.', descZh:'解锁后的成绩与技能拆解' }]
    }
  ],
  ai: [
    { label:'Prompt', labelZh:'Prompt 入口', accent:'💡',
      nodes:[{ id:'P', icon:'💡', title:'Homepage Prompt / Drawer', titleZh:'首页 Prompt / Drawer', desc:'AI prompt or explicit drawer config.', descZh:'AI Prompt 或显式 Drawer 配置' }]
    },
    { label:'Configure', labelZh:'配置', accent:'🧩',
      nodes:[{ id:'CFG', icon:'🧩', title:'ACT / SAT Config', titleZh:'ACT / SAT 配置', desc:'Framework · Composition · Sections.', descZh:'框架 · 题量构成 · 章节' }]
    },
    { label:'Generate', labelZh:'生成', accent:'🤖',
      nodes:[
        { id:'G',   icon:'🤖', title:'AI Generation Pipeline',   titleZh:'AI 生成流水线', desc:'Items generated per blueprint.', descZh:'按蓝图批量生成题目' },
        { id:'GOV', icon:'🛡️', title:'AI Rules + Quality Checks', titleZh:'AI 规则 + 质量检查', desc:'Guardrails for item quality.', descZh:'保障题目质量的约束机制' }
      ]
    },
    { label:'Review', labelZh:'审阅', accent:'📝',
      nodes:[
        { id:'R', icon:'📝', title:'Editor Review',    titleZh:'Editor 审阅', desc:'Teacher reviews generated items.', descZh:'教师审阅 AI 生成的题目' },
        { id:'T', icon:'🔧', title:'Teacher Adjusts',  titleZh:'教师调整',    desc:'Edit blueprint / items.',          descZh:'调整蓝图 / 题目细节' }
      ]
    },
    { label:'Deliver', labelZh:'派发', accent:'📬',
      nodes:[
        { id:'A', icon:'📬', title:'Assign',           titleZh:'布置',     desc:'Audience → Delivery → Confirm.', descZh:'选对象 → 派发方式 → 确认' },
        { id:'S', icon:'📊', title:'Session Delivery', titleZh:'会话派发', desc:'Assignment monitoring begins.',  descZh:'进入作业监控' }
      ]
    },
    { label:'Grade & Release', labelZh:'批改 & 发布', accent:'🚀',
      nodes:[{ id:'GR', icon:'🚀', title:'Grader + Release', titleZh:'批改 + 发布', desc:'Grade → pending → release.', descZh:'批改 → 待发布 → 放行' }]
    }
  ],
  skillGraph: [
    { cluster:true, label:'Comprehension', labelZh:'理解', accent:'📖',
      nodes:[
        { id:'MI',  icon:'🎯', title:'Main Idea · Central Theme', titleZh:'主旨 · 中心思想', desc:'reading.main_idea',        descZh:'reading.main_idea' },
        { id:'SD',  icon:'📌', title:'Supporting Details',        titleZh:'细节定位',         desc:'reading.supporting_detail', descZh:'reading.supporting_detail' },
        { id:'VOC', icon:'📚', title:'Vocab in Context',          titleZh:'语境词义',         desc:'reading.vocab_in_context',  descZh:'reading.vocab_in_context' }
      ]
    },
    { cluster:true, label:'Inference', labelZh:'推理', accent:'🧠',
      nodes:[
        { id:'INF', icon:'🧠', title:'Inference', titleZh:'推理', desc:'reading.inference', descZh:'reading.inference',
          children:[
            { title:'Character Motivation', titleZh:'人物动机' },
            { title:'Causal',               titleZh:'因果推理' }
          ]
        }
      ]
    },
    { cluster:true, label:'Craft & Structure', labelZh:'写作技巧 · 结构', accent:'🏗️',
      nodes:[
        { id:'AP', icon:'🎭', title:"Author's Purpose · Rhetoric", titleZh:'作者意图 · 修辞',   desc:'reading.author_purpose',  descZh:'reading.author_purpose' },
        { id:'TS', icon:'🧱', title:'Text Structure · Organization', titleZh:'文本结构 · 组织', desc:'reading.text_structure', descZh:'reading.text_structure' },
        { id:'TN', icon:'🎵', title:'Tone · Attitude',              titleZh:'语气 · 态度',       desc:'reading.tone',            descZh:'reading.tone' }
      ]
    },
    { cluster:true, label:'Evidence & Synthesis', labelZh:'证据 · 综合', accent:'🔍',
      nodes:[
        { id:'EB', icon:'🔍', title:'Textual Evidence', titleZh:'文本证据', desc:'reading.evidence_based', descZh:'reading.evidence_based',
          children:[
            { title:'Quantitative', titleZh:'量化证据', badge:'SAT-only', badgeZh:'仅 SAT' }
          ]
        },
        { id:'CT', icon:'🔄', title:'Cross-Text Synthesis',   titleZh:'跨文本综合', desc:'reading.cross_text', descZh:'reading.cross_text' },
        { id:'CC', icon:'⚖️', title:'Claims · Counterclaims', titleZh:'观点 · 反驳', desc:'reading.claims',     descZh:'reading.claims' }
      ]
    }
  ]
};
let assignState = {
  step:0,
  assessmentType:'generic',
  className:'Period 2 — College Prep',
  selectedStudents:28,
  deliveryMode:'Scheduled',
  reportState:'pending_release'
};

function getSession(sessionId) {
  return SESSION_DATA.find(s => s.id === sessionId) || SESSION_DATA[0];
}
let currentAssessmentDetailSessionId = 'sess-act-1';
function openAssessmentDetail(sessionId) {
  currentAssessmentDetailSessionId = sessionId;
  currentSessionId = sessionId;
  nav('assessment-detail');
}
function openTcapEdit(sessionId = 'sess-tcap-1') {
  currentAssessmentDetailSessionId = sessionId;
  currentSessionId = sessionId;
  currentSubpartCode = 'SP1';
  newEditMode = 'edit';
  switchRole('teacher', true);
  nav('tcap-edit');
}

/* ───────────────────────── Homepage assessment-card actions ─────────────────────────
   Mirrors packages/webapp/.../AssessmentCard/AssessmentCard.tsx — three icon buttons
   (Copy / Favorite / More) plus a More dropdown (Add to collection ▸ / Rename /
   Archive / Delete). Kept in sync with the production card so the prototype reads
   the same as the shipped product. State is local-only (no persistence). */
const ASSESS_CARD_ICON = {
  copy: '<svg viewBox="0 0 256 256" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/></svg>',
  star:'<svg viewBox="0 0 256 256" width="16" height="16" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m135.42,29.84 26.76,54.23 59.86,8.7-43.31,42.2 10.22,59.62L135.42,166.45 81.89,194.59 92.11,134.97 48.8,92.77 108.66,84.07Z"/></svg>',
  starFill:'<svg viewBox="0 0 256 256" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="m234.5,114.38-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34L128,199.86l-51.11,29.84a16,16,0,0,1-23.84-17.34l13.51-58.6L21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a16,16,0,0,1,29.44,0l23.21,55.36,59.46,5.15a16,16,0,0,1,9.11,28.06Z"/></svg>',
  more:'<svg viewBox="0 0 256 256" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="128" cy="64" r="14"/><circle cx="128" cy="128" r="14"/><circle cx="128" cy="192" r="14"/></svg>'
};
/* Mock collections — same shape the dropdown would receive from the API */
const ASSESS_CARD_MOCK_COLLECTIONS = ['My favorites', 'TN Pilot Aug 2025', 'ACT prep'];
const ASSESS_CARD_FAV = {};        /* aid -> bool */
const ASSESS_CARD_ARCHIVED = {};   /* aid -> bool (visual only, no card removal in demo) */

function assessCardToast(msg) {
  let el = document.getElementById('assessCardToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'assessCardToast';
    el.className = 'card-action-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 1800);
}

function assessCardActionsHtml(aid) {
  const fav = !!ASSESS_CARD_FAV[aid];
  const archived = !!ASSESS_CARD_ARCHIVED[aid];
  const collectionItems = ASSESS_CARD_MOCK_COLLECTIONS
    .map(name => `<div class="item" onclick="assessCardAddToCollection(event,'${aid}',this.dataset.name)" data-name="${name}">${name}</div>`).join('');
  return `
    <button class="card-action-btn" title="Copy resource" aria-label="Copy resource"
            onclick="event.stopPropagation();assessCardDuplicate('${aid}')"
            ${archived ? 'disabled' : ''}>${ASSESS_CARD_ICON.copy}</button>
    <button class="card-action-btn ${fav ? 'fav-on' : ''}"
            title="${fav ? 'Remove from favorites' : 'Add to favorites'}"
            aria-label="${fav ? 'Remove from favorites' : 'Add to favorites'}"
            onclick="event.stopPropagation();assessCardToggleFav(event,'${aid}')"
            ${archived ? 'disabled' : ''}>${fav ? ASSESS_CARD_ICON.starFill : ASSESS_CARD_ICON.star}</button>
    <div class="card-action">
      <button class="card-action-btn" title="More options" aria-label="More options"
              onclick="event.stopPropagation();assessCardToggleMenu(event,'${aid}')">${ASSESS_CARD_ICON.more}</button>
      <div class="card-action-menu" id="assessCardMenu-${aid}" onclick="event.stopPropagation()">
        <div class="item has-sub">
          <span>Add to collection</span><span class="chev">▸</span>
          <div class="sub-pop">${collectionItems}</div>
        </div>
        <div class="item" onclick="assessCardRename(event,'${aid}')">Rename</div>
        <div class="sep"></div>
        ${archived
          ? `<div class="item" onclick="assessCardRestore(event,'${aid}')">Restore to active</div>`
          : `<div class="item" onclick="assessCardArchive(event,'${aid}')">Archive</div>`}
        <div class="item danger" onclick="assessCardDelete(event,'${aid}')">Delete</div>
      </div>
    </div>`;
}

function assessCardToggleFav(ev, aid) {
  ev?.stopPropagation();
  ASSESS_CARD_FAV[aid] = !ASSESS_CARD_FAV[aid];
  refreshAssessCardActions(aid);
  assessCardToast(ASSESS_CARD_FAV[aid] ? 'Added to favorites' : 'Removed from favorites');
}

function assessCardToggleMenu(ev, aid) {
  ev?.stopPropagation();
  const menu = document.getElementById('assessCardMenu-' + aid);
  if (!menu) return;
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.card-action-menu.open').forEach(m => m.classList.remove('open'));
  if (!wasOpen) menu.classList.add('open');
}

function assessCardDuplicate(aid) {
  assessCardToast('Duplicated · "Copy of …" created');
}
function assessCardRename(ev, aid) {
  ev?.stopPropagation();
  document.querySelectorAll('.card-action-menu.open').forEach(m => m.classList.remove('open'));
  const next = prompt('Rename assessment');
  if (next && next.trim()) assessCardToast('Renamed to "' + next.trim() + '"');
}
function assessCardArchive(ev, aid) {
  ev?.stopPropagation();
  document.querySelectorAll('.card-action-menu.open').forEach(m => m.classList.remove('open'));
  ASSESS_CARD_ARCHIVED[aid] = true;
  refreshAssessCardActions(aid);
  assessCardToast('Archived');
}
function assessCardRestore(ev, aid) {
  ev?.stopPropagation();
  document.querySelectorAll('.card-action-menu.open').forEach(m => m.classList.remove('open'));
  ASSESS_CARD_ARCHIVED[aid] = false;
  refreshAssessCardActions(aid);
  assessCardToast('Restored to active');
}
function assessCardDelete(ev, aid) {
  ev?.stopPropagation();
  document.querySelectorAll('.card-action-menu.open').forEach(m => m.classList.remove('open'));
  if (confirm('Delete this assessment? This action cannot be undone.')) {
    assessCardToast('Deleted');
  }
}
function assessCardAddToCollection(ev, aid, name) {
  ev?.stopPropagation();
  document.querySelectorAll('.card-action-menu.open').forEach(m => m.classList.remove('open'));
  assessCardToast('Added to "' + name + '"');
}

function refreshAssessCardActions(aid) {
  const bottom = document.querySelector('.card-bottom[data-aid="' + aid + '"]');
  if (bottom) bottom.innerHTML = assessCardActionsHtml(aid);
}

function initHomepageAssessCardActions() {
  document.querySelectorAll('.assess-card').forEach(card => {
    const onclick = card.getAttribute('onclick') || '';
    const m = onclick.match(/openAssessmentDetail\('([^']+)'\)/);
    if (!m) return;
    const aid = m[1];
    const bottom = card.querySelector('.card-bottom');
    if (!bottom) return;
    bottom.setAttribute('data-aid', aid);
    bottom.innerHTML = assessCardActionsHtml(aid);
  });
}

/* Close any open card menu on outside click */
document.addEventListener('click', () => {
  document.querySelectorAll('.card-action-menu.open').forEach(m => m.classList.remove('open'));
});

/* Initialize when DOM is ready (script runs at end of body, so just call directly) */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomepageAssessCardActions);
} else {
  initHomepageAssessCardActions();
}
function editorPageForSession(session) {
  if (session.testType === 'act') return 'act';
  if (session.testType === 'sat') return 'new-edit';
  if (session.testType === 'tcap') return 'tcap-edit';
  return 'generic';
}
function assignmentsForAssessment(session) {
  const children = SESSION_DATA.filter(s => s.parentAssessmentId === session.id);
  return [session, ...children];
}
function renderAssessmentAssignmentArea(session, assigned) {
  const assignments = assignmentsForAssessment(session);
  const hasAnyAssignment = assigned || assignments.length > 1;
  if (!hasAnyAssignment) {
    return `
      <div class="assignment-empty-card">
        <div>
          <div class="assignment-empty-illustration">🐙</div>
          <div class="assignment-empty-title">Not Assigned Yet</div>
          <div class="assignment-empty-copy">This assessment hasn't been assigned to any assignments yet. Click the button below to assign it to your classes or individual students.</div>
          <button class="btn-kira-default" onclick="openAssignModal('${session.testType}')">Assign to Students</button>
        </div>
      </div>
    `;
  }
  const practiceCount = session.testType === 'tcap' && typeof tcapPracticeAssignedCount !== 'undefined' ? tcapPracticeAssignedCount : 0;
  const filter = String(currentAssignmentFilter || 'all').toLowerCase();
  const visible = assignments.filter(item => {
    if (filter === 'all') return true;
    const m = String(deliveryModeLabel(item.deliveryMode) || '').toLowerCase();
    return filter === 'live' ? m.includes('live') : m.includes('scheduled');
  });
  const cards = visible.map(item => renderAssignmentCard(item, session, practiceCount)).join('');
  const empty = visible.length === 0
    ? `<div style="grid-column:1/-1;padding:36px 12px;text-align:center;font-size:12px;color:#a1a1aa;font-weight:600">No ${filter === 'all' ? '' : filter + ' '}assignments yet.</div>`
    : '';
  const tab = (id, label) => `<button class="assignment-list-tab${filter === id ? ' is-active' : ''}" onclick="setAssignmentFilter('${id}')">${label}</button>`;
  return `
    <div class="assignment-list-card">
      <div class="assignment-list-head">
        <div class="assignment-list-title">View All Assignments <span class="assignment-list-count">${assignments.length} total</span></div>
        <div class="assignment-list-tabs">${tab('all','All')}${tab('live','Live')}${tab('scheduled','Scheduled')}</div>
      </div>
      <div class="assignment-grid">${cards}${empty}</div>
    </div>
  `;
}

let currentAssignmentFilter = 'all';
function setAssignmentFilter(filter) {
  currentAssignmentFilter = filter;
  if (typeof renderAssessmentDetail === 'function' && currentAssessmentDetailSessionId) renderAssessmentDetail();
}

function assignmentLifecycleStatus(item) {
  // Returns { label, kind } where kind ∈ expired|live|completed|draft
  const ws = String(item.windowStatus || '').toLowerCase();
  const st = String(item.status || '').toLowerCase();
  if (ws.includes('expired') || st.includes('ended') || st.includes('released')) return { label:'Expired', kind:'expired' };
  if (st.includes('completed')) return { label:'Completed', kind:'completed' };
  if (st.includes('progress') || st.includes('live')) return { label:'In Progress', kind:'live' };
  if (st.includes('paused')) return { label:'Paused', kind:'live' };
  if (st.includes('scheduled') || st.includes('not started')) return { label:'Scheduled', kind:'draft' };
  return { label: item.status || 'Draft', kind:'draft' };
}

function renderAssignmentCard(item, session, practiceCount) {
  const isBase = item.id === session.id;
  const mode = deliveryModeLabel(item.deliveryMode);
  const isLive = String(mode).toLowerCase().includes('live');
  const lifecycle = assignmentLifecycleStatus(item);
  const showPractice = isBase && practiceCount > 0;
  const practicePill = showPractice ? `<span class="assignment-practice-pill" style="margin-left:6px">✓ ${practiceCount} practice</span>` : '';
  const titleText = item.title || item.className || 'Assignment';
  const studentsCount = item.students || 0;
  const timeLimit = item.timeLimitMinutes ? `${item.timeLimitMinutes} mins` : '—';
  const windowLine = (() => {
    if (item.closedAt) return `Ended at: ${item.closedAt}`;
    if (item.window) return item.window;
    return 'No window set';
  })();
  const createdDate = item.lastModifiedAt || item.createdAt || '';
  const modePill = `<span class="assignment-mode-pill ${isLive ? 'live' : 'scheduled'}">${isLive ? '⚡' : '📅'} ${mode.replace(' Mode','')}</span>`;
  const statusPill = `<span class="assignment-status-pill ${lifecycle.kind}"><span class="dot"></span>${lifecycle.label}</span>`;
  return `
    <div class="assignment-card" onclick="loadSessionDetail('${item.id}','overview')" role="button" tabindex="0">
      <div class="assignment-card-top">
        ${modePill}
        ${statusPill}
      </div>
      <div class="assignment-card-title">${titleText}${practicePill}</div>
      <div class="assignment-card-meta">
        <span class="meta"><span class="ico">👥</span>Student: ${studentsCount}</span>
        <span class="meta"><span class="ico">🕐</span>Time Limit: ${timeLimit}</span>
        <span class="meta full"><span class="ico">📆</span>${windowLine}</span>
      </div>
      <div class="assignment-card-foot">
        <span class="assignment-card-date">${createdDate || '—'}</span>
        <span class="assignment-card-arrow">→</span>
      </div>
    </div>
  `;
}
function renderAssessmentDetail() {
  const session = getSession(currentAssessmentDetailSessionId);
  // Keep currentSessionId in sync so Editor/Monitor inherit the right test
  currentSessionId = session.id;
  const editorPage = editorPageForSession(session);
  const setupTitle = session.subtitle && session.testType !== 'generic'
    ? session.subtitle
    : (session.testType === 'generic'
        ? 'Exam Setup: Upload Mode, Medium Difficulty'
        : `Exam Setup: ${session.title}`);
  const typeLabel = session.testType === 'generic' ? 'General' : testTypeLabel(session.testType);
  const assigned = !['Draft','Not Assigned'].includes(session.status);
  // Subjects line — for ACT/SAT use sectionOrder; otherwise fall back to type label
  const subjectsList = (() => {
    if (Array.isArray(session.sectionOrder) && session.sectionOrder.length) {
      return session.sectionOrder.map(s => String(s).replace(/\s*\(.*?\)\s*$/, '')).join('; ');
    }
    return typeLabel;
  })();
  // (Removed) TCAP composite-readiness banner: showed `Composite scoring
  // ready · SP1·Submitted · SP2·Submitted ...` at the top of the Assessment
  // Detail page. Same Assessment-vs-Assignment leak as the original Subpart
  // Schedule card — per-SP submission status is Assignment-instance data and
  // doesn't belong on the blueprint-layer Assessment page. Composite-release
  // signal lives on the Assignment cards below + on the Analytics tab. If a
  // future product wants a composite-rollup at this level it must aggregate
  // ACROSS all Assignments of this Assessment, not from a single one.
  document.getElementById('assessmentDetailBody').innerHTML = `
    <button class="assessment-generator-back" onclick="openAssessmentList()">← <span>Assessment Generator</span></button>
    <div class="assessment-setup-card">
      <div class="assessment-setup-head">
        <div style="min-width:0">
          <h1 class="assessment-setup-title">${setupTitle}</h1>
          <div class="assessment-setup-subjects"><span class="subj-icon">📋</span><span>${subjectsList}</span></div>
        </div>
        <div style="display:flex;align-items:center;gap:18px;flex-shrink:0">
          <div class="assignment-state-text"><span class="assignment-state-dot"></span> ${assigned ? 'Assigned' : 'Not Assigned'}</div>
          <button class="btn-kira-default" onclick="openAssignModal('${session.testType}')">${assigned ? 'Create New Assignment' : 'Assign to Students'}</button>
        </div>
      </div>
      <div class="assessment-actions-title">Actions</div>
      <div class="assessment-actions-grid">
        <div class="assessment-action-card${assigned ? ' is-disabled' : ''}" ${assigned ? `onclick="iteToast('Assessment is already assigned. Edit is locked to keep results consistent.','info')"` : `onclick="nav('${editorPage}')"`}>
          <div class="assessment-action-left">
            <div class="assessment-action-icon">☑</div>
            <div>
              <div class="assessment-action-title">Edit Assessment</div>
              <div class="assessment-action-desc">Modify the assessment questions and settings.</div>
            </div>
          </div>
          <div class="assessment-action-arrow">›</div>
        </div>
        <div class="assessment-action-card" onclick="openStudentLaunch('${session.id}', true)">
          <div class="assessment-action-left">
            <div class="assessment-action-icon">▣</div>
            <div>
              <div class="assessment-action-title">Preview Assessment</div>
              <div class="assessment-action-desc">Simulate the student experience of the assessment.</div>
            </div>
          </div>
          <div class="assessment-action-arrow">›</div>
        </div>
      </div>
    </div>
    ${session.testType === 'tcap' ? renderTcapSubpartSchedule(session) : ''}
    ${renderAssessmentAssignmentArea(session, assigned)}
  `;
}

function renderActSectionPreview(session) {
  return '';
}

// ─── TCAP Subpart Structure on the Assessment Setup hub ────────────────────
// Renders the TDOE blueprint structure of a TCAP test — Assessment-level,
// NOT Assignment-level. This is critical: an Assessment is a blueprint that
// can be assigned multiple times, so per-SP schedule / status / submission
// counts / "Open Analytics" actions all belong to a specific Assignment, not
// to the Assessment itself. Mixing them here was a logic bug — "Open
// Analytics" had no answer to "which assignment's analytics?" when more than
// one assignment existed (the prototype hid this by reusing session.id).
//
// This card now shows ONLY blueprint description:
//   • code (SP1..SPn) + label + description
//   • blueprint timer + extended-time blueprint timer
//   • blueprint rule chips (must-be-first, no-calculator, human-grade-only…)
// Per-Assignment status / schedule / submission / analytics live on the
// Assignment cards below ("View All Assignments" section).
function renderTcapSubpartSchedule(session) {
  const subjectId = session.tcapSubject || 'ela';
  const grade = session.tcapGrade || 5;
  const blueprintSps = tcapBlueprintFor(subjectId, grade);
  if (!blueprintSps.length) return '';
  const totals = tcapBlueprintTotals(subjectId, grade);
  const subjectMeta = DW_TCAP_CONFIG.subjects.find(s => s.id === subjectId) || { label:subjectId };
  const cards = blueprintSps.map(bp => {
    const tags = [];
    if (bp.mustBeFirst)        tags.push({ label:'Must be 1st', color:'#b91c1c', bg:'#fef2f2', border:'#fecaca' });
    if (bp.mustBeSeparate)     tags.push({ label:'Separate session', color:'#b91c1c', bg:'#fef2f2', border:'#fecaca' });
    if (bp.calculator===false) tags.push({ label:'No calculator', color:'#b45309', bg:'#fffbeb', border:'#fde68a' });
    if (bp.calculator===true)  tags.push({ label:'Calculator OK', color:'#0369a1', bg:'#eff6ff', border:'#bfdbfe' });
    if (bp.humanGradeOnly)     tags.push({ label:'Human review only', color:'#5b21b6', bg:'#f5f3ff', border:'#ddd6fe' });
    // 3-column grid (was 4): icon · label/desc/chips · timer. Removed the
    // actions column since per-SP actions are Assignment-scoped, not blueprint-scoped.
    return `
    <div class="assignment-row-card" style="grid-template-columns:auto 1fr auto;gap:16px;padding:14px 16px">
      <div style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:10px;background:#f5f3ff;color:#5b21b6;font-size:12px;font-weight:800;letter-spacing:.4px">${bp.code}</div>
      <div style="min-width:0">
        <div class="assignment-row-title" style="margin:0 0 4px">${bp.label}</div>
        <div class="assignment-row-meta" style="margin-bottom:6px">${bp.desc}</div>
        ${tags.length ? `<div style="display:flex;flex-wrap:wrap;gap:5px">${tags.map(t => `<span style="font-size:9.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:${t.color};background:${t.bg};border:1px solid ${t.border};padding:2px 7px;border-radius:999px">${t.label}</span>`).join('')}</div>` : ''}
      </div>
      <div style="text-align:right;white-space:nowrap">
        <div style="font-size:16px;font-weight:800;color:#18181b">${bp.minutes} min</div>
        <div style="font-size:10.5px;color:#71717a;font-weight:600">+ext ${bp.extMin} min</div>
      </div>
    </div>`;
  }).join('');
  return `
    <div class="assignment-list-card" style="margin-bottom:16px">
      <div class="assignment-list-head">
        <div>
          <div class="assignment-list-title">Subpart Structure
            <span style="font-size:11px;color:#71717a;font-weight:600;margin-left:6px">${blueprintSps.length} Sections · TDOE blueprint</span>
          </div>
          <div style="font-size:12px;color:#52525b;margin-top:3px">${subjectMeta.label} · Grade ${grade} · Total ${totals.minutes} min (with ext-time ${totals.extMinutes} min)</div>
        </div>
        <span style="font-size:10.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;padding:4px 10px;border-radius:999px">Read-only structure</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">${cards}</div>
      <div style="margin-top:10px;padding:10px 12px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;font-size:11.5px;color:#5b21b6;line-height:1.55">
        ⏱ <b>Extended-time accommodations</b> are auto-applied per Subpart timer (×1.5 / ×2.0 multipliers) when this Assessment is assigned. Manage per-student timing from each Assignment's roster.
      </div>
      <div style="margin-top:8px;padding:9px 12px;background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;font-size:11.5px;color:#71717a;line-height:1.55">
        💡 Per-Subpart <b>schedule</b>, <b>status</b>, and <b>analytics</b> live on each <b>Assignment</b> below — the same blueprint can be assigned to multiple classes with different windows and rosters.
      </div>
    </div>
  `;
}
function sessionStatusClass(status) {
  const map = {
    'Not Started':'scheduled',
    'Scheduled':'scheduled',
    'Live':'live',
    'In Progress':'in-progress',
    'Paused':'in-progress',
    'Extended':'in-progress',
    'Completed':'completed',
    'Ended':'completed',
    'Graded':'graded',
    'Pending Release':'pending-release',
    'Released':'released'
  };
  return map[status] || 'scheduled';
}
function testTypeLabel(type) {
  return ({ generic:'Generic', act:'ACT', sat:'SAT', tcap:'TCAP' })[type] || type.toUpperCase();
}
function studentStatusClass(status) {
  return String(status || '').toLowerCase().replace(/\s+/g, '-');
}
function studentAvatarInitials(name) {
  return String(name || 'Student')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'ST';
}
function deliveryModeLabel(mode) {
  if (String(mode || '').toLowerCase().includes('live') || String(mode || '').toLowerCase().includes('teacher-paced')) return 'Live Mode';
  return 'Scheduled Mode';
}
function monitorPrimaryAction(session) {
  if (session.status === 'Scheduled' || session.status === 'Not Started') return 'Start';
  if (session.status === 'Paused') return 'Continue';
  if (session.status === 'In Progress' || session.status === 'Live') return 'Pause';
  return 'Review';
}
function assignmentLifecycleState(session) {
  if (session.status === 'Scheduled') return 'Not Started';
  if (session.status === 'Live') return 'In Progress';
  if (['Not Started','In Progress','Paused','Extended','Completed','Ended'].includes(session.status)) return session.status;
  if (session.status === 'Released') return 'Ended';
  return session.status || 'Not Started';
}
function renderAssignmentStateStrip(session) {
  const activeState = assignmentLifecycleState(session);
  const states = [
    ['Not Started','Assigned, waiting for teacher start or schedule window.'],
    ['In Progress','Students are actively working.'],
    ['Paused','Teacher temporarily pauses a live session.'],
    ['Extended','One or more students have extended time.'],
    ['Completed','Students finished or the window closed.'],
    ['Ended','Teacher manually ended or expired permanently.']
  ];
  return `<div class="assignment-state-card">
    <div class="assignment-state-head">
      <div class="assignment-state-title">Assignment Status States</div>
      <div class="assignment-state-note">Old Assessment lifecycle kept for General, ACT, TCAP, and future SAT</div>
    </div>
    <div class="assignment-state-strip">
      ${states.map(([label, desc]) => `<div class="assignment-state-chip ${label === activeState ? 'active' : ''}">
        <div class="label">${label}</div>
        <div class="desc">${desc}</div>
      </div>`).join('')}
    </div>
  </div>`;
}
function renderMonitorControlBar(session) {
  const mode = deliveryModeLabel(session.deliveryMode);
  const primaryAction = monitorPrimaryAction(session);
  const remaining = session.status === 'Completed' || session.status === 'Released' ? 'Ended' : (session.testType === 'act' ? '02:14:32' : session.testType === 'tcap' ? '00:55:00' : '00:45:00');
  const joinEnabled = !['Completed','Ended','Released'].includes(assignmentLifecycleState(session));
  return `<div class="monitor-control-bar">
    <div>
      <div class="monitor-control-title">
        <span>${session.title}</span>
        <span class="monitor-mode-badge">${mode}</span>
        <span class="status-pill ${sessionStatusClass(session.status)}">${session.status}</span>
      </div>
    </div>
    <div>
      <div class="monitor-countdown">${remaining}</div>
      <div class="monitor-mini-stats">
        <span class="monitor-mini-stat">Ready ${session.ready || 0}</span>
        <span class="monitor-mini-stat">In progress ${session.inProgress || 0}</span>
        <span class="monitor-mini-stat">Submitted ${session.submitted || 0}</span>
        <span class="monitor-mini-stat">Graded ${session.graded || 0}</span>
      </div>
    </div>
    <div class="monitor-actions">
      <button class="monitor-action-btn primary" onclick="alert('${primaryAction} session control is kept from the old Assessment monitor.')">${primaryAction}</button>
      <button class="monitor-action-btn" ${joinEnabled ? `onclick="alert('Join code copied: ${session.assignmentCode || 'KIRA-TEST'}')"` : `onclick="alert('Join code is disabled after completion / ended states.')" style="opacity:.45"`}>Join Code</button>
      <button class="monitor-action-btn danger" onclick="alert('End assignment requires confirmation in production.')">End</button>
    </div>
  </div>`;
}
function renderDeliveryModePanel(session) {
  const mode = deliveryModeLabel(session.deliveryMode);
  const isLive = mode === 'Live Mode';
  const lifecycle = assignmentLifecycleState(session);
  const remaining = ['Completed','Ended','Released'].includes(lifecycle) ? 'Ended' : (session.testType === 'act' ? '02:14:32' : session.testType === 'tcap' ? '00:55:00' : '00:45:00');
  const joinEnabled = !['Completed','Ended','Released'].includes(lifecycle);
  return `<div class="delivery-mode-card">
    <div class="delivery-mode-panel">
      <div class="delivery-mode-title">
        <span class="monitor-mode-badge ${isLive ? 'live' : 'scheduled'}">${mode}</span>
        <span>${isLive ? 'Teacher-led session' : 'Scheduled launch window'}</span>
      </div>
      <div class="delivery-mode-copy">${isLive
        ? 'Teacher starts the assignment in class, shares a join code, monitors progress live, and can pause or end the session.'
        : 'Students launch independently inside the configured window. The teacher monitors progress and reviews results after completion.'}</div>
      <div class="delivery-mode-facts">
        <div class="delivery-mode-fact"><div class="k">${isLive ? 'Timer' : 'Window'}</div><div class="v">${isLive ? remaining : (session.window || 'No window set')}</div></div>
        <div class="delivery-mode-fact"><div class="k">Join code</div><div class="v">${joinEnabled ? (session.assignmentCode || 'KIRA-TEST') : 'Disabled after completion'}</div></div>
      </div>
    </div>
    <div class="delivery-mode-panel">
      <div class="delivery-mode-title">Old Assessment Controls</div>
      <div class="delivery-mode-copy">Lifecycle kept from the old monitor: Start / Pause / Continue / End for active sessions, plus Join Code access when the assignment is open.</div>
      <div class="monitor-mini-stats" style="margin-top:10px">
        <span class="monitor-mini-stat">Ready ${session.ready || 0}</span>
        <span class="monitor-mini-stat">In progress ${session.inProgress || 0}</span>
        <span class="monitor-mini-stat">Submitted ${session.submitted || 0}</span>
        <span class="monitor-mini-stat">Graded ${session.graded || 0}</span>
      </div>
    </div>
  </div>`;
}
function openSessionControlModal(action) {
  const session = getSession(currentSessionId);
  if (action === 'Review') return setSessionDetailTab('analytics');
  if (action === 'Pause') {
    return stuModal({
      icon:'⏸',
      iconType:'warn',
      title:'Pause live session?',
      body:`<p style="margin:0">Students will temporarily lose access to the assignment. Their current answers and timers are saved.</p>
        <div class="stat">
          <div class="stat-item"><span class="val">${session.inProgress || 0}</span><span class="lbl">In progress</span></div>
          <div class="stat-item"><span class="val">${session.assignmentCode || 'KIRA-TEST'}</span><span class="lbl">Join code</span></div>
        </div>
        <p style="margin:14px 0 0;color:#b45309;font-weight:700">Use Continue when you are ready to let students resume.</p>`,
      confirmText:'Pause session',
      confirmClass:'danger',
      onConfirm:()=>{ session.status='Paused'; renderSessionDetail(); }
    });
  }
  if (action === 'Continue' || action === 'Start') {
    const nextStatus = 'In Progress';
    const title = action === 'Start' ? 'Start assignment?' : 'Continue session?';
    const body = action === 'Start'
      ? 'Students will be able to join with the assignment code and begin the ready check.'
      : 'Students will regain access and continue from where they left off.';
    return stuModal({
      icon: action === 'Start' ? '▶' : '↻',
      iconType:'info',
      title,
      body:`<p style="margin:0">${body}</p>
        <div class="stat">
          <div class="stat-item"><span class="val">${session.assignmentCode || 'KIRA-TEST'}</span><span class="lbl">Join code</span></div>
          <div class="stat-item"><span class="val">${session.timeLimitMinutes || 45}m</span><span class="lbl">Time limit</span></div>
        </div>`,
      confirmText: action === 'Start' ? 'Start' : 'Continue',
      onConfirm:()=>{ session.status=nextStatus; renderSessionDetail(); }
    });
  }
}
function openJoinCodeModal() {
  const session = getSession(currentSessionId);
  const lifecycle = assignmentLifecycleState(session);
  if (['Completed','Ended','Released'].includes(lifecycle)) {
    return stuModal({
      icon:'🔒',
      iconType:'warn',
      title:'Join code is disabled',
      body:'<p style="margin:0">Students can no longer join after the assignment is completed, ended, or released.</p>',
      confirmText:'Got it',
      cancelText:''
    });
  }
  const code = session.assignmentCode || 'KIRA-TEST';
  const link = `https://app.kira-learning.com/join/${code}`;
  stuModal({
    icon:'🔗',
    iconType:'info',
    title:'Join Code',
    body:`<p style="margin:0 0 12px">Share this with students so they can join the assignment.</p>
      <div style="border:1px solid #e4e4e7;background:#fafafa;border-radius:14px;padding:16px;text-align:center;margin-bottom:12px">
        <div style="font-size:10px;color:#71717a;font-weight:900;letter-spacing:.4px;text-transform:uppercase;margin-bottom:6px">Assignment code</div>
        <div style="font-size:28px;font-weight:900;color:#18181b;letter-spacing:1px">${code}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <button class="modal-cancel" onclick="copyJoinValue('${code.replace(/'/g,"\\'")}','Code copied')" style="border:none;padding:10px 12px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer">Copy code</button>
        <button class="modal-cancel" onclick="copyJoinValue('${link.replace(/'/g,"\\'")}','Link copied')" style="border:none;padding:10px 12px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer">Copy link</button>
      </div>
      <div id="joinCodeCopyFeedback" style="font-size:12px;color:#16a34a;font-weight:800;margin-top:10px;min-height:18px"></div>`,
    confirmText:'Done',
    cancelText:''
  });
}
function copyJoinValue(value, message) {
  const done = () => {
    const el = document.getElementById('joinCodeCopyFeedback') || document.getElementById('joinCodeDropdownFeedback');
    if (el) el.textContent = message;
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(value).then(done).catch(done);
  else done();
}
let aiInsightsOpen = false;
function toggleAiInsights(sessionId) {
  aiInsightsOpen = !aiInsightsOpen;
  renderAiInsightsState(sessionId);
}
function closeAiInsights(sessionId) {
  aiInsightsOpen = false;
  renderAiInsightsState(sessionId);
}
function renderAiInsightsState(sessionId) {
  const wrap = document.getElementById('sessionAiInsightsWrap');
  const session = getSession(sessionId || currentSessionId) || getSession(currentSessionId);
  if (wrap && session) wrap.innerHTML = renderAiInsightsPanel(session);
  const btn = document.getElementById('aiInsightsBtn');
  if (btn) {
    btn.classList.toggle('primary', aiInsightsOpen);
    btn.textContent = aiInsightsOpen ? 'Hide Insights' : 'AI Insights';
  }
  if (aiInsightsOpen) {
    setTimeout(() => wrap?.querySelector('.ai-insights-panel')?.scrollIntoView({ behavior:'smooth', block:'nearest' }), 30);
  }
}
function aiInsightsAction(action) {
  if (action === 'analytics') {
    setSessionDetailTab('analytics');
    return;
  }
  if (action === 'grader') {
    openSessionGrader(currentSessionId);
    return;
  }
  if (action === 'risk') {
    iteToast('AI Insights: risk group highlighted in the monitor roster.', 'info');
    return;
  }
  iteToast('AI Insights action queued.', 'info');
}
function renderAiInsightsPanel(session) {
  const isTcap = session.testType === 'tcap';
  const completed = session.submitted || 0;
  const riskText = isTcap
    ? '4 students are below Proficient. Start with the students closest to the next cut score, then assign standards-based practice.'
    : `${session.inProgress || 0} students are still in progress. Review auto-submit and locked report rows before release.`;
  const nextStep = isTcap
    ? 'Assign TCAP practice for the risk bucket, then check whether weak standards cluster around informational text.'
    : 'Open grader for pending written responses, then release reports after teacher review.';
  return `<div class="ai-insights-panel ${aiInsightsOpen ? 'open' : ''}">
    <div class="ai-insights-head">
      <div>
        <div class="ai-insights-kicker">AI Insights</div>
        <div class="ai-insights-title">${session.title}</div>
      </div>
      <button class="monitor-action-btn" onclick="closeAiInsights('${session.id || currentSessionId}')">Close</button>
    </div>
    <div class="ai-insights-grid">
      <div class="ai-insight-card"><div class="label">Summary</div><div class="text">${completed}/${session.students || completed} submitted · ${session.graded || 0} graded · ${session.pendingRelease || 0} pending release.</div></div>
      <div class="ai-insight-card"><div class="label">Watch</div><div class="text">${riskText}</div></div>
      <div class="ai-insight-card"><div class="label">Next step</div><div class="text">${nextStep}</div></div>
    </div>
    <div class="ai-insights-actions">
      <button onclick="aiInsightsAction('analytics')">Open analytics</button>
      <button onclick="aiInsightsAction('risk')">Highlight risk group</button>
      <button onclick="aiInsightsAction('grader')">Open grader</button>
    </div>
  </div>`;
}
function toggleJoinCodeDropdown() {
  const el = document.getElementById('joinCodeDropdown');
  if (el) el.classList.toggle('open');
}
/* ── Monitor v2 — render helpers ──
   Mirror of the production session detail page (FE: page.tsx + SessionTimerView.tsx).
   Splits the old single-row header into two pieces:
     1. Thin top bar (Back + breadcrumb + secondary CTAs)
     2. Hero card — left: cover/title/meta + Session Code dropdown + AI Insights
                    gradient card; right: SessionTimerView in LIVE or SCHEDULED
                    variant.
   Status pill colors and control-button matrix come straight from the
   production statusConfig table so prototype and production stay in sync. */
const TIMER_STATUS_CONFIG = {
  NOT_STARTED:{label:'Not started',     color:'#909090'},
  IN_PROGRESS:{label:'In progress',     color:'#27bb36'},
  PAUSED:     {label:'Paused',          color:'#f59e0b'},
  EXTENDED:   {label:'Extended',        color:'#f8d904'},
  ENDED:      {label:'Ended',           color:'#d31510'},
  EXPIRED:    {label:'Expired',         color:'#d31510'},
};
function mapSessionStatusToTimerStatus(status) {
  switch (String(status || '').toLowerCase()) {
    case 'live':
    case 'in progress':         return 'IN_PROGRESS';
    case 'paused':              return 'PAUSED';
    case 'extended':            return 'EXTENDED';
    case 'completed':
    case 'ended':
    case 'released':
    case 'pending release':     return 'ENDED';
    case 'scheduled':
    case 'not started':
    case 'draft':
    case 'not assigned':
    default:                    return 'NOT_STARTED';
  }
}
function fakeRemainingSecondsForView(view, session) {
  // Prototype only — production reads availableUntil - now from the server.
  // Picks a stable fake remaining time so the circular timer renders
  // consistently for each test type.
  if (session && session.testType === 'act')  return 2 * 3600 + 14 * 60 + 32; // 02:14:32
  if (session && session.testType === 'tcap') return 55 * 60;                  // 00:55:00
  if (view && view.timeLimitMinutes)          return view.timeLimitMinutes * 60;
  return 45 * 60;
}
function fakeTotalSecondsForView(view, session) {
  if (view && view.timeLimitMinutes) return view.timeLimitMinutes * 60;
  if (session && session.testType === 'act')  return 175 * 60;
  if (session && session.testType === 'tcap') return 60 * 60;
  return 45 * 60;
}
function parseScheduleWindow(view) {
  // Best-effort split of the prototype's `window` string into From / Until
  // pieces. Accepts patterns like:
  //   "Mar 15, 2026 · 9:00 AM - 11:00 AM"
  //   "Apr 10, 2026 · 8:30 AM - 12:15 PM"
  //   "Feb 10, 2026, 5:00 PM"
  // Falls back to placeholder text when the string can't be parsed.
  const raw = String(view.window || '');
  if (!raw) return { from:{ time:'—', date:'—' }, until:{ time:'—', date:'—' } };
  const parts = raw.split('·').map(s => s.trim());
  const datePart = parts[0] || raw;
  const timePart = parts[1] || '';
  if (timePart && timePart.includes('-')) {
    const [fromTime, untilTime] = timePart.split('-').map(s => s.trim());
    return { from:{ time:fromTime || '—', date:datePart }, until:{ time:untilTime || '—', date:datePart } };
  }
  // Single-timestamp form: treat as the start; closedAt becomes the end.
  return {
    from:{ time:timePart || '—', date:datePart },
    until:{ time:view.closedAt || '—', date:'' }
  };
}
function renderMonitorTopbar(view, session) {
  return `
    <div class="ad-topbar-left">
      <button class="ad-back" onclick="backFromMonitor()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Session summary
      </button>
    </div>
    <div class="ad-topbar-actions">
      <button class="topbar-btn" onclick="iteToast('All sessions drawer — coming in V2','info')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        View all sessions
      </button>
      <button class="topbar-btn primary" onclick="openAssignModal('${session.testType || 'generic'}')">
        Create new session
      </button>
    </div>
  `;
}
function renderSessionMonitorHero(view, session) {
  const isLive = String(session.deliveryMode || '').toLowerCase().includes('live');
  const status = mapSessionStatusToTimerStatus(view.status);
  const insightText = (() => {
    if (status === 'NOT_STARTED') return 'AI insights will populate once students start the assignment.';
    if (status === 'ENDED' || status === 'EXPIRED') return `Session closed. ${view.submitted || 0}/${view.students || 0} submitted, ${view.graded || 0} graded.`;
    return `${view.inProgress || 0} in progress · ${view.submitted || 0} submitted · ${view.graded || 0} graded. Open analytics for skill-level cuts.`;
  })();
  const creatorName = session.teacher || 'Ms. Johnson';
  const creatorInit = creatorName.split(/\s+/).slice(0,2).map(s => s[0]).join('').toUpperCase() || 'KT';
  const lifecycle = assignmentLifecycleState(view);
  const joinEnabled = !['Completed','Ended','Released'].includes(lifecycle);
  const joinCode = view.assignmentCode || 'KIRA-TEST';
  const joinLink = `https://app.kira-learning.com/join/${joinCode}`;
  return `
    <div class="monitor-hero-left">
      <div class="monitor-hero-top">
        <div class="monitor-hero-cover">${session.icon || '📝'}</div>
        <div class="monitor-hero-titles">
          <div class="monitor-hero-title-row">
            <span class="monitor-hero-title">${view.title || 'Untitled session'}</span>
            <span class="monitor-hero-subtitle">${testTypeLabel(session.testType || 'generic')}</span>
          </div>
          <div class="monitor-hero-meta">
            <span class="meta-creator">
              <span class="meta-avatar">${creatorInit}</span>
              <span>${creatorName}</span>
            </span>
            <span class="meta-dot">•</span>
            <span class="meta-modified">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Assessment modified ${session.lastModifiedAt || '—'}</span>
            </span>
            <span class="meta-dot">•</span>
            <span>${session.className || ''}</span>
          </div>
          <div class="monitor-hero-cta">
            <button class="session-code-btn" ${joinEnabled ? `onclick="toggleJoinCodeDropdown()"` : 'disabled'}>
              <svg class="qr-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="16" y="16" width="5" height="5" rx="1"/></svg>
              Session code
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="join-code-menu" style="position:relative">
              <div class="join-code-dropdown" id="joinCodeDropdown" style="top:0;left:0">
                <div style="font-size:10px;font-weight:900;color:#71717a;text-transform:uppercase;letter-spacing:.3px">Assignment code</div>
                <div class="join-code-value">${joinCode}</div>
                <button onclick="copyJoinValue('${joinCode.replace(/'/g,"\\'")}','Code copied')">Copy code</button>
                <button onclick="copyJoinValue('${joinLink.replace(/'/g,"\\'")}','Link copied')">Copy link</button>
                <div class="join-code-feedback" id="joinCodeDropdownFeedback"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="monitor-hero-insights">
        <div class="insights-body">
          <div class="insights-head">
            <svg viewBox="0 0 24 24"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5 10.1 11.9 4.5 10l5.6-1.4L12 3z"/></svg>
            AI insights
          </div>
          <div class="insights-text">${insightText}</div>
          <!-- Hero AI-insights CTAs (Open analytics / Highlight risk group /
               Open grader) were removed: each one had a stronger, more
               contextual entry point elsewhere on the page (Analytics tab,
               participants table risk filter, per-row Grade button), and the
               pile of buttons was visually competing with the SP strip and
               primary tab navigation directly below it. The insight text
               itself stays as the single piece of value here. -->
        </div>
      </div>
    </div>
    <div class="monitor-hero-right">
      ${renderSessionTimerView(view, session, status, isLive)}
    </div>
  `;
}
function renderSessionTimerView(view, session, status, isLive) {
  const cfg = TIMER_STATUS_CONFIG[status] || TIMER_STATUS_CONFIG.NOT_STARTED;
  const limitMin = view.timeLimitMinutes || session.timeLimitMinutes || 45;
  const limitText = `${limitMin} mins`;
  const headEdit = status === 'NOT_STARTED'
    ? `<button class="timer-edit" title="Edit timer" onclick="iteToast('Edit timer — opens timing dialog','info')">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
       </button>`
    : '';
  if (isLive) {
    return `
      <div class="timer-card">
        <div class="timer-bg-disc"></div>
        ${headEdit}
        <div class="timer-head">
          <div class="timer-head-title">
            Session timer
            <svg class="timer-head-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <div class="timer-head-limit">Time limit <b>${limitText}</b></div>
          <span class="timer-status-pill ${status}">
            <span class="dot"></span>
            <span class="label">${cfg.label}</span>
          </span>
        </div>
        ${renderTimerCircular(view, session, status)}
        ${renderTimerControls(view, session, status, true)}
      </div>
    `;
  }
  // SCHEDULED variant
  const w = parseScheduleWindow(view);
  return `
    <div class="timer-card">
      <div class="timer-bg-disc"></div>
      ${headEdit}
      <div class="timer-head">
        <div class="schedule-clock">⏰</div>
        <div class="timer-head-limit">Time limit <b>${limitText}</b></div>
        <span class="timer-status-pill ${status}">
          <span class="dot"></span>
          <span class="label">${cfg.label}</span>
        </span>
      </div>
      <div class="timer-scheduled">
        ${(status === 'ENDED' || status === 'EXPIRED' || status === 'EXTENDED')
          ? `<div class="timer-ended-msg">Session ${cfg.label.toLowerCase()}<br/>Closed on ${w.until.date}, ${w.until.time}</div>`
          : `<div class="schedule-windows">
              <div class="schedule-rail">
                <div class="schedule-dot start"></div>
                <div class="schedule-line"></div>
                <div class="schedule-dot end"></div>
              </div>
              <div class="schedule-row">
                <div class="lab">Available from</div>
                <div class="val"><span class="time">${w.from.time}</span><span class="date">${w.from.date}</span></div>
              </div>
              <div class="schedule-row">
                <div class="lab">Available until</div>
                <div class="val"><span class="time">${w.until.time}</span><span class="date">${w.until.date}</span></div>
              </div>
            </div>
            ${renderTimerControls(view, session, status, false)}`
        }
      </div>
    </div>
  `;
}
function renderTimerCircular(view, session, status) {
  const totalSec = fakeTotalSecondsForView(view, session);
  const remainSec = (status === 'ENDED' || status === 'EXPIRED' || status === 'EXTENDED' || status === 'NOT_STARTED')
    ? totalSec
    : fakeRemainingSecondsForView(view, session);
  const ratio = totalSec > 0 ? Math.max(0, Math.min(1, remainSec / totalSec)) : 1;
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - ratio);
  const hh = Math.floor(remainSec / 3600);
  const mm = Math.floor((remainSec % 3600) / 60);
  const ss = remainSec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  const ended = (status === 'ENDED' || status === 'EXPIRED' || status === 'EXTENDED');
  return `
    <div class="timer-circle-wrap ${status}">
      <svg viewBox="0 0 160 160">
        <circle class="bg" cx="80" cy="80" r="${r}"/>
        <circle class="fg" cx="80" cy="80" r="${r}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"/>
      </svg>
      <div class="timer-circle-content${ended ? ' ended' : ''}">
        ${ended
          ? '<span>Session ended</span>'
          : `<div class="timer-digits">
              <div class="seg"><span class="num">${pad(hh)}</span><span class="lab">hr</span></div>
              <span class="sep">:</span>
              <div class="seg"><span class="num">${pad(mm)}</span><span class="lab">min</span></div>
              <span class="sep">:</span>
              <div class="seg"><span class="num">${pad(ss)}</span><span class="lab">sec</span></div>
            </div>`}
      </div>
    </div>
  `;
}
function renderTimerControls(view, session, status, isLive) {
  if (status === 'ENDED' || status === 'EXPIRED' || status === 'EXTENDED') return '';
  const endBtn = `<button class="timer-btn danger" onclick="openEndAssignmentModal()">
    <svg class="ic" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
    End session
  </button>`;
  let primary = '';
  if (status === 'NOT_STARTED') {
    primary = `<button class="timer-btn start" onclick="openSessionControlModal('Start')">
      <svg class="ic" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
      Start now
    </button>`;
  } else if (status === 'IN_PROGRESS') {
    primary = `<button class="timer-btn pause" onclick="openSessionControlModal('Pause')">
      <svg class="ic" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
      Pause
    </button>`;
  } else if (status === 'PAUSED') {
    primary = `<button class="timer-btn continue" onclick="openSessionControlModal('Continue')">
      <svg class="ic" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
      Continue
    </button>`;
  }
  return `<div class="timer-controls">${endBtn}${primary}</div>`;
}
function openEndAssignmentModal() {
  const session = getSession(currentSessionId);
  const incomplete = Math.max(0, (session.students || 0) - (session.submitted || 0));
  stuModal({
    icon:'⛔',
    iconType:'warn',
    title:'End assignment?',
    body:`<p style="margin:0">Students will no longer be able to join or continue this assignment. Submitted work remains available for grading and analytics.</p>
      <div class="stat">
        <div class="stat-item"><span class="val">${session.submitted || 0}</span><span class="lbl">Submitted</span></div>
        <div class="stat-item"><span class="val">${incomplete}</span><span class="lbl">Incomplete</span></div>
        <div class="stat-item"><span class="val">${session.inProgress || 0}</span><span class="lbl">In progress</span></div>
      </div>
      <p style="margin:14px 0 0;color:#b45309;font-weight:700">Production note: active students should see an ended overlay and timers should stop immediately.</p>`,
    confirmText:'End assignment',
    confirmClass:'danger',
    onConfirm:()=>{ session.status='Ended'; session.inProgress=0; renderSessionDetail(); }
  });
}
