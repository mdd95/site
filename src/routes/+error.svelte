<script lang="ts">
	import { Button } from 'bits-ui';
</script>

<div class="layout">
	<main>
		<h1>404</h1>
		<p>The page you're looking for might have been moved or doesn't exist.</p>
		<div class="actions">
			<Button.Root href="/" class="primary">Go Home</Button.Root>
			<Button.Root href="/explore" class="secondary">Explore</Button.Root>
		</div>
	</main>
</div>

<style>
	.layout {
		height: 100vh;
		display: grid;
		place-items: center;
	}

	main {
		width: min(100%, 24rem);
		text-align: center;
	}

	.actions {
		margin-block-start: 1rem;
		display: flex;
		justify-content: center;

		:global {
			& > *:has(+ *) {
				margin-inline-end: 0.5rem;
			}
		}
	}
</style>
