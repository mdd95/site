<script lang="ts">
	import { io, type Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import { getMessages, sendMessage } from './page.remote.js';
	import type { getUser } from '$lib/remote/auth.remote.js';

	type Message = Awaited<ReturnType<typeof getMessages>>[0];

	type Props = {
		user: NonNullable<Awaited<ReturnType<typeof getUser>>>;
	};

	let { user }: Props = $props();

	let newChatMessages = $state<Message[]>([]);
	let socket: Socket | undefined;

	onMount(() => {
		socket = io({
			auth: {
				token: user.token,
				room: 'public-chat'
			}
		});

		socket.on('chat:message', (message: Message) => {
			newChatMessages.push(message);
		});

		return () => socket?.disconnect();
	});
</script>

<div class="chat-window">
	<header class="chat-header">
		<h2>Public Chat</h2>
	</header>

	<div class="messages">
		{#snippet bubble(message: Message)}
			<div class="message">
				<div class="bubble">
					{message.content}
				</div>
			</div>
		{/snippet}

		{#each await getMessages() as message (message.id)}
			{@render bubble(message)}
		{/each}

		{#each newChatMessages as message (message.id)}
			{@render bubble(message)}
		{/each}
	</div>

	<form
		class="chat-input"
		{...sendMessage.enhance(async (form) => {
			if (await form.submit()) {
				form.element.reset();

				socket?.emit('chat:message', form.result?.data);

				newChatMessages.length = 0;
			}
		})}
	>
		<input placeholder="Type a message..." {...sendMessage.fields.content.as('text')} />

		<button type="submit"> Send </button>
	</form>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #f4f6f9;
		font-family: system-ui, sans-serif;
	}

	.chat-window {
		width: min(900px, 100%);
		height: calc(100vh - 40px);

		margin: 20px auto;

		display: flex;
		flex-direction: column;

		border-radius: 20px;
		overflow: hidden;

		background: white;

		box-shadow: 0 10px 30px rgb(0 0 0 / 0.12);
	}

	.chat-header {
		flex-shrink: 0;

		padding: 18px 24px;

		border-bottom: 1px solid #ececec;

		background: white;
	}

	.chat-header h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.messages {
		flex: 1;

		overflow-y: auto;

		padding: 20px;

		display: flex;
		flex-direction: column;
		gap: 12px;

		background: #f8fafc;
	}

	.message {
		display: flex;
	}

	.bubble {
		max-width: 70%;

		padding: 12px 16px;

		background: white;

		border-radius: 18px;

		box-shadow: 0 2px 8px rgb(0 0 0 / 0.05);

		word-break: break-word;
	}

	.chat-input {
		flex-shrink: 0;

		display: flex;
		gap: 12px;

		padding: 16px 20px;

		border-top: 1px solid #ececec;

		background: white;
	}

	.chat-input input {
		flex: 1;

		padding: 12px 18px;

		border: none;

		border-radius: 999px;

		background: #f2f4f7;

		font-size: 15px;

		outline: none;
	}

	.chat-input input:focus {
		background: #edf2ff;
	}

	.chat-input button {
		padding: 0 24px;

		border: none;

		border-radius: 999px;

		background: #3b82f6;
		color: white;

		font-weight: 600;

		cursor: pointer;

		transition: background 0.2s;
	}

	.chat-input button:hover {
		background: #2563eb;
	}
</style>
