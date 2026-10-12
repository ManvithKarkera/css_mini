/* ==========================================================================
   terminal.js — OWNER: Manvith Karkera
   Purpose: the pop-up Linux terminal (Lab.Terminal). A drawer docked to the bottom
   of the page, opened from the header "Terminal" button. It runs commands through
   the pure simulated shell in js/workshop.js and owns the one shared host
   configuration. Whatever the student configures here (sysctl, iptables, nft) is
   evaluated into the four defences the simulation engine understands, which is how
   the terminal controls the mitigations in step 6.
   Nothing here touches the real machine.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  var host = null, listeners = [];
  var drawer, out, input, form, openBtn;
  var history = [], historyPos = 0;
  var tall = false;
  var wired = false;

  function $(id) { return document.getElementById(id); }
  function shell() { return Lab.Workshop.shell; }

  function print(text, cls) {
    var d = document.createElement('div');
    d.className = cls || 'ws-line';
    d.textContent = text;
    out.appendChild(d);
  }

  function motd() {
    var m = (Lab.Content.workshop && Lab.Content.workshop.harden.motd) || [];
    m.forEach(function (l) { print(l, 'ws-line ws-line--dim'); });
    print('Tip: type "help" for commands, or click a suggestion below.', 'ws-line ws-line--dim');
  }

  function notify(line, result) {
    listeners.slice().forEach(function (fn) { fn(host, line, result); });
  }

  function exec(line, silentEcho) {
    if (line.trim()) { history.push(line); historyPos = history.length; }
    if (!silentEcho) print('root@web01:~# ' + line, 'ws-line ws-line--cmd');
    var r = shell().run(host, line);
    if (r.clear) out.textContent = '';
    r.lines.forEach(function (l) { print(l); });
    out.scrollTop = out.scrollHeight;
    notify(line, r);
    return r;
  }

  function setOpen(open, focus) {
    if (!drawer) return;
    drawer.hidden = !open;
    document.body.classList.toggle('has-terminal', open);
    if (openBtn) { openBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); openBtn.classList.toggle('is-open', open); }
    if (open && focus !== false) input.focus({ preventScroll: true });
  }

  function wire() {
    if (wired) return;
    wired = true;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var cmd = input.value;
      input.value = '';
      exec(cmd);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); historyPos = Math.max(0, historyPos - 1); input.value = history[historyPos]; }
      else if (e.key === 'ArrowDown' && history.length) { e.preventDefault(); historyPos = Math.min(history.length, historyPos + 1); input.value = history[historyPos] || ''; }
      else if (e.key === 'Escape') { setOpen(false); if (openBtn) openBtn.focus(); }
    });
    out.addEventListener('click', function () { var sel = window.getSelection && window.getSelection(); if (!sel || sel.isCollapsed) input.focus(); });
    $('btn-term-close').addEventListener('click', function () { setOpen(false); if (openBtn) openBtn.focus(); });
    $('btn-term-clear').addEventListener('click', function () { out.textContent = ''; input.focus(); });
    $('btn-term-size').addEventListener('click', function () {
      tall = !tall;
      drawer.classList.toggle('is-tall', tall);
      $('btn-term-size').setAttribute('aria-label', tall ? 'Make the terminal shorter' : 'Make the terminal taller');
    });
    if (openBtn) openBtn.addEventListener('click', function () { setOpen(drawer.hidden, true); });
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote') && openBtn && !openBtn.hidden) { e.preventDefault(); setOpen(drawer.hidden, true); }
    });
    var chips = $('term-chips');
    if (chips) {
      var lab = document.createElement('span'); lab.className = 'ws-chips__label'; lab.textContent = 'Try:'; chips.appendChild(lab);
      ['help', 'ss -tan state syn-recv | wc -l', 'dmesg | tail', 'sysctl -a | grep syn', 'sysctl -w net.ipv4.tcp_syncookies=1', 'iptables -S'].forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = c;
        b.addEventListener('click', function () { input.value = c; input.focus(); });
        chips.appendChild(b);
      });
    }
  }

  Lab.Terminal = {
    init: function () {
      drawer = $('terminal-drawer'); out = $('ws-term-output'); input = $('ws-term-input'); form = $('ws-term-form'); openBtn = $('btn-terminal');
      host = shell().createHost();
      if (!drawer || !out || !input || !form) return;
      wire();
      out.textContent = '';
      motd();
    },
    reset: function () {
      host = shell().createHost();
      history = []; historyPos = 0;
      if (out) { out.textContent = ''; motd(); }
      setOpen(false, false);
    },
    getHost: function () { return host; },
    getDefences: function () { return shell().evaluate(host); },
    setLevel: function (level) { if (host) host.level = level; },
    on: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; },
    open: function (focus) { setOpen(true, focus); },
    close: function () { setOpen(false, false); },
    isOpen: function () { return !!drawer && !drawer.hidden; },
    exec: function (line) { return exec(line, false); }       // runs a command as if typed (used by tests)
  };
})(window.Lab);
