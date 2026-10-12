/* ===== js/content.js ===== */
/* ==========================================================================
   content.js — OWNER: Meet Mangaonkar
   Purpose: all student-facing text and quiz data (Lab.Content, CONTRACT §5.7).
   STUB: placeholder values with every key present. Replace with real content (MM1).
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var TODO = 'TODO (Meet)';
  var item = function () { return { title: TODO, text: TODO }; };
  var mitigation = function () { return { title: TODO, text: TODO, limitation: TODO }; };

  var steps = [];
  for (var i = 1; i <= 8; i++) steps.push({ id: i, title: 'Step ' + i, instructions: TODO });

  var quiz = [];
  for (var q = 1; q <= 6; q++) {
    quiz.push({ id: q, question: TODO + ' question ' + q, options: ['A', 'B', 'C', 'D'], answer: 0, explanation: TODO });
  }

  Lab.Content = {
    title: 'SYN Flood Virtual Lab',
    objective: 'Demonstrate the effect of a SYN Flood attack on network availability.',
    disclaimer: 'All numbers are simulated educational estimates, not real benchmarks.',
    guidelines: [TODO, TODO, TODO, TODO, TODO, TODO, TODO, TODO, TODO],
    theory: {
      tcp: TODO,
      handshake: [{ name: 'SYN', text: TODO }, { name: 'SYN-ACK', text: TODO }, { name: 'ACK', text: TODO }],
      synFlood: TODO,
      availability: TODO,
      analogy: TODO
    },
    components: { client: item(), generator: item(), server: item(), queue: item(), status: item() },
    steps: steps,
    serverStates: { 'Healthy': TODO, 'Under Pressure': TODO, 'Degraded': TODO, 'Unavailable': TODO },
    mitigations: { synCookies: mitigation(), rateLimit: mitigation(), shortTimeout: mitigation(), firewall: mitigation() },
    quiz: quiz,
    completion: { title: 'Experiment Completed Successfully!', message: TODO }
  };
})(window.Lab);

/* ===== js/icons.js ===== */
/* ==========================================================================
   icons.js — OWNER: Sanika Lobo
   Purpose: inline SVG icon strings (Lab.Icons, CONTRACT §5.7). 24x24 viewBox,
   stroke="currentColor". STUB: empty strings; visuals.js falls back to a
   labelled rounded rect when an icon is empty. Replace with real icons (SL1).
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  Lab.Icons = { client: '', generator: '', server: '', queue: '', status: '', shield: '' };
})(window.Lab);

/* ===== js/engine.js ===== */
/* ==========================================================================
   engine.js — OWNER: Manvith Karkera
   Purpose: the simulation model (Lab.Engine, CONTRACT §5.2-5.4).
   STUB: exposes the full API as inert no-ops. Replace with the real engine (MK1).
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  function emptyState() {
    return {
      t: 0, running: false, mode: 'idle', level: null, params: {},
      mitigation: { synCookies: false, rateLimit: false, shortTimeout: false, firewall: false },
      queue: { capacity: 100, legit: 0, attack: 0 },
      metrics: {
        synIncoming: 0, synTotal: 0, pending: 0, legitAttempted: 0, legitCompleted: 0,
        rejected: 0, timedOut: 0, filtered: 0, queueUtil: 0, cpu: 0, responseTimeMs: 40, availability: 100
      },
      serverState: 'Healthy', history: []
    };
  }

  function create(overrides) {
    var state = emptyState();
    var handlers = {};
    return {
      runBaseline: function () {},
      runAttack: function (level) {},
      stop: function () {},
      reset: function () { state = emptyState(); },
      setMitigation: function (m) {},
      isRunning: function () { return false; },
      getState: function () { return JSON.parse(JSON.stringify(state)); },
      getSummary: function () { return null; },
      on: function (name, handler) {
        (handlers[name] = handlers[name] || []).push(handler);
        return function () {
          handlers[name] = (handlers[name] || []).filter(function (h) { return h !== handler; });
        };
      }
    };
  }

  Lab.Engine = { create: create };
})(window.Lab);

/* ===== js/visuals.js ===== */
/* ==========================================================================
   visuals.js — OWNER: Pranav Koradiya
   Purpose: topology, packet animation, queue grid, handshake demo
   (Lab.Visuals, CONTRACT §5.8). STUB: no-ops. Replace with the real module (PK1).
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  Lab.Visuals = {
    init: function (engine) {},
    playHandshakeDemo: function () {},
    reset: function () {}
  };
})(window.Lab);

/* ===== js/dashboard.js ===== */
/* ==========================================================================
   dashboard.js — OWNER: Pranav Koradiya
   Purpose: metric cards, server badge, chart, log, comparison table
   (Lab.Dashboard and Lab.Log, CONTRACT §5.8). STUB: no-ops. Replace (PK2).
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  Lab.Dashboard = {
    init: function (engine) {},
    notify: function (message, level) {},
    renderComparison: function (runs) {},
    reset: function () {}
  };

  Lab.Log = {
    add: function (message, level) {},
    clear: function () {}
  };
})(window.Lab);

/* ===== js/quiz.js ===== */
/* ==========================================================================
   quiz.js — OWNER: Manvith Karkera
   Purpose: quiz rendering and scoring (Lab.Quiz, CONTRACT §5.8).
   STUB: no-ops. Replace with the real module (MK2).
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  Lab.Quiz = {
    init: function (containerEl, questions, onFinished) {},
    reset: function () {}
  };
})(window.Lab);

/* ===== js/workflow.js ===== */
/* ==========================================================================
   workflow.js — OWNER: Manvith Karkera
   Purpose: boots the app, step state machine, button wiring, reset,
   completion popup. The ONLY file that runs code on DOMContentLoaded and the
   only one that wires buttons. Loads last.
   STUB: boots without errors and does nothing yet. Replace (MK2).
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  function boot() {
    // TODO (MK2): create the engine, init modules, render content, wire buttons.
  }

  document.addEventListener('DOMContentLoaded', boot);
})(window.Lab);
