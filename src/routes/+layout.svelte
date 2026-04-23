<script lang="ts">
	import '$lib/styles/app.css'
	import favicon from '$lib/assets/favicon.svg'
	import { enhance } from '$app/forms'
	import { Scale } from '$lib/types/weather'
	import scaleState from '$lib/state/scaleState.svelte'

	import { page } from '$app/state'

	let { data, children } = $props()
	let { session } = $derived(data)

	scaleState.current = data.scale as Scale
	const titles: Record<string, string> = {
		'/': 'Dashboard',
		'/browser': 'Location Search',
	}
	let pageTitle = $derived(titles[page.url.pathname])
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="app-layout flex min-h-screen flex-col bg-gray-50">
	<header class="app-layout__banner flex items-center justify-between gap-2 px-6 py-4">
		<div class="flex items-center gap-2">
			<a href="/" class="app-layout__logo text-xl font-bold">AgriWatch</a>
			{#if pageTitle}
				<span class="text-xl text-gray-400">/</span>
				<span class="text-xl font-semibold text-gray-700">{pageTitle}</span>
			{/if}
		</div>
		{#if session}
			<div class="flex items-center gap-4">
				<div class="flex items-center text-sm font-medium text-gray-600">
					<form
						action="/scale"
						method="POST"
						class="inline"
						use:enhance={({ formData }) => {
							console.log(`Form submission started... ${scaleState.current}`)
							const previousScale = scaleState.current
							scaleState.current = formData.get('scale') as Scale

							return async ({ result, update }) => {
								if (result.type === 'error' || result.type === 'failure') {
									scaleState.current = previousScale
								}
								await update({ invalidateAll: false })
							}
						}}
					>
						<input type="hidden" name="scale" value={scaleState.current === 'C' ? 'F' : 'C'} />
						<button
							type="submit"
							class="hover:text-gray-900 {scaleState.current === 'C' ? 'font-bold' : ''}"
							disabled={scaleState.current === 'C'}>C</button
						>
						<span class="m-0">|</span>
						<button
							type="submit"
							class="hover:text-gray-900 {scaleState.current === 'F' ? 'font-bold' : ''}"
							disabled={scaleState.current === 'F'}>F</button
						>
					</form>
				</div>
				<form action="/logout" method="POST">
					<button type="submit" class="text-sm font-medium text-gray-600 hover:text-gray-900"
						>Sign out</button
					>
				</form>
			</div>
		{/if}
	</header>
	<div class="flex-1">
		{@render children()}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.app-layout__banner {
		@apply border-b border-gray-200 bg-white;
	}

	.app-layout__logo {
		@apply text-green-700 no-underline;
	}
</style>
