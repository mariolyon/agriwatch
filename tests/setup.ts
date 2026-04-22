import { vi } from 'vitest'
import { config } from 'dotenv'

// Load environment variables for tests
config({ path: '.env' })

// Global mock for fetch if needed
global.fetch = vi.fn()

// Mock Supabase client
vi.mock('@supabase/ssr', () => {
	return {
		createServerClient: vi.fn(() => ({
			auth: {
				getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
				getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
				signInWithPassword: vi.fn(),
				signUp: vi.fn(),
				signOut: vi.fn(),
			},
		})),
	}
})
