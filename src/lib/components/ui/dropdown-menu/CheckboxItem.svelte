<script lang="ts">
  import { DropdownMenu, type WithoutChildrenOrChild } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import Check from 'svelte-lucide/Check.svelte';
  import Minus from 'svelte-lucide/Minus.svelte';

  let {
    children,
    checked = $bindable(false),
    indeterminate = $bindable(false),
    ...restProps
  }: WithoutChildrenOrChild<DropdownMenu.CheckboxItemProps> & {
    children?: Snippet;
  } = $props();
</script>

<DropdownMenu.CheckboxItem bind:checked bind:indeterminate {...restProps}>
  {#snippet child({ props, checked, indeterminate })}
    <button {...props}>
      <span>
        {#if indeterminate}
          <Minus />
        {:else}
          <Check class={['size-4', !checked && 'text-transparent']} />
        {/if}
      </span>
      {@render children?.()}
    </button>
  {/snippet}
</DropdownMenu.CheckboxItem>

<style>
  @reference '../../../../app.css';

  @layer components {
    button {
      @apply relative flex w-full cursor-default items-center gap-2 px-3 py-1.5 transition-colors duration-150 outline-none select-none;

      &[data-disabled] {
        @apply pointer-events-none opacity-50;
      }
      &[data-highlighted] {
        @apply bg-rose-500;
      }
      & :global(svg) {
        @apply size-4 shrink-0;
      }
    }
  }
</style>
