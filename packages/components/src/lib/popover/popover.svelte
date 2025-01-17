<script lang="ts">
  import { usePopover } from './popover.svelte.js';
  import { wrap } from '../utils/wrap.svelte.js';
  import type { Snippet } from 'svelte';

  type PopoverProps = {
    children?: Snippet;
    open?: boolean;
  };
  let { children, open = $bindable(false) }: PopoverProps = $props();

  usePopover({
    open: wrap(
      () => open,
      (value) => {
        open = value;
      }
    )
  });
</script>

{@render children?.()}
