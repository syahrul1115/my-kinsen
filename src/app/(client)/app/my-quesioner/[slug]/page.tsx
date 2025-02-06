"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Control, Controller, FieldArrayWithId, useFieldArray, useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// services
import { serviceCreateQuesioner, serviceListQuesioners } from "@/app/(server)/api/quesioner/services"

// components
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { serviceGetProfileMahasiswa } from "@/app/(server)/api/mahasiswa/services"
import { serviceListMatkuls } from "@/app/(server)/api/matkul/services"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type Quesioner = {
    question: string;
    value: string;
}

type ModuleQuesioner = {
    type: string;
    quesioners: Quesioner[]
}

type ModuleQuesionerList = {
    moduleQuesioners: ModuleQuesioner[]
}

const initModuleQuesionerList: ModuleQuesioner[] = [
    {
        type: "Rencana Pembelajaran",
        quesioners: [
            {
                question: "1. Dosen menyampaikan tujuan pembelajaran dengan jelas di awal perkuliahan?",
                value: "0"
            },
            {
                question: "2. Dosen menjelaskan silabus dan rencana pembelajaran semester (RPS) secara lengkap?",
                value: "0"
            },
            {
                question: "3. Materi yang disampaikan sesuai dengan rencana pembelajaran semester?",
                value: "0"
            },
            {
                question: "4. Dosen menggunakan bahan ajar yang relevan dan up-to-date?",
                value: "0"
            },
        ]
    },
    {
        type: "Proses Pembelajaran",
        quesioners: [
            {
                question: "1. Dosen mengajar dengan metode yang menarik dan interaktif?",
                value: "0"
            },
            {
                question: "2. Dosen memberikan penjelasan yang mudah dipahami oleh mahasiswa?",
                value: "0"
            },
            {
                question: "3. Dosen memotivasi mahasiswa untuk aktif bertanya dan berdiskusi?",
                value: "0"
            },
            {
                question: "4. Dosen memanfaatkan teknologi (misalnya PowerPoint, video, platform e-learning) selama pembelajaran?",
                value: "0"
            },
            {
                question: "5. Dosen mampu mengelola waktu perkuliahan dengan baik?",
                value: "0"
            },
        ]
    },
    {
        type: "Evaluasi Pembelajaran",
        quesioners: [
            {
                question: "1. Dosen memberikan penilaian berdasarkan indikator yang telah dijelaskan di awal perkuliahan?",
                value: "0"
            },
            {
                question: "2. Dosen memberikan umpan balik atas tugas atau ujian yang telah dikerjakan oleh mahasiswa?",
                value: "0"
            },
            {
                question: "3. Dosen menyelenggarakan evaluasi pembelajaran (tugas, kuis, atau ujian) sesuai jadwal?",
                value: "0"
            },
            {
                question: "4. Kriteria penilaian yang digunakan dosen jelas dan dapat dipahami.?",
                value: "0"
            },
            {
                question: "5. Dosen mengapresiasi hasil kerja mahasiswa dengan objektif?",
                value: "0"
            },
        ]
    }
]

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

// COMPONENT VIEW MODULE QUESIONER

interface Props {
    index: number;
    value: FieldArrayWithId<ModuleQuesionerList, "moduleQuesioners", "id" >;
    control: Control<ModuleQuesionerList>;
}

export const ModuleQuesioner: React.FC<Props> = ({ index, value, control }) => {
    useForm<ModuleQuesioner>({
        defaultValues: value
    });
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={value.type}>
                <AccordionTrigger className="font-bold">{value.type.toUpperCase()}</AccordionTrigger>
                <AccordionContent className="space-y-3">
                    {value.quesioners.map((_, idx) => (
                        <div key={idx} className="border bg-[#FDFDFD] rounded-2xl px-8 py-3 flex gap-3 items-start">
                            <Controller
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        {...field}
                                        disabled
                                        className="question_quesioner bg-transparent font-bold rounded px-3 py-2 w-full"
                                    />
                                )}
                                name={`moduleQuesioners.${index}.quesioners.${idx}.question`}
                                control={control}
                            />
                            <Controller
                                render={({ field }) => (
                                    <div className="answer_quesioner w-48 py-3">
                                        <RadioGroup onValueChange={value => field.onChange(value)} defaultValue="0">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="5" id={`moduleQuesioners.${index}.quesioners.${idx}.value.sangat-setujuh`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.sangat-setujuh`}>Sangat Setujuh</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="4" id={`moduleQuesioners.${index}.quesioners.${idx}.value.setujuh`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.setujuh`}>Setujuh</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="3" id={`moduleQuesioners.${index}.quesioners.${idx}.value.netral`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.netral`}>Netral</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="2" id={`moduleQuesioners.${index}.quesioners.${idx}.value.tidak-setujuh`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.tidak-setujuh`}>Tidak Setujuh</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="1" id={`moduleQuesioners.${index}.quesioners.${idx}.value.sangat-tidak-setujuh`} />
                                                <Label htmlFor={`moduleQuesioners.${index}.quesioners.${idx}.value.sangat-tidak-setujuh`}>Sangat Tidak Setujuh</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                )}
                                name={`moduleQuesioners.${index}.quesioners.${idx}.value`}
                                control={control}
                            />
                        </div>    
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
