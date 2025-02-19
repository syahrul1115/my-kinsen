import { create } from 'zustand'

type Profile = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    address: string | null;
    dateOfBirth: string | null;
    nim: string;
    place: string | null;
    semester: string;
    studyProgram: string;
}

const initProfileState: Profile = {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "",
    address: "",
    dateOfBirth: "",
    nim: "",
    place: "",
    semester: "",
    studyProgram: "",
}

interface ProfileState {
    profile: Profile;
    increase: (profile: Profile) => void;
}

export const useStoreProfile = create<ProfileState>((set) => ({
    profile: initProfileState,
    increase: profile => set({ profile })
}))
