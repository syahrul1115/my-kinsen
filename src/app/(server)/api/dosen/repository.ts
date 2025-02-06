import { NewDosen, DosenUpdate } from '@/types/api'
import { db } from '@/utils/database'

export async function findById(id: string) {
    return await db.selectFrom('dosen')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst()
}

export async function findByUserId(userId: string) {
    return await db.selectFrom('dosen')
        .where('userId', '=', userId)
        .selectAll()
        .executeTakeFirst()
}

export async function find(pageSize: number, offset: number) {
    const query = db.selectFrom('dosen')

    return await query.selectAll().limit(pageSize).offset(offset).execute()
}

export async function findTotalCount() {
    const query = db.selectFrom('dosen')

    return await query.select(db.fn.count('id').as('count')).executeTakeFirst()
}

export async function findBySearch(search: string) {
    const query = db.selectFrom('dosen')

    return await query.select(['id', 'name', 'nbm'])
        .where((eb) =>
            eb.or([
                eb('name', 'ilike', `%${search}%`),
                eb('nbm', 'ilike', `%${search}%`)
            ])
        )
        .orderBy('createdAt', 'desc')
        .execute()
}

export async function update(id: string, updateWith: DosenUpdate) {
    await db.updateTable('dosen').set(updateWith).where('id', '=', id).execute()
}

export async function create(person: NewDosen) {
    return await db.insertInto('dosen')
        .values(person)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function deleteById(id: string) {
    return await db.deleteFrom('dosen').where('id', '=', id)
        .returningAll()
        .executeTakeFirst()
}
