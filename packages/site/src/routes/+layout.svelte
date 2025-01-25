<script lang="ts">
  import 'components/app.css';
  import { Theme } from 'components/theme/index.js';
  import type { Snippet } from 'svelte';

  type Props = {
    children?: Snippet;
  };
  let { children }: Props = $props();
</script>

<Theme />
{@render children?.()}
