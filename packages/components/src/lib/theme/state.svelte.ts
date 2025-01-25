import { browser } from '$app/environment';

export type Theme = {
  mode: 'system' | 'light' | 'dark';
  primary: string;
  secondary: string;
};

function createThemeState() {
  const DEFAULT = {
    mode: 'system',
    primary: 'oklch(0.6532 0.1854 33.46)',
    secondary: 'oklch(0.735 0.1195 61.68)'
  } satisfies Theme;

  if (!browser) return DEFAULT;

  let data = $state<Theme>(DEFAULT);
  const stored = localStorage.getItem('theme');

  if (stored) {
    try {
      data = JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse stored theme', err);
    }
  }

  function updateStored() {
    const { mode, primary, secondary } = data;
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
    localStorage.setItem('theme', JSON.stringify(data));
  }

  return {
    get mode() {
      return data.mode;
    },
    set mode(value) {
      data.mode = value;
      updateStored();
    },
    get primary() {
      return data.primary;
    },
    set primary(value) {
      data.primary = value;
      updateStored();
    },
    get secondary() {
      return data.secondary;
    },
    set secondary(value) {
      data.secondary = value;
      updateStored();
    }
  };
}

export const theme = createThemeState();
