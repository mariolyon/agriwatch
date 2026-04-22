import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '$env/dynamic/private'
import * as schema from '../../../drizzle/schema'
import { appendFileSync } from 'fs'

appendFileSync('server-debug.log', `Initializing DB with URL: ${env.DATABASE_URL ? 'PRESENT' : 'MISSING'}\n`)

const client = postgres(env.DATABASE_URL)
export const db = drizzle(client, { schema })
