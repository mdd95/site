<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = HTMLAttributes<HTMLButtonElement> & {
    children?: Snippet;
  };

  let { children, ...restProps }: Props = $props();
</script>

<button {...restProps}>
  {@render children?.()}
</button>
