import { json, error } from '@sveltejs/kit'
import { searchLocations } from '$lib/utils/geocoding'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q')

	if (!query) {
		throw error(400, 'Missing query')
	}

	try {
		const results = await searchLocations(query)
		return json(results)
	} catch (e) {
		console.error('Search failed:', e)
		throw error(500, 'Failed to search locations')
	}
}
