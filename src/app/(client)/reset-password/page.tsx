"use client"

import * as React from "react";
import { useSearchParams } from "next/navigation";
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

const formSchemaResetPassword = z.object({
    password: z.string()
        .min(8, {
            message: 'Password must be minimal 8 characters!',
        })
})

function FormResetPassword() {
    const alert = useToast()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const formResetPassword = useForm<z.infer<typeof formSchemaResetPassword>>({
        resolver: zodResolver(formSchemaResetPassword),
        defaultValues: {
            password: ""
        }
    })

    const onSubmitResetPassword = async (values: z.infer<typeof formSchemaResetPassword>) => {
        if (!token) {
            alert.toast({
                variant: 'destructive',
                title: 'Error',
                description: "Token anda tidak valid."
            })
            return;
        }

        await authClient.resetPassword({
            newPassword: values.password,
            token,
        }, {
            onSuccess: async () => {
                alert.toast({
                    variant: 'default',
                    title: 'Success',
                    description: `Silakan masuk kembali dengan password baru Anda.`,
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
        <Form {...formResetPassword}>
            <form onSubmit={formResetPassword.handleSubmit(onSubmitResetPassword)}>
                <div className='bg-[#FDFDFD] space-y-8 grid p-8'>
                    <div className='space-y-3'>
                        <FormField
                            control={formResetPassword.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit">Reset Password</Button>
                </div>
            </form>
        </Form>
    );
}

export default function ResetPassword() {
    return (
        <section>
            <React.Suspense>
                <FormResetPassword />
            </React.Suspense>
        </section>
    );
}
