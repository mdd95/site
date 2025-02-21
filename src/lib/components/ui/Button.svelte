<script lang="ts">
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  let {
    children,
    href = undefined,
    ...restProps
  }: HTMLButtonAttributes & HTMLAnchorAttributes = $props();
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
  @reference '../../../app.css';

  @layer components {
    a,
    button {
      @apply inline-flex h-10 w-max items-center justify-center gap-2 px-4;
      @apply cursor-pointer rounded-md whitespace-nowrap transition-colors;
      @apply bg-rose-500 text-neutral-50;

      &:focus-visible {
        @apply ring-2 ring-rose-500/50 outline-none;
      }
      &:disabled {
        @apply pointer-events-none opacity-50;
      }
      & :global(svg) {
        @apply pointer-events-none size-5 shrink-0;
      }
      &.ghost {
        @apply bg-transparent text-inherit hover:bg-neutral-200 dark:hover:bg-neutral-900;
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
