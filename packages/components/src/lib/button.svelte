<script lang="ts" module>
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';

  export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'outline' | 'destructive';
  export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes>;
</script>

<script lang="ts">
  let { ref = $bindable(null), children, href = undefined, ...restProps }: ButtonProps = $props();
</script>

{#if href}
  <a bind:this={ref} {href} {...restProps}>{@render children?.()}</a>
{:else}
  <button bind:this={ref} {...restProps}>{@render children?.()}</button>
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
      --opacity: 0.65;
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
    --bg: transparent;
    --border-color: oklch(var(--light-975) / var(--opacity));
    border: 1px solid var(--border-color);

    &:global(:where(.dark, .dark *)) {
      --border-color: oklch(var(--light-100) / var(--opacity));
    }
    &:global(:where(.theme, .theme *)) {
      --fg: oklch(var(--color-600) var(--primary) / var(--opacity));
      --border-color: oklch(var(--color-600) var(--primary) / var(--opacity));
    }
  }

  .destructive {
    --bg: oklch(0.577 0.245 27.325 / var(--opacity));
    --fg: oklch(var(--light-100) / var(--opacity));
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

    .outline:hover {
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

    .destructive:hover {
      --bg: oklch(0.637 0.237 25.331 / var(--opacity));
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
