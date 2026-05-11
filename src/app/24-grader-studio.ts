// @ts-nocheck
// Phase-2 slice: lines 22352-22956 of original src/app.ts

// ═══════ GRADER STUDIO ═══════
const GRADER_DATA = {
  testName: 'Midterm Assessment',
  testType: 'generic',
  className: 'Period 3 — English 10',
  sections: [
    { id:'all', name:'All Questions' },
    { id:'sec-grammar', name:'Grammar' },
    { id:'sec-vocab', name:'Vocabulary' },
    { id:'sec-comprehension', name:'Comprehension' },
    { id:'sec-literature', name:'Literature' },
  ],
  students: [
    { id:1, name:'Bob Kim', status:'needs_grade', score:null, submitted:'Today 8:31 AM' },
    { id:2, name:'David Park', status:'needs_grade', score:null, submitted:'Today 8:28 AM' },
    { id:3, name:'Frank Zhang', status:'needs_grade', score:null, submitted:'Today 8:35 AM' },
    { id:4, name:'Henry Park', status:'needs_grade', score:null, submitted:'Today 8:22 AM' },
    { id:5, name:'Carol Davis', status:'needs_grade', score:null, submitted:'Today 8:40 AM' },
    { id:6, name:'Emma Wilson', status:'ai_review', score:null, submitted:'Today 8:19 AM' },
    { id:7, name:'Grace Lee', status:'ai_review', score:null, submitted:'Today 8:25 AM' },
    { id:8, name:'Alice Chen', status:'ai_review', score:null, submitted:'Today 8:30 AM' },
    { id:9, name:'Iris Johnson', status:'graded', score:71, submitted:'Today 8:15 AM' },
    { id:10, name:'Jake Williams', status:'released', score:71, submitted:'Today 8:12 AM' },
    { id:11, name:'Kate Brown', status:'released', score:69, submitted:'Today 8:08 AM' },
    { id:12, name:'Liam Martinez', status:'released', score:71, submitted:'Today 8:05 AM' },
  ],
  questions: [
    { id:1, sec:'sec-grammar', type:'MC', text:'What literary device uses exaggeration for emphasis?', domain:'Grammar', diff:'Easy', standard:'CCSS.ELA.RL.9-10.4', pts:1, correct:'B) Hyperbole',
      answers:{ 1:{val:'B) Hyperbole',correct:true,pts:1}, 2:{val:'A) Metaphor',correct:false,pts:0}, 3:{val:'B) Hyperbole',correct:true,pts:1}, 4:{val:'C) Simile',correct:false,pts:0}, 5:{val:'B) Hyperbole',correct:true,pts:1}, 6:{val:'B) Hyperbole',correct:true,pts:1}, 7:{val:'A) Metaphor',correct:false,pts:0}, 8:{val:'B) Hyperbole',correct:true,pts:1}, 9:{val:'B) Hyperbole',correct:true,pts:1}, 10:{val:'B) Hyperbole',correct:true,pts:1}, 11:{val:'C) Simile',correct:false,pts:0}, 12:{val:'B) Hyperbole',correct:true,pts:1} }
    },
    { id:2, sec:'sec-grammar', type:'MC', text:'Identify the correct use of "who" vs. "whom" in the sentence.', domain:'Grammar', diff:'Medium', standard:'CCSS.ELA.L.9-10.1', pts:1, correct:'A) Who',
      answers:{ 1:{val:'A) Who',correct:true,pts:1}, 2:{val:'A) Who',correct:true,pts:1}, 3:{val:'B) Whom',correct:false,pts:0}, 4:{val:'A) Who',correct:true,pts:1}, 5:{val:'B) Whom',correct:false,pts:0}, 6:{val:'A) Who',correct:true,pts:1}, 7:{val:'A) Who',correct:true,pts:1}, 8:{val:'B) Whom',correct:false,pts:0}, 9:{val:'A) Who',correct:true,pts:1}, 10:{val:'A) Who',correct:true,pts:1}, 11:{val:'A) Who',correct:true,pts:1}, 12:{val:'B) Whom',correct:false,pts:0} }
    },
    { id:3, sec:'sec-grammar', type:'MC', text:'Which sentence demonstrates correct use of a semicolon?', domain:'Grammar', diff:'Medium', standard:'CCSS.ELA.L.9-10.2', pts:1, correct:'B) I like cats; however, I prefer dogs.',
      answers:{ 1:{val:'B) I like cats; however, I prefer dogs.',correct:true,pts:1}, 2:{val:'A) I like cats, however I prefer dogs.',correct:false,pts:0}, 3:{val:'B) I like cats; however, I prefer dogs.',correct:true,pts:1}, 4:{val:'B) I like cats; however, I prefer dogs.',correct:true,pts:1}, 5:{val:'C) I like cats however; I prefer dogs.',correct:false,pts:0}, 6:{val:'B) I like cats; however, I prefer dogs.',correct:true,pts:1}, 7:{val:'B) I like cats; however, I prefer dogs.',correct:true,pts:1}, 8:{val:'B) I like cats; however, I prefer dogs.',correct:true,pts:1}, 9:{val:'A) I like cats, however I prefer dogs.',correct:false,pts:0}, 10:{val:'B) I like cats; however, I prefer dogs.',correct:true,pts:1}, 11:{val:'B) I like cats; however, I prefer dogs.',correct:true,pts:1}, 12:{val:'B) I like cats; however, I prefer dogs.',correct:true,pts:1} }
    },
    { id:4, sec:'sec-vocab', type:'SA', text:'Explain the difference between "affect" and "effect."', domain:'Vocabulary', diff:'Medium', standard:'CCSS.ELA.W.9-10.2', pts:2, correct:'Affect is a verb meaning to influence; effect is a noun meaning result.',
      answers:{ 1:{val:'Affect is a verb, effect is a noun. Affect means to influence something, effect is the result.',correct:true,pts:2}, 2:{val:'They mean the same thing.',correct:false,pts:0}, 3:{val:'Affect changes something, effect is what happens.',correct:true,pts:1,partial:true}, 4:{val:'Affect is feeling, effect is result.',correct:true,pts:1,partial:true}, 5:{val:'Affect = verb (to influence), Effect = noun (the result or outcome).',correct:true,pts:2}, 6:{val:'Affect is a verb meaning to influence; effect is a noun meaning result.',correct:true,pts:2}, 7:{val:'Both are verbs.',correct:false,pts:0}, 8:{val:'Affect means to have an impact, effect is the consequence.',correct:true,pts:2}, 9:{val:'Affect changes, effect results.',correct:true,pts:1,partial:true}, 10:{val:'Affect is influence, effect is outcome.',correct:true,pts:2}, 11:{val:'Same meaning different spelling.',correct:false,pts:0}, 12:{val:'Affect = verb, effect = noun.',correct:true,pts:2} }
    },
    { id:5, sec:'sec-vocab', type:'MC', text:'What does the word "ubiquitous" mean?', domain:'Vocabulary', diff:'Hard', standard:'CCSS.ELA.RL.9-10.4', pts:1, correct:'A) Present everywhere',
      answers:{ 1:{val:'A) Present everywhere',correct:true,pts:1}, 2:{val:'C) Rare',correct:false,pts:0}, 3:{val:'A) Present everywhere',correct:true,pts:1}, 4:{val:'A) Present everywhere',correct:true,pts:1}, 5:{val:'B) Unique',correct:false,pts:0}, 6:{val:'A) Present everywhere',correct:true,pts:1}, 7:{val:'A) Present everywhere',correct:true,pts:1}, 8:{val:'C) Rare',correct:false,pts:0}, 9:{val:'A) Present everywhere',correct:true,pts:1}, 10:{val:'A) Present everywhere',correct:true,pts:1}, 11:{val:'A) Present everywhere',correct:true,pts:1}, 12:{val:'B) Unique',correct:false,pts:0} }
    },
    { id:6, sec:'sec-comprehension', type:'MC', text:'What is the primary function of the thesis statement in an essay?', domain:'Comprehension', diff:'Easy', standard:'CCSS.ELA.RI.9-10.2', pts:1, correct:'B) To state the main argument',
      answers:{ 1:{val:'B) To state the main argument',correct:true,pts:1}, 2:{val:'B) To state the main argument',correct:true,pts:1}, 3:{val:'A) To introduce the topic',correct:false,pts:0}, 4:{val:'B) To state the main argument',correct:true,pts:1}, 5:{val:'B) To state the main argument',correct:true,pts:1}, 6:{val:'C) To conclude the essay',correct:false,pts:0}, 7:{val:'B) To state the main argument',correct:true,pts:1}, 8:{val:'B) To state the main argument',correct:true,pts:1}, 9:{val:'B) To state the main argument',correct:true,pts:1}, 10:{val:'A) To introduce the topic',correct:false,pts:0}, 11:{val:'B) To state the main argument',correct:true,pts:1}, 12:{val:'B) To state the main argument',correct:true,pts:1} }
    },
    { id:7, sec:'sec-comprehension', type:'MC', text:'What is the climax of a narrative?', domain:'Comprehension', diff:'Easy', standard:'CCSS.ELA.RL.9-10.3', pts:1, correct:'C) The turning point of the story',
      answers:{ 1:{val:'C) The turning point of the story',correct:true,pts:1}, 2:{val:'C) The turning point of the story',correct:true,pts:1}, 3:{val:'C) The turning point of the story',correct:true,pts:1}, 4:{val:'A) The beginning',correct:false,pts:0}, 5:{val:'C) The turning point of the story',correct:true,pts:1}, 6:{val:'C) The turning point of the story',correct:true,pts:1}, 7:{val:'B) The resolution',correct:false,pts:0}, 8:{val:'C) The turning point of the story',correct:true,pts:1}, 9:{val:'C) The turning point of the story',correct:true,pts:1}, 10:{val:'C) The turning point of the story',correct:true,pts:1}, 11:{val:'A) The beginning',correct:false,pts:0}, 12:{val:'C) The turning point of the story',correct:true,pts:1} }
    },
    { id:8, sec:'sec-comprehension', type:'SA', text:'What does "Ethos" refer to in rhetorical analysis?', domain:'Comprehension', diff:'Medium', standard:'CCSS.ELA.RI.9-10.6', pts:1, correct:'Ethos refers to the credibility or ethical appeal of the speaker/writer.',
      answers:{ 1:{val:'Ethos refers to the credibility or ethical appeal of the speaker/writer.',correct:true,pts:1}, 2:{val:'Emotions',correct:false,pts:0}, 3:{val:'Credibility of the speaker.',correct:true,pts:1}, 4:{val:'Logic and reasoning.',correct:false,pts:0}, 5:{val:'Trust and authority of the writer.',correct:true,pts:1}, 6:{val:'Ethics in writing.',correct:true,pts:1}, 7:{val:'Pathos.',correct:false,pts:0}, 8:{val:'The speaker\'s credibility and trustworthiness.',correct:true,pts:1}, 9:{val:'Ethical appeal.',correct:true,pts:1}, 10:{val:'Writer credibility.',correct:true,pts:1}, 11:{val:'Persuasion technique.',correct:true,pts:1}, 12:{val:'It means emotional appeal.',correct:false,pts:0} }
    },
    { id:9, sec:'sec-literature', type:'MC', text:'Which of the following is an example of a metaphor?', domain:'Literature', diff:'Easy', standard:'CCSS.ELA.RL.9-10.4', pts:1, correct:'B) "Time is money"',
      answers:{ 1:{val:'B) "Time is money"',correct:true,pts:1}, 2:{val:'B) "Time is money"',correct:true,pts:1}, 3:{val:'A) "He ran like the wind"',correct:false,pts:0}, 4:{val:'B) "Time is money"',correct:true,pts:1}, 5:{val:'B) "Time is money"',correct:true,pts:1}, 6:{val:'B) "Time is money"',correct:true,pts:1}, 7:{val:'C) "The stars twinkled"',correct:false,pts:0}, 8:{val:'B) "Time is money"',correct:true,pts:1}, 9:{val:'B) "Time is money"',correct:true,pts:1}, 10:{val:'A) "He ran like the wind"',correct:false,pts:0}, 11:{val:'B) "Time is money"',correct:true,pts:1}, 12:{val:'B) "Time is money"',correct:true,pts:1} }
    },
    { id:10, sec:'sec-literature', type:'MC', text:'Which of the following is NOT a type of conflict in literature?', domain:'Literature', diff:'Medium', standard:'CCSS.ELA.RL.9-10.3', pts:1, correct:'D) Character vs. Grammar',
      answers:{ 1:{val:'D) Character vs. Grammar',correct:true,pts:1}, 2:{val:'D) Character vs. Grammar',correct:true,pts:1}, 3:{val:'D) Character vs. Grammar',correct:true,pts:1}, 4:{val:'C) Character vs. Nature',correct:false,pts:0}, 5:{val:'D) Character vs. Grammar',correct:true,pts:1}, 6:{val:'D) Character vs. Grammar',correct:true,pts:1}, 7:{val:'D) Character vs. Grammar',correct:true,pts:1}, 8:{val:'A) Character vs. Self',correct:false,pts:0}, 9:{val:'D) Character vs. Grammar',correct:true,pts:1}, 10:{val:'D) Character vs. Grammar',correct:true,pts:1}, 11:{val:'D) Character vs. Grammar',correct:true,pts:1}, 12:{val:'D) Character vs. Grammar',correct:true,pts:1} }
    },
  ]
};

