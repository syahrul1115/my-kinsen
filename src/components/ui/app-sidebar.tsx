"use client"

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/utils";
import { auth } from "@/utils/auth";
import { authClient } from "@/utils/auth-client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamSwitcher } from "./team-switcher";

// This is sample data.
const data = {
    navMain: [
        {
            title: "Dashboard",
            items: [
                {
                    title: "Profile",
                    url: "/app",
                    role: ["ADMIN", "DOSEN", "MAHASISWA"]
                },
            ],
        },
        {
            title: "Utama",
            items: [
                {
                    title: "Dosen",
                    url: "/app/profile-dosen",
                    role: ["ADMIN"]
                },
                {
                    title: "Mahasiswa",
                    url: "/app/profile-mahasiswa",
                    role: ["ADMIN"]
                },
                {
                    title: "Mata Kuliah",
                    url: "/app/mata-kuliah",
                    role: ["ADMIN"]
                },
            ],
        },
    ],
}

type Session = typeof auth.$Infer.Session;

interface Props {
    children: React.ReactNode;
    authenticated: Session;
}

export default function AppSidebar({ children, authenticated }: Props) {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <TeamSwitcher teams={[
                        { name: authenticated.user.name, avatar: authenticated.user.image || "", on: "Online" }
                    ]} />
                </SidebarHeader>
                <SidebarContent>
                    {data.navMain.map((nav, idx) => (
                        <SidebarGroup key={idx}>
                            <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
                            <SidebarMenu className="px-3">
                                {nav.items.filter(i => i.role.find((role: string) => role === authenticated.user.role as string)).map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} className={cn(item.url === pathname ? "bg-sidebar-accent" : "")}>
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    ))}
                </SidebarContent>
            </Sidebar>
            <main className="w-full">
                <header className="px-8 py-3 flex gap-3 items-center">
                    <div className="flex gap-8 items-center w-full">
                        <SidebarTrigger />
                        <h1 className="text-xs md:text-xl capitalize">
                            {pathname === '/app' || pathname === '/app/dashboard' ? `Hai, ${authenticated.user.name}` : pathname.split("/").findLast(name => name)?.split("-").join(" ")}
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default" className="bg-background hover:bg-background border-2 border-black/60 shadow-none px-3 py-6 gap-8 justify-end">
                                    <h3 className="text-black font-bold flex flex-col items-start justify-start">
                                        {authenticated?.user.name}
                                        <span className="text-[#10754D] text-[10px] font-light">Online</span>
                                    </h3>
                                    <Avatar>
                                        <AvatarImage src={authenticated.user.image ?? ""} />
                                        <AvatarFallback className="text-black font-bold">
                                            {authenticated.user.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[360px]">
                                <DropdownMenuLabel>
                                    <div className="flex gap-3 items-center">
                                        <Avatar>
                                            <AvatarImage src={authenticated.user.image ?? ""} />
                                            <AvatarFallback className="font-bold">
                                                {authenticated.user.name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-black font-bold flex flex-col items-start justify-start">
                                            {authenticated.user.name}
                                            <span className="text-[#10754D] text-[10px] font-light">Online</span>
                                        </h3>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Settings</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => router.push("/app/settings/account/email")}>
                                                    Email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push("/app/settings/account/password")}>
                                                    Password
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>More...</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled>Support</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={async () => await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push("/login"); // REDIRECT TO LOGIN PAGE
                                        }
                                    }
                                })}>
                                    <span className="text-[#FF0000]">Log out</span>
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                {children}
            </main>
        </SidebarProvider>
    );
}
