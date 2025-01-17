<script lang="ts">
  import { usePopoverTrigger } from './popover-trigger.svelte.js';
  import { useId } from '../utils/use-id.js';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type PopoverTriggerProps = HTMLButtonAttributes & {
    children?: Snippet;
    id?: string;
  };
  let { children, id = useId(), ...restProps }: PopoverTriggerProps = $props();

  const ctx = usePopoverTrigger({ id, restProps });
</script>

<button type="button" {...ctx.props}>
  {@render children?.()}
</button>
