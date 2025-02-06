import { auth } from "@/utils/auth"
import { findByUserId } from "../repository"

import { headers } from "next/headers"

export async function GET() {
    // CHECK SESSION USER LOGIN
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return Response.json({ data: "Unauthenticated!", status: 401 },
            {
                status: 401,
                statusText: 'unauthenticated'
            }
        )
    }
    
    // TO DO . . .
    const profileDosen = await findByUserId(session.session.userId)
    if (!profileDosen) {
        return Response.json({ data: "Unauthenticated!", status: 401 },
            {
                status: 401,
                statusText: 'unauthenticated'
            }
        )
    }

    const responseAPI = {
        data: {
            user: session.user,
            profile: profileDosen
        },
        status: 200,
    }

    return Response.json(responseAPI,
        {
            status: 200,
            statusText: 'success'
        }
    )
}
