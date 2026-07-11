import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { registerWebSocket } from './src/websocket/server';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		server: {
			host: env.HOST ?? '0.0.0.0',
			port: parseInt(env.PORT ?? '3000')
		},
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
					if (httpServer) {
						registerWebSocket({
							origin: env.ORIGIN,
							secret: env.SECRET,
							// @ts-ignore
							server: httpServer
						});
					}
				},
				configurePreviewServer({ httpServer }) {
					if (httpServer) {
						registerWebSocket({
							origin: env.ORIGIN,
							secret: env.SECRET,
							// @ts-ignore
							server: httpServer
						});
					}
				}
			}
		]
	};
});
