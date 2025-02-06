import { Matkul } from "@/types/api";
import { Paged, ResultService } from "@/types/app"

type MatkulDto = Matkul & {
    teacher: {
        id: string;
        name: string;
        nbm: string;
    }
}

export const serviceCreateNewMatkul = async (
    request: {
        name: string;
        semester: string;
        studyProgram: string;
        dosenId: string;
    }
) => {
    const options: RequestInit = {
        method: 'POST'
    }
    options.body = JSON.stringify(request)

    const response = await fetch("/api/matkul/save", options)
    const result: ResultService<string> = await response.json()

    return result;
}

export const serviceListMatkuls = async (page: number, pageSize: number, search?: string) => {
    const params = `?search=${search}&page=${page}&pageSize=${pageSize}`
    const options: RequestInit = {
        method: 'GET'
    }

    const response = await fetch("/api/matkul/all" + params, options)
    const result: ResultService<Paged<MatkulDto>> = await response.json()

    return result;
}