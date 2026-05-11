// @ts-nocheck
// Phase-2 slice: lines 13416-13642 of original src/app.ts

}
// ═══════ Flows i18n ═══════
let _flowsLang = 'en';
const FLOWS_I18N = {
  en: {
    pageTitle: 'Product Flows',
    pageDesc: 'Review the current teacher, student, and release logic in one place. Edge-state previews live here instead of the dev panel.',
    clickHint: '💡 Click any node to jump to that page.',
  },
  zh: {
    pageTitle: '产品流程',
    pageDesc: '在一个页面集中查看教师端、学生端与发布逻辑；边缘态预览直接在这里跳转，无需翻开发面板。',
    clickHint: '💡 点击任意节点直接跳到对应页面。',
  }
};
function tFlows(key){ return (FLOWS_I18N[_flowsLang] && FLOWS_I18N[_flowsLang][key]) || FLOWS_I18N.en[key] || ''; }
function flowField(flow, key){
  const zhKey = key + 'Zh';
  if (_flowsLang === 'zh' && flow[zhKey] != null) return flow[zhKey];
  return flow[key];
}
function setFlowsLang(lang){
  _flowsLang = lang === 'zh' ? 'zh' : 'en';
  document.querySelectorAll('#flowsLangToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === _flowsLang);
  });
  renderFlowsPage();
}
window._flowJump = function(key){
  const flow = FLOW_DIAGRAMS.find(f => f.id === currentFlowId) || FLOW_DIAGRAMS[0];
  const code = flow && flow.nodeActions && flow.nodeActions[key];
  if (!code) return;
  try { new Function(code)(); } catch(e) { console.error('[flowJump]', key, e); }
};

