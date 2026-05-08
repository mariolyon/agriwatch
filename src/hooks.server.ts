import { createServerClient } from '@supabase/ssr'
import { type Handle, json, redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		env.PUBLIC_SUPABASE_URL,
		env.PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet: any[]) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' })
					})
				},
			},
		}
	)

	event.locals.safeGetSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession()
		if (!session) {
			return { session: null, user: null }
		}

		const {
			data: { user },
			error,
		} = await event.locals.supabase.auth.getUser()
		if (error) {
			return { session: null, user: null }
		}

		return { session, user }
	}

	const { session, user } = await event.locals.safeGetSession()
	event.locals.session = session
	event.locals.user = user
	event.locals.isDemo =
		user?.user_metadata?.scope === 'demo' ||
		user?.app_metadata?.scope === 'demo' ||
		user?.user_metadata?.is_demo === true ||
		user?.is_anonymous === true

	// Protect routes
	const isProtectedPage = event.url.pathname === '/' || event.url.pathname.startsWith('/browser')
	if (isProtectedPage && !session) {
		throw redirect(303, '/login')
	}

	if (event.url.pathname.startsWith('/api/') && !session) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version'
		},
	})
}
