<script lang="ts">
	import { useWebSocket } from '$lib/hooks/use-websocket.js';
	import { getMessages, sendMessage } from './public-chat.remote.js';

	let messages = getMessages();
	let counter = 0;

	const { sendJson } = useWebSocket('/public-chat', {
		onmessage: (data) => {
			messages.withOverride((messages) => [
				...messages,
				{
					id: String(counter++),
					content: data.content,
					senderId: '',
					createdAt: new Date()
				}
			]);
		}
	});
</script>

{#each await messages as message (message.id)}
	<div>{message.content}</div>
{/each}

<form
	{...sendMessage.enhance(async (form) => {
		await form.submit().updates(messages.withOverride((messages) => messages));
		sendJson({ _type: 'message', content: form.fields.content.value() });
		form.element.reset();
	})}
>
	<textarea {...sendMessage.fields.content.as('text')}></textarea>
	<button type="submit">Send</button>
</form>
