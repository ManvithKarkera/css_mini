/* ==========================================================================
   certificate.js — OWNER: Meet Mangaonkar
   Purpose: Lab Completion Certificate – renders a polished in-page certificate
   and provides a browser-print-to-PDF download. Reads all metadata from
   Lab.Content (no hardcoding). Only activates after a genuine lab completion.

   Design: pure HTML/CSS, no external libraries. PDF is produced via the
   browser's built-in print dialog (Ctrl+P / Save as PDF), which is the most
   reliable cross-browser approach without adding dependencies. A dedicated
   print stylesheet in certificate.css hides everything else so the printed
   output is exactly the certificate document.
   ========================================================================== */
window.Lab = window.Lab || {};
(function (Lab) {
  'use strict';

  /* ---- helpers ---------------------------------------------------------- */
  function $(id) { return document.getElementById(id); }

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function svg(paths) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    paths.forEach(function (d) {
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      s.appendChild(p);
    });
    return s;
  }

  /* ---- module state ----------------------------------------------------- */
  var _labCompleted = false;
  var _completionDate = null;

  /* ---- public API ------------------------------------------------------- */

  /**
   * Call this from workflow.js once the lab is genuinely complete.
   * @param {Date} [date] – optional override; defaults to now.
   */
  function markComplete(date) {
    _labCompleted = true;
    _completionDate = date || new Date();
    var section = $('certificate-section');
    if (section) section.hidden = false;
    /* pre-fill the hidden date field in the feedback form */
    var dateInput = $('feedback-completion-date');
    if (dateInput) dateInput.value = formatDate(_completionDate);
  }

  /* ---- date formatting -------------------------------------------------- */
  function formatDate(d) {
    try {
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return d.toDateString();
    }
  }

  /* ---- certificate document builder ------------------------------------ */
  function buildCertDoc(participantName) {
    var C = Lab.Content;
    var labTitle = (C && C.title) ? C.title : 'SYN Flood Virtual Lab';
    var objective = (C && C.objective) ? C.objective : 'Demonstrate the effect of a SYN Flood attack on network availability.';
    var completionMsg = (C && C.completion && C.completion.message) ? C.completion.message : '';
    var completionDate = _completionDate ? formatDate(_completionDate) : formatDate(new Date());

    /* wrapper */
    var doc = el('div', { id: 'certificate-doc', role: 'document', 'aria-label': 'Certificate of Completion' });

    /* decorative frame ring */
    var frame = el('div', { 'class': 'cert-frame', 'aria-hidden': 'true' });
    doc.appendChild(frame);

    /* corner ornaments (SVG flourishes) */
    ['tl', 'tr', 'bl', 'br'].forEach(function (pos) {
      var orn = el('div', { 'class': 'cert-ornament cert-ornament--' + pos, 'aria-hidden': 'true' });
      var ornSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ornSvg.setAttribute('viewBox', '0 0 48 48');
      ornSvg.setAttribute('fill', 'none');
      ornSvg.innerHTML =
        '<path d="M4 4 L4 20 Q4 4 20 4 Z" stroke="#1a56f0" stroke-width="2" fill="none"/>' +
        '<path d="M4 4 L4 8 Q4 4 8 4 Z" fill="#1a56f0"/>';
      orn.appendChild(ornSvg);
      doc.appendChild(orn);
    });

    /* inner content */
    var inner = el('div', { 'class': 'cert-inner' });

    /* seal */
    var seal = el('div', { 'class': 'cert-seal', 'aria-hidden': 'true' });
    var sealSvg = svg([
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    ]);
    seal.appendChild(sealSvg);
    inner.appendChild(seal);

    /* supra label */
    inner.appendChild(el('p', { 'class': 'cert-label' }, 'Certificate of Completion'));

    /* main heading */
    var heading = el('h2', { 'class': 'cert-title' }, 'Academic Achievement\u200Bin Cybersecurity');
    inner.appendChild(heading);

    /* divider */
    var div1 = el('div', { 'class': 'cert-divider', 'aria-hidden': 'true' });
    div1.appendChild(el('span', { 'class': 'cert-divider-diamond' }));
    inner.appendChild(div1);

    /* presented to */
    inner.appendChild(el('p', { 'class': 'cert-presented' }, 'This certifies that'));

    /* participant name */
    inner.appendChild(el('p', { 'class': 'cert-name', id: 'cert-rendered-name' }, participantName));

    /* statement */
    var stmt = el('p', { 'class': 'cert-statement' });
    var expSpan = el('span', { 'class': 'cert-experiment' }, labTitle);
    stmt.appendChild(document.createTextNode('has successfully completed the '));
    stmt.appendChild(expSpan);
    stmt.appendChild(document.createTextNode(
      ' and demonstrated understanding of TCP SYN flood attacks, denial-of-service mitigation strategies, and network defence principles through guided simulation and assessment.'
    ));
    inner.appendChild(stmt);

    /* second divider */
    var div2 = el('div', { 'class': 'cert-divider', 'aria-hidden': 'true' });
    div2.appendChild(el('span', { 'class': 'cert-divider-diamond' }));
    inner.appendChild(div2);

    /* footer: date + lab */
    var footer = el('div', { 'class': 'cert-footer' });

    var colLeft = el('div', { 'class': 'cert-footer-col' });
    colLeft.appendChild(el('span', { 'class': 'cert-footer-label' }, 'Completion date'));
    colLeft.appendChild(el('span', { 'class': 'cert-footer-value', id: 'cert-rendered-date' }, completionDate));
    footer.appendChild(colLeft);

    var colRight = el('div', { 'class': 'cert-footer-col cert-footer-col--right' });
    colRight.appendChild(el('span', { 'class': 'cert-footer-label' }, 'Lab / Course'));
    colRight.appendChild(el('span', { 'class': 'cert-footer-value' }, labTitle));
    footer.appendChild(colRight);

    inner.appendChild(footer);
    doc.appendChild(inner);

    return doc;
  }

  /* ---- generate + show -------------------------------------------------- */
  function generateCertificate() {
    if (!_labCompleted) return;

    var nameInput = $('cert-name-input');
    var errEl = $('cert-name-error');
    var name = nameInput ? nameInput.value.trim() : '';

    /* validation */
    if (errEl) errEl.textContent = '';
    if (nameInput) nameInput.classList.remove('is-invalid');

    if (!name) {
      if (errEl) errEl.textContent = 'Please enter your full name.';
      if (nameInput) { nameInput.classList.add('is-invalid'); nameInput.focus(); }
      return;
    }
    if (name.length > 120) {
      if (errEl) errEl.textContent = 'Name is too long (120 characters maximum).';
      if (nameInput) { nameInput.classList.add('is-invalid'); nameInput.focus(); }
      return;
    }

    /* build/replace certificate doc */
    var previewWrap = $('certificate-preview-wrap');
    var oldDoc = $('certificate-doc');
    if (oldDoc) oldDoc.parentNode.removeChild(oldDoc);

    var newDoc = buildCertDoc(name);
    /* insert before the actions row */
    var actionsRow = previewWrap.querySelector('.certificate-actions');
    previewWrap.insertBefore(newDoc, actionsRow);

    previewWrap.classList.remove('is-hidden');
    previewWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---- download — popup with self-contained HTML so PDF = preview -------- */
  function downloadCertificate() {
    if (!_labCompleted) return;
    var nameInput = $('cert-name-input');
    var name = nameInput ? nameInput.value.trim() : '';
    if (!name) { generateCertificate(); return; }   // re-trigger validation if empty
    var safeName = name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'Participant';

    var doc = $('certificate-doc');
    if (!doc) { generateCertificate(); return; }

    /* Collect the certificate's outer HTML */
    var certHTML = doc.outerHTML;

    /* All the CSS that makes the certificate look exactly as on screen, fully
       self-contained — no external file references, no CSS variables (resolved
       to real values), no @media print tricks needed in the popup. */
    var CERT_CSS = [
      '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
      'html, body { width: 210mm; height: 297mm; background: #fff; font-family: "Urbanist", "Segoe UI", Roboto, Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }',
      'body { display: flex; align-items: center; justify-content: center; padding: 12mm; }',

      /* Document card */
      '#certificate-doc { width: 100%; max-width: 100%; background: #fff; border: 1px solid #dcdee2; border-radius: 28px; overflow: hidden; position: relative; page-break-inside: avoid; }',
      '#certificate-doc::before { content: ""; display: block; height: 10px; background: linear-gradient(90deg, #102a63 0%, #1a56f0 50%, #4f8bff 100%); -webkit-print-color-adjust: exact; print-color-adjust: exact; }',

      /* Inner padding */
      '.cert-inner { padding: 44px 56px 40px; text-align: center; position: relative; }',

      /* Decorative frame */
      '.cert-frame { position: absolute; inset: 18px; border: 1.5px solid rgba(26,86,240,0.30); border-radius: 22px; pointer-events: none; }',

      /* Seal */
      '.cert-seal { display: flex; align-items: center; justify-content: center; width: 88px; height: 88px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #102a63 0%, #1a56f0 60%, #4f8bff 100%); box-shadow: 0 0 0 5px #fff, 0 0 0 8px rgba(26,86,240,0.30), 0 8px 24px rgba(26,86,240,0.30); -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
      '.cert-seal svg { width: 44px; height: 44px; fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }',

      /* Corner ornaments */
      '.cert-ornament { position: absolute; width: 48px; height: 48px; opacity: 0.18; }',
      '.cert-ornament--tl { top: 30px; left: 30px; }',
      '.cert-ornament--tr { top: 30px; right: 30px; transform: scaleX(-1); }',
      '.cert-ornament--bl { bottom: 30px; left: 30px; transform: scaleY(-1); }',
      '.cert-ornament--br { bottom: 30px; right: 30px; transform: scale(-1); }',

      /* Typography */
      '.cert-label { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #5c6067; margin: 0 0 8px; }',
      '.cert-title { font-size: 2rem; font-weight: 700; color: #102a63; letter-spacing: -0.02em; line-height: 1.15; margin: 0 0 16px; }',

      /* Divider */
      '.cert-divider { display: flex; align-items: center; gap: 12px; margin: 0 auto 16px; max-width: 480px; }',
      '.cert-divider::before { content: ""; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(26,86,240,0.40)); }',
      '.cert-divider::after  { content: ""; flex: 1; height: 1px; background: linear-gradient(270deg, transparent, rgba(26,86,240,0.40)); }',
      '.cert-divider-diamond { width: 8px; height: 8px; background: #1a56f0; transform: rotate(45deg); border-radius: 2px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }',

      /* Name + statement */
      '.cert-presented { font-size: 0.9375rem; color: #5c6067; margin: 0 0 8px; }',
      '.cert-name { font-size: 2.25rem; font-weight: 700; color: #102a63; letter-spacing: -0.01em; font-style: italic; line-height: 1.2; margin: 0 0 16px; border-bottom: 2px solid rgba(26,86,240,0.25); padding-bottom: 12px; display: inline-block; min-width: 240px; }',
      '.cert-statement { font-size: 0.975rem; color: #1c1d20; line-height: 1.7; max-width: 56ch; margin: 0 auto 16px; }',
      '.cert-experiment { display: inline; font-weight: 700; color: #102a63; }',

      /* Footer */
      '.cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid #dcdee2; gap: 16px; }',
      '.cert-footer-col { display: flex; flex-direction: column; gap: 2px; }',
      '.cert-footer-col--right { align-items: flex-end; text-align: right; }',
      '.cert-footer-label { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #5c6067; }',
      '.cert-footer-value { font-size: 0.9375rem; font-weight: 600; color: #1c1d20; }',

      /* Print */
      '@media print {',
      '  @page { size: A4 landscape; margin: 10mm; }',
      '  html, body { width: auto; height: auto; }',
      '  body { padding: 0; }',
      '  #certificate-doc { border: none; border-radius: 0; }',
      '}'
    ].join('\n');

    var popupHTML = '<!DOCTYPE html><html lang="en"><head>' +
      '<meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>Lab_Completion_Certificate_' + safeName + '</title>' +
      '<style>' + CERT_CSS + '</style>' +
      '</head><body>' +
      certHTML +
      '<script>' +
        'window.onload = function() {' +
          'setTimeout(function() { window.print(); }, 300);' +
        '};' +
      '<\/script>' +
      '</body></html>';

    var popup = window.open('', '_blank', 'width=900,height=650,scrollbars=yes,resizable=yes');
    if (!popup) {
      alert('Pop-up blocked. Please allow pop-ups for this page and try again.');
      return;
    }
    popup.document.open();
    popup.document.write(popupHTML);
    popup.document.close();
  }

  /* ---- reset state (updated to cover feedback elements) -------------------- */
  function reset() {
    _labCompleted = false;
    _completionDate = null;
    var section = $('certificate-section');
    if (section) section.hidden = true;
    var wrap = $('certificate-preview-wrap');
    if (wrap) wrap.classList.add('is-hidden');
    var nameInput = $('cert-name-input');
    if (nameInput) nameInput.value = '';
    var errEl = $('cert-name-error');
    if (errEl) errEl.textContent = '';

    /* reset feedback form */
    var feedbackForm = $('feedback-form');
    if (feedbackForm) feedbackForm.reset();
    var feedbackWrap = $('feedback-wrap');
    if (feedbackWrap) feedbackWrap.hidden = false;
    var feedbackSuccess = $('feedback-success');
    if (feedbackSuccess) feedbackSuccess.hidden = true;
    var nameWrap = $('certificate-name-wrap');
    if (nameWrap) nameWrap.hidden = true;
    var statusEl = $('feedback-form-status');
    if (statusEl) { statusEl.textContent = ''; statusEl.className = 'feedback-status'; }
    resetStarHighlight();
  }

  /* ---- star rating interactivity ---------------------------------------- */
  function resetStarHighlight() {
    var stars = document.querySelectorAll('.feedback-rating__star');
    stars.forEach(function (star) { star.querySelector('span').style.color = ''; });
  }

  function highlightStars(upTo) {
    var stars = document.querySelectorAll('.feedback-rating__star');
    stars.forEach(function (star, idx) {
      star.querySelector('span').style.color = idx < upTo ? '#f5a623' : '';
    });
  }

  function initStarRating() {
    var stars = document.querySelectorAll('.feedback-rating__star');
    stars.forEach(function (star, idx) {
      /* hover: highlight up to this star */
      star.addEventListener('mouseenter', function () { highlightStars(idx + 1); });
      star.addEventListener('mouseleave', function () {
        /* revert to the checked radio's value */
        var checked = document.querySelector('.feedback-rating__star input:checked');
        highlightStars(checked ? parseInt(checked.value, 10) : 0);
      });
      /* click / keyboard selects */
      star.querySelector('input').addEventListener('change', function () {
        highlightStars(idx + 1);
      });
    });
  }

  /* ---- reveal the name-input section ------------------------------------ */
  function revealNameInput() {
    var nameWrap = $('certificate-name-wrap');
    if (nameWrap) {
      nameWrap.hidden = false;
      nameWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(function () { var ni = $('cert-name-input'); if (ni) ni.focus(); }, 300);
    }
  }

  /* ---- feedback form submission (Web3Forms) ----------------------------- */
  function initFeedbackForm() {
    var form       = $('feedback-form');
    var skipBtn    = $('btn-skip-feedback');
    var statusEl   = $('feedback-form-status');
    var successDiv = $('feedback-success');
    var feedbackWrap = $('feedback-wrap');

    /* pre-fill hidden date field */
    var dateInput = $('feedback-completion-date');
    if (dateInput && _completionDate) dateInput.value = formatDate(_completionDate);

    if (skipBtn) {
      skipBtn.addEventListener('click', function () {
        if (feedbackWrap) feedbackWrap.hidden = true;
        revealNameInput();
      });
    }

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* require a rating */
      var rated = form.querySelector('input[name="rating"]:checked');
      if (!rated) {
        if (statusEl) { statusEl.textContent = 'Please select a star rating before submitting.'; statusEl.className = 'feedback-status is-error'; }
        return;
      }

      var submitBtn = $('btn-submit-feedback');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      if (statusEl) { statusEl.textContent = ''; statusEl.className = 'feedback-status'; }

      var data = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            /* show success message, hide form */
            if (form) form.hidden = true;
            if (successDiv) successDiv.hidden = false;
            revealNameInput();
          } else {
            throw new Error(json.message || 'Submission failed.');
          }
        })
        .catch(function (err) {
          if (statusEl) {
            statusEl.textContent = 'Could not send feedback (' + (err.message || 'network error') + '). You can skip and still get your certificate.';
            statusEl.className = 'feedback-status is-error';
          }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Feedback'; }
        });
    });
  }

  /* ---- init ------------------------------------------------------------- */
  function init() {
    var btnGenerate = $('btn-generate-certificate');
    var btnDownload = $('btn-download-certificate');
    if (btnGenerate) btnGenerate.addEventListener('click', generateCertificate);
    if (btnDownload) btnDownload.addEventListener('click', downloadCertificate);

    /* Allow Enter key in name field to trigger generation */
    var nameInput = $('cert-name-input');
    if (nameInput) {
      nameInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); generateCertificate(); }
      });
    }

    initStarRating();
    initFeedbackForm();
  }

  /* ---- export ----------------------------------------------------------- */
  Lab.Certificate = { init: init, markComplete: markComplete, reset: reset };

})(window.Lab);
