# Contributing to OpenFret

Thanks for thinking about contributing. OpenFret is small on purpose, so the bar for contribution is low and the bar for adding complexity is high.

## Ground rules

- **No build step.** OpenFret runs as plain HTML, CSS, and JavaScript. Anything that requires bundling, transpiling, or a server-side step is a non-starter unless we have a really good reason.
- **No third-party tracking.** No analytics, no ad scripts, no remote calls.
- **Stay vanilla.** Avoid frameworks. The codebase is intentionally readable by anyone who knows a little JS.
- **Sample songs must be verifiably in the public domain.** If you propose a new sample, include the year and a one-line justification.

## Things we'd love help with

- A genuinely good logo (the current SVG is a placeholder)
- A short demo GIF for the README
- Print-friendly stylesheet
- PWA manifest and service worker for offline install
- Song-level transposition button
- Capo helper
- More fingering diagrams
- Translations of the UI strings
- Adding your deployment to the README **Showcase** section

## How to propose a change

1. Open an issue first for anything bigger than a typo, so we can agree on direction before you write code.
2. Fork the repo, make your change in a branch, run the tests (`npm test`).
3. Open a PR. Describe what you changed and why.

## Running tests

```bash
npm install
npm test
```

The test suite has two layers:

- A Node smoke test (`tests/smoke.test.cjs`) that checks file wiring and JS syntax.
- A jsdom-based Jest suite covering navigation, songbook controls, tuner behavior, metronome, and music theory helpers.

## Style

- 4-space indents in JS, HTML, and CSS.
- Prefer `function` declarations for anything that has to be globally callable from inline `onclick` handlers.
- Prefer `const`/`let` over `var` in new code.
- Keep files small and ungrouped rather than huge and grouped.

## Code of conduct

By participating you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).
