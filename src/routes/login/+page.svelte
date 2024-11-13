<script lang="ts">
	import LightSwitch from '@/components/light-switch.svelte';
	import LoginForm from './login-form.svelte';

	import type { PageServerData } from './$types';

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center p-4">
	<div class="flex w-full max-w-sm justify-end py-4">
		<LightSwitch />
	</div>
	<LoginForm data={data.form} />
</div>
