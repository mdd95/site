<script lang="ts">
	import Editor from '$lib/prosemirror/Editor.svelte';
	import { math } from '$lib/prosemirror/plugins/math/index.js';

	let content = $state('<p>ProseMirror with Math plugin.</p>');
</script>

<Editor plugins={[math]} bind:content />
