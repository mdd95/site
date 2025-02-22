<script lang="ts">
	import { Label, type WithoutChild } from 'bits-ui';

	let { children, ...restProps }: WithoutChild<Label.RootProps> = $props();
</script>

<Label.Root {...restProps}>
	{#snippet child({ props })}
		<label {...props}>
			{@render children?.()}
		</label>
	{/snippet}
</Label.Root>

<style>
	@reference '../../../app.css';

	@layer components {
		label {
			@apply text-sm/[1] font-medium;
			@apply peer-disabled:text-muted-foreground;
		}
	}
</style>
