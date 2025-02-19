"use client"

// next
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// utils
import { authClient } from "@/utils/auth-client";

// hooks
import { useToast } from "@/hooks/use-toast";

// components
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// services
import { serviceCreateProfileMahasiswa } from "@/app/(server)/api/mahasiswa/services";

const formSchemaSignUp = z.object({
    name: z.string()
        .min(1, {
            message: 'Name is not empty!',
        }),
    email: z.string()
        .min(1, {
            message: "Email is not empty!",
        })
        .email({
            message: 'Email is not valid!'
        }),
    nim: z.string()
        .min(1, {
            message: 'Nim should be minimal 1!',
        })
        .max(12, {
            message: "Nim should be maximal 12!"
        }),
    studyProgram: z.string()
        .min(1, {
            message: 'Study Program is not empty!',
        }),
    semester: z.string()
        .min(1, {
            message: 'Semester should be minimal 1 until 8!',
        })
        .max(8, {
            message: "Semester should be maximal 8!"
        }),
    password: z.string()
        .min(8, {
            message: 'Password should be minimal 8 digit characters!',
        }),
})

export default function Register() {
    const router = useRouter()
    const alert = useToast()

    const mutationCreateProfileMahasiswa = useMutation({ mutationKey: ["create-profile-mahasiswa"],
        mutationFn: serviceCreateProfileMahasiswa
    })

    const [isPending, setIsPending] = React.useState<boolean>(false)

    const formSignUp = useForm<z.infer<typeof formSchemaSignUp>>({
        resolver: zodResolver(formSchemaSignUp),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            nim: "",
            studyProgram: "Teknik Informatika",
            semester: ""
        },
    })
    const onSubmitSignUp = async (values: z.infer<typeof formSchemaSignUp>) => {
        setIsPending(true)
        await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: values.name,
            callbackURL: "/app"
        }, {
            onSuccess: async () => {
                const { nim, studyProgram, semester } = await formSchemaSignUp.parseAsync(values)
                mutationCreateProfileMahasiswa.mutate({ nim, studyProgram, semester })
                
                if (mutationCreateProfileMahasiswa.isSuccess) {
                    alert.toast({
                        variant: 'default',
                        title: 'Success',
                        description: 'Anda berhasil melakukan pendaftaran akun.',
                    })
                }
                setIsPending(false)
            },
            onError: (ctx) => {
                alert.toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: ctx.error.message,
                })
                setIsPending(false)
            },
        })
    }

    // CHECK AUTHENTICATED USER LOGIN
    const { data: authenticated } = authClient.useSession()
    if (authenticated) {
        router.push('/app') // REDIRECT TO APPLICATION PAGE
        return;
    }

    // VIEW REGISTER FORM PAGE FOR MAHASISWA
    return (
        <section className="flex flex-col">
            <Form {...formSignUp}>
                <form onSubmit={formSignUp.handleSubmit(onSubmitSignUp)}>
                    <div className='bg-[#FDFDFD] space-y-8 grid p-8'>
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
                                name="nim"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nim</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formSignUp.control}
                                name="semester"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Semester</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={1} max={8} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formSignUp.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending || mutationCreateProfileMahasiswa.isPending}
                        >
                            {isPending || mutationCreateProfileMahasiswa.isPending ? "LOADING..." : "DAFTAR"}
                        </Button>
                        <p className='text-xs text-center'>
                            Sudah punya akun? {" "}
                            <Link href={"/login"} className='underline'>Masuk sekarang</Link>
                        </p>
                    </div>
                </form>
            </Form>
        </section>
    );
}
