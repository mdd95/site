import type { Vector3 } from 'three';

export type Body = {
	id: number;
	timestamp: number;
	position: Parameters<Vector3['set']>;
	rotation: Parameters<Vector3['set']>;
};
