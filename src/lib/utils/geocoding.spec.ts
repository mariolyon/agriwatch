import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchLocations, formatLocationLabel } from './geocoding'

describe('geocoding utils', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	describe('searchLocations', () => {
		it('returns empty array if query length is less than 2', async () => {
			const result = await searchLocations('a')
			expect(result).toEqual([])
		})

		it('fetches locations from geocoding API', async () => {
			const mockResults = [{ id: 1, name: 'London', country: 'United Kingdom', admin1: 'England' }]

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ results: mockResults }),
			} as Response)

			const result = await searchLocations('London')
			expect(global.fetch).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockResults)
		})

		it('throws an error if the response is not ok', async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			} as Response)

			await expect(searchLocations('London')).rejects.toThrow('Geocoding request failed: 500')
		})
	})

	describe('formatLocationLabel', () => {
		it('formats location label with name, admin1, and country', () => {
			const location = {
				id: 1,
				name: 'San Francisco',
				admin1: 'California',
				country: 'United States',
			} as any

			expect(formatLocationLabel(location)).toBe('San Francisco, California, United States')
		})

		it('formats location label with only name and country', () => {
			const location = {
				id: 1,
				name: 'London',
				country: 'United Kingdom',
			} as any

			expect(formatLocationLabel(location)).toBe('London, United Kingdom')
		})

		it('formats location label with only name', () => {
			const location = {
				id: 1,
				name: 'Unknown Place',
			} as any

			expect(formatLocationLabel(location)).toBe('Unknown Place')
		})
	})
})
