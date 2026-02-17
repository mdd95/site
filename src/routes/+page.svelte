<script lang="ts">
	import Editor from '$lib/prosemirror/Editor.svelte';

	let content = $state('<p>Hello World!</p>');
</script>

<Editor bind:content />
