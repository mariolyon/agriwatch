import { pgTable, serial, jsonb, uuid, text, integer, doublePrecision } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	data: jsonb('data').notNull().default('[]'),
	scale: text('scale').default('C'),
})

export const userLocations = users

export const locations = pgTable('locations', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	latitude: doublePrecision('latitude').notNull(),
	longitude: doublePrecision('longitude').notNull(),
	country: text('country').notNull(),
	admin1: text('admin1'),
	timezone: text('timezone').notNull(),
})