let graderCurrentStu = 1;
let graderCurrentSec = 'all';
let graderCurrentFilter = 'all';
let graderGrades = {};
let graderTestType = 'generic';
let graderPageSize = 20;
let graderVisibleCount = 20;

// ─── ACT Grader Data ───
function _seedAnswer(qid, sid, correctChoice, pctCorrect) {
  const hash = ((qid * 7919 + sid * 104729) % 100);
  const correct = hash < pctCorrect;
  const wrongIdx = (qid + sid) % 3;
  const wrongs = ['A','B','C','D'].filter(c => c !== correctChoice);
  return { val: correct ? correctChoice : wrongs[wrongIdx], correct, pts: correct ? 1 : 0 };
}

const GRADER_ACT_DATA = {
  testName:'ACT Practice Exam #3', testType:'act', className:'Period 2 — College Prep',
  sections:[
    {id:'all',name:'All Questions'},
    {id:'act-eng',name:'English'},{id:'act-math',name:'Mathematics'},
    {id:'act-reading',name:'Reading'},{id:'act-science',name:'Science'},{id:'act-writing',name:'Writing'},
  ],
  students:[
    {id:1,name:'Ann Taylor',status:'graded',score:null,submitted:'Today 9:15 AM'},
    {id:2,name:'Bob Kim',status:'graded',score:null,submitted:'Today 9:12 AM'},
    {id:3,name:'Carol Davis',status:'graded',score:null,submitted:'Today 9:20 AM'},
    {id:4,name:'David Park',status:'graded',score:null,submitted:'Today 9:08 AM'},
    {id:5,name:'Emma Wilson',status:'released',score:null,submitted:'Today 9:05 AM'},
    {id:6,name:'Frank Zhang',status:'released',score:null,submitted:'Today 9:02 AM'},
  ],
  questions:(()=>{
    let qs=[], id=0;
    const actCategories = {
      'act-eng': ['POW','KLA','CSE'],
      'act-math': ['PHM','IES','MDL','N','F','G','S'],
      'act-reading': ['KID','CS','IKI'],
      'act-science': ['IOD','EMI','SIN'],
    };
    const secs=[
      {sec:'act-eng',count:75,domain:'English'},
      {sec:'act-math',count:60,domain:'Mathematics'},
      {sec:'act-reading',count:36,domain:'Reading'},
      {sec:'act-science',count:40,domain:'Science'},
    ];
    secs.forEach(s=>{
      const cats = actCategories[s.sec] || ['GEN'];
      for(let i=0;i<s.count;i++){
        id++;
        const correctChoice = ['A','B','C','D'][i%4];
        const cat = cats[i % cats.length];
        const q={id,sec:s.sec,type:'MC',text:`${s.domain} — Q${i+1}`,domain:cat,diff:['Easy','Medium','Hard'][i%3],standard:'ACT.'+s.domain.substring(0,3).toUpperCase()+'.'+cat,pts:1,correct:correctChoice,answers:{}};
        [1,2,3,4,5,6].forEach(sid=>{
          q.answers[sid] = _seedAnswer(id, sid, correctChoice, sid<=3?72:58);
        });
        qs.push(q);
      }
    });
    const writingQ = {id:++id,sec:'act-writing',type:'ACT_WRITING',text:'ACT Writing — Evaluate the perspectives and write a cohesive argumentative essay using evidence and reasoning.',domain:'Writing',diff:'ACT Writing',standard:'ACT.WRT.ARG',pts:12,correct:'ACT Writing rubric: Ideas and Analysis, Development and Support, Organization, Language Use and Conventions.',answers:{}};
    const writingSamples = {
      1:{val:'Student builds a clear claim, references two perspectives, and develops a mostly coherent essay.',correct:false,pts:9},
      2:{val:'Student states a position but support is uneven and analysis is limited.',correct:false,pts:7},
      3:{val:'Student compares all three perspectives and sustains a well-organized line of reasoning.',correct:true,pts:10},
      4:{val:'Student response is brief and only partially addresses the prompt.',correct:false,pts:5},
      5:{val:'Student essay is polished and well-supported with strong transitions.',correct:true,pts:11},
      6:{val:'Student essay is formulaic but addresses the task with adequate support.',correct:false,pts:8}
    };
    [1,2,3,4,5,6].forEach(sid=>{ writingQ.answers[sid] = writingSamples[sid]; });
    qs.push(writingQ);
    return qs;
  })()
};

