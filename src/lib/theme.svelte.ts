import { browser } from '$app/environment';

export type Theme = {
  mode: 'system' | 'light' | 'dark';
  primary: string;
  secondary: string;
};

export function createThemeState() {
  const DEFAULT: Theme = {
    mode: 'system',
    primary: 'oklch(0.6532 0.1854 33.46)',
    secondary: 'oklch(0.735 0.1195 61.68)'
  };

  let theme = $state(DEFAULT);

  if (browser) {
    const stored = localStorage.getItem('theme');
    if (stored) {
      try {
        theme = JSON.parse(stored);
      } catch (err) {}
    }
  }

  function handleChange() {
    const { mode, primary, secondary } = theme;
    const root = document.documentElement;

    switch (mode) {
      case 'light':
        root.style.colorScheme = 'light';
        break;
      case 'dark':
        root.style.colorScheme = 'dark';
        break;
      case 'system':
        root.style.removeProperty('color-scheme');
        break;
    }

    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
    localStorage.setItem('theme', JSON.stringify(theme));
  }

  return {
    isDarkMode() {
      if (!browser) return false;
      return (
        theme.mode === 'dark' ||
        (theme.mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
      );
    },

    get mode() {
      return theme.mode;
    },
    set mode(value) {
      theme.mode = value;
      handleChange();
    },
    toggleMode() {
      theme.mode = this.isDarkMode() ? 'light' : 'dark';
      handleChange();
    },

    get primary() {
      return theme.primary;
    },
    set primary(value) {
      theme.primary = value;
      handleChange();
    },

    get secondary() {
      return theme.secondary;
    },
    set secondary(value) {
      theme.secondary = value;
      handleChange();
    }
  };
}

export const theme = createThemeState();
