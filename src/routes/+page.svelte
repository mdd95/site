<script lang="ts">
	import { Button } from 'bits-ui';
	import { toggleMode } from 'mode-watcher';
	import { createViewTransition } from '$lib/utils/create-view-transition.js';
</script>

<Button.Root onclick={() => createViewTransition(toggleMode)}>Toggle</Button.Root>
