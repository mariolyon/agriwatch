import type { Weather } from '$lib/types/weather'
import * as dotenv from 'dotenv'
import { Scale } from '$lib/types/weather';
dotenv.config()

const API_KEY = process.env.WEATHER_API_KEY!

export async function getWeather(locationName: string, forecast: boolean = true): Promise<Weather> {
	try {
		const url = forecast
			? `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&days=7&q=${locationName}`
			: `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${locationName}`

		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch weather: ${response.status}`)
		}
		const data = await response.json()

		const result = {
			temp: {
				F: Math.round(data.current.temp_f),
				C: Math.round(data.current.temp_c),
			},
			next:
				(!data.forecast && []) ||
				data.forecast.forecastday.map((info) => ({
					max: { C: Math.round(info.day.maxtemp_c), F: Math.round(info.day.maxtemp_f) },
					min: { C: Math.round(info.day.mintemp_c), F: Math.round(info.day.mintemp_f) },
				})),
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
