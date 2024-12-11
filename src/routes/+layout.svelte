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
		const themeColor = localStorage.getItem(themeColorKey) || 'default';
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

		if (themeColor !== 'default') {
			const [hue, meta] = themeColor.split(' ');
			metaEl?.setAttribute('content', meta);

			const params = new URLSearchParams({ primary: hue });

			const a = document.createElement('link');
			a.rel = 'stylesheet';
			a.href = '/theme_color/palettes.css' + params.toString();
			document.head.appendChild(a);
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
<div class="colored:bg-green-100"></div>
