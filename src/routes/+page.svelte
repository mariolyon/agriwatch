<script lang="ts">
	import { LocationsList } from '$lib/components'
	import type { PageData } from './$types'
	import type { SavedLocation } from '$lib/types/location'
	import type { DisplayOptions } from '$lib/types/weather'
	import scaleState from '$lib/state/scaleState.svelte'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'

	let { data }: { data: PageData } = $props()

	let locations = $state<SavedLocation[]>(data.locations)
	let weatherData = $state(data.weatherData)
	let displayOptions = $state<DisplayOptions>({
		temperature: true,
		precipitation: false,
	})

	async function fetchWeatherForLocations(locs: SavedLocation[]) {
		console.log('Fetching weather for:', locs.length, 'locations')
		if (locs.length === 0) return

		const newWeatherData: Record<number, any> = { ...weatherData }
		for (const loc of locs) {
			try {
				const res = await fetch(
					`/api/weather?location=${encodeURIComponent(loc.name)}&dt=${data.selectedTime}`
				)
				if (res.ok) {
					newWeatherData[loc.id] = await res.json()
				}
			} catch (e) {
				console.error(`Failed to fetch weather for ${loc.name}`, e)
			}
		}
		weatherData = newWeatherData
	}

	onMount(async () => {
		console.log('onMount triggered, isDemo:', data.isDemo)
		if (data.isDemo) {
			const stored = localStorage.getItem('climview_demo_locations')
			console.log('Stored locations:', stored)
			if (stored) {
				locations = JSON.parse(stored)
				await fetchWeatherForLocations(locations)
			} else {
				console.log('First time demo user, detecting location...')
				// First time demo user - try to add current location
				const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
				const city = timezone.split('/').pop()?.replace(/_/g, ' ')
				console.log('Detected city:', city, 'from timezone:', timezone)
				if (city) {
					try {
						const searchRes = await fetch(`/api/search?q=${encodeURIComponent(city)}`)
						if (searchRes.ok) {
							const results = await searchRes.json()
							console.log('Search results:', results)
							if (results && results.length > 0) {
								const loc = results[0]
								const initialLocation: SavedLocation = {
									id: loc.id,
									name: loc.name,
									latitude: loc.latitude,
									longitude: loc.longitude,
									country: loc.country,
									admin1: loc.admin1,
									timezone: loc.timezone,
								}
								locations = [initialLocation]
								localStorage.setItem('climview_demo_locations', JSON.stringify(locations))
								console.log('Initial location saved:', initialLocation)
								await fetchWeatherForLocations(locations)
							}
						} else {
							console.error('Search API failed:', searchRes.status)
						}
					} catch (e) {
						console.error('Failed to set initial demo location', e)
					}
				}
			}
		}
	})

	async function saveLocations() {
		if (data.isDemo) {
			localStorage.setItem('climview_demo_locations', JSON.stringify(locations))
			return
		}
		const formData = new FormData()
		formData.append('locations', JSON.stringify(locations))

		await fetch('?/save', {
			method: 'POST',
			body: formData,
		})
	}

	async function removeLocation(id: number) {
		locations = locations.filter((loc) => loc.id !== id)
		saveLocations()
	}

	async function reorderLocations(fromIndex: number, toIndex: number) {
		const newLocations = [...locations]
		const [removed] = newLocations.splice(fromIndex, 1)
		newLocations.splice(toIndex, 0, removed)
		locations = newLocations
		saveLocations()
	}

	function toggleOption(option: keyof DisplayOptions) {
		displayOptions[option] = !displayOptions[option]
	}

	async function handleTimeChange(newTime: string) {
		const url = new URL(window.location.href)
		url.searchParams.set('dt', newTime)
		await goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true })
	}
</script>

<main class="dashboard">
	<header class="dashboard__header">
		<div class="dashboard__toggles">
			<button
				class="dashboard__toggle-btn {displayOptions.temperature
					? 'dashboard__toggle-btn--active'
					: ''}"
				onclick={() => toggleOption('temperature')}
			>
				Temperature
			</button>
			<button
				class="dashboard__toggle-btn {displayOptions.precipitation
					? 'dashboard__toggle-btn--active'
					: ''}"
				onclick={() => toggleOption('precipitation')}
			>
				Precipitation
			</button>
		</div>
		{#if data.isDemo}
			<a
				class="dashboard__add-btn"
				href="/register?message=Adding%20locations%20requires%20a%20user%20account%20to%20be%20created.&redirectTo=/browser"
			>
				Add Location
			</a>
		{:else}
			<a class="dashboard__add-btn" href="/browser">Add Location</a>
		{/if}
	</header>

	<LocationsList
		{locations}
		{weatherData}
		scale={scaleState.current}
		{displayOptions}
		selectedTime={data.selectedTime}
		onTimeChange={handleTimeChange}
		onremove={removeLocation}
		onreorder={reorderLocations}
	/>
</main>

<style lang="postcss">
	@reference "tailwindcss";

	.dashboard {
		@apply flex flex-1 flex-col p-3 sm:p-4;
	}

	.dashboard__header {
		@apply flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between;
	}

	.dashboard__toggles {
		@apply flex gap-2 rounded-lg bg-gray-100 p-1;
	}

	.dashboard__toggle-btn {
		@apply rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors;

		&:hover {
			@apply bg-gray-200 text-gray-900;
		}
	}

	.dashboard__toggle-btn--active {
		@apply bg-green-600 font-bold text-white shadow-md;

		&:hover {
			@apply bg-green-700 text-white;
		}
	}

	.dashboard__add-btn {
		@apply rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors;

		&:hover {
			@apply bg-green-700;
		}

		&:focus-visible {
			@apply ring-2 ring-green-300 outline-none;
		}
	}
</style>
