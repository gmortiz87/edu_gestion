"use client";

import { useParams } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function EditProjectPage() {
    const { id } = useParams();

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/proyectos"
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-blue transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Editar Proyecto</h2>
                    <p className="text-slate-500 text-sm">Modifique los parámetros generales del proyecto</p>
                </div>
            </div>

            <ProjectForm projectId={Number(id)} />
        </div>
    );
}
