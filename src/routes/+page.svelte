<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { getTheme } from '@/theme-mode.svelte';

	const theme = getTheme();

	let ambient = $state(0);
	let primary = $state(0);

	$effect(() => {
		const root = document.documentElement;
		root.style.setProperty('--ambient', ambient.toString());
		root.style.setProperty('--primary', primary.toString());
	});
</script>

<header class="sticky top-0 z-50">
	<div class="container flex h-16 items-center justify-between" style="--primary: 0;">
		<Button onclick={() => (theme.mode = theme.mode == 'dark' ? 'light' : 'dark')}>
			Toggle dark mode
		</Button>
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
				location.reload();
			}}
		>
			<input
				type="range"
				min="0"
				max="360"
				step="0.01"
				name="ambient"
				defaultValue={window.themeColors?.ambient || 262.88}
				bind:value={ambient}
			/>
			<input
				type="range"
				min="0"
				max="360"
				step="0.01"
				name="primary"
				defaultValue={window.themeColors?.primary || 262.88}
				bind:value={primary}
			/>
			<Button type="submit">Save</Button>
		</form>
		<Button
			onclick={() => {
				theme.colors = null;
				location.reload();
			}}
		>
			Reset
		</Button>
	</div>
</div>
