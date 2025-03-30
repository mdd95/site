<script lang="ts">
	import { fromStore } from 'svelte/store';
	import { setMode, userPrefersMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';

	const mode = fromStore(userPrefersMode);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" size="icon" {...props}>
				<Moon class="not-dark:hidden" />
				<Sun class="dark:hidden" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="z-50 w-36" align="end">
		<DropdownMenu.CheckboxItem
			bind:checked={() => mode.current === 'light', () => setMode('light')}
		>
			Light
		</DropdownMenu.CheckboxItem>
		<DropdownMenu.CheckboxItem
			bind:checked={() => mode.current === 'dark', () => setMode('dark')}
		>
			Dark
		</DropdownMenu.CheckboxItem>
		<DropdownMenu.CheckboxItem
			bind:checked={() => mode.current === 'system', () => setMode('system')}
		>
			System
		</DropdownMenu.CheckboxItem>
	</DropdownMenu.Content>
</DropdownMenu.Root>
