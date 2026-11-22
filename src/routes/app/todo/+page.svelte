<script lang="ts">
	import { nanoid } from 'nanoid';
	import { onMount } from 'svelte';

	type Todo = {
		id: string;
		content: string;
		dateCreated: string;
		dateModified: string;
	};

	let todos = $state<Todo[]>([]);

	onMount(() => {
		const storedTodos = window.localStorage.getItem('todos');
		if (storedTodos) {
			try {
				todos = JSON.parse(storedTodos);
			} catch {
				console.error('Failed to parse stored todos');
			}
		}
	});

	function addTodo(e: SubmitEvent) {
		e.preventDefault();
		const formElement = e.target as HTMLFormElement;
		const formData = new FormData(formElement);

		todos.push({
			id: nanoid(),
			content: formData.get('content')?.toString() ?? '',
			dateCreated: new Date().toISOString(),
			dateModified: new Date().toISOString()
		});

		window.localStorage.setItem('todos', JSON.stringify(todos));
		formElement.reset();
	}
</script>

<svelte:head>
	<title>Todo App</title>
</svelte:head>

<main>
	<div class="toolbar">
		<form onsubmit={addTodo}>
			<input type="text" name="content" />
			<button type="submit" class="btn btn-primary">Add todo</button>
		</form>
	</div>

	<ul>
		{#each todos as todo}
			<li>
				<div>
					<input type="checkbox" />
				</div>
				<div>
					{todo.content}
				</div>
			</li>
		{/each}
	</ul>
</main>

<style>
	main {
		width: min(32rem, 100%);
		margin: auto;
	}

	.toolbar {
		padding: 1rem 1rem;

		& form {
			display: flex;
			gap: 0.5rem;
		}
	}

	.toolbar form input {
		display: block;
		width: 100%;
		height: 2rem;
		padding: 0 0.375rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-size: 0.875rem;

		&:focus {
			outline: 2px solid var(--color-outline);
			outline-offset: -1px;
		}
	}

	ul {
		padding: 1rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		list-style: none;
	}

	li {
		padding: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}
</style>
