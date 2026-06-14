<script lang="ts">
	import type { UserProfile } from '$lib/remote/profile.remote.js';
	import EditProfile from './EditProfile.svelte';

	type Props = {
		data: UserProfile;
	};

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{data.user.name}</title>
</svelte:head>

<div class="layout">
	<div class="cover">
		{#if data.user_info?.coverUrl}
			<img src={data.user_info.coverUrl} alt="Cover" />
		{/if}
	</div>
	<div class="header">
		<div class="avatar">
			{#if data.user_info?.avatarUrl}
				<img src={data.user_info.avatarUrl} alt="Profile" />
			{/if}
		</div>
		<EditProfile {data} />
	</div>
	<div class="content">
		<h1>{data.user.name}</h1>
		<p class="username">@{data.user.displayUsername}</p>
		<p class="bio">{data.user_info?.bio}</p>
	</div>
</div>

<style>
	.layout {
		margin: 0 auto;
		padding-top: 3rem;
		width: min(45rem, 100% - 2rem);
	}

	.cover {
		position: relative;
		height: clamp(12rem, 35vw, 16rem);
		background-color: oklch(50% 0 0);
		border-radius: var(--radius);
		overflow: hidden;
		z-index: -1;
	}

	.header {
		margin-top: -4.5rem;
		height: 9rem;
		display: flex;
		justify-content: space-between;
		align-items: end;
	}

	.avatar {
		margin-left: 2rem;
		width: 9rem;
		height: 9rem;
		background-color: oklch(50% 0 0);
		border: 0.325rem solid var(--background);
		border-radius: var(--capsule);
		overflow: hidden;
		transition: transform 0.3s ease-in-out;

		&:has(img) {
			cursor: pointer;
		}

		&:has(img):hover {
			transform: scale(1.05);
		}
	}

	:where(.cover, .avatar) img {
		width: 9rem;
		height: 9rem;
		object-fit: cover;
		object-position: center;
	}

	.content {
		& :where(h1, p) {
			margin: 0;
		}
	}
</style>
