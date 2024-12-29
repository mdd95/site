<script lang="ts">
  import { useId } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    id?: string;
    children?: Snippet<[{ id: string }]>;
  };

  let { id = useId(), children }: Props = $props();
</script>

{@render children?.({ id })}
