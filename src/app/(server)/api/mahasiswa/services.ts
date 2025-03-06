import { Mahasiswa, User } from "@/types/api";
import { Profile, ResultService } from "@/types/app";

export const serviceCreateProfileMahasiswa = async (
    request: {
        nim: string;
        studyProgram: string;
        semester: string;
    }
) => {
    const options: RequestInit = {
        method: "POST",
    }
    options.body = JSON.stringify(request)

    const response = await fetch(`/api/mahasiswa/save`, options)
    const result: ResultService<string> = await response.json()
    
    return result;
}

export const serviceGetProfileMahasiswa = async () => {
    const options: RequestInit = {
        method: "GET",
    }

    const response = await fetch("/api/mahasiswa/profile", options)
    const result: ResultService<Profile<Mahasiswa, User>> = await response.json()

    return result;
}


export const serviceDeleteProfileMahasiswa = async (
    userId: string
) => {
    const options: RequestInit = {
        method: 'DELETE'
    }

    const response = await fetch("/api/mahasiswa/" + userId, options)
    const result: ResultService<string> = await response.json()

    return result;
}
