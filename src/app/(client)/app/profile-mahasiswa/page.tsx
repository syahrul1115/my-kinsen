"use client"

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

// hooks
import { useToast } from "@/hooks/use-toast";

// services
import { serviceListUsers } from "@/app/(server)/api/user/services";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function ProfileListMahasiswa() {
    const alert = useToast()

    const [search, setSearch] = React.useState<string>("")

    const queryListUsers = useQuery({ queryKey: ['list-users-mahasiswa'], queryFn: () => serviceListUsers("mahasiswa", search) })

    // LOADING VIEW ELEMENTS
    if (queryListUsers.isLoading) {
        return (
            <section className="border bg-background z-50 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                <h1 className="text-2xl">Loading . . .</h1>
            </section>
        );
    }

    if (queryListUsers.isError) {
        alert.toast({
            variant: 'destructive',
            title: 'Error',
            description: queryListUsers.error.message,
        })
    }

    return (
        <section className="flex flex-col gap-8 p-8">
            <div className="flex gap-3 items-center">
                <Input
                    placeholder="Cari berdasarkan email..."
                    value={search}
                    onChange={input => setSearch(input.target.value)}
                    className="md:max-w-sm"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {queryListUsers.data?.users?.map((user, idx) => (
                    <div key={idx} className="card_profile bg-[#fdfdfd] rounded-2xl w-full md:max-w-[360px] p-8 flex flex-col gap-3">
                        <div className="flex gap-3 items-start">
                            <Avatar className="border h-16 w-16">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col mt-3">
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 w-full flex gap-3 items-center">
                                    <div className="flex-1">
                                        <p className="text-base text-slate-600 font-bold">{user.name}</p>
                                    </div>
                                </div>
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 w-full flex gap-3 items-center">
                                    <div className="flex-1">
                                        <p className="text-base text-slate-400 font-bold">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
