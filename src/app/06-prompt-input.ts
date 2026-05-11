// @ts-nocheck
// Phase-2 slice: lines 2640-3514 of original src/app.ts

// ═══════ PROMPT INPUT ═══════
const _promptHints = [
  'Generate an ACT Reading practice with 4 passages, IRT-calibrated difficulty...',
  'Create a full Digital SAT with adaptive Module 1→2 routing...',
  'Build a 10th grade algebra quiz, misconception-based distractors...',
  'Make an SAT Math practice, balanced difficulty distribution...',
  'Generate AP Biology exam with iterative refinement, 20 questions...',
  'Create ACT Science with data interpretation passages, hard-weighted...',
];
const GENERATION_CARD_TIPS = [
  'Analyzing your prompt...',
  'Drafting questions...',
  'Finalizing assessment...'
];
let _promptHintIdx = 0, _promptCharIdx = 0, _promptTyping = true, _promptTimer = null;

function promptAnimatePlaceholder() {
  const el = document.getElementById('promptPlaceholder');
  const ta = document.getElementById('promptTextarea');
  if (!el || !ta) return;
  if (ta.value.length > 0 || document.activeElement === ta) { el.style.opacity = '0'; return; }
  el.style.opacity = '1';

  clearInterval(_promptTimer);
  _promptCharIdx = 0;
  _promptTyping = true;
  const hint = _promptHints[_promptHintIdx % _promptHints.length];
  el.textContent = '';

  _promptTimer = setInterval(() => {
    if (_promptTyping) {
      _promptCharIdx++;
      el.textContent = hint.slice(0, _promptCharIdx);
      if (_promptCharIdx >= hint.length) {
        _promptTyping = false;
        clearInterval(_promptTimer);
        setTimeout(() => {
          _promptHintIdx++;
          promptAnimatePlaceholder();
        }, 2500);
      }
    }
  }, 35);
}

function promptAutoGrow(ta) {
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  const ph = document.getElementById('promptPlaceholder');
  if (ph) ph.style.opacity = ta.value.length > 0 ? '0' : '1';
}

function promptFocusIn() {
  const ph = document.getElementById('promptPlaceholder');
  if (ph) ph.style.opacity = '0';
  clearInterval(_promptTimer);
}

function promptFocusOut() {
  const ta = document.getElementById('promptTextarea');
  if (ta && ta.value.length === 0) promptAnimatePlaceholder();
}

const _promptAttachedFiles = [];

function promptHandleFiles(input) {
  const container = document.getElementById('promptFiles');
  if (!input.files || !container) return;
  for (const f of input.files) {
    _promptAttachedFiles.push(f);
  }
  promptRenderFiles();
  input.value = '';
}

function promptRemoveFile(idx) {
  _promptAttachedFiles.splice(idx, 1);
  promptRenderFiles();
}

function promptRenderFiles() {
  const container = document.getElementById('promptFiles');
  if (!container) return;
  if (_promptAttachedFiles.length === 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }
  container.style.display = 'flex';
  const exts = { 'pdf':'📕', 'doc':'📄', 'docx':'📄', 'xls':'📊', 'xlsx':'📊', 'ppt':'📑', 'pptx':'📑', 'txt':'📃', 'csv':'📋', 'jpg':'🖼', 'jpeg':'🖼', 'png':'🖼' };
  container.innerHTML = _promptAttachedFiles.map((f, i) => {
    const ext = f.name.split('.').pop().toLowerCase();
    const icon = exts[ext] || '📎';
    const name = f.name.length > 24 ? f.name.slice(0, 20) + '...' + f.name.slice(-4) : f.name;
    return `<span class="prompt-file-chip">${icon} ${name}<span class="pf-remove" onclick="promptRemoveFile(${i})">✕</span></span>`;
  }).join('');
}

setTimeout(promptAnimatePlaceholder, 600);

