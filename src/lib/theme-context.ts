import { getContext, setContext } from 'svelte';
import { ThemeManager, type ThemeMode } from './theme-mode.svelte.js';

const CONTEXT_KEY = Symbol('theme-manager');

export function provideThemeContext() {
	setContext(CONTEXT_KEY, new ThemeManager());
}

export function getThemeContext(): ThemeManager {
	return getContext<ThemeManager>(CONTEXT_KEY);
}

export function initializeTheme(storeKey: string) {
	const stored = (localStorage.getItem(storeKey) as ThemeMode | null) ?? 'system';
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const resolved = stored === 'system' ? (prefersDark ? 'dark' : 'light') : stored;
	document.documentElement.style.colorScheme = resolved;
}
