import { headers } from "next/headers";

// utils
import { auth } from "@/utils/auth";
import { ROLE_ADMIN_TEXT, ROLE_TEACHER_TEXT } from "@/utils/constants";

import { findTotalCountMahasiswa, findTotalCountDosen, findRecentNewUsersMahasiswa, findPerformanceDosen, findRangkingDosenList } from "../repository";

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

    if (session.user.role === ROLE_ADMIN_TEXT) {
        const totalCountMahasiswaExists = await findTotalCountMahasiswa()
        const totalCountDosenExists = await findTotalCountDosen()
        const recentNewUserExists = await findRecentNewUsersMahasiswa()
        const rangkingDosenListExists = await findRangkingDosenList()
        
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
                    dosen: null,
                    rangking: {
                        dosen: rangkingDosenListExists
                    } 
                }
            },
            status: 200
        }
    }
    
    if (session.user.role === ROLE_TEACHER_TEXT) {
        const totalPerformanceExists = await findPerformanceDosen(session.user.name)

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
                    dosen: totalPerformanceExists,
                    rangking: {
                        dosen: []
                    }
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