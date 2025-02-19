import { NewMahasiswa, MahasiswaUpdate } from '@/types/api'
import { db } from '@/utils/database'

export async function findById(id: string) {
    return await db.selectFrom('mahasiswa')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst()
}

export async function findByUserId(userId: string) {
    return await db.selectFrom('mahasiswa')
        .where('userId', '=', userId)
        .selectAll()
        .executeTakeFirst()
}

export async function find(pageSize: number, offset: number) {
    const query = db.selectFrom('mahasiswa')

    return await query.selectAll().limit(pageSize).offset(offset).execute()
}

export async function findTotalCount() {
    const query = db.selectFrom('mahasiswa')

    return await query.select(db.fn.count('id').as('count')).executeTakeFirst()
}

export async function findBySearch(search: string) {
    const query = db.selectFrom('mahasiswa')

    return await query.select(['id', 'nim', 'studyProgram', 'semester'])
        .where((eb) =>
            eb.or([
                eb('nim', 'ilike', `%${search}%`)
            ])
        )
        .orderBy('createdAt', 'desc')
        .execute()
}

export async function update(id: string, updateWith: MahasiswaUpdate) {
    await db.updateTable('mahasiswa').set(updateWith).where('id', '=', id).execute()
}

export async function create(person: NewMahasiswa) {
    return await db.insertInto('mahasiswa')
        .values(person)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function deleteById(id: string) {
    return await db.deleteFrom('mahasiswa').where('id', '=', id)
        .returningAll()
        .executeTakeFirst()
}
