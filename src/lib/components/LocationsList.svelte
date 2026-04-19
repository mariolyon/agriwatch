<script lang="ts">
	import Location from './Location.svelte'
	import GripVerticalIcon from './icons/GripVerticalIcon.svelte'
	import TrashIcon from './icons/TrashIcon.svelte'
	import type { SavedLocation } from '$lib/types/location'
	import type { Weather } from '$lib/types/weather'

	interface Props {
		locations: SavedLocation[]
		weatherData: Record<number, Weather>
		scale: string
		onremove: (id: number) => void
		onreorder: (fromIndex: number, toIndex: number) => void
	}

	let { locations, weatherData, scale, onremove, onreorder }: Props = $props()

	let draggedIndex = $state<number | null>(null)
	let dragOverIndex = $state<number | null>(null)
	let startedOnHandle = false

	function handlePointerDown(e: PointerEvent) {
		const target = e.target as HTMLElement
		startedOnHandle = !!target.closest('.locations-list__drag-handle')
	}

	function handleDragStart(e: DragEvent, index: number) {
		if (!startedOnHandle) {
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
</script>

{#if locations.length === 0}
	<p class="locations-list__empty mt-8 text-center">No Locations Saved</p>
{:else}
	<div class="locations-list mt-8 flex flex-col gap-6" role="list">
		{#each locations as location, i (location.id)}
			<div
				class="locations-list__item relative flex items-center gap-4 rounded-xl p-4 shadow-sm transition-colors
					{draggedIndex === i ? 'locations-list__item--dragging' : ''}
					{dragOverIndex === i ? 'locations-list__item--drag-over' : ''}"
				draggable="true"
				onpointerdown={handlePointerDown}
				ondragstart={(e) => handleDragStart(e, i)}
				ondragover={(e) => handleDragOver(e, i)}
				ondragleave={(e) => {
					const itemEl = e.currentTarget as HTMLElement
					handleDragLeave(e, i, itemEl)
				}}
				ondrop={(e) => handleDrop(e, i)}
				ondragend={handleDragEnd}
				role="listitem"
			>
				<div class="locations-list__drag-handle" aria-hidden="true" title="Drag to reorder">
					<GripVerticalIcon />
				</div>

				<div class="flex-1">
					<Location {location} weather={weatherData[location.id]} {scale} />
				</div>

				<button
					class="locations-list__remove-btn rounded-full p-1 transition-colors"
					onclick={() => {
						if (confirm(`Remove ${location.name}?`)) onremove(location.id)
					}}
					aria-label="Remove {location.name}"
					title="Remove {location.name}"
				>
					<TrashIcon />
				</button>
			</div>
		{/each}
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	.locations-list__item {
		@apply cursor-grab border border-gray-200 bg-white;
	}

	.locations-list__item:active {
		@apply cursor-grabbing;
	}

	.locations-list__item--dragging {
		@apply opacity-50;
	}

	.locations-list__item--drag-over {
		@apply border-blue-500 ring-2 ring-blue-200;
	}

	.locations-list__drag-handle {
		@apply cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing;
	}

	.locations-list__remove-btn {
		@apply text-gray-400 hover:text-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none;
	}

	.locations-list__empty {
		@apply text-gray-500;
	}
</style>
