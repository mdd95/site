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
    padding-inline: 1rem;
    padding-block: 0.75rem;
    border: 1px solid color-mix(in oklab, var(--background) 92.5%, var(--text));
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    background-color: color-mix(in oklab, var(--background) 95%, var(--text));
    color: var(--text);
  }
</style>
