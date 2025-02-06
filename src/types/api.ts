import { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface Database {
    account: AccountEntity;
    session: SessionEntity;
    user: UserEntity;
    verification: VerificationEntity;
    quesioner: QuesionerEntity;
    mahasiswa: MahasiswaEntity;
    dosen: DosenEntity;
    matkul: MatkulEntity;
}

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AccountEntity {
    accessToken: string | null;
    accessTokenExpiresAt: Timestamp | null;
    accountId: string;
    createdAt: Timestamp;
    id: string;
    idToken: string | null;
    password: string | null;
    providerId: string;
    refreshToken: string | null;
    refreshTokenExpiresAt: Timestamp | null;
    scope: string | null;
    updatedAt: Timestamp;
    userId: string;
}

export interface SessionEntity {
    createdAt: Timestamp;
    expiresAt: Timestamp;
    id: string;
    impersonatedBy: string | null;
    ipAddress: string | null;
    token: string;
    updatedAt: Timestamp;
    userAgent: string | null;
    userId: string;
}

export interface UserEntity {
    banExpires: Timestamp | null;
    banned: boolean | null;
    banReason: string | null;
    createdAt: Timestamp;
    email: string;
    emailVerified: boolean;
    id: string;
    image: string | null;
    name: string;
    role: string | null;
    updatedAt: Timestamp;
}

export interface VerificationEntity {
    createdAt: Timestamp | null;
    expiresAt: Timestamp;
    id: string;
    identifier: string;
    updatedAt: Timestamp | null;
    value: string;
}

export interface MahasiswaEntity {
    address: string | null;
    createdAt: Timestamp;
    dateOfBirth: string | null;
    id: string;
    nim: string;
    place: string | null;
    semester: string;
    studyProgram: string;
    updatedAt: Timestamp;
    userId: string;
}

export interface DosenEntity {
    createdAt: Timestamp;
    id: string;
    name: string;
    nbm: string;
    updatedAt: Timestamp;
    userId: string;
}

export interface MatkulEntity {
    createdAt: Timestamp;
    dosenId: string;
    id: string;
    name: string;
    semester: string;
    studyProgram: string;
    updatedAt: Timestamp;
}

export interface QuesionerEntity {
    createdAt: Timestamp;
    descriptionLiked: string | null;
    descriptionSuggestion: string | null;
    evaluationValue: string;
    fromName: string;
    fromNim: string;
    id: string;
    processValue: string;
    purposeValue: string;
    toName: string;
    toNbm: string;
    updatedAt: Timestamp;
}

export type User = Selectable<UserEntity>
export type NewUser = Insertable<UserEntity>
export type UserUpdate = Updateable<UserEntity>

export type Mahasiswa = Selectable<MahasiswaEntity>
export type NewMahasiswa = Insertable<MahasiswaEntity>
export type MahasiswaUpdate = Updateable<MahasiswaEntity>

export type Dosen = Selectable<DosenEntity>
export type NewDosen = Insertable<DosenEntity>
export type DosenUpdate = Updateable<DosenEntity>

export type Matkul = Selectable<MatkulEntity>
export type NewMatkul = Insertable<MatkulEntity>
export type MatkulUpdate = Updateable<MatkulEntity>

export type Quesioner = Selectable<QuesionerEntity>
export type NewQuesioner = Insertable<QuesionerEntity>
export type QuesionerUpdate = Updateable<QuesionerEntity>
