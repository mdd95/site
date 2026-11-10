<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { MediaQuery } from 'svelte/reactivity';
	import Menu from '@lucide/svelte/icons/menu';
	import Sidenav from './sidenav.svelte';

	let propsId = $props.id();
	let dialog = $state<HTMLDialogElement>();

	const isMobile = new MediaQuery('(width < 1080px)');

	beforeNavigate(() => {
		dialog?.requestClose();
	});
</script>

{#if isMobile.current}
	<button
		type="button"
		command="show-modal"
		commandfor="dialog-{propsId}"
		aria-label="Open menu"
		class="btn btn-icon"
	>
		<Menu />
	</button>

	<dialog bind:this={dialog} closedby="any" id="dialog-{propsId}" class="dialog sidebar-left">
		<Sidenav />
	</dialog>
{:else}
	<div></div>
{/if}

<style>
	.dialog {
		width: min(20rem, 100%);
	}
</style>
