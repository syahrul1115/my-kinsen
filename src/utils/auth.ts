import { betterAuth } from 'better-auth'
import { admin, openAPI } from "better-auth/plugins"
import { nextCookies } from 'better-auth/next-js'

// utils
import { db } from '@/utils/database'

export const auth = betterAuth({
    database: {
        db: db,
        type: 'postgres' // "sqlite", "mysql", "postgres" or "mssql"
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "mahasiswa",
                input: false
            }
        }
    },
    session: {
        expiresIn: 60 * 60 * 24, // 1 day
    },
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        nextCookies(),
        openAPI(),
        admin({
            defaultRole: "mahasiswa",
            adminRole: ["admin", "superAdmin"]
        })
    ]
})
