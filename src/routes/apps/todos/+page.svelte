<script lang="ts">
	type Todo = {
		id: string;
		title: string;
		description: string;
	};

	const id = $props.id();
	let todos = $state<Array<Todo>>([]);
	$inspect(todos);

	function createTodo(e: SubmitEvent) {
		const form = new FormData(e.target as HTMLFormElement);
		todos.push({
			id: Date.now().toString(),
			title: form.get('title')?.toString() || '',
			description: form.get('description')?.toString() || ''
		});
	}
</script>

<button command="show-modal" commandfor="create-todo-dialog-{id}">Create</button>
<dialog id="create-todo-dialog-{id}" closedby="closerequest">
	<form method="dialog" onsubmit={createTodo}>
		<div>New Todo</div>
		<div>
			<label for="todo-title-{id}">Title</label>
			<input type="text" id="todo-title-{id}" name="title" />
			<label for="todo-description-{id}">Description</label>
			<input type="text" id="todo-description-{id}" />
		</div>
		<div class="actions">
			<button type="button" command="close" commandfor="create-todo-dialog-{id}"
				>Cancel</button
			>
			<button class="primary">Create</button>
		</div>
	</form>
</dialog>

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
</style>
