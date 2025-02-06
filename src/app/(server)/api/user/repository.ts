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

    return query.selectAll()
        .where((eb) =>
            eb.or([
                eb('role', 'ilike', `%mahasiswa%`)
            ])
        )
        .limit(5)
        .orderBy('createdAt', 'desc')
        .execute();
}

export async function findPerformanceDosen() {
    const query = db.selectFrom('quesioner')

    const quesioners = await query.select(['id', 'purposeValue', 'processValue', 'evaluationValue']).execute()
    
    let purpose: number = 0
    let process = 0
    let evaluation = 0

    for (let index = 0; index < quesioners.length; index++) {
        const element = quesioners[index];
        purpose = purpose + Number(element.purposeValue)
        process = process + Number(element.processValue)
        evaluation = evaluation + Number(element.evaluationValue)
    }

    return { purpose, process, evaluation}
}