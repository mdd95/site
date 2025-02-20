<script lang="ts">
  import { Dialog, type WithoutChild } from 'bits-ui';

  let { children, ...restProps }: WithoutChild<Dialog.DescriptionProps> = $props();
</script>

<Dialog.Description {...restProps}>
  {#snippet child({ props })}
    <div {...props}>
      {@render children?.()}
    </div>
  {/snippet}
</Dialog.Description>

<style>
  @reference '../../../../app.css';

  @layer components {
    div {
      @apply text-lg font-semibold;
    }
  }
</style>
