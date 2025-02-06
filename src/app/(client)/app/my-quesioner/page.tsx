"use client"

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

// services
import { serviceGetProfileMahasiswa } from "@/app/(server)/api/mahasiswa/services";
import { serviceListQuesioners } from "@/app/(server)/api/quesioner/services";
import { serviceGetProfileDosen } from "@/app/(server)/api/dosen/services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

export default function MyQuesioner() {
    // STATE DATA PAGINATION
    const [page, setPage] = React.useState<number>(1)
    const [pageSize] = React.useState<number>(5)
    const [search, setSearch] = React.useState<string>("")

    const [securePurpose, setSecurePurpose] = React.useState<boolean>(true)
    const [secureProcess, setSecureProcess] = React.useState<boolean>(true)
    const [secureEvaluation, setSecureEvaluation] = React.useState<boolean>(true)

    const queryGetProfileMahasiswa = useQuery({ queryKey: ["get-profile-mahasiswa"], queryFn: () => serviceGetProfileMahasiswa() })
    const queryGetProfileDosen = useQuery({ queryKey: ["get-profile-dosen"], queryFn: () => serviceGetProfileDosen() })

    const queryListQuesioners = useQuery({ queryKey: ["list-quesioners"], queryFn: () => serviceListQuesioners(page, pageSize, search) })

    React.useEffect(() => {
        const nimMahasiswa = queryGetProfileMahasiswa.data?.data.profile?.nim ?? ""
        setSearch(nimMahasiswa)
        queryListQuesioners.refetch()
    }, [
        queryGetProfileMahasiswa.data?.data.profile?.nim,
        queryListQuesioners
    ])

    React.useEffect(() => {
        const nbmDosen = queryGetProfileDosen.data?.data.profile?.nbm ?? ""
        setSearch(nbmDosen)
        queryListQuesioners.refetch()
    }, [
        queryGetProfileDosen.data?.data.profile?.nbm,
        queryListQuesioners
    ])

    // LOADING VIEW ELEMENTS
    if (
        queryListQuesioners.isLoading ||
        queryGetProfileMahasiswa.isLoading ||
        queryGetProfileDosen.isLoading
    ) {
        return (
            <section className="border bg-background z-50 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                <h1 className="text-2xl">Loading . . .</h1>
            </section>
        );
    }

    // VIEW MATA KULIAH ELEMENTS
    return (
        <section className="flex flex-col gap-8 p-8">
            {Number(queryListQuesioners.data?.data.totalCount) > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {queryListQuesioners.data?.data.items.map((i, idx) => (
                        <div key={idx} className="bg-[#fdfdfd] rounded-2xl p-8 flex flex-col gap-8">
                            <div className="flex items-center gap-3">
                                <Avatar className="border h-11 w-11">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="font-bold">{queryGetProfileMahasiswa.data?.status === 200 ? i.toName.slice(0, 2).toUpperCase() : i.fromName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <h3 className="text-xs font-bold">{queryGetProfileMahasiswa.data?.status === 200 ? i.toName : i.fromName}</h3>
                                    <p className="text-[10px] text-black/60">{queryGetProfileMahasiswa.data?.status === 200 ? i.toNbm : i.fromNim}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h1 className="text-black/60">Rencana</h1>
                                    <p className={cn("text-2xl font-bold", queryGetProfileMahasiswa.data?.status === 200 ? "cursor-pointer" : "")}
                                        onClick={() => queryGetProfileMahasiswa.data?.status === 200 ? setSecurePurpose(!securePurpose) : null}
                                    >
                                        {securePurpose ? "..." : i.purposeValue}
                                    </p>
                                </div>
                                <div>
                                    <h1 className="text-black/60">Proses</h1>
                                    <p className={cn("text-2xl font-bold", queryGetProfileMahasiswa.data?.status === 200 ? "cursor-pointer" : "")}
                                        onClick={() => queryGetProfileMahasiswa.data?.status === 200 ? setSecureProcess(!secureProcess) : null}
                                    >
                                        {secureProcess ? "..." : i.processValue}
                                    </p>
                                </div>
                                <div>
                                    <h1 className="text-black/60">Evaluasi</h1>
                                    <p className={cn("text-2xl font-bold", queryGetProfileMahasiswa.data?.status === 200 ? "cursor-pointer" : "")}
                                        onClick={() => queryGetProfileMahasiswa.data?.status === 200 ? setSecureEvaluation(!secureEvaluation) : null}
                                    >
                                        {secureEvaluation ? "..." : i.purposeValue}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#fdfdfd] rounded-2xl p-8 flex flex-col gap-8 w-full">
                    <h1 className="text-center">Saat ini anda tidak memiliki kuisioner.</h1>
                </div>
            )}
            <div className="flex items-center justify-center gap-10">
                <Button variant="secondary" disabled={Number(queryListQuesioners.data?.data.currentPage) < 2}
                    onClick={() => Number(queryListQuesioners.data?.data.currentPage) > 1 && setPage(Number(queryListQuesioners.data?.data.currentPage) - 1)}
                >
                    SEBELUM
                </Button>
                <Button variant="secondary" disabled={Number(queryListQuesioners.data?.data.totalCount) < Number(queryListQuesioners.data?.data.pageSize)}
                    onClick={() => Number(queryListQuesioners.data?.data.totalCount) > Number(queryListQuesioners.data?.data.pageSize) && setPage(Number(queryListQuesioners.data?.data.currentPage) + 1)}
                >
                    BERIKUT
                </Button>
            </div>
        </section>
    );
}
