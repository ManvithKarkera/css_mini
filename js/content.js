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
