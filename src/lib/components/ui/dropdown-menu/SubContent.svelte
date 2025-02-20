<script lang="ts">
  import { DropdownMenu, mergeProps, type WithoutChild } from 'bits-ui';

  let { children }: WithoutChild<DropdownMenu.SubContentProps> = $props();
</script>

<DropdownMenu.SubContent>
  {#snippet child({ props, wrapperProps })}
    <div {...wrapperProps}>
      <div {...mergeProps(props, { class: 'subcontent' })}>
        {@render children?.()}
      </div>
    </div>
  {/snippet}
</DropdownMenu.SubContent>

<style>
  @reference '../../../../app.css';

  @layer components {
    .subcontent {
      @apply flex min-w-32 flex-col overflow-x-hidden rounded-md py-2 shadow outline-none;
      @apply bg-neutral-100 dark:bg-neutral-900;
      @apply data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95;
      @apply data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2;
    }
  }
</style>
