import { pgTable, serial, jsonb, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	data: jsonb('data').notNull().default('[]'),
})

export const userLocations = users
