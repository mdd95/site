<script lang="ts">
	import { Sun, Moon } from 'lucide';
	import { MorphIcon } from 'morphicons/svelte';
	import { mode, toggleMode } from 'mode-watcher';
	import { resolve } from '$app/paths';
</script>

<header>
	<a href={resolve('/')} class="logo">
		<span class="mark">M</span>
		<span class="name">mjayar</span>
	</a>
	<nav>
		<ul>
			<li><a href={resolve('/')}>Home</a></li>
			<li><a href="#">Apps</a></li>
		</ul>
	</nav>
	<div class="actions">
		<button onclick={toggleMode} class="btn icon ghost" aria-label="Toggle theme mode">
			<MorphIcon icon={mode.current === 'dark' ? Moon : Sun} size="20" />
		</button>
		<a href="#" class="btn ghost">Sign In</a>
	</div>
</header>

<style>
	header {
		width: min(68.75rem, 100% - 2rem);
		height: 4rem;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: -0.02em;

		& > .mark {
			display: grid;
			place-items: center;
			width: 2rem;
			height: 2rem;
			border: 1px solid var(--color-border);
			border-radius: var(--radius-md);
			font-size: 0.875rem;
			font-weight: 700;
		}
	}

	ul {
		display: flex;
		gap: 1.125rem;
		list-style: none;
	}

	nav a {
		font-size: 0.875rem;
		color: #555555;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 0.5rem;
	}
</style>
