// Smooth the original photo at the display's pixel density to avoid backdrop moiré.
// The original image stays in the markup as the accessible, no-JavaScript fallback.
(() => {
  const portrait = document.querySelector('.portrait');
  if (!portrait) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'portrait-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) return;
  let lastSize = 0;

  function render() {
    if (!portrait.complete || !portrait.naturalWidth) return;
    const sourceSize = Math.min(portrait.naturalWidth, portrait.naturalHeight);
    const size = Math.min(sourceSize, Math.round(portrait.clientWidth * (window.devicePixelRatio || 1)));
    if (!size || size === lastSize) return;

    // Match the existing square crop: horizontally centered, aligned to the top.
    let source = portrait;
    let edge = sourceSize;
    let sourceX = (portrait.naturalWidth - sourceSize) / 2;
    // Smaller steps also improve scaling in browsers without high-quality smoothing.
    while (edge > size * 2) {
      const step = document.createElement('canvas');
      step.width = step.height = Math.round(edge / 2);
      const stepContext = step.getContext('2d');
      if (!stepContext) break;
      stepContext.imageSmoothingEnabled = true;
      stepContext.imageSmoothingQuality = 'high';
      stepContext.drawImage(source, sourceX, 0, edge, edge, 0, 0, step.width, step.height);
      source = step;
      edge = step.width;
      sourceX = 0;
    }

    canvas.width = canvas.height = size;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(source, sourceX, 0, edge, edge, 0, 0, size, size);
    if (!canvas.isConnected) portrait.after(canvas);
    portrait.parentElement.classList.add('portrait-rendered');
    lastSize = size;
  }

  portrait.addEventListener('load', render, { once: true });
  window.addEventListener('resize', render);
  if ('ResizeObserver' in window) new ResizeObserver(render).observe(portrait);
  render();
})();
