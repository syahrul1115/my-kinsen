import { findByMatkulId, update, deleteById } from "../repository"
import { auth } from "@/utils/auth"

import { headers } from "next/headers"
import { type NextRequest } from "next/server"
import { findById } from "../../dosen/repository"

interface Params {
    params: Promise<{ id: string; }>
}

export async function PATCH(request: NextRequest, { params }: Params) {
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

    const requestBodyJSON = await request.json()

    if (!requestBodyJSON.name) {
        return Response.json({ data: "Mata Kuliah Name is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.semester) {
        return Response.json({ data: "Semester is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.studyProgram) {
        return Response.json({ data: "Study Program is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.dosenId) {
        return Response.json({ data: "Teacher is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }

    const dosenExist = await findById(requestBodyJSON.dosenId)
    if (!dosenExist) {
        return Response.json({ data: "Teacher is not found!", status: 404 },
            {
                status: 404,
                statusText: 'unauthenticated'
            }
        )
    }

    const matkulExist = await findByMatkulId(id)
    if (!matkulExist) {
        return Response.json({ data: "Mata Kuliah ID is not found!", status: 404 },
            {
                status: 404,
                statusText: 'unauthenticated'
            }
        )
    }

    matkulExist.name = requestBodyJSON.name
    matkulExist.semester = requestBodyJSON.semester
    matkulExist.studyProgram = requestBodyJSON.studyProgram
    matkulExist.dosenId = dosenExist.id

    await update(matkulExist.id, matkulExist)

    return Response.json({ data: matkulExist.id, status: 200 },
        {
            status: 200,
            statusText: 'success'
        }
    )
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
    
    const matkulExist = await findByMatkulId(id)
    if (!matkulExist) {
        return Response.json({ data: "Mata Kuliah ID is not found!", status: 404 },
            {
                status: 404,
                statusText: 'unauthenticated'
            }
        )
    }

    await deleteById(matkulExist.id)

    return Response.json({ data: matkulExist.id, status: 200 },
        {
            status: 200,
            statusText: 'success'
        }
    )
}
