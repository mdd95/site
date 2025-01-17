<script lang="ts">
  import { usePopover } from './popover.svelte.js';
  import { bind } from '../utils/reactivity.svelte.js';
  import type { Snippet } from 'svelte';

  type PopoverProps = {
    children?: Snippet;
    open?: boolean;
  };
  let { children, open = $bindable(false) }: PopoverProps = $props();

  usePopover({
    open: bind(
      () => open,
      (v) => (open = v)
    )
  });
</script>

{@render children?.()}
