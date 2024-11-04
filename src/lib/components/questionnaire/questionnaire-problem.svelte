<script lang="ts">
	import { ActiveMarks, Editor } from '@/prosemirror/index.js';

	interface Props {
		item: number;
	}

	let { item }: Props = $props();

	const editor = new Editor();
	editor.activeMarks = new ActiveMarks();
</script>

<div
	class="mb-4 rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
	use:editor.bind
>
	<p class="mb-2 text-muted-foreground">Problem {item}</p>
</div>
