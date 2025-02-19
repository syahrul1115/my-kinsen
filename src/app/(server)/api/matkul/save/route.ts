import {v4 as uuidv4} from "uuid"

import { create } from "../repository"
import { NewMatkul } from "@/types/api"
import { auth } from "@/utils/auth"

import { headers } from "next/headers"
import { type NextRequest } from "next/server"
import { findById } from "../../dosen/repository"

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

    const newMatkul: NewMatkul = {
        id: uuidv4().split('-').join(''),
        name: requestBodyJSON.name,
        semester: requestBodyJSON.semester,
        studyProgram: requestBodyJSON.studyProgram,
        dosenId: dosenExist.id,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const saveMatkul = await create(newMatkul)

    return Response.json({ data: saveMatkul.id, status: 201 },
        {
            status: 201,
            statusText: 'success'
        }
    )
}
