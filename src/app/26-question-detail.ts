// @ts-nocheck
// Phase-2 slice: lines 23154-24515 of original src/app.ts

// ═══════ QUESTION DETAIL DATA (Tier 2 / Tier 3) ═══════
const ACT_QUESTIONS = {
  english: [
    {n:1,section:'English',category:'POW',correct:'D',student:'C',time:52,type:'MC',
      passage:'In the following passage, the author describes the economic impact of urban gardens on local communities. Urban gardens have become a significant force in reshaping how neighborhoods interact with food systems...',
      passageHighlight:'Urban gardens have become a significant force',
      stem:'Which choice best maintains the essay\'s focus on the economic benefits of urban gardens?',
      choices:['gardens also provide aesthetic improvements','many cities have begun investing in green spaces','the financial returns for participants are notable','community members enjoy fresh produce'],
      explanation:'Choice D is correct because the passage focuses on economic benefits at the community level. "Fresh produce" access reducing grocery costs directly addresses economic impact.',
      wrongAnalysis:[
        {label:'A',reason:'Aesthetic improvements are not economic benefits — this is off-topic.'},
        {label:'B',reason:'City investment is about government spending, not economic benefit to the community.'},
        {label:'C',reason:'"Financial returns for participants" is too narrow and misrepresents the passage\'s focus on community-wide impact.'}
      ]},
    {n:2,section:'English',category:'KLA',correct:'B',student:'B',time:38,type:'MC',
      stem:'Which of the following most effectively concludes the paragraph?',
      choices:['Therefore, gardens are nice.','As a result, urban agriculture has proven both sustainable and economically viable.','Gardens are everywhere now.','People like gardens.'],
      explanation:'B provides a strong concluding statement that ties sustainability to economic viability, matching the paragraph\'s dual focus.',
      wrongAnalysis:[{label:'A',reason:'Too vague and informal.'},{label:'C',reason:'Merely states a fact without drawing a conclusion.'},{label:'D',reason:'Too simplistic for an academic context.'}]},
    {n:3,section:'English',category:'CSE',correct:'A',student:'D',time:45,type:'MC',
      stem:'The author wants to add a transition between paragraphs 2 and 3. Which choice best accomplishes this goal?',
      choices:['Beyond individual nutrition, these gardens create economic ripple effects.','Gardens are nice places to be.','However, not all gardens succeed.','Meanwhile, other programs exist.'],
      explanation:'A is correct because it bridges the topic from individual nutrition (para 2) to broader economic effects (para 3).',
      wrongAnalysis:[{label:'B',reason:'Off-topic and informal.'},{label:'C',reason:'Introduces a contradictory point not supported by the text.'},{label:'D',reason:'Vague reference to "other programs" without connection.'}]},
  ],
  math: [
    {n:51,section:'Math',category:'PHM',correct:'C',student:'A',time:72,type:'MC',
      stem:'If f(x) = 3x² − 12x + 7, what is the minimum value of f(x)?',
      choices:['-5','−7','-5','7'],
      explanation:'Completing the square: f(x) = 3(x² − 4x) + 7 = 3(x−2)² − 12 + 7 = 3(x−2)² − 5. Minimum is −5 at x = 2.',
      wrongAnalysis:[{label:'A',reason:'This would be the answer if the coefficient were 1 instead of 3.'},{label:'B',reason:'Sign error in completing the square.'},{label:'D',reason:'This is the constant term, not the minimum.'}]},
    {n:52,section:'Math',category:'IAN',correct:'B',student:'B',time:60,type:'MC',
      stem:'A line passes through (2, 5) and (6, 13). What is the slope?',
      choices:['1','2','4','8'],
      explanation:'Slope = (13−5)/(6−2) = 8/4 = 2.',
      wrongAnalysis:[{label:'A',reason:'Divided incorrectly.'},{label:'C',reason:'Only computed the numerator: 13−5=8, then halved.'},{label:'D',reason:'Only computed the numerator without dividing.'}]},
  ],
  reading: [
    {n:76,section:'Reading',category:'KID',correct:'C',student:'A',time:88,type:'MC',
      passage:'The Harlem Renaissance was a cultural movement that spanned the 1920s and 1930s. During this period, African American writers, artists, and musicians produced a remarkable body of work that challenged racial stereotypes...',
      passageHighlight:'challenged racial stereotypes',
      stem:'According to the passage, what was the primary significance of the Harlem Renaissance?',
      choices:['It improved economic conditions for African Americans.','It was mainly a musical movement.','It challenged racial stereotypes through art and culture.','It lasted for several decades.'],
      explanation:'C directly reflects the passage\'s stated significance: "challenged racial stereotypes" through the work of writers, artists, and musicians.',
      wrongAnalysis:[{label:'A',reason:'The passage discusses cultural impact, not economic conditions.'},{label:'B',reason:'Music was one part, but the passage describes writers, artists, AND musicians.'},{label:'D',reason:'The passage says 1920s-1930s (two decades), and duration isn\'t presented as the primary significance.'}]},
  ],
  science: [
    {n:112,section:'Science',category:'DOK',correct:'D',student:'C',time:65,type:'MC',
      stem:'Based on Table 1, which variable showed the greatest increase between Trial 2 and Trial 4?',
      choices:['Temperature','Pressure','Volume','Concentration'],
      explanation:'Reading Table 1: Concentration increased from 0.15 M to 0.82 M (a 447% increase), the largest change among all variables.',
      wrongAnalysis:[{label:'A',reason:'Temperature rose only from 25°C to 35°C (40% increase).'},{label:'B',reason:'Pressure remained constant across all trials.'},{label:'C',reason:'Volume decreased, so it cannot be the "greatest increase."'}]},
  ],
  writing: [
    {n:172,section:'Writing',category:'WRI',type:'ACT_WRITING',score:8,maxScore:12,time:40,
      title:ACT_WRITING_PROMPT.title,
      issue:ACT_WRITING_PROMPT.issue,
      perspectives:ACT_WRITING_PROMPT.perspectives,
      taskInstructions:ACT_WRITING_PROMPT.taskInstructions,
      directions:ACT_WRITING_PROMPT.directions,
      planningPrompt:ACT_WRITING_PROMPT.planningPrompt,
      rubricDomains:ACT_WRITING_DOMAINS,
      prompt:'Write an essay evaluating three perspectives about whether schools should require a capstone project for graduation. Explain your own perspective and analyze the relationship between your perspective and at least one other perspective.',
      response:'The response takes a clear position in favor of capstone projects when schools provide flexible topic choices and mentoring. It compares this view with concerns about workload and argues that the benefits are strongest when projects connect to student interests.',
      reviewState:'Scored by Kira AI',
      domainScores:{ 'Ideas and Analysis':8, 'Development and Support':7, 'Organization':9, 'Language Use and Conventions':8 },
      explanation:'Your essay presents a clear perspective and stays organized throughout. To move higher, develop counterarguments with more specific evidence and vary sentence structure in the body paragraphs.'}
  ]
};

const ACT_FULL_SECTION_SPECS = {
  english: { start: 1, total: 50, section: 'English', categories: ['POW', 'KLA', 'CSE'] },
  math: { start: 51, total: 45, section: 'Math', categories: ['PHM', 'IAN', 'MOD'] },
  reading: { start: 96, total: 36, section: 'Reading', categories: ['KID', 'CAS', 'IKI'] },
  science: { start: 132, total: 40, section: 'Science', categories: ['DOK', 'SIN', 'EMI'] },
  writing: { start: 172, total: 1, section: 'Writing', categories: ['WRI'] }
};

const ACT_READING_PASSAGES = [
  {
    title: 'Literary Narrative',
    text: 'Mara had always believed the town library was quiet because people respected books. That summer, after volunteering behind the circulation desk, she learned the silence came from something more active: attention. Patrons leaned toward pages the way gardeners lean toward seedlings, waiting for something small to reveal itself. By August, Mara no longer thought of the library as a building full of finished stories, but as a workshop where private questions slowly found language.',
    highlight: 'the silence came from something more active: attention'
  },
  {
    title: 'Social Science',
    text: 'Urban planners increasingly study how small design choices affect public life. A shaded bench, a protected bike lane, or a plaza placed between transit stops can change how residents move through a neighborhood. These features rarely solve civic problems alone, but they lower the cost of participation: people linger, notice one another, and begin treating shared space as something they can shape rather than merely pass through.',
    highlight: 'they lower the cost of participation'
  },
  {
    title: 'Humanities',
    text: 'When early photographers argued that their work belonged in museums, critics often dismissed the camera as a mechanical device. Yet photographers made choices about framing, timing, light, and subject that could alter the meaning of a scene. The debate was never simply about technology; it was about whether artistic intention could operate through a machine and still produce a distinctly human point of view.',
    highlight: 'whether artistic intention could operate through a machine'
  },
  {
    title: 'Natural Science',
    text: 'Coral reefs are sometimes described as underwater cities because thousands of organisms depend on their structure. Recent studies show that reefs recover best when herbivorous fish remain present after bleaching events. By grazing on fast-growing algae, these fish keep surfaces clear for young corals to attach. The finding suggests that reef resilience depends not only on temperature trends but also on the health of surrounding food webs.',
    highlight: 'reef resilience depends not only on temperature trends'
  }
];

const ACT_SCIENCE_STIMULI = [
  'Table 1 shows enzyme activity measured at four temperatures across three trials.',
  'Figure 2 compares seed germination rates under low, medium, and high salinity conditions.',
  'Study 1 tracks dissolved oxygen in two ponds before and after an algae bloom.',
  'Experiment 3 measures cart acceleration as ramp angle and mass are varied.'
];

function actChoiceLetters() {
  return ['A', 'B', 'C', 'D'];
}

