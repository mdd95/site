<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { IsMobile } from '$lib/utils.js';

	const isMobile = new IsMobile();

	let { open = $bindable(true) } = $props();
</script>

{#snippet LoginForm()}
	<div class="py-24">LOGIN</div>
{/snippet}

{#if isMobile.current}
	<Drawer.Root bind:open>
		<Drawer.Content>
			{@render LoginForm()}
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<Dialog.Root bind:open>
		<Dialog.Content>
			{@render LoginForm()}
		</Dialog.Content>
	</Dialog.Root>
{/if}
