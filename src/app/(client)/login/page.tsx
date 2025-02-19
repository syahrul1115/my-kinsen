'use client'

// next
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// others
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// utils
import { authClient } from '@/utils/auth-client'

// hooks
import { useToast } from '@/hooks/use-toast'

// components
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchemaSignIn = z.object({
    email: z.string()
        .min(1, {
            message: "Email is not empty!",
        })
        .email({
            message: 'Email is not valid!'
        }),
    password: z.string()
        .min(8, {
            message: 'Password must be minimal 8 characters!',
        }),
})

export default function Login() {
    const router = useRouter()
    const alert = useToast()

    const [isPending, setIsPending] = React.useState<boolean>(false)

    const formSignIn = useForm<z.infer<typeof formSchemaSignIn>>({
        resolver: zodResolver(formSchemaSignIn),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const onSubmitSignIn = async (values: z.infer<typeof formSchemaSignIn>) => {
        setIsPending(true)
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/app"
        }, {
            onSuccess: async (ctx) => {
                setIsPending(false)
                alert.toast({
                    variant: 'default',
                    title: 'Success',
                    description: `Anda berhasil masuk ke akun ${ctx.data.user.email}.`,
                })
            },
            onError: (ctx) => {
                setIsPending(false)
                alert.toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: ctx.error.message,
                })
            }
        })
    }

    // CHECK AUTHENTICATED USER LOGIN
    const { data: authenticated } = authClient.useSession()
    if (authenticated) {
        router.push("/app") // REDIRECT TO APPLICATION PAGE FOR USERS
        return;
    }

    return (
        <section className="flex flex-col">
            <Form {...formSignIn}>
                <form onSubmit={formSignIn.handleSubmit(onSubmitSignIn)}>
                    <div className='bg-[#FDFDFD] space-y-8 grid p-8'>
                        <div className='space-y-3'>
                            <FormField
                                control={formSignIn.control}
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
                                control={formSignIn.control}
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
                        <Link href={"/forgot-password"} className='underline'>
                            Lupa Password?
                        </Link>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "LOADING..." : "MASUK"}
                        </Button>
                        <p className='text-xs text-center'>
                            Tidak punya akun? <Link href={"/register"} className='underline'>Buat Akun</Link>
                        </p>
                    </div>
                </form>
            </Form>
        </section>
    );
}