// ─── SAT Grader Data ───
const GRADER_SAT_DATA = {
  testName:'SAT Practice Test — March',testType:'sat',className:'SAT Prep — Block A',
  sections:[
    {id:'all',name:'All Questions'},
    {id:'sat-rw1',name:'R&W Module 1'},{id:'sat-rw2',name:'R&W Module 2'},
    {id:'sat-math1',name:'Math Module 1'},{id:'sat-math2',name:'Math Module 2'},
  ],
  students:[
    {id:1,name:'Grace Lee',status:'graded',score:null,submitted:'Today 10:45 AM'},
    {id:2,name:'Henry Park',status:'graded',score:null,submitted:'Today 10:40 AM'},
    {id:3,name:'Iris Johnson',status:'graded',score:null,submitted:'Today 10:50 AM'},
    {id:4,name:'Jake Williams',status:'graded',score:null,submitted:'Today 10:38 AM'},
    {id:5,name:'Kate Brown',status:'released',score:null,submitted:'Today 10:35 AM'},
    {id:6,name:'Liam Martinez',status:'released',score:null,submitted:'Today 10:32 AM'},
  ],
  questions:(()=>{
    let qs=[], id=0;
    const secs=[
      {sec:'sat-rw1',count:27,domain:'R&W Mod 1'},
      {sec:'sat-rw2',count:27,domain:'R&W Mod 2'},
      {sec:'sat-math1',count:22,domain:'Math Mod 1'},
      {sec:'sat-math2',count:22,domain:'Math Mod 2'},
    ];
    secs.forEach(s=>{
      for(let i=0;i<s.count;i++){
        id++;
        const correctChoice = ['A','B','C','D'][i%4];
        const q={id,sec:s.sec,type:'MC',text:`${s.domain} — Q${i+1}`,domain:s.domain,diff:['Easy','Medium','Hard'][i%3],standard:'SAT.'+s.sec.toUpperCase(),pts:1,correct:correctChoice,answers:{}};
        [1,2,3,4,5,6].forEach(sid=>{
          q.answers[sid] = _seedAnswer(id, sid, correctChoice, sid<=3?68:52);
        });
        qs.push(q);
      }
    });
    return qs;
  })()
};

