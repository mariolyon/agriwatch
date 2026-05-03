<script lang="ts">
	import Temperature from './Temperature.svelte'
	import type { DisplayMode } from '$lib/types/weather'

	interface Props {
		date: string
		temp?: number
		minTemp?: number
		maxTemp?: number
		precipitation?: number
		displayMode?: DisplayMode
	}

	let { date, temp, minTemp, maxTemp, precipitation, displayMode = 'temperature' }: Props = $props()
</script>

<div
	class="flex w-[11ch] shrink-0 flex-col items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 text-center shadow-sm"
>
	<div class="mb-1 text-sm font-medium text-gray-500">{date}</div>
	<div class="text-lg font-semibold text-gray-800">
		{#if displayMode === 'precipitation' && precipitation !== undefined}
			{precipitation} mm
		{:else if temp !== undefined}
			<Temperature value={temp} />
		{:else if minTemp !== undefined && maxTemp !== undefined}
			<Temperature value={minTemp} /> - <Temperature value={maxTemp} />
		{/if}
	</div>
</div>