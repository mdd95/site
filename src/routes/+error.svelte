<div class="error-page">
	<div class="blob blob-1"></div>
	<div class="blob blob-2"></div>

	<div class="error-card">
		<div class="error-icon">⚠️</div>
		<h1>404</h1>
		<h2>Page Not Found</h2>
		<p>The page you're looking for may have been moved, deleted, or never existed.</p>
	</div>
</div>

<style>
	.error-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #0f172a, #1e293b, #312e81);
	}

	.error-card {
		width: min(90%, 34.375rem);
		padding: 3rem;
		text-align: center;
		background: oklch(100% 0 0 / 0.08);
		backdrop-filter: blur(25px);
		border: 1px solid oklch(100% 0 0 / 0.1);
		border-radius: var(--radius);
		animation: float 4s infinite ease-in-out;
	}

	.error-icon {
		font-size: 4rem;
		line-height: 1;
		margin-block-end: 1rem;
	}

	.error-card h1 {
		font-size: clamp(5rem, 15vw, 8rem);
		line-height: 1;
		background: linear-gradient(90deg, #60a5fa, #818cf8, #c084fc);
		background-clip: text;
		color: transparent;
	}

	.error-card p {
		color: var(--color-muted-foreground);
	}

	.blob {
		position: absolute;
		border-radius: 9999px;
		filter: blur(80px);
		animation: blob-move 10s infinite ease-in-out;
	}

	.blob-1 {
		width: 18.75rem;
		height: 18.75rem;
		background: #6366f1;
		top: -3.125rem;
		left: -3.125rem;
	}

	.blob-2 {
		width: 21.875rem;
		height: 21.875rem;
		background: #ec4899;
		bottom: -6.125rem;
		right: -6.125rem;
	}

	@keyframes blob-move {
		50% {
			transform: translate(100px, -60px);
		}
	}

	@keyframes float {
		50% {
			transform: translateY(-10px);
		}
	}
</style>
