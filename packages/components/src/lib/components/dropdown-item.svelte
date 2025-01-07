<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import type { WithoutChild } from 'bits-ui';

  type Props = WithoutChild<DropdownMenu.ItemProps> & {
    href?: string;
  };

  let { children, href, ...restProps }: Props = $props();
</script>

<DropdownMenu.Item {...restProps}>
  {#snippet child({ props })}
    {#if href}
      <a {href} {...props}>
        {@render children?.()}
      </a>
    {:else}
      <div {...props}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</DropdownMenu.Item>

<style>
  a,
  div {
    padding: 0.25rem 0.5rem;
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius-default);
    font-size: 0.875rem;
  }

  @media (hover: hover) {
    a:hover,
    div:hover {
      background-color: color-mix(
        in oklab,
        var(--background-default),
        var(--color-primary-900) 10%
      );
    }
  }
</style>
