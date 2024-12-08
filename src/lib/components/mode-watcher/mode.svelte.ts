export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemeColor = 'default' | `${string} ${string}`;

const themeModeKey = 'theme-mode';
const themeColorKey = 'theme-color';
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

function createThemeStates() {
	let mode = $state<ThemeMode>('system');
	let theme = $state<ThemeColor>('default');

	$effect(() => {
		const themeMode = localStorage.getItem(themeModeKey);
		const themeColor = localStorage.getItem(themeColorKey);

		if (isValidThemeMode(themeMode)) {
			mode = themeMode;
		}

		if (isValidThemeColor(themeColor)) {
			theme = themeColor;
		}
	});

	$effect(() => {
		localStorage.setItem(themeModeKey, mode);
		localStorage.setItem(themeColorKey, theme);

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

export const themeStates = createThemeStates();
