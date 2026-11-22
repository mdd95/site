import { onMount } from 'svelte';
import { ARR_COLORS, ARR_MODES, KEY_COLOR, KEY_MODE, SET_MODES, setMode } from './theme.svelte.js';

const preload: (params: typeof config) => void = ([key, arr]) => {
    const color = window.localStorage.getItem(key.color);
    const mode = window.localStorage.getItem(key.mode);
    const root = document.documentElement;

    root.style.colorScheme =
        mode && new Set(arr.mode).has(mode) && mode !== 'system' ? mode : 'light dark';
    root.dataset.themeColor = color && new Set(arr.color).has(color) ? color : 'classic';
};

const config = [
    { color: KEY_COLOR, mode: KEY_MODE },
    { color: ARR_COLORS, mode: ARR_MODES }
] as const;

export const preloadScript = `<script>(${preload.toString()})(${JSON.stringify(config)});</script>`;

export function initTheme() {
    onMount(() => {
        const mode = window.localStorage.getItem(KEY_MODE);
        setMode(mode && SET_MODES.has(mode) ? mode : 'system', false);
    });
}
