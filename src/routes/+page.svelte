<script lang="ts">
	import { Button } from 'bits-ui';
	import { toggleMode } from 'mode-watcher';

	function toggleThemeMode() {
		if (!document.startViewTransition) {
			toggleMode();
			return;
		}
		document.startViewTransition(toggleMode);
	}
</script>

<Button.Root onclick={toggleThemeMode}>Toggle</Button.Root>
