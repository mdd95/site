<script lang="ts">
	import { signInEmail, signUpEmail } from '$lib/auth.remote.js';
</script>

<pre>
    {JSON.stringify(signInEmail.result, null, 2)}
</pre>

<form {...signInEmail}>
	<input {...signInEmail.fields.email.as('email')} placeholder="Email address" />
	<input {...signInEmail.fields.password.as('password')} placeholder="Password" />
	<button type="submit">Sign In</button>
</form>

<form {...signUpEmail}>
	<input {...signUpEmail.fields.email.as('email')} placeholder="Email address" />
	<input {...signUpEmail.fields.password.as('password')} placeholder="Password" />
	<input {...signUpEmail.fields.passwordConfirm.as('password')} placeholder="Confirm password" />
	<span>{signUpEmail.fields.passwordConfirm.issues()?.at(0)?.message}</span>
	<button type="submit">Sign Up</button>
</form>

<style>
	form {
		width: min(100%, 24rem);
		margin-inline: auto;

		&:has(> *) {
			margin-block-end: 1rem;
		}
	}

	input {
		display: block;

		&:has(+ *) {
			margin-block-end: 0.5rem;
		}
	}
</style>
