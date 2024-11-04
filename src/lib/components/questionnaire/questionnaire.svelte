<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '../ui/button/index.js';
	import Trash from 'svelte-radix/Trash.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="rounded-md border p-4 shadow-sm">
	<div class="mb-4 flex justify-end">
		<Button variant="ghost" size="icon">
			<Trash />
		</Button>
	</div>

	{@render children?.()}
</div>
