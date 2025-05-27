<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { PageProps } from './$types';

	let {}: PageProps = $props();
</script>

<div class="mx-auto w-full max-w-sm p-4">
	<form method="POST" use:enhance>
		<Label class="my-2">Email address</Label>
		<Input name="email" autocomplete="email" />

		<Label class="my-2">Password</Label>
		<Input type="password" name="password" />

		<Button type="submit" class="mt-4 w-full">Login</Button>
	</form>
</div>