let generationQueue = [];
let activeGenerationTask = null;
function shortPromptLabel(prompt) {
  const clean = String(prompt || '').replace(/\s+/g, ' ').trim();
  return clean.length > 56 ? clean.slice(0, 56) + '...' : clean || 'Untitled assessment';
}
function ensureGenerationQueueToast() {
  let toast = document.getElementById('generationQueueToast');
  if (toast) return toast;
  toast = document.createElement('div');
  toast.id = 'generationQueueToast';
  toast.className = 'gen-queue-toast';
  document.body.appendChild(toast);
  return toast;
}
function renderGenerationQueueToast() {
  const toast = ensureGenerationQueueToast();
  const task = activeGenerationTask || generationQueue[generationQueue.length - 1];
  if (!task) { toast.classList.remove('open'); return; }
  const done = task.status === 'done';
  renderGenerationLoadingCard(task);
  if (done) {
    toast.classList.remove('open');
    return;
  }
  toast.innerHTML = `
    <div class="gen-queue-body">
      <div class="gen-queue-title">Generating Assessment...</div>
      <div class="gen-queue-sub">You can track the progress in Active Assignments & Recent.</div>
      <div class="gen-queue-actions">
        <button onclick="viewGenerationLoadingCard('${task.id}')">View</button>
      </div>
    </div>`;
  toast.classList.add('open');
}
function renderGenerationLoadingCard(task) {
  const slot = document.getElementById('generationLoadingCardSlot');
  if (!slot || !task) return;
  const done = task.status === 'done';
  const tip = done ? 'Draft is ready to review.' : (task.currentLabel || GENERATION_CARD_TIPS[0]);
  slot.innerHTML = `<div class="generation-loading-card" id="generationLoadingCard">
    <div class="gl-top">
      <div class="gl-art">
        <svg viewBox="0 0 64 64" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8h22l12 12v34a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6Z"/>
          <path d="M40 8v12h12"/>
          <path d="M20 29h4M30 29h14M20 41l4 4 7-8M34 43h14"/>
        </svg>
      </div>
      <div class="gl-body">
        <div class="gl-title">${done ? 'Assessment Ready' : 'AI Generating'}</div>
        <div class="gl-sub">${tip}</div>
        <div class="gl-skeleton">
          <div class="gl-line short"></div>
          <div class="gl-line"></div>
          <div class="gl-line mid"></div>
          <div class="gl-line"></div>
          <div class="gl-line"></div>
        </div>
      </div>
    </div>
    <div class="gl-footer">
      ${done ? `<button class="gl-action" onclick="nav('${task.targetPage || 'act'}')">Open draft</button>` : `
        <button class="card-bottom-dot" style="width:8px;height:8px;border:none;border-radius:999px;background:#f1f1f2;padding:0" aria-label="Generating"></button>
        <button class="card-bottom-dot" style="width:8px;height:8px;border:none;border-radius:999px;background:#e4e4e7;padding:0" aria-label="Generating"></button>
        <button class="card-bottom-dot" style="width:8px;height:8px;border:none;border-radius:999px;background:#f1f1f2;padding:0" aria-label="Generating"></button>`}
    </div>
  </div>`;
}
function viewGenerationLoadingCard(taskId) {
  const task = generationQueue.find(t => t.id === taskId) || activeGenerationTask || generationQueue[generationQueue.length - 1];
  if (!task) return;
  const overlay = document.getElementById(task.overlayId);
  if (overlay) overlay.style.display = 'none';
  closeGenerationQueueToast();
  nav('homepage');
  setTimeout(() => {
    renderGenerationLoadingCard(task);
    document.getElementById('generationLoadingCard')?.scrollIntoView({ behavior:'smooth', block:'center' });
  }, 80);
}
function openGenerationQueueModal() {
  const task = activeGenerationTask || generationQueue[generationQueue.length - 1];
  if (!task) return;
  const overlay = document.getElementById(task.overlayId);
  if (overlay) {
    overlay.style.display = 'flex';
    return;
  }
  renderGenerationQueueToast();
}
function minimizeGenerationModal(taskId) {
  const task = generationQueue.find(t => t.id === taskId);
  if (!task) return;
  const overlay = document.getElementById(task.overlayId);
  if (overlay) overlay.style.display = 'none';
  renderGenerationQueueToast();
}
function closeGenerationQueueToast() {
  const toast = document.getElementById('generationQueueToast');
  if (toast) toast.classList.remove('open');
}

