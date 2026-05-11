// @ts-nocheck
// Phase-2 slice: lines 9881-11399 of original src/app.ts

// ════════════════════════════════════════════════════════════════
// TCAP Student Test (Lv 2 · 9-phase state machine)
// One container `page-tcap-stu`. Phase decides which view renders.
// Reuses ITEM_STUDENT_BUILDERS for question rendering (registry already
// exists), so Hot Text / Drag-Drop / etc. all "just work".
// ════════════════════════════════════════════════════════════════
const TCS_PHASES = [
  {id:'launch',    label:'Sign in'},
  {id:'ready',     label:'Device check'},
  {id:'direction', label:'Directions'},
  {id:'test',      label:'Test'},
  {id:'break',     label:'Break'},
  {id:'paused',    label:'Paused'},
  {id:'review',    label:'Review'},
  {id:'submit',    label:'Submit'},
  {id:'holding',   label:'Submitted'},
];

// ─── TCAP question pools, structured per the official PRD §5.5.2 blueprint ─
// Each subject is split into one "representative" Subpart for the prototype:
//   ELA SP1 = Writing only (85 min, human-reviewed essay)
//   ELA SP2 = Literary + Informational reading (50 min, 5 Q)
//   Math SP1 = Calculator-disabled (60 min, 5 Q)
//   Science SP1 = Part 1 of Life/Earth/Physical (45 min, 5 Q · Grades 5-8)
//   Social Studies SP1 = History & Geography (45 min, 5 Q)
// Real TCAP has additional SPs per subject — those land in V2 once we have
// content authored. Each Q references an ITEM_TYPE id; rendered text lives
// in q.content (overrides _itcDefaults inside ITEM_STUDENT_BUILDERS).

// ELA Subpart 1 · Writing — single argumentative essay (85 min, human-reviewed)
const TCS_QUESTIONS_ELA_WRITING = [
  {n:1, type:'essay',    part:1, subj:'ELA', stdId:'8.W.TTP.1',   pts:10, label:'Writing Prompt / Essay'},
];

// ELA Subpart 2 · Reading (Literary + Informational + Language) — 5 reading-
// focused items. We bundle SP2 + glimpses of SP3/SP4 here so a single demo
// run shows the variety of ELA reading-side item types (mc · twopart · hottext
// · cr · matrix). Real TCAP would split these across SP2/SP3/SP4.
const TCS_QUESTIONS_ELA_READING = [
  {n:1, type:'mc',       part:1, subj:'ELA', stdId:'8.RL.KID.2',  pts:1, label:'Multiple Choice',
   content:{
     stem:'<div style="font-size:13px;color:#52525b;line-height:1.65;background:#fef3c7;border-left:3px solid #fbbf24;padding:10px 14px;margin-bottom:12px;font-family:Georgia,serif;border-radius:0 6px 6px 0">"At first, Mateo refused to share the soccer ball. But after seeing the smaller kids on the sidelines, he passed it over with a quiet smile. The game continued, louder and faster than before."</div>What is the <b>central idea</b> of this paragraph?',
     options:[
       'Compassion can change a moment.',
       'Soccer is a popular schoolyard game.',
       'Mateo is a talented athlete.',
       'Children should always share with each other.',
     ],
   }},
  {n:2, type:'twopart',  part:1, subj:'ELA', stdId:'8.RL.KID.1',  pts:2, label:'Two-Part / Evidence-Based'},
  {n:3, type:'hottext',  part:1, subj:'ELA', stdId:'8.RL.KID.3',  pts:1, label:'Hot Text'},
  {n:4, type:'cr',       part:1, subj:'ELA', stdId:'8.RL.KID.1',  pts:4, label:'Constructed Response',
   content:{
     stem:'In the passage about Mateo and the soccer ball, the author writes that the game became "louder and faster than before" after Mateo shared the ball. <b>Why</b> do you think the author included this detail? Use evidence from the passage in your answer.',
     instr:'Write 3–5 sentences. You may type up to 200 words.',
     maxWords:200,
   }},
  {n:5, type:'matrix',   part:1, subj:'ELA', stdId:'8.RI.KID.2',  pts:1, label:'Matrix / Tabular',
   content:{
     stem:'Based on the passage about <b>community gardens</b> you read, mark whether each statement is True, False, or Not Stated.',
     rows:[
       'Community gardens can lower neighborhood food costs.',
       'All community gardens are run by city governments.',
       'The author personally manages a garden in Memphis.',
       'Volunteers play a role in keeping these gardens running.',
     ],
   }},
  // Editing Task — TCAP ELA SP4 (Language conventions). 4 underlined edits
  // testing verb tense, relative pronoun, conjunction choice, and double
  // negative / subject–verb agreement. We bundle SP4-style items into the
  // Reading pool for demo so a single run shows the full ELA item-type mix.
  {n:6, type:'editing',  part:1, subj:'ELA', stdId:'8.L.CSE.1',   pts:4, label:'Editing Task'},
];

// ─── TCAP Math · Grade 8 Subpart (5-question demo) ────────────────────────
// Item type mix highlights what's *unique* to math: numeric grid-in,
// equation editor, multi-select primes, two-part word problem with
// supporting work, and a multiple-choice geometry stem with formula HTML.
const TCS_QUESTIONS_MATH = [
  {n:1, type:'mc',       part:1, subj:'Math', stdId:'8.G.B.7',    pts:1, label:'Multiple Choice',
   content:{
     stem:'A right triangle has legs of length <b>6 cm</b> and <b>8 cm</b>. What is the length of the hypotenuse?',
     options:['10 cm','12 cm','14 cm','48 cm'],
   }},
  {n:2, type:'ms',       part:1, subj:'Math', stdId:'8.NS.A.1',   pts:1, label:'Multi-Select',
   content:{
     stem:'Select <b>all</b> numbers below that are <b>irrational</b>.',
     instr:'Tap each number that cannot be written as a fraction of two integers.',
     options:['√2','3.14','π','7/8','√25'],
   }},
  {n:3, type:'gridin',   part:1, subj:'Math', stdId:'8.EE.C.7',   pts:1, label:'Grid-In / Numeric',
   content:{
     stem:'Solve the equation <b>3x + 5 = 20</b>. What is the value of <b>x</b>?',
     instr:'Enter your numeric answer using the keypad below.',
   }},
  {n:4, type:'twopart',  part:1, subj:'Math', stdId:'8.F.B.4',    pts:2, label:'Two-Part / Word Problem',
   content:{
     stem:'Read the situation. Then answer Part A and Part B.',
     passageHtml:'<p>A taxi charges a flat fee of <b>$3.00</b> for pickup, plus <b>$2.50</b> per mile driven.</p><p><span class="hot %B0%">A 4-mile ride costs $13.</span> <span class="hot %B1%">A 6-mile ride costs $18.</span> <span class="hot %B2%">The cost grows by $2.50 for every additional mile.</span> <span class="hot %B3%">A 0-mile ride still costs $3.</span></p>',
     partA:{stem:'Which equation models the total cost <b>y</b> for a ride of <b>x</b> miles?',
            options:['y = 2.50x + 3','y = 3x + 2.50','y = 5.50x','y = 2.50x − 3']},
     partB:{stem:'Which two statements from the passage best support your answer to Part A?',
            options:['"A 4-mile ride costs $13."','"A 6-mile ride costs $18."','"The cost grows by $2.50 for every additional mile."','"A 0-mile ride still costs $3."']},
   }},
  {n:5, type:'eq',       part:1, subj:'Math', stdId:'8.EE.A.2',   pts:1, label:'Equation Editor',
   content:{
     stem:'Solve for <b>x</b>. Use the equation editor to enter your answer. &nbsp; <b>2x² − 8 = 0</b>',
     instr:'Type directly, or tap the math symbols below.',
     placeholder:'Type your answer (e.g. x = ±2)',
   }},
  // Graphing — TCAP Math SP2/SP3 high-frequency item for Grades 6-8.
  // Promoted from Phase 2 to MVP must-have; rendered via the existing graph
  // builder so the demo just works end-to-end.
  {n:6, type:'graph',    part:1, subj:'Math', stdId:'8.F.A.3',    pts:1, label:'Graphing',
   content:{
     stem:'On the coordinate plane below, plot the line that represents the equation <b>y = 2x − 1</b>.',
     instr:'Click two points the line passes through. The system will draw the line through your points.',
   }},
];

// ─── TCAP Science · Grade 8 Subpart (5-question demo) ─────────────────────
const TCS_QUESTIONS_SCIENCE = [
  {n:1, type:'mc',       part:1, subj:'Science', stdId:'8.PS3.1', pts:1, label:'Multiple Choice',
   content:{
     stem:'A skater coasts down a ramp and reaches the bottom at the same height as where she started. Ignoring friction, which form of energy is <b>greatest</b> at the bottom of the ramp?',
     options:['Potential energy','Kinetic energy','Thermal energy','Chemical energy'],
   }},
  {n:2, type:'twopart',  part:1, subj:'Science', stdId:'8.LS1.4', pts:2, label:'Two-Part / Data Interpretation',
   content:{
     stem:'A class measured the height of bean plants over 10 days under two light conditions. Use the data to answer Part A and Part B.',
     passageHtml:'<p><b>Group 1 (full sun)</b> grew from 2 cm → 18 cm in 10 days.</p><p><b>Group 2 (partial shade)</b> grew from 2 cm → 9 cm in 10 days.</p><p><span class="hot %B0%">Group 1 plants grew about twice as fast as Group 2.</span> <span class="hot %B1%">Both groups started at the same height.</span> <span class="hot %B2%">Light intensity affects plant growth rate.</span> <span class="hot %B3%">Bean plants need water to grow.</span></p>',
     partA:{stem:'Which claim is best supported by the data?',
            options:['Light intensity affects bean plant growth.','All plants grow faster in shade.','Bean plants stop growing after day 5.','Water alone determines growth rate.']},
     partB:{stem:'Which two statements from the data best support your claim?',
            options:['"Group 1 grew about twice as fast as Group 2."','"Both groups started at the same height."','"Light intensity affects plant growth rate."','"Bean plants need water to grow."']},
   }},
  {n:3, type:'matrix',   part:1, subj:'Science', stdId:'8.PS1.2', pts:1, label:'Matrix / Tabular',
   content:{
     stem:'Mark whether each statement about <b>chemical reactions</b> is True, False, or Not Stated in the lab procedure you reviewed.',
     rows:[
       'Mass is conserved during a chemical reaction.',
       'Reactions always release heat.',
       'Bubbles can be a sign of a chemical change.',
       'The lab used hydrochloric acid as a reactant.',
     ],
   }},
  {n:4, type:'fib',      part:1, subj:'Science', stdId:'8.LS1.1', pts:1, label:'Fill in the Blank',
   content:{
     stem:'Type the correct term in each blank.',
     template:'The %BLANK0% is the basic structural and functional unit of all living things, and the %BLANK1% controls which substances enter or leave it.',
     blanks:[{placeholder:'unit'},{placeholder:'structure'}],
   }},
  {n:5, type:'hotspot',  part:1, subj:'Science', stdId:'8.LS1.2', pts:1, label:'Hot Spot (Diagram)',
   content:{
     stem:'Click on the part of the cell diagram that produces most of the cell\'s energy through cellular respiration.',
     instr:'Tap the region in the image. You can tap again to change your answer.',
   }},
  // True/False — TNReady delivers TF as an MC sub-variant (variant:'tf').
  // Common in Science for evaluating short scientific claims.
  {n:6, type:'mc',       part:1, subj:'Science', stdId:'8.PS2.4', pts:1, label:'True / False',
   content:{
     variant:'tf',
     stem:'<b>Read the claim below.</b><br><br><span style="display:block;background:#fafafa;border-left:3px solid #7c3aed;padding:12px 16px;font-size:15px;color:#27272a;line-height:1.6;border-radius:0 6px 6px 0">"Gravitational force depends only on the mass of the two objects, not on the distance between them."</span>',
     instr:'Decide whether this statement is true or false based on what you have learned about gravity.',
     options:['True','False'],
   }},
];

