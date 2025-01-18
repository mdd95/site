<script lang="ts">
  import { usePopoverTrigger } from './popover.svelte.js';
  import { useId } from '../utils/id.js';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type PopoverTriggerProps = HTMLButtonAttributes & {
    children?: Snippet;
    id?: string;
  };
  let { children, id = useId('popover'), ...restProps }: PopoverTriggerProps = $props();

  const ctx = usePopoverTrigger({ id, props: restProps });
</script>

<button type="button" {...ctx.props}>
  {@render children?.()}
</button>
