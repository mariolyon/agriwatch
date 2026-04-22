<script lang="ts">
	import type { SavedLocation } from '$lib/types/location'
	import { Scale, type Weather } from '$lib/types/weather'
	import Temperature from './Temperature.svelte'

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

<div class="location">
	<h1 class="location__city-name text-left text-3xl font-bold">{location.name}</h1>
	{#if weather}
		<table
			class="location__info w-full table-fixed border border-gray-200 p-1 text-sm font-medium sm:p-2"
		>
			<thead>
				<tr class="divide-x border-gray-200">
					<th class="border-gray-200 px-1 text-left sm:px-4 sm:py-0">Now</th>
					{#each weather.next as forecast, i ('head_' + i)}
						<th class="border-gray-200 px-1 text-left sm:px-4 sm:py-0">
							+{i + 1} <span class="md:hidden">d</span><span class="hidden md:inline">day</span>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				<tr class="divide-x border-gray-200">
					<td class="border-gray-200 px-1 text-left align-top sm:px-4 sm:py-0">
						<Temperature value={weather.temp[scale]} />
						<span class="hidden md:inline">{scale}</span>
					</td>
					{#each weather.next as forecast, i ('day' + i)}
						<td class="border-gray-200 px-1 text-left align-top sm:px-4 sm:py-0">
							<Temperature value={forecast.min[scale]} /> - <Temperature
								value={forecast.max[scale]}
							/>
							<span class="hidden md:inline">{scale}</span>
						</td>
					{/each}
				</tr>
			</tbody>
		</table>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.location {
		@apply border border-gray-200 bg-white transition-colors;
		@apply min-w-160;
		@apply grid grid-cols-1 items-center gap-4 rounded-xl p-4 pr-12 shadow-sm sm:grid-cols-[12rem_1fr];
	}

	.location__city-name {
		@apply self-start text-slate-600;
	}

	.location__info {
		@apply text-slate-600;
	}
</style>
