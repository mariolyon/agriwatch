import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handle } from './hooks.server'

import { createServerClient } from '@supabase/ssr'

vi.mock('@supabase/ssr', () => ({
	createServerClient: vi.fn(),
}))

vi.mock('@sveltejs/kit', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@sveltejs/kit')>()
	return {
		...actual,
		redirect: vi.fn((status, location) => {
			throw { status, location }
		}),
	}
})

describe('hooks.server', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('redirects unauthenticated users from protected routes', async () => {
		vi.mocked(createServerClient).mockReturnValue({
			auth: {
				getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
				getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
			},
		} as any)

		const event = {
			url: new URL('http://localhost/browser'),
			locals: {},
			cookies: {
				getAll: vi.fn().mockReturnValue([]),
				set: vi.fn(),
			},
		} as unknown as Parameters<typeof handle>[0]['event']

		const resolve = vi.fn()

		try {
			await handle({ event, resolve })
		} catch (error) {
			const err = error as { status: number; location: string }
			expect(err.status).toBe(303)
			expect(err.location).toBe('/login')
		}
	})

	it('allows authenticated users to access protected routes', async () => {
		vi.mocked(createServerClient).mockReturnValue({
			auth: {
				getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: '123' } } } }),
				getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }),
			},
		} as any)

		const event = {
			url: new URL('http://localhost/browser'),
			locals: {},
			cookies: {
				getAll: vi.fn().mockReturnValue([]),
				set: vi.fn(),
			},
		} as unknown as Parameters<typeof handle>[0]['event']

		const resolve = vi.fn().mockResolvedValue(new Response())

		await handle({ event, resolve })

		expect(resolve).toHaveBeenCalled()
		expect(event.locals.session).toBeDefined()
		expect(event.locals.user).toBeDefined()
	})
})
