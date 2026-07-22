import { server } from 'SERVER';
import { registerSocketIO } from './server.js';

if (!process.env.SECRET) {
	throw new Error('`SECRET` environment variable is not set');
}

registerSocketIO(server.server, process.env.SECRET);