// ─── TCAP Social Studies · Grade 8 Subpart (5-question demo) ──────────────
const TCS_QUESTIONS_SS = [
  {n:1, type:'mc',       part:1, subj:'Social Studies', stdId:'8.36', pts:1, label:'Multiple Choice',
   content:{
     stem:'Which of the following was a <b>primary cause</b> of the American Civil War?',
     options:[
       'Disagreements over the expansion of slavery into new territories',
       'A trade dispute with Great Britain',
       'The discovery of gold in California',
       'Westward migration along the Oregon Trail',
     ],
   }},
  {n:2, type:'twopart',  part:1, subj:'Social Studies', stdId:'8.42', pts:2, label:'Two-Part / Primary Source',
   content:{
     stem:'Read the excerpt from the <b>Emancipation Proclamation</b> (1863). Then answer Part A and Part B.',
     passageHtml:'<p style="font-family:Georgia,serif;font-style:italic">"…all persons held as slaves within any State or designated part of a State, the people whereof shall then be in rebellion against the United States, shall be then, thenceforward, and forever free…"</p><p><span class="hot %B0%">"all persons held as slaves"</span> within rebelling states <span class="hot %B1%">"shall be then, thenceforward, and forever free."</span> <span class="hot %B2%">The proclamation did not apply to border states loyal to the Union.</span> <span class="hot %B3%">It transformed the legal status of enslaved people in Confederate territory.</span></p>',
     partA:{stem:'What was the <b>main effect</b> of the Emancipation Proclamation?',
            options:[
              'Freed enslaved people in Confederate-held territory',
              'Ended slavery in every U.S. state immediately',
              'Granted voting rights to all African Americans',
              'Returned enslaved people to their original states',
            ]},
     partB:{stem:'Which two phrases from the source best support your answer to Part A?',
            options:[
              '"all persons held as slaves"',
              '"shall be then, thenceforward, and forever free."',
              '"did not apply to border states loyal to the Union."',
              '"transformed the legal status of enslaved people…"',
            ]},
   }},
  {n:3, type:'hottext',  part:1, subj:'Social Studies', stdId:'8.51', pts:1, label:'Hot Text · Document Analysis',
   content:{
     stem:'Click the <b>two sentences</b> that best explain why the <b>13 colonies declared independence</b>.',
     instr:'Tap a sentence to select it. Tap again to unselect.',
     targetCount:2,
     sentences:[
       'Many colonists believed the British government was taxing them without representation in Parliament.',
       'The colonies had been founded in the 1600s by English settlers.',
       'Colonial leaders argued that the king had violated the natural rights of the people.',
       'Boston, Massachusetts is located in New England.',
       'Trade between the colonies and Great Britain had grown for over a century.',
     ],
   }},
  {n:4, type:'fib',      part:1, subj:'Social Studies', stdId:'8.59', pts:1, label:'Fill in the Blank · Geography',
   content:{
     stem:'Type the correct geographic term for each blank.',
     template:'The Mississippi River served as a critical %BLANK0% route for moving goods through the South. The %BLANK1% Mountains formed a natural barrier slowing westward expansion in the early 1800s.',
     blanks:[{placeholder:'transport type'},{placeholder:'mountain range'}],
   }},
  {n:5, type:'dragdrop', part:1, subj:'Social Studies', stdId:'8.65', pts:1, label:'Drag & Drop · Timeline',
   content:{
     stem:'Drag the correct event into each blank to put the timeline in order.',
     instr:'Drag a chip from the tray below to a blank — or tap a chip to auto-fill the next empty slot.',
     chips:['Declaration of Independence','Louisiana Purchase','Civil War begins','Constitution ratified','Reconstruction ends'],
     template:'1776 → %SLOT0% (the colonies break from Britain). 1788 → %SLOT1% (a new framework of government takes effect).',
   }},
];

// Question pools registered by subject-key. Each key maps to a single
// representative Subpart from PRD §5.5.2. The runner reads from the active
// pool (TCS_QUESTIONS) which is reassigned via tcsSwitchSubject().
const TCS_POOLS = {
  'ELA Writing':      TCS_QUESTIONS_ELA_WRITING,    // SP1, 85 min, human-reviewed
  'ELA Reading':      TCS_QUESTIONS_ELA_READING,    // SP2 (+ SP3/SP4 mix), 50 min
  'Math':             TCS_QUESTIONS_MATH,           // SP1, 60 min, calculator disabled
  'Science':          TCS_QUESTIONS_SCIENCE,        // SP1, 45 min (Grades 5-8)
  'Social Studies':   TCS_QUESTIONS_SS,             // SP1, 45 min (Grades 6-8)
};
// Active question pool — defaults to ELA Reading (the most representative
// reading-heavy Subpart, easiest to demo a multi-item runner).
let TCS_QUESTIONS = TCS_QUESTIONS_ELA_READING;

const TCS_STATE = {
  phase:        'launch',
  studentName:  'Marcus Johnson',
  studentId:    '',
  joinCode:     '',
  // Active subject-subpart key — determines which TCS_POOLS pool is loaded
  // into TCS_QUESTIONS and which header brand / test name / timer renders.
  // Switched via tcsSwitchSubject() (called from the toolbar dropdown).
  // Keys mirror PRD §5.5.2: 'ELA Writing' | 'ELA Reading' | 'Math' |
  // 'Science' | 'Social Studies'.
  subject:      'ELA Reading',
  testName:     'TCAP ELA · Grade 8 · Subpart 2 (Literary + Informational Reading)',
  durationMin:  85,           // total session (base, before ext-time)
  partTimeMin:  35,           // per-part (base)
  remainingSec: 35*60,
  // Extended-time accommodation: read from STUDENT_PROFILES per the TDOE
  // rule "Extended Time per Subpart × multiplier". 1.0 = no accommodation,
  // 1.2 = standard IEP, 1.5 = 504 with anxiety/processing, 2.0 = ELL etc.
  // The header chip renders only when extMultiplier > 1.0.
  extMultiplier:1.0,
  extReason:    null,         // 'IEP' / '504' / 'ELL' / null
  paused:       false,
  pausedReason: 'Proctor paused the session',
  currentIdx:   0,            // current question index
  currentPart:  1,
  flags:        new Set(),    // question indices flagged for review
  // Answers reuse _itsAnswers from ITEM_STUDENT_BUILDERS so per-type UIs
  // "just work" without changes.
  timer:        null,
  // Ready-check state.
  // Real TCAP / TestNav has only the audio test student-facing — mic check
  // is dropped (TCAP K-12 has no speaking items), and network/screen are
  // verified passively (no Test button) so we don't surface IT-level
  // metrics like Mbps / pixel resolution to a 13-year-old.
  // ready[k] reflects final pass; checkStatus[k] reflects current row UI state:
  //   'idle'    → student-facing Test button (audio only)
  //   'testing' → show inline progress (audio wave / network bar / screen scan)
  //   'awaiting'→ Audio only, after tone played: show "Did you hear it?" with Yes/Replay/No
  //   'pass'    → ready[k]=true
  ready:        {audio:false, network:false, screen:false},
  checkStatus:  {audio:'idle', network:'idle', screen:'idle'},
  checkDetail:  {audio:'', network:'', screen:''}, // post-pass detail line
  breakSec:     0,
  breakTimer:   null,
  partsVisited: new Set([1]), // tracks which parts the student has entered, gating the one-time break
  holdingTimer: null,
  scoredPct:    0,
  // Scratchpad notes (TestNav-style). Persists for the duration of the
  // subpart; cleared on tcsOpen / tcsExit / tcsBeginTest reset.
  notesText:    '',
  notepadOpen:  false,
};

