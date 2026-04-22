<script lang="ts">
	import { LocationSearch, Location } from '$lib/components'
	import type { GeocodingResult, SavedLocation } from '$lib/types/location'
	import { Scale, type Weather } from '$lib/types/weather'
	import { enhance } from '$app/forms'
	import { getContext } from 'svelte'

	let selectedLocation: SavedLocation | null = $state(null)
	let weather: Weather | null = $state(null)
	let isLoadingWeather = $state(false)

	let scaleState = getContext<{ current: Scale }>('scaleState')

	async function handleSelect(result: GeocodingResult) {
		selectedLocation = {
			id: result.id,
			name: result.name,
			country: result.country,
			admin1: result.admin1,
			latitude: result.latitude,
			longitude: result.longitude,
			timezone: result.timezone,
		}

		isLoadingWeather = true
		try {
			const response = await fetch(`/api/location-info?name=${encodeURIComponent(result.name)}`)
			if (response.ok) {
				weather = await response.json()
			} else {
				weather = null
			}
		} catch (error) {
			console.error('Failed to fetch weather:', error)
			weather = null
		} finally {
			isLoadingWeather = false
		}
	}
</script>

<main class="location-page flex flex-1 items-center justify-center p-4">
	<section class="flex w-full max-w-md flex-col items-center gap-6 text-center">
		<div class="w-full">
			<LocationSearch onselect={handleSelect} />
		</div>

		{#if selectedLocation}
			{#if isLoadingWeather}
				<div class="flex flex-col items-center gap-4">
					<p class="text-gray-500">Loading weather data...</p>
				</div>
			{:else}
				<div class="flex flex-col items-center gap-4">
					<Location
						location={selectedLocation}
						weather={weather || undefined}
						scale={scaleState?.current}
					/>
					<form method="POST" action="?/add" use:enhance>
						<input type="hidden" name="location" value={JSON.stringify(selectedLocation)} />
						<button type="submit" class="location-page__add-btn"> Add to Dashboard </button>
					</form>
				</div>
			{/if}
		{/if}
	</section>
</main>

<style lang="postcss">
	@reference "tailwindcss";

	.location-page__subtitle {
		@apply text-gray-500;
	}

	.location-page__add-btn {
		@apply mt-2 rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors;
	}

	.location-page__add-btn:hover {
		@apply bg-green-700;
	}

	.location-page__add-btn:focus-visible {
		@apply ring-2 ring-green-300 outline-none;
	}
</style>
