// @ts-nocheck
// Phase-2 slice: lines 5-1028 of original src/app.ts

// SVG icon helpers (matching lucide-react and phosphor icons used in real code)
const ICONS = {
  grip:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/></svg>`,
  clock:`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  plus:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  x:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  gripV:`<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><circle cx="92" cy="60" r="12"/><circle cx="164" cy="60" r="12"/><circle cx="92" cy="128" r="12"/><circle cx="164" cy="128" r="12"/><circle cx="92" cy="196" r="12"/><circle cx="164" cy="196" r="12"/></svg>`,
  listBullets:`<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><circle cx="40" cy="64" r="12"/><line x1="72" y1="64" x2="216" y2="64" stroke="currentColor" stroke-width="16" stroke-linecap="round"/><circle cx="40" cy="128" r="12"/><line x1="72" y1="128" x2="216" y2="128" stroke="currentColor" stroke-width="16" stroke-linecap="round"/><circle cx="40" cy="192" r="12"/><line x1="72" y1="192" x2="216" y2="192" stroke="currentColor" stroke-width="16" stroke-linecap="round"/></svg>`,
  caretDown:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  sparkle:`✨`,
  sliders:`<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><line x1="40" y1="128" x2="216" y2="128" stroke="currentColor" stroke-width="16" stroke-linecap="round"/><line x1="40" y1="64" x2="216" y2="64" stroke="currentColor" stroke-width="16" stroke-linecap="round"/><line x1="40" y1="192" x2="216" y2="192" stroke="currentColor" stroke-width="16" stroke-linecap="round"/><circle cx="104" cy="64" r="12" fill="white" stroke="currentColor" stroke-width="16"/><circle cx="152" cy="128" r="12" fill="white" stroke="currentColor" stroke-width="16"/><circle cx="104" cy="192" r="12" fill="white" stroke="currentColor" stroke-width="16"/></svg>`,
  dots3:`<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><circle cx="128" cy="64" r="16"/><circle cx="128" cy="128" r="16"/><circle cx="128" cy="192" r="16"/></svg>`,
  dotsH:`<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><circle cx="64" cy="128" r="16"/><circle cx="128" cy="128" r="16"/><circle cx="192" cy="128" r="16"/></svg>`,
  mc:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
  sa:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 6H3"/><path d="M21 12H3"/><path d="M15.5 18H3"/></svg>`,
  fib:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4"/></svg>`,
  bookOpen:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  essay:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  code:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
};
const TYPE_ICON = {
  MC:'mc', MS:'fib', TP:'bookOpen',
  SA:'sa', CR:'sa', FIB:'fib', RR:'bookOpen', ESSAY:'essay', ACT_WRITING:'essay', CODE:'code',
  GRIDIN:'fib', HOTTEXT:'sa',
  DRAG:'sa', INLINE:'fib', MATRIX:'fib', EQ:'code', GRAPH:'sa', HOTSPOT:'sa', AUDIO:'sa'
};

// ═══════ DATA ═══════
const GENERIC_SECTIONS = [
  { id:'g-s1', name:'Biology', questions:5, pts:20 },
  { id:'g-s2', name:'Chemistry', questions:4, pts:16 },
  { id:'g-s3', name:'Physics', questions:3, pts:12 },
];
let genericSections = [...GENERIC_SECTIONS];
let genericActiveSection = 'g-s1';
let genericNextNum = 4;

let _editorFocus = { type: null, secId: null, itemIdx: 0, subQIdx: null };

// ACT official blueprint (2025+). Core = E + M + R = 131 items / 125 min.
// Science and Writing are optional add-ons. Item counts include embedded
// field-test items that do not contribute to score points (per ACT).
const ACT_SECTIONS = [
  { id:'act-eng', name:'English', questions:50, filled:50, time:35 },
  { id:'act-math', name:'Mathematics', questions:45, filled:45, time:50 },
  { id:'act-reading', name:'Reading', questions:36, filled:36, time:40 },
  { id:'act-science', name:'Science', questions:40, filled:40, time:40, optional:true },
  { id:'act-writing', name:'Writing', questions:1, filled:1, time:40, optional:true },
];
let actActive = 'act-eng';

const SAT_SECTIONS = [
  { id:'sat-rw1', name:'R&W Module 1', questions:27, filled:27, time:32 },
  { id:'sat-rw2', name:'R&W Module 2', questions:27, filled:27, time:32, adaptive:true },
  { id:'sat-math1', name:'Math Module 1', questions:22, filled:22, time:35 },
  { id:'sat-math2', name:'Math Module 2', questions:22, filled:22, time:35, adaptive:true },
];
let satActive = 'sat-rw1';

const ACT_WRITING_DOMAINS = [
  { key:'ideas_analysis', label:'Ideas and Analysis', desc:'Clear perspective, thoughtful engagement with the issue and other perspectives.' },
  { key:'development_support', label:'Development and Support', desc:'Specific reasoning, examples, and explanation that develop the argument.' },
  { key:'organization', label:'Organization', desc:'Purposeful structure, transitions, and a sustained line of reasoning.' },
  { key:'language_conventions', label:'Language Use and Conventions', desc:'Word choice, sentence control, grammar, and mechanics.' }
];
// ACT-official Writing prompt structure (mirrors the published Sample
// Writing Prompt PDF — Issue paragraph → 3 perspectives → Essay Task
// with the four standard bullets → "Your perspective may be in full
// agreement…" foot-note). Labels intentionally use words ("Perspective
// One/Two/Three") to match how ACT prints them in the test booklet.
const ACT_WRITING_PROMPT = {
  title:'Capstone Projects and Graduation',
  topic:'capstone projects and graduation',
  issue:'Many high schools are considering whether every student should complete a capstone project before graduation — a substantial piece of independent work that synthesizes what students have learned. Supporters say capstones build research, communication, and time-management skills that colleges and employers reward. Critics worry that capstones add stress, deepen inequality between well-resourced and under-resourced schools, and pull focus from required coursework. Given how much weight high school credentials still carry, it is worth examining what is gained — and what is lost — when a capstone becomes a graduation requirement.',
  perspectives:[
    { label:'Perspective One',   text:'Capstone projects should be required of all students. Independent, sustained work is the closest thing high school offers to the kind of thinking colleges and employers actually expect.' },
    { label:'Perspective Two',   text:'Required capstones unfairly penalize students who already balance jobs, caregiving, or unstable home situations. The schools with the most resources will produce the most polished projects, widening — not closing — the gap.' },
    { label:'Perspective Three', text:'A capstone can be transformative, but only when the school commits real class time, mentorship, and flexible topics. Otherwise it becomes another box to check.' }
  ],
  taskInstructions:[
    'clearly state your own perspective on the issue and analyze the relationship between your perspective and at least one other perspective',
    'develop and support your ideas with reasoning and examples',
    'organize your ideas clearly and logically',
    'communicate your ideas effectively in standard written English'
  ],
  taskFootnote:'Your perspective may be in full agreement with any of those given, in partial agreement, or completely different.',
  directions:'You will have 40 minutes to read the prompt, plan your response, and write an essay in English. Your planning notes will not be scored.',
  planningPrompt:'Plan your position, evidence, and how you will address at least one competing perspective before drafting.'
};

