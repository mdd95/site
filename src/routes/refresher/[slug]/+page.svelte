<script lang="ts">
  import 'katex/dist/katex.css';
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.metadata ? data.metadata.title : `Not Found: ${data.slug}`}</title>
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
