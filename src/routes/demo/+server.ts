import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { error } = await supabase.auth.signInAnonymously({
		options: {
			data: {
				is_demo: true,
			},
		},
	})

	if (error) {
		console.error('Demo login failed:', error.message)
		throw redirect(303, '/login?error=Demo login failed')
	}

	throw redirect(303, '/')
}
