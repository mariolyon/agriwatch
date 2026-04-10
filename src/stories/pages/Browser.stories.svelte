<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import Browser from '../../routes/browser/+page.svelte'

	const { Story } = defineMeta({
		title: 'Pages/Browser',
		component: Browser,
		tags: ['autodocs'],
	})
</script>

<Story name="Default" />
