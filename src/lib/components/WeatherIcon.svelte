<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements'

	interface Props extends SVGAttributes<SVGSVGElement> {
		code?: number
		title?: string
	}

	let { code = 0, class: className = '', ...restProps }: Props = $props()

	// Categorize Open-Meteo weather codes
	// https://open-meteo.com/en/docs
	let type = $derived.by(() => {
		if (code === 0) return 'clear' // Clear sky
		if (code === 1 || code === 2 || code === 3) return 'cloudy' // Mainly clear, partly cloudy, overcast
		if (code === 45 || code === 48) return 'fog' // Fog
		if (
			(code >= 51 && code <= 57) || // Drizzle
			(code >= 61 && code <= 67) || // Rain
			(code >= 80 && code <= 82) // Rain showers
		) {
			return 'rain'
		}
		if (
			(code >= 71 && code <= 77) || // Snow
			(code >= 85 && code <= 86) // Snow showers
		) {
			return 'snow'
		}
		if (code >= 95 && code <= 99) return 'thunderstorm' // Thunderstorm
		return 'cloudy' // Default fallback
	})
</script>

{#if type === 'clear'}
	<!-- Sun Icon -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon weather-icon--clear {className}"
		{...restProps}
	>
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="m4.93 4.93 1.41 1.41" />
		<path d="m17.66 17.66 1.41 1.41" />
		<path d="M2 12h2" />
		<path d="M20 12h2" />
		<path d="m6.34 17.66-1.41 1.41" />
		<path d="m19.07 4.93-1.41 1.41" />
	</svg>
{:else if type === 'fog'}
	<!-- Fog Icon -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon weather-icon--fog {className}"
		{...restProps}
	>
		<path d="M4 6h16" />
		<path d="M4 10h16" />
		<path d="M6 14h12" />
		<path d="M8 18h8" />
	</svg>
{:else if type === 'rain'}
	<!-- Rain Icon (Cloud + Rain drops) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon weather-icon--rain {className}"
		{...restProps}
	>
		<path
			class="weather-icon__cloud"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
		<path class="weather-icon__drop" d="M8 14v4" />
		<path class="weather-icon__drop" d="M12 16v4" />
		<path class="weather-icon__drop" d="M16 14v4" />
	</svg>
{:else if type === 'snow'}
	<!-- Snow Icon (Cloud + Snow dots) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon weather-icon--snow {className}"
		{...restProps}
	>
		<path
			class="weather-icon__cloud"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
		<path class="weather-icon__flake" d="M8 16h.01" />
		<path class="weather-icon__flake" d="M8 20h.01" />
		<path class="weather-icon__flake" d="M12 18h.01" />
		<path class="weather-icon__flake" d="M12 22h.01" />
		<path class="weather-icon__flake" d="M16 16h.01" />
		<path class="weather-icon__flake" d="M16 20h.01" />
	</svg>
{:else if type === 'thunderstorm'}
	<!-- Thunderstorm Icon (Cloud + Lightning) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon weather-icon--thunderstorm {className}"
		{...restProps}
	>
		<path
			class="weather-icon__cloud"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
		<path class="weather-icon__lightning" d="m13 14-3 5h4l-3 5" />
	</svg>
{:else}
	<!-- Cloudy / Default Icon -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon weather-icon--cloudy {className}"
		{...restProps}
	>
		<path
			class="weather-icon__cloud"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
	</svg>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	.weather-icon--clear {
		@apply stroke-amber-500 fill-amber-100;
	}

	.weather-icon--fog {
		@apply stroke-slate-400;
	}

	.weather-icon--rain {
		& .weather-icon__cloud {
			@apply stroke-slate-500 fill-slate-100;
		}
		& .weather-icon__drop {
			@apply stroke-blue-500;
		}
	}

	.weather-icon--snow {
		& .weather-icon__cloud {
			@apply stroke-slate-400 fill-slate-50;
		}
		& .weather-icon__flake {
			@apply stroke-sky-400;
		}
	}

	.weather-icon--thunderstorm {
		& .weather-icon__cloud {
			@apply stroke-slate-600 fill-slate-200;
		}
		& .weather-icon__lightning {
			@apply stroke-yellow-500 fill-yellow-300;
		}
	}

	.weather-icon--cloudy {
		& .weather-icon__cloud {
			@apply stroke-slate-400 fill-slate-50;
		}
	}
</style>
