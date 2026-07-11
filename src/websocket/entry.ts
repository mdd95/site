import { server } from 'SERVER';
import { registerWebSocket } from './server.js';

if (!process.env.SECRET) {
	throw new Error('`SECRET` environment variable is not set');
}

if (!process.env.ORIGIN) {
	throw new Error('`ORIGIN` environment variable is not set');
}

registerWebSocket({
	origin: process.env.ORIGIN,
	secret: process.env.SECRET,
	server: server.server
});
