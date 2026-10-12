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
  var DEMO_STEPS = [
    { from: 80,  to: 520, cls: 'packet--legit',  name: 'SYN' },
    { from: 520, to: 80,  cls: 'packet--synack', name: 'SYN-ACK' },
    { from: 80,  to: 520, cls: 'packet--ack',    name: 'ACK' }
  ];

  function ensureDemo() {
    var host = document.getElementById('handshake-demo');
    if (!host) return null;
    if (demo && demo.host === host && host.contains(demo.svg)) return demo;
    host.textContent = '';
    var s = make('svg', { viewBox: '0 0 600 140', role: 'img', 'aria-label': 'Client and server exchanging SYN, SYN-ACK and ACK' });
    s.style.width = '100%'; s.style.maxWidth = '640px'; s.style.display = 'block';
    make('line', { x1: 80, y1: 60, x2: 520, y2: 60, stroke: 'var(--color-border)', 'stroke-width': 3, 'class': 'link' }, s);
    [{ x: 80, label: 'Client' }, { x: 520, label: 'Server' }].forEach(function (n) {
      make('rect', { x: n.x - 48, y: 28, width: 96, height: 64, rx: 10, fill: 'var(--color-surface)', stroke: 'var(--color-border)', 'stroke-width': 2, 'class': 'handshake-node' }, s);
      var t = make('text', { x: n.x, y: 66, 'text-anchor': 'middle', 'font-size': 14, 'font-family': 'var(--font-sans)', fill: 'var(--color-text)' }, s);
      t.textContent = n.label;
    });
    var dot = make('circle', { r: 8, cx: 80, cy: 60, opacity: 0, 'class': 'packet' }, s);
    var tag = make('text', { x: 80, y: 40, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, 'font-family': 'var(--font-mono)', fill: 'var(--color-text)', opacity: 0 }, s);
    var done = make('text', { x: 300, y: 125, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, 'font-family': 'var(--font-sans)', fill: 'var(--color-healthy)', opacity: 0 }, s);
    done.textContent = '✓ Connection established';
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
  function schedulePaint() {
    if (paintQueued) return;
    paintQueued = true;
    requestAnimationFrame(function () {
      paintQueued = false;
      if (!latest) return;
      renderCards(latest);
      renderBadge(latest.serverState);
      drawChart();
    });
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
