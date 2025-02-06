import { find, findBySearch, findTotalCount } from "../repository"
import { auth } from "@/utils/auth"

import { headers } from "next/headers"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
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
    const searchParams: URLSearchParams = request.nextUrl.searchParams
    const search: string | null = searchParams.get('search')
    const page: number = Number(searchParams.get('page'))
    const pageSize: number = Number(searchParams.get('pageSize'))

    // CALCULATE THE OFFSET BASED ON PAGE NUMBER
    const offset = (page - 1) * pageSize

    // GET TOTAL COUNT FOR PAGINATION
    const totalCount = await findTotalCount()

    let responseAPI = {}

    if (search) {
        responseAPI = {
            data: {
                items: await findBySearch(search),
                currentPage: page,
                pageSize: pageSize,
                totalCount: Number(totalCount?.count || 0)
            },
            status: 200
        }
    } else {
        responseAPI = {
            data: {
                items: await find(pageSize, offset),
                currentPage: page,
                pageSize: pageSize,
                totalCount: Number(totalCount?.count || 0)
            },
            status: 200
        }
    }

    return Response.json(responseAPI,
        {
            status: 200,
            statusText: 'success'
        }
    )
}
