"use client"

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    DropdownMenuCheckboxItem,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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

// icons
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

// hooks
import { useToast } from "@/hooks/use-toast";

// services
import { serviceListDosen } from "@/app/(server)/api/dosen/services";

// types
import { Paged, ResultService } from "@/types/app";
import { Matkul } from "@/types/api";
import { serviceCreateNewMatkul } from "@/app/(server)/api/matkul/services";

const formSchemaCreateNewMatkul = z.object({
    name: z.string()
        .min(2, {
            message: 'Name is not empty!',
        }),
    studyProgram: z.string()
        .min(2, {
            message: "Study Program is not empty!",
        }),
    semester: z.string()
        .min(2, {
            message: 'Semester is not empty!',
        }),
    dosenId: z.string()
        .min(2, {
            message: 'Teacher is not empty!',
        }),
})

const FormDialogMatkul = () => {
    const alert = useToast()
    const queryClient = useQueryClient()

    // STATE DATA PAGINATION
    const [page] = React.useState<number>(1)
    const [pageSize] = React.useState<number>(5)
    const [search, setSearch] = React.useState<string>("")
    
    // STATE DATA DIALOG
    const [open, setOpen] = React.useState<boolean>(false)

    const queryListDosen = useQuery({ queryKey: [""], queryFn: () => serviceListDosen(page, pageSize, search) })

    const mutationCreateNewMatkul = useMutation({ mutationKey: ["create-matkul"], mutationFn: serviceCreateNewMatkul })

    const formCreateNewMatkul = useForm<z.infer<typeof formSchemaCreateNewMatkul>>({
        resolver: zodResolver(formSchemaCreateNewMatkul),
        defaultValues: {
            name: "",
            studyProgram: "",
            semester: "",
            dosenId: ""
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="ml-auto font-bold">BUAT MATA KULIAH</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>BUAT MATA KULIAH</DialogTitle>
                    <DialogDescription>
                        Buat mata kuliah dan sesuaikan pengajarnya. Klik BUAT untuk menyimpan.
                    </DialogDescription>
                </DialogHeader>
                <Form {...formCreateNewMatkul}>
                    <form onSubmit={formCreateNewMatkul.handleSubmit(onSubmitCreateNewMatkul)}>
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
                                    name="studyProgram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Study Program</FormLabel>
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
                                                <Input {...field} />
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
                                <Button type="submit" className="font-bold">BUAT</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

type MatKulTable = {
    id: string;
    name: string;
    semester: string;
    teacher: string;
}

export const columns: ColumnDef<MatKulTable>[] = [
    {
        id: "select",
        header: ({ table }) => table.getIsAllPageRowsSelected() && (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "semester",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Semester
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "teacher",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Pangajar
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

interface DataTableProps<TValue> {
    columns: ColumnDef<MatKulTable, TValue>[]
    data: MatKulTable[]
    previousPage: () => void;
    nextPage: () => void;
}

function DataTable<TValue>({
    columns,
    data,
    previousPage,
    nextPage
}: DataTableProps<TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    })

    return (
        <div className="bg-[#FDFDFD] rounded-2xl flex flex-col gap-3 p-8">
            <div className="flex items-center gap-3 py-4">
                <Input
                    placeholder="Cari nama matkul, pengajar"
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                <FormDialogMatkul />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        previousPage();
                        table.previousPage()
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        nextPage();
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

type MatkulDto = Matkul & {
    teacher: {
        id: string;
        name: string;
        nbm: string;
    }
}

const listMatkuls = async (page: number, pageSize: number, search?: string): Promise<ResultService<Paged<MatkulDto>>> => {
    const params = search ? `?search=${search}&page=${page}&pageSize=${pageSize}` : `?page=${page}&pageSize=${pageSize}`
    const options: RequestInit = {
        method: 'GET'
    }

    const response = await fetch("/api/matkul/all" + params, options)

    return await response.json() as ResultService<Paged<MatkulDto>>;
}

const useServiceListMatkuls = (page: number, pageSize: number, search?: string) => {
    return useQuery({
        queryKey: ['list-matkuls'],
        queryFn: async () => await listMatkuls(page, pageSize, search)
    })
}

export default function MataKuliah() {
    const [page, setPage] = React.useState<number>(1)
    const [pageSize] = React.useState<number>(5)

    const queryListMatkuls = useServiceListMatkuls(page, pageSize)

    const convertMatkulForTable = (items: MatkulDto[]): MatKulTable[] => {
        const newList: MatKulTable[] = []
        items.forEach(i => newList.push({
            id: i.id,
            name: i.name,
            semester: i.semester,
            teacher: i.teacher.name
        }))
        return newList;
    }

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
            <DataTable
                columns={columns}
                data={queryListMatkuls.data ? convertMatkulForTable(queryListMatkuls.data.data.items) : []}
                previousPage={() => page > 1 && setPage(page - 1)}
                nextPage={() => Number(queryListMatkuls.data?.data.totalCount) > pageSize && setPage(page + 1)}
            />
        </section>
    );
}
