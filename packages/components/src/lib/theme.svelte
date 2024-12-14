<script lang="ts" module>
  import { getContext, setContext, untrack } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { browser } from '$app/environment';

  export type DeepRequired<T> = T extends Function | Date | RegExp
    ? T
    : T extends Array<infer U>
      ? DeepRequired<U>[]
      : T extends object
        ? { [K in keyof T]-?: DeepRequired<T[K]> }
        : T;

  export type ThemeMode = 'system' | 'light' | 'dark';
  export type ThemeColors = Record<string, string>;
  export type ThemeStoreKeys = {
    mode?: string;
    colors?: string;
  };

  export type ThemeConfig = {
    mode?: ThemeMode;
    colors?: ThemeColors | null;
    storeKeys?: ThemeStoreKeys;
  };

  export type ThemeProps = {
    theme: DeepRequired<ThemeConfig>;
  };

  export const themeContextKey = Symbol('theme');

  export function setTheme(config: ThemeConfig = {}) {
    return setContext(themeContextKey, setupTheme(config));
  }

  export function getTheme(): ReturnType<typeof setTheme> {
    return getContext(themeContextKey);
  }

  function setupTheme(config: ThemeConfig = {}): DeepRequired<ThemeConfig> & {
    toggleMode?: () => void;
    resetMode?: () => void;
  } {
    if (!browser) {
      return { mode: 'system', colors: null, storeKeys: { mode: '', colors: '' } };
    }
    let mode = $state<ThemeMode>(config.mode || window.themeMode || 'system');
    let colors = $state.raw<ThemeColors | null>(config.colors || window.themeColors || null);
    const dark = new MediaQuery('(prefers-color-scheme: dark)');

    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');

    const modeStoreKey = config.storeKeys?.mode || 'theme-mode';
    const colorStoreKey = config.storeKeys?.colors || 'theme-colors';

    $effect(() => {
      if (untrack(() => mode) == 'system') {
        const light = !dark.current;
        const ucolors = untrack(() => colors);

        root.style.colorScheme = light ? 'light' : 'dark';
        meta?.setAttribute(
          'content',
          // prettier-ignore
          ucolors
            ? `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${ucolors.background})`
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
          ? `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${colors.background})`
          : light ? '#fff' : '#000'
      );
      light ? root.classList.remove('dark') : root.classList.add('dark');
      localStorage.setItem(modeStoreKey, mode);
    };

    const setColors = (value: ThemeColors | null) => {
      const light = mode == 'light' || (mode == 'system' && !dark.current);

      if (value == null) {
        for (const [key] of Object.entries(colors || {})) {
          root.style.removeProperty(`--${key}`);
        }
        root.dataset.theme = '';
        meta?.setAttribute('content', light ? '#fff' : '#000');

        colors = null;
        window.themeColors = null;
        localStorage.setItem(colorStoreKey, '');
        return;
      }
      for (const [key] of Object.entries(colors || {})) {
        root.style.setProperty(`--${key}`, value[key]);
      }
      root.dataset.theme = 'custom';
      meta?.setAttribute(
        'content',
        `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${value.background})`
      );

      colors = value;
      window.themeColors = value;
      localStorage.setItem(colorStoreKey, JSON.stringify(value));
    };

    return {
      storeKeys: {
        mode: modeStoreKey,
        colors: colorStoreKey
      },
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
  let { theme }: ThemeProps = $props();

  function initTheme(storeKeys: Required<ThemeStoreKeys>) {
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
      const parsed = JSON.parse(colors);
      window.themeColors = parsed;
      root.dataset.theme = 'custom';
      for (const [key, val] of Object.entries(parsed)) {
        root.style.setProperty(`--${key}`, `${val}`);
      }
      meta?.setAttribute(
        'content',
        `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${parsed.background})`
      );
    }
  }
</script>

<svelte:head>
  <meta name="theme-color" content="#fff" />
  {@html `<script nonce>(${initTheme.toString()})(${JSON.stringify(theme.storeKeys)});</script>`}
</svelte:head>
