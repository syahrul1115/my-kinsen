import { betterAuth } from "better-auth"
import { admin, openAPI } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"

// utils
import { db } from "@/utils/database"
import { sendMail } from "@/utils/send-mail"
import { ROLE_STUDENT_TEXT } from "./constants"

export const auth = betterAuth({
    database: {
        db: db,
        type: "postgres" // "sqlite", "mysql", "postgres" or "mssql"
    },
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, url}) => {
                await sendMail({
                    to: user.email, // verification email must be sent to the current user email to approve the change
                    subject: 'Approve email change',
                    text: `Click the link to approve the change: ${url}`
                })
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
            defaultRole: ROLE_STUDENT_TEXT
        })
    ]
})
