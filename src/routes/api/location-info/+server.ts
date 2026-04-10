import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getLocationInformation } from '$lib/server/locationInfo';

export const GET: RequestHandler = async ({ url }) => {
	const name = url.searchParams.get('name');
	
	if (!name) {
		return json({ info: '' }, { status: 400 });
	}

	const info = getLocationInformation(name);
	
	return json({ info });
};
