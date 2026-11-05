import { createContext } from 'svelte';

type CalendarConfig = {
	weekStart: number;
	locale: string;
};
export const [getConfig, setConfig] = createContext<CalendarConfig>();

function createWeekdayNames(): string[] {
	const { locale, weekStart } = getConfig();
	return Array.from({ length: 7 }, (_, i) =>
		new Temporal.PlainDate(2026, 11, 1 + weekStart + i).toLocaleString(locale, {
			weekday: 'short'
		})
	);
}
export const weekdays = createWeekdayNames();
