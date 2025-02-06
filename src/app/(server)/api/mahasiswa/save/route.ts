import { v4 as uuidv4 } from "uuid"

import { NewMahasiswa } from "@/types/api"
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

    if (!requestBodyJSON.nim) {
        return Response.json({ data: "Mahasiswa Nim is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'unauthenticated'
            }
        )
    }
    if (!requestBodyJSON.studyProgram) {
        return Response.json({ data: "Study Program is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'unauthenticated'
            }
        )
    }
    if (!requestBodyJSON.semester) {
        return Response.json({ data: "Semester is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'unauthenticated'
            }
        )
    }

    const newMahasiswa: NewMahasiswa = {
        id: uuidv4().split('-').join(''),
        nim: requestBodyJSON.nim,
        studyProgram: requestBodyJSON.studyProgram,
        semester: requestBodyJSON.semester,
        userId: session.session.userId,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const saveMahasiswa = await create(newMahasiswa)

    return Response.json({ data: saveMahasiswa.id, status: 201 },
        {
            status: 201,
            statusText: 'success'
        }
    )
}
