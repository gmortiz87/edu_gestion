"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import api from "@/lib/api";
import { X, Save, Loader2, Info } from "lucide-react";

const activitySchema = z.object({
    nombre: z.string().min(1, "El nombre de la actividad es obligatorio"),
    descripcion: z.string().optional().nullable(),
    estado: z.enum(["PLANEADO", "EN_EJECUCION", "FINALIZADO", "SUSPENDIDO"]),
    fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fecha_fin: z.string().min(1, "La fecha de fin es obligatoria"),
    componente_pam: z.enum(["Acompañamiento Institucional", "TIC", "Formación Docente"]),
    actor_dirigido: z.enum([
        "Establecimientos Educativos",
        "Docentes",
        "Directivos Docentes",
        "Estudiantes",
        "Docentes y Directivos Docentes",
        "Docentes y Estudiantes",
        "Comités Escolares de Convivencia",
        "Familias",
        "Otro"
    ]),
    numero_beneficiarios: z.union([z.number(), z.string(), z.null()]).optional(),
    entrega_dotacion: z.boolean(),
    descripcion_dotacion: z.string().optional().nullable(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

interface ActivityModalProps {
    proyectoId: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // Data to pre-fill for editing
}

export default function ActivityModal({ proyectoId, isOpen, onClose, onSuccess, initialData }: ActivityModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ActivityFormValues>({
        resolver: zodResolver(activitySchema),
        values: initialData ? {
            ...initialData,
            // Ensure numbers are strings for the input type="number" if necessary, 
            // but Zod handles union. Here we just spread.
        } : {
            estado: "PLANEADO",
            entrega_dotacion: false,
            numero_beneficiarios: 0,
        },
    });

    const entregaDotacion = watch("entrega_dotacion");

    if (!isOpen) return null;

    const onSubmit = async (data: ActivityFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                ...data,
                proyecto: proyectoId,
                numero_beneficiarios: data.numero_beneficiarios === "" || data.numero_beneficiarios === undefined || data.numero_beneficiarios === null ? 0 : Number(data.numero_beneficiarios),
            };

            if (initialData?.id_actividad) {
                await api.patch(`/actividades/${initialData.id_actividad}/`, payload);
            } else {
                await api.post("/actividades/", payload);
            }

            reset();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error("Error saving activity", err);
            let detail = "No se pudo guardar la actividad. Verifique los campos.";

            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: any } };
                const data = axiosError.response?.data;

                if (data) {
                    if (typeof data === 'string') {
                        detail = data;
                    } else if (data.detail) {
                        detail = data.detail;
                    } else if (typeof data === 'object') {
                        // Extract specific validation errors
                        const firstError = Object.entries(data)[0];
                        if (firstError) {
                            const [field, msg] = firstError;
                            detail = `${field}: ${Array.isArray(msg) ? msg[0] : msg}`;
                        }
                    }
                }
            }
            setError(detail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            {initialData ? "Editar Actividad" : "Nueva Actividad"}
                        </h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Desglose de Proyecto</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre y Descripción */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Nombre de la Actividad *</label>
                            <input
                                {...register("nombre")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900"
                                placeholder="Ej: Capacitación a docentes en TIC"
                            />
                            {errors.nombre && <p className="text-xs text-red-500 font-medium">{errors.nombre.message}</p>}
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Descripción (Opcional)</label>
                            <textarea
                                {...register("descripcion")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900"
                                rows={2}
                                placeholder="Breve detalle de la tarea..."
                            />
                        </div>

                        {/* Clasificación Institucional */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Componente PAM *</label>
                            <select
                                {...register("componente_pam")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                            >
                                <option value="">Seleccione un componente...</option>
                                <option value="Acompañamiento Institucional">Acompañamiento Institucional</option>
                                <option value="TIC">TIC</option>
                                <option value="Formación Docente">Formación Docente</option>
                            </select>
                            {errors.componente_pam && <p className="text-xs text-red-500 font-medium">{errors.componente_pam.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Estado *</label>
                            <select
                                {...register("estado")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                            >
                                <option value="PLANEADO">Planeado</option>
                                <option value="EN_EJECUCION">En Ejecución</option>
                                <option value="FINALIZADO">Finalizado</option>
                                <option value="SUSPENDIDO">Suspendido</option>
                            </select>
                        </div>

                        {/* Beneficiarios y Actores */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">¿A qué actor va dirigido? *</label>
                            <select
                                {...register("actor_dirigido")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                            >
                                <option value="">Seleccione un actor...</option>
                                <option value="Establecimientos Educativos">Establecimientos Educativos</option>
                                <option value="Docentes">Docentes</option>
                                <option value="Directivos Docentes">Directivos Docentes</option>
                                <option value="Estudiantes">Estudiantes</option>
                                <option value="Docentes y Directivos Docentes">Docentes y Directivos Docentes</option>
                                <option value="Docentes y Estudiantes">Docentes y Estudiantes</option>
                                <option value="Comités Escolares de Convivencia">Comités Escolares de Convivencia</option>
                                <option value="Familias">Familias</option>
                                <option value="Otro">Otro</option>
                            </select>
                            {errors.actor_dirigido && <p className="text-xs text-red-500 font-medium">{errors.actor_dirigido.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Número de Beneficiarios *</label>
                            <input
                                type="number"
                                {...register("numero_beneficiarios")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900"
                                placeholder="0"
                            />
                            {errors.numero_beneficiarios && <p className="text-xs text-red-500 font-medium">{errors.numero_beneficiarios.message}</p>}
                        </div>

                        {/* Fechas */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Fecha Inicio *</label>
                            <input
                                type="date"
                                {...register("fecha_inicio")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900"
                            />
                            {errors.fecha_inicio && <p className="text-xs text-red-500 font-medium">{errors.fecha_inicio.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Fecha Fin *</label>
                            <input
                                type="date"
                                {...register("fecha_fin")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900"
                            />
                            {errors.fecha_fin && <p className="text-xs text-red-500 font-medium">{errors.fecha_fin.message}</p>}
                        </div>

                        {/* Dotación */}
                        <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    {...register("entrega_dotacion")}
                                    className="w-4 h-4 text-brand-blue border-slate-300 rounded focus:ring-brand-blue transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">¿Implica entrega de dotación?</label>
                                <p className="text-xs text-slate-500 text-pretty italic">Marque esta casilla si la actividad incluye entrega de bienes o materiales físicos.</p>
                            </div>
                        </div>

                        {entregaDotacion && (
                            <div className="md:col-span-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                <label className="text-sm font-semibold text-slate-700">Descripción de la Dotación</label>
                                <textarea
                                    {...register("descripcion_dotacion")}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900"
                                    rows={2}
                                    placeholder="Ej: 50 tablets, 100 morrales..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-2.5 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue-dark transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {initialData ? "Guardar Cambios" : "Crear Actividad"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
