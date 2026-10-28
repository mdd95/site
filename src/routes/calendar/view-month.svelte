<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	const locale = Intl.DateTimeFormat().resolvedOptions().locale;

	const sunday = new Date(2023, 0, 1);
	const weekdays = Array.from({ length: 7 }, (_, i) => {
		return new Date(
			sunday.getFullYear(),
			sunday.getMonth(),
			sunday.getDate() + i
		).toLocaleString(locale, { weekday: 'short' });
	});

	const x = $derived.by(() => {
		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth() + 1;
		const p = page.url.searchParams.get('p');
		const match = /^(\d{4})-(\d{2})$/.exec(p ?? '');
		if (!match) {
			return { year: currentYear, month: currentMonth };
		}
		const year = Number(match[1]);
		const month = Number(match[2]);
		if (year < 1 || month < 1 || month > 12) {
			return { year: currentYear, month: currentMonth };
		}
		return { year, month };
	});
	const y = $derived.by(() => {
		const t = new Temporal.PlainDate(x.year, x.month, 1);
		return {
			t,
			dayOfWeek: t.dayOfWeek % 7,
			daysInMonth: t.daysInMonth
		};
	});
	function nav(offset: number) {
		const date = new Date(x.year, x.month - 1 + offset, 1);
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		goto(`/calendar?view=month&p=${y}-${m}`);
	}
</script>

<div class="header">
	<h1>
		{y.t.toLocaleString(locale, { month: 'long', year: 'numeric' })}
	</h1>
	<button onclick={() => nav(-1)} class="btn icon secondary" aria-label="Previous month">
		<ChevronLeft size={20} />
	</button>
	<button onclick={() => nav(1)} class="btn icon secondary" aria-label="Next month">
		<ChevronRight size={20} />
	</button>
	<button onclick={() => {}} class="btn secondary"> Today </button>
</div>

<div class="month-view" aria-label={y.t.toLocaleString(locale, { month: 'long', year: 'numeric' })}>
	{#each weekdays as weekday, i (i)}
		<div class="weekday">{weekday}</div>
	{/each}

	{#each { length: 42 } as _, i (i)}
		{const t = $derived(
			new Temporal.PlainDate(x.year, x.month, 1).subtract({ days: y.dayOfWeek - i })
		)}
		<!-- {const isCurrentMonth = $derived(i >= dayOfWeek && i < dayOfWeek + daysInMonth)} -->
		{const isToday = $derived(y.t.equals(Temporal.Now.plainDateISO()))}

		<div
			class={[
				'day',
				i < y.dayOfWeek && 'prev-month',
				i >= y.dayOfWeek + y.daysInMonth && 'next-month',
				isToday && 'today'
			]}
			aria-label={t.toLocaleString(locale, { dateStyle: 'full' })}
			aria-current={isToday ? 'date' : undefined}
		>
			<span class="day-number">{t.day}</span>
		</div>
	{/each}
</div>

<style>
	.header {
		padding: 0 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	h1 {
		flex: 1;
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.month-view {
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}

	.weekday {
		min-width: 0;
		height: 3.5rem;
		border-block: 1px solid var(--color-border);
		display: grid;
		place-items: center;
		font-weight: 600;
	}

	.day {
		min-width: 0;
		min-height: 6rem;
		padding: 0.5rem;
		border-right: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);

		&:nth-child(7n + 1) {
			border-left: 1px solid var(--color-border);
		}

		@media (hover: hover) {
			&:hover {
				background-color: rgb(0 0 0 / 5%);
			}
		}
	}

	/* Weekday headers occupy the first seven grid positions. */
	.day:nth-child(7n + 8) {
		border-left: 1px solid var(--color-border);
	}

	.day-number {
		display: inline-grid;
		place-items: center;
		min-width: 2rem;
		height: 2rem;
		border-radius: 50%;
		font-variant-numeric: tabular-nums;
	}

	.prev-month,
	.next-month {
		color: var(--color-muted-text);
	}

	.today .day-number {
		background: var(--color-primary);
		color: white;
		font-weight: 700;
	}
</style>
