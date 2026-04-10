<script lang="ts">
	import { browser } from '$app/environment';
	import { LocationsList } from '$lib/components';
	import type { SavedLocation } from '$lib/types/location';

	const STORAGE_KEY = 'agriwatch_locations';

	function loadLocations(): SavedLocation[] {
		if (!browser) return [];
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];
		try {
			return JSON.parse(stored);
		} catch {
			return [];
		}
	}

	let locations = $state.raw<SavedLocation[]>(loadLocations());

	function saveLocations() {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
		}
	}

	function removeLocation(id: number) {
		locations = locations.filter((loc) => loc.id !== id);
		saveLocations();
	}

	function reorderLocations(fromIndex: number, toIndex: number) {
		const newLocations = [...locations];
		const [removed] = newLocations.splice(fromIndex, 1);
		newLocations.splice(toIndex, 0, removed);
		locations = newLocations;
		saveLocations();
	}
</script>

<main class="dashboard flex flex-1 flex-col p-6">
	<header class="flex items-center justify-between">
		<h1 class="dashboard__heading text-2xl font-bold">Locations</h1>
		<a class="dashboard__add-btn" href="/browser">Add</a>
	</header>

	<LocationsList {locations} onremove={removeLocation} onreorder={reorderLocations} />
</main>

<style lang="postcss">
	@reference "tailwindcss";

	.dashboard__heading {
		@apply text-gray-900;
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
