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
		if (code === 1) return 'mainly-clear' // Mainly clear (Sun in front of small cloud)
		if (code === 2) return 'partly-cloudy' // Partly cloudy (Sun behind cloud)
		if (code === 3) return 'overcast' // Overcast
		if (code === 45 || code === 48) return 'fog' // Fog
		if (code >= 51 && code <= 57) return 'drizzle' // Drizzle
		if (
			code === 61 || code === 63 || code === 66 ||
			code === 80 || code === 81
		) {
			return 'rain'
		}
		if (code === 65 || code === 67 || code === 82) {
			return 'heavy-rain'
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
	<!-- Sun Icon (Yellow) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon {className}"
		{...restProps}
	>
		<circle cx="12" cy="12" r="4" class="fill-white" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="m4.93 4.93 1.41 1.41" />
		<path d="m17.66 17.66 1.41 1.41" />
		<path d="M2 12h2" />
		<path d="M20 12h2" />
		<path d="m6.34 17.66-1.41 1.41" />
		<path d="m19.07 4.93-1.41 1.41" />
	</svg>
{:else if type === 'mainly-clear'}
	<!-- Mainly Clear (Sun in foreground [yellow], Small Cloud in background [gray]) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon {className}"
		{...restProps}
	>
		<!-- Small Cloud in background (gray) -->
		<path
			class="stroke-slate-400 fill-white"
			transform="translate(6, 6) scale(0.6)"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
		<!-- Sun in foreground (yellow) -->
		<circle cx="9" cy="9" r="4" class="fill-white" />
		<path d="M9 1v2" />
		<path d="M9 15v2" />
		<path d="m3.34 3.34 1.41 1.41" />
		<path d="m13.26 13.26 1.41 1.41" />
		<path d="M1 9h2" />
		<path d="M15 9h2" />
		<path d="m4.34 13.26-1.41 1.41" />
		<path d="m14.66 3.34-1.41 1.41" />
	</svg>
{:else if type === 'partly-cloudy'}
	<!-- Partly Cloudy (Sun behind cloud [yellow], Cloud in foreground [gray]) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon {className}"
		{...restProps}
	>
		<!-- Sun in background (yellow) -->
		<path d="M12 2v2" />
		<path d="m4.93 4.93 1.41 1.41" />
		<path d="M20 12h2" />
		<path d="m19.07 4.93-1.41 1.41" />
		<path class="fill-white" d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
		<!-- Cloud in foreground (gray) -->
		<path class="stroke-slate-400 fill-white" d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
	</svg>
{:else if type === 'overcast'}
	<!-- Overcast (Overlapping Clouds [gray]) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon text-slate-400 {className}"
		{...restProps}
	>
		<path class="fill-white" d="M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61" />
		<path class="fill-white" d="M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z" />
	</svg>
{:else if type === 'fog'}
	<!-- Fog Icon (Gray) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon text-slate-400 {className}"
		{...restProps}
	>
		<path d="M4 6h16" />
		<path d="M4 10h16" />
		<path d="M6 14h12" />
		<path d="M8 18h8" />
	</svg>
{:else if type === 'drizzle'}
	<!-- Drizzle Icon (Cloud [gray] + few raindrops [blue]) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon text-slate-400 {className}"
		{...restProps}
	>
		<path
			class="fill-white"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
		<path class="stroke-blue-500" d="M10 15v3" />
		<path class="stroke-blue-500" d="M14 15v3" />
	</svg>
{:else if type === 'rain'}
	<!-- Rain Icon (Cloud [gray] + normal raindrops [blue]) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon text-slate-400 {className}"
		{...restProps}
	>
		<path
			class="fill-white"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
		<path class="stroke-blue-500" d="M8 15v5" />
		<path class="stroke-blue-500" d="M12 15v5" />
		<path class="stroke-blue-500" d="M16 15v5" />
	</svg>
{:else if type === 'heavy-rain'}
	<!-- Heavy Rain Icon (Cloud [gray] + many raindrops [blue]) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon text-slate-400 {className}"
		{...restProps}
	>
		<path
			class="fill-white"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
		<path class="stroke-blue-500" d="M6 15v6" />
		<path class="stroke-blue-500" d="M9.5 15v6" />
		<path class="stroke-blue-500" d="M13 15v6" />
		<path class="stroke-blue-500" d="M16.5 15v6" />
		<path class="stroke-blue-500" d="M20 15v6" />
	</svg>
{:else if type === 'snow'}
	<!-- Snow Icon (Cloud [gray] + Snow dots) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon text-slate-400 {className}"
		{...restProps}
	>
		<path
			class="fill-white"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
		<path d="M8 16h.01" />
		<path d="M8 20h.01" />
		<path d="M12 17h.01" />
		<path d="M12 21h.01" />
		<path d="M16 15h.01" />
		<path d="M16 19h.01" />
	</svg>
{:else if type === 'thunderstorm'}
	<!-- Thunderstorm Icon (Cloud [gray] + Lightning [yellow]) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon text-slate-400 {className}"
		{...restProps}
	>
		<path
			class="fill-white"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
		<path class="stroke-amber-500 fill-white" d="m13 14-3 5h4l-3 5" />
	</svg>
{:else}
	<!-- Cloudy / Default Icon (Cloud [gray]) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="weather-icon text-slate-400 {className}"
		{...restProps}
	>
		<path
			class="fill-white"
			d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.95-3-4-3-2.6 0-4.67 1.83-5 4.5-2 .41-3.5 2-3.5 4a3.5 3.5 0 0 0 3.5 3.5z"
		/>
	</svg>
{/if}
