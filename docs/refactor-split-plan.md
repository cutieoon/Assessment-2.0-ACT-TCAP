# Refactor — Split Single-File Prototype into Vite + TS/CSS Modules

> Status: **DRAFT — pending user approval before any code changes start.**

## 0. Goals & non-goals

**Goals**
- Split the 34,653-line `assessment 2.0 ACT & TCAP.html` (2.2MB) into a Vite + TypeScript + CSS multi-file project.
- One TS file per page flow (Editor, Monitor, Analytics, Score reports, Test runner, ACT Writing, Question details).
- 1:1 behavior parity with the original prototype.

**Non-goals**
- No logic refactoring, dedup, or UI tweaks.
- No new dependencies beyond what is already loaded (Tailwind / Mermaid / html2canvas).
- No test suite (the original has none; adding tests is out of scope).
- No backend changes — mock data stays mock data.

## 1. Findings from the source scan

| Block | Line range | Size | What it is |
|---|---|---|---|
| `<head>` + CDN scripts | 1–9 | tiny | Tailwind, Mermaid, html2canvas via CDN |
| Main `<style>` | 10–7182 | ~7.2k lines | Bulk of the prototype CSS |
| `<body>` HTML (toolbar + flow containers) | 7184–34316 (interleaved) | n/a | Multiple `<main>` / `<section>` shells per flow |
| Inline `<style>` blocks | 8041–8043, 8151–8285, 31197–31212 | small | Per-flow style addenda + one **export-PDF inline style** |
| Main `<script>` | 8953–34316 | ~25.4k lines | Bulk of the prototype JS — 896 top-level functions |
| Tail `<script>` (stuModal + ACT Practice Focus modal) | 34351–34569 | ~220 lines | Student modal helpers |
| Tail `<script>` (sparkle canvas) | 34572–34651 | ~80 lines | Login-page particle animation |

### Top-level constants (mock data) found in the main script — to extract verbatim

`ICONS`, `TYPE_ICON`, `GENERIC_SECTIONS`, `ACT_SECTIONS`, `SAT_SECTIONS`, `ACT_WRITING_DOMAINS`, `ACT_WRITING_PROMPT`, `SAMPLE_Q`, `TYPE_LABELS`, `CANONICAL_SKILLS`, `TEST_NATIVE_TO_CANONICAL`, `CANONICAL_TO_TEST_NATIVE`, `DRAWER_DATA`, `DW_TCAP_CONFIG`, `TCAP_SUBPART_BLUEPRINT`, `TEMPLATE_CONFIGS`, `TCAP_PROFILE`, `TCAP_CUT_STATE`, `TCAP_CLASS_DEFAULT`, `TCAP_CLASS_BY_SESSION`, `TCAP_CLASS`, `GENERATION_CARD_TIPS`, `DW_ACT_SECTIONS`, `SESSION_DATA`, `ASSIGN_STEPS`, `FLOW_DIAGRAMS`, `FLOW_PHASES`, `ASSESS_CARD_*`, `TIMER_STATUS_CONFIG`, `STUDENT_PROFILES`, `ACCOMMODATION_FLAG_OPTIONS`, `EXT_TIME_PRESETS`, `ITEM_TYPES`, `ITL_PHASES`, `ITE_DEFAULTS`, `ITE_PROP_DEFAULTS`, `TP_STIM_TYPES`, `ITEM_EDITOR_BUILDERS`, `ITS_ANSWER_DEFAULTS`, `ITEM_STUDENT_BUILDERS`, `TCS_PHASES`, `TCS_QUESTIONS_*` (5 subject pools), `TCS_POOLS`, `TCS_QUESTIONS`, `TCS_STATE`, `_TCS_SUBJECT_META`, `ACT_BENCHMARKS`, `ACT_REPORTING_CATEGORIES`, `ACT_V2_STUDENTS`, `FLOWS_I18N`, `ADDQ_TYPE_MAP`, `PASSAGE_TITLE_MAX`, `EDITOR_MAP`, `NEW_EDIT_SECTIONS`, `NEW_EDIT_ITEMS`, `_TCAP_PRACTICE_ITEM_POOL`, `_LUCIDE_DOWNLOAD_SVG`, `_LUCIDE_LOADER_SVG`, `STU_STATE`, `STU_TIMERS`, `STU_TOOLS`, `ACT_REVIEW_SECTION_TO_IDX`, `ACT_QSEC_TO_REVIEWKEY`, `ACT_SUBJECT_THEMES`, `ACT_SCALE`, `SAT_RW_SCALE`, `SAT_MATH_SCALE`, `STUDENT_PROFILE`, `ACT_REPORT`, `GRADER_DATA`, `GRADER_ACT_DATA`, `GRADER_SAT_DATA`, `GRADER_GENERIC_TEMPLATE`, `SESSION_GRADER_CACHE`, `ACT_PERCENTILE_TABLES`, `SAT_PERCENTILE_TABLES`, `ACT_QUESTIONS`, `ACT_FULL_SECTION_SPECS`, `ACT_READING_PASSAGES`, `ACT_SCIENCE_STIMULI`, `SAT_QUESTIONS`, `ACT_TARGET_TIME_PER_Q`, `ACT_SECTION_LABELS`, `ACT_SCORE_IMPACT_PER_Q`, `ACT_REVIEW_PAGE_SIZE`, `ACT_REVIEW_SECTIONS`, `ACTR_SUBJECTS`, `SAT_REPORT`, `SAT_BAND_LABELS`, `SAT_BAND_COLORS`.

