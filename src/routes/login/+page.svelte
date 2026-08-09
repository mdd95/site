<script lang="ts" module>
	import { z } from 'zod/v4-mini';

	export const schema = z.object({
		email: z.string().check(z.email()),
		password: z.string().check(z.minLength(1))
	});
</script>

<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Control, Field, FieldErrors, Label } from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const form = superForm(data.form, {
		validators: zod4Client(schema)
	});

	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login to your account" />
</svelte:head>

<div class="mx-auto w-full max-w-sm p-4">
	<form method="POST" use:enhance class="space-y-6">
		<div class="space-y-2 text-center">
			<h1 class="text-2xl font-bold">Login to your account</h1>
			<p class="text-muted-foreground text-sm text-balance">
				Enter your credentials to login
			</p>
		</div>

		<Field {form} name="email">
			<Control>
				{#snippet children({ props })}
					<Label>Email address</Label>
					<Input {...props} bind:value={$formData.email} />
				{/snippet}
			</Control>
			<FieldErrors />
		</Field>

		<Field {form} name="password">
			<Control>
				{#snippet children({ props })}
					<Label>Password</Label>
					<Input type="password" {...props} bind:value={$formData.password} />
				{/snippet}
			</Control>
			<FieldErrors />
		</Field>

		<Button type="submit" class="w-full">Login</Button>
	</form>
</div>
