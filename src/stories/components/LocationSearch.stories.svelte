<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import LocationSearch from '$lib/components/LocationSearch.svelte'
	import { fn } from 'storybook/test'

	const { Story } = defineMeta({
		title: 'Components/LocationSearch',
		component: LocationSearch,
		tags: ['autodocs'],
		args: {
			onselect: fn(),
		},
	})
</script>

<Story name="Default" />