Function-naming prefixes that imply flow membership: `tcap*` / `dwTcap*` / `tcs*` (TCAP), `act*` / `actr*` (ACT report), `stu*` (student-side runner), `ite*` / `its*` (item editor / item student view), `dw*` (drawer / wizard).

### One critical gotcha: PDF export inline-style injection

Line 31213 contains:

```js
<style>${document.querySelector('style').textContent}</style>
```

This reads the **first** `<style>` element in the live DOM and clones its CSS into a new export window. If we move the main stylesheet to an external `.css` file imported via Vite, `document.querySelector('style')` will return either `null` or a Vite-injected runtime style shim, breaking PDF export.

**Mitigation (decided in this plan):**
- During dev: Vite injects CSS as `<style>` tags by default → `document.querySelector('style')` still returns the full stylesheet, so PDF export keeps working.
- During production build: we will configure Vite with `build.cssCodeSplit: false` and use `?inline` imports for the styles bundle, OR fetch the built CSS via `fetch(import.meta.env.BASE_URL + assetUrl).then(r=>r.text())` and inject it into the export window. We'll pick the simpler one (`?inline`) and validate during the parity-check task.
- Acceptance criterion: PDF export must render identically to the original (verified manually).

## 2. Target file tree

```
Assessment-2.0-ACT-TCAP/
├── index.html                          # New Vite entry — slim shell
├── package.json
├── pnpm-lock.yaml                      # generated
├── tsconfig.json
├── vite.config.ts
├── README.md                           # updated quick-start
├── docs/
│   └── refactor-split-plan.md          # this file
├── public/
│   └── (any static assets if needed)
└── src/
    ├── main.ts                         # entry: imports styles, mounts flows, wires toolbar
    │
    ├── styles/
    │   ├── base.css                    # line 10–7182 main stylesheet (verbatim)
    │   ├── student-runner.css          # line 8041–8043 + 8151–8285 inline blocks
    │   └── export-report.css           # line 31197–31212 export-page styles
    │
    ├── data/                           # Pure mock-data modules — no DOM, no side effects
    │   ├── icons.ts                    # ICONS, TYPE_ICON, ICON_USERS/TIMER/STAR/EYE, _LUCIDE_* SVGs
    │   ├── sections.ts                 # GENERIC_SECTIONS, ACT_SECTIONS, SAT_SECTIONS
    │   ├── act-writing.ts              # ACT_WRITING_DOMAINS, ACT_WRITING_PROMPT
    │   ├── sample-q.ts                 # SAMPLE_Q
    │   ├── canonical-skills.ts         # TYPE_LABELS, CANONICAL_SKILLS, TEST_NATIVE_TO_CANONICAL, CANONICAL_TO_TEST_NATIVE
    │   ├── tcap.ts                     # DRAWER_DATA, DW_TCAP_CONFIG, TCAP_SUBPART_BLUEPRINT, TCAP_PROFILE, TCAP_CLASS_*, _TCAP_PRACTICE_ITEM_POOL
    │   ├── templates.ts                # TEMPLATE_CONFIGS, GENERATION_CARD_TIPS, ASSIGN_STEPS, FLOW_DIAGRAMS, FLOW_PHASES, ASSESS_CARD_*
    │   ├── session-data.ts             # SESSION_DATA, TIMER_STATUS_CONFIG
    │   ├── student-profiles.ts         # STUDENT_PROFILES, ACCOMMODATION_FLAG_OPTIONS, EXT_TIME_PRESETS, STUDENT_PROFILE
    │   ├── item-editor.ts              # ITEM_TYPES, ITL_PHASES, ITE_DEFAULTS, ITE_PROP_DEFAULTS, TP_STIM_TYPES, ITEM_EDITOR_BUILDERS, ITS_ANSWER_DEFAULTS, ITEM_STUDENT_BUILDERS
    │   ├── tcs.ts                      # TCS_PHASES, TCS_QUESTIONS_*, TCS_POOLS, _TCS_SUBJECT_META
    │   ├── act-report.ts               # ACT_BENCHMARKS, ACT_REPORTING_CATEGORIES, ACT_V2_STUDENTS, ACT_SCALE, ACT_REPORT, ACT_PERCENTILE_TABLES, ACT_QUESTIONS, ACT_FULL_SECTION_SPECS, ACT_READING_PASSAGES, ACT_SCIENCE_STIMULI, ACT_SUBJECT_THEMES, ACT_REVIEW_*, ACT_TARGET_TIME_PER_Q, ACT_SECTION_LABELS, ACT_SCORE_IMPACT_PER_Q, ACTR_SUBJECTS
    │   ├── sat-report.ts               # SAT_RW_SCALE, SAT_MATH_SCALE, SAT_QUESTIONS, SAT_REPORT, SAT_PERCENTILE_TABLES, SAT_BAND_LABELS, SAT_BAND_COLORS
    │   ├── grader.ts                   # GRADER_DATA, GRADER_ACT_DATA, GRADER_SAT_DATA, GRADER_GENERIC_TEMPLATE, SESSION_GRADER_CACHE
    │   ├── editor.ts                   # EDITOR_MAP, NEW_EDIT_SECTIONS, NEW_EDIT_ITEMS, ADDQ_TYPE_MAP, PASSAGE_TITLE_MAX
    │   ├── flows-i18n.ts               # FLOWS_I18N
    │   └── dw-act.ts                   # DW_ACT_SECTIONS
    │
    ├── state/
    │   └── globals.ts                  # STU_STATE, STU_TIMERS, STU_TOOLS, TCS_STATE, TCAP_CUT_STATE, TCAP_CLASS, TCS_QUESTIONS (mutable) — single source of truth shared across flows
    │
    ├── shared/
    │   ├── dom.ts                      # cloneData() and other tiny DOM/data helpers (extract on encounter)
    │   ├── stu-modal.ts                # tail script #1: stuModal() + ACT Practice Focus modal logic
    │   └── sparkle.ts                  # tail script #2: login sparkle canvas animation
    │
    └── flows/
        ├── toolbar.ts                  # Floating prototype toolbar (cross-flow navigator)
        ├── editor.ts                   # Assessment Editor — uses EDITOR_MAP, NEW_EDIT_*, item-editor data
        ├── monitor.ts                  # Real-time participant tracker + grader-center
        ├── analytics.ts                # Class-level analytics + AI risk detection
        ├── score-report-act.ts         # ACT score report (composite, derived, AI insights, PDF export)
        ├── score-report-sat.ts         # SAT score report
        ├── score-report-tcap.ts        # TCAP report (if separately rendered)
        ├── test-runner-act.ts          # ACT Bluebook-style runner — uses STU_STATE/TIMERS/TOOLS
        ├── test-runner-sat.ts          # SAT runner
        ├── test-runner-tcap.ts         # TCS_* TCAP runner
        ├── act-writing.ts              # ACT Writing essay editor + rubric
        ├── item-editor.ts              # ITE_* item authoring view
        ├── item-student.ts             # ITS_* item student view
        ├── question-details.ts         # IELTS-style question record view
        └── drawer-wizard.ts            # dw* / dwTcap* assessment-generation drawer
```