function promptGenerate() {
  const ta = document.getElementById('promptTextarea');
  const prompt = ta ? ta.value.trim() : '';
  if (!prompt) {
    ta.focus();
    document.getElementById('promptCard').style.animation = 'headShake .4s';
    setTimeout(() => document.getElementById('promptCard').style.animation = '', 500);
    return;
  }

  const loopMessages = GENERATION_CARD_TIPS;

  const taskId = 'gen-' + Date.now();
  const overlayId = taskId + '-overlay';
  const task = {
    id: taskId,
    overlayId,
    title: shortPromptLabel(prompt),
    prompt,
    status: 'running',
    progress: 0,
    currentLabel: loopMessages[0],
    targetPage: 'act'
  };
  activeGenerationTask = task;
  generationQueue.push(task);

  const overlay = document.createElement('div');
  overlay.id = overlayId;
  overlay.className = 'ai-gen-overlay';
  overlay.innerHTML = `
    <div class="ai-gen-modal">
      <div class="ai-gen-head">
        <h3>✦ AI Generating Assessment</h3>
        <p class="ai-gen-sub">Creating exam from: "${task.title}"</p>
      </div>
      <div class="ai-gen-body">
        <div class="ai-gen-loop-card">
          <span class="ai-gen-spinner"></span>
          <div>
            <div class="ai-gen-loop-title">Generating in the background</div>
            <div class="ai-gen-loop-copy" id="aiGenLoopCopy">${loopMessages[0]}</div>
            <div class="ai-gen-loop-hint">This can take a while. You can view the loading card while Kira keeps working.</div>
          </div>
        </div>
        <div class="ai-gen-status-row"><span id="aiGenStatus">No exact progress estimate yet.</span></div>
      </div>
      <div class="ai-gen-actions">
        <div class="ai-gen-action-copy">
          <b>Generating Assessment...</b>
          <span>You can track the progress in Active Assignments & Recent.</span>
        </div>
        <button class="primary" id="aiGenPrimaryBtn" onclick="viewGenerationLoadingCard('${taskId}')">View</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  renderGenerationQueueToast();

  let current = 0;
  let messageTimer = null;
  const status = document.getElementById('aiGenStatus');
  const loopCopy = document.getElementById('aiGenLoopCopy');
  const primaryBtn = document.getElementById('aiGenPrimaryBtn');

  function rotateGenerationCopy() {
    current = (current + 1) % loopMessages.length;
    if (loopCopy) {
      loopCopy.style.opacity = '0';
      setTimeout(() => {
        loopCopy.textContent = loopMessages[current];
        loopCopy.style.opacity = '1';
      }, 180);
    }
    task.progress = Math.min(95, task.progress + 8);
    task.currentLabel = loopMessages[current];
    if (status) status.textContent = 'Still generating. The draft will appear in Active Assignments & Recent.';
    renderGenerationQueueToast();
  }

  function finishGeneration() {
    if (messageTimer) clearInterval(messageTimer);
    task.progress = 100;
    task.status = 'done';
    task.currentLabel = 'Assessment generated successfully. Draft is ready to review.';
    if (loopCopy) loopCopy.innerHTML = '<span style="color:#22c55e;font-weight:800">Assessment generated successfully. Draft is ready to review.</span>';
    if (status) status.innerHTML = '<span style="color:#22c55e;font-weight:700">✓ Assessment generated successfully!</span>';
    if (primaryBtn) primaryBtn.textContent = 'Open';
    renderGenerationQueueToast();
  }
  messageTimer = setInterval(rotateGenerationCopy, 1600);
  setTimeout(finishGeneration, 10000);
}

let askKiraMessages = [];
let askKiraContext = { prompt:'' };

function openAskKira(seedPrompt) {
  const page = document.getElementById('page-homepage');
  if (!page) return;
  page.classList.add('ask-open');
  if (!askKiraMessages.length) {
    askKiraMessages = [{
      role:'ai',
      text:'What kind of assessment would you like to create? You can describe the grade, subject, purpose, length, standards, or test type.',
      chips:['Grade 5 TCAP ELA diagnostic','ACT Reading practice','Quick quiz from today’s lesson']
    }];
    renderAskKiraMessages();
  }
  const input = document.getElementById('askKiraInput');
  if (input) {
    if (seedPrompt) input.value = seedPrompt;
    setTimeout(() => input.focus(), 50);
  }
}
function closeAskKira() {
  const page = document.getElementById('page-homepage');
  if (page) page.classList.remove('ask-open');
}
function askKiraKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAskKira();
  }
}
function askKiraUseChip(text) {
  sendAskKiraText(text);
}
function askKiraAddMessage(role, text, chips, draft) {
  askKiraMessages.push({ role, text, chips:chips || [], draft:null });
  if (draft) askKiraMessages[askKiraMessages.length - 1].draft = draft;
  renderAskKiraMessages();
}
function renderAskKiraMessages() {
  const body = document.getElementById('askKiraMessages');
  if (!body) return;
  body.innerHTML = askKiraMessages.map(msg => `
    <div class="ask-msg ${msg.role === 'user' ? 'user' : 'ai'}">
      ${msg.role === 'ai' ? `<div class="ask-msg-title">Kira</div>` : ''}
      <div>${msg.text}</div>
      ${msg.chips && msg.chips.length ? `<div class="ask-chip-row">${msg.chips.map(c => `<button class="ask-chip" onclick="askKiraUseChip('${String(c).replace(/'/g, "\\'")}')">${c}</button>`).join('')}</div>` : ''}
      ${msg.draft ? renderAskKiraDraft(msg.draft) : ''}
    </div>
  `).join('');
  body.scrollTop = body.scrollHeight;
}
function renderAskKiraDraft(draft) {
  return `<div class="ask-draft">
    <div class="ask-draft-row"><span>Type</span><b>${draft.type}</b></div>
    <div class="ask-draft-row"><span>Grade</span><b>${draft.grade || 'Not needed'}</b></div>
    <div class="ask-draft-row"><span>Subject</span><b>${draft.subject}</b></div>
    <div class="ask-draft-row"><span>Purpose</span><b>${draft.goal}</b></div>
    <div class="ask-draft-row"><span>Length</span><b>${draft.length}</b></div>
    <button class="ask-create-btn" onclick="askKiraCreateAssessment('${draft.route}')">Create assessment</button>
  </div>`;
}
function askKiraAnalyze(text) {
  const lower = text.toLowerCase();
  const type = lower.includes('tcap') ? 'TCAP Assessment' : lower.includes('act') ? 'ACT Practice' : lower.includes('sat') ? 'SAT Practice' : 'General Assessment';
  const route = lower.includes('tcap') ? 'tcap' : lower.includes('act') ? 'act' : lower.includes('sat') ? 'sat' : 'generic';
  const gradeMatch = lower.match(/grade\s*(\d+)|g\s*(\d+)|(\d+)(st|nd|rd|th)\s*grade/);
  const grade = gradeMatch ? `Grade ${gradeMatch[1] || gradeMatch[2] || gradeMatch[3]}` : '';
  const subject = lower.includes('ela') || lower.includes('reading') || lower.includes('english') ? 'ELA / Reading' :
    lower.includes('math') ? 'Math' :
    lower.includes('science') ? 'Science' :
    lower.includes('writing') ? 'Writing' : '';
  const goal = lower.includes('diagnostic') ? 'Diagnostic' :
    lower.includes('benchmark') ? 'Benchmark check' :
    lower.includes('practice') ? 'Practice' :
    lower.includes('quiz') ? 'Quick quiz' :
    lower.includes('review') ? 'Review' : '';
  const lengthMatch = lower.match(/(\d+)\s*(items|questions|q\b|min|minutes)/);
  const length = lengthMatch ? `${lengthMatch[1]} ${lengthMatch[2].replace('questions','questions')}` : '';
  const missing = [];
  if (route === 'generic' && !/quiz|test|exam|assessment|practice|diagnostic|benchmark/.test(lower)) missing.push('assessment type');
  if (!subject) missing.push('subject');
  if (route === 'tcap' && !grade) missing.push('grade');
  if (!goal) missing.push('purpose');
  if (!length) missing.push('length');
  return { type, route, grade, subject, goal, length, missing };
}
function askKiraMissingQuestion(missing) {
  const first = missing[0];
  const copy = {
    'assessment type':'Should this be a quiz, diagnostic, benchmark, practice set, or standardized template?',
    subject:'What subject should this assessment cover?',
    grade:'Which grade level should this TCAP assessment use?',
    purpose:'What is the goal: diagnostic, benchmark, review, practice, or quick quiz?',
    length:'How long should it be, for example 10 questions, 20 items, or 45 minutes?'
  };
  const chips = {
    'assessment type':['Quick quiz','Diagnostic','Benchmark check','Practice set'],
    subject:['ELA / Reading','Math','Science','Writing'],
    grade:['Grade 3','Grade 5','Grade 7','Grade 8'],
    purpose:['Diagnostic','Benchmark check','Review','Practice'],
    length:['10 questions','20 items','45 items','30 minutes']
  };
  return { text:copy[first] || 'Can you add a little more detail?', chips:chips[first] || [] };
}
function sendAskKira() {
  const input = document.getElementById('askKiraInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendAskKiraText(text);
}
function sendAskKiraText(text) {
  if (!text) return;
  askKiraContext.prompt = `${askKiraContext.prompt ? askKiraContext.prompt + ' ' : ''}${text}`;
  askKiraAddMessage('user', text);
  const analysis = askKiraAnalyze(askKiraContext.prompt);
  if (analysis.missing.length) {
    const q = askKiraMissingQuestion(analysis.missing);
    askKiraAddMessage('ai', `I can help create this. I still need one detail: ${q.text}`, q.chips);
    return;
  }
  askKiraAddMessage('ai', 'Great, I have enough to draft this assessment. Review the setup below, then create it or keep chatting to adjust.', [], analysis);
}
function askKiraCreateAssessment(route) {
  closeAskKira();
  const ta = document.getElementById('promptTextarea');
  if (ta) {
    ta.value = askKiraContext.prompt || 'Create a teacher-ready assessment';
    promptAutoGrow(ta);
  }
  askKiraDirectGenerate(route);
}
function askKiraDirectGenerate(route) {
  const labels = {
    tcap:'TCAP Assessment',
    act:'ACT Practice',
    sat:'SAT Practice',
    generic:'Assessment'
  };
  const target = route === 'tcap' ? 'session-detail' : route === 'act' ? 'act' : route === 'sat' ? 'sat' : 'generic';
  const steps = route === 'tcap' ? [
    { icon:'🧭', label:'Reading your TCAP setup from the conversation...' },
    { icon:'🏛', label:'Applying grade, subject, purpose, and length...' },
    { icon:'📊', label:'Preparing scale-score and performance-level outputs...' },
    { icon:'🎯', label:'Connecting standards gaps to practice recommendations...' },
    { icon:'✅', label:'Creating TCAP assessment draft...' }
  ] : route === 'act' ? [
    { icon:'📝', label:'Reading your ACT practice request...' },
    { icon:'📚', label:'Selecting ACT sections and reporting categories...' },
    { icon:'🎯', label:'Drafting questions and skill coverage...' },
    { icon:'✅', label:'Creating ACT assessment draft...' }
  ] : route === 'sat' ? [
    { icon:'📘', label:'Reading your SAT practice request...' },
    { icon:'🧩', label:'Preparing modules and domain coverage...' },
    { icon:'✅', label:'Creating SAT assessment draft...' }
  ] : [
    { icon:'📝', label:'Reading your assessment request...' },
    { icon:'🧠', label:'Inferring subject, purpose, and length...' },
    { icon:'❓', label:'Drafting questions and answer key...' },
    { icon:'✅', label:'Creating assessment draft...' }
  ];
  const overlay = document.createElement('div');
  overlay.className = 'ai-gen-overlay';
  overlay.innerHTML = `
    <div class="ai-gen-modal">
      <h3>✦ Kira is creating ${labels[route] || labels.generic}</h3>
      <p class="ai-gen-sub">Using the details confirmed in Ask Kira, no extra setup drawer needed.</p>
      <div class="ai-gen-progress"><div class="ai-gen-progress-bar" id="askGenBar"></div></div>
      <div class="ai-gen-steps" id="askGenSteps">
        ${steps.map((s, i) => `<div class="ai-gen-step" id="askStep${i}"><span class="step-icon">${s.icon}</span><span>${s.label}</span></div>`).join('')}
      </div>
      <div style="font-size:12px;color:#a1a1aa" id="askGenStatus">Starting Kira AI...</div>
    </div>`;
  document.body.appendChild(overlay);
  let current = 0;
  const bar = document.getElementById('askGenBar');
  const status = document.getElementById('askGenStatus');
  function advance() {
    if (current > 0) {
      const prev = document.getElementById('askStep' + (current - 1));
      prev.classList.remove('active');
      prev.classList.add('done');
      prev.querySelector('.step-icon').textContent = '✓';
    }
    if (current < steps.length) {
      document.getElementById('askStep' + current).classList.add('active');
      bar.style.width = ((current + 1) / steps.length * 100) + '%';
      status.textContent = `Step ${current + 1} of ${steps.length}`;
      current++;
      setTimeout(advance, 650 + Math.random() * 350);
    } else {
      bar.style.width = '100%';
      status.innerHTML = '<span style="color:#22c55e;font-weight:600">✓ Draft created</span>';
      setTimeout(() => {
        overlay.remove();
        if (route === 'tcap') openAssessmentDetail('sess-tcap-1');
        else nav(target);
      }, 700);
    }
  }
  setTimeout(advance, 300);
}

function filterCreate(cat, btn) {
  document.querySelectorAll('#createTabs .create-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#createGrid .create-item').forEach(item => {
    const match = cat === 'all' || item.dataset.cat === cat;
    item.style.display = match ? '' : 'none';
  });
}

let currentDrawerType = null;

let dwFormat = 'enhanced';
let dwComposition = 'full';

const DW_ACT_SECTIONS = {
  enhanced: { eng:{q:50,t:35}, math:{q:45,t:50}, read:{q:36,t:40}, sci:{q:40,t:40,optional:true}, wrt:{q:1,t:40,label:'Writing',optional:true} }
};

function dwTotalTime() {
  const secs = DW_ACT_SECTIONS[dwFormat];
  let total = 0;
  document.querySelectorAll('#dwSectionList .dw-section-item input[type="checkbox"]').forEach(cb => {
    if (cb.checked) {
      const key = cb.dataset.sec;
      total += secs[key]?.t || 0;
    }
  });
  const hrs = Math.floor(total / 60);
  const mins = total % 60;
  return hrs > 0 ? `${hrs}h ${mins} mins` : `${mins} mins`;
}

function dwGetCheckedSections() {
  const cbs = document.querySelectorAll('#dwSectionList .dw-section-item input[type="checkbox"]');
  const checked = [];
  cbs.forEach(cb => {
    if (cb.checked && cb.closest('.dw-section-item').style.display !== 'none') {
      checked.push(cb.dataset.sec);
    }
  });
  return checked;
}

function dwCheckSelection() {
  dwUpdateFooter();
  const hint = document.getElementById('dwSelectionHint');
  const btn = document.getElementById('dwBtnGenerate');
  if (!hint || !btn) return;

  const checked = dwGetCheckedSections();

  if (dwComposition === 'full') {
    const msgs = [];
    if (checked.includes('sci')) msgs.push('✅ STEM Score available (Math + Science)');
    if (checked.includes('wrt')) msgs.push('✅ ELA Score available (English + Reading + Writing)');
    if (msgs.length === 0) msgs.push('Core sections only — add Science or Writing for STEM/ELA scores');
    hint.className = 'dw-hint info';
    hint.innerHTML = msgs.join('<br>');
    btn.disabled = false;
    return;
  }

  const mainSections = checked.filter(s => s !== 'wrt');

  if (mainSections.length === 0) {
    hint.className = 'dw-hint warning';
    hint.textContent = '⚠️ Please select at least one section';
    btn.disabled = true;
  } else {
    const msgs = [];
    const allComposite = ['eng','math','read'].every(s => checked.includes(s));
    if (!allComposite) {
      msgs.push('ℹ️ Composite Score will not be available — not all core sections selected');
    }
    if (checked.includes('sci') && checked.includes('math')) {
      msgs.push('✅ STEM Score available');
    }
    if (checked.includes('wrt') && checked.includes('eng') && checked.includes('read')) {
      msgs.push('✅ ELA Score available');
    }
    hint.className = msgs.length ? 'dw-hint info' : 'dw-hint';
    hint.innerHTML = msgs.join('<br>');
    btn.disabled = false;
  }
}

function dwUpdateFooter() {
  document.getElementById('drawerFooterBar').innerHTML = `<span style="color:#3d2c5a">Total Time: ${dwTotalTime()}</span>`;
}

function dwUpdateSections() {
  const secs = DW_ACT_SECTIONS[dwFormat];
  const list = document.getElementById('dwSectionList');
  if (!list) return;
  const items = list.querySelectorAll('.dw-section-item');
  const keys = ['eng','math','read','sci','wrt'];
  items.forEach((item, i) => {
    const key = keys[i];
    const sec = secs[key];
    const cb = item.querySelector('input[type="checkbox"]');
    const badge = item.querySelector('.dw-sec-badge');
    const nameEl = item.querySelector('.dw-sec-name');
    item.style.display = '';

    const isOptional = sec.optional === true;

    if (key === 'wrt') {
      if (badge) badge.textContent = `1 question | ${sec.t} mins`;
    } else {
      let txt = `${sec.q} questions | ${sec.t} mins`;
      if (badge) badge.textContent = txt;
    }

    if (isOptional) {
      item.querySelectorAll('.dw-optional-tag').forEach(t => t.remove());
      if (nameEl) {
        nameEl.insertAdjacentHTML('afterend', '<span class="dw-optional-tag" style="font-size:10px;color:#f59e0b;background:#fef3c7;padding:1px 6px;border-radius:4px;margin-left:6px;font-weight:500">Optional</span>');
      }
      if (dwComposition === 'full') {
        item.classList.remove('locked');
        cb.disabled = false;
        cb.checked = false;
      } else {
        item.classList.remove('locked');
        cb.disabled = false;
      }
    } else {
      item.querySelectorAll('.dw-optional-tag').forEach(t => t.remove());
      if (dwComposition === 'full') {
        item.classList.add('locked');
        cb.checked = true; cb.disabled = true;
      } else {
        item.classList.remove('locked');
        cb.disabled = false;
      }
    }
  });
  const infoEl = document.getElementById('dwFormatInfo');
  if (infoEl) {
    infoEl.textContent = 'Core: 131 Items, 125 mins · Optional add-ons: Science (40 / 40 min) · Writing (1 essay / 40 min)';
  }
  dwCheckSelection();
}

function dwSelectFormat(btn, fmt) {
  dwFormat = fmt;
  btn.parentElement.querySelectorAll('.dw-toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  dwUpdateSections();
}

function dwSelectComposition(card, type) {
  dwComposition = type;
  card.parentElement.querySelectorAll('.dw-radio-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  dwUpdateSections();
}

function openDrawer(type) {
  currentDrawerType = type;
  const d = DRAWER_DATA[type];
  document.getElementById('drawerTitle').textContent = d.title;
  document.getElementById('drawerBadge').textContent = d.badge;
  document.getElementById('drawerDesc').textContent = d.desc;
  const badgeExt = document.getElementById('drawerBadgeExt');
  if (badgeExt) badgeExt.style.display = (type === 'act') ? 'inline-block' : 'none';

  if (type === 'tcap') {
    dwTcap = { grade:5, subjects:['ela'], mode:'diagnostic', length:'full' };
    const cfg = DW_TCAP_CONFIG;
    document.getElementById('drawerBody').innerHTML = `
      <div class="dw-field">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span class="dw-label" style="margin:0">Grade Level</span>
          <span style="font-size:10px;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;padding:2px 7px;border-radius:999px;font-weight:700;letter-spacing:.3px;text-transform:uppercase">Tennessee</span>
        </div>
        <select class="dw-grade-select" onchange="dwTcapSelectGrade(this.value)" style="width:100%;padding:12px 40px 12px 14px;border-radius:10px;border:1px solid #e4e4e7;background-color:#fff;background-image:url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>&quot;);background-repeat:no-repeat;background-position:right 14px center;color:#18181b;font-size:14px;font-weight:500;cursor:pointer;appearance:none;-webkit-appearance:none;-moz-appearance:none;transition:border-color .15s,box-shadow .15s" onfocus="this.style.borderColor='#6040ca';this.style.boxShadow='0 0 0 3px rgba(96,64,202,.15)'" onblur="this.style.borderColor='#e4e4e7';this.style.boxShadow='none'">
          ${tcapGradesForSubject(dwTcap.subjects[0]).map(g => `<option value="${g}" ${g===dwTcap.grade?'selected':''}>${tcapGradeLabel(g)}</option>`).join('')}
        </select>
      </div>

      <div class="dw-field">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span class="dw-label" style="margin:0">Subject</span>
          <span style="font-size:10px;color:#71717a;background:#f4f4f5;border:1px solid #e4e4e7;padding:2px 7px;border-radius:999px;font-weight:700">Choose one per assessment</span>
        </div>
        <div style="font-size:11px;color:#71717a;line-height:1.45;margin:-2px 0 8px">Standards, item bank, and cut scores differ by subject.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${cfg.subjects.map(s => {
            const range = s.gradeRange ? `G${s.gradeRange[0]}–${s.gradeRange[1]}` : 'G3–8';
            return `
            <button type="button" class="dw-subj-btn ${dwTcap.subjects.includes(s.id)?'active':''}" data-tcap-subject="${s.id}" aria-pressed="${dwTcap.subjects.includes(s.id)?'true':'false'}" onclick="dwTcapToggleSubject('${s.id}',this)" style="text-align:left;padding:12px 14px;border-radius:10px;border:2px solid ${dwTcap.subjects.includes(s.id)?'#6040ca':'#e4e4e7'};background:${dwTcap.subjects.includes(s.id)?'#f5f3ff':'#fff'};cursor:pointer;transition:all .15s">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:3px">
                <span style="font-weight:700;font-size:14px;color:#18181b">${s.label}</span>
                <span class="dw-subj-indicator" style="width:14px;height:14px;border-radius:999px;border:2px solid ${dwTcap.subjects.includes(s.id)?'#6040ca':'#d4d4d8'};background:${dwTcap.subjects.includes(s.id)?'#6040ca':'#fff'};box-shadow:${dwTcap.subjects.includes(s.id)?'inset 0 0 0 3px #fff':'none'}"></span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <span style="font-size:9.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#5b21b6;background:#f5f3ff;border:1px solid #ddd6fe;padding:2px 6px;border-radius:999px">${range}</span>
              </div>
              <div style="font-size:11px;color:#71717a;line-height:1.4">${s.desc}</div>
            </button>`;
          }).join('')}
        </div>
      </div>

      <div class="dw-field" id="dwTcapBlueprintField">
        ${renderTcapBlueprintBlock()}
      </div>

      <!-- Purpose / Mode picker removed for pilot — Diagnostic is the only
           supported mode; see DW_TCAP_CONFIG.modes comment for rationale. -->

      <!-- Length picker removed for pilot — TDOE locks per-Subpart item
           count and time inside TCAP_SUBPART_BLUEPRINT. Real totals show
           in the Subpart Schedule block above and in the footer summary. -->


      <div class="dw-hint info" style="background:#f5f3ff;border:1px solid #ddd6fe;color:#4c1d95;padding:10px 12px;border-radius:8px;font-size:12px;line-height:1.5;margin-top:12px">
        <strong>After students submit:</strong> scale score, performance level, standards gaps, and a personalized practice plan.
      </div>
      <div id="dwTcapSummary" style="margin-top:12px;padding:10px 12px;background:#f4f4f5;border-radius:8px;font-size:12px;color:#3f3f46"></div>
      <button class="dw-btn-generate" id="dwBtnGenerate" onclick="drawerGenerate()" style="background:linear-gradient(135deg,#6040ca,#8b5cf6)">Create TCAP Diagnostic</button>
    `;
    dwTcapUpdateSummary();
  } else if (type === 'act') {
    dwFormat = 'enhanced'; dwComposition = 'full';
    const secs = DW_ACT_SECTIONS.enhanced;
    document.getElementById('drawerBody').innerHTML = `
      <div class="dw-field">
        <span class="dw-label">Exam Composition</span>
        <div class="dw-radio-cards">
          <div class="dw-radio-card active" onclick="dwSelectComposition(this,'full')">
            <div class="dw-rc-title">📦 Full Battery</div>
            <div class="dw-rc-desc">Core sections locked + choose optional add-ons</div>
          </div>
          <div class="dw-radio-card" onclick="dwSelectComposition(this,'custom')">
            <div class="dw-rc-title">🧩 Custom Selection</div>
            <div class="dw-rc-desc">Pick any sections, at least one required</div>
          </div>
        </div>
      </div>
      <div class="dw-field">
        <span class="dw-label">Section Configuration</span>
        <div style="font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin:0 0 6px">Core Sections</div>
        <div class="dw-section-list" id="dwSectionList">
          <div class="dw-section-item locked"><span class="dw-sec-name">English</span><span class="dw-sec-badge">${secs.eng.q} questions | ${secs.eng.t} mins</span><input type="checkbox" checked disabled data-sec="eng" onchange="dwCheckSelection()"></div>
          <div class="dw-section-item locked"><span class="dw-sec-name">Math</span><span class="dw-sec-badge">${secs.math.q} questions | ${secs.math.t} mins</span><input type="checkbox" checked disabled data-sec="math" onchange="dwCheckSelection()"></div>
          <div class="dw-section-item locked"><span class="dw-sec-name">Reading</span><span class="dw-sec-badge">${secs.read.q} questions | ${secs.read.t} mins</span><input type="checkbox" checked disabled data-sec="read" onchange="dwCheckSelection()"></div>
          <div class="dw-section-item"><span class="dw-sec-name">Science</span><span class="dw-sec-badge">${secs.sci.q} questions | ${secs.sci.t} mins</span><input type="checkbox" data-sec="sci" onchange="dwCheckSelection()"></div>
          <div class="dw-section-item"><span class="dw-sec-name">Writing</span><span class="dw-sec-badge">1 question | ${secs.wrt.t} mins</span><input type="checkbox" data-sec="wrt" onchange="dwCheckSelection()"></div>
        </div>
        <div class="dw-hint" id="dwSelectionHint"></div>
      </div>
      <button class="dw-btn-generate" id="dwBtnGenerate" onclick="drawerGenerate()">✨ Generate</button>
    `;
    dwUpdateSections();
  } else {
    const reqSections = d.sections.filter(s=>s.required);
    const optSections = d.sections.filter(s=>s.optional);
    const totalQ = d.sections.reduce((s,x)=>s+x.q,0);
    const totalTime = d.sections.reduce((s,x)=>s+x.time,0);
    let html = `<div class="exam-summary">
      <div class="sum-item"><div class="sum-val">${totalQ}</div><div class="sum-label">Questions</div></div>
      <div class="sum-item"><div class="sum-val">${totalTime}</div><div class="sum-label">Minutes</div></div>
      <div class="sum-item"><div class="sum-val">${d.sections.length}</div><div class="sum-label">Sections</div></div>
      <div class="sum-item"><div class="sum-val">${d.maxScore}</div><div class="sum-label">Max Score</div></div>
    </div>`;
    html += '<div style="font-size:14px;font-weight:500;margin-bottom:12px">Sections to Include</div>';
    reqSections.forEach(s => {
      html += `<div class="section-check checked"><div class="check-left"><input type="checkbox" checked disabled /><div><div class="sec-name">${s.name}</div>${s.desc?`<div class="sec-desc">${s.desc}</div>`:''}</div></div><div class="check-right"><span>📝 ${s.q} Q</span><span>🕐 ${s.time} min</span>${s.passages?`<span>📖 ${s.passageCount} passages</span>`:''}</div></div>`;
    });
    if (optSections.length) {
      html += '<div style="font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin:16px 0 8px">Optional Sections</div>';
      optSections.forEach(s => {
        html += `<div class="section-check"><div class="check-left"><input type="checkbox" /><div><div style="display:flex;align-items:center;gap:8px"><span class="sec-name">${s.name}</span><span class="sec-optional">Optional</span></div>${s.desc?`<div class="sec-desc">${s.desc}</div>`:''}</div></div><div class="check-right"><span>📝 ${s.q} Q</span><span>🕐 ${s.time} min</span>${s.passages?`<span>📖 ${s.passageCount} passages</span>`:''}</div></div>`;
      });
    }
    html += '<div style="height:1px;background:#e4e4e7;margin:24px 0"></div>';
    html += '<div style="font-size:14px;font-weight:500;margin-bottom:8px">Exam Rules</div>';
    html += `<div class="rules-box"><p>• Multistage Adaptive Testing: Module 2 difficulty adapts based on Module 1 performance</p><p>• Each module has a strict time limit with auto-submit on expiry</p><p>• Students can mark questions for review within current module</p><p>• No penalty for wrong answers — attempt every question</p></div>`;
    html += `<button class="dw-btn-generate" onclick="drawerGenerate()">✨ Generate</button>`;
    document.getElementById('drawerBody').innerHTML = html;
    document.getElementById('drawerFooterBar').innerHTML = `<span style="color:#3d2c5a">Total Time: ${totalTime} mins</span>`;
  }

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('drawerPanel').classList.add('open');
}

function drawerGenerate() {
  if (currentDrawerType === 'act' && dwComposition === 'custom') {
    const checked = dwGetCheckedSections();
    if (checked.length === 0) return;
  }
  const type = currentDrawerType;
  closeDrawer();

  const tcapModeLabel = DW_TCAP_CONFIG.modes.find(m => m.id === dwTcap.mode)?.label || 'Assessment';
  const testLabel = { act: 'ACT Practice Test', sat: 'Digital SAT', map: 'MAP Growth', staar: 'STAAR', tcap: `TCAP ${tcapModeLabel}` }[type] || type.toUpperCase();
  const isSat = type === 'sat';
  const isTcap = type === 'tcap';
  const steps = isSat ? [
    { icon: '📝', label: 'Parsing Digital SAT blueprint (R&W + Math)...' },
    { icon: '📊', label: 'Calibrating IRT difficulty parameters per module...' },
    { icon: '📖', label: 'Generating Module 1 routing items (broad mix)...' },
    { icon: '🔀', label: 'Building adaptive Module 2 paths (easy + hard)...' },
    { icon: '🎯', label: 'Creating misconception-based distractors (DiVERT)...' },
    { icon: '⚖️', label: 'Validating MST routing accuracy & score equity...' },
    { icon: '✅', label: 'Assembling final adaptive test form...' }
  ] : isTcap ? [
    { icon: '🏛', label: `Loading Grade ${dwTcap.grade} Tennessee state standards...` },
    { icon: '📊', label: 'Applying district cut-score profile (Below → Mastered)...' },
    { icon: '📖', label: `Sampling items across ${DW_TCAP_CONFIG.subjects.find(s=>s.id===dwTcap.subjects[0])?.label || 'selected subject'} reporting categories...` },
    { icon: '🎯', label: 'Calibrating predictive model weights (prior × coverage × difficulty)...' },
    { icon: '🧠', label: 'Preparing personalized practice graph stub...' },
    { icon: '✅', label: `${tcapModeLabel} form assembled & ready to assign.` }
  ] : [
    { icon: '📝', label: `Parsing ${testLabel} section blueprint...` },
    { icon: '📊', label: 'Calibrating IRT difficulty across sections...' },
    { icon: '📖', label: 'Generating reading passages & stimuli...' },
    { icon: '❓', label: 'Creating questions with iterative refinement...' },
    { icon: '🎯', label: 'Generating misconception-based distractors...' },
    { icon: '✅', label: 'Validating psychometric quality & finalizing...' }
  ];

  const overlay = document.createElement('div');
  overlay.className = 'ai-gen-overlay';
  overlay.innerHTML = `
    <div class="ai-gen-modal">
      <h3>✦ AI Generating ${testLabel}</h3>
      <p class="ai-gen-sub">Building a complete ${isSat ? 'multistage adaptive' : 'standardized'} exam</p>
      <div class="ai-gen-progress"><div class="ai-gen-progress-bar" id="dGenBar"></div></div>
      <div class="ai-gen-steps" id="dGenSteps">
        ${steps.map((s, i) => `<div class="ai-gen-step" id="dStep${i}"><span class="step-icon">${s.icon}</span><span>${s.label}</span></div>`).join('')}
      </div>
      <div style="font-size:12px;color:#a1a1aa" id="dGenStatus">Initializing AI pipeline...</div>
    </div>`;
  document.body.appendChild(overlay);

  let current = 0;
  const bar = document.getElementById('dGenBar');
  const status = document.getElementById('dGenStatus');

  function advance() {
    if (current > 0) {
      const prev = document.getElementById('dStep' + (current - 1));
      prev.classList.remove('active');
      prev.classList.add('done');
      prev.querySelector('.step-icon').textContent = '✓';
    }
    if (current < steps.length) {
      document.getElementById('dStep' + current).classList.add('active');
      bar.style.width = ((current + 1) / steps.length * 100) + '%';
      status.textContent = `Step ${current + 1} of ${steps.length} — ${steps[current].label.split('...')[0]}`;
      current++;
      setTimeout(advance, 700 + Math.random() * 500);
    } else {
      bar.style.width = '100%';
      status.innerHTML = '<span style="color:#22c55e;font-weight:600">✓ Assessment generated — opening editor</span>';
      setTimeout(() => {
        overlay.remove();
        if (type === 'tcap') openAssessmentDetail('sess-tcap-1');
        else nav(type);
      }, 800);
    }
  }
  setTimeout(advance, 400);
}

function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('drawerPanel').classList.remove('open');
}

