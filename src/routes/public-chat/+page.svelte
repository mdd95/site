<script lang="ts">
	import { io, type Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import { getMessages, sendMessage } from './public-chat.remote.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let messages = getMessages();
	let socket: Socket | undefined;

	onMount(() => {
		if (!data.user?.token) return;

		socket = io({
			auth: {
				token: data.user.token,
				room: 'public-chat'
			}
		});

		socket.on('chat message', (data) => {
			messages.withOverride((current) => [...current, data.data]);
		});

		() => {
			socket?.disconnect();
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
			socket?.emit('chat message', { data: form.result?.data });
		}
	})}
>
	<textarea {...sendMessage.fields.content.as('text')}></textarea>
	<button type="submit">Send</button>
</form>
