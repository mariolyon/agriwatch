export interface Weather {
	temp: Reading
	next?: Forecast[]
	weatherCode?: number
}

export interface Forecast {
	max: Reading
	min: Reading
	precipitation?: number
	windSpeed?: number
	uvIndex?: number
	weatherCode?: number
}

export interface Reading {
	[Scale.C]: number
	[Scale.F]: number
}

export enum Scale {
	C = 'C',
	F = 'F',
}

export interface DisplayOptions {
	temperature: boolean
	precipitation: boolean
	wind: boolean
	uvIndex: boolean
}
