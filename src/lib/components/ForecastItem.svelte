<script lang="ts">
	import Temperature from './Temperature.svelte'
	import WeatherIcon from './WeatherIcon.svelte'
	import { getWeatherDescription } from '$lib/utils/weather'
	import type { DisplayOptions } from '$lib/types/weather'

	interface Props {
		date: string
		temp?: number
		minTemp?: number
		maxTemp?: number
		precipitation?: number
		displayOptions?: DisplayOptions
		weatherCode?: number
	}

	let {
		date,
		temp,
		minTemp,
		maxTemp,
		precipitation,
		displayOptions = { temperature: true, precipitation: false },
		weatherCode,
	}: Props = $props()
</script>

<div
	class="flex w-[11ch] shrink-0 flex-col items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 text-center shadow-sm"
>
	<div class="mb-1 text-sm font-medium text-gray-500">{date}</div>
	{#if weatherCode !== undefined}
		<div class="mb-2 flex flex-col items-center justify-center text-gray-500">
			<WeatherIcon
				code={weatherCode}
				class="h-7 w-7 text-slate-500"
				title={getWeatherDescription(weatherCode)}
			/>
			<span
				class="mt-1 overflow-hidden px-1 text-[10px] font-semibold text-clip whitespace-nowrap text-slate-400"
				title={getWeatherDescription(weatherCode)}
			>
				{getWeatherDescription(weatherCode)}
			</span>
		</div>
	{/if}
	<div class="flex flex-col gap-1 text-gray-800">
		{#if displayOptions.temperature}
			<div class="text-lg font-semibold">
				{#if temp !== undefined}
					<Temperature value={temp} />
				{:else if minTemp !== undefined && maxTemp !== undefined}
					<Temperature value={minTemp} /> - <Temperature value={maxTemp} />
				{/if}
			</div>
		{/if}
		{#if displayOptions.precipitation && precipitation !== undefined}
			<div class="text-sm font-medium text-blue-600">
				{precipitation} mm
			</div>
		{/if}
	</div>
</div>
