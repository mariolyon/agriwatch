<script lang="ts">
	import Location from './Location.svelte';
	import type { SavedLocation } from '$lib/types/location';

	interface Props {
		locations: SavedLocation[];
		onremove: (id: number) => void;
		onreorder: (fromIndex: number, toIndex: number) => void;
	}

	let { locations, onremove, onreorder }: Props = $props();

	let draggedIndex = $state<number | null>(null);
	let dragOverIndex = $state<number | null>(null);

	function handleDragStart(e: DragEvent, index: number) {
		draggedIndex = index;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', index.toString());
		}
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		if (draggedIndex !== null && draggedIndex !== index && dragOverIndex !== index) {
			dragOverIndex = index;
		}
	}

	function handleDragLeave(_e: DragEvent, index: number) {
		if (dragOverIndex === index) {
			dragOverIndex = null;
		}
	}

	function handleDrop(e: DragEvent, index: number) {
		e.preventDefault();
		if (draggedIndex !== null && draggedIndex !== index) {
			onreorder(draggedIndex, index);
		}
		draggedIndex = null;
		dragOverIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
		dragOverIndex = null;
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
				ondragstart={(e) => handleDragStart(e, i)}
				ondragover={(e) => handleDragOver(e, i)}
				ondragleave={(e) => handleDragLeave(e, i)}
				ondrop={(e) => handleDrop(e, i)}
				ondragend={handleDragEnd}
				role="listitem"
			>
				<div
					class="locations-list__drag-handle"
					aria-hidden="true"
					title="Drag to reorder"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="9" cy="12" r="1" />
						<circle cx="9" cy="5" r="1" />
						<circle cx="9" cy="19" r="1" />
						<circle cx="15" cy="12" r="1" />
						<circle cx="15" cy="5" r="1" />
						<circle cx="15" cy="19" r="1" />
					</svg>
				</div>

				<div class="flex-1">
					<Location {location} />
				</div>

				<button
					class="locations-list__remove-btn rounded-full p-1 transition-colors"
					onclick={() => onremove(location.id)}
					aria-label="Remove {location.name}"
					title="Remove {location.name}"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M3 6h18" />
						<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
						<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
						<line x1="10" y1="11" x2="10" y2="17" />
						<line x1="14" y1="11" x2="14" y2="17" />
					</svg>
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
