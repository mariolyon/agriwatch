<script lang="ts">
	import { LocationsList } from '$lib/components'
	import type { PageData } from './$types'
	import type { SavedLocation } from '$lib/types/location'

	let { data }: { data: PageData } = $props()

	let locations: SavedLocation[] = $state.raw(data.locations)

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
</script>

<main class="dashboard flex flex-1 flex-col p-6">
	<header class="flex items-center justify-end">
		<a class="dashboard__add-btn" href="/browser">Add Location</a>
	</header>

	<LocationsList
		{locations}
		weatherData={data.weatherData}
		scale={data.scale}
		onremove={removeLocation}
		onreorder={reorderLocations}
	/>
</main>

<style lang="postcss">
	@reference "tailwindcss";

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
