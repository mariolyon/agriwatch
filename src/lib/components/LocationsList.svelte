<script lang="ts">
	import Location from './Location.svelte'
	import MoreHorizontalIcon from './icons/MoreHorizontalIcon.svelte'
	import type { SavedLocation } from '$lib/types/location'
	import type { Weather, Scale } from '$lib/types/weather'

	interface Props {
		locations: SavedLocation[]
		weatherData: Record<number, Weather>
		scale: Scale
		onremove: (id: number) => void
		onreorder: (fromIndex: number, toIndex: number) => void
	}

	let { locations, weatherData, scale, onremove, onreorder }: Props = $props()

	let draggedIndex = $state<number | null>(null)
	let dragOverIndex = $state<number | null>(null)
	let startedOnDraggable = false
	let openMenuId = $state<number | null>(null)

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
</script>

<svelte:window onclick={() => (openMenuId = null)} />

{#if locations.length === 0}
	<p class="locations-list__empty mt-4 text-center">No Locations Saved</p>
{:else}
	<div class="locations-list mt-4 flex min-w-fit flex-col gap-3" role="list">
		{#each locations as location, i (location.id)}
			<div
				class="locations-list__item relative
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
				<Location {location} weather={weatherData[location.id]} {scale} />

				<div class="locations-list__actions absolute top-2 right-2">
					<button
						class="locations-list__menu-btn rounded-full p-1 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
						onclick={(e) => {
							e.stopPropagation()
							openMenuId = openMenuId === location.id ? null : location.id
						}}
						aria-label="Menu for {location.name}"
						title="Menu for {location.name}"
					>
						<MoreHorizontalIcon />
					</button>

					{#if openMenuId === location.id}
						<div
							class="absolute right-0 top-full z-10 mt-1 w-32 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
						>
							<button
								class="w-full rounded-md px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 focus:outline-none"
								onclick={(e) => {
									e.stopPropagation()
									onremove(location.id)
									openMenuId = null
								}}
							>
								Delete
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	.locations-list__item {
		@apply cursor-grab;
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

	.locations-list__empty {
		@apply text-gray-500;
	}
</style>