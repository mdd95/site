export function initializeTheme() {
  try {
    const stored = localStorage.getItem('theme');
    if (!stored) return;

    const { mode, primary, secondary } = JSON.parse(stored);
    const root = document.documentElement;

    switch (mode) {
      case 'light':
        root.style.colorScheme = 'light';
        break;
      case 'dark':
        root.style.colorScheme = 'dark';
        break;
    }

    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
  } catch (err) {
    console.error('Failed to parse stored theme', err);
  }
}
