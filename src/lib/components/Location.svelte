<script lang="ts">
	import type { SavedLocation } from '$lib/types/location';
	import type { Weather } from '$lib/types/weather';

	interface Props {
		location: SavedLocation;
		weather?: Weather;
		scale?: string;
	}

	let { location, weather, scale = 'C' }: Props = $props();

	let locationLabel = $derived.by(() => {
		return [location.name, location.admin1, location.country].filter(Boolean).join(', ');
	});
</script>

<div class="location flex flex-col items-left gap-2">
	<h1>
		<span class="location__city-name text-3xl font-bold">{location.name}</span></h1>
	{#if weather}
		<table class="location__info text-sm font-medium border p-2 border-gray-200">
			<thead>
			<tr class="divide-x border-gray-200">
				<th class="px-4 py-0 border-gray-200 text-left">Now</th>
				{#each weather.next as forecast, i}
					<th class="px-4 py-0 border-gray-200 text-left">+{i + 1} day</th>
				{/each}
			</tr>
			</thead>
			<tbody>
			<tr class="divide-x border-gray-200">
				<td class="px-4 py-0 border-gray-200 text-left">
					{weather.temp[scale]}{" "}{scale}
				</td>
				{#each weather.next as forecast, i}
					<td class="px-4 py-0 border-gray-200 text-left">{forecast.min[scale]}{" "} - {forecast.max[scale]}{" "}{scale}  </td>
				{/each}
			</tr>
			</tbody>
		</table>
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
