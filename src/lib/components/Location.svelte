<script lang="ts">
	import type { SavedLocation } from '$lib/types/location';

	interface Props {
		location: SavedLocation;
	}

	let { location }: Props = $props();

	let locationLabel = $derived.by(() => {
		return [location.name, location.admin1, location.country].filter(Boolean).join(', ');
	});

	let locationInfo = $state('');

	$effect(() => {
		let isAborted = false;

		async function fetchInfo() {
			try {
				const res = await fetch(`/api/location-info?name=${encodeURIComponent(location.name)}`);
				if (res.ok) {
					const data = await res.json();
					if (!isAborted) {
						locationInfo = data.info;
					}
				}
			} catch (e) {
				// Ignore fetch errors
			}
		}

		fetchInfo();

		return () => {
			isAborted = true;
		};
	});
</script>

<div class="location flex flex-col items-center gap-2">
	<h1 class="location__city-name text-4xl font-bold">{location.name}</h1>
	<p class="location__city-detail text-lg">{locationLabel}</p>
	{#if locationInfo}
		<p class="location__info text-sm font-medium">{locationInfo}</p>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.location__city-name {
		@apply text-green-700;
	}

	.location__city-detail {
		@apply text-gray-500;
	}

	.location__info {
		@apply mt-1 text-blue-600;
	}
</style>
