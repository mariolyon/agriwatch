import { json, error } from '@sveltejs/kit'
import { getWeather } from '$lib/server/weatherApiClient'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = locals.user
	if (!user) {
		throw error(401, 'Unauthorized')
	}

	const location = url.searchParams.get('location')
	const dtParam = url.searchParams.get('dt')

	if (!location) {
		throw error(400, 'Missing location')
	}

	const selectedTime = dtParam ? new Date(dtParam) : new Date()
	const finalSelectedTime = isNaN(selectedTime.getTime()) ? new Date() : selectedTime

	try {
		const weather = await getWeather(location, true, finalSelectedTime)
		return json(weather)
	} catch (e) {
		console.error('Failed to fetch weather:', e)
		throw error(500, 'Failed to fetch weather')
	}
}
