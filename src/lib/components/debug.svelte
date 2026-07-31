<script lang="ts">
	type Props = {
		data?: any;
	};
	let { data }: Props = $props();
</script>

<pre>
{JSON.stringify(data, null, 2)}
</pre>

<style>
	pre {
		white-space: pre-wrap;
		overflow-wrap: break-word;
	}
</style>