function cloneData(obj) {
  return JSON.parse(JSON.stringify(obj));
}
const GRADER_GENERIC_TEMPLATE = cloneData(GRADER_DATA);
const SESSION_GRADER_CACHE = {};
function getSessionGraderData(sessionId, type) {
  if (!SESSION_GRADER_CACHE[sessionId]) {
    const source = type === 'act' ? GRADER_ACT_DATA : type === 'sat' ? GRADER_SAT_DATA : GRADER_GENERIC_TEMPLATE;
    SESSION_GRADER_CACHE[sessionId] = cloneData(source);
  }
  return SESSION_GRADER_CACHE[sessionId];
}

function loadGrader(sessionOrType) {
  const directSession = SESSION_DATA.find(s => s.id === sessionOrType);
  const session = directSession
    || SESSION_DATA.find(s => s.id === currentSessionId && (!sessionOrType || s.testType === sessionOrType))
    || SESSION_DATA.find(s => s.testType === (sessionOrType || 'generic'))
    || SESSION_DATA[0];
  graderTestType = session.testType || 'generic';
  currentSessionId = session.id;
  const data = getSessionGraderData(session.id, graderTestType);
  GRADER_DATA.testName = session.title;
  GRADER_DATA.testType = graderTestType;
  GRADER_DATA.className = session.className;
  GRADER_DATA.sections = data.sections;
  GRADER_DATA.students = data.students;
  GRADER_DATA.questions = data.questions;
  nav('grader');
}

