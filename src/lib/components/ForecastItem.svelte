<script lang="ts">
	import Temperature from './Temperature.svelte'
	import WeatherIcon from './WeatherIcon.svelte'
	import {
		getWeatherDescription,
		getTemperatureColorClass,
		getTemperatureColorHex,
	} from '$lib/utils/weather'
	import { Scale, type DisplayOptions, type Reading } from '$lib/types/weather'

	interface Props {
		date: string
		temp?: Reading
		minTemp?: Reading
		maxTemp?: Reading
		precipitation?: number
		windSpeed?: number
		uvIndex?: number
		displayOptions?: DisplayOptions
		weatherCode?: number
		scale?: Scale
	}

	let {
		date,
		temp,
		minTemp,
		maxTemp,
		precipitation,
		windSpeed,
		uvIndex,
		displayOptions = { temperature: true, precipitation: false, wind: false, uvIndex: false },
		weatherCode,
		scale = Scale.C,
	}: Props = $props()

	// Calculate average temperature in Celsius for styling purposes
	let avgTempC = $derived.by(() => {
		if (temp !== undefined) return temp[Scale.C]
		if (minTemp !== undefined && maxTemp !== undefined) {
			return (minTemp[Scale.C] + maxTemp[Scale.C]) / 2
		}
		return undefined
	})

	let iconColorClass = $derived(getTemperatureColorClass(avgTempC))
	let minColorHex = $derived(getTemperatureColorHex(minTemp?.[Scale.C]))
	let maxColorHex = $derived(getTemperatureColorHex(maxTemp?.[Scale.C]))
</script>

<div
	class="flex w-[11ch] shrink-0 flex-col items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 text-center shadow-sm"
>
	<div class="mb-1 text-sm font-medium text-gray-500">{date}</div>
	{#if weatherCode !== undefined}
		<div class="mb-2 flex flex-col items-center justify-center text-gray-500">
			<WeatherIcon code={weatherCode} class="h-7 w-7" title={getWeatherDescription(weatherCode)} />
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
					<Temperature value={temp[scale]} />
				{:else if minTemp !== undefined && maxTemp !== undefined}
					<div class="flex w-full flex-col items-center gap-1">
						<div class="flex items-center gap-1">
							<Temperature value={minTemp[scale]} />
							<span class={iconColorClass}>-</span>
							<Temperature value={maxTemp[scale]} />
						</div>
						<div
							class="h-[5px] w-full rounded-full"
							style="background: linear-gradient(90deg, {minColorHex}, {maxColorHex});"
						></div>
					</div>
				{/if}
			</div>
		{/if}
		{#if displayOptions.precipitation && precipitation !== undefined}
			<div class="text-sm font-medium text-blue-600">
				{precipitation} mm
			</div>
		{/if}
		{#if displayOptions.wind && windSpeed !== undefined}
			<div class="text-sm font-medium text-slate-600">
				{windSpeed} km/h
			</div>
		{/if}
		{#if displayOptions.uvIndex && uvIndex !== undefined}
			<div class="text-sm font-medium text-amber-600">
				UV {uvIndex}
			</div>
		{/if}
	</div>
</div>
