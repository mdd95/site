<script lang="ts">
  import { Theme, setTheme } from 'components';
  import type { Snippet } from 'svelte';

  type Props = {
    children?: Snippet;
  };

  let { children }: Props = $props();

  setTheme();
</script>

<Theme />
{@render children?.()}
