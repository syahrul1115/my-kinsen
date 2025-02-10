import { User } from "@/types/api";
import { ResultService } from "@/types/app";
import { authClient } from "@/utils/auth-client";

export const serviceListUsers = async (role: string, search: string) => {
    const { data, error } = await authClient.admin.listUsers({
        query: {
            searchField: "email",
            searchOperator: "contains",
            searchValue: search,
            limit: 10,
            offset: 0,
            sortBy: "createdAt",
            sortDirection: "desc",
            filterField: "role",
            filterOperator: "eq",
            filterValue: role
        }
    })

    if (error) {
        return { users: null, error: error.message };
    }

    return { users: data.users, error: null };
}

export type Dashboard = {
    totalCount: {
        mahasiswa: {
            count: string | number | bigint;
        };
        dosen: {
            count: string | number | bigint;
        };
    };
    recent: {
        newUsers: User[]
    };
    performance: {
        dosen: {
            evaluationValue: string;
            processValue: string;
            purposeValue: string;
            rangking: string;
            toName: string;
            toNbm: string;
        } | null,
        rangking: {
            dosen: {
                id: string;
                evaluationValue: string;
                processValue: string;
                purposeValue: string;
                rangking: string;
                toName: string;
                toNbm: string;
            }[]
        }
    };
}

export const serviceGetDashboard = async () => {
    const options: RequestInit = {
        method: "GET"
    }

    const response = await fetch("/api/user/dashboard", options)
    const result: ResultService<Dashboard> = await response.json()

    return result;
}