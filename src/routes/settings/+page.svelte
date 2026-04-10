<script lang="ts">
	import type { PageData, ActionData } from './$types'
	import { enhance } from '$app/forms'

	let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<main class="settings flex flex-1 flex-col p-6 max-w-2xl mx-auto w-full">
	<header class="flex items-center justify-between mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Settings</h1>
		<a href="/" class="text-sm font-medium text-green-600 hover:text-green-700">Back to Dashboard</a>
	</header>

	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<form method="POST" use:enhance class="space-y-6">
			{#if form?.message}
				<div class="p-4 bg-red-50 text-red-700 rounded-md text-sm">
					{form.message}
				</div>
			{/if}

			<div>
				<div class="block text-sm font-medium text-gray-900 mb-3">Temperature Scale</div>
				<div class="flex items-center space-x-6">
					<label class="flex items-center space-x-2 cursor-pointer">
						<input
							type="radio"
							name="scale"
							value="C"
							checked={data.scale === 'C'}
							class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
						/>
						<span class="text-gray-700">C</span>
					</label>
					<label class="flex items-center space-x-2 cursor-pointer">
						<input
							type="radio"
							name="scale"
							value="F"
							checked={data.scale === 'F'}
							class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
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
