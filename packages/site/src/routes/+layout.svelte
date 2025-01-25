<script lang="ts">
  import 'components/app.css';
  import { ThemeWatcher } from 'components/theme-watcher/index.js';
  import type { Snippet } from 'svelte';

  type Props = {
    children?: Snippet;
  };
  let { children }: Props = $props();
</script>

<ThemeWatcher />
{@render children?.()}
