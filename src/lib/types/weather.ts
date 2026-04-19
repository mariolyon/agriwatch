export interface Weather {
	temp: Reading
	next?: Forecast[]
}

export interface Forecast {
	max: Reading
	min: Reading
}

export interface Reading {
	[Scale.C]: number
	[Scale.F]: number
}

export enum Scale {
	C = 'C',
	F = 'F'
}
