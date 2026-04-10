import { pgTable, serial, jsonb, uuid, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	data: jsonb('data').notNull().default('[]'),
	scale: text('scale').default('C'),
})

export const userLocations = users
