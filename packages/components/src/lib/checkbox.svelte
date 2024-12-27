<script lang="ts" module>
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { WithoutChildrenOrChild } from 'bits-ui';

  export type CheckboxProps = HTMLInputAttributes &
    WithoutChildrenOrChild<Checkbox.RootProps> & {
      bits?: boolean;
      labelText: string;
      labelRef?: HTMLLabelElement | null;
    };
</script>

<script lang="ts">
  import { Checkbox, Label, useId } from 'bits-ui';
  import Check from 'svelte-radix/Check.svelte';
  import Minus from 'svelte-radix/Minus.svelte';

  let {
    bits = false,
    id = useId(),
    checked = $bindable(false),
    ref = $bindable(null),
    labelRef = $bindable(null),
    labelText,
    ...restProps
  }: CheckboxProps = $props();
</script>

<div class="checkbox">
  {#if bits}
    <Checkbox.Root bind:checked bind:ref {id} {...restProps}>
      {#snippet children({ checked, indeterminate })}
        {#if indeterminate}
          <Minus size={16} />
        {:else if checked}
          <Check size={16} />
        {/if}
      {/snippet}
    </Checkbox.Root>
  {:else}
    <input type="checkbox" bind:checked bind:this={ref} {id} {...restProps} />
  {/if}
  <Label.Root for={id} bind:ref={labelRef}>
    {labelText}
  </Label.Root>
</div>

<style>
  .checkbox {
    margin-block: 0.5rem;
    display: flex;
    align-items: center;
  }

  .checkbox :global(> * + *) {
    margin-left: 0.5rem;
  }

  .checkbox :global([data-checkbox-root]) {
    width: 1rem;
    height: 1rem;
    border-radius: var(--radius);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid currentColor;
    transition: var(--tr-colors) var(--tr-duration) var(--tr-timing);
    font-weight: 600;
  }

  .checkbox :global([data-checkbox-root][data-state='checked']) {
    background-color: oklch(var(--color-600) var(--primary));
    color: oklch(var(--light-100));
    border-color: oklch(var(--color-600) var(--primary));
  }
</style>