function tcsOpen(opts) {
  // Reset and (optionally) jump to a phase. Used by dev-panel entries.
  TCS_STATE.phase = (opts && opts.phase) || 'launch';
  TCS_STATE.currentIdx = (opts && typeof opts.currentIdx === 'number') ? opts.currentIdx : 0;
  TCS_STATE.currentPart = TCS_QUESTIONS[TCS_STATE.currentIdx]?.part || 1;
  // Extended-time presets — the dev panel can launch the student shell as
  // a regular student (1.0×) or as an IEP / 504 / ELL student to demo
  // how the per-SP timer scales. Resolution order:
  //   opts.extMultiplier > opts.studentProfileId > default 1.0×
  if (opts && typeof opts.extMultiplier === 'number') {
    TCS_STATE.extMultiplier = opts.extMultiplier;
    TCS_STATE.extReason     = opts.extReason || null;
    if (opts.studentName) TCS_STATE.studentName = opts.studentName;
  } else if (opts && opts.studentProfileId) {
    const p = (typeof STUDENT_PROFILES !== 'undefined' ? STUDENT_PROFILES : []).find(x => x.id === opts.studentProfileId);
    if (p) {
      TCS_STATE.extMultiplier = p.extendedTimeMultiplier || 1.0;
      TCS_STATE.extReason     = p.extendedTimeReason || null;
      TCS_STATE.studentName   = p.name;
    }
  } else {
    TCS_STATE.extMultiplier = 1.0;
    TCS_STATE.extReason     = null;
  }
  // Recompute per-part / per-section budget after multiplier is set so
  // the timer header reflects the accommodated time on the very first paint.
  const basePartMin = 35;
  TCS_STATE.partTimeMin  = Math.round(basePartMin * TCS_STATE.extMultiplier);
  TCS_STATE.remainingSec = TCS_STATE.partTimeMin * 60;
  // Reset per-row UI state on each fresh open so the device-check page never
  // shows stale "Testing…" or "awaiting confirm" rows from a prior session.
  TCS_STATE.checkStatus = {audio:'idle', network:'idle', screen:'idle'};
  TCS_STATE.checkDetail = {audio:'', network:'', screen:''};
  TCS_STATE.ready = {audio:false, network:false, screen:false};
  // Wipe any scratchpad text from a prior session and force-close the panel.
  TCS_STATE.notesText   = '';
  TCS_STATE.notepadOpen = false;
  // Reset to ELA Reading as the default Subpart when the runner opens fresh
  // (most representative multi-item flow; Writing SP1 is a single essay).
  if (typeof tcsSwitchSubject === 'function' && (!opts || !opts.subject)) {
    tcsSwitchSubject('ELA Reading');
  } else if (opts && opts.subject) {
    tcsSwitchSubject(opts.subject);
  }
  if (opts && opts.preset === 'mid-test') {
    TCS_STATE.studentId = '12345';
    TCS_STATE.joinCode  = 'TN-2026';
    TCS_STATE.ready = {audio:true, network:true, screen:true};
    TCS_STATE.checkStatus = {audio:'pass', network:'pass', screen:'pass'};
    // Mid-test preset still budgets 18 min remaining at 1.0×; scale by
    // multiplier to keep the demo internally consistent.
    TCS_STATE.remainingSec = Math.round(18 * 60 * TCS_STATE.extMultiplier);
  }
  switchRole('student', true);
  nav('tcap-stu');
  tcsRender();
  tcsStartTimer();
}

function tcsSetPhase(p) {
  TCS_STATE.phase = p;
  // Stop / start timers as needed based on phase
  if (p !== 'test' && p !== 'break') tcsStopTimer();
  if (p === 'test')  tcsStartTimer();
  if (p === 'break') tcsStartBreakTimer();
  // First entry to ready phase auto-verifies network/screen passively.
  // Guard on 'idle' so re-renders don't re-trigger the verification chain.
  if (p === 'ready') tcsAutoVerifyPassiveChecks();
  else tcsStopBreakTimer();
  if (p === 'holding') tcsStartHoldingProgress();
  else tcsStopHoldingProgress();
  tcsRender();
}

// ─── Timers ───
function tcsStartTimer() {
  tcsStopTimer();
  TCS_STATE.timer = setInterval(() => {
    if (TCS_STATE.phase !== 'test' || TCS_STATE.paused) return;
    TCS_STATE.remainingSec = Math.max(0, TCS_STATE.remainingSec - 1);
    tcsUpdateTimerDisplay();
    if (TCS_STATE.remainingSec === 0) {
      tcsStopTimer();
      iteToast('⏰ Time up — auto-advancing to Review', 'info');
      tcsSetPhase('review');
    }
  }, 1000);
}
function tcsStopTimer()  { if (TCS_STATE.timer) { clearInterval(TCS_STATE.timer); TCS_STATE.timer = null; } }
function tcsStartBreakTimer() {
  tcsStopBreakTimer();
  TCS_STATE.breakSec = 0;
  TCS_STATE.breakTimer = setInterval(() => {
    TCS_STATE.breakSec += 1;
    const el = document.getElementById('tcsBreakTime');
    if (el) el.firstChild.nodeValue = tcsFmtTime(TCS_STATE.breakSec) + ' ';
  }, 1000);
}
function tcsStopBreakTimer() { if (TCS_STATE.breakTimer) { clearInterval(TCS_STATE.breakTimer); TCS_STATE.breakTimer = null; } }
function tcsStartHoldingProgress() {
  tcsStopHoldingProgress();
  TCS_STATE.scoredPct = 0;
  TCS_STATE.holdingTimer = setInterval(() => {
    TCS_STATE.scoredPct = Math.min(100, TCS_STATE.scoredPct + 4);
    const el = document.getElementById('tcsHoldPct');
    if (el) el.textContent = TCS_STATE.scoredPct + '%';
    if (TCS_STATE.scoredPct >= 100) tcsStopHoldingProgress();
  }, 350);
}
function tcsStopHoldingProgress() { if (TCS_STATE.holdingTimer) { clearInterval(TCS_STATE.holdingTimer); TCS_STATE.holdingTimer = null; } }
function tcsFmtTime(sec) {
  const m = Math.floor(sec/60), s = sec % 60;
  return m + ':' + String(s).padStart(2,'0');
}
function tcsUpdateTimerDisplay() {
  const el = document.getElementById('tcsTimerDigits');
  if (!el) return;
  el.textContent = tcsFmtTime(TCS_STATE.remainingSec);
  el.parentElement.classList.toggle('warn', TCS_STATE.remainingSec <= 5*60);
}

// ─── Phase actions ───
function tcsLaunchSubmit() {
  const code = document.getElementById('tcsLaunchCode')?.value.trim();
  const sid  = document.getElementById('tcsLaunchId')?.value.trim();
  if (!code || !sid) { iteToast('Enter Join Code and Student ID', 'info'); return; }
  TCS_STATE.joinCode = code;
  TCS_STATE.studentId = sid;
  tcsSetPhase('ready');
}
// ── Device-check interactions (audio only, post-TCAP-market trim) ─────────
// Real TestNav student-side device check is just a speaker / headphones tone
// test for subparts with listening items. We mirror that here: audio plays a
// Web Audio API tone and forces the student to confirm "Yes, I heard it";
// network/screen rows render passively as "auto-verified by IT" (no Test
// button) via tcsAutoVerifyPassiveChecks. Mic check was removed entirely
// because TCAP K-12 has no speaking items.
function tcsTestReady(key) {
  // After the TCAP-market alignment, only audio is student-actionable.
  // network/screen are auto-verified passively (see tcsAutoVerifyPassive).
  if (key === 'audio') return tcsTestAudio();
}

// Auto-verify the network/screen rows on first entry to the ready phase.
// Real TCAP delegates these checks to school IT pre-test day, so students
// never click anything for them — but we still surface a brief verification
// animation so Kira's "we double-check your device" narrative reads.
function tcsAutoVerifyPassiveChecks() {
  if (TCS_STATE.checkStatus.network === 'idle') {
    TCS_STATE.checkStatus.network = 'testing';
    setTimeout(() => {
      const mbps = (24 + Math.random()*10).toFixed(0);
      TCS_STATE.ready.network = true;
      TCS_STATE.checkStatus.network = 'pass';
      TCS_STATE.checkDetail.network = `Verified by your school's IT · ↓ ${mbps} Mbps stable`;
      tcsRender();
    }, 700);
  }
  if (TCS_STATE.checkStatus.screen === 'idle') {
    TCS_STATE.checkStatus.screen = 'testing';
    setTimeout(() => {
      const w = window.innerWidth, h = window.innerHeight;
      TCS_STATE.ready.screen = true;
      TCS_STATE.checkStatus.screen = 'pass';
      TCS_STATE.checkDetail.screen = `Verified by your school's IT · ${w}×${h} display`;
      tcsRender();
    }, 400);
  }
}

// Audio: real Web Audio API tone + force confirmation.
let _tcsAudioCtx = null;
function tcsPlayDeviceTone() {
  try {
    _tcsAudioCtx = _tcsAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _tcsAudioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 660; // E5 — clear but not piercing
    const t0 = ctx.currentTime;
    // Short envelope: 30ms attack, 0.5s sustain at -10dB, 100ms release. Avoids click.
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.03);
    gain.gain.setValueAtTime(0.25, t0 + 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.65);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.7);
    return true;
  } catch (e) {
    console.warn('[tcs audio] tone failed', e);
    return false;
  }
}
function tcsTestAudio() {
  TCS_STATE.checkStatus.audio = 'testing';
  tcsRender();
  const ok = tcsPlayDeviceTone();
  // Even if tone fails (autoplay policy edge case), still progress to confirm
  // step so the student isn't softlocked — they can try Replay.
  setTimeout(() => {
    TCS_STATE.checkStatus.audio = 'awaiting';
    tcsRender();
    if (!ok) iteToast('Tap Replay if you didn\'t hear anything', 'info');
  }, 750);
}
function tcsAudioReplay() {
  tcsPlayDeviceTone();
}
function tcsAudioConfirm(heard) {
  if (heard) {
    TCS_STATE.ready.audio = true;
    TCS_STATE.checkStatus.audio = 'pass';
    TCS_STATE.checkDetail.audio = 'Tone confirmed';
    tcsRender();
  } else {
    // "No, I didn't hear it" → reset to idle and surface guidance.
    TCS_STATE.checkStatus.audio = 'idle';
    iteToast('Try plugging in headphones or unmuting your speaker, then test again.', 'info');
    tcsRender();
  }
}

// (Network and Screen no longer have student-facing Test functions —
// see tcsAutoVerifyPassiveChecks above.)
function tcsToDirection() {
  const allReady = Object.values(TCS_STATE.ready).every(v => v);
  if (!allReady) { iteToast('Complete all device checks first', 'info'); return; }
  tcsSetPhase('direction');
}
function tcsBeginTest() {
  TCS_STATE.currentIdx = 0;
  TCS_STATE.currentPart = 1;
  TCS_STATE.remainingSec = TCS_STATE.partTimeMin * 60;
  tcsSetPhase('test');
}

