<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import LocationsList from '$lib/components/LocationsList.svelte'
	import { fn } from 'storybook/test'

	const { Story } = defineMeta({
		title: 'Components/LocationsList',
		component: LocationsList,
		tags: ['autodocs'],
		args: {
			onremove: fn(),
			onreorder: fn(),
		},
	})
</script>

<Story
	name="With Locations"
	args={{
		locations: [
			{
				id: 1,
				name: 'Berlin',
				country: 'Germany',
				admin1: 'Land Berlin',
				latitude: 52.52437,
				longitude: 13.41053,
				timezone: 'Europe/Berlin',
			},
			{
				id: 2,
				name: 'London',
				country: 'United Kingdom',
				admin1: 'Greater London',
				latitude: 51.50853,
				longitude: -0.12574,
				timezone: 'Europe/London',
			},
			{
				id: 3,
				name: 'Tokyo',
				country: 'Japan',
				admin1: 'Tokyo',
				latitude: 35.6895,
				longitude: 139.69171,
				timezone: 'Asia/Tokyo',
			},
		],
	}}
/>

<Story
	name="Empty"
	args={{
		locations: [],
	}}
/>
