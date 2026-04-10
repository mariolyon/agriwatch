export interface Weather {
	temp: Reading
	next?: Forecast[]
}

export interface Forecast {
	max: Reading,
	min: Reading
}


export interface Reading {
	C: number
	F: number
}