function tcsGoTo(idx) {
  if (idx < 0 || idx >= TCS_QUESTIONS.length) return;
  // No mid-Subpart break — TCAP runs the timer continuously per official
  // rules. The break view stays in the codebase as a legacy/quick-jump
  // demo target only (no organic flow into it).
  TCS_STATE.currentIdx  = idx;
  TCS_STATE.currentPart = TCS_QUESTIONS[idx].part;
  tcsRender();
}
// Used by Review screen "Edit ↗" — same as tcsGoTo now (no break to skip).
function tcsGoToFromReview(idx) {
  if (idx < 0 || idx >= TCS_QUESTIONS.length) return;
  TCS_STATE.currentIdx = idx;
  TCS_STATE.currentPart = TCS_QUESTIONS[idx].part;
  tcsSetPhase('test');
}
function tcsToggleFlag() {
  const i = TCS_STATE.currentIdx;
  if (TCS_STATE.flags.has(i)) TCS_STATE.flags.delete(i);
  else TCS_STATE.flags.add(i);
  tcsRender();
}
function tcsResumeAfterBreak() {
  TCS_STATE.currentPart = TCS_QUESTIONS[TCS_STATE.currentIdx].part;
  if (!TCS_STATE.partsVisited) TCS_STATE.partsVisited = new Set([1]);
  TCS_STATE.partsVisited.add(TCS_STATE.currentPart); // mark so future jumps skip the break
  TCS_STATE.remainingSec = TCS_STATE.partTimeMin * 60;
  tcsSetPhase('test');
}
function tcsTriggerPause(reason) {
  TCS_STATE.paused = true;
  TCS_STATE.pausedReason = reason || 'Proctor paused the session';
  tcsSetPhase('paused');
}
function tcsResume() {
  TCS_STATE.paused = false;
  tcsSetPhase('test');
}
function tcsToReview() { tcsSetPhase('review'); }
function tcsAskSubmit() {
  const wrap = document.getElementById('tcsModalWrap');
  if (!wrap) return;
  const ans = TCS_QUESTIONS.filter((q,i) => itsIsAns(q.type)).length;
  const unans = TCS_QUESTIONS.length - ans;
  wrap.innerHTML = `
    <div class="tcs-modal">
      <h3>Submit your test?</h3>
      <p>You answered <b>${ans}</b> of ${TCS_QUESTIONS.length} questions${unans > 0 ? ` · <b style="color:#dc2626">${unans} unanswered</b>` : ''}.</p>
      <p>${unans > 0 ? 'Once you submit you cannot change your answers. Are you sure?' : 'Once you submit you cannot change your answers.'}</p>
      <div class="modal-actions">
        <button class="tcs-foot-btn" onclick="tcsCloseModal()">Keep working</button>
        <button class="tcs-foot-btn primary" onclick="tcsCloseModal();tcsSetPhase('holding')">Submit test ✓</button>
      </div>
    </div>`;
  wrap.classList.add('open');
}
function tcsCloseModal() {
  const wrap = document.getElementById('tcsModalWrap');
  if (wrap) { wrap.classList.remove('open'); wrap.innerHTML = ''; }
}
function tcsExit() {
  if (!confirm('Exit the test? Your progress is auto-saved.')) return;
  tcsStopTimer(); tcsStopBreakTimer(); tcsStopHoldingProgress();
  // Force-close & wipe scratchpad so the next student session starts clean.
  TCS_STATE.notesText = ''; TCS_STATE.notepadOpen = false; tcsCloseNotepad();
  // Force-close the sources viewer too — it's per-question scratch UI.
  if (typeof tcsCloseSources === 'function') tcsCloseSources();
  switchRole('teacher', true);
  nav('homepage');
}

// ─── Floating scratchpad notes (TCAP/TestNav-style) ─────────────────────
// Persists text in TCS_STATE.notesText so notes carry across questions
// within the subpart. Header is draggable; "Auto-saved" indicator briefly
// flashes on input. The Notes button in the runner header gets a small
// amber dot via .has-notes when content is present.
function tcsToggleNotepad() {
  TCS_STATE.notepadOpen ? tcsCloseNotepad() : tcsOpenNotepad();
}
function tcsOpenNotepad() {
  const np = document.getElementById('tcsNotepad');
  const ta = document.getElementById('tcsNotepadText');
  const cnt= document.getElementById('tcsNotepadCount');
  if (!np || !ta) return;
  ta.value = TCS_STATE.notesText || '';
  if (cnt) cnt.textContent = ta.value.length;
  np.classList.add('open');
  np.setAttribute('aria-hidden', 'false');
  TCS_STATE.notepadOpen = true;
  setTimeout(() => ta.focus(), 60);
}
function tcsCloseNotepad() {
  const np = document.getElementById('tcsNotepad');
  if (np) { np.classList.remove('open'); np.setAttribute('aria-hidden', 'true'); }
  TCS_STATE.notepadOpen = false;
}
function tcsNotesInput(v) {
  TCS_STATE.notesText = v || '';
  const cnt = document.getElementById('tcsNotepadCount');
  if (cnt) cnt.textContent = (v || '').length;
  // Brief "Saving…" flash to give the student feedback that text persists.
  const saved = document.getElementById('tcsNotepadSaved');
  if (saved) {
    saved.textContent = 'Saving…';
    saved.classList.add('dirty');
    clearTimeout(tcsNotesInput._t);
    tcsNotesInput._t = setTimeout(() => {
      saved.textContent = 'Auto-saved';
      saved.classList.remove('dirty');
    }, 600);
  }
  tcsRefreshNotesBadge();
}
function tcsClearNotepad() {
  if (!TCS_STATE.notesText) return;
  if (!confirm('Clear all notes? This cannot be undone.')) return;
  TCS_STATE.notesText = '';
  const ta = document.getElementById('tcsNotepadText');
  const cnt= document.getElementById('tcsNotepadCount');
  if (ta) { ta.value = ''; ta.focus(); }
  if (cnt) cnt.textContent = '0';
  tcsRefreshNotesBadge();
}
function tcsRefreshNotesBadge() {
  const btn = document.getElementById('tcsNotesBtn');
  if (!btn) return;
  if (TCS_STATE.notesText) btn.classList.add('has-notes');
  else                     btn.classList.remove('has-notes');
}
// Drag the notepad by its header. Stays inside the runner shell.
function tcsNotepadDragStart(e) {
  const np    = document.getElementById('tcsNotepad');
  const shell = document.getElementById('tcsShell');
  if (!np || !shell) return;
  // Don't start a drag from the close button.
  if (e.target && e.target.closest('.tcs-notepad-close')) return;
  e.preventDefault();
  const npRect    = np.getBoundingClientRect();
  const shellRect = shell.getBoundingClientRect();
  const offX = e.clientX - npRect.left;
  const offY = e.clientY - npRect.top;
  // Convert to absolute positioning (left/top instead of right/bottom) so
  // we can move freely. Lock current visual position first.
  np.style.left   = (npRect.left - shellRect.left) + 'px';
  np.style.top    = (npRect.top  - shellRect.top)  + 'px';
  np.style.right  = 'auto';
  np.style.bottom = 'auto';
  function onMove(ev) {
    const nx = Math.max(0, Math.min(shellRect.width  - npRect.width,  ev.clientX - shellRect.left - offX));
    const ny = Math.max(0, Math.min(shellRect.height - npRect.height, ev.clientY - shellRect.top  - offY));
    np.style.left = nx + 'px';
    np.style.top  = ny + 'px';
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);
}

// ─── Sources viewer (slide-in panel for writing-prompt items) ─────────────
// Reads from window._tcsActiveSources (set by the essay item builder) so
// the panel doesn't need to know which question it's pulling from. State:
//   TCS_STATE.sourcesOpen     = boolean (panel visibility)
//   TCS_STATE.sourcesActiveIdx = number  (which tab is active)
TCS_STATE.sourcesOpen      = false;
TCS_STATE.sourcesActiveIdx = 0;
function tcsOpenSources() {
  const data = window._tcsActiveSources || [];
  if (!data.length) return;
  TCS_STATE.sourcesOpen = true;
  // Default to the first tab when opening fresh, but preserve the user's
  // last tab if they're toggling within a single question.
  if (TCS_STATE.sourcesActiveIdx >= data.length) TCS_STATE.sourcesActiveIdx = 0;
  tcsRenderSources();
  const panel = document.getElementById('tcsSourcesPanel');
  if (panel) {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
  }
}
function tcsCloseSources() {
  TCS_STATE.sourcesOpen = false;
  const panel = document.getElementById('tcsSourcesPanel');
  if (panel) {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }
}
function tcsToggleSources() {
  if (TCS_STATE.sourcesOpen) tcsCloseSources();
  else                       tcsOpenSources();
}
function tcsSelectSource(idx) {
  TCS_STATE.sourcesActiveIdx = idx;
  tcsRenderSources();
}
function tcsRenderSources() {
  const data = window._tcsActiveSources || [];
  const tabs = document.getElementById('tcsSourcesTabs');
  const body = document.getElementById('tcsSourcesBody');
  if (!tabs || !body || !data.length) return;
  const active = Math.min(TCS_STATE.sourcesActiveIdx, data.length - 1);
  tabs.innerHTML = data.map((s, i) => `
    <button class="tcs-sources-tab ${i === active ? 'active' : ''}" onclick="tcsSelectSource(${i})">${s.label || `Source ${i + 1}`}</button>
  `).join('');
  const src = data[active] || {};
  body.innerHTML = `
    <h4>${src.title || ''}</h4>
    ${src.byline ? `<p class="src-byline">${src.byline}</p>` : ''}
    ${src.bodyHtml || ''}`;
}

// ─── Master render ───
function tcsRender() {
  const phase = TCS_STATE.phase;
  tcsRenderHeader();
  const body = document.getElementById('tcsBody');
  const footer = document.getElementById('tcsFooter');
  const overlay = document.getElementById('tcsOverlay');
  if (overlay) overlay.innerHTML = '';
  if (phase === 'launch')      { body.innerHTML = tcsViewLaunch();    footer.innerHTML = ''; }
  else if (phase === 'ready')      { body.innerHTML = tcsViewReady();     footer.innerHTML = ''; }
  else if (phase === 'direction')  { body.innerHTML = tcsViewDirection(); footer.innerHTML = tcsFooterSimple('Begin Test', 'tcsBeginTest()'); }
  else if (phase === 'test')       { body.innerHTML = tcsViewTest();      footer.innerHTML = tcsFooterTest(); }
  else if (phase === 'break')      { body.innerHTML = tcsViewBreak();     footer.innerHTML = tcsFooterSimple('Skip break (demo)', "tcsResumeAfterBreak()", true); }
  else if (phase === 'paused')     { body.innerHTML = '';                 footer.innerHTML = ''; if (overlay) overlay.innerHTML = tcsViewPaused(); }
  else if (phase === 'review')     { body.innerHTML = tcsViewReview();    footer.innerHTML = tcsFooterReview(); }
  else if (phase === 'holding')    { body.innerHTML = tcsViewHolding();   footer.innerHTML = ''; }
  else                             { body.innerHTML = tcsViewLaunch();    footer.innerHTML = ''; }
}

