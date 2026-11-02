<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import Menu from '@lucide/svelte/icons/menu';

	let dialog: HTMLDialogElement;

	beforeNavigate(() => {
		dialog.requestClose();
	});
</script>

<button
	type="button"
	class="btn btn-icon"
	aria-label="Open menu"
	onclick={() => dialog.showModal()}
>
	<Menu />
</button>
<dialog bind:this={dialog} closedby="any" class="dialog sidebar-left">
	<nav>
		<ul>
			<li><a href="/calendar">Calendar</a></li>
			<li><a href="/calendar?view=events">Events</a></li>
			<li><a href="/calendar?view=tasks">Tasks</a></li>
			<li><a href="/calendar?view=today">Today</a></li>
		</ul>

		<h2>MY CALENDARS</h2>
		<ul>
			<li><a href="/calendar?filter=Personal">Personal</a></li>
			<li><a href="/calendar?filter=Work">Work</a></li>
			<li><a href="/calendar?filter=Study">Study</a></li>
			<li><a href="/calendar?filter=Health">Health</a></li>
		</ul>
	</nav>
</dialog>

<style>
	dialog {
		width: min(18rem, 100%);
	}
	nav {
		padding: 1rem;
	}
	ul {
		list-style: none;
	}
	ul:has(+ h2) {
		padding: 0 0 0.5rem;
		border-bottom: 1px solid alpha(from var(--color-base-text) / 0.2);
	}
	h2 {
		padding: 0.5rem 0;
		color: var(--color-muted-text);
		font-size: 0.875rem;
	}
	a {
		height: 2.5rem;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		@media (hover: hover) {
			&:hover {
				background-color: var(--color-primary);
				color: var(--color-primary-text);
			}
		}
	}
</style>
