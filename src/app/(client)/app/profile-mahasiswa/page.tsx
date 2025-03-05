"use client"

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// hooks
import { useToast } from "@/hooks/use-toast";

// services
import { serviceDeleteUser, serviceListUsers } from "@/app/(server)/api/user/services";
import { serviceDeleteProfileMahasiswa } from "@/app/(server)/api/mahasiswa/services";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { Trash2 } from "lucide-react";

export default function ProfileListMahasiswa() {
    const queryClient = useQueryClient()
    const alert = useToast()

    const [search, setSearch] = React.useState<string>("")

    const queryListUsers = useQuery({ queryKey: ['list-users-mahasiswa'], queryFn: () => serviceListUsers("mahasiswa", search) })

    const mutationDeleteAccountDosen = useMutation({
        mutationKey: ["delete-profile-mahasiswa"], mutationFn: serviceDeleteProfileMahasiswa
    })

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {queryListUsers.data?.users?.map((user, idx) => (
                    <div key={idx} className="card_profile bg-[#fdfdfd] rounded-2xl w-full md:max-w-[360px] p-8 flex flex-col gap-3 relative">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant={"destructive"} size={"icon"} className="absolute z-10 right-1 top-1 rounded-full">
                                    <Trash2 />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Apakah anda yakin ingin menghapus akun {user.name}?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => mutationDeleteAccountDosen.mutate(user.id, {
                                        onSuccess: async () => {
                                            await serviceDeleteUser(user.id)

                                            queryClient.invalidateQueries({ queryKey: ["list-users-mahasiswa"] })
                                            alert.toast({
                                                variant: 'default',
                                                title: 'Success',
                                                description: `Anda berhasil menghapus akun ${user.name}.`,
                                            })
                                        },
                                        onError: (error) => {
                                            alert.toast({
                                                variant: 'destructive',
                                                title: 'Error',
                                                description: error.message,
                                            })
                                        }
                                    })}>
                                        Yakin
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <div className="flex gap-3 items-start">
                            <Avatar className="border h-16 w-16">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="font-bold">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col mt-3">
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 w-full flex gap-3 items-center">
                                    <div className="flex-1">
                                        <p className="text-xl text-slate-600 font-bold">{user.name}</p>
                                    </div>
                                </div>
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 w-full flex gap-3 items-center">
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-400 font-bold">{user.email}</p>
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
