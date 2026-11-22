import { MediaQuery } from 'svelte/reactivity';

export const KEY_COLOR = 'theme-color';
export const KEY_MODE = 'theme-mode';

export const ARR_COLORS = ['classic', 'coffee'];
export const ARR_MODES = ['system', 'light', 'dark'];

export const SET_MODES = new Set(ARR_MODES);

let mode = $state('system');
const systemDark = new MediaQuery('(prefers-color-scheme: dark)');

function getSystemMode() {
    return systemDark.current ? 'dark' : 'light';
}

export function getMode() {
    return mode === 'system' ? getSystemMode() : mode;
}

export function setMode(value: string, persist: boolean = true) {
    if (!SET_MODES.has(value)) return;

    mode = value;
    document.documentElement.style.colorScheme = value === 'system' ? getSystemMode() : value;
    if (persist) window.localStorage.setItem(KEY_MODE, value);
}

export function toggleMode() {
    setMode(getMode() === 'light' ? 'dark' : 'light');
}
