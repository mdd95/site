<script lang="ts">
	import { DropdownMenu, mergeProps } from 'bits-ui';

	let {
		children,
		preventScroll = false,
		sideOffset = 4,
		...restProps
	}: DropdownMenu.ContentProps = $props();
</script>

<DropdownMenu.Portal>
	<DropdownMenu.Content {preventScroll} {sideOffset} {...restProps}>
		{#snippet child({ props, wrapperProps })}
			<div {...wrapperProps}>
				<div {...props} class={['content', props.class]}>
					{@render children?.()}
				</div>
			</div>
		{/snippet}
	</DropdownMenu.Content>
</DropdownMenu.Portal>

<style>
	@reference '../../../../app.css';

	@layer components {
		.content {
			@apply bg-elevated flex min-w-32 flex-col overflow-x-hidden rounded-md py-2 shadow outline-none;
			@apply data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95;
			@apply data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2;
		}
	}
</style>
