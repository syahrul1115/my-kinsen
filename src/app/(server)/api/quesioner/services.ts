import { Quesioner } from "@/types/api";
import { Paged, ResultService } from "@/types/app";

export const serviceCreateQuesioner = async (
    request: {
        fromName: string;
        fromNim: string;
        toName: string;
        toNbm: string;
        purposeValue: string;
        processValue: string;
        evaluationValue: string;
        descriptionLiked?: string;
        descriptionSuggestion?: string;
    }
) => {
    const options: RequestInit = {
        method: "POST",
    }
    options.body = JSON.stringify(request)

    const response = await fetch(`/api/quesioner/save`, options)
    return await response.json() as ResultService<string>;
}

export const serviceListQuesioners = async (
    page: number,
    pageSize: number,
    search?: string
) => {
    const params = `?search=${search}&page=${page}&pageSize=${pageSize}`
    const options: RequestInit = {
        method: "GET",
    }

    const response = await fetch("/api/quesioner/all" + params, options)
    return await response.json() as ResultService<Paged<Quesioner>>;
}
