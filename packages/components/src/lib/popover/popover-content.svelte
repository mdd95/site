<script lang="ts">
  import { usePopoverContent } from './popover-content.svelte.js';
  import { useId } from '../utils/id.js';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
    children?: Snippet;
    id?: string;
  };
  let { children, id = useId('popover'), ...restProps }: PopoverContentProps = $props();

  const ctx = usePopoverContent({ id, restProps });
</script>

<div {...ctx.props}>
  {@render children?.()}
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding-block: var(--padding);
    padding-inline: var(--padding);
    border: 0;
    border-radius: var(--radius);
    background-color: var(--color-popover);
    color: var(--color-popover-foreground);
    opacity: 0;
    transform: scale(0.95);
    transition:
      opacity var(--transition-duration-default) var(--transition-timing-function-default),
      transform var(--transition-duration-default) var(--transition-timing-function-default),
      overlay var(--transition-duration-default) var(--transition-timing-function-default)
        allow-discrete,
      display var(--transition-duration-default) var(--transition-timing-function-default)
        allow-discrete;
  }

  div:popover-open {
    opacity: 1;
    transform: scale(1);
  }

  @starting-style {
    div:popover-open {
      opacity: 0;
      transform: scale(0.95);
    }
  }
</style>
