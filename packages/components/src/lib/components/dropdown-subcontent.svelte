<script lang="ts">
  import { DropdownMenu, mergeProps } from 'bits-ui';
  import { getAnchorId } from './dropdown-context.js';

  import type { WithoutChild } from 'bits-ui';
  type Props = WithoutChild<DropdownMenu.SubContentStaticProps>;

  let { children, ...restProps }: Props = $props();
  const anchorId = getAnchorId();
</script>

<DropdownMenu.SubContentStatic {...restProps}>
  {#snippet child({ props })}
    <div
      {...mergeProps(props, {
        style: {
          'position-anchor': anchorId
        }
      })}
    >
      {@render children?.()}
    </div>
  {/snippet}
</DropdownMenu.SubContentStatic>

<style>
  div {
    position: absolute;
    top: anchor(top);
    left: anchor(right);
    margin: 0;
    margin-inline-start: 0.25rem;
  }
</style>
