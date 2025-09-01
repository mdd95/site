import { getContext, setContext } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';
import * as v from 'valibot';

export const THEME_MODE_STORAGE_KEY = 'theme-mode';
export const THEME_MODE_CONTEXT_KEY = Symbol(THEME_MODE_STORAGE_KEY);

export const THEME_MODES = {
	SYSTEM: 'system',
	LIGHT: 'light',
	DARK: 'dark',
} as const;

export const THEME_COLORS = {
	NEUTRAL: 'neutral',
	BLUE: 'blue',
	RED: 'red',
	YELLOW: 'yellow',
} as const;

export type ThemeColor = (typeof THEME_COLORS)[keyof typeof THEME_COLORS];
export type UserThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];
export type ResolvedThemeMode = Exclude<UserThemeMode, 'system'>;

const themeModeSchema = v.enum(THEME_MODES);

export class ThemeModeManager {
	#userPreferred = $state<UserThemeMode>(THEME_MODES.SYSTEM);
	#systemDarkMode = new MediaQuery('(prefers-color-scheme: dark)');

	constructor() {
		$effect(() => {
			const storedThemeMode = localStorage.getItem(THEME_MODE_STORAGE_KEY) ?? 'system';
			const result = v.safeParse(themeModeSchema, storedThemeMode);

			if (result.success) {
				this.#userPreferred = result.output;
			} else {
				console.warn('Invalid theme mode stored in local storage.');
			}
		});
	}

	get userPreferred(): UserThemeMode {
		return this.#userPreferred;
	}

	get mode(): ResolvedThemeMode {
		return this.#userPreferred === THEME_MODES.SYSTEM
			? this.#systemDarkMode.current
				? THEME_MODES.DARK
				: THEME_MODES.LIGHT
			: this.#userPreferred;
	}

	setMode(themeMode: UserThemeMode) {
		this.#userPreferred = themeMode;
		this.#updateRootStyles(themeMode);
		this.#updateLocalStorage(themeMode);
	}

	toggleMode() {
		const userPreferred =
			this.#userPreferred === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
		const systemThemeMode = this.#systemDarkMode.current ? THEME_MODES.LIGHT : THEME_MODES.DARK;
		this.setMode(this.#userPreferred === THEME_MODES.SYSTEM ? systemThemeMode : userPreferred);
	}

	#updateRootStyles(themeMode: UserThemeMode) {
		const rootElement = document.documentElement;
		if (themeMode === 'system') {
			rootElement.style.removeProperty('color-scheme');
		} else {
			rootElement.style.colorScheme = themeMode;
		}
	}

	#updateLocalStorage(themeMode: UserThemeMode) {
		localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
	}
}

export class ThemeColorManager {
	color = $state<ThemeColor>(THEME_COLORS.BLUE);
}

export function setThemeMode() {
	return setContext(THEME_MODE_CONTEXT_KEY, new ThemeModeManager());
}

export function getThemeMode() {
	return getContext<ThemeModeManager>(THEME_MODE_CONTEXT_KEY);
}

export function initializeThemeMode(storageKey: string) {
	const storedThemeMode = (localStorage.getItem(storageKey) as UserThemeMode | null) ?? 'system';
	if (storedThemeMode !== 'system') {
		document.documentElement.style.colorScheme = storedThemeMode;
	}
}
