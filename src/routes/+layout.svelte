<script lang="ts">
	import 'inter-ui/inter.css';
	import 'inter-ui/inter-variable.css';
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	type ColorThemeConfig = {
		storageKey?: string;
	};

	function setColorTheme({ storageKey = 'color-theme-hue' }: ColorThemeConfig) {
		const hue = localStorage.getItem(storageKey);

		if (hue) {
			const rootEl = document.documentElement;
			rootEl.dataset.colorTheme = 'custom';

			const link = document.createElement('link');

			link.rel = 'stylesheet';
			link.href = '/color_theme/' + hue + '.css';
			document.head.appendChild(link);
		}
	}
</script>

<svelte:head>
	{@html `<script>(` + setColorTheme.toString() + `)(` + JSON.stringify({}) + `);</script>`}
</svelte:head>

<ModeWatcher />
{@render children()}
