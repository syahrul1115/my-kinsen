"use client"

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2 } from "lucide-react";

// utils
import { authClient } from "@/utils/auth-client";

// hooks
import { useToast } from "@/hooks/use-toast";

// services
import { serviceDeleteUser, serviceListUsers } from "@/app/(server)/api/user/services";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { serviceDeleteProfileDosen } from "@/app/(server)/api/dosen/services";

const formSchemaSignUpDosen = z.object({
    name: z.string()
        .min(2, {
            message: 'Name is not empty!',
        }),
    email: z.string()
        .min(2, {
            message: "Email is not empty!",
        })
        .email({
            message: 'Email is not valid!'
        }),
    nbm: z.string()
        .min(1, {
            message: 'NBM should be minimal 1!',
        })
        .max(12, {
            message: "NBM should be maximal 12!"
        }),
})

const FormDialogSignUpDosen = () => {
    const alert = useToast()
    const queryClient = useQueryClient()

    // STATE DATA FORM
    const [open, setOpen] = React.useState<boolean>(false)

    const formSignUp = useForm<z.infer<typeof formSchemaSignUpDosen>>({
        resolver: zodResolver(formSchemaSignUpDosen),
        defaultValues: {
            email: '',
            name: '',
            nbm: ''
        },
    })
    const onSubmitSignUp = async (values: z.infer<typeof formSchemaSignUpDosen>) => {
        await authClient.admin.createUser({
            name: values.name,
            email: values.email,
            password: "12345678",
            role: "DOSEN"
        }, {
            onSuccess: async (ctx) => {
                // TO DO ...
                const { user } = ctx.data
                await authClient.admin.setRole({
                    userId: user.id,
                    role: "DOSEN",
                })
                const { name, nbm } = await formSchemaSignUpDosen.parseAsync(values)
                await fetch('/api/dosen/save', {
                    method: 'POST',
                    body: JSON.stringify({ name, nbm, userId: user.id })
                })

                queryClient.invalidateQueries({ queryKey: ["list-users-dosen"]})
                setOpen(false)
                alert.toast({
                    variant: 'default',
                    title: 'Success',
                    description: `Anda berhasil mendaftar akun ${name}.`,
                })
            },
            onError: (ctx) => {
                alert.toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: ctx.error.message,
                })
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="ml-auto font-bold">TAMBAHKAN DOSEN</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>DAFTARKAN DOSEN BARU</DialogTitle>
                    <DialogDescription>
                        Daftarkan Dosen untuk akun dosen. Klik BUAT untuk menyimpan.
                    </DialogDescription>
                </DialogHeader>
                <Form {...formSignUp}>
                    <form onSubmit={formSignUp.handleSubmit(onSubmitSignUp)}>
                        <div className='grid gap-3 py-3'>
                            <div className='space-y-3'>
                                <FormField
                                    control={formSignUp.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formSignUp.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formSignUp.control}
                                    name="nbm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nbm</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="font-bold">BUAT</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function ProfileListDosen() {
    const queryClient = useQueryClient()
    const alert = useToast()

    const [search, setSearch] = React.useState<string>("")

    const queryListUsers = useQuery({ queryKey: ['list-users-dosen'], queryFn: () => serviceListUsers("DOSEN", search) })

    const mutationDeleteAccountDosen = useMutation({
        mutationKey: ["delete-account-dosen"], mutationFn: serviceDeleteProfileDosen
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
                <FormDialogSignUpDosen />
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

                                            queryClient.invalidateQueries({ queryKey: ["list-users-dosen"] })
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
