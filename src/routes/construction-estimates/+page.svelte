<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Footing from './Footing.svelte';
</script>

<div class="container mx-auto">
	<main>
		<Tabs.Root value="overview">
			<Tabs.List>
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="footings">Footings</Tabs.Trigger>
				<Tabs.Trigger value="columns">Columns</Tabs.Trigger>
				<Tabs.Trigger value="beams">Beams</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="overview">
				<h1 class="text-2xl font-bold uppercase">Overview</h1>
			</Tabs.Content>
			<Tabs.Content value="footings">
				<Footing updateData={() => {}} />
			</Tabs.Content>
		</Tabs.Root>
	</main>
</div>
