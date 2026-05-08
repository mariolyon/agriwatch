<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'
	import { onMount } from 'svelte'
	import { page } from '$app/state'

	let { form } = $props<{ form: ActionData }>()
	let timezone = $state('')
	let demoLocations = $state('')

	let message = $derived(page.url.searchParams.get('message'))
	let redirectTo = $derived(page.url.searchParams.get('redirectTo'))

	onMount(() => {
		timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
		demoLocations = localStorage.getItem('climview_demo_locations') || ''
	})
</script>

<div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 class="mt-10 text-center text-2xl leading-9 font-bold tracking-tight text-gray-900">
			Create your account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		{#if message}
			<div class="mb-6 rounded-md bg-blue-50 p-4 ring-1 ring-blue-200 ring-inset">
				<div class="text-sm text-blue-700">{message}</div>
			</div>
		{/if}

		<form class="space-y-6" method="POST" use:enhance>
			<input type="hidden" name="timezone" value={timezone} />
			<input type="hidden" name="demoLocations" value={demoLocations} />
			{#if redirectTo}
				<input type="hidden" name="redirectTo" value={redirectTo} />
			{/if}
			{#if form?.error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="text-sm text-red-700">{form.error}</div>
				</div>
			{/if}

			<div>
				<label for="email" class="block text-sm leading-6 font-medium text-gray-900"
					>Email address</label
				>
				<div class="mt-2">
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						value={form?.email ?? ''}
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 focus:ring-inset sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label for="password" class="block text-sm leading-6 font-medium text-gray-900"
					>Password</label
				>
				<div class="mt-2">
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="new-password"
						required
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 focus:ring-inset sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label for="passwordConfirm" class="block text-sm leading-6 font-medium text-gray-900"
					>Confirm Password</label
				>
				<div class="mt-2">
					<input
						id="passwordConfirm"
						name="passwordConfirm"
						type="password"
						autocomplete="new-password"
						required
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 focus:ring-inset sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm leading-6 font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
				>
					Register
				</button>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-500">
			Already have an account?
			<a href="/login" class="leading-6 font-semibold text-green-600 hover:text-green-500"
				>Sign in</a
			>
		</p>
	</div>
</div>
