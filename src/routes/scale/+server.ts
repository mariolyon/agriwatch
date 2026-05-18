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
		let record
		try {
			record = await db.query.users.findFirst({
				where: eq(users.userId, user.id),
			})
		} catch (error) {
			console.error('Database query error in scale findFirst:', error)
			return json({ type: 'error', message: 'Failed to retrieve user settings' }, { status: 500 })
		}

		try {
			if (record) {
				await db.update(users).set({ scale }).where(eq(users.userId, user.id))
			} else {
				await db.insert(users).values({ userId: user.id, scale, data: [] })
			}
		} catch (error) {
			console.error('Database query error in scale update/insert:', error)
			return json({ type: 'error', message: 'Failed to save user settings' }, { status: 500 })
		}
	}

	const accepts = request.headers.get('accept')
	if (accepts && accepts.includes('application/json')) {
		return json({ type: 'success' })
	}

	throw redirect(303, '/')
}
