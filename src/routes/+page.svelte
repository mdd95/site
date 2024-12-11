<script lang="ts">
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

	<div>
		<form
			onsubmit={(e) => {
				e.preventDefault();

				const data = new FormData(e.target as HTMLFormElement);
				const hue = data.get('hue');

				theme.color = { primary: hue, theme: '#fafafa' };
			}}
		>
			<input type="number" min="0" max="360" step="0.1" name="hue" />
			<Button type="submit">Save</Button>
		</form>
	</div>
</div>
