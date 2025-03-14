import { ModuleQuesioners } from "@/types/app"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const initModuleQuesionerList: ModuleQuesioners[] = [
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

export const getPenilaian = (nilai: number) => {
    switch (nilai !== null) {
        case nilai > 0.8:
            return "Baik";
        case nilai > 0.5 && nilai < 0.8:
            return "Cukup";
        case nilai > 0 && nilai < 0.5:
            return "Kurang";
        default:
            return "-";
    }
} 
