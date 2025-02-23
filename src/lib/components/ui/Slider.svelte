<script lang="ts">
	import { Slider, type WithoutChildrenOrChild } from 'bits-ui';

	let {
		value = $bindable(),
		orientation = 'horizontal',
		...restProps
	}: WithoutChildrenOrChild<Slider.RootProps> = $props();
</script>

<Slider.Root bind:value={value as never} {orientation} {...restProps}>
	{#snippet child({ props, thumbs })}
		<span class="slider" {...props}>
			<span class="track" data-orientation={orientation}>
				{@render sliderRange()}
			</span>
			{#each thumbs as thumb}
				{@render sliderThumbs(thumb)}
			{/each}
		</span>
	{/snippet}
</Slider.Root>

{#snippet sliderRange()}
	<Slider.Range>
		{#snippet child({ props })}
			<span class="range" {...props}></span>
		{/snippet}
	</Slider.Range>
{/snippet}

{#snippet sliderThumbs(thumb: number)}
	<Slider.Thumb index={thumb}>
		{#snippet child({ props })}
			<span class="thumb" {...props}></span>
		{/snippet}
	</Slider.Thumb>
{/snippet}

<style>
	@reference '../../../app.css';

	@layer components {
		.slider {
			@apply relative flex touch-none items-center select-none;

			&[data-orientation='horizontal'] {
				@apply w-full;
			}
			&[data-orientation='vertical'] {
				@apply h-full min-h-44 w-auto flex-col;
			}
		}

		.track {
			@apply bg-elevated-2 relative grow overflow-hidden rounded-full;

			&[data-orientation='horizontal'] {
				@apply h-2 w-full;
			}
			&[data-orientation='vertical'] {
				@apply h-full w-2;
			}
		}

		.range {
			@apply bg-primary absolute;

			&[data-orientation='horizontal'] {
				@apply h-full;
			}
			&[data-orientation='vertical'] {
				@apply w-full;
			}
		}

		.thumb {
			@apply border-primary bg-background block size-5 rounded-full border-2 transition-colors;

			&:focus-visible {
				@apply ring-primary/50 ring-2 outline-none;
			}
			&:disabled {
				@apply pointer-events-none opacity-50;
			}
		}
	}
</style>
