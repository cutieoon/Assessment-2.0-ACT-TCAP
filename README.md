# Assessment 2.0 — ACT & TCAP Prototype

Single-file HTML prototype for the next-generation Kira Assessment platform, focused on the ACT and Tennessee TCAP standardized-test flows.

## Quick start

```bash
# Serve locally on port 8000
python3 -m http.server 8000

# Then open in your browser
open "http://localhost:8000/assessment%202.0%20ACT%20%26%20TCAP.html"
```

You can also just double-click the file to open it in your browser — no build step required.

## What's covered

This prototype is a single self-contained HTML file demonstrating the end-to-end flows for ACT and TCAP. It uses vanilla JS, inline CSS, and includes mock data for every screen.

## Product docs

- [TCAP Diagnostic PRD](./TCAP_PRD.md) — Chinese review draft covering Overview, MVP scope, Teacher/Student flows, Subpart lifecycle, scoring/reporting rules, non-goals, and QA acceptance criteria.

### Teacher flows
- **Editor** — assessment authoring with read-only ACT structure (sections, time, item count locked) and per-section question swapping
- **Monitor** — real-time participant tracker, per-question matrix, TCAP Subpart rail, status pills, and in-flight grading queue
- **Analytics** — class-level performance, TCAP standards needing review, closest-to-Meeting students, and score level guide
- **Score reports** — ACT, SAT, and TCAP student reports with composite/scale scores, reporting categories, standards review, and item-level review

### Student flows
- **Test runner** — Bluebook/TestNav-style ACT and SAT runners with timer, eliminator, notes, calculator (Math only), and section directions
- **TCAP runner** — TestNav-style launch, ready check, directions, split passage view, Subpart-aware testing, and results review
- **ACT Writing** — full essay editor with rubric domain feedback
- **Score report** — student-facing ACT/SAT/TCAP summary with hybrid AI or diagnostic guidance, depending on assessment type
- **Question details** — IELTS-prep-style question record with subject tabs, color-coded grid, and per-question detail view

### Cross-cutting
- Floating prototype toolbar for quick navigation between flows / roles / pages
- Kira purple brand tokens, shadcn-flavored AI Insights design
- Mock backend wired through `SESSION_DATA` / `STUDENT_PROFILE` / `ACT_REPORT` / `SAT_REPORT` constants
