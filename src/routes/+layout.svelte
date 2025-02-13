<script lang="ts">
  import 'inter-ui/inter.css';
  import 'inter-ui/inter-variable.css';
  import '../app.css';
  import { ModeWatcher, toggleMode } from 'mode-watcher';
  import Moon from 'svelte-lucide/Moon.svelte';
  import Sun from 'svelte-lucide/Sun.svelte';
  import { Button } from '$lib/components';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<ModeWatcher />

<header>
  <div>
    <Button class="ghost icon" onclick={() => toggleMode()}>
      <Moon size="30" class="not-dark:hidden" />
      <Sun class="dark:hidden" />
    </Button>
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
