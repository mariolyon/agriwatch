import { ilike } from 'drizzle-orm'
import { db } from './db'
import { locations as locationsTable } from '../../../drizzle/schema'
import { searchLocations } from '$lib/utils/geocoding'

export async function searchLocationsServer(locationName: string) {
	// First check the database for a matching location
	const dbLocations = await db
		.select()
		.from(locationsTable)
		.where(ilike(locationsTable.name, locationName))
		.limit(1)

	if (dbLocations.length > 0) {
		return dbLocations
	}

	// If not found in DB, search via external API
	const apiLocations = await searchLocations(locationName)
	if (apiLocations.length === 0) {
		return []
	}

	// Insert the best match into our DB for future queries
	const location = apiLocations[0]
	try {
		await db
			.insert(locationsTable)
			.values({
				id: location.id,
				name: location.name,
				latitude: location.latitude,
				longitude: location.longitude,
				country: location.country || '',
				admin1: location.admin1 || '',
				timezone: location.timezone || 'auto',
			})
			.onConflictDoNothing()
	} catch (dbError) {
		console.error('Error saving location coordinates to DB:', dbError)
	}

	return [location]
}
