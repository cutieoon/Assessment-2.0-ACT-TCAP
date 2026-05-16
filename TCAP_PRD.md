# TCAP Diagnostic Prototype PRD

版本：Draft for Review  
范围：Assessment 2.0 TCAP Diagnostic prototype  
状态：可进入评审，但需要按本文的 MVP 边界评审，不应按完整生产系统评审

## 1. Overview

TCAP Diagnostic 是 Kira Assessment 2.0 中面向 Tennessee TCAP 场景的标准化诊断评估原型。它的目标不是复刻完整州测交付系统，而是验证 Kira 是否能支持 TCAP 所需的核心产品体验：教师按年级和科目创建一套固定蓝图的诊断评估，系统按 TCAP Subpart 结构组织测试、监控学生进度、生成班级层面的诊断分析，并在学生报告中解释预测 scale score、performance level、标准薄弱点和逐题回看结果。

本功能的核心价值是帮助教师回答三个问题：

1. 这次 TCAP diagnostic 的测试结构是否符合 TCAP 的 Subpart / 时间 / 题型约束？
2. 学生和班级当前处在 Below / Approaching / Meeting / Exceeding 的哪个表现区间，离下一等级还差多少？
3. 教师应该优先复盘哪些 standards，而不是把诊断结果误读成可直接推送 practice 的练习计划？

本期 prototype 明确采用“诊断 + 监控 + 报告”定位，不包含真实 practice delivery。页面中凡是涉及 practice 的能力都不应作为 MVP 承诺；如果出现文案，必须表达为“不支持 / 不可用 / future work”。

## 2. Problem Statement

现有 Assessment prototype 已经支持 ACT/SAT 风格的标准化测试体验，但 TCAP 与 ACT/SAT 的产品模型不同：

- TCAP 按 grade + subject 固定测试蓝图，不允许教师随意修改 Subpart 数量、顺序、时间和部分规则。
- TCAP 的测试过程以 Subpart 为管理单位，教师需要逐个解锁、暂停、恢复、结束 Subpart。
- TCAP 报告的核心不是 ACT composite，而是 scale score、performance level、standards gaps、cut score boundaries。
- ELA Writing 需要 human review 或 rubric scoring，不应被表达成普通 auto-grade MC。
- 目前 Kira 未实现 practice delivery，因此 Analytics 和 Student Report 不能承诺“assign practice”。

如果 PRD 不把这些边界写清楚，评审时会出现三类风险：

1. 评审人误以为教师可以配置 cut score 或 practice。
2. 工程误以为 TCAP 是多个独立 assignment，而不是一个 assessment 内嵌多个 Subparts。
3. QA 无法判断状态、评分、报告和 prototype 是否一致。

## 3. Goals

### 3.1 MVP Goals

- 支持教师创建 TCAP Diagnostic assessment。
- 支持按 grade + subject 加载固定 TCAP Subpart blueprint。
- 支持教师查看并编辑/替换 Subpart 内题目，但不能修改 TCAP 固定结构。
- 支持教师在 Monitor 中查看 Subpart 状态、学生状态、进度和当前行动。
- 支持教师在 Analytics 中查看班级表现、closest to Meeting 学生、standards needing review 和 performance level range guide。
- 支持学生进入 TCAP runner，完成 ready check、directions、test、submit/review 流程。
- 支持学生查看 TCAP Diagnostic Report，包括 predicted scale score、performance level、gap to next level、standards to review、reporting categories、peer comparison、item-by-item review。

### 3.2 Non-Goals

- 不实现真实 TCAP secure browser / lockdown browser。
- 不实现真实 TDOE raw-to-scale conversion table。
- 不实现真实 LEA cut score admin workflow。
- 不实现 practice delivery、assign practice、AI-generated practice plan。
- 不实现正式州测提交、州级 roster、accommodation import、TDOE 数据回传。
- 不保证 demo 中所有 item count 与真实年度 TCAP release 完全一致；prototype 仅验证交互和信息架构。

## 4. Users and Roles

| Role | User Need | MVP Permission |
|---|---|---|
| Teacher | 创建、监控、查看诊断结果 | 创建 TCAP diagnostic、查看/替换题目、管理 Subpart、查看 Analytics 和报告 |
| Student | 完成诊断测试并查看结果 | 进入测试、完成题目、提交、查看 report 和 item review |
| District Admin | 管理 cut score profile | 不在 teacher MVP 中暴露；独立 admin config 仅作为 prototype/future surface |
| System | 计算预测结果和状态 | 根据 mock data/adapter 生成 scale score、level、standards summary、item status |

