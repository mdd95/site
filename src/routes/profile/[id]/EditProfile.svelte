<script lang="ts">
	import { updateUserProfile, type UserProfile } from '$lib/remote/profile.remote.js';

	type Props = {
		data: UserProfile;
	};
	let { data }: Props = $props();

	const id = $props.id();
	let dialog = $state<HTMLDialogElement>();
</script>

<button command="show-modal" commandfor="{id}-dialog">Edit Profile</button>

<dialog bind:this={dialog} id="{id}-dialog" closedby="none">
	<form
		{...updateUserProfile.enhance(async ({ element, submit }) => {
			if (await submit()) {
				dialog?.close();
			}
		})}
	>
		<h2>Edit Profile</h2>
		<div>
			<label for="{id}-cover">Cover Photo</label>
			<div>
				<div class="preview-cover">
					{#if data.user_info?.coverUrl}
						<img src={data.user_info.coverUrl} alt="Cover" />
					{/if}
				</div>
				<input
					id="{id}-cover"
					{...updateUserProfile.fields.coverUrl.as(
						'text',
						data.user_info?.coverUrl ?? ''
					)}
				/>
			</div>
		</div>
		<div>
			<label for="{id}-avatar">Avatar</label>
			<div>
				<div class="preview-avatar">
					{#if data.user_info?.avatarUrl}
						<img src={data.user_info.avatarUrl} alt="Avatar" />
					{/if}
				</div>
				<input
					id="{id}-avatar"
					{...updateUserProfile.fields.avatarUrl.as(
						'text',
						data.user_info?.avatarUrl ?? ''
					)}
				/>
			</div>
		</div>
		<div>
			<label for="{id}-email">Email address</label>
			<input
				id="{id}-email"
				{...updateUserProfile.fields.email.as('email', data.user.email)}
			/>
		</div>
		<div>
			<label for="{id}-name">Display name</label>
			<input id="{id}-name" {...updateUserProfile.fields.name.as('text', data.user.name)} />
		</div>
		<div>
			<label for="{id}-bio">Bio</label>
			<textarea
				id="{id}-bio"
				placeholder="Enter your bio"
				{...updateUserProfile.fields.bio.as('text', data.user_info?.bio ?? '')}
			>
			</textarea>
		</div>
		<div class="form-actions">
			<button type="button" command="close" commandfor="{id}-dialog">Cancel</button>
			<button type="submit">Save</button>
		</div>
	</form>
</dialog>

<style>
	dialog {
		--sv-y: -16px;
		--sv-scale: 0.98;
		--sv-duration: 0.3s;
		margin: auto;
		width: min(32rem, 100% - 2rem);
		max-height: calc(100vh - 2rem);
		border-radius: var(--radius);
		background-color: var(--background);
		opacity: 0;
		transform: translateY(var(--sv-y)) scale(var(--sv-scale));
		transition:
			opacity var(--sv-duration) ease,
			transform var(--sv-duration) ease,
			display var(--sv-duration) ease allow-discrete,
			overlay var(--sv-duration) ease allow-discrete;
	}

	dialog:open {
		opacity: 1;
		transform: translateY(0) scale(1);

		@starting-style {
			opacity: 0;
			transform: translateY(var(--sv-y)) scale(var(--sv-scale));
		}
	}

	dialog::backdrop {
		background-color: rgb(0 0 0 / 40%);
		backdrop-filter: blur(2px);
		transition:
			opacity var(--sv-duration) ease,
			display var(--sv-duration) ease allow-discrete,
			overlay var(--sv-duration) ease allow-discrete;
	}

	dialog:open::backdrop {
		background-color: rgb(0 0 0 / 40%);

		@starting-style {
			background-color: rgb(0 0 0 / 0%);
		}
	}

	form {
		padding: 1rem;
		display: grid;
		grid-template-columns: auto 1fr;

		& > * {
			grid-column: span 2;
			display: grid;
			grid-template-columns: subgrid;
		}

		& h2 {
			font-size: 1.125rem;
		}

		& label {
			font-size: 0.825rem;
		}
	}

	.preview-avatar {
		width: 5rem;
		height: 5rem;
		border-radius: var(--capsule);
		overflow: hidden;

		& img {
			width: 5rem;
			height: 5rem;
		}
	}

	input,
	textarea {
		margin-bottom: 0.5rem;
		width: 100%;
		display: block;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius);
	}

	textarea {
		field-sizing: content;
	}

	.form-actions {
		display: flex;
		justify-content: end;
		gap: 0.5rem;
	}
</style>
