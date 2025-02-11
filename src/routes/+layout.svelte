<script lang="ts">
  import '../app.css';
  import IconSun from 'svelte-lucide/Sun.svelte';
  import IconMoon from 'svelte-lucide/Moon.svelte';
  import { theme } from '$lib/theme.svelte.js';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<header>
  <div>
    <button onclick={() => theme.toggleMode()}>
      {#if theme.isDarkMode()}
        <IconMoon size="20" />
      {:else}
        <IconSun size="20" />
      {/if}
    </button>
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

  button {
    width: 2.25rem;
    height: 2.25rem;
    padding-inline: 1rem;
    align-content: center;
    justify-items: center;
    border-radius: var(--radius);
    cursor: pointer;
    transition-property: background-color, color;
    transition-duration: var(--transition-duration);
    transition-timing-function: var(--transition-easing);
  }
  @media (hover: hover) {
    button:hover {
      background-color: color-mix(in oklab, var(--primary) 10%, var(--light-dark));
    }
  }
</style>
