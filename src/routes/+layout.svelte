<script lang="ts">
	import 'inter-ui/inter.css';
	import 'inter-ui/inter-variable.css';
	import '../app.css';

	import { setTheme } from '@/theme-mode.svelte';

	import type { Snippet } from 'svelte';
	import type { ThemeKeys, ThemeMode } from '@/theme-mode.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	function initTheme({ mode: modeKey, colors: colorsKey }: ThemeKeys) {
		const mode = localStorage.getItem(modeKey) || 'system';
		const colors = localStorage.getItem(colorsKey);
		const light =
			mode == 'light' ||
			(mode == 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);

		const root = document.documentElement;
		const meta = document.querySelector('meta[name="theme-color"]');

		if (light) {
			root.classList.remove('dark');
		} else {
			root.classList.add('dark');
			meta?.setAttribute('content', '#000');
		}
		root.style.colorScheme = light ? 'light' : 'dark';
		window.themeMode = mode as ThemeMode;

		if (colors) {
			const parsed = JSON.parse(colors);
			window.themeColors = parsed;
			root.dataset.theme = 'custom';
			for (const [key, val] of Object.entries(parsed)) {
				root.style.setProperty(`--${key}`, `${val}`);
			}
			meta?.setAttribute(
				'content',
				`${light ? 'oklch(82.67% 0.0908' : 'oklch(11.73% 0.0243'} ${parsed.ambient})`
			);
		} else {
			window.themeColors = null;
		}
	}

	const themeKeys: ThemeKeys = {
		mode: 'theme-mode',
		colors: 'theme-colors'
	};
	setTheme(themeKeys);
</script>

<svelte:head>
	<meta name="theme-color" content="#fff" />
	{@html `<script nonce>(${initTheme.toString()})(${JSON.stringify(themeKeys)});</script>`}
</svelte:head>

{@render children()}
