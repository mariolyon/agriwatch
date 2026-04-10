import type { Weather } from '$lib/types/weather'
import * as dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.WEATHER_API_KEY!

export async function getWeather(locationName: string, forecast: boolean = true): Promise<Weather> {
	try {
		const days = forecast? 7: 0
		const response = await fetch(
			`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&days=${days}&q=${locationName}`
		)

		const data = await response.json()
		const result = {
			temp: {
				F: Math.round(data.current.temp_f),
				C: Math.round(data.current.temp_c)
			},
			next: data.forecast.forecastday.map((info)=>
				({
					max: {C: Math.round(info.day.maxtemp_c), F: Math.round(info.day.maxtemp_f)},
					min: {C: Math.round(info.day.mintemp_c), F: Math.round(info.day.mintemp_f)}
				})
			)
		}
		return result;
	} catch (error) {
		console.error('Error fetching weather:', error)
		return {
			temp: {
				F: 0,
				C: 0
			},
			next: []
		}
	}
}
