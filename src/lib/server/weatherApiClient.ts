import type { Weather } from '$lib/types/weather'
import { Scale } from '$lib/types/weather'
import { searchLocationsServer } from './geocoding'

export async function getWeather(
	locationName: string,
	forecast: boolean = true,
	date?: Date
): Promise<Weather> {
	try {
		const locations = await searchLocationsServer(locationName)
		if (locations.length === 0) {
			throw new Error(`No coordinates found for location: ${locationName}`)
		}

		const location = locations[0]

		const { latitude, longitude } = location

		const url = new URL('https://api.open-meteo.com/v1/forecast')
		url.searchParams.set('latitude', latitude.toString())
		url.searchParams.set('longitude', longitude.toString())

		if (date) {
			const dateStr = date.toISOString().split('T')[0]
			url.searchParams.set('start_date', dateStr)
			// Fetch 7 days from the selected date for the forecast
			const endDate = new Date(date)
			endDate.setDate(endDate.getDate() + 7)
			url.searchParams.set('end_date', endDate.toISOString().split('T')[0])
			url.searchParams.set('hourly', 'temperature_2m,weather_code')
		} else {
			url.searchParams.set('current', 'temperature_2m,weather_code')
		}

		if (forecast) {
			url.searchParams.set(
				'daily',
				'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max,weather_code'
			)
		}
		url.searchParams.set('timezone', 'auto')

		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch weather: ${response.status}`)
		}
		const data = await response.json()

		let currentC = 0
		let currentWeatherCode = 0
		if (date && data.hourly) {
			// Find the hourly temperature closest to the requested time
			const requestedTime = date.getTime()
			let closestIndex = 0
			let minDiff = Infinity

			for (let i = 0; i < data.hourly.time.length; i++) {
				const time = new Date(data.hourly.time[i] + 'Z').getTime()
				const diff = Math.abs(time - requestedTime)
				if (diff < minDiff) {
					minDiff = diff
					closestIndex = i
				}
			}
			currentC = data.hourly.temperature_2m[closestIndex]
			currentWeatherCode = data.hourly.weather_code ? data.hourly.weather_code[closestIndex] : 0
		} else if (data.current) {
			currentC = data.current.temperature_2m
			currentWeatherCode = data.current.weather_code || 0
		}

		const currentF = (currentC * 9) / 5 + 32

		const next = []
		if (forecast && data.daily) {
			for (let i = 0; i < data.daily.time.length; i++) {
				const maxC = data.daily.temperature_2m_max[i]
				const minC = data.daily.temperature_2m_min[i]
				const precipitation = data.daily.precipitation_sum[i] || 0
				const windSpeed = data.daily.wind_speed_10m_max ? data.daily.wind_speed_10m_max[i] || 0 : 0
				const weatherCode = data.daily.weather_code ? data.daily.weather_code[i] : 0
				const uvIndex = data.daily.uv_index_max ? (data.daily.uv_index_max[i] ?? 0) : 0
				next.push({
					max: { C: Math.round(maxC), F: Math.round((maxC * 9) / 5 + 32) },
					min: { C: Math.round(minC), F: Math.round((minC * 9) / 5 + 32) },
					uvIndex,
					precipitation,
					windSpeed,
					weatherCode,
				})
			}
		}

		const result = {
			temp: {
				F: Math.round(currentF),
				C: Math.round(currentC),
			},
			next,
			weatherCode: currentWeatherCode,
		}
		return result
	} catch (error) {
		console.error('Error fetching weather:', error)
		return {
			temp: {
				[Scale.F]: 0,
				[Scale.C]: 0,
			},
			next: [],
		}
	}
}
