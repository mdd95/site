import { getContext, setContext } from 'svelte';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemeColor = 'default' | `${string} ${string}`;

export type ThemeKeyConfig = {
	themeModeKey: string;
	themeColorKey: string;
};

export const themeContextKey = Symbol('theme');

export function setThemeContext(config: ThemeKeyConfig) {
	return setContext(themeContextKey, createThemeStates(config));
}

export function getThemeContext(): ReturnType<typeof createThemeStates> {
	return getContext(themeContextKey);
}

function createThemeStates(config: ThemeKeyConfig) {
	let mode = $state<ThemeMode>('system');
	let theme = $state<ThemeColor>('default');

	$effect(() => {
		const themeMode = localStorage.getItem(config.themeModeKey);
		const themeColor = localStorage.getItem(config.themeColorKey);

		if (isValidThemeMode(themeMode)) {
			mode = themeMode;
		}

		if (isValidThemeColor(themeColor)) {
			theme = themeColor;
		}
	});

	$effect(() => {
		localStorage.setItem(config.themeModeKey, mode);
		localStorage.setItem(config.themeColorKey, theme);

		const rootEl = document.documentElement;
		const lightMode =
			mode === 'light' ||
			(mode === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
		if (lightMode) {
			rootEl.classList.remove('dark');
		} else {
			rootEl.classList.add('dark');
		}
		rootEl.style.colorScheme = lightMode ? 'light' : 'dark';

		if (theme === 'default') {
		}
	});

	return {
		get mode() {
			return mode;
		},
		set mode(value: ThemeMode) {
			mode = value;
		},
		get theme() {
			return theme;
		},
		set theme(value: ThemeColor) {
			theme = value;
		}
	};
}

const modes = ['system', 'light', 'dark'];

export function isValidThemeMode(value: unknown): value is ThemeMode {
	if (typeof value !== 'string') return false;
	return modes.includes(value);
}

export function isValidThemeColor(value: unknown): value is ThemeColor {
	if (typeof value !== 'string') return false;
	if (value === 'default') return true;
	return value.split(' ').length === 2;
}
