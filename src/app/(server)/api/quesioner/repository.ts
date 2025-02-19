import { NewQuesioner, QuesionerUpdate } from '@/types/api'
import { db } from '@/utils/database'

export async function findById(id: string) {
    return await db.selectFrom('quesioner')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst()
}

export async function find(pageSize: number, offset: number) {
    const query = db.selectFrom('quesioner')

    return await query.selectAll().limit(pageSize).offset(offset).execute()
}

export async function findTotalCount() {
    const query = db.selectFrom('quesioner')

    return await query.select(db.fn.count('id').as('count')).executeTakeFirst()
}

export async function findBySearch(search: string) {
    const query = db.selectFrom('quesioner')

    return await query.selectAll()
        .where((eb) =>
            eb.or([
                eb('fromName', 'ilike', `%${search}%`),
                eb('fromNim', 'ilike', `%${search}%`),
                eb('toName', 'ilike', `%${search}%`),
                eb('toNbm', 'ilike', `%${search}%`)
            ])
        )
        .orderBy('createdAt', 'desc')
        .execute()
}

export async function update(id: string, updateWith: QuesionerUpdate) {
    await db.updateTable('quesioner').set(updateWith).where('id', '=', id).execute()
}

export async function create(person: NewQuesioner) {
    return await db.insertInto('quesioner')
        .values(person)
        .returningAll()
        .executeTakeFirstOrThrow()
}
