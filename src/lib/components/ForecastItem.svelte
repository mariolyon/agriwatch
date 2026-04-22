<script lang="ts">
	import Temperature from './Temperature.svelte'

	interface Props {
		date: string
		temp?: number
		minTemp?: number
		maxTemp?: number
	}

	let { date, temp, minTemp, maxTemp }: Props = $props()
</script>

<div
	class="flex min-w-[5ch] box-content flex-col items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 text-center shadow-sm"
>
	<div class="mb-1 text-sm font-medium text-gray-500">{date}</div>
	<div class="text-lg font-semibold text-gray-800">
		{#if temp !== undefined}
			<Temperature value={temp} />
		{:else if minTemp !== undefined && maxTemp !== undefined}
			<Temperature value={minTemp} /> - <Temperature value={maxTemp} />
		{/if}
	</div>
</div>