function tcsRenderHeader() {
  const phase = TCS_STATE.phase;
  const hideHeader = (phase === 'launch' || phase === 'ready');
  const head = document.getElementById('tcsHeader');
  if (hideHeader) {
    head.innerHTML = `
      <div class="tcs-h-left">
        <span class="tcs-brand"><span class="lg">TN</span><span class="nm">TCAP<small>Tennessee Comprehensive Assessment Program</small></span></span>
      </div>
      <div class="tcs-h-center"></div>
      <div class="tcs-h-right">
        <button class="tcs-icon-btn" onclick="tcsExit()">✕ Exit</button>
      </div>`;
    return;
  }
  if (phase === 'paused' || phase === 'holding' || phase === 'break') {
    head.innerHTML = `
      <div class="tcs-h-left">
        <span class="tcs-brand"><span class="lg">TN</span><span class="nm">${TCS_STATE.testName}</span></span>
      </div>
      <div class="tcs-h-center"></div>
      <div class="tcs-h-right">
        <span class="tcs-stu-tag">${TCS_STATE.studentName} · ID ${TCS_STATE.studentId || '12345'}</span>
      </div>`;
    return;
  }
  // direction / test / review
  const q = TCS_QUESTIONS[TCS_STATE.currentIdx];
  // No "Part 1 / Part 2" framing — TCAP runs as a single continuous Subpart.
  // Show the SP's short name (from _TCS_SUBJECT_META) so the student knows
  // which Subpart they're in, without faking ACT-style internal sections.
  const subpartShort = (_TCS_SUBJECT_META[TCS_STATE.subject] || {}).short || 'Subpart';
  const sectionLbl = phase === 'test' ? `${subpartShort} · ${q ? q.label : ''}` :
                     phase === 'review' ? 'Review your answers' :
                     phase === 'direction' ? 'Test directions' : '';
  const sectionInfo = phase === 'test' && q
    ? `Question ${TCS_STATE.currentIdx + 1} of ${TCS_QUESTIONS.length}`
    : '';
  const showTimer = (phase === 'test');
  // Extended-time chip — shows next to the timer when this student has any
  // accommodation > 1.0× (per IEP / 504 / ELL). The number is the percent
  // bonus (e.g. 1.2 → +20%) so it reads at a glance.
  const extPctBonus = Math.round((TCS_STATE.extMultiplier - 1.0) * 100);
  const extChipHtml = (showTimer && extPctBonus > 0)
    ? `<div class="tcs-ext-chip" title="Accommodated time per ${TCS_STATE.extReason || 'student profile'} — applies per Subpart" style="display:inline-flex;align-items:center;gap:4px;padding:4px 9px;border-radius:8px;background:rgba(124,58,237,.18);color:#e0d4ff;border:1px solid rgba(196,181,253,.5);font-size:11px;font-weight:800;letter-spacing:.3px;margin-right:8px">⏱ Extended time +${extPctBonus}%${TCS_STATE.extReason ? ` · ${TCS_STATE.extReason}` : ''}</div>`
    : '';
  head.innerHTML = `
    <div class="tcs-h-left">
      <span class="tcs-brand"><span class="lg">TN</span><span class="nm">${(_TCS_SUBJECT_META[TCS_STATE.subject] || _TCS_SUBJECT_META['ELA Reading']).brand}</span></span>
    </div>
    <div class="tcs-h-center">
      <span class="tcs-sec-label">${sectionLbl}</span>
      <span class="tcs-sec-info">${sectionInfo}</span>
    </div>
    <div class="tcs-h-right">
      ${extChipHtml}
      ${showTimer ? `<div class="tcs-timer" id="tcsTimerWrap">⏱ <span id="tcsTimerDigits">${tcsFmtTime(TCS_STATE.remainingSec)}</span></div>` : ''}
      <button class="tcs-icon-btn" onclick="iteToast('Raise hand · Proctor notified','info')" title="Raise hand">✋ Help</button>
      <button class="tcs-icon-btn ${TCS_STATE.notesText ? 'has-notes' : ''}" id="tcsNotesBtn" onclick="tcsToggleNotepad()" title="Notes (scratchpad)">📋 Notes</button>
      <button class="tcs-icon-btn danger" onclick="tcsExit()">✕ Exit</button>
    </div>`;
  if (phase === 'test') tcsUpdateTimerDisplay();
}

// ─── Phase 1: Launch ───
function tcsViewLaunch() {
  return `
    <div class="tcs-center-stage">
      <div class="tcs-center-card">
        <div class="ph-step">Step 1 of 3 · Sign in</div>
        <h1 class="ph-title">Welcome to your TCAP test</h1>
        <p class="ph-sub">Enter the join code your teacher gave you, then your student ID. If you don't have either, raise your hand.</p>
        <div class="ph-form">
          <div>
            <label>Join Code</label>
            <input id="tcsLaunchCode" class="code" placeholder="TN-2026" maxlength="10" value="${TCS_STATE.joinCode||''}">
            <div class="helper">e.g. TN-2026 — case-insensitive</div>
          </div>
          <div>
            <label>Student ID</label>
            <input id="tcsLaunchId" placeholder="e.g. 12345" value="${TCS_STATE.studentId||''}">
            <div class="helper">5-digit ID printed on your ticket</div>
          </div>
        </div>
        <button class="ph-cta" onclick="tcsLaunchSubmit()">Continue →</button>
        <div class="ph-foot">Test: <b>${TCS_STATE.testName}</b><br>Estimated time: ${TCS_STATE.durationMin} minutes (2 parts with a 5-min break)</div>
      </div>
    </div>`;
}

// ─── Phase 2: Ready Check ───
function tcsViewReady() {
  const r  = TCS_STATE.ready;
  const cs = TCS_STATE.checkStatus;
  const cd = TCS_STATE.checkDetail;
  const allReady = Object.values(r).every(v => v);
  // Two row archetypes after TCAP-market alignment:
  //   • Audio (interactive)     — student must click Test, hear the tone, confirm
  //   • Network/Screen (passive)— auto-verified on page entry; no Test button shown
  // We model the difference with the `interactive` flag below.
  const rightFor = (key, interactive) => {
    const status = cs[key];
    if (status === 'pass')    return `<span class="tc-status">Pass</span>`;
    if (status === 'testing') {
      const label = key === 'audio'   ? 'Playing tone…'
                  : key === 'network' ? 'Verifying connection…'
                  :                     'Verifying display…';
      return `<span class="tc-testing"><span class="tc-spinner"></span>${label}</span>`;
    }
    if (status === 'awaiting' && key === 'audio') {
      return `<div class="tc-confirm">
        <span class="tc-confirm-q">Did you hear it?</span>
        <button class="tc-confirm-btn no"     onclick="tcsAudioConfirm(false)">No</button>
        <button class="tc-confirm-btn replay" onclick="tcsAudioReplay()">Replay</button>
        <button class="tc-confirm-btn yes"    onclick="tcsAudioConfirm(true)">Yes</button>
      </div>`;
    }
    // idle: only audio surfaces a Test button. Passive rows show a quiet
    // "Verifying…" placeholder until tcsAutoVerifyPassiveChecks settles.
    if (interactive) return `<button class="tc-test-btn" onclick="tcsTestReady('${key}')">Test</button>`;
    return `<span class="tc-testing"><span class="tc-spinner"></span>Verifying…</span>`;
  };
  const animFor = (key) => {
    if (cs[key] !== 'testing') return '';
    if (key === 'audio')   return `<div class="tc-anim wave"><span></span><span></span><span></span></div>`;
    if (key === 'network') return `<div class="tc-anim bar"><div class="tc-anim-bar-fill"></div></div>`;
    if (key === 'screen')  return `<div class="tc-anim bar short"><div class="tc-anim-bar-fill"></div></div>`;
    return '';
  };
  const row = (key, ic, title, sub, interactive) => {
    const passed = cs[key] === 'pass';
    const detail = passed && cd[key] ? `<div class="tc-detail">✓ ${cd[key]}</div>` : '';
    return `
    <div class="tcs-check-row ${passed?'ok':''} ${cs[key]==='testing'?'is-testing':''} ${cs[key]==='awaiting'?'is-awaiting':''}">
      <div class="tc-ic">${passed?'✓':ic}</div>
      <div class="tc-text">
        <div class="tc-title">${title}</div>
        <div class="tc-sub">${sub}</div>
        ${animFor(key)}
        ${detail}
      </div>
      ${rightFor(key, interactive)}
    </div>`;
  };
  return `
    <div class="tcs-center-stage">
      <div class="tcs-center-card lg">
        <div class="ph-step">Step 2 of 3 · Device check</div>
        <h1 class="ph-title">Let's make sure your headphones work</h1>
        <p class="ph-sub">This subpart includes audio (listening) items. Click <b>Test</b> on the speaker check below — your other device requirements are auto-verified by your school's IT.</p>
        <div class="tcs-check-list">
          ${row('audio',   '🔊', 'Speaker / headphones',  'Click Test — you should hear a short tone, then confirm.', true)}
          ${row('network', '📡', 'Network connection',    'Auto-verified — your test administrator was notified if anything looked off.', false)}
          ${row('screen',  '🖥', 'Display',               'Auto-verified — your school IT pre-approved this device for TCAP.',           false)}
        </div>
        <button class="ph-cta" onclick="tcsToDirection()" ${allReady?'':'disabled'}>${allReady ? 'Continue to directions →' : (cs.audio === 'pass' ? 'Verifying device…' : 'Confirm the speaker test to continue')}</button>
      </div>
    </div>`;
}

