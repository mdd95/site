import { browser } from '$app/environment';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeData {
	mode: ThemeMode;
	primary: string;
	secondary: string;
}

const STORE_KEY = 'theme';
const DEFAULT_THEME: ThemeData = {
	mode: 'system',
	primary: 'oklch(65.32% 0.1854 33.46)',
	secondary: 'oklch(0.735 0.1195 61.68)'
};

function retrieveStoredTheme(): ThemeData {
	if (!browser) return DEFAULT_THEME;
	try {
		const storedTheme = localStorage.getItem(STORE_KEY);
		return storedTheme ? (JSON.parse(storedTheme) as ThemeData) : DEFAULT_THEME;
	} catch {
		return DEFAULT_THEME;
	}
}

function useThemeStore() {
	const theme = $state(retrieveStoredTheme());

	function handleChange() {
		if (!browser) return;

		const root = document.documentElement;
		root.style.colorScheme = theme.mode === 'system' ? '' : theme.mode;
		root.style.setProperty('--primary', theme.primary);
		root.style.setProperty('--secondary', theme.secondary);

		localStorage.setItem(STORE_KEY, JSON.stringify(theme));
	}

	return {
		isDarkMode(): boolean {
			if (!browser) return false;
			return theme.mode === 'dark' || 
				(theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
		},

		get mode(): ThemeMode {
			return theme.mode;
		},
		set mode(value: ThemeMode) {
			theme.mode = value;
			handleChange();
		},
		toggleMode() {
			if (theme.mode === 'system') {
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				theme.mode = prefersDark ? 'light' : 'dark';
			} else {
				theme.mode = theme.mode === 'dark' ? 'light' : 'dark';
			}
			handleChange();
		},

		get primary(): string {
			return theme.primary;
		},
		set primary(value: string) {
			theme.primary = value;
			handleChange();
		},

		get secondary(): string {
			return theme.secondary;
		},
		set secondary(value: string) {
			theme.secondary = value;
			handleChange();
		}
	};
}

export const theme = useThemeStore();
