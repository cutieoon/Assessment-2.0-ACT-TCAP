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

### Teacher flows
- **Editor** — assessment authoring with read-only ACT structure (sections, time, item count locked) and per-section question swapping
- **Monitor** — real-time participant tracker, per-question matrix, status pills, in-flight grading queue
- **Analytics** — class-level performance, weak standards heatmap, AI risk detection
- **Score reports** — ACT and SAT student score reports with composite, derived (STEM/ELA), readiness benchmarks, reporting categories, and AI Insights

### Student flows
- **Test runner** — Bluebook/TestNav-style ACT and SAT runners with timer, eliminator, notes, calculator (Math only), and section directions
- **ACT Writing** — full essay editor with rubric domain feedback
- **Score report** — student-facing summary with hybrid AI (top hero card + inline section commentary)
- **Question details** — IELTS-prep-style question record with subject tabs, color-coded grid, and per-question detail view

### Cross-cutting
- Floating prototype toolbar for quick navigation between flows / roles / pages
- Kira purple brand tokens, shadcn-flavored AI Insights design
- Mock backend wired through `SESSION_DATA` / `STUDENT_PROFILE` / `ACT_REPORT` / `SAT_REPORT` constants
