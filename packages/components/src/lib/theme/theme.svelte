<script lang="ts">
  import { setupTheme } from './setup.js';
  import './state.svelte.js';
</script>

<svelte:head>
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0b0b" />
  {@html `<script>(${setupTheme.toString()})();</script>`}
</svelte:head>
