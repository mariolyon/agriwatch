import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getWeather } from './weatherApiClient'

describe('weatherApiClient', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('fetches current weather successfully', async () => {
		global.fetch = vi.fn().mockImplementation(async (url: string | URL | Request) => {
			if (
				url ===
				`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=London`
			) {
				return {
					ok: true,
					json: async () => ({
						current: {
							temp_c: 20.5,
							temp_f: 68.9,
						},
					}),
				} as Response
			}
			return { ok: false, status: 404 } as Response
		})

		const result = await getWeather('London', false)

		expect(global.fetch).toHaveBeenCalledTimes(1)
		expect(global.fetch).toHaveBeenCalledWith(
			`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=London`
		)
		expect(result).toEqual({
			temp: { C: 21, F: 69 },
			next: [],
		})
	})

	it('fetches weather forecast successfully', async () => {
		global.fetch = vi.fn().mockImplementation(async (url: string | URL | Request) => {
			if (
				url ===
				`https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&days=7&q=London`
			) {
				return {
					ok: true,
					json: async () => ({
						current: {
							temp_c: 20.5,
							temp_f: 68.9,
						},
						forecast: {
							forecastday: [
								{
									day: {
										maxtemp_c: 25.1,
										maxtemp_f: 77.2,
										mintemp_c: 15.4,
										mintemp_f: 59.7,
									},
								},
							],
						},
					}),
				} as Response
			}
			return { ok: false, status: 404 } as Response
		})

		const result = await getWeather('London', true)

		expect(global.fetch).toHaveBeenCalledTimes(1)
		expect(global.fetch).toHaveBeenCalledWith(
			`https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&days=7&q=London`
		)
		expect(result).toEqual({
			temp: { C: 21, F: 69 },
			next: [{ max: { C: 25, F: 77 }, min: { C: 15, F: 60 } }],
		})
	})

	it('returns default values on fetch error', async () => {
		global.fetch = vi.fn().mockImplementation(async (url: string | URL | Request) => {
			if (
				url ===
				`https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&days=7&q=London`
			) {
				return {
					ok: false,
					status: 500,
				} as Response
			}
			return { ok: false, status: 404 } as Response
		})

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		const result = await getWeather('London')

		expect(consoleSpy).toHaveBeenCalled()
		expect(result).toEqual({
			temp: { C: 0, F: 0 },
			next: [],
		})
	})
})
