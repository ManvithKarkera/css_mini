/* ==========================================================================
   backlog.js — OWNER: Manvith Karkera
   Purpose: the live "backlog machine" figure (Lab.Backlog). The static art is
   generated into backlog-art.js by tools/backlog/build.mjs; this file only
   moves it, driven by the engine's public events (CONTRACT §5.2):

   - tick:   tags on the 100 hooks follow state.queue (legit / attack), the
             gauge needle follows queueUtil, the gate drops when the queue is
             full, the stations follow state.mitigation.
   - packet: each SYN becomes a token that drops from the hopper and rides the
             belt to where its outcome happens: into the cabinet (queued /
             completed), against the closed gate (rejected), against the
             firewall screen or the turnstile (filtered), or under the stamp
             press and back out (cookie).

   One requestAnimationFrame loop, stopped when the figure is offscreen or at
   rest. Under prefers-reduced-motion nothing travels: tags, gauge, gate and
   stations jump straight to the model's values.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var MAX_TOKENS = 48;
  var BELT_SPEED = 170;        // world units per second
  var DROP_MS = 260;           // hopper -> belt
  var FALL_MS = 420;           // belt -> reject tray
  var TRAY_KEEP_MS = 2600;     // tokens rest in the tray this long, then fade
  var FADE_MS = 360;

  var MIT_INPUTS = { synCookies: 'mit-syn-cookies', rateLimit: 'mit-rate-limit', shortTimeout: 'mit-short-timeout', firewall: 'mit-firewall' };
  var NO_MIT = { synCookies: false, rateLimit: false, shortTimeout: false, firewall: false };

  var art, G, I, P;
  var root = null, svg = null, readoutEl = null, lanes = {}, tagEls = [], needle, hand, gate, sieve, turnstile, paddles, ram, slats;
  var slots = [];              // 'free' | 'legit' | 'attack' per hook
  var ages = [];               // when each hook was filled, to clear the oldest first
  var tokens = [];
  var unsubs = [];
  var model = { util: 0, pending: 0, capacity: 100, running: false, state: 'Healthy', mit: NO_MIT, timeout: 30 };
  var shown = { util: 0, utilRate: 0, gate: 1, sieve: 1, turn: 1, timer: 30, spin: 0, ram: 0, belt: 0 };
  var frame = 0, last = 0, visible = true, filler = 0;

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function follow(cur, target, dt, sec) { return cur + (target - cur) * (1 - Math.exp(-dt / sec)); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function el(sel) { return svg.querySelector(sel); }

  // ---- markup -----------------------------------------------------------------
  function mount(container) {
    root = document.createElement('figure');
    root.className = 'backlog iso';
    root.setAttribute('data-theme', 'light');   // the kit's paper inks; the lab has one light theme
    root.innerHTML =
      '<div class="backlog__plate">' +
        '<div class="backlog__corners" aria-hidden="true">' +
          '<span data-corner="fig">Fig 1</span><span data-corner="title">Inside the queue</span>' +
        '</div>' +
        '<div class="backlog__stage">' + art.svg + '</div>' +
        '<div class="backlog__foot">' +
          '<span class="backlog__hint">100 hooks = 100 half-open slots</span>' +
          '<span class="backlog__readout" data-readout aria-live="off">0 / 100 hooks · gate open</span>' +
        '</div>' +
      '</div>' +
      '<figcaption class="backlog__legend">' +
        '<span class="backlog__key"><i class="backlog__swatch backlog__swatch--legit"></i>Real client</span>' +
        '<span class="backlog__key"><i class="backlog__swatch backlog__swatch--attack"></i>Spoofed attack SYN</span>' +
        '<span class="backlog__key"><i class="backlog__swatch backlog__swatch--cookie"></i>Answered with a SYN cookie</span>' +
        '<span class="backlog__caption">Each SYN that gets in hangs a tag on a free hook. A real client takes its tag back after its ACK; a spoofed tag hangs until the timer on top clears it. When all 100 hooks are full the gate drops and new connections fall into the reject tray. Switch defences on and the firewall screen, the rate-limit turnstile and the SYN-cookie press come down over the belt.</span>' +
      '</figcaption>';
    container.appendChild(root);
    svg = root.querySelector('svg');
    readoutEl = root.querySelector('[data-readout]');
    var laneEls = svg.querySelectorAll('[data-part="lane"]');
    for (var i = 0; i < laneEls.length; i++) lanes[laneEls[i].getAttribute('data-lane')] = laneEls[i];
    tagEls = [];
    var tagNodes = svg.querySelectorAll('.bk-tag');
    for (i = 0; i < tagNodes.length; i++) tagEls[+tagNodes[i].getAttribute('data-slot')] = tagNodes[i];
    needle = el('.bk-needle'); hand = el('.bk-hand');
    gate = el('[data-part="gate"]'); sieve = el('[data-part="sieve"]'); turnstile = el('[data-part="turnstile"]');
    paddles = el('[data-part="paddles"]'); ram = el('[data-part="ram"]'); slats = el('.bk-slats');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) kick();
      }, { rootMargin: '120px 0px' }).observe(root);
    }
  }

  // ---- hooks -------------------------------------------------------------------
  function setSlot(i, kind) {
    slots[i] = kind;
    ages[i] = kind === 'free' ? 0 : ++filler;
    tagEls[i].setAttribute('data-kind', kind);
  }
  function syncHooks(legit, attack) {
    var have = { legit: 0, attack: 0 }, i;
    for (i = 0; i < slots.length; i++) if (slots[i] !== 'free') have[slots[i]]++;
    ['legit', 'attack'].forEach(function (kind) {
      var want = kind === 'legit' ? legit : attack;
      while (have[kind] > want) {                     // clear the oldest tag of this kind
        var oldest = -1;
        for (i = 0; i < slots.length; i++) if (slots[i] === kind && (oldest < 0 || ages[i] < ages[oldest])) oldest = i;
        setSlot(oldest, 'free'); have[kind]--;
      }
    });
    ['attack', 'legit'].forEach(function (kind) {
      var want = kind === 'legit' ? legit : attack;
      while (have[kind] < want) {                     // hang new tags on the lowest free hooks
        var free = slots.indexOf('free');
        if (free < 0) return;
        setSlot(free, kind); have[kind]++;
      }
    });
  }

  // ---- model in ----------------------------------------------------------------
  function mitigationNow(state) {
    if (state && state.running) return state.mitigation;
    var m = {}, any = false;
    for (var key in MIT_INPUTS) {
      var box = document.getElementById(MIT_INPUTS[key]);
      m[key] = !!(box && box.checked);
      if (box) any = true;
    }
    return any ? m : (state ? state.mitigation : NO_MIT);
  }

  function onTick(state) {
    model.capacity = state.queue.capacity;
    model.pending = state.metrics.pending;
    model.util = state.metrics.queueUtil;
    model.running = state.running;
    model.state = state.serverState;
    model.mit = mitigationNow(state);
    model.timeout = model.mit.shortTimeout ? state.params.shortTimeoutSec : state.params.timeoutSec;
    syncHooks(Math.round(state.queue.legit), Math.round(state.queue.attack));
    writeReadout();
    kick();
  }

  function writeReadout() {
    if (!readoutEl) return;
    var full = model.pending >= model.capacity;
    var text = model.pending + ' / ' + model.capacity + ' hooks · ' + (full ? (model.mit.synCookies ? 'full, stamping cookies' : 'gate shut') : 'gate open');
    if (readoutEl.textContent !== text) readoutEl.textContent = text;
  }

  // ---- tokens --------------------------------------------------------------------
  // a token's plan is a list of legs: { to: [x, y, z], ms, lane?, then? }
  function laneFor(x) {
    var L = G.LANES;                                  // [gate, press, turnstile, sieve] x positions
    if (x < L[0]) return '0';
    if (x < L[1]) return '1';
    if (x < L[2]) return '2';
    if (x < L[3]) return '3';
    return '4';
  }
  function travel(fromX, toX) { return Math.abs(toX - fromX) / BELT_SPEED * 1000; }

  function planFor(evt) {
    var y = G.BELT_Y, z = G.BELT_Z, start = G.HOPPER_X;
    var legs = [{ to: [start, y, z], ms: DROP_MS }];
    var trayY = G.TRAY.y + G.TRAY.d / 2, trayZ = 2.2;
    function fallAt(x) {
      legs.push({ to: [x, y + G.BELT_W / 2 + 4, z + 2], ms: 160 });
      legs.push({ to: [clamp(x, G.TRAY.x + 8, G.TRAY.x + G.TRAY.w - 8), trayY + (Math.random() - 0.5) * 18, trayZ], ms: FALL_MS, lane: 'tray' });
      legs.push({ ms: TRAY_KEEP_MS, hold: true });
      legs.push({ ms: FADE_MS, fade: true });
    }
    switch (evt.outcome) {
      case 'queued':
      case 'completed': {
        var mouth = G.MOUTH_X + 4;
        legs.push({ to: [mouth, y, z], ms: travel(start, mouth) });
        legs.push({ to: [G.MOUTH_X - 6, y, z], ms: 180, fade: true });
        break;
      }
      case 'rejected': {
        var stop = G.GATE_X + G.TOKEN_R + 1.5;
        legs.push({ to: [stop, y, z], ms: travel(start, stop) });
        fallAt(stop);
        break;
      }
      case 'filtered': {
        var bySieve = model.mit.firewall && (!model.mit.rateLimit || Math.random() < 0.6);
        var at = bySieve ? G.SIEVE_X + G.TOKEN_R + 2 : G.TURN_X + G.TURN.r + G.TOKEN_R;
        legs.push({ to: [at, y, z], ms: travel(start, at) });
        fallAt(at);
        break;
      }
      case 'cookie': {
        var under = G.PRESS_X;
        legs.push({ to: [under, y, z], ms: travel(start, under) });
        legs.push({ ms: 260, hold: true, stamp: true });
        legs.push({ to: [G.BELT.x1 - 6, y, z], ms: travel(under, G.BELT.x1 - 6) });
        legs.push({ ms: FADE_MS, fade: true });
        break;
      }
      default:
        return null;
    }
    return legs;
  }

  function onPacket(evt) {
    if (reducedMotion() || !visible || document.hidden) return;
    if (evt.type !== 'syn' && !(evt.type === 'ack' && evt.outcome === 'completed')) return;
    var legs = planFor(evt);
    if (!legs) return;
    if (tokens.length >= MAX_TOKENS) removeToken(0);
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = art.tokens[evt.source === 'legit' ? 'legit' : 'attack'];
    g = g.firstChild;
    var t = { el: g, pos: [G.HOPPER_X, G.BELT_Y, G.BELT_Z + 52], from: null, legs: legs, leg: -1, started: 0, lane: null, alpha: 1 };
    tokens.push(t);
    nextLeg(t, performance.now());
    placeToken(t);
    kick();
  }

  function nextLeg(t, now) {
    t.leg++;
    t.started = now;
    t.from = t.pos.slice();
    var leg = t.legs[t.leg];
    if (leg && leg.stamp) { shown.ram = 1; t.el.setAttribute('data-kind', 'cookie'); }
  }

  function placeToken(t) {
    var leg = t.legs[t.leg];
    var lane = (leg && leg.lane) || (t.lane === 'tray' ? 'tray' : laneFor(t.pos[0]));
    if (lane !== t.lane) { lanes[lane].appendChild(t.el); t.lane = lane; }
    t.el.setAttribute('transform', I.translateAlong(P, t.pos));
    if (t.alpha < 1) t.el.setAttribute('opacity', t.alpha.toFixed(2));
  }

  function removeToken(index) {
    var t = tokens[index];
    if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
    tokens.splice(index, 1);
  }

  function stepTokens(now) {
    for (var i = tokens.length - 1; i >= 0; i--) {
      var t = tokens[i];
      var leg = t.legs[t.leg];
      while (leg && now - t.started >= leg.ms) {
        if (leg.to) t.pos = leg.to.slice();
        if (leg.fade) { removeToken(i); leg = null; t = null; break; }
        nextLeg(t, t.started + leg.ms);
        leg = t.legs[t.leg];
      }
      if (!t) continue;
      if (!leg) { removeToken(i); continue; }
      var k = clamp((now - t.started) / leg.ms, 0, 1);
      if (leg.to) {
        var e = leg.lane === 'tray' ? k * k : k;     // falling accelerates, the belt runs steady
        for (var a = 0; a < 3; a++) t.pos[a] = t.from[a] + (leg.to[a] - t.from[a]) * e;
      }
      t.alpha = leg.fade ? 1 - k : 1;
      placeToken(t);
    }
  }

  // ---- parts ---------------------------------------------------------------------
  function needlePath(value) {
    var g = G.GAUGE, a = g.from + g.span * clamp(value, 0, 100) / 100;
    var cx = g.at[0], cy = g.at[1];
    return I.lineOnTop([cx - Math.sin(a) * 4, cy + Math.cos(a) * 4], [cx + Math.sin(a) * g.r, cy - Math.cos(a) * g.r], g.z, P);
  }
  function handPath(seconds) {
    var g = G.TIMER, a = (seconds / 30) * Math.PI * 2;
    var cx = g.at[0], cy = g.at[1];
    return I.lineOnTop([cx - Math.sin(a) * 2, cy + Math.cos(a) * 2], [cx + Math.sin(a) * g.r, cy - Math.cos(a) * g.r], g.z, P);
  }
  function paddleSvg(spin) {
    var T = G.TURN, list = [];
    for (var n = 0; n < 4; n++) {
      var a = spin + n * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a), w = 0.9;
      var r0 = 3, r1 = T.r;
      var ring = [
        [T.x + ca * r0 - sa * w, T.y + sa * r0 + ca * w], [T.x + ca * r1 - sa * w, T.y + sa * r1 + ca * w],
        [T.x + ca * r1 + sa * w, T.y + sa * r1 - ca * w], [T.x + ca * r0 + sa * w, T.y + sa * r0 - ca * w]
      ];
      list.push({ depth: I.depthOf([T.x + ca * r1 / 2, T.y + sa * r1 / 2, T.z], P), svg: I.solidSvg(I.extrude(ring, T.z, T.h, P), { tone: 'hi', crease: 'lo' }) });
    }
    list.sort(function (p, q) { return p.depth - q.depth; });
    return list.map(function (p) { return p.svg; }).join('');
  }

  function drawParts() {
    needle.setAttribute('d', needlePath(shown.util));
    hand.setAttribute('d', handPath(shown.timer));
    gate.setAttribute('transform', I.translateAlong(P, [0, 0, shown.gate * G.GATE_LIFT]));
    if (shown.gate < 0.5) gate.setAttribute('data-shut', ''); else gate.removeAttribute('data-shut');
    sieve.setAttribute('transform', I.translateAlong(P, [0, 0, shown.sieve * G.SIEVE_LIFT]));
    turnstile.setAttribute('transform', I.translateAlong(P, [0, 0, shown.turn * G.TURN_LIFT]));
    paddles.innerHTML = paddleSvg(shown.spin);
    ram.setAttribute('transform', I.translateAlong(P, [0, 0, -shown.ram * G.PRESS.stroke]));
    slats.setAttribute('transform', I.translateAlong(P, [-(shown.belt % 8), 0, 0]));
  }

  // ---- loop ----------------------------------------------------------------------
  function targets() {
    return {
      util: model.util,
      gate: model.pending >= model.capacity ? 0 : 1,
      sieve: model.mit.firewall ? 0 : 1,
      turn: model.mit.rateLimit ? 0 : 1,
      timer: model.timeout
    };
  }

  function tick(now) {
    var dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
    last = now;
    var want = targets();
    if (reducedMotion()) {
      shown.util = want.util; shown.gate = want.gate; shown.sieve = want.sieve; shown.turn = want.turn; shown.timer = want.timer; shown.ram = 0;
    } else {
      // the needle on a damped spring, everything else eased
      for (var s = 0; s < 4; s++) {
        shown.utilRate += ((want.util - shown.util) * 90 - shown.utilRate * 14) * dt / 4;
        shown.util += shown.utilRate * dt / 4;
      }
      shown.gate = follow(shown.gate, want.gate, dt, 0.09);
      shown.sieve = follow(shown.sieve, want.sieve, dt, 0.25);
      shown.turn = follow(shown.turn, want.turn, dt, 0.25);
      shown.timer = follow(shown.timer, want.timer, dt, 0.3);
      shown.ram = follow(shown.ram, 0, dt, 0.12);
      if (model.running) {
        shown.belt += BELT_SPEED * dt;
        if (model.mit.rateLimit) shown.spin += dt * 2.4;
      }
      stepTokens(now);
    }
    drawParts();
    var settled = !model.running && !tokens.length &&
      Math.abs(shown.util - want.util) < 0.05 && Math.abs(shown.utilRate) < 0.05 &&
      Math.abs(shown.gate - want.gate) < 0.002 && Math.abs(shown.sieve - want.sieve) < 0.002 &&
      Math.abs(shown.turn - want.turn) < 0.002 && Math.abs(shown.timer - want.timer) < 0.02 && shown.ram < 0.002;
    frame = visible && !settled ? requestAnimationFrame(tick) : 0;
  }

  function kick() {
    if (!frame && visible && root) { last = 0; frame = requestAnimationFrame(tick); }
  }

  // idle: the mitigation switches can change between runs (the terminal flips them)
  function watchSwitches() {
    var boxes = [];
    for (var key in MIT_INPUTS) { var b = document.getElementById(MIT_INPUTS[key]); if (b) boxes.push(b); }
    setInterval(function () {
      if (model.running || !root) return;
      var m = mitigationNow(null), changed = false;
      for (var key in m) if (m[key] !== model.mit[key]) changed = true;
      if (changed) { model.mit = m; model.timeout = m.shortTimeout ? 5 : 30; writeReadout(); kick(); }
    }, 400);
    return boxes;
  }

  // ---- public ----------------------------------------------------------------------
  Lab.Backlog = {
    init: function (engine, container) {
      art = Lab.BacklogArt; I = Lab.Iso;
      if (!art || !I || !container) return;
      unsubs.forEach(function (u) { u(); });
      unsubs = [];
      if (!root) {
        G = art.geom; P = G.P;
        for (var i = 0; i < G.COLS * G.ROWS; i++) { slots[i] = 'free'; ages[i] = 0; }
        mount(container);
        watchSwitches();
      } else {
        Lab.Backlog.reset();
      }
      unsubs.push(engine.on('tick', onTick));
      unsubs.push(engine.on('packet', onPacket));
      var s = engine.getState();
      model.capacity = s.queue.capacity;
      model.mit = mitigationNow(s);
      model.timeout = model.mit.shortTimeout ? s.params.shortTimeoutSec : s.params.timeoutSec;
      shown.timer = model.timeout;
      writeReadout();
      drawParts();
      kick();
    },
    reset: function () {
      if (!root) return;
      while (tokens.length) removeToken(0);
      for (var i = 0; i < slots.length; i++) if (slots[i] !== 'free') setSlot(i, 'free');
      model.util = 0; model.pending = 0; model.running = false;
      writeReadout();
      kick();
    }
  };
})(window.Lab);
