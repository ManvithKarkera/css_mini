# SYN Flood Virtual Lab

A browser-only educational simulation: a student walks through an 8-step
experiment and watches a simulated server lose availability as its TCP
connection queue fills, then recover when defences are switched on.
Plain HTML, CSS and JavaScript. No backend, no libraries, **no real network
traffic**. All numbers are simulated educational estimates.

## Run it

- Open `index.html` directly in Chrome (no server needed).
- Add `?mock=1` to the URL to use the fake engine while the real one is in progress
  (e.g. `index.html?mock=1`).
- `node build.js` produces the final three-file deliverable in `dist/`
  (`index.html`, `style.css`, `script.js`); open `dist/index.html`.

## Contract

`CONTRACT.md` is the source of truth for every HTML id, CSS class, function
name, event and data shape. Do not rename anything in it without telling Manvith.

## Who owns what

Each person edits only their own files, so Git merges never conflict.

| Member | Files |
|---|---|
| Manvith Karkera | `CONTRACT.md`, `index.html`, `js/engine.js`, `js/workflow.js`, `js/quiz.js`, `js/mock-engine.js`, `build.js`, `tests/engine.test.js` |
| Pranav Koradiya | `js/visuals.js`, `js/dashboard.js` |
| Yash Masaye | `css/base.css`, Figma mockup |
| Sanika Lobo | `css/lab.css`, `js/icons.js`, QA |
| Meet Mangaonkar | `js/content.js`, `README.md`, demo video, slides |

JS load order: `content.js`, `icons.js`, `engine.js`, `mock-engine.js` (dev only),
`visuals.js`, `dashboard.js`, `quiz.js`, `workflow.js`.

## Git workflow

1. Each person works on their own branch: `manvith`, `pranav`, `yash`, `sanika`, `meet`.
2. At each sync everyone pushes; Manvith merges all branches into `main`.
3. Everyone pulls `main` after each sync to see the whole page.

Bug reports go in the team group as *where / what happened / what should
happen / screenshot*, tagging the file owner.

## Docs

- `docs/build-plan.pdf` — build plan, schedule and prompts
- `tests/checklist.md` — QA checklist
