import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './+server'
import * as weatherApiClient from '$lib/server/weatherApiClient'

vi.mock('$lib/server/weatherApiClient', () => ({
	getWeather: vi.fn(),
}))

describe('GET /api/location-info', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('returns 400 if name parameter is missing', async () => {
		const url = new URL('http://localhost/api/location-info')
		const result = await GET({ url } as any)

		expect(result.status).toBe(400)
		const data = await result.json()
		expect(data).toEqual({ info: '' })
	})

	it('returns weather info if name parameter is provided', async () => {
		const mockWeather = {
			temp: { C: 20, F: 68 },
			next: [],
		}

		vi.spyOn(weatherApiClient, 'getWeather').mockResolvedValue(mockWeather)

		const url = new URL('http://localhost/api/location-info?name=London')
		const result = await GET({ url } as any)

		expect(result.status).toBe(200)
		const data = await result.json()
		expect(data).toEqual(mockWeather)
		expect(weatherApiClient.getWeather).toHaveBeenCalledWith('London', false)
	})
})
