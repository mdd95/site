<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { getThemeContext } from '@/theme-mode.svelte';

	const theme = getThemeContext();

	let ambient = $state(0);
	let primary = $state(0);

	$effect(() => {
		if (window.themeColor) {
			ambient = +window.themeColor.ambient;
			primary = +window.themeColor.primary;
		}
	});
</script>

<header class="border-primary-100 dark:border-primary-950 sticky top-0 z-50 border-b">
	<div class="container mx-auto flex h-16 items-center justify-between">
		<Button onclick={() => theme.setMode(theme.mode === 'dark' ? 'light' : 'dark')}>
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
				const ambient = data.get('ambient') as string;
				const primary = data.get('primary') as string;

				theme.setColor({ ambient, primary, light: '', dark: '' });
				location.reload();
			}}
		>
			<div class="h-6 w-12" style="background-color: oklch(64.78% 0.1472 {ambient});"></div>
			<input type="range" min="0" max="360" step="0.1" name="ambient" bind:value={ambient} />

			<div class="h-6 w-12" style="background-color: oklch(64.78% 0.1472 {primary});"></div>
			<input type="range" min="0" max="360" step="0.1" name="primary" bind:value={primary} />
			<Button type="submit">Save</Button>
		</form>
		<Button
			onclick={() => {
				theme.setColor(null);
				location.reload();
			}}>Reset</Button
		>
	</div>
</div>
