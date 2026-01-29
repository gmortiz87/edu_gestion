"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Save, X, Loader2 } from "lucide-react";

const projectSchema = z.object({
    codigo: z.string().regex(/^\d{6}$/, "El Código PI debe tener 6 dígitos numéricos"),
    nombre: z.string().min(1, "El nombre es obligatorio"),
    linea_vigencia: z.number(),
    responsable: z.number(),
    apoyo_tecnico: z.number().optional().nullable(),
    codigo_bpin: z.string().regex(/^\d{13}$/, "El código BPIN debe tener 13 dígitos numéricos").optional().nullable().or(z.literal("")),
    apropiacion_definitiva: z.union([z.number(), z.string(), z.null()]).optional().nullable(),
    adicion: z.union([z.number(), z.string(), z.null()]).optional().nullable(),
    recursos: z.string().optional().nullable(),
    entidad_aliada: z.number().optional().nullable(),
    estado: z.enum(["PLANEADO", "EN_EJECUCION", "FINALIZADO", "SUSPENDIDO"]),
    fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fecha_fin: z.string().min(1, "La fecha de fin es obligatoria"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface LineaVigencia {
    id_linea_vigencia: number;
    linea_nombre: string;
    vigencia_anio: number;
}

interface EntidadAliada {
    id_entidad: number;
    nombre: string;
}

export default function ProjectForm({ projectId }: { projectId?: number }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [lineas, setLineas] = useState<LineaVigencia[]>([]);
    const [usuarios, setUsuarios] = useState<{ id_usuario: number; nombre: string; rol: string }[]>([]);
    const [entidades, setEntidades] = useState<EntidadAliada[]>([]);
    const [isCreatingEntity, setIsCreatingEntity] = useState(false);
    const [newEntityName, setNewEntityName] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            estado: "PLANEADO",
        },
    });

    const selectedLineaId = watch("linea_vigencia");
    const activeLinea = lineas.find(l => l.id_linea_vigencia === selectedLineaId);
    const isEstrategia = activeLinea?.linea_nombre?.toUpperCase().includes("ESTRATEGIA");

    useEffect(() => {
        async function loadData() {
            try {
                const [lineasRes, usuariosRes, entidadesRes] = await Promise.all([
                    api.get("/lineas-vigencias/"),
                    api.get("/usuarios/"),
                    api.get("/entidades-aliadas/"),
                ]);
                setLineas(lineasRes.data.results || lineasRes.data);
                setUsuarios(usuariosRes.data.results || usuariosRes.data);
                setEntidades(entidadesRes.data.results || entidadesRes.data);

                // If editing, load project data
                if (projectId) {
                    const projectRes = await api.get(`/proyectos/${projectId}/`);
                    const p = projectRes.data;
                    reset({
                        codigo: p.codigo,
                        nombre: p.nombre,
                        linea_vigencia: p.linea_vigencia,
                        responsable: p.responsable,
                        apoyo_tecnico: p.apoyo_tecnico,
                        codigo_bpin: p.codigo_bpin,
                        apropiacion_definitiva: p.apropiacion_definitiva,
                        adicion: p.adicion,
                        recursos: p.recursos,
                        entidad_aliada: p.entidad_aliada,
                        estado: p.estado,
                        fecha_inicio: p.fecha_inicio,
                        fecha_fin: p.fecha_fin,
                    });
                }
            } catch (err) {
                console.error("Error cargando datos para el formulario", err);
            }
        }
        loadData();
    }, [projectId, reset]);

    const handleCreateEntity = async () => {
        if (!newEntityName.trim()) return;
        setLoading(true);
        try {
            const res = await api.post("/entidades-aliadas/", { nombre: newEntityName });
            const created = res.data;
            setEntidades([...entidades, created]);
            setValue("entidad_aliada", created.id_entidad);
            setIsCreatingEntity(false);
            setNewEntityName("");
        } catch (err) {
            console.error("Error creando entidad aliada", err);
            alert("No se pudo crear la entidad aliada");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: ProjectFormValues) => {
        setLoading(true);
        const payload = {
            ...data,
            codigo_pi: data.codigo,
            apropiacion_definitiva: data.apropiacion_definitiva === "" || data.apropiacion_definitiva === undefined || data.apropiacion_definitiva === null ? null : Number(data.apropiacion_definitiva),
            adicion: data.adicion === "" || data.adicion === undefined || data.adicion === null ? null : Number(data.adicion)
        };
        try {
            if (projectId) {
                await api.patch(`/proyectos/${projectId}/`, payload);
            } else {
                await api.post("/proyectos/", payload);
            }
            router.push("/proyectos");
            router.refresh();
        } catch (err: unknown) {
            console.error("Error al guardar el proyecto", err);
            const axiosError = err as { response?: { data?: any } };
            const data = axiosError.response?.data;
            let message = "Error desconocido";

            if (data) {
                if (typeof data === 'string') {
                    message = data;
                } else if (data.detail) {
                    message = data.detail;
                } else if (typeof data === 'object') {
                    const firstError = Object.entries(data)[0];
                    if (firstError) {
                        const [field, msg] = firstError;
                        message = `${field}: ${Array.isArray(msg) ? msg[0] : msg}`;
                    }
                }
            }
            alert(`Error al guardar: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Básica */}
                <section className="space-y-4 md:col-span-2 pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Información General</h3>
                </section>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Código PI *</label>
                    <input
                        {...register("codigo")}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                        placeholder="Ej: 110234 (6 dígitos)"
                    />
                    {errors.codigo && <p className="text-xs text-red-500 font-medium">{errors.codigo.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nombre del Proyecto *</label>
                    <input
                        {...register("nombre")}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                        placeholder="Ej: Fortalecimiento de la Educación Inicial"
                    />
                    {errors.nombre && <p className="text-xs text-red-500 font-medium">{errors.nombre.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Línea Estratégica / Vigencia *</label>
                    <select
                        {...register("linea_vigencia", { valueAsNumber: true })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                    >
                        <option value="">Seleccione una opción estratégica...</option>
                        {lineas.map((lv) => (
                            <option key={lv.id_linea_vigencia} value={lv.id_linea_vigencia}>
                                {lv.linea_nombre} ({lv.vigencia_anio})
                            </option>
                        ))}
                    </select>
                    {errors.linea_vigencia && <p className="text-xs text-red-500 font-medium">{errors.linea_vigencia.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Estado Inicial *</label>
                    <select
                        {...register("estado")}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                    >
                        <option value="PLANEADO">PLANEADO</option>
                        <option value="EN_EJECUCION">EN_EJECUCION</option>
                        <option value="FINALIZADO">FINALIZADO</option>
                        <option value="SUSPENDIDO">SUSPENDIDO</option>
                    </select>
                </div>

                {/* Responsables */}
                <section className="space-y-4 md:col-span-2 pt-4 pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Responsables</h3>
                </section>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Responsable Principal *</label>
                    <select
                        {...register("responsable", { valueAsNumber: true })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                    >
                        <option value="">Seleccione responsable...</option>
                        {usuarios.map((u) => (
                            <option key={u.id_usuario} value={u.id_usuario}>{u.nombre} - {u.rol}</option>
                        ))}
                    </select>
                    {errors.responsable && <p className="text-xs text-red-500 font-medium">{errors.responsable.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Apoyo Técnico (Opcional)</label>
                    <select
                        {...register("apoyo_tecnico", {
                            setValueAs: v => (v === "" ? null : parseInt(v))
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                    >
                        <option value="">Ninguno / Seleccione...</option>
                        {usuarios.map((u) => (
                            <option key={u.id_usuario} value={u.id_usuario}>{u.nombre} - {u.rol}</option>
                        ))}
                    </select>
                    {errors.apoyo_tecnico && <p className="text-xs text-red-500 font-medium">{errors.apoyo_tecnico.message}</p>}
                </div>

                {/* Presupuesto y Planeación - Solo si NO es ESTRATEGIA */}
                {!isEstrategia && (
                    <>
                        <section className="space-y-4 md:col-span-2 pt-4 pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">Presupuesto y Planeación</h3>
                        </section>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Código BPIN *</label>
                            <input
                                {...register("codigo_bpin")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                                placeholder="Ej: 2024123456789 (13 dígitos)"
                                required={!isEstrategia}
                            />
                            {errors.codigo_bpin && <p className="text-xs text-red-500 font-medium">{errors.codigo_bpin.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Inversión Inicial *</label>
                            <input
                                type="number"
                                {...register("apropiacion_definitiva")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                                step="0.01"
                                placeholder="0.00"
                                required={!isEstrategia}
                            />
                            {errors.apropiacion_definitiva && <p className="text-xs text-red-500 font-medium">{errors.apropiacion_definitiva.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Adición Presupuestal (Opcional)</label>
                            <input
                                type="number"
                                {...register("adicion")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                                step="0.01"
                                placeholder="0.00"
                            />
                            {errors.adicion && <p className="text-xs text-red-500 font-medium">{errors.adicion.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Fuente de Recursos *</label>
                            <select
                                {...register("recursos")}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                                required={!isEstrategia}
                            >
                                <option value="">Seleccione fuente...</option>
                                <option value="POAI">POAI</option>
                                <option value="REGALIAS">REGALÍAS</option>
                                <option value="PROPIOS">RECURSOS PROPIOS</option>
                            </select>
                        </div>
                    </>
                )}
                {/* Campos específicos para ESTRATEGIA */}
                {isEstrategia && (
                    <div className="space-y-4 md:col-span-2 p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex flex-col md:flex-row md:items-end gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Entidad Aliada</label>
                                {!isCreatingEntity ? (
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value === "NEW") {
                                                setIsCreatingEntity(true);
                                            } else {
                                                setValue("entidad_aliada", e.target.value ? parseInt(e.target.value) : null);
                                            }
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all bg-white"
                                    >
                                        <option value="">Seleccione entidad...</option>
                                        {entidades.map((ent) => (
                                            <option key={ent.id_entidad} value={ent.id_entidad}>{ent.nombre}</option>
                                        ))}
                                        <option value="NEW" className="text-brand-blue font-bold">+ Registrar nueva entidad...</option>
                                    </select>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newEntityName}
                                            onChange={(e) => setNewEntityName(e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-lg border border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                            placeholder="Nombre de la nueva entidad"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCreateEntity}
                                            disabled={loading || !newEntityName.trim()}
                                            className="px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-brand-blue-dark disabled:opacity-50"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingEntity(false)}
                                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <section className="space-y-4 md:col-span-2 pt-4 pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Cronograma Estimado</h3>
                </section>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Fecha de Inicio Estimada *</label>
                    <input
                        type="date"
                        {...register("fecha_inicio")}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                    />
                    {errors.fecha_inicio && <p className="text-xs text-red-500 font-medium">{errors.fecha_inicio.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Fecha de Fin Estimada *</label>
                    <input
                        type="date"
                        {...register("fecha_fin")}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-900 bg-white"
                    />
                    {errors.fecha_fin && <p className="text-xs text-red-500 font-medium">{errors.fecha_fin.message}</p>}
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                    <X className="w-5 h-5" />
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-blue/20"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {projectId ? "Guardar Cambios" : "Registrar Proyecto"}
                </button>
            </div>
        </form>
    );
}
