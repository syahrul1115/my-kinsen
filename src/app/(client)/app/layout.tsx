import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// utils
import { auth } from '@/utils/auth'

// components
import AppSidebar from '@/components/ui/app-sidebar'

export const metadata: Metadata = {
    title: {
        absolute: 'Feedback Performance',
        template: '%s - Feedback Performance'
    },
    description: "Generated by create next app",
};

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    // CHECK AUTHENTICATED USER LOGIN
    const authenticated = await auth.api.getSession({
        headers: await headers()
    })

    if (!authenticated) {
        redirect('/login') // REDIRECT TO LOGIN PAGE
    }

    return (
        <AppSidebar authenticated={authenticated}>{children}</AppSidebar>
    );
}
