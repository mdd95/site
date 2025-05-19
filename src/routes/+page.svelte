<script>
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
</script>

<header class="container flex justify-between p-4">
	<div></div>
	<div>
		<Button variant="ghost" size="icon" onclick={() => toggleMode()}>
			<Moon class="size-4 not-dark:hidden" />
			<Sun class="size-4 dark:hidden" />
			<span class="sr-only">Toggle Dark Mode</span>
		</Button>
	</div>
</header>
<main class="prose dark:prose-invert mx-auto px-4">
	<h1>Welcome to SvelteKit</h1>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>
</main>