function graderCalcStudentScaled(sid) {
  const gs = graderGrades[sid];
  if (!gs) return null;
  const tt = GRADER_DATA.testType;
  if (tt === 'act') {
    const secTotals = {};
    GRADER_DATA.questions.forEach(q => {
      const s = q.sec;
      if (!secTotals[s]) secTotals[s] = {correct:0,total:0};
      if (s !== 'act-writing') {
        secTotals[s].total++;
        if (gs[q.id]?.correct) secTotals[s].correct++;
      }
    });
    const secMap={'act-eng':'english','act-math':'math','act-reading':'reading','act-science':'science'};
    const scaled = Object.entries(secTotals).filter(([id,s]) => secMap[id] && s.total > 0).map(([id,s])=>{
      const key=secMap[id]||id;
      return ACT_SCALE[key] ? _scaleLookup(ACT_SCALE[key],s.correct) : Math.round(s.correct/s.total*36);
    });
    return scaled.length ? Math.round(scaled.reduce((a,b)=>a+b,0)/scaled.length) : 0;
  } else if (tt === 'sat') {
    let rwC=0,rwT=0,mC=0,mT=0;
    GRADER_DATA.questions.forEach(q=>{
      if(q.sec.includes('rw')){rwT++;if(gs[q.id]?.correct)rwC++;}
      else if(q.sec.includes('math')){mT++;if(gs[q.id]?.correct)mC++;}
    });
    return _scaleLookup(SAT_RW_SCALE,rwC)+_scaleLookup(SAT_MATH_SCALE,mC);
  }
  return null;
}

function renderGrader() {
  graderCurrentStu = GRADER_DATA.students[0]?.id || 1;
  const tt = GRADER_DATA.testType;
  graderCurrentSec = (tt === 'act' || tt === 'sat') && GRADER_DATA.sections.length > 1 ? GRADER_DATA.sections[1].id : 'all';
  graderCurrentFilter = 'all';
  graderVisibleCount = graderPageSize;
  graderGrades = {};
  GRADER_DATA.students.forEach(s => {
    graderGrades[s.id] = {};
    GRADER_DATA.questions.forEach(q => {
      const a = q.answers[s.id];
      if (a) graderGrades[s.id][q.id] = { pts: a.pts, maxPts: q.pts, correct: a.correct, flagged: false };
    });
  });

  const badge = tt === 'act' ? 'ACT' : tt === 'sat' ? 'SAT' : 'Assessment';
  const badgeCls = tt === 'act' ? 'badge-purple' : tt === 'sat' ? 'badge-blue' : '';
  document.getElementById('graderTitle').textContent = GRADER_DATA.testName;
  document.getElementById('graderClass').textContent = GRADER_DATA.className;
  const badgeEl = document.querySelector('.gt-badge');
  if (badgeEl) { badgeEl.textContent = badge; badgeEl.className = 'gt-badge'; if (badgeCls) badgeEl.classList.add(badgeCls); }

  // Pre-calculate scaled scores for ACT/SAT students
  if (tt === 'act' || tt === 'sat') {
    GRADER_DATA.students.forEach(s => {
      const sc = graderCalcStudentScaled(s.id);
      if (sc !== null) s.score = sc;
    });
  }

  graderRenderStuList();
  graderSelectStu(graderCurrentStu);
}

function graderRenderStuList() {
  const groups = {
    needs_grade: { label:'Needs Grade', color:'#f59e0b', items:[] },
    ai_review: { label:'AI Review', color:'#a855f7', items:[] },
    graded: { label:'Graded', color:'#22c55e', items:[] },
    pending_release: { label:'Pending Release', color:'#f97316', items:[] },
    released: { label:'Released', color:'#3b82f6', items:[] },
  };
  GRADER_DATA.students.forEach(s => groups[s.status]?.items.push(s));
  let html = '';
  Object.entries(groups).forEach(([key, g]) => {
    if (!g.items.length) return;
    html += `<div class="grader-group"><div class="grader-group-label">${g.label}<span class="gc">· ${g.items.length}</span></div>`;
    g.items.forEach(s => {
      const tt = GRADER_DATA.testType;
      let scoreStr = '';
      if (tt === 'act') {
        const sc = graderCalcStudentScaled(s.id);
        scoreStr = sc !== null ? `${sc}/36` : '';
      } else if (tt === 'sat') {
        const sc = graderCalcStudentScaled(s.id);
        scoreStr = sc !== null ? `${sc}` : '';
      } else {
        const pct = graderCalcStudentPct(s.id);
        scoreStr = pct !== null ? `${pct}%` : '';
      }
      html += `<div class="grader-stu ${s.id === graderCurrentStu ? 'active' : ''}" onclick="graderSelectStu(${s.id})" data-sid="${s.id}">
        <div class="gs-dot" style="background:${g.color}"></div>
        <span>${s.name}</span>
        <span class="gs-score">${scoreStr}</span>
      </div>`;
    });
    html += '</div>';
  });
  document.getElementById('graderStuList').innerHTML = html;
  const total = GRADER_DATA.students.length;
  const graded = GRADER_DATA.students.filter(s => s.status === 'graded' || s.status === 'released').length;
  document.getElementById('graderStuCount').textContent = total;
  document.getElementById('graderProgressText').textContent = `${graded}/${total} graded`;
  document.getElementById('graderProgressBar').style.width = `${(graded / total) * 100}%`;
}

