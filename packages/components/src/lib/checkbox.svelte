<script lang="ts">
  import { Checkbox, Label, useId, type WithoutChildrenOrChild } from 'bits-ui';
  import Check from 'svelte-radix/Check.svelte';
  import Minus from 'svelte-radix/Minus.svelte';

  let {
    id = useId(),
    checked = $bindable(false),
    ref = $bindable(null),
    labelRef = $bindable(null),
    labelText,
    ...restProps
  }: WithoutChildrenOrChild<Checkbox.RootProps> & {
    labelText: string;
    labelRef?: HTMLLabelElement | null;
  } = $props();
</script>

<div class="checkbox">
  <Checkbox.Root bind:checked bind:ref {id} {...restProps}>
    {#snippet children({ checked, indeterminate })}
      {#if indeterminate}
        <Minus size={16} />
      {:else if checked}
        <Check size={16} />
      {/if}
    {/snippet}
  </Checkbox.Root>
  <Label.Root for={id} bind:ref={labelRef}>
    {labelText}
  </Label.Root>
</div>

<style>
  .checkbox {
    display: flex;
    align-items: center;
  }

  .checkbox :global(> * + *) {
    margin-left: 0.5rem;
  }

  .checkbox :global([data-checkbox-root]) {
    border: 1px solid currentColor;
    width: 1rem;
    height: 1rem;
    border-radius: var(--radius);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>
