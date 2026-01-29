"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Plus, Search, Filter, FileText, Edit, Trash2 } from "lucide-react";

interface Proyecto {
    id_proyecto: number;
    codigo: string;
    nombre: string;
    linea_nombre: string;
    vigencia_anio: number;
    estado: string;
    responsable_nombre: string;
    avance_cargue_pct: number;
}

export default function ProyectosPage() {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProyectos() {
            try {
                const res = await api.get("/proyectos/");
                setProyectos(res.data.results || res.data);
            } catch (err) {
                console.error("Error fetching projects", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProyectos();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Inventario de Proyectos</h2>
                    <p className="text-slate-500 text-sm">Gestione y supervise los proyectos educativos del departamento</p>
                </div>

                <Link
                    href="/proyectos/nuevo"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue-dark transition-all shadow-lg shadow-brand-blue/20"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Proyecto
                </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por código o nombre..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                    <Filter className="w-4 h-4" />
                    Filtros
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Código / Proyecto</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Línea & Vigencia</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Avance</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Cargando proyectos...</td>
                            </tr>
                        ) : proyectos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No se encontraron proyectos registrados.</td>
                            </tr>
                        ) : (
                            proyectos.map((proyecto) => (
                                <tr key={proyecto.id_proyecto} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-brand-blue leading-none mb-1 tracking-widest">{proyecto.codigo}</span>
                                            <span className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-1">{proyecto.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-700 line-clamp-1">{proyecto.linea_nombre}</span>
                                            <span className="text-xs text-slate-400">{proyecto.vigencia_anio}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{proyecto.responsable_nombre}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${getStatusStyles(proyecto.estado)}`}>
                                            {proyecto.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 w-40">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-brand-blue h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${proyecto.avance_cargue_pct || 0}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{proyecto.avance_cargue_pct || 0}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-400">
                                            <Link href={`/proyectos/${proyecto.id_proyecto}`} className="p-1.5 hover:bg-slate-100 hover:text-brand-blue rounded-lg transition-all" title="Ver Detalles">
                                                <FileText className="w-4 h-4" />
                                            </Link>
                                            <button className="p-1.5 hover:bg-slate-100 hover:text-amber-600 rounded-lg transition-all" title="Editar">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 hover:bg-slate-100 hover:text-red-600 rounded-lg transition-all" title="Eliminar">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function getStatusStyles(estado: string) {
    switch (estado) {
        case 'EN_EJECUCION': return 'bg-amber-100 text-amber-700 border border-amber-200';
        case 'FINALIZADO': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
        case 'PLANEADO': return 'bg-blue-100 text-blue-700 border border-blue-200';
        case 'SUSPENDIDO': return 'bg-rose-100 text-rose-700 border border-rose-200';
        default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
}
