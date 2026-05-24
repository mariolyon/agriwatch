/**
 * Returns a human-readable verbal description for a given WMO weather code.
 * Reference: https://open-meteo.com/en/docs
 */
export function getWeatherDescription(code: number): string {
	switch (code) {
		case 0:
			return 'Clear sky'
		case 1:
			return 'Mainly clear'
		case 2:
			return 'Partly cloudy'
		case 3:
			return 'Overcast'
		case 45:
			return 'Fog'
		case 48:
			return 'Depositing rime fog'
		case 51:
			return 'Light drizzle'
		case 53:
			return 'Moderate drizzle'
		case 55:
			return 'Dense drizzle'
		case 56:
			return 'Light freezing drizzle'
		case 57:
			return 'Dense freezing drizzle'
		case 61:
			return 'Slight rain'
		case 63:
			return 'Moderate rain'
		case 65:
			return 'Heavy rain'
		case 66:
			return 'Light freezing rain'
		case 67:
			return 'Heavy freezing rain'
		case 71:
			return 'Slight snow'
		case 73:
			return 'Moderate snow'
		case 75:
			return 'Heavy snow'
		case 77:
			return 'Snow grains'
		case 80:
			return 'Slight rain showers'
		case 81:
			return 'Moderate rain showers'
		case 82:
			return 'Violent rain showers'
		case 85:
			return 'Slight snow showers'
		case 86:
			return 'Heavy snow showers'
		case 95:
			return 'Thunderstorm'
		case 96:
			return 'Thunderstorm with slight hail'
		case 99:
			return 'Thunderstorm with heavy hail'
		default:
			return 'Cloudy'
	}
}

/**
 * Maps a temperature in Celsius to the corresponding Tailwind text color class.
 */
export function getTemperatureColorClass(tempC: number | undefined): string {
	if (tempC === undefined) {
		return 'text-slate-500'
	}
	if (tempC < -10) {
		return 'text-slate-300' // White / Grey (Bitter/Arctic cold)
	}
	if (tempC < 0) {
		return 'text-blue-800' // Dark Blue (Freezing conditions)
	}
	if (tempC < 5) {
		return 'text-sky-300' // Light Blue (Chilly, just above freezing)
	}
	if (tempC < 10) {
		return 'text-emerald-500' // Green (Cool, crisp spring/autumn)
	}
	if (tempC < 20) {
		return 'text-amber-400' // Yellow (Mild to warm)
	}
	if (tempC < 30) {
		return 'text-orange-500' // Orange (Warm/Hot summer days)
	}
	if (tempC < 40) {
		return 'text-red-500' // Red (Very hot)
	}
	return 'text-fuchsia-600' // Magenta/Pink (Extreme heatwaves)
}

/**
 * Maps a temperature in Celsius to its corresponding hex color code.
 */
export function getTemperatureColorHex(tempC: number | undefined): string {
	if (tempC === undefined) {
		return '#64748b' // Slate 500
	}
	if (tempC < -10) {
		return '#cbd5e1' // Slate 300
	}
	if (tempC < 0) {
		return '#1e40af' // Blue 800
	}
	if (tempC < 5) {
		return '#7dd3fc' // Sky 300
	}
	if (tempC < 10) {
		return '#10b981' // Emerald 500
	}
	if (tempC < 20) {
		return '#fbbf24' // Amber 400
	}
	if (tempC < 30) {
		return '#f97316' // Orange 500
	}
	if (tempC < 40) {
		return '#ef4444' // Red 500
	}
	return '#c026d3' // Fuchsia 600
}
