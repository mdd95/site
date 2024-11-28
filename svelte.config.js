import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter(),
		alias: {
			'@/*': './src/lib/*',
			'@/components/*': './src/lib/components/*'
		}
	},
	extensions: ['.svelte', '.md']
};

export default config;