// ─── Phase 3: Directions + sample item ───
function tcsViewDirection() {
  // Market reference: Tennessee TCAP today is delivered through Pearson
  // TestNav. Students/teachers/parents have 5+ years of muscle memory with
  // TestNav's directions screen. This view mirrors that mental model so
  // Kira's runner reads as "real TCAP" rather than "an online quiz":
  //   • framed as one subpart of a multi-subpart subject (cross-day reality)
  //   • toolbar overview so students recognize the tools waiting for them
  //   • scratch paper line — every TCAP session ships with this exact phrasing
  //   • seal code preview — test administrator hands one out per session
  //   • TestNav-style hard wording on leaving the test window
  // No mid-subpart break — TCAP runs the timer continuously per official rules.
  const totalMin = TCS_STATE.partTimeMin;
  const meta     = _TCS_SUBJECT_META[TCS_STATE.subject] || {};
  const tool = (icon, name, sub) => `
    <div class="tcs-tool">
      <div class="tcs-tool-ic">${icon}</div>
      <div class="tcs-tool-text">
        <div class="tcs-tool-name">${name}</div>
        <div class="tcs-tool-sub">${sub}</div>
      </div>
    </div>`;
  return `
    <div class="tcs-center-stage" style="padding:24px">
      <div class="tcs-center-card lg" style="max-width:820px">
        <div class="ph-step">Step 3 of 3 · Read the directions</div>
        <h1 class="ph-title">Before you begin</h1>
        <p class="ph-sub">${TCS_STATE.testName}. You'll have <b>${totalMin} minutes</b> and <b>${TCS_QUESTIONS.length} ${TCS_QUESTIONS.length === 1 ? 'task' : 'questions'}</b>. The timer counts down continuously — when it reaches zero, this subpart will submit automatically.</p>

        <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:12px 14px;margin:0 0 18px;font-size:12.5px;color:#4c1d95;line-height:1.55">
          <b>Heads-up</b> — ${meta.subpartContext || 'This is one subpart of a longer test.'} Your test administrator will hand you scratch paper before you start.
        </div>

        <div class="tcs-tools-section">
          <div class="tcs-tools-title">Tools available on the toolbar</div>
          <div class="tcs-tools-grid">
            ${tool('🖍', 'Highlighter',         'Mark important parts of the passage.')}
            ${tool('⊘',  'Answer Eliminator',   'Cross out choices you know are wrong.')}
            ${tool('☰',  'Line Reader',         'Focus on one line of text at a time.')}
            ${tool('🔍', 'Magnifier',           'Zoom into figures or fine print.')}
            ${tool('📓', 'Notepad',             'Plan your answer or jot notes.')}
            ${tool('🔊', 'Audio replay',        'Listen to audio items as many times as you need.')}
          </div>
        </div>

        <div class="tcs-direction-grid">
          <div class="tcs-direction-card">
            <h4>What you can do</h4>
            <ul>
              <li>Skip a question and come back to it (within this subpart)</li>
              <li>Bookmark any question for review</li>
              <li>Use the Notepad and your scratch paper freely</li>
              <li>Raise your hand if you need help — your test administrator will assist you</li>
            </ul>
          </div>
          <div class="tcs-direction-card">
            <h4>What you cannot do</h4>
            <ul>
              <li>Leave the test window or open other apps — your test will lock and your test administrator will be alerted</li>
              <li>Look up answers on another device — this is monitored</li>
              <li>Talk to other students or share answers</li>
              <li>Return to this subpart once you submit it</li>
            </ul>
          </div>
        </div>

        <div class="tcs-sample-box">
          <div class="sb-tag">Sample item · this won't count</div>
          <div class="sb-q">Many questions ask you to <b>click on words or sentences</b>, drag items into place, or type a short answer. Try the sample below:</div>
          <div style="background:#fff;padding:14px;border-radius:8px;border:1px solid #fde68a;font-size:13px">
            <div style="font-weight:700;margin-bottom:8px">Click the sentence that best supports the central idea.</div>
            <div style="line-height:1.9;font-family:Georgia,serif">
              <span style="background:#ede9fe;padding:2px 6px;border-radius:4px;border:1px dashed #c4b5fd;cursor:pointer">Many cities have grown rapidly.</span>
              <span style="background:#16a34a;color:#fff;padding:2px 6px;border-radius:4px;font-weight:600;cursor:pointer">✓ This growth strains water and power supplies.</span>
              <span style="color:#52525b">Some governments are responding with new policies.</span>
            </div>
            <div style="font-size:11px;color:#16a34a;margin-top:8px;font-weight:600">✓ Correct! You picked the sentence that supports the central idea.</div>
          </div>
        </div>

        <div class="tcs-seal-callout">
          <div class="tcs-seal-icon">🔑</div>
          <div>
            <div class="tcs-seal-title">Wait for your test administrator before clicking Begin Test</div>
            <div class="tcs-seal-sub">If your school uses a seal code, your administrator will read it aloud when it's time to start.</div>
          </div>
        </div>
      </div>
    </div>`;
}

// ─── Phase 4: Test (uses ITEM_STUDENT_BUILDERS registry) ───
function tcsViewTest() {
  const q = TCS_QUESTIONS[TCS_STATE.currentIdx];
  if (!q) return '<div class="tcs-center-stage"><div class="tcs-center-card"><h1 class="ph-title">No questions</h1></div></div>';
  const t = ITEM_TYPES.find(x => x.id === q.type);
  const builder = ITEM_STUDENT_BUILDERS[q.type];
  const isAns = itsIsAns(q.type);
  const isFlagged = TCS_STATE.flags.has(TCS_STATE.currentIdx);
  return `
    <div class="tcs-test-stage">
      <div class="tcs-test-card">
        ${(isAns || isFlagged) ? `
        <div class="tcs-q-meta">
          ${isAns ? '<span class="chip ok">✓ Answered</span>' : ''}
          ${isFlagged ? '<span class="chip flag">⚐ Flagged for review</span>' : ''}
        </div>` : ''}
        ${builder ? builder(t, q) : `<div style="padding:30px;text-align:center;color:#71717a">Renderer for ${q.type} not registered.</div>`}
      </div>
    </div>`;
}

function tcsFooterTest() {
  const i = TCS_STATE.currentIdx;
  const lastInPart = TCS_QUESTIONS[i].part !== (TCS_QUESTIONS[i+1]?.part || TCS_QUESTIONS[i].part);
  const isLast = i === TCS_QUESTIONS.length - 1;
  const flagged = TCS_STATE.flags.has(i);
  const tabs = TCS_QUESTIONS.map((q, idx) => {
    const ans = itsIsAns(q.type);
    const cls = (idx === i ? 'current' : ans ? 'answered' : '') + (TCS_STATE.flags.has(idx) ? ' flagged' : '');
    return `<button class="tcs-foot-tab ${cls}" onclick="tcsGoTo(${idx})" title="Q${q.n} · ${q.label}${q.part!==TCS_QUESTIONS[i].part?' (Part '+q.part+')':''}">${q.n}</button>`;
  }).join('');
  return `
    <div class="tcs-footer-left">
      <button class="tcs-foot-btn" onclick="tcsToggleFlag()">${flagged ? '🚩 Unflag' : '⚐ Flag'}</button>
      <button class="tcs-foot-btn" onclick="tcsGoTo(${i-1})" ${i===0?'disabled':''}>← Prev</button>
    </div>
    <div class="tcs-footer-center">${tabs}</div>
    <div class="tcs-footer-right">
      ${isLast
        ? `<button class="tcs-foot-btn primary" onclick="tcsToReview()">Review answers →</button>`
        : `<button class="tcs-foot-btn primary" onclick="tcsGoTo(${i+1})">${lastInPart ? 'Next part →' : 'Next →'}</button>`}
    </div>`;
}

// ─── Phase 5: Break (student-paced, per TCAP / i-Ready / SAT Bluebook conventions) ───
function tcsViewBreak() {
  // LEGACY — no organic flow reaches this view anymore (TCAP subparts run
  // the timer continuously per official PRD §5.5.2). Function retained for
  // safe revert + so existing direct calls don't crash. Toolbar dropdown
  // does NOT expose this phase.
  return `
    <div class="tcs-break-stage">
      <div class="tcs-break-icon">☕</div>
      <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#a16207">Stretch pause · halfway through this subpart</div>
      <div class="tcs-break-time" id="tcsBreakTime" style="font-size:38px">${tcsFmtTime(TCS_STATE.breakSec)} <span style="font-size:13px;color:#a16207;font-weight:600">elapsed</span></div>
      <div class="tcs-break-msg">Stand up, stretch, or grab some water. Resume whenever you're ready — once you continue, you cannot return to questions from the first half.</div>
      <div style="display:flex;gap:10px;align-items:center;margin-top:6px">
        <button class="tcs-foot-btn primary" style="padding:10px 22px;font-size:14px" onclick="tcsResumeAfterBreak()">I'm ready · Continue →</button>
      </div>
      <div style="display:flex;gap:8px;align-items:center;font-size:11px;color:#a16207;background:#fef3c7;padding:8px 14px;border-radius:8px;margin-top:8px">
        💡 <span>Auto-saved · first-half answers locked</span>
      </div>
    </div>`;
}

// ─── Phase 6: Paused ───
function tcsViewPaused() {
  return `
    <div class="tcs-paused-stage">
      <div class="tcs-paused-icon">❚❚</div>
      <h2>Test paused</h2>
      <p>${TCS_STATE.pausedReason}. Your progress and time are saved — please wait for the proctor to resume.</p>
      <div class="pause-tag">⏱ Timer paused at <b style="margin-left:4px">${tcsFmtTime(TCS_STATE.remainingSec)}</b></div>
      <button class="tcs-foot-btn" onclick="tcsResume()" style="margin-top:24px">▶ Resume (proctor demo)</button>
    </div>`;
}

// ─── Phase 7: Review ───
function tcsViewReview() {
  const ans = TCS_QUESTIONS.filter(q => itsIsAns(q.type)).length;
  const flagged = TCS_STATE.flags.size;
  const unans = TCS_QUESTIONS.length - ans;
  const rows = TCS_QUESTIONS.map((q, idx) => {
    const isAns = itsIsAns(q.type);
    const isF = TCS_STATE.flags.has(idx);
    return `
      <div class="tcs-review-row ${isAns?'answered':''} ${isF?'flagged':''}" onclick="tcsGoToFromReview(${idx})">
        <span class="rv-num">${isF?'🚩':isAns?'✓':q.n}</span>
        <span class="rv-q">Question ${q.n} · ${q.label}</span>
        <span class="rv-type">P${q.part} · ${q.subj}</span>
        <span class="rv-status">${isAns?'Answered':'Not answered'}</span>
        <span class="rv-go">Edit ↗</span>
      </div>`;
  }).join('');
  return `
    <div class="tcs-test-stage">
      <div class="tcs-test-card" style="max-width:760px">
        <h1 style="font-size:22px;font-weight:800;color:#0f1c33;margin:0 0 6px">Review your answers</h1>
        <p style="font-size:13px;color:#52525b;margin:0 0 8px">Click any question to edit. ${unans>0 ? `<b style="color:#dc2626">${unans} questions still need answers.</b>` : '<b style="color:#16a34a">All questions answered ✓</b>'}</p>
        <div class="tcs-review-summary">
          <div class="rv-stat ok"><div class="v">${ans}</div><div class="l">Answered</div></div>
          <div class="rv-stat ${unans>0?'warn':''}"><div class="v">${unans}</div><div class="l">Unanswered</div></div>
          <div class="rv-stat"><div class="v">${flagged}</div><div class="l">Flagged</div></div>
        </div>
        <div class="tcs-review-table">${rows}</div>
      </div>
    </div>`;
}

function tcsFooterReview() {
  return `
    <div class="tcs-footer-left">
      <button class="tcs-foot-btn" onclick="tcsSetPhase('test')">← Back to test</button>
    </div>
    <div class="tcs-footer-center"></div>
    <div class="tcs-footer-right">
      <button class="tcs-foot-btn primary" onclick="tcsAskSubmit()">Submit test ✓</button>
    </div>`;
}

