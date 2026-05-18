import { db } from '$lib/server/db'
import { users } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'
import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import type { SavedLocation } from '$lib/types/location'
import { getWeather } from '$lib/server/weatherApiClient'

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user
	const isDemo = locals.isDemo
	if (!user) {
		return {
			locations: [],
			weatherData: {},
			selectedTime: new Date().toISOString(),
			isDemo: false,
		}
	}

	if (isDemo) {
		return {
			locations: [],
			weatherData: {},
			scale: 'C',
			selectedTime: new Date().toISOString(),
			isDemo: true,
		}
	}

	const dtParam = url.searchParams.get('dt')
	const selectedTime = dtParam ? new Date(dtParam) : new Date()
	// Ensure valid date
	const finalSelectedTime = isNaN(selectedTime.getTime()) ? new Date() : selectedTime

	const record = user && (await getUser(user.id))

	const locations = (record?.data as SavedLocation[]) || []
	const scale = record?.scale || 'C'

	const weatherPromises = locations.map(async (loc) => {
		const weather = await getWeather(loc.name, true, finalSelectedTime)
		return { id: loc.id, weather }
	})

	const weatherResults = await Promise.all(weatherPromises)
	const weatherData = weatherResults.reduce(
		(acc, { id, weather }) => {
			acc[id] = weather
			return acc
		},
		{} as Record<number, any>
	)

	return {
		locations,
		weatherData,
		scale,
		selectedTime: finalSelectedTime.toISOString(),
		isDemo,
	}
}

async function getUser(id: string) {
	try {
		return await db.query.users.findFirst({
			where: eq(users.userId, id),
		})
	} catch (error) {
		console.error('Database query error in getUser:', error)
	}
}

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const user = locals.user
		if (!user) return fail(401, { message: 'Unauthorized' })

		const data = await request.formData()
		const locationsStr = data.get('locations')?.toString()
		if (!locationsStr) return fail(400, { message: 'Missing locations data' })

		const locations = JSON.parse(locationsStr)

		try {
			await db.update(users).set({ data: locations }).where(eq(users.userId, user.id))
		} catch (error) {
			console.error('Database query error in save action:', error)
			return fail(500, { message: 'Failed to save locations' })
		}

		return { success: true }
	},
	remove: async ({ request, locals }) => {
		const user = locals.user
		if (!user) return fail(401, { message: 'Unauthorized' })

		const data = await request.formData()
		const locationIdStr = data.get('id')?.toString()
		if (!locationIdStr) return fail(400, { message: 'Missing location id' })

		const locationId = parseInt(locationIdStr, 10)

		const record = user?.id && (await getUser(user.id))

		if (record) {
			const currentLocations = (record.data as SavedLocation[]) || []
			const newLocations = currentLocations.filter((loc) => loc.id !== locationId)
			try {
				await db.update(users).set({ data: newLocations }).where(eq(users.userId, user.id))
			} catch (error) {
				console.error('Database query error in remove action:', error)
				return fail(500, { message: 'Failed to remove location' })
			}
		}

		return { success: true }
	},
	reorder: async ({ request, locals }) => {
		const user = locals.user
		if (!user) return fail(401, { message: 'Unauthorized' })

		const data = await request.formData()
		const orderDataStr = data.get('order')?.toString()
		if (!orderDataStr) return fail(400, { message: 'Missing order data' })

		const orderData: { id: number; order: number }[] = JSON.parse(orderDataStr)

		const record = user?.id && (await getUser(user.id))

		if (record) {
			const currentLocations = (record.data as SavedLocation[]) || []

			const newLocations = [...currentLocations].sort((a, b) => {
				const orderA = orderData.find((o) => o.id === a.id)?.order ?? 999
				const orderB = orderData.find((o) => o.id === b.id)?.order ?? 999
				return orderA - orderB
			})

			try {
				await db.update(users).set({ data: newLocations }).where(eq(users.userId, user.id))
			} catch (error) {
				console.error('Database query error in reorder action:', error)
				return fail(500, { message: 'Failed to reorder locations' })
			}
		}

		return { success: true }
	},
}
