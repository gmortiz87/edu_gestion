"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ChevronLeft,
    Target,
    User,
    Building2,
    DollarSign,
    Clock,
    AlertCircle,
    Plus,
    CheckCircle2,
    Calendar as CalendarIcon,
    ChevronRight,
    FolderKanban,
    type LucideIcon
} from "lucide-react";
import ActivityModal from "@/components/ActivityModal";

interface Meta {
    id_meta: number;
    nombre_corto: string;
}

interface MetaRel {
    meta: Meta;
    valor_planeado: number;
    valor_logrado: number;
    observacion: string;
}

interface Actividad {
    id_actividad: number;
    nombre: string;
    descripcion: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
    componente_pam: string;
    actor_dirigido: string;
    numero_beneficiarios: number;
    total_ejecutado: number;
}

interface ProyectoDetail {
    id_proyecto: number;
    codigo: string;
    nombre: string;
    linea_nombre: string;
    vigencia_anio: number;
    responsable_nombre: string;
    apoyo_tecnico_nombre: string;
    entidad_aliada_nombre: string;
    codigo_bpin: string;
    codigo_pi: string;
    apropiacion_definitiva: string;
    adicion: string;
    recursos: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
    avance_cargue_pct: number;
    metas: MetaRel[];
    actividades: Actividad[];
}

export default function ProjectDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [proyecto, setProyecto] = useState<ProyectoDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

    const fetchDetail = useCallback(async () => {
        try {
            const res = await api.get(`/proyectos/${id}/`);
            setProyecto(res.data);
        } catch (err) {
            console.error("Error fetching project detail", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetail();
    }, [id, fetchDetail]);

    if (loading) return <div className="p-8 text-center text-slate-500 italic">Cargando detalles del proyecto...</div>;
    if (!proyecto) return <div className="p-8 text-center text-red-500">Proyecto no encontrado.</div>;

    const totalPresupuesto = (parseFloat(proyecto.apropiacion_definitiva || "0") + parseFloat(proyecto.adicion || "0")).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors text-sm font-medium"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Volver al inventario
                    </button>
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{proyecto.nombre}</h2>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusStyles(proyecto.estado)}`}>
                            {proyecto.estado}
                        </span>
                    </div>
                    <p className="text-slate-500 flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-blue">{proyecto.codigo_pi}</span>
                        • {proyecto.linea_nombre} ({proyecto.vigencia_anio})
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-500">Progreso Total</p>
                        <p className="text-2xl font-black text-brand-blue">{proyecto.avance_cargue_pct || 0}%</p>
                    </div>
                    <div className="w-20 h-20 relative">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-slate-100 stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                            <circle
                                className="text-brand-blue stroke-current transition-all duration-1000 ease-out"
                                strokeWidth="8"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * (proyecto.avance_cargue_pct || 0)) / 100}
                                strokeLinecap="round"
                                fill="transparent"
                                r="40" cx="50" cy="50"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Metadata */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-brand-blue" />
                            Información del Proyecto
                        </h4>

                        <div className="grid grid-cols-1 gap-5">
                            <InfoItem icon={User} label="Responsable Principal" value={proyecto.responsable_nombre} />
                            {proyecto.apoyo_tecnico_nombre && <InfoItem icon={User} label="Apoyo Técnico" value={proyecto.apoyo_tecnico_nombre} />}
                            <InfoItem icon={Building2} label="BPIN" value={proyecto.codigo_bpin || "N/A"} />
                            <InfoItem icon={DollarSign} label="Presupuesto Total" value={totalPresupuesto} subValue={`Fuente: ${proyecto.recursos || 'No definida'}`} />
                            {proyecto.entidad_aliada_nombre && <InfoItem icon={Building2} label="Entidad Aliada" value={proyecto.entidad_aliada_nombre} />}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-brand-blue" />
                            Cronograma
                        </h4>
                        <div className="mt-4 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Inicio</span>
                                <span className="font-bold text-slate-900">{proyecto.fecha_inicio}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Cierre Estimado</span>
                                <span className="font-bold text-slate-900">{proyecto.fecha_fin}</span>
                            </div>
                            <div className="pt-2">
                                <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-brand-blue h-full rounded-full w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activities & Metas */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Activities Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <FolderKanban className="w-5 h-5 text-brand-blue" />
                                Actividades y Tareas
                            </h4>
                            <button
                                onClick={() => setIsActivityModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-brand-blue border border-brand-blue/20 rounded-lg text-xs font-bold hover:bg-brand-blue hover:text-white transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Nueva Actividad
                            </button>
                        </div>
                        <div className="p-0">
                            {proyecto.actividades && proyecto.actividades.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {proyecto.actividades.map((act) => (
                                        <div key={act.id_actividad} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 p-1.5 rounded-lg ${act.estado === 'FINALIZADO' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm group-hover:text-brand-blue transition-colors">{act.nombre}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">{act.componente_pam}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium italic flex items-center gap-1">
                                                            <CalendarIcon className="w-3 h-3" />
                                                            {act.fecha_fin}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Avance</p>
                                                    <p className="text-sm font-black text-brand-blue">{act.total_ejecutado || 0}%</p>
                                                </div>
                                                <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-brand-blue transition-all" title="Gestionar Avance">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center space-y-3">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                        <Clock className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-medium">No hay actividades registradas aún</p>
                                    <p className="text-xs text-slate-400">Comience desglosando el proyecto en tareas para realizar el seguimiento.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metas Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <Target className="w-5 h-5 text-brand-red" />
                                Impacto y Metas
                            </h4>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {proyecto.metas && proyecto.metas.length > 0 ? (
                                    proyecto.metas.map((m) => (
                                        <div key={m.meta.id_meta} className="space-y-2">
                                            <div className="flex justify-between items-start gap-4">
                                                <p className="text-sm font-bold text-slate-800 leading-tight">{m.meta.nombre_corto}</p>
                                                <span className="text-xs font-black text-brand-blue shrink-0">
                                                    {m.valor_logrado} / {m.valor_planeado}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-brand-red h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${(m.valor_logrado / m.valor_planeado) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm italic text-center py-4">No se han asociado metas del plan de desarrollo.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ActivityModal
                proyectoId={Number(id)}
                isOpen={isActivityModalOpen}
                onClose={() => setIsActivityModalOpen(false)}
                onSuccess={fetchDetail}
            />
        </div>
    );
}

function InfoItem({ icon: Icon, label, value, subValue }: { icon: LucideIcon, label: string, value: string, subValue?: string }) {
    return (
        <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-blue/5 transition-colors">
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-brand-blue transition-colors" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="font-bold text-slate-900">{value}</p>
                {subValue && <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>}
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
