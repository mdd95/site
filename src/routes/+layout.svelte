<script lang="ts">
	import '../app.css';
	import { provideThemeContext } from '$lib/theme-context.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	provideThemeContext();
</script>

{@render children()}
