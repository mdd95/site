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
      @apply cursor-pointer rounded-md whitespace-nowrap transition-colors;
      @apply h-10 px-4;
      @apply focus-visible:ring-2 focus-visible:outline-none;
      @apply disabled:pointer-events-none disabled:opacity-50;

      & :global(svg) {
        @apply pointer-events-none size-5 shrink-0;
      }
      &.sky {
        @apply bg-sky-600 text-sky-100 hover:bg-sky-700 focus-visible:ring-sky-600/50;
      }
      &.ghost {
        @apply bg-transparent hover:bg-slate-900 focus-visible:ring-slate-900/50;
      }
      &.link {
        @apply text-sky-600 underline-offset-2 hover:underline;
      }
      &.icon {
        @apply size-10;
      }
    }
  }
</style>
