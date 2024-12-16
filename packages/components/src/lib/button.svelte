<script lang="ts" module>
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';

  export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'outline' | 'destructive';
  export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };
</script>

<script lang="ts">
  import clsx from 'clsx';

  let {
    ref = $bindable(null),
    children,
    variant = 'default',
    size = 'default',
    href = undefined,
    class: className,
    ...restProps
  }: ButtonProps = $props();

  const cn = clsx(variant != 'default' && variant, size != 'default' && size, className);
</script>

{#if href}
  <a bind:this={ref} {href} class={cn} {...restProps}>
    {@render children?.()}
  </a>
{:else}
  <button bind:this={ref} class={cn} {...restProps}>
    {@render children?.()}
  </button>
{/if}

<style>
  a,
  button {
    --opacity: 1;
    --bg: var(--root-bg);
    --fg: var(--root-fg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    background-color: oklch(from var(--bg) l c h / var(--opacity));
    color: oklch(from var(--fg) l c h / var(--opacity));
    font-size: 0.875rem;
    line-height: 1.25rem;
    white-space: nowrap;
    cursor: pointer;
    transition: var(--tr-colors) var(--tr-duration) var(--tr-timing);

    &:disabled {
      --opacity: 0.9;
      cursor: default;
      pointer-events: none;
    }

    &:global(:where(.theme, .theme *)) {
      --bg: oklch(var(--color-150) var(--primary));
      --fg: oklch(var(--color-900) var(--primary));
    }

    &:global(:where(.dark.theme, .dark.theme *)) {
      --bg: oklch(var(--color-950) var(--primary));
      --fg: oklch(var(--color-150) var(--primary));
    }

    & :global(svg) {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      pointer-events: none;
    }
  }
</style>