## 5. Source of Truth in Prototype

| Area | Prototype Source |
|---|---|
| TCAP Subpart blueprint | `TCAP_SUBPART_BLUEPRINT` |
| Supported TCAP item type coverage | `TCAP_COVERAGE` |
| Scale score / cut score / performance levels | `TCAP_PROFILE`, `TCAPScoringAdapter` |
| Session data and Subpart states | `SESSION_DATA`, `subparts[]` |
| Teacher Analytics | `renderTcapClass`, `renderSessionAnalytics` |
| Student Report | `renderTcapStudentReport` |
| Student Runner | `tcsOpen`, `tcsRender`, `tcsViewTest`, `tcsFooterTest`, `tcsViewResultsReview` |

## 6. Feature Scope

### 6.1 Create / Assign TCAP Diagnostic

The system displays TCAP as a standardized template.

Required behavior:

- Teacher selects grade and subject.
- System derives TCAP blueprint from grade + subject.
- Teacher cannot edit Subpart count, order, locked timing, or special rules.
- The assessment name is generated from subject/grade/course and month/year.
- Teachers can schedule Subparts on separate dates within the testing window.
- ELA Writing / calculator-free / human-review constraints are shown as fixed blueprint badges.

MVP support:

- ELA, Math, Science, Social Studies for supported grade ranges.
- EOC mapping for Grade 9/10 ELA and Math prototype paths.

Out of scope:

- Multi-subject TCAP package in one create flow.
- Importing official TDOE forms.
- Real LEA roster sync.

### 6.2 Teacher Editor

The editor lets teachers inspect a TCAP diagnostic package and adjust question content inside the locked blueprint.

Required behavior:

- Show Subparts as first-class sections.
- Show fixed time, item count, special rules, and supported item types per Subpart.
- Allow item-level editing/replacement only where Kira supports the item type.
- Do not allow teacher to remove required Subparts or change official timing/order.
- Reading sets should use split/sticky stimulus patterns where a passage is paired with one or more questions.
- Writing prompt should align to TCAP writing style, not ACT Writing or SBAC performance task assumptions.

Important product boundary:

- Constructed Response is short-answer/rubric item; it is not the same as Writing Prompt / Essay.
- Two-Part / Evidence-Based items should be treated as one composite item with multiple scorable parts.

### 6.3 Monitor

Monitor is the teacher's operational view during a TCAP diagnostic window.

Required behavior:

- Main session title remains stable when clicking a Subpart card.
- Subpart rail shows each SP status, time limit, current counts, and lock state.
- Selecting a Subpart updates details below, but does not rewrite the top session title.
- Teacher can unlock/resume/end the selected Subpart where the status allows it.
- Locked Subparts should explain why they are unavailable.
- Session-level paused status should not duplicate Subpart-level status.

Subpart states:

| State | Meaning | Teacher Action |
|---|---|---|
| Locked | Prerequisite or schedule not met | No action, show reason |
| Ready | Can be opened for students | Unlock SP |
| In Progress | Students are actively testing | Pause or End SP |
| Paused | Timers are frozen | Resume or End SP |
| Submitted/Completed | SP submitted | Review/grade if needed |
| Released | Results available | Read-only |

Student row states shown in Monitor:

- Not Started
- In Progress
- Extended
- Paused
- Locked
- Completed
- Auto-Submit

### 6.4 Analytics

Analytics is the teacher's diagnostic interpretation page. It should not feel like a settings page.

Required behavior:

- Tabs should be `Overview` and `Analytics` only for teacher session detail.
- There should be no teacher-facing `Cut Scores` tab.
- Performance level ranges appear as a lightweight score level guide near the top of Analytics.
- Class performance summary shows how many students are Below, Approaching, Meeting, and Exceeding.
- Closest to Meeting identifies students near the Meeting cut score.
- Standards Needing Review ranks standards by students below threshold.
- Clicking a standard opens a drawer/detail view without changing the page title/context.

Required wording:

- Use `Performance Level Ranges` or `Score level guide`, not `Cut Scores`, in teacher-facing Analytics.
- Avoid `assign practice`, `practice focus`, or practice delivery CTAs until practice delivery exists.

