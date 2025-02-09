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
                eb('role', 'ilike', `%mahasiswa%`)
            ])
        )
        .limit(5)
        .orderBy('createdAt', 'desc')
        .execute();
}

export async function findPerformanceDosen(name: string) {
    const query = db.selectFrom('quesioner')

    return await query.select(
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
}

export async function findRangkingDosenList() {
    const query = db.selectFrom('quesioner')

    return await query.select(
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
        .limit(5)
        .orderBy('rangking', 'desc')
        .execute();
}