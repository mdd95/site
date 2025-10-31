<script>
	import { login, logout, signup, user } from '$lib/auth/auth.remote.js';
</script>

<pre>{JSON.stringify(await user(), null, 2)}</pre>

<button onclick={async () => await logout()}>Logout</button>

<form {...login}>
	<input {...login.fields.email.as('email')} placeholder="Email address" />
	<input {...login.fields.password.as('password')} placeholder="Password" />
	<button type="submit">Login</button>
</form>

<form {...signup}>
	<input {...signup.fields.username.as('text')} placeholder="Username" />
	<input {...signup.fields.email.as('email')} placeholder="Email address" />
	<input {...signup.fields.password.as('password')} placeholder="Password" />
	<input {...signup.fields.passwordConfirm.as('password')} placeholder="Confirm password" />
	<button type="submit">Signup</button>
</form>

<style>
	form {
		padding: 1rem;
		margin: 0 auto;
	}

	input {
		padding: 0.5rem 0.75rem;
		display: block;
		margin-block-end: 0.5rem;
		border-radius: 0.5rem;
	}
</style>
