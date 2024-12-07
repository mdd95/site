<script lang="ts">
	import 'inter-ui/inter.css';
	import 'inter-ui/inter-variable.css';
	import '../app.css';

	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	function setColorTheme() {
		const themeModeKey = 'theme-mode';
		const themeColorKey = 'theme-color';

		const themeMode = localStorage.getItem(themeModeKey) || 'system';
		const themeColor = localStorage.getItem(themeColorKey) || 'default';
		const lightMode =
			themeMode === 'light' ||
			(themeMode === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);

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

			const a = document.createElement('link');
			a.rel = 'stylesheet';
			a.href = '/theme_color/' + hue + '.css';
			document.head.appendChild(a);
		}
	}
</script>

<svelte:head>
	<meta name="theme-color" content="#ffffff" />
	{@html `<script nonce>(` + setColorTheme.toString() + `)();</script>`}
</svelte:head>

{@render children()}
