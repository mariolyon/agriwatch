<script lang="ts">
	import { goto } from '$app/navigation';
	import { LocationSearch, Location } from '$lib/components';
	import type { GeocodingResult, SavedLocation } from '$lib/types/location';

	const STORAGE_KEY = 'agriwatch_locations';

	let selectedLocation: SavedLocation | null = $state(null);

	function handleSelect(result: GeocodingResult) {
		selectedLocation = {
			id: result.id,
			name: result.name,
			country: result.country,
			admin1: result.admin1,
			latitude: result.latitude,
			longitude: result.longitude,
			timezone: result.timezone
		};
	}

	function handleAdd() {
		if (!selectedLocation) return;

		const stored = localStorage.getItem(STORAGE_KEY);
		let locations: SavedLocation[] = [];
		if (stored) {
			try {
				locations = JSON.parse(stored);
			} catch {
				locations = [];
			}
		}

		// Prevent duplicates based on ID
		if (!locations.some((loc) => loc.id === selectedLocation!.id)) {
			locations.push(selectedLocation);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
		}

		goto('/');
	}
</script>

<main class="location-page flex flex-1 items-center justify-center p-4">
	<section class="flex w-full max-w-md flex-col items-center gap-6 text-center">
		<p class="location-page__subtitle text-lg">Find your field's location to get started</p>
		<div class="w-full">
			<LocationSearch onselect={handleSelect} />
		</div>

		{#if selectedLocation}
			<div class="flex flex-col items-center gap-4">
				<Location location={selectedLocation} />
				<button type="button" class="location-page__add-btn" onclick={handleAdd}>
					Save Location
				</button>
			</div>
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
