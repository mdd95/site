<script lang="ts">
  import { Dialog, type WithoutChildrenOrChild } from 'bits-ui';
  import IconX from 'svelte-lucide/X.svelte';

  type Props = WithoutChildrenOrChild<Dialog.CloseProps>;
  let { ...restProps }: Props = $props();
</script>

<Dialog.Close {...restProps}>
  {#snippet child({ props })}
    <button {...props}>
      <IconX class="size-5" />
      <span class="sr-only">Close</span>
    </button>
  {/snippet}
</Dialog.Close>

<style>
  @reference '../../../../app.css';

  @layer components {
    button {
      @apply absolute top-4 right-4;
      @apply inline-flex cursor-pointer items-center justify-center rounded-md;
      @apply disabled:pointer-events-none;

      &:focus-visible {
        @apply ring-2 ring-rose-500/50 outline-none;
      }
    }
  }
</style>
