<script lang="ts">
  import { Switch } from 'bits-ui';
  import type { WithoutChildrenOrChild } from 'bits-ui';

  type Props = WithoutChildrenOrChild<Switch.RootProps>;

  let { ref = $bindable(null), checked = $bindable(false), ...restProps }: Props = $props();
</script>

<Switch.Root bind:ref bind:checked {...restProps} value={true}>
  {#snippet child({ props })}
    <button {...props}>
      <Switch.Thumb />
    </button>
  {/snippet}
</Switch.Root>

<style>
  button {
    position: relative;
    width: 2rem;
    height: 1rem;
    border-radius: var(--border-radius-full);
    cursor: pointer;
  }

  button :global([data-switch-thumb]) {
    position: absolute;
    top: 50%;
    left: 0.125rem;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: var(--border-radius-full);
    transform: translate(0, -50%);
    transition: var(--transition-all);
    pointer-events: none;
  }

  button :global([data-switch-thumb][data-state='checked']) {
    transform: translate(1rem, -50%);
  }

  /* Color styles */

  button {
    --box-shadow: currentColor;
    box-shadow: inset 0 0 0 0.0625rem var(--box-shadow);
  }
  button[data-state='checked'] {
    --box-shadow: var(--color-primary-500);
  }

  button :global([data-switch-thumb]) {
    --background: currentColor;
    background-color: var(--background);
  }
  button :global([data-switch-thumb][data-state='checked']) {
    --background: var(--color-primary-500);
  }
</style>
