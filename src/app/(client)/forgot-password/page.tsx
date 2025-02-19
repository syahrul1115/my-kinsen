"use client"

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

// utils
import { authClient } from "@/utils/auth-client";

// hooks
import { useToast } from "@/hooks/use-toast";

// components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchemaForgotPassword = z.object({
    email: z.string()
        .min(1, {
            message: "Email is not empty!",
        })
        .email({
            message: 'Email is not valid!'
        })
})

export default function ForgotPassword() {
    const alert = useToast()

    const formForgotPassword = useForm<z.infer<typeof formSchemaForgotPassword>>({
        resolver: zodResolver(formSchemaForgotPassword),
        defaultValues: {
            email: ""
        }
    })

    const onSubmitForgotPassword = async (values: z.infer<typeof formSchemaForgotPassword>) => {
        await authClient.forgetPassword({
            email: values.email,
            redirectTo: "/reset-password",
        }, {
            onSuccess: async () => {
                alert.toast({
                    variant: 'default',
                    title: 'Success',
                    description: `Anda berhasil mengirim tautan verifikasi ke ${values.email}.`,
                })
            },
            onError: (ctx) => {
                alert.toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: ctx.error.message,
                })
            }
        })
    }

    return (
        <section>
            <Form {...formForgotPassword}>
                <form onSubmit={formForgotPassword.handleSubmit(onSubmitForgotPassword)}>
                    <div className='bg-[#FDFDFD] space-y-8 grid p-8'>
                        <div className='space-y-3'>
                            <FormField
                                control={formForgotPassword.control}
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
                        </div>
                        <Button
                            type="submit"
                        >
                            Kirim Verifikasi Akun
                        </Button>
                        <p className='text-xs text-center'>
                            <Link href={"/login"} className='underline'>Kembali ke halaman Masuk</Link>
                        </p>
                    </div>
                </form>
            </Form>
        </section>
    );
}
