<script lang="ts">
	import { Button } from '@/components/ui/button/index.js';
	import LightSwitch from '@/components/light-switch.svelte';
</script>

<header class="sticky top-0 z-50 border-b border-border/40 bg-background">
	<div class="container flex h-16 items-center justify-between">
		<div class="mr-4">
			<img src="/favicon.png" class="size-10" alt="logo" />
		</div>
		<div class="hidden grow md:flex md:items-center">
			<Button variant="ghost">Home</Button>
			<Button variant="ghost">Blog</Button>
		</div>
		<div class="flex items-center">
			<LightSwitch />
		</div>
	</div>
</header>
