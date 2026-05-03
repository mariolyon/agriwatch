import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getWeather } from './weatherApiClient'
import { searchLocationsServer } from './geocoding'

vi.mock('./geocoding', () => ({
	searchLocationsServer: vi.fn(),
}))

describe('weatherApiClient', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		global.fetch = vi.fn()
	})

	it('fetches current weather successfully', async () => {
		vi.mocked(searchLocationsServer).mockResolvedValue([
			{
				id: 1,
				name: 'London',
				latitude: 51.5,
				longitude: -0.1,
				country: 'UK',
				country_code: 'UK',
				timezone: 'Europe/London',
				feature_code: '',
				country_id: 1,
			},
		])

		global.fetch = vi.fn().mockImplementation(async (url: string | URL | Request) => {
			if (url.toString().includes('api.open-meteo.com')) {
				return {
					ok: true,
					json: async () => ({
						current: {
							temperature_2m: 20.5,
						},
					}),
				} as Response
			}
			return { ok: false, status: 404 } as Response
		})

		const result = await getWeather('London', false)

		expect(searchLocationsServer).toHaveBeenCalledWith('London')
		expect(global.fetch).toHaveBeenCalledTimes(1)

		const fetchUrl = (global.fetch as any).mock.calls[0][0] as URL
		expect(fetchUrl.searchParams.get('latitude')).toBe('51.5')
		expect(fetchUrl.searchParams.get('longitude')).toBe('-0.1')
		expect(fetchUrl.searchParams.get('current')).toBe('temperature_2m')

		expect(result).toEqual({
			temp: { C: 21, F: 69 },
			next: [],
		})
	})

	it('fetches weather forecast successfully', async () => {
		vi.mocked(searchLocationsServer).mockResolvedValue([
			{
				id: 1,
				name: 'London',
				latitude: 51.5,
				longitude: -0.1,
				country: 'UK',
				country_code: 'UK',
				timezone: 'Europe/London',
				feature_code: '',
				country_id: 1,
			},
		])

		global.fetch = vi.fn().mockImplementation(async (url: string | URL | Request) => {
			if (url.toString().includes('api.open-meteo.com')) {
				return {
					ok: true,
					json: async () => ({
						current: {
							temperature_2m: 20.5,
						},
						daily: {
							time: ['2023-01-01'],
							temperature_2m_max: [25.1],
							temperature_2m_min: [15.4],
							precipitation_sum: [5.2],
						},
					}),
				} as Response
			}
			return { ok: false, status: 404 } as Response
		})

		const result = await getWeather('London', true)

		expect(searchLocationsServer).toHaveBeenCalledWith('London')
		expect(global.fetch).toHaveBeenCalledTimes(1)

		const fetchUrl = (global.fetch as any).mock.calls[0][0] as URL
		expect(fetchUrl.searchParams.get('daily')).toBe('temperature_2m_max,temperature_2m_min,precipitation_sum')

		expect(result).toEqual({
			temp: { C: 21, F: 69 },
			next: [{ max: { C: 25, F: 77 }, min: { C: 15, F: 60 }, precipitation: 5.2 }],
		})
	})

	it('returns default values if location not found', async () => {
		vi.mocked(searchLocationsServer).mockResolvedValue([])

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		const result = await getWeather('Unknown')

		expect(searchLocationsServer).toHaveBeenCalledWith('Unknown')
		expect(global.fetch).not.toHaveBeenCalled()
		expect(consoleSpy).toHaveBeenCalled()

		expect(result).toEqual({
			temp: { C: 0, F: 0 },
			next: [],
		})
	})

	it('returns default values on fetch error', async () => {
		vi.mocked(searchLocationsServer).mockResolvedValue([
			{
				id: 1,
				name: 'London',
				latitude: 51.5,
				longitude: -0.1,
				country: 'UK',
				country_code: 'UK',
				timezone: 'Europe/London',
				feature_code: '',
				country_id: 1,
			},
		])

		global.fetch = vi.fn().mockImplementation(async () => {
			return {
				ok: false,
				status: 500,
			} as Response
		})

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		const result = await getWeather('London')

		expect(consoleSpy).toHaveBeenCalled()
		expect(result).toEqual({
			temp: { C: 0, F: 0 },
			next: [],
		})
	})

	it('fetches weather for a specific date', async () => {
		vi.mocked(searchLocationsServer).mockResolvedValue([
			{
				id: 1,
				name: 'London',
				latitude: 51.5,
				longitude: -0.1,
				country: 'UK',
				country_code: 'UK',
				timezone: 'Europe/London',
				feature_code: '',
				country_id: 1,
			},
		])

		const specificDate = new Date('2026-05-20T14:30:00Z')

		global.fetch = vi.fn().mockImplementation(async (url: string | URL | Request) => {
			if (url.toString().includes('api.open-meteo.com')) {
				return {
					ok: true,
					json: async () => ({
						hourly: {
							time: ['2026-05-20T14:00', '2026-05-20T15:00'],
							temperature_2m: [22.0, 23.0],
						},
						daily: {
							time: ['2026-05-20'],
							temperature_2m_max: [25.0],
							temperature_2m_min: [15.0],
							precipitation_sum: [0],
						},
					}),
				} as Response
			}
			return { ok: false, status: 404 } as Response
		})

		const result = await getWeather('London', true, specificDate)

		const fetchUrl = (global.fetch as any).mock.calls[0][0] as URL
		expect(fetchUrl.searchParams.get('start_date')).toBe('2026-05-20')
		expect(fetchUrl.searchParams.get('hourly')).toBe('temperature_2m')

		expect(result.temp.C).toBe(22)
	})
})