function actSeedFor(sectionKey, n) {
  return (n * 37 + sectionKey.charCodeAt(0) * 11) % 97;
}

function actGeneratedStudentAnswer(correct, sectionKey, n) {
  const seed = actSeedFor(sectionKey, n);
  if (seed % 17 === 0) return '(blank)';
  if (seed % 5 === 0 || seed % 7 === 0) {
    const letters = actChoiceLetters().filter(l => l !== correct);
    return letters[seed % letters.length];
  }
  return correct;
}

function buildGeneratedActQuestion(sectionKey, n, localIdx) {
  const spec = ACT_FULL_SECTION_SPECS[sectionKey];
  if (sectionKey === 'writing') {
    return {
      n, section: spec.section, category:'WRI', type:'ACT_WRITING', score:8, maxScore:12, time:40,
      title:ACT_WRITING_PROMPT.title,
      issue:ACT_WRITING_PROMPT.issue,
      perspectives:ACT_WRITING_PROMPT.perspectives,
      taskInstructions:ACT_WRITING_PROMPT.taskInstructions,
      directions:ACT_WRITING_PROMPT.directions,
      planningPrompt:ACT_WRITING_PROMPT.planningPrompt,
      rubricDomains:ACT_WRITING_DOMAINS,
      prompt:'Write an essay evaluating three perspectives about whether schools should require a capstone project for graduation. Explain your own perspective and analyze the relationship between your perspective and at least one other perspective.',
      response:'The response takes a clear position in favor of capstone projects when schools provide flexible topic choices and mentoring. It compares this view with concerns about workload and argues that the benefits are strongest when projects connect to student interests.',
      reviewState:'Scored by Kira AI',
      domainScores:{ 'Ideas and Analysis':8, 'Development and Support':7, 'Organization':9, 'Language Use and Conventions':8 },
      explanation:'Your essay presents a clear perspective and stays organized throughout. To move higher, develop counterarguments with more specific evidence and vary sentence structure in the body paragraphs.'
    };
  }
  const cats = spec.categories;
  const category = cats[localIdx % cats.length];
  const seed = actSeedFor(sectionKey, n);
  const correct = actChoiceLetters()[seed % 4];
  const student = actGeneratedStudentAnswer(correct, sectionKey, n);
  const timeBudgetBySection = { english:36, math:60, reading:53, science:53 };
  const timeBase = timeBudgetBySection[sectionKey] || 55;
  const time = Math.max(18, Math.round(timeBase * (0.75 + (seed % 55) / 100)));
  const wrongAnalysis = actChoiceLetters()
    .filter(label => label !== correct)
    .map(label => ({ label, reason: `${label} reflects a common trap for this item, but it does not satisfy the key evidence or calculation.` }));

  if (sectionKey === 'english') {
    const stems = [
      'Which choice best maintains the sentence pattern established in the paragraph?',
      'Which option provides the most precise and concise wording?',
      'Where should the underlined sentence be placed to improve paragraph flow?',
      'Which choice best supports the writer\'s stated purpose?'
    ];
    return {
      n, section: spec.section, category, correct, student, time, type: 'MC',
      passage: localIdx % 10 === 0 ? 'The passage discusses how neighborhood organizations use local data, interviews, and public meetings to improve community services while preserving residents\' trust.' : undefined,
      stem: stems[localIdx % stems.length],
      choices: ['NO CHANGE', 'revise for a clearer transition', 'delete because it repeats the previous idea', 'add a specific detail that supports the claim'],
      explanation: `The correct answer is ${correct} because it best preserves the paragraph's logic, style, and purpose without adding unnecessary wording.`,
      wrongAnalysis
    };
  }

  if (sectionKey === 'math') {
    const values = [2 + (seed % 5), 4 + (seed % 7), 10 + (seed % 9)];
    const stems = [
      `If ${values[0]}x + ${values[1]} = ${values[2] + values[1]}, what is the value of x?`,
      `A rectangle has length ${values[2]} and width ${values[0]}. What is its area?`,
      `The line through (0, ${values[1]}) and (${values[0]}, ${values[2]}) has which slope?`,
      `Which expression is equivalent to ${values[0]}(x + ${values[1]})?`
    ];
    return {
      n, section: spec.section, category, correct, student, time, type: 'MC',
      stem: stems[localIdx % stems.length],
      choices: ['2', '4', '8', '12'],
      explanation: `The correct answer is ${correct}. Work through the algebra carefully and check that the selected value satisfies the original condition.`,
      wrongAnalysis
    };
  }

  if (sectionKey === 'reading') {
    const passage = ACT_READING_PASSAGES[Math.floor(localIdx / 9) % ACT_READING_PASSAGES.length];
    const stems = [
      `In ${passage.title}, the passage most strongly suggests that the narrator or author views change as:`,
      `Which choice best states the main idea of this passage?`,
      `The highlighted phrase primarily serves to:`,
      `Based on the passage, which inference is best supported?`
    ];
    return {
      n, section: spec.section, category, correct, student, time, type: 'MC',
      passage: passage.text,
      passageHighlight: passage.highlight,
      stem: stems[localIdx % stems.length],
      choices: ['a minor inconvenience', 'a process shaped by attention and evidence', 'a purely individual preference', 'an event caused by chance alone'],
      explanation: `The correct answer is ${correct} because it is directly supported by the passage's central claim and the surrounding evidence.`,
      wrongAnalysis
    };
  }

  const stimulus = ACT_SCIENCE_STIMULI[Math.floor(localIdx / 10) % ACT_SCIENCE_STIMULI.length];
  const stems = [
    'Based on the data, which conclusion is best supported?',
    'Which variable was changed by the researchers in this experiment?',
    'If the observed trend continues, what result is most likely in the next trial?',
    'Which statement best explains the difference between the two studies?'
  ];
  return {
    n, section: spec.section, category, correct, student, time, type: 'MC',
    passage: localIdx % 10 === 0 ? stimulus : undefined,
    stem: `${stimulus} ${stems[localIdx % stems.length]}`,
    choices: ['The dependent variable increased steadily.', 'The control group showed the largest change.', 'The relationship was negative across all trials.', 'The data were unchanged across conditions.'],
    explanation: `The correct answer is ${correct} because it matches the direction of the data and avoids overgeneralizing beyond the experiment.`,
    wrongAnalysis
  };
}

function ensureFullActQuestionBank() {
  Object.entries(ACT_FULL_SECTION_SPECS).forEach(([sectionKey, spec]) => {
    const existing = ACT_QUESTIONS[sectionKey] || [];
    const byNumber = {};
    existing.forEach(q => { byNumber[q.n] = q; });
    const full = [];
    for (let i = 0; i < spec.total; i++) {
      const n = spec.start + i;
      full.push(byNumber[n] || buildGeneratedActQuestion(sectionKey, n, i));
    }
    ACT_QUESTIONS[sectionKey] = full;
  });
}

ensureFullActQuestionBank();

const SAT_QUESTIONS = {
  rw: [
    {n:1,section:'RW Module 1',category:'Information and Ideas',correct:'B',student:'B',time:62,type:'MC',
      passage:'Recent archaeological findings suggest that ancient Mesopotamian societies developed sophisticated irrigation systems earlier than previously believed. These systems, dating to approximately 6000 BCE...',
      passageHighlight:'developed sophisticated irrigation systems earlier than previously believed',
      stem:'Which choice best states the main idea of the passage?',
      choices:['Irrigation was common in ancient times.','Mesopotamian irrigation technology was more advanced and older than scholars thought.','Water management is important for agriculture.','Archaeology has made many discoveries recently.'],
      explanation:'B accurately captures both key claims in the passage: the systems were "earlier than previously believed" (older) and "sophisticated" (more advanced).',
      wrongAnalysis:[{label:'A',reason:'Too broad; doesn\'t specify Mesopotamia or the revision of timelines.'},{label:'C',reason:'True but generic; not the main idea of this specific passage.'},{label:'D',reason:'Overly vague and doesn\'t address the specific findings about Mesopotamian irrigation.'}]},
    {n:2,section:'RW Module 1',category:'Craft and Structure',correct:'C',student:'D',time:78,type:'MC',
      stem:'As used in line 12, "refined" most nearly means:',
      choices:['elegant','purified','improved','cultured'],
      explanation:'"Refined" in context means the irrigation systems were improved over time, not that they were elegant or purified.',
      wrongAnalysis:[{label:'A',reason:'Elegant refers to appearance, not technical improvement.'},{label:'B',reason:'Purified relates to removing impurities, not system improvement.'},{label:'D',reason:'Cultured describes people, not systems.'}]},
  ],
  math: [
    {n:1,section:'Math Module 1',category:'Algebra',correct:null,student:'3',time:88,type:'GRID_IN',
      stem:'If x² + 3x = 10, what is the positive value of x?',
      correctAnswers:['2','2.0'],
      explanation:'Rearranging gives x² + 3x − 10 = 0. Factoring yields (x + 5)(x − 2) = 0, so x = −5 or x = 2. Since the question asks for the positive value, x = 2.',
      solutionSteps:['Rearrange: x² + 3x − 10 = 0','Factor: (x + 5)(x − 2) = 0','Solve: x = −5 or x = 2','Select positive value: x = 2'],
      commonMistakes:['Answering −5 (valid root but not positive as required)','Answering 3 (misreading x² + 3x as x(x+3) = 10, then guessing without verification)']},
    {n:2,section:'Math Module 1',category:'Advanced Math',correct:'A',student:'C',time:54,type:'MC',
      stem:'What is the y-intercept of the function f(x) = 2(x − 3)² + 1?',
      choices:['19','1','−3','7'],
      explanation:'f(0) = 2(0 − 3)² + 1 = 2(9) + 1 = 19. The y-intercept is (0, 19).',
      wrongAnalysis:[{label:'B',reason:'1 is the vertex y-value, not the y-intercept.'},{label:'C',reason:'−3 is the x-coordinate of the vertex.'},{label:'D',reason:'Computation error: possibly 2(3)+1.'}]},
    {n:3,section:'Math Module 1',category:'Problem-Solving & Data Analysis',correct:null,student:'0.75',time:92,type:'GRID_IN',
      stem:'In a bag of marbles, 3/4 are blue. If there are 12 blue marbles, what fraction of the total are blue? Express as a decimal.',
      correctAnswers:['0.75','3/4','.75'],
      explanation:'3/4 of the marbles are blue, and this is confirmed: 3/4 × 16 = 12. So the fraction is 3/4 = 0.75.',
      solutionSteps:['Let total = T','3/4 × T = 12','T = 16','Fraction blue = 12/16 = 3/4 = 0.75'],
      commonMistakes:['Answering 12 (the count, not the fraction)','Answering 16 (the total instead of the fraction)']},
  ]
};

