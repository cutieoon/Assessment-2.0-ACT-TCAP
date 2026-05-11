// Entry — wires up styles + per-flow app scripts in the same order the
// original single-file prototype loaded them.
//
// The original prototype loaded its JS via a classic <script> block, so 900+
// top-level `function foo(){…}` declarations landed on `window` and the HTML
// (plus 600+ inline `onclick="…"` attributes inside template strings) relies
// on that. ES modules don't expose top-level bindings globally, so we
// concatenate the per-flow slices into one big script and inject it as a
// classic <script> element. This keeps behavior 1:1 while giving us a real
// multi-file source layout.
//
// `?raw` module types are declared in src/vite-env.d.ts.

import './styles/base.css';
import './styles/student-runner.css';

import s01 from './app/01-data-core.ts?raw';
import s02 from './app/02-canonical-skills.ts?raw';
import s03 from './app/03-item-drawer.ts?raw';
import s04 from './app/04-drawer-tcap.ts?raw';
import s05 from './app/05-tcap-profile.ts?raw';
import s06 from './app/06-prompt-input.ts?raw';
import s07 from './app/07-sessions-assign.ts?raw';
import s08 from './app/08-item-types-data.ts?raw';
import s09 from './app/09-item-editor-builders.ts?raw';
import s10 from './app/10-item-student-builders.ts?raw';
import s11 from './app/11-tcs-runner.ts?raw';
import s12 from './app/12-act-analytics.ts?raw';
import s13 from './app/13-flows-i18n.ts?raw';
import s14 from './app/14-editor.ts?raw';
import s15 from './app/15-tcap-parts-editor.ts?raw';
import s16 from './app/16-editor-interactions.ts?raw';
import s17 from './app/17-tcap-renderers.ts?raw';
import s18 from './app/18-navigation.ts?raw';
import s19 from './app/19-student-view.ts?raw';
import s20 from './app/20-act-review.ts?raw';
import s21 from './app/21-act-runner.ts?raw';
import s22 from './app/22-score-flow.ts?raw';
import s23 from './app/23-act-report.ts?raw';
import s24 from './app/24-grader-studio.ts?raw';
import s25 from './app/25-percentiles.ts?raw';
import s26 from './app/26-question-detail.ts?raw';
import s27 from './app/27-act-report-v2.ts?raw';
import s28 from './app/28-sat-report.ts?raw';
import s29 from './app/29-init.ts?raw';

import stuModalSrc from './shared/stu-modal.ts?raw';
import sparkleSrc from './shared/sparkle.ts?raw';

const appSrc = [
  s01, s02, s03, s04, s05, s06, s07, s08, s09, s10,
  s11, s12, s13, s14, s15, s16, s17, s18, s19, s20,
  s21, s22, s23, s24, s25, s26, s27, s28, s29,
].join('\n');

function injectClassicScript(source: string): void {
  const script = document.createElement('script');
  script.textContent = source;
  document.body.appendChild(script);
}

injectClassicScript(appSrc);
injectClassicScript(stuModalSrc);
injectClassicScript(sparkleSrc);
