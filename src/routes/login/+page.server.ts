import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession()

	if (session) {
		throw redirect(303, '/')
	}

	return {}
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		if (!email || !password) {
			return fail(400, {
				error: 'Please enter both email and password',
				email,
			})
		}

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})

			if (error) {
				return fail(400, {
					error: error.message,
					email,
				})
			}
		} catch (error) {
			console.error('Database query error in login action:', error)
			return fail(500, {
				error: 'An unexpected error occurred during login',
				email,
			})
		}

		throw redirect(303, '/')
	},
}
