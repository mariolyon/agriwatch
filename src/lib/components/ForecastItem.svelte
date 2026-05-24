<script lang="ts">
	import Temperature from './Temperature.svelte'
	import WeatherIcon from './WeatherIcon.svelte'
	import { getWeatherDescription } from '$lib/utils/weather'
	import { Scale, type DisplayOptions, type Reading } from '$lib/types/weather'

	interface Props {
		date: string
		temp?: Reading
		minTemp?: Reading
		maxTemp?: Reading
		precipitation?: number
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
		displayOptions = { temperature: true, precipitation: false },
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

	// Map average temperature to the requested border color scheme
	let borderColorClass = $derived.by(() => {
		if (avgTempC === undefined) return 'border-gray-200'
		if (avgTempC < -10) return 'border-slate-300' // White / Grey
		if (avgTempC < 0) return 'border-blue-800' // Dark Blue
		if (avgTempC < 5) return 'border-sky-300' // Light Blue
		if (avgTempC < 10) return 'border-emerald-500' // Green
		if (avgTempC < 20) return 'border-amber-400' // Yellow
		if (avgTempC < 30) return 'border-orange-500' // Orange
		if (avgTempC < 40) return 'border-red-500' // Red
		return 'border-fuchsia-600' // Magenta/Pink (Over 40)
	})
</script>

<div
	class="flex w-[11ch] shrink-0 flex-col items-center justify-between rounded-lg border {borderColorClass} bg-gray-50 p-3 text-center shadow-sm"
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
					<Temperature value={temp[scale]} />
				{:else if minTemp !== undefined && maxTemp !== undefined}
					<Temperature value={minTemp[scale]} /> - <Temperature value={maxTemp[scale]} />
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
