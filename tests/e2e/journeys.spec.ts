import { test, expect } from '@playwright/test'
import postgres from 'postgres'
import 'dotenv/config'

const getTestEmail = () => {
	let email = process.env.TEST_USER || 'test-new@example.com'
	if (!email.includes('@')) {
		email = `${email}@example.com`
	}
	return email
}

test.describe.serial('End to End Journey', () => {
	test.beforeAll(async () => {
		const databaseUrl = process.env.DATABASE_URL
		const testUserEmail = process.env.TEST_USER

		console.log('Starting beforeAll cleanup...')
		if (databaseUrl && testUserEmail) {
			try {
				const sql = postgres(databaseUrl, { connect_timeout: 5 })
				const users = await sql`SELECT id FROM auth.users WHERE email = ${testUserEmail}`
				if (users.length > 0) {
					const userId = users[0].id
					await sql`DELETE FROM public.users WHERE user_id = ${userId}`
					await sql`DELETE FROM auth.users WHERE id = ${userId}`
					console.log('Successfully deleted existing test user')
				} else {
					console.log('Test user does not exist, no cleanup needed')
				}
				await sql.end()
			} catch (error) {
				console.warn('Database cleanup failed:', error instanceof Error ? error.message : error)
			}
		}
	})

	test('redirects unauthenticated users to login', async ({ page }) => {
		await page.goto('/browser')
		await expect(page).toHaveURL(/.*\/login/)
	})

	test('allows user to register', async ({ page, context }) => {
		// Log console messages from browser
		page.on('console', (msg) => console.log('BROWSER CONSOLE:', msg.text()))
		page.on('pageerror', (err) => console.log('BROWSER ERROR:', err.message))

		await page.goto('/register')

		const email = getTestEmail()
		const password = process.env.TEST_PASSWORD || 'password123'

		console.log('Registering with:', email)
		await page.fill('input[name="email"]', email)
		await page.fill('input[name="password"]', password)
		await page.fill('input[name="passwordConfirm"]', password)

		console.log('Attempting form submission...')

		// Wait for a bit to ensure Svelte has hydrated
		await page.waitForTimeout(1000)

		// Click the button
		await page.click('button[type="submit"]')

		try {
			await page.waitForURL((url) => url.pathname !== '/register', { timeout: 15000 })
			console.log('Registration redirected to:', page.url())
		} catch (error) {
			console.log('Registration failed to redirect. Current URL:', page.url())

			// Try a manual submit if the click failed
			console.log('Trying manual form submission via JS...')
			await page.evaluate(() => {
				const form = document.querySelector('form')
				if (form) form.requestSubmit() // requestSubmit() triggers validation and 'submit' event
			})

			try {
				await page.waitForURL((url) => url.pathname !== '/register', { timeout: 10000 })
				console.log('Registration (manual) redirected to:', page.url())
			} catch (err) {
				const errorText = await page
					.locator('.text-red-700')
					.innerText()
					.catch(() => null)
				if (errorText) console.log('Error visible on page:', errorText)

				const html = await page.content()
				console.log('Page HTML (first 500 chars):', html.substring(0, 500))

				await page.screenshot({ path: 'test-results/registration-failure.png' })
				throw err
			}
		}
	})

	test('allows user to login', async ({ page }) => {
		await page.goto('/login')
		const email = getTestEmail()
		const password = process.env.TEST_PASSWORD || 'password123'

		console.log('Logging in with:', email)
		await page.fill('input[name="email"]', email)
		await page.fill('input[name="password"]', password)
		await page.click('button[type="submit"]')

		await expect(page).toHaveURL('/', { timeout: 15000 })
		await expect(page.locator('header')).toContainText('Sign out')
		console.log('Login successful')
	})

	test('can search and add a location', async ({ page }) => {
		await page.goto('/')
		if (page.url().includes('/login')) {
			await page.fill('input[name="email"]', getTestEmail())
			await page.fill('input[name="password"]', process.env.TEST_PASSWORD || 'password123')
			await page.click('button[type="submit"]')
			await expect(page).toHaveURL('/')
		}

		await page.goto('/browser')
		await page.fill('input[placeholder="Search for a location..."]', 'London')

		const firstResult = page.locator('button:has-text("London, England, United Kingdom")').first()
		await expect(firstResult).toBeVisible({ timeout: 10000 })
		await firstResult.click()

		await expect(page).toHaveURL('/', { timeout: 10000 })
		await expect(page.locator('.app-layout')).toContainText('London')
		console.log('Search and add location successful')
	})
})
