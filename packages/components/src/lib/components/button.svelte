<script lang="ts">
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  type Props = HTMLButtonAttributes & HTMLAnchorAttributes;
  let { children, href = undefined, ...restProps }: Props = $props();
</script>

{#if href}
  <a {href} {...restProps}>
    {@render children?.()}
  </a>
{:else}
  <button {...restProps}>
    {@render children?.()}
  </button>
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
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    background-color: color-mix(in oklab, var(--background) 90%, var(--text));
    color: var(--text);
    white-space: nowrap;
    cursor: pointer;
    transition-property: var(--transition-colors);
    transition-duration: var(--transition-duration);
    transition-timing-function: var(--transition-easing);

    &:disabled {
      background-color: color-mix(in oklab, var(--background) 50%, transparent);
      cursor: auto;
      pointer-events: none;
    }

    @media (hover: hover) {
      &:hover {
        background-color: color-mix(in oklab, var(--background) 85%, var(--text));
      }
    }

    & :global(svg) {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      pointer-events: none;
    }
  }

  .ghost {
    box-shadow: none;
    background-color: transparent;
  }

  .destructive {
    --background: oklch(0.637 0.237 25.331);
    --text: #fff;
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
