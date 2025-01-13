<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import { getAnchorId } from './dropdown-context.js';

  import type { Snippet } from 'svelte';
  import type { WithoutChildrenOrChild } from 'bits-ui';

  type Props = WithoutChildrenOrChild<DropdownMenu.TriggerProps> & {
    children?: Snippet<[{ props: Record<string, unknown> }]>;
  };

  let { children, ...restProps }: Props = $props();

  const anchorId = getAnchorId();
</script>

<DropdownMenu.Trigger {...restProps}>
  {#snippet child({ props })}
    {@render children?.({
      props: {
        ...props,
        style: `anchor-name: ${anchorId};`
      }
    })}
  {/snippet}
</DropdownMenu.Trigger>
