<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import { createAnchorId } from './dropdown-context.js';

  type Props = DropdownMenu.RootProps;

  let { children, ...restProps }: Props = $props();

  createAnchorId();
</script>

<DropdownMenu.Root {...restProps}>
  {@render children?.()}
</DropdownMenu.Root>
