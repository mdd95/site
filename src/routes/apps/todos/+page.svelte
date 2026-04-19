<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import { createId } from '$lib/utils/create-id.js';

	type Task = {
		id: string;
		name: string;
		description: string;
		status: 'pending' | 'in_progress' | 'completed';
		priority: 'low' | 'medium' | 'high';
		due_date: string | null;
		tags: string[];
		created_at: string;
		updated_at: string;
	};

	const SAMPLE = [
		{
			id: 'A7f3K2pQ',
			name: 'Finish project report',
			description: 'Complete the final draft and submit to the manager',
			status: 'in_progress',
			priority: 'high',
			due_date: '2026-04-20',
			tags: ['work', 'urgent'],
			created_at: '2026-04-18T08:00:00Z',
			updated_at: '2026-04-18T08:00:00Z'
		},
		{
			id: 'mN8xT4zB',
			name: 'Buy groceries',
			description: 'Milk, eggs, bread, and vegetables',
			status: 'pending',
			priority: 'medium',
			due_date: '2026-04-19',
			tags: ['personal', 'errands'],
			created_at: '2026-04-18T08:10:00Z',
			updated_at: '2026-04-18T08:10:00Z'
		},
		{
			id: 'Q2wE9rTy',
			name: 'Workout session',
			description: '30-minute cardio and strength training',
			status: 'completed',
			priority: 'low',
			due_date: '2026-04-18',
			tags: ['health'],
			created_at: '2026-04-17T18:00:00Z',
			updated_at: '2026-04-18T07:00:00Z'
		},
		{
			id: 'Zx7C1vBn',
			name: 'Call client',
			description: 'Discuss project requirements and deadlines',
			status: 'pending',
			priority: 'high',
			due_date: '2026-04-18',
			tags: ['work', 'communication'],
			created_at: '2026-04-18T07:30:00Z',
			updated_at: '2026-04-18T07:30:00Z'
		},
		{
			id: 'L9kP3sDf',
			name: 'Read a book',
			description: 'Read 20 pages of a novel',
			status: 'pending',
			priority: 'low',
			due_date: '2026-04-22',
			tags: ['leisure'],
			created_at: '2026-04-18T06:00:00Z',
			updated_at: '2026-04-18T06:00:00Z'
		},
		{
			id: 'uY6hJ2Kl',
			name: 'Pay utility bills',
			description: 'Electricity and internet bills',
			status: 'in_progress',
			priority: 'high',
			due_date: '2026-04-21',
			tags: ['finance'],
			created_at: '2026-04-18T05:45:00Z',
			updated_at: '2026-04-18T05:45:00Z'
		},
		{
			id: 'R4tG8mNp',
			name: 'Team meeting',
			description: 'Weekly sync-up with the team',
			status: 'pending',
			priority: 'medium',
			due_date: '2026-04-19',
			tags: ['work', 'meeting'],
			created_at: '2026-04-18T05:30:00Z',
			updated_at: '2026-04-18T05:30:00Z'
		},
		{
			id: 'cV5bH1Xs',
			name: 'Clean the house',
			description: 'Vacuum and organize living room',
			status: 'pending',
			priority: 'medium',
			due_date: '2026-04-23',
			tags: ['home'],
			created_at: '2026-04-18T05:00:00Z',
			updated_at: '2026-04-18T05:00:00Z'
		},
		{
			id: 'W8qL0eRa',
			name: 'Backup files',
			description: 'Backup important documents to cloud storage',
			status: 'completed',
			priority: 'low',
			due_date: '2026-04-17',
			tags: ['tech'],
			created_at: '2026-04-17T20:00:00Z',
			updated_at: '2026-04-18T04:50:00Z'
		},
		{
			id: 'nD3F7yUz',
			name: 'Plan weekend trip',
			description: 'Research destinations and book accommodation',
			status: 'pending',
			priority: 'medium',
			due_date: '2026-04-25',
			tags: ['travel'],
			created_at: '2026-04-18T04:30:00Z',
			updated_at: '2026-04-18T04:30:00Z'
		}
	] satisfies Task[];

	const id = $props.id();
	let tasks = $state<Task[]>(SAMPLE);

	function createTask(e: SubmitEvent) {
		const form = new FormData(e.target as HTMLFormElement);
		const name = form.get('name')?.toString() ?? '';
		const description = form.get('description')?.toString() ?? '';
		tasks.push({
			id: createId(),
			name,
			description,
			status: 'pending',
			priority: 'low',
			due_date: null,
			tags: [''],
			created_at: new Date().toString(),
			updated_at: new Date().toString()
		});
	}

	function deleteTask(id: string) {
		tasks = tasks.filter((task) => task.id != id);
	}
</script>

<div class="toolbar">
	<button command="show-modal" commandfor="create-task-dialog-{id}" class="primary">Create</button
	>
</div>

<dialog id="create-task-dialog-{id}" closedby="closerequest">
	<form method="dialog" onsubmit={createTask}>
		<div>New task</div>
		<div>
			<label for="task-name-{id}">Task name</label>
			<input type="text" id="task-name-{id}" name="name" />

			<label for="task-description-{id}">Description</label>
			<input type="text" id="task-description-{id}" name="description" />
		</div>
		<div class="actions">
			<button type="button" command="close" commandfor="create-task-dialog-{id}"
				>Cancel</button
			>
			<button class="primary">Create</button>
		</div>
	</form>
</dialog>

<ul class="tasks">
	{#each tasks as task (task.id)}
		<li>
			<div>
				<input
					type="checkbox"
					bind:checked={
						() => task.status === 'completed',
						(checked) => (task.status = checked ? 'completed' : 'pending')
					}
				/>
			</div>
			<div>
				<div class="task" data-task-status={task.status}>
					<h3 class="task-name">{task.name}</h3>
					<p class="task-description">{task.description}</p>
				</div>
			</div>
			<div>
				<button onclick={() => deleteTask(task.id)}>
					<X />
				</button>
			</div>
		</li>
	{/each}
</ul>

<style>
	form > * {
		padding-block: 1rem;
		padding-inline: 1.5rem;
		display: block;
	}

	.actions {
		display: flex;
		justify-content: flex-end;

		& > *:has(+ *) {
			margin-inline-end: 0.5rem;
		}
	}

	label {
		font-size: 0.875rem;
		color: var(--color-muted-foreground);
	}

	input {
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
		font-size: 1rem;

		&:has(+ *) {
			margin-block-end: 0.5rem;
		}
	}

	.toolbar {
		padding-block: 1rem;
	}

	.toolbar,
	ul {
		width: min(100%, 32rem);
		margin-inline: auto;
	}

	li {
		border-block-end: 1px solid var(--color-muted);
		display: grid;
		grid-template-columns: 3rem 1fr 5rem;
		align-items: center;
	}

	.task-description {
		color: var(--color-muted-foreground);
	}

	[data-task-status='completed'] :where(.task-name, .task-description) {
		text-decoration: line-through;
		opacity: 0.3;
	}
</style>
