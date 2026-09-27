// Hugging Face reports downloads over the last month. Refresh while the page is visible.
(() => {
  const counter = document.getElementById('lensvlm-downloads');
  if (!counter) return;

  const endpoint = 'https://huggingface.co/api/models/apple/LensVLM-9B?expand%5B%5D=downloads';
  const refreshInterval = 60_000;
  const numberFormat = new Intl.NumberFormat('en-US');
  let pending = false;
  let lastAttempt = 0;

  async function refreshDownloads() {
    if (pending || document.hidden) return;
    pending = true;
    lastAttempt = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    try {
      const response = await fetch(endpoint, {
        cache: 'no-store',
        credentials: 'omit',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Download count unavailable');
      const { downloads } = await response.json();
      if (!Number.isSafeInteger(downloads) || downloads < 0) {
        throw new Error('Invalid download count');
      }

      const count = numberFormat.format(downloads);
      counter.textContent = `↓ ${count}/mo`;
      counter.setAttribute('aria-label', `${count} downloads in the last month on Hugging Face`);
      counter.title = 'Downloads in the last month on Hugging Face; refreshed every minute';
      counter.hidden = false;
    } catch {
      // Keep the model link usable without showing a stale or invented count.
      counter.hidden = true;
    } finally {
      clearTimeout(timeout);
      pending = false;
    }
  }

  refreshDownloads();
  setInterval(refreshDownloads, refreshInterval);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Date.now() - lastAttempt >= refreshInterval) refreshDownloads();
  });
})();
