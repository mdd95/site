<script lang="ts">
	import { getUserProfile } from '$lib/remote/profile.remote.js';

	let { params } = $props();
	const profile = $derived(await getUserProfile(params.id));
</script>

<div class="layout">
	<div class="cover">
		<img src="https://picsum.photos/id/13/2500/1667" alt="Cover" />
	</div>
	<div class="avatar">
		<img src="https://i.pravatar.cc/300?u=3fase" alt="Profile" />
	</div>
	<div class="content">
		<h1>{profile?.user.name}</h1>
		<p class="username">@{profile?.user.displayUsername}</p>
		<p class="bio">{profile?.user_info?.bio}</p>
	</div>
</div>

<style>
	.layout {
		margin: 0 auto;
		padding-top: 3rem;
		width: min(45rem, 100% - 2rem);
	}

	.cover {
		height: clamp(12rem, 35vw, 16rem);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.avatar {
		margin: -4rem auto 0;
		width: 8rem;
		aspect-ratio: 1;
		border-radius: var(--capsule);
		overflow: hidden;
	}

	:where(.cover, .avatar) img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.content {
		text-align: center;

		& :where(h1, p) {
			margin: 0;
		}
	}
</style>
