<script lang="ts">
	import { io, type Socket } from 'socket.io-client';
	import { getUser } from '$lib/remote/auth.remote.js';
	import { getMessages, sendMessage } from './public-chat.remote.js';

	let messages = getMessages();

	const user = $derived(await getUser());
	let socket: Socket;

	$effect(() => {
		socket = io({
			auth: { token: user?.token }
		});

		socket.on('chat message', (data) => {
			messages.withOverride((messages) => [...messages, data.data]);
		});

		() => {
			socket.close();
		};
	});
</script>

{#each await messages as message (message.id)}
	<div>{message.content}</div>
{/each}

<form
	{...sendMessage.enhance(async (form) => {
		if (await form.submit()) {
			form.element.reset();
			socket.emit('chat message', { data: form.result?.data });
		}
	})}
>
	<textarea {...sendMessage.fields.content.as('text')}></textarea>
	<button type="submit">Send</button>
</form>