function renderPhaseFlow(phases, opts){
  opts = opts || {};
  const cluster = !!opts.cluster;
  const clickable = opts.clickable !== false;
  const zh = _flowsLang === 'zh';
  const pad2 = n => (n<10?'0':'') + n;
  const laneLabelOf = lane => {
    if (lane === 'teacher') return zh ? '教师' : 'Teacher';
    if (lane === 'student') return zh ? '学生' : 'Student';
    return '';
  };
  const indexLabel = cluster ? (zh ? '类别' : 'GROUP') : (zh ? '阶段' : 'PHASE');
  const parts = [];
  parts.push(`<div class="phase-flow${cluster?' is-cluster':''}">`);
  phases.forEach((p, i) => {
    const label = zh ? (p.labelZh || p.label) : p.label;
    const accent = p.accent || '•';
    parts.push('<div class="phase-block">');
    parts.push('<div class="phase-head">');
    parts.push(`<div class="ph-accent">${accent}</div>`);
    parts.push(`<span class="ph-index">${indexLabel} ${pad2(i+1)}</span>`);
    parts.push(`<span class="ph-label">${label}</span>`);
    parts.push('</div>');
    if (p.subjectLanes && p.subjectLanes.length){
      const laneCols = Math.max.apply(null, p.subjectLanes.map(l => (l.nodes||[]).length));
      parts.push('<div class="phase-lanes">');
      p.subjectLanes.forEach(lane => {
        const lLabel = zh ? (lane.labelZh || lane.label) : lane.label;
        const lSub   = zh ? (lane.subZh   || lane.sub)   : lane.sub;
        parts.push('<div class="phase-lane">');
        parts.push('<div class="pl-label">');
        parts.push(`<span>${lLabel}</span>`);
        if (lSub) parts.push(`<span class="pl-sub">${lSub}</span>`);
        parts.push('</div>');
        parts.push(`<div class="pl-cells" style="--lane-cols:${laneCols}">`);
        (lane.nodes || []).forEach(n => {
          if (!n){
            parts.push('<div class="phase-node-empty"></div>');
            return;
          }
          const title = zh ? (n.titleZh || n.title) : n.title;
          const desc  = zh ? (n.descZh  || n.desc)  : n.desc;
          const staticCls = clickable ? '' : ' is-static';
          const onclickAttr = clickable && n.id ? ` onclick="_flowJump('${n.id}')"` : '';
          parts.push(`<div class="phase-node${staticCls}"${onclickAttr}>`);
          parts.push(`<div class="pn-icon">${n.icon || '•'}</div>`);
          parts.push('<div class="pn-text">');
          parts.push(`<h4 class="pn-title">${title}</h4>`);
          if (desc) parts.push(`<p class="pn-desc">${desc}</p>`);
          parts.push('</div></div>');
        });
        parts.push('</div></div>');
      });
      parts.push('</div>');
      if (p.legend){
        const lt = zh ? (p.legend.textZh || p.legend.text) : p.legend.text;
        parts.push(`<div class="phase-legend"><span class="pl-leg-icon">${p.legend.icon || 'ℹ️'}</span><span>${lt}</span></div>`);
      }
      parts.push('</div>');
      if (!cluster && i < phases.length - 1) parts.push('<div class="phase-arrow"></div>');
      return;
    }
    parts.push(`<div class="phase-nodes ${p.branch?'branch':''}">`);
    (p.nodes || []).forEach(n => {
      const title = zh ? (n.titleZh || n.title) : n.title;
      const desc  = zh ? (n.descZh  || n.desc)  : n.desc;
      const laneClass = n.lane ? ('lane-' + n.lane) : '';
      const laneTxt = laneLabelOf(n.lane);
      const staticCls = clickable ? '' : ' is-static';
      const onclickAttr = clickable ? ` onclick="_flowJump('${n.id}')"` : '';
      parts.push(`<div class="phase-node ${laneClass}${staticCls}"${onclickAttr}>`);
      parts.push(`<div class="pn-icon">${n.icon || '•'}</div>`);
      parts.push('<div class="pn-text">');
      parts.push(`<h4 class="pn-title">${title}</h4>`);
      if (desc) parts.push(`<p class="pn-desc">${desc}</p>`);
      if (n.children && n.children.length){
        parts.push('<div class="pn-children">');
        n.children.forEach(c => {
          const ct = zh ? (c.titleZh || c.title) : c.title;
          const cb = zh ? (c.badgeZh || c.badge) : c.badge;
          const badgeHtml = cb ? `<em class="pn-child-badge">${cb}</em>` : '';
          parts.push(`<span class="pn-child">↳ ${ct}${badgeHtml}</span>`);
        });
        parts.push('</div>');
      }
      if (laneTxt) parts.push(`<span class="pn-lane">${laneTxt}</span>`);
      parts.push('</div></div>');
    });
    parts.push('</div></div>');
    if (!cluster && i < phases.length - 1) parts.push('<div class="phase-arrow"></div>');
  });
  parts.push('</div>');
  return parts.join('');
}

