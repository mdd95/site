<script lang="ts">
  import { Switch } from 'bits-ui';

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    ...restProps
  }: Switch.RootProps = $props();
</script>

<Switch.Root bind:ref bind:checked {...restProps}>
  {#snippet child({ props })}
    <button {...props}>
      <Switch.Thumb />
    </button>
  {/snippet}
</Switch.Root>

<style>
  [data-switch-root] {
    position: relative;
    width: 2.5rem;
    height: 1.25rem;
    display: inline-flex;
    align-items: center;
    background-color: oklch(var(--light-100));
    border-radius: 9999px;
  }

  [data-switch-root] :global([data-switch-thumb]) {
    position: absolute;
    top: 50%;
    left: 0.1875rem;
    width: 0.875rem;
    height: 0.875rem;
    background-color: oklch(var(--light-975));
    border-radius: 9999px;
    display: block;
    transform: translate(0, -50%);
    transition: transform var(--tr-duration);
    pointer-events: none;
  }
  [data-switch-root] :global([data-switch-thumb][data-state='checked']) {
    transform: translate(1.25rem, -50%);
  }
</style>
