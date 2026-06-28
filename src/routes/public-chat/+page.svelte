<script lang="ts">
	import { useWebSocket } from '$lib/hooks/use-websocket.js';
	import { getMessages, sendMessage } from './public-chat.remote.js';

	const { sendJson } = useWebSocket('/public-chat', {
		onmessage: () => {
			getMessages().refresh();
		}
	});
</script>

{#each await getMessages() as message (message.id)}
	<div>{message.content}</div>
{/each}

<form
	{...sendMessage.enhance(async (form) => {
		if (await form.submit()) {
			form.element.reset();
			sendJson({});
		}
	})}
>
	<textarea {...sendMessage.fields.content.as('text')}></textarea>
	<button type="submit">Send</button>
</form>
