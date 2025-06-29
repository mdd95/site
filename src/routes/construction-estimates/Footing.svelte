<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	type Props = {
		updateData: (data: any) => void;
	};

	let { updateData }: Props = $props();
	let idCounter = 0;

	type FootingData = {
		id: number;
		label: string;
		width: number;
		length: number;
		thickness: number;
		remarks: string;
	};
	let data = $state<FootingData[]>([]);
	$inspect(data);

	function addRow() {
		data.push({
			id: ++idCounter,
			label: '',
			width: 200,
			length: 200,
			thickness: 100,
			remarks: 'centerFooting'
		});
	}
</script>

<h1 class="text-2xl font-bold uppercase">Schedule of Footings</h1>

<Table.Root class="table-fixed border">
	<Table.Header>
		<Table.Row>
			<Table.Head rowspan={2} class="w-[12.5%]">MARK</Table.Head>
			<Table.Head rowspan={2} class="w-[12.5%]">THK (mm)</Table.Head>
			<Table.Head colspan={2} class="w-[25%]">SIZE (m)</Table.Head>
			<Table.Head colspan={2} class="w-[25%]">BOTTOM BARS</Table.Head>
			<Table.Head rowspan={2} class="w-[12.5%]">DEPTH</Table.Head>
			<Table.Head rowspan={2} class="w-[12.5%]">REMARKS</Table.Head>
		</Table.Row>
		<Table.Row>
			<Table.Head>WIDTH</Table.Head>
			<Table.Head>LENGTH</Table.Head>
			<Table.Head>BAR 'S'</Table.Head>
			<Table.Head>BAR 'L'</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as footing (footing.id)}
			<Table.Row>
				<Table.Cell class="ring-inset focus-within:ring">
					<input type="text" bind:value={footing.label} class="w-full outline-none" />
				</Table.Cell>
				<Table.Cell class="ring-inset focus-within:ring">
					<input
						type="number"
						bind:value={footing.thickness}
						class="w-full outline-none"
					/>
				</Table.Cell>
				<Table.Cell class="ring-inset focus-within:ring">
					<input type="number" bind:value={footing.width} class="w-full outline-none" />
				</Table.Cell>
				<Table.Cell class="ring-inset focus-within:ring">
					<input type="number" bind:value={footing.length} class="w-full outline-none" />
				</Table.Cell>
				<Table.Cell class="ring-inset focus-within:ring">
					<input type="text" class="w-full outline-none" />
				</Table.Cell>
				<Table.Cell class="ring-inset focus-within:ring">
					<input type="text" class="w-full outline-none" />
				</Table.Cell>
				<Table.Cell class="ring-inset focus-within:ring">
					<input type="text" class="w-full outline-none" />
				</Table.Cell>
				<Table.Cell class="ring-inset focus-within:ring">
					<Select.Root type="single" bind:value={footing.remarks}>
						<Select.Trigger>{footing.remarks}</Select.Trigger>
						<Select.Content>
							<Select.Item value="centerFooting">Center Footing</Select.Item>
							<Select.Item value="edgeFooting">Edge Footing</Select.Item>
						</Select.Content>
					</Select.Root>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<Button variant="secondary" class="mt-4 w-full" onclick={addRow}>Add row</Button>
<Button class="mt-4 w-full">Estimate</Button>

<Table.Root class="mt-4 border">
	<Table.Body>
		<Table.Row>
			<Table.Head>CONCRETE</Table.Head>
			<Table.Cell>200 cu.m.</Table.Cell>
		</Table.Row>
		<Table.Row>
			<Table.Head>REBAR</Table.Head>
			<Table.Cell>190 kgs.</Table.Cell>
		</Table.Row>
		<Table.Row>
			<Table.Head>FORM WORKS</Table.Head>
			<Table.Cell>0.5 sq.m.</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>
