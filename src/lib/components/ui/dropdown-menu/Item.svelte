<script lang="ts">
  import { DropdownMenu } from 'bits-ui';

  let { children, ...restProps }: DropdownMenu.ItemProps = $props();
</script>

<DropdownMenu.Item {...restProps}>
  {#snippet child({ props })}
    <button {...props}>
      {@render children?.()}
    </button>
  {/snippet}
</DropdownMenu.Item>

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
