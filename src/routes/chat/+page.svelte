<script lang="ts">
	import { getUserSession } from '$lib/remote/auth.remote.js';
	import { formPublicChat, loadPublicChat } from '$lib/remote/chat.remote.js';

	const a = $derived(await getUserSession());
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
		{...formPublicChat.enhance(async ({ element, submit }) => {
			if (await submit()) {
				element.reset();
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
