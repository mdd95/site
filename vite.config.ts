import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { registerWebSocket } from './src/websocket/server';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: { async: true }
			},
			adapter: adapter(),
			experimental: {
				explicitEnvironmentVariables: true,
				handleRenderingErrors: true,
				remoteFunctions: true
			},
			typescript: {
				config: (config) => ({
					...config,
					include: [...config.include, '../drizzle.config.ts']
				})
			}
		}),
		{
			name: 'websocket-server',
			configureServer({ httpServer }) {
				// @ts-ignore
				if (httpServer) registerWebSocket(httpServer);
			},
			configurePreviewServer({ httpServer }) {
				// @ts-ignore
				if (httpServer) registerWebSocket(httpServer);
			}
		}
	]
});
