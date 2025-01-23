<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useId } from '../utils/id.js';
  import { objToStyle } from '../utils/style.js';

  type Props = {
    children?: Snippet;
    trigger?: Snippet<[{ targetId: string; style: string }]>;
  };
  let { children, trigger }: Props = $props();

  const anchor = useId('--popover');
  const id = useId('popover');
</script>

{@render trigger?.({
  targetId: id,
  style: objToStyle({
    'anchor-name': anchor
  })
})}

<div
  {id}
  popover="auto"
  style={objToStyle({
    'position-anchor': anchor
  })}
>
  {@render children?.()}
</div>

<style>
  div {
    --offset: 4px;
    position: absolute;
    top: calc(anchor(bottom) + var(--offset));
    left: anchor(left);
    margin: 0;
    border: 0;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    background-color: color-mix(in oklab, var(--background) 80%, white);
    color: var(--text);
  }
</style>
