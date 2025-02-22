<script lang="ts" module>
	import 'katex/dist/katex.css';
	import katex from 'katex';

	export { inline, display };
</script>

{#snippet inline(tex: string)}
	{@html katex.renderToString(tex, {
		displayMode: false,
		throwOnError: false
	})}
{/snippet}

{#snippet display(tex: string)}
	{@html katex.renderToString(tex, {
		displayMode: true,
		throwOnError: false
	})}
{/snippet}
