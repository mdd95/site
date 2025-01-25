<script lang="ts">
  import { setupTheme } from './setup.js';
</script>

<svelte:head>
  <meta name="theme-color" content="white" />
  {@html `<script>(${setupTheme.toString()})();</script>`}
</svelte:head>