let reportDrillState = { testType: null, section: null, questionIdx: null };

// ─── ACT Question Review v2 — premium item-analysis experience ──────────────
// Modeled on the best practices from Khan Academy (College Board partner),
// AP Classroom, PrepScholar, and Magoosh:
//   • Section tabs (one section at a time, less clutter)
//   • Sticky stats bar with Correct / Wrong outcomes.
//   • Item grid with color + tooltip
//   • Detail pane with: answer review / distractor analysis (% of class chose
//     each option) / explanation, kept lightweight for student-facing reports.
//
// All NEW blocks are gated on q._enriched so SAT / others fall back unchanged.

const ACT_TARGET_TIME_PER_Q = { english:36, math:60, reading:53, science:53 };
const ACT_SECTION_LABELS = {
  english: 'English', math: 'Math', reading: 'Reading', science: 'Science', writing: 'Writing'
};
// Composite point ≈ scale span / total questions (rough, but useful as
// "what does losing this one item really cost me?" framing.)
const ACT_SCORE_IMPACT_PER_Q = {
  english: 0.27,  // 36 scaled / ~75 raw items per section, smoothed
  math:    0.45,
  reading: 0.55,
  science: 0.55
};

// Deterministic mock enrichment for an ACT question — given the same q.n /
// q.student / q.correct, this always returns the same numbers, so the demo
// feels "real" across reloads and screenshots.
function enrichActQuestion(q, sectionKey) {
  if (!q || q._enriched) return q;
  if (q.type === 'ESSAY' || q.type === 'ACT_WRITING') {
    return Object.assign({}, q, {
      _enriched: true,
      isEssay: true,
      isCorrect: null,
      isSkipped: false,
      isSlow: false,
      difficulty: 'Essay',
      skillName: 'Writing'
    });
  }
  // Hash for jitter (deterministic): based on q.n and category code.
  const seed = (q.n * 31 + (q.category || '').charCodeAt(0)) % 100;
  const isCorrect = q.type === 'GRID_IN'
    ? (q.correctAnswers || []).includes(q.student)
    : q.student === q.correct;
  // Difficulty distribution: ~33% Easy / 50% Medium / 17% Hard
  const difficulty = (seed % 3 === 0) ? 'Easy' : (seed % 3 === 1) ? 'Medium' : 'Hard';
  // Class correct % derived from difficulty + slight jitter
  const baseCorrect = difficulty === 'Easy' ? 78 : difficulty === 'Medium' ? 58 : 36;
  const classCorrectPct = Math.max(8, Math.min(95, baseCorrect + ((seed * 7) % 15) - 7));
  // Choice distribution: correct gets classCorrectPct; remaining split, with
  // a bias toward the student's wrong choice (modeled as a "trap" answer).
  const choiceDistribution = {};
  if (q.type !== 'GRID_IN' && q.choices) {
    const letters = q.choices.map((_, i) => String.fromCharCode(65 + i));
    const remain = 100 - classCorrectPct;
    let traps = letters.filter(l => l !== q.correct);
    let trapShares;
    if (!isCorrect && q.student && traps.includes(q.student)) {
      // Student's choice gets the largest "trap" share (~half of remaining)
      const studentShare = Math.round(remain * 0.5);
      const otherShare = Math.floor((remain - studentShare) / (traps.length - 1));
      letters.forEach(l => {
        if (l === q.correct) choiceDistribution[l] = classCorrectPct;
        else if (l === q.student) choiceDistribution[l] = studentShare;
        else choiceDistribution[l] = otherShare;
      });
    } else {
      const each = Math.floor(remain / traps.length);
      letters.forEach(l => choiceDistribution[l] = l === q.correct ? classCorrectPct : each);
    }
    // Round-off correction
    const sum = Object.values(choiceDistribution).reduce((s, n) => s + n, 0);
    if (sum !== 100 && letters.length > 0) {
      choiceDistribution[q.correct] += (100 - sum);
    }
  }
  // Time benchmarks (target = official per-question budget; class avg jitters
  // around target; "fast/slow" relative to class).
  const targetTime = ACT_TARGET_TIME_PER_Q[sectionKey] || 50;
  const classAvgTime = Math.max(15, Math.round(targetTime * (0.9 + (seed % 30) / 100)));
  const scoreImpact = ACT_SCORE_IMPACT_PER_Q[sectionKey] || 0.4;
  // Flagged: deterministic — every 4th question seeded as flagged for demo
  const flagged = (q.n % 4 === 1 && q.n > 1);
  // Skill metadata for next-step CTAs
  const categoryNameMap = {
    POW:'Production of Writing', KLA:'Knowledge of Language', CSE:'Conventions of Standard English',
    PHM:'Preparing for Higher Math', IES:'Integrating Essential Skills', IAN:'Integrating Essential Skills',
    MOD:'Modeling',
    KID:'Key Ideas & Details', CAS:'Craft & Structure', IKI:'Integration of Knowledge',
    DOK:'Interpretation of Data', IOD:'Interpretation of Data',
    SIN:'Scientific Investigation', EMI:'Evaluation of Models'
  };
  const skillName = categoryNameMap[q.category] || q.category;
  return Object.assign({}, q, {
    _enriched: true,
    difficulty, classCorrectPct, classAvgTime, targetTime, scoreImpact,
    choiceDistribution, flagged, skillName, isCorrect,
    isSkipped: !q.student || q.student === '(blank)',
    isSlow: q.time > classAvgTime * 1.5
  });
}

function getEnrichedActQuestions(sectionKey) {
  return (ACT_QUESTIONS[sectionKey] || []).map(q => enrichActQuestion(q, sectionKey));
}

// Active section tab + filter + selected question for the ACT review.
// Default to the whole test: item analysis should show every question first,
// with section/status chips acting as optional filters.
let _actReviewSection = 'all';
let _actReviewFilter  = 'all';   // all | wrong | correct | std:CODE
let _actReviewPage = 1;
let _actReviewSelected = null;   // { section, idx } — currently focused question on the details page
const ACT_REVIEW_PAGE_SIZE = 5;
const ACT_REVIEW_SECTIONS = ['english','math','reading','science','writing'];

// ─── ACT review helpers (shared by report summary card + dedicated details page) ─────
function isActObjectiveQuestion(q) {
  return q && q.type !== 'ESSAY' && q.type !== 'ACT_WRITING';
}

function actReviewQuestionStatus(q) {
  if (!isActObjectiveQuestion(q)) return 'essay';
  const ans = q.student;
  if (ans === undefined || ans === null || ans === '') return 'blank';
  const correct = q.type === 'GRID_IN'
    ? (q.correctAnswers || []).includes(ans)
    : ans === q.correct;
  return correct ? 'correct' : 'wrong';
}

function actReviewStatusLabel(status) {
  return ({ correct:'Correct', wrong:'Wrong', blank:'Skipped', essay:'Essay' })[status] || status || '—';
}

function getActReviewRows() {
  const rows = [];
  ACT_REVIEW_SECTIONS.forEach(secKey => {
    const list = ACT_QUESTIONS[secKey] || [];
    list.forEach((raw, idx) => {
      const isEssay = secKey === 'writing' || raw.type === 'ESSAY' || raw.type === 'ACT_WRITING';
      const q = isEssay ? raw : enrichActQuestion(raw, secKey);
      const status = actReviewQuestionStatus(q);
      rows.push(Object.assign({}, q, {
        _sectionKey: secKey,
        _origIdx: idx,
        _status: status,
        isEssay,
        isCorrect: status === 'correct'
      }));
    });
  });
  return rows;
}

function getActReviewScopeRows(section) {
  const sec = section || _actReviewSection || 'all';
  const all = getActReviewRows();
  return sec === 'all' ? all : all.filter(q => q._sectionKey === sec);
}

function getActReviewFilteredRows(section, filter) {
  const scope = getActReviewScopeRows(section);
  const flt = filter || _actReviewFilter || 'all';
  if (flt === 'all') return scope;
  if (flt === 'wrong')   return scope.filter(q => q._status === 'wrong');
  if (flt === 'correct') return scope.filter(q => q._status === 'correct');
  if (flt === 'blank')   return scope.filter(q => q._status === 'blank');
  if (typeof flt === 'string' && flt.startsWith('std:')) {
    const code = flt.replace('std:','');
    return scope.filter(q => q.category === code);
  }
  return scope;
}

function actReviewStats(rows) {
  const r = rows || [];
  return {
    total:   r.length,
    correct: r.filter(q => q._status === 'correct').length,
    wrong:   r.filter(q => q._status === 'wrong').length,
    blank:   r.filter(q => q._status === 'blank').length,
    essay:   r.filter(q => q._status === 'essay').length
  };
}

