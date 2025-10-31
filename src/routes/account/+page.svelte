<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { logout, update, user } from '$lib/auth/auth.remote.js';

	const x = await user();
</script>

<pre>{JSON.stringify(x, null, 2)}</pre>

<button
	onclick={async () => {
		await logout();
		goto(resolve('/login'));
	}}
>
	Logout
</button>

<form {...update}>
	<input {...update.fields.email.as('email')} value={x.user?.email} />
	<input {...update.fields.username.as('text')} value={x.user?.username} />
	<input {...update.fields.birthdate.as('date')} value={x.user?.birthdate} />
	<textarea {...update.fields.bio.as('text')} value={x.user?.bio}></textarea>
	<button>Update</button>
</form>

<style>
	form {
		padding: 1rem;
		margin: 0 auto;
	}

	input,
	textarea {
		padding: 0.5rem 0.75rem;
		display: block;
		margin-block-end: 0.5rem;
		border-radius: 0.5rem;
	}

	textarea {
		min-width: 16rem;
		min-height: 6rem;
		field-sizing: content;
	}
</style>
