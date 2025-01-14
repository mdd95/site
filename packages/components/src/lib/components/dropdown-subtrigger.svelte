<script lang="ts">
  import { DropdownMenu, mergeProps } from 'bits-ui';
  import { getAnchorId } from './dropdown-context.js';

  import type { Snippet } from 'svelte';
  import type { WithoutChildrenOrChild } from 'bits-ui';

  type Props = WithoutChildrenOrChild<DropdownMenu.SubTriggerProps> & {
    children?: Snippet<[{ props: Record<string, unknown> }]>;
  };

  let { children, ...restProps }: Props = $props();
  const anchorId = getAnchorId();
</script>

<DropdownMenu.SubTrigger {...restProps}>
  {#snippet child({ props })}
    {@render children?.({
      props: mergeProps(props, {
        style: {
          'anchor-name': anchorId
        }
      })
    })}
  {/snippet}
</DropdownMenu.SubTrigger>
