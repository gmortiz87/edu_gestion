"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FolderKanban, TrendingUp, CheckCircle2 } from "lucide-react";

interface Proyecto {
  id_proyecto: number;
  codigo: string;
  nombre: string;
  linea_nombre: string;
  vigencia_anio: number;
  estado: string;
  avance_cargue_pct: number;
}

export default function Home() {
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Panel de Control: Proyectos</h2>
        <p className="text-slate-500">Resumen de ejecución y seguimiento estratégico</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Proyectos Totales" value={proyectos.length} icon={FolderKanban} color="bg-brand-blue" />
        <StatCard title="En Ejecución" value={proyectos.filter(p => p.estado === 'EN_EJECUCION').length} icon={TrendingUp} color="bg-amber-500" />
        <StatCard title="Finalizados" value={proyectos.filter(p => p.estado === 'FINALIZADO').length} icon={CheckCircle2} color="bg-emerald-500" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-700">Inventario de Proyectos Recientes</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-medium italic">
              Conectando con el servidor de la Gobernación...
            </div>
          ) : proyectos.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No hay proyectos registrados para el periodo actual.</div>
          ) : (
            proyectos.map((proyecto) => (
              <div key={proyecto.id_proyecto} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                      {proyecto.codigo}
                    </span>
                    <h4 className="font-bold text-slate-900">{proyecto.nombre}</h4>
                  </div>
                  <p className="text-sm text-slate-500">{proyecto.linea_nombre} • {proyecto.vigencia_anio}</p>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(proyecto.estado)}`}>
                    {proyecto.estado}
                  </span>
                  <div className="mt-2 w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-brand-blue h-full"
                      style={{ width: `${proyecto.avance_cargue_pct || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: React.ElementType, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`${color} p-3 rounded-xl text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(estado: string) {
  switch (estado) {
    case 'EN_EJECUCION': return 'bg-amber-100 text-amber-700';
    case 'FINALIZADO': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}
