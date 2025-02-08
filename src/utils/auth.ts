import { betterAuth } from "better-auth"
import { admin, openAPI } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"

// utils
import { db } from "@/utils/database"
import { sendMail } from "@/utils/send-mail"

export const auth = betterAuth({
    database: {
        db: db,
        type: "postgres" // "sqlite", "mysql", "postgres" or "mssql"
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
        enabled: true,
        sendResetPassword: async ({ user, token }) => {
            await sendMail({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${process.env.BETTER_AUTH_URL}/reset-password?token=${token}`,
            });
        },
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
