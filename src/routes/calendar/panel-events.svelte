<script lang="ts">
	import { onMount } from 'svelte';
	import { nanoid } from 'nanoid';
	import * as v from 'valibot';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import TrashIcon from '@lucide/svelte/icons/trash';

	type CalendarEvents = {
		id: string;
		title: string;
		description: string;
		start?: string;
		end?: string;
	};

	const DB_NAME = 'Calendar';
	const DB_VERSION = 1;
	const STORE_NAME = 'Events';

	let events = $state<CalendarEvents[]>([]);

	function openIndexedDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const req = window.indexedDB.open(DB_NAME, DB_VERSION);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME, { keyPath: 'id' });
				}
			};
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	}

	async function getEvents(): Promise<CalendarEvents[]> {
		const db = await openIndexedDB();
		return new Promise((resolve, reject) => {
			const tr = db.transaction(STORE_NAME, 'readonly');
			const req = tr.objectStore(STORE_NAME).getAll();
			req.onsuccess = () => resolve(req.result as CalendarEvents[]);
			req.onerror = () => reject(req.error);
			tr.oncomplete = () => db.close();
		});
	}

	async function insertEvent(value: CalendarEvents) {
		const db = await openIndexedDB();
		return new Promise((resolve, reject) => {
			const tr = db.transaction(STORE_NAME, 'readwrite');
			const store = tr.objectStore(STORE_NAME);
			const req = store.add(value);
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
			tr.oncomplete = () => db.close();
		});
	}

	async function deleteEvent(id: string) {
		const db = await openIndexedDB();
		return new Promise((resolve, reject) => {
			const tr = db.transaction(STORE_NAME, 'readwrite');
			const store = tr.objectStore(STORE_NAME);
			const req = store.delete(id);
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
			tr.oncomplete = () => db.close();
		});
	}

	async function createEvent(e: SubmitEvent) {
		const formEl = e.target as HTMLFormElement;
		const formData = Object.fromEntries(new FormData(formEl));

		const validation = v.safeParse(
			v.object({
				title: v.pipe(v.string(), v.minLength(1)),
				description: v.string(),
				start: v.optional(v.string()),
				end: v.optional(v.string())
			}),
			formData
		);
		if (!validation.success) return;

		await insertEvent({ id: nanoid(), ...validation.output });
		events = await getEvents();

		formEl.reset();
	}

	onMount(() => {
		void getEvents().then((result) => (events = result));
	});
</script>

<div class="panel">
	<div class="toolbar">
		<button
			type="button"
			command="show-modal"
			commandfor="dialog-create-event"
			class="btn btn-primary"
		>
			<PlusIcon />
			New Event
		</button>
		<dialog id="dialog-create-event" closedby="closerequest" class="dialog">
			<form method="dialog" onsubmit={createEvent}>
				<div>
					<h2>Create new event</h2>
				</div>
				<div class="content">
					<div class="input-group">
						<input
							type="text"
							id="event-title"
							name="title"
							placeholder=""
							class="input-field"
						/>
						<label for="event-title" class="input-label">Title</label>
					</div>
					<div class="input-group">
						<input
							type="text"
							id="event-description"
							name="description"
							placeholder=""
							class="input-field"
						/>
						<label for="event-description" class="input-label">Description</label>
					</div>
					<div>
						<label for="event-start">Event starts</label>
						<input type="datetime-local" id="event-start" name="start" />
					</div>
					<div>
						<label for="event-end">Event ends</label>
						<input type="datetime-local" id="event-end" name="end" />
					</div>
					<div>
						<label for="event-notes">Notes</label>
						<textarea name="notes" id="event-notes"></textarea>
					</div>
				</div>
				<div class="actions">
					<button
						type="button"
						command="request-close"
						commandfor="dialog-create-event"
						class="btn btn-secondary">Cancel</button
					>
					<button type="submit" class="btn btn-primary">Create</button>
				</div>
			</form>
		</dialog>
		<button type="button" class="btn btn-secondary btn-icon">
			<TrashIcon />
		</button>
	</div>
	<ul>
		{#each events as event (event.id)}
			<li>
				<h2>{event.title}</h2>
				<p>{event.description}</p>
				<button
					class="btn ghost btn-delete"
					onclick={async () => {
						await deleteEvent(event.id);
						events = await getEvents();
					}}
				>
					Delete
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.panel {
		padding: 1rem;
	}
	ul {
		list-style: none;
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
	form {
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}
	form h2 {
		margin-block-end: 1rem;
		font-size: 1rem;
		font-weight: bolder;
	}
	.actions {
		margin-block-start: 0.5rem;
		display: inline-flex;
		justify-content: end;
		gap: 0.25rem;
	}
	label {
		color: var(--color-muted-text);
		font-size: 0.875rem;
	}
	.input-group {
		position: relative;
		margin: 0 0 0.875rem;
		width: 100%;
	}
	.input-field {
		box-sizing: border-box;
		width: 100%;
		padding: 12px;
		border: 1px solid var(--color-border);
		background-color: transparent;
		color: inherit;
		outline: transparent;
		transition: border-color 0.2s ease;
		&:focus {
			border-color: var(--color-primary);
		}
		&:focus ~ .input-label,
		&:not(:placeholder-shown) ~ .input-label {
			top: 0;
			transform: translateY(-50%) scale(0.85);
			transform-origin: left center;
			color: var(--color-primary);
		}
	}
	.input-label {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		transform-origin: left center;
		padding: 0 4px;
		background-color: var(--color-dialog);
		color: var(--color-muted-text);
		pointer-events: none;
		transition:
			top 0.2s ease,
			transform 0.2s ease,
			color 0.2s ease;
	}
	label:has(+ input[type='datetime-local']),
	label:has(+ textarea) {
		margin-block-end: 0.25rem;
		display: block;
	}
	input[type='datetime-local'],
	textarea {
		margin-block-end: 0.25rem;
		padding: 12px;
		width: 100%;
		background-color: var(--color-dialog);
		border: 1px solid var(--color-border);
		outline: transparent;
	}
	textarea {
		min-block-size: calc(3lh + 12px * 2 + 1px * 2);
		field-sizing: content;
		resize: vertical;
	}
	.btn-delete {
		height: 1.5rem;
		font-size: 0.625rem;
	}
</style>
