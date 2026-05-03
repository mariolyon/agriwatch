<script lang="ts">
	import type { SavedLocation } from '$lib/types/location'
	import { Scale, type Weather, type DisplayOptions } from '$lib/types/weather'
	import ForecastItem from './ForecastItem.svelte'
	import Temperature from './Temperature.svelte'

	interface Props {
		location: SavedLocation
		weather?: Weather
		scale?: Scale
		displayOptions?: DisplayOptions
		sharedScroll?: { left: number }
	}

	let {
		location,
		weather,
		scale = Scale.C,
		displayOptions = { temperature: true, precipitation: false },
		sharedScroll = { left: 0 },
	}: Props = $props()

	let scrollContainer = $state<HTMLDivElement | null>(null)

	function handleScroll(e: Event) {
		if (scrollContainer) {
			sharedScroll.left = scrollContainer.scrollLeft
		}
	}

	$effect(() => {
		if (scrollContainer && Math.abs(scrollContainer.scrollLeft - sharedScroll.left) > 1) {
			scrollContainer.scrollLeft = sharedScroll.left
		}
	})

	let locationLabel = $derived.by(() => {
		return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
	})

	function formatDate(offsetDays: number = 0): string {
		const date = new Date()
		date.setDate(date.getDate() + offsetDays)
		return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
	}
</script>

<div class="location">
	<div
		class="location__header flex items-center justify-between sm:flex-col sm:items-start sm:justify-start sm:gap-1"
	>
		<h1 class="location__city-name text-left text-3xl font-bold">{location.name}</h1>
		{#if weather}
			<div class="location__current-temp text-2xl font-semibold text-gray-800">
				<Temperature value={weather.temp[scale]} />
			</div>
		{/if}
	</div>
	{#if weather}
		<div class="flex w-full min-w-0 flex-col gap-2">
			<div
				class="flex flex-row gap-2 overflow-x-auto pb-2"
				bind:this={scrollContainer}
				onscroll={handleScroll}
			>
				{#each weather.next as forecast, i ('day_' + i)}
					<ForecastItem
						date={formatDate(i)}
						minTemp={forecast.min[scale]}
						maxTemp={forecast.max[scale]}
						precipitation={forecast.precipitation}
						{displayOptions}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.location {
		@apply border border-gray-200 bg-white transition-colors;
		@apply w-full;
		@apply grid grid-cols-1 items-center gap-4 rounded-xl p-4 shadow-sm sm:grid-cols-[12rem_1fr] sm:items-start;
	}

	.location__city-name {
		@apply text-slate-600;
	}

	.location__current-temp {
		@apply sm:mt-1;
	}

	.location__info {
		@apply text-slate-600;
	}
</style>
