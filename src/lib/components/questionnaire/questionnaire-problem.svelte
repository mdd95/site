<script lang="ts">
	import { RichText } from '../rich-text/index.js';

	interface Props {
		item: number;
	}

	let { item }: Props = $props();
</script>

<RichText
	class="mb-4 rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
>
	<p class="mb-2 text-muted-foreground">Problem {item}</p>
</RichText>
