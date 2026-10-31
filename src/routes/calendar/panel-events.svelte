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
		<dialog id="dialog-create-event" closedby="closerequest">
			<form
				method="dialog"
				onsubmit={async (e) => {
					const el = e.target as HTMLFormElement;
					const form = new FormData(el);
					await insertEvent({
						id: nanoid(),
						title: form.get('title')?.toString() ?? '',
						description: form.get('description')?.toString() ?? '',
						start: new Date().toLocaleDateString(),
						end: new Date().toLocaleDateString()
					});
					events = await getEvents();
					el.reset();
				}}
			>
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
		max-height: 100dvh;
		background-color: color-mix(in lab, var(--color-base) 94%, var(--color-base-text));
		opacity: 0;
		translate: 0 -16px;
		transition-property: opacity, translate, display, overlay;
		transition-duration: 0.1s;
		transition-timing-function: ease-in-out;
		transition-behavior: allow-discrete;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		&:open {
			opacity: 1;
			translate: 0 0;
			@starting-style {
				opacity: 0;
				translate: 0 -16px;
			}
		}
	}
	dialog::backdrop {
		background-color: transparent;
		backdrop-filter: blur(1px);
		overflow: hidden;
		transition-property: background-color, display, overlay;
		transition-duration: 0.1s;
		transition-timing-function: ease-in-out;
		transition-behavior: allow-discrete;
		overscroll-behavior: contain;
	}
	dialog:open::backdrop {
		background-color: rgb(0 0 0 / 0.5);
		@starting-style {
			background-color: transparent;
		}
	}
	form {
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}
	.actions {
		display: inline-flex;
		justify-content: end;
	}
	.input-group {
		position: relative;
		margin: 20px 0;
		width: 300px;
	}
	.input-field {
		box-sizing: border-box;
		width: 100%;
		padding: 12px;
		border: 1px solid color-mix(in lab, var(--color-border) 80%, var(--color-base-text));
		outline: none;
		background-color: transparent;
		color: inherit;
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
		background-color: color-mix(in lab, var(--color-base) 94%, var(--color-base-text));
		color: #999;
		pointer-events: none;
		transition:
			top 0.2s ease,
			transform 0.2s ease,
			color 0.2s ease;
	}
</style>
