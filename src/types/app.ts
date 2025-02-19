
export type Quesioner = {
    question: string;
    value: string;
}

export type ModuleQuesioners = {
    type: string;
    quesioners: Quesioner[]
}

export type ModuleQuesionerList = {
    moduleQuesioners: ModuleQuesioners[]
}

export type Profile<TProfile, TUser> = {
    profile: TProfile;
    user: TUser;
}

export type ResultHookProfile<TProfile, TUser> = {
    user: TUser;
    profile: TProfile;
    isPending: boolean;
}

export type ResultHook<T> = {
    paged: T;
    isPending: boolean;
}

export type Paged<T> = {
    items: T[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
}

export type ResultService<T> = {
    data: T;
    status: number;
}
