<script lang="ts">
	import type { SavedLocation } from '$lib/types/location';
	import type { Weather } from '$lib/types/weather';

	interface Props {
		location: SavedLocation;
		weather?: Weather;
	}

	let { location, weather }: Props = $props();

	let locationLabel = $derived.by(() => {
		return [location.name, location.admin1, location.country].filter(Boolean).join(', ');
	});
</script>

<div class="location flex flex-col items-center gap-2">
	<h1 class="location__city-name text-4xl font-bold">{location.name}</h1>
	<p class="location__city-detail text-lg">{locationLabel}</p>
	{#if weather}
		<p class="location__info text-sm font-medium">{weather.temp_c}C</p>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.location__city-name {
		@apply text-green-700;
	}

	.location__city-detail {
		@apply text-gray-500;
	}

	.location__info {
		@apply mt-1 text-blue-600;
	}
</style>
