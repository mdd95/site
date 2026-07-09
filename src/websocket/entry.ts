import { server } from 'SERVER';
import { registerWebSocket } from './server.js';

registerWebSocket(server.server, process.env.SECRET);
