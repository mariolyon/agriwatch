import { db } from '$lib/server/db'
import { users } from '../../../drizzle/schema'
import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { SavedLocation } from '$lib/types/location'

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const user = locals.user
		if (!user) return fail(401, { message: 'Unauthorized' })

		const data = await request.formData()
		const locationStr = data.get('location')?.toString()
		if (!locationStr) return fail(400, { message: 'Missing location data' })

		const location = JSON.parse(locationStr) as SavedLocation

		let record
		try {
			record = await db.query.users.findFirst({
				where: eq(users.userId, user.id),
			})
		} catch (error) {
			console.error('Database query error in browser add action:', error)
			return fail(500, { message: 'Failed to retrieve user data' })
		}

		if (record) {
			const currentLocations = (record.data as SavedLocation[]) || []
			if (!currentLocations.some((loc) => loc.id === location.id)) {
				const updatedLocations = [...currentLocations, location]
				try {
					await db.update(users).set({ data: updatedLocations }).where(eq(users.userId, user.id))
				} catch (error) {
					console.error('Database query error in browser add update:', error)
					return fail(500, { message: 'Failed to update locations' })
				}
			}
		}

		throw redirect(303, '/')
	},
}
