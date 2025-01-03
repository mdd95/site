<script lang="ts">
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';

  type Props = WithElementRef<HTMLButtonAttributes> & WithElementRef<HTMLAnchorAttributes>;

  let { ref = $bindable(null), children, href = undefined, ...restProps }: Props = $props();
</script>

{#if href}
  <a bind:this={ref} {href} {...restProps}>{@render children?.()}</a>
{:else}
  <button bind:this={ref} {...restProps}>{@render children?.()}</button>
{/if}

<style>
  a,
  button {
    height: 2.25rem;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-default);
    box-shadow: var(--shadow-default);
    background-color: var(--scope-background);
    color: var(--scope-foreground);
    font-size: 0.875rem;
    line-height: 1.25rem;
    white-space: nowrap;
    cursor: pointer;
    transition-property: var(--transition-property-colors);
    transition-duration: var(--transition-duration-default);
    transition-timing-function: var(--transition-timing-function-default);

    &:disabled {
      background-color: color-mix(in oklab, var(--scope-background), transparent 50%);
      cursor: auto;
      pointer-events: none;
    }

    &:hover {
      background-color: color-mix(in oklab, var(--scope-background), transparent 15%);
    }

    & :global(svg) {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      pointer-events: none;
    }
  }

  a,
  button {
    --scope-background: var(--color-primary-500);
    --scope-foreground: var(--color-primary-100);
  }

  .ghost {
    --scope-background: var(--background-default);
    --scope-foreground: var(--foreground-default);
    box-shadow: none;
    &:hover {
      --scope-foreground: var(--color-primary-100);
      background-color: var(--color-primary-500);
    }
  }

  .destructive {
    --scope-background: oklch(0.637 0.237 25.331);
    --scope-foreground: oklch(1 0 0);
  }

  .sm {
    height: 2rem;
    padding-inline: 0.75rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }
  .lg {
    height: 2.5rem;
    padding-inline: 2rem;
  }
  .icon {
    width: 2.25rem;
    height: 2.25rem;
  }
</style>
