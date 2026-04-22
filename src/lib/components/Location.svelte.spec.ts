import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Location from './Location.svelte'
import { Scale } from '$lib/types/weather'

describe('Location component', () => {
	it('renders location name correctly', async () => {
		const location = {
			id: 1,
			name: 'London',
			country: 'United Kingdom',
			admin1: 'England',
		}

		const { getByText } = render(Location, {
			location: {
				...location,
				country: 'UK',
				admin1: 'England',
				latitude: 0,
				longitude: 0,
				timezone: 'GMT',
			},
		})

		await expect.element(getByText('London')).toBeVisible()
	})

	it('renders weather information when provided', async () => {
		const location = {
			id: 1,
			name: 'London',
		}

		const weather = {
			temp: { C: 20, F: 68 },
			next: [{ min: { C: 15, F: 59 }, max: { C: 25, F: 77 } }],
		}

		const { getByText } = render(Location, {
			location: { ...location, country: 'UK', latitude: 0, longitude: 0, timezone: 'GMT' },
			weather,
			scale: Scale.C,
		})

		await expect.element(getByText('20 C')).toBeVisible()
		await expect.element(getByText('+1 day')).toBeVisible()
		await expect.element(getByText('15 - 25 C')).toBeVisible()
	})

	it('renders weather information in Fahrenheit when scale is F', async () => {
		const location = {
			id: 1,
			name: 'London',
		}

		const weather = {
			temp: { C: 20, F: 68 },
			next: [{ min: { C: 15, F: 59 }, max: { C: 25, F: 77 } }],
		}

		const { getByText } = render(Location, {
			location: { ...location, country: 'UK', latitude: 0, longitude: 0, timezone: 'GMT' },
			weather,
			scale: Scale.F,
		})

		await expect.element(getByText('68 F')).toBeVisible()
		await expect.element(getByText('59 - 77 F')).toBeVisible()
	})

	it('does not render weather table if weather is not provided', async () => {
		const location = {
			id: 1,
			name: 'London',
		}

		const { getByText } = render(Location, {
			location: {
				...location,
				country: 'UK',
				admin1: 'England',
				latitude: 0,
				longitude: 0,
				timezone: 'GMT',
			},
		})

		await expect.element(getByText('Now')).not.toBeInTheDocument()
	})
})
