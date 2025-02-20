<script lang="ts">
  import { fromStore } from 'svelte/store';
  import { setMode, userPrefersMode } from 'mode-watcher';
  import { DropdownMenu } from '$lib/components/ui/dropdown-menu/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import Moon from 'svelte-lucide/Moon.svelte';
  import Sun from 'svelte-lucide/Sun.svelte';

  const mode = fromStore(userPrefersMode);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button type="button" class="ghost icon" {...props}>
        <Moon class="not-dark:hidden" />
        <Sun class="dark:hidden" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-32" align="end">
    <DropdownMenu.CheckboxItem
      bind:checked={() => mode.current === 'light', () => setMode('light')}
    >
      Light
    </DropdownMenu.CheckboxItem>
    <DropdownMenu.CheckboxItem bind:checked={() => mode.current === 'dark', () => setMode('dark')}>
      Dark
    </DropdownMenu.CheckboxItem>
    <DropdownMenu.CheckboxItem
      bind:checked={() => mode.current === 'system', () => setMode('system')}
    >
      System
    </DropdownMenu.CheckboxItem>
  </DropdownMenu.Content>
</DropdownMenu.Root>
