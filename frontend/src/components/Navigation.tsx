import Link from "next/link";
import { LayoutDashboard, FolderKanban, GraduationCap, BarChart3, Users, X } from "lucide-react";

interface NavigationProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Navigation({ isOpen, onClose }: NavigationProps) {
    const links = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Proyectos", href: "/proyectos", icon: FolderKanban },
        { name: "Educación", href: "/educacion", icon: GraduationCap },
        { name: "Indicadores", href: "/indicadores", icon: BarChart3 },
        { name: "Usuarios", href: "/usuarios", icon: Users },
    ];

    return (
        <nav className={`
            fixed left-0 top-0 h-screen w-64 bg-brand-blue-dark text-white p-4 z-50 
            transition-transform duration-300 ease-in-out md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
            <div className="flex items-center justify-between mb-10 px-2 pt-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-red rounded-sm flex items-center justify-center font-bold text-white">P</div>
                    <span className="text-xl font-bold tracking-tight">EDU_GESTION</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
                    >
                        <X className="w-5 h-5 text-slate-300" />
                    </button>
                )}
            </div>

            <div className="space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                        <link.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        <span className="font-medium">{link.name}</span>
                    </Link>
                ))}
            </div>

            <div className="absolute bottom-8 left-4 right-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Gobernación del</p>
                    <p className="text-sm font-bold">Valle del Cauca</p>
                </div>
            </div>
        </nav>
    );
}
