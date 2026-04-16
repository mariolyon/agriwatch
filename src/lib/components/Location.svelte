<script lang="ts">
	import type { SavedLocation } from '$lib/types/location'
	import { Scale, type Weather } from '$lib/types/weather'

	interface Props {
		location: SavedLocation
		weather?: Weather
		scale?: Scale
	}

	let { location, weather, scale = Scale.C }: Props = $props()

	let locationLabel = $derived.by(() => {
		return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
	})
</script>

<div class="location items-left flex flex-col gap-2">
	<h1>
		<span class="location__city-name text-3xl font-bold">{location.name}</span>
	</h1>
	{#if weather}
		<table class="location__info border border-gray-200 p-2 text-sm font-medium">
			<thead>
				<tr class="divide-x border-gray-200">
					<th class="border-gray-200 px-4 py-0 text-left">Now</th>
					{#each weather.next as forecast, i ('head_' + i)}
						<th class="border-gray-200 px-4 py-0 text-left">+{i + 1} day</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				<tr class="divide-x border-gray-200">
					<td class="border-gray-200 px-4 py-0 text-left">
						{weather.temp[scale]}
						{scale}
					</td>
					{#each weather.next as forecast, i ('day' + i)}
						<td class="border-gray-200 px-4 py-0 text-left">
							{forecast.min[scale]} - {forecast.max[scale]}
							{scale}
						</td>
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

	.location__info {
		@apply mt-1 text-blue-600;
	}
</style>
