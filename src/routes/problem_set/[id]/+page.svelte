<script lang="ts">
	import * as Alert from '@/components/ui/alert/index.js';

	import type { PageServerData } from './$types';

	type Props = {
		data: PageServerData;
	};
	let { data }: Props = $props();
</script>

{#if data.content}
	<div class="container">
		{#each data.content as problem}
			<div class="p-4">
				<p>{problem.question.value}</p>
			</div>
		{/each}
	</div>
{:else}
	<div class="container grid min-h-screen place-items-center">
		<div class="mx-4 w-full max-w-screen-md">
			<Alert.Root variant="destructive">
				<Alert.Title>The problem set is empty</Alert.Title>
				<Alert.Description>Contact the owner of the problem set</Alert.Description>
			</Alert.Root>
		</div>
	</div>
{/if}
