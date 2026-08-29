<section>
	<div class="content">
		<p class="greeting">HELLO, I'M</p>
		<h1>mjayar</h1>
		<h2>Registered Civil Engineer</h2>
		<p class="introduction"></p>
	</div>
</section>

<style>
	section {
		width: min(68.75rem, 100% - 2rem);
		height: calc(100vh - 4rem);
		margin: 0 auto;
		padding: 0 1rem;
		display: grid;
		align-items: center;
	}

	.content {
		text-align: center;

		@media (min-width: 576px) {
			text-align: start;
		}
	}

	.content *:has(+ *) {
		margin-bottom: 2rem;
	}

	.greeting {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1rem;
		color: #777;
	}

	h1 {
		font-size: clamp(4rem, 9vw, 8rem);
		line-height: 0.9;
		letter-spacing: -0.375rem;
	}

	h2 {
		font-size: 1rem;
		font-weight: 300;
	}
</style>
