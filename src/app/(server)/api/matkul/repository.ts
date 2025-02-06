import { NewMatkul, MatkulUpdate } from '@/types/api'
import { db } from '@/utils/database'
import { jsonObjectFrom } from 'kysely/helpers/postgres'

export async function findById(id: string) {
    return await db.selectFrom('matkul')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst()
}

export async function find(pageSize: number, offset: number) {
    const query = db.selectFrom('matkul')

    return await query.selectAll()
        .select((eb) => [
            jsonObjectFrom(
                eb.selectFrom('dosen as teacher')
                    .select(['id', 'name', 'nbm'])
                    .whereRef('teacher.id', '=', 'matkul.dosenId')
            ).as('teacher')
        ])
        .limit(pageSize)
        .offset(offset)
        .execute()
}

export async function findTotalCount() {
    const query = db.selectFrom('matkul')

    return await query.select(db.fn.count('id').as('count')).executeTakeFirst()
}

export async function findBySearch(search: string) {
    const query = db.selectFrom('matkul')

    return await query.selectAll()
        .select((eb) => [
            jsonObjectFrom(
                eb.selectFrom('dosen as teacher')
                    .select(['id', 'name', 'nbm'])
                    .whereRef('teacher.id', '=', 'matkul.dosenId')
            ).as('teacher')
        ])
        .where((eb) =>
            eb.or([
                eb('name', 'ilike', `%${search}%`),
                eb('studyProgram', 'ilike', `%${search}%`),
                eb('semester', 'ilike', `%${search}%`),
                eb('dosenId', 'ilike', `%${search}%`)
            ])
        )
        .orderBy('createdAt', 'desc')
        .execute()
}

export async function update(id: string, updateWith: MatkulUpdate) {
    await db.updateTable('matkul').set(updateWith).where('id', '=', id).execute()
}

export async function create(person: NewMatkul) {
    return await db.insertInto('matkul')
        .values(person)
        .returningAll()
        .executeTakeFirstOrThrow()
}
