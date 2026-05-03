export interface Weather {
	temp: Reading
	next?: Forecast[]
}

export interface Forecast {
	max: Reading
	min: Reading
	precipitation: number
}

export interface Reading {
	[Scale.C]: number
	[Scale.F]: number
}

export enum Scale {
	C = 'C',
	F = 'F',
}

export type DisplayMode = 'temperature' | 'precipitation'