### 6.5 Student Runner

The TCAP runner validates the student-side testing experience.

Required behavior:

- Student enters through launch/sign-in.
- Student completes ready/device check.
- Student sees directions and sample/test instructions.
- Student answers one question at a time.
- Reading passages render as split view with passage on the left and question on the right.
- Footer question numbers show progress state during testing, not correctness.
- During testing, question number states use the same semantics as ACT:
  - Current = dark filled
  - Answered = Kira purple outline
  - Unanswered = neutral
  - Flagged = small flag/dot
- Results review is the only place where correct/wrong colors appear.

Out of scope:

- Real secure browser enforcement.
- Real proctor lockout/re-entry flow.
- Real statewide accessibility tooling beyond prototype-level extended time.

### 6.6 Student Report

Student report explains the diagnostic outcome and what to review next.

Required behavior:

- Header uses the same report chrome as ACT: dark top bar, title, download action, student profile card.
- Show predicted scale score.
- Show performance level.
- Show confidence and diagnostic context.
- Show gap to next level using scale points.
- Show standards to review with score percentage and high-priority tags only where useful.
- Do not repeat generic `Review priority` on every row.
- Reporting categories show category-level performance.
- Where You Stand compares the student to the class cohort, not state cohort.
- Item-by-item review supports Subpart tabs and status filters.
- Results review opens original test interface with answer, correct answer, and explanation.

Important wording:

- The report should say `predicted` or `diagnostic` where scale scores are simulated.
- Practice delivery is not available in this prototype.

## 7. Scoring and Reporting Rules

### 7.1 Performance Levels

User-visible TCAP labels:

- Below
- Approaching
- Meeting Expectations
- Exceeding Expectations

Teacher-facing Analytics should explain these as score level ranges. Teachers do not configure these thresholds in the session view.

### 7.2 Cut Score Boundaries

MVP teacher view:

- Read-only score level guide only.
- No editable cut score fields.

Future district admin view:

- District admin can manage LEA-supplied cut score profile.
- Any edit must be separate from teacher Analytics and permission-gated.

Prototype limitation:

- Current prototype uses a demo 300-450 scale range.
- Real production needs grade + subject specific official ranges and raw-to-scale tables from LEA/TDOE source.

### 7.3 Prediction Formula

Prototype prediction uses a demo adapter:

`prediction = priorAccuracy * 0.50 + standardCoverage * 0.30 + difficultyAdjust * 0.20`

The resulting percent is mapped linearly to the demo scale score range.

Production requirement:

- Replace linear projection with calibrated diagnostic model.
- Add clear confidence/uncertainty language.
- Do not present projected score as official TCAP score.

### 7.4 Writing / Rubric Items

ELA Writing is not auto-released as ordinary MC score.

Rules:

- SP1 Writing is human-review/rubric-gated.
- Composite score should not be final until required Subparts and rubric items are complete.
- Rubric pending items display `Rubric pending`, not correct/wrong.

## 8. Data Model Requirements

### 8.1 Assessment / Session

Minimum fields:

- `id`
- `testType = tcap`
- `title`
- `teacher`
- `tcapSubject`
- `tcapGrade`
- `blueprintKey`
- `cohortClassName`
- `cohortStudents`
- `cutScoreProfileKey`
- `windowStart`
- `windowEnd`
- `subparts[]`

### 8.2 Subpart

Minimum fields:

- `code`
- `label`
- `subtitle`
- `schedule`
- `schedDate`
- `status`
- `lockState`
- `students`
- `ready`
- `inProgress`
- `submitted`
- `graded`
- `pendingRelease`
- `released`
- `timeLimitMinutes`
- `extTimeMinutes`
- `gradingModel`
- `calculatorPolicy`
- `rules[]`
- `weight`
- `items[]`
- `studentRows[]`

### 8.3 Student Report

Minimum fields:

- student identity
- grade/subject/class context
- predicted scale score
- performance level
- confidence
- gap to next level
- standards accuracy map
- item-level answer/review status

## 9. State Machines

### 9.1 Teacher Session State

