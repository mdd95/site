import { MediaQuery } from 'svelte/reactivity';

export type ThemeMode = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme-mode';

export class ThemeManager {
	#userPreference = $state<ThemeMode>('system');
	#systemPrefersDark = new MediaQuery('(prefers-color-scheme: dark)');

	constructor() {
		$effect(() => {
			const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
			if (saved) {
				this.#userPreference = saved;
			}
		});
	}

	get resolvedMode(): Exclude<ThemeMode, 'system'> {
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
		this.apply();
	}

	toggleMode() {
		if (this.#userPreference === 'system') {
			this.#userPreference = this.#systemPrefersDark.current ? 'light' : 'dark';
		} else {
			this.#userPreference = this.#userPreference === 'light' ? 'dark' : 'light';
		}
		this.apply();
	}

	apply() {
		updateDocumentColorScheme(this.resolvedMode);
		saveUserPreference(this.#userPreference);
	}
}

export function updateDocumentColorScheme(mode: Exclude<ThemeMode, 'system'>) {
	document.documentElement.style.colorScheme = mode;
}

export function saveUserPreference(mode: ThemeMode) {
	localStorage.setItem(THEME_STORAGE_KEY, mode);
}
