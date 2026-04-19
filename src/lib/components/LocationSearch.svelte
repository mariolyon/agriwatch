<script lang="ts">
	import type { GeocodingResult } from '$lib/types/location'
	import { searchLocations, formatLocationLabel } from '$lib/utils/geocoding'
	import SearchIcon from './icons/SearchIcon.svelte'

	interface Props {
		onselect: (location: GeocodingResult) => void
	}

	let { onselect }: Props = $props()

	const uid = $props.id()
	const inputId = `${uid}-input`
	const listboxId = `${uid}-listbox`

	let query = $state('')
	let results: GeocodingResult[] = $state.raw([])
	let isOpen = $state(false)
	let activeIndex = $state(-1)
	let isLoading = $state(false)

	let containerEl: HTMLDivElement
	let requestId = 0

	let showNoResults = $derived(
		isOpen && !isLoading && results.length === 0 && query.trim().length >= 2
	)

	let showDropdown = $derived((isOpen && results.length > 0) || showNoResults)

	let activeDescendant = $derived(activeIndex >= 0 ? `${uid}-option-${activeIndex}` : undefined)

	function countryCodeToFlag(code: string): string {
		return code
			.toUpperCase()
			.split('')
			.map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
			.join('')
	}

	$effect(() => {
		const currentQuery = query.trim()

		if (currentQuery.length < 2) {
			results = []
			isOpen = false
			isLoading = false
			return
		}

		isLoading = true
		const id = ++requestId
		const controller = new AbortController()

		const timeout = setTimeout(async () => {
			try {
				const data = await searchLocations(currentQuery, controller.signal)
				if (id !== requestId) return
				results = data
				isOpen = true
				activeIndex = -1
			} catch (e) {
				if (id !== requestId) return
				if (!(e instanceof DOMException && e.name === 'AbortError')) {
					results = []
				}
			} finally {
				if (id === requestId) {
					isLoading = false
				}
			}
		}, 300)

		return () => {
			clearTimeout(timeout)
			controller.abort()
		}
	})

	function selectLocation(location: GeocodingResult) {
		query = formatLocationLabel(location)
		isOpen = false
		results = []
		activeIndex = -1
		onselect(location)
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen || results.length === 0) return

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				activeIndex = (activeIndex + 1) % results.length
				break
			case 'ArrowUp':
				event.preventDefault()
				activeIndex = (activeIndex - 1 + results.length) % results.length
				break
			case 'Enter':
				event.preventDefault()
				if (activeIndex >= 0) {
					selectLocation(results[activeIndex])
				}
				break
			case 'Escape':
				event.preventDefault()
				isOpen = false
				activeIndex = -1
				break
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (containerEl && !containerEl.contains(event.target as Node)) {
			isOpen = false
			activeIndex = -1
		}
	}
</script>

<svelte:document onclick={handleClickOutside} />

<div class="location-search" bind:this={containerEl}>
	<div class="location-search__input-wrapper flex items-center gap-2">
		<SearchIcon class="shrink-0 text-gray-400" width="20" height="20" aria-hidden="true" />

		<input
			id={inputId}
			class="location-search__input flex-1"
			type="text"
			placeholder="Search for a location..."
			autocomplete="off"
			role="combobox"
			aria-autocomplete="list"
			aria-expanded={showDropdown}
			aria-controls={listboxId}
			aria-activedescendant={activeDescendant}
			bind:value={query}
			onkeydown={handleKeydown}
			onfocus={() => {
				if (results.length > 0) isOpen = true
			}}
		/>

		{#if isLoading}
			<div class="location-search__spinner" role="status" aria-label="Loading results"></div>
		{/if}
	</div>

	{#if showDropdown}
		<ul
			id={listboxId}
			class="location-search__results"
			role="listbox"
			aria-label="Location results"
		>
			{#if results.length > 0}
				{#each results as location, index (location.id)}
					<li
						id={`${uid}-option-${index}`}
						class="location-search__option flex items-center gap-3 {index === activeIndex
							? 'location-search__option--active'
							: ''}"
						role="option"
						aria-selected={index === activeIndex}
						onclick={() => selectLocation(location)}
						onkeydown={(e: KeyboardEvent) => {
							if (e.key === 'Enter') selectLocation(location)
						}}
						onmouseenter={() => {
							activeIndex = index
						}}
					>
						<span class="location-search__flag" aria-hidden="true">
							{countryCodeToFlag(location.country_code)}
						</span>
						<span class="location-search__details flex flex-col">
							<span class="location-search__name">{location.name}</span>
							<span class="location-search__region text-sm">
								{#if location.admin1}{location.admin1},
								{/if}{location.country}
							</span>
						</span>
					</li>
				{/each}
			{:else}
				<li class="location-search__empty" role="presentation">No results found</li>
			{/if}
		</ul>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.location-search {
		@apply relative w-full;
	}

	.location-search__input-wrapper {
		@apply rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors;
	}

	.location-search__input-wrapper:focus-within {
		@apply border-blue-500 ring-2 ring-blue-200;
	}

	.location-search__input {
		@apply bg-transparent text-gray-900 placeholder-gray-400 outline-none;
	}

	.location-search__spinner {
		@apply h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500;
	}

	.location-search__results {
		@apply absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg;
	}

	.location-search__option {
		@apply cursor-pointer px-3 py-2 transition-colors;
	}

	.location-search__option:hover,
	.location-search__option--active {
		@apply bg-blue-50;
	}

	.location-search__empty {
		@apply px-3 py-4 text-center text-gray-500;
	}

	.location-search__flag {
		@apply text-xl leading-none;
	}

	.location-search__name {
		@apply font-medium text-gray-900;
	}

	.location-search__region {
		@apply text-gray-500;
	}
</style>
