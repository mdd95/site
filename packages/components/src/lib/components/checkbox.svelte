<script lang="ts">
  import { Checkbox } from 'bits-ui';
  import Check from 'svelte-radix/Check.svelte';
  import Minus from 'svelte-radix/Minus.svelte';

  import type { WithoutChildrenOrChild } from 'bits-ui';

  type Props = WithoutChildrenOrChild<Checkbox.RootProps>;

  let { ref = $bindable(null), checked = $bindable(false), ...restProps }: Props = $props();
</script>

<Checkbox.Root bind:ref bind:checked {...restProps}>
  {#snippet child({ props, checked, indeterminate })}
    <button {...props}>
      {#if indeterminate}
        <Minus size={16} />
      {:else if checked}
        <Check size={16} />
      {/if}
    </button>
  {/snippet}
</Checkbox.Root>

<style>
  button {
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--foreground-default);
    border-radius: var(--border-radius-default);
    cursor: pointer;
  }

  button[data-state='checked'] {
    background-color: var(--color-primary-500);
    color: var(--color-primary-100);
    border-color: var(--color-primary-500);
  }

  button :global(svg) {
    width: 1rem;
    height: 1rem;
  }
</style>
