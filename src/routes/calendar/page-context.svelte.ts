import { createContext } from 'svelte';

export const SUNDAY = 0;
export const MONDAY = 1;

export class Config {
	locale = $state(Intl.DateTimeFormat().resolvedOptions().locale);
	weekStart = $state(SUNDAY);
}

export const [getConfig, setConfig] = createContext<Config>();
