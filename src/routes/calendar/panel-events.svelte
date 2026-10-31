<script lang="ts">
	import { onMount } from 'svelte';
	import { nanoid } from 'nanoid';

	type CalendarEvents = {
		id: string;
		title: string;
		description: string;
		start: string;
		end: string;
	};

	let events = $state<CalendarEvents[]>([]);

	function openIndexedDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const req = indexedDB.open('Calendar', 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains('events')) {
					db.createObjectStore('events', { keyPath: 'id' });
				}
			};
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	}

	async function getEvents(): Promise<CalendarEvents[]> {
		const db = await openIndexedDB();
		return new Promise((resolve, reject) => {
			const tr = db.transaction('events', 'readonly');
			const req = tr.objectStore('events').getAll();
			req.onsuccess = () => resolve(req.result as CalendarEvents[]);
			req.onerror = () => reject(req.error);
			tr.oncomplete = () => db.close();
		});
	}

	async function insertEvent(data: CalendarEvents) {
		const db = await openIndexedDB();
		return new Promise((resolve, reject) => {
			const tr = db.transaction('events', 'readwrite');
			const store = tr.objectStore('events');
			const req = store.add(data);
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
			tr.oncomplete = () => db.close();
		});
	}

	onMount(() => {
		(async () => {
			events = await getEvents();
		})();
	});
</script>

<div class="panel">
	<div class="toolbar">
		<button
			type="button"
			command="show-modal"
			commandfor="dialog-create-event"
			class="btn primary">New Event</button
		>
		<dialog id="dialog-create-event" closedby="any">
			<form
				method="dialog"
				onsubmit={async (e) => {
					const form = new FormData(e.target as HTMLFormElement);
					await insertEvent({
						id: nanoid(),
						title: form.get('title')?.toString() ?? '',
						description: form.get('description')?.toString() ?? '',
						start: new Date().toLocaleDateString(),
						end: new Date().toLocaleDateString()
					});
					events = await getEvents();
				}}
			>
				<div class="content">
					<label for="event-title">Title</label>
					<input type="text" id="event-title" name="title" />
					<label for="event-description">Description</label>
					<input type="text" id="event-description" name="description" />
				</div>
				<div class="actions">
					<button class="btn primary">Create</button>
				</div>
			</form>
		</dialog>
	</div>
	<ul>
		{#each events as event (event.id)}
			<li>
				<h2>{event.title}</h2>
				<p>{event.description}</p>
			</li>
		{/each}
	</ul>
</div>

<style>
	.panel {
		padding: 1rem;
	}
	li {
		padding: 1rem;
		background-color: color-mix(in lab, var(--color-secondary) 90%, var(--color-base));
		&:has(+ li) {
			border-bottom: 1px solid var(--color-border);
		}
	}
	li h2 {
		margin-block-end: 0.375rem;
		font-size: 0.875rem;
		font-weight: bolder;
	}
	li p {
		color: var(--color-muted-text);
		font-size: 0.75rem;
	}
	dialog {
		margin: auto;
		width: min(18rem, 100%);
		height: min(12rem, 100dvh - 2rem);
		background-color: color-mix(in lab, var(--color-base) 80%, var(--color-base-text));
	}
	form {
		width: 100%;
		height: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}
	label {
		display: block;
		margin-bottom: 0.375rem;
		color: var(--color-muted-text);
		font-size: 0.875rem;
	}
	input {
		margin-bottom: 0.5rem;
		padding: 0.5rem 0.75rem;
		width: 100%;
	}
	.actions {
		display: inline-flex;
		justify-content: end;
	}
</style>
