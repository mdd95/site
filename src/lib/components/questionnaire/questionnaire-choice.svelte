<script lang="ts">
	import { ActiveMarks, Editor } from '@/prosemirror/index.js';

	interface Props {
		name: string;
		value: string;
	}

	let { name, value }: Props = $props();

	const editor = new Editor();
	editor.activeMarks = new ActiveMarks();
</script>

<div
	class="grid grid-cols-[auto_1fr] rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
>
	<div class="mr-4">
		<input type="radio" {name} />
		<label for="" class="text-muted-foreground">{value}</label>
	</div>
	<div class="" use:editor.bind></div>
</div>
