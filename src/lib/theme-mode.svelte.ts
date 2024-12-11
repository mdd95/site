import { getContext, setContext, untrack } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemeColor = Record<string, any>;

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
	let themeColor = $state.raw<ThemeColor | null>(null);
	const systemDarkColorScheme = new MediaQuery('(prefers-color-scheme: dark)');

	$effect(() => {
		const storedThemeMode = localStorage.getItem(config.themeModeKey);
		const storedThemeColor = localStorage.getItem(config.themeColorKey);

		if (isValidThemeMode(storedThemeMode)) {
			themeMode = storedThemeMode;
		}
		if (storedThemeColor) {
			themeColor = JSON.parse(storedThemeColor);
		}
	});

	$effect(() => {
		if (untrack(() => themeMode) === 'system') {
			const rootEl = document.documentElement;
			const metaEl = document.querySelector('meta[name="theme-color"]');

			const lightMode = !systemDarkColorScheme.current;
			const theme = untrack(() => themeColor);

			rootEl.style.colorScheme = lightMode ? 'light' : 'dark';
			metaEl?.setAttribute(
				'content',
				// prettier-ignore
				theme
					? (lightMode ? theme.light : theme.dark)
					: (lightMode ? '#fff' : '#000')
			);
			lightMode ? rootEl.classList.remove('dark') : rootEl.classList.add('dark');
		}
	});

	return {
		get mode() {
			return themeMode;
		},
		get color() {
			return themeColor;
		},
		setMode(value: ThemeMode) {
			const rootEl = document.documentElement;
			const metaEl = document.querySelector('meta[name="theme-color"]');

			if (!isValidThemeMode(value)) return;
			themeMode = value;

			const lightMode =
				themeMode === 'light' || (themeMode === 'system' && !systemDarkColorScheme.current);
			rootEl.style.colorScheme = lightMode ? 'light' : 'dark';
			metaEl?.setAttribute(
				'content',
				// prettier-ignore
				themeColor
					? (lightMode ? themeColor.light : themeColor.dark)
					: (lightMode ? '#fff' : '#000')
			);
			lightMode ? rootEl.classList.remove('dark') : rootEl.classList.add('dark');
			localStorage.setItem(config.themeModeKey, themeMode);
		},
		async setColor(value: ThemeColor | null) {
			const rootEl = document.documentElement;
			const metaEl = document.querySelector('meta[name="theme-color"]');

			if (value === null) {
				themeColor = null;
				rootEl.dataset.theme = '';
				localStorage.setItem(config.themeColorKey, '');
				return;
			}
			themeColor = value;
			rootEl.dataset.theme = 'custom';
			const lightMode =
				themeMode === 'light' || (themeMode === 'system' && !systemDarkColorScheme.current);

			const res = await fetch('/api/theme_color/' + themeColor.ambient, { method: 'GET' });
			const theme = await res.json();
			metaEl?.setAttribute('content', lightMode ? theme.light : theme.dark);
			localStorage.setItem(config.themeColorKey, JSON.stringify({ ...themeColor, ...theme }));
		}
	};
}

const modes = ['system', 'light', 'dark'];

export function isValidThemeMode(value: unknown): value is ThemeMode {
	if (typeof value !== 'string') return false;
	return modes.includes(value);
}