> Flow file boundaries will be refined during the actual cut — we slice along the function-name prefixes (`tcap*` / `act*` / `stu*` / `ite*` / `its*` / `tcs*` / `dw*` / `actr*`). Any function used by multiple flows moves into `shared/`.

## 3. Build / runtime setup

### package.json (sketch)

```jsonc
{
  "name": "assessment-2-act-tcap",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x"
  }
}
```

### tsconfig.json

- `strict: true`, `noUncheckedIndexedAccess: true` (per CLAUDE.md).
- `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`.
- `allowJs: false` — but **for the initial cut we'll relax strictness** by treating the extracted code as `// @ts-nocheck`'d TS files so the user can opt into types incrementally. (Decision point — see §6.)

### vite.config.ts

- Default config; only override `build.cssCodeSplit: false` so a single CSS bundle ships.
- CDN scripts (Tailwind/Mermaid/html2canvas) stay as `<script src=…>` in `index.html` head — no npm migration in this pass.

### index.html (new shell)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Assessment 2.0 — ACT & TCAP Prototype</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
</head>
<body class="lang-en">
  <!-- All <main>/<section> shells from line 7184–34316 of the original -->
  <!-- Preserved VERBATIM, with the inline <style> blocks at 8041 / 8151 -->
  <!-- replaced by their @import equivalents at the top of src/main.ts.   -->
  ...
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### src/main.ts (sketch)

