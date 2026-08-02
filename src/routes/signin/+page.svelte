<script lang="ts">
	import { signInEmail, signUpEmail } from '$lib/remote/auth.remote.js';
</script>

<div class="container">
	<h2>Sign In</h2>
	<p>Welcome back! Please sign in to your account.</p>
	<form {...signInEmail}>
		{const { fields } = signInEmail}
		<input {...fields.email.as('email')} placeholder="Email address" />
		<input {...fields.password.as('password')} placeholder="Password" />
		<button type="submit">Sign In</button>
	</form>
</div>
<hr />
<div class="container">
	<h2>Get Started</h2>
	<p>Create an account or sign in to continue.</p>
	<form {...signUpEmail}>
		{const { fields } = signUpEmail}
		<input {...fields.username.as('text')} placeholder="Username" />
		<input {...fields.name.as('text')} placeholder="Name" />
		<input {...fields.email.as('email')} placeholder="Email address" />
		<input {...fields.password.as('password')} placeholder="Password" />
		<input {...fields.passwordConfirm.as('password')} placeholder="Confirm password" />
		<span>{signUpEmail.fields.passwordConfirm.issues()?.at(0)?.message}</span>
		<button type="submit" class="">Sign Up</button>
	</form>
</div>

<style>
	.container {
		margin: 1rem auto 0;
		width: min(100% - 2rem, 24rem);
	}

	input {
		width: 100%;
		margin: 0.5rem 0 0;
		padding: 0.625rem 0.875rem;
		border-radius: var(--border-radius);
		font: inherit;
	}

	button {
		width: 100%;
		margin: 1rem 0 0;
	}
</style>
