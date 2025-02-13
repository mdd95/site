<script lang="ts">
  import 'inter-ui/inter.css';
  import 'inter-ui/inter-variable.css';
  import '../app.css';
  import { setContext } from 'svelte';
  import { ModeWatcher, toggleMode } from 'mode-watcher';
  import Moon from 'svelte-lucide/Moon.svelte';
  import Sun from 'svelte-lucide/Sun.svelte';
  import { Button } from '$lib/components';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
  setContext('iconCtx', { size: '20' });
</script>

<ModeWatcher />

<header class="bg-background-800">
  <div>
    <Button class="ghost" onclick={() => toggleMode()}>
      <Moon class="not-dark:hidden" />
      <Sun class="dark:hidden" />
    </Button>
  </div>
</header>
{@render children?.()}

<style>
  header > div {
    margin-inline: auto;
    padding-inline: 1rem;
    width: min(100%, 80rem);
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
