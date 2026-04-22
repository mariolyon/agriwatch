<script lang="ts">
	import Location from './Location.svelte'
	import MoreHorizontalIcon from './icons/MoreHorizontalIcon.svelte'
	import type { SavedLocation } from '$lib/types/location'
	import type { Weather, Scale } from '$lib/types/weather'

	interface Props {
		location: SavedLocation
		weather?: Weather
		scale: Scale
		isDragging: boolean
		isDragOver: boolean
		isMenuOpen: boolean
		sharedScroll: { left: number }
		onpointerdown: (e: PointerEvent) => void
		ondragstart: (e: DragEvent) => void
		ondragover: (e: DragEvent) => void
		ondragleave: (e: DragEvent) => void
		ondrop: (e: DragEvent) => void
		ondragend: (e: DragEvent) => void
		ontogglemenu: (e: MouseEvent) => void
		onremove: (id: number) => void
	}

	let {
		location,
		weather,
		scale,
		isDragging,
		isDragOver,
		isMenuOpen,
		sharedScroll,
		onpointerdown,
		ondragstart,
		ondragover,
		ondragleave,
		ondrop,
		ondragend,
		ontogglemenu,
		onremove,
	}: Props = $props()
</script>

<div
	class="locations-list__item relative
		{isDragging ? 'locations-list__item--dragging' : ''}
		{isDragOver ? 'locations-list__item--drag-over' : ''}"
	draggable="true"
	{onpointerdown}
	{ondragstart}
	{ondragover}
	{ondragleave}
	{ondrop}
	{ondragend}
	role="listitem"
>
	<Location {location} {weather} {scale} {sharedScroll}>
		{#snippet actions()}
			<div class="locations-list__actions relative p-0 leading-[0]">
				<button
					class="locations-list__menu-btn
					rounded-full text-gray-400 transition-colors
					hover:text-gray-600 focus:ring-2
					focus:ring-gray-300 focus:outline-none"
					onclick={ontogglemenu}
					aria-label="Menu for {location.name}"
					title="Menu for {location.name}"
				>
					<MoreHorizontalIcon />
				</button>

				{#if isMenuOpen}
					<div
						class="ring-opacity-5 absolute top-full right-0 z-10 mt-1 w-32 rounded-md bg-white shadow-lg ring-1 ring-black"
					>
						<button
							class="w-full rounded-md px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 focus:outline-none"
							onclick={(e) => {
								e.stopPropagation()
								onremove(location.id)
							}}
						>
							Delete
						</button>
					</div>
				{/if}
			</div>
		{/snippet}
	</Location>
</div>

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
</style>
