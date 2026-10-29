<script lang="ts">
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
			const req = indexedDB.open('MyAppDB', 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains('calendar_events')) {
					const store = db.createObjectStore('calendar_events', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('title', 'title', { unique: false });
				}
			};
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	}

	async function getEvents() {
		const db = await openIndexedDB();
		return new Promise((resolve, reject) => {
			const tr = db.transaction('calendar_events', 'readonly');
			const req = tr.objectStore('calendar_events').getAll();
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
			tr.oncomplete = () => db.close();
		});
	}

	async function insertEvent(title: string) {
		const db = await openIndexedDB();
		return new Promise((resolve, reject) => {
			const tr = db.transaction('calendar_events', 'readwrite');
			const store = tr.objectStore('calendar_events');
			const req = store.add({ title });
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
			tr.oncomplete = () => db.close();
		});
	}
</script>

<div class="panel">
	<div class="toolbar">
		<button type="button" class="btn primary">New Event</button>
	</div>
	<ul>
		<li>
			<h2></h2>
			<p></p>
		</li>
	</ul>
</div>

<style>
	.panel {
		padding: 1rem;
	}
	li {
		padding: 1rem;
		background-color: color-mix(in lab, var(--color-secondary) 90%, var(--color-base));
	}
	li h2 {
		margin-block-end: 1rem;
		font-weight: bolder;
	}
	li p {
		color: alpha(from var(--color-muted-text) / 0.8);
	}
</style>
