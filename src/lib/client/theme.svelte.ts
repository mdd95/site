import { onMount } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

export const KEY_COLOR = 'theme-color';
export const KEY_MODE = 'theme-mode';

const preload: (params: typeof config) => void = ([key, arr]) => {
	const color = window.localStorage.getItem(key.color);
	const mode = window.localStorage.getItem(key.mode);
	const root = document.documentElement;

	root.style.colorScheme =
		mode && new Set(arr.mode).has(mode) && mode !== 'system' ? mode : 'light dark';
	root.dataset.themeColor = color && new Set(arr.color).has(color) ? color : 'classic';
};

const ARR_COLORS = ['classic', 'coffee'];
const ARR_MODES = ['system', 'light', 'dark'];

const config = [
	{ color: KEY_COLOR, mode: KEY_MODE },
	{ color: ARR_COLORS, mode: ARR_MODES }
] as const;

export const preloadScript = `<script>(${preload.toString()})(${JSON.stringify(config)});</script>`;

let mode = $state('system');
const systemDark = new MediaQuery('(prefers-color-scheme: dark)');

export const SET_MODES = new Set(ARR_MODES);

function getSystemMode() {
	return systemDark.current ? 'dark' : 'light';
}

export function getMode() {
	return mode === 'system' ? getSystemMode() : mode;
}

export function setMode(value: string) {
	if (!SET_MODES.has(value)) return;

	mode = value;
	document.documentElement.style.colorScheme = value;
	window.localStorage.setItem(KEY_MODE, value);
}

export function toggleMode() {
	setMode(getMode() === 'light' ? 'dark' : 'light');
}

export function initTheme() {
	onMount(() => {
		const mode = window.localStorage.getItem(KEY_MODE);
		setMode(mode && SET_MODES.has(mode) ? mode : 'system');
	});
}
