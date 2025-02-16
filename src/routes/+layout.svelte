<script lang="ts">
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import { ThemeSelect } from '$lib/components/index.js';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<ModeWatcher />

<header>
  <div>
    <ThemeSelect />
  </div>
</header>
{@render children?.()}

<style>
  @reference '../app.css';

  header > div {
    @apply container mx-auto p-4;
    @apply flex items-center justify-end;
  }
</style>
