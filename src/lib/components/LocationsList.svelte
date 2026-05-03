<script lang="ts">
	import LocationListItem from './LocationListItem.svelte'
	import type { SavedLocation } from '$lib/types/location'
	import type { Weather, Scale, DisplayMode } from '$lib/types/weather'

	interface Props {
		locations: SavedLocation[]
		weatherData: Record<number, Weather>
		scale: Scale
		displayMode: DisplayMode
		onremove: (id: number) => void
		onreorder: (fromIndex: number, toIndex: number) => void
	}

	let { locations, weatherData, scale, displayMode, onremove, onreorder }: Props = $props()

	let draggedIndex = $state<number | null>(null)
	let dragOverIndex = $state<number | null>(null)
	let startedOnDraggable = false
	let openMenuId = $state<number | null>(null)
	let sharedScroll = $state({ left: 0 })

	function handlePointerDown(e: PointerEvent) {
		const target = e.target as HTMLElement
		startedOnDraggable =
			!target.closest('.location__info') && !target.closest('.locations-list__actions')
	}

	function handleDragStart(e: DragEvent, index: number) {
		if (!startedOnDraggable) {
			e.preventDefault()
			return
		}
		draggedIndex = index
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move'
			e.dataTransfer.setData('text/plain', index.toString())
		}
	}

	function handleDragOver(e: DragEvent, index: number) {
		if (draggedIndex === null) return
		e.preventDefault()
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move'
		}
		if (draggedIndex !== index) {
			dragOverIndex = index
		}
	}

	function handleDragLeave(e: DragEvent, index: number, itemEl: HTMLElement) {
		if (!itemEl.contains(e.relatedTarget as Node)) {
			if (dragOverIndex === index) {
				dragOverIndex = null
			}
		}
	}

	function handleDrop(e: DragEvent, index: number) {
		e.preventDefault()
		if (draggedIndex !== null && draggedIndex !== index) {
			onreorder(draggedIndex, index)
		}
		draggedIndex = null
		dragOverIndex = null
	}

	function handleDragEnd() {
		draggedIndex = null
		dragOverIndex = null
	}

	function handleToggleMenu(e: MouseEvent, id: number) {
		e.stopPropagation()
		openMenuId = openMenuId === id ? null : id
	}
</script>

<svelte:window onclick={() => (openMenuId = null)} />

{#if locations.length === 0}
	<p class="locations-list__empty mt-4 text-center">No Locations Saved</p>
{:else}
	<div class="locations-list mt-4 flex flex-col gap-3" role="list">
		{#each locations as location, i (location.id)}
			<LocationListItem
				{location}
				weather={weatherData[location.id]}
				{scale}
				{displayMode}
				isDragging={draggedIndex === i}
				isDragOver={dragOverIndex === i}
				isMenuOpen={openMenuId === location.id}
				{sharedScroll}
				onpointerdown={handlePointerDown}
				ondragstart={(e) => handleDragStart(e, i)}
				ondragover={(e) => handleDragOver(e, i)}
				ondragleave={(e) => {
					const itemEl = e.currentTarget as HTMLElement
					handleDragLeave(e, i, itemEl)
				}}
				ondrop={(e) => handleDrop(e, i)}
				ondragend={handleDragEnd}
				ontogglemenu={(e) => handleToggleMenu(e, location.id)}
				{onremove}
			/>
		{/each}
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	.locations-list__empty {
		@apply text-gray-500;
	}
</style>