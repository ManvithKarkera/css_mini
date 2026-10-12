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
