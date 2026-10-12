/* ===== js/content.js ===== */
/* ==========================================================================
   content.js — OWNER: Meet Mangaonkar
   Purpose: all student-facing text and the quiz (Lab.Content, CONTRACT §5.7).
   A complete first draft: please fact-check, tighten the wording, and replace
   the nine guidelines with the exact wording from the professor's brief.
   Conventions: "simulated" is used consistently; nothing here claims a real
   attack happens. Plain text only (workflow.js inserts it with textContent).
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  Lab.Content = {
    title: 'SYN Flood Virtual Lab',

    objective: 'Demonstrate the effect of a SYN Flood attack on network availability.',

    disclaimer: 'Everything in this lab is simulated inside your browser. All numbers are educational estimates, not real benchmarks, and no network traffic is sent.',

    // TODO (Meet): replace with the nine "Before You Begin" instructions from the brief.
    guidelines: [
      'This lab is a browser-only simulation. No real network traffic is created and nothing leaves your computer.',
      'All numbers you see are simulated educational estimates, not measurements of a real system.',
      'Work through the eight steps in order. A step unlocks when you finish the one before it.',
      'Read the theory first. You can reopen it at any time with the Theory button in the header.',
      'Always run the baseline before the attack, so you have a healthy server to compare against.',
      'Use Stop to halt a simulation immediately. Your results stay on screen so you can study them.',
      'Change the defences only while no simulation is running.',
      'Use Reset to start the experiment again. If you already have results, you will be asked to confirm.',
      'Use what you learn to defend systems. Never send flood traffic to a network you do not own or have written permission to test.'
    ],

    theory: {
      tcp: 'The Transmission Control Protocol (TCP) is how most of the internet delivers data reliably: web pages, email and file transfers all use it. Before any data moves, the two computers must agree to talk, and TCP does this with a short exchange called the three-way handshake. The computer that starts the conversation is the client. The computer that waits for connections is the server. A server can only keep track of a limited number of connections at once, so each new connection uses a small piece of its memory.',

      handshake: [
        {
          name: 'SYN',
          text: 'The client sends a SYN ("synchronise") message to say: "I would like to open a connection." The server notes the request and sets aside a small amount of memory to remember it.'
        },
        {
          name: 'SYN-ACK',
          text: 'The server replies with a SYN-ACK ("synchronise-acknowledge"): "I received your request, and I am ready." At this point the connection is half-open, because the server is waiting for the client to answer.'
        },
        {
          name: 'ACK',
          text: 'The client sends a final ACK ("acknowledge"): "Got it, let us begin." The connection is now fully established, the server frees the waiting slot, and data can flow.'
        }
      ],

      synFlood: 'In a SYN flood, an attacker sends a huge number of SYN messages but never sends the final ACK. Often the source addresses are spoofed, meaning they are fake, so the server\'s SYN-ACK replies go nowhere. Each unanswered request stays in the server\'s backlog queue as a half-open connection for about 30 seconds before it times out. When the queue is full, the server has no room left and must turn new connections away, including real ones. The attacker does not need to break in or steal anything; filling the queue is enough.',

      availability: 'Availability means that the people who should be able to use a service can use it when they need to. A SYN flood is a denial-of-service attack because it targets availability: the server is still running, but real customers cannot get through. In this lab we measure availability as the percentage of legitimate connection attempts that succeed over the last five simulated seconds. We also watch the queue, the processor load and the response time, which usually get worse before availability collapses.',

      analogy: 'Imagine a pizza shop with a counter that holds 100 orders. Pranksters phone in hundreds of orders with fake names and never come to collect them. The shop keeps each pizza on the counter for half a minute, just in case. Soon the counter is full of orders nobody will pick up, and real customers who walk in are told to come back later. The shop is working perfectly well, but it cannot serve the people it exists for. The counter is the TCP queue, the prank orders are half-open connections, and the turned-away customers are the lost availability.'
    },

    components: {
      client: {
        title: 'Legitimate Client',
        text: 'A normal user whose browser opens connections to the server. Every connection it starts completes the full handshake, so its slot is freed after about one second.'
      },
      generator: {
        title: 'Simulated Traffic Generator',
        text: 'Produces the simulated attack traffic. It sends SYN messages at the rate you choose, and most of them never send the final ACK. No real packets are sent.'
      },
      server: {
        title: 'Target Server',
        text: 'The simulated server that accepts connections. It keeps one slot in its queue for every half-open connection, and its CPU and response time depend on how busy that queue is.'
      },
      queue: {
        title: 'TCP Connection Queue',
        text: 'The backlog of half-open connections waiting for their final ACK. It has 100 slots. Green slots belong to legitimate clients and red slots to the attack. When it is full, new connections are rejected.'
      },
      status: {
        title: 'Network Status Indicator',
        text: 'Summarises the health of the service as Healthy, Under Pressure, Degraded or Unavailable, based on availability, queue use and CPU load.'
      }
    },

    steps: [
      {
        id: 1,
        title: 'Review the lab',
        instructions: 'Read the theory above and press Replay handshake to watch SYN, SYN-ACK and ACK happen. Click each part of the network diagram to see what it does. When you are ready, press Continue.'
      },
      {
        id: 2,
        title: 'Generate baseline traffic',
        instructions: 'Press Generate Baseline Traffic. Watch legitimate clients complete handshakes and notice that the server stays Healthy and the queue stays almost empty. The baseline runs for 20 simulated seconds and is saved for the comparison later.'
      },
      {
        id: 3,
        title: 'Launch the SYN flood',
        instructions: 'Choose an attack level (Low, Medium or High) and press Start SYN Flood. The traffic generator now sends SYN messages that never complete. Try the levels in turn if you like: each run replaces the previous attack.'
      },
      {
        id: 4,
        title: 'Observe the impact',
        instructions: 'Watch the queue fill with red attack slots. Follow the dashboard: pending connections, CPU and response time rise, then availability falls. Note the moment the server becomes Degraded or Unavailable, and check the log for what happened.'
      },
      {
        id: 5,
        title: 'Stop the attack',
        instructions: 'Press Stop whenever you have seen enough, or let the run finish after 40 simulated seconds. The simulation halts at once and every number stays on screen so you can study it.'
      },
      {
        id: 6,
        title: 'Enable mitigation',
        instructions: 'Switch on one or more defences, then press Run With Mitigation. The same attack level is replayed against the protected server. Read each defence\'s explanation and its limitation as you decide.'
      },
      {
        id: 7,
        title: 'Compare the results',
        instructions: 'Study the comparison table and the explanation under it. Which numbers improved most with your defences, and which stayed bad? When you have finished, press Continue.'
      },
      {
        id: 8,
        title: 'Test your knowledge',
        instructions: 'Answer the six quiz questions. You get feedback after each answer. Finish the quiz to complete the experiment.'
      }
    ],

    serverStates: {
      'Healthy': 'Almost every legitimate connection succeeds and the queue has plenty of room.',
      'Under Pressure': 'The queue or the CPU is getting busy. Service still works, but it has little spare capacity.',
      'Degraded': 'Many legitimate users are failing to connect, or the queue is nearly full. Responses are slow.',
      'Unavailable': 'Almost no legitimate user can connect. The attack has taken the service offline.'
    },

    mitigations: {
      synCookies: {
        title: 'SYN cookies',
        text: 'When the queue is full, the server stops keeping a slot for each new SYN. Instead it encodes the connection details into its SYN-ACK reply, and only creates a real connection if a valid ACK comes back. Genuine clients are still served, while fake ones cost no memory.',
        limitation: 'Each cookie still costs CPU and bandwidth, a few TCP options are lost, and a very large flood can still overwhelm the network link.'
      },
      rateLimit: {
        title: 'Rate limiting',
        text: 'The server or firewall accepts only a fixed number of new connections per second from the same source. Anything above the limit is dropped before it can take a slot, which caps how fast the queue can fill.',
        limitation: 'A limit that is too low also blocks genuine bursts of traffic, and an attacker who spreads the flood over many sources can stay under the limit.'
      },
      shortTimeout: {
        title: 'Shorter timeouts',
        text: 'The server waits less time for the final ACK before it gives up on a half-open connection. Slots occupied by attack traffic are freed within seconds instead of half a minute, so the queue struggles to fill.',
        limitation: 'Slow but genuine clients, for example on poor mobile networks, may be dropped too, and a faster flood simply refills the slots sooner.'
      },
      firewall: {
        title: 'Firewall filtering',
        text: 'A firewall or intrusion-prevention system blocks traffic that matches known attack patterns, such as addresses on a blocklist, before it reaches the server. In this simulation it removes most of the attack SYNs.',
        limitation: 'It cannot tell well-disguised spoofed traffic from real traffic, so some attack packets get through and some genuine ones are blocked by mistake.'
      }
    },

    quiz: [
      {
        id: 1,
        question: 'In which order are the messages of the TCP three-way handshake sent?',
        options: ['ACK, SYN, SYN-ACK', 'SYN, SYN-ACK, ACK', 'SYN, ACK, SYN-ACK', 'SYN-ACK, SYN, ACK'],
        answer: 1,
        explanation: 'The client sends SYN, the server answers with SYN-ACK, and the client finishes with ACK. Only after the final ACK is the connection established. A SYN flood abuses the gap between the second and third message.'
      },
      {
        id: 2,
        question: 'Why does a half-open connection use up server resources?',
        options: [
          'It downloads a large file to the server',
          'The server keeps a slot in its queue while it waits for the final ACK',
          'It encrypts all later traffic with a heavy algorithm',
          'It permanently blocks the client\'s address'
        ],
        answer: 1,
        explanation: 'For every SYN it accepts, the server stores state and keeps it until the handshake completes or times out. Many half-open connections therefore mean many occupied slots, even though no data was ever sent.'
      },
      {
        id: 3,
        question: 'What is the main effect of a successful SYN flood on a service?',
        options: [
          'Stored data is stolen from the server',
          'The server\'s files are encrypted and held for ransom',
          'Legitimate users can no longer connect, so availability falls',
          'The server\'s clock is changed'
        ],
        answer: 2,
        explanation: 'A SYN flood is a denial-of-service attack. It does not need to steal or change data. It only has to fill the connection queue so that genuine users are turned away, which is a loss of availability.'
      },
      {
        id: 4,
        question: 'How does attack traffic differ from legitimate traffic in this lab?',
        options: [
          'Attack clients send SYN messages but most never send the final ACK',
          'Attack traffic uses a different protocol from TCP',
          'Attack traffic is always much slower than legitimate traffic',
          'Legitimate clients never send a SYN message'
        ],
        answer: 0,
        explanation: 'Both kinds of traffic start with a SYN. Legitimate clients complete the handshake, so their slot is freed after about a second. Attack traffic leaves most connections half-open, so their slots stay occupied until the timeout.'
      },
      {
        id: 5,
        question: 'What problem do SYN cookies solve?',
        options: [
          'They make the SYN-ACK message encrypted',
          'They stop the attacker from ever sending a SYN',
          'They let the server answer SYNs without keeping a queue slot for each one',
          'They shorten the handshake to two messages'
        ],
        answer: 2,
        explanation: 'With SYN cookies the server stores no state at first. It hides the needed details in the SYN-ACK, so a full queue no longer blocks genuine clients. The attacker can still send SYNs, and each cookie still costs some CPU.'
      },
      {
        id: 6,
        question: 'Why can no single defence fully prevent denial-of-service attacks?',
        options: [
          'Defences only work when the server is switched off',
          'Each defence has limits, and attackers can adapt, spread their traffic or add more of it',
          'Denial-of-service attacks always use stolen passwords',
          'Defences are only available for UDP traffic'
        ],
        answer: 1,
        explanation: 'Every defence trades something off: cookies cost CPU, rate limits can block real bursts, shorter timeouts can drop slow clients, and firewalls miss disguised traffic. Real systems layer several defences and still have to plan for incidents.'
      }
    ],

    completion: {
      title: 'Experiment Completed Successfully!',
      message: 'You generated a baseline, launched a simulated SYN flood, watched the queue fill and the service fail, and measured how defences help. The key lesson: a SYN flood does not break into a server, it simply uses up a limited resource, and defence in depth is the best protection.'
    }
  };
})(window.Lab);

/* ===== js/icons.js ===== */
/* ==========================================================================
   icons.js — OWNER: Sanika Lobo
   Purpose: inline SVG icon strings (Lab.Icons, CONTRACT §5.7).
   Six matching line icons: 24x24 viewBox, stroke="currentColor", 1.75 stroke,
   round caps and joins, aria-hidden, no external references.
   A complete first draft: feel free to redraw in Figma and replace the paths.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
             'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var CLOSE = '</svg>';
  function icon(body) { return OPEN + body + CLOSE; }

  Lab.Icons = {
    // laptop
    client: icon(
      '<rect x="4" y="5" width="16" height="11" rx="1.5"/>' +
      '<path d="M2 19h20"/>' +
      '<path d="M9 19l.5-3h5l.5 3"/>'
    ),

    // a box emitting arrows (traffic generator)
    generator: icon(
      '<rect x="3" y="8" width="9" height="9" rx="1.5"/>' +
      '<path d="M15 9h6"/><path d="M18.5 6.5L21 9l-2.5 2.5"/>' +
      '<path d="M15 14h6"/><path d="M18.5 11.5L21 14l-2.5 2.5"/>' +
      '<path d="M15 19h6"/><path d="M18.5 16.5L21 19l-2.5 2.5"/>'
    ),

    // rack server
    server: icon(
      '<rect x="3" y="4" width="18" height="6" rx="1.5"/>' +
      '<rect x="3" y="14" width="18" height="6" rx="1.5"/>' +
      '<path d="M7 7h.01"/><path d="M7 17h.01"/>' +
      '<path d="M12 7h6"/><path d="M12 17h6"/>'
    ),

    // stacked slots / inbox
    queue: icon(
      '<rect x="4" y="3.5" width="16" height="4" rx="1"/>' +
      '<rect x="4" y="10" width="16" height="4" rx="1"/>' +
      '<rect x="4" y="16.5" width="16" height="4" rx="1"/>' +
      '<path d="M8 5.5h5"/><path d="M8 12h5"/>'
    ),

    // signal / pulse
    status: icon(
      '<path d="M2 12h4l2.5-6 4 12 3-9 1.5 3H22"/>'
    ),

    // shield with a check (defence)
    shield: icon(
      '<path d="M12 3l7.5 2.7v5.6c0 4.4-3.1 8.2-7.5 9.7-4.4-1.5-7.5-5.3-7.5-9.7V5.7L12 3z"/>' +
      '<path d="M8.6 12l2.4 2.4 4.4-4.8"/>'
    )
  };
})(window.Lab);

/* ===== js/engine.js ===== */
/* ==========================================================================
   engine.js — OWNER: Manvith Karkera
   Purpose: the simulation model (Lab.Engine, CONTRACT §5.2-5.4).

   The server becomes unavailable BECAUSE the simulated half-open queue fills,
   never because code sets a label: every second ("tick") the engine moves real
   connection records through a queue and derives all metrics from it.

   Per tick, in this order (the cause-and-effect chain from CONTRACT §5.4):
     1. expire half-open entries whose timeout has passed
     2. generate arrivals (legitimate + attack) with the seeded PRNG
     3. apply the firewall, then the rate limit
     4. each surviving SYN takes a free slot; if the queue is full it becomes a
        stateless SYN cookie (when enabled) or is rejected
     5. legitimate handshakes that have run for 1 s complete and free their slot
     6. recompute metrics from the queue, derive the server state, emit events

   Everything numeric lives in DEFAULTS below. All numbers are simulated
   educational estimates, not benchmarks.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  // ---- tunable constants ---------------------------------------------------
  var DEFAULTS = {
    tickMs: 500,               // real time per tick; one tick = 1 simulated second
    seed: 1337,                // mulberry32 seed: same settings => same result
    capacity: 100,             // half-open slots. More capacity = a longer fight before the queue is full
    legitRate: 5,              // legitimate SYN/s
    legitHandshakeSec: 1,      // a legit client completes its handshake after 1 s, then frees its slot
    legitRetries: 1,           // a legit SYN rejected because the queue is full is retransmitted once (as real TCP does)
    retryDelaySec: 1,          //   after this many seconds. More retries = a flood hurts legit users less
    timeoutSec: 30,            // how long a half-open entry waits for the final ACK. Longer = attack slots stay occupied longer
    shortTimeoutSec: 5,        // "Shorter timeouts" defence: attack entries are dropped much sooner
    timeoutJitter: 0.5,        // timeouts vary +/-50% around timeoutSec (retransmit back-off, client differences), so expiries are spread out
    levels: {                  // attack strength: SYN/s and the share that NEVER sends the final ACK
      low:    { rate: 4,  incompleteFrac: 0.5 },
      medium: { rate: 15, incompleteFrac: 0.8 },
      high:   { rate: 50, incompleteFrac: 0.95 }
    },
    rateLimitPerSec: 8,        // rate limiting: at most this many generator SYNs/s are accepted, the rest are 'filtered'
    firewallAttackDrop: 0.7,   // firewall: share of attack SYNs dropped. Higher = fewer slots wasted
    firewallLegitDrop: 0.02,   // firewall: legitimate SYNs wrongly dropped (a defence is never free)
    cpuBase: 8,                // cpu = min(100, base + perPending*pending + perSyn*synIncoming + perCookie*cookies)
    cpuPerPending: 0.5,        // every half-open entry costs memory and bookkeeping
    cpuPerSyn: 0.3,            // every arriving SYN costs processing
    cpuPerCookie: 0.4,         // SYN cookies avoid slots but cost extra hashing
    respBaseMs: 40,            // response time = base + queue term + overload term
    respQueueMs: 1500,         //   queue term: respQueueMs * (queueUtil/100)^3  (grows sharply near full)
    respCpuMsPerPct: 6,        //   overload term: ms per cpu% above the knee
    cpuKnee: 60,
    availabilityWindow: 5,     // availability = legit success over the last N simulated seconds
    baselineSeconds: 20,
    attackSeconds: 40
  };

  var MITIGATION_KEYS = ['synCookies', 'rateLimit', 'shortTimeout', 'firewall'];
  var MITIGATION_LABELS = {
    synCookies: 'SYN cookies', rateLimit: 'rate limiting', shortTimeout: 'shorter timeouts', firewall: 'firewall filtering'
  };
  var MAX_PACKETS_PER_TICK = 12;
  var MAX_LEGIT_PACKETS = 4;       // keep the animation readable: legit traffic is never drowned out

  // ---- helpers -------------------------------------------------------------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function round1(n) { return Math.round(n * 10) / 10; }

  function mergeParams(overrides) {
    var p = clone(DEFAULTS);
    if (overrides) {
      Object.keys(overrides).forEach(function (k) {
        if (k === 'levels' && overrides.levels) {
          Object.keys(overrides.levels).forEach(function (l) { p.levels[l] = Object.assign({}, p.levels[l], overrides.levels[l]); });
        } else {
          p[k] = overrides[k];
        }
      });
    }
    return p;
  }

  function deriveServerState(m) {
    if (m.availability < 15) return 'Unavailable';
    if (m.availability < 70 || m.queueUtil > 95) return 'Degraded';
    if (m.availability < 95 || m.queueUtil >= 60 || m.cpu >= 70) return 'Under Pressure';
    return 'Healthy';
  }

  function create(overrides) {
    var params = mergeParams(overrides);
    var handlers = {};
    var timer = null;
    var rng = mulberry32(params.seed);
    var state, summary = null;

    // per-run bookkeeping (not part of State)
    var entries, retries, cohortAttempted, cohortOk, nextId, nextPacketId;
    var crossed, firstLegitRejected, effects, duration;

    function freshState() {
      return {
        t: 0, running: false, mode: 'idle', level: null,
        params: clone(params),
        mitigation: { synCookies: false, rateLimit: false, shortTimeout: false, firewall: false },
        queue: { capacity: params.capacity, legit: 0, attack: 0 },
        metrics: {
          synIncoming: 0, synTotal: 0, pending: 0,
          legitAttempted: 0, legitCompleted: 0,
          rejected: 0, timedOut: 0, filtered: 0,
          queueUtil: 0, cpu: 0, responseTimeMs: params.respBaseMs, availability: 100
        },
        serverState: 'Healthy',
        history: []
      };
    }

    function resetRunData() {
      entries = []; retries = []; cohortAttempted = {}; cohortOk = {}; nextId = 1; nextPacketId = 1;
      crossed = { 50: false, 90: false, 100: false };
      firstLegitRejected = false;
      effects = { cookies: 0, firewall: 0, rateLimit: 0, shortTimeout: 0 };
    }

    state = freshState();
    resetRunData();

    // ---- events ------------------------------------------------------------
    function emit(name, payload) {
      (handlers[name] || []).slice().forEach(function (h) {
        try { h(payload); } catch (e) { if (window.console) console.error('[Lab.Engine] handler for "' + name + '" threw:', e); }
      });
    }
    function log(level, message) { emit('log', { t: state.t, level: level, message: message }); }

    // ---- one simulated second ----------------------------------------------
    function step() {
      var m = state.metrics;
      var mit = state.mitigation;
      var t = ++state.t;
      var packets = { legit: [], attack: [] };   // candidates for animation

      // 1. expire timed-out half-open entries
      var kept = [], expired = 0;
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.expiresAt !== null && e.expiresAt <= t) {
          expired++;
          if (packets.attack.length < 40) packets.attack.push({ type: 'rst', source: e.source, outcome: 'timeout' });
        } else {
          kept.push(e);
        }
      }
      entries = kept;
      m.timedOut += expired;
      if (mit.shortTimeout) effects.shortTimeout += expired;

      // 2. generate arrivals (random order, so legit and attack SYNs compete for free slots fairly)
      var arrivals = [];
      var lvl = state.mode === 'attack' ? params.levels[state.level] : null;
      var legitCount = params.legitRate;
      for (i = 0; i < legitCount; i++) arrivals.push({ source: 'legit', cohort: t, retriesLeft: params.legitRetries });
      var due = [];
      retries = retries.filter(function (r) { if (r.due <= t) { due.push(r); return false; } return true; });
      due.forEach(function (r) { arrivals.push({ source: 'legit', cohort: r.cohort, retriesLeft: r.left }); });   // retransmitted SYNs
      if (lvl) for (i = 0; i < lvl.rate; i++) arrivals.push({ source: 'attack', incomplete: rng() < lvl.incompleteFrac });
      for (i = arrivals.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = arrivals[i]; arrivals[i] = arrivals[j]; arrivals[j] = tmp;
      }
      m.synIncoming = arrivals.length;
      m.synTotal += arrivals.length;
      m.legitAttempted += legitCount;                       // retries are not new attempts
      cohortAttempted[t] = legitCount;
      cohortOk[t] = 0;

      // 3 + 4. firewall, rate limit, then slot / cookie / reject
      var attackAccepted = 0, cookiesThisSecond = 0;
      for (i = 0; i < arrivals.length; i++) {
        var a = arrivals[i];
        var isAttack = a.source === 'attack';
        var outcome;

        if (mit.firewall && rng() < (isAttack ? params.firewallAttackDrop : params.firewallLegitDrop)) {
          outcome = 'filtered';
          if (isAttack) effects.firewall++;
        } else if (isAttack && mit.rateLimit && attackAccepted >= params.rateLimitPerSec) {
          outcome = 'filtered';
          effects.rateLimit++;
        } else {
          if (isAttack) attackAccepted++;
          if (entries.length < params.capacity) {
            var timeout = mit.shortTimeout ? params.shortTimeoutSec : params.timeoutSec;
            var spread = 1 + params.timeoutJitter * (rng() * 2 - 1);
            var entry = { id: nextId++, source: a.source, createdAt: t, expiresAt: null, completesAt: null, cohort: a.cohort };
            if (isAttack && a.incomplete) entry.expiresAt = t + Math.max(1, Math.round(timeout * spread));
            else entry.completesAt = t + params.legitHandshakeSec;
            entries.push(entry);
            outcome = 'queued';
          } else if (mit.synCookies) {
            // queue full: a stateless SYN-ACK costs CPU but no slot. Legit clients still finish the handshake.
            outcome = 'cookie';
            cookiesThisSecond++;
            effects.cookies++;
            if (!isAttack) { m.legitCompleted++; cohortOk[a.cohort]++; }
          } else {
            outcome = 'rejected';
            if (!isAttack && a.retriesLeft > 0) retries.push({ cohort: a.cohort, due: t + params.retryDelaySec, left: a.retriesLeft - 1 });
            if (!isAttack && !firstLegitRejected) {
              firstLegitRejected = true;
              log('danger', 'The queue is full: the first legitimate connection was just rejected');
            }
          }
        }

        if (outcome === 'filtered') m.filtered++;
        if (outcome === 'rejected') m.rejected++;
        // animation candidates: all attack SYNs, plus every legit SYN that did not simply queue
        if (isAttack) packets.attack.push({ type: 'syn', source: 'attack', outcome: outcome });
        else if (outcome !== 'queued') packets.legit.push({ type: 'syn', source: 'legit', outcome: outcome });
      }

      // 5. handshakes that have run long enough complete and free their slots
      kept = [];
      for (i = 0; i < entries.length; i++) {
        var en = entries[i];
        if (en.completesAt !== null && en.completesAt <= t) {
          if (en.source === 'legit') {
            m.legitCompleted++;
            cohortOk[en.cohort]++;
            packets.legit.push({ type: 'ack', source: 'legit', outcome: 'completed' });
          }
        } else {
          kept.push(en);
        }
      }
      entries = kept;

      // 6. metrics from the queue
      var legitIn = 0, attackIn = 0;
      for (i = 0; i < entries.length; i++) { if (entries[i].source === 'legit') legitIn++; else attackIn++; }
      state.queue.legit = legitIn;
      state.queue.attack = attackIn;
      m.pending = entries.length;
      m.queueUtil = round1(m.pending / params.capacity * 100);
      m.cpu = round1(Math.min(100, params.cpuBase + params.cpuPerPending * m.pending +
        params.cpuPerSyn * m.synIncoming + params.cpuPerCookie * cookiesThisSecond));
      m.responseTimeMs = Math.round(params.respBaseMs + params.respQueueMs * Math.pow(m.queueUtil / 100, 3) +
        params.respCpuMsPerPct * Math.max(0, m.cpu - params.cpuKnee));

      // availability: only fully resolved seconds count. A legit SYN may be retried once and then needs 1 s to
      // finish its handshake, so the window ends 2 s ago: [t-window-1 .. t-2].
      var att = 0, ok = 0;
      for (var w = t - params.availabilityWindow - 1; w <= t - 2; w++) {
        if (cohortAttempted[w]) { att += cohortAttempted[w]; ok += cohortOk[w]; }
      }
      m.availability = att === 0 ? 100 : round1(ok / att * 100);

      var from = state.serverState;
      state.serverState = deriveServerState(m);

      state.history.push({
        t: t, pending: m.pending, queueUtil: m.queueUtil, cpu: m.cpu,
        responseTimeMs: m.responseTimeMs, availability: m.availability
      });

      // events
      if (from !== state.serverState) {
        emit('serverStateChange', { from: from, to: state.serverState, t: t });
        log(state.serverState === 'Healthy' ? 'success' : (state.serverState === 'Unavailable' ? 'danger' : 'warn'),
          'Server state changed: ' + from + ' → ' + state.serverState);
      }
      [50, 90, 100].forEach(function (lvlPct) {
        var reached = lvlPct === 100 ? m.pending >= params.capacity : m.queueUtil >= lvlPct;
        if (reached && !crossed[lvlPct]) {
          crossed[lvlPct] = true;
          log(lvlPct === 100 ? 'danger' : 'warn', lvlPct === 100
            ? 'The connection queue is full (' + params.capacity + '/' + params.capacity + ')'
            : 'The connection queue passed ' + lvlPct + '% (' + m.pending + '/' + params.capacity + ')');
        }
      });
      if (t % 10 === 0) flushEffects();
      emitPackets(packets);
      emit('tick', clone(state));

      if (t >= duration) { finish(false); return false; }
      return true;
    }

    // Aggregate mitigation effects into occasional log lines (never a fixed script).
    function flushEffects() {
      if (effects.cookies) log('success', 'SYN cookies answered ' + effects.cookies + ' SYNs without using queue slots');
      if (effects.firewall) log('info', 'The firewall dropped ' + effects.firewall + ' attack SYNs before they reached the queue');
      if (effects.rateLimit) log('info', 'Rate limiting filtered ' + effects.rateLimit + ' excess SYNs from the traffic generator');
      if (effects.shortTimeout) log('info', 'Shorter timeouts freed ' + effects.shortTimeout + ' half-open slots early');
      effects = { cookies: 0, firewall: 0, rateLimit: 0, shortTimeout: 0 };
    }

    // At most 12 packets per tick, sampled between legit and attack so the animation never floods.
    function emitPackets(packets) {
      function pick(list, n) {
        var copy = list.slice(), out = [];
        while (copy.length && out.length < n) out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
        return out;
      }
      var legit = pick(packets.legit, MAX_LEGIT_PACKETS);
      var attack = pick(packets.attack, MAX_PACKETS_PER_TICK - legit.length);
      legit.concat(attack).forEach(function (p) {
        emit('packet', { id: nextPacketId++, type: p.type, source: p.source, outcome: p.outcome });
      });
    }

    // ---- run lifecycle -----------------------------------------------------
    function begin(mode, level, seconds, useTimer) {
      if (state.running) return false;                       // never two runs, never two timers
      var mitigation = state.mitigation;
      state = freshState();
      state.mitigation = mitigation;
      state.running = true;
      state.mode = mode;
      state.level = level;
      rng = mulberry32(params.seed);                        // same settings => identical numbers on every run
      resetRunData();
      duration = seconds;
      summary = null;

      var enabled = MITIGATION_KEYS.filter(function (k) { return mitigation[k]; }).map(function (k) { return MITIGATION_LABELS[k]; });
      var defence = enabled.length ? ' Defences on: ' + enabled.join(', ') + '.' : ' No defences enabled.';
      if (mode === 'baseline') {
        log('info', 'Baseline traffic started: ' + params.legitRate + ' legitimate SYN/s (simulated).' + defence);
      } else {
        var l = params.levels[level];
        log('warn', 'SYN flood started at ' + level + ' level: ' + l.rate + ' SYN/s, ' + Math.round(l.incompleteFrac * 100) +
          '% never complete (simulated).' + defence);
      }
      clearInterval(timer);
      timer = null;
      if (useTimer) timer = setInterval(step, params.tickMs);
      return true;
    }

    function finish(stoppedEarly) {
      clearInterval(timer);
      timer = null;
      if (!state.running) return;
      state.running = false;

      // handshakes already in flight finish rather than being cut off mid-way
      var m = state.metrics;
      entries.forEach(function (en) {
        if (en.source === 'legit' && en.completesAt !== null && en.completesAt <= state.t + params.legitHandshakeSec) {
          m.legitCompleted++;
          cohortOk[en.cohort]++;
          en.completesAt = state.t;
        }
      });
      flushEffects();

      var h = state.history, n = h.length;
      var sum = function (k) { return h.reduce(function (acc, r) { return acc + r[k]; }, 0); };
      summary = {
        mode: state.mode, level: state.level, mitigation: clone(state.mitigation),
        duration: state.t,
        peakPending: h.reduce(function (a, r) { return Math.max(a, r.pending); }, 0),
        avgQueueUtil: n ? round1(sum('queueUtil') / n) : 0,
        peakCpu: h.reduce(function (a, r) { return Math.max(a, r.cpu); }, 0),
        avgResponseTimeMs: n ? Math.round(sum('responseTimeMs') / n) : params.respBaseMs,
        legitSuccessRate: m.legitAttempted ? round1(m.legitCompleted / m.legitAttempted * 100) : 100,
        minAvailability: n ? h.reduce(function (a, r) { return Math.min(a, r.availability); }, 100) : 100,
        avgAvailability: n ? round1(sum('availability') / n) : 100,
        finalServerState: state.serverState,
        stoppedEarly: !!stoppedEarly
      };
      log('info', stoppedEarly
        ? 'Run stopped at t = ' + state.t + ' s. The state is kept so you can study it.'
        : 'Run finished after ' + state.t + ' simulated seconds.');
      emit('runEnded', clone(summary));
    }

    // ---- public API --------------------------------------------------------
    return {
      runBaseline: function () { begin('baseline', null, params.baselineSeconds, true); },
      runAttack: function (level) {
        if (!params.levels[level]) { if (window.console) console.warn('[Lab.Engine] unknown attack level:', level); return; }
        begin('attack', level, params.attackSeconds, true);
      },
      stop: function () { if (state.running) finish(true); },
      reset: function () {
        clearInterval(timer);
        timer = null;
        state = freshState();
        summary = null;
        rng = mulberry32(params.seed);
        resetRunData();
      },
      setMitigation: function (m) {
        if (state.running) { if (window.console) console.warn('[Lab.Engine] setMitigation ignored while a run is active'); return; }
        MITIGATION_KEYS.forEach(function (k) { if (m && typeof m[k] === 'boolean') state.mitigation[k] = m[k]; });
      },
      isRunning: function () { return state.running; },
      getState: function () { return clone(state); },
      getSummary: function () { return summary ? clone(summary) : null; },
      on: function (name, handler) {
        (handlers[name] = handlers[name] || []).push(handler);
        return function () { handlers[name] = (handlers[name] || []).filter(function (h) { return h !== handler; }); };
      },

      // test hooks (used by tests/engine.test.js): run without timers
      _beginForTests: function (mode, level) {
        return begin(mode, level, mode === 'baseline' ? params.baselineSeconds : params.attackSeconds, false);
      },
      _stepForTests: function () { return state.running ? step() : false; }
    };
  }

  Lab.Engine = { create: create, DEFAULTS: DEFAULTS };
})(window.Lab);

/* ===== js/visuals.js ===== */
/* ==========================================================================
   visuals.js — OWNER: Pranav Koradiya
   Purpose: network topology (SVG), packet animation, queue grid and the TCP
   handshake demo (Lab.Visuals, CONTRACT §5.8). Renders only: workflow.js wires
   the buttons. Uses only the engine's public API/events (CONTRACT §5.2).

   Animation logic in short:
   - Every engine 'packet' event becomes a small circle with a "plan": a list
     of legs (move to a point, take a CSS class, optionally fade out). The plan
     depends on the packet's outcome (completed / queued / rejected / filtered
     / cookie / timeout).
   - ONE shared requestAnimationFrame loop advances every packet; it stops
     itself when no packets are left. At most 60 packets exist at once (the
     oldest is dropped), nothing is spawned while the tab is hidden, and with
     prefers-reduced-motion no dots move at all (the queue grid, status node
     and dashboard still update).
   - Colours come from the CSS tokens via var(--...) presentation attributes,
     which have the lowest priority, so lab.css (Sanika) can restyle anything.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var MAX_PACKETS = 60;
  var LEG_MS = 320;       // time to travel one leg
  var FADE_MS = 360;      // time for a fading leg
  var GRID_COLS = 10;
  var SLOT = 10;
  var PITCH = 12;

  // Positions inside the 800x360 viewBox of #topology-svg.
  var NODES = {
    client:    { x: 110, y: 90,  lines: ['Legitimate', 'Client'],           cls: 'node--client' },
    generator: { x: 110, y: 270, lines: ['Simulated Traffic', 'Generator'], cls: 'node--generator' },
    server:    { x: 400, y: 180, lines: ['Target', 'Server'],               cls: 'node--server' },
    queue:     { x: 650, y: 180, lines: ['TCP Connection', 'Queue'],       cls: 'node--queue' },
    status:    { x: 400, y: 322, lines: ['Network Status'],                 cls: 'node--status' }
  };
  var QUEUE_BOX = { w: 180, h: 236 };

  // Fallback colours (var() presentation attributes lose to any stylesheet rule).
  var PACKET_FILL = {
    'packet--legit': 'var(--color-legit)', 'packet--attack': 'var(--color-attack)',
    'packet--synack': 'var(--color-pending)', 'packet--ack': 'var(--color-completed)',
    'packet--rejected': 'var(--color-rejected)', 'packet--filtered': 'var(--color-rejected)',
    'packet--cookie': 'var(--color-primary)'
  };
  var SLOT_STYLE = {
    free:   { fill: 'var(--color-surface-2)', stroke: 'var(--color-border)' },
    legit:  { fill: 'var(--color-legit)',     stroke: 'var(--color-legit)' },
    attack: { fill: 'var(--color-attack)',    stroke: 'var(--color-attack)' }
  };
  var STATE_CLASS = {
    'Healthy': 'healthy', 'Under Pressure': 'pressure', 'Degraded': 'degraded', 'Unavailable': 'unavailable'
  };
  var STATE_FILL = {
    'Healthy': 'var(--color-healthy)', 'Under Pressure': 'var(--color-pressure)',
    'Degraded': 'var(--color-degraded)', 'Unavailable': 'var(--color-unavailable)'
  };

  // ---- private state -------------------------------------------------------
  var svg = null, packetLayer = null, queueLabel = null, statusText = null, statusRect = null, statusNode = null;
  var slots = [], slotKinds = [], capacity = 100;
  var selectedKey = null;
  var nodeEls = {};
  var packets = [];
  var rafId = 0;
  var unsubs = [];
  var demo = null;        // handshake demo DOM + animation state
  var observer = null;
  var visibilityBound = false;

  // ---- helpers -------------------------------------------------------------
  function make(name, attrs, parent) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function lerp(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }

  function setClass(el, cls, fillMap) {
    el.setAttribute('class', cls);
    if (fillMap) {
      var parts = cls.split(' ');
      for (var i = 0; i < parts.length; i++) if (fillMap[parts[i]]) el.setAttribute('fill', fillMap[parts[i]]);
    }
  }

  // ---- topology ------------------------------------------------------------
  function buildNode(key, parent) {
    var def = NODES[key];
    var isQueue = key === 'queue';
    var w = isQueue ? QUEUE_BOX.w : 160;
    var h = isQueue ? QUEUE_BOX.h : 60;
    var g = make('g', {
      'class': 'node ' + def.cls, transform: 'translate(' + def.x + ',' + def.y + ')',
      tabindex: '0', role: 'button', 'aria-pressed': 'false', 'data-node': key,
      'aria-label': def.lines.join(' ')
    }, parent);
    var rect = make('rect', {
      x: -w / 2, y: -h / 2, width: w, height: h, rx: 10,
      fill: 'var(--color-surface)', stroke: 'var(--color-border)', 'stroke-width': 2
    }, g);
    rect.setAttribute('class', 'node__box');

    var icon = Lab.Icons && Lab.Icons[key === 'status' ? 'status' : key];
    var hasIcon = typeof icon === 'string' && icon.length > 0;
    var textFont = { 'font-size': 13, 'font-family': 'var(--font-sans)', fill: 'var(--color-text)' };
    var i, t;

    if (isQueue) {
      // Title + icon at the top, 10x10 slot grid in the middle, "pending / capacity" at the bottom.
      var top = -h / 2;
      if (hasIcon) placeIcon(g, icon, -10, top + 8, 20);
      for (i = 0; i < def.lines.length; i++) {
        t = make('text', textFont, g);
        t.setAttribute('text-anchor', 'middle'); t.setAttribute('x', 0);
        t.setAttribute('y', top + 46 + i * 16); t.textContent = def.lines[i];
      }
      var rows = Math.ceil(capacity / GRID_COLS);
      var gridW = GRID_COLS * PITCH - (PITCH - SLOT);
      var gx = -gridW / 2, gy = top + 72;
      var grid = make('g', { 'class': 'queue-grid' }, g);
      slots = []; slotKinds = [];
      for (i = 0; i < capacity; i++) {
        var s = make('rect', {
          x: gx + (i % GRID_COLS) * PITCH, y: gy + Math.floor(i / GRID_COLS) * PITCH,
          width: SLOT, height: SLOT, rx: 2, 'stroke-width': 1
        }, grid);
        paintSlot(s, 'free');
        slots.push(s); slotKinds.push('free');
      }
      queueLabel = make('text', textFont, g);
      queueLabel.setAttribute('text-anchor', 'middle'); queueLabel.setAttribute('x', 0);
      queueLabel.setAttribute('y', gy + rows * PITCH + 22);
      queueLabel.setAttribute('font-family', 'var(--font-mono)');
      queueLabel.textContent = '0 / ' + capacity + ' pending';
    } else {
      if (hasIcon) placeIcon(g, icon, -70, -14, 28);
      for (i = 0; i < def.lines.length; i++) {
        t = make('text', textFont, g);
        var oneLine = def.lines.length === 1;
        t.setAttribute('x', hasIcon ? -34 : 0);
        t.setAttribute('text-anchor', hasIcon ? 'start' : 'middle');
        t.setAttribute('y', oneLine ? 0 : -3 + i * 16);
        t.setAttribute('dominant-baseline', oneLine ? 'middle' : 'auto');
        t.textContent = def.lines[i];
      }
      if (key === 'status') {
        // Status node: label on top, current server state (text + colour) below it.
        statusRect = rect;
        statusNode = g;
        for (i = g.childNodes.length - 1; i >= 0; i--) {
          if (g.childNodes[i].nodeName === 'text') g.removeChild(g.childNodes[i]);
        }
        t = make('text', { 'font-size': 11, 'font-family': 'var(--font-sans)', fill: 'var(--color-muted)' }, g);
        t.setAttribute('text-anchor', 'middle'); t.setAttribute('x', 0); t.setAttribute('y', -8);
        t.textContent = 'Network Status';
        statusText = make('text', { 'font-size': 15, 'font-weight': 700, 'font-family': 'var(--font-sans)', fill: 'var(--color-text)' }, g);
        statusText.setAttribute('text-anchor', 'middle'); statusText.setAttribute('x', 0); statusText.setAttribute('y', 14);
        setStatus('Healthy');
      }
    }

    g.addEventListener('click', function () { toggleSelect(key); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggleSelect(key); }
    });
    nodeEls[key] = { g: g, rect: rect };
    return g;
  }

  // Lab.Icons values are inline SVG strings; nest each one and size it.
  function placeIcon(g, iconString, x, y, size) {
    var holder = make('g', { 'class': 'node__icon', 'color': 'var(--color-text)' }, g);
    holder.innerHTML = iconString;
    var inner = holder.firstElementChild;
    if (inner && inner.nodeName.toLowerCase() === 'svg') {
      inner.setAttribute('x', x); inner.setAttribute('y', y);
      inner.setAttribute('width', size); inner.setAttribute('height', size);
    }
  }

  function buildTopology() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    nodeEls = {};
    var linksLayer = make('g', { 'class': 'links' }, svg);
    var pairs = [['client', 'server'], ['generator', 'server'], ['server', 'queue'], ['server', 'status']];
    pairs.forEach(function (p) {
      make('line', {
        'class': 'link', x1: NODES[p[0]].x, y1: NODES[p[0]].y, x2: NODES[p[1]].x, y2: NODES[p[1]].y,
        stroke: 'var(--color-border)', 'stroke-width': 3
      }, linksLayer);
    });
    // Packets sit between the links and the nodes so they appear to emerge from / enter the nodes.
    packetLayer = make('g', { 'class': 'packets', 'aria-hidden': 'true' }, svg);
    var nodesLayer = make('g', { 'class': 'nodes' }, svg);
    ['client', 'generator', 'server', 'queue', 'status'].forEach(function (k) { buildNode(k, nodesLayer); });
  }

  function paintSlot(rect, kind) {
    rect.setAttribute('class', 'queue-slot queue-slot--' + kind);
    rect.setAttribute('fill', SLOT_STYLE[kind].fill);
    rect.setAttribute('stroke', SLOT_STYLE[kind].stroke);
  }

  function toggleSelect(key) {
    var info = document.getElementById('component-info');
    var previous = selectedKey;
    clearSelection();
    if (previous === key) return;            // clicking the selected node again deselects it
    selectedKey = key;
    var n = nodeEls[key];
    if (n) {
      n.g.classList.add('is-selected');
      n.g.setAttribute('aria-pressed', 'true');
      n.rect.setAttribute('stroke', 'var(--color-focus)');
      n.rect.setAttribute('stroke-width', 4);
    }
    var data = Lab.Content && Lab.Content.components && Lab.Content.components[key];
    if (info && data) {
      info.textContent = '';
      var title = document.createElement('strong');
      title.textContent = data.title;
      var text = document.createElement('p');
      text.textContent = data.text;
      info.appendChild(title);
      info.appendChild(text);
    }
  }

  function clearSelection() {
    if (selectedKey && nodeEls[selectedKey]) {
      var n = nodeEls[selectedKey];
      n.g.classList.remove('is-selected');
      n.g.setAttribute('aria-pressed', 'false');
      n.rect.setAttribute('stroke', 'var(--color-border)');
      n.rect.setAttribute('stroke-width', 2);
    }
    selectedKey = null;
    var info = document.getElementById('component-info');
    if (info) info.textContent = '';
  }

  function setStatus(serverState) {
    if (!statusText) return;
    statusText.textContent = serverState;
    var cls = STATE_CLASS[serverState] || 'healthy';
    statusNode.setAttribute('class', 'node node--status server-badge--' + cls);
    statusNode.setAttribute('data-state', cls);
    statusRect.setAttribute('fill', 'var(--color-surface)');
    statusRect.setAttribute('stroke', STATE_FILL[serverState] || 'var(--color-border)');
    statusRect.setAttribute('stroke-width', 4);
  }

  // ---- queue grid ----------------------------------------------------------
  function updateQueue(state) {
    if (!slots.length || !state) return;
    var legit = Math.max(0, Math.round(state.queue.legit));
    var attack = Math.max(0, Math.round(state.queue.attack));
    for (var i = 0; i < slots.length; i++) {
      var kind = i < legit ? 'legit' : (i < legit + attack ? 'attack' : 'free');
      if (slotKinds[i] !== kind) { slotKinds[i] = kind; paintSlot(slots[i], kind); }
    }
    if (queueLabel) queueLabel.textContent = state.metrics.pending + ' / ' + state.queue.capacity + ' pending';
  }

  function emptyQueue() {
    for (var i = 0; i < slots.length; i++) {
      if (slotKinds[i] !== 'free') { slotKinds[i] = 'free'; paintSlot(slots[i], 'free'); }
    }
    if (queueLabel) queueLabel.textContent = '0 / ' + capacity + ' pending';
  }

  // ---- packets -------------------------------------------------------------
  // A plan is a list of legs: { to: {x,y}, cls, dur, fade }. Each leg starts where the previous ended.
  function planFor(source, outcome) {
    var src = source === 'attack' ? NODES.generator : NODES.client;
    var srv = NODES.server;
    var base = source === 'attack' ? 'packet--attack' : 'packet--legit';
    switch (outcome) {
      case 'completed':  // SYN -> server, SYN-ACK back to the client, ACK to the server
        return { from: src, legs: [
          { to: srv, cls: base, dur: LEG_MS },
          { to: src, cls: 'packet--synack', dur: LEG_MS },
          { to: srv, cls: 'packet--ack', dur: LEG_MS }] };
      case 'queued':     // attack: SYN-ACK goes out and fades, no ACK ever returns; legit: waits in the queue
        if (source === 'attack') {
          return { from: src, legs: [
            { to: srv, cls: base, dur: LEG_MS },
            { to: lerp(srv, src, 0.7), cls: 'packet--synack', dur: FADE_MS + 200, fade: true }] };
        }
        return { from: src, legs: [{ to: srv, cls: base, dur: LEG_MS }] };
      case 'rejected':   // arrives, turns grey and bounces back
        return { from: src, legs: [
          { to: srv, cls: base, dur: LEG_MS },
          { to: lerp(srv, src, 0.35), cls: 'packet--rejected', dur: FADE_MS + 100, fade: true }] };
      case 'filtered':   // dropped on the link
        return { from: src, legs: [
          { to: lerp(src, srv, 0.5), cls: base, dur: LEG_MS },
          { to: lerp(src, srv, 0.5), cls: 'packet--filtered', dur: FADE_MS, fade: true }] };
      case 'cookie':     // stateless SYN-ACK; legit clients still complete the handshake
        return { from: src, legs: [
          { to: srv, cls: base, dur: LEG_MS },
          source === 'attack'
            ? { to: lerp(srv, src, 0.7), cls: 'packet--cookie', dur: FADE_MS + 200, fade: true }
            : { to: src, cls: 'packet--cookie', dur: LEG_MS }] };
      case 'timeout':    // a half-open entry expiring at the server
        return { from: srv, legs: [{ to: srv, cls: 'packet--rejected', dur: FADE_MS, fade: true }] };
      default:
        return { from: src, legs: [{ to: srv, cls: base, dur: LEG_MS }] };
    }
  }

  function spawnPacket(evt) {
    if (!packetLayer || !evt || document.hidden || reducedMotion()) return;
    while (packets.length >= MAX_PACKETS) removePacket(0);
    var plan = planFor(evt.source, evt.outcome);
    var dot = make('circle', { r: 6, cx: plan.from.x, cy: plan.from.y, 'class': 'packet' }, packetLayer);
    var total = 0;
    plan.legs.forEach(function (l) { total += l.dur; });
    packets.push({ el: dot, plan: plan, start: performance.now(), total: total, cls: null });
    if (!rafId) rafId = requestAnimationFrame(frame);
  }

  function removePacket(index) {
    var p = packets.splice(index, 1)[0];
    if (p && p.el.parentNode) p.el.parentNode.removeChild(p.el);
  }

  function frame(now) {
    rafId = 0;
    for (var i = packets.length - 1; i >= 0; i--) {
      var p = packets[i];
      var elapsed = now - p.start;
      if (elapsed >= p.total) { removePacket(i); continue; }
      // find the current leg
      var from = p.plan.from, acc = 0, leg = null, legStart = from;
      for (var j = 0; j < p.plan.legs.length; j++) {
        leg = p.plan.legs[j];
        if (elapsed < acc + leg.dur) break;
        acc += leg.dur; legStart = leg.to;
      }
      var progress = Math.min(1, (elapsed - acc) / leg.dur);
      var pos = lerp(legStart, leg.to, progress);
      p.el.setAttribute('cx', pos.x.toFixed(1));
      p.el.setAttribute('cy', pos.y.toFixed(1));
      var cls = 'packet ' + leg.cls;
      if (p.cls !== cls) { p.cls = cls; setClass(p.el, cls, PACKET_FILL); }
      p.el.setAttribute('opacity', leg.fade ? (1 - progress).toFixed(2) : '1');
    }
    if (packets.length) rafId = requestAnimationFrame(frame);
  }

  function clearPackets() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    while (packets.length) removePacket(0);
    if (packetLayer) while (packetLayer.firstChild) packetLayer.removeChild(packetLayer.firstChild);
  }

  // ---- handshake demo ------------------------------------------------------
  var DEMO_STEP_MS = 1700;
  var DEMO_MOVE_MS = 900;
  // The dot travels between the two node edges (x = 112 and x = 308) so it never sits on top of a label.
  var DEMO_STEPS = [
    { from: 112, to: 308, cls: 'packet--legit',  name: 'SYN' },
    { from: 308, to: 112, cls: 'packet--synack', name: 'SYN-ACK' },
    { from: 112, to: 308, cls: 'packet--ack',    name: 'ACK' }
  ];

  function ensureDemo() {
    var host = document.getElementById('handshake-demo');
    if (!host) return null;
    if (demo && demo.host === host && host.contains(demo.svg)) return demo;
    host.textContent = '';
    var s = make('svg', { viewBox: '0 0 420 176', role: 'img', 'aria-label': 'Client and server exchanging SYN, SYN-ACK and ACK' });
    s.style.width = '100%'; s.style.display = 'block';
    make('line', { x1: 112, y1: 66, x2: 308, y2: 66, stroke: 'var(--color-border)', 'stroke-width': 3, 'stroke-linecap': 'round', 'class': 'link' }, s);
    [{ x: 70, label: 'Client', icon: 'client' }, { x: 350, label: 'Server', icon: 'server' }].forEach(function (n) {
      make('rect', { x: n.x - 42, y: 26, width: 84, height: 82, rx: 12, fill: 'var(--color-surface)', stroke: 'var(--color-border)', 'stroke-width': 2, 'class': 'handshake-node' }, s);
      var iconString = Lab.Icons && Lab.Icons[n.icon];
      if (iconString) placeIcon(s, iconString, n.x - 15, 36, 30);
      var t = make('text', { x: n.x, y: 98, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 600, 'font-family': 'var(--font-sans)', fill: 'var(--color-text)' }, s);
      t.textContent = n.label;
    });
    var dot = make('circle', { r: 9, cx: 112, cy: 66, opacity: 0, 'class': 'packet' }, s);
    var tag = make('text', { x: 112, y: 46, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, 'font-family': 'var(--font-mono)', fill: 'var(--color-text)', opacity: 0 }, s);
    var done = make('text', { x: 210, y: 140, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, 'font-family': 'var(--font-sans)', fill: 'var(--color-healthy)', opacity: 0 }, s);
    done.textContent = '\u2713 Connection established';
    var caption = document.createElement('p');
    caption.setAttribute('role', 'status');
    caption.className = 'handshake-caption';
    host.appendChild(s);
    host.appendChild(caption);
    demo = { host: host, svg: s, dot: dot, tag: tag, done: done, caption: caption, raf: 0, shownStep: -1 };
    return demo;
  }

  function cancelDemo() {
    if (demo && demo.raf) { cancelAnimationFrame(demo.raf); demo.raf = 0; }
  }

  function captionFor(i) {
    var h = Lab.Content && Lab.Content.theory && Lab.Content.theory.handshake && Lab.Content.theory.handshake[i];
    return h ? h.name + ': ' + h.text : DEMO_STEPS[i].name;
  }

  function playHandshakeDemo() {
    var d = ensureDemo();
    if (!d) return;
    cancelDemo();
    d.shownStep = -1;
    d.done.setAttribute('opacity', 0);
    d.dot.setAttribute('opacity', 0);
    d.tag.setAttribute('opacity', 0);
    d.caption.textContent = '';
    var still = reducedMotion();
    var started = 0;
    function tick(now) {
      if (!started) started = now;
      var elapsed = now - started;
      var step = Math.floor(elapsed / DEMO_STEP_MS);
      if (step >= DEMO_STEPS.length) {
        d.dot.setAttribute('opacity', 0);
        d.tag.setAttribute('opacity', 0);
        d.done.setAttribute('opacity', 1);
        d.caption.textContent = 'Connection established';
        d.raf = 0;
        return;
      }
      var s = DEMO_STEPS[step];
      if (d.shownStep !== step) {
        d.shownStep = step;
        setClass(d.dot, 'packet ' + s.cls, PACKET_FILL);
        d.tag.textContent = s.name;
        d.caption.textContent = captionFor(step);
        d.dot.setAttribute('opacity', 1);
        d.tag.setAttribute('opacity', 1);
      }
      var within = elapsed - step * DEMO_STEP_MS;
      var p = still ? 1 : Math.min(1, within / DEMO_MOVE_MS);   // reduced motion: jump straight to the end
      var x = s.from + (s.to - s.from) * p;
      d.dot.setAttribute('cx', x.toFixed(1));
      d.tag.setAttribute('x', x.toFixed(1));
      d.raf = requestAnimationFrame(tick);
    }
    d.raf = requestAnimationFrame(tick);
  }

  // ---- public API ----------------------------------------------------------
  Lab.Visuals = {
    init: function (engine) {
      unsubs.forEach(function (u) { u(); });
      unsubs = [];
      clearPackets();
      selectedKey = null;
      slots = []; slotKinds = [];

      svg = document.getElementById('topology-svg');
      if (svg) {
        var initial = engine && engine.getState ? engine.getState() : null;
        capacity = (initial && initial.queue && initial.queue.capacity) || 100;
        buildTopology();
        if (initial) { updateQueue(initial); setStatus(initial.serverState); }
        if (engine && engine.on) {
          unsubs.push(engine.on('tick', function (state) { updateQueue(state); setStatus(state.serverState); }));
          unsubs.push(engine.on('packet', spawnPacket));
          unsubs.push(engine.on('serverStateChange', function (e) { setStatus(e.to); }));
        }
      }

      if (!visibilityBound) {
        visibilityBound = true;
        document.addEventListener('visibilitychange', function () { if (document.hidden) clearPackets(); });
      }

      // Draw the handshake diagram now; auto-play it once, the first time it scrolls into view.
      if (ensureDemo() && 'IntersectionObserver' in window) {
        if (observer) observer.disconnect();
        observer = new IntersectionObserver(function (entries) {
          if (entries.some(function (en) { return en.isIntersecting; })) {
            observer.disconnect();
            observer = null;
            playHandshakeDemo();
          }
        });
        observer.observe(document.getElementById('handshake-demo'));
      }
    },

    playHandshakeDemo: playHandshakeDemo,

    reset: function () {
      clearPackets();
      cancelDemo();
      if (demo) { demo.dot.setAttribute('opacity', 0); demo.tag.setAttribute('opacity', 0); demo.done.setAttribute('opacity', 0); demo.caption.textContent = ''; }
      emptyQueue();
      setStatus('Healthy');
      clearSelection();
    }
  };
})(window.Lab);

/* ===== js/dashboard.js ===== */
/* ==========================================================================
   dashboard.js — OWNER: Pranav Koradiya
   Purpose: live metric cards, server-state badge, history chart, toasts,
   experiment log and the comparison table (Lab.Dashboard and Lab.Log,
   CONTRACT §5.8). Renders only: workflow.js wires the buttons.

   Important logic:
   - Engine 'tick' stores the newest State; ONE requestAnimationFrame paint
     per frame updates the cards, badge and chart, so a tick never causes
     more than one paint no matter how many events arrive.
   - Only #notifications is aria-live; cards, badge and chart are not, so
     screen readers are not flooded every simulated second.
   - The chart uses the plain 2D canvas API, reads its colours from the CSS
     tokens (getComputedStyle) on every draw so dark mode just works, and is
     scaled by devicePixelRatio so it stays crisp on high-DPI screens.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var STATE_CLASS = {
    'Healthy': 'healthy', 'Under Pressure': 'pressure', 'Degraded': 'degraded', 'Unavailable': 'unavailable'
  };
  var LEVEL_WORD = { info: 'Info', success: 'Success', warn: 'Warning', danger: 'Danger' };
  var MITIGATION_NAMES = {
    synCookies: 'SYN cookies', rateLimit: 'rate limiting', shortTimeout: 'shorter timeouts', firewall: 'firewall filtering'
  };
  var MAX_LOG_ENTRIES = 300;
  var MAX_TOASTS = 3;
  var TOAST_MS = 6000;

  var engineRef = null;
  var unsubs = [];
  var latest = null;          // newest State from the engine
  var paintQueued = false;
  var resizeBound = false;
  var chartSize = { w: 0, h: 0, dpr: 0 };

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return Number(n).toLocaleString(); }
  function pct(n) { return fmt(Math.round(n)) + '%'; }

  function getCapacity() {
    if (latest && latest.queue) return latest.queue.capacity;
    if (engineRef) return engineRef.getState().queue.capacity;
    return 100;
  }

  // ---- metric cards --------------------------------------------------------
  function card(metric) { return document.querySelector('[data-metric="' + metric + '"]'); }

  function setCard(metric, text, barPercent) {
    var c = card(metric);
    if (!c) return;
    var value = c.querySelector('.metric__value');
    if (value) value.textContent = text;
    if (barPercent !== undefined) {
      var bar = c.querySelector('.progress__bar');
      var track = c.querySelector('.progress');
      var clamped = Math.max(0, Math.min(100, barPercent));
      if (bar) bar.style.width = clamped + '%';
      if (track) track.setAttribute('aria-valuenow', Math.round(clamped));
    }
  }

  // Give each progress track proper semantics once (not live, so it is not announced every tick).
  function initProgressSemantics() {
    var cards = document.querySelectorAll('[data-metric]');
    for (var i = 0; i < cards.length; i++) {
      var track = cards[i].querySelector('.progress');
      var label = cards[i].querySelector('.metric__label');
      if (!track) continue;
      track.setAttribute('role', 'progressbar');
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', '100');
      track.setAttribute('aria-valuenow', '0');
      if (label) track.setAttribute('aria-label', label.textContent);
    }
  }

  function renderCards(state) {
    var m = state.metrics;
    setCard('syn-incoming', fmt(m.synIncoming));
    setCard('pending', fmt(m.pending) + ' / ' + fmt(state.queue.capacity));
    setCard('completed', fmt(m.legitCompleted));
    setCard('rejected', fmt(m.rejected + m.timedOut));
    setCard('queue-util', pct(m.queueUtil), m.queueUtil);
    setCard('cpu', pct(m.cpu), m.cpu);
    setCard('response-time', fmt(Math.round(m.responseTimeMs)));
    setCard('availability', pct(m.availability), m.availability);
  }

  function renderBadge(serverState) {
    var el = $('server-state');
    if (!el) return;
    var cls = STATE_CLASS[serverState] || 'healthy';
    el.className = 'server-badge server-badge--' + cls;
    el.setAttribute('data-state', cls);
    var explanation = Lab.Content && Lab.Content.serverStates && Lab.Content.serverStates[serverState];
    el.textContent = '';
    var name = document.createElement('span');
    name.className = 'server-state__name';
    name.textContent = 'Server: ' + serverState;
    el.appendChild(name);
    if (explanation) {
      var desc = document.createElement('span');
      desc.className = 'server-state__desc';
      desc.textContent = ' — ' + explanation;
      el.appendChild(desc);
    }
  }

  // ---- paint scheduling ----------------------------------------------------
  function paintNow() {
    if (!paintQueued) return;                 // already painted by the other trigger below
    paintQueued = false;
    if (!latest) return;
    renderCards(latest);
    renderBadge(latest.serverState);
    drawChart();
  }

  // One paint per frame. requestAnimationFrame is paused in background tabs, so a short timeout is the
  // fallback: whichever fires first paints, the other finds nothing to do.
  function schedulePaint() {
    if (paintQueued) return;
    paintQueued = true;
    requestAnimationFrame(paintNow);
    setTimeout(paintNow, 100);
  }

  // ---- chart ---------------------------------------------------------------
  function cssVar(styles, name, fallback) {
    var v = styles.getPropertyValue(name);
    return v && v.trim() ? v.trim() : fallback;
  }

  function drawChart() {
    var canvas = $('chart-history');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.width = '100%';
    canvas.style.maxWidth = '100%';
    canvas.style.display = 'block';
    var dpr = window.devicePixelRatio || 1;
    var cssW = Math.max(260, Math.round(canvas.clientWidth || 800));
    var cssH = Math.max(190, Math.min(300, Math.round(cssW * 0.32)));
    if (chartSize.w !== cssW || chartSize.h !== cssH || chartSize.dpr !== dpr) {
      chartSize = { w: cssW, h: cssH, dpr: dpr };
      canvas.style.height = cssH + 'px';
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    var styles = getComputedStyle(document.documentElement);
    var cText = cssVar(styles, '--color-text', '#1b2430');
    var cMuted = cssVar(styles, '--color-muted', '#5b6675');
    var cGrid = cssVar(styles, '--color-border', '#d5dbe3');
    var cAvail = cssVar(styles, '--color-healthy', '#12804f');
    var cQueue = cssVar(styles, '--color-attack', '#c8421a');
    var font = cssVar(styles, '--font-sans', 'sans-serif');

    var history = latest && latest.history ? latest.history : [];
    var lastT = history.length ? history[history.length - 1].t : 0;
    var xMax = Math.max(20, Math.ceil(lastT / 5) * 5);
    var xStep = xMax <= 25 ? 5 : (xMax <= 60 ? 10 : 20);

    var L = 46, R = 14, T = 34, B = 40;
    var pw = cssW - L - R, ph = cssH - T - B;
    var px = function (t) { return L + (t / xMax) * pw; };
    var py = function (v) { return T + ph - (v / 100) * ph; };

    ctx.font = '12px ' + font;
    ctx.textBaseline = 'middle';

    // grid + y labels
    ctx.lineWidth = 1;
    ctx.strokeStyle = cGrid;
    ctx.fillStyle = cMuted;
    ctx.textAlign = 'right';
    for (var v = 0; v <= 100; v += 25) {
      ctx.beginPath(); ctx.moveTo(L, py(v) + 0.5); ctx.lineTo(L + pw, py(v) + 0.5); ctx.stroke();
      ctx.fillText(v + '%', L - 6, py(v));
    }
    // x labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var t = 0; t <= xMax; t += xStep) {
      ctx.beginPath(); ctx.moveTo(px(t) + 0.5, T + ph); ctx.lineTo(px(t) + 0.5, T + ph + 4); ctx.stroke();
      ctx.fillText(String(t), px(t), T + ph + 6);
    }
    var xTitle = 'Simulated seconds';

    // legend (top-left) and the "Simulated data" label (top-right, or under the axis if it will not fit)
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    var simLabel = 'Simulated data';
    // pick the longest legend wording that fits on one row (phones get the short one)
    var legends = [['Availability %', 'Queue utilisation %'], ['Availability', 'Queue util.'], ['Avail.', 'Queue']];
    var legend = legends[legends.length - 1];
    var legendW = 0;
    for (var li = 0; li < legends.length; li++) {
      legendW = 34 + ctx.measureText(legends[li][0]).width + 18 + 34 + ctx.measureText(legends[li][1]).width;
      if (L + legendW < cssW - R) { legend = legends[li]; break; }
    }
    var simFits = L + legendW + 14 + ctx.measureText(simLabel).width < cssW - R;
    var x = L;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = cAvail; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x + 28, 14); ctx.stroke();
    ctx.fillStyle = cText; ctx.fillText(legend[0], x + 34, 14);
    x += 34 + ctx.measureText(legend[0]).width + 18;
    ctx.strokeStyle = cQueue; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x + 28, 14); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = cText; ctx.fillText(legend[1], x + 34, 14);
    if (simFits) {
      ctx.textAlign = 'right'; ctx.fillStyle = cMuted;
      ctx.fillText(simLabel, cssW - R, 14);
    } else {
      xTitle += ' · ' + simLabel;
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillStyle = cMuted;
    ctx.fillText(xTitle, L + pw / 2, cssH - 2);

    // data lines
    function line(key, color, dash) {
      if (!history.length) return;
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.setLineDash(dash);
      ctx.beginPath();
      history.forEach(function (row, i) {
        if (i === 0) ctx.moveTo(px(row.t), py(row[key])); else ctx.lineTo(px(row.t), py(row[key]));
      });
      ctx.stroke();
      ctx.setLineDash([]);
      var last = history[history.length - 1];
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(px(last.t), py(last[key]), 3.5, 0, Math.PI * 2); ctx.fill();
    }
    line('queueUtil', cQueue, [6, 4]);
    line('availability', cAvail, []);

    var last = history[history.length - 1];
    canvas.setAttribute('aria-label', last
      ? 'History chart (simulated data). At ' + last.t + ' simulated seconds availability is ' + Math.round(last.availability) +
        ' percent and queue utilisation is ' + Math.round(last.queueUtil) + ' percent.'
      : 'History chart of availability and queue utilisation (simulated data). No data yet.');
  }

  function bindResize() {
    if (resizeBound) return;
    resizeBound = true;
    var redraw = function () { chartSize = { w: 0, h: 0, dpr: 0 }; requestAnimationFrame(drawChart); };
    window.addEventListener('resize', redraw);
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', redraw);
    }
    var canvas = $('chart-history');
    if (canvas && window.ResizeObserver) {
      new ResizeObserver(function () {
        if (canvas.clientWidth && Math.round(canvas.clientWidth) !== chartSize.w) requestAnimationFrame(drawChart);
      }).observe(canvas);
    }
  }

  // ---- toasts --------------------------------------------------------------
  function toastHost() {
    var host = $('toast-container');
    if (host) return host;
    host = document.createElement('div');
    host.id = 'toast-container';
    host.setAttribute('aria-hidden', 'true');   // the same text is announced through #notifications
    host.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:1000;display:flex;flex-direction:column;gap:8px;max-width:calc(100vw - 32px)';
    document.body.appendChild(host);
    return host;
  }

  function notify(message, level) {
    level = LEVEL_WORD[level] ? level : 'info';
    var live = $('notifications');
    if (live) {
      live.textContent = '';
      setTimeout(function () { live.textContent = message; }, 40);   // clear first so repeats are re-announced
    }
    var host = toastHost();
    while (host.children.length >= MAX_TOASTS) host.removeChild(host.firstChild);
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + level;
    toast.textContent = LEVEL_WORD[level] + ': ' + message;
    host.appendChild(toast);
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, TOAST_MS);
  }

  // ---- log -----------------------------------------------------------------
  function two(n) { return n < 10 ? '0' + n : String(n); }

  function addLog(message, level, simT) {
    var list = $('log-list');
    if (!list) return;
    level = LEVEL_WORD[level] ? level : 'info';
    var now = new Date();
    var li = document.createElement('li');
    li.className = 'log-entry log-entry--' + level;

    var wall = document.createElement('span');
    wall.className = 'log-entry__time';
    wall.textContent = two(now.getHours()) + ':' + two(now.getMinutes()) + ':' + two(now.getSeconds());
    var levelWord = document.createElement('span');
    levelWord.className = 'log-entry__level';
    levelWord.textContent = LEVEL_WORD[level];
    var text = document.createElement('span');
    text.className = 'log-entry__message';
    text.textContent = message;
    li.appendChild(wall);
    li.appendChild(document.createTextNode(' '));
    if (typeof simT === 'number') {
      var sim = document.createElement('span');
      sim.className = 'log-entry__sim';
      sim.textContent = '(t = ' + simT + ' s)';
      li.appendChild(sim);
      li.appendChild(document.createTextNode(' '));
    }
    li.appendChild(levelWord);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(text);

    list.insertBefore(li, list.firstChild);              // newest first
    while (list.children.length > MAX_LOG_ENTRIES) list.removeChild(list.lastChild);
  }

  Lab.Log = {
    add: function (message, level) {
      // Simulated time is shown only while a run is active.
      var t = engineRef && engineRef.isRunning() ? engineRef.getState().t : undefined;
      addLog(message, level, t);
    },
    clear: function () {
      var list = $('log-list');
      if (list) list.textContent = '';
    }
  };

  // ---- comparison ----------------------------------------------------------
  var ROWS = [
    { label: 'Pending connections (peak)', key: 'peakPending', unit: '',  lowerIsBetter: true },
    { label: 'Legitimate connection success', key: 'legitSuccessRate', unit: '%', lowerIsBetter: false },
    { label: 'Avg response time (ms)', key: 'avgResponseTimeMs', unit: '', lowerIsBetter: true },
    { label: 'Peak server resource usage (%)', key: 'peakCpu', unit: '%', lowerIsBetter: true },
    { label: 'Service availability (avg %)', key: 'avgAvailability', unit: '%', lowerIsBetter: false },
    { label: 'Final server state', key: 'finalServerState', unit: '', text: true }
  ];

  function cell(tag, text, scope) {
    var c = document.createElement(tag);
    if (scope) c.setAttribute('scope', scope);
    c.textContent = text;
    return c;
  }

  function valueText(run, row) {
    if (!run || run[row.key] === undefined || run[row.key] === null) return '—';
    return row.text ? String(run[row.key]) : fmt(Math.round(run[row.key])) + row.unit;
  }

  function renderTable(runs) {
    var table = $('compare-table');
    if (!table) return;
    table.textContent = '';
    var caption = document.createElement('caption');
    caption.className = 'visually-hidden';
    caption.textContent = 'Comparison of baseline, attack and mitigated runs (simulated data)';
    table.appendChild(caption);

    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    ['Metric', 'Baseline', 'Under attack', 'With mitigation'].forEach(function (h) { hr.appendChild(cell('th', h, 'col')); });
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    ROWS.forEach(function (row) {
      var tr = document.createElement('tr');
      tr.appendChild(cell('th', row.label, 'row'));
      tr.appendChild(cell('td', valueText(runs.baseline, row)));
      tr.appendChild(cell('td', valueText(runs.attack, row)));
      var td = cell('td', valueText(runs.mitigated, row));
      // change indicator: mitigated column relative to the attack column (numbers only)
      if (!row.text && runs.mitigated && runs.attack &&
          typeof runs.mitigated[row.key] === 'number' && typeof runs.attack[row.key] === 'number') {
        var diff = Math.round(runs.mitigated[row.key]) - Math.round(runs.attack[row.key]);
        if (diff !== 0) {
          var up = diff > 0;
          var good = row.lowerIsBetter ? !up : up;
          var span = document.createElement('span');
          span.className = 'compare-change compare-change--' + (good ? 'good' : 'bad') + ' compare-change--' + (up ? 'up' : 'down');
          span.textContent = ' ' + (up ? '▲' : '▼') + ' ' + fmt(Math.abs(diff)) + row.unit;
          var sr = document.createElement('span');
          sr.className = 'visually-hidden';
          sr.textContent = (up ? ' increase' : ' decrease') + ' of ' + fmt(Math.abs(diff)) + ' compared with the attack run, which is ' + (good ? 'better' : 'worse');
          td.appendChild(span);
          td.appendChild(sr);
        }
      }
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }

  function joinNames(list) {
    if (list.length <= 1) return list.join('');
    return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
  }

  function buildExplanation(runs) {
    var cap = getCapacity();
    var sentences = [];
    var base = runs.baseline, atk = runs.attack, mit = runs.mitigated;

    if (atk) {
      var level = atk.level ? atk.level + ' ' : '';
      var a = Math.round(atk.avgAvailability);
      if (base && Math.round(base.avgAvailability) > a) {
        sentences.push('During the ' + level + 'flood availability fell from ' + Math.round(base.avgAvailability) + '% to ' + a +
          '% because pending connections reached ' + atk.peakPending + '/' + cap + '.');
      } else {
        sentences.push('During the ' + level + 'flood average availability was ' + a + '% and pending connections peaked at ' +
          atk.peakPending + '/' + cap + '.');
      }
      sentences.push('The server finished in the ' + atk.finalServerState + ' state, with response time averaging ' +
        fmt(Math.round(atk.avgResponseTimeMs)) + ' ms.');
    } else if (base) {
      sentences.push('With normal traffic only, average availability was ' + Math.round(base.avgAvailability) +
        '% and the server finished ' + base.finalServerState + '.');
    }

    if (mit) {
      var used = Object.keys(MITIGATION_NAMES).filter(function (k) { return mit.mitigation && mit.mitigation[k]; })
        .map(function (k) { return MITIGATION_NAMES[k]; });
      var m = Math.round(mit.avgAvailability);
      var verb = atk ? (m > Math.round(atk.avgAvailability) ? 'it recovered to ' : (m < Math.round(atk.avgAvailability) ? 'it dropped to ' : 'it stayed at ')) : 'availability was ';
      sentences.push(used.length
        ? 'With ' + joinNames(used) + ' enabled, ' + verb + m + '% and pending connections peaked at ' + mit.peakPending + '.'
        : 'With no mitigation enabled, ' + verb + m + '% and pending connections peaked at ' + mit.peakPending + '.');
    }

    if (!sentences.length) return 'Run the baseline, the attack and a mitigated run to see how they compare.';
    sentences.push('No single defence fully prevents real-world denial-of-service attacks; these figures are simulated estimates.');
    return sentences.join(' ');
  }

  function renderComparison(runs) {
    runs = runs || {};
    renderTable(runs);
    var p = $('compare-explanation');
    if (p) p.textContent = buildExplanation(runs);
  }

  // ---- public API ----------------------------------------------------------
  function zeroCards() {
    setCard('syn-incoming', '0');
    setCard('pending', '0 / ' + fmt(getCapacity()));
    setCard('completed', '0');
    setCard('rejected', '0');
    setCard('queue-util', '0%', 0);
    setCard('cpu', '0%', 0);
    setCard('response-time', '40');
    setCard('availability', '100%', 100);
  }

  Lab.Dashboard = {
    init: function (engine) {
      unsubs.forEach(function (u) { u(); });
      unsubs = [];
      engineRef = engine || null;
      initProgressSemantics();
      bindResize();
      if (engine) {
        latest = engine.getState();
        unsubs.push(engine.on('tick', function (state) { latest = state; schedulePaint(); }));
        unsubs.push(engine.on('serverStateChange', function (e) {
          latest = engine.getState();
          schedulePaint();
          if (e.to === 'Degraded' || e.to === 'Unavailable') {
            notify('Server is now ' + e.to + ' (simulated, t = ' + e.t + ' s).', e.to === 'Unavailable' ? 'danger' : 'warn');
          } else if (e.to === 'Healthy' && e.from !== 'Healthy') {
            notify('Server has recovered and is Healthy (simulated).', 'success');
          }
        }));
        unsubs.push(engine.on('log', function (e) { addLog(e.message, e.level, e.t); }));
      }
      zeroCards();
      renderBadge('Healthy');
      drawChart();
    },

    notify: notify,

    renderComparison: renderComparison,

    reset: function () {
      latest = engineRef ? engineRef.getState() : null;
      if (latest) latest.history = [];          // the chart starts empty again
      zeroCards();
      renderBadge('Healthy');
      chartSize = { w: 0, h: 0, dpr: 0 };
      drawChart();
      var table = $('compare-table');
      if (table) table.textContent = '';
      var p = $('compare-explanation');
      if (p) p.textContent = '';
      var host = $('toast-container');
      if (host) host.textContent = '';
      var live = $('notifications');
      if (live) live.textContent = '';
    }
  };
})(window.Lab);

/* ===== js/quiz.js ===== */
/* ==========================================================================
   quiz.js — OWNER: Manvith Karkera
   Purpose: quiz rendering and scoring (Lab.Quiz, CONTRACT §5.8).
   Shows ONE question at a time with four radio-style option buttons, a Submit
   button, immediate feedback (.is-correct / .is-wrong plus the explanation; a
   wrong answer also shows the right option and why), a Next button and a
   "Question 2 of 6" progress label. At the end it shows the score in
   #quiz-score and calls onFinished({ score, total }) exactly once.
   Accessibility: fieldset + legend, a radiogroup with arrow-key navigation,
   focus moves to the feedback after Submit and to the next question after Next.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var container = null;
  var questions = [];
  var onFinishedCb = null;
  var index = 0;
  var score = 0;
  var finishedFired = false;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function scoreEl() { return document.getElementById('quiz-score'); }

  function clearScore() {
    var s = scoreEl();
    if (s) s.textContent = '';
  }

  function renderQuestion() {
    var q = questions[index];
    container.textContent = '';

    var progress = el('p', 'quiz-progress', 'Question ' + (index + 1) + ' of ' + questions.length);
    var bar = el('div', 'quiz-progress__track');
    bar.setAttribute('aria-hidden', 'true');
    var fill = el('div', 'quiz-progress__bar');
    fill.style.width = (index / questions.length * 100) + '%';
    bar.appendChild(fill);

    var fieldset = el('fieldset', 'quiz-question');
    var legend = el('legend', null, q.question);
    legend.id = 'quiz-legend-' + q.id;
    fieldset.appendChild(legend);

    var group = el('div', 'quiz-options');
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-labelledby', legend.id);

    var options = [];
    var selected = -1;

    function select(i) {
      selected = i;
      options.forEach(function (btn, k) {
        btn.setAttribute('aria-checked', k === i ? 'true' : 'false');
        btn.tabIndex = k === i ? 0 : -1;
        btn.classList.toggle('is-selected', k === i);
      });
      submit.disabled = false;
    }

    q.options.forEach(function (text, i) {
      var btn = el('button', 'quiz-option');
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.tabIndex = i === 0 ? 0 : -1;                                // roving tabindex: one tab stop for the group
      var letter = el('span', 'quiz-option__key', String.fromCharCode(65 + i));
      letter.setAttribute('aria-hidden', 'true');
      btn.appendChild(letter);
      btn.appendChild(el('span', 'quiz-option__text', text));
      btn.addEventListener('click', function () { select(i); });
      btn.addEventListener('keydown', function (e) {
        var next = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % options.length;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + options.length) % options.length;
        if (next >= 0) { e.preventDefault(); options[next].focus(); select(next); }
      });
      options.push(btn);
      group.appendChild(btn);
    });
    fieldset.appendChild(group);

    var feedback = el('div', 'quiz-feedback');
    feedback.tabIndex = -1;
    feedback.setAttribute('role', 'status');

    var actions = el('div', 'quiz-actions');
    var submit = el('button', 'btn btn--primary', 'Submit answer');
    submit.type = 'button';
    submit.disabled = true;
    var next = el('button', 'btn btn--primary', index === questions.length - 1 ? 'See my score' : 'Next question');
    next.type = 'button';
    next.hidden = true;
    actions.appendChild(submit);
    actions.appendChild(next);

    submit.addEventListener('click', function () {
      if (selected < 0) return;
      var correct = q.answer;
      var right = selected === correct;
      if (right) score++;
      options.forEach(function (btn, k) {
        btn.disabled = true;                                           // answered: no more changes
        if (k === correct) btn.classList.add('is-correct');
        if (k === selected && !right) btn.classList.add('is-wrong');
      });
      feedback.textContent = '';
      feedback.appendChild(el('strong', null, right ? 'Correct. ' : 'Not quite. '));
      if (!right) feedback.appendChild(document.createTextNode('The right answer is “' + q.options[correct] + '”. '));
      feedback.appendChild(document.createTextNode(q.explanation));
      submit.hidden = true;
      next.hidden = false;
      feedback.focus();
    });

    next.addEventListener('click', function () {
      index++;
      if (index < questions.length) {
        renderQuestion();
        var first = container.querySelector('.quiz-option');
        if (first) first.focus();
      } else {
        showResult();
      }
    });

    container.appendChild(progress);
    container.appendChild(bar);
    container.appendChild(fieldset);
    container.appendChild(feedback);
    container.appendChild(actions);
  }

  function showResult() {
    var total = questions.length;
    var percent = Math.round(score / total * 100);
    container.textContent = '';
    var summary = el('div', 'quiz-result');
    summary.tabIndex = -1;
    summary.appendChild(el('p', 'quiz-result__score', score + ' / ' + total));
    summary.appendChild(el('p', null, percent >= 67
      ? 'Well done! You understand how a SYN flood works and how defences help.'
      : 'Good effort. Review the theory and the comparison table, then reset the lab to try again.'));
    container.appendChild(summary);

    var s = scoreEl();
    if (s) s.textContent = 'Quiz score: ' + score + ' / ' + total + ' (' + percent + '%)';
    summary.focus();

    if (!finishedFired) {
      finishedFired = true;
      if (typeof onFinishedCb === 'function') onFinishedCb({ score: score, total: total });
    }
  }

  Lab.Quiz = {
    init: function (containerEl, qs, onFinished) {
      container = containerEl;
      questions = qs || [];
      onFinishedCb = onFinished;
      index = 0;
      score = 0;
      finishedFired = false;
      clearScore();
      if (!container) return;
      if (!questions.length) { container.textContent = ''; return; }
      renderQuestion();
    },

    reset: function () {
      index = 0;
      score = 0;
      finishedFired = false;
      if (container) container.textContent = '';
      clearScore();
    }
  };
})(window.Lab);

/* ===== js/workflow.js ===== */
/* ==========================================================================
   workflow.js — OWNER: Manvith Karkera
   Purpose: boots the app, renders Lab.Content into the page, runs the 8-step
   state machine, wires every button, handles Stop / Reset / Restart and the
   completion popup. This is the ONLY file that runs code on DOMContentLoaded
   and the only one that wires buttons; the other modules just render.

   The journey (CONTRACT/brief):
     Before You Begin -> Theory -> 1 Review -> 2 Baseline -> 3 Flood -> 4 Observe
     -> 5 Stop -> 6 Mitigation -> 7 Comparison -> 8 Quiz -> Completion popup

   How gating works: every step has a status (locked | ready | in-progress |
   completed) kept in `status[]`. updateControls() derives which buttons are
   enabled from the current step and from engine.isRunning(), so a control that
   makes no sense in the current state is always disabled.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var STEP_COUNT = 8;
  var NO_DEFENCES = { synCookies: false, rateLimit: false, shortTimeout: false, firewall: false };
  var MIT_INPUTS = {                     // checkbox id -> key in engine.setMitigation / Lab.Content.mitigations
    'mit-syn-cookies': 'synCookies',
    'mit-rate-limit': 'rateLimit',
    'mit-short-timeout': 'shortTimeout',
    'mit-firewall': 'firewall'
  };
  var LAB_SECTIONS = ['stepper-section', 'topology', 'controls', 'dashboard', 'log'];   // visible once the lab starts
  var PASS_PERCENT = 67;

  var C;                                 // Lab.Content
  var engine;
  var started = false;
  var status = [];                       // status[0] is step 1
  var runs = { baseline: null, attack: null, mitigated: null };
  var currentRunKind = null;             // 'baseline' | 'attack' | 'mitigated' while a run is active
  var quiz = { initialised: false, done: false, score: 0, total: 0 };
  var shownStep = 0;                     // the step the panel currently shows
  var pendingConfirm = null;

  // ---- small helpers -------------------------------------------------------
  function $(id) { return document.getElementById(id); }
  function show(el, visible) { if (el) el.hidden = !visible; }
  function setDisabled(id, disabled) { var e = $(id); if (e) e.disabled = !!disabled; }
  function reducedMotion() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  function focusEl(el) { if (el) el.focus({ preventScroll: true }); }
  function scrollToEl(el) {
    if (el) el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  function log(message, level) { Lab.Log.add(message, level || 'info'); }
  function notify(message, level) { Lab.Dashboard.notify(message, level || 'info'); }

  function mitigationNames(summaryOrMap) {
    var map = summaryOrMap || {};
    return Object.keys(MIT_INPUTS).map(function (id) { return MIT_INPUTS[id]; })
      .filter(function (k) { return map[k]; })
      .map(function (k) { return C.mitigations[k].title; });
  }

  function selectedMitigation() {
    var m = {};
    Object.keys(MIT_INPUTS).forEach(function (id) { var el = $(id); m[MIT_INPUTS[id]] = !!(el && el.checked); });
    return m;
  }

  function anyMitigationSelected() {
    var m = selectedMitigation();
    return Object.keys(m).some(function (k) { return m[k]; });
  }

  function resultsExist() {
    if (!started) return false;
    return !!(runs.baseline || runs.attack || runs.mitigated || engine.isRunning() ||
      engine.getState().history.length || quiz.initialised);
  }

  // ---- rendering Lab.Content -----------------------------------------------
  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function renderContent() {
    var h1 = document.querySelector('#lab-header h1');
    if (h1) h1.textContent = C.title;

    var obj = $('lab-objective');
    if (obj) { obj.textContent = ''; obj.appendChild(el('strong', null, 'Objective: ')); obj.appendChild(document.createTextNode(C.objective)); }
    if ($('lab-disclaimer')) $('lab-disclaimer').textContent = C.disclaimer;
    if ($('lab-footer-note')) $('lab-footer-note').textContent = C.disclaimer;

    var list = $('guidelines-list');
    if (list) { list.textContent = ''; C.guidelines.forEach(function (g) { list.appendChild(el('li', null, g)); }); }

    // Theory: TCP, the handshake, SYN flood, availability, analogy.
    var t = $('theory-content');
    if (t) {
      t.textContent = '';
      t.appendChild(el('h3', null, 'What is TCP?'));
      t.appendChild(el('p', null, C.theory.tcp));
      t.appendChild(el('h3', null, 'The three-way handshake'));
      var steps = el('ol', 'handshake-list');
      C.theory.handshake.forEach(function (h) {
        var li = el('li');
        li.appendChild(el('strong', 'handshake-list__name', h.name));
        li.appendChild(document.createTextNode(' ' + h.text));
        steps.appendChild(li);
      });
      t.appendChild(steps);
      t.appendChild(el('h3', null, 'What is a SYN flood?'));
      t.appendChild(el('p', null, C.theory.synFlood));
      t.appendChild(el('h3', null, 'Why availability matters'));
      t.appendChild(el('p', null, C.theory.availability));
      var analogy = el('aside', 'analogy');
      analogy.appendChild(el('strong', 'analogy__title', 'An analogy'));
      analogy.appendChild(el('p', null, C.theory.analogy));
      t.appendChild(analogy);
    }

    // Mitigations: title, explanation and limitation next to each switch.
    Object.keys(MIT_INPUTS).forEach(function (id) {
      var input = $(id);
      if (!input) return;
      var m = C.mitigations[MIT_INPUTS[id]];
      var item = input.closest('.mitigation-item');
      var label = item.querySelector('label');
      if (label) label.textContent = m.title;
      item.appendChild(el('p', 'mitigation-text', m.text));
      var lim = el('p', 'limitation');
      lim.appendChild(el('strong', null, 'Limitation: '));
      lim.appendChild(document.createTextNode(m.limitation));
      item.appendChild(lim);
    });

    // Step list titles.
    document.querySelectorAll('#step-list li').forEach(function (li, i) { li.textContent = C.steps[i].title; });

    // Extra control on the theory section: back to the lab / guidelines.
    var theory = $('section-theory');
    if (theory && !$('btn-close-theory')) {
      var close = el('button', 'btn btn--primary', 'Close theory');
      close.type = 'button';
      close.id = 'btn-close-theory';
      theory.appendChild(close);
    }
  }

  // ---- stepper -------------------------------------------------------------
  function setStatus(n, s) {
    status[n - 1] = s;
    var li = document.querySelector('#step-list li[data-step="' + n + '"]');
    if (!li) return;
    li.setAttribute('data-status', s);
    li.className = 'step step--' + s;
    if (s === 'in-progress') li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    var label = { locked: 'locked', ready: 'ready', 'in-progress': 'in progress', completed: 'completed' }[s];
    li.setAttribute('aria-label', 'Step ' + n + ': ' + C.steps[n - 1].title + ', ' + label);
  }

  function currentStep() {
    for (var i = 0; i < STEP_COUNT; i++) if (status[i] !== 'completed') return i + 1;
    return STEP_COUNT + 1;                                    // everything done
  }

  function completeStep(n) {
    if (status[n - 1] === 'completed') return;
    setStatus(n, 'completed');
    // unlock the following step: steps that need a button press are "ready", reading steps are "in progress"
    var next = n + 1;
    if (next <= STEP_COUNT && status[next - 1] === 'locked') setStatus(next, (next === 7 || next === 8) ? 'in-progress' : 'ready');
  }

  function renderStepPanel() {
    var cur = currentStep();
    var title = $('step-title'), instr = $('step-instructions'), actions = $('step-actions');
    if (!title) return;
    actions.textContent = '';
    if (cur > STEP_COUNT) {
      title.textContent = C.completion.title;
      instr.textContent = C.completion.message;
      var again = el('button', 'btn btn--ghost', 'Restart the lab');
      again.type = 'button';
      again.addEventListener('click', function () { requestReset(true); });
      actions.appendChild(again);
      return;
    }
    title.textContent = 'Step ' + cur + ' of ' + STEP_COUNT + ': ' + C.steps[cur - 1].title;
    instr.textContent = C.steps[cur - 1].instructions;
    if (cur === 1 || cur === 7) {
      var go = el('button', 'btn btn--primary', 'Continue');
      go.type = 'button';
      go.addEventListener('click', cur === 1 ? finishStep1 : finishStep7);
      actions.appendChild(go);
    }
  }

  // Sections unlock as the journey advances; the panel text and focus follow the current step.
  function refresh(moveFocus) {
    var cur = currentStep();
    show($('mitigation'), started && cur >= 6);
    show($('comparison'), started && cur >= 7 && !!runs.mitigated);
    show($('quiz'), started && cur >= 8);
    if (started && cur === 8 && !quiz.initialised) initQuiz();
    renderStepPanel();
    updateControls();
    if (moveFocus && cur !== shownStep) focusEl($('step-title'));
    shownStep = cur;
    if (started && cur > STEP_COUNT) maybeComplete();
  }

  // ---- controls ------------------------------------------------------------
  function updateControls() {
    var running = engine.isRunning();
    var cur = currentStep();
    var baselineDone = !!runs.baseline;
    var attackAllowed = started && baselineDone && !running && !runs.mitigated && cur >= 3 && cur <= 6;
    var mitigationAllowed = started && !running && !!runs.attack && (cur === 6 || cur === 7);

    setDisabled('btn-start', !($('ack-checkbox') && $('ack-checkbox').checked));
    setDisabled('btn-baseline', !(started && !running && cur === 2));
    setDisabled('btn-start-flood', !attackAllowed);
    setDisabled('attack-level', !attackAllowed);
    setDisabled('btn-stop-sim', !running);
    setDisabled('btn-stop', !running);
    Object.keys(MIT_INPUTS).forEach(function (id) { setDisabled(id, !mitigationAllowed); });
    setDisabled('btn-run-mitigated', !(mitigationAllowed && anyMitigationSelected()));

    var runBtn = $('btn-run-mitigated');
    if (runBtn) runBtn.title = (mitigationAllowed && !anyMitigationSelected()) ? 'Switch on at least one defence first' : '';

    // Guide the student: softly highlight the one control that is the natural next action.
    var next = null;
    if (started && running) next = (cur === 4 || cur === 5) ? 'btn-stop-sim' : null;
    else if (cur === 2) next = 'btn-baseline';
    else if (cur === 3) next = 'btn-start-flood';
    else if (mitigationAllowed && cur === 6 && anyMitigationSelected()) next = 'btn-run-mitigated';
    ['btn-baseline', 'btn-start-flood', 'btn-stop-sim', 'btn-run-mitigated', 'btn-start'].forEach(function (id) {
      var b = $(id);
      if (b) b.classList.toggle('is-next', id === next || (id === 'btn-start' && !b.disabled && !started));
    });
    var rs = $('run-status');
    if (rs) rs.classList.toggle('is-running', running);
  }

  function updateRunStatus(state) {
    var label = $('run-status-label');
    var bar = document.querySelector('#run-status .progress__bar');
    var track = document.querySelector('#run-status .progress');
    if (!label) return;
    if (state && state.running) {
      var total = state.mode === 'baseline' ? (state.params.baselineSeconds || 20) : (state.params.attackSeconds || 40);
      var what = currentRunKind === 'baseline' ? 'Baseline traffic'
        : (currentRunKind === 'mitigated' ? 'SYN flood with defences (' + state.level + ')' : 'SYN flood (' + state.level + ')');
      label.textContent = what + ' — ' + state.t + ' / ' + total + ' simulated seconds';
      var pct = Math.min(100, state.t / total * 100);
      if (bar) bar.style.width = pct + '%';
      if (track) track.setAttribute('aria-valuenow', Math.round(pct));
    }
  }

  function resetRunStatus(text) {
    var label = $('run-status-label');
    var bar = document.querySelector('#run-status .progress__bar');
    if (label) label.textContent = text || 'No simulation running';
    if (bar) bar.style.width = '0%';
  }

  // ---- journey actions -------------------------------------------------------
  function startLab() {
    started = true;
    show($('screen-guidelines'), false);
    LAB_SECTIONS.forEach(function (id) { show($(id), true); });
    show($('section-theory'), true);
    for (var n = 1; n <= STEP_COUNT; n++) setStatus(n, 'locked');
    setStatus(1, 'in-progress');
    shownStep = 0;
    log('Lab initialised. Step 1: review the theory.', 'info');
    refresh(false);
    window.scrollTo(0, 0);
    focusEl($('step-title'));
    Lab.Visuals.playHandshakeDemo();
  }

  function finishStep1() {
    completeStep(1);
    show($('section-theory'), false);
    refresh(true);
    scrollToEl($('stepper-section'));
  }

  function finishStep7() {
    completeStep(7);
    refresh(true);
    scrollToEl($('quiz'));
  }

  function clearVisuals() { Lab.Visuals.reset(); Lab.Dashboard.reset(); }

  function startBaseline() {
    if (engine.isRunning()) return;
    engine.setMitigation(NO_DEFENCES);
    currentRunKind = 'baseline';
    clearVisuals();
    setStatus(2, 'in-progress');
    engine.runBaseline();
    refresh(false);
  }

  function startFlood() {
    if (engine.isRunning() || !runs.baseline) return;
    var level = $('attack-level').value;
    engine.setMitigation(NO_DEFENCES);
    currentRunKind = 'attack';
    clearVisuals();
    engine.runAttack(level);
    // Step 3 (launch) is done the moment the flood starts; steps 4 and 5 follow its progress.
    completeStep(3);
    if (status[3] !== 'completed') setStatus(4, 'in-progress');
    if (status[4] === 'locked') setStatus(5, 'ready');
    refresh(true);
  }

  function startMitigated() {
    if (engine.isRunning() || !runs.attack || !anyMitigationSelected()) return;
    var chosen = selectedMitigation();
    var level = runs.attack.level;
    $('attack-level').value = level;                     // the same attack as before, so the comparison is fair
    engine.setMitigation(chosen);
    currentRunKind = 'mitigated';
    clearVisuals();
    setStatus(6, 'in-progress');
    engine.runAttack(level);
    refresh(false);
  }

  function stopRun() {
    if (engine.isRunning()) engine.stop();               // engine emits runEnded, which does the bookkeeping
  }

  function onRunEnded(summary) {
    var kind = currentRunKind;
    currentRunKind = null;
    resetRunStatus(summary.stoppedEarly ? 'Simulation stopped' : 'Simulation finished');
    if (!summary.stoppedEarly) { var fullBar = document.querySelector('#run-status .progress__bar'); if (fullBar) fullBar.style.width = '100%'; }
    var pct = Math.round(summary.avgAvailability);

    if (kind === 'baseline') {
      if (summary.stoppedEarly) {
        setStatus(2, 'ready');
        log('Baseline stopped early and discarded. Run it again to finish step 2.', 'warn');
        notify('Baseline stopped early. Run it again to record a full baseline.', 'warn');
      } else {
        runs.baseline = summary;
        completeStep(2);
        log('Baseline generated: average availability ' + pct + '%, server ' + summary.finalServerState + '.', 'success');
        notify('Baseline recorded. You can now launch the SYN flood.', 'success');
      }
    } else if (kind === 'attack') {
      runs.attack = summary;
      [3, 4, 5].forEach(completeStep);
      log('Attack run recorded (' + summary.level + '): average availability ' + pct + '%, server ' + summary.finalServerState + '.', 'warn');
      notify('Attack run recorded. Next: enable some defences.', 'info');
    } else if (kind === 'mitigated') {
      if (summary.stoppedEarly) {
        setStatus(6, 'ready');
        log('Mitigated run stopped early and discarded. Run it again to finish step 6.', 'warn');
        notify('Mitigated run stopped early. Run it again to compare fairly.', 'warn');
      } else {
        runs.mitigated = summary;
        completeStep(6);
        var names = mitigationNames(summary.mitigation).join(', ');
        log('Mitigated run recorded (' + names + '): average availability ' + pct + '%, server ' + summary.finalServerState + '.', 'success');
        Lab.Dashboard.renderComparison(runs);
        log('Comparison ready.', 'info');
        notify('Comparison ready. Review the table below.', 'success');
      }
    }
    refresh(true);
    if (kind === 'mitigated' && runs.mitigated && !summary.stoppedEarly) scrollToEl($('comparison'));
  }

  function onServerStateChange(e) {
    if (currentRunKind === 'attack' && (e.to === 'Degraded' || e.to === 'Unavailable') && status[3] !== 'completed') {
      completeStep(4);
      if (status[4] === 'locked') setStatus(5, 'ready');
      refresh(true);
    }
  }

  // ---- quiz and completion -----------------------------------------------------
  function initQuiz() {
    quiz.initialised = true;
    setStatus(8, 'in-progress');
    Lab.Quiz.init($('quiz-container'), C.quiz, onQuizFinished);
  }

  function onQuizFinished(result) {
    quiz.done = true;
    quiz.score = result.score;
    quiz.total = result.total;
    log('Quiz finished: ' + result.score + ' / ' + result.total + '.', 'success');
    completeStep(8);
    refresh(false);
  }

  function maybeComplete() {
    if (!(runs.baseline && runs.attack && runs.mitigated && status[6] === 'completed' && quiz.done)) return;
    var dlg = $('modal-complete');
    if (!dlg || dlg.open) return;
    var pct = (n) => (n === null || n === undefined ? '—' : Math.round(n) + '%');
    $('complete-message').textContent = C.completion.message;
    $('complete-baseline').textContent = pct(runs.baseline.avgAvailability);
    $('complete-attack').textContent = pct(runs.attack.avgAvailability);
    $('complete-mitigated').textContent = pct(runs.mitigated.avgAvailability);
    $('complete-score').textContent = quiz.score + ' / ' + quiz.total;
    var passed = quiz.total && quiz.score / quiz.total * 100 >= PASS_PERCENT;
    $('complete-status').textContent = passed ? 'Passed' : 'Completed — review recommended';
    $('modal-complete').querySelector('h2').textContent = C.completion.title;
    log('Experiment completed.', 'success');
    dlg.showModal();
    focusEl($('btn-review'));
  }

  // ---- theory -------------------------------------------------------------------
  function openTheory() {
    show($('section-theory'), true);
    var close = $('btn-close-theory');
    if (close) close.textContent = started ? 'Close theory' : 'Back to the guidelines';
    scrollToEl($('section-theory'));
    focusEl($('theory-heading'));
    Lab.Visuals.playHandshakeDemo();
  }

  function closeTheory() {
    show($('section-theory'), false);
    if (!started) { scrollToEl($('screen-guidelines')); focusEl($('guidelines-heading')); }
    else { scrollToEl($('stepper-section')); focusEl($('step-title')); }
  }

  // ---- reset / restart ------------------------------------------------------------
  function openConfirm(message, onYes) {
    var dlg = $('modal-confirm');
    if (!dlg || !dlg.showModal) { onYes(); return; }
    $('confirm-message').textContent = message;
    pendingConfirm = onYes;
    dlg.showModal();
    focusEl($('btn-confirm-no'));
  }

  function closeConfirm(accepted) {
    var dlg = $('modal-confirm');
    var action = pendingConfirm;
    pendingConfirm = null;
    if (dlg && dlg.open) dlg.close();
    if (accepted && action) action();
  }

  function requestReset(toStart) {
    if (resultsExist()) {
      openConfirm(toStart
        ? 'Restart the lab from the beginning? Your results, log and quiz progress will be cleared.'
        : 'Reset the experiment? Your results, log and quiz progress will be cleared and you will return to Step 1.',
      function () { doReset(toStart); });
    } else {
      doReset(toStart);
    }
  }

  function doReset(toStart) {
    var done = $('modal-complete');
    if (done && done.open) done.close();
    engine.reset();                                      // stops any timer and clears queue, metrics, history, mitigation
    Lab.Visuals.reset();
    Lab.Dashboard.reset();
    Lab.Log.clear();
    Lab.Quiz.reset();
    Object.keys(MIT_INPUTS).forEach(function (id) { var c = $(id); if (c) c.checked = false; });
    runs = { baseline: null, attack: null, mitigated: null };
    quiz = { initialised: false, done: false, score: 0, total: 0 };
    currentRunKind = null;
    pendingConfirm = null;
    if ($('attack-level')) $('attack-level').value = 'medium';
    resetRunStatus();
    for (var n = 1; n <= STEP_COUNT; n++) setStatus(n, 'locked');
    shownStep = 0;

    if (toStart) {
      started = false;
      if ($('ack-checkbox')) $('ack-checkbox').checked = false;
      LAB_SECTIONS.concat(['section-theory', 'mitigation', 'comparison', 'quiz']).forEach(function (id) { show($(id), false); });
      show($('screen-guidelines'), true);
      refresh(false);
      window.scrollTo(0, 0);
      focusEl($('guidelines-heading'));
    } else {
      setStatus(1, 'in-progress');
      show($('section-theory'), true);
      log('Experiment reset. Back at Step 1.', 'info');
      refresh(true);
      window.scrollTo(0, 0);
    }
  }

  // ---- boot -----------------------------------------------------------------------
  function wire() {
    var ack = $('ack-checkbox');
    ack.addEventListener('change', updateControls);
    $('btn-start').addEventListener('click', startLab);
    $('btn-view-theory').addEventListener('click', openTheory);
    $('btn-theory').addEventListener('click', openTheory);
    $('btn-close-theory').addEventListener('click', closeTheory);
    $('btn-play-handshake').addEventListener('click', function () { Lab.Visuals.playHandshakeDemo(); });

    $('btn-baseline').addEventListener('click', startBaseline);
    $('btn-start-flood').addEventListener('click', startFlood);
    $('btn-stop-sim').addEventListener('click', stopRun);
    $('btn-stop').addEventListener('click', stopRun);
    $('btn-run-mitigated').addEventListener('click', startMitigated);

    Object.keys(MIT_INPUTS).forEach(function (id) {
      $(id).addEventListener('change', function (e) {
        var m = C.mitigations[MIT_INPUTS[id]];
        log('Mitigation ' + (e.target.checked ? 'enabled' : 'disabled') + ': ' + m.title + '.', 'info');
        updateControls();
      });
    });

    $('btn-reset').addEventListener('click', function () { requestReset(false); });
    $('btn-restart').addEventListener('click', function () { requestReset(true); });
    $('btn-restart-lab').addEventListener('click', function () { doReset(true); });
    $('btn-confirm-yes').addEventListener('click', function () { closeConfirm(true); });
    $('btn-confirm-no').addEventListener('click', function () { closeConfirm(false); });
    $('modal-confirm').addEventListener('cancel', function () { pendingConfirm = null; });
    $('btn-review').addEventListener('click', function () {
      $('modal-complete').close();
      show($('comparison'), true);
      scrollToEl($('comparison'));
      focusEl($('comparison-heading'));
    });

    engine.on('runEnded', onRunEnded);
    engine.on('serverStateChange', onServerStateChange);
    engine.on('tick', updateRunStatus);
  }

  function boot() {
    C = Lab.Content;
    engine = Lab.Engine.create();
    Lab.Visuals.init(engine);
    Lab.Dashboard.init(engine);
    renderContent();
    for (var n = 1; n <= STEP_COUNT; n++) setStatus(n, 'locked');
    wire();
    updateControls();
    Lab.app = { engine: engine };                        // handy in the console while developing
  }

  document.addEventListener('DOMContentLoaded', boot);
})(window.Lab);
