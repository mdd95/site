<script lang="ts">
	import '../app.css';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<ModeWatcher />
<header class="container mx-auto flex justify-between p-4">
	<div></div>
	<div>
		<Button variant="ghost" size="icon" onclick={() => toggleMode()}>
			<Moon class="size-4 not-dark:hidden" />
			<Sun class="size-4 dark:hidden" />
			<span class="sr-only">Toggle Dark Mode</span>
		</Button>
	</div>
</header>
{@render children()}