function setActDetailQuestion(sectionKey, idx) {
  _actReviewSelected = { section: sectionKey, idx: Number(idx) };
  renderActQuestionDetailPage();
  setTimeout(() => document.querySelector('.act-detail-question')?.scrollIntoView({behavior:'instant', block:'start'}), 30);
}

function openActQuestionDetails(filter, section) {
  // Question detail entry from the report card now jumps into the existing
  // ACT student player in review mode (with explanations + correct/wrong
  // markers) instead of a separate page. Keeps the legacy state in sync
  // for any code paths that still read it.
  _actReviewSection  = section || 'all';
  _actReviewFilter   = filter  || 'all';
  _actReviewPage     = 1;
  _actReviewSelected = null;
  stuActEnterReview(_actReviewFilter, _actReviewSection);
}

function renderActReviewTarget() {
  if (currentPage === 'stu-act-details') renderActQuestionDetailPage();
  else renderActReport();
}

function setActReviewSection(s) {
  _actReviewSection = s;
  _actReviewFilter = 'all';
  _actReviewPage = 1;
  _actReviewSelected = null;
  reportDrillState = { testType:null, section:null, questionIdx:null };
  renderActReviewTarget();
  setTimeout(() => document.getElementById('question-review')?.scrollIntoView({behavior:'instant',block:'start'}), 30);
}
function setActReviewFilter(f) {
  _actReviewFilter = f;
  _actReviewPage = 1;
  _actReviewSelected = null;
  reportDrillState = { testType:null, section:null, questionIdx:null };
  renderActReviewTarget();
  setTimeout(() => document.getElementById('question-review')?.scrollIntoView({behavior:'instant',block:'start'}), 30);
}
function setActReviewPage(page) {
  _actReviewPage = Math.max(1, Number(page) || 1);
  reportDrillState = { testType:null, section:null, questionIdx:null };
  renderActReviewTarget();
  setTimeout(() => document.getElementById('question-review')?.scrollIntoView({behavior:'instant',block:'start'}), 30);
}
function actReviewFilterByStandard(code) {
  _actReviewFilter = 'std:' + code;
  _actReviewPage = 1;
  _actReviewSelected = null;
  reportDrillState = { testType:null, section:null, questionIdx:null };
  renderActReviewTarget();
  setTimeout(() => document.getElementById('question-review')?.scrollIntoView({behavior:'instant',block:'start'}), 30);
}
function actReviewOpenPracticeForSkill(skillCode, skillName) {
  iteToast(`Practice pack queued — ${skillCode} ${skillName} (10 targeted questions)`, 'info');
}
function actReviewWatchVideo(skillCode, skillName) {
  iteToast(`Concept video queued — ${skillName} (5-min walkthrough by 36-scorer)`, 'info');
}

// Build the ACT Question Review block. Used by renderActReport in place
// of the old per-section collapsible cards.
function renderActQuestionReviewV2() {
  const sections = ['english','math','reading','science','writing'];
  const allBySec = {};
  sections.forEach(s => {
    allBySec[s] = getEnrichedActQuestions(s).map(q => ({ ...q, _sectionKey:s }));
  });
  const allQuestions = sections.flatMap(s => allBySec[s]);
  const cur = _actReviewSection === 'all' ? allQuestions : (allBySec[_actReviewSection] || []);

  // Stats for current scope (all sections by default). Writing is scored by
  // rubric, so it is not counted as Correct/Wrong.
  const objectiveCur = cur.filter(q => q.type !== 'ESSAY' && q.type !== 'ACT_WRITING');
  const correctN = objectiveCur.filter(q => q.isCorrect).length;
  const wrongN = objectiveCur.filter(q => !q.isCorrect).length;
  const filteredCur = cur.filter(q => {
    if (_actReviewFilter === 'wrong') return q.type !== 'ESSAY' && q.type !== 'ACT_WRITING' && !q.isCorrect;
    if (_actReviewFilter === 'correct') return q.type !== 'ESSAY' && q.type !== 'ACT_WRITING' && q.isCorrect;
    if (_actReviewFilter.startsWith('std:')) return q.category === _actReviewFilter.replace('std:', '');
    return true;
  });
  const totalFiltered = filteredCur.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ACT_REVIEW_PAGE_SIZE));
  if (_actReviewPage > totalPages) _actReviewPage = totalPages;
  const pageStart = totalFiltered ? (_actReviewPage - 1) * ACT_REVIEW_PAGE_SIZE : 0;
  const pageEnd = Math.min(pageStart + ACT_REVIEW_PAGE_SIZE, totalFiltered);
  const pageQuestions = filteredCur.slice(pageStart, pageEnd);
  const showingText = totalFiltered ? `Showing ${pageStart + 1}-${pageEnd} of ${totalFiltered}` : 'Showing 0 of 0';
  const firstPage = Math.max(1, Math.min(_actReviewPage - 2, totalPages - 4));
  const lastPage = Math.min(totalPages, firstPage + 4);
  const pageWindow = [];
  for (let p = firstPage; p <= lastPage; p++) pageWindow.push(p);
  const pagerHtml = `<div class="rev2-pager" aria-label="Question review pagination">
    <button class="rev2-page-btn" ${_actReviewPage <= 1 ? 'disabled' : ''} onclick="setActReviewPage(${_actReviewPage - 1})">Prev</button>
    ${pageWindow.map(p => `<button class="rev2-page-btn ${p === _actReviewPage ? 'active' : ''}" onclick="setActReviewPage(${p})">${p}</button>`).join('')}
    <button class="rev2-page-btn" ${_actReviewPage >= totalPages ? 'disabled' : ''} onclick="setActReviewPage(${_actReviewPage + 1})">Next</button>
  </div>`;
  // Section tab buttons
  const sectionColors = { english:'#1d4ed8', math:'#16a34a', reading:'#a16207', science:'#7c3aed', writing:'#db2777' };
  const sectionIcons  = { english:'', math:'', reading:'', science:'', writing:'' };
  const wrongCountFor = list => list.filter(q => q.type !== 'ESSAY' && q.type !== 'ACT_WRITING' && !q.isCorrect).length;
  const allTabHtml = `<button class="rev2-sec-tab ${_actReviewSection === 'all' ? 'active' : ''}" style="--sec-color:#190d40" onclick="setActReviewSection('all')">
      <span>All sections</span>
      <span class="tab-count" title="Wrong questions">${wrongCountFor(allQuestions)}</span>
    </button>`;
  const tabsHtml = allTabHtml + sections.map(s => {
    const active = s === _actReviewSection;
    const bsec = allBySec[s];
    return `<button class="rev2-sec-tab ${active ? 'active' : ''}" style="--sec-color:${sectionColors[s]}" onclick="setActReviewSection('${s}')">
      <span style="font-size:14px">${sectionIcons[s]}</span>
      <span>${ACT_SECTION_LABELS[s]}</span>
      <span class="tab-count" title="Wrong questions">${wrongCountFor(bsec)}</span>
    </button>`;
  }).join('');
  const filterTabsHtml = [
    { id:'all', label:'All', count:cur.length },
    { id:'wrong', label:'Wrong', count:wrongN },
    { id:'correct', label:'Correct', count:correctN },
  ].map(f => `<button class="rev2-chip ${f.id === 'wrong' ? 'wrong' : ''} ${_actReviewFilter === f.id ? 'active' : ''}" onclick="setActReviewFilter('${f.id}')">${f.label}<span class="chip-count">${f.count}</span></button>`).join('');

  const writingScore = ACT_REPORT?.derived?.writing || (ACT_QUESTIONS.writing?.[0]?.score);
  const writingReviewState = ACT_REPORT?.derived?.writingReviewState || ACT_QUESTIONS.writing?.[0]?.reviewState || 'Review pending';
  const statsHtml = _actReviewSection === 'writing'
    ? `<div class="rev2-stats">
        <div class="rev2-stat info"><div class="num">${writingScore || '—'} / 12</div><div class="lbl">Writing score</div></div>
        <div class="rev2-stat ok"><div class="num">4</div><div class="lbl">Rubric domains</div></div>
        <div class="rev2-stat info"><div class="num" style="font-size:15px;line-height:1.15">${writingReviewState}</div><div class="lbl">Review state</div></div>
      </div>`
    : `<div class="rev2-stats">
        <div class="rev2-stat ok"><div class="num">${correctN}</div><div class="lbl">Correct</div></div>
        <div class="rev2-stat bad"><div class="num">${wrongN}</div><div class="lbl">Wrong</div></div>
      </div>`;

  const flatDetailsHtml = pageQuestions.length === 0
    ? `<div style="padding:24px;text-align:center;color:#a1a1aa;font-size:12px;background:#fafafa;border:1px dashed #e4e4e7;border-radius:10px">No questions available for this section.</div>`
    : `<div class="rpt-flat-review">
        <div class="rpt-flat-review-title">${showingText} ${_actReviewSection === 'all' ? 'ACT' : ACT_SECTION_LABELS[_actReviewSection]} items</div>
        ${pageQuestions.map(q => {
          const secKey = q._sectionKey || _actReviewSection;
          const origIdx = (ACT_QUESTIONS[secKey] || []).findIndex(orig => orig.n === q.n);
          return renderQuestionDetail('act', secKey, origIdx, { hidePassage:true, hideBack:true, hideNav:true, hideReviewNav:true });
        }).join('')}
      </div>`;

  let reviewBodyHtml = flatDetailsHtml;

  if (_actReviewSection === 'reading' && pageQuestions.length) {
    const groups = [];
    pageQuestions.forEach(q => {
      const last = groups[groups.length - 1];
      if (!last || last.passage !== q.passage) groups.push({ passage: q.passage, highlight: q.passageHighlight, items: [q] });
      else last.items.push(q);
    });
    reviewBodyHtml = groups.map((group, passageIdx) => {
      let readingPassage = group.passage || '';
      if (group.highlight) readingPassage = readingPassage.replace(group.highlight, `<mark>${group.highlight}</mark>`);
      const readingDetailsHtml = group.items.map(q => {
        const origIdx = (ACT_QUESTIONS.reading || []).findIndex(orig => orig.n === q.n);
        return renderQuestionDetail('act', 'reading', origIdx, { hidePassage:true, hideBack:true, hideNav:true, hideReviewNav:true });
      }).join('');
      return `<div class="rpt-reading-review-page">
        <aside class="rpt-reading-passage">
          <div class="rp-kicker">ACT Reading passage ${passageIdx + 1} of ${groups.length}</div>
          <h4>Passage for Questions ${group.items[0].n}–${group.items[group.items.length - 1].n}</h4>
          <div class="rp-text">${readingPassage}</div>
        </aside>
        <section class="rpt-reading-review-right">
          <div class="rpt-flat-review">
            <div class="rpt-flat-review-title">${group.items.length} Reading items</div>
            ${readingDetailsHtml}
          </div>
        </section>
      </div>`;
    }).join('');
  }

  return `<div class="domain-section" id="question-review" style="margin-bottom:40px">
    <h3>Question-by-question review</h3>
    <div class="subtitle">Each section opens with all item details shown. Review your answer, the correct answer, and the explanation.</div>

    <div class="rev2-sticky-bar">
      <div class="rev2-section-tabs">${tabsHtml}</div>
      <div class="rev2-sticky-tools">
        <div class="rev2-filter-row" style="margin-bottom:0">
          <span class="rev2-filter-label">Filter</span>
          ${filterTabsHtml}
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          ${pagerHtml}
          <div class="rev2-showing">${showingText}</div>
        </div>
      </div>
    </div>

    ${reviewBodyHtml}
  </div>`;
}

