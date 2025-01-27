<script lang="ts">
  import type { PageData } from './$types';
  type Props = {
    data: PageData;
  };
  let { data }: Props = $props();
</script>

<svelte:head>
  <title>{data.metadata?.title}</title>
</svelte:head>

<main>
  <a href="/">Back to main</a>
  {#if data.content}
    {@const Component = data.content}
    <Component />
  {:else}
    <p>Can't find {data.slug}</p>
  {/if}
</main>

<style>
  main {
    max-width: 80ch;
    margin-inline: auto;
  }
</style>
