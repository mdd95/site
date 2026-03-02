<script lang="ts">
	import Editor from '$lib/prosemirror/Editor.svelte';

	let content = $state('<p>ProseMirror with Math plugin.</p>');
</script>

<Editor bind:content />
