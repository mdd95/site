<script>
	import { Button } from '@/components/ui/button';
	import { getThemeContext } from '@/theme-mode.svelte';

	const theme = getThemeContext();
</script>

<header class="border-primary-100 dark:border-primary-950 sticky top-0 z-50 border-b">
	<div class="container mx-auto flex h-16 items-center justify-between">
		<Button onclick={() => (theme.mode = theme.mode === 'dark' ? 'light' : 'dark')}>
			Toggle dark mode
		</Button>
	</div>
</header>

<div class="container mx-auto py-12">
	<h1>Welcome to SvelteKit</h1>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>
</div>
