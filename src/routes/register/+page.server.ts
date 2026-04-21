import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { users } from '../../../drizzle/schema'
import { searchLocations } from '$lib/utils/geocoding'
import type { SavedLocation } from '$lib/types/location'

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession()

	if (session) {
		throw redirect(303, '/')
	}

	return {}
}

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const passwordConfirm = formData.get('passwordConfirm') as string

		if (!email || !password || !passwordConfirm) {
			return fail(400, {
				error: 'Please fill out all fields',
				email,
			})
		}

		if (password !== passwordConfirm) {
			return fail(400, {
				error: 'Passwords do not match',
				email,
			})
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: url.origin
			}
		})

		if (error) {
			return fail(400, {
				error: error.message,
				email,
			})
		}

		if (data.user) {
			const initialLocations: SavedLocation[] = []
			const timezone = formData.get('timezone') as string
			if (timezone) {
				const city = timezone.split('/').pop()?.replace(/_/g, ' ')
				if (city) {
					try {
						const results = await searchLocations(city)
						if (results && results.length > 0) {
							const loc = results[0]
							initialLocations.push({
								id: loc.id,
								name: loc.name,
								latitude: loc.latitude,
								longitude: loc.longitude,
								country: loc.country,
								admin1: loc.admin1,
								timezone: loc.timezone,
							})
						}
					} catch (e) {
						console.error('Failed to fetch initial location', e)
					}
				}
			}

			await db.insert(users).values({
				userId: data.user.id,
				scale: 'C',
				data: initialLocations,
			})
		}

		throw redirect(303, '/')
	},
}
