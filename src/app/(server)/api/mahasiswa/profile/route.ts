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
    const profileKemahasiswaan = await findByUserId(session.session.userId)
    if (!profileKemahasiswaan) {
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
            profile: profileKemahasiswaan
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
