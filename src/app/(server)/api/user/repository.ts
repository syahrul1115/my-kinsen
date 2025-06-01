import { ROLE_STUDENT_TEXT } from "@/utils/constants"
import { db } from "@/utils/database"

export async function findTotalCountMahasiswa() {
    const query = db.selectFrom('mahasiswa')

    return await query.select(db.fn.count('id').as('count')).executeTakeFirst()
}

export async function findTotalCountDosen() {
    const query = db.selectFrom('dosen')

    return await query.select(db.fn.count('id').as('count')).executeTakeFirst()
}

export async function findRecentNewUsersMahasiswa() {
    const query = db.selectFrom('user')

    return await query.selectAll()
        .where((eb) =>
            eb.or([
                eb('role', 'ilike', `%${ROLE_STUDENT_TEXT}%`)
            ])
        )
        .limit(5)
        .orderBy('createdAt', 'desc')
        .execute();
}

export async function findPerformanceDosen(name: string) {
    const query = db.selectFrom('quesioner')

    const dosenListExists = await query.select(
        [
            'id',
            'toName',
            'toNbm',
            'rangking',
            'purposeValue',
            'processValue',
            'evaluationValue'
        ]
    )
        .where((eb) =>
            eb.or([
                eb('toName', 'ilike', `%${name}%`)
            ])
        )
        .orderBy('createdAt', 'desc')
        .execute()
    
    let evaluationValue = 0
    let processValue = 0
    let purposeValue = 0
    let rangking = 0
    let toName = ""
    let toNbm = ""

    for (let index = 0; index < dosenListExists.length; index++) {
        const exist = dosenListExists[index];

        purposeValue = purposeValue + Number(exist.purposeValue)
        processValue = processValue + Number(exist.processValue)
        evaluationValue = evaluationValue + Number(exist.evaluationValue)
        rangking = rangking + Number(exist.rangking)
        toName = exist.toName
        toNbm = exist.toNbm
    }

    const result = {
        evaluationValue: evaluationValue.toString(),
        processValue: processValue.toString(),
        purposeValue: purposeValue.toString(),
        rangking: rangking.toString(),
        toName: toName,
        toNbm: toNbm
    }

    return result;
}

export async function findRangkingDosenList() {
    try {
        const query = db.selectFrom('quesioner')
            .select([
                'toName',
                'toNbm',
                db.fn.avg('rangking').as('avgRangking'),
                db.fn.avg('purposeValue').as('avgPurpose'),
                db.fn.avg('processValue').as('avgProcess'),
                db.fn.avg('evaluationValue').as('avgEvaluation')
            ])
            .orderBy('avgRangking', 'desc') // Urutkan berdasarkan ranking tertinggi
            .limit(5)

        return await query.execute();
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Terjadi kesalahan dalam pengambilan data.");
    }
}
