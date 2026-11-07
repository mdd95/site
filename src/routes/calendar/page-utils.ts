import { getConfig } from './page-context.svelte.js';

export function createWeekdayNames(): string[] {
	const config = getConfig();
	return Array.from({ length: 7 }, (_, i) =>
		new Temporal.PlainDate(2026, 11, 1 + config.weekStart + i).toLocaleString(config.locale, {
			weekday: 'short'
		})
	);
}
