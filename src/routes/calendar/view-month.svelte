<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    import ChevronLeft from '@lucide/svelte/icons/chevron-left';
    import ChevronRight from '@lucide/svelte/icons/chevron-right';

    import { getConfig } from './page-context.svelte.js';
    import { createWeekdayNames } from './page-utils.js';

    const PARAM_NAME = 'm';

    const today = Temporal.Now.plainDateISO();
    const { locale } = getConfig();

    const { year, month } = $derived.by(() => {
        const param = page.url.searchParams.get(PARAM_NAME);
        const match = /^(\d{4})-(\d{2})$/.exec(param ?? '');

        if (match) {
            const date = new Date(Number(match.at(1)), Number(match.at(2)) - 1, 1);
            return { year: date.getFullYear(), month: date.getMonth() + 1 };
        }

        return { year: today.year, month: today.month };
    });

    const firstDay = $derived(new Temporal.PlainDate(year, month, 1));
    const dayOfWeek = $derived(firstDay.dayOfWeek % 7);
    const daysInMonth = $derived(firstDay.daysInMonth);

    async function navigateMonth(offset: number) {
        const date = new Date(year, month + offset - 1, 1);
        const url = new URL(page.url.href);

        url.searchParams.set(
            PARAM_NAME,
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        );

        await goto(url);
    }

    async function gotoCurrentMonth() {
        const url = new URL(page.url.href);
        url.searchParams.set(PARAM_NAME, `${today.year}-${String(today.month).padStart(2, '0')}`);

        await goto(url);
    }
</script>

<div class="header">
    <h1>
        {firstDay.toLocaleString(locale, { month: 'long', year: 'numeric' })}
    </h1>

    <button
        type="button"
        class="btn btn-secondary btn-icon"
        aria-label="Previous month"
        onclick={() => navigateMonth(-1)}
    >
        <ChevronLeft size={20} />
    </button>

    <button
        type="button"
        class="btn btn-secondary btn-icon"
        aria-label="Next month"
        onclick={() => navigateMonth(1)}
    >
        <ChevronRight size={20} />
    </button>

    <button
        type="button"
        class="btn btn-secondary"
        aria-label="Current month"
        onclick={() => gotoCurrentMonth()}
    >
        Today
    </button>
</div>

<div
    class="month-view"
    aria-label={firstDay.toLocaleString(locale, { month: 'long', year: 'numeric' })}
>
    {#each createWeekdayNames() as weekday}
        <div class="weekday">{weekday}</div>
    {/each}

    {#each { length: 42 }, i}
        {const date = $derived(
            new Temporal.PlainDate(year, month, 1).subtract({ days: dayOfWeek - i })
        )}
        <!-- {const isCurrentMonth = $derived(i >= dayOfWeek && i < dayOfWeek + daysInMonth)} -->
        {const isToday = $derived(date.equals(today))}

        <div
            class={[
                'day',
                i < dayOfWeek && 'prev-month',
                i >= dayOfWeek + daysInMonth && 'next-month',
                isToday && 'today'
            ]}
            aria-label={date.toLocaleString(locale, { dateStyle: 'full' })}
            aria-current={isToday ? 'date' : undefined}
        >
            <span class="day-number">{date.day}</span>
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

        &:not(.prev-month):not(.next-month) {
            font-weight: 600;
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
