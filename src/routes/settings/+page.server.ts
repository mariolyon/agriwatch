import { db } from '$lib/server/db'
import { users } from '../../../drizzle/schema'
import { eq } from 'drizzle-orm'
import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user
	if (!user) {
		throw redirect(303, '/login')
	}

	const record = await db.query.users.findFirst({
		where: eq(users.userId, user.id),
	})

	return {
		scale: record?.scale || 'C',
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = locals.user
		if (!user) return fail(401, { message: 'Unauthorized' })

		const data = await request.formData()
		const scale = data.get('scale')?.toString()

		if (!scale || (scale !== 'C' && scale !== 'F')) {
			return fail(400, { message: 'Invalid scale value' })
		}

		const record = await db.query.users.findFirst({
			where: eq(users.userId, user.id),
		})

		if (record) {
			await db.update(users).set({ scale }).where(eq(users.userId, user.id))
		} else {
			await db.insert(users).values({ userId: user.id, scale, data: [] })
		}

		return { success: true }
	},
}
