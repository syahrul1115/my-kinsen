"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// services
import { serviceCreateQuesioner, serviceListQuesioners } from "@/app/(server)/api/quesioner/services"
import { serviceGetProfileMahasiswa } from "@/app/(server)/api/mahasiswa/services"
import { serviceListMatkuls } from "@/app/(server)/api/matkul/services"

// components
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ModuleQuesioner } from "@/components/ui/module-quesioner"

// hooks
import { useToast } from "@/hooks/use-toast"

// utils
import { initModuleQuesionerList } from "@/utils"

// types
import { ModuleQuesionerList, Quesioner } from "@/types/app"

export default function MySimpleQuesioner() {
    const alert = useToast()
    const router = useRouter()
    const queryClient = useQueryClient()

    // STATE DATA PAGINATION
    const [page] = React.useState<number>(1)
    const [pageSize] = React.useState<number>(5)
    const [search, setSearch] = React.useState<string>("")

    // STATE DATA FORM
    const [dosenName, setDosenName] = React.useState<string>("")
    const [dosenNbm, setDosenNbm] = React.useState<string>("")
    const [matkul, setMatkul] = React.useState<string>("")
    const [purpose, setPurpose] = React.useState<string>("0")
    const [process, setProcess] = React.useState<string>("0")
    const [evaluation, setEvaluation] = React.useState<string>("0")


    const queryGetProfile = useQuery({queryKey: ["get-profile"], queryFn: () => serviceGetProfileMahasiswa()})
    const queryListMatkuls = useQuery({queryKey: ["list-matkuls"], queryFn: () => serviceListMatkuls(page, pageSize, search)})

    const queryListQuesioners = useQuery({ queryKey: ["list-quesioners"], queryFn: () => serviceListQuesioners(page, pageSize, queryGetProfile.data?.data.profile.nim || "") })
    const mutationQuesioner = useMutation({ mutationKey: ["create-new-quesioner"], mutationFn: serviceCreateQuesioner })

    // STATE DATA TO CONTROL LIST MODULE IN FORM
    const { control, handleSubmit } = useForm<ModuleQuesionerList>({
        defaultValues: {
            moduleQuesioners: initModuleQuesionerList
        }
    })
    const { fields } = useFieldArray({
        control,
        name: "moduleQuesioners"
    })

    // GET DATA AMOUNT NILAI PER MODULE QUESIONER
    const getQuesionerAmountPurpose= (data: Quesioner[]) => {
        let newAmountRencana = 0
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            newAmountRencana += Number(element.value)
        }
        setPurpose(newAmountRencana.toString())
    }
    const getQuesionerAmountProcess = (data: Quesioner[]) => {
        let newAmountProses = 0
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            newAmountProses += Number(element.value)
        }
        setProcess(newAmountProses.toString())
    }
    const getQuesionerAmountEvaluation = (data: Quesioner[]) => {
        let newAmountEvaluasi = 0
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            newAmountEvaluasi += Number(element.value)
        }
        setEvaluation(newAmountEvaluasi.toString())
    }

    // METHOD TO SUBMIT DATA
    const submit = async (data: ModuleQuesionerList) => {
        for (let index = 0; index < data.moduleQuesioners.length; index++) {
            const element = data.moduleQuesioners[index];
            if (element.type === "Rencana Pembelajaran") {
                getQuesionerAmountPurpose(element.quesioners)
            }
            if (element.type === "Proses Pembelajaran") {
                getQuesionerAmountProcess(element.quesioners)
            }
            if (element.type === "Evaluasi Pembelajaran") {
                getQuesionerAmountEvaluation(element.quesioners)
            }
        }

        const request = {
            fromName: queryGetProfile.data?.data.user.name ?? "",
            fromNim: queryGetProfile.data?.data.profile.nim ?? "",
            toName: dosenName,
            toNbm: dosenNbm,
            purposeValue: purpose,
            processValue: process,
            evaluationValue: evaluation,
            descriptionLiked: "",
            descriptionSuggestion: "",
        }

        mutationQuesioner.mutate(request, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["list-quesioners"]})
                router.push("/app/my-quesioner")
                alert.toast({
                    variant: 'default',
                    title: 'Success',
                    description: `Kamu berhasil mengirim kuisioner.`,
                })
            },
            onError: (error) => {
                alert.toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error.message,
                })
            }
        })

    }

    // LOADING VIEW ELEMENTS
    if (queryGetProfile.isLoading || queryListMatkuls.isLoading) {
        return (
            <section className="border bg-background z-50 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                <h1 className="text-2xl">Loading . . .</h1>
            </section>
        );
    }
    
    // VIEW FORM DATA ELEMENTS
    return (
        <section className="bg-[#FDFDFD] rounded-2xl px-8 py-16 m-8">
            <form onSubmit={handleSubmit(submit)}>
                <div className="flex flex-col gap-16">
                    <div className="flex items-center justify-between gap-3">
                        <Select
                            onValueChange={value => {
                                setMatkul(value);
                                setDosenName(
                                    queryListMatkuls.data?.data.items.find(i => value === i.name)?.teacher.name ?? ""
                                )
                                setDosenNbm(
                                    queryListMatkuls.data?.data.items.find(i => value === i.name)?.teacher.nbm ?? ""
                                )
                            }}
                            value={matkul}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="PILIH MATA KULIAH" />
                            </SelectTrigger>
                            <SelectContent className="max-w-sm">
                                <div className="w-[374px]">
                                    <Input
                                        placeholder="CARI MATA KULIAH"
                                        value={search}
                                        onChange={input => setSearch(input.target.value)}
                                    />
                                </div>
                                {queryListMatkuls.data?.data.items.filter(i =>
                                    queryGetProfile.data?.data.profile.studyProgram === i.studyProgram &&
                                    queryGetProfile.data?.data.profile.semester === i.semester &&
                                    queryListQuesioners.data?.data.items.find(q => q.toName === i.teacher.name)?.toName !== i.teacher.name
                                ).map(i =>
                                    <SelectItem id="matkul" key={i.id} value={i.name}>
                                        {i.name.toUpperCase()}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Dosen Pengajar"
                            defaultValue={dosenName}
                            disabled
                            className="text-black"
                        />
                    </div>
                    <ul className="space-y-16">
                        {fields.map((item, index) => (
                            <ModuleQuesioner
                                key={item.id}
                                control={control}
                                index={index}
                                value={item}
                            />
                        ))}
                    </ul>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="descriptionLiked">Apa yang Anda menyukai cara dosen mengajar?</Label>
                        <Textarea placeholder="Type your message here." id="descriptionLiked" />
                    </div>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="descriptionSuggestion">Apa yang perlu ditingkatkan dari kinerja dosen?</Label>
                        <Textarea placeholder="Type your message here." id="descriptionSuggestion" />
                    </div>
                    <Button type="submit" disabled={mutationQuesioner.isPending} className="my-10 w-full font-bold">
                        {mutationQuesioner.isPending ? "LOADING..." : "KIRIM KUISIONER"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
