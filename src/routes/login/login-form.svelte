<script lang="ts">
	import { Button } from '@/components/ui/button/index.js';
	import { Input } from '@/components/ui/input/index.js';
	import * as Card from '@/components/ui/card/index.js';
	import * as Form from '@/components/ui/form/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from './login-schema.js';

	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { LoginSchema } from './login-schema';

	type Props = {
		data: SuperValidated<Infer<LoginSchema>>;
	};

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance } = form;
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>

	<Card.Content>
		<form method="POST" action="/login" use:enhance class="grid gap-4">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input {...props} bind:value={$formData.password} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="w-full">Login</Form.Button>
			<Button href="/login/google" variant="outline" class="w-full">Login with Google</Button>
		</form>
	</Card.Content>
</Card.Root>
