<script>
	import { loginWithPassword } from '$lib/auth.remote.js';
</script>

<form {...loginWithPassword}>
	{loginWithPassword.result?.error}

	{#each loginWithPassword.fields.email.issues() ?? [] as issue (issue.message)}
		<p>{issue.message}</p>
	{/each}
	<input {...loginWithPassword.fields.email.as('email')} autocomplete="email" />
	<input {...loginWithPassword.fields.password.as('password')} />
	<button type="submit">Login</button>
</form>

<style>
	form {
	}

	input {
	}
</style>
