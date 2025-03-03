import { Dosen, User } from "@/types/api";
import { Paged, Profile, ResultService } from "@/types/app";

export const serviceCreateProfileDosen = async (
    request: {
        name: string;
        nbm: string;
    }
) => {
    const options: RequestInit = {
        method: "POST",
    }
    options.body = JSON.stringify(request)

    const response = await fetch(`/api/dosen/save`, options)
    const result: ResultService<string> = await response.json()
    
    return result;
}

export const serviceListDosen = async (page: number, pageSize: number, search?: string) => {
    const params = `?search=${search}&page=${page}&pageSize${pageSize}`
    const options: RequestInit = {
        method: "GET",
    }

    const response = await fetch("/api/dosen/all" + params, options)
    const result: ResultService<Paged<Dosen>> = await response.json()

    return result;
}

export const serviceGetProfileDosen = async () => {
    const options: RequestInit = {
        method: "GET",
    }

    const response = await fetch("/api/dosen/profile", options)
    const result: ResultService<Profile<Dosen, User>> = await response.json()

    return result;
}

export const serviceDeleteProfileDosen = async (
    userId: string
) => {
    const options: RequestInit = {
        method: 'DELETE'
    }

    const response = await fetch("/api/dosen/" + userId, options)
    const result: ResultService<string> = await response.json()

    return result;
}
