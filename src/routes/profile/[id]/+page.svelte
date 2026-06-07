<script lang="ts">
	import { getUserProfile } from '$lib/remote/profile.remote.js';

	let { params } = $props();
	const profile = $derived(await getUserProfile(params.id));
</script>

<svelte:head>
	<title>{profile?.user.username}</title>
</svelte:head>

<div class="page">
	<div class="cover">
		<img src="https://picsum.photos/id/13/2500/1667" alt="Cover" />
	</div>
	<div class="header">
		<img src="https://i.pravatar.cc/300?u=3fase" alt="Profile" />
	</div>
	<div class="content">
		<h1>{profile?.user.name}</h1>
		<p class="username">@{profile?.user.displayUsername}</p>
		<p class="bio">{profile?.user_info?.bio}</p>
	</div>
</div>

<pre>{JSON.stringify(profile, null, 2)}</pre>

<style>
	.cover {
		height: 16rem;
		overflow: hidden;

		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
		}
	}

	.header {
		display: flex;
		justify-content: center;
		margin-top: -4.5rem;
	}

	.header img {
		width: 9rem;
		aspect-ratio: 1;
		border: 0.325rem solid white;
		border-radius: calc(infinity * 1px);
		transition: transform 0.3s ease-in-out;
		cursor: pointer;

		&:hover {
			transform: scale(1.05);
		}
	}

	.content {
		text-align: center;
	}
</style>