```ts
import './styles/base.css';
import './styles/student-runner.css';
import './styles/export-report.css';

import './data/icons.ts';      // pure-data modules with side-effect-free exports
import './state/globals.ts';
// … other data modules

import './flows/toolbar.ts';
import './flows/editor.ts';
import './flows/monitor.ts';
// … each flow registers its own DOM event handlers / init on import
```

> **Migration tactic:** during the cut, each extracted module will use **named exports** for any symbol another module reads, and **side-effectful registration on import** for DOM init code (mirrors how the original script ran top-to-bottom at page load).

## 4. Execution plan (per task)

1. **Scaffold Vite + TS** (`package.json`, `tsconfig.json`, `vite.config.ts`, empty `src/` tree, new `index.html` shell that mirrors original `<body>` markup verbatim). Run `pnpm install`, confirm `pnpm dev` boots an empty page.
2. **Extract styles** — `base.css` from line 10–7182 of original; `student-runner.css` from 8041–8043 + 8151–8285; `export-report.css` from 31197–31212. Wire into `main.ts`. Manually verify PDF export gotcha (§1).
3. **Extract data modules** — one file per group in §2's tree. Each module just `export const X = …;` — no logic. Verify each export with `tsc --noEmit`.
4. **Extract state module** — mutable globals (`STU_STATE` etc.) into `src/state/globals.ts` as named exports.
5. **Extract shared utilities** — `cloneData`, any utility function called by 3+ flows, `stuModal`, sparkle canvas.
6. **Cut flows** — slice the main script by function-name prefix into `src/flows/*.ts`. For each flow file:
   - Resolve imports for data + state + shared utilities.
   - Keep any DOM-event-listener registration that ran at script load.
   - Cross-flow function calls become explicit imports.
7. **Parity sweep** — open every flow in browser, compare side-by-side with original. Fix any regressions.
8. **Update README** — new dev/build commands.

## 5. Verification plan

For each flow listed in README:
- [ ] Page renders identical layout (compare screenshots side-by-side).
- [ ] All interactive elements work (toolbar nav, buttons, drawer, modals, calculator, eliminator, notes, timer).
- [ ] PDF export from ACT score report produces identical output.
- [ ] No errors in browser console.
- [ ] No 404s on assets / styles.

Tooling: visually compare the original file (open via `python3 -m http.server 8000`) against the Vite dev server (`pnpm dev`, port 5173 by default).

## 6. Open decisions (need user input if you disagree)

- **TS strictness on first cut**: I propose `// @ts-nocheck` at the top of each extracted flow file initially — the original is plain JS and forcing strict types would balloon the diff. CLAUDE.md says strict TS, but I read that as "for new code." Confirm if you want strict from day one.
- **CDN vs npm for Tailwind/Mermaid/html2canvas**: I propose keeping CDN to minimize change surface. Migrate to npm later if desired.
- **Whether to also split the body HTML**: I propose keeping the body HTML as one block in `index.html` for now (it's static markup, not the painful part). Splitting it into template fragments is a future step. Confirm if you want body-HTML splitting in this pass too.

## 7. Rollback plan

Original `assessment 2.0 ACT & TCAP.html` stays committed and untouched on disk throughout. If the split is broken, users can keep opening that file directly. We only update the README to point at the new dev flow when verification passes.
