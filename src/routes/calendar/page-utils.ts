import { getConfig } from './page-context.js';

export function createWeekdayNames(): string[] {
	const { locale, weekStart } = getConfig();
	return Array.from({ length: 7 }, (_, i) =>
		new Temporal.PlainDate(2026, 11, 1 + weekStart + i).toLocaleString(locale, {
			weekday: 'short'
		})
	);
}