function renderFlowsPage() {
  const flow = FLOW_DIAGRAMS.find(f => f.id === currentFlowId) || FLOW_DIAGRAMS[0];
  const pageTitleEl = document.getElementById('flowsPageTitle');
  const pageDescEl = document.getElementById('flowsPageDesc');
  if (pageTitleEl) pageTitleEl.textContent = tFlows('pageTitle');
  if (pageDescEl) pageDescEl.textContent = tFlows('pageDesc');
  document.getElementById('flowsTabs').innerHTML = FLOW_DIAGRAMS.map(f => `
    <button class="flows-tab ${f.id === flow.id ? 'active' : ''}" onclick="setFlowId('${f.id}')">${f.icon} ${flowField(f,'label')}</button>
  `).join('');
  document.getElementById('flowsTitle').textContent = `${flow.icon} ${flowField(flow,'label')}`;
  document.getElementById('flowsDesc').textContent = flowField(flow, 'description');
  document.getElementById('flowsMeta').innerHTML = (flowField(flow,'chips')||[]).map(ch => `<span class="flows-chip">${ch}</span>`).join('');
  const hintEl = document.getElementById('flowsHint');
  if (hintEl) {
    const hasClicks = flow.nodeActions && Object.keys(flow.nodeActions).length;
    hintEl.style.display = hasClicks ? '' : 'none';
    hintEl.textContent = tFlows('clickHint');
  }
  const body = document.getElementById('flowsBody');
  const bodyHtml = flowField(flow, 'bodyHtml');
  const rightHtml = flowField(flow, 'rightCardHtml');
  const parts = [];
  if (rightHtml) parts.push(`<div class="flows-card">${rightHtml}</div>`);
  if (bodyHtml) parts.push(bodyHtml);
  if (parts.length) {
    body.style.display = 'grid';
    body.innerHTML = parts.join('');
  } else {
    body.style.display = 'none';
    body.innerHTML = '';
  }
  const diagramWrap = document.getElementById('flowsDiagram');

  let phasesKey = flow.id;
  let roleToggleHtml = '';
  if (flow.roleViews) {
    const role = flow.roleViews[currentFlowRole] ? currentFlowRole : 'combined';
    phasesKey = flow.roleViews[role] || flow.id;
    const roleLabels = {
      combined: { en:'\ud83d\udc65 Combined', zh:'\ud83d\udc65 \u5168\u6d41\u7a0b' },
      teacher:  { en:'\ud83d\udc69\u200d\ud83c\udfeb Teacher', zh:'\ud83d\udc69\u200d\ud83c\udfeb \u6559\u5e08\u89c6\u89d2' },
      student:  { en:'\ud83e\uddd1\u200d\ud83c\udf93 Student', zh:'\ud83e\uddd1\u200d\ud83c\udf93 \u5b66\u751f\u89c6\u89d2' }
    };
    roleToggleHtml = `<div class="flows-role-toggle" role="tablist" aria-label="Role view">${
      ['combined','teacher','student'].map(r => {
        const lbl = (roleLabels[r] && (_flowsLang === 'zh' ? roleLabels[r].zh : roleLabels[r].en)) || r;
        return `<button class="${r === role ? 'active' : ''}" onclick="setFlowRole('${r}')">${lbl}</button>`;
      }).join('')
    }</div>`;
  }

  const phases = FLOW_PHASES && FLOW_PHASES[phasesKey];
  if (phases && phases.length) {
    diagramWrap.classList.add('is-phase-flow');
    const clickable = !!(flow.nodeActions && Object.keys(flow.nodeActions).length);
    const cluster = !!phases[0].cluster;
    const hero = flowField(flow, 'heroHtml') || '';
    diagramWrap.innerHTML = roleToggleHtml + hero + renderPhaseFlow(phases, { cluster, clickable });
    return;
  }
  diagramWrap.classList.remove('is-phase-flow');
  const diagramId = 'mmd-' + Date.now() + '-' + Math.floor(Math.random()*1e6);
  let mermaidText = flowField(flow,'mermaid');
  if (flow.nodeActions) {
    const clickLines = Object.keys(flow.nodeActions)
      .map(k => `      click ${k} call _flowJump("${k}")`)
      .join('\n');
    mermaidText = mermaidText + '\n' + clickLines;
  }
  diagramWrap.innerHTML = roleToggleHtml + `<pre class="mermaid" id="${diagramId}">${mermaidText}</pre>`;
  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'base',
      themeVariables: {
        fontFamily: 'inherit',
        fontSize: '13px',
        primaryColor: '#ede9fe',
        primaryTextColor: '#18181b',
        primaryBorderColor: '#8b5cf6',
        lineColor: '#a78bfa',
        secondaryColor: '#fce7f3',
        tertiaryColor: '#fef3c7',
        mainBkg: '#ede9fe',
        nodeBorder: '#8b5cf6',
        clusterBkg: '#faf5ff',
        clusterBorder: '#c4b5fd',
        edgeLabelBackground: '#ffffff',
        titleColor: '#6040ca',
      }
    });
    const node = document.getElementById(diagramId);
    if (node) window.mermaid.run({ nodes: [node] });
  }
}

