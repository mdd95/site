<script lang="ts">
  import { usePopoverContent } from './popover.svelte.js';
  import { useId } from '../utils/id.js';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
    children?: Snippet;
    id?: string;
  };
  let { children, id = useId('popover'), ...restProps }: PopoverContentProps = $props();

  const ctx = usePopoverContent({ id, props: restProps });
</script>

<div {...ctx.props}>
  {@render children?.()}
</div>

<style>
  div {
    position: absolute;
    position-area: block-end span-inline-end;
    margin: 0;
    padding-block: var(--padding);
    padding-inline: var(--padding);
    border: 0;
    border-radius: var(--radius);
    background-color: var(--color-popover);
    color: var(--color-popover-foreground);
  }
</style>
