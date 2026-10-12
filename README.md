# SYN Flood Virtual Lab

A browser-only educational simulation. A student works through nine guided steps and watches a **simulated** server lose
availability as its TCP connection queue fills during a SYN flood, then recover when defences are switched on.
Plain HTML, CSS and JavaScript: no backend, no libraries, **no real network traffic**. All numbers are simulated
educational estimates.

![screenshot placeholder](docs/screenshot.png)  <!-- TODO (Meet): add a screenshot -->

## Run it

| What | How |
|---|---|
| Open the lab | Double-click `index.html` (works from `file://`, no server needed) |
| Fake engine for visual work | `index.html?mock=1` (dev only, never shipped) |
| Build the 3-file deliverable | `node build.js` -> `dist/index.html`, `dist/style.css`, `dist/script.js` |
| Engine tests | `node tests/engine.test.js` |
| Quick API/id check | `node tests/smoke.test.js` (run `node build.js` first) |
| Full student journey in a real browser | `node tests/e2e.js` (add `--dist` to test the built 3-file version; needs Chrome, Chromium or Edge, or set `CHROME=/path`) |

## What is already built

A complete, working first version of everything. Nobody has to start from scratch: **improve your own part**.

| Area | File | Status | Good next improvements |
|---|---|---|---|
| Contract, skeleton, build | `CONTRACT.md`, `index.html`, `build.js` | done | Manvith: keep the contract in sync |
| Simulation engine | `js/engine.js` | done, calibrated, tested | Manvith: tune constants in `DEFAULTS`; keep `node tests/engine.test.js` green |
| Workflow, quiz, reset, completion | `js/workflow.js`, `js/quiz.js` | done, covered by e2e | Manvith: bonus features (print results, theme toggle, custom attack level) |
| Topology, packets, handshake demo | `js/visuals.js` | done | Pranav: richer packet animation, test on slow devices |
| Dashboard, chart, log, comparison | `js/dashboard.js` | done | Pranav: chart polish, comparison wording |
| Layout, buttons, stepper, modals | `css/base.css` | done (light + dark, responsive) | Yash: match your Figma mockup, refine spacing and the accessibility pass |
| Simulation components, icons | `css/lab.css`, `js/icons.js` | done | Sanika: redraw icons, refine node/packet/queue styling, QA |
| All text and the quiz | `js/content.js` | complete first draft | Meet: fact-check, tighten wording, replace the 9 guidelines with the brief's exact text |
| README, demo video, slides | `README.md`, `docs/` | README draft | Meet |

Only edit your own files so Git merges never conflict. If you need a change in someone else's file, tell the owner.

## How the lab works

- **Queue model.** The server has 100 half-open slots. Legitimate clients (5 SYN/s) complete their handshake after 1 s and
  free the slot. Attack SYNs mostly never complete, so they hold a slot until a ~30 s timeout.
- **Cause and effect.** Each simulated second the engine expires entries, generates arrivals, applies the firewall and rate
  limit, then gives each SYN a slot, a SYN cookie or a rejection. Metrics and the server state are derived from the queue.
- **Defences.** SYN cookies, rate limiting, shorter timeouts and firewall filtering, each with a stated limitation.
  None gives 100% protection.
- **Deterministic.** A seeded PRNG (mulberry32, seed 1337) means the same settings always give the same result.

## Team

| Member | Role |
|---|---|
| Manvith Karkera | Engine, workflow, integration |
| Pranav Koradiya | Visualisation and dashboard |
| Yash Masaye | UI design and layout |
| Sanika Lobo | Component design, icons, QA |
| Meet Mangaonkar | Content, README, demo video, slides |

## Git workflow

1. Each person works on their own branch: `manvith`, `pranav`, `yash`, `sanika`, `meet` (they start from `main`).
2. At each sync everyone pushes; Manvith merges all branches into `main`.
3. Everyone pulls `main` after each sync to see the whole page.

Bug reports: post *where / what happened / what should happen / screenshot* and tag the file owner.

## Docs

- `CONTRACT.md` - every id, class, function, event and data shape (source of truth)
- `docs/build-plan.pdf` - build plan, schedule and prompts
- `tests/checklist.md` - QA checklist

## Ethics

The lab sends no traffic. It exists to teach how denial-of-service attacks work so students can defend systems. Never run
flood traffic against a network you do not own or have written permission to test.

## References

- RFC 4987, *TCP SYN Flooding Attacks and Common Mitigations*
- D. J. Bernstein, *SYN cookies*
- H. Wang, D. Zhang and K. G. Shin, *Detecting SYN Flooding Attacks*, IEEE INFOCOM 2002


## Part 2: Defender's Workshop (step 8)

After the simulation the student must complete five modules (`js/workshop.js`, text in `js/workshop-content.js`, styles in `css/workshop.css`):

1. **Understand**: SYN queue vs accept queue, SYN cookies, Little's law, a numeric exercise, attack-type table.
2. **Investigate**: monitoring, `dmesg`, `ss` and tcpdump evidence; diagnose a spoofed SYN flood.
3. **Harden**: a simulated Linux terminal that accepts real `sysctl`, `ss`, `netstat`, `dmesg`, `tcpdump`, `iptables`, `nft`, `ipset` commands, plus a checklist and a test that replays the attack against the student's configuration using the same engine.
4. **Choose layers**: match situations to host tuning, firewall, proxy, scrubbing, ISP/BCP 38.
5. **Run the incident**: six on-call decisions with explained consequences.

Tests: `node tests/shell.test.js` (shell and content checks). The quiz now has 12 questions. Ideas for the team: more commands (`awk`, `conntrack -L`), a second scenario (non-spoofed botnet), IPv6.

**Terminal pop-up.** A header button (or Ctrl+`) opens a docked Linux terminal (`js/terminal.js`). It opens by itself at step 6. What you configure there (`sysctl`, `iptables`, `nft`) is evaluated into the four defences, and the switches in the Mitigation section follow it, so the terminal is the control panel for "Run With Mitigation".

**Guided runbook.** The terminal pop-up has a step-by-step runbook (13 required steps plus 3 SYNPROXY bonus steps, defined in `Lab.Content.runbook`). Each step shows the exact command and why it matters; it completes when the *server state* satisfies it (checked in `js/terminal.js`), so any equivalent command also counts.