function graderCalcStudentPct(sid) {
  const gs = graderGrades[sid];
  if (!gs) return null;
  let earned = 0, max = 0;
  Object.values(gs).forEach(g => { earned += g.pts; max += g.maxPts; });
  return max > 0 ? Math.round((earned / max) * 100) : null;
}

function graderSelectStu(sid) {
  graderCurrentStu = sid;
  graderVisibleCount = graderPageSize;
  // highlight in list
  document.querySelectorAll('.grader-stu').forEach(el => el.classList.toggle('active', +el.dataset.sid === sid));
  const stu = GRADER_DATA.students.find(s => s.id === sid);
  if (!stu) return;
  // header
  const tt = GRADER_DATA.testType;
  const stuBadge = tt === 'act' ? 'ACT' : tt === 'sat' ? 'SAT' : 'ASSESSMENT';
  let stuScoreHtml = '';
  if (tt === 'act') {
    const sc = graderCalcStudentScaled(sid);
    if (sc !== null) stuScoreHtml = `<span style="font-size:12px;font-weight:700;color:#6C3FE4;background:#f3f0ff;padding:2px 10px;border-radius:20px">${sc} / 36</span>`;
  } else if (tt === 'sat') {
    const sc = graderCalcStudentScaled(sid);
    if (sc !== null) stuScoreHtml = `<span style="font-size:12px;font-weight:700;color:#2563eb;background:#eff6ff;padding:2px 10px;border-radius:20px">${sc} / 1600</span>`;
  }
  document.getElementById('graderStuHeader').innerHTML = `
    <span class="gsh-name">${stu.name}</span>
    <span class="gsh-badge">${stuBadge}</span>
    ${stuScoreHtml}
    <span class="gsh-time">Submitted ${stu.submitted}</span>`;
  graderRenderSecTabs();
  graderRenderCenter();
  graderRenderRight();
}

function graderRenderSecTabs() {
  const tabs = GRADER_DATA.sections;
  document.getElementById('graderSecTabs').innerHTML = tabs.map(s => {
    const count = s.id === 'all' ? GRADER_DATA.questions.length : GRADER_DATA.questions.filter(q => q.sec === s.id).length;
    return `<button class="grader-sec-tab ${graderCurrentSec === s.id ? 'active' : ''}" onclick="graderSwitchSec('${s.id}')">${s.name}<span class="tab-count">${count}</span></button>`;
  }).join('');
}

function graderSwitchSec(secId) {
  graderCurrentSec = secId;
  graderVisibleCount = graderPageSize;
  graderRenderSecTabs();
  graderRenderCenter();
  graderRenderRight();
  document.getElementById('graderQuestions').scrollTop = 0;
}

function graderGetVisibleQs() {
  let qs = GRADER_DATA.questions;
  if (graderCurrentSec !== 'all') qs = qs.filter(q => q.sec === graderCurrentSec);
  if (graderCurrentFilter !== 'all') {
    const gs = graderGrades[graderCurrentStu] || {};
    if (graderCurrentFilter === 'wrong') qs = qs.filter(q => gs[q.id] && !gs[q.id].correct && !gs[q.id].flagged);
    else if (graderCurrentFilter === 'flagged') qs = qs.filter(q => gs[q.id]?.flagged);
    else if (graderCurrentFilter === 'partial') qs = qs.filter(q => gs[q.id] && gs[q.id].pts > 0 && gs[q.id].pts < gs[q.id].maxPts);
    else if (graderCurrentFilter === 'correct') qs = qs.filter(q => gs[q.id]?.correct);
  }
  return qs;
}

