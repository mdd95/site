import { getContext, setContext } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedMode = Exclude<ThemeMode, 'system'>;

export const THEME_STORAGE_KEY = 'theme';
export const THEME_CONTEXT_KEY = Symbol('theme');

export class ThemeManager {
	#userPreference = $state<ThemeMode>('system');
	#systemPrefersDark = new MediaQuery('(prefers-color-scheme: dark)');

	constructor() {
		$effect(() => {
			this.#userPreference =
				(localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null) ?? 'system';
		});
	}

	get resolvedMode(): ResolvedMode {
		return this.#userPreference === 'system'
			? this.#systemPrefersDark.current
				? 'dark'
				: 'light'
			: this.#userPreference;
	}

	get userPreference(): ThemeMode {
		return this.#userPreference;
	}

	setMode(mode: ThemeMode) {
		this.#userPreference = mode;
		updateDocument(this.resolvedMode);
		saveUserPreference(this.#userPreference);
	}

	toggleMode() {
		if (this.#userPreference === 'system') {
			this.#userPreference = this.#systemPrefersDark.current ? 'light' : 'dark';
		} else {
			this.#userPreference = this.#userPreference === 'light' ? 'dark' : 'light';
		}
		updateDocument(this.resolvedMode);
		saveUserPreference(this.#userPreference);
	}
}

function updateDocument(mode: ResolvedMode) {
	const html = document.documentElement;

	html.style.colorScheme = mode;
	mode == 'dark' ? html.classList.add('dark') : html.classList.remove('dark');
}

function saveUserPreference(mode: ThemeMode) {
	localStorage.setItem(THEME_STORAGE_KEY, mode);
}

export function setThemeContext() {
	return setContext(THEME_CONTEXT_KEY, new ThemeManager());
}

export function getThemeContext() {
	return getContext<ThemeManager>(THEME_CONTEXT_KEY);
}

export function initializeTheme(storageKey: string) {
	const modeFromStorage = (localStorage.getItem(storageKey) as ThemeMode | null) ?? 'system';
	const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const mode =
		modeFromStorage === 'system' ? (systemPrefersDark ? 'dark' : 'light') : modeFromStorage;
	const html = document.documentElement;

	html.style.colorScheme = mode;
	mode == 'dark' ? html.classList.add('dark') : html.classList.remove('dark');
}
