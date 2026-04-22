import { db } from '$lib/server/db'
import { users } from '../../../drizzle/schema'
import { eq } from 'drizzle-orm'
import { redirect, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user
	if (!user) {
		throw redirect(303, '/login')
	}

	const data = await request.formData()
	const scale = data.get('scale')?.toString()

	if (scale === 'C' || scale === 'F') {
		const record = await db.query.users.findFirst({
			where: eq(users.userId, user.id),
		})

		if (record) {
			await db.update(users).set({ scale }).where(eq(users.userId, user.id))
		} else {
			await db.insert(users).values({ userId: user.id, scale, data: [] })
		}
	}

	const accepts = request.headers.get('accept')
	if (accepts && accepts.includes('application/json')) {
		return json({ type: 'success' })
	}

	throw redirect(303, '/')
}