function graderRenderCenter() {
  const sid = graderCurrentStu;
  const allVisibleQs = graderGetVisibleQs();
  const totalCount = allVisibleQs.length;
  const qs = allVisibleQs.slice(0, graderVisibleCount);
  const gs = graderGrades[sid] || {};
  const container = document.getElementById('graderQuestions');
  const loadMoreHtml = totalCount > graderVisibleCount
    ? `<div style="text-align:center;padding:16px 0">
        <button onclick="graderLoadMore()" style="padding:8px 24px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;font-size:13px;font-weight:600;color:#6b7280;cursor:pointer;transition:.15s"
          onmouseover="this.style.background='#f9fafb';this.style.borderColor='#d1d5db'" onmouseout="this.style.background='#fff';this.style.borderColor='#e5e7eb'">
          Load More — showing ${qs.length} of ${totalCount}
        </button>
      </div>`
    : '';
  container.innerHTML = qs.map(q => {
    const a = q.answers[sid];
    const g = gs[q.id] || {};
    const status = g.flagged ? 'flagged-q' : (g.correct ? 'correct-q' : (g.pts > 0 && g.pts < g.maxPts ? 'partial-q' : 'wrong-q'));
    const scoreClass = g.pts === g.maxPts ? 'full' : (g.pts > 0 ? 'partial' : 'zero');
    const diffClass = q.diff === 'Easy' ? 'diff-easy' : (q.diff === 'Hard' ? 'diff-hard' : 'diff-medium');
    const typeTag = q.type === 'MC' ? 'mc' : 'sa';
    const ansClass = a?.correct ? 'is-correct' : 'is-wrong';
    const overrideTag = g._overridden ? '<span style="font-size:9px;font-weight:700;color:#f59e0b;background:#fef3c7;padding:1px 6px;border-radius:9999px;margin-left:4px">Override</span>' : '';
    const isEssay = q.type === 'ESSAY' || q.type === 'ACT_WRITING';
    const actionHtml = isEssay
      ? `<div class="grader-actions" style="flex-direction:column;align-items:stretch;min-width:82px">
          <div style="font-size:10px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">${q.type === 'ACT_WRITING' ? 'Writing score' : 'Essay Score'}</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">
            ${[0,4,8,12].map(score => `<button class="grader-act-btn ${g.pts === score ? 'active' : ''}" style="width:auto;border-radius:10px;font-size:11px" onclick="graderSetPoints(${sid},${q.id},${score})">${score}</button>`).join('')}
          </div>
          ${q.type === 'ACT_WRITING' ? `<div style="font-size:10px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:6px 7px;margin-top:8px;line-height:1.35">Review state: auto-scored high confidence. Teacher may override the 2-12 writing score.</div>` : ''}
        </div>`
      : `<div class="grader-actions">
          <button class="grader-act-btn correct ${g.pts === g.maxPts ? 'active' : ''}" onclick="graderGrade(${sid},${q.id},true)" title="Mark Correct">✓</button>
          <button class="grader-act-btn wrong ${g.pts === 0 ? 'active' : ''}" onclick="graderGrade(${sid},${q.id},false)" title="Mark Wrong">✗</button>
        </div>`;
    return `<div class="grader-q ${status}" data-qid="${q.id}">
      <div class="grader-q-head">
        <div class="grader-q-num">${q.id}</div>
        <span class="grader-q-title">${q.text}${overrideTag}</span>
        <div class="grader-q-tags">
          <span class="grader-q-tag ${typeTag}">${q.type}</span>
          <span class="grader-q-tag domain">${q.domain}</span>
          <span class="grader-q-tag ${diffClass}">${q.diff}</span>
          <span class="grader-q-tag standard">${q.standard}</span>
          ${renderCanonicalChipCompact(q)}
        </div>
        <span class="grader-q-score ${scoreClass}">${g.pts}/${g.maxPts}</span>
      </div>
      <div style="display:flex;align-items:flex-start">
        <div class="grader-answer-row" style="flex:1">
          <div class="grader-answer-box student-ans ${ansClass}">
            <div class="grader-answer-label">Student</div>
            ${a ? a.val : '(no answer)'}
          </div>
          ${q.type === 'ACT_WRITING' ? `<div class="grader-answer-box correct-ans">
            <div class="grader-answer-label">ACT Writing domains</div>
            ${ACT_WRITING_DOMAINS.map(d => `<div style="display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #f1f5f9;padding:3px 0"><span>${d.label}</span><b>${Math.max(2, Math.min(12, g.pts || 8))}/12</b></div>`).join('')}
          </div>` : ''}
          ${!isEssay && !a?.correct ? `<div class="grader-answer-box correct-ans">
            <div class="grader-answer-label">Correct</div>
            ${q.correct}
          </div>` : ''}
        </div>
        ${actionHtml}
      </div>
    </div>`;
  }).join('') + loadMoreHtml;
}

