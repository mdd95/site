<script lang="ts">
	import '../app.css';
	import { setThemeContext } from '$lib/theme-manager.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	setThemeContext();
</script>

{@render children()}
