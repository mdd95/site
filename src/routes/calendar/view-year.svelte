<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    import ChevronLeft from '@lucide/svelte/icons/chevron-left';
    import ChevronRight from '@lucide/svelte/icons/chevron-right';

    import { getConfig } from './page-context.svelte.js';
    import { createWeekdayNames } from './page-utils.js';

    const PARAM_NAME = 'y';
    const MIN_YEAR = 1900;
    const MAX_YEAR = 2100;

    const today = Temporal.Now.plainDateISO();
    const { locale, weekStart } = getConfig();

    const year = $derived.by(() => {
        const param = Number(page.url.searchParams.get(PARAM_NAME));
        const validYear = Number.isInteger(param) && param > 0 ? param : today.year;

        return Math.min(Math.max(validYear, MIN_YEAR), MAX_YEAR);
    });

    async function navigateYear(offset: number) {
        const targetYear = Math.min(Math.max(year + offset, MIN_YEAR), MAX_YEAR);
        if (targetYear === year) return;

        const url = new URL(page.url.href);
        url.searchParams.set(PARAM_NAME, String(targetYear));

        await goto(url);
    }

    async function navigateThisYear() {
        const url = new URL(page.url.href);
        url.searchParams.set(PARAM_NAME, String(today.year));

        await goto(url);
    }
</script>

<div class="header">
    <h1>{year}</h1>

    <button
        type="button"
        onclick={() => navigateYear(-1)}
        class="btn btn-icon btn-secondary"
        aria-label="Previous year"
    >
        <ChevronLeft size={20} />
    </button>

    <button
        type="button"
        onclick={() => navigateYear(1)}
        class="btn btn-icon btn-secondary"
        aria-label="Next year"
    >
        <ChevronRight size={20} />
    </button>

    <button
        type="button"
        onclick={() => navigateThisYear()}
        class="btn btn-secondary"
        aria-label="Goto currrent year"
    >
        Today
    </button>
</div>

<div class="year-view">
    {#each { length: 12 }, month}
        {const firstDay = $derived(new Temporal.PlainDate(year, month + 1, 1))}
        {const firstDayOffset = $derived(((firstDay.dayOfWeek % 7) - weekStart + 7) % 7)}
        {const daysInMonth = $derived(firstDay.daysInMonth)}
        {const cellCount = $derived(Math.ceil((firstDayOffset + daysInMonth) / 7) * 7)}

        <section
            class="month"
            aria-label={firstDay.toLocaleString(locale, { month: 'long', year: 'numeric' })}
        >
            <h2 class="year-label">{firstDay.toLocaleString(locale, { month: 'long' })}</h2>

            {#each createWeekdayNames() as weekday}
                <div class="weekday">{weekday}</div>
            {/each}

            {#each { length: cellCount }, i}
                {const day = $derived(i - firstDayOffset + 1)}

                {#if day < 1 || day > daysInMonth}
                    <div class="day empty" aria-hidden="true"></div>
                {:else}
                    {const date = $derived(firstDay.with({ day }))}

                    <div
                        class={['day', date.equals(today) && 'today']}
                        aria-label={date.toLocaleString(locale, { dateStyle: 'full' })}
                        aria-current={date.equals(today) ? 'date' : undefined}
                    >
                        {day}
                    </div>
                {/if}
            {/each}
        </section>
    {/each}
</div>

<style>
    .header {
        padding: 0 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        & h1 {
            flex: 1;
            text-align: left;
        }
    }

    .year-view {
        width: min(80rem, 100%);
        margin: 1rem auto;
        padding: 0 1rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
        gap: 0.5rem;
    }

    .month {
        padding: 0.25rem;
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 0.25rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius);
    }

    .year-label {
        grid-column: 1 / -1;
        margin: 0.25rem 0;
        font-size: 1rem;
        font-weight: 600;
        text-align: center;
    }

    .weekday,
    .day {
        aspect-ratio: 1;
        display: grid;
        place-items: center;
    }

    .weekday {
        font-size: 0.75rem;
        color: var(--color-muted-text);
    }

    .day {
        font-size: 0.875rem;
        font-variant-numeric: tabular-nums;
    }

    .empty {
        pointer-events: none;
    }

    .today {
        background: var(--color-primary);
        color: var(--color-primary-text);
        font-weight: 600;
    }
</style>
