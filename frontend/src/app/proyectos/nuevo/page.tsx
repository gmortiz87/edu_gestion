import ProjectForm from "@/components/ProjectForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/proyectos"
                    className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-600"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Nuevo Proyecto Educativo</h2>
                    <p className="text-slate-500 text-sm">Registro oficial en el Banco de Proyectos de la Gobernación</p>
                </div>
            </div>

            <ProjectForm />
        </div>
    );
}
