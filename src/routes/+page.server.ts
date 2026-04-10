import { db } from '$lib/server/db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import type { SavedLocation } from '$lib/types/location';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return { locations: [] };
	}

	const record = await db.query.users.findFirst({
		where: eq(users.userId, user.id)
	});

	return {
		locations: (record?.data as SavedLocation[]) || []
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return fail(401, { message: 'Unauthorized' });

		const data = await request.formData();
		const locationsStr = data.get('locations')?.toString();
		if (!locationsStr) return fail(400, { message: 'Missing locations data' });

		const locations = JSON.parse(locationsStr);

		await db
			.update(users)
			.set({ data: locations })
			.where(eq(users.userId, user.id));

		return { success: true };
	},
	remove: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return fail(401, { message: 'Unauthorized' });

		const data = await request.formData();
		const locationIdStr = data.get('id')?.toString();
		if (!locationIdStr) return fail(400, { message: 'Missing location id' });

		const locationId = parseInt(locationIdStr, 10);

		const record = await db.query.users.findFirst({
			where: eq(users.userId, user.id)
		});

		if (record) {
			const currentLocations = (record.data as SavedLocation[]) || [];
			const newLocations = currentLocations.filter((loc) => loc.id !== locationId);
			await db
				.update(users)
				.set({ data: newLocations })
				.where(eq(users.userId, user.id));
		}

		return { success: true };
	},
	reorder: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return fail(401, { message: 'Unauthorized' });

		const data = await request.formData();
		const orderDataStr = data.get('order')?.toString();
		if (!orderDataStr) return fail(400, { message: 'Missing order data' });

		const orderData: { id: number; order: number }[] = JSON.parse(orderDataStr);

		const record = await db.query.users.findFirst({
			where: eq(users.userId, user.id)
		});

		if (record) {
			const currentLocations = (record.data as SavedLocation[]) || [];
			
			const newLocations = [...currentLocations].sort((a, b) => {
				const orderA = orderData.find((o) => o.id === a.id)?.order ?? 999;
				const orderB = orderData.find((o) => o.id === b.id)?.order ?? 999;
				return orderA - orderB;
			});

			await db
				.update(users)
				.set({ data: newLocations })
				.where(eq(users.userId, user.id));
		}

		return { success: true };
	}
};
