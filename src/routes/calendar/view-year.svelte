<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    import ChevronLeft from '@lucide/svelte/icons/chevron-left';
    import ChevronRight from '@lucide/svelte/icons/chevron-right';

    import { getConfig } from './page-context.svelte.js';
    import { createWeekdayNames } from './page-utils.js';

    const today = Temporal.Now.plainDateISO();
    const { locale, weekStart } = getConfig();

    function parseYear() {
        const fromUrl = page.url.searchParams.get('y');
        const yearInt = parseInt(fromUrl ?? '');

        // TODO: Add bounds
        return Number.isNaN(yearInt) ? today.year : yearInt;
    }

    let year = $derived(parseYear());
</script>

<div class="header">
    <h1>{year}</h1>

    <button
        onclick={async () => {
            year -= 1;
            await goto(`/calendar?y=${year}`);
        }}
        class="btn btn-icon btn-secondary"
        aria-label="Previous month"
    >
        <ChevronLeft size={20} />
    </button>

    <button
        onclick={async () => {
            year += 1;
            await goto(`/calendar?y=${year}`);
        }}
        class="btn btn-icon btn-secondary"
        aria-label="Next month"
    >
        <ChevronRight size={20} />
    </button>

    <button
        onclick={async () => await goto(`/calendar?y=${new Date().getFullYear()}`)}
        class="btn btn-secondary"
    >
        Today
    </button>
</div>

<div class="year-view">
    {#each { length: 12 }, month}
        {const first = $derived(new Temporal.PlainDate(year, month + 1, 1))}
        {const offset = $derived(((first.dayOfWeek % 7) - weekStart + 7) % 7)}
        {const days = $derived(first.daysInMonth)}
        {const cellCount = $derived(Math.ceil((offset + days) / 7) * 7)}

        <section
            class="month"
            aria-label={first.toLocaleString(locale, { month: 'long', year: 'numeric' })}
        >
            <h2 class="year-label">{first.toLocaleString(locale, { month: 'long' })}</h2>

            {#each createWeekdayNames() as weekday, i (i)}
                <div class="weekday">{weekday}</div>
            {/each}

            {#each { length: cellCount } as _, i (i)}
                {const day = i - offset + 1}

                {#if day < 1 || day > days}
                    <div class="day empty" aria-hidden="true"></div>
                {:else}
                    {const date = $derived(first.with({ day }))}

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
