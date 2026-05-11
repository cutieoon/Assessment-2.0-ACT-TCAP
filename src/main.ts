// Entry — wires up styles + app scripts in the same order the original single-file
// prototype loaded them.
//
// The original prototype loaded its JS via classic <script> blocks, so 900+
// top-level `function foo(){…}` declarations landed on `window`. The prototype
// then relies on this with `onclick="foo()"` attributes throughout the HTML and
// inside template strings. ES modules don't expose top-level bindings globally,
// so we deliberately inject these files as classic scripts (via `?raw` imports)
// to preserve that behavior 1:1.
//
// Phase 2 will move per-flow code into proper ES modules; for Phase 1 we just
// need parity.

import './styles/base.css';
import './styles/student-runner.css';

// @ts-expect-error  ?raw is a Vite-specific import suffix
import appSrc from './app.ts?raw';
// @ts-expect-error
import stuModalSrc from './shared/stu-modal.ts?raw';
// @ts-expect-error
import sparkleSrc from './shared/sparkle.ts?raw';

function injectClassicScript(source: string): void {
  const script = document.createElement('script');
  script.textContent = source;
  document.body.appendChild(script);
}

injectClassicScript(appSrc);
injectClassicScript(stuModalSrc);
injectClassicScript(sparkleSrc);
