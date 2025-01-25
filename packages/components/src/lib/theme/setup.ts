export function setupTheme() {
  try {
    const stored = localStorage.getItem('theme');
    if (!stored) return;
    const data = JSON.parse(stored);
    const { mode, primary, secondary } = data;
    const light =
      mode === 'light' ||
      (mode === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (light) {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      meta?.setAttribute('content', 'black');
    }
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
  } catch (err) {}
}
