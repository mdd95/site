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
  @reference '../../app.css';

  @layer components {
    a,
    button {
      @apply inline-flex items-center justify-center gap-2;
      @apply cursor-pointer rounded-md transition-colors;
      @apply bg-primary hover:bg-primary/90 text-primary-foreground;
      @apply h-10 px-4 whitespace-nowrap;

      &:focus-visible {
        @apply ring-primary/50 ring-offset-background ring-2 ring-offset-2 outline-none;
      }
      &:disabled {
        @apply pointer-events-none opacity-50;
      }
      & :global(svg) {
        @apply pointer-events-none size-5 shrink-0;
      }
    }
    .ghost {
      @apply hover:bg-primary/40 text-foreground bg-transparent;
    }
    .icon {
      @apply size-10;
    }
  }
</style>
