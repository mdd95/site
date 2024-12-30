<script lang="ts">
  import { Switch } from 'bits-ui';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = Switch.RootProps &
    HTMLInputAttributes & {
      bits?: boolean;
    };

  let {
    bits = false,
    ref = $bindable(null),
    checked = $bindable(false),
    ...restProps
  }: Props = $props();
</script>

{#if bits}
  <Switch.Root bind:ref bind:checked {...restProps}>
    {#snippet child({ props })}
      <button {...props}>
        <Switch.Thumb />
      </button>
    {/snippet}
  </Switch.Root>
{:else}
  <input type="checkbox" bind:this={ref} bind:checked {...restProps} />
{/if}

<style>
  input {
    appearance: none;
  }

  input::after {
    content: '';
  }

  input,
  button {
    position: relative;
    width: 2.25rem;
    height: 1.25rem;
    border-radius: var(--radius-full);
  }

  input::after,
  button :global([data-switch-thumb]) {
    position: absolute;
    top: 50%;
    left: 0.125rem;
    width: 1rem;
    height: 1rem;
    border-radius: var(--radius-full);
    transform: translate(0, -50%);
    transition: transform var(--tr-duration) var(--tr-timing);
    pointer-events: none;
  }

  input:checked::after,
  button :global([data-switch-thumb][data-state='checked']) {
    transform: translate(1rem, -50%);
  }

  input,
  button {
    box-shadow: inset 0 0 0 1px oklch(var(--light-975));
  }

  input::after,
  button :global([data-switch-thumb]) {
    background-color: oklch(var(--light-975));
  }

  :global(:where(.dark, .dark *)) input,
  :global(:where(.dark, .dark *)) button {
    box-shadow: inset 0 0 0 1px oklch(var(--light-100));
  }
  :global(:where(.dark, .dark *)) input::after,
  :global(:where(.dark, .dark *)) button :global([data-switch-thumb]) {
    background-color: oklch(var(--light-100));
  }
</style>