| State | Trigger | UI |
|---|---|---|
| Scheduled | Assessment assigned but window not open | Subpart cards show scheduled/ready/locked |
| Ready | Subpart can be opened | Unlock action enabled |
| In Progress | Teacher unlocks Subpart | Student progress visible |
| Paused | Teacher pauses Subpart | Resume and End SP actions visible |
| Submitted | Students submit or auto-submit | Grading/review status visible |
| Released | Required grading complete and report released | Read-only report access |

### 9.2 Student Runner State

| State | Trigger | UI |
|---|---|---|
| Launch | Student opens join flow | Join code/student ID |
| Ready Check | Student continues | Device/audio/network check |
| Directions | Ready check passed | Directions + sample |
| Test | Student begins | One question per page, timer, question nav |
| Review Answers | Student reaches end | Answered/unanswered/flagged summary |
| Submitted | Student submits | Holding/report transition |
| Results Review | Student opens item review from report | Correct/wrong/pending overlays |

## 10. UX Requirements

### 10.1 Teacher UX

- Do not duplicate information across title, cards, and detail panel.
- Keep session title stable.
- Subpart selection changes details, not page identity.
- Use Kira design system tokens and subtle cards.
- Use action labels that match state: `Unlock SP`, `Resume`, `End SP`.
- Do not use result colors for in-progress question states.

### 10.2 Student UX

- Avoid teacher/admin language on student pages.
- Explain predicted scale score without implying official TCAP result.
- Show next-step review guidance but do not promise practice delivery.
- Item review should be clearly post-submit and read-only.

## 11. Prototype / PRD Mismatches to Watch

These are the primary review risks:

1. The repository previously had no standalone TCAP PRD; this document is now the source of truth draft.
2. README still describes ACT/SAT more than TCAP and should be updated if used for external review.
3. Admin cut score config exists as prototype/future surface, but teacher session should not expose editable cut score controls.
4. Some code comments still mention earlier design decisions such as Cut Scores tab; comments are not user-facing but should be cleaned before engineering handoff.
5. TCAP data is mock/demo; production requires official cut score and raw-to-scale data.
6. Practice delivery is explicitly out of scope; UI must avoid actionable practice CTAs.

## 12. QA Acceptance Criteria

### Teacher Create / Assign

- Given a teacher selects Grade 5 ELA, the system shows 4 Subparts with fixed time and item count.
- Given a teacher selects Grade 5 Math, the system shows calculator-free and calculator-allowed Subparts.
- Given a teacher selects invalid subject/grade combination, the UI prevents or explains the invalid selection.
- Teacher cannot delete required Subparts.
- Teacher cannot change official time limits from the session view.

### Monitor

- Clicking SP cards updates the selected detail panel.
- Clicking SP cards does not append SP name to the main session title.
- Locked SPs show disabled actions.
- Paused SPs show Resume and End SP.
- Session-level status does not duplicate Subpart status.

### Analytics

- Teacher sees only Overview and Analytics tabs.
- Analytics includes score level guide, class summary, closest-to-Meeting, and standards needing review.
- No teacher-facing editable cut score inputs appear.
- No assign-practice CTA appears.
- Clicking a standard opens detail drawer without changing top page context.

### Student Runner

- In-test question numbers do not show correct/wrong colors.
- Results review question numbers do show correct/wrong/pending colors.
- Reading items render passage + question split view.
- Flagged items display a flag indicator.
- Timer and extended-time indicators display only during test phase.

### Student Report

- Header visually matches ACT report chrome.
- Report shows predicted scale score, performance level, gap to next level, standards to review, reporting categories, peer comparison, and item-by-item review.
- `Standards to Review` rows do not repeat `Review priority` on every row.
- Rubric items display pending status instead of wrong/correct.

## 13. Readiness Verdict

Prototype readiness: Almost ready for design/product review.

The prototype can pass review if the review scope is clearly framed as:

- TCAP diagnostic workflow prototype
- mock data and demo scoring
- no production raw-to-scale conversion
- no practice delivery
- no teacher cut score editing

It should not be approved as production-ready implementation until:

1. Official TCAP blueprint, item type coverage, timing, and cut scores are revalidated for the target assessment year.
2. Production data contracts are defined for assessment, Subpart, student session, rubric scoring, and report output.
3. Practice-related language is fully removed or explicitly marked out of scope.
4. Admin cut score configuration is separated from teacher-facing surfaces and permission-gated.
5. QA signs off on all state transitions for Subpart lifecycle and student runner.
