import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server"
import { findByUserId, deleteById } from "../repository";

interface Params {
    params: Promise<{ id: string; }>
}

export async function DELETE(_: NextRequest, { params }: Params) {
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

    const id: string = (await params).id
    
    const profileExist = await findByUserId(id)
    if (!profileExist) {
        return Response.json({ data: "Profile ID is not found!", status: 404 },
            {
                status: 404,
                statusText: 'unauthenticated'
            }
        )
    }

    await deleteById(profileExist.id)

    return Response.json({ data: profileExist.id, status: 200 },
        {
            status: 200,
            statusText: 'success'
        }
    )
}