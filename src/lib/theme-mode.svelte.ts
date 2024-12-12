import { getContext, setContext, untrack } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemeColors = { [key: string]: string } | null;

export type ThemeKeys = {
	mode: string;
	colors: string;
};

export const themeContextKey = Symbol('theme');

export function setTheme(keys: ThemeKeys) {
	return setContext(themeContextKey, createThemeStates(keys));
}

export function getTheme(): ReturnType<typeof setTheme> {
	return getContext(themeContextKey);
}

function createThemeStates(config: ThemeKeys) {
	let mode = $state<ThemeMode>('system');
	let colors = $state.raw<ThemeColors>(null);
	const dark = new MediaQuery('(prefers-color-scheme: dark)');

	$effect(() => {
		mode = window.themeMode;
		colors = window.themeColors;
	});

	$effect(() => {
		if (untrack(() => mode) == 'system') {
			const root = document.documentElement;
			const meta = document.querySelector('meta[name="theme-color"]');

			const light = !dark.current;
			const ucolors = untrack(() => colors);

			root.style.colorScheme = light ? 'light' : 'dark';
			meta?.setAttribute(
				'content',
				// prettier-ignore
				ucolors
					? `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${ucolors.ambient})`
					: light ? '#fff' : '#000'
			);
			light ? root.classList.remove('dark') : root.classList.add('dark');
		}
	});

	const setMode = (value: ThemeMode) => {
		const root = document.documentElement;
		const meta = document.querySelector('meta[name="theme-color"]');

		mode = value;
		window.themeMode = value;

		const light = mode == 'light' || (mode == 'system' && !dark.current);
		root.style.colorScheme = light ? 'light' : 'dark';
		meta?.setAttribute(
			'content',
			// prettier-ignore
			colors
				? `${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${colors.ambient})`
				: light ? '#fff' : '#000'
		);
		light ? root.classList.remove('dark') : root.classList.add('dark');
		localStorage.setItem(config.mode, mode);
	};

	const setColors = (value: ThemeColors) => {
		const root = document.documentElement;
		const meta = document.querySelector('meta[name="theme-color"]');
		const light = mode == 'light' || (mode == 'system' && !dark.current);

		if (value == null) {
			root.dataset.theme = '';
			meta?.setAttribute('content', light ? '#fff' : '#000');

			colors = null;
			window.themeColors = null;
			localStorage.setItem(config.colors, '');
			return;
		}
		root.dataset.theme = 'custom';
		meta?.setAttribute(
			'content',
			`${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${value.ambient})`
		);

		colors = value;
		window.themeColors = value;
		localStorage.setItem(config.colors, JSON.stringify(value));
	};

	return {
		get mode() {
			return mode;
		},
		get colors() {
			return colors;
		},
		set mode(value: ThemeMode) {
			setMode(value);
		},
		set colors(value: ThemeColors) {
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
