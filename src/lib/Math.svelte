<script lang="ts" module>
  import 'katex/dist/katex.css';
  import katex from 'katex';

  export { math };
</script>

{#snippet math(tex: string, displayMode = false)}
  {@html katex.renderToString(tex, {
    displayMode,
    throwOnError: false
  })}
{/snippet}
