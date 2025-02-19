import { v4 as uuidv4 } from "uuid"

import { NewDosen } from "@/types/api"
import { auth } from "@/utils/auth"
import { create } from "../repository"

import { headers } from "next/headers"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
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

    const requestBodyJSON = await request.json()

    if (!requestBodyJSON.name) {
        return Response.json({ data: "Dosen Name is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.nbm) {
        return Response.json({ data: "Dosen NBM is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.userId) {
        return Response.json({ data: "Account is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }

    const newDosen: NewDosen = {
        id: uuidv4().split('-').join(''),
        name: requestBodyJSON.name,
        nbm: requestBodyJSON.nbm,
        userId: requestBodyJSON.userId,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const saveDosen = await create(newDosen)

    return Response.json({ data: saveDosen.id, status: 201 },
        {
            status: 201,
            statusText: 'success'
        }
    )
}
