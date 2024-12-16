<script lang="ts" module>
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';

  export type ButtonVariant = 'default' | 'primary' | 'destructive';
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
    --bg: oklch(var(--light-150) / var(--opacity));
    --fg: oklch(var(--light-975) / var(--opacity));
    height: 2.25rem;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    background-color: var(--bg);
    color: var(--fg);
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

    &:global(:where(.dark, .dark *)) {
      --bg: oklch(var(--light-950) / var(--opacity));
      --fg: oklch(var(--light-100) / var(--opacity));
    }
    &:global(:where(.theme, .theme *)) {
      --bg: oklch(var(--color-150) var(--backdrop) / var(--opacity));
    }
    &:global(:where(.dark.theme, .dark.theme *)) {
      --bg: oklch(var(--color-950) var(--backdrop) / var(--opacity));
    }

    & :global(svg) {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      pointer-events: none;
    }
  }

  .primary {
    --bg: oklch(var(--light-975) / var(--opacity));
    --fg: oklch(var(--light-100) / var(--opacity));

    &:global(:where(.dark, .dark *)) {
      --bg: oklch(var(--light-100) / var(--opacity));
      --fg: oklch(var(--light-975) / var(--opacity));
    }
    &:global(:where(.theme, .theme *)) {
      --bg: oklch(var(--color-600) var(--primary) / var(--opacity));
      --fg: oklch(var(--light-100) / var(--opacity));
    }
  }

  .ghost {
    --bg: transparent;
    box-shadow: none;
  }

  .outline {
    border: 1px solid var(--bg);

    &:not(:hover) {
      background-color: transparent;
      color: currentColor;
    }
  }

  @media (hover: hover) {
    a:hover,
    button:hover {
      --bg: oklch(var(--light-200) / var(--opacity));

      &:global(:where(.dark, .dark *)) {
        --bg: oklch(var(--light-900) / var(--opacity));
      }
      &:global(:where(.theme, .theme *)) {
        --bg: oklch(var(--color-200) var(--backdrop) / var(--opacity));
      }
      &:global(:where(.dark.theme, .dark.theme *)) {
        --bg: oklch(var(--color-900) var(--backdrop) / var(--opacity));
      }
    }

    .primary:hover {
      --bg: oklch(var(--light-900) / var(--opacity));

      &:global(:where(.dark, .dark *)) {
        --bg: oklch(var(--light-200) / var(--opacity));
      }
      &:global(:where(.theme, .theme *)) {
        --bg: oklch(var(--color-500) var(--primary) / var(--opacity));
      }
    }
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
