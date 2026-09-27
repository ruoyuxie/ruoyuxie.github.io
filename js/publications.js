// Show one citation at a time, with keyboard-accessible controls.
document.querySelector('.recent-publications').addEventListener('click', (event) => {
  const button = event.target.closest('button[aria-controls]');
  if (!button) return;

  const panel = document.getElementById(button.getAttribute('aria-controls'));
  if (!panel) return;
  const shouldOpen = panel.hidden;

  document.querySelectorAll('.paper-links button[aria-controls]').forEach((control) => {
    control.setAttribute('aria-expanded', 'false');
    document.getElementById(control.getAttribute('aria-controls')).hidden = true;
  });

  panel.hidden = !shouldOpen;
  button.setAttribute('aria-expanded', String(shouldOpen));
});
