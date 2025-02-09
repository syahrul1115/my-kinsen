"use client"

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/utils";
import { auth } from "@/utils/auth";
import { authClient } from "@/utils/auth-client";

import { ArrowLeft, ArrowRight, User, Award } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
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

// Menu items.
const items = [
    {
        title: "Profile",
        url: "/app",
        icon: User,
        role: ["mahasiswa", "dosen", "admin"]
    },
    {
        title: "Profile Dosen",
        url: "/app/profile-dosen",
        icon: Award,
        role: ["admin"]
    },
    {
        title: "Profile Mahasiswa",
        url: "/app/profile-mahasiswa",
        icon: Award,
        role: ["admin"]
    },
    {
        title: "Mata Kuliah",
        url: "/app/mata-kuliah",
        icon: Award,
        role: ["admin"]
    },
];

type Session = typeof auth.$Infer.Session;

interface Props {
    children: React.ReactNode;
    authenticated: Session;
}

export default function AppSidebar({ children, authenticated }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const isMobile = useIsMobile()

    const [open, setOpen] = React.useState<boolean>(isMobile ? false : true)

    return (
        <SidebarProvider open={open} onOpenChange={setOpen} style={
            {
                "--sidebar-width": "6rem",
                // "--sidebar-width-mobile": "6rem",
            } as React.CSSProperties
        }>
            <Sidebar className="border-none">
                <SidebarContent className="pt-[106px]">
                    <SidebarMenu className="px-1 gap-3 items-center justify-center">
                        {items.filter(i => i.role.find((role: string) => role === authenticated.user.role as string)).map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild className="rounded-full">
                                    <Link href={item.url} className={cn(
                                        "hover:bg-[#FDFDFD] hover:text-[#10754D] font-bold w-11 h-11 flex items-center justify-center",
                                        pathname === item.url ? "bg-[#FDFDFD] text-[#10754D]" : ""
                                    )}>
                                        <item.icon />
                                        <span className="sr-only">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <main className="w-full">
                <header className="px-8 py-3 flex gap-3 items-center">
                    <div className="flex gap-8 items-center w-full">
                        <Button variant={"secondary"} size={"icon"} onClick={() => setOpen(!open)}>
                            {open ? <ArrowLeft /> : <ArrowRight />}
                        </Button>
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
