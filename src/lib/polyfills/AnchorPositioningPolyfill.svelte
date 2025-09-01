<script lang="ts">
	$effect(() => {
		(async () => {
			if (!('anchorName' in document.documentElement.style)) {
				console.info('Loading css-anchor-positioning polyfill...');
				const { default: cssAnchorPositioningPolyfill } = await import(
					'@oddbird/css-anchor-positioning/fn'
				);
				cssAnchorPositioningPolyfill();
			}
		})();
	});
</script>
