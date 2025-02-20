<script lang="ts">
  import { Dialog, type WithoutChild } from 'bits-ui';

  let { children, ...restProps }: WithoutChild<Dialog.TitleProps> = $props();
</script>

<Dialog.Title {...restProps}>
  {#snippet child({ props })}
    <div {...props}>
      {@render children?.()}
    </div>
  {/snippet}
</Dialog.Title>

<style>
  @reference '../../../../app.css';

  @layer components {
    div {
      @apply text-lg font-semibold;
    }
  }
</style>