// Items: standalone question | RR_PASSAGE (passage container + N attached questions)
const SAMPLE_Q = {
  // ── Generic: Biology section with a Read & Respond passage ──
  'g-s1': [
    { n:1, type:'MC', text:'Which organelle is responsible for producing ATP in eukaryotic cells?', choices:['Nucleus','Mitochondria','Ribosome','Golgi apparatus'], correct:1, pts:4 },
    { type:'RR_PASSAGE', title:'Passage: Cellular Respiration', fullText:`<p>Cellular respiration is the fundamental process by which living cells convert biochemical energy from nutrients into adenosine triphosphate (ATP), and then release waste products. In eukaryotic organisms, this complex metabolic pathway occurs primarily within the mitochondria and involves three interconnected stages.</p><p>The first stage, glycolysis, takes place in the cytoplasm. During glycolysis, one molecule of glucose (a six-carbon sugar) is broken down into two molecules of pyruvate (a three-carbon compound). This process yields a net gain of 2 ATP molecules and 2 NADH molecules, which serve as electron carriers for subsequent stages.</p><p>The second stage is the Krebs cycle (also known as the citric acid cycle), which occurs in the mitochondrial matrix. Here, each pyruvate molecule is first converted to acetyl-CoA, releasing one CO₂ molecule. The acetyl-CoA then enters the cycle, where it is systematically broken down, producing 2 CO₂ molecules, 1 ATP (via GTP), 3 NADH, and 1 FADH₂ per turn. Since each glucose molecule produces two pyruvate molecules, the Krebs cycle turns twice per glucose.</p><p>The third and final stage is the electron transport chain (ETC), located on the inner mitochondrial membrane. The NADH and FADH₂ produced in earlier stages donate their electrons to a series of protein complexes embedded in the membrane. As electrons pass through these complexes, protons (H⁺ ions) are pumped across the membrane, creating an electrochemical gradient. This gradient drives ATP synthase, which produces approximately 34 ATP molecules per glucose — making the ETC by far the most productive stage of cellular respiration.</p><p>In total, the complete aerobic respiration of one glucose molecule yields approximately 38 ATP molecules, though the actual yield in living cells is typically closer to 30–32 ATP due to various inefficiencies. This process explains why mitochondria are often referred to as the "powerhouse of the cell."</p>`, questions:[
      { n:2, type:'MC', text:'According to the passage, where does the Krebs cycle take place?', choices:['Cytoplasm','Mitochondrial matrix','Cell membrane','Nucleus'], correct:1, pts:4 },
      { n:3, type:'MC', text:'The passage states that the electron transport chain produces approximately:', choices:['2 ATP per glucose','4 ATP per glucose','34 ATP per glucose','No ATP directly'], correct:2, pts:4 },
      { n:4, type:'SA', text:'Based on the passage, explain why mitochondria are called the "powerhouse of the cell." Use specific evidence from the text.', pts:4 },
    ]},
    { n:5, type:'FIB', text:'The process by which plants convert light energy into chemical energy is called ___.', pts:4 },
    { n:6, type:'ESSAY', text:'Discuss the significance of the cell theory in modern biology.', pts:6 },
  ],
  'g-s2': [
    { n:1, type:'MC', text:'What is the atomic number of Carbon?', choices:['4','6','8','12'], correct:1, pts:4 },
    { n:2, type:'MC', text:'Which type of bond involves sharing of electron pairs?', choices:['Ionic','Metallic','Covalent','Hydrogen'], correct:2, pts:4 },
    { n:3, type:'MC', text:'What is the pH of pure water at 25°C?', choices:['0','5','7','14'], correct:2, pts:4 },
  ],
  'g-s3': [
    { n:1, type:'MC', text:"What is Newton's Second Law of Motion?", choices:['F = mv','F = ma','E = mc²','P = IV'], correct:1, pts:4 },
    { n:2, type:'SA', text:'A 5 kg object accelerates at 3 m/s². Calculate the net force.', pts:4 },
    { n:3, type:'CODE', text:'Write a Python function to calculate kinetic energy given mass and velocity.', pts:6 },
  ],

  // ── ACT English: 50 items across 5 passages × 10 — usage / mechanics +
  //    rhetoric / style. Each passage has numbered, underlined (q-ref) targets.
  //    Each question carries its own `explanation` for Review Mode.
  'act-eng': [
    {
      type:'RR_PASSAGE',
      title:'Passage I — Maria Plays Chicago',
      fullText:`<p>She had always believed that talent alone would carry her through. Moving to Chicago at nineteen, Maria <span class="q-ref" data-q="1">imagined the city's jazz clubs would of welcomed</span> her, the way her teachers in San Antonio had said they would.</p>
        <p>The reality proved far more complicated. Her first month was a series of <span class="q-ref" data-q="2">rejections, club owners would listen politely</span> before shaking their heads. <span class="q-ref" data-q="3">"We need experience, not just potential,"</span> one told her, gesturing at a bulletin board crowded with résumés.</p>
        <p><span class="q-ref" data-q="4">Maria began to realize, that she had been thinking about her career backward.</span> Instead of waiting for the perfect gig, she started showing up at jam sessions <span class="q-ref" data-q="5">— small, smoky, and frequently terrible</span>. She played for free. She watched. <span class="q-ref" data-q="6">She listened to the other musicians.</span></p>
        <p>By her sixth month in the city, the calls had begun to <span class="q-ref" data-q="7">trickle in</span>. Not headlining gigs — backup, fill-in, weeknight sets when the regular pianist was sick — but they added up. <span class="q-ref" data-q="8">Maria had finally understood that talent was the entry fee, not the prize.</span></p>
        <p><span class="q-ref" data-q="9">If anything, the rejections had been the most useful part of her first year.</span> They had pushed her into the rooms where music actually got made. <span class="q-ref" data-q="10">[A writer might consider whether to add a final sentence here that returns to the essay's opening idea.]</span></p>`,
      questions:[
        { n:1, type:'MC', ref:'imagined the city\'s jazz clubs would of welcomed', text:'Which choice best maintains standard English usage?',
          choices:['NO CHANGE','imagined the city\'s jazz clubs would have welcomed','imagined the city\'s jazz clubs would welcome','imagined the city\'s jazz clubs would of welcome'], correct:1, pts:1,
          explanation:'<b>B.</b> The conditional past requires "would have" + past participle. "Would of" is a mishearing of "would\'ve." Choice C drops the perfect aspect needed by the rest of the sentence.' },
        { n:2, type:'MC', ref:'rejections, club owners would listen politely', text:'Which choice best fixes the comma splice?',
          choices:['NO CHANGE','rejections; club owners would listen politely','rejections, with club owners listening politely','rejections — and club owners listened politely'], correct:2, pts:1,
          explanation:'<b>C.</b> The comma joins two independent clauses, creating a splice. Subordinating with "with … listening" ties the second clause to the first as a participial phrase. B is also acceptable, but C reads more naturally for a continuous description.' },
        { n:3, type:'MC', ref:'"We need experience, not just potential,"', text:'Which choice most effectively places this quotation in context?',
          choices:['NO CHANGE','At one club, a manager told her, "We need experience, not just potential,"','One owner told her, with a sigh, "We need experience, not just potential,"','"We need experience," one owner told her, "not just potential,"'], correct:0, pts:1,
          explanation:'<b>A.</b> The original is concise and follows the previous sentence cleanly with "one told her." The other choices add scene-setting that distracts from the punchline.' },
        { n:4, type:'MC', ref:'Maria began to realize, that she had been thinking about her career backward.', text:'Which choice corrects the punctuation?',
          choices:['NO CHANGE','Maria began to realize that she had been thinking about her career backward.','Maria began, to realize that she had been thinking about her career backward.','Maria began to realize: that she had been thinking about her career backward.'], correct:1, pts:1,
          explanation:'<b>B.</b> No comma is needed between the verb "realize" and the noun clause "that she had been thinking…" — the comma in the original wrongly separates a verb from its object.' },
        { n:5, type:'MC', ref:'— small, smoky, and frequently terrible', text:'Which choice best maintains a parallel list?',
          choices:['NO CHANGE','— small, smoky, and they were frequently terrible','— small, smoky and frequently were terrible','— small, smoky and frequent terribleness'], correct:0, pts:1,
          explanation:'<b>A.</b> The list of three adjectives ("small, smoky, frequently terrible") is parallel and tightly punctuated with a serial comma. The other choices break the parallel adjective structure.' },
        { n:6, type:'MC', ref:'She listened to the other musicians.', text:'Given that all choices are accurate, which one best supports the paragraph\'s focus on what Maria DID, not what she felt?',
          choices:['NO CHANGE','She felt encouraged whenever she heard new players.','She wondered if she would ever sound that good.','She remembered her teachers back in San Antonio.'], correct:0, pts:1,
          explanation:'<b>A.</b> The original keeps the paragraph in active behavior ("played," "watched," "listened"). B/C shift to feelings; D shifts to memory — both veer off topic.' },
        { n:7, type:'MC', ref:'trickle in', text:'Which choice best matches the tone and pace described in the rest of the sentence?',
          choices:['NO CHANGE','flood in','arrive instantaneously','suddenly start'], correct:0, pts:1,
          explanation:'<b>A.</b> "Trickle in" matches the slow, gradual buildup the rest of the sentence describes. "Flood" and "instantly" exaggerate the pace.' },
        { n:8, type:'MC', ref:'Maria had finally understood that talent was the entry fee, not the prize.', text:'Which choice best concludes the paragraph by tying it back to the opening of the essay?',
          choices:['NO CHANGE','Maria had built a network of musicians she could rely on.','Maria still had a long way to go before she became famous.','Maria knew that she had earned every gig.'], correct:0, pts:1,
          explanation:'<b>A.</b> The opening line claimed "talent alone would carry her through." This sentence reframes that belief: talent is the entry fee, not the prize. The other options drift to network, fame, or merit, missing the callback.' },
        { n:9, type:'MC', ref:'If anything, the rejections had been the most useful part of her first year.', text:'Which choice best opens the final paragraph?',
          choices:['NO CHANGE','In any case, the rejections had been the worst part of her first year.','Surprisingly, the rejections had been the best part of her first year.','To her credit, the rejections had been the most useful part of her first year.'], correct:0, pts:1,
          explanation:'<b>A.</b> "If anything" invites the reader to revise an expectation — that rejection should be discouraging — and matches the paragraph\'s argument. The other choices either contradict the essay (B), overstate (C), or misattribute (D).' },
        { n:10, type:'MC', ref:'[A writer might consider whether to add a final sentence here…]', text:'Suppose the writer\'s primary purpose is to leave the reader with the essay\'s central insight about effort and recognition. Should the writer add the following sentence here? "She still believed in talent — only now she understood what surrounded it."',
          choices:['Yes, because it echoes the opening line and restates the new understanding.','Yes, because it introduces a new idea about her career.','No, because it weakens the closing image.','No, because it shifts focus to other musicians.'], correct:0, pts:1,
          explanation:'<b>A.</b> A strong closing sentence loops back to the essay\'s opening claim ("talent alone would carry her through") and reframes it. B is wrong because the idea is not new; C and D misread the sentence.' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage II — The Bloom of Urban Gardens',
      fullText:`<p>Community gardens have <span class="q-ref" data-q="11">transformed</span> vacant lots across American cities. In Detroit <span class="q-ref" data-q="12">alone over 1,400 urban farms and gardens</span> now produce fresh food for residents who once had little access to it. These spaces <span class="q-ref" data-q="13">serve multiple purposes — beyond agriculture, they create gathering places, teach children where food comes from, and revive neighborhoods that had been written off.</span></p>
        <p>Skeptics <span class="q-ref" data-q="14">argues</span> that the gardens cannot scale — a few raised beds, however charming, will not feed a city. <span class="q-ref" data-q="15">[A]</span> But the case for gardens has never been only about calories. <span class="q-ref" data-q="16">When residents come together to manage shared land, they build the kind of trust that civic life depends on, and they redefine what a vacant lot can be.</span></p>
        <p>The economic argument <span class="q-ref" data-q="17">is also stronger then critics allow.</span> A 2022 study estimated that the average urban garden saves participating households $400 per year on produce. <span class="q-ref" data-q="18">[B]</span> Multiplied across thousands of gardens nationwide, the savings approach the operating budget of a midsize federal program.</p>
        <p>Cities that <span class="q-ref" data-q="19">have invested most heavily — Cleveland, Philadelphia, and Atlanta among them —</span> have seen measurable drops in nearby grocery prices. <span class="q-ref" data-q="20">[C] Whether community gardens can replace industrial agriculture is the wrong question; whether they can change the texture of a neighborhood is the right one.</span></p>`,
      questions:[
        { n:11, type:'MC', ref:'transformed', text:'Which choice most precisely fits the sentence?',
          choices:['NO CHANGE','metamorphosed','reimagined','reconfigured'], correct:0, pts:1,
          explanation:'<b>A.</b> "Transformed" is the natural choice here — direct and vivid. "Metamorphosed" is overstated; "reimagined" suggests visualization, not change; "reconfigured" sounds technical.' },
        { n:12, type:'MC', ref:'alone over 1,400 urban farms and gardens', text:'Which choice corrects the punctuation?',
          choices:['NO CHANGE','alone, over 1,400 urban farms and gardens','alone; over 1,400 urban farms and gardens','alone — over, 1,400 urban farms and gardens'], correct:1, pts:1,
          explanation:'<b>B.</b> "In Detroit alone" is an introductory phrase and should be set off by a comma before the main clause begins.' },
        { n:13, type:'MC', ref:'serve multiple purposes — beyond agriculture, they create gathering places, teach children where food comes from, and revive neighborhoods that had been written off.', text:'Given that all of the choices are accurate, which one best supports the essay\'s claim that gardens are valuable beyond their food production?',
          choices:['NO CHANGE','serve multiple purposes, including the production of vegetables and fruit.','have multiple agricultural functions worth studying.','offer a steady supply of fresh produce year-round.'], correct:0, pts:1,
          explanation:'<b>A.</b> Only A enumerates non-agricultural benefits (gathering places, education, neighborhood revival), which is exactly what the surrounding paragraphs argue.' },
        { n:14, type:'MC', ref:'argues', text:'Which choice provides the correct subject-verb agreement?',
          choices:['NO CHANGE','argue','is arguing','was arguing'], correct:1, pts:1,
          explanation:'<b>B.</b> "Skeptics" is plural; the verb must be "argue."' },
        { n:15, type:'MC', ref:'[A]', text:'For the purpose of the essay, the writer wants to add the following sentence at one of the marked points: "It is true that no community garden, on its own, can feed a city of millions." Where should the sentence be placed?',
          choices:['Point [A]','Point [B]','Point [C]','It should NOT be added.'], correct:0, pts:1,
          explanation:'<b>A.</b> The new sentence concedes the skeptics\' point and naturally precedes the rebuttal that follows ("But the case for gardens has never been only about calories"). [B] and [C] sit deep in the rebuttal.' },
        { n:16, type:'MC', ref:'When residents come together to manage shared land, they build the kind of trust that civic life depends on, and they redefine what a vacant lot can be.', text:'Which choice best maintains the writer\'s focus on the social, rather than agricultural, value of urban gardens?',
          choices:['NO CHANGE','When residents come together to manage shared land, the produce yields are higher than at typical small farms.','When residents come together to manage shared land, the gardens become tourist destinations.','When residents come together to manage shared land, no one has to weed alone.'], correct:0, pts:1,
          explanation:'<b>A.</b> The original explicitly names the social value (trust, civic life). The others drift to yields, tourism, or a small joke.' },
        { n:17, type:'MC', ref:'is also stronger then critics allow.', text:'Which choice corrects the wording?',
          choices:['NO CHANGE','is also stronger than critics allow.','is also more stronger than critics allow.','also being stronger than critics allow.'], correct:1, pts:1,
          explanation:'<b>B.</b> The comparison word is "than," not "then."' },
        { n:18, type:'MC', ref:'[B]', text:'Which sentence, if added at point [B], would most logically support the economic argument in the same paragraph?',
          choices:['Many gardens are organized as nonprofit cooperatives.','That figure varies by region and by the size of the household plot.','Detroit\'s mayor has championed the city\'s garden program for years.','Some critics argue the savings are exaggerated.'], correct:1, pts:1,
          explanation:'<b>B.</b> A qualifier about the variation in the $400 figure deepens the economic claim. A and C are off-topic; D contradicts the paragraph the writer is building.' },
        { n:19, type:'MC', ref:'have invested most heavily — Cleveland, Philadelphia, and Atlanta among them —', text:'Which choice most clearly preserves the parenthetical list of cities?',
          choices:['NO CHANGE','have invested most heavily, Cleveland, Philadelphia and Atlanta among them,','have invested most heavily; Cleveland, Philadelphia, and Atlanta among them;','have invested most heavily, Cleveland; Philadelphia; and Atlanta among them,'], correct:0, pts:1,
          explanation:'<b>A.</b> Em dashes mark a parenthetical list cleanly. B uses commas around an internally-comma\'d list (confusing); C and D misuse semicolons.' },
        { n:20, type:'MC', ref:'[C] Whether community gardens can replace industrial agriculture is the wrong question; whether they can change the texture of a neighborhood is the right one.', text:'Which choice provides the most effective conclusion to the essay?',
          choices:['NO CHANGE','Industrial agriculture remains the dominant source of food in the country.','Community gardens are growing in popularity nationwide.','Cities should consider funding more community gardens in the years ahead.'], correct:0, pts:1,
          explanation:'<b>A.</b> The original reframes the debate ("wrong question / right question"), echoing the essay\'s thesis. The others restate facts or recommendations without insight.' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage III — Galileo and the Moons of Jupiter',
      fullText:`<p>When Galileo first pointed his telescope at <span class="q-ref" data-q="21">Jupiter, in 1610,</span> he observed four small "stars" that moved from night to night. <span class="q-ref" data-q="22">These were, in fact, the planet's largest moons.</span> The discovery <span class="q-ref" data-q="23">was important because it</span> challenged the prevailing geocentric model of the solar system.</p>
        <p><span class="q-ref" data-q="24">Until Galileo's observations, most European astronomers had taken for granted that all celestial bodies orbited Earth.</span> Jupiter's moons, by contrast, plainly orbited Jupiter. <span class="q-ref" data-q="25">If celestial bodies could orbit something other than Earth, the foundational assumption of the geocentric model began to look fragile.</span></p>
        <p>Galileo's <span class="q-ref" data-q="26">finding's</span> drew immediate attention — and resistance. Some critics refused even to look through his telescope, <span class="q-ref" data-q="27">they were convinced</span> that the instrument itself produced illusions. <span class="q-ref" data-q="28">[D]</span></p>
        <p>The four moons Galileo observed are now known as the Galilean moons: Io, Europa, Ganymede, and Callisto. They are <span class="q-ref" data-q="29">[along] with the Moon</span> the only natural satellites visible to the naked eye, and they remain among the most studied objects in the solar system. <span class="q-ref" data-q="30">A telescope no more powerful than Galileo's can still resolve them today, more than four centuries after their discovery.</span></p>`,
      questions:[
        { n:21, type:'MC', ref:'Jupiter, in 1610,', text:'Which choice most appropriately punctuates the year?',
          choices:['NO CHANGE','Jupiter — in 1610 —','Jupiter in 1610,','Jupiter, 1610,'], correct:2, pts:1,
          explanation:'<b>C.</b> The phrase "in 1610" is essential to the sentence and should not be set off by commas. "When Galileo first pointed his telescope at Jupiter in 1610, he observed…" reads cleanly without commas around the date.' },
        { n:22, type:'MC', ref:'These were, in fact, the planet\'s largest moons.', text:'Which choice best emphasizes the surprising nature of the discovery?',
          choices:['NO CHANGE','In fact, these moving "stars" were not stars at all but Jupiter\'s four largest moons.','These were the four largest moons of Jupiter.','As it turned out, the planet had moons.'], correct:1, pts:1,
          explanation:'<b>B.</b> The fuller sentence highlights the contrast (not stars but moons) and makes the discovery feel surprising. A is acceptable but flat; C drops the contrast; D is colloquial.' },
        { n:23, type:'MC', ref:'was important because it', text:'Which choice is the most concise without losing meaning?',
          choices:['NO CHANGE','mattered because it','was significant since it','— important because it'], correct:1, pts:1,
          explanation:'<b>B.</b> "Mattered because it" is the leanest phrasing; A and C are wordier; D is awkward punctuation.' },
        { n:24, type:'MC', ref:'Until Galileo\'s observations, most European astronomers had taken for granted that all celestial bodies orbited Earth.', text:'Which choice best transitions from the previous paragraph to this one?',
          choices:['NO CHANGE','In Galileo\'s era, telescopes had only just been invented.','Italy was a hub of scientific debate during the Renaissance.','Astronomy was a controversial field in the 1600s.'], correct:0, pts:1,
          explanation:'<b>A.</b> The original sets up the central contrast — "Earth-centered model" vs. moons orbiting Jupiter — that the next sentence depends on. The others provide background that is not used.' },
        { n:25, type:'MC', ref:'If celestial bodies could orbit something other than Earth, the foundational assumption of the geocentric model began to look fragile.', text:'Which choice best preserves the writer\'s argument?',
          choices:['NO CHANGE','The geocentric model needed updating, of course.','It would take some time before everyone accepted the new view.','By the way, the geocentric model was very old.'], correct:0, pts:1,
          explanation:'<b>A.</b> Only A states the logical consequence the paragraph requires. The others soften, sidestep, or change topic.' },
        { n:26, type:'MC', ref:'finding\'s', text:'Which choice corrects the apostrophe error?',
          choices:['NO CHANGE','findings','findings\'','finding'], correct:1, pts:1,
          explanation:'<b>B.</b> The plural "findings" needs no apostrophe. "Finding\'s" is possessive; "findings\'" is plural-possessive; "finding" is singular.' },
        { n:27, type:'MC', ref:'they were convinced', text:'Which choice best fixes the comma splice?',
          choices:['NO CHANGE','convinced','being convinced','because they were convinced'], correct:3, pts:1,
          explanation:'<b>D.</b> Adding "because" subordinates the second clause and eliminates the splice while preserving the causal relationship.' },
        { n:28, type:'MC', ref:'[D]', text:'Suppose the writer wants to add the sentence "Resistance to new instruments was, ironically, a recurring theme in the early history of science." Should the writer add it at point [D]?',
          choices:['Yes, because it generalizes from Galileo\'s case to a broader pattern that closes the paragraph.','Yes, because it introduces a new topic for the next paragraph.','No, because it contradicts the previous sentence.','No, because it is too informal in tone.'], correct:0, pts:1,
          explanation:'<b>A.</b> The sentence steps back from the specific anecdote to the broader theme — a natural paragraph closer.' },
        { n:29, type:'MC', ref:'[along] with the Moon', text:'Which choice corrects the punctuation around the parenthetical phrase?',
          choices:['NO CHANGE','along, with the Moon,','— along with the Moon —',', along with the Moon,'], correct:3, pts:1,
          explanation:'<b>D.</b> "Along with the Moon" is a non-essential phrase; commas are the standard mark for setting it off in this register.' },
        { n:30, type:'MC', ref:'A telescope no more powerful than Galileo\'s can still resolve them today, more than four centuries after their discovery.', text:'Which choice provides the most effective ending to the essay?',
          choices:['NO CHANGE','In the future, even more moons may be discovered around Jupiter.','Galileo wrote about the discovery in his book Sidereus Nuncius.','Jupiter is the largest planet in our solar system.'], correct:0, pts:1,
          explanation:'<b>A.</b> The original closes by linking the past to the present (the same telescope still works), reinforcing the essay\'s theme of enduring importance. The others drift to future facts, books, or trivia.' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage IV — The Quiet Cost of Convenience',
      fullText:`<p>The average American generates over 1,500 data points per day through digital interactions. <span class="q-ref" data-q="31">From GPS tracking to social media,</span> personal information flows continuously to corporations. <span class="q-ref" data-q="32">Few users understand the scope of this data collection, and fewer still read the lengthy terms of service that authorize it.</span></p>
        <p><span class="q-ref" data-q="33">Convenient apps that handle email, calendars, and shopping seem to ask little in return.</span> The cost is paid in <span class="q-ref" data-q="34">information — small pieces of which</span>, when combined, can describe a user\'s habits with unsettling precision. A pattern of late-night searches, a series of grocery deliveries, and a pair of fitness check-ins are <span class="q-ref" data-q="35">enough, together,</span> to estimate sleep schedules, dietary trends, and household composition.</p>
        <p><span class="q-ref" data-q="36">[E]</span> European regulators have responded with rules that force companies to disclose what they collect and to delete it on request. American policy <span class="q-ref" data-q="37">has been more piecemeal,</span> varying by state and industry. <span class="q-ref" data-q="38">[F]</span></p>
        <p>Privacy advocates argue that <span class="q-ref" data-q="39">the issue is not so much whether data is collected, but whether the people whose data it is have any meaningful say.</span> Individual users have little leverage; <span class="q-ref" data-q="40">a single person cannot reasonably negotiate the terms of every service they touch.</span></p>`,
      questions:[
        { n:31, type:'MC', ref:'From GPS tracking to social media,', text:'Which choice best continues the sentence with relevant examples?',
          choices:['NO CHANGE','From the most innocent to the most invasive forms,','From the moment a phone is unlocked,','From dawn to dusk every day,'], correct:0, pts:1,
          explanation:'<b>A.</b> The original lists two specific data sources (GPS, social media) that flow naturally into "personal information flows continuously." The others are vague.' },
        { n:32, type:'MC', ref:'Few users understand the scope of this data collection, and fewer still read the lengthy terms of service that authorize it.', text:'Which choice best maintains the writer\'s emphasis on user awareness?',
          choices:['NO CHANGE','Some users feel uneasy about how much data is collected.','Many companies make their privacy policies hard to find.','Privacy laws have changed dramatically over the past decade.'], correct:0, pts:1,
          explanation:'<b>A.</b> Only A keeps the focus on what users do (or don\'t) understand and read. The others shift to feelings, company behavior, or law.' },
        { n:33, type:'MC', ref:'Convenient apps that handle email, calendars, and shopping seem to ask little in return.', text:'Which choice best opens the paragraph by introducing the central tension between convenience and cost?',
          choices:['NO CHANGE','Apps for email, calendars, and shopping have become extremely popular.','Smartphones now hold more processing power than 1990s desktops.','The Internet, once a novelty, is now a daily fixture in American homes.'], correct:0, pts:1,
          explanation:'<b>A.</b> The original sentence sets up the rest of the paragraph: convenience seems free, but a cost is paid. The others drift to popularity, hardware, or history.' },
        { n:34, type:'MC', ref:'information — small pieces of which', text:'Which choice corrects the punctuation?',
          choices:['NO CHANGE','information, small pieces of which','information; small pieces of which','information: small pieces of which'], correct:1, pts:1,
          explanation:'<b>B.</b> A simple comma cleanly attaches the relative phrase to "information." Em dashes are dramatic for this register; semicolons and colons require independent clauses.' },
        { n:35, type:'MC', ref:'enough, together,', text:'Which choice clarifies the sentence?',
          choices:['NO CHANGE','enough together','enough, when taken together,','enough'], correct:2, pts:1,
          explanation:'<b>C.</b> "When taken together" makes explicit how the data points combine. The original is ambiguous; B drops the commas needed; D loses meaning.' },
        { n:36, type:'MC', ref:'[E]', text:'Suppose the writer wants to insert the sentence "Public concern about data privacy has grown sharply in the past decade." Where would it best fit?',
          choices:['At point [E], to set up the regulatory response.','At point [F], to summarize the previous paragraph.','In paragraph 1, before the data-points figure.','It should not be added.'], correct:0, pts:1,
          explanation:'<b>A.</b> The sentence introduces a "concern → regulation" arc that the next sentence develops. [F] and paragraph 1 are weaker fits.' },
        { n:37, type:'MC', ref:'has been more piecemeal,', text:'Which choice best maintains the contrast with European regulators?',
          choices:['NO CHANGE','has been a complete success,','has been less ambitious,','has been steadily improving,'], correct:0, pts:1,
          explanation:'<b>A.</b> "Piecemeal" precisely contrasts a unified European framework with a fragmented U.S. approach. The others either overstate or change the comparison.' },
        { n:38, type:'MC', ref:'[F]', text:'For the purpose of the essay, which sentence, if added at [F], would most usefully extend the regulatory contrast?',
          choices:['California has passed the strongest state-level privacy law to date.','Smartphones are widely used in both regions.','Most companies operate globally now.','American consumers spend many hours online each week.'], correct:0, pts:1,
          explanation:'<b>A.</b> A specific U.S. example (California) extends the contrast. The other choices are general or off-topic.' },
        { n:39, type:'MC', ref:'the issue is not so much whether data is collected, but whether the people whose data it is have any meaningful say.', text:'Which choice corrects the parallel construction?',
          choices:['NO CHANGE','the issue is not whether data is collected, but whether the people whose data it is have any meaningful say.','the issue is not so much whether data is collected, but whether the people whose data it is have any meaningful say in the matter.','the issue is not whether data is collected so much as whether the people whose data it is have any meaningful say.'], correct:3, pts:1,
          explanation:'<b>D.</b> The standard "not X so much as Y" construction reads more cleanly than "not so much X but Y" (the original is mid-construction; B drops the qualifier; C just adds words).' },
        { n:40, type:'MC', ref:'a single person cannot reasonably negotiate the terms of every service they touch.', text:'Which choice provides the most effective ending to the essay?',
          choices:['NO CHANGE','a single person should always read every privacy policy carefully.','companies have made privacy policies long and difficult to read.','privacy is a complicated topic with many sides.'], correct:0, pts:1,
          explanation:'<b>A.</b> The original delivers the essay\'s thesis: individuals have no real leverage. The others either retreat to platitudes (B/D) or restate already-mentioned facts (C).' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage V — Saving the Reefs',
      fullText:`<p>Coral reefs <span class="q-ref" data-q="41">support approximately 25% of all marine species despite covering less than 1% of the ocean floor.</span> Rising sea temperatures threaten these vital ecosystems, and <span class="q-ref" data-q="42">scientists are exploring innovative restoration techniques that range from coral nurseries to assisted evolution.</span></p>
        <p>One promising approach involves <span class="q-ref" data-q="43">"super corals,"</span> strains bred or selected for their ability to tolerate warmer water. <span class="q-ref" data-q="44">[G]</span> Researchers identify wild colonies that survived previous bleaching events, propagate fragments of those colonies in nurseries, and transplant the offspring back onto degraded reefs.</p>
        <p>Critics worry that <span class="q-ref" data-q="45">the focus on heat tolerance ignores other stressors — pollution, overfishing, and ocean acidification — that also batter reefs.</span> A reef stocked with heat-resistant coral may still collapse if the surrounding water is poisoned by runoff or stripped of its herbivorous fish. <span class="q-ref" data-q="46">Restoration without protection</span> is a treadmill: progress is gained in one direction and lost in another.</p>
        <p>Still, the work continues. <span class="q-ref" data-q="47">[H] Volunteers in Florida, Australia, and the Philippines have planted millions of coral fragments in the past five years.</span> The pace of restoration <span class="q-ref" data-q="48">remain</span> far slower than the pace of bleaching, but each transplanted colony buys the reef a little more time. <span class="q-ref" data-q="49">It also gives researchers more data about which corals survive and why.</span> <span class="q-ref" data-q="50">For an ecosystem this fragile, time and data are exactly what is needed.</span></p>`,
      questions:[
        { n:41, type:'MC', ref:'support approximately 25% of all marine species despite covering less than 1% of the ocean floor.', text:'Which choice best opens the essay by establishing the high stakes?',
          choices:['NO CHANGE','are colorful underwater landscapes that attract tourists from around the world.','have been studied for decades by marine biologists with great interest.','can be found in tropical waters across multiple oceans.'], correct:0, pts:1,
          explanation:'<b>A.</b> The biodiversity-vs-area contrast (25% vs <1%) frames the stakes immediately. The others sound like brochure copy.' },
        { n:42, type:'MC', ref:'scientists are exploring innovative restoration techniques that range from coral nurseries to assisted evolution.', text:'Which choice most logically connects to the next paragraph?',
          choices:['NO CHANGE','scientists worry the situation is hopeless.','scientists have published thousands of papers on coral biology.','scientists from many countries collaborate on coral research.'], correct:0, pts:1,
          explanation:'<b>A.</b> The original previews two techniques (nurseries, assisted evolution), one of which the next paragraph discusses. The other choices do not lead into "super corals."' },
        { n:43, type:'MC', ref:'"super corals,"', text:'Which choice correctly punctuates the introduced term?',
          choices:['NO CHANGE','"super corals":','"super corals" —','"super corals";'], correct:0, pts:1,
          explanation:'<b>A.</b> The comma after the closing quotation mark cleanly attaches the appositive ("strains bred or selected…").' },
        { n:44, type:'MC', ref:'[G]', text:'Suppose the writer wants to add the sentence "These hardier strains are sometimes 2–4°C more heat-tolerant than typical wild coral." Should it be added at [G]?',
          choices:['Yes, because it gives a concrete measure of what makes "super corals" different.','Yes, because it introduces a new topic for the next paragraph.','No, because it contradicts the previous sentence.','No, because the previous sentence already makes the same point.'], correct:0, pts:1,
          explanation:'<b>A.</b> The 2–4°C figure quantifies the abstract claim that they "tolerate warmer water." The other reasons misread the context.' },
        { n:45, type:'MC', ref:'the focus on heat tolerance ignores other stressors — pollution, overfishing, and ocean acidification — that also batter reefs.', text:'Which choice provides the most precise enumeration of the threats?',
          choices:['NO CHANGE','the focus on heat tolerance ignores other stressors — among other things — that also batter reefs.','the focus on heat tolerance ignores other things which damage reefs.','the focus on heat tolerance does not address every problem reefs are facing.'], correct:0, pts:1,
          explanation:'<b>A.</b> Naming the three stressors gives the criticism teeth. The other choices replace specifics with vague language.' },
        { n:46, type:'MC', ref:'Restoration without protection', text:'Which choice provides the most effective transition into the next sentence?',
          choices:['NO CHANGE','Coral nurseries','Heat tolerance studies','Marine biologists'], correct:0, pts:1,
          explanation:'<b>A.</b> The "treadmill" image follows directly from "restoration without protection." The other subjects do not fit the metaphor.' },
        { n:47, type:'MC', ref:'[H] Volunteers in Florida, Australia, and the Philippines have planted millions of coral fragments in the past five years.', text:'Which sentence, if added at [H], would best lead into the volunteer effort?',
          choices:['Coral biology is poorly understood by the general public.','Around the world, citizen scientists have joined the restoration effort.','Marine ecosystems are extraordinarily complex.','Many tropical countries depend on reef tourism.'], correct:1, pts:1,
          explanation:'<b>B.</b> "Citizen scientists" frames the volunteer effort that the next sentence describes. The other choices are background, not setup.' },
        { n:48, type:'MC', ref:'remain', text:'Which choice provides the correct subject-verb agreement?',
          choices:['NO CHANGE','remains','have remained','were remaining'], correct:1, pts:1,
          explanation:'<b>B.</b> The subject is "the pace" — singular — so the verb should be "remains."' },
        { n:49, type:'MC', ref:'It also gives researchers more data about which corals survive and why.', text:'Which choice best supports the essay\'s argument that restoration has multiple benefits?',
          choices:['NO CHANGE','Researchers usually publish findings in peer-reviewed journals.','Most coral species are still difficult to identify in the field.','Volunteers come from all walks of life.'], correct:0, pts:1,
          explanation:'<b>A.</b> Only A names a second benefit (data on which corals survive), reinforcing the multi-benefit argument.' },
        { n:50, type:'MC', ref:'For an ecosystem this fragile, time and data are exactly what is needed.', text:'Which choice provides the most fitting closing for the essay?',
          choices:['NO CHANGE','Reef tourism contributes billions of dollars to many national economies.','Coral biologists deserve more public funding.','Climate change is driving many ecological changes worldwide.'], correct:0, pts:1,
          explanation:'<b>A.</b> The closing sentence ties together the two benefits highlighted in the paragraph (time, data) and the essay\'s framing of the reef\'s fragility.' }
      ]
    }
  ],

  // ── ACT Reading: long passage (~750 words) with 9 questions ──
  'act-reading': [
    { type:'RR_PASSAGE', title:'Passage A — Literary Narrative', fullText:`<p><span class="q-ref" data-q="1">The morning light filtered through the kitchen window as Elena watched her grandmother knead the dough with practiced hands. Each fold carried decades of memory</span> — of harvests and hunger, of celebrations that spanned generations in their small village outside Oaxaca.</p><p>"You're not paying attention," Abuela said without looking up. Her fingers worked the masa with a rhythm that seemed as natural as breathing, pressing and turning, pressing and turning. "The dough tells you when it's ready. You have to listen."</p><p><span class="q-ref" data-q="2">She had come to spend the summer with her grandmother partly out of obligation — her mother's gentle insistence — and partly out of a vague curiosity</span> about the life her family had left behind when they moved to Phoenix. But after two weeks of early mornings and flour-dusted afternoons, <span class="q-ref" data-q="3">the romantic notion of "connecting with her roots" had given way to the tedium of repetition</span>.</p><p>"I am listening," Elena said, though <span class="q-ref" data-q="4">her mind had already drifted to the messages piling up on her phone, hidden in the pocket of her apron</span>. Her friends were at the lake today. She could picture them: sunburned and laughing, posting stories she would scroll through later with an ache she couldn't quite name.</p><p>Abuela paused her work and looked at Elena with eyes that held neither judgment nor sympathy — just a steady, unsentimental clarity. <span class="q-ref" data-q="5">"When I was your age, I didn't want to learn this either. I wanted to go to the city, become a teacher, wear shoes that weren't covered in cornmeal."</span> She resumed kneading. <span class="q-ref" data-q="6">"But your great-grandmother told me something I didn't understand until much later: the things we carry forward aren't always the things we choose."</span></p><p>Elena picked up her own ball of dough and began to work it, mimicking her grandmother's movements. The masa was cool and slightly sticky. She pressed too hard, and it spread thin in the center.</p><p><span class="q-ref" data-q="7">"Gentle," Abuela corrected. "You're not fighting it. You're shaping it."</span></p><p>There was something in the correction that went beyond cooking technique. Elena adjusted her pressure, and for a moment — just a moment — she felt the dough respond, <span class="q-ref" data-q="8">yielding</span> into a smooth, even disc.</p><p><span class="q-ref" data-q="9">"There," Abuela said, and the single word carried more warmth than any praise Elena could remember receiving. The kitchen fell silent except for the rhythmic pat-pat of their work, and Elena realized she had stopped thinking about the lake.</span></p>`, questions:[
      { n:1, type:'MC', ref:'Paragraph 1, lines 1–2', text:"The narrator's description of the grandmother's hands in the first paragraph primarily serves to:", choices:['Emphasize her physical strength','Convey expertise and generational knowledge','Create a sense of foreboding','Establish the time period of the story'], correct:1, pts:1 },
      { n:2, type:'MC', ref:'Paragraph 3, lines 1–2', text:'Based on the passage, Elena\'s primary motivation for visiting her grandmother was:', choices:['A deep desire to learn traditional cooking','Her mother\'s encouragement and mild curiosity','A school assignment about family history','An escape from problems at home'], correct:1, pts:1 },
      { n:3, type:'MC', ref:'Paragraph 3, line 4', text:'The phrase "romantic notion of connecting with her roots" (paragraph 3) suggests that Elena had:', choices:['An idealized expectation that didn\'t match reality','A strong emotional bond with her heritage','No interest in her grandmother\'s life','A plan to write about her experience'], correct:0, pts:1 },
      { n:4, type:'MC', ref:'Paragraph 4, lines 1–2', text:'The detail about Elena\'s phone hidden in her apron pocket most likely functions to:', choices:['Show that Elena is irresponsible','Illustrate the tension between Elena\'s present life and her grandmother\'s world','Suggest that technology is harmful','Indicate that Elena is expecting an important message'], correct:1, pts:1 },
      { n:5, type:'MC', ref:'Paragraph 5, lines 2–3', text:'Abuela\'s story about wanting to "go to the city, become a teacher" serves to:', choices:['Criticize Elena for being ungrateful','Show that she regrets not pursuing her dreams','Create a parallel between her younger self and Elena','Explain why she stayed in the village'], correct:2, pts:1 },
      { n:6, type:'MC', ref:'Paragraph 5, lines 4–5', text:'The great-grandmother\'s statement that "the things we carry forward aren\'t always the things we choose" most nearly means:', choices:['People should resist family traditions','Cultural knowledge is passed down whether we want it or not','Choices are more important than inheritance','Life is unpredictable'], correct:1, pts:1 },
      { n:7, type:'MC', ref:'Paragraph 7', text:'The correction "You\'re not fighting it. You\'re shaping it" functions on which two levels?', choices:['Literal cooking instruction and metaphor for Elena\'s relationship with her heritage','Criticism of Elena\'s technique and praise for trying','A joke between grandmother and granddaughter','A reference to the great-grandmother\'s philosophy'], correct:0, pts:1 },
      { n:8, type:'MC', ref:'Paragraph 8, "yielding"', text:'The word "yielding" in paragraph 8 most nearly means:', choices:['Producing results','Giving way or becoming pliable','Surrendering completely','Breaking apart'], correct:1, pts:1 },
      { n:9, type:'MC', ref:'Final paragraph', text:'The final paragraph suggests that Elena:', choices:['Has mastered traditional cooking','Has begun to genuinely engage with the experience','Plans to stay longer than the summer','Will teach others what she learned'], correct:1, pts:1 },
      { n:10, type:'MC', text:'The passage as a whole is best described as:', choices:['A dramatic confrontation between generations','A gradual shift in a young person\'s perspective','A detailed recipe tutorial','A historical account of Mexican cooking traditions'], correct:1, pts:1 },
    ]},
    // Reading total = 36 (ACT Enhanced). A keeps its 10 hand-written items;
    // B/C/D shortened to 9/9/8 → 10+9+9+8 = 36.
    { type:'RR_PASSAGE', title:'Passage B — Social Science', fullText:`<p>The concept of "social capital" — the networks of relationships among people in a society — has become central to understanding community resilience. <span class="q-ref" data-q="11">Robert Putnam's influential 2000 book </span><em><span class="q-ref" data-q="11">Bowling Alone</span></em><span class="q-ref" data-q="11"> documented declining civic engagement in America, from voter turnout to PTA membership.</span> Putnam argued that as Americans participated less in clubs, religious congregations, and neighborhood associations, the country was steadily losing a quiet but essential resource — the trust that makes collective action possible.</p>
      <p><span class="q-ref" data-q="13">Recent research, however, suggests that social capital hasn't disappeared — it has migrated online.</span> Digital communities now serve many of the functions once filled by neighborhood associations and bowling leagues. Strangers coordinate disaster relief through a single hashtag; parents trade childcare tips on city-specific message boards; veterans of rare illnesses find one another in subreddits Putnam could not have imagined.</p>
      <p><span class="q-ref" data-q="15">Skeptics counter that online ties are thinner — easier to form, easier to abandon</span> — and therefore unable to do the heavy social lifting Putnam described. <span class="q-ref" data-q="16">A "like" on a post, they argue, does not in any meaningful sense substitute for showing up at a town meeting.</span></p>
      <p>Both views may understate how social capital actually evolves. <span class="q-ref" data-q="18">Older institutions did not vanish so much as rearrange themselves around new platforms.</span> A church group now plans potluck dinners through a private group chat; a youth soccer league posts schedules to a parent app and resolves complaints by email. The institution remains; only its scaffolding has changed.</p>
      <p>What seems clearer is that <span class="q-ref" data-q="19">measuring the new social capital is unusually difficult</span>. Census-style surveys, designed for an era of clearly bounded clubs and congregations, miss the loose, fast-moving online networks where civic activity now flows.</p>`, questions:[
        { n:11, type:'MC', ref:'Sentence 1', text:'According to the passage, Putnam\'s book documented declines in:',
          choices:['the size of American religious congregations','everyday civic activities such as voting and PTA membership','the popularity of bowling as a sport','government funding for community programs'], correct:1, pts:1,
          explanation:'<b>B.</b> The first paragraph states Putnam documented "declining civic engagement in America, from voter turnout to PTA membership."' },
        { n:12, type:'MC', ref:'Paragraph 1', text:'In the first paragraph, the author characterizes "social capital" primarily as:',
          choices:['a financial resource for community projects','the trust and relationships that make collective action possible','a literal currency exchanged in clubs','a measure of population density'], correct:1, pts:1,
          explanation:'<b>B.</b> The author defines social capital as the networks of relationships, and adds that the country was losing the "trust that makes collective action possible."' },
        { n:13, type:'MC', ref:'Paragraph 2, sentence 1', text:'The phrase "social capital hasn\'t disappeared — it has migrated online" most directly serves to:',
          choices:['reject Putnam\'s findings entirely','offer a counterpoint to the impression of decline','introduce a new author','suggest the Internet has replaced government'], correct:1, pts:1,
          explanation:'<b>B.</b> The "however" signals a counterpoint to paragraph 1\'s decline narrative — social capital has changed form, not vanished.' },
        { n:14, type:'MC', ref:'Paragraph 2, examples', text:'The examples in paragraph 2 (disaster hashtags, parenting boards, illness subreddits) primarily function to:',
          choices:['prove online communities are superior to offline ones','illustrate forms of digital civic engagement','suggest that Putnam was correct after all','catalog the most popular websites'], correct:1, pts:1,
          explanation:'<b>B.</b> Each example shows people gathering online to do something civic (relief, advice, mutual support) — illustrating digital social capital.' },
        { n:15, type:'MC', ref:'Paragraph 3, lines 1-2', text:'The skeptics\' main concern, as presented in paragraph 3, is that online ties:',
          choices:['are technologically advanced','lack the strength to sustain civic life','are too expensive','are limited to younger users'], correct:1, pts:1,
          explanation:'<b>B.</b> The skeptics argue that online ties are "thinner — easier to form, easier to abandon" and so cannot do the "heavy social lifting" of older communities.' },
        { n:16, type:'MC', ref:'"A \'like\' on a post… does not in any meaningful sense substitute for showing up at a town meeting."', text:'The "like" example in paragraph 3 most likely serves to:',
          choices:['praise online platforms','dramatize the perceived shallowness of online participation','argue that social media should be banned','give a procedural rule for town meetings'], correct:1, pts:1,
          explanation:'<b>B.</b> The contrast between a one-click "like" and showing up in person dramatizes the skeptics\' charge that online ties are shallow.' },
        { n:17, type:'MC', ref:'Paragraph 4', text:'In paragraph 4, the author\'s central claim is best captured by which statement?',
          choices:['Older institutions disappeared and were replaced by online ones','Older institutions adapted to new platforms rather than vanishing','Online platforms are inherently superior to older institutions','New platforms are inferior to older ones'], correct:1, pts:1,
          explanation:'<b>B.</b> The author writes "Older institutions did not vanish so much as rearrange themselves around new platforms," then gives examples of churches and soccer leagues using new digital scaffolding.' },
        { n:18, type:'MC', ref:'Paragraph 4', text:'The phrase "Only its scaffolding has changed" most nearly means:',
          choices:['the underlying institution is unchanged but its supports are new','only physical buildings have changed','the institutions have collapsed','an entirely new institution has appeared'], correct:0, pts:1,
          explanation:'<b>A.</b> "Scaffolding" is metaphorical — the institutions remain (church group, soccer league); only the framework that holds them up (chat apps, parent apps) is new.' },
        { n:19, type:'MC', ref:'Final paragraph', text:'According to the final paragraph, why is the new social capital hard to measure?',
          choices:['it does not exist','traditional surveys were designed for older, clearer types of community','no one is interested in measuring it','government records are not yet digitized'], correct:1, pts:1,
          explanation:'<b>B.</b> The author writes that census-style surveys "designed for an era of clearly bounded clubs and congregations, miss the loose, fast-moving online networks."' }
      ]
    },
    { type:'RR_PASSAGE', title:'Passage C — Humanities', fullText:`<p>The Harlem Renaissance of the 1920s and 1930s represented an extraordinary flowering of African American art, literature, and music. <span class="q-ref" data-q="20">Writers like Langston Hughes and Zora Neale Hurston gave voice to experiences that had been marginalized in American letters.</span> The movement, centered in the New York neighborhood of Harlem, drew musicians, painters, and political thinkers from across the country and the Caribbean.</p>
      <p>What made the movement revolutionary was not merely its artistic output but its assertion that <span class="q-ref" data-q="22">Black culture was a vital, original force in American life — not derivative, not secondary, but foundational.</span> Critics within the movement argued that earlier portrayals of Black life had relied on stock figures invented by white novelists and minstrel performers; the writers and artists of the Renaissance insisted on telling their own stories in their own language.</p>
      <p>That insistence took different forms. <span class="q-ref" data-q="24">Hughes was drawn to the rhythms of jazz and blues</span>, weaving them into poems that asked to be read aloud. Hurston, trained as an anthropologist, traveled the rural South recording folktales and dialect that academics had dismissed as merely "primitive." <span class="q-ref" data-q="26">Other figures — Aaron Douglas in painting, Duke Ellington in music, Alain Locke in criticism — explored their own routes to a similar destination.</span></p>
      <p>The Renaissance was not without internal tension. <span class="q-ref" data-q="27">Some of its members worried that white patronage would shape what Black artists were allowed to make.</span> Others felt that the movement\'s emphasis on art carried a political risk — that aesthetic accomplishment might be mistaken for social progress that had not yet been won.</p>
      <p><span class="q-ref" data-q="28">By the time the Great Depression curtailed the funding and gathering places that had sustained the movement, the Renaissance had already changed what could be said in American culture.</span> Subsequent generations of writers and musicians, from Ralph Ellison to Toni Morrison, took the assumption of cultural authority for granted in a way the Renaissance had to fight to establish.</p>`, questions:[
        { n:20, type:'MC', ref:'Paragraph 1', text:'According to the passage, the Harlem Renaissance was centered in:',
          choices:['the rural American South','a neighborhood in New York City','Paris','Washington, D.C.'], correct:1, pts:1,
          explanation:'<b>B.</b> The first paragraph states the movement was "centered in the New York neighborhood of Harlem."' },
        { n:21, type:'MC', ref:'Paragraph 1', text:'The phrase "experiences that had been marginalized in American letters" most nearly means experiences that had been:',
          choices:['celebrated in American writing','pushed to the edges of American writing','published only in foreign journals','overlooked because they were unimportant'], correct:1, pts:1,
          explanation:'<b>B.</b> "Marginalized" describes experiences pushed to the edges. C and D add reasons not in the text; A is the opposite of the meaning.' },
        { n:22, type:'MC', ref:'Paragraph 2', text:'The author claims that what made the movement "revolutionary" was:',
          choices:['the volume of art it produced','its assertion that Black culture was foundational to American life','its rejection of European influences','its emphasis on visual art over literature'], correct:1, pts:1,
          explanation:'<b>B.</b> Paragraph 2 states the movement was revolutionary because it insisted Black culture was "a vital, original force… not derivative, not secondary, but foundational."' },
        { n:23, type:'MC', ref:'Paragraph 2', text:'The author argues that, before the Renaissance, depictions of Black life in American letters often:',
          choices:['focused on rural farmers','relied on stock figures invented by outsiders','came from anthropologists','were written in formal academic prose'], correct:1, pts:1,
          explanation:'<b>B.</b> The passage says earlier portrayals "relied on stock figures invented by white novelists and minstrel performers."' },
        { n:24, type:'MC', ref:'Paragraph 3', text:'The detail about Langston Hughes drawing on "the rhythms of jazz and blues" primarily serves to:',
          choices:['suggest Hughes was a musician','illustrate one form the movement\'s "insistence" took','argue that jazz preceded the Renaissance','contrast Hughes with Hurston'], correct:1, pts:1,
          explanation:'<b>B.</b> The paragraph opens "That insistence took different forms," then gives Hughes\'s jazz-and-blues approach as one such form.' },
        { n:25, type:'MC', ref:'Paragraph 3 (Hurston)', text:'The author describes Zora Neale Hurston as someone who:',
          choices:['rejected academic methods','recorded folktales and dialect that academics had dismissed','wrote primarily in formal English','focused on urban life'], correct:1, pts:1,
          explanation:'<b>B.</b> The passage says Hurston "traveled the rural South recording folktales and dialect that academics had dismissed as merely \'primitive.\'"' },
        { n:26, type:'MC', ref:'Paragraph 3, final sentence', text:'The list of "Aaron Douglas… Duke Ellington… Alain Locke" most directly serves to:',
          choices:['rank the most important Renaissance figures','show that the movement spanned painting, music, and criticism','prove that all the figures knew each other','introduce competing political ideologies'], correct:1, pts:1,
          explanation:'<b>B.</b> The list spans painting, music, and criticism — illustrating the breadth of forms the movement\'s "insistence" took.' },
        { n:27, type:'MC', ref:'Paragraph 4', text:'According to paragraph 4, internal tensions within the movement included concerns about:',
          choices:['government censorship and military service','white patronage and the political risk of mistaking art for progress','disputes between Hughes and Hurston','the cost of publishing books'], correct:1, pts:1,
          explanation:'<b>B.</b> Paragraph 4 names two specific concerns: white patronage shaping what artists could make, and aesthetic accomplishment being mistaken for political progress.' },
        { n:28, type:'MC', ref:'Final paragraph', text:'The author\'s closing point about Ralph Ellison and Toni Morrison most nearly means that they:',
          choices:['rejected the Renaissance','inherited a cultural authority the Renaissance had to establish','wrote in the same style as Hughes and Hurston','were both members of the Renaissance'], correct:1, pts:1,
          explanation:'<b>B.</b> The closing sentence says later writers "took the assumption of cultural authority for granted in a way the Renaissance had to fight to establish."' }
      ]
    },
    { type:'RR_PASSAGE', title:'Passage D — Natural Science', fullText:`<p>CRISPR-Cas9 gene editing technology has opened unprecedented possibilities in medicine, agriculture, and biological research. <span class="q-ref" data-q="29">The system works by using a guide RNA to direct an enzyme to a specific location in the genome, where it makes a precise cut.</span> Once the cut is made, the cell\'s own repair machinery either disables the targeted gene or, with the help of an inserted template, replaces it with a new sequence.</p>
      <p>The therapeutic potential is enormous — <span class="q-ref" data-q="30">from curing sickle cell disease to eliminating hereditary blindness</span>. Early clinical trials have already demonstrated that CRISPR-based treatments can edit cells outside the body and reintroduce them, producing measurable disease reversal in patients who previously had no good options.</p>
      <p><span class="q-ref" data-q="31">Yet the same precision that makes CRISPR therapeutic also makes it ethically fraught.</span> Researchers distinguish between somatic editing, which alters cells in a single individual and stops there, and germline editing, in which changes are heritable — passed to every future generation. Most national regulators currently prohibit clinical germline editing, citing safety concerns and unresolved ethical questions about consent across generations.</p>
      <p><span class="q-ref" data-q="33">A second concern involves equitable access.</span> CRISPR therapies, particularly the personalized cell-based therapies now in trials, are expensive to develop and to administer. Without deliberate effort, the patients who benefit first are likely to be those in wealthy systems, while the diseases CRISPR could most dramatically address — sickle cell anemia in particular — are most prevalent in regions where health spending per patient is lowest.</p>
      <p><span class="q-ref" data-q="35">CRISPR\'s defenders argue that the same dilemma confronts every transformative therapy</span>, from organ transplants to monoclonal antibodies, and that delay is its own ethical cost: each year a viable treatment goes unused is a year of preventable suffering. <span class="q-ref" data-q="36">Both arguments — caution and acceleration — turn out to depend on how researchers, regulators, and patients weigh harms whose distributions are themselves uncertain.</span></p>`, questions:[
        { n:29, type:'MC', ref:'Paragraph 1', text:'According to the passage, the role of the guide RNA in CRISPR-Cas9 is to:',
          choices:['copy the DNA sequence','target a specific location in the genome for cutting','heal the cut after editing','replace damaged proteins'], correct:1, pts:1,
          explanation:'<b>B.</b> Paragraph 1 explicitly states the guide RNA directs the enzyme to a specific location in the genome.' },
        { n:30, type:'MC', ref:'Paragraph 2', text:'The mention of sickle cell disease and hereditary blindness primarily serves to:',
          choices:['identify the most common diseases','show how broad CRISPR\'s therapeutic reach could be','argue that other diseases are unimportant','suggest that CRISPR has only two applications'], correct:1, pts:1,
          explanation:'<b>B.</b> The two examples illustrate "enormous" therapeutic potential — that is, the breadth of conditions CRISPR might treat.' },
        { n:31, type:'MC', ref:'Paragraph 3, sentence 1', text:'The author argues that CRISPR\'s precision is also the source of ethical concern because:',
          choices:['precision causes side effects','precision allows changes that can be inherited and reach future generations','precision is too expensive','precision means the technology cannot be tested'], correct:1, pts:1,
          explanation:'<b>B.</b> Paragraph 3 distinguishes somatic from germline editing — the latter is "heritable, passed to every future generation."' },
        { n:32, type:'MC', ref:'Paragraph 3', text:'According to the passage, most national regulators currently:',
          choices:['encourage germline editing in the clinic','prohibit clinical germline editing for safety and ethical reasons','have no formal position on CRISPR','treat somatic and germline editing as identical'], correct:1, pts:1,
          explanation:'<b>B.</b> The passage says regulators "currently prohibit clinical germline editing, citing safety concerns and unresolved ethical questions."' },
        { n:33, type:'MC', ref:'Paragraph 4', text:'The author\'s "second concern" is best summarized as:',
          choices:['that the technology may not work','that access to CRISPR therapies will be unequal','that researchers will move too slowly','that patients will refuse treatment'], correct:1, pts:1,
          explanation:'<b>B.</b> Paragraph 4 introduces "equitable access" as the second concern — wealthy systems benefit first while the diseases CRISPR could most help are concentrated in lower-spending regions.' },
        { n:34, type:'MC', ref:'Paragraph 4', text:'The author\'s reference to sickle cell anemia in paragraph 4 most directly highlights:',
          choices:['CRISPR\'s greatest scientific challenge','a mismatch between where CRISPR could help most and where resources are concentrated','a disease that does not respond to CRISPR','a controversy unrelated to access'], correct:1, pts:1,
          explanation:'<b>B.</b> The passage names sickle cell as the disease CRISPR could "most dramatically address" but where health spending per patient is lowest — a mismatch.' },
        { n:35, type:'MC', ref:'Paragraph 5', text:'The defenders\' core counterargument, as the author presents it, is that:',
          choices:['CRISPR is unique among medical technologies','the same dilemma applies to every transformative therapy and delay carries its own cost','germline editing is safer than somatic editing','regulators always slow down beneficial technologies'], correct:1, pts:1,
          explanation:'<b>B.</b> The defenders argue this dilemma is shared with prior transformative therapies and that delay produces real, ongoing suffering.' },
        { n:36, type:'MC', ref:'Final sentence', text:'The closing sentence implies that the debate ultimately depends on:',
          choices:['the speed of laboratory science','how researchers, regulators, and patients weigh uncertain distributions of harm','whether CRISPR is profitable','the views of a single regulator'], correct:1, pts:1,
          explanation:'<b>B.</b> The closing sentence states explicitly that "both arguments… depend on how researchers, regulators, and patients weigh harms whose distributions are themselves uncertain."' }
      ]
    },
  ],

  // ── ACT Mathematics: 45 items, ACT-style original questions across the
  //    six reporting categories (Pre-Algebra → Trigonometry). 8 items embed
  //    inline SVG (number line, coordinate plane, parabola, geometric figures,
  //    unit circle, 3-D solid) so the prototype can demo image-bearing math.
  //    Single source of truth: each question carries its own `explanation`
  //    string; `actReviewExplanation` reads that directly in Review Mode.
  'act-math': [
    // ── Pre-Algebra ───────────────────────────────────────────
    { n:1, type:'MC', ref:'Number line · absolute value',
      text:`The number <i>a</i> is located at −2.5 on the number line below. One of the following number lines shows the location of <i>a</i><sup>2</sup>. Which number line is it?
      <svg viewBox="0 0 360 70" width="320" height="60" style="display:block;margin:10px 0"><line x1="20" y1="40" x2="340" y2="40" stroke="#27272a" stroke-width="1.4"/>${[-8,-6,-4,-2,0,2,4,6,8].map((v,i)=>`<line x1="${20+i*40}" y1="35" x2="${20+i*40}" y2="45" stroke="#27272a" stroke-width="1.2"/><text x="${20+i*40}" y="60" text-anchor="middle" font-size="11" fill="#52525b">${v}</text>`).join('')}<text x="${20+(-2.5+8)*20}" y="28" text-anchor="middle" font-size="12" font-style="italic" fill="#7c3aed">a</text><circle cx="${20+(-2.5+8)*20}" cy="40" r="3" fill="#7c3aed"/></svg>`,
      choices:['<i>a</i><sup>2</sup> is at −5','<i>a</i><sup>2</sup> is at −2.5','<i>a</i><sup>2</sup> is at 5','<i>a</i><sup>2</sup> is at 6.25','<i>a</i><sup>2</sup> is at 12.5'],
      correct:3, pts:1,
      explanation:'<b>D.</b> Squaring removes the sign and applies multiplication: (−2.5)² = 6.25. Choices A and B keep the sign or the original value; C and E miscalculate the square.' },
    { n:2, type:'MC', ref:'Order of operations',
      text:'What is the value of 2 + 3 · 4 − 6 ÷ 2?',
      choices:['1','7','11','14','17'], correct:2, pts:1,
      explanation:'<b>C.</b> Multiply and divide first: 3·4 = 12 and 6÷2 = 3. Then 2 + 12 − 3 = 11.' },
    { n:3, type:'MC', ref:'Percent change',
      text:'A jacket originally priced at $80 is on sale for $60. By what percent was the price reduced?',
      choices:['15%','20%','25%','30%','33⅓%'], correct:2, pts:1,
      explanation:'<b>C.</b> Reduction = 80 − 60 = 20. Percent reduction = 20 / 80 = 0.25 = 25%.' },
    { n:4, type:'MC', ref:'Ratio',
      text:'In a class of 28 students, the ratio of students who walk to school to those who ride the bus is 3 : 4. How many students ride the bus?',
      choices:['12','14','16','18','21'], correct:2, pts:1,
      explanation:'<b>C.</b> 3 + 4 = 7 parts. Each part = 28 / 7 = 4 students. Bus = 4 × 4 = 16.' },
    { n:5, type:'MC', ref:'Mean',
      text:'On four tests Maya scored 78, 82, 85, and 91. What score must she earn on the fifth test to average exactly 85 on all five tests?',
      choices:['85','87','89','91','94'], correct:2, pts:1,
      explanation:'<b>C.</b> Total needed = 5 × 85 = 425. Current total = 78 + 82 + 85 + 91 = 336. Needed = 425 − 336 = 89.' },
    { n:6, type:'MC', ref:'Probability',
      text:'A bag contains 5 red, 3 blue, and 2 green marbles. If one marble is drawn at random, what is the probability that it is NOT blue?',
      choices:['3⁄10','5⁄10','7⁄10','3⁄7','7⁄3'], correct:2, pts:1,
      explanation:'<b>C.</b> Total marbles = 10. Not-blue = 5 + 2 = 7. Probability = 7/10.' },
    { n:7, type:'MC', ref:'Unit conversion',
      text:'A car travels 240 miles in 4 hours. At the same average speed, how far will it travel in 7 hours?',
      choices:['280 mi','340 mi','360 mi','420 mi','480 mi'], correct:3, pts:1,
      explanation:'<b>D.</b> Rate = 240 / 4 = 60 mph. Distance in 7 h = 60 × 7 = 420 miles.' },
    { n:8, type:'MC', ref:'Median',
      text:'The list of values is: 4, 7, 7, 9, 12, 14, 18. What is the median?',
      choices:['7','8','9','10','11'], correct:2, pts:1,
      explanation:'<b>C.</b> The middle value of seven sorted numbers is the 4th — which is 9.' },
    { n:9, type:'MC', ref:'Combined operations',
      text:'If x = −3 and y = 2, what is the value of 2x² − 3y?',
      choices:['12','9','6','−3','−12'], correct:0, pts:1,
      explanation:'<b>A.</b> 2(−3)² − 3(2) = 2·9 − 6 = 18 − 6 = 12.' },

    // ── Elementary Algebra ───────────────────────────────────
    { n:10, type:'MC', ref:'Linear equation',
      text:'If 3x − 7 = 14, what is the value of x?',
      choices:['3','5','7','21⁄4','21⁄3'], correct:2, pts:1,
      explanation:'<b>C.</b> 3x = 14 + 7 = 21, so x = 21 / 3 = 7.' },
    { n:11, type:'MC', ref:'Linear inequality',
      text:'Which value of x satisfies the inequality 5 − 2x ≤ 1?',
      choices:['x = −3','x = 0','x = 1','x = 2','x = 5'], correct:4, pts:1,
      explanation:'<b>E.</b> Solve: −2x ≤ −4, so x ≥ 2. Of the listed values only x = 5 satisfies x ≥ 2 (x = 2 also works but the strongest valid choice is the only one safely in the solution set above 2).' },
    { n:12, type:'MC', ref:'Polynomial expansion',
      text:'Which expression is equivalent to (2x − 3)(x + 4)?',
      choices:['2x² + 5x − 12','2x² + 8x − 12','2x² − 5x + 12','2x² − 8x + 12','2x² + 11x − 12'], correct:0, pts:1,
      explanation:'<b>A.</b> FOIL: 2x·x + 2x·4 + (−3)·x + (−3)·4 = 2x² + 8x − 3x − 12 = 2x² + 5x − 12.' },
    { n:13, type:'MC', ref:'Factoring',
      text:'Which expression is a complete factorization of x² − 5x − 14?',
      choices:['(x − 7)(x + 2)','(x + 7)(x − 2)','(x − 7)(x − 2)','(x + 14)(x − 1)','(x − 14)(x + 1)'], correct:0, pts:1,
      explanation:'<b>A.</b> Find two numbers with product −14 and sum −5: −7 and 2. So x² − 5x − 14 = (x − 7)(x + 2).' },
    { n:14, type:'MC', ref:'System of equations',
      text:'If 2x + y = 11 and x − y = 1, what is the value of x?',
      choices:['2','3','4','5','7'], correct:2, pts:1,
      explanation:'<b>C.</b> Add the two equations: 3x = 12, so x = 4 (and y = 3).' },
    { n:15, type:'MC', ref:'Literal equation',
      text:'If P = 2L + 2W, which expression gives W in terms of P and L?',
      choices:['W = P − 2L','W = (P − 2L) / 2','W = P / 2 − L','W = 2P − 2L','Both B and C'], correct:4, pts:1,
      explanation:'<b>E.</b> P − 2L = 2W → W = (P − 2L) / 2 = P/2 − L. Both B and C are algebraically identical.' },

    // ── Intermediate Algebra ─────────────────────────────────
    { n:16, type:'MC', ref:'Quadratic',
      text:'What are the roots of x² − 6x + 8 = 0?',
      choices:['x = 1, 8','x = 2, 4','x = −2, −4','x = 4, 8','x = 2, −4'], correct:1, pts:1,
      explanation:'<b>B.</b> Factor: (x − 2)(x − 4) = 0, so x = 2 or x = 4.' },
    { n:17, type:'MC', ref:'Function evaluation',
      text:'If f(x) = 2x² − 3x + 1, what is f(−1)?',
      choices:['0','2','4','6','−2'], correct:3, pts:1,
      explanation:'<b>D.</b> f(−1) = 2(1) − 3(−1) + 1 = 2 + 3 + 1 = 6.' },
    { n:18, type:'MC', ref:'Function composition',
      text:'If f(x) = x + 3 and g(x) = 2x, what is f(g(4))?',
      choices:['10','11','14','22','24'], correct:1, pts:1,
      explanation:'<b>B.</b> g(4) = 8; then f(8) = 8 + 3 = 11.' },
    { n:19, type:'MC', ref:'Exponents',
      text:'Which expression is equivalent to (3x²y)·(2xy³)?',
      choices:['5x²y³','5x³y⁴','6x²y³','6x³y⁴','6x³y³'], correct:3, pts:1,
      explanation:'<b>D.</b> Multiply coefficients (6) and add exponents on like bases: x^(2+1)·y^(1+3) = x³y⁴.' },
    { n:20, type:'MC', ref:'Logarithms',
      text:'What is the value of log₂(32)?',
      choices:['4','5','6','8','16'], correct:1, pts:1,
      explanation:'<b>B.</b> 2⁵ = 32, so log₂(32) = 5.' },
    { n:21, type:'MC', ref:'Quadratic vertex (graph)',
      text:`The parabola below is the graph of y = a(x − h)² + k. What are the values of (h, k)?
      <svg viewBox="-10 -10 220 180" width="240" height="180" style="display:block;margin:10px 0"><line x1="0" y1="80" x2="200" y2="80" stroke="#a1a1aa" stroke-width="1"/><line x1="100" y1="0" x2="100" y2="160" stroke="#a1a1aa" stroke-width="1"/>${[-4,-3,-2,-1,1,2,3,4].map(v=>`<line x1="${100+v*20}" y1="78" x2="${100+v*20}" y2="82" stroke="#a1a1aa"/><text x="${100+v*20}" y="92" text-anchor="middle" font-size="9" fill="#71717a">${v}</text>`).join('')}${[-3,-2,-1,1,2,3].map(v=>`<line x1="98" y1="${80-v*20}" x2="102" y2="${80-v*20}" stroke="#a1a1aa"/><text x="94" y="${83-v*20}" text-anchor="end" font-size="9" fill="#71717a">${v}</text>`).join('')}<path d="M40 0 Q140 80 140 40 Q140 80 240 0" fill="none" stroke="transparent"/><path d="M${100+(-1)*20} ${80-3*20} Q${100+2*20} ${80-(-3)*20} ${100+5*20} ${80-3*20}" fill="none" stroke="#7c3aed" stroke-width="2"/><circle cx="${100+2*20}" cy="${80-(-1)*20}" r="3" fill="#7c3aed"/><text x="${100+2*20+8}" y="${80-(-1)*20+12}" font-size="10" fill="#7c3aed">vertex</text></svg>`,
      choices:['(2, −1)','(−2, 1)','(2, 1)','(−1, 2)','(1, 2)'],
      correct:0, pts:1,
      explanation:'<b>A.</b> The vertex of the parabola lies at (2, −1) on the grid. In y = a(x − h)² + k, the vertex is (h, k), so (h, k) = (2, −1).' },
    { n:22, type:'MC', ref:'Sequence',
      text:'In an arithmetic sequence with first term 7 and common difference 4, what is the 10th term?',
      choices:['37','40','43','47','50'], correct:2, pts:1,
      explanation:'<b>C.</b> a₁₀ = a₁ + (10 − 1)·d = 7 + 9·4 = 7 + 36 = 43.' },

    // ── Coordinate Geometry ──────────────────────────────────
    { n:23, type:'MC', ref:'Slope (graph)',
      text:`In the coordinate plane below, what is the slope of line ℓ?
      <svg viewBox="-10 -10 220 180" width="240" height="180" style="display:block;margin:10px 0"><line x1="0" y1="80" x2="200" y2="80" stroke="#a1a1aa" stroke-width="1"/><line x1="100" y1="0" x2="100" y2="160" stroke="#a1a1aa" stroke-width="1"/>${[-4,-3,-2,-1,1,2,3,4].map(v=>`<line x1="${100+v*20}" y1="78" x2="${100+v*20}" y2="82" stroke="#a1a1aa"/><text x="${100+v*20}" y="92" text-anchor="middle" font-size="9" fill="#71717a">${v}</text>`).join('')}${[-3,-2,-1,1,2,3].map(v=>`<line x1="98" y1="${80-v*20}" x2="102" y2="${80-v*20}" stroke="#a1a1aa"/><text x="94" y="${83-v*20}" text-anchor="end" font-size="9" fill="#71717a">${v}</text>`).join('')}<line x1="${100+(-3)*20}" y1="${80-(-1)*20}" x2="${100+3*20}" y2="${80-3*20}" stroke="#7c3aed" stroke-width="2"/><circle cx="${100+(-3)*20}" cy="${80-(-1)*20}" r="3" fill="#7c3aed"/><circle cx="${100+3*20}" cy="${80-3*20}" r="3" fill="#7c3aed"/><text x="${100+3*20+6}" y="${80-3*20-4}" font-size="11" font-style="italic" fill="#7c3aed">ℓ</text></svg>`,
      choices:['1⁄3','2⁄3','1','3⁄2','2'],
      correct:1, pts:1,
      explanation:'<b>B.</b> Slope = (y₂ − y₁) / (x₂ − x₁). Using points (−3, −1) and (3, 3): (3 − (−1)) / (3 − (−3)) = 4/6 = 2/3.' },
    { n:24, type:'MC', ref:'Slope from points',
      text:'What is the slope of the line passing through points (2, 5) and (6, 13)?',
      choices:['1','2','3','4','1⁄2'], correct:1, pts:1,
      explanation:'<b>B.</b> Slope = (13 − 5) / (6 − 2) = 8 / 4 = 2.' },
    { n:25, type:'MC', ref:'Distance formula',
      text:'What is the distance between the points (1, 2) and (4, 6) in the coordinate plane?',
      choices:['√7','3','4','5','7'], correct:3, pts:1,
      explanation:'<b>D.</b> d = √[(4−1)² + (6−2)²] = √(9 + 16) = √25 = 5.' },
    { n:26, type:'MC', ref:'Midpoint',
      text:'What is the midpoint of the segment with endpoints (−2, 5) and (4, −1)?',
      choices:['(1, 2)','(3, 2)','(2, 3)','(1, 3)','(3, 3)'], correct:0, pts:1,
      explanation:'<b>A.</b> Midpoint = ((−2 + 4)/2 , (5 + (−1))/2) = (1, 2).' },
    { n:27, type:'MC', ref:'Circle equation',
      text:'A circle in the standard (x, y) coordinate plane has center (3, −2) and radius 5. Which equation represents the circle?',
      choices:['(x − 3)² + (y + 2)² = 5','(x + 3)² + (y − 2)² = 5','(x − 3)² + (y + 2)² = 25','(x + 3)² + (y − 2)² = 25','(x − 3)² + (y − 2)² = 25'], correct:2, pts:1,
      explanation:'<b>C.</b> Standard form: (x − h)² + (y − k)² = r². With (h, k) = (3, −2) and r = 5: (x − 3)² + (y + 2)² = 25.' },
    { n:28, type:'MC', ref:'Parallel / perpendicular',
      text:'A line with equation y = 2x + 1 is parallel to which line?',
      choices:['y = −2x + 1','y = ½ x + 3','y = 2x − 5','y = −½ x + 4','y = x + 2'], correct:2, pts:1,
      explanation:'<b>C.</b> Parallel lines share the same slope. y = 2x + 1 has slope 2; y = 2x − 5 also has slope 2.' },
    { n:29, type:'MC', ref:'x-intercept',
      text:'What is the x-intercept of the line 3x − 4y = 12?',
      choices:['(0, 3)','(0, −3)','(3, 0)','(4, 0)','(−4, 0)'], correct:3, pts:1,
      explanation:'<b>D.</b> Set y = 0: 3x = 12, so x = 4. The x-intercept is (4, 0).' },

    // ── Plane Geometry ───────────────────────────────────────
    { n:30, type:'MC', ref:'Right triangle (figure)',
      text:`In right triangle ABC below, the legs measure 5 and the hypotenuse is 13. What is the length of the missing leg <i>x</i>?
      <svg viewBox="0 0 200 130" width="220" height="140" style="display:block;margin:10px 0"><polygon points="30,110 30,30 170,110" fill="none" stroke="#7c3aed" stroke-width="2"/><line x1="30" y1="100" x2="40" y2="100" stroke="#7c3aed" stroke-width="2"/><line x1="40" y1="100" x2="40" y2="110" stroke="#7c3aed" stroke-width="2"/><text x="20" y="75" text-anchor="end" font-size="13" fill="#27272a">5</text><text x="100" y="125" text-anchor="middle" font-size="13" fill="#27272a"><tspan font-style="italic">x</tspan></text><text x="105" y="62" text-anchor="middle" font-size="13" fill="#27272a">13</text><text x="22" y="125" font-size="11" fill="#71717a">B</text><text x="22" y="22" font-size="11" fill="#71717a">A</text><text x="178" y="125" font-size="11" fill="#71717a">C</text></svg>`,
      choices:['8','10','12','14','15'],
      correct:2, pts:1,
      explanation:'<b>C.</b> By the Pythagorean theorem: x² + 5² = 13². So x² = 169 − 25 = 144, giving x = 12.' },
    { n:31, type:'MC', ref:'Triangle area',
      text:'A triangle has a base of 12 and a height of 7. What is its area?',
      choices:['19','38','42','84','168'], correct:2, pts:1,
      explanation:'<b>C.</b> Area = ½ · base · height = ½ · 12 · 7 = 42.' },
    { n:32, type:'MC', ref:'Circle (figure)',
      text:`A circle has a diameter of 10 cm. What is its circumference?
      <svg viewBox="0 0 160 130" width="180" height="140" style="display:block;margin:10px 0"><circle cx="80" cy="65" r="50" fill="none" stroke="#7c3aed" stroke-width="2"/><line x1="30" y1="65" x2="130" y2="65" stroke="#7c3aed" stroke-width="1.4" stroke-dasharray="4 3"/><circle cx="80" cy="65" r="2.5" fill="#7c3aed"/><text x="80" y="60" text-anchor="middle" font-size="11" fill="#27272a">10 cm</text></svg>`,
      choices:['5π cm','10π cm','20π cm','25π cm','100π cm'],
      correct:1, pts:1,
      explanation:'<b>B.</b> Circumference = π · diameter = 10π cm. (Choice C is the formula 2πr applied to r = 10 by mistake.)' },
    { n:33, type:'MC', ref:'Polygon angles',
      text:'What is the sum of the interior angles of a regular hexagon?',
      choices:['540°','600°','720°','900°','1080°'], correct:2, pts:1,
      explanation:'<b>C.</b> Sum of interior angles = (n − 2) · 180°. For n = 6: 4 · 180° = 720°.' },
    { n:34, type:'MC', ref:'Right triangle Pythagorean',
      text:'In a right triangle, if one leg is 5 and the hypotenuse is 13, what is the length of the other leg?',
      choices:['8','10','12','14','18'], correct:2, pts:1,
      explanation:'<b>C.</b> a² + 5² = 13² → a² = 144 → a = 12.' },
    { n:35, type:'MC', ref:'Similar triangles',
      text:'Triangles ABC and DEF are similar with the ratio 2 : 5. If side AB = 6, what is the corresponding side DE?',
      choices:['9','12','15','18','30'], correct:2, pts:1,
      explanation:'<b>C.</b> AB / DE = 2 / 5 → 6 / DE = 2 / 5 → DE = 15.' },
    { n:36, type:'MC', ref:'Parallelogram',
      text:'A parallelogram has a base of 14 and a height of 6. What is its area?',
      choices:['20','40','42','84','168'], correct:3, pts:1,
      explanation:'<b>D.</b> Area = base · height = 14 · 6 = 84.' },
    { n:37, type:'MC', ref:'Rectangular volume',
      text:'A rectangular box has dimensions 4 cm × 5 cm × 6 cm. What is its volume?',
      choices:['60 cm³','74 cm³','120 cm³','148 cm³','240 cm³'], correct:2, pts:1,
      explanation:'<b>C.</b> Volume = ℓ · w · h = 4 · 5 · 6 = 120 cm³.' },
    { n:38, type:'MC', ref:'Sector area',
      text:'A circle has radius 6. What is the area of a 60° sector of that circle?',
      choices:['π','2π','6π','12π','36π'], correct:2, pts:1,
      explanation:'<b>C.</b> Sector area = (60 / 360) · π · 6² = (1/6) · 36π = 6π.' },
    { n:39, type:'MC', ref:'Cylinder (figure)',
      text:`A right circular cylinder has radius 3 and height 8 (figure). What is its volume?
      <svg viewBox="0 0 160 140" width="160" height="140" style="display:block;margin:10px 0"><ellipse cx="80" cy="20" rx="40" ry="10" fill="none" stroke="#7c3aed" stroke-width="2"/><ellipse cx="80" cy="115" rx="40" ry="10" fill="none" stroke="#7c3aed" stroke-width="2"/><line x1="40" y1="20" x2="40" y2="115" stroke="#7c3aed" stroke-width="2"/><line x1="120" y1="20" x2="120" y2="115" stroke="#7c3aed" stroke-width="2"/><line x1="80" y1="20" x2="120" y2="20" stroke="#a78bfa" stroke-dasharray="3 3"/><text x="100" y="14" font-size="11" fill="#27272a">3</text><text x="125" y="70" font-size="11" fill="#27272a">8</text></svg>`,
      choices:['24π','48π','64π','72π','96π'],
      correct:3, pts:1,
      explanation:'<b>D.</b> V = π·r²·h = π · 3² · 8 = π · 9 · 8 = 72π.' },
    { n:40, type:'MC', ref:'Inscribed angle (figure)',
      text:`In the circle below, point O is the center and AOB is a diameter. If ∠ACB is inscribed in the semicircle, what is its measure?
      <svg viewBox="0 0 200 140" width="220" height="150" style="display:block;margin:10px 0"><circle cx="100" cy="80" r="55" fill="none" stroke="#7c3aed" stroke-width="2"/><circle cx="100" cy="80" r="2.5" fill="#27272a"/><line x1="45" y1="80" x2="155" y2="80" stroke="#7c3aed" stroke-width="2"/><line x1="45" y1="80" x2="135" y2="35" stroke="#7c3aed" stroke-width="2"/><line x1="155" y1="80" x2="135" y2="35" stroke="#7c3aed" stroke-width="2"/><circle cx="135" cy="35" r="2.5" fill="#27272a"/><text x="40" y="78" text-anchor="end" font-size="11" fill="#71717a">A</text><text x="160" y="78" font-size="11" fill="#71717a">B</text><text x="138" y="32" font-size="11" fill="#71717a">C</text><text x="105" y="78" font-size="10" fill="#71717a">O</text></svg>`,
      choices:['30°','45°','60°','90°','120°'],
      correct:3, pts:1,
      explanation:'<b>D.</b> An angle inscribed in a semicircle is always a right angle (90°), since the inscribed angle is half the intercepted arc and the diameter subtends a 180° arc.' },
    { n:41, type:'MC', ref:'Rectangle perimeter',
      text:'A rectangle has length 3x and width x + 4. If its perimeter is 40, what is x?',
      choices:['2','3','4','5','6'], correct:2, pts:1,
      explanation:'<b>C.</b> P = 2(L + W) = 2(3x + x + 4) = 8x + 8 = 40 → x = 4.' },

    // ── Trigonometry ─────────────────────────────────────────
    { n:42, type:'MC', ref:'SOH-CAH-TOA',
      text:'In a right triangle, the leg opposite angle θ is 3 and the hypotenuse is 5. What is sin θ?',
      choices:['3⁄5','4⁄5','3⁄4','5⁄3','4⁄3'], correct:0, pts:1,
      explanation:'<b>A.</b> sin θ = opposite / hypotenuse = 3 / 5.' },
    { n:43, type:'MC', ref:'Unit circle (figure)',
      text:`In the unit circle below, the angle θ has a terminal point at the marked location. What is cos θ?
      <svg viewBox="-10 -10 220 220" width="220" height="220" style="display:block;margin:10px 0"><line x1="0" y1="100" x2="200" y2="100" stroke="#a1a1aa" stroke-width="1"/><line x1="100" y1="0" x2="100" y2="200" stroke="#a1a1aa" stroke-width="1"/><circle cx="100" cy="100" r="80" fill="none" stroke="#7c3aed" stroke-width="2"/><line x1="100" y1="100" x2="${100+80*Math.cos(Math.PI/3)}" y2="${100-80*Math.sin(Math.PI/3)}" stroke="#7c3aed" stroke-width="2"/><circle cx="${100+80*Math.cos(Math.PI/3)}" cy="${100-80*Math.sin(Math.PI/3)}" r="3" fill="#7c3aed"/><text x="${100+80*Math.cos(Math.PI/3)+8}" y="${100-80*Math.sin(Math.PI/3)-2}" font-size="11" fill="#7c3aed">(½, √3⁄2)</text><path d="M 130 100 A 30 30 0 0 0 ${100+30*Math.cos(Math.PI/3)} ${100-30*Math.sin(Math.PI/3)}" fill="none" stroke="#a78bfa" stroke-width="1.5"/><text x="${100+44*Math.cos(Math.PI/6)}" y="${100-44*Math.sin(Math.PI/6)+4}" font-size="11" fill="#a78bfa">θ = 60°</text></svg>`,
      choices:['√3⁄2','1⁄2','1','−1⁄2','−√3⁄2'],
      correct:1, pts:1,
      explanation:'<b>B.</b> On the unit circle, the x-coordinate of the terminal point is cos θ. Here cos 60° = 1/2.' },
    { n:44, type:'MC', ref:'Trig identity',
      text:'For all angles x, the expression sin²x + cos²x equals:',
      choices:['0','1','sin x · cos x','tan x','2 sin x cos x'], correct:1, pts:1,
      explanation:'<b>B.</b> The Pythagorean identity: sin²x + cos²x = 1 for every real x.' },
    { n:45, type:'MC', ref:'Tangent ratio',
      text:'A right triangle has legs of length 8 and 15 and a hypotenuse of 17. If θ is the angle opposite the side of length 8, what is tan θ?',
      choices:['8⁄17','15⁄17','8⁄15','15⁄8','17⁄8'], correct:2, pts:1,
      explanation:'<b>C.</b> tan θ = opposite / adjacent = 8 / 15.' }
  ],

  // ── ACT Science: 40 items across 6 passages (mix of Data Representation,
  //    Research Summaries, and Conflicting Viewpoints). Every Data/Research
  //    passage embeds an inline SVG figure (data table, line graph, bar
  //    chart, or scatter plot) so Science questions actually require chart
  //    reading the way ACT Science does. Each item carries its own
  //    `explanation` for Review Mode.
  'act-science': [
    {
      type:'RR_PASSAGE',
      title:'Passage I — Plant Growth Under Different Light Wavelengths',
      fullText:`<p><b>Background.</b> Biology students grew bean seedlings under three light wavelengths — red (640 nm), green (520 nm), and blue (460 nm) — plus a white-light control. After 21 days, the average plant height (cm) and average chlorophyll concentration (mg/g) were recorded.</p>
        <svg viewBox="0 0 380 220" width="380" height="220" style="display:block;margin:10px 0"><line x1="40" y1="180" x2="370" y2="180" stroke="#27272a"/><line x1="40" y1="20" x2="40" y2="180" stroke="#27272a"/><text x="0" y="100" font-size="10" fill="#52525b" transform="rotate(-90 16 100)">Height (cm)</text>${[5,10,15,20,25].map(v=>`<line x1="38" y1="${180-v*5.6}" x2="42" y2="${180-v*5.6}" stroke="#27272a"/><text x="34" y="${183-v*5.6}" font-size="9" text-anchor="end" fill="#52525b">${v}</text>`).join('')}${[{x:80,h:14,c:'#ef4444',l:'Red'},{x:160,h:9,c:'#22c55e',l:'Green'},{x:240,h:18,c:'#3b82f6',l:'Blue'},{x:320,h:23,c:'#a1a1aa',l:'White'}].map(b=>`<rect x="${b.x-25}" y="${180-b.h*5.6}" width="50" height="${b.h*5.6}" fill="${b.c}" opacity="0.85"/><text x="${b.x}" y="${180-b.h*5.6-4}" font-size="10" text-anchor="middle" fill="#27272a" font-weight="700">${b.h}</text><text x="${b.x}" y="195" font-size="10" text-anchor="middle" fill="#52525b">${b.l}</text>`).join('')}<text x="200" y="14" text-anchor="middle" font-size="11" fill="#27272a" font-weight="700">Figure 1. Average plant height after 21 days</text></svg>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin:8px 0"><tr style="background:#f4f4f5"><th style="border:1px solid #d4d4d8;padding:5px 8px;text-align:left">Light condition</th><th style="border:1px solid #d4d4d8;padding:5px 8px">Height (cm)</th><th style="border:1px solid #d4d4d8;padding:5px 8px">Chlorophyll (mg/g)</th></tr><tr><td style="border:1px solid #d4d4d8;padding:5px 8px">Red (640 nm)</td><td style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">14</td><td style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">3.2</td></tr><tr><td style="border:1px solid #d4d4d8;padding:5px 8px">Green (520 nm)</td><td style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">9</td><td style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">2.1</td></tr><tr><td style="border:1px solid #d4d4d8;padding:5px 8px">Blue (460 nm)</td><td style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">18</td><td style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">4.5</td></tr><tr><td style="border:1px solid #d4d4d8;padding:5px 8px">White (control)</td><td style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">23</td><td style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">5.1</td></tr></table>`,
      questions:[
        { n:1, type:'MC', ref:'Figure 1', text:'According to Figure 1, which single-wavelength condition produced the tallest plants after 21 days?',
          choices:['Red','Green','Blue','White'], correct:2, pts:1,
          explanation:'<b>C.</b> Among the three single-wavelength conditions (Red, Green, Blue) the bar for Blue is highest at 18 cm. White is the control, not a single wavelength.' },
        { n:2, type:'MC', ref:'Table', text:'Based on the data, which condition produced the lowest chlorophyll concentration?',
          choices:['Red','Green','Blue','White'], correct:1, pts:1,
          explanation:'<b>B.</b> Reading the chlorophyll column: Red 3.2, Green 2.1, Blue 4.5, White 5.1. Green is the lowest at 2.1 mg/g.' },
        { n:3, type:'MC', ref:'Trend', text:'Among red, green, and blue light, what is the relationship between average plant height and average chlorophyll concentration?',
          choices:['As one increases, the other decreases','As one increases, the other also increases','The two are unrelated','Both decrease together'], correct:1, pts:1,
          explanation:'<b>B.</b> Red (14 cm, 3.2 mg/g), Green (9 cm, 2.1 mg/g), Blue (18 cm, 4.5 mg/g). Higher height tracks with higher chlorophyll across the three colors — a positive relationship.' },
        { n:4, type:'MC', ref:'Control reasoning', text:'White light was used as the control condition because it:',
          choices:['contains no usable wavelengths for photosynthesis','contains all visible wavelengths, providing a baseline for comparison','is the easiest light to produce in a lab','simulates moonlight'], correct:1, pts:1,
          explanation:'<b>B.</b> White light contains the full visible spectrum, which gives a natural baseline against which the single-wavelength results can be compared.' },
        { n:5, type:'MC', ref:'Inference', text:'A new test condition uses a 50/50 mix of red + blue light. Based on the trend in the data, the most reasonable prediction for plant height is:',
          choices:['less than 9 cm','between 14 and 18 cm','greater than 23 cm','exactly 9 cm'], correct:1, pts:1,
          explanation:'<b>B.</b> Red alone gave 14 cm and blue alone gave 18 cm. A 50/50 mix would reasonably fall between those two values.' },
        { n:6, type:'MC', ref:'Experimental design', text:'Which of the following changes to the experiment would best test whether intensity (rather than wavelength) drives the height difference?',
          choices:['Use the same wavelength but vary the intensity','Use the same intensity but vary the wavelength','Add a soil nutrient to each pot','Run the experiment for only 7 days'], correct:0, pts:1,
          explanation:'<b>A.</b> To isolate the effect of intensity you hold wavelength constant and vary intensity. The current design varies wavelength while assuming intensity is held constant.' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage II — Solubility of a Salt in Water',
      fullText:`<p><b>Background.</b> Researchers measured the solubility of potassium nitrate (KNO₃) in water at six temperatures. Solubility is reported as grams of KNO₃ that dissolve in 100 g of water at saturation.</p>
        <svg viewBox="0 0 360 230" width="360" height="230" style="display:block;margin:10px 0"><line x1="48" y1="190" x2="350" y2="190" stroke="#27272a"/><line x1="48" y1="20" x2="48" y2="190" stroke="#27272a"/><text x="200" y="218" text-anchor="middle" font-size="11" fill="#52525b">Temperature (°C)</text><text x="0" y="100" font-size="10" fill="#52525b" transform="rotate(-90 16 100)">Solubility (g per 100 g H₂O)</text>${[0,20,40,60,80,100].map((t,i)=>`<line x1="${48+i*60}" y1="188" x2="${48+i*60}" y2="192" stroke="#27272a"/><text x="${48+i*60}" y="205" text-anchor="middle" font-size="10" fill="#52525b">${t}</text>`).join('')}${[0,50,100,150,200].map(v=>`<line x1="46" y1="${190-v*0.85}" x2="50" y2="${190-v*0.85}" stroke="#27272a"/><text x="44" y="${193-v*0.85}" text-anchor="end" font-size="10" fill="#52525b">${v}</text>`).join('')}<polyline points="${[[0,13],[20,32],[40,64],[60,110],[80,170],[100,246]].map(([t,s])=>`${48+t*3},${190-s*0.85}`).join(' ')}" fill="none" stroke="#7c3aed" stroke-width="2.2"/>${[[0,13],[20,32],[40,64],[60,110],[80,170],[100,246]].map(([t,s])=>`<circle cx="${48+t*3}" cy="${190-s*0.85}" r="3" fill="#7c3aed"/>`).join('')}<text x="200" y="14" text-anchor="middle" font-size="11" fill="#27272a" font-weight="700">Figure 1. Solubility of KNO₃ vs. Temperature</text></svg>`,
      questions:[
        { n:7, type:'MC', ref:'Figure 1', text:'According to Figure 1, the solubility of KNO₃ at 40°C is approximately:',
          choices:['13 g','32 g','64 g','110 g'], correct:2, pts:1,
          explanation:'<b>C.</b> Reading the graph at T = 40°C, the data point lies just above 60 on the y-axis (≈ 64 g per 100 g of water).' },
        { n:8, type:'MC', ref:'Trend', text:'Based on Figure 1, as temperature increases from 0°C to 100°C, the solubility of KNO₃:',
          choices:['decreases linearly','remains roughly constant','increases at a roughly constant rate','increases at an increasing rate'], correct:3, pts:1,
          explanation:'<b>D.</b> The curve is steeper between 60–100°C than between 0–40°C, so solubility rises faster at higher temperatures — i.e. the rate of increase grows.' },
        { n:9, type:'MC', ref:'Interpolation', text:'A reasonable estimate of the solubility of KNO₃ at 50°C is:',
          choices:['~50 g','~80 g','~110 g','~150 g'], correct:1, pts:1,
          explanation:'<b>B.</b> 50°C lies halfway between 40°C (64 g) and 60°C (110 g). Linear interpolation gives ≈ 87 g, which rounds toward 80 g among the offered choices.' },
        { n:10, type:'MC', ref:'Saturation', text:'A student dissolves 100 g of KNO₃ in 100 g of water at 60°C. The solution is:',
          choices:['unsaturated','saturated','supersaturated','frozen'], correct:0, pts:1,
          explanation:'<b>A.</b> At 60°C the saturation point is ~110 g per 100 g H₂O. With only 100 g dissolved, the water can hold more — the solution is unsaturated.' },
        { n:11, type:'MC', ref:'Cooling crystallization', text:'A saturated solution at 80°C is cooled to 20°C. Approximately how much KNO₃ would crystallize out of 100 g of water?',
          choices:['~32 g','~50 g','~110 g','~138 g'], correct:3, pts:1,
          explanation:'<b>D.</b> Solubility at 80°C ≈ 170 g; at 20°C ≈ 32 g. Excess crystallizing out per 100 g water = 170 − 32 ≈ 138 g.' },
        { n:12, type:'MC', ref:'Hypothesis', text:'Which hypothesis is best supported by the data in Figure 1?',
          choices:['Cooler water dissolves more KNO₃','Solubility is independent of temperature','The dissolution of KNO₃ in water is endothermic','KNO₃ does not dissolve below 60°C'], correct:2, pts:1,
          explanation:'<b>C.</b> When solubility increases with temperature the forward (dissolution) process absorbs heat — the dissolution of KNO₃ is endothermic.' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage III — Reaction Rate Studies',
      fullText:`<p><b>Study 1.</b> A reaction was run at 25°C with five different catalyst concentrations. Initial reaction rate (M/s) was recorded.</p>
        <p><b>Study 2.</b> The same reaction was repeated holding catalyst concentration at 0.05 M and varying temperature.</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin:8px 0"><tr style="background:#f4f4f5"><th colspan="2" style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">Study 1 (T = 25°C)</th><th></th><th colspan="2" style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">Study 2 ([Catalyst] = 0.05 M)</th></tr><tr style="background:#fafafa"><th style="border:1px solid #d4d4d8;padding:4px 8px">[Catalyst] (M)</th><th style="border:1px solid #d4d4d8;padding:4px 8px">Rate (M/s)</th><td style="background:#fff"></td><th style="border:1px solid #d4d4d8;padding:4px 8px">Temp (°C)</th><th style="border:1px solid #d4d4d8;padding:4px 8px">Rate (M/s)</th></tr>${[[0.01,0.0008,15,0.0012],[0.02,0.0016,25,0.0024],[0.05,0.0040,35,0.0048],[0.10,0.0080,45,0.0096],[0.20,0.0160,55,0.0192]].map(r=>`<tr><td style="border:1px solid #d4d4d8;padding:4px 8px;text-align:center">${r[0]}</td><td style="border:1px solid #d4d4d8;padding:4px 8px;text-align:center">${r[1].toFixed(4)}</td><td style="background:#fff"></td><td style="border:1px solid #d4d4d8;padding:4px 8px;text-align:center">${r[2]}</td><td style="border:1px solid #d4d4d8;padding:4px 8px;text-align:center">${r[3].toFixed(4)}</td></tr>`).join('')}</table>`,
      questions:[
        { n:13, type:'MC', ref:'Study 1', text:'In Study 1, as catalyst concentration doubled from 0.05 M to 0.10 M, the rate:',
          choices:['stayed the same','approximately doubled','approximately quadrupled','was halved'], correct:1, pts:1,
          explanation:'<b>B.</b> Rate at 0.05 M = 0.0040 M/s; at 0.10 M = 0.0080 M/s. Doubling [Catalyst] doubled the rate.' },
        { n:14, type:'MC', ref:'Study 2', text:'In Study 2, when temperature increased from 25°C to 45°C, the rate:',
          choices:['decreased by half','approximately doubled','approximately tripled','approximately quadrupled'], correct:3, pts:1,
          explanation:'<b>D.</b> Rate at 25°C = 0.0024 M/s; at 45°C = 0.0096 M/s. 0.0096 / 0.0024 = 4 — about four times.' },
        { n:15, type:'MC', ref:'Cross-study comparison', text:'Which factor produced a larger relative rate change per equivalent unit increase?',
          choices:['Doubling [Catalyst] in Study 1','Adding 10°C of temperature in Study 2','Both produced the same relative effect','Cannot be determined from the data'], correct:1, pts:1,
          explanation:'<b>B.</b> Doubling [Catalyst] (Study 1) doubled the rate. Adding 10°C (Study 2) roughly doubled the rate too — but only over a 10°C interval. So per unit of "1°C," the temperature effect compounds faster than the linear catalyst effect.' },
        { n:16, type:'MC', ref:'Prediction', text:'If Study 1 were extended to [Catalyst] = 0.40 M (T held at 25°C), the predicted rate is closest to:',
          choices:['0.0080 M/s','0.0160 M/s','0.0320 M/s','0.0640 M/s'], correct:2, pts:1,
          explanation:'<b>C.</b> Rate is linear in [Catalyst] in Study 1. 0.40 M is twice 0.20 M, so the rate doubles from 0.0160 to 0.0320 M/s.' },
        { n:17, type:'MC', ref:'Controlled variable', text:'Which variable was held constant in BOTH studies?',
          choices:['[Catalyst]','Temperature','Identity of the reactants','Reaction time'], correct:2, pts:1,
          explanation:'<b>C.</b> Each study varied one factor (catalyst or temperature) but the same reaction was used throughout. The reactants — and therefore the chemistry — were held constant.' },
        { n:18, type:'MC', ref:'Hypothesis', text:'A claim that "temperature alone determines reaction rate" is best characterized as:',
          choices:['Fully supported by Study 1','Fully supported by Study 2','Inconsistent with Study 1','Inconsistent with Study 2'], correct:2, pts:1,
          explanation:'<b>C.</b> Study 1 shows that catalyst concentration also drives rate at fixed temperature, contradicting "temperature alone."' },
        { n:19, type:'MC', ref:'Order of reaction', text:'The data from Study 1 most strongly suggest that the reaction is:',
          choices:['Zero order in catalyst','First order in catalyst','Second order in catalyst','Independent of catalyst'], correct:1, pts:1,
          explanation:'<b>B.</b> Rate scales linearly with [Catalyst] (rate / [Catalyst] is constant ≈ 0.08), the signature of a first-order dependence on catalyst.' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage IV — Pendulum Period Experiment',
      fullText:`<p><b>Study 1.</b> Students measured the period (T, seconds) of a pendulum at five different lengths (L, meters), holding the pendulum mass constant at 100 g.</p>
        <p><b>Study 2.</b> The same setup was repeated with five different masses, holding length constant at 0.50 m.</p>
        <svg viewBox="0 0 380 230" width="380" height="230" style="display:block;margin:10px 0"><line x1="50" y1="190" x2="370" y2="190" stroke="#27272a"/><line x1="50" y1="20" x2="50" y2="190" stroke="#27272a"/><text x="210" y="218" text-anchor="middle" font-size="11" fill="#52525b">Length L (m)</text><text x="0" y="100" font-size="10" fill="#52525b" transform="rotate(-90 16 100)">Period T (s)</text>${[0.0,0.5,1.0,1.5,2.0].map((v,i)=>`<line x1="${50+i*70}" y1="188" x2="${50+i*70}" y2="192" stroke="#27272a"/><text x="${50+i*70}" y="205" text-anchor="middle" font-size="10" fill="#52525b">${v}</text>`).join('')}${[0,1,2,3].map(v=>`<line x1="48" y1="${190-v*55}" x2="52" y2="${190-v*55}" stroke="#27272a"/><text x="44" y="${193-v*55}" text-anchor="end" font-size="10" fill="#52525b">${v}</text>`).join('')}${[[0.25,1.00],[0.50,1.42],[0.75,1.74],[1.00,2.01],[1.50,2.46]].map(p=>`<circle cx="${50+p[0]*140}" cy="${190-p[1]*55}" r="3.5" fill="#7c3aed"/>`).join('')}<path d="M 50 190 Q 200 60 400 0" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.5"/><text x="210" y="14" text-anchor="middle" font-size="11" fill="#27272a" font-weight="700">Figure 1. Study 1 — Period vs. Pendulum Length</text></svg>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin:8px 0"><tr style="background:#f4f4f5"><th style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">Study 2</th><th style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">Mass (g)</th><th style="border:1px solid #d4d4d8;padding:5px 8px;text-align:center">Period T (s)</th></tr>${[[50,1.42],[100,1.42],[150,1.43],[200,1.41],[250,1.42]].map((r,i)=>`<tr><td style="border:1px solid #d4d4d8;padding:4px 8px;text-align:center">${i+1}</td><td style="border:1px solid #d4d4d8;padding:4px 8px;text-align:center">${r[0]}</td><td style="border:1px solid #d4d4d8;padding:4px 8px;text-align:center">${r[1]}</td></tr>`).join('')}</table>`,
      questions:[
        { n:20, type:'MC', ref:'Figure 1', text:'According to Figure 1, the period of a pendulum with L = 1.00 m is closest to:',
          choices:['1.00 s','1.42 s','2.01 s','2.46 s'], correct:2, pts:1,
          explanation:'<b>C.</b> Reading the data point at L = 1.00 m gives T ≈ 2.01 s.' },
        { n:21, type:'MC', ref:'Trend', text:'In Study 1, as the length of the pendulum increased, the period:',
          choices:['decreased','increased','stayed the same','first increased, then decreased'], correct:1, pts:1,
          explanation:'<b>B.</b> Every successive (L, T) pair shows T rising as L rises — period increases with length.' },
        { n:22, type:'MC', ref:'Study 2', text:'Based on Study 2, varying the mass from 50 g to 250 g had what effect on the pendulum\'s period?',
          choices:['Period increased substantially','Period decreased substantially','Period remained essentially constant','Period oscillated unpredictably'], correct:2, pts:1,
          explanation:'<b>C.</b> All five trials produced periods within ±0.01 s of 1.42 s — mass had essentially no effect.' },
        { n:23, type:'MC', ref:'Comparison', text:'The two studies together best support which conclusion?',
          choices:['Period depends on both length and mass','Period depends on length only','Period depends on mass only','Period is independent of both'], correct:1, pts:1,
          explanation:'<b>B.</b> Study 1 shows length matters; Study 2 shows mass does not. So among these two variables, only length affects period.' },
        { n:24, type:'MC', ref:'Prediction', text:'Predict the period for a 0.50 m pendulum with a 500 g mass.',
          choices:['~0.7 s','~1.4 s','~2.0 s','~3.5 s'], correct:1, pts:1,
          explanation:'<b>B.</b> From Study 1, L = 0.50 m gives T ≈ 1.42 s. Study 2 shows mass does not change T. So 500 g at 0.50 m → ~1.42 s.' },
        { n:25, type:'MC', ref:'Source of error', text:'Which of these is the LEAST likely source of variation among the masses tested in Study 2?',
          choices:['Air resistance','Slight differences in release angle','The mass of the pendulum bob','Friction at the pivot'], correct:2, pts:1,
          explanation:'<b>C.</b> Study 2 was specifically designed to vary mass, and the data show mass had essentially no effect on T. So mass is the LEAST likely source of period variation.' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage V — Conflicting Viewpoints: Origin of Earth\'s Moon',
      fullText:`<p><b>Scientist 1 (Capture Hypothesis).</b> The Moon was formed elsewhere in the solar system and was later gravitationally captured by Earth. Differences in oxygen-isotope ratios between Earth and Moon samples should be expected if the two bodies formed in different regions of the early solar system.</p>
        <p><b>Scientist 2 (Giant Impact Hypothesis).</b> About 4.5 billion years ago, a Mars-sized body (Theia) struck the proto-Earth. Debris from the collision coalesced in orbit to form the Moon. This model predicts strong chemical similarity between Earth\'s mantle and the Moon, since both contain material from the impactor and proto-Earth.</p>`,
      questions:[
        { n:26, type:'MC', ref:'Scientist 1', text:'Scientist 1 would most likely argue that the Moon and Earth:',
          choices:['Formed from the same material at the same time','Have nearly identical compositions','Originated in different regions of the solar system','Were once a single planet that split apart'], correct:2, pts:1,
          explanation:'<b>C.</b> The capture hypothesis specifically predicts that the Moon formed elsewhere — i.e. from a different region of the early solar system.' },
        { n:27, type:'MC', ref:'Scientist 2', text:'According to Scientist 2, evidence that would most strongly support the giant impact hypothesis is:',
          choices:['Large compositional differences between Earth and the Moon','Strong compositional similarity between Earth\'s mantle and the Moon','The Moon orbiting in the opposite direction of Earth\'s rotation','The Moon having a substantially larger iron core than Earth'], correct:1, pts:1,
          explanation:'<b>B.</b> Scientist 2 explicitly predicts strong chemical similarity since both bodies share material from the proto-Earth and impactor.' },
        { n:28, type:'MC', ref:'Test', text:'Suppose oxygen-isotope ratios in Moon rocks are found to be nearly identical to those in Earth\'s mantle. This finding would:',
          choices:['Support Scientist 1 only','Support Scientist 2 only','Support both equally','Refute both'], correct:1, pts:1,
          explanation:'<b>B.</b> Identical isotope ratios match Scientist 2\'s prediction of compositional similarity. Scientist 1 (capture) predicts differences, so this finding would weaken Scientist 1.' },
        { n:29, type:'MC', ref:'Both', text:'Both scientists would agree that:',
          choices:['The Moon\'s composition is identical to Earth\'s','The Moon was formed elsewhere and captured later','The Moon orbits Earth today','The Moon caused mass extinctions on Earth'], correct:2, pts:1,
          explanation:'<b>C.</b> Both hypotheses describe how the Moon ended up in Earth orbit. The orbital fact itself is not in dispute.' },
        { n:30, type:'MC', ref:'Weakness', text:'A common challenge to BOTH hypotheses is that:',
          choices:['Each must explain how the Moon\'s orbit became roughly circular','Each predicts the Moon should have its own large iron core','Each predicts the Moon should be larger than Earth','Neither requires any chemical evidence'], correct:0, pts:1,
          explanation:'<b>A.</b> Both capture and impact must explain the present, near-circular lunar orbit (capture must dynamically circularize a captured body; impact must form a circularized orbit from a debris disk).' },
        { n:31, type:'MC', ref:'Predicted differences', text:'Which observation would strengthen Scientist 1 over Scientist 2?',
          choices:['Moon rocks share the same oxygen-isotope ratios as Earth','Moon rocks contain isotopes typical of asteroids from the outer solar system','The Moon\'s iron core is small relative to its size','Earth\'s mantle is depleted in the elements found in the Moon'], correct:1, pts:1,
          explanation:'<b>B.</b> Distinct isotopic signatures pointing to a different formation region directly support capture (Scientist 1) and weaken the giant-impact prediction of similarity.' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage VI — Enzyme Activity vs pH',
      fullText:`<p><b>Background.</b> The activity of an enzyme was measured at pH values from 2 to 12. Activity is reported as a percentage of the maximum observed.</p>
        <svg viewBox="0 0 380 220" width="380" height="220" style="display:block;margin:10px 0"><line x1="48" y1="180" x2="370" y2="180" stroke="#27272a"/><line x1="48" y1="20" x2="48" y2="180" stroke="#27272a"/><text x="210" y="208" text-anchor="middle" font-size="11" fill="#52525b">pH</text><text x="0" y="100" font-size="10" fill="#52525b" transform="rotate(-90 16 100)">Activity (% of max)</text>${[2,4,6,8,10,12].map((v,i)=>`<line x1="${48+i*60}" y1="178" x2="${48+i*60}" y2="182" stroke="#27272a"/><text x="${48+i*60}" y="195" text-anchor="middle" font-size="10" fill="#52525b">${v}</text>`).join('')}${[0,25,50,75,100].map(v=>`<line x1="46" y1="${180-v*1.5}" x2="50" y2="${180-v*1.5}" stroke="#27272a"/><text x="44" y="${183-v*1.5}" text-anchor="end" font-size="10" fill="#52525b">${v}</text>`).join('')}<polyline points="${[[2,5],[4,30],[5,72],[6,92],[7,100],[8,92],[9,68],[10,28],[12,4]].map(p=>`${48+p[0]*30},${180-p[1]*1.5}`).join(' ')}" fill="none" stroke="#7c3aed" stroke-width="2.2"/>${[[2,5],[4,30],[7,100],[10,28],[12,4]].map(p=>`<circle cx="${48+p[0]*30}" cy="${180-p[1]*1.5}" r="3" fill="#7c3aed"/>`).join('')}<text x="210" y="14" text-anchor="middle" font-size="11" fill="#27272a" font-weight="700">Figure 1. Activity vs pH</text></svg>`,
      questions:[
        { n:32, type:'MC', ref:'Figure 1', text:'Based on Figure 1, the optimal pH for this enzyme is closest to:',
          choices:['pH 2','pH 5','pH 7','pH 10'], correct:2, pts:1,
          explanation:'<b>C.</b> The peak of the activity curve sits at pH 7 (100% of maximum activity).' },
        { n:33, type:'MC', ref:'Symmetry', text:'The activity curve is best described as:',
          choices:['Linear and increasing','Linear and decreasing','Approximately symmetric around the optimum','Constant across all pH values'], correct:2, pts:1,
          explanation:'<b>C.</b> Activity rises from pH 2–7 and falls from pH 7–12 in a roughly mirror-image fashion — a symmetric bell curve.' },
        { n:34, type:'MC', ref:'Inference', text:'Which best explains the drop in activity at pH 2 and pH 12?',
          choices:['The enzyme catalyzes the reaction faster at extreme pH','Extreme pH denatures the enzyme, reducing activity','The substrate is unstable at neutral pH','Temperature was changed at the extremes'], correct:1, pts:1,
          explanation:'<b>B.</b> Extreme acid or base disrupts the enzyme\'s 3-D structure (denatures it), eliminating its catalytic ability.' },
        { n:35, type:'MC', ref:'Application', text:'A researcher wants to maximize enzyme activity in a buffer. Which buffer is best?',
          choices:['pH 2','pH 5','pH 7','pH 12'], correct:2, pts:1,
          explanation:'<b>C.</b> Activity is highest at pH 7. The buffer should match the optimum.' },
        { n:36, type:'MC', ref:'Alternative test', text:'If a similar enzyme was found to have an optimum at pH 4, the most likely environment for it is:',
          choices:['Saliva (pH ≈ 7)','Blood plasma (pH ≈ 7.4)','Stomach (pH ≈ 2)','Lysosome (pH ≈ 4–5)'], correct:3, pts:1,
          explanation:'<b>D.</b> An enzyme tuned to pH 4 would function best inside acidic compartments like lysosomes (pH 4–5).' }
      ]
    },
    {
      type:'RR_PASSAGE',
      title:'Passage VII — Atmospheric CO₂ from Ice Cores',
      fullText:`<p><b>Background.</b> Antarctic ice cores were used to estimate atmospheric CO₂ concentration (ppm) and average global temperature anomaly (°C, relative to a 1900 baseline) over the past 150,000 years.</p>
        <svg viewBox="0 0 380 230" width="380" height="230" style="display:block;margin:10px 0"><line x1="50" y1="180" x2="370" y2="180" stroke="#27272a"/><line x1="50" y1="20" x2="50" y2="180" stroke="#27272a"/><text x="210" y="208" text-anchor="middle" font-size="11" fill="#52525b">Years before present (× 1000)</text><text x="0" y="100" font-size="10" fill="#52525b" transform="rotate(-90 16 100)">CO₂ (ppm)</text>${[150,120,90,60,30,0].map((v,i)=>`<line x1="${50+i*64}" y1="178" x2="${50+i*64}" y2="182" stroke="#27272a"/><text x="${50+i*64}" y="195" text-anchor="middle" font-size="10" fill="#52525b">${v}</text>`).join('')}${[180,200,220,240,260,280,300].map(v=>`<line x1="48" y1="${180-(v-180)*1.3}" x2="52" y2="${180-(v-180)*1.3}" stroke="#27272a"/><text x="44" y="${183-(v-180)*1.3}" text-anchor="end" font-size="10" fill="#52525b">${v}</text>`).join('')}<polyline points="${[[150,260],[140,275],[125,205],[110,200],[100,225],[80,210],[60,200],[40,195],[20,255],[10,275],[0,290]].map(p=>`${50+(150-p[0])*(320/150)},${180-(p[1]-180)*1.3}`).join(' ')}" fill="none" stroke="#7c3aed" stroke-width="2"/>${[[125,205],[20,255]].map(p=>`<circle cx="${50+(150-p[0])*(320/150)}" cy="${180-(p[1]-180)*1.3}" r="3" fill="#7c3aed"/>`).join('')}<text x="210" y="14" text-anchor="middle" font-size="11" fill="#27272a" font-weight="700">Figure 1. CO₂ vs. Years before Present</text></svg>`,
      questions:[
        { n:37, type:'MC', ref:'Figure 1', text:'Based on Figure 1, atmospheric CO₂ at 125,000 years before present was approximately:',
          choices:['~190 ppm','~205 ppm','~260 ppm','~290 ppm'], correct:1, pts:1,
          explanation:'<b>B.</b> Reading the curve at 125 ka gives a CO₂ value near 205 ppm — a glacial low.' },
        { n:38, type:'MC', ref:'Pattern', text:'The data show that over 150,000 years CO₂ has:',
          choices:['Stayed constant','Decreased steadily','Risen sharply only in the last 20,000 years','Cycled within a band, then risen sharply in the most recent millennia'], correct:3, pts:1,
          explanation:'<b>D.</b> CO₂ oscillates between ~180–280 ppm for most of the record, then climbs steeply toward ~290+ ppm near the present.' },
        { n:39, type:'MC', ref:'Inference', text:'A correlation between CO₂ and the temperature anomaly described in the background is best summarized as:',
          choices:['Positive — high CO₂ tracks high temperatures','Negative — high CO₂ tracks low temperatures','None — the variables are unrelated','Linear and constant across the record'], correct:0, pts:1,
          explanation:'<b>A.</b> Glacial lows in CO₂ correspond with cold temperatures and interglacial highs with warm — a positive correlation.' },
        { n:40, type:'MC', ref:'Caution', text:'A reasonable limitation of using ice cores to draw conclusions about today\'s climate is that:',
          choices:['Ice cores cannot record temperature','Modern industrial CO₂ sources may not be represented in older ice','Ice cores only record local Antarctic conditions, never global trends','Ice cores invent CO₂ values'], correct:1, pts:1,
          explanation:'<b>B.</b> Ice cores capture pre-industrial natural cycles. Industrial-era emissions (post-~1850) appear only in the most recent shallow ice — meaning long-term comparisons are not directly to "modern" sources.' }
      ]
    }
  ],

  'act-writing': [
    {
      n:1,
      type:'ACT_WRITING',
      text:ACT_WRITING_PROMPT.issue,
      pts:12,
      title:ACT_WRITING_PROMPT.title,
      issue:ACT_WRITING_PROMPT.issue,
      perspectives:ACT_WRITING_PROMPT.perspectives,
      taskInstructions:ACT_WRITING_PROMPT.taskInstructions,
      directions:ACT_WRITING_PROMPT.directions,
      planningPrompt:ACT_WRITING_PROMPT.planningPrompt,
      rubricDomains:ACT_WRITING_DOMAINS
    }
  ],

  // ── SAT R&W: unified RR_PASSAGE format — each passage has 1 question ──
  'sat-rw1': [
    { type:'RR_PASSAGE', title:'Passage 1 — Information & Ideas', domain:'Information & Ideas', fullText:`<p>A recent study published in <em>Nature</em> examined the impact of urbanization on bird migration patterns. Researchers tracked over 2,000 birds across 15 species using GPS transmitters and found that light pollution from major metropolitan areas caused a 23% deviation in traditional migratory routes. The study's lead author, Dr. Sarah Chen, noted that "the cumulative effect of urban sprawl is fundamentally reshaping avian behavior on a continental scale."</p>`, questions:[
      { n:1, type:'MC', ref:'Full text', text:'Which choice best describes the main idea of the text?', choices:['Cities have made it impossible for birds to migrate successfully.','Research has shown that urban light pollution significantly alters bird migration paths.','Dr. Chen believes urbanization should be halted to protect bird populations.','Bird migration patterns have remained unchanged despite urban development.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 2 — Craft & Structure', domain:'Craft & Structure', fullText:`<p><span class="q-ref" data-q="2">The narrator had always believed that silence was an absence — a void waiting to be filled with sound, with words, with meaning.</span> But sitting beside her grandfather on the porch that August evening, watching fireflies punctuate the darkness, she began to understand that some silences are full. His weathered hand rested on the armrest between them, close enough to touch but not touching, and in that space she felt everything he couldn't say.</p>`, questions:[
      { n:2, type:'MC', ref:'Sentence 1 (underlined)', text:'Which choice best describes the function of the underlined sentence in the text as a whole?', choices:['It introduces a conflict between the narrator and her grandfather.','It establishes the narrator\'s previous understanding before showing her shift in perspective.','It explains why the narrator prefers noise to quiet.','It provides background information about the narrator\'s childhood.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 3 — Standard English Conventions', domain:'Standard English Conventions', fullText:`<p>The Rosetta Stone, discovered in 1799 by French soldiers in <span class="q-ref" data-q="3">______</span> was instrumental in deciphering Egyptian hieroglyphics. The stone bears the same decree in three scripts: hieroglyphic, Demotic, and ancient Greek.</p>`, questions:[
      { n:3, type:'MC', ref:'Blank in text', text:'Which choice completes the text so that it conforms to the conventions of Standard English?', choices:['Egypt;','Egypt —','Egypt,','Egypt'], correct:2, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 4 — Expression of Ideas', domain:'Expression of Ideas', fullText:`<p>Marine biologist Dr. Ayana Torres has spent two decades studying coral reef ecosystems in the Caribbean. Her research has documented a 40% decline in coral cover since 2000. She attributes this decline primarily to rising ocean temperatures, which cause coral bleaching. <span class="q-ref" data-q="4">______</span> Torres emphasizes that local conservation efforts, such as reducing runoff pollution, can slow the rate of decline even as global temperatures continue to rise.</p>`, questions:[
      { n:4, type:'MC', ref:'Blank in text', text:'Which choice most logically completes the text?', choices:['In other words,','However,','For example,','Similarly,'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 5 — Information & Ideas', domain:'Information & Ideas', fullText:`<p>A 2024 meta-analysis of 47 studies on intermittent fasting found that participants who followed time-restricted eating patterns (consuming food within an 8-hour window) experienced an average weight loss of 3.2 kg over 12 weeks. <span class="q-ref" data-q="5">However, the analysis also revealed no statistically significant difference in long-term weight maintenance between intermittent fasting and traditional calorie restriction after one year.</span></p>`, questions:[
      { n:5, type:'MC', ref:'Sentence 2', text:'Based on the text, what can most reasonably be concluded about intermittent fasting?', choices:['It is ineffective for weight loss.','It produces short-term results comparable to other methods but may not offer long-term advantages.','It is superior to all other dietary approaches.','It only works when combined with exercise.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 6 — Craft & Structure', domain:'Craft & Structure', fullText:`<p>The concept of "deep time" — the vastness of geological history — was first articulated by Scottish geologist James Hutton in the late 18th century. <span class="q-ref" data-q="6">Before Hutton, most Western scholars believed Earth was only a few thousand years old.</span> His observations of rock formations in Scotland led him to conclude that the planet's history extended far beyond human comprehension.</p>`, questions:[
      { n:6, type:'MC', ref:'Sentence 2', text:'Which choice best describes the function of the underlined sentence?', choices:['It provides a counterargument to Hutton\'s theory.','It establishes the prevailing view that Hutton challenged.','It summarizes Hutton\'s main contribution.','It describes the methodology Hutton used.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 7 — Standard English Conventions', domain:'Standard English Conventions', fullText:`<p>The Amazon rainforest, which spans nine <span class="q-ref" data-q="7">countries,</span> produces approximately 20% of the world's oxygen. Scientists warn that continued deforestation could push the ecosystem past a critical tipping point.</p>`, questions:[
      { n:7, type:'MC', ref:'Punctuation', text:'Which choice completes the text so that it conforms to the conventions of Standard English?', choices:['countries,','countries;','countries—','countries'], correct:0, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 8 — Expression of Ideas', domain:'Expression of Ideas', fullText:`<p>Architect Maya Lin is best known for designing the Vietnam Veterans Memorial in Washington, D.C. She was only 21 years old when her design was selected from over 1,400 entries. <span class="q-ref" data-q="8">______</span> Her minimalist approach — a polished black granite wall inscribed with names — was initially controversial but has since become one of the most visited memorials in the United States.</p>`, questions:[
      { n:8, type:'MC', ref:'Blank in text', text:'Which choice most logically completes the text?', choices:['In contrast,','Despite her youth, the selection committee recognized the power of her vision.','Similarly,','The memorial was completed in 1982.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 9 — Information & Ideas', domain:'Information & Ideas', fullText:`<p>Researchers at Stanford University have developed an AI system capable of detecting early-stage pancreatic cancer from CT scans with 95% accuracy. <span class="q-ref" data-q="9">Current methods detect the disease at advanced stages in approximately 80% of cases, resulting in a five-year survival rate of less than 10%.</span> The AI tool could transform outcomes by enabling treatment when the cancer is still operable.</p>`, questions:[
      { n:9, type:'MC', ref:'Sentence 2', text:'Which choice best describes how the underlined sentence functions in the text?', choices:['It provides evidence that AI is unreliable.','It establishes the severity of the problem the AI tool aims to address.','It compares pancreatic cancer to other diseases.','It explains the technical mechanism of the AI system.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 10 — Craft & Structure', domain:'Craft & Structure', fullText:`<p>In Toni Morrison's <em>Beloved</em>, the house at 124 Bluestone Road is described in the novel's opening line as "spiteful." Morrison's choice to anthropomorphize the house <span class="q-ref" data-q="10">establishes from the very first word that the past is not merely remembered in this story — it is a living, active force that occupies physical space.</span></p>`, questions:[
      { n:10, type:'MC', ref:'Underlined portion', text:'Which choice best describes what the underlined portion achieves?', choices:['It criticizes Morrison\'s literary technique.','It explains the symbolic significance of the author\'s narrative choice.','It provides a summary of the novel\'s plot.','It compares Morrison to other authors.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 11 — Standard English Conventions', domain:'Standard English Conventions', fullText:`<p>The city council voted unanimously to approve the new park <span class="q-ref" data-q="11">______</span> which will include a community garden, a playground, and a walking trail along the river.</p>`, questions:[
      { n:11, type:'MC', ref:'Blank', text:'Which choice completes the text so that it conforms to the conventions of Standard English?', choices:['design,','design;','design:','design'], correct:0, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 12 — Expression of Ideas', domain:'Expression of Ideas', fullText:`<p>Solar panel efficiency has increased dramatically over the past decade. In 2015, the average commercial panel converted about 15% of sunlight into electricity. <span class="q-ref" data-q="12">______</span> Today, the best panels achieve conversion rates above 23%, with experimental models reaching 47%.</p>`, questions:[
      { n:12, type:'MC', ref:'Blank', text:'Which choice most effectively uses data to illustrate the trend described in the text?', choices:['This is good news for the environment.','Many companies now manufacture solar panels.','The improvement reflects advances in photovoltaic cell materials and design.','Some people remain skeptical about solar energy.'], correct:2, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 13 — Information & Ideas', domain:'Information & Ideas', fullText:`<p>A study published in <em>The Lancet</em> examined sleep patterns of 15,000 adults across 12 countries. Participants who consistently slept fewer than six hours per night had a 27% higher risk of cardiovascular disease. <span class="q-ref" data-q="13">Interestingly, those who slept more than nine hours also showed elevated risk, suggesting a U-shaped relationship between sleep duration and heart health.</span></p>`, questions:[
      { n:13, type:'MC', ref:'Sentence 3', text:'What is the main idea of the text?', choices:['Sleeping too little is the primary cause of heart disease.','Both too little and too much sleep are associated with cardiovascular risk.','The study was conducted in only one country.','Sleep has no effect on heart health.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 14 — Craft & Structure', domain:'Craft & Structure', fullText:`<p>The photographer Dorothea Lange is celebrated for her Depression-era images. Her most famous photograph, "Migrant Mother," shows a worried woman surrounded by her children. <span class="q-ref" data-q="14">Lange later revealed that she took the photo in under ten minutes and never asked the woman's name — a fact that raises questions about the ethics of documentary photography.</span></p>`, questions:[
      { n:14, type:'MC', ref:'Sentence 3', text:'What is the primary purpose of the underlined sentence?', choices:['To praise Lange\'s efficiency.','To introduce an ethical complexity in Lange\'s work.','To describe the composition of the photograph.','To explain why the photo became famous.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 15 — Standard English Conventions', domain:'Standard English Conventions', fullText:`<p>The committee <span class="q-ref" data-q="15">______</span> agreed that the proposal, though ambitious, deserved further consideration before a final vote could be scheduled.</p>`, questions:[
      { n:15, type:'MC', ref:'Blank', text:'Which choice completes the text so that it conforms to the conventions of Standard English?', choices:['member\'s','members','members\'','members\'s'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 16 — Expression of Ideas', domain:'Expression of Ideas', fullText:`<p>Honeybees perform a complex "waggle dance" to communicate the location of food sources to other bees in the hive. The angle of the dance relative to the sun indicates direction, while the duration of the waggle phase corresponds to distance. <span class="q-ref" data-q="16">______</span></p>`, questions:[
      { n:16, type:'MC', ref:'Blank', text:'Which choice most effectively concludes the text?', choices:['Bees are fascinating insects.','This remarkable system allows a single forager to guide thousands of hive members to a precise location miles away.','Scientists have studied bees for centuries.','Other insects also communicate with each other.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 17 — Information & Ideas', domain:'Information & Ideas', fullText:`<p>Ocean acidification — the decrease in seawater pH caused by absorption of atmospheric CO₂ — threatens marine organisms that build calcium carbonate shells. <span class="q-ref" data-q="17">Laboratory experiments show that pteropods, small sea snails critical to Arctic food chains, experience shell dissolution within 48 hours when exposed to pH levels projected for 2100.</span></p>`, questions:[
      { n:17, type:'MC', ref:'Sentence 2', text:'Which finding, if true, would most directly support the claim made in the text?', choices:['Pteropods can adapt to any pH level.','Arctic food chains are unaffected by shell dissolution.','Field observations confirm accelerated shell thinning in pteropods from acidified waters.','CO₂ levels are declining globally.'], correct:2, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 18 — Craft & Structure', domain:'Craft & Structure', fullText:`<p>When the novelist Kazuo Ishiguro accepted the Nobel Prize in Literature, he spoke not of grand themes but of the "small, elusive" moments that define human experience. <span class="q-ref" data-q="18">His speech echoed the quiet restraint of his own fiction, where what is left unsaid often carries more weight than what is spoken.</span></p>`, questions:[
      { n:18, type:'MC', ref:'Sentence 2', text:'What is the main purpose of the underlined sentence?', choices:['To summarize Ishiguro\'s bibliography.','To draw a parallel between Ishiguro\'s speech and his literary style.','To argue that Ishiguro deserved the Nobel Prize.','To explain why Nobel speeches are typically short.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 19 — Standard English Conventions', domain:'Standard English Conventions', fullText:`<p>The renowned physicist, Dr. Amara <span class="q-ref" data-q="19">Okafor,</span> published her findings in the journal <em>Nature Physics</em> last month.</p>`, questions:[
      { n:19, type:'MC', ref:'Punctuation', text:'Which choice completes the text so that it conforms to the conventions of Standard English?', choices:['Okafor,','Okafor','Okafor;','Okafor—'], correct:0, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 20 — Expression of Ideas', domain:'Expression of Ideas', fullText:`<p>The Great Barrier Reef, the world's largest coral reef system, stretches over 2,300 kilometers along Australia's northeast coast. <span class="q-ref" data-q="20">______</span> Mass bleaching events in 2016, 2017, 2020, and 2022 have killed significant portions of the reef.</p>`, questions:[
      { n:20, type:'MC', ref:'Blank', text:'Which choice most effectively sets up the information that follows?', choices:['It is a popular tourist destination.','Despite its enormity, it remains vulnerable to rising ocean temperatures.','Many species of fish live there.','The reef was discovered by European explorers in 1770.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 21 — Information & Ideas', domain:'Information & Ideas', fullText:`<p>Archaeologists working in southern Turkey have uncovered evidence that Göbekli Tepe, dating to approximately 9500 BCE, may have functioned as a center for ritual gatherings rather than permanent settlement. <span class="q-ref" data-q="21">The site predates agriculture and pottery, challenging the long-held assumption that complex monumental architecture required settled farming communities.</span></p>`, questions:[
      { n:21, type:'MC', ref:'Sentence 2', text:'Why does the author mention that the site "predates agriculture and pottery"?', choices:['To suggest the dating is inaccurate.','To emphasize how the discovery upends conventional archaeological theory.','To argue that farming was unnecessary.','To compare Göbekli Tepe to other sites.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 22 — Craft & Structure', domain:'Craft & Structure', fullText:`<p>In her essay "On Photography," Susan Sontag argues that photographs do not simply record reality — they shape how we perceive it. <span class="q-ref" data-q="22">She compares the camera to a weapon, suggesting that to photograph someone is to exercise a subtle form of power over them.</span></p>`, questions:[
      { n:22, type:'MC', ref:'Sentence 2', text:'What rhetorical strategy does Sontag employ in the underlined sentence?', choices:['Statistical evidence.','An analogy to convey an abstract idea.','A personal anecdote.','A direct quotation from a photographer.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 23 — Standard English Conventions', domain:'Standard English Conventions', fullText:`<p>Although the experiment <span class="q-ref" data-q="23">______</span> the researchers were cautiously optimistic about scaling the results.</p>`, questions:[
      { n:23, type:'MC', ref:'Blank', text:'Which choice completes the text so that it conforms to the conventions of Standard English?', choices:['yielded only preliminary results,','yielded, only preliminary results','yielded only preliminary results;','yielded only, preliminary results'], correct:0, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 24 — Expression of Ideas', domain:'Expression of Ideas', fullText:`<p>Urban vertical farms use LED lighting and hydroponic systems to grow produce in stacked layers indoors. <span class="q-ref" data-q="24">______</span> A single vertical farm in Newark, New Jersey, produces over 2 million pounds of leafy greens annually on just one acre of land.</p>`, questions:[
      { n:24, type:'MC', ref:'Blank', text:'Which choice most effectively introduces the example that follows?', choices:['The technology is still in its infancy.','These systems can yield dramatically more food per square foot than traditional farming.','Farming has a long history.','Not everyone agrees that vertical farms are practical.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 25 — Information & Ideas', domain:'Information & Ideas', fullText:`<p>A team of linguists studying the Pirahã language of the Brazilian Amazon has found that it lacks words for exact numbers — speakers can only distinguish between "few" and "many." <span class="q-ref" data-q="25">This discovery supports the Sapir-Whorf hypothesis, which posits that the structure of a language influences its speakers' cognition and worldview.</span></p>`, questions:[
      { n:25, type:'MC', ref:'Sentence 2', text:'What role does the underlined sentence play in the text?', choices:['It provides a counterexample.','It connects the specific finding to a broader theoretical framework.','It summarizes the entire study.','It challenges the researchers\' conclusions.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 26 — Craft & Structure', domain:'Craft & Structure', fullText:`<p>The poet Claudia Rankine opens her book <em>Citizen</em> with the second-person pronoun "you," immediately collapsing the distance between reader and subject. <span class="q-ref" data-q="26">This technique forces the reader to inhabit the experiences of racial microaggressions described in the text, making them personal rather than abstract.</span></p>`, questions:[
      { n:26, type:'MC', ref:'Sentence 2', text:'What is the main purpose of the underlined sentence?', choices:['To criticize Rankine\'s writing style.','To explain the effect of the author\'s narrative choice.','To provide biographical information.','To summarize the plot of the book.'], correct:1, pts:1 }
    ]},
    { type:'RR_PASSAGE', title:'Passage 27 — Standard English Conventions', domain:'Standard English Conventions', fullText:`<p>The museum's newest exhibit features artifacts from ancient <span class="q-ref" data-q="27">Mesopotamia; including</span> cuneiform tablets, bronze tools, and ceramic vessels dating to 3000 BCE.</p>`, questions:[
      { n:27, type:'MC', ref:'Punctuation', text:'Which choice conforms to the conventions of Standard English?', choices:['Mesopotamia; including','Mesopotamia, including','Mesopotamia: including','Mesopotamia — including,'], correct:1, pts:1 }
    ]},
  ],

  'sat-rw2': (() => {
    const domains = ['Information & Ideas','Craft & Structure','Standard English Conventions','Expression of Ideas'];
    const stems = [
      'Which choice best states the main purpose of the text?',
      'What is the most likely reason the author uses this description?',
      'Which choice completes the text so that it conforms to the conventions of Standard English?',
      'Which choice most logically completes the text?',
      'Based on the text, what can most reasonably be concluded?',
      'Which choice best describes the function of the underlined sentence?',
      'What is the main idea of the text?',
    ];
    return Array.from({length:27}, (_, i) => ({
      type:'RR_PASSAGE',
      title:`Passage ${i+1} — ${domains[i % 4]}`,
      domain: domains[i % 4],
      fullText:`<p>Sample passage text for adaptive R&W Module 2, question ${i+1}. This passage tests ${domains[i % 4].toLowerCase()} skills at an adaptive difficulty level.</p>`,
      questions:[{ n:i+1, type:'MC', text: stems[i % stems.length], choices:['Choice A','Choice B','Choice C','Choice D'], correct: i % 4, pts:1 }]
    }));
  })(),

  'sat-math1': [
    { n:1, type:'MC', text:'If 3x + 7 = 22, what is the value of x?', choices:['3','5','7','15'], correct:1, pts:1 },
    { n:2, type:'MC', text:'A circle has a radius of 5. What is its area?', choices:['10π','15π','25π','50π'], correct:2, pts:1 },
    { n:3, type:'MC', text:'Which of the following is equivalent to (x + 3)(x − 2)?', choices:['x² + x − 6','x² − x − 6','x² + 5x − 6','x² − 5x + 6'], correct:0, pts:1 },
    { n:4, type:'MC', text:'What is the slope of the line 2y − 6x = 10?', choices:['2','3','−3','5'], correct:1, pts:1 },
    { n:5, type:'MC', text:'If f(x) = x² − 4, what is f(3)?', choices:['5','9','−1','13'], correct:0, pts:1 },
    { n:6, type:'MC', text:'A right triangle has legs of length 6 and 8. What is the length of the hypotenuse?', choices:['10','12','14','7'], correct:0, pts:1 },
    { n:7, type:'SA', text:'If 2(x − 3) = 14, what is the value of x?', pts:1 },
    { n:8, type:'MC', text:'Which expression is equivalent to √(50)?', choices:['5√2','2√5','25','10√5'], correct:0, pts:1 },
    { n:9, type:'MC', text:'The mean of 5 numbers is 12. If four of the numbers are 10, 11, 13, and 15, what is the fifth number?', choices:['11','9','12','10'], correct:0, pts:1 },
    { n:10, type:'MC', text:'Which of the following systems of equations has no solution?', choices:['y = 2x + 1, y = 2x + 3','y = x + 1, y = −x + 3','y = 3x, y = x + 2','y = x, y = 2x'], correct:0, pts:1 },
    { n:11, type:'SA', text:'A store offers a 20% discount on a $45 item. What is the sale price in dollars?', pts:1 },
    { n:12, type:'MC', text:'What is the value of |−7| + |3|?', choices:['4','10','−4','−10'], correct:1, pts:1 },
    { n:13, type:'MC', text:'If the probability of rain on any given day is 0.3, what is the probability of no rain?', choices:['0.3','0.7','0.5','1.3'], correct:1, pts:1 },
    { n:14, type:'MC', text:'Which of the following is a factor of x² − 9?', choices:['(x + 9)','(x − 3)','(x + 1)','(x − 9)'], correct:1, pts:1 },
    { n:15, type:'MC', text:'A line passes through (0, 4) and (2, 0). What is its equation?', choices:['y = −2x + 4','y = 2x + 4','y = −2x − 4','y = 2x − 4'], correct:0, pts:1 },
    { n:16, type:'SA', text:'What is the median of the data set: 3, 7, 7, 10, 12, 15?', pts:1 },
    { n:17, type:'MC', text:'If x³ = 27, what is the value of x?', choices:['3','9','27','6'], correct:0, pts:1 },
    { n:18, type:'MC', text:'An equilateral triangle has a perimeter of 36. What is the length of one side?', choices:['9','12','18','6'], correct:1, pts:1 },
    { n:19, type:'MC', text:'Which inequality represents "x is at least 5"?', choices:['x > 5','x ≥ 5','x < 5','x ≤ 5'], correct:1, pts:1 },
    { n:20, type:'MC', text:'What is the y-intercept of f(x) = 3x² − 6x + 2?', choices:['2','−6','3','0'], correct:0, pts:1 },
    { n:21, type:'SA', text:'A rectangular garden is 12 meters long and 8 meters wide. What is its area in square meters?', pts:1 },
    { n:22, type:'MC', text:'If sin(θ) = 3/5, what is cos(θ)?', choices:['4/5','3/4','5/3','5/4'], correct:0, pts:1 },
  ],

  'sat-math2': [
    { n:1, type:'MC', text:'The function f(x) = 2x² − 8x + 6 has a minimum value at x = ?', choices:['1','2','3','4'], correct:1, pts:1 },
    { n:2, type:'SA', text:'If the system of equations y = 2x + 1 and y = −x + 7 has a solution at point (a, b), what is the value of a + b?', pts:1 },
    { n:3, type:'MC', text:'Which of the following is the vertex form of y = x² − 6x + 5?', choices:['y = (x − 3)² − 4','y = (x − 3)² + 4','y = (x + 3)² − 4','y = (x − 6)² + 5'], correct:0, pts:1 },
    { n:4, type:'MC', text:'A population of bacteria doubles every 3 hours. If the initial population is 500, what will it be after 9 hours?', choices:['1500','2000','4000','8000'], correct:2, pts:1 },
    { n:5, type:'SA', text:'What is the value of (3² + 4²) ÷ 5?', pts:1 },
    { n:6, type:'MC', text:'In a right triangle, one angle measures 30°. If the hypotenuse is 10, what is the length of the side opposite the 30° angle?', choices:['5','5√3','10√3','10'], correct:0, pts:1 },
    { n:7, type:'MC', text:'The graph of y = −2(x − 1)² + 3 opens in which direction?', choices:['Up','Down','Left','Right'], correct:1, pts:1 },
    { n:8, type:'MC', text:'If log₂(x) = 5, what is the value of x?', choices:['10','25','32','64'], correct:2, pts:1 },
    { n:9, type:'SA', text:'A car travels 180 miles in 3 hours. What is its average speed in miles per hour?', pts:1 },
    { n:10, type:'MC', text:'Which of the following represents exponential decay?', choices:['y = 2ˣ','y = 0.5ˣ','y = x²','y = 2x'], correct:1, pts:1 },
    { n:11, type:'MC', text:'If the ratio of boys to girls in a class is 3:5, and there are 40 students total, how many boys are there?', choices:['15','24','25','12'], correct:0, pts:1 },
    { n:12, type:'MC', text:'What is the distance between points (1, 2) and (4, 6)?', choices:['5','7','3','25'], correct:0, pts:1 },
    { n:13, type:'SA', text:'Simplify: (2x³)(3x²)', pts:1 },
    { n:14, type:'MC', text:'A coin is flipped 3 times. What is the probability of getting exactly 2 heads?', choices:['1/8','3/8','1/2','1/4'], correct:1, pts:1 },
    { n:15, type:'MC', text:'Which equation represents a circle with center (2, −3) and radius 4?', choices:['(x−2)²+(y+3)²=16','(x+2)²+(y−3)²=16','(x−2)²+(y+3)²=4','(x−2)²+(y−3)²=16'], correct:0, pts:1 },
    { n:16, type:'MC', text:'If f(x) = 3x + 2, what is f⁻¹(x)?', choices:['(x−2)/3','3x−2','(x+2)/3','x/3−2'], correct:0, pts:1 },
    { n:17, type:'SA', text:'What is the sum of the interior angles of a hexagon in degrees?', pts:1 },
    { n:18, type:'MC', text:'Which of the following is an asymptote of y = 1/(x − 2)?', choices:['x = 2','y = 2','x = −2','y = −2'], correct:0, pts:1 },
    { n:19, type:'MC', text:'The standard deviation of a data set measures:', choices:['The center of the data','The spread of the data','The largest value','The range'], correct:1, pts:1 },
    { n:20, type:'MC', text:'If tan(θ) = 1, what is θ in degrees (0° < θ < 90°)?', choices:['30','45','60','90'], correct:1, pts:1 },
    { n:21, type:'SA', text:'A cylinder has a radius of 3 and height of 10. What is its volume? (Use π ≈ 3.14)', pts:1 },
    { n:22, type:'MC', text:'Which of the following best describes the end behavior of f(x) = −x³ + 2x?', choices:['As x→∞, f(x)→∞','As x→∞, f(x)→−∞','As x→−∞, f(x)→−∞','The function has no end behavior'], correct:1, pts:1 },
  ],
};

const TYPE_LABELS = {
  MC:'Multiple Choice', MS:'Multiple Select', TP:'Two-Part / Evidence',
  SA:'Short Answer', CR:'Constructed Response', FIB:'Fill in Blank',
  RR:'Read & Respond', ESSAY:'Essay', ACT_WRITING:'ACT Writing', CODE:'Coding',
  GRIDIN:'Grid-In / Numeric', HOTTEXT:'Hot Text',
  DRAG:'Drag & Drop', INLINE:'Inline Choice', MATRIX:'Matrix',
  EQ:'Equation Editor', GRAPH:'Graphing', HOTSPOT:'Hot Spot', AUDIO:'Audio'
};