function graderRenderRight() {
  const sid = graderCurrentStu;
  const gs = graderGrades[sid] || {};
  const allQ = graderCurrentSec === 'all' ? GRADER_DATA.questions : GRADER_DATA.questions.filter(q => q.sec === graderCurrentSec);
  let earned = 0, max = 0, correctCount = 0, wrongCount = 0, partialCount = 0, flaggedCount = 0;
  allQ.forEach(q => {
    const g = gs[q.id];
    if (!g) return;
    earned += g.pts; max += g.maxPts;
    if (g.flagged) flaggedCount++;
    else if (g.correct) correctCount++;
    else if (g.pts > 0 && g.pts < g.maxPts) partialCount++;
    else wrongCount++;
  });
  const pct = max > 0 ? Math.round((earned / max) * 100) : 0;
  const pctClass = pct >= 70 ? '' : (pct >= 50 ? 'mid' : 'low');
  const barColor = pct >= 70 ? '#22c55e' : (pct >= 50 ? '#eab308' : '#ef4444');

  const tt = GRADER_DATA.testType;
  let scaledHtml = '';
  if (tt === 'act') {
    const sc = graderCalcStudentScaled(sid);
    scaledHtml = `<div style="display:flex;align-items:baseline;gap:6px;margin:6px 0 2px"><span style="font-size:28px;font-weight:800;color:#6C3FE4">${sc||0}</span><span style="font-size:12px;color:#a1a1aa">/ 36 Composite</span></div>`;
  } else if (tt === 'sat') {
    const sc = graderCalcStudentScaled(sid);
    scaledHtml = `<div style="display:flex;align-items:baseline;gap:6px;margin:6px 0 2px"><span style="font-size:28px;font-weight:800;color:#2563eb">${sc||0}</span><span style="font-size:12px;color:#a1a1aa">/ 1600 Total</span></div>`;
  }

  const overrideCount = Object.values(gs).filter(g => g._overridden).length;
  const overrideNote = overrideCount > 0 ? `<div style="font-size:10px;color:#f59e0b;margin-top:4px">${overrideCount} question${overrideCount>1?'s':''} overridden by teacher</div>` : '';

  document.getElementById('graderAiCard').innerHTML = `
    <div class="ai-spark">✦</div>
    <div class="ai-title">${tt==='act'||tt==='sat'?'System Auto-Graded':'AI Auto-Graded'}</div>
    <div class="ai-subtitle">${earned} / ${max} pts · ${allQ.length} questions</div>
    ${scaledHtml}${overrideNote}
    <div class="grader-ai-score ${pctClass}">${pct}%</div>
    <div class="grader-ai-bar"><div class="grader-ai-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
    <div class="grader-stat-grid">
      <div class="grader-stat correct"><div class="gs-num">${correctCount}</div><div class="gs-label">Correct</div></div>
      <div class="grader-stat wrong"><div class="gs-num">${wrongCount}</div><div class="gs-label">Wrong</div></div>
      <div class="grader-stat partial"><div class="gs-num">${partialCount}</div><div class="gs-label">Partial</div></div>
      <div class="grader-stat flagged"><div class="gs-num">${flaggedCount}</div><div class="gs-label">Flagged</div></div>
    </div>
    <button class="grader-accept-all" onclick="graderAcceptAll()">✓ Accept All</button>
    <button class="grader-review-flagged" onclick="graderFilterBy('flagged')">⚑ Review Flagged (${flaggedCount})</button>`;

  // Filter tabs
  document.getElementById('graderFilterTabs').innerHTML = [
    { id:'all', label:`All (${allQ.length})` },
    { id:'wrong', label:`✗ Wrong (${wrongCount})` },
    { id:'flagged', label:`⚑ Flagged (${flaggedCount})` },
    { id:'partial', label:`½ Partial (${partialCount})` },
    { id:'correct', label:`✓ Correct (${correctCount})` },
  ].map(f => `<span class="grader-filter-tab ${graderCurrentFilter === f.id ? 'active' : ''}" onclick="graderFilterBy('${f.id}')">${f.label}</span>`).join('');

  // Right pills
  const qs = graderGetVisibleQs();
  document.getElementById('graderRightPills').innerHTML = qs.map(q => {
    const g = gs[q.id] || {};
    const numCls = g.flagged ? 'flagged' : (g.correct ? 'correct' : 'wrong');
    return `<div class="grader-rpill" onclick="graderScrollToQ(${q.id})">
      <div class="rp-num ${numCls}">${q.id}</div>
      <span class="rp-text">${q.text}</span>
      <span class="rp-tag">${q.type}</span>
      <span class="rp-score">${g.pts}/${g.maxPts}</span>
    </div>`;
  }).join('');
}

function graderGrade(sid, qid, isCorrect) {
  const q = GRADER_DATA.questions.find(q => q.id === qid);
  if (!q) return;
  const g = graderGrades[sid][qid];
  if (!g) return;
  g.pts = isCorrect ? q.pts : 0;
  g.correct = isCorrect;
  g.flagged = false;
  g._overridden = true;
  if (q.answers[sid]) {
    q.answers[sid].correct = isCorrect;
    q.answers[sid].pts = isCorrect ? q.pts : 0;
  }
  graderRenderCenter();
  graderRenderRight();
  graderRenderStuList();
}
function graderSetPoints(sid, qid, pts) {
  const q = GRADER_DATA.questions.find(q => q.id === qid);
  if (!q) return;
  const g = graderGrades[sid][qid];
  if (!g) return;
  g.pts = Math.max(0, Math.min(q.pts, pts));
  g.correct = g.pts === q.pts;
  g.flagged = false;
  g._overridden = true;
  if (q.answers[sid]) {
    q.answers[sid].pts = g.pts;
    q.answers[sid].correct = g.correct;
  }
  graderRenderCenter();
  graderRenderRight();
  graderRenderStuList();
}

function graderAcceptAll() {
  graderRenderCenter();
  graderRenderRight();
}

function graderFilterBy(filter) {
  graderCurrentFilter = filter;
  graderVisibleCount = graderPageSize;
  graderRenderCenter();
  graderRenderRight();
}

function graderLoadMore() {
  graderVisibleCount += graderPageSize;
  graderRenderCenter();
}

function graderScrollToQ(qid) {
  const el = document.querySelector(`.grader-q[data-qid="${qid}"]`);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'center' });
}

function graderPrevStu() {
  const idx = GRADER_DATA.students.findIndex(s => s.id === graderCurrentStu);
  if (idx > 0) graderSelectStu(GRADER_DATA.students[idx - 1].id);
}
function graderNextStu() {
  const idx = GRADER_DATA.students.findIndex(s => s.id === graderCurrentStu);
  if (idx < GRADER_DATA.students.length - 1) graderSelectStu(GRADER_DATA.students[idx + 1].id);
}
function graderSave() {
  graderNextStu();
}
function graderRelease() {
  const stu = GRADER_DATA.students.find(s => s.id === graderCurrentStu);
  if (stu) {
    stu.status = 'pending_release';
    stu.score = graderTestType === 'act' || graderTestType === 'sat'
      ? graderCalcStudentScaled(stu.id)
      : graderCalcStudentPct(stu.id);
    const linkedSession = getSession(currentSessionId);
    if (linkedSession) {
      linkedSession.reportState = 'pending_release';
      linkedSession.status = linkedSession.status === 'Released' ? 'Completed' : linkedSession.status;
      syncLinkedSessionCounts(linkedSession.id);
    }
  }
  graderRenderStuList();
}

function actFillColor(pct){ return pct>=75?'green':pct>=55?'yellow':'red'; }

