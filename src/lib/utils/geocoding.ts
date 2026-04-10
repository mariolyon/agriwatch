import type { GeocodingResponse, GeocodingResult } from '$lib/types/location';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const MIN_QUERY_LENGTH = 2;
const RESULT_COUNT = 5;

export async function searchLocations(
	query: string,
	signal?: AbortSignal
): Promise<GeocodingResult[]> {
	const trimmed = query.trim();
	if (trimmed.length < MIN_QUERY_LENGTH) return [];

	const url = new URL(GEOCODING_API);
	url.searchParams.set('name', trimmed);
	url.searchParams.set('count', String(RESULT_COUNT));
	url.searchParams.set('language', 'en');
	url.searchParams.set('format', 'json');

	const response = await fetch(url, { signal });

	if (!response.ok) {
		throw new Error(`Geocoding request failed: ${response.status}`);
	}

	const data: GeocodingResponse = await response.json();
	return data.results ?? [];
}

export function formatLocationLabel(location: GeocodingResult): string {
	const parts = [location.name];
	if (location.admin1) parts.push(location.admin1);
	if (location.country) parts.push(location.country);
	return parts.join(', ');
}
