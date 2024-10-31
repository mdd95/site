<script lang="ts">
	import { Button } from '@/components/ui/button/index.js';
	import LightSwitch from '@/components/light-switch.svelte';
	import GithubLogo from 'svelte-radix/GithubLogo.svelte';
	import TwitterLogo from 'svelte-radix/TwitterLogo.svelte';
	import InstagramLogo from 'svelte-radix/InstagramLogo.svelte';
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

<div class="relative h-screen">
	<div class="container absolute inset-0 flex items-center justify-center">
		<div class="space-y-4 text-center">
			<p class="text-5xl">Hello!</p>
			<p class="max-w-[65ch] text-balance text-xl leading-10">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid asperiores nisi
				tempore dolore, in dignissimos.
			</p>
			<Button>Get started</Button>
		</div>
	</div>
</div>

<footer class="border-t border-border/40">
	<div class="container flex h-32 items-center justify-center">
		<div>
			<Button variant="ghost" size="icon" class="rounded-full">
				<GithubLogo />
			</Button>
			<Button variant="ghost" size="icon" class="rounded-full">
				<TwitterLogo />
			</Button>
			<Button variant="ghost" size="icon" class="rounded-full">
				<InstagramLogo />
			</Button>
		</div>
	</div>
</footer>
