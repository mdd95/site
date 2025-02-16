<script lang="ts">
  import { mode, setMode } from 'mode-watcher';
  import { DropdownMenu } from 'bits-ui';
  import DropdownMenuContent from './dropdown-menu/dropdown-menu-content.svelte';
  import Button from './button.svelte';
  import Moon from 'svelte-lucide/Moon.svelte';
  import Sun from 'svelte-lucide/Sun.svelte';
  import Check from 'svelte-lucide/Check.svelte';
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
  <DropdownMenu.Portal>
    <DropdownMenuContent align="end">
      <Button type="button" class="ghost w-full justify-between" onclick={() => setMode('light')}>
        Light
        <Check class={[$mode !== 'light' && 'hidden']} />
      </Button>
      <Button type="button" class="ghost w-full justify-between" onclick={() => setMode('dark')}>
        Dark
        <Check class={[$mode !== 'dark' && 'hidden']} />
      </Button>
      <Button type="button" class="ghost w-full justify-between" onclick={() => setMode('system')}>
        System
      </Button>
    </DropdownMenuContent>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
