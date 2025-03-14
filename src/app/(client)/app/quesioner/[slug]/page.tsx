"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"

// services
import { serviceCreateQuesioner } from "@/app/(server)/api/quesioner/services"
import { serviceGetProfileMahasiswa } from "@/app/(server)/api/mahasiswa/services"

// components
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ModuleQuesioner } from "@/components/ui/module-quesioner"

// hooks
import { useToast } from "@/hooks/use-toast"

// utils
import { initModuleQuesionerList } from "@/utils"

// types
import { ModuleQuesionerList } from "@/types/app"

export default function MySimpleQuesioner() {
    const alert = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()

    // STATE DATA FORM
    const [dosenName, setDosenName] = React.useState<string>("")
    const [dosenNbm, setDosenNbm] = React.useState<string>("")
    const [matkul, setMatkul] = React.useState<string>("")
    const [purpose, setPurpose] = React.useState<string>("")
    const [process, setProcess] = React.useState<string>("")
    const [evaluation, setEvaluation] = React.useState<string>("")
    const [descriptionLiked, setDescriptionLiked] = React.useState<string>("")
    const [descriptionSuggestion, setDescriptionSuggestion] = React.useState<string>("")


    const queryGetProfile = useQuery({queryKey: ["get-profile"], queryFn: () => serviceGetProfileMahasiswa()})

    const mutationQuesioner = useMutation({ mutationKey: ["create-new-quesioner"], mutationFn: serviceCreateQuesioner })

    React.useEffect(() => {
        setMatkul(searchParams.get("mata_kuliah") ?? "")
        setDosenName(searchParams.get("teacher_name") ?? "")
        setDosenNbm(searchParams.get("teacher_nbm") ?? "")
    }, [searchParams])
    
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

    const getDataAllAmount = React.useCallback((data: ModuleQuesionerList) => {
        for (let index = 0; index < data.moduleQuesioners.length; index++) {
            const element = data.moduleQuesioners[index];
            if (element.type === "Rencana Pembelajaran") {
                let newAmountRencana = 0
                for (let index = 0; index < element.quesioners.length; index++) {
                    const elementQ = element.quesioners[index];
                    newAmountRencana += Number(elementQ.value)
                }
                setPurpose(Number(newAmountRencana / 20).toString())
            }
            if (element.type === "Proses Pembelajaran") {
                let newAmountProses = 0
                for (let index = 0; index < element.quesioners.length; index++) {
                    const elementQ = element.quesioners[index];
                    newAmountProses += Number(elementQ.value)
                }
                setProcess(Number(newAmountProses / 25).toString())
            }
            if (element.type === "Evaluasi Pembelajaran") {
                let newAmountEvaluasi = 0
                for (let index = 0; index < element.quesioners.length; index++) {
                    const elementQ = element.quesioners[index];
                    newAmountEvaluasi += Number(elementQ.value)
                }
                setEvaluation(Number(newAmountEvaluasi / 25).toString())
            }
        }
    }, [])

    // METHOD TO SUBMIT DATA
    const submit = async (data: ModuleQuesionerList) => {
        getDataAllAmount(data)

        if (!dosenName || !matkul || !purpose || !process || !evaluation) {
            alert.toast({
                variant: 'destructive',
                title: 'Error',
                description: "Terdapat kolom yang masih kosong!",
            })
            return;
        }
        
        if (purpose === "0" || process === "0" || evaluation === "0") {
            alert.toast({
                variant: 'destructive',
                title: 'Error',
                description: "Terjadi kesalahan. Mohon coba kirim kembali lagi!",
            })
            return;
        }
        
        const request = {
            fromName: queryGetProfile.data?.data.user.name ?? "",
            fromNim: queryGetProfile.data?.data.profile.nim ?? "",
            toName: dosenName,
            toNbm: dosenNbm,
            purposeValue: purpose,
            processValue: process,
            evaluationValue: evaluation,
            descriptionLiked: descriptionLiked,
            descriptionSuggestion: descriptionSuggestion,
            rangking: Number((Number(purpose) + Number(process) + Number(evaluation)) / 3).toString()
        }

        mutationQuesioner.mutate(request, {
            onSuccess: () => {
                router.push("/app")
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
    if (queryGetProfile.isLoading) {
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
                    <div className="flex flex-col md:flex-row items-start md:justify-center justify-between gap-8">
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="matkul">
                                Mata Kuliah <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                placeholder="Mata Kuliah"
                                defaultValue={matkul}
                                disabled
                                className="text-black"
                            />
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="pengajar">
                                Pengajar <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                placeholder="Pengajar"
                                defaultValue={dosenName}
                                disabled
                                className="text-black"
                            />
                        </div>
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
                        <Textarea
                            placeholder="Tulis disini..."
                            id="descriptionLiked"
                            value={descriptionLiked}
                            onChange={input => setDescriptionLiked(input.target.value)}
                        />
                    </div>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="descriptionSuggestion">Apa yang perlu ditingkatkan dari kinerja dosen?</Label>
                        <Textarea
                            placeholder="Tulis disini..."
                            id="descriptionSuggestion"
                            value={descriptionSuggestion}
                            onChange={input => setDescriptionSuggestion(input.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={mutationQuesioner.isPending} className="my-10 w-full font-bold">
                        {mutationQuesioner.isPending ? "LOADING..." : "KIRIM KUISIONER"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
