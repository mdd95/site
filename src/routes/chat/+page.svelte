<script lang="ts">
	import { user } from '$lib/auth.remote.js';
	import { formPublicChat, loadPublicChat } from './chat.remote.js';

	const a = $derived(await user());
</script>

<div class="container">
	<div>
		<svelte:boundary>
			{#each await loadPublicChat() as message (message.id)}
				<div class:sender={message.senderId === a?.user.id}>
					{message.content}
				</div>
			{/each}
		</svelte:boundary>
	</div>

	<form
		{...formPublicChat.enhance(async ({ form, submit }) => {
			if (await submit()) {
				form.reset();
				// TODO: Send the new message to the server via WebSocket
			}
		})}
	>
		<textarea {...formPublicChat.fields.content.as('text')} placeholder="Type your message..."
		></textarea>
		<button type="submit">Send</button>
	</form>
</div>

<style>
	.container {
		margin: 0 auto;
		width: min(32rem, 100%);
		height: 100vh;
		display: grid;
		grid-template-rows: 1fr auto;
	}

	.sender {
		text-align: right;
	}

	form {
		height: max-content;
		padding: 1rem 0;
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: 0.5rem;
	}

	textarea {
		min-height: 3rem;
		max-height: 10rem;
		field-sizing: content;
	}
</style>
