<script lang="ts">
	import type { PageData, ActionData } from './$types'
	import { enhance } from '$app/forms'

	let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<main class="settings mx-auto flex w-full max-w-2xl flex-1 flex-col p-6">
	<header class="mb-8 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Settings</h1>
		<a href="/" class="text-sm font-medium text-green-600 hover:text-green-700">Back to Dashboard</a
		>
	</header>

	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<form method="POST" use:enhance class="space-y-6">
			{#if form?.message}
				<div class="rounded-md bg-red-50 p-4 text-sm text-red-700">
					{form.message}
				</div>
			{/if}

			<div>
				<div class="mb-3 block text-sm font-medium text-gray-900">Temperature Scale</div>
				<div class="flex items-center space-x-6">
					<label class="flex cursor-pointer items-center space-x-2">
						<input
							type="radio"
							name="scale"
							value="C"
							checked={data.scale === 'C'}
							class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
						/>
						<span class="text-gray-700">C</span>
					</label>
					<label class="flex cursor-pointer items-center space-x-2">
						<input
							type="radio"
							name="scale"
							value="F"
							checked={data.scale === 'F'}
							class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
						/>
						<span class="text-gray-700">F</span>
					</label>
				</div>
			</div>

			<div class="pt-4">
				<button
					type="submit"
					class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:outline-none"
				>
					Save
				</button>
			</div>
		</form>
	</div>
</main>
