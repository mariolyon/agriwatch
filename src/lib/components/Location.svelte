<script lang="ts">
	import type { SavedLocation } from '$lib/types/location'
	import { Scale, type Weather, type DisplayMode } from '$lib/types/weather'
	import ForecastItem from './ForecastItem.svelte'

	interface Props {
		location: SavedLocation
		weather?: Weather
		scale?: Scale
		displayMode?: DisplayMode
		sharedScroll?: { left: number }
	}

	let { location, weather, scale = Scale.C, displayMode = 'temperature', sharedScroll = { left: 0 } }: Props = $props()

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
	<h1 class="location__city-name text-left text-3xl font-bold">{location.name}</h1>
	{#if weather}
		<div class="flex w-full min-w-0 flex-col gap-2">
			<div
				class="flex flex-row gap-2 overflow-x-auto pb-2"
				bind:this={scrollContainer}
				onscroll={handleScroll}
			>
				<ForecastItem date="Now" temp={weather.temp[scale]} {displayMode} />
				{#each weather.next as forecast, i ('day_' + i)}
					<ForecastItem
						date={i === 0 ? `Today (${formatDate(i)})` : formatDate(i)}
						minTemp={forecast.min[scale]}
						maxTemp={forecast.max[scale]}
						precipitation={forecast.precipitation}
						{displayMode}
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
		@apply grid grid-cols-1 items-start gap-4 rounded-xl p-4 shadow-sm sm:grid-cols-[12rem_1fr];
	}

	.location__city-name {
		@apply self-start text-slate-600;
	}

	.location__info {
		@apply text-slate-600;
	}
</style>
