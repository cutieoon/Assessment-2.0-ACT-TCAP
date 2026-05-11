# Assessment 2.0 — ACT & TCAP Prototype

Vite + TypeScript prototype for the next-generation Kira Assessment platform, focused on the ACT and Tennessee TCAP standardized-test flows.

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

Build / preview:

```bash
pnpm build
pnpm preview
```

## Project layout

```
.
├── index.html               # HTML shell (markup only — no inline <style>/<script>)
├── src/
│   ├── main.ts              # Entry: imports styles + injects app scripts
│   ├── app.ts               # Main application logic (Phase-1: one big module)
│   ├── shared/
│   │   ├── stu-modal.ts     # Student modal + ACT Practice Focus modal helpers
│   │   └── sparkle.ts       # Login-gate sparkle canvas animation
│   ├── styles/
│   │   ├── base.css         # Main stylesheet (~7k lines)
│   │   └── student-runner.css
│   ├── data/                # Reserved for Phase 2: mock-data modules
│   ├── state/               # Reserved for Phase 2: shared mutable state
│   └── flows/               # Reserved for Phase 2: per-page-flow modules
└── docs/
    └── refactor-split-plan.md  # Split strategy and Phase-2 plan
```

This project was split out of a 34k-line single-file HTML prototype. **Phase 1** (this commit) extracts CSS and JS into separate files and wires up Vite + TS, preserving 100% behavior parity. **Phase 2** (planned) will slice the still-monolithic `src/app.ts` into per-flow modules (Editor, Monitor, Analytics, Score reports, Test runners, etc.) — see `docs/refactor-split-plan.md`.

### Why `?raw` script injection?

The original prototype loaded its JS via classic `<script>` blocks, so 900+ top-level `function foo(){…}` declarations landed on `window`, and the HTML uses `onclick="foo()"` throughout. ES modules don't expose top-level bindings globally, so `src/main.ts` imports `app.ts` / `stu-modal.ts` / `sparkle.ts` via Vite's `?raw` suffix and injects them as classic `<script>` elements at runtime. Phase 2 will rewrite this to proper ES module exports.

## What's covered

### Teacher flows
- **Editor** — assessment authoring with read-only ACT structure and per-section question swapping
- **Monitor** — real-time participant tracker, per-question matrix, status pills, in-flight grading queue
- **Analytics** — class-level performance, weak standards heatmap, AI risk detection
- **Score reports** — ACT and SAT student score reports with composite, derived scores, readiness benchmarks, AI Insights

### Student flows
- **Test runner** — Bluebook/TestNav-style ACT and SAT runners with timer, eliminator, notes, calculator (Math only), section directions
- **ACT Writing** — full essay editor with rubric domain feedback
- **Score report** — student-facing summary with hybrid AI (top hero card + inline section commentary)
- **Question details** — IELTS-prep-style question record with subject tabs, color-coded grid

### Cross-cutting
- Floating prototype toolbar for quick navigation between flows / roles / pages
- Kira purple brand tokens, shadcn-flavored AI Insights design
- Mock backend wired through `SESSION_DATA` / `STUDENT_PROFILE` / `ACT_REPORT` / `SAT_REPORT` constants

## CDN dependencies

Kept on CDN (not migrated to npm in this pass):
- Tailwind CSS (`cdn.tailwindcss.com`)
- Mermaid 11
- html2canvas 1.4.1
