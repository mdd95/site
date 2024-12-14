<script lang="ts" module>
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';

  export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'outline' | 'destructive';
  export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };
</script>

<script lang="ts">
  import clsx from 'clsx';

  let {
    ref = $bindable(null),
    children,
    variant = 'default',
    size = 'default',
    href = undefined,
    class: className,
    ...restProps
  }: ButtonProps = $props();

  const cn = clsx(variant != 'default' && variant, size != 'default' && size, className);
</script>

{#if href}
  <a bind:this={ref} {href} class={cn} {...restProps}>
    {@render children?.()}
  </a>
{:else}
  <button bind:this={ref} class={cn} {...restProps}>
    {@render children?.()}
  </button>
{/if}

<style>
  a,
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
</style>
