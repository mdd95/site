<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Dialog } from '$lib/components/ui/dialog/index.js';
</script>

<main class="container mx-auto px-4">
  <h1>Welcome to SvelteKit</h1>
  <p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
  </p>
  <Dialog.Root>
    <Dialog.Trigger>
      {#snippet child({ props })}
        <Button class="sky mt-4" {...props}>Get Started</Button>
      {/snippet}
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Title>Get Started</Dialog.Title>
      <div class="h-20"></div>
      <Button>Confirm</Button>
    </Dialog.Content>
  </Dialog.Root>
</main>
