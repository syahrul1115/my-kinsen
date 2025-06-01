"use client"

// next
import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

// utils
import { ROLE_TEACHER_TEXT, ROLE_STUDENT_TEXT } from "@/utils/constants"
import { getPenilaian } from "@/utils"

// services
import { serviceGetDashboard } from "@/app/(server)/api/user/services"
import { serviceGetProfileMahasiswa } from "@/app/(server)/api/mahasiswa/services"
import { serviceGetProfileDosen } from "@/app/(server)/api/dosen/services"
import { serviceListMatkuls } from "@/app/(server)/api/matkul/services"
import { serviceListQuesioners } from "@/app/(server)/api/quesioner/services"

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function Profile() {
    const queryGetProfileMahasiswa = useQuery({ queryKey: ["get-profile-mahasiswa"], queryFn: () => serviceGetProfileMahasiswa() })
    const queryGetProfileDosen = useQuery({ queryKey: ["get-profile-dosen"], queryFn: () => serviceGetProfileDosen() })
    
    const queryGetDashboard = useQuery({ queryKey: ["get-dashboard"], queryFn: () => serviceGetDashboard() })
    
    const queryListMatkuls = useQuery({queryKey: ["list-matkuls"], queryFn: () => serviceListMatkuls(1, 100, "")})
    const queryListQuesioners = useQuery({ queryKey: ["list-quesioners"], queryFn: () => serviceListQuesioners(1, 10, queryGetProfileMahasiswa.data?.data.user?.name)})

    React.useEffect(() => { queryListQuesioners.refetch() }, [queryGetProfileMahasiswa.data?.data.user?.name, queryListQuesioners])

    // LOADING VIEW ELEMENTS
    if (queryGetProfileMahasiswa.isLoading || queryGetProfileDosen.isLoading || queryGetDashboard.isLoading) {
        return (
            <section className="border bg-background z-50 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                <h1 className="text-2xl">Loading . . .</h1>
            </section>
        );
    }

    // PROFILE VIEW ELEMENTS
    return (
        <section className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-start gap-8">
                {/* CARD PROFILE USERS (MAHASISWA DAN DOSEN) */}
                {queryGetProfileMahasiswa.data?.data.user?.role === ROLE_STUDENT_TEXT && (
                    <div className="card_profile bg-[#fdfdfd] rounded-2xl w-full md:max-w-[360px] p-8 flex flex-col gap-3">
                        <div className="profile_mahasiswa flex gap-3 items-start">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={queryGetProfileMahasiswa.data?.data.user.image ?? ""} />
                                <AvatarFallback className="font-bold">
                                    {queryGetProfileMahasiswa.data?.data.user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col mt-3">
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 w-full flex gap-3 items-center">
                                    <div className="flex-1">
                                        <p className="text-base md:text-2xl text-slate-600 font-bold">{queryGetProfileMahasiswa.data?.data.user.name}</p>
                                    </div>
                                </div>
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 w-full flex gap-3 items-center">
                                    <div className="flex-1">
                                        <p className="text-xs text-green-600 font-bold">{"Online"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                            <div className="description_mahasiswa space-y-3">
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 py-1 flex gap-3 items-center">
                                    <label htmlFor="">
                                        <div className="title flex">
                                            <p className="text-xs text-slate-600 min-w-24">NIM</p>
                                            <p className="text-xs text-slate-600">:</p>
                                        </div>
                                    </label>
                                    <div className="w-full">
                                        <p className="text-xs text-slate-600">{queryGetProfileMahasiswa.data?.data.profile.nim}</p>
                                    </div>
                                </div>
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 py-1 flex gap-3 items-center ">
                                    <label htmlFor="">
                                        <div className="title flex">
                                            <p className="text-xs text-slate-600 min-w-24">TTL</p>
                                            <p className="text-xs text-slate-600">:</p>
                                        </div>
                                    </label>
                                    <div className="w-full">
                                        <p className="text-xs text-slate-600">{queryGetProfileMahasiswa.data?.data.profile.dateOfBirth}</p>
                                    </div>
                                </div>
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 py-1 flex gap-3 items-center ">
                                    <label htmlFor="">
                                        <div className="title flex">
                                            <p className="text-xs text-slate-600 min-w-24">ALAMAT</p>
                                            <p className="text-xs text-slate-600">:</p>
                                        </div>
                                    </label>
                                    <div className="w-full">
                                        <p className="text-xs text-slate-600">{queryGetProfileMahasiswa.data?.data.profile.address}</p>
                                    </div>
                                </div>
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 py-1 flex gap-3 items-center ">
                                    <label htmlFor="">
                                        <div className="title flex">
                                            <p className="text-xs text-slate-600 min-w-24">PRODI</p>
                                            <p className="text-xs text-slate-600">:</p>
                                        </div>
                                    </label>
                                    <div className="w-full">
                                        <p className="text-xs text-slate-600">{queryGetProfileMahasiswa.data?.data.profile.studyProgram}</p>
                                    </div>
                                </div>
                            </div>
                    </div>
                )}
                {queryGetProfileDosen.data?.data.user?.role === ROLE_TEACHER_TEXT && (
                    <div className="card_profile bg-[#fdfdfd] rounded-2xl w-full md:max-w-[360px] p-8 flex flex-col gap-3">
                        <div className="profile_mahasiswa flex gap-3 items-start">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={queryGetProfileDosen.data?.data.user.image || ""} />
                                <AvatarFallback className="font-bold">
                                    {queryGetProfileDosen.data?.data.user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col mt-3">
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 w-full flex gap-3 items-center">
                                    <div className="flex-1">
                                        <p className="text-slate-600 font-bold">{queryGetProfileDosen.data?.data.user.name}</p>
                                    </div>
                                </div>
                                <div className="field_description_mahasiswa bg-[#fdfdfd] rounded px-3 w-full flex gap-3 items-center">
                                    <div className="flex-1">
                                        <p className="text-xs text-green-600 font-bold">{"Online"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* CARD QUESIONER FOR USER MAHASISWA */}
                {queryGetProfileMahasiswa.data?.data.user?.role === ROLE_STUDENT_TEXT && (
                    <div className="flex flex-col gap-1 w-full overflow-y-auto min-h-[460px]">
                        {
                            queryListMatkuls.data?.data.items.filter(matkul =>
                                queryGetProfileMahasiswa.data?.data.profile.semester === matkul.semester
                            ).map((matkul, idx) =>
                                <Link href={queryListQuesioners.data?.data.items?.filter(quesioner => quesioner.toName === matkul.teacher.name).length ? "" : `/app/quesioner/kuisioner-penilaian-kinerja-dosen-dalam-perkuliahan?mata_kuliah=${matkul.name}&teacher_name=${matkul.teacher.name}&teacher_nbm=${matkul.teacher.nbm}`} key={idx}>
                                    <div className="bg-[#fdfdfd] rounded-2xl p-8 flex gap-8 w-full">
                                        <h3>{matkul.name}</h3>
                                        <p>{matkul.teacher.name}</p>
                                        <input key={idx} type="checkbox" name="done" id="done" checked={queryListQuesioners.data?.data.items?.filter(quesioner => quesioner.toName === matkul.teacher.name).length ? true : false} onChange={() => {}} className="ml-auto" />
                                    </div>
                                </Link>
                            )
                        }
                    </div>
                )}
                {/* CARD DASHBOARD FOR USER DOSEN */}
                {queryGetProfileDosen.data?.data.user?.role === ROLE_TEACHER_TEXT && (
                    <div className="bg-[#fdfdfd] rounded-2xl p-8 flex flex-col gap-8 w-full">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl md:text-2xl font-bold">Kinerja Saya</h1>
                            <p>{Number(queryGetDashboard.data?.data.performance.dosen?.rangking ?? 0) === 1 ? "Peringkat 1" : "-"}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-3">
                            <div>
                                <span className="text-xs text-black/60">Rencana</span>
                                <h1 className={`text-base font-bold
                                    ${getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.purposeValue ?? 0)) === "Baik" && "text-green-400"}
                                    ${getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.purposeValue ?? 0)) === "Cukup" && "text-yellow-400"}
                                    ${getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.purposeValue ?? 0)) === "Kurang" && "text-red-400"}
                                `}>
                                    {getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.purposeValue ?? 0))}
                                </h1>
                             </div>
                            <div>
                                <span className="text-xs text-black/60">Process</span>
                                <h1 className={`text-base font-bold
                                    ${getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.processValue ?? 0)) === "Baik" && "text-green-400"}
                                    ${getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.processValue ?? 0)) === "Cukup" && "text-yellow-400"}
                                    ${getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.processValue ?? 0)) === "Kurang" && "text-red-400"}    
                                `}>
                                    {getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.processValue ?? 0))}
                                </h1>
                            </div>
                            <div>
                                <span className="text-xs text-black/60">Evaluasi</span>
                                <h1 className={`text-base font-bold
                                    ${getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.evaluationValue ?? 0)) === "Baik" && "text-green-400"}
                                    ${getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.evaluationValue ?? 0)) === "Cukup" && "text-yellow-400"}
                                    ${getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.evaluationValue ?? 0)) === "Kurang" && "text-red-400"}
                                `}>
                                    {getPenilaian(Number(queryGetDashboard.data?.data.performance.dosen?.evaluationValue ?? 0))}
                                </h1>
                            </div>
                        </div>
                    </div>
                )}
                {/* CARD DASHBOARD FOR USER ADMIN */}
                {!queryGetProfileMahasiswa.data?.data.user?.role && !queryGetProfileDosen.data?.data.user?.role && (
                    <div className="flex flex-col gap-8 w-full">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#fdfdfd] rounded-2xl p-8 w-full">
                                <h1 className="text-xs md:text-base text-black/60">Mahasiswa</h1>
                                <span className="text-2xl md:text-6xl text-black font-bold">{Number(queryGetDashboard.data?.data.totalCount?.mahasiswa?.count || 0)}</span>
                            </div>
                            <div className="bg-[#fdfdfd] rounded-2xl p-8 w-full">
                                <h1 className="text-xs md:text-base text-black/60">Dosen</h1>
                                <span className="text-2xl md:text-6xl text-black font-bold">{Number(queryGetDashboard.data?.data.totalCount?.dosen?.count || 0)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="bg-[#fdfdfd] rounded-2xl p-8 w-full">
                                <Table>
                                    <TableCaption>A list of your recent new users mahasiswa.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Profil</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Bergabung</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {queryGetDashboard.data?.data.recent.newUsers.map((user, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium">
                                                    <Avatar>
                                                        <AvatarImage src={user.image ?? ""} alt={`avatar-user-${user.name}`} />
                                                        <AvatarFallback className="font-bold">
                                                            {user.name.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell>
                                                    {user.banned ? "Banned" : "Aktif"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {new Date(user.createdAt).toLocaleString('id-ID', { dateStyle: "full", timeStyle: "short" })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {queryGetDashboard.data?.data.performance.rangking.dosen.at(0)?.toName && (
                                <div className="bg-[#fdfdfd] rounded-2xl p-8 w-full md:max-w-sm">
                                    <div className="mb-8 flex flex-col gap-1">
                                        <h3>Peringkat teratas Dosen</h3>
                                        <p className="text-black/60 text-xs">
                                            Selamat <strong>{queryGetDashboard.data?.data.performance.rangking.dosen.at(0)?.toName || "..."}</strong>,
                                            saat ini mendapat peringkat teratas.
                                        </p>
                                    </div>
                                    {queryGetDashboard.data?.data.performance.rangking.dosen.length ?
                                        queryGetDashboard.data?.data.performance.rangking.dosen.sort((a, b) => Number(b.rangking) - Number(a.rangking)).map((user, idx) => (
                                            <div key={idx} className="py-3 flex items-center gap-3 w-full border-b">
                                                <Avatar>
                                                    <AvatarImage src={""} alt={`avatar-user-${user.toName}`} />
                                                    <AvatarFallback className="font-bold">
                                                        {user.toName.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="text-[10px] capitalize">
                                                    <h3>{user.toName}</h3>
                                                </div>
                                                <div className="ml-auto text-xs capitalize font-bold">
                                                    <h1>{user.rangking}</h1>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <h3 className="text-center">Daftar Rangking Teratas dari Dosen.</h3>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