function tcsFooterSimple(label, handler, ghost) {
  return `
    <div class="tcs-footer-left"></div>
    <div class="tcs-footer-center"></div>
    <div class="tcs-footer-right">
      <button class="tcs-foot-btn ${ghost?'':'primary'}" onclick="${handler}">${label}</button>
    </div>`;
}

// ─── Phase 9: Holding (delayed scoring · TCAP-specific) ───
function tcsViewHolding() {
  const ans = TCS_QUESTIONS.filter(q => itsIsAns(q.type)).length;
  return `
    <div class="tcs-holding-stage">
      <div class="tcs-hold-check">✓</div>
      <h1 style="font-size:26px;font-weight:800;color:#0f1c33;margin:0 0 6px;text-align:center">Test submitted!</h1>
      <p style="font-size:14px;color:#52525b;text-align:center;max-width:480px;margin:0 0 8px;line-height:1.6">Your answers are safely saved with the Tennessee Department of Education. Results will be released by your teacher after scoring is complete.</p>
      <div class="tcs-hold-status-card">
        <div style="font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:#0f1c33;margin-bottom:6px">Submission timeline</div>
        <div class="tcs-hold-row done">
          <span class="ic">✓</span><span><b>Submitted</b> — answered ${ans} of ${TCS_QUESTIONS.length} questions just now</span>
        </div>
        <div class="tcs-hold-row pending">
          <span class="ic">⟳</span><span><b>Auto-scoring</b> — multiple choice + numeric in progress · <span id="tcsHoldPct">0%</span></span>
        </div>
        <div class="tcs-hold-row todo">
          <span class="ic">○</span><span><b>Teacher review</b> — constructed responses & essays (1–3 school days)</span>
        </div>
        <div class="tcs-hold-row todo">
          <span class="ic">○</span><span><b>Score released</b> — your teacher will notify you when ready</span>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="tcs-foot-btn" onclick="tcsExit()">Back to Home</button>
        <button class="tcs-foot-btn primary" onclick="switchRole('student',true);nav('tcap-diag-report')">View Results</button>
      </div>
    </div>`;
}

// ─── Subject (Subpart) switching ─────────────────────────────────────────
// Reassigns TCS_QUESTIONS to the subject's pool, resets the per-question
// scratch state, and updates testName / brand / per-SP timer per the PRD
// §5.5.2 official blueprint. Caller is responsible for re-rendering
// (tcsRender / tcsDemo will pick up the new pool).
//
// minutes        = official base time per Subpart (before extended-time mult)
// subpartContext = HTML snippet describing the bigger picture for the
//                  directions page heads-up (so the student knows this is
//                  one slice of a multi-session subject, scheduled separately)
// Extended Time recompute happens in tcsSwitchSubject below.
const _TCS_SUBJECT_META = {
  'ELA Writing': {
    brand:'TCAP ELA · G8 · SP1',
    testName:'TCAP ELA · Grade 8 · Subpart 1 (Writing)',
    short:'ELA · Writing',
    minutes:85,
    gradingMode:'Human review',
    subpartContext:'TCAP ELA has <b>4 subparts</b>: Writing · Literary Reading · Informational Reading · Language. This session is <b>Subpart 1 (Writing)</b> — one essay, scored by trained human reviewers. Your other subparts are scheduled on different days.',
  },
  'ELA Reading': {
    brand:'TCAP ELA · G8 · SP2',
    testName:'TCAP ELA · Grade 8 · Subpart 2 (Literary + Informational Reading)',
    short:'ELA · Reading',
    minutes:50,
    gradingMode:'Auto-graded',
    subpartContext:'TCAP ELA has <b>4 subparts</b>: Writing · Literary Reading · Informational Reading · Language. This session covers <b>Reading</b> items (literary + informational passages). Your other subparts are scheduled on different days.',
  },
  'Math': {
    brand:'TCAP Math · G8 · SP1',
    testName:'TCAP Math · Grade 8 · Subpart 1 (Calculator-free)',
    short:'Math · Calc-free',
    minutes:60,
    calculatorMode:'Disabled',
    gradingMode:'Auto-graded',
    subpartContext:'TCAP Math has <b>3 subparts</b>: Calculator-free · Calculator-allowed (×2). This session is <b>Subpart 1 — calculator is disabled</b>. Scratch paper is provided. Your other subparts are scheduled on different days.',
  },
  'Science': {
    brand:'TCAP Sci · G8 · SP1',
    testName:'TCAP Science · Grade 8 · Subpart 1 (Life / Earth / Physical · Pt 1)',
    short:'Science · Pt 1',
    minutes:45,
    gradingMode:'Auto-graded',
    subpartContext:'TCAP Science has <b>2 subparts</b>, each 45 min, covering Life / Earth / Physical Science. This session is <b>Subpart 1</b>. Your other subpart is scheduled on a different day.',
  },
  'Social Studies': {
    brand:'TCAP SS · G8 · SP1',
    testName:'TCAP Social Studies · Grade 8 · Subpart 1 (History & Geography)',
    short:'SS · History',
    minutes:45,
    gradingMode:'Auto-graded',
    subpartContext:'TCAP Social Studies has <b>2 subparts</b>: History & Geography · Economics & Civics. This session is <b>Subpart 1 (History & Geography)</b>. Your other subpart is scheduled on a different day.',
  },
};
function tcsSwitchSubject(subject) {
  const pool = TCS_POOLS[subject];
  const meta = _TCS_SUBJECT_META[subject];
  if (!pool || !meta) { console.warn('[tcs] unknown subject key:', subject); return; }
  TCS_QUESTIONS = pool;
  TCS_STATE.subject     = subject;
  TCS_STATE.testName    = meta.testName;
  TCS_STATE.currentIdx  = 0;
  TCS_STATE.currentPart = pool[0]?.part || 1;
  TCS_STATE.flags       = new Set();
  TCS_STATE.partsVisited = new Set([TCS_STATE.currentPart]);
  // Per-SP timer (×ext-time accommodation, rounded up) — official PRD rule.
  const baseMin = meta.minutes || 35;
  TCS_STATE.partTimeMin  = Math.ceil(baseMin * (TCS_STATE.extMultiplier || 1.0));
  TCS_STATE.remainingSec = TCS_STATE.partTimeMin * 60;
  // Wipe per-type answer state so a prior subject's selections don't bleed
  // into the new pool. itsResetAll() also clears the answered/flagged sets.
  if (typeof itsResetAll === 'function') itsResetAll();
  // TestNav-authentic: scratchpad notes are subpart-scoped — wipe on
  // subject swap so a Math subpart never sees notes from the ELA subpart
  // that came before it. Also force-close the panel so the textarea
  // doesn't keep showing stale text (the open re-render reads notesText).
  TCS_STATE.notesText   = '';
  TCS_STATE.notepadOpen = false;
  if (typeof tcsCloseNotepad === 'function')   tcsCloseNotepad();
  if (typeof tcsRefreshNotesBadge === 'function') tcsRefreshNotesBadge();
  // Same for the sources viewer — different subjects have different sources.
  if (typeof tcsCloseSources === 'function') tcsCloseSources();
  window._tcsActiveSources = null;
}

// ─── Dev / demo helpers (jump straight to a phase for screenshots) ───
function tcsDemo(phase, opts) {
  TCS_STATE.studentId = '12345';
  TCS_STATE.joinCode  = 'TN-2026';
  TCS_STATE.ready = {audio:true, network:true, screen:true};
  TCS_STATE.checkStatus = {audio:'pass', network:'pass', screen:'pass'};
  if (phase === 'ready') {
    TCS_STATE.ready = {audio:false, network:false, screen:false};
    TCS_STATE.checkStatus = {audio:'idle', network:'idle', screen:'idle'};
    TCS_STATE.checkDetail = {audio:'', network:'', screen:''};
  }
  if (phase === 'test')   { TCS_STATE.currentIdx = (opts && opts.idx) || 0; TCS_STATE.currentPart = TCS_QUESTIONS[TCS_STATE.currentIdx].part; TCS_STATE.remainingSec = TCS_STATE.partTimeMin * 60; }
  if (phase === 'break')  { TCS_STATE.breakSec = 0; }
  // Paused demo: pretend the student is mid-SP with ~60% of their timer left.
  if (phase === 'paused') { TCS_STATE.currentIdx = Math.min(2, TCS_QUESTIONS.length - 1); TCS_STATE.remainingSec = Math.round(TCS_STATE.partTimeMin * 60 * 0.6); TCS_STATE.paused = true; }
  if (phase === 'review' || phase === 'holding') {
    // Pre-answer some questions for demo
    itsAns('mc').sel = 0;
    itsAns('cr').text = 'Mitochondria produce ATP through cellular respiration, providing energy for cell processes.';
    itsAns('hottext').sel = [1];
    itsAns('inline').choices = ['barked','ran',null];
    itsAns('matrix').rows = [0,1,2,null];
  }
  switchRole('student', true);
  nav('tcap-stu');
  TCS_STATE.phase = phase;
  tcsRender();
  if (phase === 'test')    tcsStartTimer();
  if (phase === 'break')   tcsStartBreakTimer();
  if (phase === 'holding') tcsStartHoldingProgress();
}

