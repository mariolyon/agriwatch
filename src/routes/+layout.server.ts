import type { LayoutServerLoad } from './$types'
import { db } from '$lib/server/db'
import { users } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession()

	let scale = 'C'
	if (user) {
		const record = await db.query.users.findFirst({
			where: eq(users.userId, user.id),
		})
		if (record?.scale) {
			scale = record.scale
		}
	}

	return {
		session,
		user,
		scale,
		cookies: cookies.getAll(),
	}
}