function renderActQuestionReviewSummary() {
  const rows = getActReviewRows();
  // Force the report card to its own scope so the bottom overview always
  // reflects the section the user explicitly picked here, regardless of
  // any lingering filter from the detail page.
  const activeSec = (_actReviewSection && _actReviewSection !== 'all')
    ? _actReviewSection
    : 'english';
  const sections = ACT_REVIEW_SECTIONS;
  const tabHtml = sections.map(sec => {
    const isActive = sec === activeSec;
    return `<button class="qrec-tab ${isActive ? 'is-active' : ''}" onclick="setActReviewSection('${sec}')">${ACT_SECTION_LABELS[sec]}</button>`;
  }).join('');

  const sectionRows = rows.filter(q => q._sectionKey === activeSec);
  const isWritingTab = activeSec === 'writing';
  const sectionStats = actReviewStats(sectionRows);
  const accuracy = sectionStats.total
    ? Math.round((sectionStats.correct / Math.max(1, sectionStats.total - sectionStats.essay)) * 100) || 0
    : 0;

  // Stats table — overall row + reporting category rows. Writing is rubric-
  // based and now reuses the rich rubric block from the page-level Writing
  // section (renderActWritingSectionV2 in embedded mode), so this branch
  // returns the same chrome (qrec-card + tab nav) but lets the writing
  // renderer drive the body. This keeps Writing's full report (3-stat
  // strip + AI takeaway + 4 rubric cards + collapsible essay + Open
  // Writing Detail CTA) in a single canonical place instead of being
  // split between a mid-page section and a thinner version inside the tab.
  let statsTableHtml = '';
  if (isWritingTab) {
    return `<div class="qrec-card">
      <div class="qrec-tabs">${tabHtml}</div>
      ${renderActWritingSectionV2(ACT_REPORT, { embedded: true })}
    </div>`;
  } else {
    const cats = ACT_REPORTING_CATEGORIES[activeSec] || [];
    const catRows = cats.map(cat => {
      const inCat = sectionRows.filter(q => q.category === cat.code);
      const s = actReviewStats(inCat);
      const acc = s.total ? Math.round((s.correct / s.total) * 100) : 0;
      return { label:`${cat.code} · ${cat.name}`, ...s, acc };
    });
    statsTableHtml = `<table class="qrec-stats-table">
      <thead><tr><th style="text-align:left;padding-left:16px">Category</th><th>Total</th><th>Correct</th><th>Wrong</th><th>Skipped</th><th>Accuracy</th></tr></thead>
      <tbody>
        <tr class="is-overall">
          <td style="text-align:left;padding-left:16px">Overall (${ACT_SECTION_LABELS[activeSec]})</td>
          <td>${sectionStats.total}</td><td>${sectionStats.correct}</td><td>${sectionStats.wrong}</td><td>${sectionStats.blank}</td>
          <td><span class="pct ${accuracy >= 70 ? 'high' : 'zero'}">${accuracy}%</span></td>
        </tr>
        ${catRows.map(r => `<tr>
          <td style="text-align:left;padding-left:16px">${r.label}</td>
          <td>${r.total}</td><td>${r.correct}</td><td>${r.wrong}</td><td>${r.blank}</td>
          <td><span class="pct ${r.acc >= 70 ? 'high' : 'zero'}">${r.total ? r.acc + '%' : '—'}</span></td>
        </tr>`).join('') || `<tr><td style="text-align:left;padding-left:16px;color:#94a3b8" colspan="6">No reporting category breakdown available.</td></tr>`}
      </tbody>
    </table>`;
  }

  // My Answer Record — color coded grid + filter.
  // Filter values: 'all' | 'wrong' | 'blank' (Skipped) | 'correct'.
  // Order in the head matches review priority — wrong/skipped first because
  // those are what the student needs to revisit; correct comes last because
  // it has the lowest revisit value.
  const filter = ['all','wrong','blank','correct'].includes(_actReviewFilter) ? _actReviewFilter : 'all';
  const filteredCells = filter === 'all'
    ? sectionRows
    : sectionRows.filter(q => q._status === filter);
  const gridHtml = filteredCells.length
    ? filteredCells.map(q => {
        const status = q._status;
        const cls = status === 'correct' ? 'correct'
                  : status === 'wrong'   ? 'wrong'
                  : status === 'essay'   ? 'essay'
                  : 'blank';
        const tip = `${ACT_SECTION_LABELS[q._sectionKey]} · Q${q.n || (q._origIdx + 1)} · ${actReviewStatusLabel(status)}`;
        return `<button class="qrec-cell ${cls}" title="${tip}" onclick="openActQuestionDetails('all','${q._sectionKey}')">${q.n || (q._origIdx + 1)}</button>`;
      }).join('')
    : '<div class="qrec-empty">No questions to show with the current filter.</div>';

  // Pre-compute counts so each tab shows scope at a glance — saves the
  // student a click + count exercise. "All" is implicit total.
  const counts = {
    all:     sectionRows.length,
    wrong:   sectionRows.filter(q => q._status === 'wrong').length,
    blank:   sectionRows.filter(q => q._status === 'blank').length,
    correct: sectionRows.filter(q => q._status === 'correct').length,
  };
  const filterTabs = [
    { id:'all',     label:'All',     dot:'' },
    { id:'wrong',   label:'Wrong',   dot:'wrong' },
    { id:'blank',   label:'Skipped', dot:'blank' },
    { id:'correct', label:'Correct', dot:'correct' },
  ].filter(f => f.id === 'all' || counts[f.id] > 0)
   .map(f => `<button class="qrec-filter-tab ${filter === f.id ? 'is-active' : ''}" onclick="setActReviewFilter('${f.id}')">${f.dot ? `<span class="qrec-filter-dot ${f.dot}"></span>` : ''}${f.label}<span class="qrec-filter-count">${counts[f.id]}</span></button>`).join('');

  return `<div class="qrec-card">
    <div class="qrec-tabs">${tabHtml}</div>

    ${statsTableHtml}

    <div class="qrec-record-head">
      <span class="h">My Answer Record</span>
      <div class="qrec-filter-tabs">${filterTabs}</div>
    </div>
    <div class="qrec-grid">${gridHtml}</div>

    <div class="qrec-cta-row">
      <button class="qrec-cta" onclick="openActQuestionDetails('${filter}','${activeSec}')">Open in Review Mode</button>
    </div>
  </div>`;
}

