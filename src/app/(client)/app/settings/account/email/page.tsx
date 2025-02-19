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

const formSchemaChangeEmail = z.object({
    email: z.string()
        .min(1, {
            message: "Email is not empty!",
        })
        .email({
            message: 'Email is not valid!'
        })
})

function FormChangeEmail() {
    const alert = useToast()

    const formChangeEmail = useForm<z.infer<typeof formSchemaChangeEmail>>({
        resolver: zodResolver(formSchemaChangeEmail),
        defaultValues: {
            email: ""
        }
    })

    const onSubmitChangeEmail = async (values: z.infer<typeof formSchemaChangeEmail>) => {
        await authClient.changeEmail({
            newEmail: values.email,
            callbackURL: "/app"
        }, {
            onSuccess: async () => {
                formChangeEmail.reset()
                alert.toast({
                    variant: 'default',
                    title: 'Success',
                    description: `Anda berhasil melakukan perubahan email.`,
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
        <Form {...formChangeEmail}>
            <form onSubmit={formChangeEmail.handleSubmit(onSubmitChangeEmail)}>
                <div className='bg-[#FDFDFD] space-y-8 grid p-8'>
                    <div className='space-y-3'>
                        <FormField
                            control={formChangeEmail.control}
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
                    <Button type="submit">Ubah</Button>
                </div>
            </form>
        </Form>
    );
}

export default function ChangeEmail() {
    return (
        <section>
            <FormChangeEmail />
        </section>
    );
}
