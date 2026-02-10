"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import api from "@/lib/api";
import { X, Save, Loader2, Calendar } from "lucide-react";

const progressSchema = z.object({
    fecha_corte: z.string().min(1, "La fecha de corte es obligatoria"),
    porcentaje: z.number().min(0).max(100, "El porcentaje no puede ser mayor a 100"),
    descripcion: z.string().min(10, "Debe proporcionar una descripción detallada (mínimo 10 caracteres)"),
});

type ProgressFormValues = z.infer<typeof progressSchema>;

interface ProgressLogModalProps {
    activityId: number;
    activityName: string;
    avances: any[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProgressLogModal({ activityId, activityName, avances, isOpen, onClose, onSuccess }: ProgressLogModalProps) {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProgressFormValues>({
        resolver: zodResolver(progressSchema),
        defaultValues: {
            fecha_corte: new Date().toISOString().split('T')[0],
            porcentaje: 0,
            descripcion: "",
        }
    });

    const onSubmit = async (data: ProgressFormValues) => {
        setLoading(true);
        try {
            await api.post("/avances-actividades/", {
                ...data,
                actividad: activityId
            });
            reset();
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Error logging progress", err);
            alert("No se pudo registrar el avance: " + (err.response?.data?.detail || "Error desconocido"));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Registrar Bitácora de Avance</h3>
                        <p className="text-xs text-brand-blue font-semibold uppercase tracking-wider">{activityName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-brand-blue" />
                                Fecha de Corte
                            </label>
                            <input
                                type="date"
                                {...register("fecha_corte")}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                            />
                            {errors.fecha_corte && <p className="text-xs text-red-500">{errors.fecha_corte.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Porcentaje Actual (0-100)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    {...register("porcentaje", { valueAsNumber: true })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all pr-10"
                                    placeholder="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                            </div>
                            {errors.porcentaje && <p className="text-xs text-red-500">{errors.porcentaje.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Evidencia / Descripción del Logro</label>
                        <textarea
                            {...register("descripcion")}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all resize-none text-sm"
                            placeholder="Describa qué se logró en este periodo, beneficiarios alcanzados, etc..."
                        />
                        {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue-dark transition-all disabled:opacity-50 shadow-lg shadow-brand-blue/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Guardar Avance
                        </button>
                    </div>
                </form>

                {/* Historial de Avances (Bitácora) */}
                <div className="bg-slate-50 border-t border-slate-100 p-6">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                        Historial de Avances (Bitácora)
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-brand-blue font-bold">{avances.length} registros</span>
                    </h4>

                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {avances.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-4">No hay registros previos para esta actividad.</p>
                        ) : (
                            avances.map((av: any) => (
                                <div key={av.id_avance} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-brand-blue uppercase tracking-tighter">{av.fecha_corte}</span>
                                        <span className="text-[10px] font-black bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full">{av.porcentaje}%</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-snug">{av.descripcion}</p>
                                    <p className="text-[10px] text-slate-400 italic">Por: {av.registrado_por_nombre}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
