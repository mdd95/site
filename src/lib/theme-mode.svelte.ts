import { getContext, setContext, untrack } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

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
	let themeMode = $state<ThemeMode>('system');
	let themeColor = $state<ThemeColor>('default');
	const systemDarkColorScheme = new MediaQuery('(prefers-color-scheme: dark)');

	$effect(() => {
		const storedThemeMode = localStorage.getItem(config.themeModeKey);
		const storedThemeColor = localStorage.getItem(config.themeColorKey);

		if (isValidThemeMode(storedThemeMode)) {
			themeMode = storedThemeMode;
		}

		if (isValidThemeColor(storedThemeColor)) {
			themeColor = storedThemeColor;
		}
	});

	$effect(() => {
		if (untrack(() => themeMode) === 'system') {
			const lightMode = !systemDarkColorScheme.current;
			const rootEl = document.documentElement;
			rootEl.style.colorScheme = lightMode ? 'light' : 'dark';

			if (lightMode) {
				rootEl.classList.remove('dark');
			} else {
				rootEl.classList.add('dark');
			}
		}
	});

	return {
		get mode() {
			return themeMode;
		},
		set mode(value: ThemeMode) {
			if (!isValidThemeMode(value as unknown)) return;
			themeMode = value;
			localStorage.setItem(config.themeModeKey, themeMode);

			const rootEl = document.documentElement;
			const lightMode =
				themeMode === 'light' || (themeMode === 'system' && !systemDarkColorScheme.current);
			rootEl.style.colorScheme = lightMode ? 'light' : 'dark';

			if (lightMode) {
				rootEl.classList.remove('dark');
			} else {
				rootEl.classList.add('dark');
			}
		},
		get color() {
			return themeColor;
		},
		set color(value: ThemeColor) {
			if (!isValidThemeColor(value as unknown)) return;
			themeColor = value;
			localStorage.setItem(config.themeColorKey, themeColor);
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
