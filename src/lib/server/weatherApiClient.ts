import type { Weather } from '$lib/types/weather'
import { Scale } from '$lib/types/weather'
import { searchLocationsServer } from './geocoding'

export async function getWeather(locationName: string, forecast: boolean = true): Promise<Weather> {
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
		url.searchParams.set('current', 'temperature_2m')
		if (forecast) {
			url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min')
		}
		url.searchParams.set('timezone', 'auto')

		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch weather: ${response.status}`)
		}
		const data = await response.json()

		const currentC = data.current.temperature_2m
		const currentF = (currentC * 9/5) + 32

		const next = []
		if (forecast && data.daily) {
			for (let i = 0; i < data.daily.time.length; i++) {
				const maxC = data.daily.temperature_2m_max[i]
				const minC = data.daily.temperature_2m_min[i]
				next.push({
					max: { C: Math.round(maxC), F: Math.round((maxC * 9/5) + 32) },
					min: { C: Math.round(minC), F: Math.round((minC * 9/5) + 32) },
				})
			}
		}

		const result = {
			temp: {
				F: Math.round(currentF),
				C: Math.round(currentC),
			},
			next,
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
