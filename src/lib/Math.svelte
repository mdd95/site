<script lang="ts">
  import 'katex/dist/katex.css';
  import katex from 'katex';

  type Props = {
    render: string;
    display?: boolean;
  };
  let { render, display = true }: Props = $props();
  let ref: HTMLElement;

  $effect(() => {
    katex.render(render.trim(), ref, {
      displayMode: display,
      throwOnError: false
    });
  });
</script>

<span bind:this={ref}></span>
