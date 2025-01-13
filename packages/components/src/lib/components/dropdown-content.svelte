<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import { getAnchorId } from './dropdown-context.js';

  import type { WithoutChild } from 'bits-ui';

  type Props = WithoutChild<DropdownMenu.ContentStaticProps>;

  let { children, ...restProps }: Props = $props();

  const anchorId = getAnchorId();
</script>

<DropdownMenu.ContentStatic preventScroll={false} {...restProps}>
  {#snippet child({ props })}
    <div {...props} style:position-anchor={anchorId}>
      {@render children?.()}
    </div>
  {/snippet}
</DropdownMenu.ContentStatic>

<style>
  div {
    position: absolute;
    position-area: bottom right;
    padding: 0.25rem;
    height: 100%;
    min-width: 8rem;
    background-color: color-mix(in oklab, var(--background-default), var(--color-primary-900) 5%);
    border-radius: var(--border-radius-default);
    box-shadow: var(--shadow-default);
    overflow-y: auto;
  }
</style>
