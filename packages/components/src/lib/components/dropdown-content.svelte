<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import type { WithoutChild } from 'bits-ui';

  type Props = WithoutChild<DropdownMenu.ContentProps>;

  let { children, ...restProps }: Props = $props();
</script>

<DropdownMenu.Portal>
  <DropdownMenu.Content {...restProps}>
    {#snippet child({ props, wrapperProps })}
      <div class="wrapper" {...wrapperProps}>
        <div class="content" {...props}>
          {@render children?.()}
        </div>
      </div>
    {/snippet}
  </DropdownMenu.Content>
</DropdownMenu.Portal>

<style>
  .content {
    padding: 0.25rem;
    height: 100%;
    min-width: 8rem;
    background-color: color-mix(in oklab, var(--background-default), var(--color-primary-900) 5%);
    border-radius: var(--border-radius-default);
    box-shadow: var(--shadow-default);
    overflow-y: auto;
  }
</style>
