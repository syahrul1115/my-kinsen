import { headers } from "next/headers";

// utils
import { auth } from "@/utils/auth";
import { findTotalCountMahasiswa, findTotalCountDosen, findRecentNewUsersMahasiswa, findPerformanceDosen } from "../repository";

// repositories

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

    let responseAPI = null

    if (session.user.role === "admin") {
        const totalCountMahasiswaExists = await findTotalCountMahasiswa()
        const totalCountDosenExists = await findTotalCountDosen()
        const recentNewUserExists = await findRecentNewUsersMahasiswa()
        
        responseAPI = {
            data: {
                totalCount: {
                    mahasiswa: totalCountMahasiswaExists,
                    dosen: totalCountDosenExists
                },
                recent: {
                    newUsers: recentNewUserExists
                },
                performance: {
                    dosen: {
                        purpose: 0,
                        process: 0,
                        evaluation: 0
                    }
                }
            },
            status: 200
        }
    }
    
    if (session.user.role === "dosen") {
        const totalPerformanceExists = await findPerformanceDosen()

        responseAPI = {
            data: {
                totalCount: {
                    mahasiswa: null,
                    dosen: null
                },
                recent: {
                    newUsers: []
                },
                performance: {
                    dosen: totalPerformanceExists
                }
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