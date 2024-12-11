<script lang="ts">
	import 'inter-ui/inter.css';
	import 'inter-ui/inter-variable.css';
	import '../app.css';

	import { setThemeContext, type ThemeKeyConfig } from '@/theme-mode.svelte.js';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	function setTheme({ themeModeKey, themeColorKey }: ThemeKeyConfig) {
		const themeMode = localStorage.getItem(themeModeKey) || 'system';
		const themeColor = localStorage.getItem(themeColorKey);
		const lightMode =
			themeMode === 'light' ||
			(themeMode === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);

		const rootEl = document.documentElement;
		const metaEl = document.querySelector('meta[name="theme-color"]');

		if (lightMode) {
			rootEl.classList.remove('dark');
		} else {
			rootEl.classList.add('dark');
			metaEl?.setAttribute('content', '#000000');
		}
		rootEl.style.colorScheme = lightMode ? 'light' : 'dark';

		if (themeColor) {
			const parsed = JSON.parse(themeColor);
			const { theme, ...rest } = parsed;
			const params = new URLSearchParams(rest);

			const a = document.createElement('link');
			a.rel = 'stylesheet';
			a.href = '/theme_color/palettes.css?' + params.toString();
			document.head.appendChild(a);

			rootEl.dataset.theme = 'custom';
			metaEl?.setAttribute('content', theme);
		}
	}

	const themeKeyConfig: ThemeKeyConfig = {
		themeModeKey: 'theme-mode',
		themeColorKey: 'theme-color'
	};
	const themeKeys = JSON.stringify(themeKeyConfig, null, 2);

	setThemeContext(themeKeyConfig);
</script>

<svelte:head>
	<meta name="theme-color" content="#ffffff" />
	{@html '<script nonce>(' + setTheme.toString() + ')(' + themeKeys + ');</script>'}
</svelte:head>

{@render children()}
