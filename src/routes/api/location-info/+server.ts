import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { getWeather } from '$lib/server/weatherApiClient'

export const GET: RequestHandler = async ({ url }) => {
	const name = url.searchParams.get('name')

	if (!name) {
		return json({ info: '' }, { status: 400 })
	}

	const info = await getWeather(name, false)
	return json(info)
}
