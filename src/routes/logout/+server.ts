import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession()
	if (session) {
		try {
			await supabase.auth.signOut()
		} catch (error) {
			console.error('Database query error in logout action:', error)
		}
	}

	throw redirect(303, '/login')
}
