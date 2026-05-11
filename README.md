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
│   ├── main.ts              # Entry: imports styles + concatenates app slices
│   ├── vite-env.d.ts        # Ambient declarations for ?raw imports
│   ├── app/                 # 29 per-flow slices (data → editor → runner → reports)
│   │   ├── 01-data-core.ts
│   │   ├── 02-canonical-skills.ts
│   │   ├── …
│   │   └── 29-init.ts
│   ├── shared/
│   │   ├── stu-modal.ts     # Student modal + ACT Practice Focus modal helpers
│   │   └── sparkle.ts       # Login-gate sparkle canvas animation
│   └── styles/
│       ├── base.css         # Main stylesheet (~7k lines)
│       └── student-runner.css
```

This project was split out of a 34k-line single-file HTML prototype:
- **Phase 1** — extracted CSS and JS into separate files, wired up Vite + TS.
- **Phase 2** — sliced the 25k-line `app.ts` into 29 per-flow files under `src/app/` (data / editor / monitor / analytics / runners / reports / etc.). 1:1 behavior preserved.

### Why `?raw` script concatenation?

The original prototype loaded its JS via classic `<script>` blocks, so 900+ top-level `function foo(){…}` declarations landed on `window`, and 640+ inline `onclick="foo()"` handlers (both in `index.html` and inside JS template strings) rely on that. ES modules don't expose top-level bindings globally, so `src/main.ts` imports each slice via Vite's `?raw` suffix, concatenates them in order, and injects the result as one classic `<script>` element at runtime. This gives us a multi-file source layout with zero behavioral change.

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
