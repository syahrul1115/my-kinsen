"use client"

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// utils
import { authClient } from "@/utils/auth-client";

// hooks
import { useToast } from "@/hooks/use-toast";

// components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchemaChangePassword = z.object({
    newPassword: z.string()
        .min(8, {
            message: 'Password Baru setidaknya 8 karakter!',
        }),
    currentPassword: z.string()
        .min(8, {
            message: 'Password Saat Ini setidaknya 8 karakter!',
        })
})

function FormChangePassword() {
    const alert = useToast()

    const formChangePassword = useForm<z.infer<typeof formSchemaChangePassword>>({
        resolver: zodResolver(formSchemaChangePassword),
        defaultValues: {
            newPassword: "",
            currentPassword: ""
        }
    })

    const onSubmitChangePassword = async (values: z.infer<typeof formSchemaChangePassword>) => {
        await authClient.changePassword({
            newPassword: values.newPassword,
            currentPassword: values.currentPassword,
            revokeOtherSessions: true
        }, {
            onSuccess: async () => {
                formChangePassword.reset()
                alert.toast({
                    variant: 'default',
                    title: 'Success',
                    description: `Anda berhasil melakukan perubahan kata sandi akun.`,
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
        <Form {...formChangePassword}>
            <form onSubmit={formChangePassword.handleSubmit(onSubmitChangePassword)}>
                <div className='bg-[#FDFDFD] space-y-8 grid p-8'>
                    <div className='space-y-3'>
                        <FormField
                            control={formChangePassword.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Baru</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={formChangePassword.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Saat Ini</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit">Ubah</Button>
                </div>
            </form>
        </Form>
    );
}

export default function ChangePassword() {
    return (
        <section>
            <FormChangePassword />
        </section>
    );
}