function getReportState(testType) {
  const baseId = currentReportSessionId || currentLaunchSessionId || currentSessionId;
  const session = getSession(baseId);
  if (session && session.testType === testType) return session;
  return SESSION_DATA.find(s => s.testType === testType) || session;
}
function loadSessionDetail(sessionId, tab, opts) {
  currentSessionId = sessionId;
  sessionDetailTab = (tab === 'analytics' || tab === 'cut-scores') ? tab : 'overview';
  // Optional Subpart context (TCAP only): land on this SP tab in Monitor/Analytics.
  // For non-TCAP sessions, opts.subpart is silently ignored.
  if (opts && opts.subpart) {
    setActiveSubpart(opts.subpart);
  } else {
    const session = SESSION_DATA.find(x => x.id === sessionId);
    if (session && session.testType === 'tcap' && Array.isArray(session.subparts) && session.subparts.length) {
      // Default: first SP not yet released, fallback to SP1
      const next = session.subparts.find(sp => sp.status !== 'Released') || session.subparts[0];
      setActiveSubpart(next.code);
    }
  }
  // Swap the active TCAP_CLASS pointer so Analytics / heatmap / risk panel
  // describe THIS session's grade + subject, not the default G5 ELA roster.
  if (typeof setTcapClassForSession === 'function') {
    setTcapClassForSession(sessionId);
  }
  nav('session-detail');
}
function setSessionDetailTab(tab) {
  sessionDetailTab = tab;
  renderSessionDetail();
}
function setActMonitorQuestionSection(sectionKey) {
  actMonitorQuestionSection = sectionKey;
  renderSessionDetail();
}
function setActMonitorQuestionKind(kind) {
  actMonitorQuestionKind = kind;
  if (kind === 'rubric' && actMonitorQuestionSection !== 'all' && actMonitorQuestionSection !== 'writing') {
    actMonitorQuestionSection = 'writing';
  }
  if (kind === 'selected' && actMonitorQuestionSection === 'writing') {
    actMonitorQuestionSection = 'all';
  }
  renderSessionDetail();
}
function sessionAnalyticsModel(session) {
  if (session.testType === 'tcap') {
    const rows = tcapPredictAll();
    const counts = tcapLevelCounts(rows);
    const razorRows = rows
      .filter(r => r.pred.level.id === 'approaching' && r.pred.gapToNext && r.pred.gapToNext.scalePointsToNext <= 8)
      .slice(0, 3);
    return {
      title:`${tcapSubjectLabel(TCAP_CLASS.subject)} · Grade ${TCAP_CLASS.grade} Analytics`,
      subtitle:'Scale-score projection · performance levels · standards-based practice routing',
      summary:[
        ['Completed', `${session.submitted}/${session.students}`],
        ['On Track or above', `${counts.proficient + counts.aboveProficient}`],
        ['Near Target (Razor\u2019s Edge)', `${razorRows.length}`],
        ['Practice source', 'Mock item bank + source mix']
      ],
      distribution:[
        ['Below',       counts.belowBasic,      '#fef2f2'],
        ['Approaching', counts.approaching,     '#fffbeb'],
        ['On Track',    counts.proficient,      '#eff6ff'],
        ['Mastered',    counts.aboveProficient, '#ecfdf5']
      ],
      razor: razorRows.map(r => ({
        name:r.name,
        score:`${r.pred.scaleScore} · ${r.pred.level.label}`,
        gap:`${r.pred.gapToNext.scalePointsToNext} pts to On Track`,
        skill:tcapWeakestStandards(r, 1)[0]?.name || 'Evidence-based reading',
        practice:`${r.pred.gapToNext.itemsToNext} items`
      })),
      note:'Projected, pending next diagnostic'
    };
  }
  if (session.testType === 'act') {
    return {
      title:'ACT Teacher Analytics',
      subtitle:'Section benchmark interpretation · near-benchmark students · report review',
      summary:[
        ['Completed', `${session.submitted}/${session.students}`],
        ['Met benchmark', '9'],
        ['Razor’s Edge', '5'],
        ['Reports ready', `${session.released || 0}`]
      ],
      distribution:[
        ['Below', 8, '#fef2f2'],
        ['Near', 5, '#fffbeb'],
        ['Met', 9, '#eff6ff'],
        ['Exceeding', 6, '#ecfdf5']
      ],
      razor:[
        { name:'Noah Patel', score:'Reading 21', gap:'1 pt to benchmark', skill:'Main idea + evidence' },
        { name:'Mia Collins', score:'Math 20', gap:'2 pts to benchmark', skill:'Algebraic modeling' },
        { name:'Avery Parker', score:'English 16', gap:'2 pts to benchmark', skill:'Conventions of standard English' }
      ],
      note:'Projected, pending next diagnostic'
    };
  }
  return {
    title:'Teacher Analytics',
    subtitle:'Generic assessment analytics by skill, standard, and rubric performance',
    summary:[
      ['Completed', `${session.submitted}/${session.students}`],
      ['Class average', '84%'],
      ['Needs review', `${session.pendingRelease}`],
      ['Report basis', 'Current assessment skills']
    ],
    distribution:[
      ['Below 70%', 2, '#fef2f2'],
      ['70-79%', 3, '#fffbeb'],
      ['80-89%', 5, '#eff6ff'],
      ['90%+', 2, '#ecfdf5']
    ],
    razor:[
      { name:'Emma Wilson', score:'84%', gap:'1 standard below target', skill:'Evidence from text', practice:'6 items' }
    ],
    note:'Generic assessment: no standardized blueprint attached'
  };
}
function openPracticeRecommendation(studentName, testType) {
  const label = testType === 'tcap' ? 'TCAP' : testType === 'act' ? 'ACT' : 'generic';
  alert(`Practice plan ready for ${studentName}.\nSource mix: mock item bank + Kira tagged items + AI-reviewed practice candidates.\n${label.toUpperCase()} MVP note: content source is demonstrative until the real item pool is connected.`);
}
function openRemoveStudentModal(studentName) {
  pendingRemoveStudentName = studentName;
  const session = getSession(currentSessionId);
  document.getElementById('removeStudentName').textContent = studentName;
  document.getElementById('removeStudentSubtitle').textContent = `${session.title} · ${session.className}`;
  document.getElementById('removeStudentModalOverlay').classList.add('open');
}
function closeRemoveStudentModal() {
  pendingRemoveStudentName = null;
  document.getElementById('removeStudentModalOverlay').classList.remove('open');
}
function confirmRemoveStudent() {
  if (!pendingRemoveStudentName) return closeRemoveStudentModal();
  const session = getSession(currentSessionId);
  const before = session.studentRows?.length || 0;
  session.studentRows = (session.studentRows || []).filter(stu => stu.name !== pendingRemoveStudentName);
  if ((session.studentRows?.length || 0) < before) {
    session.students = Math.max(0, (session.students || before) - 1);
  }
  closeRemoveStudentModal();
  renderSessionDetail();
}
function renderSessionAnalytics(session) {
  const model = sessionAnalyticsModel(session);
  const total = model.distribution.reduce((sum, d) => sum + d[1], 0) || 1;
  if (session.testType === 'act') {
    return renderActAnalytics(session, model, total);
  }
  if (session.testType === 'tcap') {
    return `
      <div class="session-card" style="margin-bottom:16px;padding:18px;background:#fff;border-radius:16px">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px;flex-wrap:wrap">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
              <span style="font-size:10px;font-weight:900;letter-spacing:.35px;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;padding:4px 9px;border-radius:999px;text-transform:uppercase">TCAP · Tennessee</span>
              <span style="font-size:10px;font-weight:900;letter-spacing:.35px;color:#2563eb;background:#eff6ff;border:1px solid #bfdbfe;padding:4px 9px;border-radius:999px;text-transform:uppercase">Shared Analytics</span>
            </div>
            <h3 style="margin:0;font-size:18px;font-weight:900;color:#18181b">${model.title}</h3>
            <p style="font-size:12px;color:#71717a;margin:4px 0 0;line-height:1.5">${tcapSubjectLabel(TCAP_CLASS.subject)} · Grade ${TCAP_CLASS.grade} · ${TCAP_CLASS.className} · ${session.submitted}/${session.students} completed · Scale-score projection</p>
          </div>
          <!-- Cut-score editor entry intentionally lives in the page-level tab
               strip (Overview / Analytics / Cut Scores · District) instead of
               here. Keeping it next to the title invited two competing CTAs to
               the same destination; the tab also disables the SP strip on
               switch, which is the correct visual signal that cut scores are
               composite-scope, not per-Subpart. -->
        </div>
        <!-- Mandatory PRD §12 disclosure: every projection-only surface must
             carry this exact wording so teachers don't read predictions as
             guaranteed official-score outcomes. -->
        <div style="display:flex;align-items:center;gap:10px;padding:9px 14px;margin-bottom:14px;background:linear-gradient(90deg,#fffbeb,#fef3c7);border:1px solid #fde68a;border-left:3px solid #f59e0b;border-radius:8px">
          <span style="font-size:14px">📊</span>
          <div style="flex:1">
            <div style="font-size:11.5px;font-weight:800;color:#92400e">Projected, pending next diagnostic</div>
            <div style="font-size:11px;color:#a16207;margin-top:1px">All scores, levels, and gaps below are projections from this diagnostic only — not guaranteed TCAP outcomes. Re-measurement updates after the next checkpoint.</div>
          </div>
        </div>
        <div id="sessionAnalyticsTcapPredictionsBody"></div>
      </div>
    `;
  }
  return `
    <div class="session-card" style="margin-bottom:16px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px">
        <div>
          <h3 style="margin-bottom:4px">${model.title}</h3>
          <p style="font-size:12px;color:#71717a;margin:0;line-height:1.5">${model.subtitle}</p>
        </div>
        <span style="font-size:10px;font-weight:800;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;padding:4px 9px;border-radius:999px;text-transform:uppercase">Shared Analytics</span>
      </div>
      <div class="session-meta-list" style="margin-bottom:14px">
        ${model.summary.map(([k,v]) => `<div class="session-meta-item"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1.3fr;gap:14px;align-items:start">
        <div style="border:1px solid #eef0f4;border-radius:12px;padding:14px;background:#fafafa">
          <div style="font-size:12px;font-weight:800;color:#18181b;margin-bottom:10px">Performance Distribution</div>
          <div style="display:flex;height:42px;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;margin-bottom:10px">
            ${model.distribution.map(([label,count,color]) => `<div title="${label}: ${count}" style="width:${Math.max(6, Math.round(count / total * 100))}%;background:${color};border-right:1px solid #fff"></div>`).join('')}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">${model.distribution.map(([label,count,color]) => `<span style="font-size:10px;color:#52525b;background:${color};border:1px solid #e4e4e7;padding:3px 7px;border-radius:999px;font-weight:700">${label}: ${count}</span>`).join('')}</div>
        </div>
        <div style="border:1px solid #eef0f4;border-radius:12px;padding:14px;background:#fff">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="font-size:12px;font-weight:800;color:#18181b">Razor’s Edge / Near Target</div>
            <span style="font-size:10px;color:#71717a">${model.note}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${model.razor.map(r => `<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;border:1px solid #f1f3f7;border-radius:10px;padding:10px;background:#f8f9fb">
              <div>
                <div style="font-size:13px;font-weight:800;color:#18181b">${r.name} <span style="font-size:11px;font-weight:700;color:#6040ca">${r.score}</span></div>
                <div style="font-size:11px;color:#52525b;margin-top:2px">${r.gap} · ${r.skill} · ${r.practice}</div>
              </div>
              <button onclick="iteToast('Open student report — ${r.name.replace(/'/g, "\\'")}','info')" style="background:#6040ca;color:#fff;border:none;border-radius:8px;padding:7px 10px;font-size:11px;font-weight:800;cursor:pointer">View Report</button>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}
