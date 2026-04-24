// Simple tweak panel wiring — shared across screens
(function () {
  const panel = document.querySelector('.tweaks-panel');
  if (!panel) return;

  // Toggle via host iframe
  let active = false;
  function apply() { panel.classList.toggle('open', active); }
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') { active = true; apply(); }
    if (d.type === '__deactivate_edit_mode') { active = false; apply(); }
  });
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (_) {}

  // Make tweaks always visible if panel already has 'open' (standalone viewing)
  // Handle segmented buttons
  document.querySelectorAll('.tweaks-seg').forEach((seg) => {
    const key = seg.getAttribute('data-key');
    const targetAttr = seg.getAttribute('data-attr') || 'data-variant';
    seg.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        seg.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.value;
        // Apply to all frames
        document.querySelectorAll(`[data-tweak="${key}"]`).forEach((el) => {
          el.setAttribute(targetAttr, val);
        });
        document.documentElement.setAttribute(`data-tw-${key}`, val);
      });
    });
  });

  // Ensure visibility toggle button also works
  const toggleBtn = document.querySelector('[data-tweaks-toggle]');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      active = !active; apply();
    });
  }
})();
