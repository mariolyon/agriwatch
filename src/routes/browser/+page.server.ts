import { db } from '$lib/server/db';
import { userLocations } from '../../../drizzle/schema';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { SavedLocation } from '$lib/types/location';

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return fail(401, { message: 'Unauthorized' });

		const data = await request.formData();
		const locationStr = data.get('location')?.toString();
		if (!locationStr) return fail(400, { message: 'Missing location data' });

		const location = JSON.parse(locationStr) as SavedLocation;

		const record = await db.query.userLocations.findFirst({
			where: eq(userLocations.userId, user.id)
		});

		if (record) {
			const currentLocations = (record.data as SavedLocation[]) || [];
			if (!currentLocations.some((loc) => loc.id === location.id)) {
				currentLocations.push(location);
				await db
					.update(userLocations)
					.set({ data: currentLocations })
					.where(eq(userLocations.userId, user.id));
			}
		} else {
			await db.insert(userLocations).values({
				userId: user.id,
				data: [location]
			});
		}

		throw redirect(303, '/');
	}
};
