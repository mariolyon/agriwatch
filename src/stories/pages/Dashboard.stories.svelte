<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dashboard from '../../routes/+page.svelte';

	const { Story } = defineMeta({
		title: 'Pages/Dashboard',
		component: Dashboard,
		tags: ['autodocs']
	});
</script>

<Story name="Default" />
