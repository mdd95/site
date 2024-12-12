<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { VariantProps } from 'tailwind-variants';
	import type { WithElementRef } from 'bits-ui';

	export const buttonVariants = tv({
		base: 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-within:ring-offset-2 focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
		variants: {
			variant: {
				default:
					'theme:bg-primary-600 theme:text-primary-50 theme:hover:bg-primary-600/90 focus-within:ring-primary-600 bg-neutral-950 text-neutral-50 shadow hover:bg-neutral-950/90 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-50/90',
				destructive:
					'bg-red-700 text-neutral-50 shadow-sm hover:bg-red-700/90 focus-visible:ring-red-700',
				outline:
					'theme:text-primary-600 theme:border-primary-600 theme:hover:bg-primary-600 border border-neutral-950 shadow-sm hover:text-neutral-50 dark:border-neutral-50',
				ghost: 'hover:bg-ambient-200 text-ambient-950',
				link: 'text-primary-600 underline-offset-2 hover:underline'
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	import { cn } from '@/utils.js';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{href}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
