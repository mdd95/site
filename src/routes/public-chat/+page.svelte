<script lang="ts">
	import { useWebSocket } from '$lib/hooks/use-websocket.js';
	import { getMessages, sendMessage } from './public-chat.remote.js';

	let messages = getMessages();

	const { sendJson } = useWebSocket('/public-chat', {
		onmessage: (data) => {
			messages.withOverride((messages) => [...messages, data.data]);
		}
	});
</script>

{#each await messages as message (message.id)}
	<div>{message.content}</div>
{/each}

<form
	{...sendMessage.enhance(async (form) => {
		if (await form.submit()) {
			form.element.reset();
			sendJson({ _type: 'message', data: form.result?.data });
		}
	})}
>
	<textarea {...sendMessage.fields.content.as('text')}></textarea>
	<button type="submit">Send</button>
</form>
