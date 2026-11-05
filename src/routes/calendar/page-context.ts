import { createContext } from 'svelte';

type CalendarConfig = {
	locale: string;
	weekStart: number;
};
export const [getConfig, setConfig] = createContext<CalendarConfig>();
