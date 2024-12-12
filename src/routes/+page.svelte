<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { getTheme } from '@/theme-mode.svelte';

	const theme = getTheme();

	let ambient = $state(0);
	let primary = $state(0);
</script>

<header class="sticky top-0 z-50">
	<div class="container flex h-16 items-center justify-between">
		<Button onclick={theme.toggleMode}>Toggle dark mode</Button>
	</div>
</header>

<div class="container py-12">
	<h1>Welcome to SvelteKit</h1>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>

	<div>
		<form
			onsubmit={(e) => {
				e.preventDefault();
				const data = new FormData(e.target as HTMLFormElement);
				const ambient = data.get('ambient') as string;
				const primary = data.get('primary') as string;
				theme.colors = { ambient, primary };
				console.log(theme.colors);
			}}
		>
			<input type="range" min="0" max="360" step="0.1" name="ambient" bind:value={ambient} />
			<input type="range" min="0" max="360" step="0.1" name="primary" bind:value={primary} />
			<Button type="submit">Save</Button>
		</form>
		<Button onclick={theme.resetMode}>Reset mode</Button>
		<Button onclick={() => (theme.colors = null)}>Reset colors</Button>
	</div>
</div>