function renderActQuestionDetailPage() {
  const body = document.getElementById('actQuestionDetailBody');
  if (!body) return;

  // Default to a real section if entering with the legacy 'all' scope.
  const activeSec = (_actReviewSection && _actReviewSection !== 'all')
    ? _actReviewSection
    : 'english';
  if (_actReviewSection === 'all') _actReviewSection = activeSec;

  const allRows = getActReviewRows();
  const sectionRows = allRows.filter(q => q._sectionKey === activeSec);

  // Resolve the selected question — keep current pick if it's still in
  // the active section, otherwise default to the first one.
  let selected = null;
  if (_actReviewSelected && _actReviewSelected.section === activeSec) {
    selected = sectionRows.find(q => q._origIdx === _actReviewSelected.idx) || null;
  }
  if (!selected) selected = sectionRows[0] || null;
  if (selected) {
    _actReviewSelected = { section: selected._sectionKey, idx: selected._origIdx };
  } else {
    _actReviewSelected = null;
  }

  // Subject tabs — rendered into the page header (not in body) so the user
  // can switch sections without scrolling. Wrong-count badge appears per tab.
  const tabsHtml = ACT_REVIEW_SECTIONS.map(sec => {
    const wrong = allRows.filter(q => q._sectionKey === sec && q._status === 'wrong').length;
    const isActive = sec === activeSec;
    return `<button class="tab ${isActive ? 'is-active' : ''}" onclick="setActReviewSection('${sec}')">
      ${ACT_SECTION_LABELS[sec]}${wrong ? `<span class="count">${wrong}</span>` : ''}
    </button>`;
  }).join('');
  const headerSlot = document.getElementById('actDetailHeaderTabs');
  if (headerSlot) headerSlot.innerHTML = tabsHtml;

  // Bottom grid: every question in this section, color-coded.
  const gridHtml = sectionRows.length ? sectionRows.map(q => {
    const status = q._status;
    const cls = status === 'correct' ? 'correct'
              : status === 'wrong'   ? 'wrong'
              : status === 'essay'   ? 'essay'
              : 'blank';
    const isActive = selected && selected._sectionKey === q._sectionKey && selected._origIdx === q._origIdx;
    const tip = `Q${q.n || (q._origIdx + 1)} · ${actReviewStatusLabel(status)}`;
    return `<button class="qrec-cell ${cls} ${isActive ? 'is-active' : ''}" title="${tip}" onclick="setActDetailQuestion('${q._sectionKey}', ${q._origIdx})">${q.n || (q._origIdx + 1)}</button>`;
  }).join('') : '<div class="qrec-empty">No questions in this section.</div>';

  // Prev / next within the active section.
  const curIdx = selected ? sectionRows.findIndex(q => q._origIdx === selected._origIdx) : -1;
  const prev = curIdx > 0 ? sectionRows[curIdx - 1] : null;
  const next = curIdx >= 0 && curIdx < sectionRows.length - 1 ? sectionRows[curIdx + 1] : null;

  const detailHtml = selected
    ? renderQuestionDetail('act', selected._sectionKey, selected._origIdx, { hideBack:true, hideNav:true, hideReviewNav:true })
    : '<div class="qrec-empty" style="padding:60px">No question to review in this section.</div>';

  body.innerHTML = `
    <div class="act-detail-content-shell">
      <div class="act-detail-content-card act-detail-question">${detailHtml}</div>
    </div>
    <div class="act-detail-footer">
      <div class="act-detail-footer-grid">
        <span class="grp-label">${ACT_SECTION_LABELS[activeSec]} · Q${(selected && (selected.n || selected._origIdx + 1)) || '–'} of ${sectionRows.length}</span>
        ${gridHtml}
      </div>
      <div class="act-detail-nav">
        <button onclick="setActDetailQuestion('${activeSec}', ${prev ? prev._origIdx : -1})" ${prev ? '' : 'disabled'} title="Previous question">‹</button>
        <button onclick="setActDetailQuestion('${activeSec}', ${next ? next._origIdx : -1})" ${next ? '' : 'disabled'} title="Next question">›</button>
      </div>
    </div>
  `;
}

function renderReportQuestionMap(testType, sectionKey) {
  const questions = testType === 'act' ? ACT_QUESTIONS[sectionKey] : SAT_QUESTIONS[sectionKey];
  if (!questions || questions.length === 0) return '<p style="font-size:12px;color:#a1a1aa;padding:10px">No sample questions available for this section.</p>';
  const wrongCount = questions.filter(q => q.student !== q.correct && q.student !== (q.correctAnswers||[]).find(a => a === q.student)).length;
  let h = `<button class="rpt-review-mistakes-btn" onclick="reportFilterWrong('${testType}','${sectionKey}')">🔍 Review Mistakes (${wrongCount})</button>`;
  h += '<div class="rpt-qmap">';
  questions.forEach((q, i) => {
    const isCorrect = q.type === 'GRID_IN'
      ? (q.correctAnswers || []).includes(q.student)
      : q.student === q.correct;
    const cls = isCorrect ? 'correct' : (q.student ? 'wrong' : 'skip');
    const active = reportDrillState.questionIdx === i ? ' active' : '';
    h += `<div class="rpt-qmap-cell ${cls}${active}" onclick="reportDrillQuestion('${testType}','${sectionKey}',${i})" title="Q${q.n}: ${isCorrect ? 'Correct' : 'Incorrect'}">${q.n}</div>`;
  });
  h += '</div>';
  if (reportDrillState.questionIdx !== null && reportDrillState.section === sectionKey) {
    h += renderQuestionDetail(testType, sectionKey, reportDrillState.questionIdx);
  }
  return h;
}

