import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import LocationSearch from './LocationSearch.svelte'
import * as geocoding from '$lib/utils/geocoding'

vi.mock('$lib/utils/geocoding', () => ({
	searchLocations: vi.fn(),
	formatLocationLabel: vi.fn((loc) => loc.name),
}))

describe('LocationSearch component', () => {
	it('renders input field correctly', async () => {
		const { getByPlaceholder } = render(LocationSearch, { onselect: vi.fn() })

		await expect.element(getByPlaceholder('Search for a location...')).toBeVisible()
	})

	it('shows loading spinner when typing and then displays results', async () => {
		const mockResults = [{ id: 1, name: 'London', country: 'United Kingdom', country_code: 'GB' }]

		vi.spyOn(geocoding, 'searchLocations').mockResolvedValue(mockResults)

		const { getByPlaceholder, getByText, getByRole } = render(LocationSearch, { onselect: vi.fn() })

		const input = getByPlaceholder('Search for a location...')
		await userEvent.fill(input, 'Lon')

		// Should show loading spinner
		await expect.element(getByRole('status')).toBeVisible()

		// Wait for debounce and results
		await expect.element(getByText('London')).toBeVisible()
		await expect.element(getByRole('status')).not.toBeInTheDocument()
	})

	it('calls onselect when a location is clicked', async () => {
		const mockResults = [{ id: 1, name: 'London', country: 'United Kingdom', country_code: 'GB' }]

		vi.spyOn(geocoding, 'searchLocations').mockResolvedValue(mockResults)

		const onselect = vi.fn()
		const { getByPlaceholder, getByText } = render(LocationSearch, { onselect })

		const input = getByPlaceholder('Search for a location...')
		await userEvent.fill(input, 'Lon')

		const option = getByText('London')
		await expect.element(option).toBeVisible()
		await userEvent.click(option)

		expect(onselect).toHaveBeenCalledWith(mockResults[0])
		await expect.element(getByText('London')).not.toBeInTheDocument() // Dropdown closes
	})

	it('shows "No results found" when API returns empty array', async () => {
		vi.spyOn(geocoding, 'searchLocations').mockResolvedValue([])

		const { getByPlaceholder, getByText } = render(LocationSearch, { onselect: vi.fn() })

		const input = getByPlaceholder('Search for a location...')
		await userEvent.fill(input, 'UnknownPlace')

		await expect.element(getByText('No results found')).toBeVisible()
	})
})
