<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Location from '$lib/components/Location.svelte';

	const { Story } = defineMeta({
		title: 'Components/Location',
		component: Location,
		tags: ['autodocs']
	});
</script>

<Story
	name="Default"
	args={{
		location: {
			id: 1,
			name: 'Berlin',
			country: 'Germany',
			admin1: 'Land Berlin',
			latitude: 52.52437,
			longitude: 13.41053,
			timezone: 'Europe/Berlin'
		}
	}}
/>
