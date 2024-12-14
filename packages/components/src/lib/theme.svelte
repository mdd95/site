<script lang="ts" module>
  import { getContext, setContext, untrack } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { browser } from '$app/environment';

  export const THEME_MODE = 'theme-mode';
  export const THEME_COLORS = 'theme-colors';
  export const THEME_CONTEXT_KEY = Symbol('theme');

  export type ThemeMode = 'system' | 'light' | 'dark';
  export type ThemeColors = {
    backdrop: string;
    primary: string;
  };

  export function setTheme() {
    return setContext(THEME_CONTEXT_KEY, setupTheme());
  }

  export function getTheme(): ReturnType<typeof setTheme> {
    return getContext(THEME_CONTEXT_KEY);
  }

  function setupTheme(): {
    mode: ThemeMode;
    colors: ThemeColors | null;
    toggleMode?: () => void;
    resetMode?: () => void;
  } {
    if (!browser) return { mode: 'system', colors: null };

    let mode = $state<ThemeMode>(window.themeMode || 'system');
    let colors = $state.raw<ThemeColors | null>(window.themeColors);
    const dark = new MediaQuery('(prefers-color-scheme: dark)');

    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');

    $effect(() => {
      if (untrack(() => mode) == 'system') {
        const light = !dark.current;
        const ucolors = untrack(() => colors);

        root.style.colorScheme = light ? 'light' : 'dark';
        meta?.setAttribute(
          'content',
          // prettier-ignore
          ucolors
            ? `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${ucolors.backdrop})`
            : light ? '#fff' : '#000'
        );
        light ? root.classList.remove('dark') : root.classList.add('dark');
      }
    });

    const setMode = (value: ThemeMode) => {
      mode = value;
      window.themeMode = value;

      const light = mode == 'light' || (mode == 'system' && !dark.current);
      root.style.colorScheme = light ? 'light' : 'dark';
      meta?.setAttribute(
        'content',
        // prettier-ignore
        colors
          ? `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${colors.backdrop})`
          : light ? '#fff' : '#000'
      );
      light ? root.classList.remove('dark') : root.classList.add('dark');
      localStorage.setItem(THEME_MODE, mode);
    };

    const setColors = (value: ThemeColors | null) => {
      const light = mode == 'light' || (mode == 'system' && !dark.current);

      if (value == null) {
        root.style.removeProperty('--backdrop');
        root.style.removeProperty('--primary');
        root.dataset.theme = '';
        meta?.setAttribute('content', light ? '#fff' : '#000');

        colors = null;
        window.themeColors = null;
        localStorage.setItem(THEME_COLORS, '');
        return;
      }

      root.style.setProperty('--backdrop', value.backdrop);
      root.style.setProperty('--primary', value.primary);
      root.dataset.theme = 'custom';
      meta?.setAttribute(
        'content',
        `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${value.backdrop})`
      );

      colors = value;
      window.themeColors = value;
      localStorage.setItem(THEME_COLORS, JSON.stringify(value));
    };

    return {
      get mode() {
        return mode;
      },
      set mode(value: ThemeMode) {
        setMode(value);
      },
      get colors() {
        return colors;
      },
      set colors(value: ThemeColors | null) {
        setColors(value);
      },
      toggleMode() {
        setMode(
          // prettier-ignore
          mode == 'system'
            ? (dark.current ? 'light' : 'dark')
            : (mode == 'light' ? 'dark' : 'light')
        );
      },
      resetMode() {
        setMode('system');
      }
    };
  }
</script>

<script lang="ts">
  type ThemeStoreKeys = {
    mode: string;
    colors: string;
  };

  function initTheme(storeKeys: ThemeStoreKeys) {
    const mode = localStorage.getItem(storeKeys.mode) || 'system';
    const colors = localStorage.getItem(storeKeys.colors);
    const light =
      mode == 'light' ||
      (mode == 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);

    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');

    if (light) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      meta?.setAttribute('content', '#000');
    }
    root.style.colorScheme = light ? 'light' : 'dark';
    window.themeMode = mode as ThemeMode;

    if (colors) {
      const data: ThemeColors = JSON.parse(colors);
      window.themeColors = data;

      root.style.setProperty('--backdrop', data.backdrop);
      root.style.setProperty('--primary', data.primary);
      root.dataset.theme = 'custom';
      meta?.setAttribute(
        'content',
        `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${data.backdrop})`
      );
    }
  }

  const themeStoreKeys = {
    mode: THEME_MODE,
    colors: THEME_COLORS
  };
</script>

<svelte:head>
  <meta name="theme-color" content="#fff" />
  {@html `<script nonce>(${initTheme.toString()})(${JSON.stringify(themeStoreKeys)});</script>`}
</svelte:head>
