<script lang="ts">
	import { LocationsList } from '$lib/components'
	import type { PageData } from './$types'
	import type { SavedLocation } from '$lib/types/location'
	import type { DisplayOptions } from '$lib/types/weather'
	import scaleState from '$lib/state/scaleState.svelte'

	let { data }: { data: PageData } = $props()

	let locations: SavedLocation[] = $state.raw(data.locations)
	let displayOptions = $state<DisplayOptions>({
		temperature: true,
		precipitation: false,
	})

	async function saveLocations() {
		const formData = new FormData()
		formData.append('locations', JSON.stringify(locations))

		await fetch('?/save', {
			method: 'POST',
			body: formData,
		})
	}

	async function removeLocation(id: number) {
		locations = locations.filter((loc) => loc.id !== id)
		saveLocations()
	}

	async function reorderLocations(fromIndex: number, toIndex: number) {
		const newLocations = [...locations]
		const [removed] = newLocations.splice(fromIndex, 1)
		newLocations.splice(toIndex, 0, removed)
		locations = newLocations
		saveLocations()
	}

	function toggleOption(option: keyof DisplayOptions) {
		displayOptions[option] = !displayOptions[option]
	}
</script>

<main class="dashboard flex flex-1 flex-col p-3 sm:p-4">
	<header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div class="dashboard__toggles flex gap-2">
			<button
				class="dashboard__toggle-btn {displayOptions.temperature
					? 'dashboard__toggle-btn--active'
					: ''}"
				onclick={() => toggleOption('temperature')}
			>
				Temperature
			</button>
			<button
				class="dashboard__toggle-btn {displayOptions.precipitation
					? 'dashboard__toggle-btn--active'
					: ''}"
				onclick={() => toggleOption('precipitation')}
			>
				Precipitation
			</button>
		</div>
		<a class="dashboard__add-btn" href="/browser">Add Location</a>
	</header>

	<LocationsList
		{locations}
		weatherData={data.weatherData}
		scale={scaleState.current}
		displayOptions={displayOptions}
		onremove={removeLocation}
		onreorder={reorderLocations}
	/>
</main>

<style lang="postcss">
	@reference "tailwindcss";

	.dashboard__toggles {
		@apply flex rounded-lg bg-gray-100 p-1;
	}

	.dashboard__toggle-btn {
		@apply rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors;
	}

	.dashboard__toggle-btn:hover {
		@apply bg-gray-200 text-gray-900;
	}

	.dashboard__toggle-btn--active {
		@apply bg-white text-gray-900 shadow-sm;
	}

	.dashboard__toggle-btn--active:hover {
		@apply bg-white text-gray-900;
	}

	.dashboard__add-btn {
		@apply rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors;
	}

	.dashboard__add-btn:hover {
		@apply bg-green-700;
	}

	.dashboard__add-btn:focus-visible {
		@apply ring-2 ring-green-300 outline-none;
	}
</style>
