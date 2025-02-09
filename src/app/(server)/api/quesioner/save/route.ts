import {v4 as uuidv4} from "uuid"

import { create } from "../repository"
import { NewQuesioner } from "@/types/api"
import { auth } from "@/utils/auth"

import { headers } from "next/headers"
import { type NextRequest } from "next/server"

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

    if (!requestBodyJSON.fromName) {
        return Response.json({ data: "Mahasiswa Name is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.fromNim) {
        return Response.json({ data: "Mahasiswa Nim is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.toName) {
        return Response.json({ data: "Dosen Name is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.toNbm) {
        return Response.json({ data: "Dosen NBM is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.purposeValue) {
        return Response.json({ data: "Purpose Value is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.processValue) {
        return Response.json({ data: "Process Value is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.evaluationValue) {
        return Response.json({ data: "Evaluation Value is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }
    if (!requestBodyJSON.rangking) {
        return Response.json({ data: "Rangking is not empty!", status: 400 },
            {
                status: 400,
                statusText: 'bad_request'
            }
        )
    }

    const newQuesioner: NewQuesioner = {
        id: uuidv4().split('-').join(''),
        fromName: requestBodyJSON.fromName,
        fromNim: requestBodyJSON.fromNim,
        toName: requestBodyJSON.toName,
        toNbm: requestBodyJSON.toNbm,
        purposeValue: requestBodyJSON.purposeValue,
        processValue: requestBodyJSON.processValue,
        evaluationValue: requestBodyJSON.evaluationValue,
        descriptionLiked: requestBodyJSON.descriptionLiked,
        descriptionSuggestion: requestBodyJSON.descriptionSuggestion,
        rangking: requestBodyJSON.rangking,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const saveQuesioner = await create(newQuesioner)

    return Response.json({ data: saveQuesioner.id, status: 201 },
        {
            status: 201,
            statusText: 'success'
        }
    )
}
