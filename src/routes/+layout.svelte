<script lang="ts">
	import '$lib/styles/app.css'
	import favicon from '$lib/assets/favicon.svg'

	let { data, children } = $props()
	let { session } = $derived(data)
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="app-layout flex min-h-screen flex-col bg-gray-50">
	<header class="app-layout__banner flex items-center justify-between gap-2 px-6 py-4">
		<a href="/" class="app-layout__logo text-xl font-bold">AgriWatch</a>
		{#if session}
			<form action="/logout" method="POST">
				<button type="submit" class="text-sm font-medium text-gray-600 hover:text-gray-900"
					>Sign out</button
				>
			</form>
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
