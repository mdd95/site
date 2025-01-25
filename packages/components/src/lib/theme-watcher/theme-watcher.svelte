<script lang="ts">
  import { initializeTheme } from './init.js';
  import './state.svelte.js';
</script>

<svelte:head>
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0b0b" />
  {@html `<script>(${initializeTheme.toString()})();</script>`}
</svelte:head>