function renderQuestionDetail(testType, sectionKey, idx, options = {}) {
  // ACT pulls from the v2-enriched copy (adds difficulty / classCorrectPct /
  // choiceDistribution / time benchmarks). SAT and others pass through the
  // raw question object — the new chip/insight blocks render only when
  // `_enriched` is present, so non-ACT detail panes stay unchanged.
  const rawQuestions = testType === 'act' ? ACT_QUESTIONS[sectionKey] : SAT_QUESTIONS[sectionKey];
  const questions = testType === 'act'
    ? rawQuestions.map(q => enrichActQuestion(q, sectionKey))
    : rawQuestions;
  const q = questions[idx];
  if (!q) return '';
  if (testType === 'act' && (q.type === 'ESSAY' || q.type === 'ACT_WRITING')) {
    const writingScore = ACT_REPORT?.derived?.writing || q.score || '—';
    const domains = q.domainScores || ACT_REPORT?.derived?.writingDomains || {};
    const reviewState = q.reviewState || ACT_REPORT?.derived?.writingReviewState || 'Teacher review pending';
    const aw = actWritingData(q);
    const perspectivesHtml = aw.perspectives.map((p, i) => `
      <div class="act-writing-perspective-read">
        <b>${p.label || `Perspective ${i + 1}`}</b><br>${p.text || ''}
      </div>`).join('');
    const domainHtml = aw.rubricDomains.map(d => {
      const val = domains[d.label] || domains[d.label.replace(' and ', ' & ')] || 0;
      return `<div class="act-writing-domain-card">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:6px"><b>${d.label}</b><span style="font-size:12px;font-weight:900;color:#6b21a8">${val || '—'} / 12</span></div>
        <div class="d-bar"><div class="d-fill purple" style="width:${Math.round((val || 0) / 12 * 100)}%"></div></div>
        <span>${d.desc}</span>
      </div>`;
    }).join('');
    return `<div class="rpt-qdetail enriched-yes">
      <div class="qd-header">
        <div style="display:flex;align-items:center;gap:12px">
          ${options.hideBack === true ? '' : `<button class="rpt-back-btn" onclick="reportClearQuestion('${testType}','${sectionKey}')" style="margin:0">← Back</button>`}
          <span style="font-size:14px;font-weight:700;color:#190d40">ACT Writing</span>
          <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;background:#fce7f3;color:#be185d;border:1px solid #fbcfe8;border-radius:999px;font-size:11px;font-weight:800">Score ${writingScore} / 12</span>
          <span class="act-writing-review-state">${reviewState}</span>
        </div>
      </div>
      <div class="rpt-passage-box">
        <b>${aw.title}</b><br>${aw.issue}
        <div style="margin-top:12px">${perspectivesHtml}</div>
        <div style="font-size:12px;color:#52525b;line-height:1.6;margin-top:10px"><b>Essay Task —</b> Write about <em>${aw.topic}</em>. Be sure to:</div>
        <ul style="margin:4px 0 0;padding-left:20px;font-size:12px;color:#52525b;line-height:1.55">${aw.taskInstructions.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
      <div style="font-size:14px;font-weight:700;color:#190d40;margin:16px 0 8px">Your response summary</div>
      <div class="rpt-passage-box">${q.response || 'Essay response submitted for rubric review.'}</div>
      <div class="rpt-explanation">
        <h4>Writing rubric feedback</h4>
        <p>${q.explanation || 'Writing is scored with the ACT rubric across four domains.'}</p>
        <div class="act-writing-domain-grid" style="margin-top:14px">${domainHtml}</div>
        <div style="margin-top:14px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:12px;font-size:12px;color:#475569;line-height:1.55">
          <b style="color:#190d40">Next step:</b> Strengthen the relationship between your own perspective and a competing perspective with one more specific example or implication.
        </div>
      </div>
    </div>`;
  }
  const isCorrect = q.type === 'GRID_IN'
    ? (q.correctAnswers || []).includes(q.student)
    : q.student === q.correct;
  const isActReadingPassage = testType === 'act' && sectionKey === 'reading' && !!q.passage;
  const hidePassage = options.hidePassage === true;
  const hideBack = options.hideBack === true;
  const hideNav = options.hideNav === true;
  const hideReviewNav = options.hideReviewNav === true;
  let openedReadingSplit = false;
  const typeLabel = TYPE_LABELS[q.type] || q.type || 'Question';
  const pointsPossible = q.pts || 1;
  const earnedPoints = isCorrect ? pointsPossible : 0;

  let h = '<div class="rpt-qdetail enriched-' + (q._enriched ? 'yes' : 'no') + '">';
  h += `<div class="qd-header">
    <div class="rpt-qmeta">
      ${hideBack ? '' : `<button class="rpt-back-btn" onclick="reportClearQuestion('${testType}','${sectionKey}')" style="margin:0">← Back</button>`}
      <span style="font-size:14px;font-weight:700;color:#190d40">Question ${idx + 1} of ${questions.length}</span>
      <span class="rpt-type-pill">${typeLabel}</span>
      ${isCorrect
        ? '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;background:#dcfce7;color:#15803d;border:1px solid #bbf7d0;border-radius:999px;font-size:11px;font-weight:800">✓ Correct</span>'
        : '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;background:#fee2e2;color:#b91c1c;border:1px solid #fecaca;border-radius:999px;font-size:11px;font-weight:800">✗ Wrong</span>'}
      <span class="rpt-score-pill">${earnedPoints} / ${pointsPossible} ${pointsPossible > 1 ? 'pts' : 'pt'}</span>
    </div>
    ${hideNav ? '' : `<div class="qd-nav">
      ${idx > 0 ? `<button onclick="reportDrillQuestion('${testType}','${sectionKey}',${idx-1})">◀ Prev</button>` : ''}
      ${idx < questions.length - 1 ? `<button onclick="reportDrillQuestion('${testType}','${sectionKey}',${idx+1})">Next ▶</button>` : ''}
    </div>`}
  </div>`;

  if (q.passage && !hidePassage) {
    let pText = q.passage;
    if (q.passageHighlight) pText = pText.replace(q.passageHighlight, `<mark>${q.passageHighlight}</mark>`);
    if (isActReadingPassage) {
      openedReadingSplit = true;
      h += `<div class="rpt-reading-review-split">
        <aside class="rpt-reading-passage">
          <div class="rp-kicker">ACT Reading passage</div>
          <h4>Passage for Question ${q.n}</h4>
          <div class="rp-text">${pText}</div>
        </aside>
        <section class="rpt-reading-question">`;
    } else {
      h += `<div class="rpt-passage-box">${pText}</div>`;
    }
  }

  h += `<div style="font-size:14px;font-weight:600;color:#190d40;margin-bottom:14px">${q.stem}</div>`;

  if (q.type === 'GRID_IN') {
    h += `<div class="rpt-gridin-answer">
      <div>
        <div style="font-size:10px;font-weight:600;color:#71717a;margin-bottom:4px">Your answer</div>
        <div class="ga-student ${isCorrect ? '' : 'wrong'}">${q.student || '(blank)'}</div>
      </div>
      <div style="font-size:20px;color:#d4d4d8">→</div>
      <div>
        <div style="font-size:10px;font-weight:600;color:#71717a;margin-bottom:4px">Correct</div>
        <div class="ga-correct">${(q.correctAnswers || []).join(', ')}</div>
      </div>
    </div>`;
  } else {
    h += '<ul class="rpt-choices">';
    (q.choices || []).forEach((c, i) => {
      const letter = String.fromCharCode(65 + i);
      const isThisCorrect = letter === q.correct;
      const isThisStudent = letter === q.student;
      let cls = '', letterCls = 'neutral';
      if (isThisCorrect) { cls = 'is-correct'; letterCls = ''; }
      if (isThisStudent && !isThisCorrect) { cls = 'is-wrong'; letterCls = ''; }
      let annotation = '';
      if (isThisCorrect && isThisStudent) annotation = '<span style="font-size:10px;color:#16a34a;font-weight:700;margin-left:6px;white-space:nowrap">✓ YOUR ANSWER</span>';
      else if (isThisCorrect) annotation = '<span style="font-size:10px;color:#16a34a;font-weight:700;margin-left:6px;white-space:nowrap">✓ CORRECT</span>';
      else if (isThisStudent) annotation = '<span style="font-size:10px;color:#ef4444;font-weight:700;margin-left:6px;white-space:nowrap">✗ YOUR ANSWER</span>';
      h += `<li class="${cls}">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="ch-letter ${letterCls}">${letter}</span>
          <span style="flex:1">${c}</span>
          ${annotation}
        </div>
      </li>`;
    });
    h += '</ul>';
  }

  h += '<div class="rpt-explanation">';
  h += `<h4>💡 Explanation</h4><p>${q.explanation}</p>`;

  if (q.type === 'GRID_IN' && q.solutionSteps) {
    h += '<div class="rpt-solution-steps"><h5>📝 Solution Steps</h5><ol>';
    q.solutionSteps.forEach(step => h += `<li>${step}</li>`);
    h += '</ol></div>';
  }

  if (q.type === 'MC' && q.wrongAnalysis && !isCorrect) {
    h += '<div class="wrong-analysis"><h5>Why Other Choices Are Wrong</h5>';
    q.wrongAnalysis.forEach(wa => {
      h += `<div class="wa-item"><span class="wa-letter">${wa.label}:</span><span>${wa.reason}</span></div>`;
    });
    h += '</div>';
  }

  if (q.type === 'GRID_IN' && q.commonMistakes) {
    h += '<div class="rpt-common-mistakes"><h5>⚠️ Common Mistakes</h5><ul style="padding-left:16px">';
    q.commonMistakes.forEach(m => h += `<li>${m}</li>`);
    h += '</ul></div>';
  }
  h += '</div>';

  if (openedReadingSplit) {
    h += '</section></div>';
  }

  // Wrong-only navigation footer (existing behavior, kept for drill-in views).
  const wrongQs = questions.map((q2,i2)=>({...q2,origIdx:i2})).filter(q2 => q2.type === 'GRID_IN' ? !(q2.correctAnswers||[]).includes(q2.student) : q2.student !== q2.correct);
  const currentWrongIdx = wrongQs.findIndex(wq => wq.origIdx === idx);
  if (!hideReviewNav && wrongQs.length > 0) {
    h += '<div class="rpt-review-nav">';
    if (currentWrongIdx > 0) h += `<button onclick="reportDrillQuestion('${testType}','${sectionKey}',${wrongQs[currentWrongIdx-1].origIdx})">◀ Previous Wrong</button>`;
    else h += '<div></div>';
    if (currentWrongIdx >= 0 && currentWrongIdx < wrongQs.length - 1) h += `<button onclick="reportDrillQuestion('${testType}','${sectionKey}',${wrongQs[currentWrongIdx+1].origIdx})">Next Wrong ▶</button>`;
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function reportDrillQuestion(testType, sectionKey, idx) {
  reportDrillState = { testType, section: sectionKey, questionIdx: idx };
  if (testType === 'act') renderActReport();
  else renderSatReport();
  setTimeout(() => {
    const detail = document.querySelector('.rpt-qdetail');
    if (detail) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

function reportClearQuestion(testType, sectionKey) {
  reportDrillState = { testType: null, section: null, questionIdx: null };
  if (testType === 'act') renderActReport();
  else renderSatReport();
}

function reportFilterWrong(testType, sectionKey) {
  const questions = testType === 'act' ? ACT_QUESTIONS[sectionKey] : SAT_QUESTIONS[sectionKey];
  const firstWrong = questions.findIndex(q => q.type === 'GRID_IN' ? !(q.correctAnswers||[]).includes(q.student) : q.student !== q.correct);
  if (firstWrong >= 0) reportDrillQuestion(testType, sectionKey, firstWrong);
}

// Report view mode — 'native' (ACT reporting categories) vs 'canonical' (Kira skill graph)
let _reportSkillView = 'native';
function setReportSkillView(v) {
  _reportSkillView = v;
  renderActReport();
  setTimeout(() => {
    const anchor = document.getElementById('canonicalSectionAnchor');
    if (anchor) anchor.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 50);
}

// Quick-jump helper used by the sticky nav at the top of student score reports.
// IDs match anchors injected in renderActReport / renderSatReport.
function reportJumpTo(anchorId) {
  const el = document.getElementById(anchorId);
  if (!el) return;
  el.scrollIntoView({ behavior:'smooth', block:'start' });
}

function actBenchmarkMeta(score, bm) {
  const gap = bm - score;
  if (gap <= 0) return { cls:'met', icon:'✓', text:'Met', gap:0, fill:'#10b981' };
  if (gap <= 3) return { cls:'near', icon:'↑', text:`${gap} pts away`, gap, fill:'#f59e0b' };
  return { cls:'building', icon:'!', text:'Building', gap, fill:'#ef4444' };
}

function renderActBenchmarkTags(score, bm) {
  const meta = actBenchmarkMeta(score, bm);
  return `<div class="act-benchmark-row">
    <span class="benchmark-tag ${meta.cls}">${meta.icon} ${meta.text}</span>
    <span class="benchmark-tag value">Benchmark ${bm}</span>
    <span class="benchmark-tag value">need ${bm}</span>
  </div>`;
}

function getLowestActCategory(sectionData) {
  const rows = [];
  (sectionData.items || []).forEach(cat => {
    rows.push(cat);
    (cat.subs || []).forEach(sub => rows.push(sub));
  });
  return rows
    .filter(cat => typeof cat.pct === 'number')
    .sort((a, b) => a.pct - b.pct)[0] || null;
}

function computeActFocusAreas(coreScores, categories) {
  const below = coreScores
    .filter(s => s.score < s.bm)
    .map(s => ({ ...s, gap:s.bm - s.score, kind:'quick' }))
    .sort((a, b) => a.gap - b.gap);
  const lowestBySubject = coreScores.map(s => {
    const cat = getLowestActCategory(categories[s.k] || {});
    return cat ? { ...s, category:cat, gap:Math.max(0, s.bm - s.score), kind:'low' } : null;
  }).filter(Boolean).sort((a, b) => a.category.pct - b.category.pct);
  const picked = [];
  if (below[0]) picked.push({ ...below[0], category:getLowestActCategory(categories[below[0].k] || {}) });
  lowestBySubject.forEach(item => {
    if (picked.length >= 2) return;
    if (!picked.some(p => p.k === item.k && p.category?.name === item.category?.name)) picked.push(item);
  });
  return picked.slice(0, 2);
}

function renderActFocusAreas(coreScores, categories) {
  const items = computeActFocusAreas(coreScores, categories);
  return `<section class="act-focus-card">
    <div>
      <div class="focus-kicker">Your focus areas</div>
      <h3>Practice where it can move your score</h3>
      <div class="focus-sub">Prioritized from benchmark gaps and your lowest reporting categories.</div>
    </div>
    <div class="act-focus-list">
      ${items.map((item, idx) => {
        const cat = item.category || { name:'Reporting category', pct:0 };
        const gapText = item.gap > 0 ? `${item.gap} pts from benchmark` : 'Benchmark met';
        return `<div class="act-focus-item">
          <div class="act-focus-rank">${idx + 1}</div>
          <div>
            <div class="act-focus-main">${item.label}: ${cat.name}</div>
            <div class="act-focus-meta">Start here before broad review. This is the clearest next practice target in ${item.label}.</div>
            <div class="act-focus-stat"><span>${cat.pct}% correct</span><span>${gapText}</span></div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </section>`;
}

function renderActCategoryHeatmap(categories) {
  const sectionLabels = { english:'English', math:'Math', reading:'Reading', science:'Science' };
  const sections = ['english', 'math', 'reading', 'science'];
  const lowest = [];
  sections.forEach(sec => {
    const cat = getLowestActCategory(categories[sec] || {});
    if (cat) lowest.push(`${sec}:${cat.name}`);
  });
  return `<div id="canonicalSectionAnchor" class="rank-section">
    <h3 style="margin-bottom:8px">By ACT reporting category</h3>
    <div style="font-size:12px;color:#64748b;line-height:1.5;margin-bottom:14px">Heatmap shows percent correct within each ACT reporting category. Red outline marks the lowest category in each subject.</div>
    ${sections.map(sec => {
      const sd = categories[sec];
      if (!sd) return '';
      const rows = [];
      (sd.items || []).forEach(cat => {
        rows.push({ ...cat, depth:0 });
        (cat.subs || []).forEach(sub => rows.push({ ...sub, depth:1 }));
      });
      return `<div class="act-category-heat-section">
        <h4>${sectionLabels[sec]} <span class="section-score-pill">Score: ${sd.score} / 36</span></h4>
        <div class="sub">Rows are ${sectionLabels[sec]} reporting categories; color depth reflects percent correct.</div>
        <table class="heatmap-table">
          <thead><tr><th>Category</th><th>${sectionLabels[sec]}</th><th>Correct / Total</th></tr></thead>
          <tbody>${rows.map(cat => {
            const tone = cat.pct >= 75 ? 'high' : cat.pct >= 55 ? 'mid' : 'low';
            const key = `${sec}:${cat.name}`;
            return `<tr>
              <td style="${cat.depth ? 'padding-left:28px;color:#64748b;font-size:11px' : 'font-weight:800;color:#18181b'}">${cat.name}</td>
              <td><span class="heat-cell ${tone} ${lowest.includes(key) ? 'highlight' : ''}">${cat.pct}%</span></td>
              <td style="font-size:11px;color:#64748b;font-weight:800">${cat.correct}/${cat.total}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>`;
    }).join('')}
  </div>`;
}

// Aggregate ACT native reporting categories → canonical skill buckets via crosswalk.
// correct/total are distributed evenly across each native category's canonical members.
function computeCanonicalReportData(categoriesMap, testCode) {
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const buckets = {};
  Object.entries(categoriesMap).forEach(([secKey, sd]) => {
    sd.items.forEach(cat => {
      const nativeKey = `${testCode.toUpperCase()}:${cap(secKey)}:${cat.name}`;
      const canonicals = TEST_NATIVE_TO_CANONICAL[nativeKey] || [];
      if (!canonicals.length) return;
      canonicals.forEach(cid => {
        const b = buckets[cid] = buckets[cid] || { correct:0, total:0, sources:new Set(), sections:new Set() };
        b.correct += cat.correct / canonicals.length;
        b.total += cat.total / canonicals.length;
        b.sources.add(`${cap(secKey)} · ${cat.name}`);
        b.sections.add(secKey);
      });
    });
  });
  Object.values(buckets).forEach(b => {
    b.correct = +b.correct.toFixed(1);
    b.total = +b.total.toFixed(1);
    b.pct = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
    b.sources = [...b.sources];
    b.sections = [...b.sections];
  });
  return buckets;
}

// Inline AI commentary — a single-line "✦ AI noticed: …" strip that sits
// above each major section on the score report. Hybrid pattern: pairs with
// the AI Insights hero card so the AI voice surfaces in context, not just
// once at the top.
function renderAiCommentaryLine(html, ctaLabel, ctaHandler) {
  const cta = ctaLabel
    ? `<button class="ai-line-cta" onclick="${ctaHandler || ''}">${ctaLabel} <span class="arrow">→</span></button>`
    : '';
  return `<div class="ai-line" role="note" aria-label="AI commentary">
    <span class="ai-line-spark" aria-hidden="true">✦</span>
    <span class="ai-line-body">${html}</span>
    ${cta}
  </div>`;
}

// AI Insights — student-facing summary on the score report.
// Three multi-dimensional takeaways the hero / 4 subject cards CAN'T show:
//   1) Practice focus  — drill-down to the weakest reporting category
//      (skill level), with the section's benchmark gap folded in when the
//      same section is also the closest-below-benchmark one. Quantified ROI:
//      "30-min focused set lifts section score more than broad review".
//   2) Score spread    — pure statistical reframing: range of all four
//      section scores. When the spread is wide, AI tells the student that
//      pulling up the weakest section raises composite faster than pushing
//      the strongest one further (a non-obvious insight from a flat KPI grid).
//   3) Protect strength — only when a top section is comfortably (≥4 pts)
//      above benchmark. Recommends a light maintenance habit so the lead
//      doesn't slip while the student focuses on weaker sections.
// The earlier "Strongest" + "Approaching" duo was redundant with the hero
// (percentile + BM chip + 4 subject cards already convey both).
function renderActAiInsights(coreScores, categories, d) {
  const writingScore = d.derived?.writing;

  // ── Sort sections by margin to benchmark (used for top + tier)
  const sortedByMargin = [...coreScores].sort((a,b) => (b.score - b.bm) - (a.score - a.bm));
  const top = sortedByMargin[0];
  const topTier = top
    ? (top.score > top.bm ? 'exceed' : top.score === top.bm ? 'met' : 'below')
    : null;

  // ── Closest below-benchmark section (used to fold "X items short" into focus)
  const below = coreScores.filter(s => s.score < s.bm).sort((a,b) => (a.bm - a.score) - (b.bm - b.score));
  const near = below[0];
  const watchGap = near ? near.bm - near.score : 0;

  // ── Lowest reporting category across all sections (skill drill-down)
  const allCats = [];
  Object.entries(categories || {}).forEach(([sec, sd]) => {
    (sd.items || []).forEach(cat => {
      if (typeof cat.pct === 'number') allCats.push({ section:sec, ...cat });
    });
  });
  const lowestCat = allCats.sort((a,b) => a.pct - b.pct)[0];

  // ── Item 1 — Top Practice Focus (skill drill-down + benchmark gap merged)
  // Inline highlights (.aii-hl) wrap the noun phrases / numbers a student
  // should pin in memory: the targeted skill, the gap to benchmark.
  let focusBody = '';
  if (lowestCat) {
    const sectionLabel = ACT_SECTION_LABELS[lowestCat.section] || lowestCat.section;
    const sameSection = near && (near.label === sectionLabel);
    const gapPhrase = sameSection
      ? ` You're just <a class="aii-hl">${watchGap} correct item${watchGap === 1 ? '' : 's'} short</a> of the benchmark.`
      : '';
    focusBody = `Focus on <a class="aii-hl">${sectionLabel} · ${lowestCat.name}</a> (${lowestCat.correct} of ${lowestCat.total} correct) — a 30-minute focused set moves your section score more than broad review.${gapPhrase}`;
  } else if (near) {
    focusBody = `<a class="aii-hl">${near.label}</a> at <b>${near.score}</b> — about <a class="aii-hl">${watchGap} more correct item${watchGap === 1 ? '' : 's'}</a> would meet the readiness benchmark.`;
  }

  // ── Item 2 — Protect strength (only when a top section is comfortably above BM)
  // Note: a "Score Spread" insight used to live here, but it duplicated the
  //   horizontal-bar visualisation in the Hero card — students could already
  //   see the range at a glance. Removed to keep insights additive, not
  //   restating what the visuals already show.
  let protectBody = '';
  if (top && topTier === 'exceed' && (top.score - top.bm) >= 4) {
    protectBody = `<b>${top.label} at ${top.score}</b> sits well past benchmark. A short weekly maintenance set keeps it locked while you focus on weaker sections.`;
  }

  // ── Optional Writing tail (folded into the focus item when essay needs work)
  if (writingScore && writingScore < 8 && focusBody) {
    focusBody += ` Writing scored <b>${writingScore}/12</b> — strengthening one counter-perspective with a concrete example is a high-leverage rubric move.`;
  }

  // Top Practice Focus row — kicker carries a 🎯 emoji + red label, body
  // ends with the primary CTA inline (replaces the old footer button).
  const topFocusHtml = focusBody ? `<li class="ai-insights-item top-focus">
    <span class="kicker"><span class="ki" aria-hidden="true">🎯</span> Top Practice Focus</span>
    <span class="body">${focusBody}</span>
    <div class="cta-row">
      <button class="primary" onclick="openActPracticeFocus()">Show practice focus →</button>
    </div>
  </li>` : '';

  // Secondary rows — quieter visual; bullet emoji + grey kicker.
  const secondaryItems = [
    protectBody && { cls:'strength', icon:'🛡', kicker:'Protect Your Strength', body:protectBody }
  ].filter(Boolean);
  const secondaryHtml = secondaryItems.map(it => `<li class="ai-insights-item secondary ${it.cls}">
    <span class="bullet" aria-hidden="true">${it.icon}</span>
    <div class="content">
      <span class="kicker">${it.kicker}</span>
      <span class="body">${it.body}</span>
    </div>
  </li>`).join('');

  return `<section class="ai-insights-panel report narrative" id="ai-insights" role="region" aria-label="AI insights">
    <div class="ai-insights-head">
      <div class="ai-insights-head-left">
        <span class="ai-insights-spark" aria-hidden="true">✦</span>
        <div class="ai-insights-titles">
          <div class="ai-insights-title">AI Insights</div>
          <div class="ai-insights-sub">Personalized recommendations based on your results</div>
        </div>
      </div>
    </div>

    <ul class="ai-insights-list">${topFocusHtml}${secondaryHtml}</ul>
  </section>`;
}

