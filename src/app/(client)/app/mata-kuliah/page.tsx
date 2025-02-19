"use client"

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";

// components
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// hooks
import { useToast } from "@/hooks/use-toast";

// services
import { serviceListDosen } from "@/app/(server)/api/dosen/services";
import { serviceCreateNewMatkul, serviceDeleteMatkul, serviceListMatkuls, serviceUpdateMatkul } from "@/app/(server)/api/matkul/services";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const formSchemaCreateNewMatkul = z.object({
    name: z.string()
        .min(1, {
            message: 'Name is not empty!',
        }),
    studyProgram: z.string()
        .min(1, {
            message: "Study Program is not empty!",
        }),
    semester: z.string()
        .min(1, {
            message: 'Semester should be minimal 1 until 8!',
        })
        .max(8, {
            message: "Semester should be maximal 8!"
        }),
    dosenId: z.string()
        .min(1, {
            message: 'Teacher is not empty!',
        }),
})

type MatkulDto = {
    name: string;
    studyProgram: string;
    semester: string;
    dosenId: string;
    createdAt: Date;
    id: string;
    updatedAt: Date;
    teacher: {
        id: string;
        name: string;
        nbm: string;
    }
}

const FormDialogMatkul: React.FC<{ title: string; edit?: MatkulDto }> = ({
    title,
    edit
}) => {
    const alert = useToast()
    const queryClient = useQueryClient()

    // STATE DATA PAGINATION
    const [page] = React.useState<number>(1)
    const [pageSize] = React.useState<number>(5)
    const [search, setSearch] = React.useState<string>(edit ? edit.teacher.name : "")
    
    // STATE DATA DIALOG
    const [open, setOpen] = React.useState<boolean>(false)

    const queryListDosen = useQuery({ queryKey: ["list-dosen"], queryFn: () => serviceListDosen(page, pageSize, search) })

    React.useEffect(() => { queryListDosen.refetch() },[search, queryListDosen])

    const mutationCreateNewMatkul = useMutation({ mutationKey: ["create-matkul"], mutationFn: serviceCreateNewMatkul })
    const mutationUpdateMatkul = useMutation({ mutationKey: ["update-matkul"], mutationFn: (
        request: {
            name: string;
            semester: string;
            studyProgram: string;
            dosenId: string;
        }
    ) => serviceUpdateMatkul(edit ? edit.id : "", request) })

    const formCreateNewMatkul = useForm<z.infer<typeof formSchemaCreateNewMatkul>>({
        resolver: zodResolver(formSchemaCreateNewMatkul),
        defaultValues: {
            name: edit ? edit.name : "",
            studyProgram: "Teknik Informatika",
            semester: edit ? edit.semester : "",
            dosenId: edit ? edit.dosenId :  ""
        },
    })
    const onSubmitCreateNewMatkul = async (values: z.infer<typeof formSchemaCreateNewMatkul>) => {
        mutationCreateNewMatkul.mutate({
            name: values.name,
            studyProgram: values.studyProgram,
            semester: values.semester,
            dosenId: values.dosenId
        }, {
            onSuccess: (data) => {
                if (data.status === 201) {
                    queryClient.invalidateQueries({queryKey: ["list-matkuls"]})
                    formCreateNewMatkul.reset()
                    setOpen(false)
                    alert.toast({
                        variant: 'default',
                        title: 'Success',
                        description: 'Anda berhasil membuat mata kuliah baru.',
                    })
                }
            },
            onError: (error) => {
                alert.toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error.message,
                })
            },
        })
    }
    const onSubmitEditMatkul = async (values: z.infer<typeof formSchemaCreateNewMatkul>) => {
        mutationUpdateMatkul.mutate({
            name: values.name,
            studyProgram: values.studyProgram,
            semester: values.semester,
            dosenId: values.dosenId
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["list-matkuls"]})
                formCreateNewMatkul.reset()
                setOpen(false)
                alert.toast({
                    variant: 'default',
                    title: 'Success',
                    description: 'Anda berhasil memperbarui mata kuliah.',
                })
            },
            onError: (error) => {
                alert.toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error.message,
                })
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {edit ? (
                    <Button variant="ghost" className="w-full justify-start px-2">{title}</Button>
                ) : (
                    <Button className="ml-auto font-bold">{title}</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {edit ? "Edit mata kuliah" : "Buat mata kuliah"} dan sesuaikan pengajarnya.
                        Klik {edit ? "EDIT" : "BUAT"} untuk menyimpan.
                    </DialogDescription>
                </DialogHeader>
                <Form {...formCreateNewMatkul}>
                    <form onSubmit={formCreateNewMatkul.handleSubmit(edit ? onSubmitEditMatkul : onSubmitCreateNewMatkul)}>
                        <div className='grid gap-3 py-3'>
                            <div className='space-y-3'>
                                <FormField
                                    control={formCreateNewMatkul.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formCreateNewMatkul.control}
                                    name="semester"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Semester</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={1} max={8} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formCreateNewMatkul.control}
                                    name="dosenId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teacher</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={value => field.onChange(value)} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Pengajar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <Input
                                                            placeholder="Cari nama pengajar"
                                                            value={search}
                                                            onChange={input => setSearch(input.target.value)}
                                                        />
                                                        {queryListDosen.data?.data.items.map(i =>
                                                            <SelectItem id="dosen" key={i.id} value={i.id}>
                                                                <div className="flex flex-col items-start">
                                                                    <h3>{i.name}</h3>
                                                                </div>
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="font-bold">{edit ? "EDIT" : "BUAT"}</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function MataKuliah() {
    const queryClient = useQueryClient()
    const alert = useToast()

    const [page, setPage] = React.useState<number>(1)
    const [pageSize] = React.useState<number>(5)
    const [search, setSearch] = React.useState<string>("")

    const queryListMatkuls = useQuery({ queryKey: ['list-matkuls'], queryFn: () => serviceListMatkuls(page, pageSize, search) })

    React.useEffect(() => { queryListMatkuls.refetch() }, [search, queryListMatkuls])

    const mutationDeleteMatkul = useMutation({ mutationKey: ["delete-matkul"], mutationFn: serviceDeleteMatkul,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["list-matkuls"] })
            alert.toast({
                variant: 'default',
                title: 'Success',
                description: 'Anda berhasil menghapus mata kuliah.',
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

    // LOADING VIEW ELEMENTS
    if (queryListMatkuls.isLoading) {
        return (
            <section className="border bg-background z-50 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                <h1 className="text-2xl">Loading . . .</h1>
            </section>
        );
    }

    // VIEW MATA KULIAH ELEMENTS
    return (
        <section className="flex flex-col gap-8 p-8">
            <div className="bg-[#FDFDFD] rounded-2xl px-8 py-10 space-y-8">
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Cari..."
                        name="search"
                        value={search}
                        onChange={input => setSearch(input.target.value)}
                        className="md:max-w-sm"
                    />
                    <FormDialogMatkul title="BUAT MATA KULIAH" />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pengajar</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead>Program Studi</TableHead>
                            <TableHead className="text-right">Dibuat</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {queryListMatkuls.data?.data.items.map((mk, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src="" alt={`avatar-user-${mk.teacher.name}`} />
                                            <AvatarFallback>{mk.teacher.name.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <p>{mk.teacher.name}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {mk.name}
                                </TableCell>
                                <TableCell>
                                    {mk.semester}
                                </TableCell>
                                <TableCell>
                                    {mk.studyProgram}
                                </TableCell>
                                <TableCell className="text-right">
                                    {new Date(mk.createdAt).toLocaleDateString('id-ID', { dateStyle: "full" })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <FormDialogMatkul title="Edit" edit={mk} />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" className="w-full justify-start px-2">
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah anda yakin ingin menghapus mata kuliah {mk.name}?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => mutationDeleteMatkul.mutate(mk.id)}>
                                                                Yakin
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => Number(queryListMatkuls.data?.data.currentPage) > 1 && setPage(page - 1)}
                        disabled={Number(queryListMatkuls.data?.data.currentPage) < 2}
                    >
                        Halaman sebelumnya
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => Number(queryListMatkuls.data?.data.totalCount) > pageSize && setPage(page + 1)}
                        disabled={Number(queryListMatkuls.data?.data.totalCount) < pageSize}
                    >
                        Halaman berikutnya
                    </Button>
                </div>
            </div>
        </section>
    );
}
