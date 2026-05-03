<script lang="ts">
	import type { SavedLocation } from '$lib/types/location'
	import { Scale, type Weather, type DisplayOptions } from '$lib/types/weather'
	import ForecastItem from './ForecastItem.svelte'
	import Temperature from './Temperature.svelte'

	interface Props {
		location: SavedLocation
		weather?: Weather
		scale?: Scale
		displayOptions?: DisplayOptions
		sharedScroll?: { left: number }
		selectedTime?: string
		onTimeChange?: (time: string) => void
	}

	let {
		location,
		weather,
		scale = Scale.C,
		displayOptions = { temperature: true, precipitation: false },
		sharedScroll = { left: 0 },
		selectedTime,
		onTimeChange,
	}: Props = $props()

	let scrollContainer = $state<HTMLDivElement | null>(null)
	let internalNow = $state(new Date())

	// Use selectedTime if provided, otherwise use internalNow for live updates
	let effectiveTime = $derived(selectedTime ? new Date(selectedTime) : internalNow)

	$effect(() => {
		if (selectedTime) return // Don't tick if we have a selected time

		const interval = setInterval(() => {
			internalNow = new Date()
		}, 10000)
		return () => clearInterval(interval)
	})

	function handleScroll(e: Event) {
		if (scrollContainer) {
			sharedScroll.left = scrollContainer.scrollLeft
		}
	}

	$effect(() => {
		if (scrollContainer && Math.abs(scrollContainer.scrollLeft - sharedScroll.left) > 1) {
			scrollContainer.scrollLeft = sharedScroll.left
		}
	})

	let currentDateTime = $derived.by(() => {
		const date = effectiveTime.toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			timeZone: location.timezone,
		})
		const time = effectiveTime.toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: location.timezone,
		})
		return `${date}, ${time}`
	})

	function handleDateTimeInput(e: Event) {
		const target = e.target as HTMLInputElement
		if (target.value && onTimeChange) {
			// input type="datetime-local" gives local time, we should convert it back to ISO string
			const localDate = new Date(target.value)
			onTimeChange(localDate.toISOString())
		}
	}

	function formatDate(offsetDays: number = 0): string {
		const date = new Date(effectiveTime)
		date.setDate(date.getDate() + offsetDays)
		return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
	}

	// Format effectiveTime for input value (YYYY-MM-DDTHH:mm)
	let inputTimeValue = $derived.by(() => {
		const d = effectiveTime
		const pad = (n: number) => n.toString().padStart(2, '0')
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
	})
</script>

<div class="location">
	<div
		class="location__header flex items-center justify-between sm:flex-col sm:items-start sm:justify-start sm:gap-1"
	>
		<h1 class="location__city-name text-left text-3xl font-bold">{location.name}</h1>
		{#if weather}
			<div class="location__current-temp flex items-baseline gap-2 text-2xl font-semibold text-gray-800">
				<Temperature value={weather.temp[scale]} />
				<div class="relative">
					<button
						class="location__time-display text-sm font-normal text-gray-500 hover:text-blue-600 focus:outline-none"
						onclick={(e) => {
							const input = e.currentTarget.nextElementSibling as HTMLInputElement
							input?.showPicker()
						}}
					>
						{currentDateTime}
					</button>
					<input
						type="datetime-local"
						class="invisible absolute top-0 left-0 h-0 w-0"
						value={inputTimeValue}
						onchange={handleDateTimeInput}
					/>
				</div>
			</div>
		{/if}
	</div>
	{#if weather}
		<div class="flex w-full min-w-0 flex-col gap-2">
			<div
				class="flex flex-row gap-2 overflow-x-auto pb-2"
				bind:this={scrollContainer}
				onscroll={handleScroll}
			>
				{#each weather.next as forecast, i ('day_' + i)}
					<ForecastItem
						date={formatDate(i)}
						minTemp={forecast.min[scale]}
						maxTemp={forecast.max[scale]}
						precipitation={forecast.precipitation}
						{displayOptions}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.location {
		@apply border border-gray-200 bg-white transition-colors;
		@apply w-full;
		@apply grid grid-cols-1 items-center gap-4 rounded-xl p-4 shadow-sm sm:grid-cols-[12rem_1fr] sm:items-start;
	}

	.location__city-name {
		@apply text-slate-600;
	}

	.location__current-temp {
		@apply sm:mt-1;
	}

	.location__time-display {
		@apply border-b border-dotted border-gray-400 cursor-pointer;
	}
</style>
