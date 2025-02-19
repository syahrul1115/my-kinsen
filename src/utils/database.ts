import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { Database } from '@/types/api'      // this is the Database interface we defined earlier

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: process.env.DATABASE_URL
    })
})

export const db = new Kysely<Database>({    // Database interface is passed to Kysely's constructor, and from now on, Kysely knows your database structure.
    dialect                                 // Dialect is passed to Kysely's constructor, 
})                                          // and from now on, Kysely knows how to communicate with your database.
