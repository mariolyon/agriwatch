import type { Weather } from '$lib/types/weather'
import * as dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.WEATHER_API_KEY!

export async function getWeather(locationName: string): Promise<Weather> {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&days=0&q=${locationName}`
		)

		const data = await response.json()
		return { temp_c: data.current.temp_c }
	} catch (error) {
		console.error('Error fetching weather:', error)
		return { temp_c: 0 }
	}
}
