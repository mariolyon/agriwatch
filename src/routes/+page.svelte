<script lang="ts">
	import { browser } from '$app/environment';
	import { Location } from '$lib/components';
	import type { SavedLocation } from '$lib/types/location';

	const STORAGE_KEY = 'agriwatch_locations';

	let locations = $state<SavedLocation[]>([]);
	let draggedIndex = $state<number | null>(null);
	let dragOverIndex = $state<number | null>(null);

	$effect(() => {
		if (browser) {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				try {
					locations = JSON.parse(stored);
				} catch {
					locations = [];
				}
			}
		}
	});

	function saveLocations() {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
		}
	}

	function removeLocation(id: number) {
		locations = locations.filter((loc) => loc.id !== id);
		saveLocations();
	}

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
		if (draggedIndex !== null && draggedIndex !== index) {
			dragOverIndex = index;
		}
	}

	function handleDragLeave(e: DragEvent, index: number) {
		if (dragOverIndex === index) {
			dragOverIndex = null;
		}
	}

	function handleDrop(e: DragEvent, index: number) {
		e.preventDefault();
		if (draggedIndex !== null && draggedIndex !== index) {
			const newLocations = [...locations];
			const [removed] = newLocations.splice(draggedIndex, 1);
			newLocations.splice(index, 0, removed);
			locations = newLocations;
			saveLocations();
		}
		draggedIndex = null;
		dragOverIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
		dragOverIndex = null;
	}
</script>

<main class="dashboard flex flex-1 flex-col p-6">
	<header class="flex items-center justify-between">
		<h1 class="dashboard__heading text-2xl font-bold">Locations</h1>
		<a class="dashboard__add-btn" href="/location">Add</a>
	</header>

	{#if locations.length === 0}
		<p class="mt-8 text-center text-gray-500">No Locations Saved</p>
	{:else}
		<div class="mt-8 flex flex-col gap-6" role="list">
			{#each locations as location, i (location.id)}
				<div
					class="dashboard__location-row relative flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-colors {draggedIndex === i
						? 'opacity-50'
						: ''} {dragOverIndex === i
						? 'border-blue-500 ring-2 ring-blue-200'
						: 'border-gray-200'}"
					draggable="true"
					ondragstart={(e) => handleDragStart(e, i)}
					ondragover={(e) => handleDragOver(e, i)}
					ondragleave={(e) => handleDragLeave(e, i)}
					ondrop={(e) => handleDrop(e, i)}
					ondragend={handleDragEnd}
					role="listitem"
				>
					<div
						class="dashboard__drag-handle cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
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
						class="dashboard__remove-btn rounded-full p-1 text-gray-400 transition-colors hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
						onclick={() => removeLocation(location.id)}
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
</main>

<style lang="postcss">
	@reference "tailwindcss";

	.dashboard__heading {
		@apply text-gray-900;
	}

	.dashboard__add-btn {
		@apply rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors;
	}

	.dashboard__add-btn:hover {
		@apply bg-green-700;
	}

	.dashboard__add-btn:focus-visible {
		@apply outline-none ring-2 ring-green-300;
	}

	.dashboard__location-row {
		@apply cursor-grab;
	}

	.dashboard__location-row:active {
		@apply cursor-grabbing;
	}
</style>
