<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Location from '../../routes/location/+page.svelte';

	const { Story } = defineMeta({
		title: 'Pages/Location Search',
		component: Location,
		tags: ['autodocs']
	});
</script>

<Story name="Default" />
