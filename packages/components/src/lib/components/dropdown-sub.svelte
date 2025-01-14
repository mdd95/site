<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import { createAnchorId } from './dropdown-context.js';

  type Props = DropdownMenu.SubProps;

  let { children, ...restProps }: Props = $props();

  createAnchorId();
</script>

<DropdownMenu.Sub {...restProps}>
  {@render children?.()}
</DropdownMenu.Sub>
