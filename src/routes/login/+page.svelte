<script lang="ts">
	import type { PageServerData } from './$types';
	import LoginForm from './login-form.svelte';

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();
</script>

<div class="flex min-h-screen w-full items-center justify-center p-4">
	<LoginForm data={data.form} />
</div>
