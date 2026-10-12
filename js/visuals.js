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
